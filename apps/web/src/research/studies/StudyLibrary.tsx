import { forwardRef, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Clock, Play } from "lucide-react";
import { ResearchLink as Link } from "../navigation.js";
import { useIsPresent, type HTMLMotionProps } from "motion/react";
import { AnimatePresence, m, useSceneMotion } from "../scenes/scene-motion.js";
import { studies } from "./catalog.js";
import { studyState, useAllProgress, type StudyProgress } from "./progress.js";
import { StudyArt, groupTone } from "./StudyArt.js";
import {
  designGroups,
  studyTopics,
  type DesignGroup,
  type StudyCard as Card,
  type StudyTopic,
} from "./types.js";

export function StudyLibrary() {
  const motion = useSceneMotion();
  const all = useAllProgress();
  const [group, setGroup] = useState<DesignGroup | "all">("all");
  const [topic, setTopic] = useState<StudyTopic | "all">("all");
  const topicControl = useRef<HTMLSelectElement>(null);
  const available = studies;
  const shown = available.filter(
    (s) =>
      (group === "all" || s.group === group) &&
      (topic === "all" || s.topic === topic),
  );
  const resume = useMemo(
    () =>
      available
        .filter((s) => studyState(all[s.slug]) === "started")
        .sort(
          (a, b) => (all[b.slug]?.updated ?? 0) - (all[a.slug]?.updated ?? 0),
        )[0] ?? null,
    [available, all],
  );
  const groups = [...new Set(available.map((s) => s.group))];
  const usedTopics = [...new Set(available.map((s) => s.topic))];
  return (
    <main id="main" tabIndex={-1} className="library">
      <header className="library-head">
        <div>
          <p className="library-eyebrow">Prepared studies</p>
          <h1 tabIndex={-1}>Pick a study. Make the calls.</h1>
          <p>
            Each study is a short run of research decisions on a real paper. You
            find out which paper at the end.
          </p>
        </div>
      </header>

      {resume ? (
        <ResumeCard study={resume} progress={all[resume.slug]!} />
      ) : null}

      <>
        <section className="library-filters" aria-label="Filter studies">
          <div className="library-filter-field">
            <label htmlFor="library-topic">Topic</label>
            <select
              id="library-topic"
              ref={topicControl}
              value={topic}
              onChange={(event) =>
                setTopic(event.target.value as StudyTopic | "all")
              }
            >
              <option value="all">All topics</option>
              {usedTopics.map((value) => (
                <option key={value} value={value}>
                  {studyTopics[value].short}
                </option>
              ))}
            </select>
          </div>
          <div className="library-filter-field">
            <label htmlFor="library-design">Study design</label>
            <select
              id="library-design"
              value={group}
              onChange={(event) =>
                setGroup(event.target.value as DesignGroup | "all")
              }
            >
              <option value="all">All designs</option>
              {groups.map((value) => (
                <option key={value} value={value}>
                  {designGroups[value].label}
                </option>
              ))}
            </select>
          </div>
          <div className="library-filter-summary">
            <p role="status" aria-live="polite" aria-atomic="true">
              {group !== "all" || topic !== "all"
                ? `${shown.length} of ${available.length}`
                : shown.length}{" "}
              {shown.length === 1 ? "study" : "studies"}
            </p>
            {group !== "all" || topic !== "all" ? (
              <button
                type="button"
                className="library-filter-reset"
                onClick={() => {
                  setGroup("all");
                  setTopic("all");
                  topicControl.current?.focus({ preventScroll: true });
                }}
              >
                Reset filters
              </button>
            ) : null}
          </div>
        </section>
        <m.ul className="library-grid" layout={motion.position}>
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((study) => (
              <LibraryItem
                key={study.slug}
                layout={motion.position}
                initial={motion.still ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: motion.still ? 1 : 0.96,
                  transition: { duration: motion.still ? 0 : 0.12 },
                }}
                transition={
                  motion.still
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.3, bounce: 0 }
                }
              >
                <StudyCard study={study} progress={all[study.slug]} />
              </LibraryItem>
            ))}
          </AnimatePresence>
        </m.ul>
        {!shown.length ? (
          <div className="library-empty small">
            <p>
              No studies match these filters. Try a different combination or
              reset the filters above.
            </p>
          </div>
        ) : null}
      </>
      <nav className="library-practice" aria-label="More practice">
        <Link className="journey-skip" href="/reasoning">
          Try the reasoning preview
        </Link>
        <Link className="journey-skip" href="/activities">
          Explore paper activities
        </Link>
      </nav>
    </main>
  );
}

/** Filtered-out cards leave with a short fade but are never reachable while leaving. */
const LibraryItem = forwardRef<HTMLLIElement, HTMLMotionProps<"li">>(
  function LibraryItem(props, ref) {
    const present = useIsPresent();
    return (
      <m.li
        {...props}
        ref={ref}
        inert={!present || undefined}
        aria-hidden={!present || undefined}
      />
    );
  },
);

function progressShare(study: Card, progress: StudyProgress | undefined) {
  if (!progress) return 0;
  if (progress.completed) return 1;
  const main = study.challenges;
  const done = main.filter((id) => {
    const attempts = progress.attempts[id] ?? [];
    return attempts.some((a) => a.correct) || attempts.length >= 2;
  }).length;
  return done / main.length;
}

function StudyCard({
  study,
  progress,
}: {
  study: Card;
  progress: StudyProgress | undefined;
}) {
  const motion = useSceneMotion();
  const state = studyState(progress);
  const tone = groupTone[study.group];
  const share = progressShare(study, progress);
  const count = study.challenges.length;
  return (
    <m.div
      className={`library-card state-${state}`}
      data-scene-motion-control
      style={{ borderRadius: 22 }}
      whileHover={motion.hover ? { y: -3 } : undefined}
      whileTap={motion.still ? undefined : { scale: 0.985 }}
      transition={
        motion.still ? { duration: 0 } : { duration: 0.14, ease: "easeOut" }
      }
    >
      <div className="library-card-art">
        <StudyArt topic={study.topic} group={study.group} />
        {!study.reviewed ? (
          <span className="library-card-flag">Not reviewed</span>
        ) : null}
        {state === "done" ? (
          <span className="library-card-done" aria-hidden="true">
            <Check size={16} strokeWidth={3} />
          </span>
        ) : null}
      </div>
      <div className="library-card-body">
        <span
          className="study-group"
          style={{ background: tone.wash, color: tone.ink }}
        >
          {designGroups[study.group].label}
        </span>
        <h2>
          <Link className="library-card-link" href={`/studies/${study.slug}`}>
            {study.teaser}
          </Link>
        </h2>
        <p>{study.question}</p>
        <div className="library-card-foot">
          <span className="library-card-time">
            <Clock size={15} aria-hidden="true" />≈{study.minutes} min ·
            estimate
          </span>
          <span className={`library-card-state state-${state}`}>
            {state === "done"
              ? "Done"
              : state === "started"
                ? `${Math.round(share * count)} of ${count}`
                : `${count} challenges`}
          </span>
        </div>
        <span className="library-card-meter" aria-hidden="true">
          <m.span
            style={{ originX: 0, background: tone.ink }}
            data-scene-bar={share}
            initial={false}
            animate={{ scaleX: share }}
            transition={motion.chart}
          />
        </span>
      </div>
    </m.div>
  );
}

function ResumeCard({
  study,
  progress,
}: {
  study: Card;
  progress: StudyProgress;
}) {
  const motion = useSceneMotion();
  const share = progressShare(study, progress);
  return (
    <m.section
      className="library-resume"
      aria-label="Continue where you left off"
      initial={motion.canEnter() ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={motion.copy}
    >
      <StudyArt
        topic={study.topic}
        group={study.group}
        className="library-resume-art"
      />
      <div className="library-resume-body">
        <p className="library-eyebrow">Continue where you left off</p>
        <h2>{study.teaser}</h2>
        <span className="library-resume-meter" aria-hidden="true">
          <m.span
            style={{ originX: 0 }}
            data-scene-bar={share}
            initial={false}
            animate={{ scaleX: share }}
            transition={motion.chart}
          />
        </span>
        <span className="library-resume-share">
          {Math.round(share * 100)}% complete
        </span>
      </div>
      <Link className="journey-begin" href={`/studies/${study.slug}`}>
        <Play size={17} strokeWidth={2.5} aria-hidden="true" /> Continue
        <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
      </Link>
    </m.section>
  );
}
