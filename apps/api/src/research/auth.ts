import { AsyncLocalStorage } from "node:async_hooks";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
export const requestContext = new AsyncLocalStorage<{
  request: Request;
  response: Response;
}>();
export function researchAvailable() {
  return (
    process.env.RESEARCH_ENABLED !== "false" &&
    (!process.env.VERCEL ||
      (process.env.RESEARCH_ENABLED === "true" &&
        !!process.env.DATABASE_URL &&
        !!process.env.DATABASE_AUTH_TOKEN &&
        !process.env.DATABASE_URL.startsWith("file:") &&
        (process.env.SESSION_SECRET?.length ?? 0) >= 32))
  );
}
export async function owner() {
  const context = requestContext.getStore();
  if (!context) throw Error("Research request context is unavailable.");
  if (!researchAvailable())
    throw Error(
      "The research extension requires remote storage and a session secret. The curated adventure remains available.",
    );
  const secret =
    process.env.SESSION_SECRET ||
    (process.env.VERCEL ? "" : "gradly-local-development-only-cookie-secret");
  if (secret.length < 32)
    throw Error("Configure SESSION_SECRET with at least 32 random characters.");
  const sign = (id: string) =>
    createHmac("sha256", secret).update(id).digest("hex");
  const raw = context.request.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("gradly-research-guest="))
    ?.slice("gradly-research-guest=".length);
  if (raw) {
    const [id, sig] = raw.split(".");
    if (
      id &&
      /^[a-f0-9-]{36}$/.test(id) &&
      sig &&
      /^[a-f0-9]{64}$/.test(sig) &&
      timingSafeEqual(Buffer.from(sig), Buffer.from(sign(id)))
    )
      return id;
  }
  const id = randomUUID();
  context.response.cookie("gradly-research-guest", `${id}.${sign(id)}`, {
    httpOnly: true,
    secure: !!process.env.VERCEL,
    sameSite: "strict",
    maxAge: 30 * 86400000,
    path: "/",
  });
  return id;
}
export function sameOrigin(request: globalThis.Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  const devOrigin =
    !process.env.VERCEL &&
    process.env.NODE_ENV !== "production" &&
    ["http://127.0.0.1:5173", "http://localhost:5173"].includes(origin ?? "");
  const configuredOrigin = process.env.APP_ORIGIN;
  if (
    !origin ||
    (new URL(origin).host !== host && !devOrigin && origin !== configuredOrigin)
  )
    throw Error("Use the application’s own page for this request.");
}
export function safeError(error: unknown) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  return message.includes("API key")
    ? "Live AI is not configured. Your reference adventure is still available."
    : message.slice(0, 300);
}
export async function boundedBody(request: globalThis.Request, max: number) {
  if (!request.body) throw Error("Request body is empty.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw Error("Request exceeds the allowed size.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const data = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    data.set(chunk, offset);
    offset += chunk.length;
  }
  return data;
}
