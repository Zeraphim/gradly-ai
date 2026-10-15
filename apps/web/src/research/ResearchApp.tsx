import "./styles.css";
import {
  ResearchLink as Link,
  useResearchPath,
  useResearchRouter,
} from "./navigation.js";
import { BrandLogo } from "../components/BrandLogo.js";
import { Dialog } from "../components/Dialog.js";
import { SupportPages } from "./SupportPages.js";
import { HistoryPage } from "./HistoryPage.js";
import { ActionLabel, Icon } from "./icon.js";
import { api } from "./request.js";
import {
  clearDraft,
  readDraft,
  readLastAdventure,
  readReducedMotion,
  writeReducedMotion,
  writeDraft,
} from "./client-state.js";
import { Mascot, Speech, Progress, ErrorMessage } from "./learning-ui.js";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ResearchSession as Session,
  ProcessingJob as Job,
  ResearchConfig as Config,
  AdventureRecord as History,
  DocumentRecord as Doc,
  UploadDraft,
} from "./types.js";
import { PathPicker } from "./PathPicker.js";
import { UploadPage } from "./UploadPage.js";
import { ProcessingPage } from "./ProcessingPage.js";
import { useResearchConfig } from "./useResearchConfig.js";
import { ReasoningPreview } from "./ReasoningPreview.js";
export function ResearchApp({
  onExit,
  initialFile,
}: {
  onExit: () => void;
  initialFile?: File | null;
}) {
  const path = useResearchPath();
  const previousPath = useRef(path);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const [uploadDraft, setUploadDraft] = useState<UploadDraft>(() => ({
    file: initialFile ?? null,
    uploaded: null,
  }));
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (previousPath.current !== path) {
      previousPath.current = path;
      const title = document.querySelector<HTMLElement>(
        ".research-lab main h1",
      );
      title?.setAttribute("tabindex", "-1");
      title?.focus();
    }
    if (/^\/(?:upload|adventure\/[^/]+|processing\/[^/]+)\/?$/.test(path))
      setReturnPath(path);
  }, [path]);
  return (
    <div className="research-lab">
      {/^\/reasoning\/?$/.test(path) ? (
        <ReasoningPreview onExit={onExit} returnHref={returnPath ?? "/learn"} />
      ) : (
        <ResearchWorkspaceHost
          path={path}
          onExit={onExit}
          uploadDraft={uploadDraft}
          setUploadDraft={setUploadDraft}
          returnPath={returnPath}
        />
      )}
    </div>
  );
}
function ResearchWorkspaceHost(props: {
  path: string;
  onExit: () => void;
  uploadDraft: UploadDraft;
  setUploadDraft: React.Dispatch<React.SetStateAction<UploadDraft>>;
  returnPath: string | null;
}) {
  const configuration = useResearchConfig();
  return (
    <GradlyWorkspace
      key={props.path}
      {...props}
      config={configuration.config}
      configError={configuration.error}
      onRetryConfig={configuration.retry}
    />
  );
}
function GradlyWorkspace({
  path,
  onExit,
  uploadDraft,
  setUploadDraft,
  returnPath,
  config,
  configError,
  onRetryConfig,
}: {
  path: string;
  onExit: () => void;
  uploadDraft: UploadDraft;
  setUploadDraft: React.Dispatch<React.SetStateAction<UploadDraft>>;
  returnPath: string | null;
  config: Config | null;
  configError: string;
  onRetryConfig: () => void;
}) {
  const router = useResearchRouter();
  const parts = path.split("/").filter(Boolean);
  const route = parts[0] || "home";
  const id = parts[1];
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
  const [historyStatus, setHistoryStatus] = useState<
    "loading" | "error" | "ready"
  >("loading");
  const [loadVersion, setLoadVersion] = useState(0);
  const [sourcePages, setSourcePages] = useState<
    import("../../../api/src/research/contracts.js").PageText[] | null
  >(null);
  const [showReview, setShowReview] = useState(false);
  const [reflection, setReflection] = useState("");
  const [confirm, setConfirm] = useState<"restart" | string | null>(null);
  const [dialogError, setDialogError] = useState("");
  const [reduced, setReduced] = useState(readReducedMotion);
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackRegion = useRef<HTMLElement>(null);
  const mounted = useRef(false);
  const previousFocus = useRef<{ stage: string; attempts: number } | null>(
    null,
  );
  const actionLock = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);
  const applySession = useCallback((s: Session) => {
    const draft = readDraft(s.id, s.version, s.challenge?.id ?? s.phase);
    setSession(s);
    setSelected(
      !s.challenge?.feedback && draft
        ? draft.selected.filter((id) =>
            s.challenge?.options.some((o) => o.id === id),
          )
        : s.retrying
          ? []
          : (s.challenge?.previousSelection ?? []),
    );
    setReasoning(draft?.reasoning ?? s.challenge?.reasoning ?? "");
    setFeedback(null);
    setEditingReasoning(
      !!s.challenge?.feedback && (draft?.editingReasoning ?? false),
    );
    setReflection(draft?.reflection ?? s.reflection);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const get = <T,>(url: string) =>
      api<T>(url, undefined, "GET", controller.signal);
    const failed = (e: Error) => {
      if (!controller.signal.aborted) setError(e.message);
    };
    if (route === "adventure" && id) {
      get<Session>(`/api/research/learning?id=${encodeURIComponent(id)}`)
        .then((s) => {
          if (!controller.signal.aborted) applySession(s);
        })
        .catch(failed);
    }
    if (route === "processing" && id) {
      get<Job>(`/api/research/jobs?id=${encodeURIComponent(id)}`)
        .then((j) => {
          if (!controller.signal.aborted) setJob(j);
        })
        .catch(failed);
    }
    if (route === "history") {
      setHistoryStatus("loading");
      Promise.all([
        get<History[]>("/api/research/learning"),
        get<Doc[]>("/api/research/documents"),
      ])
        .then(([h, d]) => {
          if (controller.signal.aborted) return;
          setHistory(h);
          setDocuments(d);
          setHistoryStatus("ready");
        })
        .catch((e) => {
          if (!controller.signal.aborted) {
            setHistoryStatus("error");
            failed(e);
          }
        });
    }
    return () => controller.abort();
  }, [route, id, applySession, loadVersion]);
  useEffect(() => {
    if (!session) return;
    try {
      localStorage.setItem("gradly-last-adventure", session.id);
    } catch {}
    const stage = `${session.id}:${session.phase}:${session.challenge?.id ?? ""}`;
    if (previousFocus.current?.stage !== stage) heading.current?.focus();
    else if (
      (previousFocus.current?.attempts ?? 0) <
      (session.challenge?.attempts ?? 0)
    )
      feedbackRegion.current?.focus();
    previousFocus.current = {
      stage,
      attempts: session.challenge?.attempts ?? 0,
    };
  }, [session]);
  useEffect(() => {
    if (!session) return;
    writeDraft(session.id, {
      version: session.version,
      challengeId: session.challenge?.id ?? session.phase,
      selected,
      reasoning,
      reflection,
      editingReasoning,
    });
  }, [session, selected, reasoning, reflection, editingReasoning]);
  useEffect(() => {
    const previousTitle = document.title;
    const titles: Record<string, string> = {
      learn: "Choose your learning path",
      home: "Choose your learning path",
      featured: "Featured investigation",
      upload: "Upload your paper",
      history: "Your adventures",
      glossary: "Research glossary",
      help: "How Gradly works",
      settings: "Learning settings",
      privacy: "Privacy & AI processing",
      processing: "Prepare your investigation",
      adventure: "Your investigation",
    };
    document.title = `${titles[route] ?? "Find your investigation"} · Gradly`;
    return () => {
      document.title = previousTitle;
    };
  }, [route, !!config]);
  useEffect(() => {
    if (session) heading.current?.focus();
  }, [showReview]);
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
      if (!mounted.current) return;
      if (session) clearDraft(session.id);
      applySession(s);
      if (
        action === "start" ||
        action === "restart" ||
        action === "review-missed"
      )
        router.push(`/adventure/${s.id}`);
    } catch (e) {
      if (mounted.current) setError((e as Error).message);
    } finally {
      actionLock.current = false;
      if (mounted.current) setBusy(false);
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
        if (mounted.current) setJob(j);
      } catch (e) {
        if (!mounted.current) return;
        setError((e as Error).message);
        api<Job>(`/api/research/jobs?id=${id}`)
          .then((j) => {
            if (mounted.current) setJob(j);
          })
          .catch(() => {});
      } finally {
        actionLock.current = false;
        if (mounted.current) setBusy(false);
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
            if (!mounted.current) return;
            setJob(j);
            if (j.leaseUntil < Date.now()) void step();
          })
          .catch((e) => {
            if (mounted.current) setError(e.message);
          });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [route, job, error, config, step, id]);
  const removeDocument = async (docId: string) => {
    setBusy(true);
    setError("");
    setDialogError("");
    let deleted = false;
    try {
      await api("/api/research/documents", { id: docId }, "DELETE");
      setUploadDraft((draft) =>
        draft.uploaded?.id === docId ? { file: null, uploaded: null } : draft,
      );
      if (!mounted.current) return;
      deleted = true;
      setDocuments((d) => d.filter((item) => item.id !== docId));
      setConfirm(null);
      const h = await api<History[]>("/api/research/learning");
      if (!mounted.current) return;
      history
        .filter((old) => !h.some((next) => next.id === old.id))
        .forEach((old) => clearDraft(old.id));
      setHistory(h);
    } catch (e) {
      if (mounted.current) {
        setError((e as Error).message);
        if (deleted) setHistoryStatus("error");
        else setDialogError((e as Error).message);
      }
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  const c = session?.challenge;
  const demo = job?.mode === "demo" || session?.source === "demo";
  const shownFeedback = feedback ?? c?.aiFeedback;
  const bottom =
    (route === "adventure" && session?.phase === "challenge") ||
    (route === "adventure" && session?.phase === "bonus");
  const reviewMode = showReview && !!session?.review;
  const lastAdventure = readLastAdventure();
  const resumeHref =
    returnPath ?? (lastAdventure ? `/adventure/${lastAdventure}` : "/learn");
  const resumeLabel =
    resumeHref === "/upload"
      ? "Return to your paper"
      : resumeHref.startsWith("/processing/")
        ? "Return to processing"
        : resumeHref.startsWith("/adventure/")
          ? "Return to investigation"
          : "Continue learning";
  const reloadSavedState = () => {
    setError("");
    onRetryConfig();
    setLoadVersion((v) => v + 1);
  };
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
          <a
            className="brand"
            href="#"
            aria-label="Gradly home"
            onClick={(event) => {
              event.preventDefault();
              onExit();
            }}
          >
            <BrandLogo />
          </a>
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
          {session ? (
            <span
              className="research-points"
              aria-label={`${session.points ?? 0} practice points`}
            >
              <Icon name="star" size={17} />
              <strong>{session.points ?? 0}</strong> points
            </span>
          ) : null}
        </div>
      </header>
      <main
        id="main"
        className={`main ${bottom ? "learning" : ""} ${route === "upload" ? `upload-page ${uploadDraft.uploaded ? "reviewing" : ""}` : route === "processing" ? "processing-page" : ""} ${["home", "learn", "featured"].includes(route) ? "path-page" : ""}`}
      >
        <ErrorMessage message={error || configError} />
        {configError || (error && route !== "history") ? (
          <div className="recovery-actions actions">
            <button
              className="btn outline compact"
              disabled={busy}
              onClick={reloadSavedState}
            >
              Reload saved state
            </button>
            {route === "adventure" || route === "processing" ? (
              <Link className="btn outline compact" href="/history">
                Your adventures
              </Link>
            ) : null}
          </div>
        ) : null}
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
            <h1>This learning path is unavailable</h1>
            <p>
              The research workspace is not available right now. Continue with
              Gradly’s guided adventure while it is being prepared.
            </p>
            <button className="btn primary" onClick={onExit}>
              Return to curated adventure
            </button>
          </div>
        ) : null}
        {!config?.storage && ["home", "learn", "featured"].includes(route) ? (
          <aside
            className="reasoning-preview-invitation"
            aria-label="Research reasoning preview"
          >
            <div>
              <strong>
                Explore the reasoning loop while the workspace is unavailable.
              </strong>
              <p>
                Choose, explain, inspect evidence and revise. Authored example ·
                no AI calls.
              </p>
            </div>
            <Link className="btn primary compact" href="/reasoning">
              Try the reasoning preview
            </Link>
          </aside>
        ) : null}
        {config?.storage && ["home", "learn", "featured"].includes(route) ? (
          <PathPicker
            config={config}
            busy={busy}
            heading={heading}
            onStart={() => void act("start")}
          />
        ) : null}
        {route === "upload" ? (
          <UploadPage
            config={config}
            draft={uploadDraft}
            onDraftChange={setUploadDraft}
            busy={busy}
            heading={heading}
            onStart={() => void act("start")}
          />
        ) : null}
        {route === "processing" && id ? (
          <ProcessingPage
            job={job}
            config={config}
            busy={busy}
            error={error}
            heading={heading}
            sourcePages={sourcePages}
            onStart={(lessonId) =>
              void act("start", lessonId ? { lessonId } : {})
            }
            onStep={(retry, consent) => void step(retry, consent)}
            onLoadPages={async () => {
              if (!job) return;
              try {
                const result = await api<{
                  pages: import("../../../api/src/research/contracts.js").PageText[];
                }>(`/api/research/documents?id=${job.id}`);
                if (mounted.current) setSourcePages(result.pages);
              } catch (e) {
                if (mounted.current) setError((e as Error).message);
              }
            }}
          />
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
                    ? session.source === "generated"
                      ? "Inspect the findings. What do they support—and what do they leave uncertain?"
                      : "Look at the group scores. What do they tell us—and what do they leave uncertain?"
                    : c.reveal === "significance"
                      ? "Go beyond the number. Match your interpretation to the design and evidence."
                      : c.reveal === "interpretation"
                        ? "Connect the interpretation to the evidence. Which claims fit, and where should you stop?"
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
                  {c.options.map((o) => (
                    <label
                      key={o.id}
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
                {!c.feedback ? (
                  <p className="quiet draft-note">
                    Your draft stays in this tab. Submitted decisions are saved
                    to your guest profile.
                  </p>
                ) : null}
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
                      ref={feedbackRegion}
                      tabIndex={-1}
                      className={`feedback ${c.feedback.correct ? "correct" : "incorrect"}`}
                      aria-live="polite"
                    >
                      <h2>
                        {c.feedback.correct
                          ? "Your choice matches"
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
                      <summary>See the answer guide and evidence</summary>
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
                            (session.source === "generated"
                              ? "Use this challenge’s page references. Do not fill gaps in the source with assumptions."
                              : "Independent participants, one condition per person, and a numerical quiz outcome."),
                        ],
                        [
                          session.source === "generated"
                            ? "Research Methods Reviewer"
                            : "Statistical Reviewer",
                          session.source === "generated"
                            ? "Methods and Interpretation"
                            : "Statistical Assessment",
                          c.feedback.explanation ||
                            (session.source === "generated"
                              ? "Check how the research approach and available evidence support the decision, and where competing explanations remain."
                              : "Check whether your selected method matches the outcome and the relationship between observations."),
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
                          session.source !== "generated" && c.id === "q3"
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
                    </details>
                    {c.writtenReasoning && reasoning ? (
                      <section
                        className="reasoning-review"
                        aria-label="Reasoning review"
                      >
                        <h2>Check the explanation, too.</h2>
                        <p>
                          {editingReasoning
                            ? "Save your revised explanation before requesting another review."
                            : !demo &&
                                shownFeedback &&
                                !(
                                  "error" in shownFeedback &&
                                  shownFeedback.error
                                )
                              ? "The live review below considers your written explanation separately from your choice."
                              : "Your written explanation has not been assessed. The answer-guide result checks your choice only."}
                        </p>
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
                              if (!mounted.current) return;
                              clearDraft(session.id);
                              applySession(response.session);
                            } catch (e) {
                              if (!mounted.current) return;
                              setFeedback({
                                error: `${(e as Error).message} Your reasoning is saved. Use the reference explanation; no live assessment was completed.`,
                              });
                            } finally {
                              if (mounted.current) setBusy(false);
                            }
                          }}
                        >
                          {demo
                            ? "Explore sample guidance"
                            : "Ask AI to review my reasoning"}
                        </button>
                        {!config?.liveAI && !demo ? (
                          <p>
                            Live AI is not configured. Your written reasoning is
                            saved but has not been evaluated.
                          </p>
                        ) : null}
                        {shownFeedback && !editingReasoning ? (
                          <div className="notice" role="status">
                            {"error" in shownFeedback && shownFeedback.error ? (
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
                        <p className="quiet reasoning-preview-note">
                          See how a correct choice can hide a misconception in
                          an authored example, separate from your writing.
                        </p>
                        <Link className="text-link" href="/reasoning">
                          See a reasoning-and-revision example
                        </Link>
                      </section>
                    ) : null}
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
                  {session.source === "generated"
                    ? session.bonusAvailable
                      ? "You’ve completed the required challenges. Consider one more question about the evidence before revealing the source."
                      : "You’ve completed the required challenges. Connect your decisions to the paper and the limits of its evidence."
                    : "You’ve completed the required challenges. Explore whether statistical significance can repair a design problem."}
                </p>
                <div className="card bonus">
                  <h2>
                    {session.source === "generated"
                      ? session.bonusAvailable
                        ? "One more angle on the evidence"
                        : "Ready to meet the source?"
                      : "Can Significance Fix the Design?"}
                  </h2>
                  <p>
                    {session.source === "generated"
                      ? "Keep each conclusion within what the paper can support."
                      : "Compare nonrandom selection with random assignment."}
                  </p>
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
                  <p className="research-points-total">
                    {session.points ?? 0} practice points earned · 10 per solved
                    challenge
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
                    {session.source === "generated"
                      ? " establish research mastery."
                      : " establish statistical mastery."}
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
        {route === "adventure" && id && !session && !error ? (
          <p role="status">Loading your saved adventure…</p>
        ) : null}
        {route === "history" ? (
          <HistoryPage
            heading={heading}
            history={history}
            documents={documents}
            status={historyStatus}
            busy={busy}
            onRetry={reloadSavedState}
            onDelete={(id) => {
              if (busy) return;
              setDialogError("");
              setConfirm(id);
            }}
          />
        ) : null}
        <SupportPages
          route={route}
          heading={heading}
          config={config}
          configError={configError}
          reduced={reduced}
          onReducedChange={(next) => {
            setReduced(next);
            writeReducedMotion(next);
          }}
          resumeHref={resumeHref}
          resumeLabel={resumeLabel}
          hasReturnPath={!!returnPath}
        />
        {["adventure", "processing"].includes(route) && !id ? (
          <div className="card center">
            <Mascot small />
            <h1 ref={heading} tabIndex={-1}>
              Find your investigation
            </h1>
            <p>
              This link is missing an investigation. Resume one from your
              adventures or choose a new learning path.
            </p>
            <div className="actions">
              <Link className="btn primary" href="/history">
                Your adventures
              </Link>
              <Link className="btn outline" href="/learn">
                Choose a learning path
              </Link>
            </div>
          </div>
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
                      ? "Choice matches"
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
                  : "Choose a response, then check your choice."}
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
        <Dialog
          title={
            confirm === "restart"
              ? "Start a new attempt?"
              : "Delete this document?"
          }
          onClose={() => setConfirm(null)}
        >
          <ErrorMessage message={dialogError} />
          <p>
            {confirm === "restart"
              ? "Your current adventure stays in history. A fresh attempt starts at the briefing."
              : "This removes extracted text, processing results, the generated lesson, and all linked adventures. This cannot be undone."}
          </p>
          <div className="actions">
            <button
              autoFocus
              data-initial-focus
              className="btn outline"
              onClick={() => setConfirm(null)}
            >
              {busy ? "Close" : "Cancel"}
            </button>
            <button
              disabled={busy}
              aria-busy={busy}
              className={`btn ${confirm === "restart" ? "primary" : "danger"}`}
              onClick={() => {
                if (confirm === "restart") {
                  setConfirm(null);
                  void act("restart", { confirmed: true });
                } else void removeDocument(confirm);
              }}
            >
              <ActionLabel busy={busy}>
                {busy
                  ? "Deleting…"
                  : confirm === "restart"
                    ? "Restart"
                    : "Delete document"}
              </ActionLabel>
            </button>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
