import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { animate } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown, Lightbulb } from "lucide-react";
import {
  AnimatePresence,
  PresenceBlock,
  SceneTransition,
  m,
  useSceneMotion,
} from "../scenes/scene-motion.js";
import { ResponseChoices, type ChoiceMark } from "./ResponseChoices.js";

/**
 * Intro data for an uploaded paper. Everything shown is authored copy, stage
 * names or the learner's own words, so nothing can name the paper or hint at
 * its findings.
 */
export type IntroOrientation = {
  /** Each main challenge's stage, in order, from the server. */
  stages: string[];
  bonus: boolean;
  prediction: string;
  onPrediction: (text: string) => void;
};

const hunches = [
  {
    id: "cause",
    text: "One thing causes another",
    saved: "It will show that one thing causes another.",
  },
  {
    id: "link",
    text: "Two things go together",
    saved: "It will show that two things go together.",
  },
  {
    id: "describe",
    text: "What a group is like",
    saved: "It will describe what a group is like.",
  },
  { id: "unsure", text: "Not sure yet", saved: "I wasn’t sure yet." },
];

type Group = "design" | "results" | "interpretation" | "bonus";
const groups: { id: Group; label: string; line: string }[] = [
  {
    id: "design",
    label: "Design",
    line: "How the study was set up: who took part, what was compared and what was measured.",
  },
  {
    id: "results",
    label: "Results",
    line: "What the study found, opened one piece at a time as you reach it.",
  },
  {
    id: "interpretation",
    label: "Meaning",
    line: "What the study can and cannot claim from those results.",
  },
  {
    id: "bonus",
    label: "Bonus",
    line: "One optional extra challenge after the main decisions.",
  },
];
const groupOf = (stage: string): Group =>
  stage === "significance" || stage === "results"
    ? "results"
    : stage === "interpretation"
      ? "interpretation"
      : "design";

const practice = {
  prompt: "When is the paper revealed?",
  options: [
    { id: "before", text: "Before the first decision" },
    { id: "after", text: "After your last decision" },
    { id: "never", text: "Never, it stays hidden" },
  ],
  answer: "after",
};

const steps = ["Your hunch", "Your route", "Practice"];

/** Three short steps that replace reading the rules with doing them. */
export function StudyOrientation({
  orientation,
  busy,
  onBegin,
}: {
  orientation: IntroOrientation;
  busy: boolean;
  onBegin: () => void;
}) {
  const motion = useSceneMotion();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    // Focus follows the learner's Next or Back, never the first paint.
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step]);
  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };
  return (
    <section className="orient" aria-label="Before you begin">
      <div className="orient-head">
        <ol className="orient-steps" aria-label="Steps before you begin">
          {steps.map((label, i) => (
            <li
              key={label}
              className={i === step ? "is-current" : i < step ? "is-done" : ""}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="sr-only">
                Step {i + 1} of {steps.length}: {label}
              </span>
            </li>
          ))}
        </ol>
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="journey-skip orient-skip"
            disabled={busy}
            onClick={onBegin}
          >
            Skip to study
          </button>
        ) : null}
      </div>
      <SceneTransition identity={String(step)}>
        {step === 0 ? (
          <Hunch orientation={orientation} heading={heading} />
        ) : step === 1 ? (
          <Route orientation={orientation} heading={heading} />
        ) : (
          <Practice heading={heading} />
        )}
      </SceneTransition>
      <div className="orient-nav">
        {step > 0 ? (
          <button
            type="button"
            className="journey-skip"
            onClick={() => go(step - 1)}
          >
            <ArrowLeft size={16} strokeWidth={2.5} aria-hidden="true" /> Back
          </button>
        ) : null}
        {step < steps.length - 1 ? (
          <m.button
            type="button"
            className="journey-begin orient-next"
            data-scene-motion-control
            style={{ borderRadius: 16 }}
            {...motion.gestures()}
            onClick={() => go(step + 1)}
          >
            Next <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </m.button>
        ) : (
          <m.button
            type="button"
            className="journey-begin orient-next"
            data-scene-motion-control
            style={{ borderRadius: 16 }}
            {...motion.gestures(busy)}
            disabled={busy}
            onClick={onBegin}
          >
            Begin study{" "}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </m.button>
        )}
      </div>
    </section>
  );
}

type StepProps = { heading: RefObject<HTMLHeadingElement | null> };

function Hunch({
  orientation,
  heading,
}: StepProps & { orientation: IntroOrientation }) {
  const motion = useSceneMotion();
  const { prediction, onPrediction } = orientation;
  const chosen = hunches.find((h) => h.saved === prediction)?.id;
  // A free-text prediction from the preparation warm-up is kept unless replaced.
  const [replacing, setReplacing] = useState(false);
  const [saved, setSaved] = useState(false);
  const written = !!prediction.trim() && !chosen;
  return (
    <div className="orient-step">
      <h2 ref={heading} tabIndex={-1}>
        First, your hunch. What will this study be able to show?
      </h2>
      {written && !replacing ? (
        <div className="orient-note">
          <Lightbulb size={18} aria-hidden="true" />
          <div>
            <strong>Your prediction from the warm-up</strong>
            <p>“{prediction}”</p>
            <button
              type="button"
              className="journey-skip"
              onClick={() => setReplacing(true)}
            >
              Pick a new one
            </button>
          </div>
        </div>
      ) : (
        <ResponseChoices
          name="orient-hunch"
          options={hunches}
          multiple={false}
          selected={chosen ? [chosen] : []}
          disabled={false}
          marks={{}}
          pills
          onChange={([id]) => {
            const hunch = hunches.find((h) => h.id === id);
            if (!hunch) return;
            onPrediction(hunch.saved);
            setSaved(true);
          }}
        />
      )}
      <p className="orient-status" role="status">
        <AnimatePresence initial={false} mode="popLayout">
          {saved ? (
            <m.span
              key={prediction}
              data-scene-settle
              initial={motion.enter}
              animate={{ opacity: 1, y: 0 }}
              transition={motion.copy}
            >
              Saved for the paper reveal.
            </m.span>
          ) : null}
        </AnimatePresence>
      </p>
    </div>
  );
}

function Route({
  orientation,
  heading,
}: StepProps & { orientation: IntroOrientation }) {
  const motion = useSceneMotion();
  const id = useId();
  const [open, setOpen] = useState<Group | null>(null);
  const dots: Group[] = [
    ...orientation.stages.map(groupOf),
    ...(orientation.bonus ? (["bonus"] as const) : []),
  ];
  const present = groups.filter((g) => dots.includes(g.id));
  const entering = motion.canEnter();
  return (
    <div className="orient-step">
      <h2 ref={heading} tabIndex={-1}>
        Your route: {orientation.stages.length} decisions
        {orientation.bonus ? " and a bonus" : ""}
      </h2>
      <div className="orient-track" aria-hidden="true">
        {dots.map((group, i) => (
          <m.span
            key={i}
            data-scene-settle
            className={`orient-dot is-${group} ${open === group ? "is-lit" : ""}`}
            initial={entering ? { opacity: 0, scale: 0.4 } : false}
            animate={{ opacity: 1, scale: open === group ? 1.25 : 1 }}
            transition={
              motion.still
                ? { duration: 0 }
                : { ...motion.copy, delay: entering ? motion.stagger(i) : 0 }
            }
          />
        ))}
      </div>
      <p className="orient-hint">
        Tap a stage to see what you’ll decide there.
      </p>
      <ul className="orient-stages">
        {present.map((group) => {
          const count = dots.filter((d) => d === group.id).length;
          const expanded = open === group.id;
          return (
            <li key={group.id}>
              <m.button
                type="button"
                className={`orient-stage is-${group.id}`}
                data-scene-motion-control
                style={{ borderRadius: 14 }}
                aria-expanded={expanded}
                aria-controls={`${id}-${group.id}`}
                {...motion.gestures()}
                onClick={() => setOpen(expanded ? null : group.id)}
              >
                <span className={`orient-swatch is-${group.id}`} />
                {group.label}
                <span className="orient-count">{count}</span>
                <m.span
                  className="orient-chevron"
                  data-scene-settle
                  data-scene-rotate={expanded ? 180 : 0}
                  aria-hidden="true"
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={motion.copy}
                >
                  <ChevronDown size={16} />
                </m.span>
              </m.button>
              <AnimatePresence initial={false} mode="popLayout">
                {expanded ? (
                  <PresenceBlock
                    key="line"
                    id={`${id}-${group.id}`}
                    className="orient-stage-line"
                    initial={motion.enter}
                    animate={{ opacity: 1, y: 0 }}
                    exit={motion.exit}
                    transition={motion.copy}
                  >
                    {group.line}
                  </PresenceBlock>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Practice({ heading }: StepProps) {
  const motion = useSceneMotion();
  const shake = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [tries, setTries] = useState<string[]>([]);
  const solved = tries.at(-1) === practice.answer;
  const explained = !solved && tries.length >= 2;
  const retrying = !solved && tries.length === 1 && selected.length === 0;
  const done = solved || explained;
  const marks: Record<string, ChoiceMark> = {};
  if (done) {
    for (const t of tries) if (t !== practice.answer) marks[t] = "missed";
    marks[practice.answer] = "best";
  } else if (tries.length === 1) marks[tries[0]!] = "tried";
  const check = () => {
    const pick = selected[0];
    if (!pick) return;
    setTries((t) => [...t, pick]);
    if (pick !== practice.answer) {
      if (tries.length === 0) setSelected([]);
      if (shake.current && !motion.still)
        animate(shake.current, { x: [0, -7, 7, -4, 4, 0] }, { duration: 0.32 });
    }
  };
  return (
    <div className="orient-step">
      <h2 ref={heading} tabIndex={-1}>
        Practice one. You get a retry.
      </h2>
      <p className="orient-question">{practice.prompt}</p>
      <div
        ref={shake}
        data-scene-settle
        className={
          solved ? "status-solved" : explained ? "status-explained" : ""
        }
      >
        <ResponseChoices
          name="orient-practice"
          options={practice.options}
          multiple={false}
          selected={done ? [practice.answer] : selected}
          disabled={done}
          marks={marks}
          pills={false}
          onChange={setSelected}
        />
      </div>
      {!done ? (
        <m.button
          type="button"
          className="journey-skip orient-check"
          data-scene-motion-control
          {...motion.gestures(!selected.length)}
          disabled={!selected.length}
          onClick={check}
        >
          Check
        </m.button>
      ) : null}
      <div className="orient-feedback" role="status">
        {retrying ? (
          <p className="is-retry">Not quite. You have one retry.</p>
        ) : solved ? (
          <p className="is-solved">
            <m.span
              className="orient-points"
              initial={motion.canEnter() ? { opacity: 0, scale: 0.6 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                motion.still
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.4, bounce: 0.4 }
              }
            >
              +10
            </m.span>
            Right. Each challenge you solve earns 10 points.
          </p>
        ) : explained ? (
          <p className="is-explained">
            The paper opens after your last decision. Miss twice and I’ll
            explain.
          </p>
        ) : null}
      </div>
    </div>
  );
}
