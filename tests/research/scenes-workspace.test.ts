// @vitest-environment jsdom
import { createElement } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { render, screen, cleanup, waitFor, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ResearchApp } from "../../apps/web/src/research/ResearchApp.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  transition,
  submit,
  publicSession,
} from "../../apps/api/src/research/engine.js";

const adventureId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
const config = {
  liveAI: false,
  demoAvailable: false,
  storage: true,
  model: "fixture",
  maxUploadBytes: 4000000,
};
function initial() {
  let s = transition(newSession(featured, adventureId), featured, "begin");
  for (let i = 0; i < 5; i++)
    s = transition(
      submit(s, featured, featured.challenges[i]!.accepted, ""),
      featured,
      "next",
    );
  return s;
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.hash = `/research/adventure/${adventureId}`;
  window.scrollTo = () => {};
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: true,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("preserves prediction and answer drafts after failure, through retry, and across a saved-version resume", async () => {
  let saved = initial();
  let fail = true;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/config")) return Response.json(config);
      if (!init?.body) return Response.json(publicSession(saved, featured));
      const body = JSON.parse(String(init.body));
      if (fail) {
        fail = false;
        return Response.json(
          { error: "Temporary save failure. Try again." },
          { status: 503 },
        );
      }
      expect(body.version).toBe(saved.version);
      saved =
        body.action === "submit"
          ? submit(saved, featured, body.selected, body.reasoning)
          : transition(saved, featured, body.action);
      saved.version++;
      return Response.json(publicSession(saved, featured));
    }),
  );
  const user = userEvent.setup();
  const view = render(createElement(ResearchApp, { onExit() {} }));
  await screen.findByRole("heading", { name: "See the group difference" });
  await user.click(screen.getByRole("radio", { name: "Similar group means" }));
  await user.click(
    screen.getByRole("button", { name: /Reveal group results/ }),
  );
  await user.click(
    screen
      .getAllByRole("radio")
      .find((el) => el.getAttribute("value") === "B")!,
  );
  await user.click(screen.getByRole("button", { name: "Check Answer" }));
  await screen.findByText("Temporary save failure. Try again.");
  expect(
    (
      screen
        .getAllByRole("radio")
        .find((el) => el.getAttribute("value") === "B") as HTMLInputElement
    ).checked,
  ).toBe(true);
  expect(screen.getByText("Your prediction: Similar group means")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Check Answer" }));
  await screen.findByRole("button", { name: "Try again" });
  expect(screen.getByText("Your prediction: Similar group means")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByRole("button", { name: "Check Answer" });
  await user.click(
    screen
      .getAllByRole("radio")
      .find((el) => el.getAttribute("value") === "A")!,
  );
  await user.click(screen.getByRole("button", { name: "Check Answer" }));
  await screen.findByRole("button", { name: "Continue" });
  expect(publicSession(saved, featured).points).toBe(60);
  expect(saved.answers.q6).toHaveLength(2);
  view.unmount();
  render(createElement(ResearchApp, { onExit() {} }));
  await screen.findByRole("button", { name: "Continue" });
  expect(screen.getByText("Your prediction: Similar group means")).toBeTruthy();
  expect(screen.getByText("Your first response")).toBeTruthy();
  expect(saved.answers.q6).toHaveLength(2);
});

it("does not let a late visual answer response replace a newer adventure", async () => {
  const old = initial();
  const newer = transition(
    newSession(featured, "11111111-2222-3333-4444-555555555555"),
    featured,
    "begin",
  );
  let finish!: (response: Response) => void;
  const pending = new Promise<Response>((resolve) => {
    finish = resolve;
  });
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/config")) return Response.json(config);
      if (init?.body) return pending;
      return Response.json(
        publicSession(url.includes(newer.id) ? newer : old, featured),
      );
    }),
  );
  const user = userEvent.setup();
  render(createElement(ResearchApp, { onExit() {} }));
  await screen.findByRole("heading", { name: "See the group difference" });
  await user.click(
    screen.getByRole("button", { name: /Reveal group results/ }),
  );
  await user.click(
    screen
      .getAllByRole("radio")
      .find((el) => el.getAttribute("value") === "A")!,
  );
  await user.click(screen.getByRole("button", { name: "Check Answer" }));
  await act(async () => {
    window.location.hash = `/research/adventure/${newer.id}`;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
  await screen.findByRole("heading", { name: "What does this study connect?" });
  await act(async () => {
    finish(
      Response.json(publicSession(submit(old, featured, ["A"], ""), featured)),
    );
    await pending;
  });
  await waitFor(() =>
    expect(
      screen.queryByRole("heading", { name: "See the group difference" }),
    ).toBeNull(),
  );
  expect(
    screen.getByRole("heading", { name: "What does this study connect?" }),
  ).toBeTruthy();
});

it("continues into the bonus with one current challenge, correct focus and no outgoing findings", async () => {
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
  let saved = initial();
  for (const index of [5, 6])
    saved = transition(
      submit(
        saved,
        featured,
        featured.challenges[index]!.accepted,
        "Evidence-linked reasoning",
      ),
      featured,
      "next",
    );
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes("/config")) return Response.json(config);
      if (!init?.body) return Response.json(publicSession(saved, featured));
      const body = JSON.parse(String(init.body));
      expect(body.version).toBe(saved.version);
      saved =
        body.action === "submit"
          ? submit(saved, featured, body.selected, body.reasoning)
          : transition(saved, featured, body.action);
      saved.version++;
      return Response.json(publicSession(saved, featured));
    }),
  );
  const user = userEvent.setup();
  render(createElement(ResearchApp, { onExit() {} }));
  await screen.findByRole("heading", {
    name: "Draw the boundary of the claim",
  });
  await user.click(
    screen
      .getAllByRole("radio")
      .find((input) => input.getAttribute("value") === "B")!,
  );
  await user.click(screen.getByRole("button", { name: "Check Answer" }));
  await screen.findByText("A stronger design still has a boundary");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await screen.findByRole("button", { name: "Try the bonus" });
  expect(
    screen.queryByText("A stronger design still has a boundary"),
  ).toBeNull();
  await user.click(screen.getByRole("button", { name: "Try the bonus" }));
  const title = await screen.findByRole("heading", {
    level: 1,
    name: "Can Significance Fix the Design?",
  });
  expect(document.activeElement).toBe(title);
  expect(document.querySelectorAll(".scene-challenge-body")).toHaveLength(1);
  expect(
    screen.queryByText("A stronger design still has a boundary"),
  ).toBeNull();
  expect(saved.phase).toBe("bonus");
  expect(saved.answers.q8).toHaveLength(1);
});
