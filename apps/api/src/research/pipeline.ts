import { z } from "zod";
import { nebiusConfig } from "../nebius-config.js";
import {
  excerptMatches,
  lessonSchema,
  refSchema,
  verifyLesson,
  type Job,
  type Audit,
} from "./contracts.js";
import { type ModelProvider } from "./provider.js";
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
      j.evidence = await provider.generate(
        audit.role,
        `${audit.task} Adapt to qualitative, quantitative, mixed-methods, review, or conceptual research as supported by the document. Return exact excerpts, not paraphrases. Use the physical PDF page numbers provided. List in missing only evidence essential to a grounded investigation of this paper; a statistical test, numerical result, or experimental design is not required for every research approach. Do not infer study type or claims from absent evidence. If the document cannot support at least three evidence-grounded research decisions, mark that essential evidence as missing. Pages marked method=ocr are uncertain transcriptions; do not imply wording or numbers were verified against original pixels.`,
        { pages: j.pages },
        z.object({
          findings: z
            .string()
            .describe(
              "Two to four sentences for a learner summarizing what the paper studied and found. Describe the paper, not your own process.",
            ),
          refs: z.array(refSchema).min(1).max(20),
          missing: z.array(z.string()),
        }),
        pipelineModel,
      );
      // Discard any excerpt that is not verbatim on its page; never show it.
      const verified = j.evidence.refs.filter((r) =>
        j.pages.some(
          (p) => p.page === r.page && excerptMatches(p.text, r.excerpt),
        ),
      );
      if (!verified.length)
        throw Error(
          `Extracted evidence does not match the document (0 of ${j.evidence.refs.length} excerpts verified). Verification requires exact page excerpts.`,
        );
      j.evidence.refs = verified;
      // Reasoning models sometimes narrate their process in the summary field.
      if (
        /^\s*(the user|user wants|i need|i will|i'll|let me|we need|okay|first,? i)\b/i.test(
          j.evidence.findings,
        )
      )
        j.evidence.findings = `Located ${verified.length} verified page excerpts for the investigation.`;
      if (j.evidence.missing.length)
        throw Error(
          `Insufficient research evidence: ${j.evidence.missing.join("; ").slice(0, 200)}. Try a complete research paper with enough source evidence.`,
        );
      audit.summary = j.evidence.findings;
      audit.refs = j.evidence.refs.map((r) => r.id);
    } else if (j.stage === 1) {
      j.lesson = await provider.generate(
        audit.role,
        `${audit.task} Use 3–14 challenges depending on evidence, adapting to this paper’s research approach. Build meaningful decisions around research questions, study design, sampling or evidence selection, interpretation, competing explanations, and limits where supported. Statistical test selection and numerical results belong only in papers that support those decisions; do not turn qualitative themes into prevalence estimates or conceptual arguments into causal findings. Include single/multiple responses, optional reasoning, hints, misconceptions, defensible alternatives, source refs and staged findings reveals. Use reveal=design before showing findings, reveal=results when findings or claims become available, and reveal=interpretation for judging their meaning or limits; reserve reveal=significance for a supported statistical-significance question. Do not put paper title/authors in briefing, questions, hints, or options. Set source=generated. Restrict evidence to the supplied exact excerpts. paper.url must be an actual DOI/source appearing in the supplied document; otherwise set paper.url=null and explicitly mark unavailable metadata. Do not invent references, participants, quotes, results, or a single best answer where the source permits alternatives. ${sceneAuthoringInstructions}`,
        {
          evidence: j.evidence,
          evidenceRule:
            "Copy every lesson evidence excerpt character-for-character from evidence.refs or the page text. Do not paraphrase, shorten words, or fix typography.",
          pages: j.pages,
          schemaExample: JSON.parse(
            JSON.stringify({ id: j.id, source: "generated" }),
          ),
        },
        lessonSchema,
        pipelineModel,
      );
      j.lesson = lessonSchema.parse(j.lesson);
      j.lesson.id = j.id;
      j.lesson.source = "generated";
      if (j.pages.some((p) => p.method === "ocr"))
        j.lesson.briefing +=
          " Some source pages were read with OCR. Verify quotations and numerical transcriptions against your original PDF; automated source matching checks extracted text, not the original pixels.";
      audit.summary = `Drafted ${j.lesson.challenges.length} challenges.`;
      audit.refs = j.evidence!.refs.map((r) => r.id);
    } else if (j.stage === 2 || j.stage === 3) {
      const assessment = await provider.generate(
        audit.role,
        `${audit.task} Reject claims or interpretations not supported by document evidence. Respect the research approach: participant accounts or qualitative themes do not establish population prevalence, association alone does not establish causation, and an argument alone is not an empirical finding. Do not demand statistical tests or numerical findings where they are inapplicable. Reject paper identity revealed before final reveal and findings leaked in design-stage prompts/hints. Review every accepted response and alternative, including defensible uncertainty when evidence is missing. Review all scene text, values, edges, response labels and reveal gates too. Reject unsupported visual relationships, findings or answer leakage in setup metadata, invented numerical data, misleading provenance, or diagrams that imply unavailable observations. Return approved=false when uncertain.`,
        { lesson: j.lesson, pages: j.pages },
        z.object({
          approved: z.boolean(),
          issues: z.array(z.string()),
          summary: z.string(),
        }),
        pipelineModel,
      );
      audit.summary = assessment.summary;
      audit.refs = j.lesson!.evidence.map((r) => r.id);
      if (!assessment.approved || assessment.issues.length) {
        j.review = assessment;
        j.status = "review";
        audit.status = "Needs Review";
        j.error = assessment.issues.join("; ") || "This lesson needs review.";
        j.leaseUntil = 0;
        return j;
      }
      if (j.stage === 2) j.review = assessment;
    } else {
      const problems = verifyLesson(j.lesson!, j.pages);
      if (!j.review?.approved)
        problems.push("Research methods review is missing.");

      if (problems.length) {
        j.status = "review";
        audit.status = "Needs Review";
        audit.summary = problems.join(" ");
        j.error = audit.summary;
        j.leaseUntil = 0;
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
    j.stage++;
    j.status = j.stage === 5 ? "ready" : "pending";
    j.leaseUntil = 0;
    delete j.error;
    return j;
  } catch (e) {
    audit.status = "Failed";
    audit.error = e instanceof Error ? e.message : "Processing failed.";
    audit.summary = "Stage did not complete.";
    j.status = "failed";
    j.error = audit.error;
    j.leaseUntil = 0;
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
