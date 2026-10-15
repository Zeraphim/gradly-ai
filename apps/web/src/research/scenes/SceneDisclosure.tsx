import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  AnimatePresence,
  PresenceBlock,
  SceneMotion,
  m,
  useSceneMotion,
} from "./scene-motion.js";

export function SceneDisclosure({
  title,
  children,
  reduced,
  className = "card",
}: {
  title: ReactNode;
  children: ReactNode;
  reduced: boolean;
  className?: string;
}) {
  return (
    <SceneMotion reduced={reduced}>
      <DisclosureContent title={title} className={className}>
        {children}
      </DisclosureContent>
    </SceneMotion>
  );
}
function DisclosureContent({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className: string;
}) {
  const motion = useSceneMotion();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const id = useId();
  const close = () => {
    if (content.current?.contains(document.activeElement))
      trigger.current?.focus({ preventScroll: true });
    setOpen(false);
  };
  return (
    <m.section
      data-scene-layout
      layout={motion.layout}
      className={`${className} scene-disclosure`}
      style={{ borderRadius: 16 }}
      data-disclosure
    >
      <m.h2
        data-scene-layout
        layout={motion.position}
        className="scene-disclosure-heading"
      >
        <m.button
          ref={trigger}
          id={`${id}-trigger`}
          type="button"
          data-scene-layout
          layout={motion.position}
          data-scene-motion-control
          className="scene-disclosure-trigger"
          aria-expanded={open}
          aria-controls={`${id}-content`}
          {...motion.gestures()}
          onClick={() => (open ? close() : setOpen(true))}
        >
          {title}
          <m.span
            data-scene-settle
            data-scene-rotate={open ? 180 : 0}
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={motion.copy}
          >
            <ChevronDown size={18} />
          </m.span>
        </m.button>
      </m.h2>
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <PresenceBlock
            ref={content}
            key="content"
            data-scene-layout
            layout={motion.position}
            id={`${id}-content`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            className="scene-disclosure-content"
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            exit={motion.exit}
            transition={motion.copy}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                close();
              }
            }}
          >
            {children}
          </PresenceBlock>
        ) : null}
      </AnimatePresence>
    </m.section>
  );
}
