import { z } from "zod";

const text = z.string().min(1).max(600);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
const gate = z.enum(["setup", "feedback", "resolution"]);
const finite = z.number().finite();
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
// An optional, unscored guess the learner commits to before an explicit reveal.
const prediction = z
  .strictObject({ label: text, options: z.array(text).min(2).max(4) })
  .nullable();
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
    min: finite,
    max: finite,
    values: z
      .array(item.extend({ value: finite }))
      .min(2)
      .max(6),
    difference: z
      .strictObject({ from: id, to: id, label: text, at: gate })
      .nullable(),
    prediction,
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
  // Waves or events on one time axis. `n` is the reported sample at that point.
  z.strictObject({
    ...base,
    kind: z.literal("timeline"),
    events: z
      .array(item.extend({ when: text, n: z.number().int().min(0).optional() }))
      .min(2)
      .max(8),
  }),
  // Reported associations as stated in the paper, never raw records.
  z.strictObject({
    ...base,
    kind: z.literal("association"),
    pairs: z
      .array(
        item.extend({
          x: text,
          y: text,
          statistic: z.enum(["r", "beta", "OR"]),
          value: finite,
          n: z.number().int().positive().optional(),
        }),
      )
      .min(1)
      .max(4),
  }),
  // Reported estimates with intervals against a reference value.
  z.strictObject({
    ...base,
    kind: z.literal("estimate"),
    measure: text,
    min: finite,
    max: finite,
    reference: z.strictObject({ value: finite, label: text }),
    band: z
      .strictObject({ lower: finite, upper: finite, label: text, at: gate })
      .nullable(),
    estimates: z
      .array(item.extend({ value: finite, lower: finite, upper: finite }))
      .min(1)
      .max(6),
    prediction,
  }),
  // A family of reported tests read against one significance threshold.
  z.strictObject({
    ...base,
    kind: z.literal("tests"),
    alpha: z.number().gt(0).max(0.1),
    tests: z
      .array(
        item.extend({
          p: z.number().min(0).max(1),
          // "<" when the paper reports a bound such as p < .001.
          bound: z.enum(["=", "<"]).optional(),
        }),
      )
      .min(2)
      .max(16),
    prediction,
  }),
  // Nested units: what was assigned or sampled, what was measured, what was analysed.
  z.strictObject({
    ...base,
    kind: z.literal("units"),
    levels: z
      .array(
        item.extend({
          count: z.number().int().positive(),
          unit: text,
          role: z.enum(["assigned", "sampled", "measured", "analysed"]),
        }),
      )
      .min(2)
      .max(4),
  }),
  // Conditions side by side, one row per feature, to show what else differs.
  z.strictObject({
    ...base,
    kind: z.literal("matrix"),
    conditions: z
      .array(z.strictObject({ id, label: text }))
      .min(2)
      .max(4),
    rows: z
      .array(item.extend({ cells: z.array(text).min(2).max(4) }))
      .min(2)
      .max(6),
  }),
]);
export type Scene = z.infer<typeof sceneSchema>;
export type SceneKind = Scene["kind"];
export type SceneOf<K extends SceneKind> = Extract<Scene, { kind: K }>;
export type SceneItem = z.infer<typeof item>;
export type SceneResponse = z.infer<typeof response>;
export type SceneGate = z.infer<typeof gate>;
export const sceneKinds = sceneSchema.options.map(
  (option) => option.shape.kind.value,
) as SceneKind[];

/** How a challenge collects its answer. Every style submits the same option ids. */
export const responseStyles = ["cards", "pills", "tap"] as const;
export type ResponseStyle = (typeof responseStyles)[number];
/** Kinds whose elements can be the answer controls themselves. */
export const tapKinds: SceneKind[] = [
  "flow",
  "designs",
  "timeline",
  "tests",
  "units",
  "matrix",
];

export function sceneItems(scene: Scene): SceneItem[] {
  const items: SceneItem[] =
    scene.kind === "flow"
      ? scene.nodes
      : scene.kind === "connections"
        ? scene.anchors
        : scene.kind === "comparison"
          ? scene.values
          : scene.kind === "designs"
            ? scene.panels.flatMap((panel) => panel.steps)
            : scene.kind === "timeline"
              ? scene.events
              : scene.kind === "association"
                ? scene.pairs
                : scene.kind === "estimate"
                  ? scene.estimates
                  : scene.kind === "tests"
                    ? scene.tests
                    : scene.kind === "units"
                      ? scene.levels
                      : scene.rows;
  return [...items, ...(scene.resolution ? [scene.resolution] : [])];
}

/**
 * Diagram elements that answer directly: each option maps to exactly one distinct
 * element of a tap-capable kind. Null means the player shows ordinary choices.
 */
export function tapTargets(
  scene: Scene | null,
): Map<string, SceneResponse> | null {
  if (
    !scene ||
    !tapKinds.includes(scene.kind) ||
    scene.responses.some((response) => response.targetIds.length !== 1)
  )
    return null;
  const map = new Map(
    scene.responses.map((response) => [response.targetIds[0]!, response]),
  );
  return map.size === scene.responses.length ? map : null;
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
  const minimum = ["connections", "association", "estimate"].includes(
    scene.kind,
  )
    ? 1
    : 2;
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
  if (scene.kind === "association")
    for (const pair of scene.pairs) {
      if (pair.statistic === "r" && Math.abs(pair.value) > 1)
        issues.push("a correlation must lie between -1 and 1");
      if (pair.statistic === "OR" && pair.value <= 0)
        issues.push("an odds ratio must be positive");
    }
  if (scene.kind === "estimate") {
    const inside = (value: number) => value >= scene.min && value <= scene.max;
    if (scene.max <= scene.min) issues.push("invalid estimate scale");
    if (!inside(scene.reference.value))
      issues.push("estimate reference outside scale");
    for (const e of scene.estimates) {
      if (!(e.lower <= e.value && e.value <= e.upper))
        issues.push("estimate outside its interval");
      if (!inside(e.lower) || !inside(e.upper))
        issues.push("interval outside the scale");
    }
    if (
      scene.band &&
      (scene.band.lower >= scene.band.upper ||
        !inside(scene.band.lower) ||
        !inside(scene.band.upper))
    )
      issues.push("invalid estimate band");
  }
  if (scene.kind === "units") {
    const roles = new Set(scene.levels.map((level) => level.role));
    if (roles.size < 2)
      issues.push("units need at least two different roles to compare");
  }
  if (scene.kind === "matrix") {
    if (
      new Set(scene.conditions.map((c) => c.id)).size !==
      scene.conditions.length
    )
      issues.push("duplicate matrix condition identifiers");
    if (scene.rows.some((row) => row.cells.length !== scene.conditions.length))
      issues.push("each matrix row needs one cell per condition");
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
  const shown = <T extends { at: SceneGate }>(items: T[]) =>
    items.filter((item) => visible(item.at));
  scene.resolution =
    scene.resolution && visible(scene.resolution.at) ? scene.resolution : null;
  if (scene.kind === "flow") {
    scene.nodes = shown(scene.nodes);
    const ids = new Set(scene.nodes.map((item) => item.id));
    scene.edges = scene.edges.filter(
      (edge) => visible(edge.at) && ids.has(edge.from) && ids.has(edge.to),
    );
  } else if (scene.kind === "connections") scene.anchors = shown(scene.anchors);
  else if (scene.kind === "comparison") {
    scene.values = shown(scene.values);
    const ids = new Set(scene.values.map((item) => item.id));
    scene.difference =
      scene.difference &&
      visible(scene.difference.at) &&
      ids.has(scene.difference.from) &&
      ids.has(scene.difference.to)
        ? scene.difference
        : null;
  } else if (scene.kind === "designs")
    scene.panels = scene.panels.map((panel) => ({
      ...panel,
      steps: shown(panel.steps),
    }));
  else if (scene.kind === "timeline") scene.events = shown(scene.events);
  else if (scene.kind === "association") scene.pairs = shown(scene.pairs);
  else if (scene.kind === "estimate") {
    scene.estimates = shown(scene.estimates);
    scene.band = scene.band && visible(scene.band.at) ? scene.band : null;
  } else if (scene.kind === "tests") scene.tests = shown(scene.tests);
  else if (scene.kind === "units") scene.levels = shown(scene.levels);
  else scene.rows = shown(scene.rows);
  const ids = new Set(sceneItems(scene).map((item) => item.id));
  scene.responses = scene.responses.map((response) => ({
    ...response,
    targetIds: response.targetIds.filter((id) => ids.has(id)),
  }));
  return scene;
}

/**
 * Numbers a scene states as reported source values, with the field they come from.
 * Derived, illustrated and authored elements are excluded; their notes say so.
 */
export function reportedSceneNumbers(
  scene: Scene,
): { id: string; refs: string[]; values: number[] }[] {
  const reported = <T extends SceneItem>(
    items: T[],
    pick: (i: T) => number[],
  ) =>
    items
      .filter((i) => i.provenance.kind === "reported")
      .map((i) => ({ id: i.id, refs: i.provenance.refs, values: pick(i) }));
  const present = (...values: (number | undefined)[]) =>
    values.filter((v): v is number => v !== undefined);
  switch (scene.kind) {
    case "comparison":
      return reported(scene.values, (v) => [v.value]);
    case "timeline":
      return reported(scene.events, (e) => present(e.n));
    case "association":
      return reported(scene.pairs, (p) => present(p.value, p.n));
    case "estimate":
      return reported(scene.estimates, (e) => [e.value, e.lower, e.upper]);
    case "tests":
      return reported(scene.tests, (t) => [t.p]);
    case "units":
      return reported(scene.levels, (l) => [l.count]);
    default:
      return [];
  }
}

/**
 * Numbers written in source text: thousands separators, leading-dot decimals
 * (p = .04) and typographic minus signs are read as the values they denote. A
 * hyphen after a digit is a range ("10-20"), not a sign.
 */
export function numbersIn(source: string): number[] {
  const normal = source
    .replace(/−/g, "-")
    .replace(/(\d),(?=\d{3}(?!\d))/g, "$1");
  return (normal.match(/(?:(?<![\d.])-)?(?:\d+(?:\.\d+)?|\.\d+)/g) ?? []).map(
    Number,
  );
}
