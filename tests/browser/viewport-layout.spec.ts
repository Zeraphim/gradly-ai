import { expect, test, type Page } from "@playwright/test";

async function expectViewportShell(page: Page) {
  const shell = page.locator(".app-shell");
  await expect(shell).toBeVisible();
  const bounds = await shell.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height);
  const footer = await shell.locator(":scope > footer").last().boundingBox();
  expect(footer!.y + footer!.height).toBeCloseTo(bounds!.y + bounds!.height, 0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
}

test("home controls stay usable on narrow screens and a long link stays inside the shell", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    for (const control of [
      // Help is the shared header's link, the same on every screen.
      page.getByRole("link", { name: "How it works", exact: true }),
      page.getByRole("button", { name: "Build my quest", exact: true }),
    ]) {
      await expect(control).toBeVisible();
      const bounds = await control.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
    await expectViewportShell(page);
  }
  const input = page.getByRole("textbox", {
    name: "Paper URL or DOI",
    exact: true,
  });
  await input.fill("https://example.com/" + "long-paper-title".repeat(30));
  await page
    .getByRole("button", { name: "Build my quest", exact: true })
    .click();
  // Any link starts the labelled sample journey; a long one must still fit.
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  await expect(page.getByText(/^Link · /)).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("curated preparation and lessons keep the footer at the viewport bottom", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1600 });
  // The curated preparation lives on the classic route; the upload-first
  // home sends its sample entry to the prepared-study library instead.
  await page.goto("/#/classic");
  await page
    .getByRole("button", { name: /Can you text and still learn/ })
    .click();
  const start = page.getByRole("button", { name: /Let’s explore/ });
  await expect(start).toBeEnabled();
  await expectViewportShell(page);
  await start.click();
  await expect(
    page.getByRole("button", { name: /Check my reasoning/ }),
  ).toBeVisible();
  await expectViewportShell(page);
  await page.screenshot({
    path: testInfo.outputPath("lesson-tall-viewport.png"),
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 1366, height: 480 });
  await page.getByRole("textbox").scrollIntoViewIfNeeded();
  await expect(page.getByRole("textbox")).toBeInViewport();
  await expectViewportShell(page);
});

test("research and reasoning-preview screens share the viewport shell", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  for (const path of ["learn", "reasoning"]) {
    await page.goto(`/#/research/${path}`);
    await expect(page.locator(".research-lab main h1")).toBeVisible();
    await expectViewportShell(page);
  }
});
