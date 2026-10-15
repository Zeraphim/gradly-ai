import { z } from "zod";
import { nebiusConfig } from "../../nebius-config.js";
import { owner, sameOrigin, safeError } from "../auth.js";
import { read, write, rateLimit } from "../store.js";
import { featured } from "../featured.js";
import { currentChallenge, publicSession } from "../engine.js";
import { type Job, type LearningSession } from "../contracts.js";
import { NebiusProvider } from "../provider.js";
export const maxDuration = 240;
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const who = await owner();
    const { id } = z.object({ id: z.string() }).parse(await request.json());
    const s = await read<LearningSession>(who, "session", id);
    const l =
      s.lessonId === featured.id
        ? featured
        : (await read<Job>(who, "job", s.lessonId)).lesson!;
    if (l.source === "demo")
      throw Error(
        "Sample previews use authored guidance. No live AI assessment is performed.",
      );
    const c = currentChallenge(s, l);
    if (!c || !["challenge", "bonus"].includes(s.phase) || !c.writtenReasoning)
      throw Error("No supported active reasoning challenge.");
    const a = s.answers[c.id]?.at(-1);
    if (!a?.reasoning || s.retrying)
      throw Error("Submit written reasoning before requesting AI feedback.");
    await rateLimit("__research_global_ai_budget__", "ai", 120);
    await rateLimit(who, "feedback", 25);
    const schema = z.object({
      category: z.enum([
        "Well Supported",
        "Partially Supported",
        "Needs Reconsideration",
        "Defensible Alternative",
        "Unable to Assess Reliably",
      ]),
      guidance: z.string(),
      followup: z.string(),
      refs: z.array(z.string()),
    });
    const output = await new NebiusProvider().generate(
      "Learning Coach",
      "Evaluate submitted reasoning using only the current permitted evidence and reference guidance. Do not change deterministic scoring. Do not reveal paper identity or future findings. Return concise feedback and a targeted question; mark uncertainty.",
      {
        prompt: c.prompt,
        selected: a.selected,
        reasoning: a.reasoning,
        evidence: c.evidence,
        guide: c.explanation,
        refs: c.refs,
      },
      schema,
    );
    if (output.refs.some((r) => !c.refs.includes(r)))
      throw Error("Feedback contained an unsupported reference.");
    const model = nebiusConfig().modelId;
    const saved = await write(
      who,
      "session",
      id,
      { ...s, aiFeedback: { ...s.aiFeedback, [c.id]: { ...output, model } } },
      s.version,
    );
    return Response.json({
      ...output,
      mode: "live",
      model,
      session: publicSession(saved, l),
    });
  } catch (e) {
    return Response.json(
      {
        error: safeError(e),
        mode: "fallback",
        notice:
          "Your reasoning is saved. Live AI did not assess it; use the reference explanation.",
      },
      { status: 400 },
    );
  }
}
