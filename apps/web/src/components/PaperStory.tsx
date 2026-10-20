import React, {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  FileText,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Mascot } from "./Mascot.js";
import {
  paperContext,
  type PaperChapterId,
} from "../research/paper-context.js";
import {
  readReducedMotion,
  subscribeReducedMotion,
} from "../research/client-state.js";
import {
  AnimatePresence,
  PresenceBlock,
  SceneMotion,
  m,
  useSceneMotion,
} from "../research/scenes/scene-motion.js";

/** Every object that can appear on the story stage. */
type StageNode =
  | "halo"
  | "question"
  | "students"
  | "texting"
  | "quiet"
  | "session"
  | "limits";

/**
 * A stage position in a 0–100 grid: x is a percentage of the stage width, y of
 * its height, scale and opacity are absolute. Objects keep their identity
 * between chapters, so a chapter change reads as the same study rearranging.
 *
 * Emphasis comes from scale, position and the active ring, never from fading
 * text below the readable floor: every labelled object stays fully opaque and
 * on a white card, so contrast is the same at every scale.
 */
type Place = { x: number; y: number; scale: number; opacity: number };
type StageLayout = Record<StageNode, Place>;

const wide: Record<PaperChapterId, StageLayout> = {
  question: {
    halo: { x: 50, y: 40, scale: 1.15, opacity: 0.9 },
    question: { x: 50, y: 40, scale: 1.05, opacity: 1 },
    students: { x: 50, y: 77, scale: 0.9, opacity: 1 },
    texting: { x: 26, y: 72, scale: 0.6, opacity: 0 },
    quiet: { x: 74, y: 72, scale: 0.6, opacity: 0 },
    session: { x: 50, y: 50, scale: 1.3, opacity: 0 },
    limits: { x: 50, y: 40, scale: 1.1, opacity: 0 },
  },
  design: {
    halo: { x: 50, y: 50, scale: 1.25, opacity: 0.55 },
    question: { x: 50, y: 10.5, scale: 0.78, opacity: 1 },
    students: { x: 50, y: 42, scale: 1, opacity: 1 },
    texting: { x: 26, y: 78, scale: 0.95, opacity: 1 },
    quiet: { x: 74, y: 78, scale: 0.95, opacity: 1 },
    session: { x: 50, y: 50, scale: 1.3, opacity: 0 },
    limits: { x: 50, y: 40, scale: 1.1, opacity: 0 },
  },
  measurement: {
    halo: { x: 50, y: 50, scale: 1.25, opacity: 0.85 },
    question: { x: 50, y: 8, scale: 0.78, opacity: 0 },
    students: { x: 50, y: 42, scale: 1, opacity: 0 },
    texting: { x: 26, y: 78, scale: 0.95, opacity: 0 },
    quiet: { x: 74, y: 78, scale: 0.95, opacity: 0 },
    session: { x: 50, y: 50, scale: 1.45, opacity: 1 },
    limits: { x: 50, y: 40, scale: 1.1, opacity: 0 },
  },
  boundaries: {
    halo: { x: 50, y: 52, scale: 1.2, opacity: 0.8 },
    question: { x: 50, y: 8, scale: 0.78, opacity: 0 },
    students: { x: 50, y: 42, scale: 1, opacity: 0 },
    texting: { x: 26, y: 78, scale: 0.95, opacity: 0 },
    quiet: { x: 74, y: 78, scale: 0.95, opacity: 0 },
    session: { x: 50, y: 79, scale: 0.8, opacity: 1 },
    limits: { x: 50, y: 38, scale: 1.1, opacity: 1 },
  },
};

/** Narrow screens stack the same objects instead of spreading them sideways. */
const compact: Record<PaperChapterId, StageLayout> = {
  question: {
    halo: { x: 50, y: 40, scale: 1, opacity: 0.9 },
    question: { x: 50, y: 40, scale: 0.9, opacity: 1 },
    students: { x: 50, y: 74, scale: 0.8, opacity: 1 },
    texting: { x: 25, y: 66, scale: 0.6, opacity: 0 },
    quiet: { x: 75, y: 66, scale: 0.6, opacity: 0 },
    session: { x: 50, y: 50, scale: 1, opacity: 0 },
    limits: { x: 50, y: 38, scale: 0.95, opacity: 0 },
  },
  design: {
    halo: { x: 50, y: 46, scale: 1.1, opacity: 0.55 },
    question: { x: 50, y: 8, scale: 0.62, opacity: 1 },
    students: { x: 50, y: 30, scale: 0.95, opacity: 1 },
    texting: { x: 26, y: 72, scale: 0.8, opacity: 1 },
    quiet: { x: 74, y: 72, scale: 0.8, opacity: 1 },
    session: { x: 50, y: 50, scale: 1, opacity: 0 },
    limits: { x: 50, y: 38, scale: 0.95, opacity: 0 },
  },
  measurement: {
    halo: { x: 50, y: 50, scale: 1.1, opacity: 0.85 },
    question: { x: 50, y: 8, scale: 0.62, opacity: 0 },
    students: { x: 50, y: 30, scale: 0.95, opacity: 0 },
    texting: { x: 26, y: 72, scale: 0.8, opacity: 0 },
    quiet: { x: 74, y: 72, scale: 0.8, opacity: 0 },
    session: { x: 50, y: 50, scale: 1, opacity: 1 },
    limits: { x: 50, y: 38, scale: 0.95, opacity: 0 },
  },
  boundaries: {
    halo: { x: 50, y: 60, scale: 1.05, opacity: 0.8 },
    question: { x: 50, y: 8, scale: 0.62, opacity: 0 },
    students: { x: 50, y: 30, scale: 0.95, opacity: 0 },
    texting: { x: 26, y: 72, scale: 0.8, opacity: 0 },
    quiet: { x: 74, y: 72, scale: 0.8, opacity: 0 },
    session: { x: 50, y: 22, scale: 0.5, opacity: 0 },
    limits: { x: 50, y: 50, scale: 1.05, opacity: 1 },
  },
};

/** Which objects carry the chapter, so only they get the emphasis ring. */
const activeNodes: Record<PaperChapterId, StageNode[]> = {
  question: ["question"],
  design: ["students", "texting", "quiet"],
  measurement: ["session"],
  boundaries: ["limits"],
};

const stageNodes: StageNode[] = [
  "halo",
  "question",
  "students",
  "texting",
  "quiet",
  "session",
  "limits",
];

const clampChapter = (next: number) =>
  Math.max(0, Math.min(paperContext.length - 1, next));

/** A local reading aid. Exploring it never submits, awards points or unlocks findings. */
export function PaperStory({ reduced }: { reduced?: boolean }) {
  const savedReduced = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    () => true,
  );
  return (
    <SceneMotion reduced={reduced ?? savedReduced}>
      <Story />
    </SceneMotion>
  );
}

function Story() {
  const [index, setIndex] = useState(0);
  const panel = useId();
  const motion = useSceneMotion();
  const stage = useRef<HTMLDivElement>(null);
  const size = useStageSize(stage);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const chapter = paperContext[index]!;
  const last = paperContext.length - 1;
  const narrow = size.width > 0 && size.width < 560;
  const layout = (narrow ? compact : wide)[chapter.id];
  const active = new Set(activeNodes[chapter.id]);

  /** Functional updates keep batched, reversed activations honest. */
  const move = useCallback((next: number) => setIndex(clampChapter(next)), []);
  const step = useCallback((delta: number) => {
    setIndex((current) => clampChapter(current + delta));
  }, []);

  return (
    <section
      className="paper-story"
      aria-label="Paper context"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      <div className="story-topline">
        <span>THE PAPER, IN CONTEXT</span>
        <span>Schematic</span>
      </div>
      <nav className="story-rail" aria-label="Story chapters">
        {paperContext.map((item, itemIndex) => (
          <m.button
            key={item.id}
            type="button"
            className="story-chip"
            aria-pressed={itemIndex === index}
            aria-controls={panel}
            onClick={() => move(itemIndex)}
            data-scene-motion-control
            {...motion.gestures()}
          >
            {item.label}
          </m.button>
        ))}
        <m.span
          className="story-rail-progress"
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: (index + 1) / paperContext.length }}
          transition={motion.swap}
        />
      </nav>
      <div
        ref={stage}
        className="story-stage"
        data-chapter={chapter.id}
        aria-hidden="true"
        onTouchStart={(event) => {
          const point = event.touches[0];
          touch.current = point ? { x: point.clientX, y: point.clientY } : null;
        }}
        onTouchEnd={(event) => {
          const start = touch.current;
          const point = event.changedTouches[0];
          touch.current = null;
          if (!start || !point) return;
          const dx = point.clientX - start.x;
          const dy = point.clientY - start.y;
          if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
          step(dx < 0 ? 1 : -1);
        }}
      >
        {stageNodes.map((id) => {
          const place = layout[id];
          return (
            <m.div
              key={id}
              className={`story-node story-node-${id}${active.has(id) ? " is-active" : ""}`}
              initial={false}
              animate={{
                x: (place.x / 100) * size.width,
                y: (place.y / 100) * size.height,
                scale: place.scale,
                opacity: place.opacity,
              }}
              transition={motion.swap}
            >
              <div className="story-node-body">
                <NodeContent id={id} />
              </div>
            </m.div>
          );
        })}
      </div>
      <div
        id={panel}
        className="story-caption"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <PresenceBlock key={chapter.id} className="story-caption-inner">
            <m.div
              initial={motion.still ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={
                motion.still
                  ? { opacity: 1 }
                  : { opacity: 0, y: -4, transition: { duration: 0.14 } }
              }
              transition={motion.swap}
            >
              <span className="story-kicker">{chapter.kicker}</span>
              <div className="story-narration">
                <Mascot pose="guiding" size="small" />
                <p>{chapter.narration}</p>
              </div>
              <h3>{chapter.title}</h3>
              <p className="story-lede">{chapter.caption}</p>
              <details className="story-more">
                <summary>{chapter.deepLabel}</summary>
                <p>{chapter.deep}</p>
                <p className="story-caution">{chapter.caution}</p>
                <p className="story-source">{chapter.source}</p>
              </details>
            </m.div>
          </PresenceBlock>
        </AnimatePresence>
      </div>
      <div className="story-footer">
        <button
          type="button"
          className="story-step"
          onClick={() => step(-1)}
          disabled={index === 0}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </button>
        <span className="story-count">
          {String(index + 1).padStart(2, "0")} / {String(paperContext.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          className="story-step"
          onClick={() => step(1)}
          disabled={index === last}
        >
          Next <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="context-findings-lock">
        <LockKeyhole size={15} aria-hidden="true" />
        <span>Findings stay hidden until the results stage.</span>
      </div>
    </section>
  );
}

function NodeContent({ id }: { id: StageNode }) {
  switch (id) {
    case "halo":
      return <span className="story-halo" />;
    case "question":
      return (
        <div className="story-card story-question">
          <MessageSquare size={16} aria-hidden="true" />
          <strong>Does texting during a lecture change quiz scores?</strong>
        </div>
      );
    case "students":
      return (
        <div className="story-card story-cohort">
          <span className="story-avatars">
            {Array.from({ length: 6 }, (_, person) => (
              <i key={person} />
            ))}
          </span>
          <strong>56 students</strong>
          <small>randomly assigned</small>
          <span className="story-legs" />
        </div>
      );
    case "texting":
      return (
        <div className="story-card story-condition">
          <MessageSquare size={17} aria-hidden="true" />
          <strong>Texting</strong>
          <small>during the lecture</small>
        </div>
      );
    case "quiet":
      return (
        <div className="story-card story-condition">
          <BookOpen size={17} aria-hidden="true" />
          <strong>No texting</strong>
          <small>same lecture</small>
        </div>
      );
    case "session":
      return (
        <div className="story-card story-session">
          <span>
            <Clock3 size={13} aria-hidden="true" />
            <strong>30 min</strong>
            <small>lecture</small>
          </span>
          <i aria-hidden="true" />
          <span>
            <Clock3 size={13} aria-hidden="true" />
            <strong>10 min</strong>
            <small>distractor</small>
          </span>
          <i aria-hidden="true" />
          <span>
            <FileText size={13} aria-hidden="true" />
            <strong>9 items</strong>
            <small>quiz</small>
          </span>
        </div>
      );
    case "limits":
      return (
        <div className="story-card story-limits">
          <span>
            <ShieldCheck size={13} aria-hidden="true" /> One university
          </span>
          <span>
            <ShieldCheck size={13} aria-hidden="true" /> Prescribed texts
          </span>
        </div>
      );
  }
}

/** Stage size in CSS pixels, so chapter layouts can animate as transforms. */
function useStageSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () =>
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      });
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
