import { MessageCircleQuestion, PenLine, Sparkles } from "lucide-react";
import type { ResearchSession } from "../types.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "../scenes/scene-motion.js";
import type { ChallengeStatus } from "./journey.js";

type PublicChallenge = NonNullable<ResearchSession["challenge"]>;
export type CoachRequest = { pending: boolean; error: string };

/**
 * Written reasoning for an uploaded paper's reasoning challenge. The text is
 * submitted with the answer; afterwards the learner may ask the live AI coach,
 * whose reply the server saves with the session. Never shown for prepared
 * studies, which have no server assessment.
 */
export function ReasoningCoach({
  challenge,
  status,
  draft,
  onDraft,
  liveAI,
  request,
  onAsk,
}: {
  challenge: PublicChallenge;
  status: ChallengeStatus;
  draft: string;
  onDraft: (text: string) => void;
  liveAI: boolean;
  request: CoachRequest;
  onAsk: () => void;
}) {
  const motion = useSceneMotion();
  if (!challenge.writtenReasoning) return null;
  const answering = status === "answering" || status === "retrying";
  const feedback = challenge.aiFeedback;
  if (answering)
    return (
      <div className="coach">
        <label className="coach-label" htmlFor={`reasoning-${challenge.id}`}>
          <PenLine size={16} aria-hidden="true" />
          Explain your thinking <span>optional</span>
        </label>
        <textarea
          id={`reasoning-${challenge.id}`}
          className="coach-input"
          rows={3}
          maxLength={3000}
          value={draft}
          placeholder="Which detail in the study made you choose this?"
          onChange={(event) => onDraft(event.target.value)}
        />
        <p className="coach-note">
          {liveAI
            ? "Sent with your answer. After you check, you can ask the AI coach about it."
            : "Saved with your answer. Live AI feedback isn’t available here."}
        </p>
      </div>
    );
  return (
    <div className="coach is-answered" aria-live="polite">
      {challenge.reasoning ? (
        <blockquote className="coach-quote">
          <span>Your reasoning</span>
          {challenge.reasoning}
        </blockquote>
      ) : liveAI ? (
        <p className="coach-note">
          Add your reasoning before checking next time to get AI coaching.
        </p>
      ) : null}
      <AnimatePresence initial={false} mode="popLayout">
        {feedback ? (
          <PresenceBlock
            key="reply"
            className="coach-reply"
            initial={motion.canEnter() ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
          >
            <p className="coach-category">
              <Sparkles size={15} aria-hidden="true" />
              {feedback.category}
            </p>
            <p>{feedback.guidance}</p>
            <p className="coach-followup">
              <MessageCircleQuestion size={16} aria-hidden="true" />
              {feedback.followup}
            </p>
            <small>AI coach · {feedback.model} · it can be wrong</small>
          </PresenceBlock>
        ) : challenge.reasoning && liveAI ? (
          <PresenceBlock
            key="ask"
            className="coach-ask"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
          >
            <m.button
              type="button"
              className="coach-button"
              data-scene-motion-control
              disabled={request.pending}
              {...motion.gestures(request.pending)}
              onClick={onAsk}
            >
              <Sparkles size={16} aria-hidden="true" />
              {request.pending ? "Asking the coach…" : "Ask the AI coach"}
            </m.button>
            {request.error ? (
              <p className="coach-error" role="alert">
                {request.error} Live AI didn’t assess it. The explanation above
                still applies.
              </p>
            ) : null}
          </PresenceBlock>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
