import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST as jobsPost } from "../../apps/api/src/research/routes/jobs.js";
import { POST as learningPost } from "../../apps/api/src/research/routes/learning.js";
import { newJob } from "../../apps/api/src/research/pipeline.js";
import { insert, read, db } from "../../apps/api/src/research/store.js";
import { requestContext } from "../../apps/api/src/research/auth.js";
import { type Job } from "../../apps/api/src/research/contracts.js";
import { type ModelProvider } from "../../apps/api/src/research/provider.js";
import { sceneSchema } from "@paperquest/contracts";
import {
  quantitativeSceneLesson,
  qualitativeSceneLesson,
  sceneFixturePages,
} from "./fixtures/scene-lessons.js";

const testGuest = "guest-pipe-0000-0000-0000-000000000000";

function withGuest<T>(ownerId: string, fn: () => Promise<T>): Promise<T> {
  const req = {
    headers: {
      cookie: `gradly-research-guest=${ownerId}.mocksignature`,
    },
  } as any;
  const res = {
    cookie: vi.fn(),
  } as any;
  return requestContext.run({ request: req, response: res }, fn);
}

vi.mock("../../apps/api/src/research/auth.js", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    sameOrigin: vi.fn(),
    owner: vi.fn(async () => {
      const store = actual.requestContext.getStore();
      const raw = store?.request.headers.cookie?.match(
        /gradly-research-guest=([^.]+)/,
      );
      return raw ? raw[1] : testGuest;
    }),
  };
});

beforeEach(async () => {
  process.env.RESEARCH_ENABLED = "true";
  process.env.DATABASE_URL = "file:.data/pipeline-scene.db";
  process.env.DATABASE_AUTH_TOKEN = "";
  process.env.SESSION_SECRET =
    "local-test-session-secret-at-least-32-chars-long-0123456789";
  process.env.PREVIEW_MODE = "false";
  process.env.NEBIUS_API_KEY = "mock-nebius-api-key-for-provider";
  const d = await db();
  await d.execute("DELETE FROM limits");
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Issue No. 6: Sequential Pipeline & Scene Generation Lifecycle", () => {
  it("enforces consent before starting AI processing", async () => {
    const jobId = "consent-" + Math.random().toString(36).slice(2);
    const job = newJob(jobId, "study.pdf", [
      { page: 1, text: "Empirical paper content on cognition." },
    ]);
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    // Attempting to advance stage without consent throws error
    const reqWithoutConsent = new Request("http://localhost/api/research/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
      },
      body: JSON.stringify({ id: job.id }),
    });
    const resWithoutConsent = await withGuest(testGuest, () =>
      jobsPost(reqWithoutConsent),
    );
    expect(resWithoutConsent.status).toBe(400);
    const dataNoConsent = await resWithoutConsent.json();
    expect(dataNoConsent.error).toContain("Confirm sending this document");

    // Providing explicit consent transitions job to consented
    const reqConsent = new Request("http://localhost/api/research/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
      },
      body: JSON.stringify({ id: job.id, consent: true, mode: "live" }),
    });
    const resConsent = await withGuest(testGuest, () => jobsPost(reqConsent));
    expect(resConsent.status).toBe(200);
    const consentedJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(consentedJob.consented).toBe(true);
    expect(consentedJob.mode).toBe("live");
  });

  it("advances sequentially through all 5 stages to produce a ready lesson with interactive scenes", async () => {
    const jobId = "full-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative-paper.pdf", pages);
    job.consented = true;
    job.mode = "live";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    // Mock outputs for each stage
    const stageOutputs: unknown[] = [
      // Stage 0: Evidence Analyst
      {
        findings: "Statistical comparison of quiet vs noisy environments.",
        refs: quantitativeSceneLesson.evidence,
        missing: [],
      },
      // Stage 1: Lesson Architect
      { ...quantitativeSceneLesson, id: jobId },
      // Stage 2: Methods Reviewer
      {
        approved: true,
        issues: [],
        summary: "Methodological design and statistical assumptions verified.",
      },
      // Stage 3: Learning Coach
      {
        approved: true,
        issues: [],
        summary: "Hints and guided feedback promote critical reasoning.",
      },
      // Stage 4: Deterministic validator runs locally without provider call
    ];

    const mockProvider: ModelProvider = {
      async generate(_role, _task, _input, schema) {
        const next = stageOutputs.shift();
        return schema.parse(next);
      },
    };

    // Execute each of the 5 stages sequentially via route
    for (let s = 0; s < 5; s++) {
      const req = new Request("http://localhost/api/research/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost",
        },
        body: JSON.stringify({ id: job.id }),
      });
      const res = await withGuest(testGuest, () => jobsPost(req, mockProvider));
      expect(res.status).toBe(200);
      const payload = await res.json();
      if (s < 4) {
        expect(payload.stage).toBe(s + 1);
      }
    }

    // Check final job state in database
    const finalJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(finalJob.status).toBe("ready");
    expect(finalJob.stage).toBe(5);
    expect(finalJob.lesson).toBeDefined();
    expect(finalJob.lesson?.title).toBe(quantitativeSceneLesson.title);

    // Verify all audits are completed and reflect honest models
    expect(finalJob.audits.every((a) => a.status === "Completed")).toBe(true);
    expect(finalJob.audits[4]!.model).toBe("Deterministic validator");

    // Verify that the generated scene stores cleanly and is valid
    const comparisonChallenge = finalJob.lesson!.challenges.find(
      (c) => c.scene?.kind === "comparison",
    );
    expect(comparisonChallenge).toBeDefined();
    expect(sceneSchema.safeParse(comparisonChallenge!.scene).success).toBe(true);
  });

  it("handles Methods Reviewer rejection by setting status to review and prevents lesson playability", async () => {
    const jobId = "reject-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(qualitativeSceneLesson);
    const job = newJob(jobId, "qualitative.pdf", pages);
    job.consented = true;
    job.mode = "live";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    const mockProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Qualitative interview evidence.",
            refs: qualitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          return schema.parse({ ...qualitativeSceneLesson, id: jobId });
        }
        if (task.includes("Check whether decisions and interpretations fit")) {
          // Reviewer rejects due to causal overclaiming
          return schema.parse({
            approved: false,
            issues: ["Association cannot be framed as causal navigation improvement."],
            summary: "Causal language rejected in qualitative thematic study.",
          });
        }
        throw new Error("Unexpected stage invoked");
      },
    };

    // Stage 0: Evidence
    await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        mockProvider,
      ),
    );

    // Stage 1: Lesson Architect
    await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        mockProvider,
      ),
    );

    // Stage 2: Methods Reviewer (Rejects)
    const resReview = await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        mockProvider,
      ),
    );
    expect(resReview.status).toBe(200);

    const reviewedJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(reviewedJob.status).toBe("review");
    expect(reviewedJob.stage).toBe(2);
    expect(reviewedJob.audits[2]!.status).toBe("Needs Review");
    expect(reviewedJob.error).toContain("Association cannot be framed as causal");

    // Attempting to start a session on a lesson in review MUST be rejected
    const startReq = new Request("http://localhost/api/research/learning", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
      },
      body: JSON.stringify({ action: "start", lessonId: job.id }),
    });
    const startRes = await withGuest(testGuest, () => learningPost(startReq));
    expect(startRes.status).toBe(400);
    const errData = await startRes.json();
    expect(errData.error).toContain("This lesson has not passed verification");
  });

  it("retry mechanism resets to stage 1 upon review rejection without switching live mode to demo", async () => {
    const jobId = "retry-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative.pdf", pages);
    job.consented = true;
    job.mode = "live";
    job.status = "review";
    job.stage = 2;
    job.evidence = {
      findings: "Original verified evidence",
      refs: quantitativeSceneLesson.evidence,
      missing: [],
    };
    job.lesson = { ...quantitativeSceneLesson, id: jobId };
    job.audits[0]!.status = "Completed";
    job.audits[1]!.status = "Completed";
    job.audits[2]!.status = "Needs Review";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    const mockProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Create a sequential investigation")) {
          // Returns revised lesson
          return schema.parse({ ...quantitativeSceneLesson, id: jobId });
        }
        throw new Error("Unexpected stage during retry");
      },
    };

    // Learner triggers retry from review state
    const retryReq = new Request("http://localhost/api/research/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost",
      },
      body: JSON.stringify({ id: job.id, retry: true }),
    });
    const retryRes = await withGuest(testGuest, () =>
      jobsPost(retryReq, mockProvider),
    );
    expect(retryRes.status).toBe(200);

    const recoveredJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    // Preserved live mode (never demo)
    expect(recoveredJob.mode).toBe("live");
    // Stage advanced to 2 after successfully re-running stage 1
    expect(recoveredJob.stage).toBe(2);
    // Evidence from stage 0 was preserved
    expect(recoveredJob.evidence?.findings).toBe("Original verified evidence");
  });

  it("public session projection guards unrevealed scene difference and resolution nodes", async () => {
    const jobId = "proj-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative.pdf", pages);
    job.consented = true;
    job.status = "ready";
    job.stage = 5;
    job.lesson = { ...quantitativeSceneLesson, id: jobId };
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    // Start learning session on this ready lesson
    const startRes = await withGuest(testGuest, () =>
      learningPost(
        new Request("http://localhost/api/research/learning", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ action: "start", lessonId: job.id }),
        }),
      ),
    );
    expect(startRes.status).toBe(200);
    const sessionData = await startRes.json();
    const sessionId = sessionData.id;

    // Transition briefing -> challenge 1 (flow scene)
    const beginRes = await withGuest(testGuest, () =>
      learningPost(
        new Request("http://localhost/api/research/learning", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({
            action: "begin",
            id: sessionId,
            version: sessionData.version,
          }),
        }),
      ),
    );
    expect(beginRes.status).toBe(200);
    const activeSession = await beginRes.json();

    // Verify projected scene for active challenge
    const scene = activeSession.challenge?.scene;
    expect(scene).toBeDefined();
    expect(scene.kind).toBe("flow");
    expect(scene.nodes.length).toBeGreaterThan(0);

    // Confirm that setup elements are present
    const setupNodes = scene.nodes.filter(
      (s: any) => s.at === "setup",
    );
    expect(setupNodes.length).toBeGreaterThanOrEqual(2);

    // Confirm resolution items are NOT projected before user answer submission
    expect(scene.resolution).toBeNull();
  });

  it("handles Learning Coach rejection by setting status to review", async () => {
    const jobId = "coach-rej-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative.pdf", pages);
    job.consented = true;
    job.mode = "live";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    const mockProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Findings",
            refs: quantitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          return schema.parse({ ...quantitativeSceneLesson, id: jobId });
        }
        if (task.includes("Check whether decisions and interpretations fit")) {
          return schema.parse({
            approved: true,
            issues: [],
            summary: "Methods approved.",
          });
        }
        if (task.includes("Check that feedback supports revision")) {
          // Coach rejects: hint gives away the answer
          return schema.parse({
            approved: false,
            issues: ["Hint reveals the correct answer directly instead of teaching reasoning."],
            summary: "Coaching review rejected unguided spoiler hint.",
          });
        }
        throw new Error("Unexpected stage");
      },
    };

    // Run stages 0, 1, 2, 3
    for (let s = 0; s < 4; s++) {
      await withGuest(testGuest, () =>
        jobsPost(
          new Request("http://localhost/api/research/jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Origin: "http://localhost",
            },
            body: JSON.stringify({ id: job.id }),
          }),
          mockProvider,
        ),
      );
    }

    const reviewedJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(reviewedJob.status).toBe("review");
    expect(reviewedJob.stage).toBe(3);
    expect(reviewedJob.audits[3]!.status).toBe("Needs Review");
    expect(reviewedJob.error).toContain("Hint reveals the correct answer");
  });

  it("fails explicitly when model outputs malformed scene schema", async () => {
    const jobId = "malformed-scene-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative.pdf", pages);
    job.consented = true;
    job.mode = "live";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    const malformedLesson = structuredClone(quantitativeSceneLesson);
    // Malformed scene version
    (malformedLesson.challenges[0]!.scene as any).version = 999;

    const mockProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Evidence",
            refs: quantitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          return malformedLesson as any;
        }
        throw new Error("Unexpected stage");
      },
    };

    // Stage 0 completes
    await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        mockProvider,
      ),
    );

    // Stage 1 encounters malformed scene schema
    const stage1Res = await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        mockProvider,
      ),
    );
    expect(stage1Res.status).toBe(200);

    const failedJob = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(failedJob.status).toBe("failed");
    expect(failedJob.stage).toBe(1);
    expect(failedJob.audits[1]!.status).toBe("Failed");
  });

  it("preserves stage progress and live mode across provider transport failure and retry", async () => {
    const jobId = "transport-fail-" + Math.random().toString(36).slice(2);
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const job = newJob(jobId, "quantitative.pdf", pages);
    job.consented = true;
    job.mode = "live";
    await withGuest(testGuest, () => insert(testGuest, "job", job.id, job));

    let attempts = 0;
    const failingProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Evidence",
            refs: quantitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          attempts++;
          if (attempts === 1) {
            throw new Error("Nebius 503 Service Unavailable");
          }
          return schema.parse({ ...quantitativeSceneLesson, id: jobId });
        }
        throw new Error("Unexpected stage");
      },
    };

    // Stage 0 succeeds
    await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        failingProvider,
      ),
    );

    // Stage 1 fails with 503
    const failRes = await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id }),
        }),
        failingProvider,
      ),
    );
    expect(failRes.status).toBe(200);

    const failedState = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(failedState.status).toBe("failed");
    expect(failedState.mode).toBe("live"); // Never converts to demo!
    expect(failedState.stage).toBe(1);
    expect(failedState.error).toContain("503 Service Unavailable");

    // Retry stage 1
    const retryRes = await withGuest(testGuest, () =>
      jobsPost(
        new Request("http://localhost/api/research/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://localhost",
          },
          body: JSON.stringify({ id: job.id, retry: true }),
        }),
        failingProvider,
      ),
    );
    expect(retryRes.status).toBe(200);

    const recoveredState = await withGuest(testGuest, () =>
      read<Job>(testGuest, "job", job.id),
    );
    expect(recoveredState.status).toBe("pending");
    expect(recoveredState.stage).toBe(2);
    expect(recoveredState.mode).toBe("live");
    expect(recoveredState.error).toBeUndefined();
  });
});
