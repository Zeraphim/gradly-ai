import { featured } from "../../../../../api/src/research/featured.js";
import type { StudyBody } from "../types.js";

/** The original featured investigation, played through the shared prepared-study player. */
export const body: StudyBody = {
  lesson: {
    ...featured,
    challenges: featured.challenges.map((c) => ({
      ...c,
      scene: c.scene ?? null,
    })),
    bonus: featured.bonus && {
      ...featured.bonus,
      scene: featured.bonus.scene ?? null,
    },
  },
  takeaway:
    "Students randomly assigned to text during a lecture scored lower on a comprehension quiz than students who did not. Random assignment supports a causal reading for this quiz and setting, not for overall grades or every classroom.",
};
