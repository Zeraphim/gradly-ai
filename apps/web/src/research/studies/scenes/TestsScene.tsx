import { Dices } from "lucide-react";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import type { TestsScene as Tests } from "../types.js";
import { PredictionReveal } from "./PredictionReveal.js";
import { TapNode, type TapProps } from "./TapNode.js";

/** Smallest p drawn; anything below sits at the left edge of the log axis. */
const FLOOR = 0.001;
const ticks = [0.001, 0.01, 0.05, 0.1, 1];

/** Position on a log axis from .001 (left) to 1 (right), in percent. */
export function pPosition(p: number) {
  const clamped = Math.min(1, Math.max(FLOOR, p));
  return (1 - Math.log10(clamped) / Math.log10(FLOOR)) * 100;
}

/** Below the threshold, counting a reported bound such as p < .05 as below it. */
export function crosses(test: { p: number; bound?: "=" | "<" }, alpha: number) {
  return test.p < alpha || (test.bound === "<" && test.p <= alpha);
}

/** ".04", "< .001": p as the paper printed it, without a leading zero. */
export function formatP(p: number, bound: "=" | "<" = "=") {
  return `${bound} ${String(p).replace(/^0(?=\.)/, "")}`;
}

/**
 * A family of reported tests against one threshold. Each row is a reported p on a
 * log axis, so near-misses and clear results read differently at a glance. After
 * an attempt, a derived chance check shows how many would cross by luck alone.
 */
export function TestsScene({
  scene,
  draft,
  onDraft,
  answered,
  disabled,
  tap,
}: {
  scene: Tests;
  draft: SceneDraft;
  onDraft: (value: SceneDraft) => void;
  answered: boolean;
  disabled: boolean;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const alpha = formatP(scene.alpha).slice(2);
  const below = scene.tests.filter((t) => crosses(t, scene.alpha)).length;
  const expected = scene.tests.length * scene.alpha;
  return (
    <PredictionReveal
      prediction={scene.prediction}
      name="study-tests-prediction"
      draft={draft}
      onDraft={onDraft}
      answered={answered}
      disabled={disabled}
      cover="The p-values are covered"
      action="Reveal the results"
      className="study-tests-stage"
    >
      {({ entrance, revealing, figure }) => (
        <m.figure
          ref={figure as React.RefObject<HTMLElement>}
          tabIndex={-1}
          data-scene-layout
          layout={motion.position}
          className="study-tests"
          initial={revealing && !motion.still ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={motion.copy}
        >
          <figcaption className="study-tests-head">
            <span className="study-tests-alpha">
              Threshold{" "}
              <strong>
                p {"<"} {alpha}
              </strong>
            </span>
            <span className="study-tests-tally" aria-live="polite">
              <strong>{below}</strong> of {scene.tests.length} below {alpha}
            </span>
          </figcaption>
          {/* The axis shares the rows' grid, so ticks line up with every track. */}
          <div
            className={`study-tests-axis-row ${tap ? "tapping" : ""}`}
            aria-hidden="true"
          >
            <span className="study-test-body">
              <span className="study-test-label" />
              <span className="study-tests-axis">
                {ticks.map((tick) => (
                  <span
                    key={tick}
                    className={tick === scene.alpha ? "alpha" : ""}
                    style={{ left: `${pPosition(tick)}%` }}
                  >
                    {formatP(tick).slice(2)}
                  </span>
                ))}
              </span>
              <span />
            </span>
          </div>
          <ol className="study-tests-rows">
            <AnimatePresence initial={false}>
              {scene.tests.map((test, i) => {
                const crossed = crosses(test, scene.alpha);
                const body = (
                  <span className="study-test-body">
                    <span className="study-test-label">
                      <strong>{test.label}</strong>
                      <span className="study-tap-detail">{test.detail}</span>
                    </span>
                    <span className="study-test-track" aria-hidden="true">
                      <span
                        className="study-test-alpha"
                        style={{ left: `${pPosition(scene.alpha)}%` }}
                      />
                      <m.span
                        className={`study-test-dot ${crossed ? "crossed" : ""} ${test.bound === "<" ? "bound" : ""}`}
                        style={{ left: `${pPosition(test.p)}%` }}
                        initial={entrance ? { scale: 0.3, opacity: 0 } : false}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          ...motion.chart,
                          delay: entrance ? motion.stagger(i) : 0,
                        }}
                      />
                    </span>
                    <span
                      className={`study-test-p ${crossed ? "crossed" : ""}`}
                    >
                      p {formatP(test.p, test.bound)}
                    </span>
                  </span>
                );
                return (
                  <m.li
                    key={test.id}
                    data-scene-layout
                    layout={motion.position}
                    initial={motion.enter}
                    animate={{ opacity: 1, y: 0 }}
                    transition={motion.copy}
                  >
                    {tap?.targets.has(test.id) ? (
                      <TapNode {...tap} id={test.id} label={test.label}>
                        {body}
                      </TapNode>
                    ) : (
                      <div className="study-test-card">{body}</div>
                    )}
                  </m.li>
                );
              })}
            </AnimatePresence>
          </ol>
          {answered ? (
            <m.p
              data-scene-layout
              layout={motion.position}
              className="study-tests-chance"
              initial={motion.still ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motion.copy}
            >
              <Dices size={18} aria-hidden="true" />
              <span>
                If none of these effects were real, about{" "}
                <strong>{Number(expected.toFixed(2))}</strong> of{" "}
                {scene.tests.length} tests would still cross {alpha} by chance
                (tests × {alpha}, derived).
              </span>
            </m.p>
          ) : null}
        </m.figure>
      )}
    </PredictionReveal>
  );
}
