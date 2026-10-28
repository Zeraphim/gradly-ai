import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { pdfBytes } from "../research/pdf-fixture.js";
import { settleMotion } from "./motion-helpers.js";
import { featured } from "../../apps/api/src/research/featured.js";

test("upload home keeps PDF and DOI visible in clean desktop and mobile layouts", async ({
  page,
}, testInfo) => {
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [768, 1000],
    [390, 900],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Upload your research paper",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toHaveCSS("opacity", "1");
    const upload = page.getByRole("button", {
      name: "Upload PDF",
      exact: true,
    });
    const link = page.getByRole("textbox", {
      name: "Paper URL or DOI",
      exact: true,
    });
    await expect(upload).toBeVisible();
    await expect(link).toBeVisible();
    await expect(page.locator(".gr-header")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (await page.getByRole("main").innerText()).split(/\s+/).length,
    ).toBeLessThan(140);
    if (width! > 900) {
      for (const locator of [upload, link]) {
        const box = await locator.boundingBox();
        expect(box!.y + box!.height).toBeLessThan(height!);
      }
    }
    // Audit the settled page rather than a partially transparent entrance frame.
    await settleMotion(page);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`upload-home-${width}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
});

test("upload home fills the viewport and lets short screens scroll", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const [width, height] of [
    [1440, 1200],
    [1366, 768],
    [390, 900],
    [1366, 480],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    const shell = await page.locator(".upload-home-shell").boundingBox();
    const footer = await page.locator(".gr-footer").boundingBox();
    expect(shell!.height).toBeGreaterThanOrEqual(height!);
    expect(footer!.y + footer!.height).toBeCloseTo(shell!.y + shell!.height, 0);
    if (height === 1200)
      expect(footer!.y + footer!.height).toBeCloseTo(height, 0);
    if (height === 480) expect(shell!.height).toBeGreaterThan(height);
    await page
      .getByRole("textbox", { name: "Paper URL or DOI", exact: true })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("textbox", { name: "Paper URL or DOI", exact: true }),
    ).toBeInViewport();
  }
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.screenshot({
    path: testInfo.outputPath("home-tall-viewport.png"),
    fullPage: true,
  });
  await page.goto("/#/classic");
  await expect(page).toHaveURL(/#\/research\/learn$/);
});

test("the home upload reaches the prepared sample with browser-saved progress", async ({
  page,
}) => {
  const externalAI: string[] = [];
  page.on("request", (request) => {
    if (/(^|\.)nebius\.(com|ai)$/.test(new URL(request.url()).hostname))
      externalAI.push(request.url());
  });
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "my-research.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  // In sample mode the home choice goes straight to preparation.
  await expect(
    page.getByRole("heading", {
      name: "Your investigation is ready",
      exact: true,
    }),
  ).toBeVisible({ timeout: 60000 });
  await expect(
    page.getByText(/we prepare the texting study, not your file/),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Start the quest", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/research\/studies\/texting-lecture$/);
  await page.getByRole("button", { name: "Begin study", exact: true }).click();
  const first = featured.challenges[0]!;
  const right = first.options.find((option) =>
    first.accepted.includes(option.id),
  )!;
  await page
    .locator(".study-choice, .study-tap")
    .filter({ hasText: right.text })
    .click();
  await page.getByRole("button", { name: /^Check/ }).click();
  await expect(
    page.getByLabel("10 practice points in this study", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByLabel("10 practice points in this study", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", {
      name: "Close study and return to the library",
      exact: true,
    })
    .click();
  await page.getByRole("link", { name: "Gradly home", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Upload PDF", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Resume quest/ })).toHaveCount(
    0,
  );
  expect(externalAI).toEqual([]);
});

test("any link opens the labelled sample journey and says it was not fetched", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("textbox", {
    name: "Paper URL or DOI",
    exact: true,
  });
  await expect(page.getByText(/links aren’t fetched yet/i)).toBeVisible();
  await link.fill("https://doi.org/10.1177/0098628313514177");
  await page
    .getByRole("button", { name: "Build my quest", exact: true })
    .click();
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  await expect(page.getByText("Link · doi.org")).toBeVisible();
});
