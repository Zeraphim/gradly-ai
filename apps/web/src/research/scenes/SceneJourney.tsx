import { useState } from "react";
import { SceneMotion, m, useSceneMotion } from "./scene-motion.js";
import {
  ChartNoAxesColumn,
  FlaskConical,
  GitBranch,
  Grid3x3,
  History,
  Layers,
  Network,
  PanelsTopLeft,
  Ruler,
  Shapes,
} from "lucide-react";
import { sceneSchema, type SceneKind } from "@paperquest/contracts";
import type { ResearchSession } from "../types.js";
import {
  InvestigationScene,
  investigationScene,
  type SceneDraft,
} from "./InvestigationScene.js";

type Review = NonNullable<ResearchSession["review"]>[number];
const icons: Record<SceneKind, typeof GitBranch> = {
  flow: GitBranch,
  connections: Network,
  comparison: ChartNoAxesColumn,
  designs: PanelsTopLeft,
  timeline: History,
  association: Shapes,
  estimate: Ruler,
  tests: FlaskConical,
  units: Layers,
  matrix: Grid3x3,
};

export function SceneJourney({
  records,
  reduced = false,
}: {
  records: Review[];
  reduced?: boolean;
}) {
  return (
    <SceneMotion reduced={reduced}>
      <JourneyContent records={records} />
    </SceneMotion>
  );
}
function JourneyContent({ records }: { records: Review[] }) {
  const motion = useSceneMotion();
  const scenes = records.flatMap((record) => {
    const parsed = sceneSchema.safeParse(record.scene);
    return parsed.success ? [{ record, scene: parsed.data }] : [];
  });
  if (!scenes.length) return null;
  return (
    <m.section
      data-scene-layout
      layout={motion.layout}
      className="scene-journey"
      aria-label="Your visual investigation recap"
    >
      <h2>Your path through the evidence</h2>
      <m.ol data-scene-layout layout={motion.position}>
        {scenes.map(({ record, scene }) => {
          const Symbol = icons[scene.kind];
          return (
            <m.li data-scene-layout layout={motion.position} key={record.id}>
              <Symbol size={22} aria-hidden="true" />
              <div>
                <strong>{scene.title}</strong>
                <span>
                  {record.attempts.length > 1
                    ? "Revisited after feedback"
                    : "One submitted response"}
                </span>
              </div>
            </m.li>
          );
        })}
      </m.ol>
      <p className="quiet">
        A record of your practice. Explore your saved decisions to compare
        attempts.
      </p>
    </m.section>
  );
}

export function SceneReview({
  record,
  reduced,
}: {
  record: Review;
  reduced: boolean;
}) {
  const [draft, setDraft] = useState<SceneDraft>({
    inspectedId: null,
    prediction: null,
    revealed: true,
  });
  const scene = investigationScene(record.scene);
  if (!scene) return null;
  return (
    <InvestigationScene
      scene={scene}
      options={record.options}
      multiple={record.type === "multiple"}
      selected={record.attempts.at(-1)?.selected ?? []}
      firstSelection={record.attempts[0]?.selected ?? []}
      disabled
      answered
      reduced={reduced}
      draft={draft}
      onDraft={setDraft}
      onSelect={() => {}}
    />
  );
}
