import { describe, expect, it } from "vitest";
import type { z } from "zod";
import { sceneItems, type Scene, type SceneOf } from "@paperquest/contracts";
import type { Job, Lesson } from "../../apps/api/src/research/contracts.js";
import {
  newJob,
  READY_STAGE,
  reviewLesson,
  runStage,
  STAGES,
  upgradeJob,
} from "../../apps/api/src/research/pipeline.js";
import type { ModelProvider } from "../../apps/api/src/research/provider.js";
import {
  allowedKinds,
  designScenes,
  evidenceScene,
  isEvidenceScene,
  SCENE_ROLE,
  sceneKindSets,
  sceneLeaks,
  sceneRefs,
  scenesSummary,
  settleScene,
  stageSceneProblems,
  type ScenesResult,
} from "../../apps/api/src/research/scene-stage.js";
import { sceneReply } from "./fixtures/scene-reply.js";

const evidence = [
  {
    id: "approach_1",
    page: 1,
    excerpt: "Pupils were randomly assigned to a quiet room or a noisy room.",
  },
  {
    id: "findings_1",
    page: 2,
    excerpt: "Quiz scores were 12 points higher in the quiet room.",
  },
];
const options = [
  { id: "A", text: "Random assignment to rooms" },
  { id: "B", text: "Pupils chose their own room" },
  { id: "C", text: "Each pupil sat in both rooms" },
];
function challenge(
  id: string,
  reveal: "design" | "results" | "interpretation",
  refs: string[],
) {
  return {
    id,
    stage: reveal,
    title: `Challenge ${id}`,
    type: "single" as const,
    prompt: "Which choice fits this study best?",
    evidence: [],
    scene: null,
    options,
    accepted: ["A"],
    alternatives: [],
    hint: "Think about who decided the room.",
    misconceptions: {},
    explanation: "The excerpt says the rooms were assigned at random.",
    refs,
    writtenReasoning: false,
    reveal,
  };
}
const lesson: Lesson = {
  id: "scene-stage",
  title: "Quiet rooms",
  briefing: "A study of rooms and quizzes.",
  source: "generated",
  paper: { title: "", authors: "", journal: "", url: null, limitations: [] },
  evidence,
  challenges: [
    challenge("c0", "design", ["approach_1", "findings_1"]),
    challenge("c1", "results", ["findings_1"]),
    challenge("c2", "interpretation", ["findings_1"]),
  ],
  bonus: null,
};

type Call = { role: string; input: Record<string, unknown>; schema: z.ZodType };
/** A provider answering each call through `answer`, recording every call. */
function scripted(
  answer: (call: Call, n: number) => unknown,
): ModelProvider & { calls: Call[] } {
  const calls: Call[] = [];
  return {
    calls,
    async generate<T>(
      role: string,
      _task: string,
      input: unknown,
      schema: z.ZodType<T>,
    ) {
      const call = { role, input: input as Record<string, unknown>, schema };
      calls.push(call);
      const out = answer(call, calls.length);
      if (out instanceof Error) throw out;
      return out as T;
    },
  };
}
const challengeId = (call: Call) =>
  (call.input.challenge as { id: string } | undefined)?.id;
/** A scene that repeats an element under a second id, which no repair fixes. */
function unknownRefScene(input: unknown) {
  const reply = sceneReply(input) as { scene: Scene };
  const items = sceneItems(reply.scene);
  const copy = { ...structuredClone(items[0]!), id: "repeated" };
  if (reply.scene.kind === "connections") reply.scene.anchors.push(copy);
  else if (reply.scene.kind === "sort") reply.scene.cards.push(copy);
  return reply;
}

describe("Scene Designer stage", () => {
  it("writes a model scene for every challenge, alternating kind sets by position", async () => {
    const p = scripted(({ role, input }) =>
      role === SCENE_ROLE ? sceneReply(input) : { flagged: [] },
    );
    const r = await designScenes(lesson, p, "model");
    expect(r.outcomes).toEqual({ c0: "written", c1: "written", c2: "written" });
    expect(r.lesson.challenges.map((c) => c.scene?.kind)).toEqual([
      "connections",
      "sort",
      "connections",
    ]);
    // Cards is the default style, so none is stored.
    expect(r.lesson.challenges.every((c) => !("responseStyle" in c))).toBe(
      true,
    );
    const sceneCalls = p.calls.filter((c) => c.role === SCENE_ROLE);
    expect(sceneCalls.map((c) => c.input.allowedKinds)).toEqual([
      sceneKindSets[0],
      sceneKindSets[1],
      sceneKindSets[0],
    ]);
    // The scene call never sees the answer key, and a design question never
    // sees results-side excerpts.
    const first = sceneCalls[0]!.input;
    expect(JSON.stringify(first)).not.toContain("accepted");
    expect(JSON.stringify(first)).not.toContain(
      lesson.challenges[0]!.explanation,
    );
    expect((first.excerpts as { id: string }[]).map((e) => e.id)).toEqual([
      "approach_1",
    ]);
    expect(r.leaks).toBe(0);
  });

  it("retries a failing draft once with its problems, then accepts the fix", async () => {
    const p = scripted(({ role, input }) => {
      if (role !== SCENE_ROLE) return { flagged: [] };
      return input.previousProblems
        ? sceneReply(input)
        : unknownRefScene(input);
    });
    const r = await designScenes(lesson, p, "model");
    expect(r.written).toBe(3);
    expect(r.retried).toBe(3);
    const retries = p.calls.filter(
      (c) => c.role === SCENE_ROLE && c.input.previousProblems,
    );
    expect(retries).toHaveLength(3);
    expect(
      (retries[0]!.input.previousProblems as string[]).join(" "),
    ).toContain("the scene repeats an element");
  });

  it("falls back to the evidence scene when the redraft also fails or the call errors", async () => {
    const p = scripted(({ role, input }) => {
      if (role !== SCENE_ROLE) return { flagged: [] };
      return challengeId({ role, input } as Call) === "c1"
        ? Error("Nebius request failed (503).")
        : unknownRefScene(input);
    });
    const r = await designScenes(lesson, p, "model");
    expect(r.outcomes).toEqual({
      c0: "fallback",
      c1: "fallback",
      c2: "fallback",
    });
    expect(r.lesson.challenges.every((c) => isEvidenceScene(c.scene))).toBe(
      true,
    );
    expect(r.problems.c1!.join(" ")).toContain("did not complete");
    // A design question's evidence scene leaves out the results excerpt.
    const design = r.lesson.challenges[0]!.scene as SceneOf<"connections">;
    expect(design.anchors.map((a) => a.detail)).toEqual([evidence[0]!.excerpt]);
    expect(r.written).toBe(0);
  });

  it("leaves a challenge as plain choices when it cites nothing it may show", async () => {
    const l = structuredClone(lesson);
    l.challenges[0]!.refs = ["findings_1"];
    const r = await designScenes(
      l,
      scripted(() => Error("unavailable")),
      "model",
    );
    expect(r.outcomes.c0).toBe("plain");
    expect(r.lesson.challenges[0]!.scene).toBeNull();
    expect(r.plain).toBe(1);
  });

  it("skips calls that cannot finish inside the stage budget", async () => {
    let t = 0;
    const p = scripted(() => Error("should not be called"));
    const r = await designScenes(lesson, p, "model", {
      budgetMs: 10_000,
      now: () => (t += 1_000),
    });
    expect(p.calls).toHaveLength(0);
    expect(r.fallback).toBe(3);
    // A retry needs 40s left, so a slow first round skips the second.
    let clock = 0;
    const slow = scripted(({ role, input }) => {
      clock += 140_000;
      return role === SCENE_ROLE ? unknownRefScene(input) : { flagged: [] };
    });
    const once = await designScenes(lesson, slow, "model", {
      now: () => clock,
    });
    expect(slow.calls.every((c) => !c.input.previousProblems)).toBe(true);
    expect(once.fallback).toBe(3);
  });

  it("passes whole-millisecond timeouts when the clock is fractional", async () => {
    let clock = 0.25;
    const timeouts: unknown[] = [];
    const p: ModelProvider = {
      async generate<T>(
        role: string,
        _task: string,
        input: unknown,
        _schema: unknown,
        _model?: string,
        options?: { timeoutMs?: number },
      ) {
        clock += 60_000.7;
        timeouts.push(options?.timeoutMs);
        return (role === SCENE_ROLE ? sceneReply(input) : { flagged: [] }) as T;
      },
    };
    await designScenes(lesson, p, "model", { now: () => clock });
    expect(timeouts.length).toBeGreaterThan(1);
    expect(timeouts.every((t) => Number.isInteger(t))).toBe(true);
  });

  it("limits kinds by position and kept neighbours, and the schema enforces them", async () => {
    expect(allowedKinds(0, [null, null])).toEqual(sceneKindSets[0]);
    expect(allowedKinds(1, [null, null])).toEqual(sceneKindSets[1]);
    const flow = { kind: "flow" } as Scene;
    expect(allowedKinds(2, [flow, null])).not.toContain("flow");
    expect(
      sceneKindSets[0].filter((k) => sceneKindSets[1].includes(k)),
    ).toEqual([]);
    const p = scripted(({ role, input }) =>
      role === SCENE_ROLE ? sceneReply(input) : { flagged: [] },
    );
    await designScenes(lesson, p, "model");
    const even = p.calls.find((c) => challengeId(c) === "c0")!;
    const odd = p.calls.find((c) => challengeId(c) === "c1")!;
    const sortReply = sceneReply(odd.input);
    expect(odd.schema.safeParse(sortReply).success).toBe(true);
    expect(even.schema.safeParse(sortReply).success).toBe(false);
  });

  it("keepExisting keeps an existing scene and excludes its kind from neighbours", async () => {
    const l = structuredClone(lesson);
    const kept = {
      ...(sceneReply({
        challenge: { id: "c1", options, refs: ["findings_1"] },
        excerpts: [evidence[1]],
        allowedKinds: ["connections"],
      }).scene as Scene),
      title: "Authored scene",
    };
    l.challenges[1]!.scene = kept;
    const p = scripted(({ role, input }) =>
      role === SCENE_ROLE ? sceneReply(input) : { flagged: [] },
    );
    const r = await designScenes(l, p, "model", { keepExisting: true });
    expect(r.outcomes.c1).toBe("kept");
    expect(r.lesson.challenges[1]!.scene).toEqual(kept);
    expect(p.calls.some((c) => challengeId(c) === "c1")).toBe(false);
    for (const call of p.calls.filter((c) => c.role === SCENE_ROLE))
      expect(call.input.allowedKinds).not.toContain("connections");
    expect(r.kept).toBe(1);
  });

  it("redrafts a flagged scene once with the reason and checks the redraft again", async () => {
    let checks = 0;
    const p = scripted(({ role, input }) => {
      if (role === SCENE_ROLE) return sceneReply(input);
      checks++;
      return {
        flagged:
          checks === 1 ? [{ id: "c1", reason: "Names the answer." }] : [],
      };
    });
    const r = await designScenes(lesson, p, "model");
    expect(r.outcomes).toEqual({ c0: "written", c1: "written", c2: "written" });
    expect(r.leaks).toBe(0);
    const redraft = p.calls.find(
      (c) => c.role === SCENE_ROLE && c.input.previousProblems,
    )!;
    expect(challengeId(redraft)).toBe("c1");
    expect((redraft.input.previousProblems as string[]).join(" ")).toContain(
      "Names the answer.",
    );
    const second = p.calls.filter((c) => c.role === "Scene Leak Check")[1]!;
    expect(
      (second.input.challenges as { id: string }[]).map((c) => c.id),
    ).toEqual(["c1"]);
    // Without time to check a redraft, the challenge falls back instead.
    let clock = 0;
    const tight = scripted(({ role, input }) => {
      if (role !== SCENE_ROLE) {
        clock += 10_000;
        return { flagged: [{ id: "c1", reason: "Names the answer." }] };
      }
      clock += input.previousProblems ? 70_000 : 20_000;
      return sceneReply(input);
    });
    const late = await designScenes(lesson, tight, "model", {
      now: () => clock,
    });
    expect(
      tight.calls.filter((c) => c.role === "Scene Leak Check"),
    ).toHaveLength(1);
    expect(late.outcomes.c1).toBe("fallback");
  });

  it("repairs references a draft gets wrong when the evidence settles them", () => {
    const c = lesson.challenges[0]!;
    const reply = sceneReply({
      challenge: { id: c.id, options: c.options, refs: c.refs },
      excerpts: evidence.filter((r) => c.refs.includes(r.id)),
      allowedKinds: ["connections"],
    }) as { scene: SceneOf<"connections"> };
    reply.scene.provenance.refs = ["invented"];
    reply.scene.anchors[0]!.provenance.refs = [];
    const { scene } = settleScene(c, reply.scene, "cards");
    const refs = sceneRefs(c);
    expect(scene.provenance.refs.every((r) => refs.includes(r))).toBe(true);
    expect(scene.provenance.refs.length).toBeGreaterThan(0);
    if (refs.length === 1)
      expect(
        (scene as SceneOf<"connections">).anchors[0]!.provenance.refs,
      ).toEqual(refs);
  });

  it("replaces scenes the leak check flags and ignores a failed leak check", async () => {
    const flagging = scripted(({ role, input }) =>
      role === SCENE_ROLE
        ? sceneReply(input)
        : { flagged: [{ id: "c1", reason: "Names the answer." }] },
    );
    const r = await designScenes(lesson, flagging, "model");
    expect(r.outcomes).toEqual({
      c0: "written",
      c1: "fallback",
      c2: "written",
    });
    expect(r.leaks).toBe(1);
    expect(isEvidenceScene(r.lesson.challenges[1]!.scene)).toBe(true);
    const check = flagging.calls.find((c) => c.role === "Scene Leak Check")!;
    const sent = check.input.challenges as { id: string; accepted: string[] }[];
    expect(sent.map((c) => c.id)).toEqual(["c0", "c1", "c2"]);
    expect(sent[0]!.accepted).toEqual(["A"]);
    const failing = scripted(({ role, input }) =>
      role === SCENE_ROLE ? sceneReply(input) : Error("Leak check failed."),
    );
    const ignored = await designScenes(lesson, failing, "model");
    expect(ignored.written).toBe(3);
    expect(ignored.leaks).toBe(0);
    const unchecked = scripted(({ role, input }) =>
      role === SCENE_ROLE ? sceneReply(input) : Error("not called"),
    );
    await designScenes(lesson, unchecked, "model", { checkLeaks: false });
    expect(unchecked.calls.every((c) => c.role === SCENE_ROLE)).toBe(true);
  });

  it("summarises written, fallback and plain counts with the time taken", () => {
    const r = {
      written: 3,
      fallback: 1,
      plain: 1,
      kept: 0,
      retried: 2,
      leaks: 1,
      durationMs: 41_400,
    } as ScenesResult;
    expect(scenesSummary(r)).toBe(
      "Interactive scenes on 4 of 5 challenges: 3 written for this paper (2 redrafted after a check), 1 replaced for giving an answer away, 1 built from the cited evidence, 1 plain choices. Took 41s.",
    );
  });
});

describe("scene checks and repairs", () => {
  const c0 = lesson.challenges[0]!;
  const reply = (refs: string[]) =>
    sceneReply({
      challenge: { id: "c0", options, refs },
      excerpts: refs.map((id) => ({ id })),
      allowedKinds: ["connections"],
    }).scene as SceneOf<"connections">;

  it("rejects a design-stage scene citing a results excerpt", () => {
    expect(stageSceneProblems(c0, reply(["approach_1"]), evidence)).toEqual([]);
    expect(
      stageSceneProblems(c0, reply(["findings_1"]), evidence).join(" "),
    ).toContain("may cite only method excerpts");
  });

  it("rejects unfilled placeholders shown as scene text", () => {
    const named = reply(["approach_1"]);
    named.anchors[0]!.label = "actionLabel";
    expect(stageSceneProblems(c0, named, evidence).join(" ")).toContain(
      "unfilled placeholder",
    );
    const slot = reply(["approach_1"]);
    slot.anchors[0]!.detail = ":element:m_A_F2";
    expect(stageSceneProblems(c0, slot, evidence).join(" ")).toContain(
      "unfilled placeholder",
    );
    // Ordinary labels that mention a field-like word still pass.
    const fine = reply(["approach_1"]);
    fine.anchors[0]!.label = "Detail of the lecture";
    expect(stageSceneProblems(c0, fine, evidence)).toEqual([]);
  });

  it("flags a setup element that quotes an accepted option", () => {
    const scene = reply(["approach_1"]);
    expect(sceneLeaks(c0, scene)).toEqual([]);
    scene.anchors[0]!.detail =
      "The study used random assignment to rooms here.";
    expect(sceneLeaks(c0, scene)).toEqual([
      "c0: the scene repeats an accepted option before the answer.",
    ]);
    // Text that waits for the answer is not read as a leak.
    scene.anchors[0]!.at = "feedback";
    scene.anchors.push({
      ...scene.anchors[0]!,
      id: "other",
      at: "setup",
      detail: "Context.",
    });
    expect(sceneLeaks(c0, scene)).toEqual([]);
  });

  it("drops the resolution and matches responses to the options", () => {
    const scene = reply(["approach_1"]);
    scene.resolution = {
      ...scene.anchors[0]!,
      id: "res",
      at: "resolution",
    };
    scene.responses = [
      { optionId: "C", label: "Third", targetIds: ["anchor_1", "missing"] },
      { optionId: "A", label: "", targetIds: ["anchor_1"] },
      { optionId: "Z", label: "Unknown", targetIds: [] },
    ];
    const { scene: settled } = settleScene(c0, scene, "cards");
    expect(settled.resolution).toBeNull();
    expect(settled.responses).toEqual([
      {
        optionId: "A",
        label: "Random assignment to rooms",
        targetIds: ["anchor_1"],
      },
      { optionId: "B", label: "Pupils chose their own room", targetIds: [] },
      { optionId: "C", label: "Third", targetIds: ["anchor_1"] },
    ]);
  });

  it("drops a ladder reach that marks only a wrong option's rung", () => {
    const provenance = {
      kind: "source-summary" as const,
      refs: ["approach_1"],
      note: "Summary.",
    };
    const rung = (id: string) => ({
      id,
      label: `Claim ${id}`,
      detail: "A claim.",
      at: "setup" as const,
      provenance,
    });
    const ladder: SceneOf<"ladder"> = {
      version: 1,
      kind: "ladder",
      title: "How far can the claim go?",
      instruction: "Climb the claims.",
      description: "Three claims.",
      provenance,
      rungs: [rung("r1"), rung("r2"), rung("r3")],
      reach: {
        rungId: "r2",
        label: "The evidence reaches here",
        at: "resolution",
      },
      responses: [
        { optionId: "A", label: "A", targetIds: ["r1"] },
        { optionId: "B", label: "B", targetIds: ["r2"] },
        { optionId: "C", label: "C", targetIds: ["r3"] },
      ],
      resolution: null,
    };
    const wrong = settleScene(c0, ladder, "tap").scene as SceneOf<"ladder">;
    expect(wrong.reach).toBeNull();
    const right = settleScene(
      c0,
      { ...ladder, reach: { ...ladder.reach!, rungId: "r1" } },
      "tap",
    );
    expect((right.scene as SceneOf<"ladder">).reach?.rungId).toBe("r1");
    // Each option is one distinct rung, so tapping the ladder can answer.
    expect(right.responseStyle).toBe("tap");
  });

  it("keeps a response style only where the player can use it", () => {
    const scene = reply(["approach_1"]);
    // Connections cannot answer by tap.
    expect(settleScene(c0, scene, "tap").responseStyle).toBeUndefined();
    expect(settleScene(c0, scene, "pills").responseStyle).toBe("pills");
    const long = {
      ...c0,
      options: [...options.slice(0, 2), { id: "C", text: "x".repeat(60) }],
    };
    expect(settleScene(long, scene, "pills").responseStyle).toBeUndefined();
    expect(settleScene(c0, scene, "cards").responseStyle).toBeUndefined();
  });

  it("builds the evidence scene from the challenge's cited excerpts", () => {
    const scene = evidenceScene(lesson.challenges[1]!, evidence)!;
    expect(isEvidenceScene(scene)).toBe(true);
    expect(scene.anchors.map((a) => a.label)).toEqual(["Evidence 1 · p. 2"]);
    expect(scene.responses.map((r) => r.optionId)).toEqual(["A", "B", "C"]);
    expect(isEvidenceScene({ ...scene, title: "Another title" })).toBe(false);
  });
});

describe("Scene Designer in the pipeline", () => {
  const pages = evidence.map((r) => ({ page: r.page, text: r.excerpt }));
  const atScenes = (): Job => ({
    ...newJob("scenes", "paper.pdf", pages),
    stage: STAGES.scenes,
    lesson: structuredClone(lesson),
  });

  it("records the summary and never fails the stage", async () => {
    const next = await runStage(
      atScenes(),
      scripted(() => Error("Provider down.")),
    );
    expect(next.status).toBe("pending");
    expect(next.stage).toBe(STAGES.terms);
    expect(next.audits[STAGES.scenes]!.status).toBe("Completed");
    expect(next.audits[STAGES.scenes]!.summary).toMatch(
      /^Interactive scenes on 3 of 3 challenges: 0 written for this paper \(3 redrafted after a check\), 3 built from the cited evidence, 0 plain choices\. Took \d+s\.$/,
    );
  });

  it("lets a reviewer replace a leaking scene with the evidence scene", async () => {
    const drafted = await designScenes(
      lesson,
      scripted(({ role, input }) =>
        role === SCENE_ROLE ? sceneReply(input) : { flagged: [] },
      ),
      "model",
    );
    const review = await reviewLesson(
      "methods",
      drafted.lesson,
      pages,
      scripted(() => ({
        approved: false,
        issues: ["The c2 scene states the answer."],
        summary: "Needs changes",
        rejectedScenes: [{ challenge: "c2", reason: "Leaks the answer." }],
      })),
      "model",
    );
    expect(review.replaced).toBe(1);
    expect(isEvidenceScene(review.lesson.challenges[2]!.scene)).toBe(true);
    expect(review.lesson.challenges[0]!.scene).toEqual(
      drafted.lesson.challenges[0]!.scene,
    );
  });
});

describe("saved jobs from before the Scene Designer", () => {
  /** Six audits: the terms stage existed, the scene stage did not. */
  const six = () => {
    const j = newJob("six", "paper.pdf", []);
    j.audits.splice(STAGES.scenes, 1);
    return j;
  };

  it("records the stage as not run on a finished lesson", () => {
    const ready = six();
    ready.stage = 6;
    ready.status = "ready";
    const j = upgradeJob(ready);
    expect(j.stage).toBe(READY_STAGE);
    expect(j.audits).toHaveLength(READY_STAGE);
    expect(j.audits[STAGES.scenes]).toMatchObject({
      role: SCENE_ROLE,
      status: "Completed",
      model: "Not run",
      summary: "Not run: this lesson was prepared before the Scene Designer.",
    });
  });

  it("sends an unfinished job past the lesson back to draft its scenes", () => {
    const running = six();
    running.stage = 3; // was the Methods Reviewer
    running.status = "failed";
    running.error = "Old failure";
    running.audits[2]!.status = "Completed";
    running.audits[3]!.status = "Failed";
    running.audits[3]!.error = "Old failure";
    const j = upgradeJob(running);
    expect(j.stage).toBe(STAGES.scenes);
    expect(j.status).toBe("pending");
    expect(j.error).toBeUndefined();
    expect(j.audits.slice(STAGES.scenes).map((a) => a.status)).toEqual(
      Array(READY_STAGE - STAGES.scenes).fill("Pending"),
    );
    expect(j.audits[STAGES.methods]!.error).toBeUndefined();
    // A job still drafting its lesson simply gains the pending stage.
    const early = six();
    early.stage = 1;
    expect(upgradeJob(early)).toMatchObject({ stage: 1 });
    expect(upgradeJob(early).audits[STAGES.scenes]!.status).toBe("Pending");
  });

  it("returns a current job unchanged", () => {
    const current = newJob("now", "paper.pdf", []);
    expect(upgradeJob(current)).toBe(current);
  });
});
