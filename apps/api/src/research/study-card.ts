import type { Lesson } from "./contracts.js";

/**
 * Library-card fields for a generated lesson, derived only from the lesson.
 * The same rules always give the same card. It runs on the server because
 * hiding the paper's identity needs `lesson.paper`, which the learner must not
 * receive before the reveal.
 */
export type StudyCardDesign =
  | "between"
  | "within"
  | "replication"
  | "correlational"
  | "longitudinal"
  | "classroom";
export type StudyCardTopic =
  | "school"
  | "cognition"
  | "health"
  | "wellbeing"
  | "social"
  | "media"
  | "environment";
export type StudyCard = {
  teaser: string;
  question: string;
  minutes: number;
  /** Chooses the decorative art tone only; never shown as a design claim. */
  group: StudyCardDesign;
  /** Chooses the decorative illustration only. */
  topic: StudyCardTopic;
};

export const NEUTRAL_TEASER = "Your uploaded study";
export const NEUTRAL_QUESTION = "What can this study really tell us?";

const words = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);

/** True when text would name the paper: its title, a close variant, or an author. */
export function revealsIdentity(text: string, paper: Lesson["paper"]) {
  const plain = text.toLowerCase();
  const title = paper.title.trim().toLowerCase();
  if (title.length >= 12 && plain.includes(title)) return true;
  if (plain.trim().length >= 12 && title.includes(plain.trim())) return true;
  const titleWords = new Set(words(paper.title));
  const textWords = new Set(words(text));
  if (titleWords.size >= 3) {
    const shared = [...titleWords].filter((w) => textWords.has(w)).length;
    if (shared / titleWords.size >= 0.6) return true;
  }
  const surnames = paper.authors
    .replace(/\([^)]*\)|\d+/g, " ")
    .split(/,|&|\band\b|;/)
    .map((name) => name.trim().split(/\s+/).at(-1) ?? "")
    .map((name) => name.replace(/[^\p{L}-]/gu, "").toLowerCase())
    .filter((name) => name.length > 2 && !["etal", "al"].includes(name));
  return surnames.some((name) =>
    new RegExp(`(^|[^\\p{L}])${name}([^\\p{L}]|$)`, "u").test(plain),
  );
}

const designRules: [StudyCardDesign, RegExp][] = [
  ["replication", /\breplicat/],
  [
    "longitudinal",
    /\blongitudinal|\bwaves?\b|\bfollow(ed)?[- ]up\b|over (several|many) (months|years)/,
  ],
  [
    "within",
    /within[- ]subjects?|repeated[- ]measures|each participant (completed|did|saw)|every participant/,
  ],
  ["classroom", /\bclass(room)?s?\b.*\brandom|\brandom.*\bclass(room)?s?\b/],
  [
    "between",
    /random(ly)? assign|randomi[sz]ed|experimental (group|condition)|control (group|condition)/,
  ],
  ["correlational", /correlat|associat|survey|questionnaire|observational/],
];

const topicRules: [StudyCardTopic, RegExp][] = [
  ["school", /\bschool|student|classroom|teacher|lecture|exam|grade|homework/g],
  [
    "cognition",
    /memory|learning|attention|cognit|recall|reading|priming|percept|reasoning/g,
  ],
  [
    "health",
    /health|sleep|exercise|diet|pain|patient|clinical|disease|food|drink/g,
  ],
  [
    "wellbeing",
    /well-?being|happiness|stress|family|parent|mood|anxiety|gratitude/g,
  ],
  [
    "social",
    /social|belief|politic|vote|conform|moral|trust|prejudice|charity/g,
  ],
  [
    "media",
    /media|phone|screen|online|internet|video|television|digital|texting/g,
  ],
  [
    "environment",
    /environment|climate|transport|commut|\bwork|money|financ|energy|travel/g,
  ],
];

/**
 * Design text is what the learner may read before findings: the briefing and
 * the explanations of design-stage challenges. A null result is a finding, so
 * it is never inferred here.
 */
export function inferDesign(lesson: Lesson): StudyCardDesign {
  const text = [
    lesson.briefing,
    ...lesson.challenges
      .filter((c) => c.reveal === "design")
      .map((c) => `${c.prompt} ${c.explanation}`),
  ]
    .join(" ")
    .toLowerCase();
  return designRules.find(([, rule]) => rule.test(text))?.[0] ?? "between";
}

export function inferTopic(lesson: Lesson): StudyCardTopic {
  const text = `${lesson.title} ${lesson.briefing}`.toLowerCase();
  let best: StudyCardTopic = "cognition";
  let bestCount = 0;
  for (const [topic, rule] of topicRules) {
    const count = text.match(rule)?.length ?? 0;
    if (count > bestCount) [best, bestCount] = [topic, count];
  }
  return best;
}

/** About a minute per challenge, plus reading, written reasoning and the reveal. */
export function estimateMinutes(lesson: Lesson) {
  const reasoning = lesson.challenges.filter((c) => c.writtenReasoning).length;
  const estimate =
    2 +
    lesson.challenges.length +
    Math.ceil(reasoning / 2) +
    (lesson.bonus ? 1 : 0);
  return Math.min(15, Math.max(5, estimate));
}

function firstQuestion(briefing: string) {
  return (
    briefing
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .find((s) => s.endsWith("?") && s.length >= 12 && s.length <= 160) ?? null
  );
}

export function lessonStudyCard(lesson: Lesson): StudyCard {
  const safe = (text: string | null, fallback: string) =>
    text && text.trim() && !revealsIdentity(text, lesson.paper)
      ? text.trim()
      : fallback;
  return {
    teaser: safe(lesson.title, NEUTRAL_TEASER),
    // The briefing's first question, else a title that is itself a question.
    question: safe(
      firstQuestion(lesson.briefing) ??
        (lesson.title.trim().endsWith("?") ? lesson.title : null),
      NEUTRAL_QUESTION,
    ),
    minutes: estimateMinutes(lesson),
    group: inferDesign(lesson),
    topic: inferTopic(lesson),
  };
}

/**
 * The reveal's one-line takeaway: the explanation of the last interpretation
 * challenge, else the last results challenge, else the last challenge. Only
 * sent once the paper itself is revealed.
 */
export function lessonTakeaway(lesson: Lesson) {
  const pick = (reveal: string[]) =>
    lesson.challenges.filter((c) => reveal.includes(c.reveal)).at(-1);
  return (pick(["interpretation"]) ??
    pick(["results", "significance"]) ??
    lesson.challenges.at(-1))!.explanation;
}
