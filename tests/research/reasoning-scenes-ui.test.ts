// @vitest-environment jsdom
import { createElement as h, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  projectScene,
  tapTargets,
  type Scene,
  type SceneOf,
} from "@paperquest/contracts";
import { StudySceneView } from "../../apps/web/src/research/studies/scenes/StudySceneView.js";
import type { TapProps } from "../../apps/web/src/research/studies/scenes/TapNode.js";
import { SceneMotion } from "../../apps/web/src/research/scenes/scene-motion.js";
import {
  emptySceneDraft,
  type SceneDraft,
} from "../../apps/web/src/research/scenes/InvestigationScene.js";
import { withScenes } from "../../apps/web/src/research/studies/catalog.js";
import type { StudyBody } from "../../apps/web/src/research/studies/types.js";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const provenance = {
  kind: "source-summary" as const,
  refs: ["e1"],
  note: "Summary of the cited excerpt.",
};
const item = (id: string, label: string) => ({
  id,
  label,
  detail: `What ${label.toLowerCase()} means here.`,
  at: "setup" as const,
  provenance,
});
const base = {
  version: 1 as const,
  instruction: "Work through it.",
  description: "A test scene.",
  provenance,
  resolution: null,
};
const optionIds = ["A", "B", "C"];
const responses = (ids: string[]) =>
  optionIds.map((optionId, i) => ({
    optionId,
    label: `Option ${optionId}`,
    targetIds: [ids[i]!],
  }));

const ladder: SceneOf<"ladder"> = {
  ...base,
  kind: "ladder",
  title: "How far can the claim go?",
  rungs: [
    item("r1", "The groups differ"),
    item("r2", "The two go together"),
    item("r3", "The program caused it"),
  ],
  reach: { rungId: "r2", label: "The evidence reaches here", at: "resolution" },
  responses: responses(["r1", "r2", "r3"]),
};
const sort: SceneOf<"sort"> = {
  ...base,
  kind: "sort",
  title: "What can the design show?",
  bins: [
    { id: "can", label: "Can show" },
    { id: "cannot", label: "Cannot show" },
  ],
  cards: [item("k1", "A difference"), item("k2", "A cause")],
  placements: [
    { cardId: "k1", binId: "can", at: "resolution" },
    { cardId: "k2", binId: "cannot", at: "resolution" },
  ],
  responses: responses(["k1", "k2", "k1"]),
};
const spot: SceneOf<"spot"> = {
  ...base,
  kind: "spot",
  title: "Read the procedure",
  passages: [
    item("p1", "Pupils chose a room."),
    item("p2", "Each took a quiz."),
    item("p3", "Scores were compared."),
  ],
  responses: responses(["p1", "p2", "p3"]),
};
/** The scene as the learner sees it before an attempt, or after the explanation. */
const at = (scene: Scene, explained: boolean) =>
  projectScene(scene, explained, explained, optionIds)!;

function Harness({
  scene,
  answered = false,
  tap = null,
  onDraft,
}: {
  scene: Scene;
  answered?: boolean;
  tap?: TapProps | null;
  onDraft?: (draft: SceneDraft) => void;
}) {
  const [draft, setDraft] = useState<SceneDraft>(emptySceneDraft);
  return h(
    "div",
    { className: "research-lab" },
    h(SceneMotion, {
      reduced: true,
      children: h(StudySceneView, {
        scene,
        draft,
        onDraft: (next: SceneDraft) => {
          onDraft?.(next);
          setDraft(next);
        },
        answered,
        disabled: false,
        tap,
      }),
    }),
  );
}
const tapFor = (scene: Scene, onToggle = vi.fn()): TapProps => ({
  targets: tapTargets(scene)!,
  selected: [],
  multiple: false,
  disabled: false,
  marks: {},
  onToggle,
});

describe("claim ladder", () => {
  it("lists claims modest to strong and marks overreach only after the explanation", () => {
    const { rerender } = render(h(Harness, { scene: at(ladder, false) }));
    const rungs = within(
      screen.getByRole("list", { name: "Claims from modest to strong" }),
    ).getAllByRole("listitem");
    expect(rungs.map((r) => r.textContent)).toEqual([
      expect.stringContaining("The groups differ"),
      expect.stringContaining("The two go together"),
      expect.stringContaining("The program caused it"),
    ]);
    expect(screen.queryByText("The evidence reaches here")).toBeNull();
    expect(screen.queryByText("Beyond what the evidence shows")).toBeNull();
    rerender(h(Harness, { scene: at(ladder, true), answered: true }));
    expect(screen.getByText("The evidence reaches here")).toBeTruthy();
    const beyond = screen.getAllByText("Beyond what the evidence shows");
    expect(beyond).toHaveLength(1);
    expect(beyond[0]!.closest("li")!.textContent).toContain(
      "The program caused it",
    );
  });

  it("answers by tapping a rung", async () => {
    const onToggle = vi.fn();
    const scene = at(ladder, false);
    render(h(Harness, { scene, tap: tapFor(scene, onToggle) }));
    const group = screen.getByRole("radiogroup", {
      name: "Answer by choosing a diagram step",
    });
    await userEvent.click(
      within(group).getByRole("radio", { name: /The two go together/ }),
    );
    expect(onToggle).toHaveBeenCalledWith("B");
  });
});

describe("sort", () => {
  it("moves a card into a bin and back, then compares with the paper", async () => {
    const onDraft = vi.fn();
    const { rerender } = render(
      h(Harness, { scene: at(sort, false), onDraft }),
    );
    const tray = screen.getByRole("region", { name: "Cards to sort" });
    expect(within(tray).getAllByRole("listitem")).toHaveLength(2);
    const card = () =>
      screen.getByRole("group", { name: "Sort “A difference”" });
    await userEvent.click(
      within(card()).getByRole("button", { name: "Can show" }),
    );
    expect(onDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorted: { k1: "can" } }),
    );
    const bin = screen.getByRole("region", { name: "Can show" });
    expect(within(bin).getByText("A difference")).toBeTruthy();
    expect(
      within(card())
        .getByRole("button", { name: "Can show" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    // Pressing the same bin again returns the card to the tray.
    await userEvent.click(
      within(card()).getByRole("button", { name: "Can show" }),
    );
    expect(onDraft).toHaveBeenLastCalledWith(
      expect.objectContaining({ sorted: {} }),
    );
    expect(
      within(screen.getByRole("region", { name: "Cards to sort" })).getByText(
        "A difference",
      ),
    ).toBeTruthy();
    await userEvent.click(
      within(card()).getByRole("button", { name: "Can show" }),
    );
    await userEvent.click(
      within(screen.getByRole("group", { name: "Sort “A cause”" })).getByRole(
        "button",
        { name: "Can show" },
      ),
    );
    // Before the explanation, the learner's sort stays in place.
    rerender(h(Harness, { scene: at(sort, false), answered: true, onDraft }));
    expect(screen.queryByText("Matches your sort")).toBeNull();
    expect(screen.queryByRole("group", { name: /^Sort / })).toBeNull();
    rerender(h(Harness, { scene: at(sort, true), answered: true, onDraft }));
    expect(screen.getByText("Matches your sort")).toBeTruthy();
    expect(screen.getByText("You sorted it into Can show")).toBeTruthy();
    // Cards now sit where the paper places them.
    expect(
      within(screen.getByRole("region", { name: "Cannot show" })).getByText(
        "A cause",
      ),
    ).toBeTruthy();
  });
});

describe("close reading", () => {
  it("highlights a passage to open its note", async () => {
    render(h(Harness, { scene: at(spot, false) }));
    const passage = screen.getByRole("button", { name: "Each took a quiz." });
    expect(passage.getAttribute("aria-expanded")).toBe("false");
    expect(
      screen.getByText("Highlight a passage to see what it means here."),
    ).toBeTruthy();
    await userEvent.click(passage);
    expect(passage.getAttribute("aria-expanded")).toBe("true");
    const note = document.getElementById(
      passage.getAttribute("aria-controls")!,
    )!;
    expect(note.textContent).toContain("What each took a quiz. means here.");
    await userEvent.click(passage);
    expect(passage.getAttribute("aria-expanded")).toBe("false");
  });

  it("answers by tapping a passage", async () => {
    const onToggle = vi.fn();
    const scene = at(spot, false);
    render(h(Harness, { scene, tap: tapFor(scene, onToggle) }));
    const group = screen.getByRole("radiogroup", {
      name: "Answer by choosing a passage",
    });
    const radios = within(group).getAllByRole("radio");
    expect(radios).toHaveLength(3);
    await userEvent.click(
      within(group).getByRole("radio", { name: /Scores were compared/ }),
    );
    expect(onToggle).toHaveBeenCalledWith("C");
  });
});

describe("saved prepared scenes", () => {
  it("attach only to challenges without an authored scene, bonus included", () => {
    const authored = at(ladder, false);
    const challenge = (id: string, scene: Scene | null) =>
      ({ id, scene }) as unknown as StudyBody["lesson"]["challenges"][number];
    const body = {
      lesson: {
        challenges: [challenge("c1", authored), challenge("c2", null)],
        bonus: challenge("bonus", null),
      },
    } as unknown as StudyBody;
    const saved = {
      c1: { scene: at(spot, false) },
      c2: { scene: at(spot, false), responseStyle: "tap" as const },
      bonus: { scene: at(sort, false) },
    };
    const merged = withScenes(body, saved);
    expect(merged.lesson.challenges[0]!.scene).toBe(authored);
    expect(merged.lesson.challenges[1]).toMatchObject({
      scene: { kind: "spot" },
      responseStyle: "tap",
    });
    expect(merged.lesson.bonus?.scene?.kind).toBe("sort");
    expect(withScenes(body, {})).toEqual(body);
  });
});
