import type { RefObject } from "react";
import type { PageText } from "../../../api/src/research/contracts.js";
import type { ProcessingJob, ResearchConfig } from "./types.js";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import {
  Speech,
  Progress,
  ErrorMessage,
  ExtractedPages,
} from "./learning-ui.js";

export function ProcessingPage({
  job,
  config,
  busy,
  error,
  heading,
  sourcePages,
  onStart,
  onStep,
  onLoadPages,
}: {
  job: ProcessingJob | null;
  config: ResearchConfig | null;
  busy: boolean;
  error: string;
  heading: RefObject<HTMLHeadingElement | null>;
  sourcePages: PageText[] | null;
  onStart: (lessonId?: string) => void;
  onStep: (retry?: boolean, consent?: boolean) => void;
  onLoadPages: () => void;
}) {
  const demo = job?.mode === "demo";
  return (
    <>
      <Speech>
        {demo
          ? "Explore how an adventure comes together. These steps use the reference sample, not AI analysis of your PDF."
          : "Our research crew builds from the paper’s evidence. Each stage must succeed before you begin."}
      </Speech>
      <h1 ref={heading} tabIndex={-1}>
        {demo
          ? "Your sample adventure is taking shape"
          : "AI Agents Crafting Adventure"}
      </h1>
      {job ? (
        <>
          <div className="card">
            <span className="tag">
              {demo ? "Your upload · sample flow" : "Uploaded document"}
            </span>
            <h2>{job.name}</h2>
            <p>
              {job.pageCount} {job.pageCount === 1 ? "page" : "pages"} extracted
              • {demo ? "Sample flow · no AI calls" : config?.model}
            </p>
            <Progress
              value={job.stage}
              max={5}
              label={
                demo ? "Sample preparation steps" : "Verified processing stages"
              }
            />
          </div>
          {job.status === "ready" ? (
            <div className="center">
              <h2>Your adventure is ready!</h2>
              <p>
                {demo
                  ? "All sample steps are complete. Explore eight guided challenges, feedback, the paper reveal and your learning summary."
                  : "All five stages passed. Generated content is AI-reviewed, rather than instructor-reviewed."}
              </p>
              <button
                className="btn primary"
                disabled={busy}
                onClick={() => onStart(job.id)}
              >
                <ActionLabel>Begin investigation</ActionLabel>
              </button>
            </div>
          ) : null}
          <div className="agent-stack">
            {job.audits.map((a, i) => (
              <details
                className={`agent-card ${a.status === "Processing" ? "active" : ""}`}
                key={a.role}
                open={a.status === "Failed" || a.status === "Needs Review"}
              >
                <summary>
                  <span className={`symbol ${i % 2 ? "blue" : "green"}`}>
                    <Icon
                      name={
                        (
                          [
                            "search",
                            "layout",
                            "chart",
                            "coach",
                            "shield",
                          ] as const
                        )[i]!
                      }
                    />
                  </span>
                  <div>
                    <strong>{a.role}</strong>
                    <p>{a.task}</p>
                  </div>
                  <span
                    className={`status ${a.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {a.status === "Completed" ? (
                      <Icon name="check" size={13} />
                    ) : ["Processing", "Retrying"].includes(a.status) ? (
                      <Icon name="loading" size={13} className="is-spinning" />
                    ) : null}
                    {a.status}
                  </span>
                  <Icon
                    name="chevron"
                    size={18}
                    className="disclosure-chevron"
                  />
                </summary>
                <div className="agent-details">
                  <p>{a.summary}</p>
                  <p>Model / role: {a.model}</p>
                  {a.refs.length ? (
                    <p>Evidence references: {a.refs.join(", ")}</p>
                  ) : null}
                  {a.error ? <ErrorMessage message={a.error} /> : null}
                </div>
              </details>
            ))}
          </div>
          {!job.consented && (config?.liveAI || config?.demoAvailable) ? (
            <div className="notice">
              <h2>
                {config?.liveAI
                  ? "Confirm external AI processing"
                  : "Preview the adventure flow"}
              </h2>
              <p>
                {config?.liveAI
                  ? "Continuing sends extracted text to Nebius Token Factory. Review it first; AI can make mistakes."
                  : "Use a separate sample investigation to explore every step. No AI is called and no findings are generated from your upload."}
              </p>
              <button
                className="btn primary"
                disabled={busy}
                onClick={() => onStep(false, true)}
              >
                <ActionLabel busy={busy}>
                  {busy
                    ? "Opening…"
                    : config?.liveAI
                      ? "Confirm AI processing"
                      : config?.demoAvailable
                        ? "Start sample preview"
                        : "Confirm AI processing"}
                </ActionLabel>
              </button>
            </div>
          ) : null}
          {config && !config.liveAI && !demo && !config.demoAvailable ? (
            <div className="notice">
              <h2>Live inference needs configuration</h2>
              <p>
                The document has been extracted. No AI model has been called.
                Configure the server’s Nebius API key to generate an adventure.
              </p>
              <button className="btn primary" onClick={() => onStart()}>
                <ActionLabel>Start reference investigation</ActionLabel>
              </button>
            </div>
          ) : null}
          {["failed", "review"].includes(job.status) || error ? (
            <div className="notice">
              <ErrorMessage message={job.error ?? ""} />
              <button
                className="btn secondary"
                disabled={busy || (!config?.liveAI && !demo)}
                onClick={() => onStep(true)}
              >
                {job.status === "review"
                  ? "Regenerate & review again"
                  : "Retry failed stage"}
              </button>
            </div>
          ) : null}
          {job.evidence.length ? (
            <details className="card">
              <summary>
                {demo
                  ? "Inspect sample study evidence"
                  : "Inspect extracted evidence"}
              </summary>
              {job.evidence.map((r) => (
                <div key={r.id}>
                  <h3>
                    {r.id} • {demo ? "Sample source page" : "PDF page"} {r.page}
                  </h3>
                  <blockquote>{r.excerpt}</blockquote>
                </div>
              ))}
            </details>
          ) : null}
          <details className="card">
            <summary>View extracted text</summary>
            {job.extraction.some((p) => p.method === "ocr") ? (
              <p>
                English OCR was used. Check transcription and statistics against
                the original document. Pages:{" "}
                {job.extraction
                  .filter((p) => p.method === "ocr")
                  .map(
                    (p) => `${p.page} (confidence estimate ${p.confidence}%)`,
                  )
                  .join(", ")}
              </p>
            ) : null}
            <blockquote>{job.excerpt}</blockquote>
            {sourcePages ? (
              <ExtractedPages pages={sourcePages} />
            ) : (
              <button className="btn outline compact" onClick={onLoadPages}>
                Inspect all extracted pages
              </button>
            )}
          </details>
          <Link className="btn outline" href="/upload">
            Return to upload
          </Link>
        </>
      ) : !error ? (
        <p role="status">Loading saved processing state…</p>
      ) : null}
    </>
  );
}
