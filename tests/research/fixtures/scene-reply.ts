import { SCENE_ROLE } from "../../../apps/api/src/research/scene-stage.js";

type SceneInput = {
  challenge: { id: string; options: { id: string }[]; refs: string[] };
  excerpts: { id: string }[];
  allowedKinds: string[];
};

/**
 * A valid Scene Designer reply built from the call's own input: a connections
 * scene when that kind is allowed, otherwise a sort scene. Never titled like
 * the server's evidence fallback.
 */
export function sceneReply(input: unknown) {
  // The stage's leak check reads every written scene at once; nothing leaks.
  if (!(input as Partial<SceneInput>).challenge) return { flagged: [] };
  const { challenge, excerpts, allowedKinds } = input as SceneInput;
  const ids = excerpts.length
    ? excerpts.map((r) => r.id)
    : challenge.refs.slice(0, 1);
  const provenance = (refs: string[]) => ({
    kind: "source-summary" as const,
    refs,
    note: "Paraphrase of the cited evidence.",
  });
  const base = {
    version: 1 as const,
    instruction: "Inspect the evidence, then choose a response.",
    description: "A mocked scene built from the challenge's evidence.",
    provenance: provenance(ids),
    resolution: null,
  };
  if (allowedKinds.includes("connections")) {
    const anchors = ids.map((id, i) => ({
      id: `anchor_${i + 1}`,
      label: `Mock anchor ${i + 1}`,
      detail: "A paraphrase of the cited evidence.",
      at: "setup" as const,
      provenance: provenance([id]),
    }));
    return {
      scene: {
        ...base,
        kind: "connections" as const,
        title: "Mock evidence links",
        actionLabel: "Connect a response",
        anchors,
        responses: challenge.options.map((o) => ({
          optionId: o.id,
          label: `Option ${o.id}`,
          targetIds: anchors.map((a) => a.id),
        })),
      },
      responseStyle: "cards" as const,
    };
  }
  const cards = ["card_1", "card_2"].map((id, i) => ({
    id,
    label: `Mock statement ${i + 1}`,
    detail: "A statement to sort.",
    at: "setup" as const,
    provenance: provenance([ids[0]!]),
  }));
  return {
    scene: {
      ...base,
      kind: "sort" as const,
      title: "Mock sort",
      bins: [
        { id: "bin_a", label: "Bin A" },
        { id: "bin_b", label: "Bin B" },
      ],
      cards,
      placements: [],
      responses: challenge.options.map((o) => ({
        optionId: o.id,
        label: `Option ${o.id}`,
        targetIds: ["card_1"],
      })),
    },
    responseStyle: "cards" as const,
  };
}

/** True for a Scene Designer or scene leak check call, which mocks answer outside their queues. */
export const isSceneCall = (role: string) =>
  role === SCENE_ROLE || role === "Scene Leak Check";

type LessonLike = {
  challenges: { id: string; scene?: unknown; responseStyle?: string }[];
  bonus?: { id: string; scene?: unknown; responseStyle?: string } | null;
};
const lessonScene = (lesson: LessonLike, id: string) =>
  [...lesson.challenges, ...(lesson.bonus ? [lesson.bonus] : [])].find(
    (x) => x.id === id,
  )?.scene;
/**
 * Replies with the fixture lesson's own scene for the challenge, as if the
 * model had drafted it, when its kind is allowed; otherwise a mocked scene.
 * `anyKind` ignores the position's allowed kinds, which only the provider's
 * schema enforces, so a mock that skips the schema can place any kind.
 */
export function sceneReplyFrom(
  lesson: LessonLike,
  { anyKind = false }: { anyKind?: boolean } = {},
) {
  return (input: unknown) => {
    if (!(input as Partial<SceneInput>).challenge) return sceneReply(input);
    const { challenge } = input as SceneInput;
    const allowedKinds = anyKind
      ? [String((lessonScene(lesson, challenge.id) as { kind?: string })?.kind)]
      : (input as SceneInput).allowedKinds;
    const c = [
      ...lesson.challenges,
      ...(lesson.bonus ? [lesson.bonus] : []),
    ].find((x) => x.id === challenge.id);
    const scene = c?.scene as { kind?: string } | null | undefined;
    return scene?.kind && allowedKinds.includes(scene.kind)
      ? { scene, responseStyle: c!.responseStyle ?? "cards" }
      : sceneReply(input);
  };
}
