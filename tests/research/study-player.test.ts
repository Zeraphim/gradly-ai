// @vitest-environment jsdom
import { createElement as h } from "react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { StudyPreview } from "../../apps/web/src/research/studies/StudyPreview.js";
import {
  loadStudy,
  studies,
} from "../../apps/web/src/research/studies/catalog.js";

beforeEach(() => {
  localStorage.clear();
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
  window.scrollTo = () => {};
});
afterEach(cleanup);

const view = (path: string) => h(StudyPreview, { path, onExit: () => {} });

it("lists every study, reviewed or not, without a flag", async () => {
  render(view("/studies"));
  expect(screen.queryByRole("switch")).toBeNull();
  expect(
    screen
      .getAllByRole("link", { name: /./ })
      .filter((a) => a.className === "library-card-link"),
  ).toHaveLength(studies.length);
  await userEvent.click(screen.getByRole("button", { name: /Longitudinal/ }));
  expect(
    screen.getByRole("link", { name: "Restless nights and grades" }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("link", { name: "Breakfast and grades" }),
  ).toBeNull();
});

it("opens a direct link to an unreviewed study", async () => {
  render(view("/studies/breakfast-grades"));
  expect(
    await screen.findByRole("button", { name: /Begin study/ }),
  ).toBeTruthy();
});

it("plays choose → check → retry → explain with points once per solve, and restores on reload", async () => {
  const study = (await loadStudy("breakfast-grades"))!;
  const [first, second] = study.lesson.challenges;
  const { unmount } = render(view("/studies/breakfast-grades"));
  // The paper's identity stays hidden until the final reveal.
  await userEvent.click(
    await screen.findByRole("button", { name: /Begin study/ }),
  );
  expect(screen.queryByText(study.lesson.paper.title)).toBeNull();
  const check = () => screen.getByRole("button", { name: /^Check/ });
  expect((check() as HTMLButtonElement).disabled).toBe(true);

  // Solve the first challenge on the first try.
  const right = first!.options.find((o) => first!.accepted.includes(o.id))!;
  await userEvent.click(
    screen.getByRole("radio", { name: new RegExp(escape(right.text)) }),
  );
  await userEvent.click(check());
  expect(screen.getByText(/\+10 points/)).toBeTruthy();
  expect(
    screen.getByLabelText("10 practice points in this study"),
  ).toBeTruthy();
  await act(() => new Promise((r) => setTimeout(r, 300)));
  await userEvent.click(screen.getByRole("button", { name: /^Continue/ }));

  // Miss the second twice: one retry with a hint, then the explanation, no points.
  const wrong = second!.options.filter((o) => !second!.accepted.includes(o.id));
  const pickText = async (text: string) =>
    userEvent.click(
      screen
        .getAllByRole("radio")
        .find(
          (el) =>
            el.getAttribute("aria-label")?.includes(text) ||
            el.closest("label")?.textContent?.includes(text),
        )!,
    );
  await pickText(
    second!.scene
      ? second!.scene.responses.find((r) => r.optionId === wrong[0]!.id)!.label
      : wrong[0]!.text,
  );
  await userEvent.click(check());
  expect(screen.getByRole("heading", { name: "Not quite yet" })).toBeTruthy();
  expect(screen.getAllByText(second!.hint).length).toBeGreaterThan(0);
  await act(() => new Promise((r) => setTimeout(r, 300)));
  await userEvent.click(screen.getByRole("button", { name: /^Try again/ }));
  await pickText(
    second!.scene
      ? second!.scene.responses.find(
          (r) => r.optionId === (wrong[1] ?? wrong[0])!.id,
        )!.label
      : (wrong[1] ?? wrong[0])!.text,
  );
  await userEvent.click(check());
  expect(
    screen.getByRole("heading", { name: "Here’s the reasoning" }),
  ).toBeTruthy();
  expect(
    screen.getByLabelText("10 practice points in this study"),
  ).toBeTruthy();

  // Reload: the explained state comes back without losing answers.
  unmount();
  render(view("/studies/breakfast-grades"));
  expect(
    await screen.findByRole("heading", { name: "Here’s the reasoning" }),
  ).toBeTruthy();
  expect(
    screen.getByLabelText("10 practice points in this study"),
  ).toBeTruthy();
});

it("chooses with number keys and checks with Enter", async () => {
  const study = (await loadStudy("learning-styles"))!;
  const first = study.lesson.challenges[0]!;
  render(view("/studies/learning-styles"));
  await userEvent.click(
    await screen.findByRole("button", { name: /Begin study/ }),
  );
  const index = first.options.findIndex((o) => first.accepted.includes(o.id));
  await userEvent.keyboard(String(index + 1));
  expect(
    (screen.getAllByRole("radio")[index] as HTMLInputElement).checked,
  ).toBe(true);
  await userEvent.keyboard("{Enter}");
  expect(screen.getByText(/\+10 points/)).toBeTruthy();
});

it("shows the recovery screen for a slug that no longer exists", () => {
  render(view("/studies/removed-paper"));
  expect(
    screen.getByRole("heading", { name: "This study isn’t available" }),
  ).toBeTruthy();
  expect(screen.getByText("The link may be out of date.")).toBeTruthy();
});

it("ignores saved progress for removed studies when offering a resume", () => {
  const started = {
    phase: "challenge",
    index: 1,
    bonus: false,
    attempts: { q1: [{ selected: ["A"], correct: true }] },
    retrying: null,
    draft: null,
    completed: false,
  };
  // Saved progress arrives as another tab would write it, so the store rereads it.
  const save = (store: object) =>
    act(() => {
      localStorage.setItem("gradly-study-progress:v1", JSON.stringify(store));
      window.dispatchEvent(
        new StorageEvent("storage", { key: "gradly-study-progress:v1" }),
      );
    });
  const resume = () =>
    screen.queryByRole("region", { name: "Continue where you left off" });
  render(view("/studies"));
  save({ "removed-paper": { ...started, updated: 2 } });
  expect(resume()).toBeNull();
  save({
    "removed-paper": { ...started, updated: 2 },
    "sleep-school": { ...started, updated: 1 },
  });
  expect(resume()?.textContent).toContain("Restless nights and grades");
});

function escape(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 40);
}

it("starts revised questions afresh without erasing old or unrelated saved work", async () => {
  const old = {
    phase: "reveal",
    index: 4,
    bonus: false,
    attempts: { c1: [{ selected: ["A"], correct: true }] },
    retrying: null,
    draft: null,
    completed: true,
    updated: 77,
  };
  const saved = { "memory-training": old, "sleep-school": old };
  const library = render(view("/studies"));
  act(() => {
    localStorage.setItem("gradly-study-progress:v1", JSON.stringify(saved));
    window.dispatchEvent(
      new StorageEvent("storage", { key: "gradly-study-progress:v1" }),
    );
  });
  library.unmount();
  const { unmount } = render(view("/studies/memory-training"));
  const begin = await screen.findByRole("button", { name: /Begin study/ });
  expect(screen.getByRole("status").textContent).toContain(
    "questions have changed",
  );
  expect(JSON.parse(localStorage.getItem("gradly-study-progress:v1")!)).toEqual(
    saved,
  );
  await userEvent.click(begin);
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.getByLabelText("0 practice points in this study")).toBeTruthy();
  const next = JSON.parse(localStorage.getItem("gradly-study-progress:v1")!);
  expect(next["memory-training"].revision).toBe(2);
  expect(next["memory-training"].attempts).toEqual({});
  expect(next["sleep-school"]).toEqual(old);
  unmount();
  render(view("/studies/memory-training"));
  expect(
    await screen.findByLabelText("0 practice points in this study"),
  ).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Begin study/ })).toBeNull();
});

it("ignores a damaged saved attempt instead of crashing the library", () => {
  render(view("/studies"));
  act(() => {
    localStorage.setItem(
      "gradly-study-progress:v1",
      JSON.stringify({
        "sleep-school": {
          phase: "challenge",
          index: 0,
          bonus: false,
          attempts: { q1: [null] },
          retrying: null,
          draft: null,
          completed: false,
          updated: 77,
        },
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: "gradly-study-progress:v1" }),
    );
  });
  expect(
    screen.getByRole("heading", { name: "Pick a study. Make the calls." }),
  ).toBeTruthy();
  expect(
    screen.queryByRole("region", { name: "Continue where you left off" }),
  ).toBeNull();
});

it("reflects another tab clearing browser progress", () => {
  render(view("/studies"));
  act(() => {
    localStorage.setItem(
      "gradly-study-progress:v1",
      JSON.stringify({
        "memory-training": {
          revision: 2,
          phase: "challenge",
          index: 0,
          bonus: false,
          attempts: {},
          retrying: null,
          draft: null,
          completed: false,
          updated: 77,
        },
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: "gradly-study-progress:v1" }),
    );
  });
  expect(
    screen.getByRole("region", { name: "Continue where you left off" }),
  ).toBeTruthy();
  act(() => {
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
  });
  expect(
    screen.queryByRole("region", { name: "Continue where you left off" }),
  ).toBeNull();
});
