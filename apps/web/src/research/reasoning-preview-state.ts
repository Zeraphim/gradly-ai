import {
  initialPreviewExample,
  previewChoices,
  type PreviewChoiceId,
} from "./reasoning-preview.js";

export const PREVIEW_STORAGE_KEY = "gradly-reasoning-preview.v1";

export type PreviewPhase =
  "decide" | "explain" | "review" | "revise" | "summary";

export type PreviewAttempt = {
  choiceId: PreviewChoiceId;
  text: string;
};

export type PreviewState = {
  version: 1;
  phase: PreviewPhase;
  choiceId: PreviewChoiceId;
  text: string;
  before: PreviewAttempt | null;
  after: PreviewAttempt | null;
  reflection: string;
  revealed: boolean;
};

const phases: ReadonlySet<string> = new Set([
  "decide",
  "explain",
  "review",
  "revise",
  "summary",
]);
const choices: ReadonlySet<string> = new Set(
  previewChoices.map((choice) => choice.id),
);

export function initialPreviewState(): PreviewState {
  return {
    version: 1,
    phase: "decide",
    choiceId: initialPreviewExample.choiceId,
    text: initialPreviewExample.text,
    before: null,
    after: null,
    reflection: "",
    revealed: false,
  };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function choiceId(value: unknown): value is PreviewChoiceId {
  return typeof value === "string" && choices.has(value);
}

function boundedText(value: unknown, limit: number): value is string {
  return typeof value === "string" && value.length <= limit;
}

function attempt(value: unknown): value is PreviewAttempt | null {
  return (
    value === null ||
    (record(value) && choiceId(value.choiceId) && boundedText(value.text, 3000))
  );
}

function copyAttempt(value: PreviewAttempt | null): PreviewAttempt | null {
  return value === null ? null : { choiceId: value.choiceId, text: value.text };
}

/**
 * Read draft inputs only. Feedback is always recomputed from the current
 * authored fixtures; saved verdicts, scores, and extra fields are discarded.
 * Storage access belongs to the caller so this module also works without a
 * browser or with storage disabled.
 */
export function parsePreviewState(value: string | null): PreviewState {
  if (value === null) return initialPreviewState();
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return initialPreviewState();
  }
  if (
    !record(parsed) ||
    parsed.version !== 1 ||
    typeof parsed.phase !== "string" ||
    !phases.has(parsed.phase) ||
    !choiceId(parsed.choiceId) ||
    !boundedText(parsed.text, 3000) ||
    !attempt(parsed.before) ||
    !attempt(parsed.after) ||
    !boundedText(parsed.reflection, 1500) ||
    typeof parsed.revealed !== "boolean"
  ) {
    return initialPreviewState();
  }
  if (
    (["review", "revise", "summary"].includes(parsed.phase) &&
      parsed.before === null) ||
    (parsed.phase === "summary" && parsed.after === null)
  ) {
    return initialPreviewState();
  }
  return {
    version: 1,
    phase: parsed.phase as PreviewPhase,
    choiceId: parsed.choiceId,
    text: parsed.text,
    before: copyAttempt(parsed.before),
    after: copyAttempt(parsed.after),
    reflection: parsed.reflection,
    revealed: parsed.revealed,
  };
}
