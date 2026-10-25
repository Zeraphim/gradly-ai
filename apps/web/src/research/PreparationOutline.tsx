import { useEffect, useRef } from "react";
import type { ProcessingJob } from "./types.js";
import { Icon, type IconName } from "./icon.js";
import { AnimatePresence, m, useSceneMotion } from "./scenes/scene-motion.js";

type Item = { key: string; icon: IconName; done: boolean; label: string };

/**
 * "Your study so far": what the saved job has actually produced, as counts
 * only. No item names a finding, a challenge or the paper, so nothing here can
 * spoil a decision. Finished items stay; only the next pending one is shown.
 * The page count already sits in the file line above, so it is not repeated.
 */
export function outlineItems(job: ProcessingJob): Item[] {
  const ready = job.status === "ready";
  const reached = (stage: number) => ready || job.stage > stage;
  const evidence = job.evidence.length;
  const outline = job.outline;
  const items: Item[] = [
    {
      key: "evidence",
      icon: "research",
      done: reached(0),
      label: reached(0)
        ? `${evidence} evidence ${evidence === 1 ? "passage" : "passages"} found`
        : "Finding evidence passages",
    },
    {
      key: "lesson",
      icon: "layout",
      done: !!outline,
      label: outline
        ? `${outline.challenges} challenges drafted${outline.bonus ? " + a bonus" : ""}`
        : "Drafting your challenges",
    },
  ];
  if (outline?.reasoning)
    items.push({
      key: "reasoning",
      icon: "coach",
      done: true,
      label: `${outline.reasoning} ${outline.reasoning === 1 ? "asks" : "ask"} you to explain your thinking`,
    });
  items.push(
    {
      key: "checked",
      icon: "verify",
      done: reached(2),
      label: reached(2) ? "Methods checked" : "Checking the research methods",
    },
    {
      key: "verified",
      icon: "shield",
      done: ready,
      label: ready
        ? "Every quote matched to your PDF"
        : "Matching every quote to your PDF",
    },
  );
  const next = items.findIndex((item) => !item.done);
  return items.filter((item, i) => item.done || i === next);
}

export function PreparationOutline({ job }: { job: ProcessingJob }) {
  const motion = useSceneMotion();
  // The first render is the saved state; only later changes pop in.
  const settled = useRef(false);
  useEffect(() => {
    settled.current = true;
  }, []);
  const failed = job.status === "failed" || job.status === "review";
  const items = outlineItems(job).filter((item) => item.done || !failed);
  return (
    <section className="prep-outline" aria-labelledby="prep-outline-title">
      <h2 id="prep-outline-title">Your study so far</h2>
      <ul>
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <m.li
              key={`${item.key}-${item.done}`}
              layout={motion.position}
              className={item.done ? "is-done" : "is-pending"}
              // Only a live change pops in; a restored page starts settled.
              initial={
                settled.current && motion.canEnter()
                  ? { opacity: 0, scale: 0.85, y: 6 }
                  : false
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={
                motion.still
                  ? { duration: 0 }
                  : { type: "spring", duration: 0.42, bounce: 0.35 }
              }
            >
              <span className="prep-outline-mark" aria-hidden="true">
                <Icon name={item.done ? "check" : item.icon} size={14} strong />
              </span>
              {item.label}
              {item.done ? null : (
                <span className="sr-only"> (in progress)</span>
              )}
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
