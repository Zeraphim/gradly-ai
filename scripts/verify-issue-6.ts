import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import { createApp } from "../apps/api/src/app.js";
import { db } from "../apps/api/src/research/store.js";
import { sceneSchema, projectScene, sceneItems } from "@paperquest/contracts";
import {
  quantitativeSceneLesson,
  qualitativeSceneLesson,
  sceneFixturePages,
} from "../tests/research/fixtures/scene-lessons.js";
import { newJob, runStage } from "../apps/api/src/research/pipeline.js";
import { type Job } from "../apps/api/src/research/contracts.js";
import { type ModelProvider } from "../apps/api/src/research/provider.js";

// 1. Configure local environment
process.env.RESEARCH_ENABLED = "true";
process.env.DATABASE_URL = "file:.data/issue-6-verify.db";
process.env.DATABASE_AUTH_TOKEN = "";
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "local-dev-session-secret-at-least-32-chars-long-0123456789";
process.env.CRON_SECRET =
  process.env.CRON_SECRET ||
  "local-dev-cron-secret-at-least-32-chars-long-9876543210";
process.env.PREVIEW_MODE = "false";
process.env.NEBIUS_API_KEY = "mock-nebius-key-for-local-verification";

async function main() {
  console.log("==========================================================");
  console.log("  ISSUE NO. 6 VERIFICATION: Multi-Stage Pipeline & Scenes");
  console.log("==========================================================\n");

  const revision = execSync("git rev-parse HEAD").toString().trim();
  console.log(`Repository revision: ${revision}`);
  console.log(`Database target:     ${process.env.DATABASE_URL}\n`);

  const database = await db();
  await database.execute("DELETE FROM records");
  await database.execute("DELETE FROM limits");

  // Spin up local Express server
  const app = createApp({ preview: false });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Local test server running at ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // CHECK 1: User consent gating
    // -------------------------------------------------------------------------
    console.log("--- Check 1: User Consent Gating ---");
    const guestId = randomUUID();
    const secret = process.env.SESSION_SECRET!;
    const signature = createHmac("sha256", secret).update(guestId).digest("hex");
    const guestCookie = `gradly-research-guest=${guestId}.${signature}`;

    const jobId = "job-" + Date.now();
    const pages = sceneFixturePages(quantitativeSceneLesson);
    const initialJob = newJob(jobId, "water-use-empirical-study.pdf", pages);

    // Insert job into store directly
    await database.execute({
      sql: "INSERT INTO records(id,owner,kind,data,updated,expires) VALUES(?,?,?,?,?,?)",
      args: [
        jobId,
        guestId,
        "job",
        JSON.stringify(initialJob),
        Date.now(),
        Date.now() + 86400000,
      ],
    });

    // Attempting to advance stage without consent must fail
    const unconsentedRes = await fetch(`${baseUrl}/api/research/jobs`, {
      method: "POST",
      headers: {
        Cookie: guestCookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: jobId }),
    });
    assert.equal(unconsentedRes.status, 400, "Should reject unconsented job");
    const unconsentedData = await unconsentedRes.json();
    assert.ok(
      unconsentedData.error.includes("Confirm sending this document"),
      "Error must explain consent requirement",
    );
    console.log("  [PASS] Unconsented AI pipeline execution rejected with 400.");

    // Provide explicit consent
    const consentRes = await fetch(`${baseUrl}/api/research/jobs`, {
      method: "POST",
      headers: {
        Cookie: guestCookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: jobId, consent: true, mode: "live" }),
    });
    assert.equal(consentRes.status, 200, "Consent submission should succeed");
    const consentedData = await consentRes.json();
    assert.equal(consentedData.consented, true);
    assert.equal(consentedData.mode, "live");
    console.log("  [PASS] Explicit user consent recorded and mode locked to live.\n");

    // -------------------------------------------------------------------------
    // CHECK 2: Sequential 5-Stage Pipeline Execution to Ready
    // -------------------------------------------------------------------------
    console.log("--- Check 2: Sequential 5-Stage Pipeline Execution ---");
    const stageOutputs: unknown[] = [
      // Stage 0: Evidence Analyst
      {
        findings: "Empirical water consumption comparisons between observed districts.",
        refs: quantitativeSceneLesson.evidence,
        missing: [],
      },
      // Stage 1: Lesson Architect
      { ...quantitativeSceneLesson, id: jobId },
      // Stage 2: Methods Reviewer
      {
        approved: true,
        issues: [],
        summary: "Methodological assumptions, district observations, and statistical bounds verified.",
      },
      // Stage 3: Learning Coach
      {
        approved: true,
        issues: [],
        summary: "Challenges provide hint-guided reasoning without spoiling answers.",
      },
      // Stage 4: Deterministic validator
    ];

    const mockProvider: ModelProvider = {
      async generate(_role, _task, _input, schema) {
        const next = stageOutputs.shift();
        return schema.parse(next);
      },
    };

    let currentJob: Job = initialJob;
    currentJob.consented = true;
    currentJob.mode = "live";

    const stageTimings: { stage: number; role: string; durationMs: number }[] = [];

    for (let s = 0; s < 5; s++) {
      const startMs = performance.now();
      currentJob = await runStage(currentJob, mockProvider);
      const elapsed = Number((performance.now() - startMs).toFixed(2));
      stageTimings.push({
        stage: s,
        role: currentJob.audits[s]!.role,
        durationMs: elapsed,
      });
      console.log(
        `  Stage ${s} (${currentJob.audits[s]!.role}): ${currentJob.audits[s]!.status} in ${elapsed}ms`,
      );
    }

    assert.equal(currentJob.status, "ready", "Final job must be ready");
    assert.equal(currentJob.stage, 5, "All 5 stages completed");
    assert.ok(currentJob.lesson, "Lesson must be populated");
    assert.equal(currentJob.audits[4]!.model, "Deterministic validator");
    console.log("  [PASS] All 5 pipeline stages completed sequentially to ready status.\n");

    // -------------------------------------------------------------------------
    // CHECK 3: Scene Validation & Public Projection
    // -------------------------------------------------------------------------
    console.log("--- Check 3: Interactive Scene Validation & Projection ---");
    const comparisonChallenge = currentJob.lesson!.challenges.find(
      (c) => c.scene?.kind === "comparison",
    );
    assert.ok(comparisonChallenge, "Must include a comparison scene challenge");
    const validatedScene = sceneSchema.parse(comparisonChallenge.scene);
    assert.equal(validatedScene.kind, "comparison");
    assert.ok(validatedScene.values.length >= 2, "Comparison scene must have at least 2 values");

    // Project scene before user response (setup gate only)
    const setupProjection = projectScene(
      validatedScene,
      false, // feedback gate closed
      false, // resolution gate closed
      comparisonChallenge.options.map((o) => o.id),
      comparisonChallenge.refs,
    );
    assert.ok(setupProjection, "Scene must project cleanly");
    assert.equal(setupProjection.kind, "comparison");
    if (setupProjection.kind === "comparison") {
      assert.equal(setupProjection.difference, null, "Difference must be hidden during setup");
    }
    assert.equal(setupProjection.resolution, null, "Resolution must be hidden during setup");

    // Project scene after user response (feedback gate open)
    const feedbackProjection = projectScene(
      validatedScene,
      true, // feedback gate open
      false,
      comparisonChallenge.options.map((o) => o.id),
      comparisonChallenge.refs,
    );
    assert.ok(feedbackProjection);
    assert.equal(feedbackProjection.kind, "comparison");
    if (feedbackProjection.kind === "comparison") {
      assert.ok(feedbackProjection.difference !== null, "Difference must be visible after answer feedback");
    }

    console.log("  [PASS] Interactive ComparisonScene validated and correctly gated by projectScene().\n");

    // -------------------------------------------------------------------------
    // CHECK 4: Methods Reviewer Rejection Handling
    // -------------------------------------------------------------------------
    console.log("--- Check 4: Methods Reviewer Rejection Boundary ---");
    const rejectJobId = "job-reject-" + Date.now();
    let rejectJob = newJob(rejectJobId, "unsupported-claims.pdf", pages);
    rejectJob.consented = true;
    rejectJob.mode = "live";

    const rejectingProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Findings",
            refs: quantitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          return schema.parse({ ...quantitativeSceneLesson, id: rejectJobId });
        }
        if (task.includes("Check whether decisions and interpretations fit")) {
          return schema.parse({
            approved: false,
            issues: ["Observed district correlation is incorrectly reported as causal intervention."],
            summary: "Causal claim rejected on non-randomized observational design.",
          });
        }
        throw new Error("Unexpected stage in rejection check");
      },
    };

    // Run stage 0, 1, 2
    rejectJob = await runStage(rejectJob, rejectingProvider); // Stage 0
    rejectJob = await runStage(rejectJob, rejectingProvider); // Stage 1
    rejectJob = await runStage(rejectJob, rejectingProvider); // Stage 2 (rejection)

    assert.equal(rejectJob.status, "review", "Flagged lesson must be placed in review");
    assert.equal(rejectJob.stage, 2);
    assert.equal(rejectJob.audits[2]!.status, "Needs Review");
    assert.ok(
      rejectJob.error?.includes("Observed district correlation is incorrectly reported"),
      "Error must explain method review failure",
    );
    console.log("  [PASS] Methodological violation halted pipeline with status='review' and honest audit.\n");

    // -------------------------------------------------------------------------
    // CHECK 5: Stage Interruption, Resume & Preserved Live Mode
    // -------------------------------------------------------------------------
    console.log("--- Check 5: Interruption Resilience & Live Mode Preservation ---");
    const failJobId = "job-fail-" + Date.now();
    let failJob = newJob(failJobId, "interrupted-paper.pdf", pages);
    failJob.consented = true;
    failJob.mode = "live";

    let attemptCount = 0;
    const resilientProvider: ModelProvider = {
      async generate(_role, task, _input, schema) {
        if (task.includes("Locate exact page-linked evidence")) {
          return schema.parse({
            findings: "Evidence gathered",
            refs: quantitativeSceneLesson.evidence,
            missing: [],
          });
        }
        if (task.includes("Create a sequential investigation")) {
          attemptCount++;
          if (attemptCount === 1) {
            throw new Error("Nebius 503 Service Unavailable");
          }
          return schema.parse({ ...quantitativeSceneLesson, id: failJobId });
        }
        throw new Error("Unexpected stage");
      },
    };

    // Stage 0 completes
    failJob = await runStage(failJob, resilientProvider);
    assert.equal(failJob.stage, 1);

    // Stage 1 encounters simulated 503
    failJob = await runStage(failJob, resilientProvider);
    assert.equal(failJob.status, "failed");
    assert.equal(failJob.stage, 1);
    assert.equal(failJob.mode, "live", "Failed job must NOT convert to demo mode");
    assert.ok(failJob.error?.includes("503 Service Unavailable"));

    // Retry stage 1
    failJob = await runStage(failJob, resilientProvider);
    assert.equal(failJob.status, "pending");
    assert.equal(failJob.stage, 2);
    assert.equal(failJob.mode, "live");
    assert.equal(failJob.error, undefined, "Error must be cleared on successful retry");
    console.log("  [PASS] Interrupted stage cleanly recovered on retry without losing live mode.\n");

    // -------------------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------------------
    console.log("==========================================================");
    console.log("  ALL ISSUE NO. 6 ACCEPTANCE CRITERIA VERIFIED LOCALLY!");
    console.log("==========================================================");
    console.log("✓ User consent is strictly gated before sending document text.");
    console.log("✓ Sequential 5-stage pipeline completes to ready status.");
    console.log("✓ Interactive ComparisonScene data validated against schema.");
    console.log("✓ projectScene() guards unrevealed difference & resolution nodes.");
    console.log("✓ Methods reviewer rejection halts lesson with status='review'.");
    console.log("✓ Interrupted stages retry successfully without falling back to demo mode.");
    console.log("==========================================================\n");
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
