import { z } from "zod";

const text = z.string().min(1).max(600);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
const gate = z.enum(["setup", "feedback", "resolution"]);
const provenance = z.strictObject({
  kind: z.enum([
    "source-summary",
    "reported",
    "derived",
    "illustration",
    "authored",
  ]),
  refs: z.array(id).max(20),
  note: text,
});
const item = z.strictObject({
  id,
  label: text,
  detail: text,
  at: gate,
  provenance,
  column: z.number().int().min(0).max(5).optional(),
});
const response = z.strictObject({
  optionId: id,
  label: text,
  // These are the learner's proposed connections, never correctness markers.
  targetIds: z.array(id).max(12),
});
const base = {
  version: z.literal(1),
  title: text,
  instruction: text,
  description: text,
  provenance,
  responses: z.array(response).min(2).max(6),
  resolution: item.nullable(),
};
export const sceneSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    ...base,
    kind: z.literal("flow"),
    nodes: z.array(item).min(2).max(12),
    edges: z
      .array(z.strictObject({ from: id, to: id, label: text, at: gate }))
      .max(16),
  }),
  z.strictObject({
    ...base,
    kind: z.literal("connections"),
    anchors: z.array(item).min(1).max(6),
    actionLabel: text,
  }),
  z.strictObject({
    ...base,
    kind: z.literal("comparison"),
    measure: text,
    unit: text,
    // Preserve reported precision without changing existing two-decimal scenes.
    decimals: z.number().int().min(0).max(6).optional(),
    min: z.number().finite(),
    max: z.number().finite(),
    values: z
      .array(item.extend({ value: z.number().finite() }))
      .min(2)
      .max(6),
    difference: z
      .strictObject({ from: id, to: id, label: text, at: gate })
      .nullable(),
    prediction: z
      .strictObject({ label: text, options: z.array(text).min(2).max(4) })
      .nullable(),
  }),
  z.strictObject({
    ...base,
    kind: z.literal("designs"),
    panels: z
      .array(
        z.strictObject({ id, label: text, steps: z.array(item).min(2).max(6) }),
      )
      .min(2)
      .max(3),
  }),
]);
export type Scene = z.infer<typeof sceneSchema>;
export type SceneItem = z.infer<typeof item>;
export type SceneResponse = z.infer<typeof response>;
export type SceneGate = z.infer<typeof gate>;

export function sceneItems(scene: Scene): SceneItem[] {
  const items =
    scene.kind === "flow"
      ? scene.nodes
      : scene.kind === "connections"
        ? scene.anchors
        : scene.kind === "comparison"
          ? scene.values
          : scene.panels.flatMap((panel) => panel.steps);
  return [...items, ...(scene.resolution ? [scene.resolution] : [])];
}

/** Validate relationships in addition to shape. No grading guide is part of a scene. */
export function sceneProblems(
  scene: Scene,
  optionIds: string[],
  referenceIds: string[],
): string[] {
  const issues: string[] = [];
  const items = sceneItems(scene);
  const ids = new Set(items.map((node) => node.id));
  if (ids.size !== items.length)
    issues.push("duplicate scene element identifiers");
  const responses = scene.responses.map((response) => response.optionId);
  if (
    new Set(responses).size !== responses.length ||
    responses.length !== optionIds.length ||
    responses.some((id) => !optionIds.includes(id))
  )
    issues.push(
      "scene responses must map to every challenge option exactly once",
    );
  for (const p of [scene.provenance, ...items.map((node) => node.provenance)]) {
    if (p.refs.some((ref) => !referenceIds.includes(ref)))
      issues.push("unknown scene evidence reference");
    if (
      ["reported", "source-summary", "derived"].includes(p.kind) &&
      !p.refs.length
    )
      issues.push("source-based scene content needs evidence references");
  }
  for (const response of scene.responses)
    if (response.targetIds.some((id) => !ids.has(id)))
      issues.push("unknown response target");
  if (
    scene.resolution?.at !== undefined &&
    scene.resolution.at !== "resolution"
  )
    issues.push("scene resolution must wait for the answer explanation");
  const minimum = scene.kind === "connections" ? 1 : 2;
  if (
    scene.kind !== "designs" &&
    sceneItems(scene).filter((item) => item.at === "setup").length < minimum
  )
    issues.push("scene needs enough setup elements to render before feedback");
  if (
    scene.kind === "designs" &&
    (new Set(scene.panels.map((panel) => panel.id)).size !==
      scene.panels.length ||
      scene.panels.some(
        (panel) => panel.steps.filter((item) => item.at === "setup").length < 2,
      ))
  )
    issues.push(
      "design panels need unique identifiers and at least two setup steps",
    );
  if (scene.kind === "flow") {
    const nodeIds = new Set(scene.nodes.map((node) => node.id));
    for (const edge of scene.edges) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to))
        issues.push("unknown flow endpoint");
    }
  }
  if (scene.kind === "comparison") {
    if (scene.difference?.at === "setup")
      issues.push("difference must wait until feedback or resolution");
    if (scene.max <= scene.min) issues.push("invalid comparison scale");
    if (
      scene.values.some(
        (node) => node.value < scene.min || node.value > scene.max,
      )
    )
      issues.push("comparison value outside scale");
    if (
      scene.difference &&
      (!scene.values.some((v) => v.id === scene.difference!.from) ||
        !scene.values.some((v) => v.id === scene.difference!.to))
    )
      issues.push("invalid difference endpoints");
  }
  return [...new Set(issues)];
}

/** Only currently permitted content crosses the server boundary. Unknown versions fall back. */
export function projectScene(
  value: unknown,
  feedback: boolean,
  resolution: boolean,
  optionIds?: string[],
  referenceIds?: string[],
): Scene | null {
  const parsed = sceneSchema.safeParse(value);
  if (!parsed.success) return null;
  const all = parsed.data;
  const references = [
    ...new Set(
      [
        all.provenance,
        ...sceneItems(all).map((item) => item.provenance),
      ].flatMap((p) => p.refs),
    ),
  ];
  if (
    sceneProblems(
      all,
      optionIds ?? all.responses.map((r) => r.optionId),
      referenceIds ?? references,
    ).length
  )
    return null;
  const scene = structuredClone(all);
  const visible = (at: SceneGate) =>
    at === "setup" ||
    (at === "feedback" && feedback) ||
    (at === "resolution" && resolution);
  scene.resolution =
    scene.resolution && visible(scene.resolution.at) ? scene.resolution : null;
  if (scene.kind === "flow") {
    scene.nodes = scene.nodes.filter((item) => visible(item.at));
    const ids = new Set(scene.nodes.map((item) => item.id));
    scene.edges = scene.edges.filter(
      (edge) => visible(edge.at) && ids.has(edge.from) && ids.has(edge.to),
    );
  } else if (scene.kind === "connections")
    scene.anchors = scene.anchors.filter((item) => visible(item.at));
  else if (scene.kind === "comparison") {
    scene.values = scene.values.filter((item) => visible(item.at));
    const ids = new Set(scene.values.map((item) => item.id));
    scene.difference =
      scene.difference &&
      visible(scene.difference.at) &&
      ids.has(scene.difference.from) &&
      ids.has(scene.difference.to)
        ? scene.difference
        : null;
  } else
    scene.panels = scene.panels.map((panel) => ({
      ...panel,
      steps: panel.steps.filter((item) => visible(item.at)),
    }));
  const ids = new Set(sceneItems(scene).map((item) => item.id));
  scene.responses = scene.responses.map((response) => ({
    ...response,
    targetIds: response.targetIds.filter((id) => ids.has(id)),
  }));
  return scene;
}
