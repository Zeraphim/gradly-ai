import type { SceneItem } from "@paperquest/contracts";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChartColumn,
  GitFork,
  History,
  Link2,
  Ruler,
  Shapes,
  Waypoints,
} from "lucide-react";
import { ComparisonScene } from "../../scenes/ComparisonScene.js";
import { EvidenceCard } from "../../scenes/EvidenceCard.js";
import { FlowDiagram } from "../../scenes/FlowDiagram.js";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import { m, useSceneMotion } from "../../scenes/scene-motion.js";
import "../../scenes/scenes.css";
import type { StudyScene } from "../types.js";
import { AssociationScene } from "./AssociationScene.js";
import { EstimateScene } from "./EstimateScene.js";
import { TapNode, type TapProps } from "./TapNode.js";
import { TimelineScene } from "./TimelineScene.js";

const kinds: Record<StudyScene["kind"], { label: string; icon: typeof Link2 }> =
  {
    flow: { label: "Process", icon: Waypoints },
    connections: { label: "Evidence", icon: Link2 },
    comparison: { label: "Comparison", icon: ChartColumn },
    designs: { label: "Designs", icon: GitFork },
    timeline: { label: "Timeline", icon: History },
    association: { label: "Association", icon: Shapes },
    estimate: { label: "Estimate", icon: Ruler },
  };

/**
 * Visual-only scene renderer for the journey player. Answers are collected by
 * the player's response controls, or by diagram elements when `tap` is set.
 */
export function StudySceneView({
  scene,
  draft,
  onDraft,
  answered,
  disabled,
  tap,
}: {
  scene: StudyScene;
  draft: SceneDraft;
  onDraft: (draft: SceneDraft) => void;
  answered: boolean;
  disabled: boolean;
  tap: TapProps | null;
}) {
  const motion = useSceneMotion();
  const kind = kinds[scene.kind];
  const Icon = kind.icon;
  const inspect = (id: string) =>
    onDraft({ ...draft, inspectedId: draft.inspectedId === id ? null : id });
  const tile = (item: SceneItem, index: number) =>
    tap?.targets.has(item.id) ? (
      <TapNode {...tap} id={item.id} label={item.label}>
        <strong>{item.label}</strong>
        <span className="study-tap-detail">{item.detail}</span>
      </TapNode>
    ) : tap ? (
      // In tap mode only answers are interactive; other steps are plain context.
      <div
        className="study-static-node"
        data-scene-node={item.id}
        key={item.id}
      >
        <strong>{item.label}</strong>
        <span className="study-tap-detail">{item.detail}</span>
      </div>
    ) : (
      <EvidenceCard
        key={item.id}
        item={item}
        index={index}
        expanded={draft.inspectedId === item.id}
        connected={false}
        onInspect={() => inspect(item.id)}
      />
    );
  return (
    <m.section
      data-scene-layout
      layout={motion.layout}
      style={{ borderRadius: 22 }}
      className={`study-scene kind-${scene.kind} ${tap ? "tapping" : ""}`}
      aria-label={scene.title}
    >
      <m.header
        data-scene-layout
        layout={motion.position}
        className="study-scene-head"
      >
        <span className="study-scene-kind">
          <Icon size={14} aria-hidden="true" />
          {kind.label}
        </span>
        <h2>{scene.title}</h2>
        <p>
          {tap ? `${scene.instruction} Tap one to answer.` : scene.instruction}
        </p>
      </m.header>
      <p className="sr-only">{scene.description}</p>
      <m.div
        data-scene-layout
        layout={motion.layout}
        className="study-scene-body"
        role={tap ? (tap.multiple ? "group" : "radiogroup") : undefined}
        aria-label={tap ? "Answer by choosing a diagram step" : undefined}
      >
        {scene.kind === "flow" ? (
          <>
            <FlowDiagram
              scene={scene}
              tile={tile}
              inspectedId={draft.inspectedId}
              targets={new Set()}
            />
            <ul className="study-relations" aria-label="Relationships">
              {scene.edges.map((edge) => (
                <li key={`${edge.from}-${edge.to}`}>
                  {scene.nodes.find((n) => n.id === edge.from)?.label}
                  <ArrowRight size={13} aria-hidden="true" />
                  <strong>{edge.label}</strong>
                  <ArrowRight size={13} aria-hidden="true" />
                  {scene.nodes.find((n) => n.id === edge.to)?.label}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {scene.kind === "connections" ? (
          <div className="study-anchors">
            {scene.anchors.map((item, i) => tile(item, i))}
          </div>
        ) : null}
        {scene.kind === "designs" ? (
          <div className="study-designs">
            {scene.panels.map((panel) => (
              <section key={panel.id} aria-label={panel.label}>
                <h3>{panel.label}</h3>
                {panel.steps.map((step, i) => (
                  <div key={step.id} className="study-design-step">
                    {i > 0 ? (
                      <ArrowDown
                        className="study-design-arrow"
                        size={18}
                        aria-hidden="true"
                      />
                    ) : null}
                    {tile(step, i)}
                  </div>
                ))}
              </section>
            ))}
          </div>
        ) : null}
        {scene.kind === "comparison" ? (
          <ComparisonScene
            scene={scene}
            draft={draft}
            onDraft={onDraft}
            answered={answered}
            disabled={disabled}
          />
        ) : null}
        {scene.kind === "timeline" ? (
          <TimelineScene scene={scene} tap={tap} />
        ) : null}
        {scene.kind === "association" ? (
          <AssociationScene scene={scene} answered={answered} />
        ) : null}
        {scene.kind === "estimate" ? (
          <EstimateScene
            scene={scene}
            draft={draft}
            onDraft={onDraft}
            answered={answered}
            disabled={disabled}
          />
        ) : null}
      </m.div>
      {/* Resolution has no exit presence: withdrawn content leaves immediately. */}
      {scene.resolution ? (
        <m.aside
          className="study-scene-resolution"
          data-scene-layout
          layout={motion.position}
          initial={motion.enter}
          animate={{ opacity: 1, y: 0 }}
          transition={motion.copy}
        >
          <Check size={18} aria-hidden="true" />
          <div>
            <strong>{scene.resolution.label}</strong>
            <p>{scene.resolution.detail}</p>
          </div>
        </m.aside>
      ) : null}
      <m.p
        data-scene-layout
        layout={motion.position}
        className="study-scene-source"
      >
        {scene.provenance.note}
      </m.p>
    </m.section>
  );
}
