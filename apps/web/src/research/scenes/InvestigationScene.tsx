import { memo, useEffect, useRef } from "react";
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
  /** Result of the checked attempt, used only to colour the chosen responses. */
  verdict?: "correct" | "incorrect";
  /** Optional local review controls; assessment remains owned by the caller. */
  responseFooter?: React.ReactNode;
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
        className={`investigation-scene scene-kind-${scene.kind}`}
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
          <LinkStrip
            labels={sceneItemsFor(scene)
              .filter((item) => targets.has(item.id))
              .map((item) => item.label)}
            chosen={props.selected.length > 0}
          />
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

function sceneItemsFor(scene: Scene): SceneItem[] {
  if (scene.kind === "flow") return scene.nodes;
  if (scene.kind === "connections") return scene.anchors;
  if (scene.kind === "designs") return scene.panels.flatMap((p) => p.steps);
  return [];
}

/**
 * Cause and effect made visible: choosing a response names and lights up the
 * study parts it connects to. Purely presentational; no answer is implied.
 */
function LinkStrip({ labels, chosen }: { labels: string[]; chosen: boolean }) {
  const motion = useSceneMotion();
  return (
    <m.div
      data-scene-layout
      layout={motion.position}
      className={`scene-link-strip ${chosen ? "is-linked" : ""}`}
      aria-hidden="true"
    >
      <span className="scene-link-line" />
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={chosen ? labels.join("|") || "linked" : "empty"}
          className="scene-link-pill"
          data-scene-settle
          initial={motion.still ? false : { opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: motion.still ? 1 : 0.95 }}
          transition={motion.copy}
        >
          <Link2 size={15} />
          {chosen
            ? labels.length
              ? `Links to ${labels.join(" + ")}`
              : "Response chosen"
            : "Choose a response to see what it connects to"}
        </m.span>
      </AnimatePresence>
      <span className="scene-link-line" />
    </m.div>
  );
}

function SceneResponses({
  scene,
  options,
  multiple,
  selected,
  disabled,
  onSelect,
  verdict,
  responseFooter,
}: Props) {
  const motion = useSceneMotion();
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const shown = scene.responses.filter((response) =>
    options.some((option) => option.id === response.optionId),
  );
  const toggle = (id: string) =>
    onSelect(
      multiple
        ? selected.includes(id)
          ? selected.filter((s) => s !== id)
          : [...selected, id]
        : [id],
    );
  // Keyboard shortcuts: A/B/C… or 1/2/3… choose a response, as in lesson apps.
  useEffect(() => {
    if (disabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat)
        return;
      // Act only with focus inside this scene, on nothing, or on a page focus
      // anchor such as the screen heading (tabIndex -1), never on other controls.
      const active = document.activeElement;
      if (
        active &&
        active !== document.body &&
        !fieldset.current?.closest(".investigation-scene")?.contains(active) &&
        !active.matches("[tabindex='-1']")
      )
        return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input:not([type=radio]):not([type=checkbox]), textarea, select, [contenteditable]",
        )
      )
        return;
      const key = event.key.toUpperCase();
      const index = /^[1-9]$/.test(key)
        ? Number(key) - 1
        : /^[A-Z]$/.test(key)
          ? key.charCodeAt(0) - 65
          : -1;
      const response = shown[index];
      if (!response) return;
      event.preventDefault();
      toggle(response.optionId);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <m.fieldset
      ref={fieldset}
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
        {shown.map((response, index) => {
          const option = options.find(
            (option) => option.id === response.optionId,
          );
          if (!option) return null;
          const active = selected.includes(option.id);
          const result = active && verdict ? `is-${verdict}` : "";
          return (
            <m.label
              data-scene-motion-control
              {...motion.gestures(disabled)}
              style={{ borderRadius: 14 }}
              className={`scene-response ${active ? "selected" : ""} ${result}`}
              key={option.id}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name="scene-response"
                value={option.id}
                checked={active}
                onChange={() => toggle(option.id)}
              />
              <span className="scene-response-key" aria-hidden="true">
                {active && verdict === "correct" ? (
                  <Check size={15} strokeWidth={3} />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
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
      {responseFooter}
    </m.fieldset>
  );
}
