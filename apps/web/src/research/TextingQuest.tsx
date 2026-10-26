import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { animate, useMotionValue } from "motion/react";
import { ActionLabel, Icon } from "./icon.js";
import { Mascot } from "./learning-ui.js";
import { ResearchLink as Link } from "./navigation.js";
import {
  AnimatePresence,
  SceneMotion,
  m,
  useSceneMotion,
} from "./scenes/scene-motion.js";
import {
  feedbackFor,
  questSource,
  textingQuest,
  type QuestScreen,
  type QuestVisual,
} from "./texting-quest.js";
import {
  DistributionVisual,
  FrameVisual,
  GroupsVisual,
  InspectVisual,
  InstrumentsVisual,
  PlansVisual,
  SampleVisual,
  ScopeVisual,
} from "./quest-visuals.js";
import "./quest.css";

type Choice = Extract<QuestScreen, { kind: "choice" }>;
type Phase = "answering" | "retry" | "correct" | "explained";
// `solved` marks a decision answered correctly on retry, so a refresh
// reopens it as correct rather than as the shown explanation.
type Record_ = { firstCorrect: boolean; revised: boolean; solved?: boolean };
type Prediction = "Text lower" | "About the same" | "No text lower";
const predictions: Prediction[] = [
  "Text lower",
  "About the same",
  "No text lower",
];
type Exploration = { prediction?: Prediction; revealed?: boolean };

const STORAGE = "gradly-texting-quest";
const EMPTY_EXPLORATION: Exploration = {};

function restore(id: string) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(`${STORAGE}:${id}`) ?? "");
    if (
      Number.isInteger(saved?.index) &&
      saved.index >= 0 &&
      saved.index < textingQuest.length &&
      saved.records
    )
      return saved as {
        index: number;
        records: Record<string, Record_>;
        exploration?: Exploration;
      };
  } catch {
    /* A fresh start is always safe. */
  }
  return { index: 0, records: {} as Record<string, Record_> };
}

/**
 * The sample quest, one task per screen. Answers are checked against the
 * script's authored key in the browser; no AI is called and nothing here is
 * an assessment of the learner's own paper.
 */
export function TextingQuest(props: {
  sessionKey: string;
  reduced: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <SceneMotion reduced={props.reduced}>
      <Quest {...props} />
    </SceneMotion>
  );
}

function Quest({
  sessionKey,
  heading,
}: {
  sessionKey: string;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  const motion = useSceneMotion();
  const root = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  // Set when a decision changes phase, so focus follows the replaced controls.
  const refocus = useRef(false);
  const [{ index, records, exploration = EMPTY_EXPLORATION }, setProgress] =
    useState(() => restore(sessionKey));
  // A refresh reopens a resolved decision as resolved, not as a blank retry.
  const [resumed] = useState(() => {
    const saved = textingQuest[index];
    const done = saved?.kind === "choice" ? records[saved.id] : undefined;
    return saved?.kind === "choice" &&
      done &&
      (done.firstCorrect || done.revised)
      ? {
          selected: saved.correct,
          phase: (done.firstCorrect || done.solved
            ? "correct"
            : "explained") as Phase,
          message: saved.feedback.correct,
        }
      : { selected: [] as string[], phase: "answering" as Phase, message: "" };
  });
  const [selected, setSelected] = useState<string[]>(resumed.selected);
  const [phase, setPhase] = useState<Phase>(resumed.phase);
  const [message, setMessage] = useState(resumed.message);
  const [hint, setHint] = useState(false);
  const [variation, setVariation] = useState(
    () =>
      textingQuest[index]?.kind === "choice" &&
      textingQuest[index]?.id === "variation" &&
      (resumed.phase === "correct" || resumed.phase === "explained"),
  );
  // Keep unfinished answers and feedback when visiting an earlier screen.
  const visits = useRef<
    Record<
      string,
      {
        selected: string[];
        phase: Phase;
        message: string;
        hint: boolean;
        variation: boolean;
      }
    >
  >({});
  const screen = textingQuest[index]!;
  const predicting =
    screen.id === "results" &&
    !exploration.revealed &&
    phase !== "correct" &&
    phase !== "explained";
  const revealResults = () => {
    if (!exploration.prediction) return;
    setProgress((p) => ({
      ...p,
      exploration: { ...p.exploration, revealed: true },
    }));
    heading.current?.focus({ preventScroll: true });
  };
  const total = textingQuest.length - 1;
  useEffect(() => {
    try {
      sessionStorage.setItem(
        `${STORAGE}:${sessionKey}`,
        JSON.stringify({ index, records, exploration }),
      );
    } catch {
      /* Progress still works for this visit. */
    }
  }, [index, records, exploration, sessionKey]);
  // The previous screen is removed immediately. Focus the new heading after
  // its DOM has committed, independently of the presentation's entrance.
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [screen.id, heading]);
  const goTo = (next: number, reset = false) => {
    refocus.current = false;
    if (reset) visits.current = {};
    else
      visits.current[screen.id] = { selected, phase, message, hint, variation };
    const target = textingQuest[next]!;
    const visited = visits.current[target.id];
    const done =
      !reset && target.kind === "choice" ? records[target.id] : undefined;
    const resolved = done && (done.firstCorrect || done.revised);
    setProgress((p) => ({ ...p, index: next }));
    setSelected(
      visited?.selected ??
        (resolved && target.kind === "choice" ? target.correct : []),
    );
    setPhase(
      visited?.phase ??
        (resolved
          ? done.firstCorrect || done.solved
            ? "correct"
            : "explained"
          : "answering"),
    );
    setMessage(
      visited?.message ??
        (resolved && target.kind === "choice" ? target.feedback.correct : ""),
    );
    setHint(visited?.hint ?? false);
    setVariation(
      visited?.variation ?? (target.id === "variation" && !!resolved),
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const advance = () => goTo(Math.min(index + 1, textingQuest.length - 1));
  const record = (id: string, value: Record_) =>
    setProgress((p) => ({ ...p, records: { ...p.records, [id]: value } }));
  const check = () => {
    if (screen.kind !== "choice" || predicting || !selected.length) return;
    const result = feedbackFor(screen, selected);
    refocus.current = true;
    setMessage(result.message);
    if (result.correct) {
      setPhase("correct");
      if (!records[screen.id])
        record(screen.id, {
          firstCorrect: phase === "answering",
          revised: false,
        });
      else
        record(screen.id, {
          ...records[screen.id]!,
          revised: true,
          solved: true,
        });
      return;
    }
    // One retry, then the reviewed explanation.
    if (!records[screen.id]) {
      setPhase("retry");
      record(screen.id, { firstCorrect: false, revised: false });
    } else explain();
  };
  const explain = () => {
    if (screen.kind !== "choice") return;
    refocus.current = true;
    setSelected(screen.correct);
    setMessage(screen.feedback.correct);
    setPhase("explained");
    record(screen.id, {
      firstCorrect: records[screen.id]?.firstCorrect ?? false,
      revised: true,
    });
  };
  const tryAgain = () => {
    refocus.current = true;
    setSelected([]);
    setPhase("answering");
    setMessage("");
  };
  // Check, Try again and Show explanation unmount the pressed button: move
  // focus to the feedback, or to the first option for another attempt.
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    if (phase === "answering")
      root.current
        ?.querySelector<HTMLInputElement>(".quest-screen .quest-options input")
        ?.focus({ preventScroll: true });
    else feedback.current?.focus({ preventScroll: true });
  }, [phase]);
  // Lesson-app keys: A/B/C or 1/2/3 choose, Enter checks, then continues.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat)
        return;
      // Keys belong to the quest only while focus is inside it (the screen
      // heading receives focus on each screen) or nowhere in particular.
      const active = document.activeElement;
      if (active && active !== document.body && !root.current?.contains(active))
        return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input[type=range], textarea, select, [contenteditable]",
        )
      )
        return;
      if (predicting) {
        if (event.key === "Enter") {
          if (target?.closest("button, a, summary")) return;
          event.preventDefault();
          revealResults();
          return;
        }
        if (event.key.length !== 1) return;
        const key = event.key.toUpperCase();
        const choice =
          predictions[
            /[1-9]/.test(key) ? Number(key) - 1 : key.charCodeAt(0) - 65
          ];
        if (choice) {
          event.preventDefault();
          setProgress((p) => ({
            ...p,
            exploration: { ...p.exploration, prediction: choice },
          }));
        }
        return;
      }
      if (event.key === "Enter") {
        // A focused button or link already handles Enter natively.
        if (target?.closest("button, a, summary")) return;
        event.preventDefault();
        if (screen.kind === "story") advance();
        else if (screen.kind === "choice") {
          if (phase === "answering") check();
          else if (phase === "retry") tryAgain();
          else advance();
        }
        return;
      }
      if (screen.kind !== "choice" || event.key.length !== 1) return;
      const key = event.key.toUpperCase();
      const index = /[1-9]/.test(key)
        ? Number(key) - 1
        : key.charCodeAt(0) - 65;
      const option = screen.options[index];
      if (option && (phase === "answering" || phase === "retry")) {
        event.preventDefault();
        toggle(option.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const toggle = (id: string) => {
    if (screen.kind !== "choice") return;
    if (phase === "correct" || phase === "explained") return;
    if (phase === "retry") {
      setPhase("answering");
      setMessage("");
    }
    setSelected((current) =>
      screen.correct.length > 1
        ? current.includes(id)
          ? current.filter((x) => x !== id)
          : [...current, id]
        : [id],
    );
  };
  const progress = Math.min(index, total) / total;
  return (
    <div className="journey quest" ref={root}>
      <div className="quest-top">
        <div
          className="quest-progress"
          role="progressbar"
          aria-label="Quest progress"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={Math.min(index, total)}
        >
          <m.span
            initial={false}
            animate={{ scaleX: Math.max(progress, 0.02) }}
            transition={motion.still ? { duration: 0 } : { duration: 0.3 }}
          />
        </div>
        <span className="quest-stage">{screen.stage}</span>
      </div>
      <m.section
        key={screen.id}
        className="quest-screen"
        data-scene-settle
        initial={motion.enter}
        animate={{ opacity: 1, y: 0 }}
        transition={motion.copy}
      >
        {screen.kind === "story" ? (
          <Story screen={screen} heading={heading} />
        ) : null}
        {screen.kind === "choice" ? (
          <ChoiceScreen
            screen={screen}
            heading={heading}
            predicting={predicting}
            prediction={exploration.prediction}
            onPrediction={(prediction) =>
              setProgress((p) => ({
                ...p,
                exploration: { ...p.exploration, prediction },
              }))
            }
            selected={selected}
            phase={phase}
            hint={hint}
            variation={variation}
            onVariation={() => setVariation(true)}
            onToggle={toggle}
          />
        ) : null}
        {screen.kind === "complete" ? (
          <Complete
            records={records}
            heading={heading}
            onRestart={() => {
              setProgress({ index: 0, records: {} });
              goTo(0, true);
            }}
          />
        ) : null}
      </m.section>

      {screen.kind !== "complete" ? (
        <div
          className={`journey-actions quest-bar ${
            phase === "correct"
              ? "is-correct"
              : phase === "retry" || phase === "explained"
                ? "is-review"
                : ""
          }`}
        >
          <div className="journey-actions-inner">
            {screen.kind === "choice" && phase !== "answering" ? (
              <m.div
                ref={feedback}
                tabIndex={-1}
                className="quest-feedback"
                role="status"
                initial={motion.still ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={motion.still ? { duration: 0 } : { duration: 0.25 }}
              >
                <strong>
                  <Icon
                    name={phase === "correct" ? "check" : "search"}
                    size={18}
                    strong
                  />
                  {phase === "correct"
                    ? "Nicely reasoned!"
                    : phase === "retry"
                      ? "Take another look."
                      : "Let’s work through it."}
                </strong>
                <p>{message}</p>
              </m.div>
            ) : screen.kind === "choice" ? (
              <button
                className={`quest-help ${hint ? "is-on" : ""}`}
                aria-expanded={hint}
                onClick={() => setHint((h) => !h)}
              >
                <Icon name="sparkle" size={17} /> Help
              </button>
            ) : (
              <p>
                <Icon name="shield" size={16} />
                Sample quest · authored from the paper. No AI is called.
              </p>
            )}
            <div className="journey-actions-buttons">
              {index > 0 ? (
                <button
                  className="j-btn is-quiet"
                  onClick={() => goTo(index - 1)}
                >
                  <Icon name="back" size={18} /> Back
                </button>
              ) : null}
              {screen.kind === "story" ? (
                <>
                  {screen.skip ? (
                    <button
                      className="j-btn is-quiet"
                      onClick={() =>
                        goTo(
                          textingQuest.findIndex(
                            (s) => s.id === screen.skip!.to,
                          ),
                        )
                      }
                    >
                      {screen.skip.label}
                    </button>
                  ) : null}
                  <button className="j-btn" onClick={advance}>
                    <ActionLabel>{screen.button}</ActionLabel>
                  </button>
                </>
              ) : null}
              {screen.kind === "choice" && predicting ? (
                <button
                  className="j-btn"
                  disabled={!exploration.prediction}
                  onClick={revealResults}
                >
                  <ActionLabel>Reveal reported means</ActionLabel>
                </button>
              ) : screen.kind === "choice" && phase === "answering" ? (
                <button
                  className="j-btn"
                  disabled={!selected.length}
                  onClick={check}
                >
                  <ActionLabel icon="check">Check</ActionLabel>
                </button>
              ) : null}
              {screen.kind === "choice" && phase === "retry" ? (
                <>
                  <button className="j-btn is-quiet" onClick={explain}>
                    Show explanation
                  </button>
                  <button className="j-btn" onClick={tryAgain}>
                    <ActionLabel icon="retry">Try again</ActionLabel>
                  </button>
                </>
              ) : null}
              {screen.kind === "choice" &&
              (phase === "correct" || phase === "explained") ? (
                <button className="j-btn is-go" onClick={advance}>
                  <ActionLabel>{screen.continueLabel}</ActionLabel>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Title({
  heading,
  children,
}: {
  heading: RefObject<HTMLHeadingElement | null>;
  children: React.ReactNode;
}) {
  return (
    <h1 className="quest-heading" ref={heading} tabIndex={-1}>
      {children}
    </h1>
  );
}

function Story({
  screen,
  heading,
}: {
  screen: Extract<QuestScreen, { kind: "story" }>;
  heading: RefObject<HTMLHeadingElement | null>;
}) {
  const motion = useSceneMotion();
  return (
    <div className={`quest-story ${screen.visual ? "has-visual" : ""}`}>
      <div>
        <Title heading={heading}>{screen.heading}</Title>
        {screen.source ? (
          <p className="quest-briefing-source">{screen.source}</p>
        ) : null}
        {screen.paragraphs.map((p, i) => (
          <m.p
            key={i}
            className={p.label ? "has-label" : ""}
            initial={motion.still ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              motion.still
                ? { duration: 0 }
                : { delay: 0.08 + i * 0.07, duration: 0.3 }
            }
          >
            {p.label ? <span>{p.label}</span> : null}
            {p.text}
          </m.p>
        ))}
      </div>
      {screen.visual ? <Visual kind={screen.visual} /> : null}
    </div>
  );
}

function ChoiceScreen({
  screen,
  heading,
  selected,
  phase,
  hint,
  variation,
  onVariation,
  onToggle,
  predicting,
  prediction,
  onPrediction,
}: {
  screen: Choice;
  predicting: boolean;
  prediction?: Prediction;
  onPrediction: (prediction: Prediction) => void;
  heading: RefObject<HTMLHeadingElement | null>;
  selected: string[];
  phase: Phase;
  hint: boolean;
  variation: boolean;
  onVariation: () => void;
  onToggle: (id: string) => void;
}) {
  const motion = useSceneMotion();
  const done = phase === "correct" || phase === "explained";
  const multiple = screen.correct.length > 1;
  return (
    <div className={`quest-choice${screen.visual ? " has-visual" : ""}`}>
      {screen.label ? <p className="quest-label">{screen.label}</p> : null}
      <div className="quest-ask">
        <Mascot small pose={done ? "celebrating" : "thinking"} />
        <div>
          <Title heading={heading}>{screen.heading}</Title>
          {screen.evidence && screen.id !== "results" ? (
            <p className="quest-evidence">{screen.evidence}</p>
          ) : null}
        </div>
      </div>
      {screen.id === "results" ? (
        <ResultsChart
          variation={false}
          hidden={predicting}
          resolved={done}
          compareEnabled
        />
      ) : screen.visual ? (
        <Visual
          // A follow-up visual takes the same place, so nothing moves below
          // the fold after checking.
          kind={done && screen.afterVisual ? screen.afterVisual : screen.visual}
          resolved={done}
          selected={selected}
          variation={variation}
          onVariation={onVariation}
        />
      ) : null}
      <AnimatePresence initial={false}>
        {hint && !done ? (
          <m.p
            className="quest-hint"
            initial={motion.still ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={motion.still ? { duration: 0 } : { duration: 0.2 }}
          >
            <strong>A clue from the study</strong>{" "}
            {predicting
              ? "Think about dividing attention during a lecture. You can explore the reported scores after making any prediction."
              : screen.hint}
          </m.p>
        ) : null}
      </AnimatePresence>
      {predicting ? (
        <fieldset className="quest-options quest-prediction">
          <legend>Before seeing the scores, what do you expect?</legend>
          <p className="quest-prediction-note">
            Your prediction is ungraded. The paper may surprise you.
          </p>
          {predictions.map((value, i) => (
            <m.label
              key={value}
              className={`quest-option ${prediction === value ? "is-selected" : ""}`}
              data-scene-motion-control
              initial={false}
              {...motion.gestures(false)}
            >
              <input
                type="radio"
                name="quest-prediction"
                checked={prediction === value}
                onChange={() => onPrediction(value)}
              />
              <span className="quest-key" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="quest-option-text">{value}</span>
            </m.label>
          ))}
        </fieldset>
      ) : (
        <fieldset className="quest-options" disabled={done}>
          <legend>
            {screen.instruction}
            {multiple ? <span> Select all that apply.</span> : null}
          </legend>
          {screen.id === "results" && prediction ? (
            <p className="quest-prediction-note" role="status">
              You predicted: {prediction}. Now compare the reported means.
            </p>
          ) : null}
          {screen.options.map((option) => {
            const active = selected.includes(option.id);
            const right = done && screen.correct.includes(option.id);
            const wrong = phase === "retry" && active;
            return (
              <m.label
                key={option.id}
                className={`quest-option ${active ? "is-selected" : ""} ${right ? "is-right" : ""} ${wrong ? "is-wrong" : ""}`}
                data-scene-motion-control
                initial={false}
                {...motion.gestures(done)}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={`quest-${screen.id}`}
                  value={option.id}
                  checked={active}
                  onChange={() => onToggle(option.id)}
                />
                <span className="quest-key" aria-hidden="true">
                  {right ? <Icon name="check" size={15} strong /> : option.id}
                </span>
                <span className="quest-option-text">{option.text}</span>
              </m.label>
            );
          })}
        </fieldset>
      )}
    </div>
  );
}

function Complete({
  records,
  heading,
  onRestart,
}: {
  records: Record<string, Record_>;
  heading: RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
}) {
  const motion = useSceneMotion();
  const [review, setReview] = useState(false);
  const decisions = textingQuest.filter(
    (s): s is Choice => s.kind === "choice" && (!s.optional || !!records[s.id]),
  );
  const first = decisions.filter((s) => records[s.id]?.firstCorrect).length;
  const revised = decisions.length - first;
  const share = decisions.length ? first / decisions.length : 0;
  const ring = 2 * Math.PI * 52;
  const mood =
    share >= 0.8
      ? "Sharp research instincts."
      : share >= 0.5
        ? "Solid reasoning, with a few to revisit."
        : "Every revision is practice. Review the ones that tripped you up.";
  return (
    <div className="quest-complete">
      <Mascot pose="celebrating" />
      <span className="journey-kicker">Quest complete</span>
      <Title heading={heading}>You investigated the distracted student.</Title>
      <p className="quest-lede">{mood}</p>

      <div className="quest-score">
        <svg viewBox="0 0 120 120" className="quest-ring" aria-hidden="true">
          <circle cx="60" cy="60" r="52" className="track" />
          <m.circle
            cx="60"
            cy="60"
            r="52"
            className="fill"
            strokeDasharray={ring}
            initial={motion.still ? false : { strokeDashoffset: ring }}
            animate={{ strokeDashoffset: ring * (1 - share) }}
            transition={
              motion.still
                ? { duration: 0 }
                : { delay: 0.2, duration: 0.9, ease: "easeOut" }
            }
          />
        </svg>
        <div className="quest-score-text">
          <strong>
            {first}/{decisions.length}
          </strong>
          <span>right first try</span>
        </div>
      </div>

      <ol className="quest-path" aria-label="Your decisions in order">
        {decisions.map((s, i) => {
          const ok = records[s.id]?.firstCorrect;
          return (
            <m.li
              key={s.id}
              className={ok ? "is-first" : "is-revised"}
              initial={motion.still ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                motion.still
                  ? { duration: 0 }
                  : {
                      delay: 0.3 + i * 0.06,
                      type: "spring",
                      duration: 0.4,
                      bounce: 0.35,
                    }
              }
            >
              <span className="quest-path-badge">
                <Icon name={ok ? "check" : "retry"} size={16} strong />
              </span>
              <span className="quest-path-label">{s.short}</span>
              <span className="sr-only">
                {ok ? " right first try" : " revised"}
              </span>
            </m.li>
          );
        })}
      </ol>
      <p className="quest-path-legend" aria-hidden="true">
        <span className="is-first">
          <Icon name="check" size={13} strong /> First try
        </span>
        <span className="is-revised">
          <Icon name="retry" size={13} strong /> Needed another look ({revised})
        </span>
      </p>

      <div className="quest-takeaway">
        <span>Takeaway</span>A statistical result gains meaning from the
        question, design, and measurement behind it.
      </div>

      <div className="quest-complete-actions">
        <button
          className="j-btn is-quiet"
          aria-expanded={review}
          onClick={() => setReview((open) => !open)}
        >
          {review ? "Hide my answers" : "Review my answers"}
        </button>
        <button className="j-btn is-quiet" onClick={onRestart}>
          <ActionLabel icon="retry">Play again</ActionLabel>
        </button>
        <Link className="j-btn" href="/learn">
          <ActionLabel>Try another quest</ActionLabel>
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {review ? (
          <m.ol
            className="quest-review"
            initial={motion.still ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={motion.still ? { duration: 0 } : { duration: 0.25 }}
          >
            {decisions.map((s) => (
              <li
                key={s.id}
                className={
                  records[s.id]?.firstCorrect ? "is-first" : "is-revised"
                }
              >
                <strong>{s.short}</strong>
                <span>
                  Answer:{" "}
                  {s.options
                    .filter((o) => s.correct.includes(o.id))
                    .map((o) => o.text)
                    .join(" · ")}
                </span>
                <p>{s.feedback.correct}</p>
              </li>
            ))}
          </m.ol>
        ) : null}
      </AnimatePresence>

      <p className="quest-about">
        You explored Experiment 2’s quiz comparison.{" "}
        <a
          href={`https://doi.org/${questSource.doi}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the paper<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        · Completion is practice, not certification.
      </p>
    </div>
  );
}

/** Visuals named by the script. Summary values only; no invented data points. */
function Visual({
  kind,
  selected = [],
  variation = false,
  onVariation,
  resolved = false,
}: {
  kind: QuestVisual;
  selected?: string[];
  variation?: boolean;
  onVariation?: () => void;
  resolved?: boolean;
}) {
  const latest = selected[selected.length - 1];
  if (kind === "frame") return <FrameVisual selected={latest} />;
  if (kind === "sample") return <SampleVisual selected={latest} />;
  if (kind === "plans")
    return <PlansVisual selected={latest} resolved={resolved} />;
  if (kind === "instruments") return <InstrumentsVisual selected={latest} />;
  if (kind === "inspect") return <InspectVisual />;
  if (kind === "distribution") return <DistributionVisual />;
  if (kind === "scope") return <ScopeVisual />;
  if (kind === "groups")
    return <GroupsVisual selected={selected.includes("B") ? "B" : latest} />;
  if (kind === "lecture") return <LectureScene />;
  if (kind === "attention") return <AttentionScene />;
  if (kind === "study") return <StudyFlow />;
  if (kind === "results" || kind === "variation")
    return (
      <ResultsChart
        variation={kind === "variation" && variation}
        onVariation={kind === "variation" ? onVariation : undefined}
      />
    );
  if (kind === "evidence")
    return (
      <figure className="quest-figure quest-stat">
        <span>F(1, 54) = 4.33</span>
        <span>p &lt; .05</span>
        <figcaption>
          Test result as given in our study summary, not yet checked against the
          full paper.
        </figcaption>
      </figure>
    );
  if (kind === "reveal") return <Reveal />;
  return <Hypothetical />;
}

function LectureScene() {
  const motion = useSceneMotion();
  return (
    <figure className="quest-figure" aria-hidden="true">
      <svg viewBox="0 0 360 260" className="quest-lecture">
        <rect
          x="30"
          y="20"
          width="210"
          height="122"
          rx="14"
          className="slide"
        />
        <rect
          x="52"
          y="44"
          width="120"
          height="10"
          rx="5"
          className="line strong"
        />
        <rect x="52" y="66" width="160" height="8" rx="4" className="line" />
        <rect x="52" y="84" width="140" height="8" rx="4" className="line" />
        <rect x="52" y="102" width="100" height="8" rx="4" className="line" />
        <rect x="64" y="196" width="160" height="14" rx="7" className="desk" />
        <circle cx="144" cy="172" r="24" className="head" />
        <path d="M106 240 q38 -46 76 0" className="body" />
        <m.g
          initial={motion.still ? false : { rotate: -8 }}
          animate={motion.still ? undefined : { rotate: [-8, 8, -6, 6, 0] }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ originX: "270px", originY: "196px" }}
        >
          <rect
            x="246"
            y="150"
            width="50"
            height="88"
            rx="12"
            className="phone"
          />
          <rect
            x="253"
            y="163"
            width="36"
            height="54"
            rx="6"
            className="screen"
          />
        </m.g>
        {[0, 1].map((i) => (
          <m.rect
            key={i}
            x={262 + i * 14}
            y={104 - i * 30}
            width={i ? 58 : 70}
            height="22"
            rx="11"
            className={i ? "bubble is-reply" : "bubble"}
            initial={motion.still ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.4, duration: 0.25 }}
          />
        ))}
      </svg>
      <figcaption>
        A lecture continues while a phone receives a message.
      </figcaption>
    </figure>
  );
}

function AttentionScene() {
  const [messages, setMessages] = useState(3);
  const phone = Math.min(70, messages * 7);
  return (
    <figure className="quest-figure quest-attention">
      <label>
        <span>
          Messages during a lecture: <strong>{messages}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={10}
          value={messages}
          onChange={(e) => setMessages(Number(e.target.value))}
        />
      </label>
      <div className="quest-attention-bar" aria-hidden="true">
        <span
          className="lecture"
          style={{ transform: `scaleX(${(100 - phone) / 100})` }}
        />
        <span
          className="phone"
          style={{ transform: `scaleX(${phone / 100})` }}
        />
      </div>
      <figcaption>Illustration of divided attention, not a finding.</figcaption>
    </figure>
  );
}

function StudyFlow() {
  const motion = useSceneMotion();
  const steps = [
    "56 undergraduates",
    "Random assignment",
    "Text  ·  No text",
    "Same lecture, taking notes",
    "Quiz on the lecture",
  ];
  return (
    <figure className="quest-figure">
      <ol className="quest-flow">
        {steps.map((step, i) => (
          <m.li
            key={step}
            className={i === 2 ? "is-split" : ""}
            initial={motion.still ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              motion.still
                ? { duration: 0 }
                : { delay: 0.1 + i * 0.12, duration: 0.3 }
            }
          >
            {step}
          </m.li>
        ))}
      </ol>
      <figcaption>The actual study sequence. Results stay hidden.</figcaption>
    </figure>
  );
}

function ResultsChart({
  variation,
  onVariation,
  hidden = false,
  compareEnabled = false,
  resolved = false,
}: {
  resolved?: boolean;
  hidden?: boolean;
  compareEnabled?: boolean;
  variation: boolean;
  onVariation?: () => void;
}) {
  const [comparing, setComparing] = useState(false);
  const bars = [
    { label: "Text", mean: 73.41, sd: 16.95 },
    { label: "No text", mean: 83.0, sd: 17.26 },
  ];
  return (
    <figure className="quest-figure quest-chart">
      <div className="quest-chart-plot" aria-hidden="true">
        <span className="quest-axis-label">Mean quiz score (%)</span>
        <div className="quest-ticks">
          {[100, 75, 50, 25, 0].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="quest-bars">
          {comparing && !hidden ? <span className="quest-mean-gap" /> : null}
          {bars.map((bar, i) => (
            <div key={bar.label} className="quest-col">
              {!hidden ? (
                <>
                  <ChartMark
                    className={`fill ${i === 0 ? "is-text" : ""}`}
                    style={{ height: `${bar.mean}%` }}
                  />
                  <b style={{ bottom: `calc(${bar.mean}% + 8px)` }}>
                    {bar.mean.toFixed(2)}%
                  </b>
                  {variation ? (
                    <ChartMark
                      className="quest-sd"
                      style={{
                        bottom: `${bar.mean - bar.sd}%`,
                        height: `${bar.sd * 2}%`,
                      }}
                    />
                  ) : null}
                </>
              ) : (
                <span className="quest-unrevealed">?</span>
              )}
              <em>{bar.label}</em>
            </div>
          ))}
        </div>
      </div>
      {!hidden ? (
        <p className="sr-only" role="status">
          Reported means: Text 73.41%; No text 83.00%.
        </p>
      ) : null}
      {hidden ? (
        <figcaption>
          Make a prediction, then reveal the paper’s reported means. No scores
          are shown yet.
        </figcaption>
      ) : (
        <>
          {compareEnabled ? (
            <div className="quest-comparison">
              <button
                className="j-btn is-quiet"
                aria-expanded={comparing}
                onClick={() => setComparing((value) => !value)}
              >
                {comparing ? "Hide comparison" : "Compare means"}
              </button>
              {comparing ? (
                <p role="status">
                  {resolved ? (
                    <>
                      <strong>83.00 − 73.41 = 9.59 percentage points.</strong> A
                      difference between group averages; individual scores can
                      differ.
                    </>
                  ) : (
                    <>
                      The bracket marks the gap between the means. Subtract the
                      lower mean from the higher one, then choose an
                      interpretation.
                    </>
                  )}
                </p>
              ) : null}
            </div>
          ) : null}
          {onVariation ? (
            <button
              className="j-btn is-quiet quest-variation"
              disabled={variation}
              onClick={onVariation}
            >
              {variation ? "Showing ±1 standard deviation" : "Show variation"}
            </button>
          ) : null}
          <details className="quest-chart-data">
            <summary>View values as a table</summary>
            <table className="quest-table">
              <caption>Reported quiz scores</caption>
              <thead>
                <tr>
                  <th>Condition</th>
                  <th>Mean</th>
                  {variation ? <th>±1 SD</th> : null}
                </tr>
              </thead>
              <tbody>
                {bars.map((bar) => (
                  <tr key={bar.label}>
                    <td>{bar.label}</td>
                    <td>{bar.mean.toFixed(2)}%</td>
                    {variation ? <td>{bar.sd} points</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          <figcaption>
            {variation
              ? "Reported summary values. Overlapping SD bars are not a significance test."
              : "Reported group means. Individual scores are not shown."}
          </figcaption>
        </>
      )}
    </figure>
  );
}

/** Vertical marks own their motion so a live preference settles scaleY in place. */
function ChartMark({
  className,
  style,
}: {
  className: string;
  style: CSSProperties;
}) {
  const motion = useSceneMotion();
  const scale = useMotionValue(motion.canEnter() ? 0 : 1);
  useLayoutEffect(() => {
    if (motion.still) {
      scale.set(1);
      return;
    }
    const playback = animate(scale, 1, motion.chart);
    return () => playback.stop();
  }, [motion.still, scale]);
  return <m.span className={className} style={{ ...style, scaleY: scale }} />;
}

function Reveal() {
  const rows = [
    ["Design", "Random assignment to text or no-text conditions."],
    ["Analysis", "A one-way between-groups ANOVA."],
    [
      "Finding",
      "The texting group scored lower on the lecture quiz: 73.41% versus 83.00%, p < .05.",
    ],
    [
      "Interpretation",
      "The authors interpreted the findings as evidence that texting during a lecture interferes with learning the material.",
    ],
  ];
  return (
    <figure className="quest-figure quest-reveal">
      <span className="quest-reveal-source">
        {questSource.title} · {questSource.citation}
      </span>
      <dl>
        {rows.map(([term, text]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

function Hypothetical() {
  return (
    <figure className="quest-figure quest-groups is-hypothetical">
      {["Chose to text", "Chose not to text"].map((label) => (
        <div key={label}>
          <strong>{label}</strong>
          <div aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <span>Self-selected, not randomly assigned</span>
        </div>
      ))}
      <figcaption>Hypothetical design change, not the actual study.</figcaption>
    </figure>
  );
}
