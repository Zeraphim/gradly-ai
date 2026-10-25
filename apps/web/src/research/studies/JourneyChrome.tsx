import { useEffect, useRef, useState } from "react";
import { Star, X } from "lucide-react";
import { ResearchLink as Link } from "../navigation.js";
import { AnimatePresence, m, useSceneMotion } from "../scenes/scene-motion.js";

/** Close, progress and points for a study in progress. */
export function JourneyChrome({
  done,
  total,
  points,
  label,
  closeHref = "/studies",
  closeLabel = "Close study and return to the library",
}: {
  done: number;
  total: number;
  points: number;
  label: string;
  closeHref?: string;
  closeLabel?: string;
}) {
  return (
    <header className="journey-chrome">
      <Link className="journey-close" href={closeHref} aria-label={closeLabel}>
        <X size={22} strokeWidth={2.5} aria-hidden="true" />
      </Link>
      <JourneyProgress done={done} total={total} label={label} />
      <PointsChip points={points} />
    </header>
  );
}

function JourneyProgress({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  const motion = useSceneMotion();
  const share = total ? Math.min(done / total, 1) : 0;
  const previous = useRef(done);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (done > previous.current) setPulse((value) => value + 1);
    previous.current = done;
  }, [done]);
  return (
    <div
      className="journey-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-valuetext={`${done} of ${total} challenges complete`}
    >
      <m.span
        className="journey-progress-fill"
        data-scene-bar={share}
        style={{ originX: 0 }}
        initial={false}
        animate={{ scaleX: share }}
        transition={
          motion.still
            ? { duration: 0 }
            : { type: "spring", duration: 0.5, bounce: 0.18 }
        }
      />
      <AnimatePresence>
        {pulse && !motion.still ? (
          <m.span
            key={pulse}
            className="journey-progress-glint"
            style={{ left: `${share * 100}%` }}
            initial={{ opacity: 0.9, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setPulse(0)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PointsChip({ points }: { points: number }) {
  const motion = useSceneMotion();
  const previous = useRef(points);
  const gained = points > previous.current;
  useEffect(() => {
    previous.current = points;
  }, [points]);
  return (
    <span
      className="journey-points"
      aria-label={`${points} practice points in this study`}
    >
      <Star size={17} strokeWidth={2.5} aria-hidden="true" />
      <m.span
        key={points}
        className="journey-points-value"
        initial={gained && !motion.still ? { scale: 1.35, y: -2 } : false}
        animate={{ scale: 1, y: 0 }}
        transition={
          motion.still
            ? { duration: 0 }
            : { type: "spring", duration: 0.4, bounce: 0.45 }
        }
      >
        {points}
      </m.span>
    </span>
  );
}
