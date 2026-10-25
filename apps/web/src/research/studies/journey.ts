import {
  projectScene,
  type Scene,
  type SceneGate,
} from "@paperquest/contracts";
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
 * Only content permitted at the current status is rendered, mirroring the server's
 * projectScene for the shared kinds. Proposed kinds follow the same gate rules.
 * Returns null for unsafe or unknown scenes, which fall back to plain choices.
 */
export function visibleScene(
  scene: StudyScene | null,
  options: string[],
  status: ChallengeStatus,
): StudyScene | null {
  if (!scene) return null;
  const feedback = status !== "answering" && status !== "retrying";
  const resolution = status === "solved" || status === "explained";
  if (
    scene.kind === "flow" ||
    scene.kind === "connections" ||
    scene.kind === "comparison" ||
    scene.kind === "designs"
  )
    return projectScene(scene as Scene, feedback, resolution, options);
  const visible = (at: SceneGate) =>
    at === "setup" ||
    (at === "feedback" && feedback) ||
    (at === "resolution" && resolution);
  const mapped = new Set(scene.responses.map((r) => r.optionId));
  if (mapped.size !== options.length || options.some((id) => !mapped.has(id)))
    return null;
  const resolutionItem =
    scene.resolution && visible(scene.resolution.at) ? scene.resolution : null;
  if (scene.kind === "timeline")
    return {
      ...scene,
      resolution: resolutionItem,
      events: scene.events.filter((event) => visible(event.at)),
    };
  if (scene.kind === "association")
    return {
      ...scene,
      resolution: resolutionItem,
      pairs: scene.pairs.filter((pair) => visible(pair.at)),
    };
  return {
    ...scene,
    resolution: resolutionItem,
    band: scene.band && visible(scene.band.at) ? scene.band : null,
    estimates: scene.estimates.filter((estimate) => visible(estimate.at)),
  };
}

/** A tap response needs a diagram whose elements each stand for one option. */
export function tapTargets(scene: StudyScene | null) {
  if (
    !scene ||
    !["flow", "designs", "timeline"].includes(scene.kind) ||
    scene.responses.some((response) => response.targetIds.length !== 1)
  )
    return null;
  return new Map(
    scene.responses.map((response) => [response.targetIds[0]!, response]),
  );
}

export const POINTS_PER_SOLVE = 10;
