import { randomUUID } from "node:crypto";
import { owner, sameOrigin, safeError, boundedBody } from "../auth.js";
import { extractPdf, uploadLimit } from "../pdf.js";
import { insert, list, read, deleteDocument, rateLimit } from "../store.js";
import { newJob } from "../pipeline.js";
import { type Job } from "../contracts.js";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function GET(request: Request) {
  try {
    const who = await owner();
    const id = new URL(request.url).searchParams.get("id");
    if (id) {
      const job = await read<Job>(who, "job", id);
      return Response.json({ name: job.name, pages: job.pages });
    }
    return Response.json(
      (await list<Job>(who, "job")).map((j) => ({
        id: j.id,
        name: j.name,
        status: j.status,
        pages: j.pages.length,
      })),
    );
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const who = await owner();
    await rateLimit(who, "upload", 15);
    const size = Number(request.headers.get("content-length"));
    if (size > uploadLimit() + 50000)
      throw Error("Upload is too large. Choose a PDF below 4 MB.");
    const bytes = await boundedBody(request, uploadLimit() + 50000);
    const form = await new Response(bytes as BodyInit, {
      headers: { "Content-Type": request.headers.get("Content-Type") ?? "" },
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw Error("Select a PDF first.");
    const pages = await extractPdf(file);
    const id = randomUUID();
    const job = newJob(id, file.name.slice(0, 180), pages);
    await insert(who, "job", id, job);
    return Response.json({
      id,
      name: job.name,
      pageCount: pages.length,
      pages,
      excerpt: pages[0]?.text.slice(0, 1200) ?? "",
      extraction: pages.map((p) => ({
        page: p.page,
        method: p.method ?? "text",
        confidence: p.confidence,
      })),
    });
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    const who = await owner();
    const { id } = await request.json();
    if (typeof id !== "string") throw Error("Document identifier required.");
    await read<Job>(who, "job", id);
    await deleteDocument(who, id);
    return Response.json({ deleted: true });
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
