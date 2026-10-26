import { z } from "zod";
import {
  numbersIn,
  projectScene,
  reportedSceneNumbers,
  responseStyles,
  sceneItems,
  sceneProblems,
  sceneSchema,
  tapKinds,
  tapTargets,
} from "@paperquest/contracts";
export const refSchema = z.object({
  id: z.string().min(1),
  page: z.number().int().positive(),
  excerpt: z.string().min(12).max(1200),
});
export const challengeSchema = z.object({
  id: z.string().min(1),
  stage: z.string(),
  title: z.string().min(1),
  type: z.enum(["single", "multiple"]),
  prompt: z.string().min(10),
  evidence: z.array(z.string()),
  scene: sceneSchema.nullable().optional(),
  // How the answer is collected. "tap" needs a scene whose elements are the options.
  responseStyle: z.enum(responseStyles).optional(),
  options: z
    .array(z.object({ id: z.string(), text: z.string().min(1) }))
    .min(2)
    .max(6),
  accepted: z.array(z.string()).min(1),
  alternatives: z.array(z.array(z.string())),
  hint: z.string(),
  misconceptions: z.record(z.string(), z.string()),
  explanation: z.string().min(10),
  refs: z.array(z.string()).min(1),
  writtenReasoning: z.boolean(),
  // "significance" is retained for the featured quantitative investigation.
  // "interpretation" also covers themes, arguments, and causal boundaries.
  reveal: z.enum([
    "design",
    "results",
    "significance",
    "interpretation",
    "bonus",
  ]),
});
const paperUrl = z
  .string()
  .url()
  .regex(/^https:\/\/[^/]+\.[^/]+/);
export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  briefing: z.string(),
  source: z.enum(["featured", "generated", "demo"]),
  paper: z.object({
    title: z.string(),
    authors: z.string(),
    journal: z.string(),
    // Models answer a bare "https://" or another unusable link for unknown
    // sources; that means unavailable metadata, so it becomes null rather
    // than failing the whole lesson. The wire schema keeps the host pattern.
    url: z.preprocess(
      (v) =>
        typeof v === "string" && !paperUrl.safeParse(v).success ? null : v,
      paperUrl.nullable(),
    ),
    limitations: z.array(z.string()),
  }),
  evidence: z.array(refSchema),
  challenges: z.array(challengeSchema).min(3).max(14),
  bonus: challengeSchema.nullable(),
});
/** Live drafting asks for fewer challenges than stored lessons may hold, so
 *  one lesson fits the output budget. */
export const MAX_GENERATED_CHALLENGES = 8;
export const generatedLessonSchema = lessonSchema.extend({
  title: z.string().min(1),
  briefing: z.string().min(1),
  challenges: z.array(challengeSchema).min(3).max(MAX_GENERATED_CHALLENGES),
});
export type Challenge = z.infer<typeof challengeSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Attempt = {
  reasoningRevisions?: { text: string; at: string }[];
  selected: string[];
  reasoning: string;
  correct: boolean;
  at: string;
  feedback: string;
};
export type LearningSession = {
  source?: Lesson["source"];
  id: string;
  lessonId: string;
  title: string;
  index: number;
  phase:
    "briefing" | "challenge" | "bonus-choice" | "bonus" | "reveal" | "complete";
  answers: Record<string, Attempt[]>;
  retrying: boolean;
  version: number;
  created: string;
  reflection: string;
  reviewIds: string[] | null;
  aiFeedback?: Record<
    string,
    {
      category: string;
      guidance: string;
      followup: string;
      refs: string[];
      model: string;
    }
  >;
};
export type PageText = {
  page: number;
  text: string;
  method?: "text" | "ocr";
  confidence?: number;
};
export type Audit = {
  role: string;
  task: string;
  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Needs Review"
    | "Failed"
    | "Retrying";
  summary: string;
  refs: string[];
  model: string;
  error?: string;
  /** Stable machine-readable failure code next to the human message. */
  errorCode?: "output_limit" | "timeout" | "not_applicable";
};
export type Job = {
  mode?: "demo" | "live";
  consented: boolean;
  id: string;
  name: string;
  pages: PageText[];
  stage: number;
  status: "pending" | "processing" | "failed" | "review" | "ready";
  audits: Audit[];
  evidence?: {
    findings: string;
    refs: z.infer<typeof refSchema>[];
    missing: string[];
  };
  lesson?: Lesson;
  review?: { approved: boolean; issues: string[]; summary: string };
  leaseUntil: number;
  error?: string;
  version: number;
  /** Automatic retries used by the current stage. */
  autoRetries?: number;
  /** Automatic redrafts used after the final check rejected a lesson. */
  autoRedrafts?: number;
};
/**
 * Canonical form for exact-excerpt checks. It removes PDF typography only:
 * ligatures, curly quotes, dash variants, soft hyphens and line-break
 * hyphenation ("expectan- cies"). Words must still match exactly, so a
 * paraphrase is still rejected.
 */
export function canonicalText(s: string) {
  return s
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201A\u201B\u2032`]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/[\u00AD\u2010-\u2015\u2212]/g, "-")
    .replace(/\s*-\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
export function excerptMatches(pageText: string, excerpt: string) {
  const target = canonicalText(excerpt);
  return target.length > 0 && canonicalText(pageText).includes(target);
}
/**
 * The excerpt's verified location, or null when it is not verbatim. Models
 * sometimes cite the wrong page, so an excerpt found on exactly one other
 * page is kept with that page.
 */
export function locateExcerpt<T extends { page: number; excerpt: string }>(
  pages: PageText[],
  r: T,
): T | null {
  if (pages.some((p) => p.page === r.page && excerptMatches(p.text, r.excerpt)))
    return r;
  const [only, ...more] = pages.filter((p) =>
    excerptMatches(p.text, r.excerpt),
  );
  return only && !more.length ? { ...r, page: only.page } : null;
}
/**
 * Whether a paper link appears in the document. A DOI is matched wherever it
 * sits in the link (doi.org, dx.doi.org or a publisher URL), ignoring case and
 * PDF line breaks; any other link must appear as written, minus its scheme.
 */
export function paperLinkSupported(url: string, pages: PageText[]) {
  const text = canonicalText(pages.map((p) => p.text).join(" ")).toLowerCase();
  const has = (s: string) => text.includes(canonicalText(s).toLowerCase());
  const doi = url.match(/10\.\d{4,9}\/[^\s?#]+/i)?.[0].replace(/[/.]+$/, "");
  if (!doi) return has(url.replace(/^https?:\/\//i, ""));
  // Publisher links append segments such as "/full" after the DOI.
  const parts = doi.split("/");
  for (let n = parts.length; n >= 2; n--)
    if (has(parts.slice(0, n).join("/"))) return true;
  return false;
}
export function verifyLesson(lesson: Lesson, pages: PageText[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const refs = new Set(lesson.evidence.map((r) => r.id));
  if (refs.size !== lesson.evidence.length)
    problems.push("Duplicate evidence identifiers.");
  if (lesson.paper.url && !paperLinkSupported(lesson.paper.url, pages))
    problems.push("The paper source link is not supported by the document.");
  for (const r of lesson.evidence) {
    const page = pages.find((p) => p.page === r.page);
    if (!page || !excerptMatches(page.text, r.excerpt))
      problems.push(
        `Evidence ${r.id} is not an exact excerpt from page ${r.page}.`,
      );
  }
  for (const c of [
    ...lesson.challenges,
    ...(lesson.bonus ? [lesson.bonus] : []),
  ]) {
    if (ids.has(c.id)) problems.push("Duplicate challenge identifier.");
    ids.add(c.id);
    const optionIds = new Set(c.options.map((o) => o.id));
    if (optionIds.size !== c.options.length)
      problems.push(`${c.id}: duplicate options.`);
    for (const answers of [c.accepted, ...c.alternatives]) {
      if (
        answers.length === 0 ||
        answers.some((a) => !optionIds.has(a)) ||
        new Set(answers).size !== answers.length ||
        (c.type === "single" && answers.length !== 1)
      )
        problems.push(`${c.id}: invalid answer guide.`);
    }
    if (c.refs.some((r) => !refs.has(r)))
      problems.push(`${c.id}: unknown evidence reference.`);
    if (c.scene) problems.push(...sceneFaults(c, lesson.evidence));
    problems.push(...responseStyleProblems(c));
    if (c.reveal === "bonus" && lesson.challenges.includes(c))
      problems.push(`${c.id}: bonus in required sequence.`);
  }
  if (lesson.source === "generated")
    problems.push(...sceneCoverageProblems(lesson));
  return problems;
}
/** Problems with a challenge's scene, checked against the lesson evidence. */
export function sceneFaults(c: Challenge, evidence: Lesson["evidence"]) {
  const problems: string[] = [];
  const parsed = sceneSchema.safeParse(c.scene);
  if (!parsed.success)
    problems.push(`${c.id}: malformed scene; retry lesson generation.`);
  else {
    problems.push(
      ...sceneProblems(
        parsed.data,
        c.options.map((o) => o.id),
        c.refs,
      ).map((issue) => `${c.id}: ${issue}.`),
    );
    if (
      parsed.data.kind === "comparison" &&
      parsed.data.values.some((v) => v.provenance.kind !== "reported")
    )
      problems.push(
        `${c.id}: comparison values must be reported source measurements.`,
      );
    for (const reported of reportedSceneNumbers(parsed.data)) {
      const numbers = numbersIn(
        evidence
          .filter((ref) => reported.refs.includes(ref.id))
          .map((ref) => ref.excerpt)
          .join(" "),
      );
      if (reported.values.some((value) => !numbers.includes(value)))
        problems.push(
          `${c.id}: reported scene value is not in its referenced evidence (${reported.id}).`,
        );
    }
    const setup = sceneItems(parsed.data).filter((item) => item.at === "setup");
    if (!setup.length)
      problems.push(`${c.id}: scene needs visible setup content.`);
  }
  return problems;
}
/** Fewest required challenges with a valid scene in a generated lesson. */
export const MIN_GENERATED_SCENES = 1;
/**
 * Generated lessons must be interactive: at least one required challenge carries
 * a scene that passes validation. `connections` fits any paper with evidence.
 */
export function sceneCoverageProblems(lesson: Lesson): string[] {
  const valid = lesson.challenges.filter((c) => {
    const parsed = sceneSchema.safeParse(c.scene);
    return (
      parsed.success &&
      !sceneProblems(
        parsed.data,
        c.options.map((o) => o.id),
        c.refs,
      ).length
    );
  }).length;
  return valid >= MIN_GENERATED_SCENES
    ? []
    : [
        `The lesson has ${valid} valid interactive scene${valid === 1 ? "" : "s"}; at least ${MIN_GENERATED_SCENES} required challenge needs one. A connections scene fits any paper with evidence.`,
      ];
}
/**
 * The player draws tap answers only when every option is one distinct element
 * visible before the first attempt, so the server accepts nothing less.
 */
export function responseStyleProblems(c: Challenge): string[] {
  if (c.responseStyle !== "tap") return [];
  const setup = projectScene(
    c.scene,
    false,
    false,
    c.options.map((o) => o.id),
    c.refs,
  );
  return tapTargets(setup)
    ? []
    : [
        `${c.id}: responseStyle tap needs a ${tapKinds.join(", ")} scene whose responses each target one distinct setup element.`,
      ];
}
