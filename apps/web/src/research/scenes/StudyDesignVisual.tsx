import { useLayoutEffect } from "react";
import { ClipboardList, Hand, Shuffle, UsersRound } from "lucide-react";
import { animate, useMotionValue } from "motion/react";
import { m, useSceneMotion } from "./scene-motion.js";
import "./study-design.css";

export type StudyDesignPlan = {
  id: string;
  title: string;
  grouping: "observe" | "assign" | "choose";
  groups: readonly [string, string];
  outcome: string;
  description: string;
};

const rules = [
  { id: "observe", label: "Observe groups", Icon: ClipboardList },
  { id: "assign", label: "Chance assigns", Icon: Shuffle },
  { id: "choose", label: "People choose", Icon: Hand },
] as const;

/** A persistent schematic. Paper-specific content stays outside the renderer. */
export function StudyDesignVisual({
  plan,
  source,
  participantsLabel = "Participants",
}: {
  plan?: StudyDesignPlan;
  participantsLabel?: string;
  source?: { summary: string; citation: string; href: string };
}) {
  const index = rules.findIndex((rule) => rule.id === plan?.grouping);
  const routeX = index < 0 ? 300 : 100 + index * 200;
  return (
    <figure
      className="quest-figure study-design"
      aria-label="Study design preview"
    >
      <div className="study-design-heading">
        <span>Build the comparison</span>
        <strong>
          {plan ? `Plan ${plan.id} · ${plan.title}` : "Your study plan"}
        </strong>
      </div>
      <div
        className="study-design-network"
        aria-hidden="true"
        data-plan={plan?.id ?? "none"}
      >
        <svg viewBox="0 0 600 210" preserveAspectRatio="none">
          <DesignLink
            d={`M300 44 C300 56 ${routeX} 56 ${routeX} 68`}
            active={!!plan}
          />
          <DesignLink
            d={`M${routeX} 122 C${routeX} 134 150 134 150 146`}
            active={!!plan}
          />
          <DesignLink
            d={`M${routeX} 122 C${routeX} 134 450 134 450 146`}
            active={!!plan}
          />
        </svg>
        <div className="study-design-source">
          <UsersRound size={19} /> {participantsLabel}
        </div>
        {rules.map(({ id, label, Icon }, i) => (
          <div
            key={id}
            className={`study-design-rule${plan?.grouping === id ? " is-active" : ""}`}
            style={{ gridColumn: `${i * 2 + 1} / span 2` }}
          >
            <Icon size={19} />
            <span>{label}</span>
          </div>
        ))}
        {[0, 1].map((i) => (
          <div
            className={`study-design-group${i === 0 ? " is-text" : ""}`}
            key={i}
          >
            <span className="study-design-group-mark">
              <UsersRound size={23} />
            </span>
            <span>
              {plan?.groups[i] ?? (i === 0 ? "First group" : "Second group")}
            </span>
          </div>
        ))}
      </div>
      <div className="study-design-outcome">
        <span>What gets measured</span>
        <strong>{plan?.outcome ?? "Depends on the proposed study"}</strong>
      </div>
      <figcaption>
        <p role="status" aria-live="polite" aria-atomic="true">
          {plan?.description ??
            "Choose an approach to see how its groups form and what gets measured."}
        </p>
        <span>Schematic only. Shapes do not represent participant counts.</span>
      </figcaption>
      {source ? (
        <div className="study-design-source-note">
          <strong>What the researchers did</strong>
          <p>{source.summary}</p>
          <a href={source.href} target="_blank" rel="noopener noreferrer">
            {source.citation}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : null}
    </figure>
  );
}

function DesignLink({ d, active }: { d: string; active: boolean }) {
  const motion = useSceneMotion();
  const path = useMotionValue(d);
  // Cancel the prior target on reversal. A live motion preference also stops
  // the active path animation and sets its complete explanatory state in place.
  useLayoutEffect(() => {
    if (motion.still) {
      path.set(d);
      return;
    }
    const playback = animate(path, d, motion.connection);
    return () => playback.stop();
  }, [d, motion.still, path]);
  return <m.path d={path} className={active ? "is-active" : undefined} />;
}
