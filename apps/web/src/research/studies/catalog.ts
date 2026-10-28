import type { ResponseStyle, Term } from "@paperquest/contracts";
import { studyCards } from "./cards.js";
import type {
  PreparedStudy,
  StudyBody,
  StudyCard,
  StudyScene,
} from "./types.js";

/** A scene saved by scripts/define-prepared-scenes.ts for one challenge. */
export type SavedScene = { scene: StudyScene; responseStyle?: ResponseStyle };

/** Lesson bodies load per study, so the library chunk carries cards only. */
const bodies = import.meta.glob<{ body: StudyBody }>("./data/*.ts");
/** Term definitions saved by scripts/define-prepared-terms.ts, keyed by challenge id. */
const termFiles = import.meta.glob<{ terms: Record<string, Term[]> }>(
  "./data/terms/*.ts",
);
/** Scenes saved by scripts/define-prepared-scenes.ts for challenges that had none. */
const sceneFiles = import.meta.glob<{ scenes: Record<string, SavedScene> }>(
  "./data/scenes/*.ts",
);

export const studies: StudyCard[] = studyCards;

export function findCard(slug: string) {
  return studies.find((card) => card.slug === slug) ?? null;
}

/** Null when the slug has no card or no lesson body, for example after a paper is removed. */
export async function loadStudy(slug: string): Promise<PreparedStudy | null> {
  const card = findCard(slug);
  const load = bodies[`./data/${slug}.ts`];
  if (!card || !load) return null;
  const [{ body }, saved, designed] = await Promise.all([
    load(),
    termFiles[`./data/terms/${slug}.ts`]?.(),
    sceneFiles[`./data/scenes/${slug}.ts`]?.(),
  ]);
  const { challenges: _ids, ...rest } = card;
  return {
    ...rest,
    ...withScenes(withTerms(body, saved?.terms ?? {}), designed?.scenes ?? {}),
  };
}

/** Attaches saved scenes to challenges that have no authored scene. */
export function withScenes(
  body: StudyBody,
  scenes: Record<string, SavedScene>,
): StudyBody {
  const attach = <C extends StudyBody["lesson"]["challenges"][number]>(c: C) =>
    scenes[c.id] && !c.scene ? { ...c, ...scenes[c.id] } : c;
  return {
    ...body,
    lesson: {
      ...body.lesson,
      challenges: body.lesson.challenges.map(attach),
      bonus: body.lesson.bonus ? attach(body.lesson.bonus) : null,
    },
  };
}

/** Attaches saved term definitions to their challenges. */
export function withTerms(
  body: StudyBody,
  terms: Record<string, Term[]>,
): StudyBody {
  const attach = <C extends { id: string }>(c: C) =>
    terms[c.id] ? { ...c, terms: terms[c.id] } : c;
  return {
    ...body,
    lesson: {
      ...body.lesson,
      challenges: body.lesson.challenges.map(attach),
      bonus: body.lesson.bonus ? attach(body.lesson.bonus) : null,
    },
  };
}

/** Slugs that have a lesson body on disk, for consistency checks. */
export const bodySlugs = Object.keys(bodies).map(
  (path) => /\/([^/]+)\.ts$/.exec(path)![1]!,
);
