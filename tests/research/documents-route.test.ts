import { afterAll, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { Request as ExpressRequest, Response } from "express";
import { requestContext } from "../../apps/api/src/research/auth.js";
import { linkNotePdf } from "../../apps/web/src/research/link-note.js";

const failInsert = vi.hoisted(() => ({ on: false }));
vi.mock("../../apps/api/src/research/store.js", async (original) => {
  const store =
    await original<typeof import("../../apps/api/src/research/store.js")>();
  return {
    ...store,
    insert: (...args: Parameters<typeof store.insert>) =>
      failInsert.on
        ? Promise.reject(Error("database is locked"))
        : store.insert(...args),
  };
});
const { POST } =
  await import("../../apps/api/src/research/routes/documents.js");
const { db, rateLimit } = await import("../../apps/api/src/research/store.js");

const scratch = await mkdtemp(join(tmpdir(), "gradly-documents-"));
vi.stubEnv("DATABASE_URL", `file:${join(scratch, "documents.db")}`);
afterAll(async () => {
  (await db()).close();
  vi.unstubAllEnvs();
  await rm(scratch, { recursive: true, force: true });
});

let cookie = "";
async function upload(file: File) {
  const form = new FormData();
  form.append("file", file);
  const request = new Request("http://localhost/api/research/documents", {
    method: "POST",
    headers: { origin: "http://localhost" },
    body: form,
  });
  return requestContext.run(
    {
      request: { headers: { cookie } } as unknown as ExpressRequest,
      response: {
        cookie: (_name: string, value: string) => {
          cookie = `gradly-research-guest=${value}`;
        },
      } as unknown as Response,
    },
    () => POST(request),
  );
}

it("rejects an unusable file with 400", async () => {
  const response = await upload(
    new File(["plain text"], "notes.pdf", { type: "application/pdf" }),
  );
  expect(response.status).toBe(400);
  expect((await response.json()).error).toMatch(/not a PDF/);
});

it("reports a storage failure as a retryable 500, not a file rejection", async () => {
  failInsert.on = true;
  try {
    const response = await upload(linkNotePdf("https://example.org/paper"));
    expect(response.status).toBe(500);
  } finally {
    failInsert.on = false;
  }
});

it("reports the hourly upload limit as 429", async () => {
  const owner = cookie.slice("gradly-research-guest=".length).split(".")[0]!;
  expect(owner).toMatch(/^[a-f0-9-]{36}$/);
  for (let i = 0; i < 15; i++)
    await rateLimit(owner, "upload", 15).catch(() => {});
  const response = await upload(linkNotePdf("https://example.org/paper"));
  expect(response.status).toBe(429);
  expect((await response.json()).error).toMatch(/limit/);
});

it("lets the upload client retry rate limits and server failures only", async () => {
  const { uploadFailureKind } =
    await import("../../apps/web/src/research/useDocumentUpload.js");
  for (const status of [400, 403, 413, 415, 422])
    expect(uploadFailureKind(status)).toBe("rejected");
  for (const status of [0, 429, 500, 502, 503, 504])
    expect(uploadFailureKind(status)).toBe("interrupted");
});
