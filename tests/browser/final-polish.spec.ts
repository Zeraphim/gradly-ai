import { test, expect, type Page } from "@playwright/test";
import { pdfBytes } from "../research/pdf-fixture.js";
import { openAdventureBriefing } from "./journey-helpers.js";

function response(page: Page, id: string) {
  const responses = page.locator(".scene-responses");
  return responses
    .getByRole("radio")
    .or(responses.getByRole("checkbox"))
    .and(page.locator(`input[value="${id}"]`));
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((finish) => {
    resolve = finish;
  });
  return { promise, resolve };
}

test("incomplete saved-investigation links offer a recovery path", async ({
  page,
}) => {
  const savedStateRequests: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (["/api/research/learning", "/api/research/jobs"].includes(path))
      savedStateRequests.push(path);
  });
  for (const route of ["adventure", "processing"]) {
    await page.goto(`/#/research/${route}`);
    await expect(
      page.getByRole("heading", { name: "Find your investigation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("status").filter({ hasText: /Loading/ }),
    ).toHaveCount(0);
    const learn = page.getByRole("main").locator('a[href="#/research/learn"]');
    await expect(learn).toBeVisible();
    await learn.click();
    await expect(
      page.getByRole("heading", { name: "Pick a study. Make the calls." }),
    ).toBeVisible();
  }
  expect(savedStateRequests).toEqual([]);
});

test("unfinished choices and explanations survive help, refresh and exit", async ({
  page,
}) => {
  await openAdventureBriefing(page);
  await page.getByRole("button", { name: "Start quest" }).click();
  for (const answer of ["A", "B"]) {
    await response(page, answer).check();
    await page.getByRole("button", { name: "Check Answer" }).click();
    await expect(page.locator(".feedback")).toBeFocused();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Recommend Statistical Methods" }),
  ).toBeVisible();
  const draft =
    "Each participant contributes to only one condition; compare independent group means.";
  await response(page, "A").check();
  await response(page, "B").check();
  await page.getByLabel("Defend your decision").fill(draft);
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await page.getByRole("link", { name: "Research terms", exact: true }).click();
  await page.getByRole("link", { name: "Return to quest" }).click();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.reload();
  await expect(response(page, "A")).toBeChecked();
  await expect(response(page, "B")).toBeChecked();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.getByRole("link", { name: "Save and exit quest" }).click();
  await page.getByRole("link", { name: "Resume quest" }).click();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.locator(".feedback")).toBeFocused();
  await page
    .getByRole("button", { name: "Revise explanation", exact: true })
    .click();
  const revision = `${draft} I would also inspect assumptions.`;
  await page.getByLabel("Defend your decision").fill(revision);
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await page.getByRole("link", { name: "Return to quest" }).click();
  await expect(page.getByLabel("Defend your decision")).toBeEditable();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(revision);
  await page.getByRole("button", { name: "Cancel revision" }).click();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
});

test("checked PDF and its usable original link survive a support detour", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "draft-paper.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  const original = page.getByRole("link", { name: "Open original PDF" });
  await expect(original).toHaveAttribute("target", "_blank");
  expect(
    await original.evaluate(async (link: HTMLAnchorElement) =>
      new TextDecoder().decode(
        (await (await fetch(link.href)).arrayBuffer()).slice(0, 5),
      ),
    ),
  ).toBe("%PDF-");
  await page
    .getByRole("link", { name: "Privacy & AI processing", exact: true })
    .click();
  await page.getByRole("link", { name: "Return to your paper" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(
    page.getByText("draft-paper.pdf", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start sample preview" }),
  ).toBeEnabled();
});

test("motion preferences remain usable when browser storage is denied", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage denied", "SecurityError");
    };
    Storage.prototype.getItem = () => {
      throw new DOMException("Storage denied", "SecurityError");
    };
  });
  await page.goto("/#/research/settings");
  await page.getByLabel("Reduce interface motion").check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.getByRole("link", { name: "Guest settings" }).click();
  await page.getByLabel("Reduce interface motion").uncheck();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "false",
  );
  expect(errors).toEqual([]);
});

test("adventure history distinguishes loading, errors, and successful retry", async ({
  page,
}) => {
  const gate = deferred();
  let fail = true;
  await page.route("**/api/research/learning", async (route) => {
    if (route.request().method() !== "GET") {
      await route.continue();
      return;
    }
    if (fail) {
      await gate.promise;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "History is temporarily unavailable." }),
      });
      return;
    }
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "saved-investigation-retry",
          title: "Saved investigation after retry",
          phase: "briefing",
          index: 0,
          created: "2026-10-15T00:00:00.000Z",
          source: "featured",
        },
      ]),
    });
  });
  await page.route("**/api/research/documents", async (route) => {
    await route.fulfill({ contentType: "application/json", body: "[]" });
  });
  try {
    await page.goto("/#/research/history");
    await expect(page.getByRole("status")).toContainText(
      "Loading your quests…",
    );
    await expect(
      page.getByText("Your next investigation starts here.", { exact: true }),
    ).toHaveCount(0);
    gate.resolve();
    await expect(
      page.getByText("Your quests couldn’t be loaded.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("status").filter({ hasText: "Loading your quests…" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("Your next investigation starts here.", { exact: true }),
    ).toHaveCount(0);
    fail = false;
    await page.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Saved investigation after retry" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Resume quest" }),
    ).toHaveAttribute("href", "#/research/adventure/saved-investigation-retry");
    await expect(
      page.getByText("Your quests couldn’t be loaded.", { exact: true }),
    ).toHaveCount(0);
  } finally {
    gate.resolve();
  }
});

test("the library opens a prepared study without a saved-session request", async ({
  page,
}) => {
  const errors: string[] = [];
  const learningPosts: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      request.method() === "POST" &&
      new URL(request.url()).pathname === "/api/research/learning"
    )
      learningPosts.push(request.url());
  });
  await page.goto("/#/research/learn");
  await page
    .getByRole("link", { name: "Restless nights and grades", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/research\/studies\/sleep-school$/);
  await expect(
    page.getByRole("button", { name: "Begin study", exact: true }),
  ).toBeVisible();
  await page.goto("/#/research/glossary");
  await expect(
    page.getByRole("heading", { name: "Research terms" }),
  ).toBeVisible();
  expect(learningPosts).toEqual([]);
  expect(errors).toEqual([]);
});

test("successful deletion clears document review even when history refresh fails", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "delete-recovery.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  // Review is a focus screen without the site menu; open history directly.
  await page.evaluate(() => {
    location.hash = "#/research/history";
  });
  await page
    .getByRole("button", { name: "Delete document", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(
    dialog.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  expect(
    await page.locator("body").evaluate((el) => getComputedStyle(el).overflow),
  ).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page
    .getByRole("button", { name: "Delete document", exact: true })
    .click();
  let failDelete = true;
  await page.route("**/api/research/documents", async (route) => {
    if (failDelete && route.request().method() === "DELETE") {
      failDelete = false;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Deletion is temporarily unavailable. Try again.",
        }),
      });
    } else await route.continue();
  });
  await dialog
    .getByRole("button", { name: "Delete document", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Deletion is temporarily unavailable",
  );
  await page.route("**/api/research/learning", async (route) => {
    if (route.request().method() === "GET")
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "History refresh interrupted after deletion.",
        }),
      });
    else await route.continue();
  });
  await dialog
    .getByRole("button", { name: "Delete document", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "History refresh interrupted",
  );
  await page.getByRole("link", { name: "Learn", exact: true }).click();
  await page.getByRole("link", { name: "Upload a paper", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Upload your research paper" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Start sample preview" }),
  ).toHaveCount(0);
});

test("touch layouts avoid stuck hover motion and answer selections stay immediate", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("/#/research/learn");
    const start = page.getByRole("link", {
      name: "Restless nights and grades",
      exact: true,
    });
    await expect(start).toBeVisible();
    expect(
      await page.evaluate(() => matchMedia("(hover: hover)").matches),
    ).toBe(false);
    await start.hover();
    expect(await start.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
    await openAdventureBriefing(page);
    await page.getByRole("button", { name: "Start quest" }).tap();
    const choices = page.locator(".scene-responses").getByRole("radio");
    await choices.nth(0).locator("..").tap();
    await expect(choices.nth(0)).toBeChecked();
    await choices.nth(1).locator("..").tap();
    await expect(choices.nth(1)).toBeChecked();
    await expect(choices.nth(0)).not.toBeChecked();
    await expect
      .poll(() =>
        choices
          .nth(0)
          .locator("..")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe("rgb(255, 255, 255)");
    expect(
      await choices
        .nth(1)
        .locator("..")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("AI availability stays honest during recovery and settings are reused across navigation", async ({
  page,
}) => {
  const gate = deferred();
  let available = false;
  let successfulReads = 0;
  await page.route("**/api/research/config", async (route) => {
    if (!available) {
      await gate.promise;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "Settings temporarily unavailable" }),
      });
    } else {
      successfulReads++;
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          liveAI: false,
          demoAvailable: true,
          storage: true,
          maxUploadBytes: 4000000,
          model: "sample-test",
        }),
      });
    }
  });
  try {
    await page.goto("/#/research/settings");
    await expect(
      page.getByText("Checking AI availability…", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Live Nebius AI processing is not configured.", {
        exact: false,
      }),
    ).toHaveCount(0);
    gate.resolve();
    await expect(
      page.getByText(
        "AI availability couldn’t be confirmed. Reload saved state to check again.",
        { exact: true },
      ),
    ).toBeVisible();
    available = true;
    await page.getByRole("button", { name: "Reload saved state" }).click();
    await expect(page.getByText("sample-test", { exact: true })).toBeVisible();
    const reads = successfulReads;
    await page.getByRole("link", { name: "How it works", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "How Gradly works" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "How it works", exact: true }).click();
    await page
      .getByRole("link", { name: "Research terms", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Research terms" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Guest settings" }).click();
    await expect(page.getByText("sample-test", { exact: true })).toBeVisible();
    expect(successfulReads).toBe(reads);
  } finally {
    gate.resolve();
  }
});

test("research support explains qualitative and causal limits without backend access", async ({
  page,
}) => {
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/#/research/glossary");
  await expect(
    page.getByRole("heading", { name: "Research terms" }),
  ).toBeVisible();
  await page.getByText("Qualitative theme", { exact: true }).click();
  await expect(
    page.getByText(/A theme does not by itself estimate how common/),
  ).toBeVisible();
  await page.getByText("Causal claim", { exact: true }).click();
  await expect(
    page.getByText(/an association alone does not establish it/),
  ).toBeVisible();
  await page.getByText("Transfer", { exact: true }).click();
  await expect(
    page.getByText(/Completing one example does not establish mastery/),
  ).toBeVisible();

  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Decide, explain, then reconsider" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByRole("link", { name: "Try the reasoning preview" }),
  ).toHaveAttribute("href", "#/research/reasoning");
  await expect(
    page.getByText(/Your written explanation is not assessed/),
  ).toBeVisible();

  await page.goto("/#/research/privacy");
  await expect(
    page.getByRole("heading", { name: "Reasoning preview" }),
  ).toBeVisible();
  await expect(
    page.getByText(/not sent to the server or an AI service/),
  ).toBeVisible();
});
