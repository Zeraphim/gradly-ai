import { Users } from "lucide-react";
import type { TimelineScene as Timeline } from "../types.js";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import { TapNode, type TapProps } from "./TapNode.js";

/** Waves on one time axis. A reported n draws a bar so attrition is visible at a glance. */
export function TimelineScene({
  scene,
  tap,
}: {
  scene: Timeline;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const largest = Math.max(...scene.events.map((event) => event.n ?? 0), 1);
  return (
    <m.ol
      data-scene-layout
      layout={motion.position}
      className={`study-timeline ${scene.events.length <= 4 ? "across" : ""}`}
      style={{ "--events": scene.events.length } as React.CSSProperties}
    >
      <AnimatePresence initial={false}>
        {scene.events.map((event, i) => {
          const body = (
            <>
              <span className="study-timeline-when">{event.when}</span>
              <strong>{event.label}</strong>
              <span className="study-timeline-detail">{event.detail}</span>
              {event.n !== undefined ? (
                <span className="study-timeline-n">
                  <span className="study-timeline-n-label">
                    <Users size={14} aria-hidden="true" />n ={" "}
                    {event.n.toLocaleString()}
                  </span>
                  <span className="study-timeline-n-track" aria-hidden="true">
                    <m.span
                      data-scene-bar={event.n / largest}
                      style={{ originX: 0 }}
                      initial={motion.canEnter() ? { scaleX: 0 } : false}
                      animate={{ scaleX: event.n / largest }}
                      transition={motion.chart}
                    />
                  </span>
                </span>
              ) : null}
            </>
          );
          return (
            <m.li
              key={event.id}
              data-scene-layout
              layout={motion.position}
              className={`study-timeline-event ${event.at !== "setup" ? "unlocked" : ""}`}
              initial={motion.enter}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...motion.copy,
                delay: motion.still ? 0 : i * 0.03,
              }}
            >
              <span className="study-timeline-dot" aria-hidden="true" />
              {tap?.targets.has(event.id) ? (
                <TapNode {...tap} id={event.id} label={event.label}>
                  {body}
                </TapNode>
              ) : (
                <div className="study-timeline-card">{body}</div>
              )}
            </m.li>
          );
        })}
      </AnimatePresence>
    </m.ol>
  );
}
