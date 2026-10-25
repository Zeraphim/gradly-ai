import { useEffect, useRef } from "react";
import { ArrowRight, ScanSearch } from "lucide-react";
import type { EstimateScene as Estimate } from "../types.js";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";

/**
 * Reported estimates with their intervals against a reference value, optionally
 * behind an explicit reveal so a learner can commit to a prediction first.
 */
export function EstimateScene({
  scene,
  draft,
  onDraft,
  answered,
  disabled,
}: {
  scene: Estimate;
  draft: SceneDraft;
  onDraft: (value: SceneDraft) => void;
  answered: boolean;
  disabled: boolean;
}) {
  const motion = useSceneMotion();
  const revealing = useRef(false);
  const figure = useRef<HTMLElement>(null);
  const shown = !scene.prediction || !!draft.revealed || answered;
  const entrance = (revealing.current || motion.canEnter()) && !motion.still;
  useEffect(() => {
    if (shown && revealing.current) {
      figure.current?.focus({ preventScroll: true });
      revealing.current = false;
    }
  }, [shown]);
  const at = (value: number) =>
    ((value - scene.min) / (scene.max - scene.min)) * 100;
  const ticks = [scene.min, (scene.min + scene.max) / 2, scene.max];
  const locked = answered || disabled || !!draft.revealed;
  return (
    <>
      {scene.prediction ? (
        <m.fieldset
          data-scene-layout
          layout={motion.position}
          className="study-predict"
          disabled={locked}
        >
          <legend>{scene.prediction.label}</legend>
          <div className="study-predict-options">
            {scene.prediction.options.map((value) => (
              <m.label
                key={value}
                data-scene-motion-control
                className={draft.prediction === value ? "selected" : ""}
                style={{ borderRadius: 999 }}
                {...motion.gestures(locked)}
              >
                <input
                  type="radio"
                  name="study-prediction"
                  checked={draft.prediction === value}
                  onChange={() => onDraft({ ...draft, prediction: value })}
                />
                {value}
              </m.label>
            ))}
          </div>
          <p className="study-scene-note">
            Optional and unscored. Your guess stays visible after the reveal.
          </p>
        </m.fieldset>
      ) : null}
      <m.div
        data-scene-layout
        layout={motion.layout}
        className="study-estimate-stage"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {!shown ? (
            <PresenceBlock
              key="cover"
              className="study-reveal-cover"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={motion.exit}
              transition={motion.copy}
            >
              <ScanSearch size={28} aria-hidden="true" />
              <strong>The interval is covered</strong>
              <m.button
                type="button"
                className="btn outline compact"
                data-scene-motion-control
                {...motion.gestures(disabled)}
                disabled={disabled}
                onClick={() => {
                  revealing.current = true;
                  onDraft({ ...draft, revealed: true });
                }}
              >
                Reveal the estimate <ArrowRight size={17} aria-hidden="true" />
              </m.button>
            </PresenceBlock>
          ) : null}
        </AnimatePresence>
        {shown ? (
          <m.figure
            ref={figure}
            tabIndex={-1}
            data-scene-layout
            layout={motion.position}
            className="study-estimate"
            initial={
              revealing.current && !motion.still ? { opacity: 0, y: 4 } : false
            }
            animate={{ opacity: 1, y: 0 }}
            transition={motion.copy}
            aria-label={`${scene.measure}. ${scene.estimates
              .map(
                (e) =>
                  `${e.label}: ${e.value}, interval ${e.lower} to ${e.upper}`,
              )
              .join(
                "; ",
              )}. Reference: ${scene.reference.label} at ${scene.reference.value}.`}
          >
            <figcaption>{scene.measure}</figcaption>
            <div
              className="study-estimate-plot"
              aria-hidden="true"
              style={
                { "--rows": scene.estimates.length + 1 } as React.CSSProperties
              }
            >
              <div className="study-estimate-overlay">
                {scene.band ? (
                  <m.span
                    className="study-estimate-band"
                    style={{
                      left: `${at(scene.band.lower)}%`,
                      width: `${at(scene.band.upper) - at(scene.band.lower)}%`,
                    }}
                    initial={entrance ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={motion.chart}
                  ></m.span>
                ) : null}
                <span
                  className="study-estimate-reference"
                  style={{ left: `${at(scene.reference.value)}%` }}
                />
              </div>
              {scene.estimates.map((estimate, row) => [
                <span
                  key={`${estimate.id}-label`}
                  className="study-estimate-label"
                  style={{ gridRow: row + 1 }}
                >
                  {estimate.label}
                </span>,
                <div
                  key={`${estimate.id}-track`}
                  className="study-estimate-track"
                  style={{ gridRow: row + 1 }}
                >
                  <m.span
                    className="study-estimate-whisker"
                    data-scene-bar={1}
                    style={{
                      left: `${at(estimate.lower)}%`,
                      width: `${at(estimate.upper) - at(estimate.lower)}%`,
                      originX:
                        (estimate.value - estimate.lower) /
                        (estimate.upper - estimate.lower || 1),
                    }}
                    initial={entrance ? { scaleX: 0 } : false}
                    animate={{ scaleX: 1 }}
                    transition={motion.chart}
                  />
                  <m.span
                    className="study-estimate-point"
                    style={{ left: `${at(estimate.value)}%` }}
                    initial={entrance ? { scale: 0.3, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={motion.chart}
                  />
                </div>,
                <span
                  key={`${estimate.id}-value`}
                  className="study-estimate-value"
                  style={{ gridRow: row + 1 }}
                >
                  {estimate.value}{" "}
                  <small>
                    [{estimate.lower}, {estimate.upper}]
                  </small>
                </span>,
              ])}
              <div
                className="study-estimate-axis"
                style={{ gridRow: scene.estimates.length + 1 }}
              >
                {ticks.map((tick) => (
                  <span key={tick} style={{ left: `${at(tick)}%` }}>
                    {Number(tick.toFixed(2))}
                  </span>
                ))}
              </div>
            </div>
            <ul className="study-estimate-legend" aria-hidden="true">
              <li>
                <span className="legend-reference" />
                {scene.reference.label} ({scene.reference.value})
              </li>
              {scene.band ? (
                <li>
                  <span className="legend-band" />
                  {scene.band.label} ({scene.band.lower} to {scene.band.upper})
                </li>
              ) : null}
              <li>
                <span className="legend-interval" />
                Estimate with its interval
              </li>
            </ul>
            {[
              ...new Set(scene.estimates.map((estimate) => estimate.detail)),
            ].map((detail) => (
              <p className="study-scene-note" key={detail}>
                {detail}
              </p>
            ))}
          </m.figure>
        ) : null}
      </m.div>
    </>
  );
}
