import { featured } from "./featured.js";
import { verifyLesson, type Job } from "./contracts.js";
import { READY_STAGE, STAGES } from "./pipeline.js";

// Explicit local opt-in. A missing/failed live provider never falls back here.
export function demoAvailable() {
  return (
    process.env.DEMO_MODE === "true" &&
    process.env.PREVIEW_MODE === "true" &&
    !process.env.VERCEL &&
    process.env.NODE_ENV !== "production"
  );
}

export function runDemoStage(job: Job): Job {
  if (!demoAvailable() || job.mode !== "demo" || !job.consented)
    throw Error("Confirm an enabled sample preview before continuing.");
  if (job.status === "ready") return job;
  const j = structuredClone(job);
  const audit = j.audits[j.stage];
  if (!audit) throw Error("Sample preview stage is unavailable.");
  const summaries = [
    `Your ${j.pages.length}-page upload was extracted, but is not analyzed in this preview. Loaded separate evidence from the reference study.`,
    "Loaded the authored eight-challenge sample, including hints, retries and optional bonus. These questions are not generated from your upload.",
    "Kept the sample's authored wording. No term definitions were generated, and no AI call was made.",
    "Using the reference study’s authored answer guide and statistical explanations. No AI reviewer was called.",
    "Loaded reference feedback and revision prompts. Written reasoning is saved without claiming an AI assessment.",
    "Validated the sample’s exact excerpts, references and answer guide. This checks sample integrity, not the uploaded paper or a live model.",
  ];
  if (j.stage === STAGES.evidence)
    j.evidence = {
      findings:
        "Sample reference evidence; unrelated to the uploaded document.",
      refs: structuredClone(featured.evidence),
      missing: [],
    };
  if (j.stage === STAGES.lesson)
    j.lesson = {
      ...structuredClone(featured),
      id: j.id,
      source: "demo",
      title: "Sample preview · " + featured.title,
      briefing:
        "This is a separate sample investigation. Your uploaded document was checked, but these challenges and findings do not describe it. " +
        featured.briefing,
    };
  if (j.stage === STAGES.verify) {
    if (!j.lesson || j.lesson.source !== "demo")
      throw Error("Sample lesson is missing.");
    const pages = [...new Set(featured.evidence.map((r) => r.page))].map(
      (page) => ({
        page,
        text:
          featured.evidence
            .filter((r) => r.page === page)
            .map((r) => r.excerpt)
            .join("\n") +
          "\n" +
          featured.paper.url,
      }),
    );
    const problems = verifyLesson(j.lesson, pages);
    if (problems.length)
      throw Error("Sample integrity check failed: " + problems.join(" "));
  }
  audit.status = "Completed";
  audit.model = "Sample preview • no AI call";
  audit.summary = summaries[j.stage]!;
  audit.refs = featured.evidence.map((r) => r.id);
  delete audit.error;
  delete audit.errorCode;
  j.stage++;
  j.status = j.stage === READY_STAGE ? "ready" : "pending";
  j.leaseUntil = 0;
  delete j.error;
  return j;
}
