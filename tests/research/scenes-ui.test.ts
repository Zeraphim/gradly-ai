// @vitest-environment jsdom
import { createElement as h, useState } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { projectScene, type Scene } from "@paperquest/contracts";
import {
  InvestigationScene,
  emptySceneDraft,
  type SceneDraft,
} from "../../apps/web/src/research/scenes/InvestigationScene.js";
import {
  SceneJourney,
  SceneReview,
} from "../../apps/web/src/research/scenes/SceneJourney.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  quantitativeSceneLesson,
  qualitativeSceneLesson,
} from "./fixtures/scene-lessons.js";
import type { Challenge } from "../../apps/api/src/research/contracts.js";

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
function Harness({
  challenge,
  answered = false,
  initialDraft = emptySceneDraft,
}: {
  challenge: Challenge;
  answered?: boolean;
  initialDraft?: SceneDraft;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [draft, setDraft] = useState(initialDraft);
  const scene = projectScene(challenge.scene, answered, answered)!;
  return h(
    "div",
    { className: "research-lab" },
    h(InvestigationScene, {
      scene,
      options: challenge.options,
      multiple: challenge.type === "multiple",
      selected,
      firstSelection: answered ? [challenge.options[0]!.id] : [],
      disabled: answered,
      answered,
      reduced: true,
      draft,
      onDraft: setDraft,
      onSelect: setSelected,
    }),
    h(
      "output",
      { "aria-label": "Selected answer identifiers" },
      selected.join(","),
    ),
    h("output", { "aria-label": "Exploration draft" }, JSON.stringify(draft)),
  );
}

it("allows keyboard selection and keeps exploratory evidence assembly separate from assessment", async () => {
  const user = userEvent.setup();
  render(h(Harness, { challenge: featured.challenges[2]! }));
  const pins = screen.getAllByRole("checkbox", { name: "Use in my reasoning" });
  await user.click(pins[0]!);
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "",
  );
  expect(screen.getByLabelText("Your evidence assembly").textContent).toContain(
    "Numerical outcome",
  );
  const methods = screen
    .getAllByRole("checkbox")
    .filter((input) => input.getAttribute("name") === "scene-response");
  methods[0]!.focus();
  await user.keyboard(" ");
  methods[1]!.focus();
  await user.keyboard(" ");
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "A,B",
  );
  await user.click(methods[0]!);
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "B",
  );
});

it("keeps an optional prediction visible and reveals permitted comparison values only on request", async () => {
  const user = userEvent.setup();
  render(h(Harness, { challenge: featured.challenges[5]! }));
  expect(screen.queryByRole("figure")).toBeNull();
  await user.click(screen.getByRole("radio", { name: "Similar group means" }));
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "",
  );
  await user.click(
    screen.getByRole("button", { name: /Reveal reported results/ }),
  );
  expect(screen.getByRole("figure").textContent).toContain("73.41");
  expect(screen.getByText("Your prediction: Similar group means")).toBeTruthy();
  // The fieldset disables the prediction controls after reveal without disabling answer selection.
  expect(
    screen
      .getByRole("radio", { name: "Similar group means" })
      .closest("fieldset")?.disabled,
  ).toBe(true);
  expect(
    screen.queryByText("No-texting minus texting · percentage points"),
  ).toBeNull();
  await user.click(
    screen
      .getAllByRole("radio")
      .find((el) => el.getAttribute("value") === "A")!,
  );
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "A",
  );
});

it("shows the two assigned conditions as parallel branches and exposes inspected source context", async () => {
  const user = userEvent.setup();
  const { container } = render(
    h(Harness, { challenge: featured.challenges[1]! }),
  );
  const columns = container.querySelectorAll(".scene-flow-column");
  expect(columns).toHaveLength(4);
  expect(columns[1]?.textContent).toContain("Texting");
  expect(columns[1]?.textContent).toContain("No texting");
  await user.click(
    screen.getByRole("button", { name: "Inspect Random assignment" }),
  );
  expect(
    screen.getByText("Participants were assigned to one condition."),
  ).toBeTruthy();
  const description = screen
    .getByRole("button", { name: "Inspect Random assignment" })
    .getAttribute("aria-describedby");
  expect(document.getElementById(description!)?.textContent).toContain(
    "Participants were assigned to one condition.",
  );
  expect(screen.getByLabelText("Selected answer identifiers").textContent).toBe(
    "",
  );
});

it("shows a side-by-side design comparison and locks submitted answer controls", () => {
  render(h(Harness, { challenge: featured.bonus!, answered: true }));
  expect(screen.getByRole("region", { name: "Experiment 1" })).toBeTruthy();
  expect(screen.getByRole("region", { name: "Experiment 2" })).toBeTruthy();
  expect(screen.getByText("A result cannot rewrite the design")).toBeTruthy();
  expect(
    screen
      .getByRole("group", { name: /Build your response/ })
      .hasAttribute("disabled"),
  ).toBe(true);
  expect(screen.getByText("Your first response")).toBeTruthy();
});

it("renders all nine featured scenes plus both unrelated fixtures with the same renderer", () => {
  for (const lesson of [
    featured,
    quantitativeSceneLesson,
    qualitativeSceneLesson,
  ]) {
    for (const challenge of [
      ...lesson.challenges,
      ...(lesson.bonus ? [lesson.bonus] : []),
    ]) {
      const scene = projectScene(challenge.scene, true, true) as Scene;
      const { unmount } = render(h(Harness, { challenge, answered: true }));
      expect(screen.getByRole("region", { name: scene.title })).toBeTruthy();
      expect(
        screen
          .getAllByRole(challenge.type === "multiple" ? "checkbox" : "radio")
          .filter((el) => el.getAttribute("name") === "scene-response"),
      ).toHaveLength(challenge.options.length);
      if (lesson === qualitativeSceneLesson)
        expect(screen.queryByRole("figure")).toBeNull();
      unmount();
    }
  }
});

it("restores exploratory state supplied by the version-bound draft", () => {
  render(
    h(Harness, {
      challenge: featured.challenges[5]!,
      initialDraft: {
        inspectedId: null,
        prediction: "Texting group higher",
        revealed: true,
      },
    }),
  );
  expect(screen.getByRole("figure")).toBeTruthy();
  expect(
    screen.getByText("Your prediction: Texting group higher"),
  ).toBeTruthy();
});

it("reuses projected scenes and recorded answers for the journey recap and saved review", () => {
  let state = transition(newSession(featured, "recap"), featured, "begin");
  for (const challenge of featured.challenges)
    state = transition(
      submit(state, featured, challenge.accepted, "Evidence-linked response"),
      featured,
      "next",
    );
  state = transition(state, featured, "skip");
  const records = publicSession(state, featured).review!;
  const recap = render(h(SceneJourney, { records }));
  expect(screen.getAllByText("One submitted response")).toHaveLength(8);
  recap.unmount();
  render(h(SceneReview, { record: records[5]!, reduced: true }));
  expect(screen.getByRole("figure").textContent).toContain("83.00");
  // The accessible label uses the same precision as the visible values.
  expect(screen.getByRole("figure").getAttribute("aria-label")).toContain(
    "83.00",
  );
  expect(
    screen
      .getByRole("group", { name: /Build your response/ })
      .hasAttribute("disabled"),
  ).toBe(true);
});

it("preserves subtraction direction in reusable comparison scenes", () => {
  const challenge = structuredClone(quantitativeSceneLesson.challenges[1]!);
  if (challenge.scene?.kind !== "comparison")
    throw Error("Expected comparison");
  challenge.scene.difference = {
    from: "south",
    to: "north",
    label: "North minus south",
    at: "feedback",
  };
  render(h(Harness, { challenge, answered: true }));
  expect(screen.getByText("-60.00")).toBeTruthy();
});
