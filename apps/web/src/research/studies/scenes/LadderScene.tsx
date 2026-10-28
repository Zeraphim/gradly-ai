import { ArrowUp, Flag } from "lucide-react";
import type { SceneOf } from "@paperquest/contracts";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import { TapNode, type TapProps } from "./TapNode.js";

type Ladder = SceneOf<"ladder">;

/** Rungs above the supported claim, which the paper's evidence does not reach. */
export function beyondReach(scene: Ladder) {
  const at = scene.reach
    ? scene.rungs.findIndex((rung) => rung.id === scene.reach!.rungId)
    : -1;
  return at < 0
    ? new Set<string>()
    : new Set(scene.rungs.slice(at + 1).map((r) => r.id));
}

/**
 * Claims from the most modest to the strongest, drawn bottom to top. After the
 * explanation, the rail fills up to the strongest supported claim and every
 * rung above it turns dashed, so overreach reads at a glance. The reading
 * order stays modest to strong.
 */
export function LadderScene({
  scene,
  tap,
}: {
  scene: Ladder;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const reachIndex = scene.reach
    ? scene.rungs.findIndex((rung) => rung.id === scene.reach!.rungId)
    : -1;
  const beyond = beyondReach(scene);
  const fill =
    reachIndex < 0 ? 0 : (reachIndex + 1) / Math.max(scene.rungs.length, 1);
  return (
    <div className={`study-ladder ${reachIndex >= 0 ? "reached" : ""}`}>
      <div className="study-ladder-rail" aria-hidden="true">
        <m.span
          className="study-ladder-fill"
          data-scene-bar={fill}
          initial={false}
          animate={{ scaleY: fill }}
          transition={
            motion.still
              ? { duration: 0 }
              : { type: "spring", duration: 0.7, bounce: 0.15 }
          }
        />
        <ArrowUp className="study-ladder-arrow" size={16} />
      </div>
      <ol
        className="study-ladder-rungs"
        aria-label="Claims from modest to strong"
      >
        {scene.rungs.map((rung, i) => {
          const isReach = i === reachIndex;
          const over = beyond.has(rung.id);
          const body = (
            <span className="study-ladder-body">
              <span className="study-ladder-step" aria-hidden="true">
                {i + 1}
              </span>
              <span className="study-ladder-copy">
                <strong>{rung.label}</strong>
                <span className="study-tap-detail">{rung.detail}</span>
                {over ? (
                  <span className="study-ladder-beyond">
                    Beyond what the evidence shows
                  </span>
                ) : null}
              </span>
            </span>
          );
          return (
            <m.li
              key={rung.id}
              data-scene-layout
              layout={motion.position}
              className={`study-ladder-rung ${isReach ? "is-reach" : ""} ${over ? "is-beyond" : ""}`}
              initial={motion.canEnter() ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...motion.copy,
                delay: motion.stagger(i),
              }}
            >
              {tap?.targets.has(rung.id) ? (
                <TapNode {...tap} id={rung.id} label={rung.label}>
                  {body}
                </TapNode>
              ) : (
                <div className="study-ladder-card" data-scene-node={rung.id}>
                  {body}
                </div>
              )}
              <AnimatePresence initial={false}>
                {isReach && scene.reach ? (
                  <m.p
                    key="reach"
                    className="study-ladder-reach"
                    data-scene-settle
                    initial={
                      motion.still ? false : { opacity: 0, x: -8, scale: 0.9 }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      motion.still
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.45, bounce: 0.3 }
                    }
                  >
                    <Flag size={14} aria-hidden="true" />
                    {scene.reach.label}
                  </m.p>
                ) : null}
              </AnimatePresence>
            </m.li>
          );
        })}
      </ol>
    </div>
  );
}
