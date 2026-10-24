import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { studyCards } from "../../apps/web/src/research/studies/cards.js";

const library = "/#/research/studies";

async function openLibrary(page: Page) {
  await page.goto(library);
  await expect(
    page.getByRole("heading", { name: "Studies are being checked" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Preview unreviewed studies/ })
    .click();
  await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
}

async function noViolations(page: Page) {
  // Contrast is measured on settled content, not mid-entrance opacity.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
  const result = await new AxeBuilder({ page }).include(".studies").analyze();
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual(
    [],
  );
}

async function noOverflow(page: Page) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const width of [375, 768, 1366]) {
  test(`the learn page links to the library by keyboard at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/research/learn");
    const practice = page.getByRole("navigation", { name: "More practice" });
    const link = practice.getByRole("link", {
      name: "Browse prepared studies",
    });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "#/research/studies");
    await noOverflow(page);
    await page.waitForFunction(() =>
      document.getAnimations().every((a) => a.playState !== "running"),
    );
    const axe = await new AxeBuilder({ page })
      .include('[aria-label="More practice"]')
      .analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Studies are being checked" }),
    ).toBeVisible();
    await noViolations(page);
  });

  test(`library and player are accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openLibrary(page);
    await noOverflow(page);
    await noViolations(page);
    await page
      .getByRole("link", { name: "Restless nights and grades" })
      .click();
    await page.getByRole("button", { name: /Begin study/ }).click();
    await expect(page.getByRole("progressbar")).toBeVisible();
    await noOverflow(page);
    await noViolations(page);
    await page.locator(".study-choice, .study-tap").first().click();
    await page.getByRole("button", { name: /^Check/ }).click();
    await expect(page.locator(".journey-feedback h2")).toBeVisible();
    await noOverflow(page);
    await noViolations(page);
  });
}

test("refresh and back navigation keep answers without replaying entrances", async ({
  page,
}) => {
  await openLibrary(page);
  await page.getByRole("link", { name: "Breakfast and grades" }).click();
  await page.getByRole("button", { name: /Begin study/ }).click();
  await page.locator(".study-choice").first().click();
  await page.reload();
  await expect(page.locator(".study-choice.selected")).toHaveCount(1);
  // Restored content is already at rest: no element is mid-entrance.
  const moving = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".journey-challenge *")].some(
      (el) =>
        el.tagName !== "INPUT" &&
        Number(getComputedStyle(el).opacity) < 1 &&
        el.closest("[aria-hidden]") === null,
    ),
  );
  expect(moving).toBe(false);
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: /Pick a study/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Continue where you left off" }),
  ).toBeVisible();
  await page.goForward();
  await expect(page.locator(".study-choice.selected")).toHaveCount(1);
});

test("rapid double activation cannot skip feedback", async ({ page }) => {
  await openLibrary(page);
  await page
    .getByRole("link", { name: "Visual and auditory learners" })
    .click();
  await page.getByRole("button", { name: /Begin study/ }).click();
  await page.locator(".study-choice").first().click();
  await page.getByRole("button", { name: /^Check/ }).dblclick();
  await expect(page.locator(".journey-feedback h2")).toBeVisible();
  await expect(page.locator(".journey-stage")).toContainText("1 of");
});

test("reduced motion settles the player with every state still available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openLibrary(page);
  await page.getByRole("link", { name: "Restless nights and grades" }).click();
  await page.getByRole("button", { name: /Begin study/ }).click();
  await page.locator(".study-choice, .study-tap").first().click();
  await page.getByRole("button", { name: /^Check/ }).click();
  await expect(page.locator(".journey-feedback h2")).toBeVisible();
  const opacity = await page
    .locator(".journey-feedback")
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});

// Every card, authored or generated, opens and checks its first challenge accessibly.
test("every study opens and checks its first challenge at 375px", async ({
  page,
}) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(library);
  await page.evaluate(() =>
    localStorage.setItem("gradly-show-unreviewed", "true"),
  );
  for (const card of studyCards) {
    await page.goto(`/#/research/studies/${card.slug}`);
    await page.reload();
    await page.getByRole("button", { name: /Begin study/ }).click();
    await expect(page.getByRole("progressbar"), card.slug).toBeVisible();
    await page.locator(".study-choice, .study-tap").first().click();
    await page.getByRole("button", { name: /^Check/ }).click();
    await expect(page.locator(".journey-feedback h2"), card.slug).toBeVisible();
    await noOverflow(page);
    await noViolations(page);
  }
});
