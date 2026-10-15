import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from "vitest";
import type { Server } from "node:http";
import { randomUUID } from "node:crypto";
import { createApp } from "../../apps/api/src/app.js";
import {
  demoAvailable,
  runDemoStage,
} from "../../apps/api/src/research/demo.js";
import { newJob } from "../../apps/api/src/research/pipeline.js";
import { insert, read } from "../../apps/api/src/research/store.js";
import { NebiusProvider } from "../../apps/api/src/research/provider.js";
let server: Server;
let base: string;
beforeAll(async () => {
  server = createApp({ preview: true }).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
beforeEach(() => {
  vi.stubEnv("DEMO_MODE", "true");
  vi.stubEnv("PREVIEW_MODE", "true");
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("VERCEL", "");
  vi.stubEnv("RESEARCH_ENABLED", "true");
  vi.stubEnv("DATABASE_URL", "file:.data/demo-tests.db");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((e) => (e ? reject(e) : resolve())),
  );
});

it("requires explicit local opt-in and never activates in live or hosted mode", () => {
  expect(demoAvailable()).toBe(true);
  for (const [name, value] of [
    ["DEMO_MODE", "false"],
    ["PREVIEW_MODE", "false"],
    ["VERCEL", "1"],
    ["NODE_ENV", "production"],
  ]) {
    const previous = process.env[name!];
    vi.stubEnv(name!, value!);
    expect(demoAvailable()).toBe(false);
    vi.stubEnv(name!, previous);
  }
});
it("validates a separately labeled sample without inventing findings from an upload", () => {
  const original = newJob("demo", "private-plan.pdf", [
    { page: 1, text: "Private project notes without empirical results" },
  ]);
  expect(() => runDemoStage(original)).toThrow("Confirm");
  let job = { ...original, mode: "demo" as const, consented: true };
  for (let n = 0; n < 5; n++) job = runDemoStage(job) as typeof job;
  expect(job.status).toBe("ready");
  expect(job.lesson?.source).toBe("demo");
  expect(job.lesson?.briefing).toContain("do not describe it");
  expect(JSON.stringify(job.lesson)).not.toContain("Private project notes");
  expect(job.pages).toEqual(original.pages);
  expect(
    job.audits.every(
      (a) => a.status === "Completed" && a.model.includes("no AI call"),
    ),
  ).toBe(true);
});
it("persists the full sample flow, denies mode changes and calls no model", async () => {
  const inference = vi
    .spyOn(NebiusProvider.prototype, "generate")
    .mockRejectedValue(Error("must not call a model"));
  const config = await fetch(base + "/api/research/config");
  const guest = await fetch(base + "/api/research/learning");
  const cookie = guest.headers.get("set-cookie")!.split(";")[0]!;
  // Resolve this guest's signed identifier; all subsequent requests still pass through HTTP ownership checks.
  const who = cookie.split("=")[1]!.split(".")[0]!;
  const id = randomUUID();
  await insert(
    who,
    "job",
    id,
    newJob(id, "notes.pdf", [{ page: 1, text: "Unrelated private plan" }]),
  );
  const post = async (path: string, body: unknown) =>
    fetch(base + path, {
      method: "POST",
      headers: {
        Origin: base,
        Cookie: cookie,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  expect((await config.json()).demoAvailable).toBe(true);
  expect((await post("/api/research/jobs", { id })).status).toBe(400);
  expect(
    (await post("/api/research/jobs", { id, consent: true, mode: "demo" }))
      .status,
  ).toBe(200);
  expect((await post("/api/research/jobs", { id, mode: "live" })).status).toBe(
    400,
  );
  for (let n = 0; n < 5; n++)
    expect((await post("/api/research/jobs", { id })).status).toBe(200);
  const saved = await read<{ status: string; lesson: { source: string } }>(
    who,
    "job",
    id,
  );
  expect(saved.status).toBe("ready");
  expect(saved.lesson.source).toBe("demo");
  const session = await post("/api/research/learning", {
    action: "start",
    lessonId: id,
  });
  expect(session.status).toBe(200);
  expect((await session.json()).source).toBe("demo");
  vi.stubEnv("DEMO_MODE", "false");
  expect(
    (await post("/api/research/learning", { action: "start", lessonId: id }))
      .status,
  ).toBe(400);
  expect((await post("/api/research/jobs", { id })).status).toBe(400);
  expect(inference).not.toHaveBeenCalled();
});
