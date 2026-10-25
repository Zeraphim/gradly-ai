import { useEffect, useRef, useState } from "react";
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
  const state = trackState(job);
  const done = state === "ready" ? count : job.stage;
  const finished = useFinishedStages(done, job.audits);
  const elapsed = useStageClock(job.id, job.stage, state === "working");
  if (!count) return null;
  const index = state === "ready" ? count - 1 : Math.min(job.stage, count - 1);
  const current = job.audits[index];
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
              const celebrate = finished.stages.includes(i) && !motion.still;
              return (
                <li
                  key={audit.role}
                  className={
                    complete ? "is-complete" : i === index ? "is-current" : ""
                  }
                >
                  <m.span
                    className="preparation-stop"
                    data-scene-settle
                    initial={false}
                    animate={
                      celebrate ? { scale: [1, 1.24, 0.96, 1] } : { scale: 1 }
                    }
                    transition={
                      celebrate
                        ? { duration: 0.5, ease: "easeOut" }
                        : { duration: 0 }
                    }
                  >
                    <Icon
                      name={complete ? "check" : (stageIcons[i] ?? "document")}
                      size={18}
                      strong={complete}
                    />
                  </m.span>
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
        <AnimatePresence initial={false}>
          {finished.label ? (
            <m.span
              key={finished.label}
              className="prep-finished"
              initial={motion.still ? false : { opacity: 0, y: 6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={motion.still ? { duration: 0 } : sceneTiming.enter}
            >
              <Icon name="check" size={14} strong /> {finished.label}
            </m.span>
          ) : null}
        </AnimatePresence>
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
        {state === "working" ? <SlowStage elapsed={elapsed} /> : null}
        {state === "failed" ? <p>{current?.summary}</p> : null}
      </div>
    </section>
  );
}

/**
 * Stages that finished while this page was open. Restored progress never
 * celebrates; a live advance pops its stop and names the agent briefly.
 */
function useFinishedStages(done: number, audits: ProcessingJob["audits"]) {
  const seen = useRef(done);
  const [finished, setFinished] = useState<{
    stages: number[];
    label: string;
  }>({ stages: [], label: "" });
  useEffect(() => {
    const before = seen.current;
    seen.current = done;
    if (done <= before) {
      // A regenerate moves back; drop any celebration still on screen.
      setFinished({ stages: [], label: "" });
      return;
    }
    const stages = Array.from({ length: done - before }, (_, i) => before + i);
    const last = audits[done - 1];
    setFinished({ stages, label: last ? `${last.role} finished` : "" });
    const timer = setTimeout(
      () => setFinished({ stages: [], label: "" }),
      2600,
    );
    return () => clearTimeout(timer);
  }, [done]);
  return finished;
}

/**
 * Seconds the current stage has been running, measured in this browser since
 * the stage was first seen working. It survives a reload in this tab. It is a
 * clock, not a progress estimate: nothing here predicts when a stage ends.
 */
export function useStageClock(jobId: string, stage: number, running: boolean) {
  const [now, setNow] = useState(() => Date.now());
  const key = `gradly-stage-start:${jobId}:${stage}`;
  const [started, setStarted] = useState<number | null>(null);
  useEffect(() => {
    if (!running) {
      setStarted(null);
      return;
    }
    let start = Date.now();
    try {
      const saved = Number(sessionStorage.getItem(key));
      if (saved > 0 && saved <= start) start = saved;
      else sessionStorage.setItem(key, String(start));
    } catch {}
    setStarted(start);
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [key, running]);
  return started === null ? 0 : Math.max(0, Math.floor((now - started) / 1000));
}

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

/** Honest waiting copy: elapsed time and what happens next, never a forecast. */
export function SlowStage({ elapsed }: { elapsed: number }) {
  if (elapsed < 30) return null;
  return (
    <div className="prep-slow">
      <p className="prep-elapsed">On this step for {clock(elapsed)}</p>
      {elapsed >= 60 ? (
        <p className="prep-slow-note">
          {elapsed >= 180
            ? "This step is taking longer than usual. It will finish, start this step again by itself, or offer a retry. Nothing you have done is lost."
            : "Long papers can take a few minutes per step. If the AI doesn’t answer in time, Gradly retries once by itself. Your progress is saved, so you can leave and come back."}
        </p>
      ) : null}
    </div>
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
