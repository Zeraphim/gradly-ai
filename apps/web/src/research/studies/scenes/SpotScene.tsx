import { Highlighter } from "lucide-react";
import type { SceneItem, SceneOf } from "@paperquest/contracts";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";
import type { TapProps } from "./TapNode.js";

type Spot = SceneOf<"spot">;

/**
 * A procedure or argument read line by line, like a numbered methods
 * excerpt. Each passage is a phrase the learner can highlight: with tap
 * answers it is the answer itself, otherwise it opens a note on what that
 * step means.
 */
export function SpotScene({
  scene,
  draft,
  onDraft,
  tap,
}: {
  scene: Spot;
  draft: SceneDraft;
  onDraft: (draft: SceneDraft) => void;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const open = scene.passages.find((p) => p.id === draft.inspectedId) ?? null;
  const passage = (item: SceneItem, i: number) => {
    const response = tap?.targets.get(item.id);
    if (tap && response) {
      const active = tap.selected.includes(response.optionId);
      const mark = tap.marks[response.optionId];
      return (
        <button
          key={item.id}
          type="button"
          role={tap.multiple ? "checkbox" : "radio"}
          aria-checked={active}
          aria-label={`${response.label}: ${item.label}`}
          data-scene-node={item.id}
          data-option={response.optionId}
          disabled={tap.disabled}
          className={`study-spot-passage answer ${active ? "selected" : ""} ${mark ?? ""}`}
          onClick={() => tap.onToggle(response.optionId)}
        >
          {item.label}
        </button>
      );
    }
    if (tap)
      return (
        <span key={item.id} className="study-spot-passage plain">
          {item.label}
        </span>
      );
    const expanded = draft.inspectedId === item.id;
    return (
      <button
        key={item.id}
        type="button"
        aria-expanded={expanded}
        aria-controls={expanded ? `spot-note-${item.id}` : undefined}
        data-scene-node={item.id}
        className={`study-spot-passage inspect ${expanded ? "selected" : ""}`}
        onClick={() =>
          onDraft({ ...draft, inspectedId: expanded ? null : item.id })
        }
        style={{ animationDelay: `${motion.stagger(i)}s` }}
      >
        {item.label}
      </button>
    );
  };
  return (
    <div className="study-spot">
      <ol className="study-spot-text" aria-label="Passages">
        {scene.passages.map((item, i) => (
          <li key={item.id}>
            <span className="study-spot-line" aria-hidden="true">
              {i + 1}
            </span>
            <span className="study-spot-copy">{passage(item, i)}</span>
          </li>
        ))}
      </ol>
      {tap ? null : (
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <m.aside
              key={open.id}
              id={`spot-note-${open.id}`}
              className="study-spot-note"
              data-scene-layout
              initial={motion.still ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={motion.exit}
              transition={motion.swap}
            >
              <Highlighter size={15} aria-hidden="true" />
              <span>
                <strong>{open.label}</strong>
                {open.detail}
              </span>
            </m.aside>
          ) : (
            <m.p
              key="hint"
              className="study-scene-note"
              initial={motion.still ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motion.swap}
            >
              Highlight a passage to see what it means here.
            </m.p>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
