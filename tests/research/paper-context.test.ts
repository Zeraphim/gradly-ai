// @vitest-environment jsdom
import { createElement as h, createRef } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PaperStory } from "../../apps/web/src/components/PaperStory.js";
import { ContextBriefing } from "../../apps/web/src/research/ContextBriefing.js";
import {
  ProcessingPage,
  type ProcessingPageProps,
} from "../../apps/web/src/research/ProcessingPage.js";
import type { ProcessingJob } from "../../apps/web/src/research/types.js";

const requests = vi.fn();
beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.reducedMotion;
  requests.mockReset();
  requests.mockRejectedValue(
    new Error("These reading views must not call a provider."),
  );
  vi.stubGlobal("fetch", requests);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("pointer: fine"),
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => true,
  }));
});
afterEach(() => {
  cleanup();
  expect(requests).not.toHaveBeenCalled();
  localStorage.clear();
  delete document.documentElement.dataset.reducedMotion;
  vi.unstubAllGlobals();
});

function job(overrides: Partial<ProcessingJob> = {}): ProcessingJob {
  return {
    id: "uploaded-lab-report",
    mode: "live",
    consented: false,
    name: "Laboratory methods.pdf",
    stage: 0,
    status: "pending",
    audits: [
      {
        role: "Source reader",
        task: "Inspect uploaded source text",
        status: "Pending",
        summary: "No stage has completed.",
        refs: [],
        model: "Configured model",
      },
    ],
    error: undefined,
    version: 1,
    leaseUntil: 0,
    excerpt: "The laboratory compared two water sampling protocols.",
    pageCount: 2,
    extraction: [
      { page: 1, method: "text", confidence: undefined },
      { page: 2, method: "text", confidence: undefined },
    ],
    evidence: [],
    ready: false,
    ...overrides,
  };
}
function props(
  overrides: Partial<ProcessingPageProps> = {},
): ProcessingPageProps {
  return {
    job: job(),
    config: {
      liveAI: true,
      demoAvailable: false,
      maxUploadBytes: 4000000,
      storage: true,
      model: "Configured model",
    },
    busy: false,
    error: "",
    heading: createRef<HTMLHeadingElement>(),
    sourcePages: null,
    onStart: vi.fn(),
    onStep: vi.fn(),
    onLoadPages: vi.fn(),
    reduced: true,
    ...overrides,
  };
}
function saveMotion(reduced: boolean) {
  const value = String(reduced);
  localStorage.setItem("gradly-reduced-motion", value);
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: "gradly-reduced-motion",
      newValue: value,
      storageArea: localStorage,
    }),
  );
}

it("honors saved reduced motion outside the research shell and settles live preference changes without losing reading or focus", async () => {
  localStorage.setItem("gradly-reduced-motion", "true");
  const user = userEvent.setup();
  render(h(PaperStory));
  const measurement = screen.getByRole("button", { name: "Measurement" });
  await user.click(measurement);
  expect(measurement.getAttribute("aria-pressed")).toBe("true");
  expect(
    screen.getByRole("heading", {
      name: "Follow the session, then inspect the measure.",
    }),
  ).toBeTruthy();
  expect(document.activeElement).toBe(measurement);
  await user.hover(measurement);
  await waitFor(() => expect(measurement.style.transform).toBe("none"));

  act(() => saveMotion(false));
  await user.unhover(measurement);
  await user.hover(measurement);
  await waitFor(() =>
    expect(measurement.style.transform).toMatch(/translateY\(-/),
  );
  act(() => saveMotion(true));
  await waitFor(() => expect(measurement.style.transform).toBe("none"));
  expect(screen.getByRole("button", { name: "Measurement" })).toBe(measurement);
  expect(measurement.getAttribute("aria-pressed")).toBe("true");
  expect(document.activeElement).toBe(measurement);
  expect(
    screen.getByRole("heading", {
      name: "Follow the session, then inspect the measure.",
    }),
  ).toBeTruthy();
  expect(
    screen.getByText(
      "Findings stay hidden until the results stage.",
    ),
  ).toBeTruthy();
});

it("lets a sample learner retry a parent request failure while distinguishing their upload from the authored guide", async () => {
  const onStep = vi.fn();
  const user = userEvent.setup();
  render(
    h(
      ContextBriefing,
      props({
        job: job({
          mode: "demo",
          consented: true,
          status: "processing",
          stage: 2,
        }),
        error: "The saved preparation request was interrupted.",
        onStep,
      }),
    ),
  );
  expect(screen.getByRole("alert").textContent).toContain(
    "request was interrupted",
  );
  expect(
    screen.getByText(/not generated from, or an analysis of, your upload/),
  ).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Retry failed stage" }));
  expect(onStep).toHaveBeenCalledExactlyOnceWith(true);
  expect(
    screen.queryByRole("button", { name: "Start quest" }),
  ).toBeNull();
  await user.click(screen.getByText("View your upload’s extracted text"));
  expect(
    screen.getByRole("heading", { name: "Laboratory methods.pdf" }),
  ).toBeTruthy();
  expect(
    screen.getByText("The laboratory compared two water sampling protocols."),
  ).toBeTruthy();
  expect(
    screen.getByText(/The study above is a separate, authored reference\./),
  ).toBeTruthy();
});

it("keeps a live upload's source and explicit consent ahead of saved stages without substituting reference-study content", async () => {
  const onStep = vi.fn();
  const onLoadPages = vi.fn();
  const user = userEvent.setup();
  const initial = props({ onStep, onLoadPages });
  const view = render(h(ProcessingPage, initial));
  expect(screen.getByText("Laboratory methods.pdf")).toBeTruthy();
  const excerpt = screen.getByText(
    "The laboratory compared two water sampling protocols.",
  );
  expect(excerpt.closest("details")?.open).toBe(true);
  expect(screen.queryByText("Reference study · authored guide")).toBeNull();
  expect(screen.queryByText("56 students")).toBeNull();
  const consent = screen.getByRole("button", { name: "Confirm AI processing" });
  expect(
    excerpt.compareDocumentPosition(consent) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
  // Saved stages only appear once the learner has confirmed processing.
  expect(
    screen.queryByRole("region", { name: "Saved preparation stages" }),
  ).toBeNull();
  expect(
    screen.getByText(/Continuing sends extracted text to Nebius Token Factory/),
  ).toBeTruthy();
  await user.click(consent);
  expect(onStep).toHaveBeenCalledExactlyOnceWith(false, true);
  await user.click(
    screen.getByRole("button", { name: "Inspect all extracted pages" }),
  );
  expect(onLoadPages).toHaveBeenCalledTimes(1);
  view.rerender(
    h(ProcessingPage, {
      ...initial,
      sourcePages: [
        { page: 1, text: "Sampling began before sunrise.", method: "text" },
        {
          page: 2,
          text: "Both protocols used sterile containers.",
          method: "text",
        },
      ],
    }),
  );
  expect(
    screen.getByRole("region", { name: "Text from PDF page 1" }).textContent,
  ).toBe("Sampling began before sunrise.");
  await user.click(screen.getByRole("button", { name: "Next extracted page" }));
  expect(
    screen.getByRole("region", { name: "Text from PDF page 2" }).textContent,
  ).toBe("Both protocols used sterile containers.");
  expect(
    screen.queryByRole("button", { name: "Inspect all extracted pages" }),
  ).toBeNull();
});

it("shows saved-state loading and prevents duplicate source or consent actions while a live request is pending", async () => {
  const user = userEvent.setup();
  const onLoadPages = vi.fn();
  const onStep = vi.fn();
  const initial = props({ job: null, onLoadPages, onStep });
  const view = render(h(ProcessingPage, initial));
  expect(screen.getByRole("status").textContent).toContain(
    "Loading saved processing state",
  );
  expect(
    screen.queryByRole("button", { name: "Start quest" }),
  ).toBeNull();
  view.rerender(h(ProcessingPage, { ...initial, job: job(), busy: true }));
  const sourceAction = screen.getByRole("button", {
    name: "Inspect all extracted pages",
  });
  const consentAction = screen.getByRole("button", { name: "Opening…" });
  expect((sourceAction as HTMLButtonElement).disabled).toBe(true);
  expect((consentAction as HTMLButtonElement).disabled).toBe(true);
  await user.click(sourceAction);
  await user.click(consentAction);
  expect(onLoadPages).not.toHaveBeenCalled();
  expect(onStep).not.toHaveBeenCalled();
  expect(
    screen.queryByRole("button", { name: "Start quest" }),
  ).toBeNull();
});
