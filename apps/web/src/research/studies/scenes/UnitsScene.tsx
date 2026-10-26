import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import type { UnitsScene as Units } from "../types.js";
import { TapNode, type TapProps } from "./TapNode.js";

/** Dots drawn per level. Larger counts scale each dot and say so. */
const DOTS = 40;
export const roleLabels = {
  assigned: "Assigned",
  sampled: "Sampled",
  measured: "Measured",
  analysed: "Analysed",
} as const;

/** How many units each drawn dot stands for, so large counts stay readable. */
export function dotScale(count: number) {
  return count <= DOTS ? 1 : Math.ceil(count / DOTS);
}

/**
 * Nested units, outermost first: what was assigned or sampled, what was measured
 * and what was analysed. Small counts draw one dot per unit, so "only six" is visible.
 * After an attempt, a derived ratio shows how many lower units share one upper.
 */
export function UnitsScene({
  scene,
  answered,
  tap,
}: {
  scene: Units;
  answered: boolean;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  return (
    <m.ol data-scene-layout layout={motion.position} className="study-units">
      <AnimatePresence initial={false}>
        {scene.levels.map((level, i) => {
          const per = dotScale(level.count);
          const drawn = Math.min(DOTS, Math.ceil(level.count / per));
          const above = scene.levels[i - 1];
          const body = (
            <span className="study-unit-body">
              <span className="study-unit-head">
                <span className={`study-unit-role role-${level.role}`}>
                  {roleLabels[level.role]}
                </span>
                <span className="study-unit-count">
                  <strong>{level.count.toLocaleString()}</strong> {level.unit}
                </span>
              </span>
              <span className="study-unit-label">
                <strong>{level.label}</strong>
                <span className="study-tap-detail">{level.detail}</span>
              </span>
              <span className="study-unit-dots" aria-hidden="true">
                {Array.from({ length: drawn }, (_, d) => (
                  <m.span
                    key={d}
                    className={`study-unit-dot role-${level.role}`}
                    initial={
                      motion.canEnter() ? { scale: 0, opacity: 0 } : false
                    }
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      ...motion.chart,
                      delay: motion.canEnter() ? d * 0.008 : 0,
                    }}
                  />
                ))}
              </span>
              {per > 1 ? (
                <span className="study-scene-note">
                  Each dot stands for about {per.toLocaleString()} {level.unit}.
                </span>
              ) : null}
            </span>
          );
          return (
            <m.li
              key={level.id}
              data-scene-layout
              layout={motion.position}
              className="study-unit"
              initial={motion.enter}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...motion.copy, delay: motion.stagger(i) }}
            >
              {above ? (
                <span className="study-unit-link" aria-hidden={!answered}>
                  <ChevronDown size={16} aria-hidden="true" />
                  {answered && level.count >= above.count ? (
                    <m.span
                      initial={motion.still ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={motion.copy}
                    >
                      about{" "}
                      {Math.round(level.count / above.count).toLocaleString()}{" "}
                      {level.unit} per {singular(above.unit)} (derived)
                    </m.span>
                  ) : null}
                </span>
              ) : null}
              {tap?.targets.has(level.id) ? (
                <TapNode {...tap} id={level.id} label={level.label}>
                  {body}
                </TapNode>
              ) : (
                <div className="study-unit-card">{body}</div>
              )}
            </m.li>
          );
        })}
      </AnimatePresence>
    </m.ol>
  );
}

/** "bus lines" → "bus line" for the ratio sentence; unknown plurals stay as written. */
function singular(unit: string) {
  return unit.endsWith("ies")
    ? `${unit.slice(0, -3)}y`
    : unit.endsWith("s") && !unit.endsWith("ss")
      ? unit.slice(0, -1)
      : unit;
}
