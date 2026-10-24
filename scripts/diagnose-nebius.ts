// Reproduces the Evidence Analyst stage against live Nebius and prints the raw
// response metadata (never the API key). Usage: npm run diagnose:nebius
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { nebiusConfig } from "../apps/api/src/nebius-config.js";
import { NebiusProvider } from "../apps/api/src/research/provider.js";
import { extractPdf } from "../apps/api/src/research/pdf.js";
import { newJob, runStage } from "../apps/api/src/research/pipeline.js";

if (!process.env.NEBIUS_API_KEY) {
  console.error("NEBIUS_API_KEY is not set (checked env and .env).");
  process.exit(1);
}
process.env.PREVIEW_MODE = "false";
process.env.RESEARCH_ENABLED = "true";
process.env.DATABASE_URL = "file:.data/diagnose.db";

const config = nebiusConfig();
const base = config.baseUrl.replace(/\/$/, "");
console.log("Base URL:       ", base);
console.log("Pipeline model: ", config.pipelineModelId);
console.log("Feedback model: ", config.feedbackModelId);
console.log("PREVIEW_MODE/NEBIUS_MODEL_ID overrides:", {
  NEBIUS_MODEL_ID: process.env.NEBIUS_MODEL_ID ?? null,
  NEBIUS_PIPELINE_MODEL: process.env.NEBIUS_PIPELINE_MODEL ?? null,
  NEBIUS_FEEDBACK_MODEL: process.env.NEBIUS_FEEDBACK_MODEL ?? null,
});

// 1. Is each configured model ID actually listed for this key?
try {
  const r = await fetch(`${base}/models`, {
    headers: { Authorization: `Bearer ${process.env.NEBIUS_API_KEY}` },
  });
  const body = (await r.json()) as { data?: { id: string }[] };
  const ids = body.data?.map((m) => m.id) ?? [];
  console.log(`\n/models -> HTTP ${r.status}, ${ids.length} models`);
  for (const want of [config.pipelineModelId, config.feedbackModelId])
    console.log(`  ${ids.includes(want) ? "listed  " : "MISSING "} ${want}`);
  const nemotron = ids.filter((id) => /nemotron/i.test(id));
  console.log("  Nemotron IDs available:", nemotron);
} catch (e) {
  console.log("/models request failed:", (e as Error).message);
}

// 2. Wrap fetch so the real stage call logs the raw response metadata.
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const started = performance.now();
  const response = await realFetch(input, init);
  const text = await response.clone().text();
  const ms = Math.round(performance.now() - started);
  console.log(`\n--- raw response (${ms} ms) HTTP ${response.status} ---`);
  try {
    const body = JSON.parse(text);
    const choice = body.choices?.[0];
    console.log({
      model: body.model,
      finish_reason: choice?.finish_reason,
      usage: body.usage,
      content_chars: choice?.message?.content?.length ?? null,
      reasoning_chars:
        (choice?.message?.reasoning_content ?? choice?.message?.reasoning)
          ?.length ?? null,
      error: body.error ?? body.detail ?? null,
    });
    console.log(
      "content head:",
      String(choice?.message?.content ?? "").slice(0, 300),
    );
    console.log(
      "content tail:",
      String(choice?.message?.content ?? "").slice(-200),
    );
  } catch {
    console.log("non-JSON body:", text.slice(0, 500));
  }
  return response;
}) as typeof fetch;

// 3. Run Stage 0 exactly as the app does.
const file = resolve("docs/research/papers/doyen-2012-behavioral-priming.pdf");
const pages = await extractPdf(
  new File([readFileSync(file)], "doyen.pdf", { type: "application/pdf" }),
);
let job = newJob(randomUUID(), "doyen.pdf", pages);
job.consented = true;
job.mode = "live";
console.log(
  `\nRunning Stage 0 (${job.audits[0]!.role}) on ${pages.length} pages...`,
);
job = await runStage(job, new NebiusProvider());
console.log("\nResult status:", job.status);
console.log("Stage error:  ", job.error ?? "(none)");
process.exit(job.status === "failed" ? 1 : 0);
