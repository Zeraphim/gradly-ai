import { Check, RotateCcw } from "lucide-react";
import { AnimatePresence, m, useSceneMotion } from "../scenes/scene-motion.js";
import { TermText } from "../terms/Terms.js";

export type ChoiceMark = "best" | "missed" | "tried" | undefined;

/**
 * Native radio or checkbox answers in card or pill form. Selection is immediate;
 * motion only acknowledges the press and the checked indicator.
 */
export function ResponseChoices({
  name,
  options,
  multiple,
  selected,
  disabled,
  marks,
  pills,
  onChange,
}: {
  name: string;
  options: { id: string; text: string }[];
  multiple: boolean;
  selected: string[];
  disabled: boolean;
  marks: Record<string, ChoiceMark>;
  pills: boolean;
  onChange: (selected: string[]) => void;
}) {
  const motion = useSceneMotion();
  return (
    <fieldset
      className={`study-choices ${pills ? "as-pills" : "as-cards"}`}
      disabled={disabled}
    >
      <legend className="sr-only">
        {multiple ? "Choose all answers that apply" : "Choose one answer"}
      </legend>
      {options.map((option, i) => {
        const active = selected.includes(option.id);
        const mark = marks[option.id];
        return (
          <m.label
            key={option.id}
            data-scene-motion-control
            data-option={option.id}
            className={`study-choice ${active ? "selected" : ""} ${mark ?? ""}`}
            style={{ borderRadius: pills ? 999 : 16 }}
            {...motion.gestures(disabled)}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option.id}
              checked={active}
              onChange={() =>
                onChange(
                  multiple
                    ? active
                      ? selected.filter((id) => id !== option.id)
                      : [...selected, option.id]
                    : [option.id],
                )
              }
            />
            <span className="study-choice-key" aria-hidden="true">
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
                    i + 1
                  )}
                </m.span>
              </AnimatePresence>
            </span>
            <span className="study-choice-text">
              {/* One inline run, so term marks flow within the grid cell. */}
              <span>
                <TermText text={option.text} passive />
              </span>
            </span>
            {mark === "best" ? (
              <span className="study-tag best">
                <Check size={13} strokeWidth={3} aria-hidden="true" /> Best
                answer
              </span>
            ) : mark === "tried" ? (
              <span className="study-tag tried">
                <RotateCcw size={13} aria-hidden="true" /> First try
              </span>
            ) : null}
          </m.label>
        );
      })}
    </fieldset>
  );
}
