import { describe, expect, it } from "vitest";
import {
  PREVIEW_STORAGE_KEY,
  initialPreviewState,
  parsePreviewState,
  type PreviewState,
} from "../../apps/web/src/research/reasoning-preview-state.js";
import {
  evaluatePreview,
  initialPreviewExample,
  revisedPreviewExample,
} from "../../apps/web/src/research/reasoning-preview.js";

const before = () => ({
  choiceId: initialPreviewExample.choiceId,
  text: initialPreviewExample.text,
});
const after = () => ({
  choiceId: revisedPreviewExample.choiceId,
  text: revisedPreviewExample.text,
});
const summary = (): PreviewState => ({
  ...initialPreviewState(),
  phase: "summary",
  choiceId: revisedPreviewExample.choiceId,
  text: revisedPreviewExample.text,
  before: before(),
  after: after(),
  reflection:
    "I changed the explanation because a common lecture is not a pair.",
  revealed: true,
});

describe("reasoning preview draft state", () => {
  it("starts with the authored weak explanation and a closed source reveal", () => {
    const state = initialPreviewState();
    expect(PREVIEW_STORAGE_KEY).toBe("gradly-reasoning-preview.v1");
    expect(state).toEqual({
      version: 1,
      phase: "decide",
      choiceId: initialPreviewExample.choiceId,
      text: initialPreviewExample.text,
      before: null,
      after: null,
      reflection: "",
      revealed: false,
    });
    state.text = "An unsaved edit";
    expect(initialPreviewState().text).toBe(initialPreviewExample.text);
  });

  it("restores initial, writing, review, revision, and summary stages", () => {
    const states: PreviewState[] = [
      initialPreviewState(),
      { ...initialPreviewState(), phase: "explain", text: "My custom draft" },
      { ...initialPreviewState(), phase: "review", before: before() },
      {
        ...initialPreviewState(),
        phase: "revise",
        before: before(),
        text: "I am still revising my explanation.",
      },
      summary(),
    ];
    for (const state of states) {
      expect(parsePreviewState(JSON.stringify(state))).toEqual(state);
    }
  });

  it("preserves a custom draft verbatim without inventing a stored assessment", () => {
    const custom = {
      ...summary(),
      text: "  My custom draft\nwith spaces and punctuation!  ",
      after: { choiceId: "paired-t", text: "A custom explanation" },
    };
    const restored = parsePreviewState(JSON.stringify(custom));
    expect(restored.text).toBe(custom.text);
    expect(restored.after).toEqual(custom.after);
    expect(
      evaluatePreview(restored.after!.choiceId, restored.after!.text).reasoning
        .category,
    ).toBe("not-assessed");
  });

  it("discards stored verdicts and any extra attempt fields", () => {
    const stored = {
      ...summary(),
      verdict: "well-supported",
      score: 100,
      before: { ...before(), review: { category: "well-supported" } },
      after: { ...after(), reasoning: { category: "well-supported" } },
    };
    const restored = parsePreviewState(JSON.stringify(stored));
    expect(restored).toEqual(summary());
    expect(restored).not.toHaveProperty("verdict");
    expect(restored).not.toHaveProperty("score");
    expect(restored.before).not.toHaveProperty("review");
    expect(restored.after).not.toHaveProperty("reasoning");
    expect(
      evaluatePreview(restored.before!.choiceId, restored.before!.text)
        .reasoning.category,
    ).toBe("needs-revision");
  });

  it.each([
    null,
    "",
    "{broken json",
    "null",
    "[]",
    "42",
    JSON.stringify({ ...summary(), version: 2 }),
    JSON.stringify({ ...summary(), version: "1" }),
    JSON.stringify({ ...summary(), phase: "unexpected" }),
    JSON.stringify({ ...summary(), phase: null }),
    JSON.stringify({ ...summary(), choiceId: "unknown-method" }),
    JSON.stringify({ ...summary(), choiceId: 1 }),
    JSON.stringify({ ...summary(), text: 100 }),
    JSON.stringify({ ...summary(), text: "a".repeat(3001) }),
    JSON.stringify({ ...summary(), reflection: null }),
    JSON.stringify({ ...summary(), reflection: "a".repeat(1501) }),
    JSON.stringify({ ...summary(), revealed: "true" }),
    JSON.stringify({ ...summary(), before: undefined }),
    JSON.stringify({ ...summary(), after: undefined }),
    JSON.stringify({ ...summary(), before: [] }),
    JSON.stringify({ ...summary(), before: { choiceId: "paired-t" } }),
    JSON.stringify({
      ...summary(),
      before: { choiceId: "unknown-method", text: "A claim" },
    }),
    JSON.stringify({
      ...summary(),
      after: { choiceId: "independent-t", text: "a".repeat(3001) },
    }),
  ])("resets missing, malformed, or unsupported saved state: %s", (value) => {
    expect(parsePreviewState(value)).toEqual(initialPreviewState());
  });

  it.each(["review", "revise", "summary"] as const)(
    "requires an original attempt in %s",
    (phase) => {
      expect(
        parsePreviewState(
          JSON.stringify({ ...summary(), phase, before: null }),
        ),
      ).toEqual(initialPreviewState());
    },
  );

  it("requires a revised attempt in the summary", () => {
    expect(
      parsePreviewState(JSON.stringify({ ...summary(), after: null })),
    ).toEqual(initialPreviewState());
  });

  it("accepts the exact text and reflection limits without truncating inputs", () => {
    const state: PreviewState = {
      ...summary(),
      text: "a".repeat(3000),
      before: { choiceId: "independent-t", text: "b".repeat(3000) },
      after: { choiceId: "between-anova", text: "c".repeat(3000) },
      reflection: "d".repeat(1500),
    };
    expect(parsePreviewState(JSON.stringify(state))).toEqual(state);
  });
});
