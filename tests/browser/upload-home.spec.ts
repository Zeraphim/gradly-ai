import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { pdfBytes } from "../research/pdf-fixture.js";

test("upload home keeps PDF, DOI and points visible in clean desktop and mobile layouts", async ({
  page,
}) => {
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [768, 1000],
    [390, 900],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto(width === 768 ? "/#/research/lab" : "/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Upload your research paper",
        exact: true,
      }),
    ).toBeVisible();
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
    await expect(page.locator(".points-pill")).toContainText("points");
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
      path: resolve("..", "gradly-repo-preview", `upload-home-${width}.png`),
      fullPage: true,
      animations: "disabled",
    });
  }
});

test("the home upload reaches real PDF review, a labeled sample lesson and durable practice points", async ({
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
  await expect(
    page.getByRole("heading", {
      name: "Upload your Research Paper",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("my-research.pdf", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Check this document", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Document checked", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start sample preview", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Your adventure is ready!",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Begin investigation", exact: true })
    .click();
  await expect(page.getByLabel("Sample preview mode")).toContainText(
    "not an analysis of your upload",
  );
  await page
    .getByRole("button", { name: "Begin investigation", exact: true })
    .click();
  await page
    .locator(".choice")
    .filter({ has: page.locator(".keycap", { hasText: /^A$/ }) })
    .click();
  await page.getByRole("button", { name: "Check Answer", exact: true }).click();
  await expect(
    page.getByLabel("10 practice points", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByLabel("10 practice points", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Gradly home", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Upload PDF", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".points-pill strong")).toHaveText("10");
  expect(externalAI).toEqual([]);
});

test("the visible DOI input opens the supported study and rejects unsupported links honestly", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("textbox", {
    name: "Paper URL or DOI",
    exact: true,
  });
  await link.fill("https://example.com/another-paper");
  await page
    .getByRole("button", { name: "Open paper adventure", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "10.1177/0098628313514177",
  );
  await link.fill("https://doi.org/10.1177/0098628313514177");
  await page
    .getByRole("button", { name: "Open paper adventure", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Can you text and still learn?",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Let’s explore/ }),
  ).toBeEnabled();
});
