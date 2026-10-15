// @vitest-environment jsdom
import { createElement as h, useState } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act,
  waitFor,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { projectScene } from "@paperquest/contracts";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  InvestigationScene,
  emptySceneDraft,
  type SceneDraft,
} from "../../apps/web/src/research/scenes/InvestigationScene.js";
import { SceneDisclosure } from "../../apps/web/src/research/scenes/SceneDisclosure.js";
import {
  SceneMotion,
  SceneTransition,
} from "../../apps/web/src/research/scenes/scene-motion.js";
import type { Challenge } from "../../apps/api/src/research/contracts.js";
import {
  quantitativeSceneLesson,
  qualitativeSceneLesson,
} from "./fixtures/scene-lessons.js";

function mediaPreferences() {
  const queries = new Map<
    string,
    { matches: boolean; listeners: Set<() => void>; value: MediaQueryList }
  >();
  const get = (query: string) => {
    if (!queries.has(query)) {
      const entry = {
        matches: query.includes("pointer: fine"),
        listeners: new Set<() => void>(),
        value: null as unknown as MediaQueryList,
      };
      entry.value = {
        get matches() {
          return entry.matches;
        },
        media: query,
        onchange: null,
        addEventListener: (
          _type: string,
          fn: EventListenerOrEventListenerObject,
        ) => entry.listeners.add(fn as () => void),
        removeEventListener: (
          _type: string,
          fn: EventListenerOrEventListenerObject,
        ) => entry.listeners.delete(fn as () => void),
        addListener() {},
        removeListener() {},
        dispatchEvent: () => true,
      } as MediaQueryList;
      queries.set(query, entry);
    }
    return queries.get(query)!;
  };
  vi.stubGlobal("matchMedia", (query: string) => get(query).value);
  return {
    queries,
    set(query: string, matches: boolean) {
      const entry = get(query);
      entry.matches = matches;
      entry.listeners.forEach((fn) => fn());
    },
  };
}
let media: ReturnType<typeof mediaPreferences>;
beforeEach(() => {
  media = mediaPreferences();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function Surface({
  challenge = featured.challenges[0]!,
  reduced = false,
  disabled = false,
  answered = false,
  initialDraft = emptySceneDraft,
}: {
  challenge?: Challenge;
  reduced?: boolean;
  disabled?: boolean;
  answered?: boolean;
  initialDraft?: SceneDraft;
}) {
  const [draft, onDraft] = useState(initialDraft);
  const [selected, onSelect] = useState<string[]>([]);
  return h(
    "div",
    { className: "research-lab" },
    h(InvestigationScene, {
      scene: projectScene(challenge.scene, answered, answered)!,
      options: challenge.options,
      multiple: challenge.type === "multiple",
      selected,
      firstSelection: answered ? [challenge.options[0]!.id] : [],
      disabled,
      answered,
      reduced,
      draft,
      onDraft,
      onSelect,
    }),
    h("output", { "aria-label": "Exploration state" }, JSON.stringify(draft)),
    h("output", { "aria-label": "Assessed selection" }, selected.join(",")),
  );
}
const pause = (ms: number) =>
  act(() => new Promise((resolve) => setTimeout(resolve, ms)));

it("changes expanded state immediately and keeps one stable, described control during rapid reversals", async () => {
  render(h(Surface));
  const first = screen.getByRole("button", {
    name: "Inspect During a lecture",
  });
  const second = screen.getByRole("button", {
    name: "Inspect After the lecture",
  });
  const description = first.getAttribute("aria-describedby")!;
  fireEvent.click(first);
  expect(first.getAttribute("aria-expanded")).toBe("true");
  expect(document.getElementById(description)?.textContent).toContain(
    "Participants experienced",
  );
  for (let i = 0; i < 8; i++) {
    fireEvent.click(second);
    fireEvent.click(first);
  }
  fireEvent.click(second);
  expect(first.getAttribute("aria-expanded")).toBe("false");
  expect(second.getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByRole("button", { name: "Inspect During a lecture" })).toBe(
    first,
  );
  expect(
    screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-expanded") === "true"),
  ).toHaveLength(1);
  await pause(220);
  expect(screen.getByLabelText("Exploration state").textContent).toContain(
    '"inspectedId":"measurement"',
  );
  expect(screen.getByLabelText("Assessed selection").textContent).toBe("");
});

it("animates fine-pointer hover but resets it for disabled assessed controls", async () => {
  const user = userEvent.setup();
  const view = render(h(Surface));
  const input = screen.getAllByRole("radio")[0]!;
  const label = input.closest("label")!;
  await user.hover(label);
  await waitFor(() => expect(label.style.transform).toMatch(/translateY\(-/));
  fireEvent.click(input);
  expect((input as HTMLInputElement).checked).toBe(true);
  expect(screen.getByLabelText("Assessed selection").textContent).toBe("A");
  view.rerender(h(Surface, { disabled: true }));
  await waitFor(() => expect(label.style.transform).toBe("none"));
  await user.click(screen.getAllByRole("radio")[1]!);
  expect(screen.getByLabelText("Assessed selection").textContent).toBe("A");
});

it("does not create hover motion for coarse pointers", async () => {
  act(() => media.set("(hover: hover) and (pointer: fine)", false));
  const user = userEvent.setup();
  render(h(Surface));
  const label = screen.getAllByRole("radio")[0]!.closest("label")!;
  await user.hover(label);
  await pause(180);
  expect(label.style.transform).toBe("none");
});

it("makes an outgoing assembly inert and can reverse removal before the exit finishes", async () => {
  render(h(Surface));
  const pin = screen.getAllByRole("checkbox", {
    name: "Use in my reasoning",
  })[0]!;
  fireEvent.click(pin);
  fireEvent.click(pin);
  const outgoing = document.querySelector(
    '[aria-label="Your evidence assembly"]',
  )!;
  expect(outgoing.getAttribute("aria-hidden")).toBe("true");
  expect(outgoing.hasAttribute("inert")).toBe(true);
  fireEvent.click(pin);
  await pause(220);
  const assemblies = document.querySelectorAll(
    '[aria-label="Your evidence assembly"]',
  );
  expect(assemblies).toHaveLength(1);
  expect(assemblies[0]!.hasAttribute("inert")).toBe(false);
  expect(screen.getByLabelText("Exploration state").textContent).toContain(
    '"pinnedIds":["condition"]',
  );
  fireEvent.click(pin);
  await waitFor(() =>
    expect(
      document.querySelector('[aria-label="Your evidence assembly"]'),
    ).toBeNull(),
  );
});

it("moves focus from an inert reveal cover to the chart and retains the prediction", async () => {
  render(h(Surface, { challenge: featured.challenges[5]! }));
  fireEvent.click(screen.getByRole("radio", { name: "Similar group means" }));
  fireEvent.click(screen.getByRole("button", { name: /Reveal group results/ }));
  expect(document.activeElement).toBe(screen.getByRole("figure"));
  expect(screen.getByText("Your prediction: Similar group means")).toBeTruthy();
  const cover = document.querySelector(".scene-results-cover");
  if (cover) {
    expect(cover.hasAttribute("inert")).toBe(true);
    expect(cover.getAttribute("aria-hidden")).toBe("true");
  }
  expect(
    screen.queryByText("No-texting minus texting · percentage points"),
  ).toBeNull();
});

it("withdraws server-gated feedback synchronously instead of keeping an exit copy", () => {
  const view = render(
    h(Surface, {
      challenge: featured.challenges[5]!,
      answered: true,
      initialDraft: {
        inspectedId: null,
        prediction: "Similar group means",
        revealed: true,
      },
    }),
  );
  expect(
    screen.getByText("An absolute difference between averages"),
  ).toBeTruthy();
  expect(
    screen.getByText("No-texting minus texting · percentage points"),
  ).toBeTruthy();
  view.rerender(
    h(Surface, { challenge: featured.challenges[5]!, answered: false }),
  );
  expect(
    screen.queryByText("An absolute difference between averages"),
  ).toBeNull();
  expect(
    screen.queryByText("No-texting minus texting · percentage points"),
  ).toBeNull();
});

it("responds live to device preferences without remounting the expanded card or losing focus", async () => {
  const user = userEvent.setup();
  const view = render(h(Surface));
  const card = screen.getByRole("button", { name: "Inspect During a lecture" });
  await user.click(card);
  act(() => media.set("(prefers-reduced-motion: reduce)", true));
  expect(
    document
      .querySelector("[data-scene-reduced]")
      ?.getAttribute("data-scene-reduced"),
  ).toBe("true");
  expect(screen.getByRole("button", { name: "Inspect During a lecture" })).toBe(
    card,
  );
  expect(document.activeElement).toBe(card);
  expect(card.getAttribute("aria-expanded")).toBe("true");
  await waitFor(() =>
    expect(
      document.querySelector(".scene-node-copy")?.getAttribute("style"),
    ).toContain("opacity: 1"),
  );
  act(() => media.set("(prefers-reduced-motion: reduce)", false));
  await pause(220);
  expect(card.getAttribute("aria-expanded")).toBe("true");
  expect(document.activeElement).toBe(card);
  view.unmount();
  expect(
    [...media.queries.values()].every((query) => query.listeners.size === 0),
  ).toBe(true);
});

it("settles an active quantitative reveal at its actual value when the app preference changes", async () => {
  const view = render(h(Surface, { challenge: featured.challenges[5]! }));
  fireEvent.click(screen.getByRole("button", { name: /Reveal group results/ }));
  view.rerender(
    h(Surface, { challenge: featured.challenges[5]!, reduced: true }),
  );
  const bar = document.querySelector<HTMLElement>("[data-scene-bar]")!;
  await waitFor(() => expect(bar.style.transform).toContain("scaleX(0.7341)"));
  expect(screen.getByRole("figure").textContent).toContain("73.41");
  expect(screen.getByLabelText("Assessed selection").textContent).toBe("");
});

it("uses native disclosure keyboard actions, returns focus on Escape and makes outgoing fields inert", async () => {
  const user = userEvent.setup();
  const view = render(
    h(SceneDisclosure, {
      title: "Review this decision",
      reduced: false,
      children: h("input", { "aria-label": "Review note" }),
    }),
  );
  const trigger = screen.getByRole("button", { name: "Review this decision" });
  trigger.focus();
  await user.keyboard(" ");
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  const input = screen.getByRole("textbox", { name: "Review note" });
  await user.click(input);
  view.rerender(
    h(SceneDisclosure, {
      title: "Review this decision",
      reduced: true,
      children: h("input", { "aria-label": "Review note" }),
    }),
  );
  expect(document.activeElement).toBe(input);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  await user.keyboard("{Escape}");
  expect(document.activeElement).toBe(trigger);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("textbox", { name: "Review note" })).toBeNull();
});

it("removes the outgoing challenge immediately and does not replay initial saved content", () => {
  const frame = (identity: string, text: string) =>
    h(SceneMotion, {
      reduced: false,
      children: h(SceneTransition, { identity, children: h("h1", null, text) }),
    });
  const view = render(frame("paper-one:question-one", "Saved question"));
  const saved = document.querySelector<HTMLElement>(".scene-challenge-body")!;
  expect(saved.style.opacity).toBe("1");
  view.rerender(frame("paper-two:question-one", "Different paper"));
  expect(screen.queryByText("Saved question")).toBeNull();
  expect(document.querySelectorAll(".scene-challenge-body")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "Different paper" })).toBeTruthy();
});

it("shares the same motion primitives across all families and unrelated paper fixtures", () => {
  for (const challenge of [
    featured.challenges[0]!,
    featured.challenges[1]!,
    featured.challenges[5]!,
    featured.bonus!,
    quantitativeSceneLesson.challenges[1]!,
    qualitativeSceneLesson.challenges[0]!,
  ]) {
    const view = render(
      h(Surface, { challenge, reduced: true, answered: true }),
    );
    expect(
      screen.getByRole("region", { name: challenge.scene!.title }),
    ).toBeTruthy();
    expect(
      document.querySelectorAll('[data-scene-reduced="true"]'),
    ).toHaveLength(1);
    view.unmount();
  }
});

it("can enable motion after starting with the saved reduced-motion preference", async () => {
  const user = userEvent.setup();
  const view = render(h(Surface, { reduced: true }));
  const label = screen.getAllByRole("radio")[0]!.closest("label")!;
  view.rerender(h(Surface, { reduced: false }));
  await user.hover(label);
  await waitFor(() => expect(label.style.transform).toMatch(/translateY\(-/));
});
