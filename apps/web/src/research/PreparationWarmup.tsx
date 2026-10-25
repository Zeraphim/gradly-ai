import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "./scenes/scene-motion.js";
import { readPrediction, warmupCards, writePrediction } from "./warmup.js";

const stepKey = (jobId: string) => `gradly-warmup:${jobId}`;

function readStep(jobId: string) {
  try {
    const step = Number(sessionStorage.getItem(stepKey(jobId)));
    return Number.isInteger(step) && step >= 0 && step <= warmupCards.length
      ? step
      : 0;
  } catch {
    return 0;
  }
}

/**
 * Something to do while agents work: four authored research-habit cards, then
 * an optional prediction about the uploaded paper that comes back at the
 * reveal. Never scored, never sent anywhere, and unrelated to the paper's
 * findings, so it cannot spoil a decision. Leaving it alone changes nothing.
 */
export function PreparationWarmup({ jobId }: { jobId: string }) {
  const motion = useSceneMotion();
  const [step, setStep] = useState(() => readStep(jobId));
  const [choice, setChoice] = useState<string | null>(null);
  const [prediction, setPrediction] = useState(() => readPrediction(jobId));
  const feedback = useRef<HTMLParagraphElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    try {
      sessionStorage.setItem(stepKey(jobId), String(step));
    } catch {}
    // Keep the keyboard in the card after Next, but never steal focus on load.
    if (moved.current) heading.current?.focus({ preventScroll: true });
  }, [step, jobId]);
  const card = warmupCards[step];
  const total = warmupCards.length + 1;
  const next = () => {
    moved.current = true;
    setChoice(null);
    setStep((s) => Math.min(s + 1, warmupCards.length));
  };
  return (
    <section className="warmup" aria-label="Warm-up while you wait">
      <header className="warmup-head">
        <p className="warmup-kicker">
          <Icon name="star" size={14} strong /> While you wait
        </p>
        <span className="warmup-tag">Warm-up · not scored</span>
      </header>
      <ol className="warmup-dots" aria-label={`Card ${step + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={i < step ? "is-done" : i === step ? "is-current" : ""}
          />
        ))}
      </ol>
      <AnimatePresence initial={false} mode="wait">
        <PresenceBlock
          key={card?.id ?? "prediction"}
          className="warmup-card"
          initial={motion.canEnter() ? { opacity: 0, x: 18 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={motion.still ? { opacity: 0 } : { opacity: 0, x: -18 }}
          transition={motion.still ? { duration: 0 } : motion.swap}
        >
          {card ? (
            <>
              <span className="warmup-skill">{card.skill}</span>
              <h2 ref={heading} tabIndex={-1}>
                {card.prompt}
              </h2>
              <div className="warmup-options" role="group" aria-label="Answers">
                {card.options.map((option, i) => {
                  const picked = choice === option.id;
                  const right = option.id === card.answer;
                  const state = !choice
                    ? ""
                    : right
                      ? "is-right"
                      : picked
                        ? "is-wrong"
                        : "is-muted";
                  return (
                    <m.button
                      key={option.id}
                      type="button"
                      className={`warmup-option ${state}`}
                      aria-pressed={picked}
                      disabled={!!choice}
                      data-scene-motion-control
                      {...motion.gestures(!!choice)}
                      onClick={() => {
                        setChoice(option.id);
                        requestAnimationFrame(() =>
                          feedback.current?.focus({ preventScroll: true }),
                        );
                      }}
                    >
                      <span className="warmup-key" aria-hidden="true">
                        {choice && right ? (
                          <Icon name="check" size={14} strong />
                        ) : (
                          String.fromCharCode(65 + i)
                        )}
                      </span>
                      {option.text}
                    </m.button>
                  );
                })}
              </div>
              <div aria-live="polite">
                {choice ? (
                  <m.div
                    className={`warmup-feedback ${choice === card.answer ? "is-right" : "is-wrong"}`}
                    initial={motion.still ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={motion.copy}
                  >
                    <p ref={feedback} tabIndex={-1}>
                      <strong>
                        {choice === card.answer ? "Nice thinking. " : "Close. "}
                      </strong>
                      {card.explanation}
                    </p>
                    <button
                      type="button"
                      className="warmup-next"
                      onClick={next}
                    >
                      {step + 1 < warmupCards.length
                        ? "Next card"
                        : "One last thing"}
                    </button>
                  </m.div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <span className="warmup-skill">Your turn</span>
              <h2 ref={heading} tabIndex={-1}>
                What do you think this paper found?
              </h2>
              <label className="sr-only" htmlFor={`prediction-${jobId}`}>
                Your prediction
              </label>
              <textarea
                id={`prediction-${jobId}`}
                className="warmup-prediction"
                rows={3}
                maxLength={600}
                value={prediction}
                placeholder="A guess is fine. You’ll see it again next to the real result."
                onChange={(event) => {
                  setPrediction(event.target.value);
                  writePrediction(jobId, event.target.value);
                }}
              />
              <p className="warmup-note">
                Optional. Saved only in this browser, never sent to the AI.
                {prediction.trim() ? " Saved." : ""}
              </p>
              <button
                type="button"
                className="warmup-next is-quiet"
                onClick={() => {
                  moved.current = true;
                  setStep(0);
                }}
              >
                Play the cards again
              </button>
            </>
          )}
        </PresenceBlock>
      </AnimatePresence>
    </section>
  );
}
