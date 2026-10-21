import { useEffect, useRef } from "react";
import type { Scene } from "@paperquest/contracts";
import { ArrowRight, ScanSearch } from "lucide-react";
import type { SceneDraft } from "./InvestigationScene.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "./scene-motion.js";

export function ComparisonScene({
  scene,
  draft,
  onDraft,
  answered,
  disabled,
}: {
  scene: Extract<Scene, { kind: "comparison" }>;
  draft: SceneDraft;
  onDraft: (value: SceneDraft) => void;
  answered: boolean;
  disabled: boolean;
}) {
  const motion = useSceneMotion();
  const animateReveal = useRef(false);
  const chart = useRef<HTMLElement>(null);
  const shown = !scene.prediction || !!draft.revealed || answered;
  const revealEntrance = animateReveal.current && !motion.still;
  useEffect(() => {
    if (shown && animateReveal.current) {
      chart.current?.focus({ preventScroll: true });
      animateReveal.current = false;
    }
  }, [shown]);
  return (
    <>
      {scene.prediction ? (
        <m.fieldset
          data-scene-layout
          layout={motion.position}
          className="scene-prediction"
          disabled={answered || disabled || !!draft.revealed}
        >
          <legend>{scene.prediction.label}</legend>
          <p className="scene-caption">
            An optional prediction, separate from your assessed response. It
            does not earn points.
          </p>
          <div>
            {scene.prediction.options.map((value) => (
              <m.label
                key={value}
                data-scene-motion-control
                {...motion.gestures(answered || disabled || !!draft.revealed)}
              >
                <input
                  type="radio"
                  name="scene-prediction"
                  checked={draft.prediction === value}
                  onChange={() => onDraft({ ...draft, prediction: value })}
                />
                {value}
              </m.label>
            ))}
          </div>
          {draft.prediction ? (
            <m.p
              className="scene-caption"
              data-scene-layout
              layout={motion.position}
              initial={motion.enter}
              animate={{ opacity: 1, y: 0 }}
              transition={motion.copy}
            >
              Your prediction: {draft.prediction}
            </m.p>
          ) : null}
        </m.fieldset>
      ) : null}
      <m.div
        data-scene-layout
        layout={motion.layout}
        className="scene-comparison-stage"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {!shown ? (
            <PresenceBlock
              key="cover"
              className="scene-results-cover"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={motion.exit}
              transition={motion.copy}
            >
              <ScanSearch size={32} aria-hidden="true" />
              <strong>Inspect the reported findings</strong>
              <p>
                Your expectation stays visible when you reveal the reported
                values.
              </p>
              <m.button
                type="button"
                className="btn outline"
                data-scene-motion-control
                {...motion.gestures(disabled)}
                disabled={disabled}
                onClick={() => {
                  animateReveal.current = true;
                  onDraft({ ...draft, revealed: true });
                }}
              >
                Reveal reported results{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </m.button>
            </PresenceBlock>
          ) : null}
        </AnimatePresence>
        {shown ? (
          <m.figure
            ref={chart}
            tabIndex={-1}
            data-scene-layout
            layout={motion.position}
            className="scene-comparison"
            initial={revealEntrance ? { opacity: 0, y: 4 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={motion.copy}
            aria-label={`${scene.measure}, ${scene.unit}. ${scene.values.map((v) => `${v.label}: ${v.value.toFixed(scene.decimals ?? 2)}`).join("; ")}`}
          >
            <m.figcaption data-scene-layout layout={motion.position}>
              <strong>{scene.measure}</strong>
              <span>{scene.unit}</span>
            </m.figcaption>
            <div className="scene-axis" aria-hidden="true">
              <span>{scene.min}</span>
              <span>{(scene.min + scene.max) / 2}</span>
              <span>{scene.max}</span>
            </div>
            {scene.values.map((item, i) => (
              <m.div
                data-scene-layout
                layout={motion.position}
                className="scene-measure"
                key={item.id}
              >
                <div className="scene-measure-label">
                  <span>{item.label}</span>
                  <strong>
                    {item.value.toFixed(scene.decimals ?? 2)}
                    <small> {scene.unit}</small>
                  </strong>
                </div>
                <div className={`scene-bar-track tone-${i % 2}`}>
                  <m.div
                    data-scene-bar={
                      (item.value - scene.min) / (scene.max - scene.min)
                    }
                    initial={revealEntrance ? { scaleX: 0 } : false}
                    animate={{
                      scaleX:
                        (item.value - scene.min) / (scene.max - scene.min),
                    }}
                    transition={motion.chart}
                  />
                </div>
                <p>{item.detail}</p>
              </m.div>
            ))}
            {/* No exit presence: server-withdrawn differences must leave immediately. */}
            {scene.difference ? (
              <m.div
                data-scene-layout
                layout={motion.position}
                className="scene-difference"
                initial={motion.enter}
                animate={{ opacity: 1, y: 0 }}
                transition={motion.copy}
              >
                <span>{scene.difference.label}</span>
                <strong>
                  {(
                    scene.values.find((v) => v.id === scene.difference!.to)!
                      .value -
                    scene.values.find((v) => v.id === scene.difference!.from)!
                      .value
                  ).toFixed(scene.decimals ?? 2)}
                </strong>
              </m.div>
            ) : null}
          </m.figure>
        ) : null}
      </m.div>
    </>
  );
}
