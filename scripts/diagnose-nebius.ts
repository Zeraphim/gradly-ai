// Reproduces the Evidence Analyst stage, then the Lesson Architect stage
// (stage 1) against live Nebius and prints the raw response metadata and
// upstream error bodies (never the API key). Usage: npm run diagnose:nebius
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { sceneSchema } from "@paperquest/contracts";
import { nebiusConfig } from "../apps/api/src/nebius-config.js";
import { NebiusProvider } from "../apps/api/src/research/provider.js";
import { extractPdf } from "../apps/api/src/research/pdf.js";
import { newJob, runStage } from "../apps/api/src/research/pipeline.js";
import { lessonSchema } from "../apps/api/src/research/contracts.js";

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

// 4. Schema-feature isolation ladder for the Lesson Architect 500. Each
//    rung sends a real stage-1 request with one schema feature removed; the
//    rungs bracket the culprit. Cheap: failing requests die in ~1s.
function minimalCompletion(body: Record<string, unknown>) {
  return realFetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(110000),
  });
}
async function probe(label: string, schema: unknown) {
  const body = {
    model: config.pipelineModelId,
    temperature: 0.2,
    max_tokens: 32000,
    messages: [
      {
        role: "system",
        content: "Return JSON matching the provided schema. Be terse.",
      },
      { role: "user", content: "Draft a one-challenge lesson about priming." },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "gradly_output", strict: true, schema },
    },
  };
  try {
    const r = await minimalCompletion(body);
    const mark = r.status === 200 ? "OK     " : `HTTP ${r.status}`;
    console.log(`  ${mark}  ${label}`);
    return r.status === 200;
  } catch (e) {
    console.log(`  ERROR   ${label}: ${(e as Error).message}`);
    return false;
  }
}

/** Stage-1 lesson schema with one feature family stripped at a time. */
function lessonSchemaWithout(strip: "scenes" | "record" | "unions") {
  const base = z.object({
    title: z.string(),
    briefing: z.string(),
    challenges: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          type: z.enum(["single", "multiple"]),
          prompt: z.string(),
          options: z.array(z.object({ id: z.string(), text: z.string() })),
          accepted: z.array(z.string()),
          hint: z.string(),
          explanation: z.string(),
          refs: z.array(z.string()),
          writtenReasoning: z.boolean(),
          reveal: z.enum(["design", "results", "interpretation"]),
          ...(strip === "scenes" ? {} : { scene: sceneSchema.nullable() }),
          ...(strip === "record"
            ? {}
            : { misconceptions: z.record(z.string(), z.string()) }),
        }),
      )
      .min(1)
      .max(3),
  });
  if (strip === "unions") {
    // Same shape but every enum/discriminated union replaced by string.
    return z.toJSONSchema(
      z.object({
        title: z.string(),
        briefing: z.string(),
        challenges: z
          .array(
            z.object({
              id: z.string(),
              title: z.string(),
              type: z.string(),
              prompt: z.string(),
              options: z.array(z.object({ id: z.string(), text: z.string() })),
              accepted: z.array(z.string()),
              hint: z.string(),
              explanation: z.string(),
              refs: z.array(z.string()),
              writtenReasoning: z.boolean(),
              reveal: z.string(),
              scene: z
                .object({
                  kind: z.string(),
                  title: z.string(),
                  instruction: z.string(),
                  description: z.string(),
                  responses: z.array(
                    z.object({ optionId: z.string(), label: z.string() }),
                  ),
                })
                .nullable(),
              misconceptions: z.record(z.string(), z.string()),
            }),
          )
          .min(1)
          .max(3),
      }),
    );
  }
  return z.toJSONSchema(base);
}

async function runLadder() {
  console.log("\nSchema-feature isolation ladder (Lesson Architect schema):");
  await probe("full lesson schema (control)", z.toJSONSchema(lessonSchema));
  await probe(
    "lesson schema without scenes",
    lessonSchemaWithout("scenes"),
  );
  await probe(
    "lesson schema without record (misconceptions)",
    lessonSchemaWithout("record"),
  );
  await probe(
    "lesson schema without unions/enums",
    lessonSchemaWithout("unions"),
  );
}


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
console.log("\nStage 0 result:", job.status);
console.log("Stage error:  ", job.error ?? "(none)");
if (job.status === "failed") {
  console.log("\nRetrying stage 0 once...");
  job = await runStage(
    { ...job, status: "pending", error: undefined },
    new NebiusProvider(),
  );
  console.log("\nStage 0 retry result:", job.status);
  console.log("Stage error:  ", job.error ?? "(none)");
}
if (job.status !== "failed") {
  console.log(
    `\nRunning Stage 1 (${job.audits[1]!.role}) with the same evidence...`,
  );
  job = await runStage(job, new NebiusProvider());
  console.log("\nStage 1 result:", job.status);
  console.log("Stage error:  ", job.error ?? "(none)");
  if (job.status === "failed") {
    console.log("errorCode:   ", job.audits[1]?.errorCode ?? "(none)");
    await runLadder();
  } else console.log("Challenges:  ", job.lesson?.challenges.length);
}
process.exit(job.status === "failed" ? 1 : 0);
