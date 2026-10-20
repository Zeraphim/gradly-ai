import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { settleMotion } from "./motion-helpers.js";

async function open(page: Page) {
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/#/research/activities");
  await expect(page.locator(".paper-pilot h1")).toBeFocused();
}
async function reveal(page: Page) {
  await page
    .getByRole("radio", { name: "Visual explanation", exact: true })
    .check();
  await page.getByRole("button", { name: "Reveal reported results" }).click();
  await expect(page.locator(".scene-responses")).toBeVisible();
}

test("three real-paper activities reuse scenes, retain separate drafts and never call assessment", async ({
  page,
}, testInfo) => {
  const posts: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await open(page);
  await expect(page.locator(".scene-response")).toHaveCount(0);
  await reveal(page);
  await expect(page.getByRole("figure")).toContainText("0.822");
  await expect(page.getByRole("figure")).toContainText("0.631");
  await expect(page.locator(".scene-difference")).toHaveCount(0);
  await page
    .locator(".scene-response")
    .filter({ has: page.locator("input[value=bounded]") })
    .click();
  await page.getByRole("button", { name: "Check interpretation" }).click();
  await expect(page.locator(".pilot-feedback")).toBeFocused();
  await expect(page.locator(".scene-difference")).toContainText("0.191");
  await page
    .getByRole("textbox")
    .fill("The average does not describe every learner.");
  await settleMotion(page);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: testInfo.outputPath("experiment.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Observational study", exact: true })
    .click();
  await expect(page.locator(".paper-pilot h1")).toBeFocused();
  await expect(page.getByRole("textbox")).toHaveValue("");
  await expect(page.locator(".scene-flow")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Inspect Background and cognition" })
    .click();
  await page
    .locator(".scene-response")
    .filter({ has: page.locator("input[value=overreach]") })
    .click();
  await page.getByRole("button", { name: "Check interpretation" }).click();
  await expect(page.locator(".pilot-feedback")).toContainText("narrower scope");
  await page
    .locator(".scene-response")
    .filter({ has: page.locator("input[value=bounded]") })
    .click();
  await expect(page.locator(".pilot-feedback")).toHaveCount(0);
  await page.getByRole("button", { name: "Interviews", exact: true }).click();
  await expect(page.locator(".scene-anchors")).toHaveCount(1);
  await page
    .getByRole("checkbox", { name: "Use in my reasoning" })
    .nth(1)
    .check();
  await page
    .getByRole("button", { name: "Inspect Networking concerns" })
    .click();
  await page.getByRole("textbox").fill("Accounts need context.");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Interviews", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("checkbox", { name: "Use in my reasoning" }).nth(1),
  ).toBeChecked();
  await expect(page.getByRole("textbox")).toHaveValue("Accounts need context.");
  await page.getByRole("button", { name: "Experiment", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue(
    "The average does not describe every learner.",
  );
  await expect(page.locator(".scene-difference")).toContainText("0.191");
  await page.getByRole("button", { name: "Reset this activity" }).click();
  await expect(page.getByRole("figure")).toHaveCount(0);
  await expect(page.getByRole("textbox")).toHaveValue("");
  await page.getByRole("button", { name: "Interviews", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Accounts need context.");
  expect(posts).toEqual([]);
});

test("all pilot choices and check controls fit desktop windows", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  for (const [width, height] of [
    [1366, 768],
    [1000, 640],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    for (const label of ["Experiment", "Observational study", "Interviews"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      if (
        label === "Experiment" &&
        (await page
          .getByRole("button", { name: "Reveal reported results" })
          .isVisible())
      )
        await reveal(page);
      await expect(page.locator(".scene-response")).toHaveCount(3);
      const boxes = await page
        .locator(".scene-response, .pilot-check > button")
        .evaluateAll((elements) =>
          elements.map((el) => {
            const b = el.getBoundingClientRect();
            return { top: b.top, bottom: b.bottom, height: b.height };
          }),
        );
      for (const box of boxes) {
        expect(
          box.top,
          `${label} at ${width}x${height}`,
        ).toBeGreaterThanOrEqual(64);
        expect(
          box.bottom,
          `${label} at ${width}x${height}`,
        ).toBeLessThanOrEqual(height! - 8);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("pilot supports narrow screens, source reading and live reduced motion", async ({
  page,
}, testInfo) => {
  await open(page);
  await reveal(page);
  for (const width of [320, 390, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    for (const label of ["Experiment", "Observational study", "Interviews"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await settleMotion(page);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  }
  await page
    .getByText("Read the source and activity notes", { exact: true })
    .click();
  await expect(
    page.getByRole("link", {
      name: /Synchronous online learning and career readiness/,
    }),
  ).toHaveAttribute("href", "https://doi.org/10.3389/feduc.2024.1449363");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: testInfo.outputPath("interview-activity.png"),
    fullPage: true,
  });
});
