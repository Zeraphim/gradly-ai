import { useEffect, useState } from "react";
import type { ProcessingJob } from "./types.js";
import { Icon, type IconName } from "./icon.js";
import {
  AnimatePresence,
  m,
  sceneTiming,
  useSceneMotion,
} from "./scenes/scene-motion.js";
import "./preparation-track.css";

type TrackState = "waiting" | "working" | "ready" | "failed";

function trackState(job: ProcessingJob): TrackState {
  if (job.status === "ready") return "ready";
  if (job.status === "failed" || job.status === "review") return "failed";
  return job.consented ? "working" : "waiting";
}

// One icon per pipeline position; labels and summaries always come from audits.
const stageIcons: IconName[] = [
  "research",
  "layout",
  "verify",
  "coach",
  "shield",
];

/**
 * The preparation loader. The paper token moves only when the saved job
 * advances: there is no simulated clock, a slow stage holds its position, and
 * a failure stops the scan in place.
 */
export function PreparationTrack({ job }: { job: ProcessingJob }) {
  const motion = useSceneMotion();
  const count = job.audits.length;
  if (!count) return null;
  const state = trackState(job);
  const index = state === "ready" ? count - 1 : Math.min(job.stage, count - 1);
  const current = job.audits[index];
  const done = state === "ready" ? count : job.stage;
  return (
    <section
      className={`preparation-track is-${state}`}
      aria-label="Saved preparation stages"
    >
      <div className="prep-stage" aria-hidden="true">
        <div className="prep-paper">
          <span className="prep-paper-fold" />
          {Array.from({ length: 7 }, (_, line) => (
            <m.span
              key={line}
              className="prep-paper-line"
              initial={false}
              animate={{
                scaleX:
                  line <
                  Math.ceil(
                    ((done + (state === "working" ? 0.5 : 0)) / count) * 7,
                  )
                    ? 1
                    : 0.35,
                opacity: line < Math.ceil((done / count) * 7) ? 1 : 0.55,
              }}
              transition={motion.still ? { duration: 0 } : { duration: 0.3 }}
              style={{ width: `${[78, 92, 64, 88, 70, 84, 52][line]}%` }}
            />
          ))}
          {state === "working" ? <span className="prep-scan" /> : null}
          <span className="prep-paper-badge">
            <Icon
              name={
                state === "ready"
                  ? "check"
                  : state === "failed"
                    ? "retry"
                    : (stageIcons[index] ?? "document")
              }
              size={20}
              strong
            />
          </span>
        </div>
        <div className="prep-rail">
          <div className="prep-rail-line">
            <m.div
              className="prep-rail-fill"
              initial={false}
              animate={{ scaleX: count > 1 ? index / (count - 1) : 1 }}
              transition={motion.still ? { duration: 0 } : sceneTiming.layout}
            />
          </div>
          <m.span
            className="prep-token-slot"
            style={{ width: `${100 / count}%` }}
            initial={false}
            animate={{ x: `${index * 100}%` }}
            transition={motion.still ? { duration: 0 } : sceneTiming.layout}
          >
            <span className="prep-token">
              <Icon name="document" size={14} strong />
            </span>
          </m.span>
          <ol className="preparation-track-stops">
            {job.audits.map((audit, i) => {
              const complete = state === "ready" || i < job.stage;
              return (
                <li
                  key={audit.role}
                  className={
                    complete ? "is-complete" : i === index ? "is-current" : ""
                  }
                >
                  <span className="preparation-stop">
                    <Icon
                      name={complete ? "check" : (stageIcons[i] ?? "document")}
                      size={18}
                      strong={complete}
                    />
                  </span>
                  <span className="preparation-stop-label">{audit.role}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <div
        className="preparation-track-caption"
        role="status"
        aria-live="polite"
      >
        {/* The rail already names every agent, so the caption stays short. */}
        <span className="journey-kicker">
          {state === "ready"
            ? `All ${count} agents finished`
            : state === "failed"
              ? `Stopped at ${current?.role}`
              : state === "waiting"
                ? "Waiting for your confirmation"
                : `${index + 1}/${count} · ${current?.role}`}
        </span>
        {state === "working" ? <Thinking /> : null}
        {state === "failed" ? <p>{current?.summary}</p> : null}
      </div>
    </section>
  );
}

// A little personality while an agent works. It describes activity, not
// progress: the stage name and position still come only from the saved job.
const thinkingWords = [
  "Mulling",
  "Cogitating",
  "Pondering",
  "Cross-checking",
  "Connecting dots",
  "Weighing evidence",
];

function Thinking() {
  const motion = useSceneMotion();
  const [word, setWord] = useState(0);
  useEffect(() => {
    if (motion.still) return;
    const timer = setInterval(
      () => setWord((w) => (w + 1) % thinkingWords.length),
      1600,
    );
    return () => clearInterval(timer);
  }, [motion.still]);
  return (
    <span className="prep-thinking" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={word}
          initial={motion.still ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {thinkingWords[word]}…
        </m.span>
      </AnimatePresence>
    </span>
  );
}

/** The full audit trail, shown inside the page's details group. */
export function PreparationStages({ job }: { job: ProcessingJob }) {
  const state = trackState(job);
  const count = job.audits.length;
  const index = Math.min(job.stage, Math.max(0, count - 1));
  if (!count) return null;
  return (
    <details
      className="card preparation-audit-disclosure"
      open={state === "failed"}
    >
      <summary>View all {count} preparation stages</summary>
      <ol className="preparation-audits">
        {job.audits.map((audit, i) => (
          <li
            key={audit.role}
            aria-current={state !== "ready" && i === index ? "step" : undefined}
          >
            <details
              open={
                audit.status === "Failed" || audit.status === "Needs Review"
              }
            >
              <summary>
                <span>{audit.role}</span>
                <small>{audit.status}</small>
              </summary>
              <p>{audit.summary}</p>
              <p className="preparation-audit-task">{audit.task}</p>
              {audit.error ? <p>{audit.error}</p> : null}
            </details>
          </li>
        ))}
      </ol>
    </details>
  );
}
