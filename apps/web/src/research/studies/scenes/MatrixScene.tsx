import { Equal, EqualNot } from "lucide-react";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import type { MatrixScene as Matrix } from "../types.js";
import { TapNode, type TapProps } from "./TapNode.js";

/** Distinct values a feature row takes across the conditions. */
export function rowLevels(cells: string[]) {
  return new Set(cells.map((cell) => cell.trim().toLowerCase())).size;
}

/** "Same", "Differs" for two conditions, otherwise how the row splits them. */
export function rowVerdict(cells: string[]) {
  const levels = rowLevels(cells);
  if (levels === 1) return "Same";
  if (cells.length === 2) return "Differs";
  return levels === cells.length ? "All differ" : `${levels} levels`;
}

/**
 * Conditions side by side, one row per feature, so a learner can spot what else
 * changed besides the intended manipulation. Same/differs markers are derived
 * from the cells and appear only after an attempt, so they cannot answer for
 * the learner.
 */
export function MatrixScene({
  scene,
  answered,
  tap,
}: {
  scene: Matrix;
  answered: boolean;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const columns = {
    "--conditions": scene.conditions.length,
  } as React.CSSProperties;
  return (
    <m.div
      data-scene-layout
      layout={motion.position}
      className={`study-matrix ${scene.conditions.length > 2 ? "many" : ""}`}
      style={columns}
    >
      <div className="study-matrix-head" aria-hidden="true">
        <span />
        {scene.conditions.map((condition) => (
          <span key={condition.id}>{condition.label}</span>
        ))}
      </div>
      <ul className="study-matrix-rows">
        <AnimatePresence initial={false}>
          {scene.rows.map((row, i) => {
            const differs = rowLevels(row.cells) > 1;
            const body = (
              <span className="study-matrix-row">
                <span className="study-matrix-feature">
                  <strong>{row.label}</strong>
                  <span className="study-tap-detail">{row.detail}</span>
                  {answered ? (
                    <m.span
                      className={`study-matrix-verdict ${differs ? "differs" : "same"}`}
                      initial={
                        motion.still ? false : { opacity: 0, scale: 0.8 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...motion.copy, delay: motion.stagger(i) }}
                    >
                      {differs ? (
                        <EqualNot size={13} aria-hidden="true" />
                      ) : (
                        <Equal size={13} aria-hidden="true" />
                      )}
                      {rowVerdict(row.cells)}
                    </m.span>
                  ) : null}
                </span>
                {row.cells.map((cell, c) => (
                  <span
                    key={scene.conditions[c]!.id}
                    className="study-matrix-cell"
                  >
                    <span className="study-matrix-condition">
                      {scene.conditions[c]!.label}
                    </span>
                    {cell}
                  </span>
                ))}
              </span>
            );
            return (
              <m.li
                key={row.id}
                data-scene-layout
                layout={motion.position}
                className={answered && differs ? "differs" : ""}
                initial={motion.enter}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...motion.copy, delay: motion.stagger(i) }}
              >
                {tap?.targets.has(row.id) ? (
                  <TapNode {...tap} id={row.id} label={row.label}>
                    {body}
                  </TapNode>
                ) : (
                  <div className="study-matrix-card">{body}</div>
                )}
              </m.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </m.div>
  );
}
