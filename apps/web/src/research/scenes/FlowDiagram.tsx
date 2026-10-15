import { useEffect, useId, useLayoutEffect, useRef } from "react";
import type { Scene, SceneItem } from "@paperquest/contracts";
import { DiagramActivity } from "./EvidenceCard.js";
import { useMotionValue, type MotionValue } from "motion/react";
import { m, useSceneMotion } from "./scene-motion.js";
import { syncFlowConnectors } from "./flow-connectors.js";

export function FlowDiagram({
  scene,
  tile,
  inspectedId,
  targets,
}: {
  scene: Extract<Scene, { kind: "flow" }>;
  tile: (item: SceneItem, index: number) => React.ReactNode;
  inspectedId: string | null;
  targets: Set<string>;
}) {
  const motion = useSceneMotion();
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof syncFlowConnectors> | null>(null);
  const marker = useId().replace(/:/g, "");
  const pathValues = useRef(new Map<number, MotionValue<string>>());
  const columns = [
    ...new Set(scene.nodes.map((node, index) => node.column ?? index)),
  ].sort((a, b) => a - b);
  const targetKey = [...targets].join(",");
  const previous = useRef({ inspectedId, targetKey });
  useLayoutEffect(() => {
    if (!root.current) return;
    const sync = syncFlowConnectors(
      root.current,
      scene.edges,
      motion.still,
      undefined,
      (index, path) => pathValues.current.get(index)?.set(path),
    );
    controller.current = sync;
    return () => {
      controller.current = null;
      sync.dispose();
    };
  }, [scene.edges, motion.still]);
  useEffect(() => {
    if (
      previous.current.inspectedId !== inspectedId ||
      previous.current.targetKey !== targetKey
    )
      controller.current?.track();
    previous.current = { inspectedId, targetKey };
  }, [inspectedId, targetKey]);
  return (
    <DiagramActivity.Provider value={() => controller.current?.track()}>
      <m.div
        ref={root}
        data-scene-layout
        layout={motion.layout}
        className="scene-flow"
        style={{
          gridTemplateColumns: `repeat(${Math.min(columns.length, 4)}, minmax(0, 1fr))`,
        }}
        onLayoutAnimationStart={() => controller.current?.track()}
      >
        <svg className="scene-flow-links" aria-hidden="true">
          <defs>
            <marker
              id={marker}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L10 5 L0 10Z" fill="currentColor" />
            </marker>
          </defs>
          {scene.edges.map((edge, i) => {
            const active = targets.has(edge.from) || targets.has(edge.to);
            return (
              <FlowEdge
                key={`${edge.from}-${edge.to}-${i}`}
                index={i}
                registry={pathValues.current}
                marker={marker}
                active={active}
              />
            );
          })}
        </svg>
        {columns.map((column) => (
          <m.div
            data-scene-layout
            layout={motion.position}
            className="scene-flow-column"
            key={column}
          >
            {scene.nodes.map((node, i) =>
              (node.column ?? i) === column ? (
                <m.div data-scene-layout layout={motion.position} key={node.id}>
                  {tile(node, i)}
                </m.div>
              ) : null,
            )}
          </m.div>
        ))}
      </m.div>
    </DiagramActivity.Provider>
  );
}

function FlowEdge({
  index,
  registry,
  marker,
  active,
}: {
  index: number;
  registry: Map<number, MotionValue<string>>;
  marker: string;
  active: boolean;
}) {
  const motion = useSceneMotion();
  const d = useMotionValue("");
  useLayoutEffect(() => {
    registry.set(index, d);
    return () => {
      registry.delete(index);
    };
  }, [registry, index, d]);
  return (
    <m.path
      d={d}
      data-scene-edge={index}
      data-scene-settle
      data-scene-opacity={active ? 1 : 0.45}
      fill="none"
      stroke="currentColor"
      strokeWidth={active ? 2.5 : 1.5}
      markerEnd={`url(#${marker})`}
      initial={false}
      animate={{ opacity: active ? 1 : 0.45 }}
      transition={motion.copy}
    />
  );
}
