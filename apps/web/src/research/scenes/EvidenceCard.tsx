import { createContext, useContext, useId } from "react";
import type { SceneItem } from "@paperquest/contracts";
import { ScanSearch } from "lucide-react";
import { AnimatePresence, m, useSceneMotion } from "./scene-motion.js";

export const DiagramActivity = createContext<() => void>(() => {});
const provenanceLabels = {
  authored: "Teaching guidance",
  illustration: "Teaching illustration",
  "source-summary": "Source summary",
  reported: "Reported measurement",
  derived: "Derived from reported evidence",
};

export function EvidenceCard({
  item,
  index,
  expanded,
  connected,
  onInspect,
}: {
  item: SceneItem;
  index: number;
  expanded: boolean;
  connected: boolean;
  onInspect: () => void;
}) {
  const motion = useSceneMotion();
  const track = useContext(DiagramActivity);
  const id = useId();
  return (
    <m.button
      type="button"
      data-scene-node={item.id}
      data-scene-motion-control
      data-scene-layout
      layout={motion.layout}
      style={{ borderRadius: 14, overflow: "hidden" }}
      {...motion.gestures()}
      onLayoutAnimationStart={track}
      onHoverStart={motion.hover ? track : undefined}
      onHoverEnd={motion.hover ? track : undefined}
      onTapStart={track}
      onTap={track}
      onTapCancel={track}
      className={`scene-node ${connected ? "connected" : ""} ${expanded ? "inspected" : ""}`}
      aria-label={`Inspect ${item.label}`}
      aria-describedby={`${id}-detail`}
      aria-expanded={expanded}
      onClick={onInspect}
    >
      <m.span
        data-scene-layout
        layout={motion.position}
        className="scene-node-top"
      >
        <span className="scene-step" aria-hidden="true">
          {index + 1}
        </span>
        <ScanSearch size={17} aria-hidden="true" />
      </m.span>
      <m.strong data-scene-layout layout={motion.position}>
        {item.label}
      </m.strong>
      <span id={`${id}-detail`} className="sr-only">
        {expanded
          ? `${item.detail} ${provenanceLabels[item.provenance.kind]}${item.provenance.refs.length ? ` · ${item.provenance.refs.join(", ")}` : ""}`
          : "Tap to inspect"}
      </span>
      <m.span
        className="scene-copy-slot"
        data-scene-layout
        layout={motion.layout}
        aria-hidden="true"
      >
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={expanded ? "detail" : "hint"}
            data-scene-layout
            layout={motion.position}
            className="scene-node-copy"
            data-scene-settle
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
          >
            <span className="scene-node-detail">
              {expanded ? item.detail : "Tap to inspect"}
            </span>
            {expanded ? (
              <span className="scene-caption">
                {provenanceLabels[item.provenance.kind]}
                {item.provenance.refs.length
                  ? ` · ${item.provenance.refs.join(", ")}`
                  : ""}
              </span>
            ) : null}
          </m.span>
        </AnimatePresence>
      </m.span>
    </m.button>
  );
}
