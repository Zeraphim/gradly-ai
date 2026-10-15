import { memo } from "react";
import {
  SceneMotion,
  AnimatePresence,
  m,
  useSceneMotion,
} from "./scene-motion.js";
import { EvidenceAssembly } from "./EvidenceAssembly.js";
import { ComparisonScene } from "./ComparisonScene.js";
import { FlowDiagram } from "./FlowDiagram.js";
import { EvidenceCard } from "./EvidenceCard.js";
import { ArrowDown, ArrowRight, Check, Link2, ScanSearch } from "lucide-react";
import type { Scene, SceneItem } from "@paperquest/contracts";
import "./scenes.css";

export type SceneDraft = {
  inspectedId: string | null;
  prediction: string | null;
  pinnedIds?: string[];
  revealed?: boolean;
};
export const emptySceneDraft: SceneDraft = {
  inspectedId: null,
  prediction: null,
};
type Props = {
  scene: Scene;
  options: { id: string; text: string }[];
  multiple: boolean;
  selected: string[];
  firstSelection: string[];
  disabled: boolean;
  answered: boolean;
  reduced: boolean;
  draft: SceneDraft;
  onDraft: (draft: SceneDraft) => void;
  onSelect: (ids: string[]) => void;
};

/** A data-only scene renderer. Assessment and progression remain outside this component. */
export const InvestigationScene = memo(function InvestigationScene(
  props: Props,
) {
  return (
    <SceneMotion reduced={props.reduced}>
      <SceneContent {...props} />
    </SceneMotion>
  );
});
function SceneContent(props: Props) {
  const { scene, draft, onDraft } = props;
  const motion = useSceneMotion();
  const targets = new Set(
    scene.responses
      .filter((r) => props.selected.includes(r.optionId))
      .flatMap((r) => r.targetIds),
  );
  const inspect = (id: string) =>
    onDraft({ ...draft, inspectedId: draft.inspectedId === id ? null : id });
  const tile = (item: SceneItem, index: number) => (
    <EvidenceCard
      key={item.id}
      item={item}
      index={index}
      expanded={draft.inspectedId === item.id}
      connected={targets.has(item.id)}
      onInspect={() => inspect(item.id)}
    />
  );
  return (
    <>
      <m.section
        data-scene-layout
        layout={motion.layout}
        style={{ borderRadius: 24 }}
        className={`investigation-scene scene-${scene.kind}`}
        aria-label={scene.title}
      >
        <m.header
          data-scene-layout
          layout={motion.position}
          className="scene-heading"
        >
          <span className="scene-eyebrow">
            <ScanSearch size={15} aria-hidden="true" /> Interactive
            investigation
          </span>
          <h2>{scene.title}</h2>
          <p>{scene.instruction}</p>
        </m.header>
        <p className="sr-only">{scene.description}</p>
        <m.div
          data-scene-layout
          layout={motion.layout}
          className="scene-workspace"
        >
          {scene.kind === "flow" ? (
            <>
              <FlowDiagram
                scene={scene}
                tile={tile}
                inspectedId={draft.inspectedId}
                targets={targets}
              />
              <ul className="scene-relations" aria-label="Study relationships">
                {scene.edges.map((edge) => (
                  <li key={`${edge.from}-${edge.to}`}>
                    <span>
                      {scene.nodes.find((n) => n.id === edge.from)?.label}
                    </span>
                    <ArrowRight size={14} aria-hidden="true" />
                    <strong>{edge.label}</strong>
                    <span>
                      {scene.nodes.find((n) => n.id === edge.to)?.label}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {scene.kind === "connections" ? (
            <>
              <m.div
                data-scene-layout
                layout={motion.position}
                className="scene-anchors"
              >
                {scene.anchors.map((item, i) => (
                  <m.div
                    key={item.id}
                    data-scene-layout
                    layout={motion.position}
                  >
                    {tile(item, i)}
                    <m.label
                      data-scene-layout
                      layout={motion.position}
                      className="scene-pin"
                      data-scene-motion-control
                      {...motion.gestures()}
                    >
                      <input
                        type="checkbox"
                        checked={(draft.pinnedIds ?? []).includes(item.id)}
                        onChange={() =>
                          onDraft({
                            ...draft,
                            pinnedIds: (draft.pinnedIds ?? []).includes(item.id)
                              ? (draft.pinnedIds ?? []).filter(
                                  (id) => id !== item.id,
                                )
                              : [...(draft.pinnedIds ?? []), item.id],
                          })
                        }
                      />
                      Use in my reasoning
                    </m.label>
                  </m.div>
                ))}
              </m.div>
              <EvidenceAssembly
                anchors={scene.anchors}
                pinnedIds={draft.pinnedIds ?? []}
              />
            </>
          ) : null}
          {scene.kind === "designs" ? (
            <m.div
              data-scene-layout
              layout={motion.position}
              className="scene-design-grid"
            >
              {scene.panels.map((panel) => (
                <m.section
                  data-scene-layout
                  layout={motion.position}
                  className="scene-design"
                  key={panel.id}
                  aria-label={panel.label}
                >
                  <h3>{panel.label}</h3>
                  <div className="scene-design-steps">
                    {panel.steps.map((step, i) => (
                      <m.div
                        key={step.id}
                        data-scene-layout
                        layout={motion.position}
                      >
                        {i > 0 ? (
                          <ArrowDown
                            className="scene-down-arrow"
                            size={20}
                            aria-hidden="true"
                          />
                        ) : null}
                        {tile(step, i)}
                      </m.div>
                    ))}
                  </div>
                </m.section>
              ))}
            </m.div>
          ) : null}
          {scene.kind === "comparison" ? (
            <ComparisonScene
              scene={scene}
              draft={draft}
              onDraft={onDraft}
              answered={props.answered}
              disabled={props.disabled}
            />
          ) : null}
          <m.div
            data-scene-layout
            layout={motion.position}
            className="scene-connection-mark"
            aria-hidden="true"
          >
            <m.svg viewBox="0 0 240 24" width="240" height="24" initial={false}>
              <m.path
                d="M20 1 V7 Q20 12 28 12 H212 Q220 12 220 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                data-scene-path={props.selected.length ? 1 : 0.12}
                data-scene-opacity={props.selected.length ? 1 : 0.35}
                animate={{
                  pathLength: props.selected.length ? 1 : 0.12,
                  opacity: props.selected.length ? 1 : 0.35,
                }}
                transition={motion.connection}
              />
            </m.svg>
            <Link2 size={18} />
          </m.div>
          {scene.kind !== "comparison" ||
          !scene.prediction ||
          draft.revealed ||
          props.answered ? (
            <SceneResponses {...props} />
          ) : null}
        </m.div>
        <m.div
          data-scene-layout
          layout={motion.position}
          className="scene-source"
        >
          <span>{scene.provenance.note}</span>
          <span>
            Evidence:{" "}
            {scene.provenance.refs.length
              ? scene.provenance.refs.join(", ")
              : "see referenced study elements"}
          </span>
        </m.div>
        {props.firstSelection.length ? (
          <m.p
            data-scene-layout
            layout={motion.position}
            className="scene-first-response"
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            transition={motion.copy}
          >
            <span>Your first response</span>{" "}
            {props.firstSelection
              .map(
                (id) => props.options.find((option) => option.id === id)?.text,
              )
              .filter(Boolean)
              .join(" · ")}
          </m.p>
        ) : null}
        {scene.resolution ? (
          <m.aside
            className="scene-resolution"
            data-scene-layout
            layout={motion.position}
            initial={motion.enter}
            animate={{ opacity: 1, y: 0 }}
            transition={motion.copy}
          >
            <Check size={20} aria-hidden="true" />
            <div>
              <h3>{scene.resolution.label}</h3>
              <p>{scene.resolution.detail}</p>
            </div>
          </m.aside>
        ) : null}
        <span className="sr-only" aria-live="polite">
          {props.selected.length
            ? `${props.selected.length} response${props.selected.length === 1 ? "" : "s"} connected. Submit to check your reasoning.`
            : "No response connected yet."}
        </span>
      </m.section>
    </>
  );
}

function SceneResponses({
  scene,
  options,
  multiple,
  selected,
  disabled,
  onSelect,
}: Props) {
  const motion = useSceneMotion();
  return (
    <m.fieldset
      data-scene-layout
      layout={motion.position}
      disabled={disabled}
      initial={motion.enter}
      animate={{ opacity: 1, y: 0 }}
      transition={motion.copy}
      className="scene-responses"
    >
      <legend>
        {scene.kind === "connections"
          ? scene.actionLabel
          : "Build your response"}
        <span>
          {multiple
            ? "Connect all responses that apply"
            : "Connect one response"}
        </span>
      </legend>
      <div className="scene-response-grid">
        {scene.responses.map((response) => {
          const option = options.find(
            (option) => option.id === response.optionId,
          );
          if (!option) return null;
          const active = selected.includes(option.id);
          return (
            <m.label
              data-scene-motion-control
              {...motion.gestures(disabled)}
              style={{ borderRadius: 14 }}
              className={`scene-response ${active ? "selected" : ""}`}
              key={option.id}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name="scene-response"
                value={option.id}
                checked={active}
                onChange={() =>
                  onSelect(
                    multiple
                      ? active
                        ? selected.filter((id) => id !== option.id)
                        : [...selected, option.id]
                      : [option.id],
                  )
                }
              />
              <span className="scene-response-heading">
                <span>{response.label}</span>
                <span className="scene-response-indicator" aria-hidden="true">
                  <AnimatePresence initial={false} mode="popLayout">
                    <m.span
                      key={active ? "connected" : "available"}
                      data-scene-settle
                      initial={
                        motion.still ? false : { opacity: 0, scale: 0.75 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: motion.still ? 1 : 0.8 }}
                      transition={motion.copy}
                    >
                      {active ? <Link2 size={16} /> : "+"}
                    </m.span>
                  </AnimatePresence>
                </span>
              </span>
              <span className="scene-response-description">{option.text}</span>
            </m.label>
          );
        })}
      </div>
    </m.fieldset>
  );
}
