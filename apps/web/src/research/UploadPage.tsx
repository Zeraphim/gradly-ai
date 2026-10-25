import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";
import { ResearchLink as Link, useResearchRouter } from "./navigation.js";
import { Speech, ErrorMessage, ExtractedPages } from "./learning-ui.js";
import { FailureRecovery } from "./FailureRecovery.js";
import { researchSections, spotSections } from "./paper-signals.js";
import { ActionLabel, Icon } from "./icon.js";
import { api } from "./request.js";
import { useDocumentUpload } from "./useDocumentUpload.js";
import type { ResearchConfig, UploadDraft } from "./types.js";
import { SceneMotion, m, useSceneMotion } from "./scenes/scene-motion.js";
import "./upload-review.css";
import "./preparation-track.css";
import "./journey.css";
import { IntakeSteps } from "./IntakeSteps.js";

type UploadPageProps = {
  config: ResearchConfig | null;
  draft: UploadDraft;
  onDraftChange: Dispatch<SetStateAction<UploadDraft>>;
  busy: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
  reduced?: boolean;
};

export function UploadPage(props: UploadPageProps) {
  return (
    <SceneMotion reduced={props.reduced ?? false}>
      <UploadContent {...props} />
    </SceneMotion>
  );
}

function UploadContent({
  config,
  draft,
  onDraftChange,
  busy: externalBusy,
  heading,
  onStart,
}: UploadPageProps) {
  const motion = useSceneMotion();
  const router = useResearchRouter();
  const [pending, setPending] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [view, setView] = useState<"text" | "pdf">("text");
  const consentLock = useRef(false);
  const mounted = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const uploadState = useDocumentUpload({
    draft,
    onDraftChange,
    maxBytes: config?.maxUploadBytes ?? 4000000,
    blocked: externalBusy || pending,
  });
  const {
    file,
    uploaded,
    preview,
    drag,
    setDrag,
    progress: uploadProgress,
    cancel,
  } = uploadState;
  const busy = externalBusy || uploadState.busy || pending;
  // A file chosen on the home page (or here) is checked straight away, so
  // the learner lands on review instead of a second upload screen.
  const autoCheck = !!draft.autoCheck && !!file && !uploaded;
  useEffect(() => {
    if (!autoCheck) return;
    onDraftChange((previous) => ({ ...previous, autoCheck: false }));
    uploadState.upload();
  }, [autoCheck]);
  // Sample mode sends nothing to an AI service, so a home-page start skips
  // the consent review. Live processing always stops here for consent.
  const sampleOnly = !!config?.demoAvailable && !config.liveAI;
  const continuing = !!draft.autoContinue && !!uploaded && sampleOnly;
  useEffect(() => {
    if (!draft.autoContinue || !uploaded || !config) return;
    onDraftChange((previous) => ({ ...previous, autoContinue: false }));
    if (sampleOnly) void confirmProcessing();
  }, [draft.autoContinue, uploaded, config]);
  const pickFile = (file?: File) => {
    setConsentError("");
    return uploadState.pickFile(file);
  };
  const removeFile = () => {
    setConsentError("");
    uploadState.removeFile();
  };
  const upload = () => {
    setConsentError("");
    uploadState.upload();
  };
  const confirmProcessing = async () => {
    if (
      !uploaded ||
      busy ||
      consentLock.current ||
      (!config?.liveAI && !config?.demoAvailable)
    )
      return;
    consentLock.current = true;
    setPending(true);
    setConsentError("");
    try {
      await api("/api/research/jobs", {
        id: uploaded.id,
        consent: true,
        mode: config?.liveAI ? "live" : "demo",
      });
      if (mounted.current) router.push(`/processing/${uploaded.id}`);
    } catch (error) {
      if (mounted.current) setConsentError((error as Error).message);
    } finally {
      consentLock.current = false;
      if (mounted.current) setPending(false);
    }
  };
  const checking = uploadState.busy;
  const fileInput = (
    <input
      ref={input}
      aria-label="Choose PDF file"
      type="file"
      accept="application/pdf,.pdf"
      className="sr-only"
      onChange={(e) => {
        void pickFile(e.target.files?.[0]);
        e.currentTarget.value = "";
      }}
    />
  );
  const ocrPages =
    uploaded?.extraction.filter((p) => p.method === "ocr").map((p) => p.page) ??
    [];
  if (!file)
    return (
      <div className="upload-review-workspace">
        <IntakeSteps current={0} />
        <ErrorMessage message={consentError || uploadState.error} />
        <Speech>
          {config?.liveAI
            ? "Check your paper first. You choose when its text is sent for AI processing."
            : config?.demoAvailable
              ? "Check your PDF, then explore a sample quest. Nothing is sent to an AI service."
              : "Check your PDF and inspect its text. The guided reference quest is also available."}
        </Speech>
        <m.section
          data-scene-layout
          layout={motion.position}
          animate={{ scale: drag ? 1.008 : 1 }}
          transition={motion.copy}
          className={`dropzone upload-review-surface ${drag ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void pickFile(e.dataTransfer.files[0]);
          }}
        >
          <header className="upload-review-intro">
            {/* The document lifts toward the cursor while a file is held over it. */}
            <m.div
              className="document-icon"
              data-scene-settle
              animate={
                drag && !motion.still
                  ? { y: -6, scale: 1.08, rotate: -4 }
                  : { y: 0, scale: 1, rotate: 0 }
              }
              transition={motion.copy}
            >
              <Icon name={drag ? "upload" : "document"} size={30} />
            </m.div>
            <div>
              <span className="upload-review-eyebrow">
                Start with your source
              </span>
              <h1 ref={heading} tabIndex={-1}>
                Upload your research paper
              </h1>
              <p aria-live="polite">
                {drag ? (
                  <strong>Drop it here and we’ll check it right away</strong>
                ) : (
                  <>
                    Research PDF · up to{" "}
                    {(config?.maxUploadBytes ?? 4000000) / 1000000} MB · up to
                    80 pages
                  </>
                )}
              </p>
            </div>
          </header>
          {fileInput}
          <div className="upload-review-empty">
            <m.button
              className="btn primary"
              disabled={busy}
              onClick={() => input.current?.click()}
              data-scene-motion-control
              {...motion.gestures(busy)}
            >
              <ActionLabel icon="upload">Choose PDF File</ActionLabel>
            </m.button>
            <span className="upload-review-assurance">
              <Icon name="shield" size={16} /> AI processing only starts with
              your confirmation.
            </span>
          </div>
        </m.section>
        <details className="upload-privacy">
          <summary>Your paper, your choice · privacy & supported files</summary>
          <p>
            Use documents you have permission to process. English scans use
            bounded OCR for up to six image pages. Unreadable or longer scans
            need a clearer searchable copy. Password-protected and corrupt PDFs
            receive a recoverable error.
          </p>
          <Link className="inline-action" href="/privacy">
            <ActionLabel icon="shield">Privacy & AI processing</ActionLabel>
          </Link>
        </details>
        <section className="alternative">
          <div>
            <span className="upload-review-eyebrow">A guided first look</span>
            <h2>Try a reference investigation</h2>
          </div>
          <button disabled={busy} className="path-card" onClick={onStart}>
            <span className="upload-reference-icon">
              <Icon name="research" size={26} />
            </span>
            <span className="upload-reference-copy">
              <strong>Can You Text and Still Learn?</strong>
              <span>
                Research design, independent groups, and statistical
                interpretation.
              </span>
            </span>
            <span className="text-link">
              <ActionLabel>Start a sample quest</ActionLabel>
            </span>
          </button>
        </section>
      </div>
    );
  const fileLine = (
    <div className="review-file">
      <Icon name="document" size={18} />
      <span className="review-file-name">{file.name}</span>
      <span className="review-file-meta">
        {(file.size / 1000000).toFixed(2)} MB
        {uploaded
          ? ` · ${uploaded.pageCount} ${uploaded.pageCount === 1 ? "page" : "pages"}`
          : ""}
      </span>
      <span className="review-file-status" role="status" hidden={!!uploaded}>
        {uploaded
          ? "Text extracted"
          : checking
            ? uploadProgress < 100
              ? "Uploading PDF"
              : "Reading and validating"
            : uploadState.error
              ? "Not checked"
              : "Ready to check"}
      </span>
      <span className="review-file-actions">
        {uploaded && preview ? (
          <a
            className="j-link"
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open original PDF
            <span className="sr-only"> in a new tab</span>
          </a>
        ) : null}
        <button
          className="j-link"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          Replace
        </button>
        <button
          className="j-link"
          disabled={busy}
          onClick={() => {
            removeFile();
            if (input.current) input.current.value = "";
          }}
        >
          Remove
        </button>
      </span>
    </div>
  );
  if (
    !uploaded ||
    continuing ||
    (sampleOnly && (pending || (!!consentError && !!draft.file)))
  )
    return (
      <div className="journey review is-pending">
        {fileInput}
        {checking || uploaded ? (
          <div className="review-checking">
            <div className="prep-paper is-scanning" aria-hidden="true">
              <span className="prep-paper-fold" />
              {[78, 92, 64, 88, 70, 84, 52].map((width, line) => (
                <span
                  key={line}
                  className="prep-paper-line"
                  style={{ width: `${width}%` }}
                />
              ))}
              <span className="prep-scan" />
            </div>
            <header className="journey-head is-centered">
              <h1 ref={heading} tabIndex={-1}>
                {uploaded ? "Starting preparation" : "Reading your paper"}
              </h1>
              <p>
                {uploaded
                  ? "Your document is read. Handing it to the preparation agents."
                  : "We’re validating the file and extracting its text. Nothing is sent to an AI service at this step."}
              </p>
            </header>
            {fileLine}
            {consentError ? (
              <div className="review-recovery">
                <FailureRecovery
                  message={consentError}
                  busy={busy}
                  heading="We couldn’t start preparation"
                  retryLabel="Try again"
                  onRetry={() => void confirmProcessing()}
                />
              </div>
            ) : null}
            <div className="review-progress" hidden={!checking}>
              <progress
                aria-label={
                  uploadProgress < 100 ? "Upload progress" : "Reading the PDF"
                }
                value={uploadProgress < 100 ? uploadProgress : undefined}
                max={100}
              />
              <p role="status">
                {uploadProgress < 100
                  ? `${uploadProgress}% transferred.`
                  : "Upload received. Extracting readable text; scanned pages can take longer."}
              </p>
              <button className="j-link" onClick={cancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="review-checking">
            <header className="journey-head is-centered">
              <h1 ref={heading} tabIndex={-1}>
                {uploadState.error
                  ? uploadState.errorKind === "rejected"
                    ? "This file can’t be used"
                    : "We couldn’t finish checking"
                  : "Check your paper"}
              </h1>
              <p>
                {uploadState.error
                  ? "Nothing was sent to an AI service."
                  : "We validate the file and extract its text before any AI processing."}
              </p>
            </header>
            {fileLine}
            {uploadState.error ? (
              <div className="review-recovery">
                <FailureRecovery
                  message={uploadState.error}
                  busy={busy}
                  permanent={uploadState.errorKind === "rejected"}
                  heading="What you can do next"
                  retryLabel="Check again"
                  onRetry={upload}
                  onChooseFile={() => input.current?.click()}
                />
              </div>
            ) : (
              <button className="j-btn" disabled={busy} onClick={upload}>
                <ActionLabel icon="verify">Check this document</ActionLabel>
              </button>
            )}
          </div>
        )}
      </div>
    );
  return (
    <div className="journey review">
      {fileInput}
      <header className="journey-head is-centered">
        <h1 ref={heading} tabIndex={-1}>
          Check what we read
        </h1>
        <p>Make sure the text looks right, then continue.</p>
      </header>
      {fileLine}
      <ErrorMessage message={consentError} />
      <m.section
        className="review-card"
        aria-label="Your document"
        initial={motion.page}
        animate={{ opacity: 1, y: 0 }}
        transition={motion.copy}
      >
        <div className="review-card-head">
          <div className="review-card-title">
            <h2>
              {/* One pop when extraction finishes; a restored review is settled. */}
              <m.span
                className="review-check-pop"
                initial={motion.canEnter() ? { scale: 0.3, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  motion.still
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.45, bounce: 0.5 }
                }
              >
                <Icon name="check" size={16} strong />
              </m.span>
              Document checked
            </h2>
            <span className="review-count">
              {uploaded.pageCount} {uploaded.pageCount === 1 ? "page" : "pages"}
            </span>
          </div>
          <div className="review-tabs" role="tablist" aria-label="View">
            {(
              [
                ["text", "What we read"],
                ["pdf", "Original PDF"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                id={`review-tab-${id}`}
                aria-controls={`review-panel-${id}`}
                aria-selected={view === id}
                className={view === id ? "is-active" : ""}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div
          id="review-panel-text"
          role="tabpanel"
          aria-labelledby="review-tab-text"
          hidden={view !== "text"}
        >
          <ExtractedPages key={uploaded.id} pages={uploaded.pages} />
        </div>
        <div
          id="review-panel-pdf"
          role="tabpanel"
          aria-labelledby="review-tab-pdf"
          hidden={view !== "pdf"}
          className="review-original"
        >
          {view === "pdf" ? (
            <iframe
              title="Selected research PDF preview"
              /* FitH asks the built-in viewer to fit the page width. */
              src={preview ? `${preview}#view=FitH` : undefined}
            />
          ) : null}
        </div>
        {ocrPages.length ? (
          <p className="ocr-warning">
            {`${ocrPages.length === 1 ? "Page" : "Pages"} ${ocrPages.join(", ")} ${ocrPages.length === 1 ? "was" : "were"} read with English OCR and may contain transcription errors. Check text and numbers against the original.`}
          </p>
        ) : null}
      </m.section>
      <QuickCheck pages={uploaded.pages} />
      <div className="journey-actions">
        <div className="journey-actions-inner">
          <p>
            <Icon name="shield" size={16} />
            <span>
              {config?.liveAI
                ? "Continuing sends the text to Nebius for AI processing. AI can make mistakes."
                : config?.demoAvailable
                  ? "Sample preview: we prepare an authored texting study, not your PDF."
                  : "Live AI is not configured. The authored sample study is still available."}{" "}
              <span className="review-privacy">
                Extracted text is stored for 30 days or until deleted.{" "}
                <Link href="/privacy">Privacy & AI processing</Link>
              </span>
            </span>
          </p>
          <div className="journey-actions-buttons">
            {!config?.liveAI && !config?.demoAvailable ? (
              <button
                className="j-btn is-quiet"
                disabled={busy}
                onClick={onStart}
              >
                Start the featured quest
              </button>
            ) : null}
            <button
              disabled={busy || (!config?.liveAI && !config?.demoAvailable)}
              className="j-btn"
              onClick={confirmProcessing}
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
        </div>
      </div>
    </div>
  );
}

/** A local text check: which common research sections appear as headings. */
function QuickCheck({ pages }: { pages: { text: string }[] }) {
  const found = spotSections(pages);
  const names = researchSections
    .filter((section) => found.has(section.id))
    .map((section) => section.label);
  return (
    <p
      className={`quick-check ${found.size < 3 ? "is-few" : ""}`}
      aria-label="Sections we spotted"
    >
      {found.size >= 3 ? (
        <>
          <Icon name="check" size={15} strong /> Looks like a research paper: we
          spotted {names.slice(0, 4).join(", ")}
          {names.length > 4 ? ` and ${names.length - 4} more` : ""}.
        </>
      ) : (
        <>
          Few research sections showed up. If this isn’t a research paper, a{" "}
          <Link href="/learn">prepared study</Link> may work better.
        </>
      )}
      <small> Quick text check, not an analysis.</small>
    </p>
  );
}
