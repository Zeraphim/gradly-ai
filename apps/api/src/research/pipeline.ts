import { z } from "zod";
import { nebiusConfig } from "../nebius-config.js";
import {
  challengeSchema,
  excerptMatches,
  paperLinkSupported,
  generatedLessonSchema,
  MAX_GENERATED_CHALLENGES,
  refSchema,
  verifyLesson,
  type Job,
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
  [
    "Evidence Verification",
    "Validate schema, excerpts, answer guides, and reviewer decisions.",
  ],
];
/** Fewest verified stage-0 excerpts that can ground a lesson. */
export const MIN_VERIFIED_EXCERPTS = 3;
/** Stage-1 output: references are limited to verified stage-0 ids and the
 *  excerpts themselves are attached server-side, not re-emitted. */
export function lessonDraftSchema(evidenceIds: string[]) {
  const ids = [...new Set(evidenceIds)] as [string, ...string[]];
  const challenge = challengeSchema.extend({
    refs: z.array(z.enum(ids)).min(1),
  });
  return generatedLessonSchema.omit({ evidence: true }).extend({
    challenges: z.array(challenge).min(3).max(MAX_GENERATED_CHALLENGES),
    bonus: challenge.nullable(),
  });
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
/** Server log for a stopped stage. No page text or learner identifiers. */
function logStop(j: Job, detail: string) {
  console.warn(
    `[Research Pipeline Warning] Job ${j.id} stopped — stage: ${j.stage} (${j.audits[j.stage]?.role}), status: ${j.status}, detail: ${detail.slice(0, 300)}`,
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
      // Keep only verbatim excerpts; never show one that is not. Models
      // sometimes cite the wrong page, so an excerpt found on exactly one
      // other page is kept with that page.
      const cited = j.evidence.refs.length;
      const verified = j.evidence.refs.flatMap((r) => {
        if (
          j.pages.some(
            (p) => p.page === r.page && excerptMatches(p.text, r.excerpt),
          )
        )
          return [r];
        const [only, ...more] = j.pages.filter((p) =>
          excerptMatches(p.text, r.excerpt),
        );
        return only && !more.length ? [{ ...r, page: only.page }] : [];
      });
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
        `${audit.task} Use 3–${MAX_GENERATED_CHALLENGES} challenges depending on evidence, adapting to this paper's research approach. Build meaningful decisions around research questions, study design, sampling or evidence selection, interpretation, competing explanations, and limits where supported. Statistical test selection and numerical results belong only in papers that support those decisions; do not turn qualitative themes into prevalence estimates or conceptual arguments into causal findings. Include single/multiple responses, optional reasoning, hints, misconceptions, defensible alternatives, source refs and staged findings reveals. Set writtenReasoning=true on at least one interpretation or limits challenge so the learner can explain their thinking. Use reveal=design before showing findings, reveal=results when findings or claims become available, and reveal=interpretation for judging their meaning or limits; reserve reveal=significance for a supported statistical-significance question. Do not put paper title/authors in briefing, questions, hints, or options. Set source=generated. lesson.evidence must include every item from the provided evidence input, preserving their exact ids. Each challenge.refs array must contain only evidence ids present in lesson.evidence — no invented references. paper.url must be a DOI link extracted from the supplied pages (e.g., https://doi.org/10.xxxx/...); if no DOI appears, set paper.url=null. Do not invent participants, quotes, results, or a single best answer where the source permits alternatives. Fill every required field, including title and briefing, and keep each one brief to fit the output budget: prompts and explanations at most two sentences, options and hints one short sentence, misconception notes one sentence. ${sceneAuthoringInstructions}`,
        {
          evidence: j.evidence,
          evidenceRule:
            "Cite evidence only by the ids in evidence.refs. The server attaches those verified excerpts to the lesson, so do not copy excerpts.",
          pages: j.pages,
          schemaExample: JSON.parse(
            JSON.stringify({ id: j.id, source: "generated" }),
          ),
        },
        draftSchema,
        pipelineModel,
        { tier: "pipeline" },
      );
      // Evidence is the verified stage-0 set, never the model's re-copy.
      j.lesson = generatedLessonSchema.parse({
        ...draftSchema.parse(draft),
        evidence: j.evidence!.refs,
      });
      j.lesson.id = j.id;
      j.lesson.source = "generated";
      if (j.pages.some((p) => p.method === "ocr"))
        j.lesson.briefing +=
          " Some source pages were read with OCR. Verify quotations and numerical transcriptions against your original PDF; automated source matching checks extracted text, not the original pixels.";
      audit.summary = `Drafted ${j.lesson.challenges.length} challenges.`;
      audit.refs = j.evidence!.refs.map((r) => r.id);
    } else if (j.stage === 2 || j.stage === 3) {
      // The coach read "feedback" as a learner answer to grade and rejected
      // drafts for having none, so it is told what it reviews.
      const coachBrief =
        j.stage === 3
          ? " You review the lesson draft before any learner sees it; there is no learner response to grade. Judge each challenge's hint, misconception notes and explanation: they should help a learner who chose a wrong option revise their reasoning without giving the answer away early. If you return approved=false, list every concrete problem in issues."
          : "";
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
      audit.summary = assessment.summary;
      audit.refs = j.lesson!.evidence.map((r) => r.id);
      if (!assessment.approved || assessment.issues.length) {
        j.review = assessment;
        j.status = "review";
        audit.status = "Needs Review";
        // A rejection without issues still needs a reason the learner can read.
        const summary = assessment.summary.trim();
        j.error =
          assessment.issues.join("; ") ||
          `The ${audit.role} did not approve this lesson${summary ? `: ${summary}` : " and gave no reason."} Regenerate to draft and review it again.`;
        if (!summary) audit.summary = j.error;
        j.leaseUntil = 0;
        logStop(j, j.error);
        return j;
      }
      if (j.stage === 2) j.review = assessment;
    } else {
      // The paper link is reveal-only metadata, so an unsupported one is
      // dropped instead of blocking the lesson.
      if (
        j.lesson!.paper.url &&
        !paperLinkSupported(j.lesson!.paper.url, j.pages)
      )
        j.lesson!.paper.url = null;
      const problems = verifyLesson(j.lesson!, j.pages);
      if (!j.review?.approved)
        problems.push("Research methods review is missing.");

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
        "Schema, exact page excerpts, evidence identifiers, answer keys, and reviewer approvals checked.";
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
