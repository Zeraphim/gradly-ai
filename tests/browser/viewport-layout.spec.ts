import { expect, test, type Page } from "@playwright/test";

async function expectViewportShell(page: Page) {
  const shell = page.locator(".app-shell");
  await expect(shell).toBeVisible();
  const bounds = await shell.boundingBox();
  expect(bounds!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height);
  const footer = await shell.locator("footer").last().boundingBox();
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

test("prepared library keeps the footer at the viewport bottom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto("/#/research/learn");
  await expect(page.locator(".library-card").first()).toBeVisible();
  const studies = page.locator(".studies");
  const bounds = await studies.boundingBox();
  const footer = await studies.locator(":scope > footer").boundingBox();
  expect(footer!.y + footer!.height).toBeCloseTo(bounds!.y + bounds!.height, 0);
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
