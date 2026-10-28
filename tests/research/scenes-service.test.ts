import { asDraft } from "./fixtures/draft.js";
import { isSceneCall, sceneReplyFrom } from "./fixtures/scene-reply.js";
import { it, expect, vi } from "vitest";
import express from "express";
import { researchRouter } from "../../apps/api/src/research/router.js";
import {
  newJob,
  READY_STAGE,
  runStage,
} from "../../apps/api/src/research/pipeline.js";
import { insert, read } from "../../apps/api/src/research/store.js";
import type { Job } from "../../apps/api/src/research/contracts.js";
import {
  quantitativeSceneLesson,
  sceneFixturePages,
} from "./fixtures/scene-lessons.js";
import type { ResearchSession } from "../../apps/web/src/research/types.js";

it("delivers a scene through the real learning route, submits mapped answers, resumes and rejects stale/foreign writes", async () => {
  vi.stubEnv("DATABASE_URL", "file::memory:");
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("RESEARCH_ENABLED", "true");
  vi.stubEnv(
    "SESSION_SECRET",
    "test-only-guest-cookie-signing-secret-for-scenes",
  );
  const app = express();
  app.use(express.json());
  app.use("/api/research", researchRouter());
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw Error("Missing test address");
  const base = `http://127.0.0.1:${address.port}`;
  let cookie = "";
  const post = async (body: unknown) => {
    const response = await fetch(`${base}/api/research/learning`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: base, cookie },
      body: JSON.stringify(body),
    });
    cookie = response.headers.get("set-cookie")?.split(";")[0] ?? cookie;
    return response;
  };
  try {
    let session = (await (
      await post({ action: "start" })
    ).json()) as ResearchSession;
    session = (await (
      await post({ action: "begin", id: session.id, version: session.version })
    ).json()) as ResearchSession;
    expect(session.challenge?.scene?.kind).toBe("connections");
    expect(session.challenge?.scene?.resolution).toBeNull();
    const originalVersion = session.version;
    session = (await (
      await post({
        action: "submit",
        id: session.id,
        version: session.version,
        selected: ["B"],
        reasoning: "First response",
      })
    ).json()) as ResearchSession;
    expect(session.points).toBe(0);
    expect(session.challenge?.scene?.resolution).toBeNull();
    session = (await (
      await post({ action: "retry", id: session.id, version: session.version })
    ).json()) as ResearchSession;
    expect(session.challenge?.firstSelection).toEqual(["B"]);
    session = (await (
      await post({
        action: "submit",
        id: session.id,
        version: session.version,
        selected: ["A"],
        reasoning: "Revised response",
      })
    ).json()) as ResearchSession;
    expect(session.points).toBe(10);
    expect(session.challenge?.scene?.resolution?.label).toContain(
      "measurement",
    );
    const resumed = (await (
      await fetch(`${base}/api/research/learning?id=${session.id}`, {
        headers: { cookie },
      })
    ).json()) as ResearchSession;
    expect(resumed.challenge?.firstSelection).toEqual(["B"]);
    expect(resumed.challenge?.previousSelection).toEqual(["A"]);
    expect(
      (await post({ action: "next", id: session.id, version: originalVersion }))
        .status,
    ).toBe(409);
    expect(
      (await fetch(`${base}/api/research/learning?id=${session.id}`)).status,
    ).toBe(400);

    // Connect mocked generation to actual persistence and the public learning routes.
    let job = newJob(
      "generated-scene-service",
      "authored-fixture.pdf",
      sceneFixturePages(quantitativeSceneLesson),
    );
    const outputs: unknown[] = [
      {
        paperSummary: "Authored fixture only",
        refs: quantitativeSceneLesson.evidence,
        missing: [],
      },
      quantitativeSceneLesson,
      { challenges: [] },
      { approved: true, issues: [], summary: "Mocked methods review" },
      { approved: true, issues: [], summary: "Mocked teaching review" },
    ];
    const scene = sceneReplyFrom(quantitativeSceneLesson, { anyKind: true });
    for (let i = 0; i < READY_STAGE; i++)
      job = await runStage(job, {
        async generate(role, _task, input, schema) {
          // The fixture's own scenes stand in for the Scene Designer.
          if (isSceneCall(role)) return scene(input) as never;
          return schema.parse(asDraft(outputs.shift()));
        },
      });
    expect(job.status).toBe("ready");
    const who = decodeURIComponent(cookie.split("=")[1]!).split(".")[0]!;
    await insert(who, "job", job.id, job);
    expect(
      (await read<Job>(who, "job", job.id)).lesson?.challenges[1]?.scene?.kind,
    ).toBe("comparison");
    session = (await (
      await post({ action: "start", lessonId: job.id })
    ).json()) as ResearchSession;
    session = (await (
      await post({ action: "begin", id: session.id, version: session.version })
    ).json()) as ResearchSession;
    expect(session.challenge?.scene?.kind).toBe("flow");
    session = (await (
      await post({
        action: "submit",
        id: session.id,
        version: session.version,
        selected: ["bounded"],
        reasoning: "Observed records, not random assignment",
      })
    ).json()) as ResearchSession;
    expect(session.points).toBe(10);
    session = (await (
      await post({ action: "next", id: session.id, version: session.version })
    ).json()) as ResearchSession;
    expect(session.challenge?.scene?.kind).toBe("comparison");
    if (session.challenge?.scene?.kind === "comparison") {
      expect(session.challenge.scene.values.map((v) => v.value)).toEqual([
        120, 155, 180,
      ]);
      expect(session.challenge.scene.difference).toBeNull();
    }
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    vi.unstubAllEnvs();
  }
});
