import { forwardRef } from "react";
import { ArrowRight, Check, Lightbulb, RotateCcw } from "lucide-react";
import { Mascot, type MascotPose } from "../../components/Mascot.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "../scenes/scene-motion.js";
import type { ChallengeStatus } from "./journey.js";
import { TermText } from "../terms/Terms.js";

export type DockFeedback = {
  status: ChallengeStatus;
  title: string;
  body: string;
  hint: string | null;
  gained: number;
  mascot: MascotPose | null;
};

/**
 * The persistent action area. One button changes meaning with the state:
 * Check → Try again / Continue. Feedback slides in above it without moving it.
 */
export const FeedbackDock = forwardRef<
  HTMLHeadingElement,
  {
    identity: string;
    feedback: DockFeedback | null;
    ready: boolean;
    action: string;
    onAction: () => void;
    note: string;
  }
>(function FeedbackDock(
  { identity, feedback, ready, action, onAction, note },
  heading,
) {
  const motion = useSceneMotion();
  const tone = feedback
    ? feedback.status === "solved"
      ? "solved"
      : feedback.status === "retry-feedback"
        ? "retry"
        : "explained"
    : "idle";
  const Icon =
    tone === "solved" ? Check : tone === "retry" ? RotateCcw : Lightbulb;
  return (
    <m.div
      className={`journey-dock tone-${tone}`}
      data-scene-layout
      layout={motion.layout}
      style={{ borderRadius: 0 }}
    >
      <div className="journey-dock-inner">
        <div className="journey-dock-message" aria-live="polite">
          <AnimatePresence initial={false} mode="popLayout">
            {feedback ? (
              <PresenceBlock
                key={`${identity}-${feedback.status}`}
                className="journey-feedback"
                initial={motion.canEnter() ? { opacity: 0, y: 14 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
                transition={
                  motion.still
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.32, bounce: 0.2 }
                }
              >
                {feedback.mascot ? (
                  <m.span
                    className="journey-feedback-mascot"
                    initial={
                      motion.canEnter()
                        ? { scale: 0.6, rotate: -8, opacity: 0 }
                        : false
                    }
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={
                      motion.still
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            duration: 0.45,
                            bounce: 0.4,
                            delay: 0.06,
                          }
                    }
                  >
                    <Mascot pose={feedback.mascot} size="small" />
                  </m.span>
                ) : (
                  <span className="journey-feedback-icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={3} />
                  </span>
                )}
                <div className="journey-feedback-copy">
                  <h2 ref={heading} tabIndex={-1}>
                    {feedback.title}
                    {feedback.gained ? (
                      <m.span
                        className="journey-gain"
                        initial={
                          motion.canEnter() ? { opacity: 0, y: 6 } : false
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          ...motion.copy,
                          delay: motion.still ? 0 : 0.12,
                        }}
                      >
                        +{feedback.gained} points
                      </m.span>
                    ) : null}
                  </h2>
                  <p>
                    <TermText text={feedback.body} />
                  </p>
                  {feedback.hint ? (
                    <p className="journey-hint">
                      <Lightbulb size={15} aria-hidden="true" />{" "}
                      <TermText text={feedback.hint} />
                    </p>
                  ) : null}
                </div>
              </PresenceBlock>
            ) : (
              <PresenceBlock
                key={`${identity}-idle`}
                className="journey-dock-note"
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.06 } }}
              >
                {note}
              </PresenceBlock>
            )}
          </AnimatePresence>
        </div>
        <m.button
          type="button"
          className={`journey-action tone-${tone}`}
          data-scene-motion-control
          disabled={!ready}
          aria-disabled={!ready}
          onClick={onAction}
          style={{ borderRadius: 16 }}
          {...motion.gestures(!ready)}
        >
          <span>{action}</span>
          {tone === "retry" ? (
            <RotateCcw size={18} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          )}
        </m.button>
      </div>
    </m.div>
  );
});
