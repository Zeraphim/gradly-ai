import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { openAdventureBriefing } from "./journey-helpers.js";

const pdf = "docs/research/papers/bobek-tversky-2016-visual-explanations.pdf";

async function chromeLinks(page: Page) {
  return page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link")
    .allInnerTexts();
}

test("a PDF from home goes straight to preparation and the sample quest", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.locator('input[type="file"]').first().setInputFiles(pdf);
  // Sample mode calls no AI, so the home start skips the consent review.
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  const steps = page.getByRole("list", { name: "Paper to investigation" });
  await expect(steps.locator('[aria-current="step"]')).toContainText("Prepare");
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Saved preparation stages" }),
  ).toBeVisible();
  const start = page.getByRole("link", { name: "Start the quest" });
  await expect(start).toBeVisible({ timeout: 60000 });
  await page.reload();
  await expect(start).toBeVisible();
  await start.click();
  await page.waitForURL(/#\/research\/meet\//);
  await expect(steps.locator('[aria-current="step"]')).toContainText(
    "Investigate",
  );
  await expect(page.getByLabel("Sample preview mode")).toContainText(
    "no AI calls",
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Can students text and still keep up?",
    }),
  ).toBeVisible();
  // Results and the authors' conclusion stay locked at the start.
  await expect(page.locator("main")).not.toContainText(
    /73\.41|83\.00|9\.59|ANOVA|t-test/,
  );
});

test("any pasted link becomes a labelled sample journey without fetching it", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("textbox", { name: "Paper URL or DOI" });
  await expect(link).toHaveAttribute("placeholder", /not fetched/);
  await link.fill("https://example.org/papers/attention-study");
  await page.getByRole("button", { name: "Build my quest" }).click();
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  await expect(page.getByText("Link · example.org")).toBeVisible();
  await expect(page.getByText("link noted, not fetched")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start the quest" })).toBeVisible(
    { timeout: 60000 },
  );
});

test("a rejected file explains the limit and offers prepared studies or another paper", async ({
  page,
}) => {
  await page.route("**/api/research/documents", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 400,
          json: { error: "Use a research paper of 80 pages or fewer." },
        })
      : route.fallback(),
  );
  await page.goto("/");
  await page.locator('input[type="file"]').first().setInputFiles(pdf);
  await expect(
    page.getByRole("heading", { name: "This file can’t be used" }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Use a research paper of 80 pages or fewer.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Do you want to try one of our prepared studies?"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Check again" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: "Upload a different paper" }),
  ).toBeVisible();
  for (const width of [375, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    // Scan the settled state, not an entrance fade in progress.
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== "running"),
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.getByRole("link", { name: "View prepared studies" }).click();
  await expect(page).toHaveURL(/#\/research\/learn$/);
});

test("an interrupted check keeps the file and retries it", async ({ page }) => {
  let available = false;
  let retried = false;
  await page.route("**/api/research/documents", (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    if (available) {
      retried = true;
      return route.fallback();
    }
    return route.fulfill({
      status: 503,
      json: { error: "Service unavailable." },
    });
  });
  await page.goto("/");
  await page.locator('input[type="file"]').first().setInputFiles(pdf);
  await expect(
    page.getByRole("heading", { name: "We couldn’t finish checking" }),
  ).toBeVisible();
  // Retryable: no "can't be used" verdict, and the same file stays selected.
  await expect(
    page.getByText("Do you want to try one of our prepared studies?"),
  ).toBeHidden();
  await expect(
    page.getByText("bobek-tversky-2016-visual-explanations.pdf"),
  ).toBeVisible();
  available = true;
  await page.getByRole("button", { name: "Check again" }).click();
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  expect(retried).toBe(true);
});

test("home sample entry opens the prepared-study library", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Try a sample paper/ }).click();
  await expect(page).toHaveURL(/#\/research\/learn$/);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Prepared studies" }),
  ).toHaveAttribute("aria-current", "page");
});

test("play responds to letter keys, names linked study parts and colours the checked answer", async ({
  page,
}) => {
  await openAdventureBriefing(page);
  await page.getByRole("button", { name: "Start quest" }).click();
  const strip = page.locator(".scene-link-strip");
  await expect(strip).toContainText("Choose a response");
  await page.keyboard.press("B");
  const responses = page.locator(".scene-responses").getByRole("radio");
  await expect(responses.nth(1)).toBeChecked();
  await expect(strip).toHaveClass(/is-linked/);
  await page.keyboard.press("1");
  await expect(responses.nth(0)).toBeChecked();
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.locator(".scene-response.selected")).toHaveClass(
    /is-(correct|incorrect)/,
  );
  // Pages do not bounce past their top or bottom edge.
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).overscrollBehaviorY,
    ),
  ).toBe("none");
});

test("the texting quest plays by keyboard, retries once, resumes and completes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/research/learn");
  await page.getByRole("button", { name: "Start quest" }).click();
  await page.waitForURL(/#\/research\/meet\/featured$/);
  const steps = page.getByRole("list", { name: "Paper to investigation" });
  await expect(steps).toContainText("Choose a study");
  await expect(steps.locator('[aria-current="step"]')).toContainText(
    "Investigate",
  );
  const heading = page.locator("h1.quest-heading");
  await expect(heading).toHaveText("Can students text and still keep up?");
  // Enter moves through story screens.
  await page.keyboard.press("Enter");
  await expect(heading).toHaveText("Why investigate texting during lectures?");
  await page.keyboard.press("Enter");
  await expect(heading).toHaveText(
    "Which question best captures what we want to investigate?",
  );
  const options = page.locator(".quest-screen").getByRole("radio");
  const check = page.getByRole("button", { name: "Check" });
  await expect(check).toBeDisabled();
  // A wrong answer offers one retry with a hint, not the answer.
  await page.keyboard.press("A");
  await expect(options.nth(0)).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Take another look.")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(check).toBeDisabled();
  await page.keyboard.press("2");
  await expect(options.nth(1)).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Nicely reasoned!")).toBeVisible();
  // Progress survives a refresh within the session.
  await page.reload();
  await expect(heading).toHaveText(
    "Which question best captures what we want to investigate?",
  );
  await expect(page.locator(".quest-feedback")).toBeVisible();
  await expect(options.nth(1)).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(heading).not.toHaveText(
    "Which question best captures what we want to investigate?",
  );
  // Work through the remaining screens, opening the explanation after a miss.
  for (let guard = 0; guard < 40; guard++) {
    const finish = page.getByRole("button", { name: "Finish quest" });
    if (await finish.isVisible()) {
      await finish.click();
      break;
    }
    if (await check.isVisible()) {
      await page.keyboard.press("A");
      await page.keyboard.press("Enter");
      await expect(page.locator(".quest-feedback")).toBeVisible();
      const explain = page.getByRole("button", { name: "Show explanation" });
      if (await explain.isVisible()) await explain.click();
      await page.locator(".quest-bar .j-btn.is-go").click();
    } else {
      await page.locator(".quest-bar .j-btn:not(.is-quiet)").click();
    }
  }
  await expect(heading).toHaveText("You investigated the distracted student.");
  await expect(
    page.getByRole("list", { name: "Your decisions in order" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
  for (const width of [375, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== "running"),
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});
