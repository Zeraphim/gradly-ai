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

test("home controls stay usable on narrow screens and expanded content scrolls", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 740 });
    for (const name of ["How Gradly works", "Open paper adventure"]) {
      const control = page.getByRole("button", { name, exact: true });
      await expect(control).toBeVisible();
      const bounds = await control.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
    await expectViewportShell(page);
  }
  await page.getByText("Preview details", { exact: true }).click();
  const input = page.getByRole("textbox", {
    name: "Paper URL or DOI",
    exact: true,
  });
  await input.fill("https://example.com/" + "long-paper-title".repeat(30));
  await page
    .getByRole("button", { name: "Open paper adventure", exact: true })
    .click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expectViewportShell(page);
  await page
    .getByRole("button", { name: "How Gradly works", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("curated preparation and lessons keep the footer at the viewport bottom", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1600 });
  await page.goto("/");
  await page.getByRole("button", { name: /Try a sample paper/ }).click();
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
