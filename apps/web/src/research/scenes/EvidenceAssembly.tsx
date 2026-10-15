import type { SceneItem } from "@paperquest/contracts";
import { Link2 } from "lucide-react";
import {
  AnimatePresence,
  PresenceBlock,
  m,
  useSceneMotion,
} from "./scene-motion.js";

export function EvidenceAssembly({
  anchors,
  pinnedIds,
}: {
  anchors: SceneItem[];
  pinnedIds: string[];
}) {
  const motion = useSceneMotion();
  const items = pinnedIds.flatMap((id) => {
    const item = anchors.find((anchor) => anchor.id === id);
    return item ? [item] : [];
  });
  return (
    <m.div
      data-scene-layout
      layout={motion.layout}
      className="scene-assembly-slot"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {items.length ? (
          <PresenceBlock
            key="assembly"
            data-scene-layout
            layout={motion.position}
            className="scene-assembly"
            aria-label="Your evidence assembly"
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
          >
            <span className="scene-caption">
              Your evidence connections · exploration, not assessed
            </span>
            <m.ol data-scene-layout layout={motion.position}>
              <AnimatePresence initial={false} mode="popLayout">
                {items.map((item) => (
                  <m.li
                    key={item.id}
                    data-scene-layout
                    layout={motion.position}
                    initial={motion.enter}
                    animate={{ opacity: 1, y: 0 }}
                    exit={motion.exit}
                    transition={motion.copy}
                  >
                    <Link2 size={14} aria-hidden="true" />
                    {item.label}
                  </m.li>
                ))}
              </AnimatePresence>
            </m.ol>
          </PresenceBlock>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}
