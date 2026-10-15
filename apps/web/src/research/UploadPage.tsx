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
import { ActionLabel, Icon } from "./icon.js";
import { api } from "./request.js";
import { useDocumentUpload } from "./useDocumentUpload.js";
import type { ResearchConfig, UploadDraft } from "./types.js";

export function UploadPage({
  config,
  draft,
  onDraftChange,
  busy: externalBusy,
  heading,
  onStart,
}: {
  config: ResearchConfig | null;
  draft: UploadDraft;
  onDraftChange: Dispatch<SetStateAction<UploadDraft>>;
  busy: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  const router = useResearchRouter();
  const [pending, setPending] = useState(false);
  const [consentError, setConsentError] = useState("");
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
  return (
    <>
      <ErrorMessage message={consentError || uploadState.error} />
      <Speech>
        {config?.liveAI
          ? "Check your paper first. You choose when its text is sent for AI processing."
          : config?.demoAvailable
            ? "Check your PDF, then explore a sample adventure. Nothing is sent to an AI service."
            : "Check your PDF and inspect its text. The guided reference investigation is also available."}
      </Speech>
      <section
        className={`dropzone ${file ? "has-file" : ""} ${uploaded ? "is-checked" : ""} ${drag ? "dragging" : ""}`}
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
        <div className="document-icon">
          <Icon name="document" />
        </div>
        <h1 ref={heading} tabIndex={-1}>
          {uploaded ? "Review your paper" : "Upload your Research Paper"}
        </h1>
        <p>
          Research PDF • up to {(config?.maxUploadBytes ?? 4000000) / 1000000}{" "}
          MB • up to 80 pages
        </p>
        <input
          ref={input}
          aria-label="Choose PDF file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) => {
            void pickFile(e.target.files?.[0]);
            e.currentTarget.value = "";
          }}
        />
        <button
          className="btn primary"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          <ActionLabel icon="upload">
            {file ? "Replace PDF" : "Choose PDF File"}
          </ActionLabel>
        </button>
        {file ? (
          <div className="file-preview">
            <div className="file-info">
              <strong>{file.name}</strong>
              <span>{(file.size / 1000000).toFixed(2)} MB</span>
              <button
                className="btn compact outline"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                Replace
              </button>
              <button
                className="btn compact outline"
                disabled={busy}
                onClick={() => {
                  removeFile();
                  if (input.current) input.current.value = "";
                }}
              >
                Remove
              </button>
            </div>
            <section className="original-preview" aria-label="Original PDF">
              <div className="original-preview-header">
                <strong>Original PDF</strong>
                {preview ? (
                  <a
                    className="inline-action"
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open original PDF
                    <span className="sr-only"> in a new tab</span>
                    <Icon name="arrow" size={15} />
                  </a>
                ) : null}
              </div>
              <iframe
                title="Selected research PDF preview"
                src={preview || undefined}
              />
              <p className="original-preview-help">
                If the preview is blank, open the original PDF.
              </p>
            </section>
            {uploaded ? (
              <div className="notice document-review">
                <div className="review-heading">
                  <span className="review-check" aria-hidden="true">
                    <Icon name="check" size={19} />
                  </span>
                  <div>
                    <h2>Document checked</h2>
                    <p>
                      {uploaded.pageCount}{" "}
                      {uploaded.pageCount === 1 ? "page" : "pages"} with
                      extracted text. Review before continuing.
                    </p>
                  </div>
                </div>
                <ExtractedPages pages={uploaded.pages} />
                {uploaded.extraction?.some((p) => p.method === "ocr") ? (
                  <p className="ocr-warning">
                    Some pages were read with English OCR. Check text and
                    numbers against the original. Confidence is an estimate, not
                    a guarantee.
                  </p>
                ) : null}
                <div className="processing-choice">
                  <span className="tag">
                    {config?.liveAI
                      ? "Ready for your confirmation"
                      : "Explore the complete flow"}
                  </span>
                  <p>
                    {config?.liveAI
                      ? "Continuing sends extracted text to Nebius. AI can make mistakes."
                      : config?.demoAvailable
                        ? "Preview uses a separate sample study. Your PDF is checked, but its content won’t be analyzed or used to invent findings."
                        : "Live AI is not configured. You can still start the guided reference investigation."}
                  </p>
                  <button
                    disabled={
                      busy || (!config?.liveAI && !config?.demoAvailable)
                    }
                    className="btn primary"
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
                  <small>
                    Original PDF stays in this browser. Extracted text is stored
                    for 30 days or until deleted.
                  </small>
                </div>
              </div>
            ) : (
              <>
                <p>
                  Validate and extract text before any external AI processing.
                </p>
                <button
                  disabled={busy}
                  className="btn secondary"
                  onClick={upload}
                >
                  <ActionLabel busy={busy} icon="verify">
                    {busy ? "Uploading & validating…" : "Check this document"}
                  </ActionLabel>
                </button>
                {busy ? (
                  <>
                    <progress
                      aria-label="Upload progress"
                      value={uploadProgress}
                      max={100}
                    />
                    <p>
                      {uploadProgress}% transferred. Server validation follows.
                    </p>
                    <button className="btn outline compact" onClick={cancel}>
                      Cancel upload
                    </button>
                  </>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <p className="quiet">Drag and drop a PDF, or choose a file above.</p>
        )}
      </section>
      <details className="upload-privacy">
        <summary>Your paper, your choice · privacy & supported files</summary>
        <p>
          Use documents you have permission to process. English scans use
          bounded OCR for up to six image pages. Unreadable or longer scans need
          a clearer searchable copy. Password-protected and corrupt PDFs receive
          a recoverable error.
        </p>
        <Link className="inline-action" href="/privacy">
          <ActionLabel icon="shield">Privacy & AI processing</ActionLabel>
        </Link>
      </details>
      {!uploaded ? (
        <section className="alternative">
          <h2>Try a reference investigation</h2>
          <button disabled={busy} className="path-card" onClick={onStart}>
            <strong>Can You Text and Still Learn?</strong>
            <p>
              Research design, independent groups, and statistical
              interpretation.
            </p>
            <span className="text-link">
              <ActionLabel>Begin the featured adventure</ActionLabel>
            </span>
          </button>
        </section>
      ) : null}
    </>
  );
}
