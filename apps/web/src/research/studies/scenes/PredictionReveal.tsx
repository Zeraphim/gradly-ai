import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { ArrowRight, ScanSearch } from "lucide-react";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";

export type RevealState = {
  /** True only while the learner's own reveal is playing, never on restore. */
  entrance: boolean;
  revealing: boolean;
  figure: RefObject<HTMLElement | null>;
};

/**
 * An optional, unscored prediction and a cover over permitted results. Answer
 * choices wait for the reveal (see the player's sceneGatesChoices). Focus moves to
 * the revealed figure so keyboard and screen-reader users land on the results.
 */
export function PredictionReveal({
  prediction,
  name,
  draft,
  onDraft,
  answered,
  disabled,
  cover,
  action,
  className,
  children,
}: {
  prediction: { label: string; options: string[] } | null;
  name: string;
  draft: SceneDraft;
  onDraft: (value: SceneDraft) => void;
  answered: boolean;
  disabled: boolean;
  cover: string;
  action: string;
  className: string;
  children: (state: RevealState) => ReactNode;
}) {
  const motion = useSceneMotion();
  const revealing = useRef(false);
  const figure = useRef<HTMLElement>(null);
  const shown = !prediction || !!draft.revealed || answered;
  const entrance = (revealing.current || motion.canEnter()) && !motion.still;
  useEffect(() => {
    if (shown && revealing.current) {
      figure.current?.focus({ preventScroll: true });
      revealing.current = false;
    }
  }, [shown]);
  const locked = answered || disabled || !!draft.revealed;
  return (
    <>
      {prediction ? (
        <m.fieldset
          data-scene-layout
          layout={motion.position}
          className="study-predict"
          disabled={locked}
        >
          <legend>{prediction.label}</legend>
          <div className="study-predict-options">
            {prediction.options.map((value) => (
              <m.label
                key={value}
                data-scene-motion-control
                className={draft.prediction === value ? "selected" : ""}
                style={{ borderRadius: 999 }}
                {...motion.gestures(locked)}
              >
                <input
                  type="radio"
                  name={name}
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
      <m.div data-scene-layout layout={motion.layout} className={className}>
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
              <strong>{cover}</strong>
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
                {action} <ArrowRight size={17} aria-hidden="true" />
              </m.button>
            </PresenceBlock>
          ) : null}
        </AnimatePresence>
        {shown
          ? children({ entrance, revealing: revealing.current, figure })
          : null}
      </m.div>
    </>
  );
}
