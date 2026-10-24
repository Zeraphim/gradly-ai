import { z } from "zod";
import { nebiusConfig } from "../../nebius-config.js";
import { owner, sameOrigin, safeError } from "../auth.js";
import { read, write, rateLimit, ConflictError } from "../store.js";
import { featured } from "../featured.js";
import { currentChallenge, publicSession } from "../engine.js";
import { type Job, type LearningSession } from "../contracts.js";
import { NebiusProvider, type ModelProvider } from "../provider.js";
export const maxDuration = 240;

export async function POST(
  request: Request,
  provider: ModelProvider = new NebiusProvider(),
) {
  try {
    sameOrigin(request);
    const who = await owner();
    const requestSchema = z.object({
      id: z.string(),
      version: z.number().int().optional(),
      challengeId: z.string().optional(),
      reasoningRevision: z.number().int().optional(),
    });
    const { id, version, challengeId, reasoningRevision } =
      requestSchema.parse(await request.json());

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

    // Validate request bindings before calling AI
    if (version !== undefined && s.version !== version)
      throw new ConflictError(
        "Stale session version. Refresh before requesting feedback.",
      );
    if (challengeId !== undefined && c.id !== challengeId)
      throw new ConflictError(
        "The requested challenge is no longer active in this session.",
      );

    const a = s.answers[c.id]?.at(-1);
    if (!a?.reasoning || s.retrying)
      throw Error("Submit written reasoning before requesting AI feedback.");

    const currentRevCount = a.reasoningRevisions?.length ?? 0;
    if (
      reasoningRevision !== undefined &&
      reasoningRevision !== currentRevCount
    ) {
      throw new ConflictError(
        "The reasoning has been revised. Request feedback on the latest revision.",
      );
    }

    await rateLimit("__research_global_ai_budget__", "ai", 120);
    await rateLimit(who, "feedback", 25);

    // Resolve readable option labels
    const selectedLabels = c.options
      .filter((opt) => a.selected.includes(opt.id))
      .map((opt) => `${opt.id}. ${opt.text}`);

    // Resolve permitted excerpts for this challenge from the authoritative lesson evidence
    const permittedExcerpts = (l.evidence ?? [])
      .filter((e) => c.refs.includes(e.id))
      .map((e) => ({
        id: e.id,
        page: e.page,
        excerpt: e.excerpt,
      }));

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

    const feedbackModel = nebiusConfig().feedbackModelId;
    const output = await provider.generate(
      "Learning Coach",
      "Evaluate submitted reasoning using only the current permitted evidence and reference guidance. Do not change deterministic scoring. Do not reveal paper identity or future findings. Return concise feedback and a targeted question; mark uncertainty.",
      {
        prompt: c.prompt,
        selected: selectedLabels.length ? selectedLabels : a.selected,
        reasoning: a.reasoning,
        evidence: c.evidence,
        permittedExcerpts,
        guide: c.explanation,
        refs: c.refs,
      },
      schema,
      feedbackModel,
      { tier: "feedback" },
    );

    if (output.refs.some((r) => !c.refs.includes(r)))
      throw Error("Feedback contained an unsupported reference.");

    // Concurrency check before saving: verify session wasn't modified during inference
    const latest = await read<LearningSession>(who, "session", id);
    const latestChallenge = currentChallenge(latest, l);
    const latestAttempt = latestChallenge
      ? latest.answers[latestChallenge.id]?.at(-1)
      : undefined;
    const latestRevCount = latestAttempt?.reasoningRevisions?.length ?? 0;

    if (
      latest.version !== s.version ||
      latestChallenge?.id !== c.id ||
      latestRevCount !== currentRevCount ||
      latestAttempt?.reasoning !== a.reasoning
    ) {
      throw new ConflictError(
        "Your reasoning or session was modified while AI feedback was being prepared.",
      );
    }

    const saved = await write(
      who,
      "session",
      id,
      {
        ...latest,
        aiFeedback: {
          ...latest.aiFeedback,
          [c.id]: { ...output, model: feedbackModel },
        },
      },
      latest.version,
    );
    return Response.json({
      ...output,
      mode: "live",
      model: feedbackModel,
      session: publicSession(saved, l),
    });
  } catch (e) {
    const isConflict = e instanceof ConflictError;
    return Response.json(
      {
        error: safeError(e),
        mode: "fallback",
        notice:
          "Your reasoning is saved. Live AI did not assess it; use the reference explanation.",
      },
      { status: isConflict ? 409 : 400 },
    );
  }
}

