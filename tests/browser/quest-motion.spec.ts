import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { textingQuest } from "../../apps/web/src/research/texting-quest.js";
import { settleMotion } from "./motion-helpers.js";

async function openStep(page: Page, id: string) {
  const index = textingQuest.findIndex((step) => step.id === id);
  expect(index).toBeGreaterThanOrEqual(0);
  await page.addInitScript((index) => {
    if (sessionStorage.getItem("gradly-texting-quest:featured")) return;
    sessionStorage.setItem(
      "gradly-texting-quest:featured",
      JSON.stringify({ index, records: {} }),
    );
  }, index);
  await page.goto("/#/research/meet/featured");
  await expect(page.locator("h1.quest-heading")).toBeVisible();
}

test("direct research entry shares settings and defers the classic lesson", async ({
  page,
}) => {
  const completed: string[] = [];
  page.on("requestfinished", (request) =>
    completed.push(new URL(request.url()).pathname),
  );
  await page.goto("/#/research/meet/featured");
  await expect(page.locator("h1.quest-heading")).toHaveText(
    "Can students text and still keep up?",
  );
  await expect
    .poll(
      () => completed.filter((path) => path === "/api/research/config").length,
    )
    .toBe(1);
  expect(completed).not.toContain("/api/lesson");
  // Returning to the classic route still loads its own lesson.
  await page.goto("/#/classic");
  await expect
    .poll(() => completed.filter((path) => path === "/api/lesson").length)
    .toBe(1);
});

test("new quest headings receive focus and the slider tracks input without a tween", async ({
  page,
}) => {
  await page.goto("/#/research/meet/featured");
  const heading = page.locator("h1.quest-heading");
  await expect(heading).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(heading).toHaveText("Why investigate texting during lectures?");
  await expect(heading).toBeFocused();
  const slider = page.getByRole("slider");
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("10");
  expect(
    await page
      .locator(".quest-attention-bar .phone")
      .evaluate((el) => (el as HTMLElement).style.transform),
  ).toBe("scaleX(0.7)");
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  expect(
    await page
      .locator(".quest-attention-bar .phone")
      .evaluate((el) => (el as HTMLElement).style.transform),
  ).toBe("scaleX(0)");
  await page
    .getByRole("button", { name: "Plan the study", exact: true })
    .click();
  await expect(heading).toHaveText(
    "Which question best captures what we want to investigate?",
  );
  await expect(heading).toBeFocused();
  await expect(page.locator(".quest-screen")).toHaveCount(1);
});

test("the study design stays mounted across rapid choices, feedback, reduced motion and resumption", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  const mutations: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (
      new URL(request.url()).pathname.startsWith("/api/") &&
      request.method() !== "GET"
    )
      mutations.push(request.url());
  });
  await openStep(page, "approach");
  const figure = page.getByRole("figure", { name: "Study design preview" });
  const network = figure.locator(".study-design-network");
  await figure.evaluate((el) => {
    el.setAttribute("data-retained", "yes");
  });
  await network
    .locator(".study-design-group")
    .first()
    .evaluate((el) => {
      el.setAttribute("data-retained", "group");
    });
  await expect(
    figure.getByText("What the researchers did", { exact: true }),
  ).toHaveCount(0);
  for (const choice of ["B", "C", "B", "A", "C"]) {
    await page.keyboard.press(choice);
    await expect(network).toHaveAttribute("data-plan", choice);
  }
  await expect(figure).toHaveAttribute("data-retained", "yes");
  await expect(network.locator(".study-design-group").first()).toHaveAttribute(
    "data-retained",
    "group",
  );
  await expect(figure.getByRole("status")).toContainText("Students decide");
  await expect(page.locator(".quest-feedback")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(network.locator("svg > path").nth(1)).toHaveAttribute(
    "d",
    "M500 122 C500 134 150 134 150 146",
  );
  await page.keyboard.press("B");
  await expect(network.locator("svg > path").nth(1)).toHaveAttribute(
    "d",
    "M300 122 C300 134 150 134 150 146",
  );
  // A correct submission adds the source summary to the same working diagram.
  await page.keyboard.press("Enter");
  await expect(
    figure.getByText("What the researchers did", { exact: true }),
  ).toBeVisible();
  await expect(figure).toHaveAttribute("data-retained", "yes");
  await expect(page.getByRole("main")).not.toContainText(/73\.41|83\.00|9\.59/);
  for (const width of [320, 390, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await settleMotion(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.reload();
  await expect(
    figure.getByText("What the researchers did", { exact: true }),
  ).toBeVisible();
  await expect(network).toHaveAttribute("data-plan", "B");
  await expect(page.locator(".quest-options input").nth(1)).toBeChecked();
  await expect(page.locator("h1.quest-heading")).toBeFocused();
  // The screenshot uses the default motion setting again, with settled paths.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await settleMotion(page);
  await page.screenshot({
    path: testInfo.outputPath("study-design-desktop.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("study-design-mobile.png"),
    fullPage: true,
  });
  expect(mutations).toEqual([]);
  expect(errors).toEqual([]);
});

test("the design activity supports touch without a stuck hover state", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await openStep(page, "approach");
    const options = page.locator(".quest-options input");
    await options.nth(2).locator("..").tap();
    await expect(options.nth(2)).toBeChecked();
    await expect(page.locator(".study-design-network")).toHaveAttribute(
      "data-plan",
      "C",
    );
    await expect
      .poll(() =>
        options
          .nth(2)
          .locator("..")
          .evaluate((el) => getComputedStyle(el).transform),
      )
      .toBe("none");
    await options.nth(1).locator("..").tap();
    await expect(options.nth(1)).toBeChecked();
    await expect(page.locator(".study-design-network")).toHaveAttribute(
      "data-plan",
      "B",
    );
  } finally {
    await context.close();
  }
});

test("chart values keep their normal size while the fills animate", async ({
  page,
}) => {
  const index = textingQuest.findIndex(
    (step) => step.kind !== "complete" && step.visual === "results",
  );
  const previous = textingQuest[index - 1]!;
  expect(previous.kind).toBe("choice");
  await openStep(page, previous.id);
  if (previous.kind !== "choice")
    throw Error("Expected a decision before results");
  for (const answer of previous.correct) await page.keyboard.press(answer);
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Reveal the results", exact: true })
    .click();
  await page
    .getByRole("radio", { name: "About the same", exact: true })
    .check();
  await page.getByRole("button", { name: "Reveal reported means" }).click();
  const values = page.locator(".quest-col > b");
  await expect(values).toHaveText(["73.41%", "83.00%"]);
  await expect(page.locator(".quest-col .fill b")).toHaveCount(0);
  const heights = await values.first().evaluate(async (label) => {
    const result: number[] = [];
    for (let frame = 0; frame < 20; frame++) {
      await new Promise(requestAnimationFrame);
      result.push(label.getBoundingClientRect().height);
    }
    return result;
  });
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(0.1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const bar of await page.locator(".quest-col .fill").all()) {
    await expect
      .poll(() => bar.evaluate((el) => getComputedStyle(el).transform))
      .toBe("none");
  }
});

test("every authored question keeps all choices above the desktop action bar", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const index = Number(
      new URLSearchParams(location.search).get("layoutcase"),
    );
    sessionStorage.setItem(
      "gradly-texting-quest:featured",
      JSON.stringify({ index, records: {} }),
    );
  });
  const sizes = [
    [1366, 768],
    [1440, 900],
    [1920, 1080],
    [1280, 720],
    [1024, 768],
    [1280, 640],
    [1000, 640],
  ];
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width: width!, height: height! });
    for (const [index, step] of textingQuest.entries()) {
      if (step.kind !== "choice") continue;
      await page.goto(`/?layoutcase=${index}#/research/meet/featured`);
      await expect(page.locator("h1.quest-heading")).toHaveText(step.heading);
      await page.evaluate(() => document.fonts.ready);
      const assertFit = async () => {
        const geometry = await page.evaluate(() => {
          const dock = document
            .querySelector(".quest-bar")!
            .getBoundingClientRect();
          const header = document
            .querySelector(".focus-bar")!
            .getBoundingClientRect();
          return {
            scroll: window.scrollY,
            horizontalOverflow:
              document.documentElement.scrollWidth > innerWidth,
            headerBottom: header.bottom,
            dockTop: dock.top,
            options: [...document.querySelectorAll(".quest-option")].map(
              (element) => {
                const box = element.getBoundingClientRect();
                const hit = document.elementFromPoint(
                  box.left + box.width / 2,
                  box.top + box.height / 2,
                );
                return {
                  top: box.top,
                  bottom: box.bottom,
                  height: box.height,
                  uncovered: !!hit && element.contains(hit),
                };
              },
            ),
          };
        });
        const description = `${step.id} at ${width}×${height}`;
        expect(geometry.scroll, description).toBe(0);
        expect(geometry.horizontalOverflow, description).toBe(false);
        expect(geometry.options, description).toHaveLength(step.options.length);
        for (const option of geometry.options) {
          expect(option.top, description).toBeGreaterThanOrEqual(
            geometry.headerBottom,
          );
          expect(option.bottom, description).toBeLessThanOrEqual(
            geometry.dockTop - 6,
          );
          expect(option.height, description).toBeGreaterThanOrEqual(44);
          expect(option.uncovered, description).toBe(true);
        }
      };
      await assertFit();
      if (step.id === "results") {
        await page
          .getByRole("radio", { name: "About the same", exact: true })
          .check();
        await page
          .getByRole("button", { name: "Reveal reported means" })
          .click();
        await assertFit();
        await page
          .getByRole("button", { name: "Compare means", exact: true })
          .click();
        await assertFit();
      }
      await page.getByRole("button", { name: "Help", exact: true }).click();
      await assertFit();
      if (step.visual === "variation") {
        await page
          .getByRole("button", { name: "Show variation", exact: true })
          .click();
        await assertFit();
      }
    }
  }
});

test("the result table is optional and never moves the desktop choices below the dock", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStep(page, "results");
  await page.getByRole("radio", { name: "Text lower", exact: true }).check();
  await page.getByRole("button", { name: "Reveal reported means" }).click();
  const options = page.locator(".quest-options");
  const table = page.getByRole("table", { name: "Reported quiz scores" });
  await expect(table).toBeHidden();
  const before = await options.boundingBox();
  await page.getByText("View values as a table", { exact: true }).click();
  await expect(table).toBeVisible();
  await expect(table).toContainText("73.41%");
  await expect(table).toContainText("83.00%");
  const after = await options.boundingBox();
  expect(after!.y).toBe(before!.y);
  const dock = await page.locator(".quest-bar").boundingBox();
  expect(after!.y + after!.height).toBeLessThan(dock!.y);
  await page.getByText("View values as a table", { exact: true }).click();
  await page.screenshot({
    path: testInfo.outputPath("results-choices-desktop.png"),
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("results prediction is ungraded, survives reload and reveals only on request", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await openStep(page, "results");
  const reveal = page.getByRole("button", { name: "Reveal reported means" });
  await expect(reveal).toBeDisabled();
  await expect(page.locator(".quest-col > b")).toHaveCount(0);
  await expect(
    page.getByText("View values as a table", { exact: true }),
  ).toHaveCount(0);
  // Letter keys pick a prediction, as on other questions; nothing is graded.
  await page.keyboard.press("A");
  await expect(
    page.getByRole("radio", { name: "Text lower", exact: true }),
  ).toBeChecked();
  await expect(reveal).toBeEnabled();
  await expect(page.locator(".quest-feedback")).toHaveCount(0);
  await page.keyboard.press("3");
  await expect(
    page.getByRole("radio", { name: "No text lower", exact: true }),
  ).toBeChecked();
  await page.reload();
  await expect(
    page.getByRole("radio", { name: "No text lower", exact: true }),
  ).toBeChecked();
  await expect(page.locator(".quest-col > b")).toHaveCount(0);
  await reveal.click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem("gradly-texting-quest:featured")!)
          .records,
    ),
  ).toEqual({});
  await expect(page.locator("h1.quest-heading")).toBeFocused();
  await expect(page.locator(".quest-col > b")).toHaveText(["73.41%", "83.00%"]);
  await expect(
    page.getByText(
      "You predicted: No text lower. Now compare the reported means.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Check", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Compare means", exact: true })
    .click();
  await expect(page.locator(".quest-mean-gap")).toBeVisible();
  await expect(page.locator(".quest-comparison strong")).toHaveCount(0);
  await page.locator("h1.quest-heading").focus();
  await page.keyboard.press("A");
  await page.keyboard.press("Enter");
  await expect(page.locator(".quest-feedback")).toContainText(
    "Nicely reasoned",
  );
  await expect(page.locator(".quest-comparison strong")).toContainText(
    "9.59 percentage points",
  );
  await settleMotion(page);
  await expect
    .poll(() =>
      page
        .locator(".quest-col .fill")
        .first()
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .toBe("none");
  await expect
    .poll(() =>
      page
        .locator(".quest-feedback")
        .evaluate((el) => getComputedStyle(el).opacity),
    )
    .toBe("1");
  await page.screenshot({
    path: testInfo.outputPath("results-comparison.png"),
  });
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Reveal reported means" }),
  ).toHaveCount(0);
  await expect(page.locator(".quest-feedback")).toContainText(
    "Nicely reasoned",
  );
  await page.getByRole("button", { name: "Look beyond the averages" }).click();
  await expect(page.locator(".quest-col .quest-sd")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Show variation", exact: true })
    .click();
  await expect(page.locator(".quest-col .quest-sd")).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("h1.quest-heading").focus();
  await page.keyboard.press("A");
  await page.keyboard.press("Enter");
  await expect(page.locator(".quest-feedback")).toContainText(
    "Nicely reasoned",
  );
  await settleMotion(page);
  const spread = await page.locator(".quest-col").evaluateAll((columns) =>
    columns.map((column) => {
      const box = column.getBoundingClientRect();
      const mark = column.querySelector(".quest-sd")!.getBoundingClientRect();
      const style = getComputedStyle(column.querySelector(".quest-sd")!);
      return {
        height: box.height,
        bottom: box.bottom,
        markTop: mark.top,
        markBottom: mark.bottom,
        padding: style.padding,
        marginBottom: style.marginBottom,
        borderRadius: style.borderRadius,
      };
    }),
  );
  for (const [index, values] of [
    [73.41, 16.95],
    [83, 17.26],
  ].entries()) {
    const box = spread[index]!;
    const [mean, sd] = values;
    expect(
      Math.abs(box.markTop - (box.bottom - (box.height * (mean! + sd!)) / 100)),
    ).toBeLessThan(1);
    expect(
      Math.abs(
        box.markBottom - (box.bottom - (box.height * (mean! - sd!)) / 100),
      ),
    ).toBeLessThan(1);
    expect(box.padding).toBe("0px");
    expect(box.marginBottom).toBe("0px");
    expect(box.borderRadius).toBe("0px");
  }
  await page.screenshot({ path: testInfo.outputPath("results-spread.png") });
});

test("results prediction and comparison remain accessible on narrow screens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openStep(page, "results");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page
    .getByRole("radio", { name: "About the same", exact: true })
    .check();
  await page.getByRole("button", { name: "Reveal reported means" }).click();
  await page
    .getByRole("button", { name: "Compare means", exact: true })
    .click();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await expect(page.locator(".quest-option")).toHaveCount(3);
  }
});
