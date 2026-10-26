import { asDraft } from "./fixtures/draft.js";
import { describe, it, expect } from "vitest";
import {
  sceneSchema,
  sceneProblems,
  projectScene,
  sceneItems,
} from "@paperquest/contracts";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  lessonSchema,
  verifyLesson,
} from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
  learningPoints,
} from "../../apps/api/src/research/engine.js";
import { newJob, runStage } from "../../apps/api/src/research/pipeline.js";
import {
  fieldTrialSceneLesson,
  quantitativeSceneLesson,
  qualitativeSceneLesson,
  sceneFixturePages,
} from "./fixtures/scene-lessons.js";

it("covers eight featured challenges and the bonus with validated reusable scenes", () => {
  for (const challenge of [...featured.challenges, featured.bonus!]) {
    expect(challenge.scene).toBeTruthy();
    const scene = sceneSchema.parse(challenge.scene);
    expect(
      sceneProblems(
        scene,
        challenge.options.map((o) => o.id),
        challenge.refs,
      ),
    ).toEqual([]);
    expect(
      sceneSchema.safeParse(projectScene(scene, false, false)).success,
    ).toBe(true);
  }
  expect(lessonSchema.safeParse(featured).success).toBe(true);
});

it("never projects later nodes, edges, resolution text or target identifiers before their gate", () => {
  const scene = structuredClone(featured.challenges[1]!.scene!);
  if (scene.kind !== "flow") throw Error("Expected flow");
  scene.nodes.push({
    id: "late-secret",
    label: "FUTURE FINDING",
    detail: "HIDDEN DETAIL",
    at: "resolution",
    provenance: { kind: "authored", refs: [], note: "SECRET PROVENANCE" },
  });
  scene.edges.push({
    from: scene.nodes[0]!.id,
    to: "late-secret",
    label: "SECRET EDGE",
    at: "setup",
  });
  scene.responses[0]!.targetIds.push("late-secret");
  for (const text of [
    "FUTURE FINDING",
    "HIDDEN DETAIL",
    "SECRET PROVENANCE",
    "SECRET EDGE",
    "late-secret",
  ])
    expect(JSON.stringify(projectScene(scene, false, false))).not.toContain(
      text,
    );
  expect(JSON.stringify(projectScene(scene, true, true))).toContain(
    "FUTURE FINDING",
  );
});

it("keeps resolution gated through a miss and retry while preserving the first response", () => {
  let s = transition(newSession(featured, "scene"), featured, "begin");
  s = submit(s, featured, ["B"], "first reasoning");
  expect(publicSession(s, featured).challenge?.scene?.resolution).toBeNull();
  s = transition(s, featured, "retry");
  expect(publicSession(s, featured).challenge?.firstSelection).toEqual(["B"]);
  expect(publicSession(s, featured).challenge?.scene?.resolution).toBeNull();
  s = submit(s, featured, ["C"], "revision");
  expect(publicSession(s, featured).challenge?.scene?.resolution).toBeTruthy();
  expect(learningPoints(s)).toBe(0);
});

it("reveals the mean difference only with feedback and does not expose later findings early", () => {
  let s = transition(newSession(featured, "scene"), featured, "begin");
  for (let index = 0; index < 5; index++) {
    expect(JSON.stringify(publicSession(s, featured))).not.toContain("73.41");
    s = transition(
      submit(s, featured, featured.challenges[index]!.accepted, ""),
      featured,
      "next",
    );
  }
  const before = publicSession(s, featured).challenge?.scene;
  expect(before?.kind).toBe("comparison");
  if (before?.kind === "comparison") expect(before.difference).toBeNull();
  s = submit(s, featured, ["B"], "");
  const after = publicSession(s, featured).challenge?.scene;
  if (after?.kind !== "comparison") throw Error("Missing comparison");
  expect(after.difference).not.toBeNull();
  expect(after.resolution).toBeNull();
});

it("falls back for missing, future and structurally unsafe scenes without breaking assessment", () => {
  expect(projectScene(undefined, false, false)).toBeNull();
  expect(
    projectScene({ version: 999, kind: "future" }, false, false),
  ).toBeNull();
  const l = structuredClone(featured);
  delete l.challenges[0]!.scene;
  let s = transition(newSession(l, "legacy"), l, "begin");
  expect(publicSession(s, l).challenge?.scene).toBeNull();
  s = submit(s, l, ["A"], "");
  expect(learningPoints(s)).toBe(10);
  const bad = structuredClone(featured.challenges[5]!.scene!);
  if (bad.kind !== "comparison") throw Error("comparison");
  bad.difference!.to = "unknown";
  expect(projectScene(bad, true, true)).toBeNull();
  const stored = structuredClone(featured);
  stored.challenges[0]!.scene!.responses[0]!.optionId = "missing-option";
  expect(
    publicSession(
      transition(newSession(stored, "unsafe-stored"), stored, "begin"),
      stored,
    ).challenge?.scene,
  ).toBeNull();
});

it("rejects unmapped options, fabricated numbers, invalid scales and unknown evidence", () => {
  const l = structuredClone(quantitativeSceneLesson);
  const scene = l.challenges[1]!.scene!;
  if (scene.kind !== "comparison") throw Error("comparison");
  scene.values[0]!.value = 123.456;
  scene.values[0]!.provenance.refs = ["missing"];
  scene.max = scene.min;
  scene.responses[0]!.optionId = "unmapped";
  const problems = verifyLesson(l, sceneFixturePages(l)).join(" ");
  expect(problems).toContain("not in its referenced evidence");
  expect(problems).toContain("unknown scene evidence");
  expect(problems).toContain("invalid comparison scale");
  expect(problems).toContain("map to every challenge option");
  expect(
    sceneSchema.safeParse({ ...scene, executable: "run me" }).success,
  ).toBe(false);
});

for (const fixture of [
  quantitativeSceneLesson,
  qualitativeSceneLesson,
  fieldTrialSceneLesson,
])
  describe(fixture.id, () => {
    it("passes mocked generation, review and verification, then the existing learning loop", async () => {
      expect(verifyLesson(fixture, sceneFixturePages(fixture))).toEqual([]);
      const outputs: unknown[] = [
        {
          paperSummary: "Authored fixture only",
          refs: fixture.evidence,
          missing: [],
        },
        fixture,
        { approved: true, issues: [], summary: "Mocked methods review" },
        { approved: true, issues: [], summary: "Mocked learning review" },
      ];
      const tasks: string[] = [];
      let job = newJob(
        fixture.id,
        "authored-fixture.pdf",
        sceneFixturePages(fixture),
      );
      for (let i = 0; i < 5; i++)
        job = await runStage(job, {
          async generate(_role, task, _input, schema) {
            tasks.push(task);
            return schema.parse(asDraft(outputs.shift()));
          },
        });
      expect(job.status).toBe("ready");
      expect(tasks[1]).toContain("Scenes are required.");
      expect(tasks[2]).toContain("Review all scene text");
      let s = transition(
        newSession(job.lesson!, "fixture"),
        job.lesson!,
        "begin",
      );
      for (const challenge of fixture.challenges) {
        const publicChallenge = publicSession(s, job.lesson!).challenge!;
        expect(sceneSchema.safeParse(publicChallenge.scene).success).toBe(true);
        expect(sceneItems(publicChallenge.scene!)).not.toHaveLength(0);
        expect(publicChallenge.options[0]!.id).toBe("bounded");
        s = transition(
          submit(s, job.lesson!, challenge.accepted, "Bounded to the evidence"),
          job.lesson!,
          "next",
        );
      }
      expect(learningPoints(s)).toBe(30);
      expect(s.phase).toBe("bonus-choice");
    });
  });

it("fails malformed model scene output explicitly instead of publishing a lesson", async () => {
  const job = newJob(
    "malformed",
    "fixture.pdf",
    sceneFixturePages(qualitativeSceneLesson),
  );
  job.stage = 1;
  const malformed = structuredClone(qualitativeSceneLesson);
  (malformed.challenges[0]!.scene as unknown as { version: number }).version =
    42;
  const result = await runStage(job, {
    async generate() {
      return malformed as never;
    },
  });
  expect(result.status).toBe("failed");
  expect(result.stage).toBe(1);
});
