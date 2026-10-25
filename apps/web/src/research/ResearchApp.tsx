import "./styles.css";
import { sceneSchema } from "@paperquest/contracts";
import {
  InvestigationScene,
  emptySceneDraft,
  type SceneDraft,
} from "./scenes/InvestigationScene.js";
import {
  SceneMotion,
  SceneTransition,
  SceneFeedback,
  SceneAction,
  SceneFollowing,
} from "./scenes/scene-motion.js";
import { SceneDisclosure } from "./scenes/SceneDisclosure.js";
import { SceneJourney, SceneReview } from "./scenes/SceneJourney.js";
import {
  ResearchLink as Link,
  useResearchPath,
  useResearchRouter,
} from "./navigation.js";
import { SiteFooter, SiteHeader } from "../components/SiteChrome.js";
import { FocusBar, libraryJourneySteps, type JourneyStep } from "./FocusBar.js";
import { TextingQuest } from "./TextingQuest.js";
import "./journey.css";
import "./play.css";
import { AppLoading } from "../components/AppLoading.js";
import { ChunkBoundary } from "../components/ChunkBoundary.js";
import { Dialog } from "../components/Dialog.js";
import { SupportPages } from "./SupportPages.js";
import { HistoryPage } from "./HistoryPage.js";
import { ActionLabel, Icon } from "./icon.js";
import { api, ResearchRequestError } from "./request.js";
import {
  clearActivePreparation,
  clearDraft,
  readDraft,
  readLastAdventure,
  readReducedMotion,
  subscribeReducedMotion,
  writeReducedMotion,
  writeDraft,
} from "./client-state.js";
import { Mascot, Speech, Progress, ErrorMessage } from "./learning-ui.js";
import { paperContext } from "./paper-context.js";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
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
import {
  useResearchConfig,
  type ResearchConfiguration,
} from "./useResearchConfig.js";
const ReasoningPreview = lazy(() =>
  import("./ReasoningPreview.js").then((module) => ({
    default: module.ReasoningPreview,
  })),
);
const PaperActivityPilot = lazy(() =>
  import("./PaperActivityPilot.js").then((module) => ({
    default: module.PaperActivityPilot,
  })),
);
const StudyPreview = lazy(() =>
  import("./studies/StudyPreview.js").then((module) => ({
    default: module.StudyPreview,
  })),
);
const UploadedJourney = lazy(() =>
  import("./studies/UploadedJourney.js").then((module) => ({
    default: module.UploadedJourney,
  })),
);
export function ResearchApp({
  onExit,
  initialFile,
  configuration,
}: {
  onExit: () => void;
  initialFile?: File | null;
  configuration?: ResearchConfiguration;
}) {
  const path = useResearchPath();
  const previousPath = useRef(path);
  const [returnPath, setReturnPath] = useState<string | null>(null);
  const [uploadDraft, setUploadDraft] = useState<UploadDraft>(() => ({
    file: initialFile ?? null,
    uploaded: null,
    autoCheck: !!initialFile,
    autoContinue: !!initialFile,
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
    <div className="research-lab app-shell">
      {/^\/reasoning\/?$/.test(path) ? (
        <ChunkBoundary label="The reasoning preview">
          <Suspense
            fallback={<AppLoading label="Opening reasoning preview…" />}
          >
            <ReasoningPreview
              onExit={onExit}
              returnHref={returnPath ?? "/learn"}
            />
          </Suspense>
        </ChunkBoundary>
      ) : /^\/activities\/?$/.test(path) ? (
        <ChunkBoundary label="Paper activities">
          <Suspense fallback={<AppLoading label="Opening paper activities…" />}>
            <PaperActivityPilot onExit={onExit} />
          </Suspense>
        </ChunkBoundary>
      ) : /^\/studies(?:\/[a-z0-9-]+)?\/?$/.test(path) ? (
        <ChunkBoundary label="Prepared studies">
          <Suspense fallback={<AppLoading label="Opening prepared studies…" />}>
            <StudyPreview path={path} onExit={onExit} />
          </Suspense>
        </ChunkBoundary>
      ) : /^\/play\/[^/]+\/?$/.test(path) ? (
        <ChunkBoundary label="Your study">
          <Suspense fallback={<AppLoading label="Opening your study…" />}>
            <UploadedJourney
              key={path}
              sessionId={decodeURIComponent(path.split("/")[2]!)}
            />
          </Suspense>
        </ChunkBoundary>
      ) : (
        <ResearchWorkspaceHost
          configuration={configuration}
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
function ResearchWorkspaceHost({
  configuration: provided,
  ...props
}: {
  configuration?: ResearchConfiguration;
  path: string;
  onExit: () => void;
  uploadDraft: UploadDraft;
  setUploadDraft: React.Dispatch<React.SetStateAction<UploadDraft>>;
  returnPath: string | null;
}) {
  const fallback = useResearchConfig(!provided);
  const configuration = provided ?? fallback;
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
  // Set when `error` came from advancing a consented job's stage, so
  // preparation can tell a paused stage from a failed page action.
  const [stageError, setStageError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [sceneDraft, setSceneDraft] = useState<SceneDraft>(emptySceneDraft);
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
  // Follow a preference saved elsewhere (another tab or the settings page).
  useEffect(
    () => subscribeReducedMotion(() => setReduced(readReducedMotion())),
    [],
  );
  const applySession = useCallback((s: Session, exploration?: SceneDraft) => {
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
    setSceneDraft(draft?.scene ?? exploration ?? emptySceneDraft);
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
        .catch((e: Error) => {
          // A deleted or missing job must not stay offered on the home page.
          if (
            e instanceof ResearchRequestError &&
            e.status >= 400 &&
            e.status < 500
          )
            clearActivePreparation(id);
          failed(e);
        });
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
      scene: sceneDraft,
    });
  }, [session, selected, reasoning, reflection, editingReasoning, sceneDraft]);
  useEffect(() => {
    const previousTitle = document.title;
    const titles: Record<string, string> = {
      learn: "Choose your learning path",
      home: "Choose your learning path",
      featured: "Featured quest",
      upload: "Upload your paper",
      history: "Your quests",
      glossary: "Research glossary",
      help: "How Gradly works",
      settings: "Learning settings",
      privacy: "Privacy & AI processing",
      processing: "Read the paper",
      adventure: "Your quest",
      meet: "Texting study quest",
    };
    document.title = `${titles[route] ?? "Find your quest"} · Gradly`;
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
      applySession(
        s,
        s.challenge?.id === session?.challenge?.id ? sceneDraft : undefined,
      );
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
  const startFirstChallenge = async (lessonId?: string) => {
    if (actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    setError("");
    setStageError(false);
    try {
      const started = await api<Session>("/api/research/learning", {
        action: "start",
        ...(lessonId ? { lessonId } : {}),
      });
      // Uploaded papers play in the shared study player; the featured quest
      // keeps its investigation screen.
      if (mounted.current)
        router.push(
          started.source === "generated"
            ? `/play/${started.id}`
            : `/adventure/${started.id}`,
        );
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
      setStageError(false);
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
        setStageError(!consent);
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
      (stageError && error) ||
      (!config?.liveAI && job.mode !== "demo")
    )
      return;
    if (job.status === "pending") {
      const timer = setTimeout(
        () => void step(),
        // The authored sample holds each stage long enough to read; the
        // stage still only advances when the saved job does.
        job.mode === "demo" ? 1200 : 10,
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
            if (!mounted.current) return;
            setError(e.message);
            setStageError(true);
          });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [route, job, error, stageError, config, step, id]);
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
  const scene = useMemo(() => {
    const parsed = sceneSchema.safeParse(c?.scene);
    return parsed.success ? parsed.data : null;
  }, [c?.scene]);
  const demo = job?.mode === "demo" || session?.source === "demo";
  const shownFeedback = feedback ?? c?.aiFeedback;
  const bottom =
    (route === "adventure" && session?.phase === "challenge") ||
    (route === "adventure" && session?.phase === "bonus");
  const reviewMode = showReview && !!session?.review;
  // The paper journey (review → prepare → meet → play) runs in focus mode:
  // a slim bar with the stepper replaces the site header and footer.
  const focusStep: JourneyStep | null =
    route === "upload" && uploadDraft.file
      ? 0
      : route === "processing"
        ? job && !job.consented
          ? 0
          : 1
        : route === "meet" || route === "adventure"
          ? 2
          : null;
  // A prepared study chosen from the library skips upload and preparation.
  const libraryJourney =
    (route === "meet" && id === "featured") ||
    (route === "adventure" && session?.source === "featured");
  const focus = focusStep !== null;
  const lastAdventure = readLastAdventure();
  const resumeHref =
    returnPath ?? (lastAdventure ? `/adventure/${lastAdventure}` : "/learn");
  const resumeLabel =
    resumeHref === "/upload"
      ? "Return to your paper"
      : resumeHref.startsWith("/processing/")
        ? "Return to processing"
        : resumeHref.startsWith("/adventure/")
          ? "Return to quest"
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
      {focus ? (
        <FocusBar
          step={libraryJourney ? 1 : focusStep}
          steps={libraryJourney ? libraryJourneySteps : undefined}
          sample={demo || route === "meet"}
          onExit={
            route === "adventure" ? () => router.push("/history") : onExit
          }
          onHome={onExit}
          exitLabel={
            route === "adventure" ? "Save and exit quest" : "Exit to home"
          }
        >
          {session ? (
            <span
              className="focus-points"
              aria-label={`${session.points ?? 0} practice points`}
            >
              <Icon name="star" size={15} />
              <strong>{session.points ?? 0}</strong>
            </span>
          ) : null}
        </FocusBar>
      ) : (
        <SiteHeader
          current={
            ["home", "learn", "featured"].includes(route)
              ? "studies"
              : route === "history"
                ? "quests"
                : route === "glossary"
                  ? "glossary"
                  : route === "upload" || route === "processing"
                    ? "upload"
                    : null
          }
          points={session ? (session.points ?? 0) : null}
          onHome={onExit}
        />
      )}
      <main
        id="main"
        className={`main ${focus && route !== "adventure" ? "journey-main" : ""} ${route === "adventure" ? "scene-motion-page" : ""} ${bottom ? "learning" : ""} ${route === "upload" ? `upload-page ${uploadDraft.uploaded ? "reviewing" : ""}` : route === "processing" ? "processing-page" : ""} ${["home", "learn", "featured"].includes(route) ? "path-page" : ""}`}
      >
        {/* Preparation shows its own recovery surface once the job is loaded. */}
        <ErrorMessage
          message={
            route === "processing" && job ? configError : error || configError
          }
        />
        {configError ||
        (error && route !== "history" && !(route === "processing" && job)) ? (
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
                Your quests
              </Link>
            ) : null}
          </div>
        ) : null}
        {demo && !focus ? (
          <aside className="demo-banner" aria-label="Sample preview mode">
            <strong>Sample preview</strong>
            <span>Reference study · authored · no AI calls</span>
          </aside>
        ) : null}
        {config && !config.storage ? (
          <div className="notice">
            <h1>This learning path is unavailable</h1>
            <p>
              The research workspace is not available right now. Continue with
              Gradly’s guided quest while it is being prepared.
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
            onStart={() => router.push("/meet/featured")}
          />
        ) : null}
        {route === "upload" ? (
          <UploadPage
            reduced={reduced}
            config={config}
            draft={uploadDraft}
            onDraftChange={setUploadDraft}
            busy={busy}
            heading={heading}
            onStart={() => router.push("/meet/featured")}
          />
        ) : null}
        {route === "meet" && id ? (
          <TextingQuest
            key={id}
            sessionKey={id}
            reduced={reduced}
            heading={heading}
          />
        ) : null}
        {route === "processing" && id ? (
          <ProcessingPage
            reduced={reduced}
            job={job}
            config={config}
            busy={busy}
            error={error}
            stageInterrupted={stageError && !!error}
            heading={heading}
            sourcePages={sourcePages}
            onStart={(lessonId) => void startFirstChallenge(lessonId)}
            onStep={(retry, consent) => void step(retry, consent)}
            onLoadPages={async () => {
              if (!job) return;
              try {
                const result = await api<{
                  pages: import("../../../api/src/research/contracts.js").PageText[];
                }>(`/api/research/documents?id=${job.id}`);
                if (mounted.current) setSourcePages(result.pages);
              } catch (e) {
                if (!mounted.current) return;
                setError((e as Error).message);
                setStageError(false);
              }
            }}
          />
        ) : null}
        {route === "adventure" && session ? (
          <SceneMotion reduced={reduced}>
            <SceneTransition
              identity={`${session.id}:${reviewMode ? "review" : `${session.phase}:${c?.id ?? ""}`}`}
            >
              {session.phase === "briefing" ? (
                <>
                  <Speech>
                    You make the research decisions. I’ll help you examine the
                    evidence, then we’ll reveal the original paper.
                  </Speech>
                  <span className="tag">
                    {session.source === "demo"
                      ? "Sample quest · authored guidance"
                      : session.source !== "generated"
                        ? "Pre-reviewed reference quest"
                        : "AI-generated • verification passed"}
                  </span>
                  <h1 ref={heading} tabIndex={-1}>
                    {session.title}
                  </h1>
                  <div className="card">
                    <h2>Your investigation briefing</h2>
                    <p>
                      {session.source === "generated"
                        ? session.briefing
                        : "Make eight research decisions about this study. You’ll choose an analysis before comparing it with the published findings."}
                    </p>
                    <details className="briefing-session-details">
                      <summary>
                        Attempts, reasoning and the optional bonus
                      </summary>
                      <p>
                        You can revise once after a missed answer. Completion
                        and first-attempt accuracy are tracked separately.
                        Written reasoning is optional. Any available bonus
                        follows the main decisions.
                      </p>
                    </details>
                  </div>
                  {session.source !== "generated" ? (
                    <div className="card briefing-recap">
                      <h2>Before you decide</h2>
                      <ul>
                        {paperContext.slice(0, 3).map((point) => (
                          <li key={point.id}>
                            <span className="tag">{point.label}</span>
                            <p>{point.title}</p>
                          </li>
                        ))}
                      </ul>
                      <p className="quiet">
                        Results stay closed until the investigation reaches
                        them.
                      </p>
                      {session.source === "demo" ? (
                        <Link
                          className="text-link"
                          href={`/processing/${session.id}`}
                        >
                          Review the study map
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                  <button
                    disabled={busy}
                    className="btn primary"
                    aria-busy={busy}
                    onClick={() => act("begin")}
                  >
                    <ActionLabel busy={busy}>Start quest</ActionLabel>
                  </button>
                </>
              ) : null}
              {c && !reviewMode ? (
                <>
                  <div className="play-top">
                    <div
                      className="play-progress"
                      role="progressbar"
                      aria-label={
                        session.phase === "bonus"
                          ? "Bonus decision"
                          : `Decision ${session.index + 1} of ${session.total}`
                      }
                      aria-valuemin={0}
                      aria-valuemax={session.total}
                      aria-valuenow={
                        session.phase === "bonus"
                          ? session.total
                          : session.index
                      }
                    >
                      {Array.from({ length: session.total }, (_, i) => (
                        <span
                          key={i}
                          className={
                            session.phase === "bonus" || i < session.index
                              ? "is-done"
                              : i === session.index
                                ? "is-current"
                                : ""
                          }
                        />
                      ))}
                    </div>
                    <span className="play-progress-label" aria-hidden="true">
                      {session.phase === "bonus"
                        ? "Bonus decision"
                        : `Decision ${session.index + 1} of ${session.total}`}
                    </span>
                  </div>
                  <Speech
                    // A reaction for the key moment only: the checked answer.
                    pose={
                      c.feedback
                        ? c.feedback.correct
                          ? "celebrating"
                          : "thinking"
                        : "guiding"
                    }
                  >
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
                  <span className="play-kicker">
                    {c.stage} ·{" "}
                    {c.type === "multiple"
                      ? "Select all that apply"
                      : "Choose one response"}
                  </span>
                  <h1
                    ref={heading}
                    tabIndex={-1}
                    key={`${c.id}-heading`}
                    className="challenge-heading"
                  >
                    {c.title}
                  </h1>
                  {!scene && c.evidence.length ? (
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
                  {scene ? (
                    <InvestigationScene
                      key={`${session.id}:${c.id}:${session.retrying}`}
                      scene={scene}
                      options={c.options}
                      multiple={c.type === "multiple"}
                      selected={selected}
                      firstSelection={c.firstSelection ?? []}
                      disabled={busy || !!c.feedback}
                      answered={!!c.feedback}
                      reduced={reduced}
                      draft={sceneDraft}
                      onDraft={setSceneDraft}
                      onSelect={setSelected}
                      verdict={
                        c.feedback
                          ? c.feedback.correct
                            ? "correct"
                            : "incorrect"
                          : undefined
                      }
                    />
                  ) : (
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
                  )}
                  <SceneFollowing>
                    <div className="support-grid">
                      <SceneDisclosure
                        reduced={reduced}
                        className="support"
                        title="Study Details"
                      >
                        {session.source !== "generated" ? (
                          <p>
                            Random assignment; separate participant groups;
                            numerical percentage-correct outcome. The quiz
                            followed a lecture and a distractor activity.
                            Statistical assumptions need examination; random
                            assignment does not guarantee normality or
                            independence in every testing arrangement.
                          </p>
                        ) : (
                          <p>
                            {c.evidence.join(" ") ||
                              "Use the research evidence supplied with this decision. Missing evidence should not be inferred."}
                          </p>
                        )}
                      </SceneDisclosure>
                      <SceneDisclosure
                        reduced={reduced}
                        className="support"
                        title="Hint"
                      >
                        <p>{c.hint}</p>
                      </SceneDisclosure>
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
                          Your selection uses the answer guide. Written
                          reasoning receives AI evaluation only when you request
                          live feedback.
                        </p>
                      </div>
                    ) : null}
                    {c.feedback ? (
                      <>
                        <SceneFeedback
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
                        </SceneFeedback>
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
                                  ? "Use this decision’s page references. Do not fill gaps in the source with assumptions."
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
                                    version: session.version,
                                    challengeId: c.id,
                                    reasoningRevision: c.reasoningRevision,
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
                                Live AI is not configured. Your written
                                reasoning is saved but has not been evaluated.
                              </p>
                            ) : null}
                            {shownFeedback && !editingReasoning ? (
                              <div className="notice" role="status">
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
                            <p className="quiet reasoning-preview-note">
                              See how a correct choice can hide a misconception
                              in an authored example, separate from your
                              writing.
                            </p>
                            <Link className="text-link" href="/reasoning">
                              See a reasoning-and-revision example
                            </Link>
                          </section>
                        ) : null}
                      </>
                    ) : null}
                  </SceneFollowing>
                </>
              ) : null}
              {session.phase === "bonus-choice" ? (
                <div className="center bonus-offer">
                  <Mascot pose="thinking" />
                  <h1 ref={heading} tabIndex={-1}>
                    One more question?
                  </h1>
                  <p>
                    {session.source === "generated"
                      ? session.bonusAvailable
                        ? "You’ve completed the required decisions. Consider one more question about the evidence before revealing the source."
                        : "You’ve completed the required decisions. Connect them to the paper and the limits of its evidence."
                      : "You’ve completed the required decisions. Explore whether statistical significance can repair a design problem."}
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
                          <ActionLabel icon="sparkle">
                            Try the bonus
                          </ActionLabel>
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
                    <Mascot
                      pose={
                        session.phase === "complete" ? "celebrating" : "reading"
                      }
                    />
                    <span className="tag">
                      {session.phase === "complete"
                        ? "Quest complete"
                        : "Original quest"}
                    </span>
                    <h1 ref={heading} tabIndex={-1}>
                      {session.phase === "complete"
                        ? "Quest complete!"
                        : "Research Paper Unlocked!"}
                    </h1>
                    <p>
                      You made the decisions. Now connect your reasoning with
                      the original research.
                    </p>
                    <p className="research-points-total">
                      {session.points ?? 0} practice points earned · 10 per
                      solved challenge
                    </p>
                  </div>
                  <SceneJourney
                    records={session.review ?? []}
                    reduced={reduced}
                  />
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
                        <span>Required decisions</span>
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
                        <span>Decisions revised</span>
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
                          SD=17.26%. The authors reported F(1,54)=4.33,
                          p&lt;.05.
                        </p>
                        <p>The mean difference is 9.59 percentage points.</p>
                        <p>
                          A two-group equal-variance ANOVA and pooled
                          independent t-test yield F=t². A different variance
                          approach may produce a different result.
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
                        <ActionLabel icon="check">Finish quest</ActionLabel>
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
                            Your first responses matched the answer guide on
                            every required challenge.
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
                            Restart quest
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
                    <SceneDisclosure
                      reduced={reduced}
                      key={item.id}
                      title={
                        <>
                          {item.title} •{" "}
                          {item.attempts[0]?.correct
                            ? "Correct first attempt"
                            : "Concept to revisit"}
                        </>
                      }
                    >
                      <SceneReview record={item} reduced={reduced} />
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
                                  {r.text ||
                                    "No written explanation submitted."}
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
                    </SceneDisclosure>
                  ))}
                  <button
                    className="btn outline"
                    onClick={() => setShowReview(false)}
                  >
                    Back to summary
                  </button>
                </>
              ) : null}
            </SceneTransition>
          </SceneMotion>
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
                Your quests
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
          "meet",
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
                  ? c.feedback.message
                  : "Choose a response, then check your choice."}
              </p>
            </div>
            <SceneAction
              reduced={reduced}
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
            </SceneAction>
          </div>
        </footer>
      ) : focus ? null : (
        <SiteFooter />
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
              ? "Your current quest stays in history. A fresh attempt starts at the briefing."
              : "This removes extracted text, processing results, the generated lesson, and all linked quests. This cannot be undone."}
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
