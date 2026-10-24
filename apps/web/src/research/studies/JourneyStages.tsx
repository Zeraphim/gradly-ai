import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Clock,
  ExternalLink,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Mascot } from "../../components/Mascot.js";
import { ResearchLink as Link } from "../navigation.js";
import { m, useSceneMotion } from "../scenes/scene-motion.js";
import { studies } from "./catalog.js";
import { journeyChallenges } from "./journey.js";
import {
  resetProgress,
  studyState,
  useAllProgress,
  useShowUnreviewed,
  type StudyProgress,
} from "./progress.js";
import { StudyArt, groupTone } from "./StudyArt.js";
import { designGroups, type PreparedStudy } from "./types.js";

export function StudyIntro({
  study,
  onBegin,
}: {
  study: PreparedStudy;
  onBegin: () => void;
}) {
  const motion = useSceneMotion();
  const tone = groupTone[study.group];
  return (
    <main className="journey-intro">
      <Link className="journey-back" href="/studies">
        ← All studies
      </Link>
      <m.div
        className="journey-intro-card"
        initial={motion.canEnter() ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={
          motion.still
            ? { duration: 0 }
            : { type: "spring", duration: 0.4, bounce: 0.15 }
        }
      >
        <StudyArt
          topic={study.topic}
          group={study.group}
          className="journey-intro-art"
          fit="meet"
        />
        <div className="journey-intro-body">
          <span
            className="study-group"
            style={{ background: tone.wash, color: tone.ink }}
          >
            {designGroups[study.group].label}
          </span>
          <h1 tabIndex={-1}>{study.question}</h1>
          <p>{study.lesson.briefing}</p>
          <ul className="journey-intro-facts">
            <li>
              <ListChecks size={17} aria-hidden="true" />
              {study.lesson.challenges.length} challenges
              {study.lesson.bonus ? " + optional bonus" : ""}
            </li>
            <li>
              <Clock size={17} aria-hidden="true" />
              About {study.minutes} min (estimate)
            </li>
            <li>
              <BookOpenCheck size={17} aria-hidden="true" />
              The paper is revealed at the end
            </li>
          </ul>
          <div className="journey-intro-speech">
            <Mascot pose="guiding" size="small" />
            <p>
              Make each research decision before you see the findings. One retry
              per question, then I’ll explain.
            </p>
          </div>
          <m.button
            type="button"
            className="journey-begin"
            data-scene-motion-control
            style={{ borderRadius: 16 }}
            {...motion.gestures()}
            onClick={onBegin}
          >
            Begin study{" "}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </m.button>
        </div>
      </m.div>
    </main>
  );
}

export function BonusOffer({
  onAccept,
  onSkip,
}: {
  onAccept: () => void;
  onSkip: () => void;
}) {
  const motion = useSceneMotion();
  return (
    <main className="journey-main journey-bonus">
      <m.div
        className="journey-bonus-card"
        initial={motion.canEnter() ? { opacity: 0, scale: 0.96 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          motion.still
            ? { duration: 0 }
            : { type: "spring", duration: 0.4, bounce: 0.25 }
        }
      >
        <Sparkles size={30} aria-hidden="true" />
        <h1 tabIndex={-1}>One more for the curious?</h1>
        <p>
          An optional bonus challenge stretches the same idea a little further.
          It earns points like any other challenge.
        </p>
        <div className="journey-bonus-actions">
          <m.button
            type="button"
            className="journey-begin"
            data-scene-motion-control
            style={{ borderRadius: 16 }}
            {...motion.gestures()}
            onClick={onAccept}
          >
            Try the bonus{" "}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </m.button>
          <button type="button" className="journey-skip" onClick={onSkip}>
            Skip to the paper
          </button>
        </div>
      </m.div>
    </main>
  );
}

export function StudyReveal({
  study,
  progress,
  points,
}: {
  study: PreparedStudy;
  progress: StudyProgress;
  points: number;
}) {
  const motion = useSceneMotion();
  const celebrate = motion.canEnter();
  const all = useAllProgress();
  const showUnreviewed = useShowUnreviewed();
  const list = journeyChallenges(study, progress.bonus);
  const outcome = (id: string) => {
    const attempts = progress.attempts[id] ?? [];
    if (attempts[0]?.correct) return "first";
    if (attempts[1]?.correct) return "retry";
    return "explained";
  };
  const counts = { first: 0, retry: 0, explained: 0 };
  for (const challenge of list) counts[outcome(challenge.id)] += 1;
  // Suggest only studies the library would list, never one still hidden for review.
  const open = studies.filter(
    (s) =>
      s.slug !== study.slug &&
      (s.reviewed || showUnreviewed) &&
      studyState(all[s.slug]) !== "done",
  );
  const next = open.find((s) => s.group !== study.group) ?? open[0];
  const paper = study.lesson.paper;
  const tiles = [
    { label: "First try", value: counts.first, icon: Check },
    { label: "After a retry", value: counts.retry, icon: RotateCcw },
    { label: "Explained", value: counts.explained, icon: Lightbulb },
    { label: "Points", value: points, icon: Sparkles },
  ];
  return (
    <main className="journey-main journey-reveal">
      <div className="journey-celebrate">
        {celebrate ? <Burst /> : null}
        <m.div
          initial={celebrate ? { scale: 0.5, opacity: 0, y: 12 } : false}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={
            motion.still
              ? { duration: 0 }
              : { type: "spring", duration: 0.6, bounce: 0.45 }
          }
        >
          <Mascot pose="celebrating" size="normal" />
        </m.div>
      </div>
      <h1 tabIndex={-1}>Study complete</h1>
      <p className="journey-reveal-lead">
        You made every research decision before seeing the paper. Here it is.
      </p>
      <ul className="journey-tiles">
        {tiles.map((tile, i) => (
          <m.li
            key={tile.label}
            initial={celebrate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={
              motion.still
                ? { duration: 0 }
                : { ...motion.copy, delay: 0.25 + i * 0.05 }
            }
          >
            <tile.icon size={18} strokeWidth={2.5} aria-hidden="true" />
            <strong>{tile.value}</strong>
            <span>{tile.label}</span>
          </m.li>
        ))}
      </ul>
      <m.article
        className="journey-paper"
        initial={celebrate ? { opacity: 0, y: 16, rotateX: 8 } : false}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={
          motion.still
            ? { duration: 0 }
            : { type: "spring", duration: 0.55, bounce: 0.2, delay: 0.4 }
        }
      >
        <span className="journey-paper-eyebrow">
          The paper behind this study
        </span>
        <h2>{paper.title}</h2>
        <p className="journey-paper-meta">
          {paper.authors} · {paper.journal}
        </p>
        <p className="journey-takeaway">{study.takeaway}</p>
        <details className="journey-limits">
          <summary>What this study can’t tell you</summary>
          <ul>
            {paper.limitations.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
        </details>
        {paper.url ? (
          <a
            className="journey-paper-link"
            href={paper.url}
            target="_blank"
            rel="noreferrer"
          >
            Read the paper <ExternalLink size={15} aria-hidden="true" />
          </a>
        ) : null}
        {!study.reviewed ? (
          <p className="journey-unreviewed">
            Not content-reviewed yet. Practice points do not measure learning.
          </p>
        ) : null}
      </m.article>
      <section className="journey-recap" aria-label="Your challenges">
        <h2>Your decisions</h2>
        <ol>
          {list.map((challenge) => {
            const result = outcome(challenge.id);
            return (
              <li key={challenge.id} className={`recap-${result}`}>
                <span className="journey-recap-mark" aria-hidden="true">
                  {result === "first" ? (
                    <Check size={14} strokeWidth={3} />
                  ) : result === "retry" ? (
                    <RotateCcw size={14} strokeWidth={2.5} />
                  ) : (
                    <Lightbulb size={14} strokeWidth={2.5} />
                  )}
                </span>
                <span>{challenge.title}</span>
                <span className="journey-recap-result">
                  {result === "first"
                    ? "First try"
                    : result === "retry"
                      ? "After a retry"
                      : "Explained"}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
      <div className="journey-reveal-actions">
        {next ? (
          <Link className="journey-begin" href={`/studies/${next.slug}`}>
            Next: {next.teaser}{" "}
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        ) : null}
        <Link className="journey-skip" href="/studies">
          Back to all studies
        </Link>
        <button
          type="button"
          className="journey-skip"
          onClick={() => resetProgress(study.slug)}
        >
          Replay this study
        </button>
      </div>
    </main>
  );
}

/** The single completion moment: rings and sparks, once, never on restore. */
function Burst() {
  const motion = useSceneMotion();
  if (motion.still) return null;
  const sparks = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
  return (
    <svg
      className="journey-burst"
      viewBox="-100 -100 200 200"
      aria-hidden="true"
    >
      {[0, 1].map((ring) => (
        <m.circle
          key={ring}
          r="40"
          fill="none"
          stroke={ring ? "#1cb0f6" : "#ffc845"}
          strokeWidth="4"
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: ring * 0.12 }}
        />
      ))}
      {sparks.map((angle, i) => (
        <m.circle
          key={angle}
          r={i % 2 ? 4 : 6}
          fill={["#1cb0f6", "#ffc845", "#58cc9b", "#ff8a65"][i % 4]}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{
            x: Math.cos(angle) * 88,
            y: Math.sin(angle) * 88,
            opacity: 0,
            scale: 1,
          }}
          transition={{ duration: 0.75, ease: [0.2, 0.7, 0.3, 1], delay: 0.05 }}
        />
      ))}
    </svg>
  );
}
