import { mkdirSync } from "node:fs";
import { test, expect, type Page, type Route } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import type { ProcessingJob } from "../../apps/web/src/research/types.js";
import type {
  LearningSession,
  Lesson,
} from "../../apps/api/src/research/contracts.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
import { lessonTakeaway } from "../../apps/api/src/research/study-card.js";

// Live uploads are mocked: the job states are fixtures and the learning API is
// served by the real engine on a fixture lesson, so scoring, retries and the
// per-challenge gate behave exactly as on the server. No model is called.
const JOB_ID = "upload-fixture";
const roles = [
  "Research Evidence Analyst",
  "Lesson Architect",
  "Research Methods Reviewer",
  "Learning Coach",
  "Evidence Verification",
];
const shots =
  process.env.UPLOAD_JOURNEY_SHOTS ?? ".data/screenshots/upload-journey";

function job(
  stage: number,
  overrides: Partial<ProcessingJob> = {},
): ProcessingJob {
  const ready = overrides.status === "ready";
  return {
    id: JOB_ID,
    mode: "live",
    name: "Texting in class.pdf",
    consented: true,
    stage,
    status: "processing",
    audits: roles.map((role, i) => ({
      role,
      task: "Prepare source-supported learning material.",
      status:
        ready || i < stage
          ? "Completed"
          : i === stage
            ? "Processing"
            : "Pending",
      summary: "Saved stage summary.",
      refs: [],
      model: "browser fixture",
    })),
    version: stage + 1,
    leaseUntil: Date.now() + 200000,
    excerpt: "Extracted source text.",
    pageCount: 9,
    extraction: Array.from({ length: 9 }, (_, i) => ({
      page: i + 1,
      method: "text" as const,
      confidence: undefined,
    })),
    evidence:
      stage > 0 || ready
        ? Array.from({ length: 7 }, (_, i) => ({
            id: `source${i + 1}`,
            page: i + 1,
            excerpt: "A verified excerpt from the uploaded paper.",
          }))
        : [],
    outline:
      stage > 1 || ready ? { challenges: 8, bonus: true, reasoning: 3 } : null,
    ready,
    error: undefined,
    ...overrides,
  };
}

async function liveConfig(page: Page) {
  await page.route("**/api/research/config", (route) =>
    route.fulfill({
      json: {
        liveAI: true,
        demoAvailable: false,
        maxUploadBytes: 4000000,
        storage: true,
        model: "browser fixture",
      },
    }),
  );
}

/** Serves one job; POSTs (stage steps) are answered with the same saved state. */
async function serveJob(page: Page, current: () => ProcessingJob) {
  await page.route("**/api/research/jobs**", (route) =>
    route.fulfill({ json: current() }),
  );
}

function lessonFixture(): Lesson {
  const lesson = structuredClone(featured);
  lesson.id = JOB_ID;
  lesson.source = "generated";
  // A generated lesson often has no scene; the player must fall back to choices.
  lesson.challenges[0]!.scene = null;
  return lesson;
}

/** The learning and feedback routes, backed by the real engine. */
async function serveLearning(page: Page, lesson: Lesson) {
  const sessions = new Map<string, LearningSession>();
  const bodies: string[] = [];
  let count = 0;
  const reply = (route: Route, json: unknown, status = 200) => {
    bodies.push(JSON.stringify(json));
    return route.fulfill({ status, json });
  };
  await page.route("**/api/research/learning**", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      const id = new URL(request.url()).searchParams.get("id");
      const s = id ? sessions.get(id) : undefined;
      return s
        ? reply(route, publicSession(s, lesson))
        : reply(route, id ? { error: "Not found." } : [], id ? 404 : 200);
    }
    const body = request.postDataJSON();
    if (body.action === "start" || body.action === "restart") {
      const s = newSession(lesson, `session-${++count}`);
      sessions.set(s.id, s);
      return reply(route, publicSession(s, lesson));
    }
    const s = sessions.get(body.id)!;
    if (body.version !== s.version)
      return reply(route, { error: "Your saved progress changed." }, 409);
    try {
      const next =
        body.action === "submit"
          ? submit(s, lesson, body.selected ?? [], body.reasoning ?? "")
          : transition(s, lesson, body.action);
      const saved = { ...next, version: s.version + 1 };
      sessions.set(s.id, saved);
      return reply(route, publicSession(saved, lesson));
    } catch (error) {
      return reply(route, { error: (error as Error).message }, 400);
    }
  });
  await page.route("**/api/research/feedback", async (route) => {
    const body = route.request().postDataJSON();
    const s = sessions.get(body.id)!;
    const output = {
      category: "Partially Supported",
      guidance:
        "You named the comparison; connect it to how groups were formed.",
      followup: "What would change if students chose their own group?",
      refs: [],
    };
    const saved: LearningSession = {
      ...s,
      version: s.version + 1,
      aiFeedback: {
        ...s.aiFeedback,
        [body.challengeId]: { ...output, model: "browser fixture" },
      },
    };
    sessions.set(s.id, saved);
    return reply(route, {
      ...output,
      mode: "live",
      model: "browser fixture",
      session: publicSession(saved, lesson),
    });
  });
  return { sessions, bodies };
}

async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
}

test("every waiting state renders without overflow at phone and desktop widths", async ({
  page,
}) => {
  mkdirSync(shots, { recursive: true });
  await liveConfig(page);
  const states: [string, ProcessingJob, number?][] = [
    ["consent", job(0, { consented: false, status: "pending" })],
    ...roles.map(
      (_, stage) =>
        [`stage-${stage + 1}`, job(stage)] as [string, ProcessingJob],
    ),
    ["slow", job(1), 95],
    [
      "failed-timeout",
      job(1, {
        status: "failed",
        error: "Lesson Architect timed out after 110000ms.",
        audits: job(1).audits.map((a, i) =>
          i === 1 ? { ...a, status: "Failed", errorCode: "timeout" } : a,
        ),
      }),
    ],
    [
      "failed-output-limit",
      job(1, {
        status: "failed",
        error: "Lesson Architect reached the output limit.",
        audits: job(1).audits.map((a, i) =>
          i === 1 ? { ...a, status: "Failed", errorCode: "output_limit" } : a,
        ),
      }),
    ],
    ["ready", job(5, { status: "ready" })],
  ];
  let current = states[0]![1];
  await serveJob(page, () => current);
  for (const [name, state, elapsed] of states) {
    current = state;
    if (elapsed)
      await page.addInitScript(
        ([key, at]) => sessionStorage.setItem(key, String(at)),
        [
          `gradly-stage-start:${JOB_ID}:${state.stage}`,
          Date.now() - elapsed * 1000,
        ] as const,
      );
    for (const [label, size] of [
      ["phone", { width: 375, height: 812 }],
      ["desktop", { width: 1366, height: 900 }],
    ] as const) {
      await page.setViewportSize(size);
      await page.goto("about:blank");
      await page.goto(`/#/research/processing/${JOB_ID}`);
      await expect(page.locator("main h1").first()).toBeVisible();
      if (name.startsWith("stage") || name === "slow")
        await expect(
          page.getByRole("region", { name: "Saved preparation stages" }),
        ).toContainText(`${state.stage + 1}/5`);
      await page.waitForTimeout(450);
      await noOverflow(page);
      await page.screenshot({
        path: `${shots}/${name}-${label}.png`,
        fullPage: true,
      });
    }
  }
});

test("progress follows saved stages only and celebrates a live advance", async ({
  page,
}) => {
  await liveConfig(page);
  let current = job(1);
  await serveJob(page, () => current);
  await page.goto(`/#/research/processing/${JOB_ID}`);
  const track = page.getByRole("region", { name: "Saved preparation stages" });
  const outline = page.getByRole("region", { name: "Your study so far" });
  await expect(track).toContainText("2/5 · Lesson Architect");
  // Restored progress never celebrates, and nothing previews unseen content.
  await expect(track).not.toContainText("finished");
  await expect(outline).toContainText("7 evidence passages found");
  await expect(outline).toContainText("Drafting your challenges");
  await expect(outline).not.toContainText("challenges drafted");
  await expect(page.getByText(/\d+%/)).toHaveCount(0);
  current = job(2);
  await expect(track).toContainText("3/5 · Research Methods Reviewer", {
    timeout: 8000,
  });
  await expect(track).toContainText("Lesson Architect finished");
  await expect(outline).toContainText("8 challenges drafted + a bonus");
  await expect(outline).toContainText("3 ask you to explain your thinking");
  current = job(5, { status: "ready" });
  // Becoming ready on this page celebrates once.
  await expect(page.locator(".prep-ready .journey-burst")).toHaveCount(1, {
    timeout: 8000,
  });
  // Reopening the ready job shows it settled: no burst, no entrance.
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Your study is ready" }),
  ).toBeVisible();
  await expect(page.locator(".journey-burst")).toHaveCount(0);
});

test("preparation resumes after reload and from the home page", async ({
  page,
}) => {
  await liveConfig(page);
  await serveJob(page, () => job(2));
  await page.goto(`/#/research/processing/${JOB_ID}`);
  const warmup = page.getByRole("region", { name: "Warm-up while you wait" });
  await expect(warmup).toBeVisible();
  await warmup
    .getByRole("button", { name: /something else could explain/ })
    .click();
  await expect(warmup).toContainText("Nice thinking.");
  await warmup.getByRole("button", { name: "Next card" }).click();
  await expect(
    page.getByRole("heading", { name: /test a new study app/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Saved preparation stages" }),
  ).toContainText("3/5");
  // The warm-up resumes at the same card; it was never scored.
  await expect(
    page.getByRole("heading", { name: /test a new study app/ }),
  ).toBeVisible();
  await expect(page.getByText(/points?/i)).toHaveCount(0);
  await page.goto("/#/");
  const back = page.getByRole("link", { name: "Return to your paper" });
  await expect(back).toHaveAttribute("href", `#/research/processing/${JOB_ID}`);
  await back.click();
  await expect(
    page.getByRole("region", { name: "Saved preparation stages" }),
  ).toContainText("3/5");
});

test("stage error codes get their own recovery copy and keep retry first", async ({
  page,
}) => {
  await liveConfig(page);
  let code: "timeout" | "output_limit" = "timeout";
  await serveJob(page, () =>
    job(1, {
      status: "failed",
      error: "Provider detail.",
      audits: job(1).audits.map((a, i) =>
        i === 1 ? { ...a, status: "Failed", errorCode: code } : a,
      ),
    }),
  );
  await page.goto(`/#/research/processing/${JOB_ID}`);
  const recovery = page.getByRole("region", { name: "Recovery options" });
  await expect(
    recovery.getByRole("heading", {
      name: "The AI took too long on this step",
    }),
  ).toBeVisible();
  await expect(recovery).toContainText("even after one automatic retry");
  await expect(
    recovery.getByRole("button", { name: "Retry this stage" }),
  ).toBeVisible();
  await expect(recovery.getByText("Provider detail.")).toBeHidden();
  await recovery.getByText("Technical detail").click();
  await expect(recovery.getByText("Provider detail.")).toBeVisible();
  code = "output_limit";
  await page.reload();
  await expect(
    recovery.getByRole("heading", {
      name: "This step needed a longer answer than the AI can give",
    }),
  ).toBeVisible();
  await expect(
    recovery.getByRole("button", { name: "Retry this stage" }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("reduced motion settles the waiting screen and keeps it usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await liveConfig(page);
  let current = job(1);
  await serveJob(page, () => current);
  await page.goto(`/#/research/processing/${JOB_ID}`);
  const track = page.getByRole("region", { name: "Saved preparation stages" });
  await expect(
    page.locator(".scene-motion-scope").filter({ has: track }).first(),
  ).toHaveAttribute("data-scene-reduced", "true");
  const pending = page.locator(".prep-outline .is-pending .prep-outline-mark");
  await expect(pending).toHaveCSS("animation-name", "none");
  await expect(page.locator(".prep-scan")).toHaveCSS("animation-name", "none");
  current = job(2);
  // The information still arrives, without movement.
  await expect(track).toContainText("Lesson Architect finished", {
    timeout: 8000,
  });
  const warmup = page.getByRole("region", { name: "Warm-up while you wait" });
  await warmup.getByRole("button", { name: /Oat milk makes/ }).click();
  await expect(warmup).toContainText("Close.");
});

test("an uploaded lesson plays in the study player with server scoring and AI feedback", async ({
  page,
}) => {
  const lesson = lessonFixture();
  await liveConfig(page);
  await serveJob(page, () => job(5, { status: "ready" }));
  const { bodies } = await serveLearning(page, lesson);
  await page.goto(`/#/research/processing/${JOB_ID}`);
  await expect(
    page.getByRole("heading", { level: 1, name: "Your study is ready" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Your study is ready" }),
  ).toContainText("8");
  await page.getByRole("button", { name: "Start your study" }).click();
  await expect(page).toHaveURL(/#\/research\/play\/session-1$/);

  // Intro: Marc's study intro, labelled as generated, without the paper's identity.
  await expect(page.getByText("Your paper · AI-generated")).toBeVisible();
  await expect(page.getByText("8 challenges + optional bonus")).toBeVisible();
  await expect(page.getByText(lesson.paper.title)).toHaveCount(0);
  for (const width of [375, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    await page.screenshot({
      path: `${shots}/player-intro-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: /Begin study/ }).click();

  // Challenge 1 has no scene: plain choices, checked by the server.
  const first = lesson.challenges[0]!;
  await expect(
    page.getByRole("heading", { level: 1, name: first.prompt }),
  ).toBeVisible();
  const wrong = first.options.find((o) => !first.accepted.includes(o.id))!;
  const right = first.options.find((o) => first.accepted.includes(o.id))!;
  // Nothing sent so far reveals the keyed answer.
  expect(bodies.join("")).not.toContain('"accepted":["');
  await choose(page, wrong.text);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(
    page.getByRole("heading", { name: "Not quite yet" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await choose(page, right.text);
  await page.getByRole("button", { name: "Check" }).click();
  await expect(
    page.getByRole("heading", { name: "You got there" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("10 practice points in this study"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  // Advance to the first written-reasoning challenge through the server.
  for (const c of lesson.challenges.slice(1)) {
    await expect(
      page.getByRole("heading", { level: 1, name: c.prompt }),
    ).toBeVisible();
    for (const id of c.accepted) {
      const option = c.options.find((o) => o.id === id)!;
      await choose(page, option.text);
    }
    if (c.writtenReasoning) {
      await page
        .getByLabel(/Explain your thinking/)
        .fill("Random assignment makes the groups comparable.");
      await page.getByRole("button", { name: "Check" }).click();
      await expect(
        page.getByText("Random assignment makes the groups comparable."),
      ).toBeVisible();
      await page.getByRole("button", { name: "Ask the AI coach" }).click();
      await expect(page.getByText("Partially Supported")).toBeVisible();
      await expect(
        page.getByText("What would change if students chose their own group?"),
      ).toBeVisible();
      break;
    }
    await page.getByRole("button", { name: "Check" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }
  // Reload keeps the server-saved state, including the coach reply.
  await page.reload();
  await expect(page.getByText("Partially Supported")).toBeVisible();
  for (const width of [375, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    await page.screenshot({
      path: `${shots}/player-coach-${width}.png`,
      fullPage: true,
    });
  }
});

test("a long generated briefing keeps Begin study on screen and folds the rest", async ({
  page,
}) => {
  // Reported on 27 October 2026: a one-block generated briefing pushed the
  // Begin button below the screen. The intro now shows a short lead.
  const lesson = lessonFixture();
  lesson.briefing = Array.from(
    { length: 12 },
    (_, i) =>
      `Sentence ${i + 1} explains the setting, the people involved and the terms a learner needs before starting.`,
  ).join(" ");
  await liveConfig(page);
  await serveJob(page, () => job(5, { status: "ready" }));
  await serveLearning(page, lesson);
  await page.goto(`/#/research/processing/${JOB_ID}`);
  await page.getByRole("button", { name: "Start your study" }).click();
  await expect(page).toHaveURL(/#\/research\/play\/session-1$/);
  const more = page.locator(".journey-intro-more");
  const begin = page.getByRole("button", { name: /Begin study/ });
  for (const [width, height] of [
    [1366, 900],
    [1400, 1040],
    [375, 812],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await noOverflow(page);
    await expect(more).not.toHaveAttribute("open", "");
    await expect(page.getByText("Sentence 12 explains")).toBeHidden();
    await page.screenshot({ path: `${shots}/player-intro-long-${width}.png` });
    if (width > 400) {
      const box = (await begin.boundingBox())!;
      expect(
        box.y + box.height,
        `Begin study at ${width}px`,
      ).toBeLessThanOrEqual(height);
    }
  }
  // However long the briefing, the intro is no taller than a prepared study's.
  await page.setViewportSize({ width: 1366, height: 768 });
  const generated = (await page.locator(".journey-intro-card").boundingBox())!
    .height;
  const prepared = await page.context().newPage();
  await prepared.setViewportSize({ width: 1366, height: 768 });
  await prepared.goto("/#/research/studies/basketball-maths");
  const authored = (await prepared
    .locator(".journey-intro-card")
    .boundingBox())!.height;
  await prepared.close();
  expect(generated).toBeLessThanOrEqual(authored);
  // The rest is one keyboard press away, and nothing is lost.
  await page.getByText("Read more background").focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("open", "");
  await expect(page.getByText("Sentence 12 explains")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include(".studies").analyze()).violations,
  ).toEqual([]);
  await begin.click();
  await expect(
    page.getByRole("heading", { level: 1, name: lesson.challenges[0]!.prompt }),
  ).toBeVisible();
});

test("the reveal shows the paper, its takeaway and the learner's own prediction", async ({
  page,
}) => {
  const lesson = lessonFixture();
  await liveConfig(page);
  const { sessions } = await serveLearning(page, lesson);
  // A session answered through the real engine, saved at the reveal.
  let s = transition(newSession(lesson, "revealed"), lesson, "begin");
  for (const c of lesson.challenges) {
    s = submit(s, lesson, c.accepted, "");
    s = transition(s, lesson, "next");
  }
  s = transition(s, lesson, "skip");
  sessions.set(s.id, s);
  await page.addInitScript(([key, text]) => localStorage.setItem(key, text), [
    `gradly-prediction:${JOB_ID}`,
    "Texting will lower quiz scores a little.",
  ] as const);
  const finished = page.waitForRequest(
    (r) => r.method() === "POST" && r.postDataJSON()?.action === "finish",
  );
  await page.goto("/#/research/play/revealed");
  await expect(
    page.getByRole("heading", { name: "Study complete" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: lesson.paper.title }),
  ).toBeVisible();
  await expect(
    page.getByText("Texting will lower quiz scores a little."),
  ).toBeVisible();
  await expect(page.locator(".journey-takeaway")).toHaveText(
    lessonTakeaway(lesson),
  );
  await expect(
    page.getByText("Not content-reviewed yet.", { exact: false }),
  ).toBeVisible();
  // Reaching the reveal completes the run for history.
  await finished;
  await expect.poll(() => sessions.get("revealed")?.phase).toBe("complete");
  await expect(
    page.getByRole("link", { name: /Back to your quests/ }),
  ).toBeVisible();
  for (const width of [375, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
    await page.screenshot({
      path: `${shots}/player-reveal-${width}.png`,
      fullPage: true,
    });
  }
});

/** Answers are native inputs inside large labels; press the label like a learner. */
function choose(page: Page, text: string) {
  return page.locator(".study-choice").filter({ hasText: text }).click();
}
