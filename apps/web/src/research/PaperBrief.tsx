import { useEffect, useState, type RefObject } from "react";
import { ActionLabel, Icon } from "./icon.js";
import {
  AnimatePresence,
  SceneMotion,
  m,
  useSceneMotion,
} from "./scenes/scene-motion.js";
import type { PaperBrief as Brief } from "./paper-brief.js";
import "./paper-brief.css";

// One idea per page, like a lesson: the learner moves through the brief with a
// progress bar, Back and Continue, then starts the quiz from the last page.
const pages = [
  "Paper",
  "Question",
  "Thesis",
  "Background",
  "Participants",
  "Design",
  "Variables",
  "Comparison",
] as const;

export function PaperBrief(props: {
  brief: Brief;
  reduced: boolean;
  busy: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  return (
    <SceneMotion reduced={props.reduced}>
      <BriefPage {...props} />
    </SceneMotion>
  );
}

function BriefPage({
  brief,
  busy,
  heading,
  onStart,
}: {
  brief: Brief;
  busy: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  const motion = useSceneMotion();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const last = page === pages.length - 1;
  const go = (next: number) => {
    const target = Math.max(0, Math.min(pages.length - 1, next));
    if (target === page) return;
    setDirection(target > page ? 1 : -1);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => heading.current?.focus());
  };
  // Arrow keys move between pages unless a control (such as the slider) has focus.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button, summary")) return;
      if (event.key === "ArrowRight") go(page + 1);
      if (event.key === "ArrowLeft") go(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const title = (kicker: string, text: React.ReactNode) => (
    <>
      <span className="brief-kicker">{kicker}</span>
      <h1 ref={heading} tabIndex={-1}>
        {text}
      </h1>
    </>
  );
  return (
    <div className="journey brief is-stepped">
      <div
        className="brief-progress"
        role="progressbar"
        aria-label="Paper brief"
        aria-valuemin={1}
        aria-valuemax={pages.length}
        aria-valuenow={page + 1}
        aria-valuetext={`${pages[page]}, page ${page + 1} of ${pages.length}`}
      >
        {pages.map((label, i) => (
          <span key={label} className="brief-progress-segment">
            <m.span
              className="brief-progress-fill"
              initial={false}
              animate={{ scaleX: i <= page ? 1 : 0 }}
              transition={motion.still ? { duration: 0 } : { duration: 0.2 }}
            />
          </span>
        ))}
      </div>
      <p className="brief-page-count" aria-hidden="true">
        {pages[page]} · {page + 1} of {pages.length}
      </p>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <m.section
          key={page}
          className="brief-page"
          initial={motion.still ? false : { opacity: 0, x: 28 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={
            motion.still ? { opacity: 0 } : { opacity: 0, x: -18 * direction }
          }
          transition={motion.still ? { duration: 0 } : motion.swap}
        >
          {page === 0 ? (
            <div className="brief-hero">
              <span className="brief-label">{brief.label}</span>
              <h1 ref={heading} tabIndex={-1}>
                {brief.title}
              </h1>
              <p className="brief-subtitle">{brief.subtitle}</p>
              <p className="brief-meta">
                <span>{brief.authors}</span>
                <span>{brief.year}</span>
                <span>{brief.venue}</span>
                <a
                  href={`https://doi.org/${brief.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DOI {brief.doi}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              <p className="brief-focus">
                <Icon name="book" size={16} /> {brief.focus}
              </p>
              <ul className="brief-glance" aria-label="At a glance">
                {brief.glance.map((item, index) => (
                  <m.li
                    key={item.label}
                    initial={motion.still ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      motion.still
                        ? { duration: 0 }
                        : {
                            delay: 0.1 + motion.stagger(index) * 2,
                            duration: 0.35,
                          }
                    }
                  >
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </m.li>
                ))}
              </ul>
            </div>
          ) : null}
          {page === 1 ? (
            <>
              {title("Research question", "What did they want to find out?")}
              <blockquote className="brief-question">
                <span aria-hidden="true">?</span>
                {brief.question}
              </blockquote>
            </>
          ) : null}
          {page === 2 ? (
            <>
              {title("Thesis", brief.thesis.claim)}
              <p className="brief-lede">{brief.thesis.reasoning}</p>
              <AttentionIllustration />
            </>
          ) : null}
          {page === 3 ? (
            <>
              {title("Background", "Why this study was needed")}
              <div className="brief-pair">
                <div>
                  <h2>What was known</h2>
                  <p>{brief.background.known}</p>
                </div>
                <div className="is-open">
                  <h2>What was still open</h2>
                  <p>{brief.background.open}</p>
                </div>
              </div>
            </>
          ) : null}
          {page === 4 ? (
            <>
              {title(
                "Participants",
                `${brief.participants.count} students took part`,
              )}
              <p className="brief-lede">{brief.participants.summary}</p>
              <DotGrid count={brief.participants.count} />
            </>
          ) : null}
          {page === 5 ? (
            <>
              {title("Design", "How the experiment ran")}
              <DesignTimeline brief={brief} />
            </>
          ) : null}
          {page === 6 ? (
            <>
              {title("Variables", "What changed, what was measured")}
              <div className="brief-variables">
                <div className="is-changed">
                  <span>Changed</span>
                  <p>{brief.variables.changed}</p>
                </div>
                <div className="is-measured">
                  <span>Measured</span>
                  <p>{brief.variables.measured}</p>
                </div>
                <div className="is-same">
                  <span>Kept the same</span>
                  <ul>
                    {brief.variables.same.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
          {page === 7 ? (
            <>
              {title("What gets compared", brief.compare)}
              <h2 className="brief-subhead">Unlocks during the quiz</h2>
              <ul className="brief-locked">
                {brief.locked.map((item) => (
                  <li key={item.id}>
                    <span className="brief-lock" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.note}</p>
                    </div>
                    <span className="brief-ghost" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  </li>
                ))}
              </ul>
              <details className="brief-words">
                <summary>Research words, in plain language</summary>
                <dl>
                  {brief.words.map((word) => (
                    <div key={word.term}>
                      <dt>{word.term}</dt>
                      <dd>{word.plain}</dd>
                    </div>
                  ))}
                </dl>
              </details>
              <p className="brief-provenance">{brief.provenance}</p>
            </>
          ) : null}
        </m.section>
      </AnimatePresence>

      <div className="journey-actions">
        <div className="journey-actions-inner">
          <p>
            <Icon name="shield" size={16} />
            Results stay locked until the quiz reaches them.
          </p>
          <div className="journey-actions-buttons">
            {page > 0 ? (
              <button
                className="j-btn is-quiet"
                disabled={busy}
                onClick={() => go(page - 1)}
              >
                Back
              </button>
            ) : null}
            {last ? (
              <button className="j-btn" disabled={busy} onClick={onStart}>
                <ActionLabel busy={busy}>
                  {busy ? "Opening…" : "Start the quiz"}
                </ActionLabel>
              </button>
            ) : (
              <button className="j-btn" onClick={() => go(page + 1)}>
                <ActionLabel>Continue</ActionLabel>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** An illustration of the idea, explicitly not a model of the data. */
function AttentionIllustration() {
  const motion = useSceneMotion();
  const [messages, setMessages] = useState(3);
  const phone = Math.min(70, messages * 7);
  return (
    <figure className="brief-attention">
      <label>
        <span>
          Messages during a lecture: <strong>{messages}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={10}
          value={messages}
          onChange={(e) => setMessages(Number(e.target.value))}
        />
      </label>
      <div className="attention-bar" aria-hidden="true">
        <m.span
          className="attention-lecture"
          initial={false}
          animate={{ scaleX: (100 - phone) / 100 }}
          transition={motion.still ? { duration: 0 } : { duration: 0.2 }}
        />
        <m.span
          className="attention-phone"
          initial={false}
          animate={{ scaleX: phone / 100 }}
          transition={motion.still ? { duration: 0 } : { duration: 0.2 }}
        />
      </div>
      <div className="attention-legend" aria-hidden="true">
        <span>
          <i className="dot lecture" /> Lecture
        </span>
        <span>
          <i className="dot phone" /> Phone
        </span>
      </div>
      <figcaption>
        Illustration of the idea, not results from the study.
      </figcaption>
    </figure>
  );
}

function DotGrid({ count }: { count: number }) {
  const motion = useSceneMotion();
  return (
    <figure className="brief-dots">
      <div aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <m.span
            key={i}
            initial={motion.still ? false : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={
              motion.still
                ? { duration: 0 }
                : { delay: i * 0.012, duration: 0.2 }
            }
          />
        ))}
      </div>
      <figcaption>Each dot is one participant ({count}).</figcaption>
    </figure>
  );
}

function DesignTimeline({ brief }: { brief: Brief }) {
  const motion = useSceneMotion();
  const [first, ...rest] = brief.design;
  return (
    <ol className="brief-timeline">
      {first ? (
        <m.li
          initial={motion.still ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={motion.still ? { duration: 0 } : { duration: 0.3 }}
        >
          <span className="brief-step">1</span>
          <div>
            <h3>{first.label}</h3>
            <p>{first.detail}</p>
            <div className="brief-split" aria-label="Conditions">
              {brief.conditions.map((condition, index) => (
                <m.span
                  key={condition}
                  className={index === 0 ? "is-text" : "is-quiet"}
                  initial={motion.still ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={
                    motion.still
                      ? { duration: 0 }
                      : { delay: 0.2 + index * 0.12, duration: 0.3 }
                  }
                >
                  {condition}
                </m.span>
              ))}
            </div>
          </div>
        </m.li>
      ) : null}
      {rest.map((step, index) => (
        <m.li
          key={step.label}
          initial={motion.still ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={
            motion.still
              ? { duration: 0 }
              : { delay: 0.08 * (index + 1), duration: 0.3 }
          }
        >
          <span className="brief-step">{index + 2}</span>
          <div>
            <h3>{step.label}</h3>
            <p>{step.detail}</p>
          </div>
        </m.li>
      ))}
    </ol>
  );
}
