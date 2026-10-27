// Dev-only prepared-study generator (issue #14). Never import this from server.ts or
// apps/. It runs the production NebiusProvider and research pipeline stages (pipeline.ts)
// on each stored paper in docs/research/papers/ that has no study yet, then writes
// apps/web/src/research/studies/data/<slug>.ts and its card in cards.ts, always with
// reviewed: false. Only Tymee's content review sets reviewed.
//
//   npm run generate:studies                       plan batches, generate, log
//   npm run generate:studies -- plan               print the batch plan only
//   npm run generate:studies -- log                rewrite GENERATED_STUDIES.md only
//   npm run generate:studies -- remove --papers x  drop generated studies for x
// Options: --papers stephens,mcnabb (file prefixes)  --budget 8 (USD)  --concurrency 3
// Raw model outputs are cached in the git-ignored .eval/prepared/, so a rerun only
// calls the API for calls it has not made. Token use and cost print as it runs.
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";
import { PDFParse } from "pdf-parse";
import { z } from "zod";
import {
  lessonSchema,
  verifyLesson,
  type Job,
  type Lesson,
  type PageText,
} from "../apps/api/src/research/contracts.js";
import { extractPdf } from "../apps/api/src/research/pdf.js";
import {
  newJob,
  READY_STAGE,
  runStage,
  STAGES,
} from "../apps/api/src/research/pipeline.js";
import {
  NebiusProvider,
  type ModelProvider,
} from "../apps/api/src/research/provider.js";
import { nebiusConfig } from "../apps/api/src/nebius-config.js";
import { studyCards } from "../apps/web/src/research/studies/cards.js";
import type {
  DesignGroup,
  PreparedStudy,
  StudyCard,
  StudyTopic,
} from "../apps/web/src/research/studies/types.js";
import {
  bannedTeaserPhrases,
  firstAuthorSurname,
  studyProblems,
  type PaperPage,
} from "./prepared-study-checks.js";

const ROOT = process.cwd();
const PAPERS = join(ROOT, "docs/research/papers");
const STUDIES = join(ROOT, "apps/web/src/research/studies");
const OUT = join(ROOT, ".eval/prepared");
const LOG = join(ROOT, "docs/research/GENERATED_STUDIES.md");
// docs/research/NEMOTRON_EVALUATION.md: Super with thinking on, at most about two
// pages (15,000 characters) per evidence call.
const MODEL = "nvidia/nemotron-3-super-120b-a12b";
const WINDOW_CHARS = 15000;
const MAX_REFS = 30;
const TIMEOUT_MS = Number(process.env.EVAL_TIMEOUT_MS) || 300000;

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    papers: { type: "string" },
    budget: { type: "string", default: "8" },
    concurrency: { type: "string", default: "3" },
    round: { type: "string", default: "1" },
  },
});
const command = positionals[0] ?? "run";
const round = Number(opts.round);

// ---------- sources: README provenance and the screening table ----------

type Paper = {
  file: string;
  doi: string;
  title: string;
  authors: string;
  journal: string;
  group: DesignGroup;
  topic: StudyTopic;
  retrieved: string;
};
const groupKeys: Record<string, DesignGroup> = {
  "Randomised between-subjects experiment": "between",
  "Within-subjects / repeated measures": "within",
  Replication: "replication",
  "Cross-sectional correlational": "correlational",
  "Longitudinal / cohort": "longitudinal",
  "Classroom, field or quasi-experiment": "classroom",
  "Null or equivalence result": "null",
};
const topicKeys: Record<string, StudyTopic> = {
  "School and academic performance": "school",
  "Learning, memory and cognition": "cognition",
  "Health and the body": "health",
  "Wellbeing and family": "wellbeing",
  "Social behaviour, beliefs and politics": "social",
  "Media and technology": "media",
  "Environment, transport, work and money": "environment",
};

function readPapers(): Paper[] {
  const readme = readFileSync(join(PAPERS, "README.md"), "utf8");
  const screening = readFileSync(
    join(ROOT, "docs/research/PAPER_SCREENING.md"),
    "utf8",
  );
  const rows = new Map<string, { group: DesignGroup; topic: StudyTopic }>();
  for (const line of screening.split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    const file = /^`(.+\.pdf)`$/.exec(cells[1] ?? "")?.[1];
    if (!file) continue;
    const group = groupKeys[cells[3]!];
    const topic = topicKeys[cells[4]!];
    if (!group || !topic) throw Error(`Unknown group or topic for ${file}.`);
    rows.set(file, { group, topic });
  }
  return [...readme.matchAll(/^### (\S+\.pdf)/gm)].map(([, file]) => {
    const start = readme.indexOf(`### ${file}`);
    const next = readme.indexOf("\n### ", start + 4);
    const section = readme.slice(start, next === -1 ? undefined : next);
    const work = /\*\*Work:\*\* ([\s\S]*?)(?:\n- \*\*|\n\n)/
      .exec(section)![1]!
      .replace(/\s+/g, " ");
    const m =
      /^(.*?\(\d{4}\)), "(.+?)", _(.+?)_ (.*?)\.? doi:\s*(10\.\S+?)\.?$/.exec(
        work,
      );
    if (!m) throw Error(`Cannot read the Work line for ${file}.`);
    const row = rows.get(file!);
    if (!row)
      throw Error(
        `${file} has no row in "Stored papers by design group and topic".`,
      );
    return {
      file: file!,
      retrieved:
        /\*\*Retrieved:\*\* (\d{4}-\d{2}-\d{2})/.exec(section)?.[1] ?? "",
      authors: m[1]!,
      title: m[2]!,
      journal: `${m[3]} ${m[4]}`.trim(),
      doi: m[5]!,
      ...row,
    };
  });
}

/** DOIs that already have a lesson body, authored or generated. */
function existingDois() {
  const dir = join(STUDIES, "data");
  return new Set(
    readdirSync(dir).flatMap((f) =>
      [
        ...readFileSync(join(dir, f), "utf8").matchAll(
          /https:\/\/doi\.org\/(10\.[^"]+)/g,
        ),
      ].map((m) => m[1]!.toLowerCase()),
    ),
  );
}

// ---------- capture what NebiusProvider does not return ----------

type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  prompt_tokens_details?: { cached_tokens?: number } | null;
};
type Call = {
  ms: number;
  status?: number;
  finish?: string;
  usage?: Usage;
  content?: string;
  error?: string;
};
const calls = new AsyncLocalStorage<Call[]>();
const baseFetch = globalThis.fetch;
// Same two harness settings as scripts/eval-nemotron.ts, without changing provider.ts:
// Nebius rejects the `propertyNames` key z.toJSONSchema emits for z.record, so it is
// dropped from the request only (the response is still validated with the real
// schema), and the production 20 s abort is replaced because Super with thinking on
// often needs longer.
globalThis.fetch = async (input, init) => {
  const log = calls.getStore();
  if (!log) return baseFetch(input, init);
  const body = JSON.stringify(
    JSON.parse(String(init?.body ?? "{}"), (k, v) =>
      k === "propertyNames" ? undefined : v,
    ),
  );
  const call: Call = { ms: 0 };
  log.push(call);
  const start = performance.now();
  try {
    const res = await baseFetch(input, {
      ...init,
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await res.text();
    call.ms = Math.round(performance.now() - start);
    call.status = res.status;
    if (!res.ok) call.error = text.slice(0, 300);
    try {
      const json = JSON.parse(text);
      call.finish = json.choices?.[0]?.finish_reason;
      call.usage = json.usage;
      call.content = json.choices?.[0]?.message?.content;
    } catch {}
    return new Response(text, {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    call.ms = Math.round(performance.now() - start);
    call.error = e instanceof Error ? e.name : String(e);
    throw e;
  }
};

type Price = { prompt: number; cached: number; completion: number };
let price: Price = { prompt: 0, cached: 0, completion: 0 };
async function loadPrice() {
  const { baseUrl } = nebiusConfig();
  const res = await baseFetch(`${baseUrl}/models?verbose=true`, {
    headers: { Authorization: `Bearer ${process.env.NEBIUS_API_KEY}` },
  });
  if (!res.ok) throw Error(`Could not read model pricing (${res.status}).`);
  const { data } = (await res.json()) as {
    data: { id: string; pricing?: Record<string, string> }[];
  };
  const p = data.find((m) => m.id === MODEL)?.pricing;
  if (!p) throw Error(`${MODEL} is not available to this key.`);
  price = {
    prompt: Number(p.prompt ?? 0),
    cached: Number(p.input_cache_read ?? p.prompt ?? 0),
    completion: Number(p.completion ?? 0),
  };
}
const cost = (u?: Usage) => {
  if (!u) return 0;
  const cached = u.prompt_tokens_details?.cached_tokens ?? 0;
  return (
    (u.prompt_tokens - cached) * price.prompt +
    cached * price.cached +
    u.completion_tokens * price.completion
  );
};
const spend = { usd: 0, prompt: 0, completion: 0, calls: 0, cached: 0 };

// ---------- cached provider: one file per distinct model call ----------

// Reviewers answered "schema not provided" although the request carries it as the
// response format, so the script names the three fields. pipeline.ts is unchanged.
const reviewers = ["Research Methods Reviewer", "Learning Coach"];
const reviewFormat = `Respond with a JSON object: approved (true when the lesson is acceptable), issues (a list of concrete problems with this lesson, empty when approved) and summary (one or two sentences). The response format is supplied with this request; do not report it as missing.`;

/**
 * The prepared-study player's authoring rules (scripts/prepared-study-checks.ts),
 * added to the Lesson Architect task by this script. pipeline.ts is unchanged.
 */
const playerRules = `Prepared-study rules: cite evidence only by the exact evidence ids supplied (such as e1), in refs and in scene provenance; each challenge cites the excerpts that state its facts. Return lesson.evidence as an empty list: the server copies the supplied excerpts. A multiple-type challenge has at least two accepted options; with one correct option use type=single. Every option that is not accepted has a misconception note keyed by its option id. Consecutive challenges never use the same scene kind. Never name the authors in the briefing. Order the challenges by stage: first reveal=design challenges answerable from the method alone (no results in their prompt, options, hints or evidence), then reveal=results challenges, then at least one reveal=interpretation challenge on meaning or limits. Each challenge's evidence field holds one to three short plain-language lines giving the learner the facts needed to answer at that stage (results challenges state the reported values); never evidence ids. Every challenge has a hint that points to the reasoning without stating the answer. Every fact in an accepted answer, explanation, misconception note or evidence line must be stated in an excerpt that challenge lists in refs; cite the results excerpts for results challenges. Write 5 to 8 required challenges that ask the learner to make research decisions (what this design can and cannot show, fair comparisons, alternative explanations, what a result means, where a claim overreaches), not to recall facts; evidence lines give the facts, and options must not repeat an evidence line.`;

const read = <T>(path: string) => JSON.parse(readFileSync(path, "utf8")) as T;
function write(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

type Cached =
  | { ok: true; value: unknown; calls: Call[] }
  | { ok: false; error: string; calls: Call[] };
/**
 * Wraps the production NebiusProvider. Results (and failures) are cached by the full
 * request, so reruns are free and deterministic. `feedback` is appended to the task of
 * the Lesson Architect and the card writer on a regeneration; the pipeline's own
 * prompts are unchanged.
 */
class CachedProvider implements ModelProvider {
  constructor(
    private feedback: string,
    private trail: Call[],
    private bill: { usd: number },
  ) {}
  async generate<T>(
    role: string,
    task: string,
    input: unknown,
    schema: z.ZodType<T>,
  ): Promise<T> {
    let full =
      role === "Lesson Architect"
        ? `${task}\n${playerRules}`
        : reviewers.includes(role)
          ? `${task}\n${reviewFormat}`
          : task;
    if (
      this.feedback &&
      ["Lesson Architect", "Study Card Writer"].includes(role)
    )
      full += `\nA previous attempt failed these checks; avoid them: ${this.feedback}`;
    const key = createHash("sha256")
      .update(
        JSON.stringify([
          MODEL,
          role,
          full,
          input,
          z.toJSONSchema(schema),
          // A later --round samples fresh outputs instead of replaying the cache.
          ...(round > 1 ? [round] : []),
        ]),
      )
      .digest("hex")
      .slice(0, 24);
    const path = join(OUT, "calls", `${key}.json`);
    let hit: Cached;
    if (existsSync(path)) {
      hit = read<Cached>(path);
      spend.cached++;
    } else {
      const log: Call[] = [];
      hit = await calls.run(log, async () => {
        try {
          const value = await new NebiusProvider().generate(
            role,
            full,
            input,
            schema,
          );
          return { ok: true as const, value, calls: log };
        } catch (e) {
          return {
            ok: false as const,
            error: e instanceof Error ? e.message : String(e),
            calls: log,
          };
        }
      });
      for (const c of hit.calls) {
        this.bill.usd += cost(c.usage);
        spend.usd += cost(c.usage);
        spend.prompt += c.usage?.prompt_tokens ?? 0;
        spend.completion += c.usage?.completion_tokens ?? 0;
        spend.calls++;
      }
      write(path, hit);
    }
    this.trail.push(...hit.calls);
    if (!hit.ok) {
      const error = Error(hit.error);
      (error as Error & { raw?: string }).raw = hit.calls.at(-1)?.content;
      throw error;
    }
    return schema.parse(hit.value);
  }
}

// ---------- one paper ----------

type Attempt = {
  failures: string[];
  fixes: string[];
  windows: number;
  refs: number;
};
type Result = {
  file: string;
  status: "passed" | "skipped";
  slug?: string;
  model: string;
  date: string;
  attempts: Attempt[];
  costUsd: number;
};

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
/** Local calendar date, so records match the day the run happened. */
const today = () => new Date().toLocaleDateString("en-CA");

/** Pages up to and including the reference-list heading; references are not evidence. */
function bodyPages(pages: PageText[]) {
  const at = pages.findIndex((p) =>
    /\n\s*(References|REFERENCES|Literature Cited|Bibliography)\s*\n/.test(
      `\n${p.text}\n`,
    ),
  );
  return at > 0 ? pages.slice(0, at + 1) : pages;
}

/**
 * Guard 3 from NEMOTRON_EVALUATION.md: a model excerpt that differs from the page only
 * in typography, spacing, hyphenation or case is replaced by the exact source text,
 * searched on its cited page first and then the rest of the window.
 */
function snap(
  ref: NonNullable<Job["evidence"]>["refs"][number],
  pages: PageText[],
) {
  const loose = (text: string) => {
    const out: string[] = [];
    const at: number[] = [];
    [...text].forEach((ch, i) => {
      const n = ch
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[‘’‛`´′]/g, "'")
        .replace(/[“”„″]/g, '"')
        .replace(/[\s\u00ad‐‑‒–—―−-]/g, "");
      for (const c of n) {
        out.push(c);
        at.push(i);
      }
    });
    return { text: out.join(""), at };
  };
  const want = loose(ref.excerpt).text;
  if (want.length < 12) return null;
  const ordered = [
    ...pages.filter((p) => p.page === ref.page),
    ...pages.filter((p) => p.page !== ref.page),
  ];
  for (const page of ordered) {
    const source = loose(page.text);
    const start = source.text.indexOf(want);
    if (start === -1) continue;
    const from = source.at[start]!;
    const to = source.at[start + want.length - 1]! + 1;
    const excerpt = [...page.text].slice(from, to).join("");
    if (excerpt.length > 1200) return null;
    return { ...ref, page: page.page, excerpt };
  }
  return null;
}

/** Consecutive pages up to WINDOW_CHARS each, for stage-0 evidence calls. */
function windows(pages: PageText[]) {
  const out: PageText[][] = [];
  let current: PageText[] = [];
  for (const page of pages) {
    const size = [...current, page].reduce((n, p) => n + p.text.length, 0);
    if (current.length && (current.length >= 2 || size > WINDOW_CHARS)) {
      out.push(current);
      current = [];
    }
    current.push(page);
  }
  if (current.length) out.push(current);
  return out;
}

const cardTask = `Write the library card for a prepared research-methods study that hides the paper's identity until the end. Return:
- teaser: 2 to 5 plain words naming the everyday situation studied, such as "Texting in class" or "Breakfast and grades". No author names, no paper title wording, no findings, and never the name of an effect, theory or research line (for example ${bannedTeaserPhrases.slice(0, 12).join(", ")}).
- question: one plain-language question the study asks, under 110 characters, without its answer or author names.
- takeaway: two or three sentences, under 450 characters, on what the study found and the main limit on that conclusion. Use only the supplied findings, explanations and limitations; add no new numbers.
- minutes: estimated minutes to play the challenges, an integer from 5 to 15.`;
const cardSchema = z.object({
  teaser: z.string().min(3).max(60),
  question: z.string().min(10).max(160),
  takeaway: z.string().min(40).max(700),
  minutes: z.number().int(),
});

function slugFor(
  teaser: string,
  surname: string,
  taken: Set<string>,
  group: string,
) {
  const base =
    teaser
      .normalize("NFKD")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .split("-")
      .filter((w) => w !== surname.toLowerCase())
      .slice(0, 5)
      .join("-") || "study";
  for (const candidate of [base, `${base}-${group}`, `${base}-2`, `${base}-3`])
    if (!taken.has(candidate)) return candidate;
  throw Error(`No free slug for "${teaser}".`);
}

async function pdfPages(file: string): Promise<PaperPage[]> {
  const parser = new PDFParse({
    data: new Uint8Array(readFileSync(join(PAPERS, file))),
  });
  try {
    return (await parser.getText()).pages.map((p) => ({
      num: p.num,
      text: p.text,
    }));
  } finally {
    await parser.destroy();
  }
}

/**
 * Guard 4 from NEMOTRON_EVALUATION.md, applied in this script: models cite stage-0
 * evidence as "/e2", "E2" or JSON pointers and often return an empty
 * lesson.evidence. References are normalised to stage-0 ids, unresolvable ones are
 * dropped, and lesson.evidence is copied from the verified stage-0 excerpts the
 * lesson cites. A scene that still fails validation is removed so the challenge
 * plays as plain choices, as the player does for any invalid scene.
 */
function repairReferences(
  lesson: Lesson,
  evidence: NonNullable<Job["evidence"]>["refs"],
  pages: PageText[],
  fixes: string[],
): Lesson {
  const ids = new Map(evidence.map((r) => [r.id, r]));
  const resolve = (ref: string) => {
    const n = /^\/*(?:e|ref|evidence)[\s_-]?(\d+)$/i.exec(ref.trim())?.[1];
    return n && ids.has(`e${n}`) ? `e${n}` : null;
  };
  let changed = 0;
  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => {
        if (k === "refs" && Array.isArray(v)) {
          const next = [
            ...new Set(
              v.map((r) => resolve(String(r))).filter((r) => r !== null),
            ),
          ];
          if (next.length !== v.length || next.some((r, i) => r !== v[i]))
            changed++;
          return [k, next];
        }
        return [k, walk(v)];
      }),
    );
  };
  let next = walk(lesson) as Lesson;
  if (changed)
    fixes.push(`normalised ${changed} reference list(s) to stage-0 ids`);
  // Reviewers judge claims against the lesson's evidence, so it carries every
  // verified stage-0 excerpt, not only the ones the model cited.
  next = { ...next, evidence };
  fixes.push(
    `lesson evidence copied from all ${evidence.length} stage-0 excerpt(s)`,
  );
  // Models put misconception notes in alternatives as [optionId, note] pairs.
  let moved = 0;
  const fixGuide = <C extends Lesson["challenges"][number]>(c: C): C => {
    const options = new Set(c.options.map((o) => o.id));
    const misconceptions = { ...c.misconceptions };
    const alternatives = c.alternatives.filter((alt) => {
      if (alt.every((id) => options.has(id))) return true;
      const [id, ...note] = alt;
      if (id && options.has(id) && note.length && !misconceptions[id])
        misconceptions[id] = note.join(" ");
      moved++;
      return false;
    });
    return { ...c, alternatives, misconceptions };
  };
  next = {
    ...next,
    challenges: next.challenges.map(fixGuide),
    bonus: next.bonus && fixGuide(next.bonus),
  };
  if (moved)
    fixes.push(
      `moved ${moved} misconception note(s) out of alternatives, or dropped alternatives naming no option`,
    );
  const challengeProblems = (l: Lesson, id: string) =>
    verifyLesson(l, pages).filter((p) => p.startsWith(`${id}:`)).length;
  for (const key of ["challenges", "bonus"] as const) {
    const list =
      key === "bonus" ? (next.bonus ? [next.bonus] : []) : next.challenges;
    for (const c of list) {
      if (!c.scene) continue;
      const without = { ...c, scene: null };
      const swap = (l: Lesson, replacement: typeof c): Lesson =>
        key === "bonus"
          ? { ...l, bonus: replacement }
          : {
              ...l,
              challenges: l.challenges.map((x) =>
                x.id === c.id ? replacement : x,
              ),
            };
      if (
        challengeProblems(swap(next, without), c.id) <
        challengeProblems(next, c.id)
      ) {
        next = swap(next, without);
        fixes.push(`removed an invalid ${c.scene.kind} scene from ${c.id}`);
      }
    }
  }
  return next;
}

async function attempt(
  paper: Paper,
  feedback: string,
  taken: Set<string>,
  trail: Call[],
  bill: { usd: number },
): Promise<{ study?: PreparedStudy; attempt: Attempt }> {
  const provider = new CachedProvider(feedback, trail, bill);
  const failures: string[] = [];
  const fixes: string[] = [];
  const id = `prepared-${paper.file.replace(/\.pdf$/, "")}`;
  const bytes = readFileSync(join(PAPERS, paper.file));
  const pages = bodyPages(
    await extractPdf(
      new File([bytes], paper.file, { type: "application/pdf" }),
    ),
  );
  const parts = windows(pages);

  // Stage 0 over windows. Excerpts are snapped to the source text (guard 3); any
  // that still do not match a page of their window are dropped.
  const perWindow: Job["evidence"][] = [];
  for (const [i, part] of parts.entries()) {
    const after = await runStage(
      newJob(`${id}-w${i + 1}`, paper.file, part),
      provider,
    );
    if (!after.evidence) {
      // One failed window costs its excerpts, not the study; the gate still needs three.
      fixes.push(`evidence window ${i + 1} returned nothing: ${after.error}`);
      continue;
    }
    let snapped = 0;
    const kept = after.evidence.refs.flatMap((r) => {
      if (
        part.some(
          (p) => p.page === r.page && norm(p.text).includes(norm(r.excerpt)),
        )
      )
        return [r];
      const hit = snap(r, part);
      if (hit) snapped++;
      return hit ? [hit] : [];
    });
    if (snapped)
      fixes.push(
        `snapped ${snapped} near-miss excerpt(s) to the source text in window ${i + 1}`,
      );
    if (kept.length < after.evidence.refs.length)
      fixes.push(
        `dropped ${after.evidence.refs.length - kept.length} unmatched excerpt(s) from window ${i + 1}`,
      );
    perWindow.push({ ...after.evidence, refs: kept });
  }
  // Round-robin across windows so every section of the paper stays represented.
  const refs: NonNullable<Job["evidence"]>["refs"] = [];
  for (let round = 0; refs.length < MAX_REFS; round++) {
    const batch = perWindow.flatMap((w) =>
      w!.refs[round] ? [w!.refs[round]!] : [],
    );
    if (!batch.length) break;
    refs.push(...batch.slice(0, MAX_REFS - refs.length));
  }
  refs.forEach((r, i) => (r.id = `e${i + 1}`));
  const result: Attempt = {
    failures,
    fixes,
    windows: parts.length,
    refs: refs.length,
  };
  if (refs.length < 3) {
    failures.push(`only ${refs.length} exact excerpts from stage 0`);
    return { attempt: result };
  }
  fixes.push(
    `stage 0 ran over ${parts.length} page window(s); ids renumbered e1–e${refs.length}`,
  );
  // Stages 1–4 see page 1 (it carries the DOI verifyLesson checks) and the pages that
  // hold evidence, which keeps long papers inside the 12,000-token output limit.
  const evidencePages = new Set([pages[0]!.page, ...refs.map((r) => r.page)]);
  const lessonPages = pages.filter((p) => evidencePages.has(p.page));
  if (lessonPages.length < pages.length)
    fixes.push(
      `stages 1–4 read ${lessonPages.length} of ${pages.length} pages`,
    );
  const evidence = {
    findings: perWindow.map((w) => w!.findings).join(" "),
    refs,
    missing: [],
  };

  // Stage 1 lesson.
  let job: Job = await runStage(
    { ...newJob(id, paper.file, lessonPages), evidence, stage: 1 },
    provider,
  );
  if (job.status === "failed") {
    // The lesson schema asks paper.url only for an "https://" prefix, so models answer
    // "https://" and zod rejects the whole lesson (NEMOTRON_EVALUATION.md break 2).
    const raw = trail.at(-1)?.content;
    let repaired: Lesson | null = null;
    if (raw && /schema/.test(job.error ?? ""))
      try {
        const json = JSON.parse(raw);
        const parsed = lessonSchema.safeParse({
          ...json,
          paper: { ...json.paper, url: null },
        });
        if (parsed.success) repaired = parsed.data;
      } catch {}
    if (!repaired) {
      failures.push(`lesson: ${job.error}`);
      return { attempt: result };
    }
    fixes.push("lesson re-read with paper.url null (schema url shim)");
    job = {
      ...job,
      lesson: { ...repaired, id, source: "generated" },
      stage: STAGES.terms,
      status: "pending",
      error: undefined,
    };
  }
  // Provenance comes from papers/README.md, not from the model.
  job.lesson = {
    ...job.lesson!,
    paper: {
      ...job.lesson!.paper,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      url: `https://doi.org/${paper.doi}`,
    },
  };
  fixes.push("paper title, authors, journal and DOI set from papers/README.md");
  job.lesson = repairReferences(job.lesson, refs, lessonPages, fixes);

  // Terms, methods review, learning coach, deterministic verification.
  while (job.stage < READY_STAGE && job.status === "pending")
    job = await runStage(job, provider);
  if (job.status !== "ready") {
    failures.push(`${job.audits[job.stage]?.role ?? "pipeline"}: ${job.error}`);
    return { attempt: result };
  }
  const lesson = job.lesson!;

  let card: z.infer<typeof cardSchema>;
  try {
    card = await provider.generate(
      "Study Card Writer",
      cardTask,
      {
        designGroup: paper.group,
        briefing: lesson.briefing,
        challenges: lesson.challenges.map((c) => ({
          title: c.title,
          prompt: c.prompt,
          explanation: c.explanation,
        })),
        findings: evidence.findings,
        limitations: lesson.paper.limitations,
      },
      cardSchema,
    );
  } catch (e) {
    failures.push(`card: ${e instanceof Error ? e.message : e}`);
    return { attempt: result };
  }
  const minutes = Math.min(15, Math.max(5, card.minutes));
  if (minutes !== card.minutes)
    fixes.push(`minutes clamped ${card.minutes} → ${minutes}`);
  const surname = firstAuthorSurname(paper.authors);
  const slug = slugFor(card.teaser, surname, taken, paper.group);
  // Reserved now so concurrent papers cannot pick the same slug; released on failure.
  taken.add(slug);
  const study: PreparedStudy = {
    slug,
    teaser: card.teaser,
    question: card.question,
    group: paper.group,
    topic: paper.topic,
    minutes,
    reviewed: false,
    takeaway: card.takeaway,
    lesson: {
      ...lesson,
      id: `prepared-${slug}`,
      challenges: lesson.challenges.map((c) => ({
        ...c,
        scene: c.scene ?? null,
      })),
      bonus: lesson.bonus && {
        ...lesson.bonus,
        scene: lesson.bonus.scene ?? null,
      },
    },
  };
  failures.push(...studyProblems(study, await pdfPages(paper.file)));
  if (failures.length) taken.delete(slug);
  return failures.length ? { attempt: result } : { study, attempt: result };
}

async function generate(
  paper: Paper,
  taken: Set<string>,
  previous?: Result,
): Promise<Result> {
  const trail: Call[] = [];
  // Billed cost only: cached calls from an earlier run or attempt are not counted again.
  const bill = { usd: 0 };
  // Earlier rounds stay in the record; a new round starts from their last failures.
  const attempts: Attempt[] = [...(previous?.attempts ?? [])];
  let study: PreparedStudy | undefined;
  for (let n = 0; n < 2 && !study; n++) {
    const feedback = attempts.at(-1)?.failures.join("; ").slice(0, 1500) ?? "";
    try {
      const r = await attempt(paper, feedback, taken, trail, bill);
      attempts.push(r.attempt);
      study = r.study;
    } catch (e) {
      attempts.push({
        failures: [e instanceof Error ? e.message : String(e)],
        fixes: [],
        windows: 0,
        refs: 0,
      });
    }
  }
  const costUsd = (previous?.costUsd ?? 0) + bill.usd;
  const base = {
    file: paper.file,
    model: MODEL,
    date: today(),
    attempts,
    costUsd,
  };
  if (!study) return { ...base, status: "skipped" };
  writeStudy(study, paper);
  return { ...base, status: "passed", slug: study.slug };
}

// ---------- output files ----------

function prettier(...files: string[]) {
  execFileSync(
    join(ROOT, "node_modules/.bin/prettier"),
    ["--write", ...files],
    {
      stdio: "ignore",
    },
  );
}

let cards: StudyCard[] = [...studyCards];
function writeStudy(study: PreparedStudy, paper: Paper) {
  const {
    slug,
    teaser,
    question,
    group,
    topic,
    minutes,
    reviewed,
    lesson,
    takeaway,
  } = study;
  const path = join(STUDIES, "data", `${slug}.ts`);
  writeFileSync(
    path,
    `// Generated by scripts/generate-prepared-studies.ts with ${MODEL} on
// ${today()} from docs/research/papers/${paper.file}.
// Do not hand-edit questions, answers or excerpts; regenerate instead. Not
// content-reviewed: see docs/research/GENERATED_STUDIES.md.
import type { StudyBody } from "../types.js";

export const body: StudyBody = ${JSON.stringify({ lesson, takeaway }, null, 2)};
`,
  );
  cards = [
    ...cards.filter((c) => c.slug !== slug),
    {
      slug,
      teaser,
      question,
      group,
      topic,
      minutes,
      reviewed,
      challenges: lesson.challenges.map((c) => c.id),
    },
  ];
  writeCards();
  prettier(path);
}

/** Non-school topics first, design groups interleaved; existing order is kept within a group. */
function ordered(list: StudyCard[]) {
  const groups = Object.values(groupKeys);
  const out: StudyCard[] = [];
  for (const school of [false, true]) {
    const queues = groups.map((g) =>
      list.filter((c) => c.group === g && (c.topic === "school") === school),
    );
    while (queues.some((q) => q.length))
      for (const q of queues) if (q.length) out.push(q.shift()!);
  }
  return out;
}

function writeCards() {
  const path = join(STUDIES, "cards.ts");
  const head = readFileSync(path, "utf8").split("export const studyCards")[0];
  writeFileSync(
    path,
    `${head}export const studyCards: StudyCard[] = ${JSON.stringify(ordered(cards), null, 2)};\n`,
  );
  prettier(path);
}

type State = Record<string, Result>;
const statePath = join(OUT, "state.json");
const loadState = (): State =>
  existsSync(statePath) ? read<State>(statePath) : {};

function writeLog(state: State, papers: Paper[]) {
  const results = papers
    .map((p) => state[p.file])
    .filter((r): r is Result => !!r);
  const passed = results.filter((r) => r.status === "passed").length;
  const rows = results.map((r) => {
    const last = r.attempts.at(-1);
    const failures = r.attempts
      .map((a, i) =>
        a.failures.length ? `#${i + 1}: ${a.failures.join("; ")}` : "",
      )
      .filter(Boolean)
      .join(" ");
    const fixes = [...new Set(r.attempts.flatMap((a) => a.fixes))].join("; ");
    const cell = (s: string) =>
      s.replace(/\|/g, "\\|").replace(/\s+/g, " ").slice(0, 600);
    return `| \`${r.file}\` | ${r.status} | ${r.slug ? `\`${r.slug}\`` : "–"} | ${r.model} | ${r.date} | ${r.attempts.length} | ${last ? last.refs : 0} | $${r.costUsd.toFixed(3)} | ${cell(failures) || "–"} | ${cell(fixes) || "–"} |`;
  });
  writeFileSync(
    LOG,
    `# Generated prepared studies

> Record for issue #14. Lessons for stored papers without an authored study were generated by \`scripts/generate-prepared-studies.ts\` through the production \`NebiusProvider\` and research pipeline stages. Nothing here is content-reviewed: every generated study has \`reviewed: false\` until Tymee approves it, and the library lists it with a not-reviewed note on its reveal. Rerun with \`npm run generate:studies\`; raw outputs stay in the git-ignored \`.eval/prepared/\`.

## How a study is generated

- **Model:** \`${MODEL}\` with thinking on, as recommended in [NEMOTRON_EVALUATION.md](NEMOTRON_EVALUATION.md).
- **Stage 0 (evidence):** the production prompt runs over windows of at most two pages (${WINDOW_CHARS.toLocaleString("en")} characters), the evaluation's maximum safe input. Pages after the reference-list heading are left out. An excerpt that differs from the page only in typography, spacing, hyphenation or case is replaced by the exact source text (guard 3 of the evaluation); excerpts that still do not match are dropped, the per-window \`missing\` lists are ignored because a window cannot hold the whole paper, and up to ${MAX_REFS} excerpts are kept across windows.
- **Stages 1–4:** the production lesson, methods-review, learning-coach and verification stages run with their prompts unchanged. Both reviews must approve and \`verifyLesson\` must pass. The script appends text to two tasks only: the prepared-study player's authoring rules to the Lesson Architect (stage order, readable evidence lines, hints, 5–8 decision challenges, facts only from cited excerpts, cite evidence by id), and the three response fields to both reviewers, which otherwise answered "schema not provided".
- **Reference repair (guard 4 of the evaluation):** after stage 1, references written as \`/e2\`, \`E2\` or JSON pointers are normalised to stage-0 ids, unresolvable ones are dropped, and \`lesson.evidence\` is replaced by all verified stage-0 excerpts. Misconception notes the model wrote into \`alternatives\` as \`[optionId, note]\` pairs are moved to \`misconceptions\`. A scene that still fails validation is removed, so that challenge plays as plain choices. This happens before the reviews, so they judge the repaired lesson. Stages 1–4 read page 1 and the pages holding evidence, which keeps long papers inside the 12,000-token output limit.
- **Card:** a separate script prompt (role "Study Card Writer") writes the teaser, question, takeaway and minutes. The teaser rule bans named effects and research lines.
- **Gate:** every check in \`scripts/prepared-study-checks.ts\`, the same functions \`tests/research/prepared-studies.test.ts\` runs: answer guides, author and research-line identity, scene validation, answer gating, no back-to-back scene kinds, stage order with at least five required challenges, a hint and readable evidence lines per challenge, no accepted answer copied from its evidence lines, and verbatim excerpts on the cited page of the stored PDF.
- **Regeneration:** a study that fails gets one more attempt with the failures appended to the lesson and card tasks. A second failure is skipped and logged. Skipped papers can be given later rounds (\`--round 2\` and up), each a fresh sample plus one retry; the Attempts column counts every attempt across rounds.
- **Harness settings, not product changes:** like the evaluation, \`propertyNames\` is stripped from request schemas (Nebius rejects it), the 20 s production timeout is replaced by ${TIMEOUT_MS / 1000} s, and a lesson rejected only for \`paper.url\` is re-read with \`url: null\`. Paper title, authors, journal and DOI are always set from [papers/README.md](papers/README.md).
- **Not changed:** pipeline prompts, contracts and scene kinds. Generated lessons use the shared contract's scene kinds, and the pipeline requires at least one valid scene per lesson.

Questions, answers, explanations and excerpts are model output and were not edited. Mechanical fixes are listed per study.

## Known limits

- **Passing is not correctness.** The gate checks structure, exact excerpts and the reviewers' approval. It cannot tell whether an accepted answer reads the paper correctly. The evaluation found this "real numbers, wrong meaning" failure passes every code check. One instance found by reading a passed study: \`television-viewing-habits\` (Boch 2019) challenge c5 accepts that the younger, better-educated sample "may have underestimated" false beliefs, while the paper says incorrect answers might decrease in older samples, which points the other way. Content review must check every accepted answer against the paper.
- **Easy evidence.** Several results challenges paraphrase the answer in their own evidence lines. The gate rejects only verbatim copies.
- **Cost.** The Cost column covers every round since the record was reset. Development runs on 2026-10-25 before that reset (smoke tests on single papers, and a first full run stopped after batch 1 to fix systematic failures) spent at least $0.75 more.
- **Many papers needed several rounds.** The first round passed 17 of 45. Later rounds (\`--round 2\` to \`--round 12\`), each a fresh sample plus one retry, passed the rest; the Attempts column shows how many attempts each study took. A study that needed many attempts passed the same gate, but the model found it harder, so review it with extra care.
- **Stricter than the original gate.** Generated lessons also had to pass checks added for them: at least five challenges, stage order, a hint and readable evidence lines per challenge, and no accepted answer copied from its evidence lines.

## Results

${passed} of ${results.length} generated studies passed. Group and topic come from [PAPER_SCREENING.md](PAPER_SCREENING.md).

| Paper | Status | Slug | Model | Date | Attempts | Excerpts | Cost | Failures | Mechanical fixes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`,
  );
  prettier(LOG);
}

/**
 * Drops generated studies for the --papers prefixes (file, card and record), for
 * example after a paper is removed or the gate changes. Authored studies, which
 * lack the generated header, are never touched.
 */
function remove(state: State, papers: Paper[]) {
  const wanted = opts.papers?.split(",").map((w) => w.trim()) ?? [];
  if (!wanted.length) throw Error("Name the papers to remove with --papers.");
  const dir = join(STUDIES, "data");
  for (const file of readdirSync(dir)) {
    const source = readFileSync(join(dir, file), "utf8");
    const from = /from docs\/research\/papers\/(\S+?\.pdf)/.exec(source)?.[1];
    if (!source.startsWith("// Generated by") || !from) continue;
    if (!wanted.some((w) => from.startsWith(w))) continue;
    unlinkSync(join(dir, file));
    const slug = file.replace(/\.ts$/, "");
    cards = cards.filter((c) => c.slug !== slug);
    delete state[from];
    console.log(`removed ${slug} (${from})`);
  }
  writeCards();
  write(statePath, state);
  writeLog(state, papers);
}

// ---------- batches ----------

/** One paper per design group per batch, non-school topics first. */
function plan(papers: Paper[]) {
  const groups = Object.values(groupKeys);
  const queues = groups.map((g) =>
    papers
      .filter((p) => p.group === g)
      .sort(
        (a, b) => Number(a.topic === "school") - Number(b.topic === "school"),
      ),
  );
  const batches: Paper[][] = [];
  while (queues.some((q) => q.length))
    batches.push(queues.flatMap((q) => (q.length ? [q.shift()!] : [])));
  return batches;
}

async function main() {
  const all = readPapers();
  const state = loadState();
  if (command === "log") return writeLog(state, all);
  if (command === "remove") return remove(state, all);
  const have = existingDois();
  const wanted = opts.papers?.split(",").map((s) => s.trim()) ?? null;
  const todo = all.filter(
    (p) =>
      !have.has(p.doi.toLowerCase()) &&
      // A skipped paper is retried only when named with --papers.
      (wanted
        ? wanted.some((w) => p.file.startsWith(w))
        : state[p.file]?.status !== "skipped"),
  );
  // The 14 papers added for topic balance on 2026-10-24 go first.
  const fresh = (p: Paper) => p.retrieved === "2026-10-24";
  const batches = [
    ...plan(todo.filter(fresh)),
    ...plan(todo.filter((p) => !fresh(p))),
  ];
  for (const [i, b] of batches.entries())
    console.log(
      `batch ${i + 1}: ${b.map((p) => `${p.file} (${p.group}, ${p.topic})`).join(", ")}`,
    );
  if (command === "plan") return;
  if (!process.env.NEBIUS_API_KEY)
    throw Error("Set NEBIUS_API_KEY to generate studies.");
  process.env.NEBIUS_MODEL_ID = MODEL;
  await loadPrice();
  const budget = Number(opts.budget);
  const taken = new Set(cards.map((c) => c.slug));
  let failedInRow = 0;
  let worst = 0.08;
  for (const [i, batch] of batches.entries()) {
    if (spend.usd + worst > budget) {
      console.log(
        `Budget $${budget} reached after $${spend.usd.toFixed(3)}; stopping.`,
      );
      break;
    }
    const queue = [...batch];
    let passed = 0;
    await Promise.all(
      Array.from({ length: Number(opts.concurrency) }, async () => {
        for (let p = queue.shift(); p; p = queue.shift()) {
          if (spend.usd + worst > budget) {
            console.log(`Budget reached; ${p.file} not started.`);
            continue;
          }
          const r = await generate(p, taken, state[p.file]);
          worst = Math.max(worst, r.costUsd);
          state[p.file] = r;
          write(statePath, state);
          writeLog(state, all);
          if (r.status === "passed") passed++;
          console.log(
            `${p.file}: ${r.status}${r.slug ? ` → ${r.slug}` : ""} after ${r.attempts.length} attempt(s), $${r.costUsd.toFixed(3)} · total $${spend.usd.toFixed(3)}, ${spend.prompt} in / ${spend.completion} out tokens, ${spend.calls} calls (${spend.cached} cached)`,
          );
        }
      }),
    );
    failedInRow = passed ? 0 : failedInRow + 1;
    console.log(`batch ${i + 1}: ${passed} of ${batch.length} passed.`);
    if (failedInRow >= 3) {
      console.log("3 batches in a row produced no passing study; stopping.");
      break;
    }
  }
  console.log(
    `Spent $${spend.usd.toFixed(3)} on ${spend.calls} calls: ${spend.prompt} prompt and ${spend.completion} completion tokens.`,
  );
}

await main();
