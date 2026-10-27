// @vitest-environment jsdom
import { createElement as h, useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  excerptSnippet,
  placePopover,
  segmentText,
  termEntries,
} from "../../apps/web/src/research/terms/term-logic.js";
import {
  TermChips,
  TermProvider,
  TermText,
} from "../../apps/web/src/research/terms/Terms.js";
import { SceneMotion } from "../../apps/web/src/research/scenes/scene-motion.js";
import type { Term } from "@paperquest/contracts";

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
afterEach(cleanup);

const evidence = [
  {
    id: "method",
    page: 3,
    excerpt:
      "Random assignment placed each student in the texting or the no-texting group before the lecture began.",
  },
];
const lessonTerms: Term[] = [
  {
    term: "random assignment",
    definition:
      "In this study, chance alone decided which students texted during the lecture.",
    refs: ["method"],
    source: "paper",
  },
  {
    term: "comprehension quiz",
    definition:
      "The short test on the lecture's content that every student took.",
    refs: [],
    source: "model",
  },
];

describe("term logic", () => {
  it("puts lesson terms before glossary terms and lets a lesson term win", () => {
    const entries = termEntries(lessonTerms, evidence);
    expect(entries[0]).toMatchObject({
      term: "random assignment",
      origin: "paper",
      sources: evidence,
    });
    expect(entries.filter((e) => e.key === "random assignment")).toHaveLength(
      1,
    );
    expect(
      entries.some((e) => e.origin === "glossary" && e.term === "p-value"),
    ).toBe(true);
    // Too general to underline in every question.
    expect(entries.some((e) => e.term === "Evidence")).toBe(false);
    expect(termEntries(lessonTerms, evidence, false)).toHaveLength(2);
  });

  it("marks each term once and prefers the longer overlapping term", () => {
    const entries = [
      { key: "random", term: "random" },
      { key: "random assignment", term: "random assignment" },
    ];
    expect(
      segmentText("Random assignment, then random again.", entries),
    ).toEqual([
      { text: "Random assignment", key: "random assignment" },
      { text: ", then " },
      { text: "random", key: "random" },
      { text: " again." },
    ]);
    expect(segmentText("No terms here.", entries)).toEqual([
      { text: "No terms here." },
    ]);
  });

  it("places the popover above its term and flips below near the top", () => {
    const viewport = { width: 400, height: 800 };
    const size = { width: 300, height: 120 };
    const low = placePopover(
      { top: 400, bottom: 420, left: 100, width: 80 },
      size,
      viewport,
    );
    expect(low).toMatchObject({ side: "top", top: 400 - 10 - 120 });
    const high = placePopover(
      { top: 40, bottom: 60, left: 100, width: 80 },
      size,
      viewport,
    );
    expect(high).toMatchObject({ side: "bottom", top: 70 });
  });

  it("keeps the popover inside the viewport and points the arrow at the term", () => {
    const edge = placePopover(
      { top: 400, bottom: 420, left: 330, width: 30 },
      { width: 300, height: 100 },
      { width: 400, height: 800 },
    );
    expect(edge.left).toBe(400 - 12 - 300);
    expect(edge.left + edge.arrow).toBeCloseTo(345);
    // Near the edge, the arrow stays clear of the rounded corner.
    const corner = placePopover(
      { top: 400, bottom: 420, left: 384, width: 10 },
      { width: 300, height: 100 },
      { width: 400, height: 800 },
    );
    expect(corner.arrow).toBe(300 - 18);
  });

  it("cuts a long excerpt around the term", () => {
    const long = `${"Earlier context sentence. ".repeat(20)}Students were randomly assigned to groups. ${"Later detail. ".repeat(20)}`;
    const snippet = excerptSnippet(long, "randomly assigned", 120);
    expect(snippet.mark).toBe("randomly assigned");
    expect(snippet.before.startsWith("…")).toBe(true);
    expect(snippet.after.endsWith("…")).toBe(true);
  });
});

function Harness() {
  const [selected, setSelected] = useState("");
  const [round, setRound] = useState(0);
  const entries = termEntries(lessonTerms, evidence, false);
  const content = [
    h(
      "p",
      { key: "q" },
      h(TermText, { text: "Why use random assignment here?" }),
    ),
    h(
      "label",
      { key: "a" },
      h("input", {
        type: "radio",
        name: "a",
        checked: selected === "a",
        onChange: () => setSelected("a"),
      }),
      h(TermText, { text: "Score on the comprehension quiz", passive: true }),
    ),
    h(TermChips, {
      key: "chips",
      texts: ["Score on the comprehension quiz"],
      covered: ["Why use random assignment here?"],
    }),
    h("output", { key: "out" }, selected || "none"),
    h(
      "button",
      { key: "check", type: "button", onClick: () => setRound((r) => r + 1) },
      "Check",
    ),
  ];
  return h(SceneMotion, {
    reduced: true,
    children: h(TermProvider, {
      entries,
      scope: "test",
      resetKey: String(round),
      children: content,
    }),
  });
}

describe("term popover", () => {
  it("opens a paper definition on click and shows its source chip", () => {
    render(h(Harness));
    fireEvent.click(screen.getByRole("button", { name: "random assignment" }));
    const popover = screen.getByRole("group", {
      name: "random assignment: definition",
    });
    expect(popover.textContent).toContain("chance alone decided");
    const chip = screen.getByRole("button", { name: "From the paper, p. 3" });
    fireEvent.click(chip);
    expect(document.querySelector(".term-excerpt mark")?.textContent).toBe(
      "Random assignment",
    );
    const trigger = screen.getByRole("button", { name: "random assignment" });
    expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("selects the answer when its term is pressed, and a tap also shows the definition", () => {
    render(h(Harness));
    const mark = document.querySelector<HTMLElement>("label .term-mark")!;
    fireEvent.pointerDown(mark, { pointerType: "mouse" });
    fireEvent.click(mark);
    expect(screen.getByText("a")).toBeTruthy();
    expect(screen.queryByRole("group", { name: /definition/ })).toBeNull();
    fireEvent.pointerDown(mark, { pointerType: "touch" });
    fireEvent.click(mark);
    expect(
      screen.getByRole("group", { name: "comprehension quiz: definition" })
        .textContent,
    ).toContain("In this study's context");
  });

  it("offers answer-only terms as chips and closes on Escape", async () => {
    render(h(Harness));
    const chips = screen.getByRole("group", { name: "Terms in the answers" });
    const chip = chips.querySelector("button")!;
    expect(chip.textContent).toBe("comprehension quiz");
    fireEvent.click(chip);
    expect(screen.queryByRole("group", { name: /definition/ })).toBeTruthy();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    await waitFor(() =>
      expect(screen.queryByRole("group", { name: /definition/ })).toBeNull(),
    );
  });

  it("closes when the answer is checked and tints viewed terms", async () => {
    render(h(Harness));
    const trigger = screen.getByRole("button", { name: "random assignment" });
    fireEvent.click(trigger);
    expect(screen.queryByRole("group", { name: /definition/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Check" }));
    await waitFor(() =>
      expect(screen.queryByRole("group", { name: /definition/ })).toBeNull(),
    );
    expect(trigger.className).toContain("is-visited");
  });
});
