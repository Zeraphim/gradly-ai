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
