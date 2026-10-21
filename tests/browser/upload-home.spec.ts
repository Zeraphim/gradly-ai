import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { pdfBytes } from "../research/pdf-fixture.js";
import { settleMotion } from "./motion-helpers.js";
import {
  continueSampleToPlayer,
  openAdventureBriefing,
} from "./journey-helpers.js";

test("upload home keeps PDF, DOI and points visible in clean desktop and mobile layouts", async ({
  page,
}, testInfo) => {
  for (const [width, height] of [
    [1440, 900],
    [1366, 768],
    [768, 1000],
    [390, 900],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto(width === 768 ? "/#/research/lab/texting-lecture" : "/");
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
    await expect(page.locator(".gr-points")).toContainText("points");
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
  await expect(page.locator(".upload-home-shell")).toHaveCount(0);
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
  await continueSampleToPlayer(page);
  await page
    .getByRole("radio", {
      name: /Does texting during a lecture affect the percentage of comprehension quiz questions answered correctly/,
    })
    .check();
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
  await expect(page.locator(".gr-points strong")).toHaveText("10");
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
  await expect(page.getByText(/links aren’t fetched yet/)).toBeVisible();
  await link.fill("https://doi.org/10.1177/0098628313514177");
  await page
    .getByRole("button", { name: "Build my quest", exact: true })
    .click();
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  await expect(page.getByText("Link · doi.org")).toBeVisible();
});

test("paper context supports keyboard, quick reversals and live reduced motion across both entry flows", async ({
  page,
}, testInfo) => {
  async function exploreContext(label: string) {
    const context = page.getByRole("region", {
      name: "Paper context",
      exact: true,
    });
    await expect(context).toBeVisible();
    const question = context.getByRole("button", {
      name: "Research question",
      exact: true,
    });
    const design = context.getByRole("button", {
      name: "Study design",
      exact: true,
    });
    const measurement = context.getByRole("button", {
      name: "Measurement",
      exact: true,
    });
    const boundaries = context.getByRole("button", {
      name: "Boundaries",
      exact: true,
    });
    await expect(question).toHaveAttribute("aria-pressed", "true");
    const panelId = await question.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toBeVisible();
    await expect(
      panel.getByRole("heading", {
        name: "What changes when students text?",
        exact: true,
      }),
    ).toBeVisible();
    const questionText = await panel.innerText();
    await design.focus();
    await page.keyboard.press("Space");
    await expect(design).toHaveAttribute("aria-pressed", "true");
    await expect(design).toBeFocused();
    await expect(
      panel.getByRole("heading", {
        name: "One student. One condition.",
        exact: true,
      }),
    ).toBeVisible();
    await expect(panel).not.toHaveText(questionText, { useInnerText: true });
    await measurement.click();
    await expect(measurement).toHaveAttribute("aria-pressed", "true");
    await expect(
      panel.getByRole("heading", {
        name: "Follow the session, then inspect the measure.",
        exact: true,
      }),
    ).toBeVisible();
    const measurementText = await panel.innerText();
    await boundaries.click();
    await expect(boundaries).toHaveAttribute("aria-pressed", "true");
    // Batch genuine native button activations into one browser task, exercising
    // reversals before any previous presence/layout transition can finish.
    await context.getByRole("button").evaluateAll((buttons) => {
      for (const index of [0, 1, 0, 3, 2])
        (buttons[index] as HTMLButtonElement).click();
    });
    await expect(measurement).toHaveAttribute("aria-pressed", "true");
    await expect(panel).toHaveText(measurementText, { useInnerText: true });
    await expect(context.locator('button[aria-pressed="true"]')).toHaveCount(1);
    // Preparation explains methods; numerical findings and paper identity stay
    // behind the investigation's existing evidence/reveal gates.
    await expect(context).not.toContainText(
      /73\.41|83\.00|9\.59|Gingerich|3514177/,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() =>
        context.evaluate((element) =>
          element
            .closest("[data-scene-reduced]")
            ?.getAttribute("data-scene-reduced"),
        ),
      )
      .toBe("true");
    await expect
      .poll(() =>
        context.evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length,
        ),
      )
      .toBe(0);
    await boundaries.focus();
    await page.keyboard.press("Enter");
    await expect(boundaries).toHaveAttribute("aria-pressed", "true");
    await expect(panel).not.toHaveText(measurementText, { useInnerText: true });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      audit.violations.map((violation) => ({
        id: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
    // Full-page capture from a keyboard-scrolled position can place fixed skip
    // links in the middle of a stitched image. Inspect the real viewport first.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    const skip = page.getByRole("link", {
      name: /^Skip to (adventure|content)$/,
    });
    await expect(skip).not.toBeFocused();
    const skipBounds = await skip.boundingBox();
    expect(skipBounds!.y + skipBounds!.height).toBeLessThanOrEqual(0);
    await page.screenshot({
      path: testInfo.outputPath(`paper-context-${label}.png`),
      fullPage: true,
      animations: "disabled",
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(() =>
        context.evaluate((element) =>
          element
            .closest("[data-scene-reduced]")
            ?.getAttribute("data-scene-reduced"),
        ),
      )
      .toBe("false");
    await question.click();
    await expect(question).toHaveAttribute("aria-pressed", "true");
    await expect(panel).toHaveText(questionText, { useInnerText: true });
    if (label === "home") {
      await measurement.focus();
      await page.evaluate(() => {
        localStorage.setItem("gradly-reduced-motion", "true");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "gradly-reduced-motion",
            newValue: "true",
            storageArea: localStorage,
          }),
        );
      });
      await expect
        .poll(() =>
          context.evaluate((element) =>
            element
              .closest("[data-scene-reduced]")
              ?.getAttribute("data-scene-reduced"),
          ),
        )
        .toBe("true");
      await expect(measurement).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(measurement).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          context.evaluate(
            (element) =>
              element
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running")
                .length,
          ),
        )
        .toBe(0);
      await page.evaluate(() => {
        localStorage.setItem("gradly-reduced-motion", "false");
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "gradly-reduced-motion",
            newValue: "false",
            storageArea: localStorage,
          }),
        );
      });
      await expect
        .poll(() =>
          context.evaluate((element) =>
            element
              .closest("[data-scene-reduced]")
              ?.getAttribute("data-scene-reduced"),
          ),
        )
        .toBe("false");
      await expect(measurement).toBeFocused();
    }
  }

  await page.emulateMedia({ reducedMotion: "no-preference" });
  // The four-chapter study map lives on the classic curated preparation; the
  // upload journey introduces the sample with "Meet the study" instead.
  await page.goto("/#/classic");
  await page
    .getByRole("button", { name: /Can you text and still learn/ })
    .click();
  await exploreContext("home");

  await page.setViewportSize({ width: 390, height: 900 });
  await openAdventureBriefing(page);
  // The investigation briefing stays short: the interactive study map belongs to
  // the paper-context step, so the briefing only recaps it.
  await expect(
    page.getByRole("heading", { name: "Before you decide", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Paper context" })).toHaveCount(
    0,
  );
  await expect(page.getByText("Gingerich", { exact: false })).toHaveCount(0);
  await page.getByRole("button", { name: "Start quest" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();

  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "context.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await page
    .getByRole("button", { name: "Start sample preview", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your investigation is ready" }),
  ).toBeVisible({ timeout: 20000 });
  await expect(page.getByLabel("Sample preview mode")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Saved preparation stages" }),
  ).toBeVisible();
  await continueSampleToPlayer(page);
  // The sample lesson opens on its first decision without repeating the study map.
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Paper context" })).toHaveCount(
    0,
  );
});
