import { demoAvailable, runDemoStage } from "../demo.js";
import { owner, sameOrigin, safeError } from "../auth.js";
import { read, write, rateLimit, ConflictError } from "../store.js";
import { type Job } from "../contracts.js";
import { runStage, publicJob } from "../pipeline.js";
import { NebiusProvider } from "../provider.js";
export const runtime = "nodejs";
export const maxDuration = 240;
export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw Error("Document identifier required.");
    return Response.json(publicJob(await read<Job>(await owner(), "job", id)));
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const who = await owner();
    const { id, retry, consent, mode } = await request.json();
    if (typeof id !== "string") throw Error("Document identifier required.");
    let j = await read<Job>(who, "job", id);
    if (mode !== undefined && !["demo", "live"].includes(mode))
      throw Error("Choose a supported processing mode.");
    if (j.mode && mode && j.mode !== mode)
      throw Error(
        "Processing mode is fixed for this document. Upload it again to switch modes.",
      );
    if ((j.mode === "demo" || mode === "demo") && !demoAvailable())
      throw Error(
        "Sample preview is disabled. Configure live AI or enable local demo mode.",
      );
    if (consent === true && !j.consented) {
      j.mode = mode === "demo" ? "demo" : "live";
      if (j.mode === "demo")
        j.audits = j.audits.map((a) => ({
          ...a,
          model: "Sample preview • no AI call",
        }));
      j = await write(who, "job", id, { ...j, consented: true }, j.version);
      return Response.json(publicJob(j));
    }
    if (!j.consented)
      throw Error(
        "Confirm sending this document’s extracted text to Nebius before AI processing.",
      );
    if (j.status === "ready") return Response.json(publicJob(j));
    if (j.leaseUntil > Date.now())
      return Response.json(publicJob(j), { status: 202 });
    if (["failed", "review"].includes(j.status) && !retry)
      return Response.json(publicJob(j));
    if (j.mode === "demo") {
      await rateLimit(who, "demo-stage", 100);
      return Response.json(
        publicJob(await write(who, "job", id, runDemoStage(j), j.version)),
      );
    }
    if (!process.env.NEBIUS_API_KEY || process.env.PREVIEW_MODE === "true")
      throw Error("Nebius API key is not configured.");
    await rateLimit("__research_global_ai_budget__", "ai", 120);
    await rateLimit(who, "ai-stage", 40);
    if (retry && j.status === "review") {
      j.stage = 1;
      j.lesson = undefined;
      j.review = undefined;
      for (let i = 1; i < j.audits.length; i++)
        j.audits[i] = {
          ...j.audits[i]!,
          status: "Pending",
          summary: "Waiting for revision.",
        };
    }
    j.status = "processing";
    j.leaseUntil = Date.now() + 230000;
    j.audits[j.stage]!.status = retry ? "Retrying" : "Processing";
    j = await write(who, "job", id, j, j.version);
    const result = await runStage(j, new NebiusProvider());
    const saved = await write(who, "job", id, result, j.version);
    return Response.json(publicJob(saved));
  } catch (e) {
    return Response.json(
      { error: safeError(e) },
      { status: e instanceof ConflictError ? 409 : 400 },
    );
  }
}
