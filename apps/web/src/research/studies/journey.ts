import { projectScene, tapTargets } from "@paperquest/contracts";
import type { PreparedStudy, StudyChallenge, StudyScene } from "./types.js";

/** Attempts recorded for one challenge, oldest first. */
export type ChallengeAttempt = { selected: string[]; correct: boolean };

/**
 * The learning rules for one screen, derived from saved attempts only:
 * answer → check → (first miss → one retry) → explanation. Points once per solve.
 */
export type ChallengeStatus =
  "answering" | "retry-feedback" | "retrying" | "solved" | "explained";

export function challengeStatus(
  attempts: ChallengeAttempt[],
  retrying: boolean,
): ChallengeStatus {
  const last = attempts.at(-1);
  if (!last) return "answering";
  if (last.correct) return "solved";
  if (attempts.length >= 2) return "explained";
  return retrying ? "retrying" : "retry-feedback";
}

export function isCorrect(challenge: StudyChallenge, selected: string[]) {
  const same = (answer: string[]) =>
    answer.length === selected.length &&
    answer.every((id) => selected.includes(id));
  return [challenge.accepted, ...challenge.alternatives].some(same);
}

export function journeyChallenges(study: PreparedStudy, withBonus: boolean) {
  return [
    ...study.lesson.challenges,
    ...(withBonus && study.lesson.bonus ? [study.lesson.bonus] : []),
  ];
}

/**
 * Only content permitted at the current status is rendered, using the server's
 * projectScene for every kind. Returns null for unsafe or unknown scenes, which
 * fall back to plain choices.
 */
export function visibleScene(
  scene: StudyScene | null,
  options: string[],
  status: ChallengeStatus,
): StudyScene | null {
  if (!scene) return null;
  const feedback = status !== "answering" && status !== "retrying";
  const resolution = status === "solved" || status === "explained";
  return projectScene(scene, feedback, resolution, options);
}

/** A tap response needs a diagram whose elements each stand for one option. */
export { tapTargets };

export const POINTS_PER_SOLVE = 10;
