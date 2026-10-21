import { describe, expect, it } from "vitest";
import { sceneSchema, sceneProblems } from "@paperquest/contracts";
import {
  activityPilot,
  pilotScene,
} from "../../apps/web/src/research/activity-pilot.js";
import { restorePilot } from "../../apps/web/src/research/PaperActivityPilot.js";

describe("authored three-paper pilot", () => {
  it.each(activityPilot)(
    "$id uses supported options and references",
    (paper) => {
      expect(sceneSchema.safeParse(paper.scene).success).toBe(true);
      expect(
        sceneProblems(
          paper.scene,
          paper.options.map((o) => o.id),
          paper.scene.provenance.refs,
        ),
      ).toEqual([]);
      expect(paper.source.href).toMatch(/^https:\/\/doi.org\//);
      expect(paper.options.some((o) => o.id === paper.accepted)).toBe(true);
      expect(pilotScene(paper, false).resolution).toBeNull();
    },
  );
  it.each(activityPilot)(
    "$id link counts do not reveal the accepted response",
    (paper) => {
      const sizes = new Set(
        paper.scene.responses.map((r) => r.targetIds.length),
      );
      expect(sizes.size).toBe(1);
    },
  );
  it("preserves the experiment's three-decimal means and gates the derived difference", () => {
    const paper = activityPilot[0]!;
    const before = pilotScene(paper, false);
    const after = pilotScene(paper, true);
    if (before.kind !== "comparison" || after.kind !== "comparison")
      throw Error("Expected comparison");
    expect(before.decimals).toBe(3);
    expect(before.values.map((v) => v.value)).toEqual([0.822, 0.631]);
    expect(before.difference).toBeNull();
    expect(after.difference).toBeTruthy();
    expect(after.resolution?.detail).toContain("19.1 percentage points");
    expect(sceneSchema.safeParse({ ...paper.scene, decimals: 7 }).success).toBe(
      false,
    );
  });
  it("uses observed timing and interview accounts without fabricated outcome values", () => {
    expect(activityPilot[1]!.scene.kind).toBe("flow");
    expect(activityPilot[2]!.scene.kind).toBe("connections");
    expect(JSON.stringify(activityPilot[1]!.scene)).not.toContain('"value":');
    expect(JSON.stringify(activityPilot[2]!.scene)).not.toContain('"value":');
  });
  it("bounds restored drafts to their own paper and rejects invalid or stale identities", () => {
    expect(restorePilot("bad-json").active).toBe("experiment");
    const saved = restorePilot(
      JSON.stringify({
        active: "qualitative",
        drafts: {
          qualitative: {
            selected: ["unknown", "bounded"],
            reviewed: true,
            explanation: "x".repeat(2000),
            scene: {
              prediction: "fake",
              inspectedId: "draw",
              pinnedIds: ["digital", "fake", 17],
            },
          },
          experiment: {
            selected: ["unknown"],
            reviewed: true,
            scene: { prediction: "Visual explanation", revealed: true },
          },
        },
      }),
    );
    expect(saved.active).toBe("qualitative");
    expect(saved.drafts.qualitative?.scene).toMatchObject({
      prediction: null,
      inspectedId: null,
      pinnedIds: ["digital"],
    });
    expect(saved.drafts.qualitative?.explanation).toHaveLength(1500);
    expect(saved.drafts.experiment?.reviewed).toBe(false);
    expect(saved.drafts.experiment?.scene.prediction).toBe(
      "Visual explanation",
    );
  });
});
