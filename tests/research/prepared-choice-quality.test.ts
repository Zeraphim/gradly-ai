import { describe, expect, it } from "vitest";
import {
  loadStudy,
  studies as cards,
} from "../../apps/web/src/research/studies/catalog.js";
import { rewrittenStudySlugs } from "../fixtures/rewritten-studies.js";

const rewritten = await Promise.all(
  rewrittenStudySlugs.map(async (slug) => (await loadStudy(slug))!),
);
/** Challenges whose scene came from scripts/define-prepared-scenes.ts, by study. */
const designed = new Map<string, Set<string>>(
  await Promise.all(
    rewrittenStudySlugs.map(
      async (slug) =>
        [
          slug,
          new Set(
            Object.keys(
              (
                await import(
                  `../../apps/web/src/research/studies/data/scenes/${slug}.ts`
                ).catch(() => ({ scenes: {} }))
              ).scenes,
            ),
          ),
        ] as const,
    ),
  ),
);
const singles = rewritten.flatMap((s) =>
  s.lesson.challenges.filter((c) => c.type === "single"),
);

// Content-review guardrails for the specific PR #33 regressions. These catch
// superficial answer strategies, not factual accuracy or learning benefit.
describe("rewritten prepared-study choices", () => {
  it("does not reward a fixed answer position across or within studies", () => {
    for (let position = 0; position < 4; position++) {
      const hits = singles.filter((c) =>
        c.accepted.includes(c.options[position]?.id ?? ""),
      ).length;
      expect(
        hits / singles.length,
        `position ${position + 1}`,
      ).toBeLessThanOrEqual(0.4);
    }
    for (const study of rewritten) {
      const cs = study.lesson.challenges.filter((c) => c.type === "single");
      for (let position = 0; position < 4; position++) {
        const hits = cs.filter((c) =>
          c.accepted.includes(c.options[position]?.id ?? ""),
        ).length;
        expect(
          hits,
          `${study.slug}, position ${position + 1}`,
        ).toBeLessThanOrEqual(Math.ceil(cs.length / 2));
      }
    }
  });

  it("does not make shortest or longest a majority-winning strategy", () => {
    for (const extreme of [Math.min, Math.max]) {
      // Count ties as wins too, making the bound conservative.
      const hits = singles.filter((c) => {
        const right = c.options.find((o) => c.accepted.includes(o.id))!;
        return (
          right.text.length === extreme(...c.options.map((o) => o.text.length))
        );
      }).length;
      expect(hits / singles.length).toBeLessThanOrEqual(0.45);
    }
  });

  it("keeps explanatory choices comparable in length, including bonuses", () => {
    for (const study of rewritten) {
      for (const c of [
        ...study.lesson.challenges,
        ...(study.lesson.bonus ? [study.lesson.bonus] : []),
      ]) {
        const lengths = c.options.map((o) => o.text.length);
        // Short labels such as 'Running' and 'Seated rest' need no padding.
        if (Math.max(...lengths) <= 60) continue;
        expect(
          Math.max(...lengths) / Math.min(...lengths),
          `${study.slug}/${c.id}`,
        ).toBeLessThanOrEqual(1.85);
      }
    }
  });

  it("keeps scene response order aligned with the displayed choices", () => {
    for (const study of rewritten) {
      for (const c of [
        ...study.lesson.challenges,
        ...(study.lesson.bonus ? [study.lesson.bonus] : []),
      ]) {
        if (!c.scene?.responses) continue;
        // Authored tap diagrams list their answers in option order. A designed
        // scene keeps its diagram's own order (a procedure, modest to strong
        // claims), so only its responses are checked below.
        if (c.responseStyle === "tap" && !designed.get(study.slug)?.has(c.id)) {
          const scene = c.scene;
          const targetIds =
            scene.kind === "designs"
              ? scene.panels.flatMap((panel) =>
                  panel.steps.map((step) => step.id),
                )
              : scene.kind === "timeline"
                ? scene.events.map((event) => event.id)
                : [];
          const displayed = [
            ...new Set(
              targetIds.flatMap((id) =>
                scene.responses
                  .filter((response) => response.targetIds.includes(id))
                  .map((response) => response.optionId),
              ),
            ),
          ];
          expect(
            displayed,
            `${study.slug}/${c.id} rendered diagram choices`,
          ).toEqual(c.options.map((o) => o.id));
        }
        const indexes = c.scene.responses.map((r) =>
          c.options.findIndex((o) => o.id === r.optionId),
        );
        expect(indexes, `${study.slug}/${c.id}`).toEqual(
          [...indexes].sort((a, b) => a - b),
        );
      }
    }
  });

  it("uses phrase-style stages across the entire library", async () => {
    for (const card of cards) {
      const study = (await loadStudy(card.slug))!;
      for (const c of [
        ...study.lesson.challenges,
        ...(study.lesson.bonus ? [study.lesson.bonus] : []),
      ]) {
        expect(
          ["design", "results", "interpretation"],
          `${card.slug}/${c.id}`,
        ).not.toContain(c.stage);
      }
    }
  });
});
