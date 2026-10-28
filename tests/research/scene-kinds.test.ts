import { describe, expect, it } from "vitest";
import {
  projectScene,
  sceneItems,
  sceneKinds,
  sceneProblems,
  sceneSchema,
  tapKinds,
  tapTargets,
  type SceneOf,
} from "@paperquest/contracts";

const provenance = {
  kind: "source-summary" as const,
  refs: ["e1"],
  note: "Summary of the cited excerpt.",
};
const item = (
  id: string,
  at: "setup" | "feedback" | "resolution" = "setup",
) => ({
  id,
  label: `Label ${id}`,
  detail: `Detail ${id}.`,
  at,
  provenance,
});
const base = {
  version: 1 as const,
  title: "A scene",
  instruction: "Do something with it.",
  description: "A scene for testing.",
  provenance,
  resolution: null,
};
const optionIds = ["A", "B", "C"];
const oneEach = (ids: string[]) =>
  optionIds.map((optionId, i) => ({
    optionId,
    label: optionId,
    targetIds: [ids[i]!],
  }));

const ladder = (): SceneOf<"ladder"> => ({
  ...base,
  kind: "ladder",
  rungs: [item("r1"), item("r2"), item("r3")],
  reach: { rungId: "r2", label: "The evidence reaches here", at: "resolution" },
  responses: oneEach(["r1", "r2", "r3"]),
});
const sort = (): SceneOf<"sort"> => ({
  ...base,
  kind: "sort",
  bins: [
    { id: "can", label: "Can show" },
    { id: "cannot", label: "Cannot show" },
  ],
  cards: [item("k1"), item("k2"), item("k3")],
  placements: [
    { cardId: "k1", binId: "can", at: "resolution" },
    { cardId: "k2", binId: "cannot", at: "resolution" },
  ],
  responses: oneEach(["k1", "k2", "k3"]),
});
const spot = (): SceneOf<"spot"> => ({
  ...base,
  kind: "spot",
  passages: [item("p1"), item("p2"), item("p3"), item("p4")],
  responses: oneEach(["p1", "p2", "p3"]),
});

describe("ladder, sort and spot scenes", () => {
  it("are part of the shared contract and accept valid scenes", () => {
    expect(sceneKinds).toEqual(
      expect.arrayContaining(["ladder", "sort", "spot"]),
    );
    for (const scene of [ladder(), sort(), spot()]) {
      expect(sceneSchema.safeParse(scene).success).toBe(true);
      expect(sceneProblems(scene, optionIds, ["e1"])).toEqual([]);
    }
    expect(
      sceneSchema.safeParse({ ...spot(), passages: [item("p1"), item("p2")] })
        .success,
    ).toBe(false);
    expect(
      sceneSchema.safeParse({ ...ladder(), rungs: [item("r1")] }).success,
    ).toBe(false);
    expect(
      sceneSchema.safeParse({
        ...sort(),
        bins: [{ id: "a", label: "Only one" }],
      }).success,
    ).toBe(false);
  });

  it("lists every element through sceneItems", () => {
    expect(sceneItems(ladder()).map((i) => i.id)).toEqual(["r1", "r2", "r3"]);
    expect(sceneItems(sort()).map((i) => i.id)).toEqual(["k1", "k2", "k3"]);
    expect(sceneItems(spot()).map((i) => i.id)).toEqual([
      "p1",
      "p2",
      "p3",
      "p4",
    ]);
  });

  it("keeps the ladder reach for the explanation and on a known rung", () => {
    const early = ladder();
    early.reach!.at = "feedback";
    expect(sceneProblems(early, optionIds, ["e1"])).toContain(
      "the ladder reach must wait for the answer explanation",
    );
    const unknown = ladder();
    unknown.reach!.rungId = "r9";
    expect(sceneProblems(unknown, optionIds, ["e1"])).toContain(
      "unknown ladder rung",
    );
    expect(
      sceneProblems({ ...ladder(), reach: null }, optionIds, ["e1"]),
    ).toEqual([]);
  });

  it("keeps sort placements for the explanation and on known cards and bins", () => {
    const early = sort();
    early.placements[0]!.at = "setup";
    expect(sceneProblems(early, optionIds, ["e1"])).toContain(
      "sort placements must wait for the answer explanation",
    );
    const unknown = sort();
    unknown.placements[0]!.binId = "nowhere";
    expect(sceneProblems(unknown, optionIds, ["e1"])).toContain(
      "unknown sort card or bin",
    );
    const twice = sort();
    twice.placements.push({ cardId: "k1", binId: "cannot", at: "resolution" });
    expect(sceneProblems(twice, optionIds, ["e1"])).toContain(
      "a sort card is placed more than once",
    );
    const bins = sort();
    bins.bins[1]!.id = "can";
    expect(sceneProblems(bins, optionIds, ["e1"])).toContain(
      "duplicate sort bins",
    );
  });

  it("hides the reach and placements until the explanation shows", () => {
    for (const [feedback, resolution] of [
      [false, false],
      [true, false],
    ] as const) {
      const l = projectScene(
        ladder(),
        feedback,
        resolution,
        optionIds,
      ) as SceneOf<"ladder">;
      expect(l.reach).toBeNull();
      const s = projectScene(
        sort(),
        feedback,
        resolution,
        optionIds,
      ) as SceneOf<"sort">;
      expect(s.placements).toEqual([]);
    }
    const l = projectScene(
      ladder(),
      true,
      true,
      optionIds,
    ) as SceneOf<"ladder">;
    expect(l.reach?.rungId).toBe("r2");
    const s = projectScene(sort(), true, true, optionIds) as SceneOf<"sort">;
    expect(s.placements).toHaveLength(2);
    // A gated passage stays hidden before an attempt.
    const gated = spot();
    gated.passages[3] = item("p4", "feedback");
    const shown = projectScene(
      gated,
      false,
      false,
      optionIds,
    ) as SceneOf<"spot">;
    expect(shown.passages.map((p) => p.id)).toEqual(["p1", "p2", "p3"]);
  });

  it("answers by tap on ladder rungs and spot passages, never on sort cards", () => {
    expect(tapKinds).toEqual(expect.arrayContaining(["ladder", "spot"]));
    expect(tapKinds).not.toContain("sort");
    expect([...tapTargets(ladder())!.keys()]).toEqual(["r1", "r2", "r3"]);
    expect([...tapTargets(spot())!.keys()]).toEqual(["p1", "p2", "p3"]);
    expect(tapTargets(sort())).toBeNull();
  });
});
