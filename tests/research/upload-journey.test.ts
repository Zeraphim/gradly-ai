// @vitest-environment jsdom
import { createElement as h, createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { featured } from "../../apps/api/src/research/featured.js";
import type {
  LearningSession,
  Lesson,
} from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
import {
  finishedCount,
  sessionAttempts,
  toPreparedStudy,
  toProgress,
  toStudyChallenge,
  UPLOADED_KICKER,
} from "../../apps/web/src/research/studies/uploaded.js";
import { UploadedJourney } from "../../apps/web/src/research/studies/UploadedJourney.js";
import {
  ProcessingPage,
  type ProcessingPageProps,
} from "../../apps/web/src/research/ProcessingPage.js";
import { outlineItems } from "../../apps/web/src/research/PreparationOutline.js";
import {
  PreparationTrack,
  SlowStage,
} from "../../apps/web/src/research/PreparationTrack.js";
import { SceneMotion } from "../../apps/web/src/research/scenes/scene-motion.js";
import {
  clearActivePreparation,
  readActivePreparation,
} from "../../apps/web/src/research/client-state.js";
import {
  readPrediction,
  warmupCards,
} from "../../apps/web/src/research/warmup.js";
import type {
  ProcessingJob,
  ResearchSession,
} from "../../apps/web/src/research/types.js";

const JOB_ID = "job-upload";
function lessonFixture(): Lesson {
  const lesson = structuredClone(featured);
  lesson.id = JOB_ID;
  lesson.source = "generated";
  lesson.challenges[0]!.scene = null;
  return lesson;
}
const lesson = lessonFixture();
const view = (s: LearningSession) =>
  publicSession(s, lesson) as unknown as ResearchSession;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  delete document.documentElement.dataset.reducedMotion;
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => true,
  }));
  window.scrollTo = () => {};
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("session adapter", () => {
  const begun = transition(newSession(lesson, "s1"), lesson, "begin");
  const first = lesson.challenges[0]!;
  const wrong = first.options.find((o) => !first.accepted.includes(o.id))!.id;

  it("builds a key-free, scene-less challenge before any check", () => {
    const c = toStudyChallenge(view(begun).challenge!);
    expect(c.scene).toBeNull();
    expect(c.accepted).toEqual([]);
    expect(c.alternatives).toEqual([]);
    expect(c.misconceptions).toEqual({});
    expect(c.explanation).toBe("");
    expect(c.prompt).toBe(first.prompt);
  });

  it("mirrors miss, retry and explanation from the server only", () => {
    let s = submit(begun, lesson, [wrong], "");
    let c = view(s).challenge!;
    expect(sessionAttempts(c)).toEqual([{ selected: [wrong], correct: false }]);
    expect(toStudyChallenge(c).misconceptions[wrong]).toBe(
      first.misconceptions[wrong],
    );
    s = transition(s, lesson, "retry");
    expect(toProgress(view(s)).retrying).toBe(first.id);
    s = submit(s, lesson, [wrong], "");
    c = view(s).challenge!;
    expect(sessionAttempts(c)).toHaveLength(2);
    expect(toStudyChallenge(c).accepted).toEqual(first.accepted);
    expect(toStudyChallenge(c).explanation).toBe(first.explanation);
    expect(finishedCount(view(s))).toBe(1);
  });

  it("keeps the study identity-safe and the list the server's length", () => {
    const study = toPreparedStudy(view(begun));
    expect(study.kicker).toBe(UPLOADED_KICKER);
    expect(study.lesson.challenges).toHaveLength(lesson.challenges.length);
    expect(study.lesson.paper.title).toBe("");
    expect(study.takeaway).toBe("");
    expect(study.lesson.title).toBe(view(begun).study.teaser);
    expect(study.lesson.bonus?.id).toBe(`upcoming-${lesson.challenges.length}`);
    // Unseen challenges are placeholders the player never renders.
    expect(study.lesson.challenges[1]!.prompt).toBe("");
  });

  it("maps every server phase to a player phase", () => {
    expect(toProgress(view(newSession(lesson, "s"))).phase).toBe("intro");
    let s = begun;
    for (const c of lesson.challenges)
      s = transition(submit(s, lesson, c.accepted, ""), lesson, "next");
    expect(toProgress(view(s)).phase).toBe("bonus-offer");
    const bonus = transition(s, lesson, "bonus");
    expect(toProgress(view(bonus))).toMatchObject({
      phase: "challenge",
      bonus: true,
      index: lesson.challenges.length,
    });
    const reveal = transition(s, lesson, "skip");
    const progress = toProgress(view(reveal));
    expect(progress.phase).toBe("reveal");
    expect(Object.keys(progress.attempts)).toHaveLength(
      lesson.challenges.length,
    );
    expect(toPreparedStudy(view(reveal)).lesson.paper).toEqual(lesson.paper);
  });
});

/** The learning and feedback APIs, served by the real engine in memory. */
function serve(l: Lesson = lesson, s0 = newSession(l, "s1")) {
  const sessions = new Map<string, LearningSession>();
  sessions.set(s0.id, s0);
  const calls: { url: string; body: Record<string, unknown> | null }[] = [];
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const body = init?.body ? JSON.parse(String(init.body)) : null;
    calls.push({ url, body });
    const json = (data: unknown, status = 200) =>
      new Response(JSON.stringify(data), { status });
    if (url.startsWith("/api/research/config"))
      return json({
        liveAI: true,
        demoAvailable: false,
        maxUploadBytes: 4000000,
        storage: true,
        model: "fixture",
      });
    if (url.startsWith("/api/research/learning?id=")) {
      const id = decodeURIComponent(url.split("id=")[1]!);
      return json(publicSession(sessions.get(id)!, l));
    }
    if (url === "/api/research/feedback") {
      const s = sessions.get(String(body!.id))!;
      const saved: LearningSession = {
        ...s,
        version: s.version + 1,
        aiFeedback: {
          [String(body!.challengeId)]: {
            category: "Well Supported",
            guidance: "Your reason names the comparison.",
            followup: "Which detail rules out self-selection?",
            refs: [],
            model: "fixture",
          },
        },
      };
      sessions.set(s.id, saved);
      return json({ session: publicSession(saved, l) });
    }
    const s = sessions.get(String(body!.id))!;
    if (body!.version !== s.version) return json({ error: "Changed." }, 409);
    try {
      const next =
        body!.action === "submit"
          ? submit(
              s,
              l,
              body!.selected as string[],
              String(body!.reasoning ?? ""),
            )
          : transition(s, l, String(body!.action));
      const saved = { ...next, version: s.version + 1 };
      sessions.set(s.id, saved);
      return json(publicSession(saved, l));
    } catch (error) {
      return json({ error: (error as Error).message }, 400);
    }
  });
  vi.stubGlobal("fetch", fetchMock);
  return { sessions, calls };
}

const pause = () => new Promise((resolve) => setTimeout(resolve, 300));
const choose = (text: string) =>
  userEvent.click(
    screen.getAllByText(text, { exact: true }).at(-1)!.closest("label")!,
  );

describe("uploaded journey", () => {
  it("plays through Marc's player with server scoring, retry and AI feedback", async () => {
    const { sessions, calls } = serve();
    const first = lesson.challenges[0]!;
    const wrong = first.options.find((o) => !first.accepted.includes(o.id))!;
    const right = first.options.find((o) => first.accepted.includes(o.id))!;
    const { unmount } = render(h(UploadedJourney, { sessionId: "s1" }));
    expect(await screen.findByText(UPLOADED_KICKER)).toBeTruthy();
    await userEvent.click(
      screen.getByRole("button", { name: "Skip to study" }),
    );
    await screen.findByRole("heading", { level: 1, name: first.prompt });

    // An unchecked choice survives a remount in this tab.
    await choose(wrong.text);
    unmount();
    render(h(UploadedJourney, { sessionId: "s1" }));
    await screen.findByRole("heading", { level: 1, name: first.prompt });
    await waitFor(() =>
      expect(
        (screen.getByRole("radio", { name: wrong.text }) as HTMLInputElement)
          .checked,
      ).toBe(true),
    );
    await userEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(await screen.findByText("Not quite yet")).toBeTruthy();
    expect(sessions.get("s1")!.answers[first.id]).toHaveLength(1);
    // The player ignores a second press within 280 ms so feedback is never skipped.
    await pause();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    await choose(right.text);
    await userEvent.click(await screen.findByRole("button", { name: "Check" }));
    expect(await screen.findByText("You got there")).toBeTruthy();
    expect(
      screen.getByLabelText("10 practice points in this study"),
    ).toBeTruthy();
    // The browser never decided correctness: every check went to the server.
    expect(
      calls
        .filter((c) => c.body?.action === "submit")
        .map((c) => c.body!.selected),
    ).toEqual([[wrong.id], [right.id]]);

    // Move to the first written-reasoning challenge.
    const reasoningIndex = lesson.challenges.findIndex(
      (c) => c.writtenReasoning,
    );
    for (let i = 1; i <= reasoningIndex; i++) {
      await pause();
      await userEvent.click(screen.getByRole("button", { name: "Continue" }));
      const c = lesson.challenges[i]!;
      await screen.findByRole("heading", { level: 1, name: c.prompt });
      for (const id of c.accepted)
        await choose(c.options.find((o) => o.id === id)!.text);
      if (c.writtenReasoning)
        await userEvent.type(
          screen.getByLabelText(/Explain your thinking/),
          "Both compare two independent means.",
        );
      await userEvent.click(screen.getByRole("button", { name: "Check" }));
      await screen.findByRole("button", { name: "Continue" });
    }
    const reasoning = lesson.challenges[reasoningIndex]!;
    expect(sessions.get("s1")!.answers[reasoning.id]![0]!.reasoning).toBe(
      "Both compare two independent means.",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Ask the AI coach" }),
    );
    expect(await screen.findByText("Well Supported")).toBeTruthy();
    expect(
      screen.getByText("Which detail rules out self-selection?"),
    ).toBeTruthy();
    expect(screen.getByText(/it can be wrong/)).toBeTruthy();
  });

  it("goes from the last challenge to the paper when there is no bonus", async () => {
    const plain = { ...lesson, bonus: null };
    let s = transition(newSession(plain, "s1"), plain, "begin");
    for (const c of plain.challenges.slice(0, -1))
      s = transition(submit(s, plain, c.accepted, ""), plain, "next");
    const last = plain.challenges.at(-1)!;
    s = submit(s, plain, last.accepted, "");
    const { sessions, calls } = serve(plain, s);
    render(h(UploadedJourney, { sessionId: "s1" }));
    await screen.findByRole("heading", { level: 1, name: last.prompt });
    await pause();
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Study complete" }),
    ).toBeTruthy();
    expect(calls.map((c) => c.body?.action).filter(Boolean)).toEqual([
      "next",
      "skip",
      "finish",
    ]);
    await waitFor(() => expect(sessions.get("s1")!.phase).toBe("complete"));
  });

  it("orients with a saved hunch, the stage route and a practice retry", async () => {
    serve();
    render(h(UploadedJourney, { sessionId: "s1" }));
    await screen.findByText(UPLOADED_KICKER);
    // Step 1: a hunch is saved as the learner's prediction.
    await choose("Two things go together");
    expect(readPrediction(JOB_ID)).toBe(
      "It will show that two things go together.",
    );
    expect(screen.getByRole("status").textContent).toContain("Saved");
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    // Step 2: stage groups come from the server's stage names.
    const design = lesson.challenges.filter((c) => c.reveal === "design");
    const stage = screen.getByRole("button", { name: /Design/ });
    expect(stage.textContent).toContain(String(design.length));
    expect(stage.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(stage);
    expect(stage.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/who took part/)).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: /Next/ }));
    // Step 3: one miss gives a retry, then the right answer earns points.
    await choose("Before the first decision");
    await userEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("Not quite. You have one retry.")).toBeTruthy();
    await choose("After your last decision");
    await userEvent.click(screen.getByRole("button", { name: "Check" }));
    expect(screen.getByText("+10")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: /Begin study/ }));
    await screen.findByRole("heading", {
      level: 1,
      name: lesson.challenges[0]!.prompt,
    });
  });

  it("keeps a written warm-up prediction until the learner replaces it", async () => {
    serve();
    localStorage.setItem(
      `gradly-prediction:${JOB_ID}`,
      "Texting hurts recall.",
    );
    render(h(UploadedJourney, { sessionId: "s1" }));
    expect(await screen.findByText("“Texting hurts recall.”")).toBeTruthy();
    await userEvent.click(
      screen.getByRole("button", { name: "Pick a new one" }),
    );
    await choose("Not sure yet");
    expect(readPrediction(JOB_ID)).toBe("I wasn’t sure yet.");
  });

  it("recovers when another tab saved first", async () => {
    const { sessions } = serve();
    render(h(UploadedJourney, { sessionId: "s1" }));
    await screen.findByText(UPLOADED_KICKER);
    // Another tab begins the same session.
    const other = sessions.get("s1")!;
    sessions.set("s1", {
      ...transition(other, lesson, "begin"),
      version: other.version + 1,
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Skip to study" }),
    );
    expect(await screen.findByRole("alert")).toBeTruthy();
    await screen.findByRole("heading", {
      level: 1,
      name: lesson.challenges[0]!.prompt,
    });
  });
});

function job(
  stage: number,
  overrides: Partial<ProcessingJob> = {},
): ProcessingJob {
  const ready = overrides.status === "ready";
  return {
    id: JOB_ID,
    mode: "live",
    consented: true,
    name: "paper.pdf",
    stage,
    status: "processing",
    audits: [
      "Research Evidence Analyst",
      "Lesson Architect",
      "Research Methods Reviewer",
      "Learning Coach",
      "Evidence Verification",
    ].map((role, i) => ({
      role,
      task: "Task.",
      status: ready || i < stage ? "Completed" : "Processing",
      summary: "Summary.",
      refs: [],
      model: "fixture",
    })),
    version: 1,
    leaseUntil: Date.now() + 100000,
    excerpt: "Text.",
    pageCount: 4,
    extraction: [],
    evidence:
      stage > 0 ? [{ id: "source1", page: 1, excerpt: "An excerpt." }] : [],
    outline: stage > 1 ? { challenges: 6, bonus: false, reasoning: 1 } : null,
    ready,
    error: undefined,
    ...overrides,
  };
}
function pageProps(
  overrides: Partial<ProcessingPageProps> = {},
): ProcessingPageProps {
  return {
    job: job(1),
    config: {
      liveAI: true,
      demoAvailable: false,
      maxUploadBytes: 4000000,
      storage: true,
      model: "fixture",
    },
    busy: false,
    error: "",
    heading: createRef<HTMLHeadingElement>(),
    sourcePages: null,
    onStart: vi.fn(),
    onStep: vi.fn(),
    onLoadPages: vi.fn(),
    reduced: false,
    ...overrides,
  };
}

describe("waiting experience", () => {
  it("lists only what saved stages produced, as counts", () => {
    const labels = (j: ProcessingJob) => outlineItems(j).map((i) => i.label);
    expect(labels(job(0))).toEqual(["Finding evidence passages"]);
    expect(labels(job(1))).toEqual([
      "1 evidence passage found",
      "Drafting your challenges",
    ]);
    expect(labels(job(2))).toEqual([
      "1 evidence passage found",
      "6 challenges drafted",
      "1 asks you to explain your thinking",
      "Checking the research methods",
    ]);
    expect(labels(job(5, { status: "ready" })).at(-1)).toBe(
      "Every quote matched to your PDF",
    );
  });

  it("celebrates a stage only when it finishes while the page is open", () => {
    const track = (j: ProcessingJob) =>
      h(SceneMotion, {
        reduced: false,
        children: h(PreparationTrack, { job: j }),
      });
    const { rerender } = render(track(job(2)));
    expect(screen.queryByText(/finished/)).toBeNull();
    rerender(track(job(3)));
    expect(screen.getByText(/Research Methods Reviewer finished/)).toBeTruthy();
    expect(screen.getByText("4/5 · Learning Coach")).toBeTruthy();
  });

  it("shows elapsed time and honest copy only when a step runs long", () => {
    const at = (elapsed: number) =>
      render(h(SlowStage, { elapsed })).container.textContent;
    expect(at(10)).toBe("");
    cleanup();
    expect(at(45)).toBe("On this step for 0:45");
    cleanup();
    expect(at(75)).toContain("Gradly retries once by itself");
    cleanup();
    expect(at(200)).toContain("taking longer than usual");
    cleanup();
    expect(at(200)).not.toMatch(/%|remaining|left/);
  });

  it("explains stage error codes and keeps retry first", async () => {
    const failed = (code: "timeout" | "output_limit" | "not_applicable") =>
      job(1, {
        status: "failed",
        error: "Provider detail.",
        audits: job(1).audits.map((a, i) =>
          i === 1 ? { ...a, status: "Failed", errorCode: code } : a,
        ),
      });
    const onStep = vi.fn();
    const { rerender } = render(
      h(ProcessingPage, pageProps({ job: failed("timeout"), onStep })),
    );
    const recovery = screen.getByRole("region", { name: "Recovery options" });
    expect(
      within(recovery).getByText("The AI took too long on this step"),
    ).toBeTruthy();
    expect(within(recovery).getByRole("alert").textContent).toContain(
      "even after one automatic retry",
    );
    await userEvent.click(
      within(recovery).getByRole("button", { name: /Retry this stage/ }),
    );
    expect(onStep).toHaveBeenCalledWith(true);
    rerender(
      h(ProcessingPage, pageProps({ job: failed("output_limit"), onStep })),
    );
    expect(
      screen.getByText("This step needed a longer answer than the AI can give"),
    ).toBeTruthy();
    // Prepared studies stay a choice behind the retry, inside a closed disclosure.
    expect(
      screen
        .getByRole("link", { name: /View prepared studies/, hidden: true })
        .closest("details")?.open,
    ).toBe(false);
    // The warm-up is for waiting, not for a paused preparation.
    expect(
      screen.queryByRole("region", { name: "Warm-up while you wait" }),
    ).toBeNull();
    // An unsuitable paper offers the prepared studies openly and keeps retry.
    rerender(
      h(ProcessingPage, pageProps({ job: failed("not_applicable"), onStep })),
    );
    expect(
      screen.getByText("This paper needs more research detail"),
    ).toBeTruthy();
    expect(
      screen
        .getByRole("link", { name: /View prepared studies/ })
        .closest("details"),
    ).toBeNull();
    await userEvent.click(
      screen.getByRole("button", { name: /Retry this stage/ }),
    );
    expect(onStep).toHaveBeenCalledTimes(2);
  });

  it("offers an unscored warm-up and keeps the prediction in this browser", async () => {
    render(h(ProcessingPage, pageProps()));
    const warmup = screen.getByRole("region", {
      name: "Warm-up while you wait",
    });
    expect(within(warmup).getByText("Warm-up · not scored")).toBeTruthy();
    for (const card of warmupCards) {
      const option = card.options.find((o) => o.id === card.answer)!;
      await userEvent.click(
        within(warmup).getByRole("button", {
          name: new RegExp(option.text.slice(0, 20)),
        }),
      );
      await userEvent.click(
        within(warmup).getByRole("button", {
          name: /Next card|One last thing/,
        }),
      );
    }
    await userEvent.type(
      within(warmup).getByLabelText("Your prediction"),
      "Texting lowers scores.",
    );
    expect(readPrediction(JOB_ID)).toBe("Texting lowers scores.");
    expect(document.body.textContent).not.toMatch(/\bpoints?\b/i);
  });

  it("remembers an unfinished preparation for the home page until it is ready", () => {
    const { rerender } = render(h(ProcessingPage, pageProps()));
    expect(readActivePreparation()).toEqual({ id: JOB_ID, name: "paper.pdf" });
    rerender(
      h(ProcessingPage, pageProps({ job: job(5, { status: "ready" }) })),
    );
    expect(readActivePreparation()).toBeNull();
    clearActivePreparation(JOB_ID);
  });

  it("hands off with counts and starts the study", async () => {
    const onStart = vi.fn();
    render(
      h(
        ProcessingPage,
        pageProps({
          job: job(5, {
            status: "ready",
            outline: { challenges: 6, bonus: true, reasoning: 2 },
          }),
          onStart,
        }),
      ),
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Your study is ready" }),
    ).toBeTruthy();
    const ready = screen.getByRole("region", { name: "Your study is ready" });
    expect(ready.textContent).toContain("6challenges");
    expect(ready.textContent).toContain("+1bonus");
    await userEvent.click(
      screen.getByRole("button", { name: "Start your study" }),
    );
    expect(onStart).toHaveBeenCalledWith(JOB_ID);
  });

  it("settles under reduced motion without losing information", () => {
    const track = (j: ProcessingJob) =>
      h(SceneMotion, {
        reduced: true,
        children: h(PreparationTrack, { job: j }),
      });
    const { rerender, container } = render(track(job(1)));
    expect(
      container
        .querySelector("[data-scene-reduced]")
        ?.getAttribute("data-scene-reduced"),
    ).toBe("true");
    rerender(track(job(2)));
    // The text still arrives; only the movement is skipped.
    expect(screen.getByText(/Lesson Architect finished/)).toBeTruthy();
    act(() => {});
  });
});
