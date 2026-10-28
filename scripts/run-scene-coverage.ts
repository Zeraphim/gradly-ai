// Dev-only, billed. Runs the full live pipeline on stored papers the way the
// app does (each stage in turn, with the same automatic retries and redraft)
// and reports how many challenges play as a scene, how many of those the
// model wrote, which kinds it used and how long the Scene Designer took.
//
//   npm run test:scenes                                  the default eight papers
//   npm run test:scenes -- --papers a.pdf,b.pdf --concurrency 2
// Writes .data/scene-coverage.json beside the printed table.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { isEvidenceScene, type Scene } from "@paperquest/contracts";
import { extractPdf } from "../apps/api/src/research/pdf.js";
import {
  autoRecover,
  newJob,
  READY_STAGE,
  runStage,
  STAGES,
} from "../apps/api/src/research/pipeline.js";
import { NebiusProvider } from "../apps/api/src/research/provider.js";
import { nebiusConfig } from "../apps/api/src/nebius-config.js";
import type { Job } from "../apps/api/src/research/contracts.js";

const defaults = [
  "doyen-2012-behavioral-priming.pdf",
  "rohrer-2021-seating-friendships.pdf",
  "gao-2021-breakfast-academic-achievement.pdf",
  "bonsaksen-2025-social-media-sleep-problems.pdf",
  "carruth-2023-willpower-ego-depletion-replication.pdf",
  "mcnabb-2016-smartphone-driving.pdf",
  "fu-2022-hearing-loss-loneliness.pdf",
  "mundt-2020-straw-default-nudge.pdf",
];
const { values } = parseArgs({
  options: {
    papers: { type: "string" },
    concurrency: { type: "string", default: "2" },
  },
});
const papers = values.papers
  ? values.papers.split(",").map((p) => p.trim())
  : defaults;

type Row = {
  paper: string;
  status: string;
  challenges: number;
  interactive: number;
  written: number;
  evidence: number;
  kinds: string[];
  styles: string[];
  sceneStage: string;
  sceneSeconds: number | null;
  totalSeconds: number;
  error?: string;
};

async function run(file: string): Promise<Row> {
  const started = performance.now();
  const bytes = readFileSync(resolve("docs/research/papers", file));
  const pages = await extractPdf(
    new File([bytes], file, { type: "application/pdf" }),
  );
  let job: Job = {
    ...newJob(crypto.randomUUID(), file, pages),
    consented: true,
    mode: "live",
  };
  const provider = new NebiusProvider();
  let sceneSeconds: number | null = null;
  // The browser runs each pending stage; failures retry and a rejected lesson
  // is redrafted once, as autoRecover decides. A stage that stops for the
  // learner, such as after a timeout, is retried twice as a learner would.
  let learnerRetries = 0;
  for (let steps = 0; steps < 30; steps++) {
    if (job.status === "failed" && learnerRetries < 2) {
      learnerRetries++;
      job = { ...job, status: "pending" };
      delete job.autoRetries;
    }
    if (job.status !== "pending") break;
    const before = job;
    const t = performance.now();
    job = autoRecover(before, await runStage(before, provider));
    if (before.stage === STAGES.scenes && job.stage > before.stage)
      sceneSeconds = Math.round((performance.now() - t) / 1000);
    console.log(
      `${file}: stage ${before.stage} ${before.audits[before.stage]?.role} → ${job.status} in ${Math.round((performance.now() - t) / 1000)}s: ${(job.audits[before.stage]?.summary ?? "").slice(0, 220)}`,
    );
  }
  const all = job.lesson
    ? [
        ...job.lesson.challenges,
        ...(job.lesson.bonus ? [job.lesson.bonus] : []),
      ]
    : [];
  const scened = all.filter((c) => c.scene);
  const evidence = scened.filter((c) => isEvidenceScene(c.scene));
  return {
    paper: file,
    status: job.stage === READY_STAGE ? "ready" : job.status,
    challenges: all.length,
    interactive: scened.length,
    written: scened.length - evidence.length,
    evidence: evidence.length,
    kinds: all.map((c) =>
      c.scene
        ? isEvidenceScene(c.scene)
          ? "evidence"
          : (c.scene as Scene).kind
        : "plain",
    ),
    styles: all.map((c) => c.responseStyle ?? "cards"),
    sceneStage: job.audits[STAGES.scenes]?.summary ?? "",
    sceneSeconds,
    totalSeconds: Math.round((performance.now() - started) / 1000),
    ...(job.error ? { error: job.error } : {}),
  };
}

if (!process.env.NEBIUS_API_KEY) throw Error("NEBIUS_API_KEY is not set.");
console.log(
  `Running ${papers.length} papers with ${nebiusConfig().pipelineModelId}.`,
);
const queue = [...papers];
const rows: Row[] = [];
const worker = async () => {
  for (let file = queue.shift(); file; file = queue.shift())
    try {
      rows.push(await run(file));
    } catch (e) {
      console.error(`${file}: failed: ${e instanceof Error ? e.message : e}`);
    }
};
await Promise.all(Array.from({ length: Number(values.concurrency) }, worker));
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);
console.log(
  "\n| Paper | Status | Interactive | Model-written | Kinds | Scene stage |",
);
console.log("|---|---|---|---|---|---|");
for (const r of rows)
  console.log(
    `| ${r.paper.replace(/\.pdf$/, "")} | ${r.status} | ${r.interactive}/${r.challenges} (${pct(r.interactive, r.challenges)}%) | ${r.written}/${r.challenges} (${pct(r.written, r.challenges)}%) | ${r.kinds.join(", ")} | ${r.sceneSeconds ?? "–"}s |`,
  );
const total = rows.reduce((n, r) => n + r.challenges, 0);
const interactive = rows.reduce((n, r) => n + r.interactive, 0);
const written = rows.reduce((n, r) => n + r.written, 0);
console.log(
  `\nAll: ${interactive}/${total} interactive (${pct(interactive, total)}%), ${written}/${total} model-written (${pct(written, total)}%).`,
);
mkdirSync(".data", { recursive: true });
writeFileSync(
  join(".data", "scene-coverage.json"),
  JSON.stringify(rows, null, 2),
);
