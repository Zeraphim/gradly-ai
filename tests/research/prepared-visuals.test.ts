import { describe, expect, it } from "vitest";
import {
  loadStudy,
  studies,
} from "../../apps/web/src/research/studies/catalog.js";
import {
  sceneFaults,
  type Challenge,
} from "../../apps/api/src/research/contracts.js";
import { visibleScene } from "../../apps/web/src/research/studies/journey.js";
import { preparedVisualAdditions } from "../fixtures/prepared-visuals.js";

const loaded = await Promise.all(
  studies.map(async (card) => (await loadStudy(card.slug))!),
);
describe("prepared-study visual coverage", () => {
  it("leaves no study entirely without a required-challenge visual", () => {
    expect(
      loaded
        .filter((s) => !s.lesson.challenges.some((c) => c.scene))
        .map((s) => s.slug),
    ).toEqual([]);
  });
  it.each(preparedVisualAdditions)(
    "$slug/$id keeps source-supported values and valid reveal gates",
    ({ slug, id, kind }) => {
      const study = loaded.find((s) => s.slug === slug)!;
      const challenge = study.lesson.challenges.find((c) => c.id === id)!;
      expect(challenge.scene?.kind).toBe(kind);
      expect(
        sceneFaults(challenge as unknown as Challenge, study.lesson.evidence),
      ).toEqual([]);
      expect(
        visibleScene(
          challenge.scene,
          challenge.options.map((o) => o.id),
          "answering",
        ),
      ).not.toBeNull();
    },
  );
});

// These interpretations used to be visible before the learner's first attempt.
it.each([
  ["music-and-attention", "c6", "Limited room to improve"],
  ["reading-words-aloud", "c1", "Different participants"],
  ["using-scented-air-while-brainstorming", "c1", "Creativity suggestion"],
])(
  "%s/%s reveals derived comparison text only after assessment",
  (slug, id, label) => {
    const c = loaded
      .find((s) => s.slug === slug)!
      .lesson.challenges.find((c) => c.id === id)!;
    const options = c.options.map((o) => o.id);
    for (const status of ["answering", "retrying", "retry-feedback"] as const) {
      const projected = visibleScene(c.scene, options, status);
      expect(projected).not.toBeNull();
      expect(JSON.stringify(projected)).not.toContain(label);
    }
    expect(JSON.stringify(visibleScene(c.scene, options, "solved"))).toContain(
      label,
    );
  },
);
