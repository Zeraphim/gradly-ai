import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { activityPilot, pilotScene } from "./activity-pilot.js";
import { FocusBar } from "./FocusBar.js";
import { ActionLabel, Icon } from "./icon.js";
import { Mascot } from "./learning-ui.js";
import { ResearchLink as Link } from "./navigation.js";
import { readReducedMotion, subscribeReducedMotion } from "./client-state.js";
import {
  InvestigationScene,
  emptySceneDraft,
  type SceneDraft,
} from "./scenes/InvestigationScene.js";
import { SceneMotion, m, useSceneMotion } from "./scenes/scene-motion.js";
import "./quest.css";
import "./activity-pilot.css";

type Draft = {
  selected: string[];
  scene: SceneDraft;
  reviewed: boolean;
  explanation: string;
  /** Whether the first checked interpretation fit; null until checked. */
  firstCorrect: boolean | null;
};
type PilotState = {
  active: string;
  drafts: Record<string, Draft>;
  finished: boolean;
};
const STORAGE = "gradly-activity-pilot:v1";
const fresh = (): Draft => ({
  selected: [],
  scene: { ...emptySceneDraft },
  reviewed: false,
  explanation: "",
  firstCorrect: null,
});

/** This preview keeps its own tab drafts; it never writes assessed server progress. */
export function restorePilot(raw: string | null): PilotState {
  const initial: PilotState = {
    active: activityPilot[0]!.id,
    drafts: {},
    finished: false,
  };
  try {
    const saved = JSON.parse(raw ?? "");
    if (activityPilot.some((paper) => paper.id === saved?.active))
      initial.active = saved.active;
    initial.finished = saved?.finished === true;
    for (const paper of activityPilot) {
      const draft = saved?.drafts?.[paper.id];
      if (!draft || typeof draft !== "object") continue;
      const selected = Array.isArray(draft.selected)
        ? draft.selected
            .filter((id: unknown) => paper.options.some((o) => o.id === id))
            .slice(0, 1)
        : [];
      const ids =
        paper.scene.kind === "connections"
          ? paper.scene.anchors.map((a) => a.id)
          : paper.scene.kind === "flow"
            ? paper.scene.nodes.map((a) => a.id)
            : [];
      initial.drafts[paper.id] = {
        selected,
        reviewed: draft.reviewed === true && selected.length === 1,
        firstCorrect:
          typeof draft.firstCorrect === "boolean" ? draft.firstCorrect : null,
        explanation:
          typeof draft.explanation === "string"
            ? draft.explanation.slice(0, 1500)
            : "",
        scene: {
          inspectedId: ids.includes(draft.scene?.inspectedId)
            ? draft.scene.inspectedId
            : null,
          prediction:
            paper.scene.kind === "comparison" &&
            paper.scene.prediction?.options.includes(draft.scene?.prediction)
              ? draft.scene.prediction
              : null,
          revealed: draft.scene?.revealed === true,
          pinnedIds: Array.isArray(draft.scene?.pinnedIds)
            ? draft.scene.pinnedIds.filter(
                (id: unknown) => typeof id === "string" && ids.includes(id),
              )
            : [],
        },
      };
    }
  } catch {
    /* Invalid or unavailable session storage starts a fresh pilot. */
  }
  return initial;
}
function restore() {
  try {
    return restorePilot(sessionStorage.getItem(STORAGE));
  } catch {
    return restorePilot(null);
  }
}

export function PaperActivityPilot({ onExit }: { onExit: () => void }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    () => false,
  );
  return (
    <SceneMotion reduced={reduced}>
      <Pilot onExit={onExit} reduced={reduced} />
    </SceneMotion>
  );
}
function Pilot({ onExit, reduced }: { onExit: () => void; reduced: boolean }) {
  const motion = useSceneMotion();
  const [state, setState] = useState(restore);
  const [storageFailed, setStorageFailed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const review = useRef<HTMLDivElement>(null);
  // Try again unmounts its own button; focus returns to the first response.
  const retry = useRef(false);
  const index = Math.max(
    0,
    activityPilot.findIndex((candidate) => candidate.id === state.active),
  );
  const paper = activityPilot[index]!;
  const last = index === activityPilot.length - 1;
  const draft = state.drafts[paper.id] ?? fresh();
  const scene = useMemo(
    () => pilotScene(paper, draft.reviewed),
    [paper, draft.reviewed],
  );
  const correct = draft.selected[0] === paper.accepted;
  const patch = (update: Partial<Draft>) =>
    setState((s) => ({
      ...s,
      drafts: { ...s.drafts, [paper.id]: { ...draft, ...update } },
    }));
  const open = (id: string) => {
    setState((s) => ({ ...s, active: id, finished: false }));
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const check = () => {
    if (!draft.selected.length || draft.reviewed) return;
    patch({ reviewed: true, firstCorrect: draft.firstCorrect ?? correct });
  };
  const next = () => {
    if (last) {
      setState((s) => ({ ...s, finished: true }));
      window.scrollTo({ top: 0, behavior: "instant" });
    } else open(activityPilot[index + 1]!.id);
  };
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify(state));
    } catch {
      setStorageFailed(true);
    }
  }, [state]);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const previousTitle = document.title;
    document.title = state.finished
      ? "Activities complete · Gradly"
      : `${paper.label} · Paper activities · Gradly`;
    return () => {
      document.title = previousTitle;
    };
  }, [paper.id, state.finished]);
  useEffect(() => {
    if (draft.reviewed) review.current?.focus({ preventScroll: true });
    else if (retry.current)
      document
        .querySelector<HTMLInputElement>("#pilot-main .scene-response input")
        ?.focus({ preventScroll: true });
    retry.current = false;
  }, [draft.reviewed]);
  // Enter checks, then moves on, as in the quest. Letter keys belong to the scene.
  useEffect(() => {
    if (state.finished) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "button, a, summary, textarea, select, input:not([type=radio]):not([type=checkbox])",
        )
      )
        return;
      if (!draft.reviewed) {
        if (!draft.selected.length) return;
        event.preventDefault();
        check();
      } else {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <>
      <a
        className="skip"
        href="#pilot-main"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("pilot-main");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <FocusBar
        step={1}
        steps={["Pick a paper", "Explore"]}
        sample
        onExit={onExit}
      />
      <main id="pilot-main" className="paper-pilot scene-motion-page">
        {state.finished ? (
          <PilotComplete
            state={state}
            heading={heading}
            onOpen={open}
            onRestart={() => {
              setState({
                active: activityPilot[0]!.id,
                drafts: {},
                finished: false,
              });
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          />
        ) : (
          <>
            <nav className="pilot-steps" aria-label="Choose a study type">
              {activityPilot.map((candidate, i) => {
                const done = state.drafts[candidate.id]?.reviewed;
                return (
                  <m.button
                    key={candidate.id}
                    type="button"
                    data-scene-motion-control
                    {...motion.gestures()}
                    className={done ? "is-done" : ""}
                    aria-pressed={candidate.id === paper.id}
                    onClick={() => open(candidate.id)}
                  >
                    <span className="pilot-step-bar" aria-hidden="true" />
                    <span className="pilot-step-name">
                      <span className="pilot-step-mark" aria-hidden="true">
                        {done ? <Icon name="check" size={12} strong /> : i + 1}
                      </span>
                      {candidate.label}
                    </span>
                  </m.button>
                );
              })}
            </nav>
            <span className="pilot-kicker">
              Paper {index + 1} of {activityPilot.length} ·{" "}
              {paper.source.citation}
            </span>
            <h1 ref={heading} tabIndex={-1}>
              {paper.question}
            </h1>
            <p className="pilot-context">{paper.context}</p>
            {storageFailed ? (
              <p role="status">
                Tab storage is unavailable. Your work stays here until you leave
                or reload.
              </p>
            ) : null}
            <InvestigationScene
              key={paper.id}
              scene={scene}
              options={paper.options}
              multiple={false}
              selected={draft.selected}
              firstSelection={[]}
              disabled={draft.reviewed}
              answered={draft.reviewed}
              reduced={reduced}
              draft={draft.scene}
              onDraft={(scene) => patch({ scene })}
              onSelect={(selected) => patch({ selected })}
              verdict={
                draft.reviewed ? (correct ? "correct" : "incorrect") : undefined
              }
            />
            <details className="pilot-source" key={`${paper.id}-source`}>
              <summary>About this paper · your notes</summary>
              <p>
                <a
                  href={paper.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paper.source.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                · {paper.source.citation}
              </p>
              <p>
                {paper.source.locator}. Cards are source paraphrases; prompts
                and feedback are authored teaching material. This pilot does not
                generate an activity from an uploaded paper or measure learning
                improvement.
              </p>
              <label className="pilot-explanation">
                In your own words, what does this evidence leave uncertain?
                <span>Optional · not assessed · saved in this tab</span>
                <textarea
                  rows={3}
                  maxLength={1500}
                  value={draft.explanation}
                  onChange={(e) => patch({ explanation: e.target.value })}
                />
              </label>
              <button
                type="button"
                className="text-link"
                onClick={() => patch(fresh())}
              >
                Reset this activity
              </button>
            </details>
          </>
        )}
        {state.finished ? null : (
          <div
            className={`journey-actions quest-bar ${
              draft.reviewed ? (correct ? "is-correct" : "is-review") : ""
            }`}
          >
            <div className="journey-actions-inner">
              {draft.reviewed ? (
                <m.div
                  ref={review}
                  tabIndex={-1}
                  role="status"
                  className="quest-feedback pilot-feedback"
                  initial={motion.still ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    motion.still ? { duration: 0 } : { duration: 0.25 }
                  }
                >
                  <strong>
                    <Icon
                      name={correct ? "check" : "search"}
                      size={18}
                      strong
                    />
                    {correct
                      ? "That interpretation fits."
                      : "This claim needs a narrower scope."}
                  </strong>
                  <p>{paper.explanation}</p>
                  <p className="pilot-limit">
                    <b>Keep in mind:</b> {paper.limitation}
                  </p>
                </m.div>
              ) : (
                <p className="pilot-hint">
                  <Icon name="search" size={16} />
                  Explore the evidence, then choose the claim it supports.
                </p>
              )}
              <div className="journey-actions-buttons">
                {draft.reviewed && !correct ? (
                  <button
                    type="button"
                    className="j-btn is-quiet"
                    onClick={() => {
                      retry.current = true;
                      patch({ reviewed: false, selected: [] });
                    }}
                  >
                    <ActionLabel icon="retry">Try again</ActionLabel>
                  </button>
                ) : null}
                {draft.reviewed ? (
                  <button
                    type="button"
                    className={`j-btn ${correct ? "is-go" : ""}`}
                    onClick={next}
                  >
                    <ActionLabel>
                      {last ? "See your summary" : "Next paper"}
                    </ActionLabel>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="j-btn"
                    disabled={!draft.selected.length}
                    onClick={check}
                  >
                    <ActionLabel icon="check">Check</ActionLabel>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function PilotComplete({
  state,
  heading,
  onOpen,
  onRestart,
}: {
  state: PilotState;
  heading: RefObject<HTMLHeadingElement | null>;
  onOpen: (id: string) => void;
  onRestart: () => void;
}) {
  const motion = useSceneMotion();
  const first = activityPilot.filter(
    (paper) => state.drafts[paper.id]?.firstCorrect,
  ).length;
  const allChecked = activityPilot.every(
    (paper) => state.drafts[paper.id]?.reviewed,
  );
  return (
    <section className="pilot-complete">
      <Mascot pose="celebrating" />
      <span className="journey-kicker">Activities complete</span>
      <h1 ref={heading} tabIndex={-1}>
        {allChecked
          ? "You read three kinds of evidence."
          : "Your activity summary"}
      </h1>
      <p className="pilot-complete-lede">
        {first} of {activityPilot.length} interpretations fit on the first
        check.
      </p>
      <ol className="pilot-summary">
        {activityPilot.map((paper, i) => {
          const draft = state.drafts[paper.id];
          const ok = draft?.firstCorrect === true;
          const checked = !!draft?.reviewed;
          return (
            <m.li
              key={paper.id}
              className={ok ? "is-first" : checked ? "is-revised" : "is-open"}
              initial={motion.still ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                motion.still
                  ? { duration: 0 }
                  : { delay: 0.1 * i, duration: 0.3 }
              }
            >
              <span className="pilot-summary-mark" aria-hidden="true">
                <Icon
                  name={ok ? "check" : checked ? "retry" : "search"}
                  size={16}
                  strong
                />
              </span>
              <span>
                <strong>{paper.label}</strong>
                <small>
                  {ok
                    ? "Fit on the first check"
                    : checked
                      ? "Needed another look"
                      : "Not checked yet"}
                </small>
              </span>
              <button
                type="button"
                className="text-link"
                onClick={() => onOpen(paper.id)}
              >
                Review<span className="sr-only"> {paper.label}</span>
              </button>
            </m.li>
          );
        })}
      </ol>
      <div className="quest-takeaway pilot-takeaway">
        <span>Takeaway</span>
        <p>
          Experiments compare assigned groups, observational studies show
          associations, and interviews describe experiences in context. Each
          supports a different kind of claim.
        </p>
      </div>
      <div className="pilot-complete-actions">
        <button type="button" className="j-btn is-quiet" onClick={onRestart}>
          <ActionLabel icon="retry">Start over</ActionLabel>
        </button>
        <Link className="j-btn" href="/learn">
          <ActionLabel>Back to studies</ActionLabel>
        </Link>
      </div>
    </section>
  );
}
