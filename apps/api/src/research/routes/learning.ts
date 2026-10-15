import { demoAvailable } from "../demo.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { owner, sameOrigin, safeError } from "../auth.js";
import { insert, read, write, list, ConflictError } from "../store.js";
import { featured } from "../featured.js";
import {
  newSession,
  submit,
  transition,
  publicSession,
  reviseReasoning,
} from "../engine.js";
import { type Job, type LearningSession } from "../contracts.js";
async function lesson(who: string, id: string) {
  if (id === featured.id) return featured;
  const job = await read<Job>(who, "job", id);
  if (job.status !== "ready" || !job.lesson)
    throw Error("This lesson has not passed verification.");
  if (job.lesson.source === "demo" && !demoAvailable())
    throw Error(
      "Sample previews are disabled. Upload the paper again for live processing.",
    );
  return job.lesson;
}
export async function GET(request: Request) {
  try {
    const who = await owner();
    const id = new URL(request.url).searchParams.get("id");
    if (id) {
      const s = await read<LearningSession>(who, "session", id);
      return Response.json(publicSession(s, await lesson(who, s.lessonId)));
    }
    return Response.json(
      (await list<LearningSession>(who, "session")).map((s) => ({
        id: s.id,
        title: s.title,
        phase: s.phase,
        index: s.index,
        created: s.created,
        source: s.source ?? "featured",
      })),
    );
  } catch (e) {
    return Response.json({ error: safeError(e) }, { status: 400 });
  }
}
const bodySchema = z.object({
  action: z.enum([
    "start",
    "begin",
    "submit",
    "retry",
    "next",
    "bonus",
    "skip",
    "finish",
    "restart",
    "review-missed",
    "revise-reasoning",
  ]),
  id: z.string().optional(),
  lessonId: z.string().optional(),
  version: z.number().int().optional(),
  selected: z.array(z.string()).optional(),
  reasoning: z.string().max(3000).optional(),
  confirmed: z.boolean().optional(),
  reflection: z.string().max(3000).optional(),
});
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const who = await owner();
    const b = bodySchema.parse(await request.json());
    if (b.action === "start") {
      const l = await lesson(who, b.lessonId || featured.id);
      const s = newSession(l, randomUUID());
      await insert(who, "session", s.id, s);
      return Response.json(publicSession(s, l));
    }
    if (!b.id) throw Error("Session identifier required.");
    const s = await read<LearningSession>(who, "session", b.id);
    const l = await lesson(who, s.lessonId);
    if (b.version !== s.version)
      throw new ConflictError(
        "Your saved progress changed. Reload before submitting.",
      );
    if (b.action === "restart" || b.action === "review-missed") {
      if (b.action === "restart" && !b.confirmed)
        throw Error(
          "Confirm before restarting. Your previous adventure will stay in history.",
        );
      const fresh = newSession(l, randomUUID());
      if (b.action === "review-missed") {
        if (s.phase !== "complete")
          throw Error(
            "Finish this adventure before reviewing missed concepts.",
          );
        const ids = l.challenges
          .filter((c) => !s.answers[c.id]?.[0]?.correct)
          .map((c) => c.id);
        if (!ids.length) throw Error("No missed concepts.");
        fresh.reviewIds = ids;
        fresh.phase = "challenge";
        fresh.title = l.title + " — Concept practice";
      }
      await insert(who, "session", fresh.id, fresh);
      return Response.json(publicSession(fresh, l));
    }
    let next =
      b.action === "submit"
        ? submit(s, l, b.selected ?? [], b.reasoning ?? "")
        : b.action === "revise-reasoning"
          ? reviseReasoning(s, l, b.reasoning ?? "")
          : transition(s, l, b.action);
    if (b.action === "finish")
      next = { ...next, reflection: b.reflection ?? "" };
    next = await write(who, "session", s.id, next, s.version);
    return Response.json(publicSession(next, l));
  } catch (e) {
    return Response.json(
      { error: e instanceof z.ZodError ? "Invalid request." : safeError(e) },
      { status: e instanceof ConflictError ? 409 : 400 },
    );
  }
}
