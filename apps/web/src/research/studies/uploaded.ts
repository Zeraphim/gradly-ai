import type { ResearchSession } from "../types.js";
import type { ChallengeAttempt } from "./journey.js";
import type { StudyProgress } from "./progress.js";
import type {
  DesignGroup,
  PreparedStudy,
  StudyChallenge,
  StudyTopic,
} from "./types.js";

/**
 * Adapts a server learning session for an uploaded paper to the prepared-study
 * player. The session is the only source: it carries the current challenge
 * without answer keys, server-chosen feedback, the identity-safe study card and,
 * after the reveal, the paper and the review of every challenge. Shipping the
 * whole lesson instead would let the browser read results-stage evidence and
 * scenes before the design decisions, which the per-challenge gate prevents.
 */
type PublicChallenge = NonNullable<ResearchSession["challenge"]>;
type ReviewItem = NonNullable<ResearchSession["review"]>[number];
/** Titles and stages of challenges already seen, so earlier screens keep their cue order. */
export type SeenChallenges = Record<
  number,
  { id: string; title: string; reveal: StudyChallenge["reveal"] }
>;

export const UPLOADED_KICKER = "Your paper · AI-generated";

/** Attempts the server reports for the current challenge, oldest first. */
export function sessionAttempts(c: PublicChallenge): ChallengeAttempt[] {
  if (!c.attempts) return [];
  // A retry is only offered after a miss, so a hidden result there is a miss.
  const last = {
    selected: c.previousSelection,
    correct: !!c.feedback?.correct,
  };
  return c.attempts === 1
    ? [{ ...last, selected: c.firstSelection }]
    : [{ selected: c.firstSelection, correct: false }, last];
}

/** A key-free challenge: feedback text comes from the server's saved result. */
export function toStudyChallenge(c: PublicChallenge): StudyChallenge {
  const feedback = c.feedback;
  return {
    id: c.id,
    stage: c.stage,
    title: c.title,
    type: c.type,
    prompt: c.prompt,
    evidence: c.evidence,
    scene: c.scene,
    // The server checked that a tap style has one setup element per option.
    responseStyle: c.responseStyle ?? undefined,
    options: c.options,
    accepted: feedback?.accepted ?? [],
    alternatives: [],
    hint: c.hint,
    // The server already chose the misconception text for the checked answer.
    misconceptions:
      feedback && !feedback.correct
        ? Object.fromEntries(
            c.previousSelection.map((id) => [id, feedback.message]),
          )
        : {},
    explanation: feedback?.explanation ?? "",
    refs: c.references.map((r) => r.id),
    writtenReasoning: c.writtenReasoning,
    reveal: c.reveal,
  };
}

function reviewChallenge(
  r: ReviewItem,
  seen?: SeenChallenges[number],
): StudyChallenge {
  return {
    ...placeholder(0, seen?.reveal ?? "interpretation"),
    id: r.id,
    title: r.title,
    type: r.type,
    options: r.options,
    accepted: r.accepted,
    explanation: r.explanation,
  };
}

/** Stands in for a challenge the server has not sent; the player never renders it. */
function placeholder(
  i: number,
  reveal: StudyChallenge["reveal"],
): StudyChallenge {
  return {
    id: `upcoming-${i}`,
    stage: "",
    title: `Challenge ${i + 1}`,
    type: "single",
    prompt: "",
    evidence: [],
    scene: null,
    options: [],
    accepted: [],
    alternatives: [],
    hint: "",
    misconceptions: {},
    explanation: "",
    refs: [],
    writtenReasoning: false,
    reveal,
  };
}

const playing = (s: ResearchSession) =>
  (s.phase === "challenge" || s.phase === "bonus") && !!s.challenge;

export function toPreparedStudy(
  s: ResearchSession,
  seen: SeenChallenges = {},
): PreparedStudy {
  const current = playing(s) ? toStudyChallenge(s.challenge!) : null;
  const currentMain = s.phase === "challenge" ? current : null;
  const challenges = Array.from({ length: s.total }, (_, i) => {
    if (currentMain && i === s.index) return currentMain;
    const review = s.review?.[i];
    if (review) return reviewChallenge(review, seen[i]);
    const known = seen[i];
    // Earlier screens default to the current stage so no unlock cue repeats.
    const fallback = i < s.index && current ? current.reveal : "design";
    return {
      ...placeholder(i, known?.reveal ?? fallback),
      ...(known ? { id: known.id, title: known.title } : {}),
    };
  });
  const bonus = !s.bonusAvailable
    ? null
    : s.phase === "bonus" && current
      ? current
      : placeholder(s.total, "bonus");
  const card = s.study;
  return {
    slug: `uploaded-${s.id}`,
    teaser: card.teaser,
    question: card.question,
    // Both only choose the decorative art; the kicker replaces the design label.
    group: card.group satisfies DesignGroup,
    topic: card.topic satisfies StudyTopic,
    minutes: card.minutes,
    reviewed: false,
    kicker: UPLOADED_KICKER,
    takeaway: s.takeaway ?? "",
    lesson: {
      id: s.id,
      title: card.teaser,
      briefing: s.briefing,
      source: "generated",
      paper: s.paper ?? {
        title: "",
        authors: "",
        journal: "",
        url: null,
        limitations: [],
      },
      evidence: [],
      challenges,
      bonus,
    },
  };
}

const phases: Record<ResearchSession["phase"], StudyProgress["phase"]> = {
  briefing: "intro",
  challenge: "challenge",
  bonus: "challenge",
  "bonus-choice": "bonus-offer",
  reveal: "reveal",
  complete: "reveal",
};

/** Player progress mirrored from the session; only the draft is the browser's. */
export function toProgress(
  s: ResearchSession,
  draft: StudyProgress["draft"] = null,
): StudyProgress {
  const attempts: StudyProgress["attempts"] = {};
  if (playing(s)) attempts[s.challenge!.id] = sessionAttempts(s.challenge!);
  for (const r of s.review ?? [])
    attempts[r.id] = r.attempts.map((a) => ({
      selected: a.selected,
      correct: a.correct,
    }));
  const done = phases[s.phase] === "reveal";
  return {
    phase: phases[s.phase],
    index: s.phase === "bonus" ? s.total : s.index,
    bonus: s.phase === "bonus",
    attempts,
    retrying: s.retrying && s.challenge ? s.challenge.id : null,
    draft:
      draft && s.challenge && draft.challengeId === s.challenge.id
        ? draft
        : null,
    completed: done,
    updated: 0,
  };
}

/** Main challenges resolved so far; the server only advances past resolved ones. */
export function finishedCount(s: ResearchSession) {
  if (
    phases[s.phase] === "reveal" ||
    s.phase === "bonus-choice" ||
    s.phase === "bonus"
  )
    return s.total;
  if (s.phase !== "challenge" || !s.challenge) return 0;
  const f = s.challenge.feedback;
  const resolved =
    !!f && !s.retrying && (f.correct || s.challenge.attempts >= 2);
  return s.index + (resolved ? 1 : 0);
}
