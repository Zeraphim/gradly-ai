import { timingSafeEqual } from "node:crypto";
import { purgeExpired } from "../store.js";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32)
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  const header = request.headers.get("Authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (
    Buffer.byteLength(header) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(header), Buffer.from(expected))
  )
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  try {
    return Response.json(
      { success: true, ...(await purgeExpired()) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Retention cleanup failed. Retry the maintenance request." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
