import { z } from "zod";
import { nebiusConfig } from "../nebius-config.js";
import {
  lessonSchema,
  refSchema,
  verifyLesson,
  type Job,
  type Audit,
} from "./contracts.js";
import { type ModelProvider } from "./provider.js";
const roles: [string, string][] = [
  [
    "Research Evidence Analyst",
    "Locate exact page-linked evidence for design, variables, participants, tests, results, and limitations.",
  ],
  [
    "Lesson Architect",
    "Create a sequential investigation from verified evidence.",
  ],
  [
    "Statistical Reviewer",
    "Check methodological suitability, alternative answers, assumptions, and source support.",
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
      model: nebiusConfig().modelId,
    })),
  };
}
export async function runStage(
  job: Job,
  provider: ModelProvider,
): Promise<Job> {
  const j = structuredClone(job);
  const audit = j.audits[j.stage];
  if (!audit) throw Error("Processing is already complete.");
  try {
    if (j.stage === 0) {
      j.evidence = await provider.generate(
        audit.role,
        `${audit.task} Return exact excerpts, not paraphrases. Use the physical PDF page numbers provided. If key evidence is absent, list it in missing. Pages marked method=ocr are uncertain transcriptions; do not imply their numbers were verified against original pixels.`,
        { pages: j.pages },
        z.object({
          findings: z.string(),
          refs: z.array(refSchema).min(1).max(20),
          missing: z.array(z.string()),
        }),
      );
      const norm = (s: string) => s.replace(/\s+/g, " ").trim();
      if (
        j.evidence.refs.some(
          (r) =>
            !j.pages.some(
              (p) =>
                p.page === r.page && norm(p.text).includes(norm(r.excerpt)),
            ),
        )
      )
        throw Error(
          "Extracted evidence does not match the document. Verification requires exact page excerpts.",
        );
      if (j.evidence.missing.length)
        throw Error(
          `Insufficient research evidence: ${j.evidence.missing.join("; ").slice(0, 200)}. Try a complete empirical paper.`,
        );
      audit.summary = j.evidence.findings;
      audit.refs = j.evidence.refs.map((r) => r.id);
    } else if (j.stage === 1) {
      j.lesson = await provider.generate(
        audit.role,
        `${audit.task} Use 3–14 challenges depending on evidence. Include single/multiple responses, optional reasoning, hints, misconceptions, alternatives, source refs and staged results reveals. Do not put paper title/authors in briefing, questions, hints, or options. Set source=generated. Restrict evidence to the supplied exact excerpts. paper.url must be an actual DOI/source appearing in the supplied document; otherwise set paper.url=null and explicitly mark unavailable metadata. Do not invent references.`,
        {
          evidence: j.evidence,
          pages: j.pages,
          schemaExample: JSON.parse(
            JSON.stringify({ id: j.id, source: "generated" }),
          ),
        },
        lessonSchema,
      );
      j.lesson.id = j.id;
      j.lesson.source = "generated";
      if (j.pages.some((p) => p.method === "ocr"))
        j.lesson.briefing +=
          " Some source pages were read with OCR. Verify numerical transcriptions against your original PDF; automated source matching checks extracted text, not the original pixels.";
      audit.summary = `Drafted ${j.lesson.challenges.length} challenges.`;
      audit.refs = j.evidence!.refs.map((r) => r.id);
    } else if (j.stage === 2 || j.stage === 3) {
      const assessment = await provider.generate(
        audit.role,
        `${audit.task} Reject claims or interpretations not supported by document evidence. Reject paper identity revealed before final reveal and results leaked in design-stage prompts/hints. Review every accepted response and alternative. Return approved=false when uncertain.`,
        { lesson: j.lesson, pages: j.pages },
        z.object({
          approved: z.boolean(),
          issues: z.array(z.string()),
          summary: z.string(),
        }),
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
      if (!j.review?.approved) problems.push("Statistical review is missing.");

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
