// Pure checks for prepared studies, shared by tests/research/prepared-studies.test.ts
// and the dev-only generator (scripts/generate-prepared-studies.ts) as its per-study
// gate. Each check returns problems; an empty list passes. Never import from apps/.
import { isEvidenceScene, sceneProblems } from "@paperquest/contracts";
import {
  journeyChallenges,
  tapTargets,
  visibleScene,
} from "../apps/web/src/research/studies/journey.js";
import type { PreparedStudy } from "../apps/web/src/research/studies/types.js";

export type PaperPage = { num: number; text: string };

/**
 * Named effects and research lines a learner could search to find the paper before
 * the reveal. Matched as words in the teaser, case-insensitive.
 */
export const bannedTeaserPhrases = [
  "power pose",
  "power posing",
  "death penalty",
  "capital punishment",
  "ego depletion",
  "ego-depletion",
  "stereotype threat",
  "self-affirmation",
  "placebo",
  "watching eyes",
  "asch",
  "priming",
  "mindset",
  "learning style",
  "learning styles",
  "retrieval practice",
  "testing effect",
  "production effect",
  "self-reference",
  "survival processing",
  "delay of gratification",
  "marshmallow",
  "nudge",
  "nudges",
  "earmarking",
  "facial feedback",
  "bystander",
  "replication",
  "approximate number system",
  "interleaving",
  "spacing effect",
];

export function bannedPhrasesIn(text: string) {
  return bannedTeaserPhrases.filter((phrase) =>
    new RegExp(`\\b${phrase.replace(/[-]/g, "[- ]")}\\b`, "i").test(text),
  );
}

/** Answer guides, ids and references, as the player and verifyLesson need them. */
export function answerGuideProblems(study: PreparedStudy) {
  const problems: string[] = [];
  const all = journeyChallenges(study, true);
  const refs = new Set(study.lesson.evidence.map((r) => r.id));
  if (study.lesson.challenges.length < 3)
    problems.push("fewer than 3 challenges");
  if (new Set(all.map((c) => c.id)).size !== all.length)
    problems.push("duplicate challenge ids");
  for (const c of all) {
    const ids = c.options.map((o) => o.id);
    if (new Set(ids).size !== ids.length)
      problems.push(`${c.id}: duplicate options`);
    if (!c.accepted.every((id) => ids.includes(id)))
      problems.push(`${c.id}: accepted answer is not an option`);
    if (c.type === "single" && c.accepted.length !== 1)
      problems.push(`${c.id}: single choice needs exactly one accepted answer`);
    if (c.type === "multiple" && c.accepted.length < 2)
      problems.push(
        `${c.id}: multiple choice needs at least two accepted answers`,
      );
    if (!c.refs.every((r) => refs.has(r)))
      problems.push(`${c.id}: unknown evidence reference`);
    for (const wrong of ids.filter((id) => !c.accepted.includes(id)))
      if (!c.misconceptions[wrong])
        problems.push(`${c.id}: option ${wrong} has no misconception note`);
  }
  return problems;
}

/**
 * First author's surname from "Given Surname, …" or "Surname, Surname & … (Year)".
 * Lower-case particles ("van der Weiden") belong to the surname.
 */
export function firstAuthorSurname(authors: string) {
  const first = authors.split(/,|&|\(| and /)[0]!.trim();
  const words = first.split(/\s+/);
  return /^[a-z]/.test(first) || words.length === 1 ? first : words.at(-1)!;
}

/**
 * Case-sensitive whole-word match. Short surnames that are also English words
 * ("An") are ignored where they open a sentence.
 */
export function namesSurname(text: string, surname: string) {
  const name = surname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const opener = surname.length <= 3 ? "(?<!^|[.!?]\\s)" : "";
  return new RegExp(`${opener}(?<!\\p{L})${name}(?!\\p{L})`, "u").test(text);
}

/** The first author's surname and named research lines stay out of pre-reveal text. */
export function identityProblems(study: PreparedStudy) {
  const problems: string[] = [];
  const surname = firstAuthorSurname(study.lesson.paper.authors);
  for (const [field, text] of [
    ["teaser", study.teaser],
    ["question", study.question],
    ["briefing", study.lesson.briefing],
  ] as const)
    if (surname && namesSurname(text, surname))
      problems.push(`${field} names the first author`);
  for (const phrase of bannedPhrasesIn(study.teaser))
    problems.push(`teaser names a known research line: "${phrase}"`);
  return problems;
}

/** Scene validation and response mappings, using the shared contract for every kind. */
export function sceneCheckProblems(study: PreparedStudy) {
  const problems: string[] = [];
  for (const c of journeyChallenges(study, true)) {
    if (!c.scene) continue;
    const options = c.options.map((o) => o.id);
    problems.push(
      ...sceneProblems(c.scene, options, c.refs).map(
        (issue) => `${c.id}: ${issue}`,
      ),
    );
    if (c.responseStyle === "tap" && !tapTargets(c.scene))
      problems.push(`${c.id}: tap response without one target per option`);
  }
  return problems;
}

/** Nothing that depends on an answer is visible before Check. */
export function gateProblems(study: PreparedStudy) {
  const problems: string[] = [];
  for (const c of journeyChallenges(study, true)) {
    const options = c.options.map((o) => o.id);
    const setup = visibleScene(c.scene, options, "answering");
    if (c.scene && !setup)
      problems.push(`${c.id}: scene falls back to choices`);
    if (setup?.resolution)
      problems.push(`${c.id}: resolution shown before Check`);
    if (setup?.kind === "comparison" && setup.difference)
      problems.push(`${c.id}: difference shown before Check`);
  }
  return problems;
}

/**
 * Consecutive challenges should not repeat a scene kind. The server-built
 * evidence scene is the same for any challenge, so it is exempt.
 */
export function sceneRepeatProblems(study: PreparedStudy) {
  const kinds = journeyChallenges(study, true).map((c) =>
    c.scene && !isEvidenceScene(c.scene) ? c.scene.kind : null,
  );
  const problems: string[] = [];
  for (let i = 1; i < kinds.length; i++)
    if (kinds[i] && kinds[i] === kinds[i - 1])
      problems.push(`challenge ${i + 1} repeats the ${kinds[i]} scene`);
  return problems;
}

const stageRank = {
  design: 0,
  results: 1,
  significance: 1,
  interpretation: 2,
} as const;

/**
 * The journey reads in order: design, then results, then interpretation. Each
 * required challenge gives the learner readable evidence lines (never bare
 * evidence ids) and a hint for the retry.
 */
export function journeyProblems(study: PreparedStudy) {
  const problems: string[] = [];
  const main = study.lesson.challenges;
  let rank = 0;
  for (const c of main) {
    const next = stageRank[c.reveal as keyof typeof stageRank];
    if (next === undefined)
      problems.push(`${c.id}: ${c.reveal} stage in the required sequence`);
    else if (next < rank)
      problems.push(`${c.id}: ${c.reveal} stage after a later stage`);
    else rank = next;
    if (!c.hint.trim()) problems.push(`${c.id}: empty hint`);
    if (!c.evidence.length)
      problems.push(`${c.id}: no evidence lines for the learner`);
    for (const line of c.evidence)
      if (
        !line.trim() ||
        /^\/?(?:e|ref|evidence)[\s_-]?\d+$/i.test(line.trim())
      )
        problems.push(
          `${c.id}: evidence line "${line}" is an id, not readable text`,
        );
  }
  if (main.length < 5)
    problems.push(`only ${main.length} required challenges; at least 5`);
  // An accepted answer copied from the challenge's own evidence lines tests reading, not reasoning.
  const squash = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^\p{L}\p{N}%.]+/gu, " ")
      .trim();
  for (const c of main) {
    const lines = squash(c.evidence.join(" "));
    for (const o of c.options)
      if (
        c.accepted.includes(o.id) &&
        squash(o.text).length >= 12 &&
        lines.includes(squash(o.text))
      )
        problems.push(`${c.id}: evidence lines state the accepted answer`);
  }
  for (const [stage, ranks] of [
    ["results", [1]],
    ["interpretation", [2]],
  ] as const)
    if (
      !main.some((c) =>
        (ranks as readonly number[]).includes(
          stageRank[c.reveal as keyof typeof stageRank],
        ),
      )
    )
      problems.push(`no ${stage}-stage challenge`);
  return problems;
}

const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

/** Every evidence excerpt appears verbatim on its cited page of the stored PDF. */
export function excerptProblems(study: PreparedStudy, pages: PaperPage[]) {
  const problems: string[] = [];
  for (const ref of study.lesson.evidence) {
    const page = pages.find((p) => p.num === ref.page);
    if (!page) problems.push(`${ref.id}: page ${ref.page} does not exist`);
    else if (!normalize(page.text).includes(normalize(ref.excerpt)))
      problems.push(`${ref.id} is not verbatim on page ${ref.page}`);
  }
  return problems;
}

/** Every check the generator gate and the test suite apply to a new study. */
export function studyProblems(study: PreparedStudy, pages: PaperPage[]) {
  return [
    ...answerGuideProblems(study),
    ...identityProblems(study),
    ...sceneCheckProblems(study),
    ...gateProblems(study),
    ...sceneRepeatProblems(study),
    ...journeyProblems(study),
    ...excerptProblems(study, pages),
  ];
}

/** The README entry for a DOI names the stored PDF, as in stored-papers.test.ts. */
export function paperFileFor(
  doiUrl: string | null,
  readme: string,
  files: string[],
) {
  if (!doiUrl) return null;
  const doi = doiUrl.replace(/^https:\/\/doi\.org\//, "").toLowerCase();
  return (
    files.find((file) => {
      const start = readme.indexOf(`### ${file}`);
      if (start === -1) return false;
      const next = readme.indexOf("\n### ", start + 4);
      return readme
        .slice(start, next === -1 ? undefined : next)
        .toLowerCase()
        .includes(doi);
    }) ?? null
  );
}
