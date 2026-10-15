import { test, expect } from "@playwright/test";
import { pdfBytes } from "../research/pdf-fixture.js";

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
      page.getByRole("heading", { name: "Think like a researcher." }),
    ).toBeVisible();
  }
  expect(savedStateRequests).toEqual([]);
});

test("unfinished choices and explanations survive help, refresh and exit", async ({
  page,
}) => {
  await page.goto("/#/research/learn");
  await page.getByRole("button", { name: "Start investigation" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  for (const answer of ["A", "B"]) {
    await page.locator(`.choices input[value="${answer}"]`).check();
    await page.getByRole("button", { name: "Check Answer" }).click();
    await expect(page.locator(".feedback")).toBeFocused();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Recommend Statistical Methods" }),
  ).toBeVisible();
  const draft =
    "Each participant contributes to only one condition; compare independent group means.";
  await page.locator('.choices input[value="A"]').check();
  await page.locator('.choices input[value="B"]').check();
  await page.getByLabel("Defend your decision").fill(draft);
  await page.getByRole("link", { name: "Glossary", exact: true }).click();
  await page.getByRole("link", { name: "Return to investigation" }).click();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.reload();
  await expect(page.locator('.choices input[value="A"]')).toBeChecked();
  await expect(page.locator('.choices input[value="B"]')).toBeChecked();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.getByRole("link", { name: "Save and exit investigation" }).click();
  await page.getByRole("link", { name: "Resume investigation" }).click();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(draft);
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.locator(".feedback")).toBeFocused();
  await page
    .getByRole("button", { name: "Revise explanation", exact: true })
    .click();
  const revision = `${draft} I would also inspect assumptions.`;
  await page.getByLabel("Defend your decision").fill(revision);
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await page.getByRole("link", { name: "Return to investigation" }).click();
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
  await page.getByRole("button", { name: "Check this document" }).click();
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
  await page.locator(".upload-privacy > summary").click();
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
      "Loading your adventures…",
    );
    await expect(
      page.getByText("Your next investigation starts here.", { exact: true }),
    ).toHaveCount(0);
    gate.resolve();
    await expect(
      page.getByText("Your adventures couldn’t be loaded.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("status").filter({ hasText: "Loading your adventures…" }),
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
      page.getByRole("link", { name: "Resume investigation" }),
    ).toHaveAttribute("href", "#/research/adventure/saved-investigation-retry");
    await expect(
      page.getByText("Your adventures couldn’t be loaded.", { exact: true }),
    ).toHaveCount(0);
  } finally {
    gate.resolve();
  }
});

test("a completed start request cannot pull a learner back from the glossary", async ({
  page,
}) => {
  const gate = deferred();
  const captured = deferred();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/research/learning", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    captured.resolve();
    await gate.promise;
    await route.fulfill({ response });
  });
  try {
    await page.goto("/#/research/learn");
    await page.getByRole("button", { name: "Start investigation" }).click();
    await captured.promise;
    await expect(page.getByRole("button", { name: "Opening…" })).toBeDisabled();
    await page.getByRole("link", { name: "Glossary", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Statistics Glossary" }),
    ).toBeVisible();
    const finished = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === "/api/research/learning" &&
        response.request().method() === "POST",
    );
    gate.resolve();
    await (await finished).finished();
    // Let the released fetch and React update settle without a timed sleep.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        }),
    );
    await expect(page).toHaveURL(/#\/research\/glossary$/);
    await expect(
      page.getByRole("heading", { name: "Statistics Glossary" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Your investigation briefing" }),
    ).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally {
    gate.resolve();
  }
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
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Adventures", exact: true }).click();
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
  await page
    .getByRole("link", { name: "Upload a research paper", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Upload your Research Paper" }),
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
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:5173/#/research/learn");
    const start = page.getByRole("button", { name: "Start investigation" });
    await expect(start).toBeVisible();
    expect(
      await page.evaluate(() => matchMedia("(hover: hover)").matches),
    ).toBe(false);
    await start.hover();
    expect(await start.evaluate((el) => getComputedStyle(el).transform)).toBe(
      "none",
    );
    await start.tap();
    await page.getByRole("button", { name: "Begin investigation" }).tap();
    const choices = page.locator(".choices .choice");
    await choices.nth(0).tap();
    await expect(choices.nth(0).locator("input")).toBeChecked();
    await choices.nth(1).tap();
    await expect(choices.nth(1).locator("input")).toBeChecked();
    await expect(choices.nth(0).locator("input")).not.toBeChecked();
    await expect
      .poll(() =>
        choices.nth(0).evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe("rgb(255, 255, 255)");
    expect(
      await choices.nth(1).evaluate((el) => getComputedStyle(el).animationName),
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
    await page.getByRole("link", { name: "Glossary", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Statistics Glossary" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Guest settings" }).click();
    await expect(page.getByText("sample-test", { exact: true })).toBeVisible();
    expect(successfulReads).toBe(reads);
  } finally {
    gate.resolve();
  }
});
