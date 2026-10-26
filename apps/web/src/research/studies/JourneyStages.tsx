import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Clock,
  ExternalLink,
  Lightbulb,
  ListChecks,
  RotateCcw,
  ScanText,
  Sparkles,
} from "lucide-react";
import { Mascot } from "../../components/Mascot.js";
import { ResearchLink as Link } from "../navigation.js";
import { SceneDisclosure } from "../scenes/SceneDisclosure.js";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "../scenes/scene-motion.js";
import { studies } from "./catalog.js";
import { journeyChallenges } from "./journey.js";
import {
  resetProgress,
  studyState,
  useAllProgress,
  type StudyProgress,
} from "./progress.js";
import { StudyArt, groupTone } from "./StudyArt.js";
import { Burst } from "./Burst.js";
import { briefingParts } from "./briefing.js";
import { StudyOrientation, type IntroOrientation } from "./StudyOrientation.js";
import { designGroups, type PreparedStudy } from "./types.js";

export function StudyIntro({
  study,
  onBegin,
  backHref = "/studies",
  backLabel = "All studies",
  busy = false,
  orientation,
  ocr = false,
}: {
  study: PreparedStudy;
  onBegin: () => void;
  backHref?: string;
  backLabel?: string;
  busy?: boolean;
  /** Uploaded papers replace the briefing text with three tap steps. */
  orientation?: IntroOrientation;
  /** Some source pages were read with OCR. */
  ocr?: boolean;
}) {
  const motion = useSceneMotion();
  const tone = groupTone[study.group];
  const briefing = briefingParts(study.lesson.briefing);
  return (
    <main className="journey-intro">
      <Link className="journey-back" href={backHref}>
        ← {backLabel}
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
            {study.kicker ?? designGroups[study.group].label}
          </span>
          <h1 tabIndex={-1}>{study.question}</h1>
          {orientation ? (
            <>
              <IntroChips study={study} ocr={ocr} />
              <StudyOrientation
                orientation={orientation}
                busy={busy}
                onBegin={onBegin}
              />
              {briefing.lead.length ? (
                <SceneDisclosure
                  title="Read the full briefing"
                  reduced={motion.still}
                  className="journey-intro-briefing"
                >
                  {[...briefing.lead, ...briefing.more].map(
                    (paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ),
                  )}
                </SceneDisclosure>
              ) : null}
            </>
          ) : (
            <>
              {briefing.lead.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              {briefing.more.length ? (
                <details className="journey-intro-more">
                  <summary>Read more background</summary>
                  {briefing.more.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </details>
              ) : null}
              <IntroText study={study} busy={busy} onBegin={onBegin} />
            </>
          )}
        </div>
      </m.div>
    </main>
  );
}

function IntroChips({ study, ocr }: { study: PreparedStudy; ocr: boolean }) {
  const motion = useSceneMotion();
  const [open, setOpen] = useState(false);
  return (
    <>
      <ul className="journey-intro-chips">
        <li>
          <ListChecks size={16} aria-hidden="true" />
          {study.lesson.challenges.length} decisions
        </li>
        <li>
          <Clock size={16} aria-hidden="true" />~{study.minutes} min
        </li>
        <li>
          <BookOpenCheck size={16} aria-hidden="true" />
          Paper revealed at the end
        </li>
        {ocr ? (
          <li>
            <m.button
              type="button"
              className="journey-intro-ocr"
              data-scene-motion-control
              style={{ borderRadius: 999 }}
              aria-expanded={open}
              aria-controls="journey-intro-ocr-note"
              {...motion.gestures()}
              onClick={() => setOpen((v) => !v)}
            >
              <ScanText size={16} aria-hidden="true" />
              Scanned pages
            </m.button>
          </li>
        ) : null}
      </ul>
      <AnimatePresence initial={false} mode="popLayout">
        {ocr && open ? (
          <PresenceBlock
            key="ocr"
            id="journey-intro-ocr-note"
            className="journey-intro-ocr-note"
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
          >
            Some source pages were read with OCR. Check quotations and numbers
            against your original PDF. Source matching checks the extracted
            text, not the page images.
          </PresenceBlock>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function IntroText({
  study,
  busy,
  onBegin,
}: {
  study: PreparedStudy;
  busy: boolean;
  onBegin: () => void;
}) {
  const motion = useSceneMotion();
  return (
    <>
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
          Make each research decision before you see the findings. One retry per
          question, then I’ll explain.
        </p>
      </div>
      <m.button
        type="button"
        className="journey-begin"
        data-scene-motion-control
        style={{ borderRadius: 16 }}
        {...motion.gestures(busy)}
        disabled={busy}
        onClick={onBegin}
      >
        Begin study{" "}
        <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
      </m.button>
    </>
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
  extra,
  actions,
}: {
  study: PreparedStudy;
  progress: StudyProgress;
  points: number;
  /** Shown after the paper card, for example the learner's earlier prediction. */
  extra?: ReactNode;
  /** Replaces the library actions, for example on an uploaded paper. */
  actions?: ReactNode;
}) {
  const motion = useSceneMotion();
  const celebrate = motion.canEnter();
  const all = useAllProgress();
  const list = journeyChallenges(study, progress.bonus);
  const outcome = (id: string) => {
    const attempts = progress.attempts[id] ?? [];
    if (attempts[0]?.correct) return "first";
    if (attempts[1]?.correct) return "retry";
    return "explained";
  };
  const counts = { first: 0, retry: 0, explained: 0 };
  for (const challenge of list) counts[outcome(challenge.id)] += 1;
  const open = studies.filter(
    (s) => s.slug !== study.slug && studyState(all[s.slug]) !== "done",
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
      {extra}
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
        {actions ?? (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
