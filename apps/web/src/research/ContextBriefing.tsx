import { useId } from "react";
import { PaperIdentity } from "../components/PaperIdentity.js";
import { PaperStory } from "../components/PaperStory.js";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import { Progress, ErrorMessage, ExtractedPages } from "./learning-ui.js";
import { contextProvenance } from "./paper-context.js";
import { SceneMotion, m, useSceneMotion } from "./scenes/scene-motion.js";
import type { ProcessingPageProps } from "./ProcessingPage.js";

/** Sample context and real upload text have separate provenance. Findings stay gated. */
export function ContextBriefing(props: ProcessingPageProps) {
  return (
    <SceneMotion reduced={props.reduced ?? false}>
      <ContextBriefingContent {...props} />
    </SceneMotion>
  );
}
function ContextBriefingContent({
  job,
  busy,
  error,
  heading,
  sourcePages,
  onStart,
  onStep,
  onLoadPages,
  reduced,
}: ProcessingPageProps) {
  const motion = useSceneMotion();
  const source = useId();
  if (!job) return <p role="status">Loading saved processing state…</p>;
  const ready = job.status === "ready";
  return (
    <>
      <m.div
        className="briefing-head"
        initial={motion.page}
        animate={{ opacity: 1, y: 0 }}
        transition={motion.swap}
      >
        <span className="tag">Step 2 · Understand the paper</span>
        <h1 ref={heading} tabIndex={-1}>
          A paper is more than its conclusion.
        </h1>
        <p className="briefing-lede">
          Start with the question, trace the study, and notice what it can tell
          you.
        </p>
      </m.div>
      <ErrorMessage message={error} />
      <PaperIdentity />
      <div className="briefing-provenance">
        <Icon name="book" size={20} />
        <p>{contextProvenance}</p>
      </div>
      <PaperStory reduced={reduced} />
      {ready ? (
        <div className="paper-actions">
          <m.button
            className="btn primary"
            disabled={busy}
            onClick={() => onStart(job.id)}
            data-scene-motion-control
            {...motion.gestures(busy)}
          >
            <ActionLabel>Start quest</ActionLabel>
          </m.button>
        </div>
      ) : (
        <div className="briefing-progress">
          <Progress value={job.stage} max={5} label="Preparation steps" />
        </div>
      )}
      {(["failed", "review"].includes(job.status) || job.error || error) && (
        <div className="notice">
          <ErrorMessage message={job.error ?? ""} />
          <button
            className="btn secondary"
            disabled={busy}
            onClick={() => onStep(true)}
          >
            {job.status === "review"
              ? "Regenerate & review again"
              : "Retry failed stage"}
          </button>
        </div>
      )}
      <section className="source-card" aria-labelledby={source}>
        <div className="source-card-head">
          <Icon name="document" size={16} />
          <h2 id={source}>Source &amp; your document</h2>
        </div>
        <details>
          <summary>
            How the sample was prepared
            <small>{job.stage} of 5 steps</small>
          </summary>
          <p>
            Five saved stages. These summaries are authored, not a live model’s
            reasoning.
          </p>
          <div className="briefing-trace-rows">
            {job.audits.map((audit) => (
              <div className="briefing-trace-row" key={audit.role}>
                <span
                  className={`status ${audit.status.toLowerCase().replace(" ", "-")}`}
                >
                  {audit.status}
                </span>
                <div>
                  <strong>{audit.role}</strong>
                  <p>{audit.task}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
        <details>
          <summary>View your upload’s extracted text</summary>
          <h3>{job.name}</h3>
          <p>
            Your document was extracted. The study above is a separate, authored
            reference.
          </p>
          {job.extraction.some((page) => page.method === "ocr") && (
            <p>
              English OCR was used. Check transcription and numbers against your
              original PDF.
            </p>
          )}
          {!sourcePages ? <blockquote>{job.excerpt}</blockquote> : null}
          {sourcePages ? (
            <ExtractedPages pages={sourcePages} />
          ) : (
            <button
              className="btn outline compact"
              disabled={busy}
              onClick={onLoadPages}
            >
              Inspect all extracted pages
            </button>
          )}
        </details>
        <div className="source-card-foot">
          <Link className="btn outline compact" href="/upload">
            Return to upload
          </Link>
        </div>
      </section>
    </>
  );
}
