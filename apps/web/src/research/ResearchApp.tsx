import "./styles.css";
import {
  ResearchLink as Link,
  useResearchPath,
  useResearchRouter,
} from "./navigation.js";
import { BrandLogo } from "../components/BrandLogo.js";
import { ActionLabel, Icon } from "./icon.js";
import {
  Mascot,
  Speech,
  Progress,
  ErrorMessage,
  ExtractedPages,
} from "./learning-ui.js";

import { useCallback, useEffect, useRef, useState } from "react";
import type { publicSession } from "../../../api/src/research/engine.js";
import type { publicJob } from "../../../api/src/research/pipeline.js";
type Session = ReturnType<typeof publicSession>;
type Job = ReturnType<typeof publicJob>;
type Config = {
  liveAI: boolean;
  demoAvailable: boolean;
  maxUploadBytes: number;
  storage: boolean;
  model: string;
};
type History = {
  id: string;
  title: string;
  phase: string;
  index: number;
  created: string;
  source?: "featured" | "generated" | "demo";
};
type Doc = {
  id: string;
  name: string;
  status: string;
  pages: number;
  mode?: string;
};
async function api<T>(
  path: string,
  body?: unknown,
  method = "POST",
): Promise<T> {
  const response = await fetch(
    path,
    body === undefined
      ? { cache: "no-store" }
      : {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
  );
  const data = await response.json();
  if (!response.ok)
    throw Error(data.error || "The request failed. Please try again.");
  return data;
}
const glossary: Record<string, string> = {
  "Between-participants design":
    "Different participants contribute observations in each condition.",
  "Random assignment":
    "A chance process assigns participants to conditions. It supports causal comparisons by reducing systematic initial differences.",
  "Random sampling":
    "A chance process selects people from a population. It concerns representativeness and differs from random assignment.",
  "Independent-samples t-test":
    "Compares two independent group means. The pooled version assumes equal population variances; Welch’s version relaxes that assumption.",
  "One-way ANOVA":
    "Tests group mean differences for one factor. With two groups, the usual equal-variance ANOVA and pooled t-test are equivalent: F = t².",
  "Paired-samples t-test":
    "Tests the mean difference in linked observations, such as repeated measurements of the same people.",
  "Percentage points":
    "The arithmetic difference between two percentages. A relative percentage change instead divides by a baseline.",
  "p-value":
    "Under a specified null model and test assumptions, the probability of a result at least as extreme as the one observed.",
  "Standard deviation":
    "Describes the spread of observations around a mean, in the outcome’s units.",
  Generalizability:
    "Whether findings apply to people, contexts, and outcomes beyond those studied.",
};
export function ResearchApp({
  onExit,
  initialFile,
}: {
  onExit: () => void;
  initialFile?: File | null;
}) {
  const path = useResearchPath();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);
  return (
    <div className="research-lab">
      <GradlyWorkspace
        key={path}
        path={path}
        onExit={onExit}
        initialFile={initialFile}
      />
    </div>
  );
}
function GradlyWorkspace({
  path,
  onExit,
  initialFile,
}: {
  path: string;
  onExit: () => void;
  initialFile?: File | null;
}) {
  const router = useResearchRouter();
  const parts = path.split("/").filter(Boolean);
  const route = parts[0] || "home";
  const id = parts[1];
  const [config, setConfig] = useState<Config | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [editingReasoning, setEditingReasoning] = useState(false);
  const [feedback, setFeedback] = useState<{
    category?: string;
    guidance?: string;
    followup?: string;
    error?: string;
  } | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [file, setFile] = useState<File | null>(initialFile ?? null);
  const [preview, setPreview] = useState("");
  const [sourcePages, setSourcePages] = useState<
    import("../../../api/src/research/contracts.js").PageText[] | null
  >(null);
  const [drag, setDrag] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState<{
    id: string;
    pageCount: number;
    excerpt: string;
    pages: import("../../../api/src/research/contracts.js").PageText[];
    extraction: { page: number; method: string; confidence?: number }[];
  } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reflection, setReflection] = useState("");
  const [confirm, setConfirm] = useState<"restart" | string | null>(null);
  const [reduced, setReduced] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const xhr = useRef<XMLHttpRequest | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const actionLock = useRef(false);
  useEffect(() => {
    api<Config>("/api/research/config")
      .then((c) => {
        setConfig(c);
        try {
          setReduced(localStorage.getItem("gradly-reduced-motion") === "true");
        } catch {}
      })
      .catch(() =>
        setError(
          "Application configuration could not be loaded. Refresh to retry.",
        ),
      );
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);
  const applySession = useCallback((s: Session) => {
    setSession(s);
    setSelected(s.retrying ? [] : (s.challenge?.previousSelection ?? []));
    setReasoning(s.challenge?.reasoning ?? "");
    setFeedback(null);
    setEditingReasoning(false);
    setReflection(s.reflection);
  }, []);
  useEffect(() => {
    if (route === "adventure" && id) {
      api<Session>(`/api/research/learning?id=${encodeURIComponent(id)}`)
        .then(applySession)
        .catch((e) => setError(e.message));
    }
    if (route === "processing" && id) {
      api<Job>(`/api/research/jobs?id=${encodeURIComponent(id)}`)
        .then(setJob)
        .catch((e) => setError(e.message));
    }
    if (route === "history") {
      Promise.all([
        api<History[]>("/api/research/learning"),
        api<Doc[]>("/api/research/documents"),
      ])
        .then(([h, d]) => {
          setHistory(h);
          setDocuments(d);
        })
        .catch((e) => setError(e.message));
    }
  }, [route, id, applySession]);
  useEffect(() => {
    if (!session) return;
    try {
      localStorage.setItem("gradly-last-adventure", session.id);
    } catch {}
    heading.current?.focus();
  }, [session]);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (!confirm) return;
    const dialog = document.querySelector<HTMLElement>("[role=dialog]");
    const previous = document.activeElement as HTMLElement;
    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),a[href],input,textarea",
        ) ?? [],
      );
    focusables()[0]?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirm(null);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = focusables();
      const first = nodes[0],
        last = nodes.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [confirm]);
  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    if (actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    setError("");
    try {
      const s = await api<Session>("/api/research/learning", {
        action,
        id: session?.id,
        version: session?.version,
        ...extra,
      });
      applySession(s);
      if (
        action === "start" ||
        action === "restart" ||
        action === "review-missed"
      )
        router.push(`/adventure/${s.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  };
  const step = useCallback(
    async (retry = false, consent = false) => {
      if (actionLock.current || !id) return;
      actionLock.current = true;
      setBusy(true);
      setError("");
      try {
        if (!consent)
          setJob((j) =>
            j
              ? {
                  ...j,
                  status: "processing",
                  audits: j.audits.map((a, i) =>
                    i === j.stage
                      ? { ...a, status: retry ? "Retrying" : "Processing" }
                      : a,
                  ),
                }
              : j,
          );
        const j = await api<Job>("/api/research/jobs", {
          id,
          retry,
          consent,
          ...(consent ? { mode: config?.liveAI ? "live" : "demo" } : {}),
        });
        setJob(j);
      } catch (e) {
        setError((e as Error).message);
        api<Job>(`/api/research/jobs?id=${id}`)
          .then(setJob)
          .catch(() => {});
      } finally {
        actionLock.current = false;
        setBusy(false);
      }
    },
    [id, config?.liveAI],
  );
  useEffect(() => {
    if (
      route !== "processing" ||
      !job ||
      !job.consented ||
      error ||
      (!config?.liveAI && job.mode !== "demo")
    )
      return;
    if (job.status === "pending") {
      const timer = setTimeout(
        () => void step(),
        job.mode === "demo" ? 650 : 10,
      );
      return () => clearTimeout(timer);
    } else if (job.status === "processing") {
      const timer = setTimeout(() => {
        api<Job>(`/api/research/jobs?id=${id}`)
          .then((j) => {
            setJob(j);
            if (j.leaseUntil < Date.now()) void step();
          })
          .catch((e) => setError(e.message));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [route, job, error, config, step, id]);
  const pickFile = async (f: File | undefined) => {
    if (busy) return;
    setError("");
    setUploaded(null);
    setUploadProgress(0);
    if (!f) return;
    if (
      !f.name.toLowerCase().endsWith(".pdf") ||
      (f.type && f.type !== "application/pdf")
    ) {
      setError("Choose a PDF document.");
      return;
    }
    if (!f.size) {
      setError("This PDF is empty. Choose another file.");
      return;
    }
    if (f.size > (config?.maxUploadBytes ?? 4000000)) {
      setError("This PDF exceeds the 4 MB limit. Choose a smaller file.");
      return;
    }
    if (
      new TextDecoder().decode(await f.slice(0, 5).arrayBuffer()) !== "%PDF-"
    ) {
      setError("This file’s contents are not a PDF.");
      return;
    }
    setFile(f);
  };
  const upload = () => {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    const req = new XMLHttpRequest();
    xhr.current = req;
    req.open("POST", "/api/research/documents");
    req.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    req.onload = () => {
      setBusy(false);
      try {
        const data = JSON.parse(req.responseText);
        if (req.status >= 400) throw Error(data.error);
        setUploaded(data);
      } catch (e) {
        setError((e as Error).message || "Upload failed. Try again.");
      }
    };
    req.onerror = () => {
      setBusy(false);
      setError(
        "The upload was interrupted. Your selected file is still here; retry when connected.",
      );
    };
    req.onabort = () => {
      setBusy(false);
      setUploadProgress(0);
      setError("Upload cancelled. Choose or retry your PDF.");
    };
    const form = new FormData();
    form.append("file", file);
    req.send(form);
  };
  const removeDocument = async (docId: string) => {
    setBusy(true);
    try {
      await api("/api/research/documents", { id: docId }, "DELETE");
      setDocuments((d) => d.filter((item) => item.id !== docId));
      setConfirm(null);
      const h = await api<History[]>("/api/research/learning");
      setHistory(h);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const c = session?.challenge;
  const demo = job?.mode === "demo" || session?.source === "demo";
  const shownFeedback = feedback ?? c?.aiFeedback;
  const bottom =
    (route === "adventure" && session?.phase === "challenge") ||
    (route === "adventure" && session?.phase === "bonus");
  const reviewMode = showReview && !!session?.review;
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
          main?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to content
      </a>
      <header className="header">
        <div className="nav">
          <Link className="brand" href="/">
            <BrandLogo />
          </Link>
          <nav aria-label="Research navigation">
            <button className="btn compact outline" onClick={onExit}>
              <span className="desktop-label">Gradly home</span>
              <span className="mobile-label">Home</span>
            </button>
            <Link
              aria-current={
                route === "home" || route === "learn" ? "page" : undefined
              }
              href="/learn"
            >
              Learn
            </Link>
            <Link
              aria-current={route === "history" ? "page" : undefined}
              href="/history"
            >
              Adventures
            </Link>
            <Link href="/glossary">Glossary</Link>
            <Link href="/help">How it works</Link>
          </nav>
          <Link className="guest-pill" href="/settings">
            Guest settings
          </Link>
        </div>
      </header>
      <main
        id="main"
        className={`main ${bottom ? "learning" : ""} ${route === "upload" ? `upload-page ${uploaded ? "reviewing" : ""}` : route === "processing" ? "processing-page" : ""} ${["home", "learn", "featured"].includes(route) ? "path-page" : ""}`}
      >
        <ErrorMessage message={error} />
        {demo ? (
          <aside className="demo-banner" aria-label="Sample preview mode">
            <strong>Sample preview</strong>
            <span>
              Reference study data · no AI calls · not an analysis of your
              upload
            </span>
          </aside>
        ) : null}
        {config && !config.storage ? (
          <div className="notice">
            <h1>Research extension needs configuration</h1>
            <p>
              The existing curated adventure remains available. Enable the
              extension with remote libSQL storage and SESSION_SECRET on Vercel;
              see the repository setup guide.
            </p>
            <button className="btn primary" onClick={onExit}>
              Return to curated adventure
            </button>
          </div>
        ) : null}
        {config?.storage && ["home", "learn", "featured"].includes(route) ? (
          <>
            <div className="path-intro">
              <Mascot small />
              <p>Small decisions. Deeper understanding.</p>
              <span className="tag">Your research companion</span>
            </div>
            <section className="welcome">
              <span className="tag">Your research-learning companion</span>
              <h1 ref={heading} tabIndex={-1}>
                Think like a researcher.
              </h1>
              <p>
                Start with a guided investigation, or explore the journey with
                your own PDF.
              </p>
              <div className="path-grid">
                <article className="path-card featured-card">
                  <div className="symbol blue">
                    <Icon name="phone" />
                  </div>
                  <span className="tag">Start here · guided investigation</span>
                  <h2>
                    Can You Text
                    <br />
                    and Still Learn?
                  </h2>
                  <p>
                    Explore a classroom experiment. Make your research
                    decisions, then discover what the evidence says.
                  </p>
                  <div className="pills">
                    <span>8 challenges</span>
                    <span>Optional bonus</span>
                    <span>No API key needed</span>
                  </div>
                  <button
                    disabled={busy}
                    className="btn primary"
                    aria-busy={busy}
                    onClick={() => act("start")}
                  >
                    <ActionLabel busy={busy}>
                      {busy ? "Opening…" : "Start investigation"}
                    </ActionLabel>
                  </button>
                </article>
                <article className="path-card">
                  <div className="symbol green">
                    <Icon name="document" />
                  </div>
                  <span className="tag">Bring your own paper</span>
                  <h2>
                    Your paper.
                    <br />A new perspective.
                  </h2>
                  <p>
                    {config.liveAI
                      ? "Bring an empirical research PDF. Review its evidence, then let Gradly build and check your investigation."
                      : "Check your PDF and walk through processing, learning and review with a clearly labeled sample study."}
                  </p>
                  <div className="pills">
                    <span>Page-linked evidence</span>
                    <span>
                      {config.liveAI
                        ? "Live AI ready"
                        : config.demoAvailable
                          ? "Sample preview available"
                          : "Live AI needed"}
                    </span>
                  </div>
                  <Link className="btn outline" href="/upload">
                    <ActionLabel icon="upload">
                      Upload a research paper
                    </ActionLabel>
                  </Link>
                </article>
              </div>
              <p className="quiet">
                Decisions first. Findings next. Understanding throughout.
              </p>
            </section>
          </>
        ) : null}
        {route === "upload" ? (
          <>
            <Speech>
              {config?.liveAI
                ? "Check your paper first. You choose when its text is sent for AI processing."
                : "Check your PDF, then explore a sample adventure. Nothing is sent to an AI service."}
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
                Research PDF • up to{" "}
                {(config?.maxUploadBytes ?? 4000000) / 1000000} MB • up to 80
                pages
              </p>
              <input
                ref={input}
                aria-label="Choose PDF file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => void pickFile(e.target.files?.[0])}
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
                        setFile(null);
                        setUploaded(null);
                        if (input.current) input.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <iframe
                    title="Selected research PDF preview"
                    src={preview || undefined}
                  />
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
                          numbers against the original. Confidence is an
                          estimate, not a guarantee.
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
                          onClick={async () => {
                            setBusy(true);
                            try {
                              await api("/api/research/jobs", {
                                id: uploaded.id,
                                consent: true,
                                mode: config?.liveAI ? "live" : "demo",
                              });
                              router.push(`/processing/${uploaded.id}`);
                            } catch (e) {
                              setError((e as Error).message);
                            } finally {
                              setBusy(false);
                            }
                          }}
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
                          Original PDF stays in this browser. Extracted text is
                          stored for 30 days or until deleted.
                        </small>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>
                        Validate and extract text before any external AI
                        processing.
                      </p>
                      <button
                        disabled={busy}
                        className="btn secondary"
                        onClick={upload}
                      >
                        <ActionLabel busy={busy} icon="verify">
                          {busy
                            ? "Uploading & validating…"
                            : "Check this document"}
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
                            {uploadProgress}% transferred. Server validation
                            follows.
                          </p>
                          <button
                            className="btn outline compact"
                            onClick={() => xhr.current?.abort()}
                          >
                            Cancel upload
                          </button>
                        </>
                      ) : null}
                    </>
                  )}
                </div>
              ) : (
                <p className="quiet">
                  Drag and drop a PDF, or choose a file above.
                </p>
              )}
            </section>
            <details className="upload-privacy">
              <summary>
                Your paper, your choice · privacy & supported files
              </summary>
              <p>
                Use documents you have permission to process. English scans use
                bounded OCR for up to six image pages. Unreadable or longer
                scans need a clearer searchable copy. Password-protected and
                corrupt PDFs receive a recoverable error.
              </p>
              <Link className="inline-action" href="/privacy">
                <ActionLabel icon="shield">Privacy & AI processing</ActionLabel>
              </Link>
            </details>
            {!uploaded ? (
              <section className="alternative">
                <h2>Try a reference investigation</h2>
                <button
                  disabled={busy}
                  className="path-card"
                  onClick={() => act("start")}
                >
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
        ) : null}
        {route === "processing" ? (
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
                    {job.pageCount} {job.pageCount === 1 ? "page" : "pages"}{" "}
                    extracted •{" "}
                    {demo ? "Sample flow · no AI calls" : config?.model}
                  </p>
                  <Progress
                    value={job.stage}
                    max={5}
                    label={
                      demo
                        ? "Sample preparation steps"
                        : "Verified processing stages"
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
                      onClick={() => act("start", { lessonId: job.id })}
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
                      open={
                        a.status === "Failed" || a.status === "Needs Review"
                      }
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
                            <Icon
                              name="loading"
                              size={13}
                              className="is-spinning"
                            />
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
                      onClick={() => step(false, true)}
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
                {!config?.liveAI && !demo && !config?.demoAvailable ? (
                  <div className="notice">
                    <h2>Live inference needs configuration</h2>
                    <p>
                      The document has been extracted. No AI model has been
                      called. Configure the server’s Nebius API key to generate
                      an adventure.
                    </p>
                    <button
                      className="btn primary"
                      onClick={() => act("start")}
                    >
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
                      onClick={() => step(true)}
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
                          {r.id} • {demo ? "Sample source page" : "PDF page"}{" "}
                          {r.page}
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
                      English OCR was used. Check transcription and statistics
                      against the original document. Pages:{" "}
                      {job.extraction
                        .filter((p) => p.method === "ocr")
                        .map(
                          (p) =>
                            `${p.page} (confidence estimate ${p.confidence}%)`,
                        )
                        .join(", ")}
                    </p>
                  ) : null}
                  <blockquote>{job.excerpt}</blockquote>
                  {sourcePages ? (
                    <ExtractedPages pages={sourcePages} />
                  ) : (
                    <button
                      className="btn outline compact"
                      onClick={async () => {
                        try {
                          const result = await api<{
                            pages: import("../../../api/src/research/contracts.js").PageText[];
                          }>(`/api/research/documents?id=${job.id}`);
                          setSourcePages(result.pages);
                        } catch (e) {
                          setError((e as Error).message);
                        }
                      }}
                    >
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
        ) : null}
        {route === "adventure" && session ? (
          <>
            {session.phase === "briefing" ? (
              <>
                <Speech>
                  You make the research decisions. I’ll help you examine the
                  evidence, then we’ll reveal the original paper.
                </Speech>
                <span className="tag">
                  {session.source === "demo"
                    ? "Sample investigation · authored guidance"
                    : session.source !== "generated"
                      ? "Pre-reviewed reference investigation"
                      : "AI-generated • verification passed"}
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  {session.title}
                </h1>
                <div className="card">
                  <h2>Your investigation briefing</h2>
                  <p>{session.briefing}</p>
                  {session.source !== "generated" ? (
                    <p>
                      56 undergraduate students were randomly assigned to text
                      or not text during a lecture. Each participant experienced
                      one condition. After approximately 30 minutes of lecture
                      and a 10-minute distractor activity, they took a nine-item
                      comprehension quiz scored as percentage correct.
                    </p>
                  ) : null}
                  <p>
                    You can revise once after a missed answer. Completion and
                    first-attempt accuracy are tracked separately. Written
                    reasoning is optional.
                  </p>
                </div>
                <button
                  disabled={busy}
                  className="btn primary"
                  onClick={() => act("begin")}
                >
                  <ActionLabel>Begin investigation</ActionLabel>
                </button>
              </>
            ) : null}
            {c && !reviewMode ? (
              <>
                <div className="lesson-top">
                  <Link
                    href="/history"
                    className="exit"
                    aria-label="Save and exit investigation"
                  >
                    <Icon name="close" size={22} />
                  </Link>
                  <Progress
                    value={
                      session.phase === "bonus" ? session.total : session.index
                    }
                    max={session.total}
                    label={
                      session.phase === "bonus"
                        ? "Bonus challenge"
                        : `Challenge ${session.index + 1} of ${session.total}`
                    }
                  />
                  <span className="mode-pill">
                    {demo
                      ? "Sample"
                      : session.source !== "generated"
                        ? "Reference"
                        : "AI-reviewed"}
                  </span>
                </div>
                <Speech>
                  {c.reveal === "results"
                    ? "Look at the group scores. What do they tell us—and what do they leave uncertain?"
                    : c.reveal === "significance"
                      ? "Go beyond the number. Match your interpretation to the design and evidence."
                      : "Let’s investigate. Defend a research decision before we reveal the findings."}
                </Speech>
                <div className="stage">
                  <span>{c.stage}</span>
                  <span>
                    {c.type === "multiple"
                      ? "Select all that apply"
                      : "Choose one response"}
                  </span>
                </div>
                <h1
                  ref={heading}
                  tabIndex={-1}
                  key={`${c.id}-heading`}
                  className="challenge-heading"
                >
                  {c.title}
                </h1>
                {c.evidence.length ? (
                  <section
                    className="study-card"
                    aria-label="Available research evidence"
                  >
                    <h2>Research evidence</h2>
                    {c.reveal === "results" &&
                    session.source !== "generated" ? (
                      <div className="stats-grid">
                        <div>
                          <span className="tag">Condition A</span>
                          <h3>Texting group</h3>
                          <div className="score-row">
                            <span>Mean score</span>
                            <strong>73.41%</strong>
                          </div>
                          <div className="chart-track">
                            <div style={{ width: "73.41%" }} />
                          </div>
                          <p>SD = 16.95%</p>
                        </div>
                        <div>
                          <span className="tag">Condition B</span>
                          <h3>No-texting group</h3>
                          <div className="score-row">
                            <span>Mean score</span>
                            <strong>83.00%</strong>
                          </div>
                          <div className="chart-track">
                            <div style={{ width: "83%" }} />
                          </div>
                          <p>SD = 17.26%</p>
                        </div>
                      </div>
                    ) : (
                      c.evidence.map((e, i) => <p key={i}>{e}</p>)
                    )}
                    {c.feedback &&
                    c.reveal === "results" &&
                    session.source !== "generated" ? (
                      <p className="difference">
                        Difference: 9.59 percentage points
                      </p>
                    ) : null}
                    <p className="quiet">
                      Use only the evidence available at this stage.
                    </p>
                  </section>
                ) : null}
                <p className="question">{c.prompt}</p>
                <fieldset
                  key={`${c.id}-choices`}
                  disabled={busy || !!c.feedback}
                  className="choices"
                >
                  <legend className="sr-only">{c.prompt}</legend>
                  {c.options.map((o, index) => (
                    <label
                      key={o.id}
                      style={{ animationDelay: `${index * 35}ms` }}
                      className={`choice ${selected.includes(o.id) ? "selected" : ""}`}
                    >
                      <input
                        type={c.type === "multiple" ? "checkbox" : "radio"}
                        name="answer"
                        value={o.id}
                        checked={selected.includes(o.id)}
                        onChange={() => {
                          setSelected(
                            c.type === "single"
                              ? [o.id]
                              : selected.includes(o.id)
                                ? selected.filter((s) => s !== o.id)
                                : [...selected, o.id],
                          );
                        }}
                      />
                      <span className="keycap">{o.id}</span>
                      <span>{o.text}</span>
                      <span aria-hidden="true" className="selection-mark">
                        {selected.includes(o.id) ? (
                          <Icon name="check" size={19} />
                        ) : null}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <div className="support-grid">
                  <details className="support">
                    <summary className="icon-summary">
                      Study Details
                      <Icon
                        name="chevron"
                        size={17}
                        className="disclosure-chevron"
                      />
                    </summary>
                    {session.source !== "generated" ? (
                      <p>
                        Random assignment; separate participant groups;
                        numerical percentage-correct outcome. The quiz followed
                        a lecture and a distractor activity. Statistical
                        assumptions need examination; random assignment does not
                        guarantee normality or independence in every testing
                        arrangement.
                      </p>
                    ) : (
                      <p>
                        {c.evidence.join(" ") ||
                          "Use the research evidence supplied with this challenge. Missing evidence should not be inferred."}
                      </p>
                    )}
                  </details>
                  <details className="support">
                    <summary className="icon-summary">
                      Hint
                      <Icon
                        name="chevron"
                        size={17}
                        className="disclosure-chevron"
                      />
                    </summary>
                    <p>{c.hint}</p>
                  </details>
                </div>
                {c.writtenReasoning ? (
                  <div className="reasoning">
                    <label htmlFor="reasoning">
                      Defend your decision{" "}
                      <span className="quiet">(optional)</span>
                    </label>
                    <textarea
                      id="reasoning"
                      value={reasoning}
                      maxLength={3000}
                      disabled={busy || (!!c.feedback && !editingReasoning)}
                      onChange={(e) => setReasoning(e.target.value)}
                      placeholder="How does the study design support your choice?"
                    />
                    {c.feedback ? (
                      <div className="actions">
                        {editingReasoning ? (
                          <>
                            <button
                              className="btn secondary"
                              disabled={busy}
                              onClick={() =>
                                act("revise-reasoning", { reasoning })
                              }
                            >
                              Save revised explanation
                            </button>
                            <button
                              className="btn outline"
                              disabled={busy}
                              onClick={() => {
                                setReasoning(c.reasoning);
                                setEditingReasoning(false);
                              }}
                            >
                              Cancel revision
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn outline compact"
                            onClick={() => setEditingReasoning(true)}
                          >
                            Revise explanation
                          </button>
                        )}
                      </div>
                    ) : null}
                    <p className="quiet">
                      Your selection uses the answer guide. Written reasoning
                      receives AI evaluation only when you request live
                      feedback.
                    </p>
                  </div>
                ) : null}
                {c.feedback ? (
                  <>
                    <section
                      className={`feedback ${c.feedback.correct ? "correct" : "incorrect"}`}
                      aria-live="polite"
                    >
                      <h2>
                        {c.feedback.correct
                          ? "Well reasoned!"
                          : c.attempts === 1
                            ? "Let’s reconsider."
                            : "Here’s the reference explanation."}
                      </h2>
                      <p>{c.feedback.message}</p>
                      {c.feedback.explanation && !c.feedback.correct ? (
                        <p>{c.feedback.explanation}</p>
                      ) : null}
                    </section>
                    <details className="agent-panel">
                      <summary>See How Gradly’s AI Agents Helped</summary>
                      <p className="quiet">
                        {session.source !== "generated"
                          ? "Reference guidance • no model was called for answer checking."
                          : "Guidance from the verified lesson • no new inference for answer checking."}
                      </p>
                      {[
                        [
                          "Research Evidence Analyst",
                          "Relevant Research Evidence",
                          c.evidence.join(" ") ||
                            "Independent participants, one condition per person, and a numerical quiz outcome.",
                        ],
                        [
                          "Statistical Reviewer",
                          "Statistical Assessment",
                          c.feedback.explanation ||
                            "Check whether your selected method matches the outcome and the relationship between observations.",
                        ],
                        [
                          "Learning Coach",
                          "Identified Misconception",
                          c.feedback.correct
                            ? "Your selected response matches the accepted answer guide."
                            : c.feedback.message,
                        ],
                        [
                          "Verification Layer",
                          "Evidence Verification",
                          "The answer was checked against the lesson’s accepted responses. Written reasoning has not changed that score.",
                        ],
                        [
                          "Learning Coach",
                          "Learning Guidance",
                          c.id === "q3"
                            ? "Does each student have a score in both conditions, or only one? What would make two observations paired?"
                            : c.hint,
                        ],
                      ].map(([role, title, text]) => (
                        <details className="audit-detail" key={title}>
                          <summary>{title}</summary>
                          <p>
                            <strong>{role}</strong> •{" "}
                            {session.source !== "generated"
                              ? "Reference role"
                              : "Verified lesson role"}
                          </p>
                          <p>Input: {c.title}</p>
                          <p>{text}</p>
                          <p>
                            Source references:{" "}
                            {c.references
                              .map(
                                (r) =>
                                  `${r.id}, ${session.source !== "generated" ? "published page" : "PDF page"} ${r.page}`,
                              )
                              .join("; ")}
                          </p>
                          <p>Status: available reference guidance</p>
                        </details>
                      ))}
                      {c.writtenReasoning && reasoning ? (
                        <>
                          <button
                            className="btn secondary"
                            disabled={
                              busy ||
                              editingReasoning ||
                              (!demo && !config?.liveAI)
                            }
                            onClick={async () => {
                              if (demo) {
                                setFeedback({
                                  category: "Reference guidance",
                                  guidance:
                                    c.feedback?.explanation ??
                                    c.feedback?.message,
                                  followup:
                                    "Compare this guidance with your explanation. Your writing is saved; no AI assessment was performed.",
                                });
                                return;
                              }
                              setBusy(true);
                              try {
                                const response = await api<{
                                  session: Session;
                                }>("/api/research/feedback", {
                                  id: session.id,
                                });
                                applySession(response.session);
                              } catch (e) {
                                setFeedback({
                                  error: `${(e as Error).message} Your reasoning is saved. Use the reference explanation; no live assessment was completed.`,
                                });
                              } finally {
                                setBusy(false);
                              }
                            }}
                          >
                            {demo
                              ? "Explore sample guidance"
                              : "Ask AI to review my reasoning"}
                          </button>
                          {!config?.liveAI && !demo ? (
                            <p>
                              Live AI is not configured. Your written reasoning
                              is saved but has not been evaluated.
                            </p>
                          ) : null}
                          {shownFeedback ? (
                            <div className="notice">
                              {"error" in shownFeedback &&
                              shownFeedback.error ? (
                                <ErrorMessage
                                  message={
                                    ("error" in shownFeedback
                                      ? shownFeedback.error
                                      : "") ?? ""
                                  }
                                />
                              ) : (
                                <>
                                  <strong>
                                    {shownFeedback.category} •{" "}
                                    {demo
                                      ? "Sample preview"
                                      : "Live AI assessment"}
                                  </strong>
                                  <p>{shownFeedback.guidance}</p>
                                  <p>{shownFeedback.followup}</p>
                                  <p className="quiet">
                                    This feedback does not override your
                                    answer-guide score.
                                  </p>
                                </>
                              )}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </details>
                  </>
                ) : null}
              </>
            ) : null}
            {session.phase === "bonus-choice" ? (
              <div className="center">
                <Mascot />
                <h1 ref={heading} tabIndex={-1}>
                  One more question?
                </h1>
                <p>
                  You’ve completed the required challenges. Explore whether
                  statistical significance can repair a design problem.
                </p>
                <div className="card bonus">
                  <h2>Can Significance Fix the Design?</h2>
                  <p>Compare nonrandom selection with random assignment.</p>
                  <div className="actions">
                    {session.bonusAvailable ? (
                      <button
                        className="btn primary"
                        disabled={busy}
                        onClick={() => act("bonus")}
                      >
                        <ActionLabel icon="sparkle">Try the bonus</ActionLabel>
                      </button>
                    ) : null}
                    <button
                      className="btn outline"
                      disabled={busy}
                      onClick={() => act("skip")}
                    >
                      Skip to paper reveal
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            {["reveal", "complete"].includes(session.phase) && !reviewMode ? (
              <>
                <div className="reveal-head">
                  <Mascot />
                  <span className="tag">
                    {session.phase === "complete"
                      ? "Adventure complete"
                      : "Original investigation"}
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    {session.phase === "complete"
                      ? "Investigation complete!"
                      : "Research Paper Unlocked!"}
                  </h1>
                  <p>
                    You made the decisions. Now connect your reasoning with the
                    original research.
                  </p>
                </div>
                <div className="metrics">
                  <div className="card">
                    <span className="symbol amber">
                      <Icon name="star" />
                    </span>
                    <div>
                      <span>First-attempt accuracy</span>
                      <strong>
                        {session.summary.firstCorrect}/{session.summary.total}
                      </strong>
                    </div>
                  </div>
                  <div className="card">
                    <span className="symbol blue">
                      <Icon name="check" />
                    </span>
                    <div>
                      <span>Required challenges</span>
                      <strong>
                        {session.summary.completed}/{session.summary.total}
                      </strong>
                    </div>
                  </div>
                  <div className="card">
                    <span className="symbol green">
                      <Icon name="retry" />
                    </span>
                    <div>
                      <span>Challenges revised</span>
                      <strong>{session.summary.retries}</strong>
                    </div>
                  </div>
                </div>
                <article className="paper-card">
                  <span className="tag blue-text">
                    Original research • source revealed
                  </span>
                  <h2>{session.paper?.title}</h2>
                  <p>{session.paper?.authors}</p>
                  <p>{session.paper?.journal}</p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={session.paper?.url ?? undefined}
                  >
                    {session.paper?.url
                      ? "Read the paper’s source ↗"
                      : "Source link not available in document"}
                  </a>
                  {session.source !== "generated" ? (
                    <div className="finding">
                      <h3>Experiment 2: published finding</h3>
                      <p>
                        Texting M=73.41%, SD=16.95%; no texting M=83.00%,
                        SD=17.26%. The authors reported F(1,54)=4.33, p&lt;.05.
                      </p>
                      <p>The mean difference is 9.59 percentage points.</p>
                      <p>
                        A two-group equal-variance ANOVA and pooled independent
                        t-test yield F=t². A different variance approach may
                        produce a different result.
                      </p>
                    </div>
                  ) : null}
                  <h3>Keep the conclusion in scope</h3>
                  <ul>
                    {session.paper?.limitations.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p>
                    Completing this adventure records practice; it does not
                    establish statistical mastery.
                  </p>
                </article>
                {session.phase === "reveal" ? (
                  <div className="card">
                    <label htmlFor="reflection">
                      What will you check first in your next paper?{" "}
                      <span className="quiet">(optional)</span>
                    </label>
                    <textarea
                      id="reflection"
                      value={reflection}
                      maxLength={3000}
                      onChange={(e) => setReflection(e.target.value)}
                    />
                    <button
                      className="btn primary"
                      disabled={busy}
                      onClick={() => act("finish", { reflection })}
                    >
                      <ActionLabel icon="check">Finish adventure</ActionLabel>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="card">
                      <h2>Concepts to revisit</h2>
                      {session.summary.missed.length ? (
                        <ul>
                          {session.summary.missed.map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>
                          Your first responses matched the answer guide on every
                          required challenge.
                        </p>
                      )}
                      {session.reflection ? (
                        <blockquote>{session.reflection}</blockquote>
                      ) : null}
                      <div className="actions">
                        <button
                          className="btn primary"
                          onClick={() => setShowReview(true)}
                        >
                          Review Decisions
                        </button>
                        {session.summary.missed.length ? (
                          <button
                            className="btn secondary"
                            disabled={busy}
                            onClick={() => act("review-missed")}
                          >
                            Retry Missed Concepts
                          </button>
                        ) : null}
                        <button
                          className="btn outline"
                          onClick={() => setConfirm("restart")}
                        >
                          Restart Adventure
                        </button>
                        <Link className="btn outline" href="/">
                          Return Home
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : null}
            {reviewMode ? (
              <>
                <h1 ref={heading} tabIndex={-1}>
                  Your research decisions
                </h1>
                {session.review?.map((item) => (
                  <details className="card" key={item.id}>
                    <summary>
                      {item.title} •{" "}
                      {item.attempts[0]?.correct
                        ? "Correct first attempt"
                        : "Concept to revisit"}
                    </summary>
                    {item.attempts.map((a, i) => (
                      <div key={a.at}>
                        <h3>Attempt {i + 1}</h3>
                        <p>
                          {a.selected
                            .map(
                              (id) =>
                                item.options.find((o) => o.id === id)?.text,
                            )
                            .join(" ")}
                        </p>
                        {a.reasoning ? (
                          <blockquote>{a.reasoning}</blockquote>
                        ) : null}
                        {a.reasoningRevisions?.length ? (
                          <details>
                            <summary>Previous explanations</summary>
                            {a.reasoningRevisions.map((r, i) => (
                              <blockquote key={i}>
                                {r.text || "No written explanation submitted."}
                              </blockquote>
                            ))}
                          </details>
                        ) : null}
                        <p>
                          {a.correct
                            ? "Matched answer guide"
                            : "Did not match answer guide"}
                        </p>
                      </div>
                    ))}
                    <p>
                      <strong>Accepted responses:</strong>{" "}
                      {item.accepted.join(", ")}
                    </p>
                    <p>{item.explanation}</p>
                  </details>
                ))}
                <button
                  className="btn outline"
                  onClick={() => setShowReview(false)}
                >
                  Back to summary
                </button>
              </>
            ) : null}
          </>
        ) : null}
        {route === "adventure" && !session && !error ? (
          <p role="status">Loading your saved adventure…</p>
        ) : null}
        {route === "history" ? (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Previous Adventures
            </h1>
            <p>Your progress belongs to this browser’s guest profile.</p>
            {!history.length ? (
              <div className="card">
                <Mascot small />
                <h2>Your next investigation starts here.</h2>
                <p>
                  Adventures appear here after you begin. Every submitted
                  decision is saved.
                </p>
                <Link className="btn primary" href="/learn">
                  <ActionLabel>Choose a learning path</ActionLabel>
                </Link>
              </div>
            ) : (
              history.map((h) => (
                <article className="history-card card" key={h.id}>
                  <div>
                    <span className="tag">
                      {h.source === "demo" ? "Sample preview · " : ""}
                      {h.phase === "complete" ? "Completed" : "In progress"}
                    </span>
                    <h2>{h.title}</h2>
                    <p>Started {new Date(h.created).toLocaleDateString()}</p>
                  </div>
                  <Link className="btn outline" href={`/adventure/${h.id}`}>
                    <ActionLabel>
                      {h.phase === "complete"
                        ? "Review adventure"
                        : "Resume investigation"}
                    </ActionLabel>
                  </Link>
                </article>
              ))
            )}
            <h2>Your uploaded documents</h2>
            {documents.length ? (
              documents.map((d) => (
                <article className="history-card card" key={d.id}>
                  <div>
                    <h3>{d.name}</h3>
                    <p>
                      {d.pages} extracted pages • {d.status}
                    </p>
                  </div>
                  <div className="actions">
                    <Link
                      className="btn outline compact"
                      href={`/processing/${d.id}`}
                    >
                      View processing
                    </Link>
                    <button
                      className="btn danger compact"
                      onClick={() => setConfirm(d.id)}
                    >
                      Delete document
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p>No uploaded document records.</p>
            )}
          </>
        ) : null}
        {route === "glossary" ? (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Statistics Glossary
            </h1>
            <p>A few ideas to keep beside your investigation.</p>
            {Object.entries(glossary).map(([term, definition]) => (
              <details className="card glossary" key={term}>
                <summary className="icon-summary">
                  {term}
                  <Icon
                    name="chevron"
                    size={17}
                    className="disclosure-chevron"
                  />
                </summary>
                <p>{definition}</p>
              </details>
            ))}
            <Link className="btn primary" href="/learn">
              <ActionLabel>Continue learning</ActionLabel>
            </Link>
          </>
        ) : null}
        {route === "help" ? (
          <>
            <Speech>
              Research judgment grows through practice. You can change your
              mind—and explain why.
            </Speech>
            <h1 ref={heading} tabIndex={-1}>
              How Gradly works
            </h1>
            <ol className="how-list">
              <li>
                <h2>Choose an investigation</h2>
                <p>
                  Start the reference lesson, or upload a searchable empirical
                  research PDF.
                </p>
              </li>
              <li>
                <h2>Inspect the evidence</h2>
                <p>
                  Uploads are checked locally by the application server before
                  you confirm external AI processing. Agents extract evidence,
                  draft a lesson, and review it. Unsupported lessons stay
                  blocked.
                </p>
              </li>
              <li>
                <h2>Make and defend decisions</h2>
                <p>
                  Choose methods and interpretations. Use hints and study
                  details. Try a revision after your first miss.
                </p>
              </li>
              <li>
                <h2>Connect decisions to findings</h2>
                <p>
                  See the original paper at the end, review your responses, and
                  practice concepts you missed.
                </p>
              </li>
            </ol>
            <details className="card">
              <summary>How Agents Collaborate</summary>
              <p>
                Gradly uses a sequential evidence-analysis, lesson-design,
                statistical-review, learning-coach, and verification pipeline.
                This is an architecture explanation, not a Mixture of Agents
                demonstration or a live execution trace.
              </p>
              <div className="flow">
                Evidence → Lesson → Statistical review → Coach review →
                Verification
              </div>
              <p>
                Agent cards report observable tasks and output summaries. Hidden
                chain-of-thought is neither stored nor displayed.
              </p>
            </details>
            <Link className="btn primary" href="/learn">
              <ActionLabel>Choose a learning path</ActionLabel>
            </Link>
          </>
        ) : null}
        {route === "settings" ? (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Your learning settings
            </h1>
            <div className="card">
              <h2>Guest profile</h2>
              <p>
                No account is required. A signed browser cookie identifies your
                saved adventures. Clearing cookies can remove your access to
                saved progress.
              </p>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={reduced}
                  onChange={(e) => {
                    setReduced(e.target.checked);
                    localStorage.setItem(
                      "gradly-reduced-motion",
                      String(e.target.checked),
                    );
                  }}
                />{" "}
                Reduce interface motion
              </label>
              <p>System reduced-motion preferences are also respected.</p>
            </div>
            <div className="card">
              <h2>AI availability</h2>
              <p>
                {config?.liveAI
                  ? "Live Nebius inference is configured. Generated lessons must pass review."
                  : "Live Nebius inference is not configured. The reference lesson and deterministic answer checking are available."}
              </p>
              <p>{config?.model}</p>
              <Link href="/privacy">
                <ActionLabel icon="shield">
                  Read processing and retention information
                </ActionLabel>
              </Link>
            </div>
          </>
        ) : null}
        {route === "privacy" ? (
          <>
            <h1 ref={heading} tabIndex={-1}>
              Privacy & AI processing
            </h1>
            <div className="card">
              <h2>What is stored</h2>
              <p>
                Uploaded PDFs are parsed on the application server. Extracted
                page text, processing summaries, generated lessons, answers,
                written reasoning, and progress are retained for up to 30 days.
                Original PDF bytes are not retained by the server.
              </p>
              <h2>When an external model is used</h2>
              <p>
                Only after you confirm processing, extracted text is sent to
                Nebius Token Factory. Requesting AI feedback sends the current
                challenge’s permitted evidence and your submitted reasoning.
                Avoid sensitive or identifiable participant information.
              </p>
              <h2>Your controls</h2>
              <p>
                Delete an uploaded document from Adventures to remove its
                extracted text, processing record, generated lesson, and linked
                learner sessions. Records expire after 30 days. Expired records
                are purged when history is queried; a scheduled purge should be
                enabled for unattended deployments.
              </p>
              <h2>Limits of AI review</h2>
              <p>
                AI review and exact-source checks reduce errors; they cannot
                certify correctness. The featured investigation uses reference
                answer guidance. Failed AI feedback never changes that answer
                key.
              </p>
              <a
                href="https://nebius.com/privacy-policy"
                target="_blank"
                rel="noreferrer"
              >
                Nebius privacy information ↗
              </a>
            </div>
            <Link className="btn outline" href="/history">
              Manage uploaded documents
            </Link>
          </>
        ) : null}
        {![
          "home",
          "learn",
          "featured",
          "upload",
          "processing",
          "adventure",
          "history",
          "glossary",
          "help",
          "settings",
          "privacy",
        ].includes(route) ? (
          <div className="center">
            <h1>Let’s get you back on track.</h1>
            <Link className="btn primary" href="/">
              Return Home
            </Link>
          </div>
        ) : null}
      </main>
      {bottom && c ? (
        <footer
          className={`action-dock ${c.feedback ? (c.feedback.correct ? "correct" : "incorrect") : ""}`}
        >
          <div className="dock-inner">
            <div aria-live="polite">
              <strong>
                {busy
                  ? "Saving…"
                  : c.feedback
                    ? c.feedback.correct
                      ? "Well reasoned!"
                      : c.feedback.retryAvailable
                        ? "Ready to reconsider?"
                        : "Explanation revealed"
                    : session?.retrying
                      ? "Second attempt"
                      : "Your decision matters."}
              </strong>
              <p>
                {c.feedback
                  ? "Your response is saved."
                  : "Choose a response, then check your reasoning."}
              </p>
            </div>
            <button
              className="btn primary"
              aria-busy={busy}
              disabled={
                busy || editingReasoning || (!c.feedback && !selected.length)
              }
              onClick={() =>
                c.feedback
                  ? act(c.feedback.retryAvailable ? "retry" : "next")
                  : act("submit", { selected, reasoning })
              }
            >
              <ActionLabel
                busy={busy}
                icon={
                  c.feedback
                    ? c.feedback.retryAvailable
                      ? "retry"
                      : "arrow"
                    : "check"
                }
              >
                {busy
                  ? "Saving…"
                  : c.feedback
                    ? c.feedback.retryAvailable
                      ? "Try again"
                      : "Continue"
                    : "Check Answer"}
              </ActionLabel>
            </button>
          </div>
        </footer>
      ) : (
        <footer className="site-footer">
          <Link className="brand" href="/">
            Gradly
          </Link>
          <span>Learn to question. Grow with evidence.</span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/help">Help</Link>
        </footer>
      )}
      {confirm ? (
        <div className="modal-backdrop">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="modal"
          >
            <h2 id="confirm-title">
              {confirm === "restart"
                ? "Start a new attempt?"
                : "Delete this document?"}
            </h2>
            <p>
              {confirm === "restart"
                ? "Your current adventure stays in history. A fresh attempt starts at the briefing."
                : "This removes extracted text, processing results, the generated lesson, and all linked adventures. This cannot be undone."}
            </p>
            <div className="actions">
              <button
                autoFocus
                className="btn outline"
                onClick={() => setConfirm(null)}
              >
                Cancel
              </button>
              <button
                disabled={busy}
                className={`btn ${confirm === "restart" ? "primary" : "danger"}`}
                onClick={() => {
                  if (confirm === "restart") {
                    setConfirm(null);
                    void act("restart", { confirmed: true });
                  } else void removeDocument(confirm);
                }}
              >
                {confirm === "restart" ? "Restart" : "Delete document"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
