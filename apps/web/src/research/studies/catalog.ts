import { studyCards } from "./cards.js";
import type { PreparedStudy, StudyBody, StudyCard } from "./types.js";

/** Lesson bodies load per study, so the library chunk carries cards only. */
const bodies = import.meta.glob<{ body: StudyBody }>("./data/*.ts");

export const studies: StudyCard[] = studyCards;

export function findCard(slug: string) {
  return studies.find((card) => card.slug === slug) ?? null;
}

/** Null when the slug has no card or no lesson body, for example after a paper is removed. */
export async function loadStudy(slug: string): Promise<PreparedStudy | null> {
  const card = findCard(slug);
  const load = bodies[`./data/${slug}.ts`];
  if (!card || !load) return null;
  const { body } = await load();
  const { challenges: _ids, ...rest } = card;
  return { ...rest, ...body };
}

/** Slugs that have a lesson body on disk, for consistency checks. */
export const bodySlugs = Object.keys(bodies).map(
  (path) => /\/([^/]+)\.ts$/.exec(path)![1]!,
);
