import { useState } from "react";
import { SceneMotion, m, useSceneMotion } from "./scene-motion.js";
import {
  ChartNoAxesColumn,
  GitBranch,
  Network,
  PanelsTopLeft,
} from "lucide-react";
import { sceneSchema } from "@paperquest/contracts";
import type { ResearchSession } from "../types.js";
import { InvestigationScene, type SceneDraft } from "./InvestigationScene.js";

type Review = NonNullable<ResearchSession["review"]>[number];
const icons = {
  flow: GitBranch,
  connections: Network,
  comparison: ChartNoAxesColumn,
  designs: PanelsTopLeft,
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
  const parsed = sceneSchema.safeParse(record.scene);
  if (!parsed.success) return null;
  return (
    <InvestigationScene
      scene={parsed.data}
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
