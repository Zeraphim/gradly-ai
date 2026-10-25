import { Mascot } from "../components/Mascot.js";
import type { ProcessingJob } from "./types.js";
import { Icon, type IconName } from "./icon.js";
import { m, sceneStagger, useSceneMotion } from "./scenes/scene-motion.js";
import { Burst } from "./studies/Burst.js";

/**
 * The moment preparation finishes: one burst behind the celebrating mascot and
 * what the learner is about to play, as counts. The burst only plays when the
 * job becomes ready on this page, never when a ready job is reopened.
 */
export function ReadyHandoff({
  job,
  celebrate: live,
}: {
  job: ProcessingJob;
  /** True only when the job became ready while this page was open. */
  celebrate: boolean;
}) {
  const motion = useSceneMotion();
  const celebrate = live && motion.canEnter();
  const outline = job.outline;
  const tiles: { icon: IconName; value: string; label: string }[] = [
    {
      icon: "layout",
      value: String(outline?.challenges ?? "–"),
      label: "challenges",
    },
    ...(outline?.bonus
      ? [{ icon: "sparkle" as const, value: "+1", label: "bonus" }]
      : []),
    {
      icon: "research",
      value: String(job.evidence.length),
      label: "evidence passages",
    },
    ...(outline?.reasoning
      ? [
          {
            icon: "coach" as const,
            value: String(outline.reasoning),
            label: "explain your thinking",
          },
        ]
      : []),
  ];
  return (
    <section className="prep-ready" aria-label="Your study is ready">
      <div className="prep-ready-celebrate">
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
      <ul className="prep-ready-tiles">
        {tiles.map((tile, i) => (
          <m.li
            key={tile.label}
            initial={celebrate ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={
              motion.still
                ? { duration: 0 }
                : { ...motion.copy, delay: 0.25 + i * sceneStagger }
            }
          >
            <Icon name={tile.icon} size={18} strong />
            <strong>{tile.value}</strong>
            <span>{tile.label}</span>
          </m.li>
        ))}
      </ul>
      <p className="prep-ready-note">
        Make each research decision before you see the findings. The paper is
        revealed at the end.
      </p>
    </section>
  );
}
