import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { activityPilot, pilotScene } from "./activity-pilot.js";
import { FocusBar } from "./FocusBar.js";
import { ResearchLink as Link } from "./navigation.js";
import { readReducedMotion, subscribeReducedMotion } from "./client-state.js";
import {
  InvestigationScene,
  emptySceneDraft,
  type SceneDraft,
} from "./scenes/InvestigationScene.js";
import { SceneMotion, m, useSceneMotion } from "./scenes/scene-motion.js";
import "./activity-pilot.css";

type Draft = {
  selected: string[];
  scene: SceneDraft;
  reviewed: boolean;
  explanation: string;
};
type PilotState = { active: string; drafts: Record<string, Draft> };
const STORAGE = "gradly-activity-pilot:v1";
const fresh = (): Draft => ({
  selected: [],
  scene: { ...emptySceneDraft },
  reviewed: false,
  explanation: "",
});

/** This preview keeps its own tab drafts; it never writes assessed server progress. */
export function restorePilot(raw: string | null): PilotState {
  const initial: PilotState = { active: activityPilot[0]!.id, drafts: {} };
  try {
    const saved = JSON.parse(raw ?? "");
    if (activityPilot.some((paper) => paper.id === saved?.active))
      initial.active = saved.active;
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
  const paper = activityPilot.find(
    (candidate) => candidate.id === state.active,
  )!;
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
    document.title = `${paper.label} · Three-paper pilot · Gradly`;
    return () => {
      document.title = previousTitle;
    };
  }, [paper.id]);
  useEffect(() => {
    if (draft.reviewed) review.current?.focus({ preventScroll: true });
  }, [draft.reviewed]);
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
        steps={["Choose a paper", "Explore evidence"]}
        sample
        onExit={onExit}
      />
      <main id="pilot-main" className="paper-pilot scene-motion-page">
        <nav className="pilot-switcher" aria-label="Choose a study type">
          {activityPilot.map((candidate) => (
            <m.button
              key={candidate.id}
              type="button"
              data-scene-motion-control
              {...motion.gestures()}
              aria-pressed={candidate.id === paper.id}
              onClick={() => {
                setState((s) => ({ ...s, active: candidate.id }));
                window.scrollTo({ top: 0, behavior: "instant" });
              }}
            >
              {candidate.label}
            </m.button>
          ))}
          <span>Authored practice · no points</span>
        </nav>
        <h1 ref={heading} tabIndex={-1}>
          {paper.question}
        </h1>
        <p className="pilot-context">{paper.context}</p>
        {storageFailed ? (
          <p role="status">
            Tab storage is unavailable. Your work stays here until you leave or
            reload.
          </p>
        ) : null}
        <InvestigationScene
          key={paper.id}
          scene={scene}
          options={paper.options}
          multiple={false}
          selected={draft.selected}
          firstSelection={[]}
          disabled={false}
          answered={draft.reviewed}
          reduced={reduced}
          draft={draft.scene}
          onDraft={(scene) => patch({ scene })}
          onSelect={(selected) => patch({ selected, reviewed: false })}
          verdict={
            draft.reviewed ? (correct ? "correct" : "incorrect") : undefined
          }
          responseFooter={
            <div className="pilot-check">
              <m.button
                type="button"
                className="btn primary"
                data-scene-motion-control
                {...motion.gestures(!draft.selected.length || draft.reviewed)}
                disabled={!draft.selected.length || draft.reviewed}
                onClick={() => patch({ reviewed: true })}
              >
                Check interpretation
              </m.button>
              {draft.reviewed ? (
                <div
                  ref={review}
                  tabIndex={-1}
                  role="status"
                  className="pilot-feedback"
                >
                  <strong>
                    {correct
                      ? "That interpretation fits."
                      : "This claim needs a narrower scope."}
                  </strong>
                  <p>{paper.explanation}</p>
                  <span>
                    Prepared teaching feedback · change your choice to try
                    again.
                  </span>
                </div>
              ) : null}
            </div>
          }
        />
        <aside className="pilot-limits">
          <strong>Keep this distinction</strong>
          <p>{paper.limitation}</p>
        </aside>
        <details className="pilot-source" key={`${paper.id}-source`}>
          <summary>Read the source and activity notes</summary>
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
            {paper.source.locator}. Cards are source paraphrases; prompts and
            feedback are authored teaching material.
          </p>
          <p>
            This pilot reuses the learning activity components with three
            prepared papers. It does not generate an activity from an uploaded
            paper or measure learning improvement.
          </p>
        </details>
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
        <footer className="pilot-footer">
          <Link href="/learn">Back to learning paths</Link>
          <button
            type="button"
            className="text-link"
            onClick={() => patch(fresh())}
          >
            Reset this activity
          </button>
        </footer>
      </main>
    </>
  );
}
