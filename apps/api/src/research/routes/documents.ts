import { randomUUID } from "node:crypto";
import { owner, sameOrigin, safeError, boundedBody } from "../auth.js";
import { extractPdf, uploadLimit } from "../pdf.js";
import {
  insert,
  list,
  read,
  deleteDocument,
  rateLimit,
  RateLimitError,
} from "../store.js";
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
        mode: j.mode ?? "live",
        pages: j.pages.length,
      })),
    );
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
// The upload itself can't be used (4xx). Rate limits are 429 and anything
// else is a server failure (5xx), so the client can offer a retry.
class RejectedUpload extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
export async function POST(request: Request) {
  try {
    try {
      sameOrigin(request);
    } catch (e) {
      throw new RejectedUpload(safeError(e), 403);
    }
    const who = await owner();
    await rateLimit(who, "upload", 15);
    const size = Number(request.headers.get("content-length"));
    if (size > uploadLimit() + 50000)
      throw new RejectedUpload(
        "Upload is too large. Choose a PDF below 4 MB.",
        413,
      );
    const bytes = await boundedBody(request, uploadLimit() + 50000).catch(
      (e: unknown) => {
        const message = safeError(e);
        throw new RejectedUpload(
          message,
          /allowed size/.test(message) ? 413 : 400,
        );
      },
    );
    const form = await new Response(bytes as BodyInit, {
      headers: { "Content-Type": request.headers.get("Content-Type") ?? "" },
    })
      .formData()
      .catch(() => {
        throw new RejectedUpload("Select a PDF first.");
      });
    const file = form.get("file");
    if (!(file instanceof File))
      throw new RejectedUpload("Select a PDF first.");
    const pages = await extractPdf(file).catch((e: unknown) => {
      throw new RejectedUpload(safeError(e));
    });
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
    return Response.json(
      { error: safeError(e) },
      {
        status:
          e instanceof RejectedUpload
            ? e.status
            : e instanceof RateLimitError
              ? 429
              : 500,
      },
    );
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
