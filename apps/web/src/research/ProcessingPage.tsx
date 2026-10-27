import { useEffect, useRef, type RefObject } from "react";
import type { PageText } from "../../../api/src/research/contracts.js";
import type { ProcessingJob, ResearchConfig } from "./types.js";
import { ActionLabel, Icon } from "./icon.js";
import { ErrorMessage, ExtractedPages } from "./learning-ui.js";
import { ResearchLink as Link } from "./navigation.js";
import { PreparationStages, PreparationTrack } from "./PreparationTrack.js";
import { FailureRecovery, jobFailureReason } from "./FailureRecovery.js";
import { SceneMotion, m, useSceneMotion } from "./scenes/scene-motion.js";
import { PreparationOutline } from "./PreparationOutline.js";
import { PreparationWarmup } from "./PreparationWarmup.js";
import { ReadyHandoff } from "./ReadyHandoff.js";
import {
  clearActivePreparation,
  writeActivePreparation,
} from "./client-state.js";
import { linkNoteLabel } from "./link-note.js";
import "./upload-review.css";

export type ProcessingPageProps = {
  job: ProcessingJob | null;
  config: ResearchConfig | null;
  busy: boolean;
  error: string;
  /** The error came from advancing a consented stage, not a page action. */
  stageInterrupted?: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  sourcePages: PageText[] | null;
  onStart: (lessonId?: string) => void;
  onStep: (retry?: boolean, consent?: boolean) => void;
  onLoadPages: () => void;
  reduced?: boolean;
};

/** Uploads and explicitly labeled samples share one preparation and recovery flow. */
export function ProcessingPage(props: ProcessingPageProps) {
  return (
    <SceneMotion reduced={props.reduced ?? false}>
      <PreparationPage {...props} />
    </SceneMotion>
  );
}

function headingFor(job: ProcessingJob | null, failed: boolean) {
  if (!job) return "Opening your saved paper";
  if (!job.consented) return "Confirm before preparing";
  if (job.status === "ready")
    return job.mode === "demo"
      ? "Your investigation is ready"
      : "Your study is ready";
  if (failed) return "Preparation paused";
  return "Preparing your investigation";
}

function PreparationPage({
  job,
  config,
  busy,
  error,
  stageInterrupted = false,
  heading,
  sourcePages,
  onStart,
  onStep,
  onLoadPages,
}: ProcessingPageProps) {
  const motion = useSceneMotion();
  const demo = job?.mode === "demo";
  const ready = job?.status === "ready";
  const jobFailed = !!job && ["failed", "review"].includes(job.status);
  const failed =
    !!job && (jobFailed || (stageInterrupted && job.consented && !ready));
  // Consent, inspection and opening errors stay inline; their own buttons retry.
  const actionError = failed ? "" : error;
  const ocrPages = job?.extraction.filter((p) => p.method === "ocr") ?? [];
  const canProcess = !!(config?.liveAI || config?.demoAvailable);
  // Enter continues from a ready sample, like the rest of the quest.
  useEffect(() => {
    if (!ready || !demo || !job) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key !== "Enter" || target?.closest("button, a, summary, input"))
        return;
      window.location.hash = `#/research/meet/${job.id}`;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, demo, job?.id]);
  // Arrivals play only for changes seen on this page. The saved job loads after
  // the page mounts, so a reopened job must not replay consent or ready.
  const seen = useRef<{ consented: boolean; ready: boolean } | null>(null);
  const arrived = useRef({ consent: false, ready: false });
  if (job) {
    if (seen.current && !seen.current.consented && job.consented)
      arrived.current.consent = true;
    if (seen.current && !seen.current.ready && ready)
      arrived.current.ready = true;
    seen.current = { consented: job.consented, ready };
  }
  // Remember an unfinished preparation so the home page can lead back to it.
  const working = !!job?.consented && !ready && !jobFailed;
  useEffect(() => {
    if (!job) return;
    if (ready) clearActivePreparation(job.id);
    else if (job.consented)
      writeActivePreparation({ id: job.id, name: job.name });
  }, [job?.id, job?.consented, ready]);
  // Links become a "link note" document in sample mode (see link-note.ts).
  const linkNote = job ? linkNoteLabel(job.name) : null;
  const linkLabel = linkNote ? `Link · ${linkNote}` : null;
  const sourceReview = job ? (
    <details className="card processing-source-review" open={!job.consented}>
      <summary>View extracted text</summary>
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
  ) : null;
  return (
    <div className="journey prep-page">
      <header className="journey-head is-centered">
        <h1 ref={heading} tabIndex={-1}>
          {headingFor(job, failed)}
        </h1>
        <p>
          {!job
            ? "Loading the saved document and its preparation state."
            : !job.consented
              ? "Check the extracted text, then choose whether to continue."
              : demo
                ? "Sample preview: we prepare the texting study, not your file."
                : ready
                  ? "Generated by AI from your paper, so it can contain errors. The source stays one tap away."
                  : failed
                    ? "Your paper and every finished step are saved."
                    : "Six agents read your paper in turn. Warm up below while they work."}
        </p>
      </header>
      {job ? (
        <>
          <p className="prep-file">
            <Icon name="document" size={16} />
            <span className="prep-document-name">{linkLabel ?? job.name}</span>
            {linkLabel ? (
              <span>· link noted, not fetched</span>
            ) : (
              <span>
                · {job.pageCount} {job.pageCount === 1 ? "page" : "pages"} read
              </span>
            )}
          </p>
          {ocrPages.length ? (
            <p className="prep-ocr-note">
              {ocrPages.length === 1 ? "Page" : "Pages"}{" "}
              {ocrPages.map((p) => p.page).join(", ")}{" "}
              {ocrPages.length === 1 ? "was" : "were"} transcribed from a scan
              with English OCR and may contain errors. Check numbers against the
              original.
            </p>
          ) : null}
          {!job.consented ? (
            <div className="prep-source-first">{sourceReview}</div>
          ) : ready && !demo ? (
            <ReadyHandoff job={job} celebrate={arrived.current.ready} />
          ) : (
            // Enters after consent; a reopened job starts settled.
            <m.div
              initial={
                arrived.current.consent && motion.canEnter()
                  ? { opacity: 0, y: 12 }
                  : false
              }
              animate={{ opacity: 1, y: 0 }}
              transition={motion.copy}
            >
              <PreparationTrack job={job} />
            </m.div>
          )}
          {job.consented && !ready && !demo ? (
            <PreparationOutline job={job} />
          ) : null}
          {working && !demo ? <PreparationWarmup jobId={job.id} /> : null}
          {failed ? (
            <div className="prep-recovery">
              <FailureRecovery
                reason={jobFailureReason(job)}
                message={job.error || error || "This stage needs another try."}
                busy={busy}
                retryLabel={
                  job.status === "review"
                    ? "Regenerate and review again"
                    : "Retry this stage"
                }
                onRetry={
                  config?.liveAI || demo ? () => onStep(jobFailed) : undefined
                }
              />
            </div>
          ) : (
            <ErrorMessage message={actionError} />
          )}
          <details className="prep-more">
            <summary>Details</summary>
            <div className="prep-more-body">
              <PreparationStages job={job} />
              {job.consented ? sourceReview : null}
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
                        {r.id} • {demo ? "Sample source page" : "PDF page"}{" "}
                        {r.page}
                      </h3>
                      <blockquote>{r.excerpt}</blockquote>
                    </div>
                  ))}
                </details>
              ) : null}
            </div>
          </details>
          {!job.consented || ready ? (
            <div className="journey-actions">
              <div className="journey-actions-inner">
                {!job.consented ? (
                  canProcess ? (
                    <>
                      <p>
                        <Icon name="shield" size={16} />
                        {config?.liveAI
                          ? "Continuing sends extracted text to Nebius Token Factory for AI processing. AI can make mistakes."
                          : "No AI is called. A separate authored sample study is prepared instead of your upload."}
                      </p>
                      <div className="journey-actions-buttons">
                        <button
                          className="j-btn"
                          disabled={busy}
                          onClick={() => onStep(false, true)}
                        >
                          <ActionLabel busy={busy}>
                            {busy
                              ? "Opening…"
                              : config?.liveAI
                                ? "Confirm AI processing"
                                : "Start sample preview"}
                          </ActionLabel>
                        </button>
                      </div>
                    </>
                  ) : config ? (
                    <>
                      <p>
                        <Icon name="shield" size={16} />
                        The document has been extracted. Live AI isn’t
                        configured on this server, so no model has been called.
                      </p>
                      <div className="journey-actions-buttons">
                        <button className="j-btn" onClick={() => onStart()}>
                          <ActionLabel>
                            Start reference investigation
                          </ActionLabel>
                        </button>
                      </div>
                    </>
                  ) : null
                ) : demo ? (
                  <>
                    <p>
                      <Icon name="shield" size={16} />
                      Press Enter or start when you’re ready.
                    </p>
                    <div className="journey-actions-buttons">
                      <Link className="j-btn" href={`/meet/${job.id}`}>
                        <ActionLabel>Start the quest</ActionLabel>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <Icon name="shield" size={16} />
                      One question per screen. Check each choice, then continue.
                    </p>
                    <div className="journey-actions-buttons">
                      <m.button
                        className="j-btn"
                        disabled={busy}
                        data-scene-motion-control
                        {...motion.gestures(busy)}
                        onClick={() => onStart(job.id)}
                      >
                        <ActionLabel busy={busy}>
                          {busy ? "Opening…" : "Start your study"}
                        </ActionLabel>
                      </m.button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : !error ? (
        <p role="status" className="prep-loading">
          Loading saved processing state…
        </p>
      ) : null}
    </div>
  );
}
