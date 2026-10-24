import type { ReactNode } from "react";
import { Check, Crosshair } from "lucide-react";
import type { SceneResponse } from "@paperquest/contracts";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";

export type TapProps = {
  targets: Map<string, SceneResponse>;
  selected: string[];
  multiple: boolean;
  disabled: boolean;
  marks: Record<string, "best" | "missed" | undefined>;
  onToggle: (optionId: string) => void;
};

/**
 * A diagram element that is also an answer. It keeps the connector contract of
 * `button[data-scene-node]` so flow lines stay attached while it moves.
 */
export function TapNode({
  id,
  label,
  children,
  targets,
  selected,
  multiple,
  disabled,
  marks,
  onToggle,
}: TapProps & { id: string; label: string; children: ReactNode }) {
  const motion = useSceneMotion();
  const response = targets.get(id)!;
  const active = selected.includes(response.optionId);
  const mark = marks[response.optionId];
  return (
    <m.button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={active}
      aria-label={`${response.label}: ${label}`}
      data-scene-node={id}
      data-scene-motion-control
      data-option={response.optionId}
      disabled={disabled}
      className={`study-tap ${active ? "selected" : ""} ${mark ?? ""}`}
      style={{ borderRadius: 16 }}
      {...motion.gestures(disabled)}
      onClick={() => onToggle(response.optionId)}
    >
      <span className="study-tap-mark" aria-hidden="true">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={active ? "on" : "off"}
            data-scene-settle
            initial={motion.still ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: motion.still ? 1 : 0.6 }}
            transition={motion.copy}
          >
            {active && mark !== "missed" ? (
              <Check size={15} strokeWidth={3} />
            ) : (
              <Crosshair size={15} />
            )}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="study-tap-body">{children}</span>
      {mark === "best" ? (
        <span className="study-tag best">Best answer</span>
      ) : null}
    </m.button>
  );
}
