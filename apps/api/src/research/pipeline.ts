import { z } from "zod";
import type { SceneOf } from "@paperquest/contracts";
import { nebiusConfig } from "../nebius-config.js";
import {
  canonicalText,
  challengeSchema,
  locateExcerpt,
  paperLinkSupported,
  generatedLessonSchema,
  MAX_GENERATED_CHALLENGES,
  refSchema,
  sceneCoverageProblems,
  sceneFaults,
  verifyLesson,
  type Challenge,
  type Job,
  type Lesson,
  type Audit,
} from "./contracts.js";
import { ProviderError, type ModelProvider } from "./provider.js";
import { sceneAuthoringInstructions } from "./scene-authoring.js";
const roles: [string, string][] = [
  [
    "Research Evidence Analyst",
    "Locate exact page-linked evidence for the research question, approach, source of observations or arguments, findings or claims, and limitations. Identify study-specific details such as sampling, researcher interpretation, variables, or analyses only when applicable.",
  ],
  [
    "Lesson Architect",
    "Create a sequential investigation from verified evidence.",
  ],
  [
    "Research Methods Reviewer",
    "Check whether decisions and interpretations fit this paper’s research approach, source support, alternatives, and limits. Assess statistical assumptions only when the paper uses statistical analysis.",
  ],
  [
    "Learning Coach",
    "Check that feedback supports revision and teaches reasoning.",
  ],
  ["Evidence Verification", "Validate schema, excerpts, and answer guides."],
];
/** Fewest verified stage-0 excerpts that can ground a lesson. */
export const MIN_VERIFIED_EXCERPTS = 3;
/** Most excerpts a drafted challenge may add beyond the stage-0 evidence. */
export const MAX_ADDED_EXCERPTS = 3;
/** True when text has at least one word. Rejects degenerate replies like ":{". */
const readable = (s: string) => /\p{L}{3,}/u.test(s);
/** Stage-1 output: references are limited to verified stage-0 ids and the
 *  excerpts themselves are attached server-side, not re-emitted. */
export function lessonDraftSchema(evidenceIds: string[]) {
  const ids = [...new Set(evidenceIds)] as [string, ...string[]];
  // No `alternatives`: drafts filled it with wrong options and reasons, and
  // grading accepts every alternative as correct. The server sets it empty.
  const challenge = challengeSchema.omit({ alternatives: true }).extend({
    refs: z.array(z.enum(ids)).min(1),
    // Last, so it covers the details the teaching text above it uses.
    addedExcerpts: z
      .array(refSchema.omit({ id: true }))
      .max(MAX_ADDED_EXCERPTS)
      .default([]),
  });
  return generatedLessonSchema.omit({ evidence: true }).extend({
    challenges: z.array(challenge).min(3).max(MAX_GENERATED_CHALLENGES),
    bonus: challenge.nullable(),
  });
}
type DraftChallenge = z.infer<
  ReturnType<typeof lessonDraftSchema>
>["challenges"][number];
/**
 * Adds a challenge's verbatim added excerpts to the lesson evidence and its
 * refs, dropping any not found in the document. Reviewers and learners see
 * only cited excerpts, so details used outside them read as unsupported.
 */
function attachAddedExcerpts(
  { addedExcerpts, ...c }: DraftChallenge,
  evidence: Lesson["evidence"],
  pages: Job["pages"],
): Challenge {
  const refs = [...c.refs];
  for (const added of addedExcerpts) {
    const found = locateExcerpt(pages, added);
    if (!found) continue;
    let id = evidence.find(
      (r) =>
        r.page === found.page &&
        canonicalText(r.excerpt) === canonicalText(found.excerpt),
    )?.id;
    if (!id) {
      let n = 1;
      while (evidence.some((r) => r.id === `${c.id}_added_${n}`)) n++;
      id = `${c.id}_added_${n}`;
      evidence.push({ id, ...found });
    }
    if (!refs.includes(id)) refs.push(id);
  }
  return { ...c, refs, alternatives: [] };
}
/**
 * A connections scene for one challenge. It shows the challenge's evidence
 * text, which the player already shows before an answer when a challenge has
 * no scene, or else the verified excerpts the challenge cites.
 */
function evidenceScene(
  c: Challenge,
  evidence: Lesson["evidence"],
): SceneOf<"connections"> {
  const texts = c.evidence.filter((e) => e.trim());
  const provenance = texts.length
    ? {
        kind: "source-summary" as const,
        refs: c.refs,
        note: "Summary of the cited evidence.",
      }
    : {
        kind: "reported" as const,
        refs: c.refs,
        note: "Verified excerpts from the paper.",
      };
  const details = texts.length
    ? texts
    : evidence.filter((r) => c.refs.includes(r.id)).map((r) => r.excerpt);
  const anchors = details.slice(0, 6).map((detail, i) => ({
    id: `evidence_${i + 1}`,
    label: `Evidence ${i + 1}`,
    detail: detail.slice(0, 600),
    at: "setup" as const,
    provenance,
  }));
  return {
    version: 1,
    kind: "connections",
    title: "Connect the evidence",
    instruction:
      "Read the evidence, then connect the response you would choose.",
    description: "The challenge's evidence with one response per option.",
    provenance,
    actionLabel: "Connect a response",
    anchors,
    responses: c.options.map((o) => ({
      optionId: o.id,
      label: o.text.slice(0, 600),
      targetIds: anchors.map((a) => a.id),
    })),
    resolution: null,
  };
}
export function newJob(id: string, name: string, pages: Job["pages"]): Job {
  return {
    id,
    name,
    consented: false,
    pages,
    stage: 0,
    status: "pending",
    leaseUntil: 0,
    version: 0,
    audits: roles.map(([role, task]) => ({
      role,
      task,
      status: "Pending",
      summary: "Waiting for this stage.",
      refs: [],
      model: nebiusConfig().pipelineModelId,
    })),
  };
}
/** Server log for a stopped stage or a review the lesson continued past. No page text or learner
 *  identifiers. */
function logStop(j: Job, detail: string, outcome = "stopped") {
  console.warn(
    `[Research Pipeline Warning] Job ${j.id} ${outcome} — stage: ${j.stage} (${j.audits[j.stage]?.role}), status: ${j.status}, detail: ${detail.slice(0, 300)}`,
  );
}
export async function runStage(
  job: Job,
  provider: ModelProvider,
): Promise<Job> {
  const pipelineModel = nebiusConfig().pipelineModelId;
  const j = structuredClone(job);
  const audit = j.audits[j.stage];
  if (!audit) throw Error("Processing is already complete.");
  try {
    if (j.stage === 0) {
      // The wire field is `paperSummary`, not `findings`: a field named after
      // one evidence aspect led the model to return only findings excerpts
      // and list every other aspect as missing.
      const found = await provider.generate(
        audit.role,
        `${audit.task} Adapt to qualitative, quantitative, mixed-methods, review, or conceptual research as supported by the document. Return 5 to 12 refs that together cover every aspect the paper states: research question, approach, source of observations or arguments, findings or claims, and limitations. Name each ref id after its aspect, such as approach_1. Return exact excerpts, not paraphrases: one to three consecutive sentences copied from a single page. Set paperSummary to two to four plain sentences telling a learner what the paper studied and found. Use the physical PDF page numbers provided. List in missing only evidence essential to a grounded investigation of this paper; a statistical test, numerical result, or experimental design is not required for every research approach. Do not infer study type or claims from absent evidence. If the document cannot support at least three evidence-grounded research decisions, mark that essential evidence as missing. Pages marked method=ocr are uncertain transcriptions; do not imply wording or numbers were verified against original pixels.`,
        { pages: j.pages },
        z.object({
          refs: z
            .array(refSchema)
            .min(1)
            .max(20)
            .describe(
              "Exact page excerpts, at least one per aspect the paper states.",
            ),
          missing: z.array(z.string()),
          // After refs, so the summary is written from the located evidence.
          paperSummary: z
            .string()
            .describe(
              "Two to four plain sentences for a learner summarizing what the paper studied and found. Describe the paper, not your own process.",
            ),
        }),
        pipelineModel,
        { tier: "pipeline" },
      );
      j.evidence = {
        findings: found.paperSummary,
        refs: found.refs,
        missing: found.missing,
      };
      // Keep only verbatim excerpts; never show one that is not.
      const cited = j.evidence.refs.length;
      const verified = j.evidence.refs.flatMap(
        (r) => locateExcerpt(j.pages, r) ?? [],
      );
      if (!verified.length)
        throw Error(
          `Extracted evidence does not match the document (0 of ${j.evidence.refs.length} excerpts verified). Verification requires exact page excerpts.`,
        );
      j.evidence.refs = verified;
      // Reasoning models sometimes narrate their process or return an
      // empty summary; neither teaches a learner anything about the paper.
      if (
        !j.evidence.findings.trim() ||
        /^\s*(the user|user wants|i need|i will|i'll|let me|we need|okay|first,? i)\b/i.test(
          j.evidence.findings,
        )
      )
        j.evidence.findings = `Located ${verified.length} verified page excerpts for the investigation.`;
      if (j.evidence.missing.length)
        throw Error(
          `Insufficient research evidence: ${j.evidence.missing.join("; ").slice(0, 200)}. Try a complete research paper with enough source evidence.`,
        );
      // A lesson needs at least three grounded decisions. Fewer excerpts fail
      // here, where a retry redraws evidence, not at review, where it cannot.
      if (verified.length < MIN_VERIFIED_EXCERPTS)
        throw Error(
          `Too little extracted evidence matches the document (${verified.length} of ${cited} excerpts verified, ${MIN_VERIFIED_EXCERPTS} needed). Verification requires exact page excerpts. Retry this stage.`,
        );
      audit.summary = j.evidence.findings;
      audit.refs = j.evidence.refs.map((r) => r.id);
    } else if (j.stage === 1) {
      const draftSchema = lessonDraftSchema(j.evidence!.refs.map((r) => r.id));
      const draft = await provider.generate(
        audit.role,
        `${audit.task} Use 3–${MAX_GENERATED_CHALLENGES} challenges depending on evidence, adapting to this paper's research approach. Build meaningful decisions around research questions, study design, sampling or evidence selection, interpretation, competing explanations, and limits where supported. Statistical test selection and numerical results belong only in papers that support those decisions; do not turn qualitative themes into prevalence estimates or conceptual arguments into causal findings. Include single/multiple responses, optional reasoning, a hint for every challenge, misconception notes keyed by wrong option id, source refs and staged findings reveals. Hints and misconception notes must not name, quote or paraphrase an accepted option; only the explanation may state the answer. When a challenge's prompt, options, hint, misconceptions or explanation use a detail its refs do not state, copy the sentence stating it into that challenge's addedExcerpts with its physical PDF page number: one to three consecutive sentences from a single page, exact, not paraphrased. Leave addedExcerpts empty when the refs state every detail. Set writtenReasoning=true on at least one interpretation or limits challenge so the learner can explain their thinking. Use reveal=design before showing findings, reveal=results when findings or claims become available, and reveal=interpretation for judging their meaning or limits; reserve reveal=significance for a supported statistical-significance question. Do not put paper title/authors in briefing, questions, hints, or options. Set source=generated. lesson.evidence must include every item from the provided evidence input, preserving their exact ids. Each challenge.refs array must contain only evidence ids present in lesson.evidence — no invented references. paper.url must be a DOI link extracted from the supplied pages (e.g., https://doi.org/10.xxxx/...); if no DOI appears, set paper.url=null. Do not invent participants, quotes or results. Frame each question so its accepted options are the only answer the evidence supports. Fill every required field, including title and briefing, and keep each one brief to fit the output budget: prompts and explanations at most two sentences, options and hints one short sentence, misconception notes one sentence. ${sceneAuthoringInstructions}`,
        {
          evidence: j.evidence,
          evidenceRule:
            "Cite evidence by the ids in evidence.refs. The server attaches those verified excerpts to the lesson, so do not copy them. Put only other excerpts in addedExcerpts.",
          pages: j.pages,
          schemaExample: JSON.parse(
            JSON.stringify({ id: j.id, source: "generated" }),
          ),
        },
        draftSchema,
        pipelineModel,
        { tier: "pipeline" },
      );
      // Evidence is the verified stage-0 set plus verified added excerpts,
      // never the model's re-copy.
      const parsed = draftSchema.parse(draft);
      const evidence = [...j.evidence!.refs];
      const ground = (c: DraftChallenge) =>
        attachAddedExcerpts(c, evidence, j.pages);
      j.lesson = generatedLessonSchema.parse({
        ...parsed,
        challenges: parsed.challenges.map(ground),
        bonus: parsed.bonus && ground(parsed.bonus),
        evidence,
      });
      j.lesson.id = j.id;
      j.lesson.source = "generated";
      const all = [
        ...j.lesson.challenges,
        ...(j.lesson.bonus ? [j.lesson.bonus] : []),
      ];
      // A hint is the learner's only help before the first attempt.
      const hintless = all.filter((c) => !c.hint.trim()).map((c) => c.id);
      if (hintless.length)
        throw Error(
          `The draft has no hint for ${hintless.join(", ")}. Retry this stage.`,
        );
      // Scenes are optional per challenge, so a broken one is removed rather
      // than stopping the lesson at verification.
      let removed = 0;
      for (const c of all)
        if (c.scene && sceneFaults(c, j.lesson.evidence).length) {
          c.scene = null;
          if (c.responseStyle === "tap") delete c.responseStyle;
          removed++;
        }
      // When no drafted scene survives, one challenge gets a scene built from
      // its evidence, installed only if it passes the same checks. Challenges
      // with their own evidence text come first.
      let built = false;
      if (sceneCoverageProblems(j.lesson).length)
        for (const c of [...j.lesson.challenges].sort(
          (a, b) =>
            Number(!a.evidence.some((e) => e.trim())) -
            Number(!b.evidence.some((e) => e.trim())),
        )) {
          const scene = evidenceScene(c, j.lesson.evidence);
          if (
            !scene.anchors.length ||
            sceneFaults({ ...c, scene }, j.lesson.evidence).length
          )
            continue;
          c.scene = scene;
          if (c.responseStyle === "tap") delete c.responseStyle;
          built = true;
          break;
        }
      // A lesson without a usable scene fails here, where a retry redraws the
      // lesson, rather than after two reviewer calls.
      const coverage = sceneCoverageProblems(j.lesson);
      if (coverage.length)
        throw Error(`${coverage.join(" ")} Retry this stage.`);
      if (j.pages.some((p) => p.method === "ocr"))
        j.lesson.briefing +=
          " Some source pages were read with OCR. Verify quotations and numerical transcriptions against your original PDF; automated source matching checks extracted text, not the original pixels.";
      const added = evidence.length - j.evidence!.refs.length;
      audit.summary = `Drafted ${j.lesson.challenges.length} challenges${added ? ` with ${added} added excerpt${added === 1 ? "" : "s"}` : ""}.${removed ? ` Removed ${removed} scene${removed === 1 ? "" : "s"} that failed checks.` : ""}${built ? " Added a server-built scene." : ""}`;
      audit.refs = j.lesson.evidence.map((r) => r.id);
    } else if (j.stage === 2 || j.stage === 3) {
      // Reviews are advisory. Their notes are shown on the stage and logged,
      // but neither a rejection nor a failed review call stops the lesson.
      // The coach read "feedback" as a learner answer to grade and rejected
      // drafts for having none, so it is told what it reviews.
      const coachBrief =
        j.stage === 3
          ? " You review the lesson draft before any learner sees it; there is no learner response to grade. Judge each challenge's hint, misconception notes and explanation: they should help a learner who chose a wrong option revise their reasoning. A hint shows before the first attempt and a misconception note after a wrong first attempt, before the learner's one retry, so neither may give the answer away. The explanation and accepted options show only after a correct answer or the second attempt, so the explanation may state the answer. If you return approved=false, list every concrete problem in issues."
          : "";
      audit.refs = j.lesson!.evidence.map((r) => r.id);
      try {
        const assessment = await provider.generate(
          audit.role,
          `${audit.task}${coachBrief} Reject claims or interpretations not supported by document evidence. Respect the research approach: participant accounts or qualitative themes do not establish population prevalence, association alone does not establish causation, and an argument alone is not an empirical finding. Do not demand statistical tests or numerical findings where they are inapplicable. Reject paper identity revealed before final reveal and findings leaked in design-stage prompts/hints. Review every accepted response and alternative, including defensible uncertainty when evidence is missing. Review all scene text, values, edges, response labels and reveal gates too. Reject unsupported visual relationships, findings or answer leakage in setup metadata, invented numerical data, misleading provenance, or diagrams that imply unavailable observations. Return approved=false when uncertain.`,
          { lesson: j.lesson, pages: j.pages },
          z.object({
            approved: z.boolean(),
            issues: z.array(z.string()),
            summary: z.string(),
          }),
          pipelineModel,
          { tier: "pipeline" },
        );
        // Degenerate text such as ":{" is not a note.
        const issues = assessment.issues.filter(readable);
        const summary = readable(assessment.summary)
          ? assessment.summary.trim()
          : "";
        if (j.stage === 2) j.review = assessment;
        if (assessment.approved && !issues.length)
          audit.summary = summary || "Approved.";
        else {
          const notes = issues.join("; ") || summary || "No reason given.";
          audit.summary = `Advisory notes: ${notes}`;
          logStop(j, notes, "continued past review notes");
        }
      } catch (e) {
        // The stage continues, so a provider's retry advice does not apply.
        const reason = (
          e instanceof Error ? e.message : "The review did not complete."
        ).replace(/\s*Retry this stage\.$/, "");
        audit.summary = `Review unavailable, so the lesson continued without it. ${reason}`;
        logStop(
          j,
          `${e instanceof ProviderError ? `${e.code}: ` : ""}${reason}`,
          "continued without review",
        );
      }
    } else {
      // The paper link is reveal-only metadata, so an unsupported one is
      // dropped instead of blocking the lesson.
      if (
        j.lesson!.paper.url &&
        !paperLinkSupported(j.lesson!.paper.url, j.pages)
      )
        j.lesson!.paper.url = null;
      const problems = verifyLesson(j.lesson!, j.pages);
      if (problems.length) {
        j.status = "review";
        audit.status = "Needs Review";
        audit.summary = problems.join(" ");
        j.error = audit.summary;
        j.leaseUntil = 0;
        logStop(j, j.error);
        return j;
      }
      audit.model = "Deterministic validator";
      audit.summary =
        "Schema, exact page excerpts, evidence identifiers, and answer keys checked.";
      audit.refs = j.lesson!.evidence.map((r) => r.id);
      j.status = "ready";
    }
    audit.status = "Completed";
    delete audit.error;
    delete audit.errorCode;
    j.stage++;
    j.status = j.stage === 5 ? "ready" : "pending";
    j.leaseUntil = 0;
    delete j.error;
    return j;
  } catch (e) {
    audit.status = "Failed";
    audit.error = e instanceof Error ? e.message : "Processing failed.";
    if (e instanceof ProviderError) audit.errorCode = e.code;
    else delete audit.errorCode;
    audit.summary = "Stage did not complete.";
    j.status = "failed";
    j.error = audit.error;
    j.leaseUntil = 0;
    logStop(j, `${audit.errorCode ? `${audit.errorCode}: ` : ""}${j.error}`);
    return j;
  }
}
export function publicJob(j: Job) {
  return {
    id: j.id,
    mode: j.mode ?? "live",
    consented: j.consented,
    name: j.name,
    stage: j.stage,
    status: j.status,
    audits: j.audits,
    error: j.error,
    version: j.version,
    leaseUntil: j.leaseUntil,
    excerpt: j.pages[0]?.text.slice(0, 1200),
    pageCount: j.pages.length,
    extraction: j.pages.map((p) => ({
      page: p.page,
      method: p.method ?? "text",
      confidence: p.confidence,
    })),
    evidence: j.evidence?.refs ?? [],
    // Counts only, so preparation can preview the lesson without content.
    outline: j.lesson
      ? {
          challenges: j.lesson.challenges.length,
          bonus: !!j.lesson.bonus,
          reasoning: j.lesson.challenges.filter((c) => c.writtenReasoning)
            .length,
        }
      : null,
    ready: j.status === "ready",
  };
}
export function referenceAudit(
  role: string,
  task: string,
  summary: string,
  refs: string[],
): Audit {
  return {
    role,
    task,
    summary,
    refs,
    status: "Completed",
    model: "Reference guidance • no live inference",
  };
}
