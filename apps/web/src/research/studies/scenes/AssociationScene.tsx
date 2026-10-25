import type {
  AssociationPair,
  AssociationScene as Association,
} from "../types.js";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";

const symbols = { r: "r", beta: "β", OR: "OR" } as const;
/** Rough benchmarks for correlations, shown as orientation rather than rules. */
const marks = [
  { at: 0.1, label: "small" },
  { at: 0.3, label: "medium" },
  { at: 0.5, label: "large" },
];

/**
 * A reported association without invented raw data: a strength gauge for r or β,
 * a derived variance-explained grid for r, and a ratio scale for odds ratios.
 */
export function AssociationScene({
  scene,
  answered,
}: {
  scene: Association;
  /** Derived r² appears only after Check, so it can't answer the question for the learner. */
  answered: boolean;
}) {
  const motion = useSceneMotion();
  return (
    <m.div
      data-scene-layout
      layout={motion.position}
      className="study-association"
    >
      <AnimatePresence initial={false}>
        {scene.pairs.map((pair) => (
          <m.figure
            key={pair.id}
            data-scene-layout
            layout={motion.position}
            className="study-association-pair"
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            transition={motion.copy}
            aria-label={`${pair.x} and ${pair.y}: ${symbols[pair.statistic]} = ${pair.value}${pair.n ? `, n = ${pair.n}` : ""}`}
          >
            <figcaption>
              <span className="study-association-vars">
                <span>{pair.x}</span>
                <span className="study-association-link" aria-hidden="true">
                  ⟷
                </span>
                <span>{pair.y}</span>
              </span>
              <span className="study-association-stat">
                <strong>
                  {symbols[pair.statistic]} = {pair.value}
                </strong>
                {pair.n ? <small>n = {pair.n.toLocaleString()}</small> : null}
              </span>
            </figcaption>
            {pair.statistic === "OR" ? (
              <RatioScale pair={pair} />
            ) : (
              <Gauge pair={pair} />
            )}
            {pair.statistic === "r" && answered ? (
              <VarianceGrid r={pair.value} />
            ) : null}
            <p className="study-scene-note">{pair.detail}</p>
          </m.figure>
        ))}
      </AnimatePresence>
    </m.div>
  );
}

function Gauge({ pair }: { pair: AssociationPair }) {
  const motion = useSceneMotion();
  const position = ((Math.max(-1, Math.min(1, pair.value)) + 1) / 2) * 100;
  return (
    <div className="study-gauge" aria-hidden="true">
      <div className="study-gauge-track">
        {marks
          .flatMap((mark) => [mark.at, -mark.at])
          .map((at) => (
            <span
              key={at}
              className="study-gauge-tick"
              style={{ left: `${((at + 1) / 2) * 100}%` }}
            />
          ))}
        <span className="study-gauge-zero" />
        <m.span
          className="study-gauge-fill"
          data-scene-bar={1}
          style={{
            originX: pair.value >= 0 ? 0 : 1,
            left: pair.value >= 0 ? "50%" : `${position}%`,
            width: `${Math.abs(position - 50)}%`,
          }}
          initial={motion.canEnter() ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={motion.chart}
        />
        <m.span
          className="study-gauge-marker"
          style={{ left: `${position}%` }}
          initial={motion.canEnter() ? { scale: 0.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={motion.chart}
        />
      </div>
      <div className="study-gauge-labels">
        <span>−1</span>
        {marks.map((mark) => (
          <span key={mark.at} style={{ left: `${((mark.at + 1) / 2) * 100}%` }}>
            {mark.label}
          </span>
        ))}
        <span style={{ left: "50%" }}>0</span>
        <span>+1</span>
      </div>
    </div>
  );
}

/** r² as 100 squares. A partial square shows shares below one percent honestly. */
function VarianceGrid({ r }: { r: number }) {
  const motion = useSceneMotion();
  const share = r * r * 100;
  const whole = Math.floor(share);
  const part = share - whole;
  const percent =
    share < 1
      ? share.toFixed(2)
      : share < 10
        ? share.toFixed(1)
        : share.toFixed(0);
  return (
    <m.div
      className="study-variance"
      data-scene-layout
      layout={motion.position}
      initial={motion.canEnter() ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={motion.copy}
    >
      <div className="study-variance-grid" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} className="study-variance-cell">
            {i < whole || (i === whole && part > 0) ? (
              <m.span
                data-scene-bar={i < whole ? 1 : part}
                style={{ originX: 0 }}
                initial={motion.canEnter() ? { scaleX: 0 } : false}
                animate={{ scaleX: i < whole ? 1 : part }}
                transition={motion.chart}
              />
            ) : null}
          </span>
        ))}
      </div>
      <p>
        <strong>{percent}%</strong> of the differences in one measure line up
        with the other (r², derived from the reported r).
      </p>
    </m.div>
  );
}

/** Odds ratios on a log scale, so 0.5 and 2 sit the same distance from 1. */
function RatioScale({ pair }: { pair: AssociationPair }) {
  const motion = useSceneMotion();
  const span = Math.max(4, pair.value, 1 / Math.max(pair.value, 0.01));
  const at = (value: number) => 50 + (Math.log(value) / Math.log(span)) * 50;
  return (
    <div className="study-gauge ratio" aria-hidden="true">
      <div className="study-gauge-track">
        <span className="study-gauge-zero" />
        <m.span
          className="study-gauge-marker"
          style={{ left: `${at(pair.value)}%` }}
          initial={motion.canEnter() ? { scale: 0.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={motion.chart}
        />
      </div>
      <div className="study-gauge-labels">
        <span>{(1 / span).toFixed(2)}</span>
        <span style={{ left: "50%" }}>1 · no difference in odds</span>
        <span>{span.toFixed(0)}</span>
      </div>
    </div>
  );
}
