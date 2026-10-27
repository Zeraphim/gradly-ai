import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createApp } from "../apps/api/src/app.js";
import { db } from "../apps/api/src/research/store.js";
import { nebiusConfig } from "../apps/api/src/nebius-config.js";
import { NebiusProvider } from "../apps/api/src/research/provider.js";
import { extractPdf } from "../apps/api/src/research/pdf.js";
import {
  newJob,
  READY_STAGE,
  runStage,
} from "../apps/api/src/research/pipeline.js";
import { type Job, type LearningSession } from "../apps/api/src/research/contracts.js";
import { projectScene } from "@paperquest/contracts";
import { createHmac, randomUUID } from "node:crypto";

const apiKey = process.env.NEBIUS_API_KEY;
if (!apiKey) {
  console.error("❌ NEBIUS_API_KEY is not set in environment or .env file.");
  console.error("Run with: NEBIUS_API_KEY=your-key node --import tsx scripts/run-live-flow.ts");
  process.exit(1);
}

process.env.RESEARCH_ENABLED = "true";
process.env.DATABASE_URL = process.env.DATABASE_URL || "file:.data/live-flow.db";
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "local-dev-session-secret-at-least-32-chars-long-0123456789";
process.env.PREVIEW_MODE = "false";
process.env.DEMO_MODE = "false";

const config = nebiusConfig();

console.log(`\n================================================================`);
console.log(`🚀 GRADLY END-TO-END LIVE MODEL FLOW RUNNER`);
console.log(`================================================================`);
console.log(`Subsystem 1 (Pipeline Model):  ${config.pipelineModelId}`);
console.log(`Subsystem 2 (Feedback Model):  ${config.feedbackModelId}`);
console.log(`Nebius Base URL:               ${config.baseUrl}`);
console.log(`Database:                      ${process.env.DATABASE_URL}`);
console.log(`================================================================\n`);

async function main() {
  const database = await db();
  const provider = new NebiusProvider();

  // 1. Ingest paper from docs/research/papers/
  const paperPath = resolve("docs/research/papers/doyen-2012-behavioral-priming.pdf");
  console.log(`1. Ingesting empirical paper: ${paperPath}...`);
  const fileBytes = readFileSync(paperPath);
  const pdfFile = new File([fileBytes], "doyen-2012-behavioral-priming.pdf", {
    type: "application/pdf",
  });

  const extractStart = performance.now();
  const pages = await extractPdf(pdfFile);
  const extractElapsed = ((performance.now() - extractStart) / 1000).toFixed(2);
  console.log(`   ✅ Extracted ${pages.length} pages in ${extractElapsed}s (~${pages.reduce((acc, p) => acc + p.text.length, 0)} characters).`);

  // 2. Initialize Job
  const jobId = randomUUID();
  let job = newJob(jobId, "doyen-2012-behavioral-priming.pdf", pages);
  job.consented = true;
  job.mode = "live";
  console.log(`   ✅ Created Job [${jobId}] with consent=true, mode=live.\n`);

  // 3. Execute the multi-agent pipeline (pipeline-tier model and budget)
  console.log(`2. Executing ${READY_STAGE}-Stage Multi-Agent Pipeline with ${config.pipelineModelId}...`);
  for (let s = 0; s < READY_STAGE; s++) {
    const role = job.audits[s]!.role;
    console.log(`   ▶ Stage ${s}: ${role}...`);
    const stageStart = performance.now();
    job = await runStage(job, provider);
    const stageElapsed = ((performance.now() - stageStart) / 1000).toFixed(2);

    if (job.status === "failed") {
      console.error(`   ❌ Stage ${s} Failed: ${job.error}`);
      process.exit(1);
    }
    if (job.status === "review") {
      // The app requires an explicit regenerate here; stop rather than
      // re-running stages and reporting them under the wrong label.
      console.error(`   ⚠️ Stage ${s} Flagged for Review: ${job.error}`);
      console.error(
        `   Reviewer issues: ${JSON.stringify(job.review?.issues ?? [])}`,
      );
      process.exit(1);
    } else {
      console.log(`   ✅ Stage ${s} Completed in ${stageElapsed}s: ${job.audits[s]!.summary}`);
    }
  }

  assert.equal(job.status, "ready", "Job should reach ready status");
  console.log(`\n🎉 Quest Generation Complete!`);
  console.log(`   Title:      "${job.lesson!.title}"`);
  console.log(`   Challenges: ${job.lesson!.challenges.length} generated challenges`);
  console.log(`   Scenes:     ${job.lesson!.challenges.filter((c) => c.scene).length} interactive visual scenes`);
  const written = job.lesson!.challenges.filter((c) => c.writtenReasoning).length;
  console.log(`   Written-reasoning challenges: ${written}\n`);
  // Feedback is only offered on written-reasoning challenges and this runner
  // answers challenge 1. Mark it explicitly so the live feedback route runs;
  // the generated output above is reported unmodified.
  if (!job.lesson!.challenges[0]!.writtenReasoning) {
    job.lesson!.challenges[0]!.writtenReasoning = true;
    console.log("   [harness] Challenge 1 marked writtenReasoning=true to exercise feedback.\n");
  }

  // 4. Spin up local Express server to simulate frontend learning session & feedback
  const app = createApp({ preview: false });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const guestId = randomUUID();
    const signature = createHmac("sha256", process.env.SESSION_SECRET!)
      .update(guestId)
      .digest("hex");
    const cookie = `gradly-research-guest=${guestId}.${signature}`;

    // Store job in database
    await database.execute({
      sql: "INSERT INTO records(id,owner,kind,data,updated,expires) VALUES(?,?,?,?,?,?)",
      args: [job.id, guestId, "job", JSON.stringify(job), Date.now(), Date.now() + 86400000],
    });

    // 5. Start learning session
    console.log(`3. Starting learner session (/api/research/learning)...`);
    const startRes = await fetch(`${baseUrl}/api/research/learning`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "start", lessonId: job.id }),
    });
    assert.equal(startRes.status, 200, "Starting session should return 200");
    const session = (await startRes.json()) as LearningSession;
    console.log(`   ✅ Started Session [${session.id}] on generated paper quest.`);

    // 6. Advance briefing -> Challenge 1
    const beginRes = await fetch(`${baseUrl}/api/research/learning`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "begin", id: session.id, version: session.version }),
    });
    assert.equal(beginRes.status, 200);
    const activeSession = await beginRes.json();
    const challenge = activeSession.challenge;
    assert.ok(challenge, "Active challenge should be present");
    console.log(`\n4. Active Challenge 1:`);
    console.log(`   Prompt: "${challenge.prompt}"`);
    console.log(`   Options:`);
    for (const opt of challenge.options) {
      console.log(`     - [${opt.id}] ${opt.text}`);
    }

    if (challenge.scene) {
      console.log(`   Interactive Scene (${challenge.scene.kind}): Validated & projected via projectScene().`);
    }
    for (const t of challenge.terms ?? [])
      console.log(`   Term [${t.source}${t.refs.length ? ` ${t.refs.join(",")}` : ""}] ${t.term}: ${t.definition}`);

    // 7. Submit answer with written reasoning
    const firstOption = challenge.options[0]!.id;
    const testReasoning = "We observed that participant walking speed was measured with automated timing beams to eliminate experimenter bias.";
    console.log(`\n5. Submitting answer & written reasoning...`);
    console.log(`   Selected: Option [${firstOption}]`);
    console.log(`   Reasoning: "${testReasoning}"`);

    const submitRes = await fetch(`${baseUrl}/api/research/learning`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submit",
        id: session.id,
        version: activeSession.version,
        selected: [firstOption],
        reasoning: testReasoning,
      }),
    });
    assert.equal(submitRes.status, 200);
    const submittedSession = await submitRes.json();
    console.log(`   ✅ Answer registered (deterministic check: ${submittedSession.challenge?.feedback?.correct ? "CORRECT" : "NEEDS RETRY"}).`);

    // 8. Request Live AI Reasoning Assessment (using 70B model)
    console.log(`\n6. Requesting Live Socratic Coaching with ${config.feedbackModelId}...`);
    const fbStart = performance.now();
    const fbRes = await fetch(`${baseUrl}/api/research/feedback`, {
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: baseUrl,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.id,
        version: submittedSession.version,
        challengeId: challenge.id,
        reasoningRevision: 0,
      }),
    });

    const fbElapsed = ((performance.now() - fbStart) / 1000).toFixed(2);
    if (!fbRes.ok) {
      console.error(`   ❌ Feedback request failed (${fbRes.status}):`, await fbRes.text());
      process.exit(1);
    }

    const fbData = await fbRes.json();
    console.log(`   ✅ Received live feedback in ${fbElapsed}s (Model: ${fbData.session?.challenge?.aiFeedback?.model || config.feedbackModelId}):`);
    console.log(`   ┌───────────────────────────────────────────────────────────────`);
    console.log(`   │ Category: ${fbData.category}`);
    console.log(`   │ Guidance: ${fbData.guidance}`);
    console.log(`   │ Follow-up: "${fbData.followup}"`);
    console.log(`   └───────────────────────────────────────────────────────────────`);

    console.log(`\n================================================================`);
    console.log(`🎉 END-TO-END FLOW ACROSS BOTH MODELS VERIFIED OPERATIONAL!`);
    console.log(`================================================================\n`);
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error("❌ Live flow execution failed:", err);
  process.exit(1);
});
