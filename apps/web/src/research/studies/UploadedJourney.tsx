import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { AppLoading } from "../../components/AppLoading.js";
import { SiteHeader } from "../../components/SiteChrome.js";
import { readDraft, readReducedMotion, writeDraft } from "../client-state.js";
import { ResearchLink as Link, useResearchRouter } from "../navigation.js";
import { api, ResearchRequestError } from "../request.js";
import { emptySceneDraft } from "../scenes/InvestigationScene.js";
import { SceneMotion } from "../scenes/scene-motion.js";
import type { ResearchSession } from "../types.js";
import { useResearchConfig } from "../useResearchConfig.js";
import { readPrediction, writePrediction } from "../warmup.js";
import { JourneyPlayer, type JourneyDriver } from "./JourneyPlayer.js";
import type { StudyProgress } from "./progress.js";
import { ReasoningCoach, type CoachRequest } from "./ReasoningCoach.js";
import {
  finishedCount,
  toPreparedStudy,
  toProgress,
  type SeenChallenges,
} from "./uploaded.js";
import "./studies.css";
import "./uploaded-journey.css";

type Draft = NonNullable<StudyProgress["draft"]>;
const seenKey = (id: string) => `gradly-seen:${id}`;

function readSeen(id: string): SeenChallenges {
  try {
    const value = JSON.parse(sessionStorage.getItem(seenKey(id)) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

/**
 * Plays an uploaded paper's lesson in the prepared-study player. Every check,
 * retry and step is a request to the saved learning session; this component
 * keeps only the unchecked draft, which survives refresh in this tab.
 */
export function UploadedJourney({ sessionId }: { sessionId: string }) {
  const router = useResearchRouter();
  const { config } = useResearchConfig();
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [reasoning, setReasoning] = useState("");
  const [seen, setSeen] = useState<SeenChallenges>(() => readSeen(sessionId));
  const [coach, setCoach] = useState<CoachRequest>({
    pending: false,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);
  // The intro's hunch replaces the stored prediction for this render onward.
  const [hunch, setHunch] = useState<string | null>(null);
  const lock = useRef(false);
  const mounted = useRef(true);
  const finishing = useRef<string | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const apply = useCallback((next: ResearchSession) => {
    const c = next.challenge;
    const saved = readDraft(next.id, next.version, c?.id ?? next.phase);
    setSession(next);
    setDraft((previous) =>
      c && saved && !c.feedback
        ? {
            challengeId: c.id,
            selected: saved.selected.filter((id) =>
              c.options.some((o) => o.id === id),
            ),
            scene: saved.scene ?? emptySceneDraft,
          }
        : // Like the prepared player, keep scene exploration for a retry
          // on the same challenge; the checked answer itself is cleared.
          c && previous?.challengeId === c.id
          ? { ...previous, selected: [] }
          : null,
    );
    setReasoning(saved?.reasoning ?? "");
    setCoach({ pending: false, error: "" });
    if (c && next.phase === "challenge")
      setSeen((known) => {
        if (known[next.index]?.id === c.id) return known;
        const updated = {
          ...known,
          [next.index]: { id: c.id, title: c.title, reveal: c.reveal },
        };
        try {
          sessionStorage.setItem(seenKey(next.id), JSON.stringify(updated));
        } catch {}
        return updated;
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadError("");
    api<ResearchSession>(
      `/api/research/learning?id=${encodeURIComponent(sessionId)}`,
      undefined,
      "GET",
      controller.signal,
    )
      .then((s) => !controller.signal.aborted && apply(s))
      .catch(
        (e: Error) => !controller.signal.aborted && setLoadError(e.message),
      );
    return () => controller.abort();
  }, [sessionId, attempt, apply]);

  // The unchecked draft is version-bound, so a stale tab never restores it.
  useEffect(() => {
    if (!session) return;
    writeDraft(session.id, {
      version: session.version,
      challengeId: session.challenge?.id ?? session.phase,
      selected: draft?.selected ?? [],
      reasoning,
      reflection: "",
      editingReasoning: false,
      scene: draft?.scene,
    });
  }, [session, draft, reasoning]);

  const act = useCallback(
    async (action: string, extra: Record<string, unknown> = {}) => {
      if (lock.current || !session) return null;
      lock.current = true;
      setBusy(true);
      setActionError("");
      try {
        const next = await api<ResearchSession>("/api/research/learning", {
          action,
          id: session.id,
          version: session.version,
          ...extra,
        });
        if (mounted.current) apply(next);
        return next;
      } catch (e) {
        if (!mounted.current) return null;
        setActionError((e as Error).message);
        // Another tab saved first: show its progress instead of guessing.
        if (e instanceof ResearchRequestError && e.status === 409)
          setAttempt((n) => n + 1);
        return null;
      } finally {
        lock.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [session, apply],
  );

  // Reaching the reveal completes the run so history shows it as finished.
  useEffect(() => {
    if (session?.phase !== "reveal" || finishing.current === session.id) return;
    finishing.current = session.id;
    void act("finish", { reflection: "" });
  }, [session?.phase, session?.id, act]);

  // A lesson without a bonus has nothing to offer, so go straight to the paper.
  const skipBonus =
    session?.phase === "bonus-choice" && !session.bonusAvailable;
  useEffect(() => {
    if (skipBonus) void act("skip");
  }, [skipBonus, act]);

  const askCoach = async () => {
    const c = session?.challenge;
    if (!session || !c || coach.pending || lock.current) return;
    lock.current = true;
    setCoach({ pending: true, error: "" });
    try {
      const result = await api<{ session: ResearchSession }>(
        "/api/research/feedback",
        {
          id: session.id,
          version: session.version,
          challengeId: c.id,
          reasoningRevision: c.reasoningRevision,
        },
      );
      if (mounted.current) apply(result.session);
    } catch (e) {
      if (mounted.current)
        setCoach({ pending: false, error: (e as Error).message });
    } finally {
      lock.current = false;
    }
  };

  const progress = useMemo(
    () => (session ? toProgress(session, draft) : null),
    [session, draft],
  );
  const study = useMemo(
    () => (session ? toPreparedStudy(session, seen) : null),
    [session, seen],
  );
  useEffect(() => {
    if (study) document.title = `${study.teaser} · Gradly`;
  }, [study?.teaser]);

  if (!session || !study || !progress)
    return loadError ? (
      <main className="library">
        <div className="library-empty">
          <h1 tabIndex={-1}>We couldn’t open this study</h1>
          <p role="alert">{loadError}</p>
          <div className="uploaded-recovery">
            <button
              type="button"
              className="journey-begin"
              onClick={() => setAttempt((n) => n + 1)}
            >
              Try again
            </button>
            <Link className="journey-skip" href="/history">
              Your quests
            </Link>
          </div>
        </div>
      </main>
    ) : (
      <AppLoading label="Opening your study…" />
    );

  const prediction = hunch ?? readPrediction(session.lessonId);
  const driver: JourneyDriver = {
    points: session.points ?? 0,
    finished: finishedCount(session),
    busy,
    closeHref: "/history",
    closeLabel: "Save and exit to your quests",
    saveDraft: (change) => {
      const next = change(progress);
      setDraft(next.draft);
    },
    begin: () => void act("begin"),
    check: (challenge, selected) =>
      void act("submit", {
        selected,
        reasoning: challenge.writtenReasoning ? reasoning.trim() : "",
      }),
    retry: () => void act("retry"),
    next: () => void act("next"),
    bonus: (accept) => void act(accept ? "bonus" : "skip"),
    renderExtra: (_challenge, status) =>
      session.challenge ? (
        <ReasoningCoach
          challenge={session.challenge}
          status={status}
          draft={reasoning}
          onDraft={setReasoning}
          liveAI={!!config?.liveAI}
          request={coach}
          onAsk={() => void askCoach()}
        />
      ) : null,
    orientation: {
      stages: session.stages,
      bonus: session.bonusAvailable,
      prediction,
      onPrediction: (text) => {
        writePrediction(session.lessonId, text);
        setHunch(text);
      },
    },
    ocr: session.ocr,
    revealExtra: prediction ? (
      <section className="uploaded-prediction" aria-label="Your prediction">
        <Lightbulb size={18} aria-hidden="true" />
        <div>
          <strong>Before the quest you predicted</strong>
          <p>“{prediction}”</p>
          <small>Compare it with what the paper found above.</small>
        </div>
      </section>
    ) : null,
    revealActions: (
      <>
        <Link className="journey-begin" href="/studies">
          Try a prepared study{" "}
          <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
        </Link>
        <Link className="journey-skip" href="/history">
          Back to your quests
        </Link>
        <button
          type="button"
          className="journey-skip"
          disabled={busy}
          onClick={async () => {
            const fresh = await act("restart", { confirmed: true });
            if (fresh) router.push(`/play/${fresh.id}`);
          }}
        >
          Replay this study
        </button>
      </>
    ),
  };
  const playing = progress.phase !== "intro";
  return (
    <SceneMotion reduced={readReducedMotion()}>
      <div
        className={`studies uploaded-journey ${playing ? "is-playing" : ""}`}
      >
        {playing ? null : <SiteHeader current="quests" />}
        {actionError ? (
          <p className="uploaded-alert" role="alert">
            {actionError}
          </p>
        ) : null}
        {!skipBonus ? (
          <JourneyPlayer study={study} progress={progress} driver={driver} />
        ) : actionError ? (
          <main className="library">
            <div className="library-empty">
              <h1 tabIndex={-1}>We couldn’t open the paper</h1>
              <div className="uploaded-recovery">
                <button
                  type="button"
                  className="journey-begin"
                  disabled={busy}
                  onClick={() => void act("skip")}
                >
                  Try again
                </button>
              </div>
            </div>
          </main>
        ) : (
          <AppLoading label="Opening the paper…" />
        )}
      </div>
    </SceneMotion>
  );
}
