import React, { lazy, Suspense } from "react";
const ResearchApp = lazy(() =>
  import("./research/ResearchApp.js").then((m) => ({ default: m.ResearchApp })),
);
import { BrandLogo } from "./components/BrandLogo.js";
import { AppLoading } from "./components/AppLoading.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Check, CircleHelp, Flag, Sparkles, X } from "lucide-react";
import {
  isFeedbackResponse,
  type ApiError,
  type Lesson,
} from "@paperquest/contracts";
import {
  acceptFeedback,
  advance,
  emptyQuestion,
  newSession,
  points,
  recordAttempt,
  restoreSession,
  updateDraft,
  type Session,
} from "@paperquest/lesson-state";
import { Welcome } from "./components/Welcome.js";
import { Prepare } from "./components/Prepare.js";
import { LessonView } from "./components/LessonView.js";
import { Complete } from "./components/Complete.js";
import { Dialog } from "./components/Dialog.js";
const STORAGE = "paperquest.session.v1";
function savedSession(ids: string[], mode: Lesson["mode"]): Session {
  try {
    const saved = restoreSession(localStorage.getItem(STORAGE), ids);
    const incompatible = Object.values(saved.questions).some((q) =>
      q.attempts.some((a) => a.response && a.response.feedback.mode !== mode),
    );
    return incompatible ? newSession() : saved;
  } catch {
    return newSession();
  }
}
function validLesson(raw: unknown): raw is Lesson {
  if (!raw || typeof raw !== "object") return false;
  const l = raw as Lesson;
  return (
    typeof l.version === "string" &&
    typeof l.title === "string" &&
    Array.isArray(l.questions) &&
    l.questions.length === 6 &&
    l.questions.every(
      (q) =>
        q &&
        typeof q.id === "string" &&
        typeof q.title === "string" &&
        typeof q.prompt === "string" &&
        typeof q.study === "string" &&
        Array.isArray(q.choices) &&
        q.choices.length > 1 &&
        q.choices.every((x) => typeof x === "string"),
    ) &&
    new Set(l.questions.map((q) => q.id)).size === l.questions.length &&
    ["preview", "nebius", "unconfigured"].includes(l.mode)
  );
}
function isResearchRoute() {
  return (
    window.location.hash.startsWith("#/research") &&
    !/^#\/research\/lab(?:\/|$)/.test(window.location.hash)
  );
}
export function LegacyApp({ uploadFirst = false }: { uploadFirst?: boolean }) {
  const [screen, setScreen] = useState<
    "welcome" | "prepare" | "lesson" | "research"
  >(isResearchRoute() ? "research" : "welcome");
  const [researchAvailable, setResearchAvailable] = useState(false);
  const [liveResearchAI, setLiveResearchAI] = useState(false);
  const [researchPoints, setResearchPoints] = useState(0);
  useEffect(() => {
    if (!uploadFirst || screen !== "welcome") return;
    const controller = new AbortController();
    fetch("/api/research/learning", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((records: unknown) => {
        if (!Array.isArray(records)) return;
        setResearchPoints(
          records.reduce(
            (total, record) =>
              total +
              (Number.isInteger(record?.points) && record.points >= 0
                ? record.points
                : 0),
            0,
          ),
        );
      })
      .catch(() => {});
    return () => controller.abort();
  }, [uploadFirst, screen]);
  const [researchFile, setResearchFile] = useState<File | null>(null);
  useEffect(() => {
    fetch("/api/research/config")
      .then((r) => r.json())
      .then((data) => {
        setResearchAvailable(data.storage === true);
        setLiveResearchAI(data.liveAI === true);
      })
      .catch(() => {});
    const changed = () =>
      setScreen((s) =>
        isResearchRoute() ? "research" : s === "research" ? "welcome" : s,
      );
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  function openResearch(file?: File) {
    setResearchFile(file ?? null);
    window.location.hash = file ? "/research/upload" : "/research/learn";
    setScreen("research");
  }
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [session, setSession] = useState(newSession);
  const [label, setLabel] = useState("");
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [storageError, setStorageError] = useState(false);
  const [dialog, setDialog] = useState<
    "pause" | "progress" | "restart" | "help" | string | null
  >(null);
  const initialized = useRef(false);
  const busy = useRef(false);
  const loadController = useRef<AbortController | null>(null);
  const loadLesson = useCallback(async () => {
    loadController.current?.abort();
    const controller = new AbortController();
    loadController.current = controller;
    setLoadError("");
    try {
      const response = await fetch("/api/lesson", {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error();
      const data: unknown = await response.json();
      if (!validLesson(data)) throw new Error();
      setLesson(data);
      if (!initialized.current) {
        setSession(
          savedSession(
            data.questions.map((q) => q.id),
            data.mode,
          ),
        );
        initialized.current = true;
      }
    } catch {
      if (!controller.signal.aborted)
        setLoadError(
          "The lesson could not load. Check your connection and try again.",
        );
    }
  }, []);
  useEffect(() => {
    void loadLesson();
    return () => loadController.current?.abort();
  }, [loadLesson]);
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(session));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [session]);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  function changeScreen(next: typeof screen) {
    setScreen(next);
    setError("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function prepare(source: string) {
    setLabel(source);
    changeScreen("prepare");
    void loadLesson();
  }
  function start() {
    if (!lesson) return;
    if (session.started) {
      setDialog("restart");
      return;
    }
    setSession({ ...newSession(), started: true });
    changeScreen("lesson");
  }
  function restart() {
    setDialog(null);
    setSession({ ...newSession(), started: true });
    changeScreen("lesson");
  }
  async function submit() {
    if (!lesson || busy.current || offline) return;
    const question = lesson.questions[session.current];
    if (!question) return;
    const q = session.questions[question.id] ?? emptyQuestion();
    if (!q.choice || !q.explanation.trim() || q.finished) return;
    const previous = q.attempts.at(-1);
    const attempt =
      previous &&
      !previous.response &&
      previous.choice === q.choice &&
      previous.explanation === q.explanation
        ? previous
        : {
            id: crypto.randomUUID(),
            choice: q.choice,
            explanation: q.explanation,
          };
    busy.current = true;
    setPending(true);
    setError("");
    setSession((s) => recordAttempt(s, question.id, attempt));
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonVersion: lesson.version,
          questionId: question.id,
          attemptId: attempt.id,
          choice: attempt.choice,
          explanation: attempt.explanation,
        }),
        signal: AbortSignal.timeout(55_000),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = (data as ApiError)?.error?.message;
        throw new Error(
          typeof message === "string"
            ? message
            : "Feedback could not complete. Your answer is kept. Try again.",
        );
      }
      if (
        !isFeedbackResponse(data) ||
        data.attemptId !== attempt.id ||
        data.questionId !== question.id
      )
        throw new Error(
          "The feedback could not be matched to your answer. Your answer is kept. Try again.",
        );
      setSession((s) => acceptFeedback(s, data));
    } catch (cause) {
      setError(
        cause instanceof Error &&
          cause.name !== "TimeoutError" &&
          cause.name !== "TypeError"
          ? cause.message
          : "Feedback could not connect. Your answer is kept. Try again when connected.",
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  const complete = !!lesson && session.current >= lesson.questions.length;
  const simpleHome = uploadFirst && screen === "welcome";
  const reviewId = dialog?.startsWith("review:") ? dialog.slice(7) : null;
  const reviewQuestion = lesson?.questions.find((q) => q.id === reviewId);
  const reviewState = reviewId ? session.questions[reviewId] : null;
  if (screen === "research")
    return (
      <Suspense
        fallback={<AppLoading label="Opening the research workspace…" />}
      >
        <ResearchApp
          initialFile={researchFile}
          onExit={() => {
            window.location.hash = uploadFirst ? "" : "/classic";
            changeScreen("welcome");
          }}
        />
      </Suspense>
    );
  return (
    <div className={simpleHome ? "upload-home-shell" : undefined}>
      <a
        href="#main"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to adventure
      </a>
      <header className="app-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() =>
              pending ? setDialog("pause") : changeScreen("welcome")
            }
            aria-label="Gradly home"
          >
            <BrandLogo />
          </button>
          <nav aria-label="Main navigation">
            {simpleHome ? (
              <button
                onClick={() => {
                  window.location.hash = "/research/history";
                }}
              >
                My documents
              </button>
            ) : (
              <>
                <button
                  className={screen !== "welcome" ? "active" : ""}
                  onClick={() =>
                    pending ? setDialog("pause") : changeScreen("welcome")
                  }
                >
                  Adventure
                </button>
                <button onClick={() => setDialog("progress")}>
                  My progress
                </button>
                {researchAvailable ? (
                  <button onClick={() => openResearch()}>Research Lab</button>
                ) : null}
              </>
            )}
          </nav>
          <div className="header-badges">
            <span className="points-pill">
              <Sparkles size={17} />
              <strong>
                {points(session) + (simpleHome ? researchPoints : 0)}
              </strong>
              <span className="points-label">
                {lesson?.mode === "preview" ? "sample points" : "points"}
              </span>
            </span>
            <button
              className="icon-button help-button"
              aria-label="How Gradly works"
              onClick={() => setDialog("help")}
            >
              <CircleHelp size={23} />
            </button>
          </div>
        </div>
      </header>
      {lesson?.mode === "preview" && !simpleHome ? (
        <div className="mode-banner">
          Local preview · choices are checked, explanations are not assessed.
        </div>
      ) : null}
      {offline ? (
        <div className="connection-banner" role="status">
          You’re offline. Keep writing. Feedback will be available when you
          reconnect.
        </div>
      ) : null}
      {storageError ? (
        <div className="connection-banner" role="status">
          This browser could not save your progress. Keep this tab open to
          retain your answers.
        </div>
      ) : null}
      {screen === "welcome" ? (
        <Welcome
          uploadFirst={uploadFirst}
          samplePreview={uploadFirst && !liveResearchAI}
          onStart={prepare}
          onResearchFile={
            uploadFirst || researchAvailable
              ? (file) => openResearch(file)
              : undefined
          }
          session={session}
          complete={complete}
          onResume={() => {
            if (lesson) changeScreen("lesson");
            else {
              changeScreen("prepare");
              void loadLesson();
            }
          }}
        />
      ) : screen === "prepare" ? (
        <Prepare
          lesson={lesson}
          label={label}
          error={loadError}
          onRetry={() => void loadLesson()}
          onStart={start}
          onBack={() => changeScreen("welcome")}
        />
      ) : lesson ? (
        complete ? (
          <Complete
            lesson={lesson}
            session={session}
            onRestart={() => setDialog("restart")}
            onReview={(id) => setDialog(`review:${id}`)}
          />
        ) : (
          <LessonView
            lesson={lesson}
            session={session}
            pending={pending}
            error={
              offline
                ? "Reconnect before checking your reasoning. Your text is kept."
                : error
            }
            onDraft={(draft) => {
              const q = lesson.questions[session.current];
              if (q) setSession((s) => updateDraft(s, q.id, draft));
              setError("");
            }}
            onSubmit={() => void submit()}
            onNext={() => {
              setSession((s) =>
                advance(
                  s,
                  lesson.questions.map((q) => q.id),
                ),
              );
              setError("");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            onPause={() => setDialog("pause")}
            onReview={(id) => setDialog(`review:${id}`)}
          />
        )
      ) : null}
      <footer className="app-footer">
        <span className="footer-brand">
          <BrandLogo />
          <span>Stay curious. Follow the evidence.</span>
        </span>
        <button className="text-button" onClick={() => setDialog("help")}>
          About this pilot <ArrowFooter />
        </button>
      </footer>
      {dialog === "pause" ? (
        <Dialog title="Pause your adventure?" onClose={() => setDialog(null)}>
          <p>
            {pending
              ? "Feedback is still being requested. Stay here until the request finishes to review it."
              : storageError
                ? "Progress cannot be saved in this browser. Keep this tab open to retain your answers."
                : "Your choices, explanations, and feedback are saved on this device. You can pick up where you left off."}
          </p>
          <div className="modal-actions">
            <button className="button neutral" onClick={() => setDialog(null)}>
              Keep exploring
            </button>
            <button
              className="button primary"
              disabled={pending}
              onClick={() => {
                setDialog(null);
                changeScreen("welcome");
              }}
            >
              Save my place
            </button>
          </div>
        </Dialog>
      ) : null}
      {dialog === "restart" ? (
        <Dialog
          title="Start a fresh adventure?"
          onClose={() => setDialog(null)}
        >
          <p>
            This replaces the saved adventure on this device. Download your
            notes from the completed adventure first if you want to keep them.
          </p>
          <div className="modal-actions">
            <button className="button neutral" onClick={() => setDialog(null)}>
              Keep my progress
            </button>
            <button className="button primary" onClick={restart}>
              Start fresh
            </button>
          </div>
        </Dialog>
      ) : null}
      {dialog === "progress" ? (
        <Dialog title="Your adventure progress" onClose={() => setDialog(null)}>
          {session.started && lesson ? (
            <>
              <p>
                <strong>
                  {
                    lesson.questions.filter(
                      (q) => session.questions[q.id]?.finished,
                    ).length
                  }{" "}
                  of {lesson.questions.length} checkpoints
                </strong>{" "}
                complete. {points(session)}{" "}
                {lesson.mode === "preview" ? "sample" : "reasoning"} points.
              </p>
              <p>
                Each correct quest earns 10 points once. Repeating feedback does
                not earn extra points. The evidence-boundary checkpoint is
                ungraded.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setDialog(null);
                  changeScreen("lesson");
                }}
              >
                {complete
                  ? "Review completed adventure"
                  : "Return to adventure"}
              </button>
            </>
          ) : (
            <>
              <p>
                Your first adventure starts with one research paper and one
                choice. Your progress will appear here.
              </p>
              <button
                className="button primary"
                onClick={() => {
                  setDialog(null);
                  prepare("Gingerich & Lineweaver · 2014");
                }}
              >
                Try the curated study
              </button>
            </>
          )}
        </Dialog>
      ) : null}
      {dialog === "help" ? (
        <Dialog title="Read. Reason. Revisit." onClose={() => setDialog(null)}>
          <p>
            Explore one curated study, explain each choice, then compare your
            thinking with the evidence. Two fictional scenarios let you practise
            the same reasoning in a new setting.
          </p>
          <p>
            Live mode sends your choice and explanation to Nemotron on Nebius.
            The server validates its assessment and selects authored feedback.
            The original paper and uploaded files are not sent.
          </p>
          <p>
            Progress stays in this browser. There are no accounts or shared
            rankings. Draft teaching content still needs expert review.
          </p>
          <p>
            Local preview checks only whether your choice matches a sample
            answer. It cannot assess your explanation or measure learning.
          </p>
        </Dialog>
      ) : null}
      {reviewQuestion && reviewState ? (
        <Dialog title={reviewQuestion.title} onClose={() => setDialog(null)}>
          <p>{reviewQuestion.prompt}</p>
          <div className="review-answer">
            <span className="eyebrow">YOUR ANSWER</span>
            <p>
              <strong>{reviewState.choice}</strong>
            </p>
            <p>{reviewState.explanation}</p>
          </div>
          {reviewState.attempts.at(-1)?.response ? (
            <>
              <p>
                {reviewState.attempts.at(-1)!.response!.feedback.strength ||
                  reviewState.attempts.at(-1)!.response!.feedback.correction}
              </p>
              {reviewState.attempts
                .at(-1)!
                .response!.feedback.evidence.map((e) => (
                  <blockquote key={e.ref}>
                    <p>{e.text}</p>
                    <cite>{e.location}</cite>
                  </blockquote>
                ))}
            </>
          ) : null}
        </Dialog>
      ) : null}
    </div>
  );
}
function ArrowFooter() {
  return <Flag size={14} aria-hidden="true" />;
}
