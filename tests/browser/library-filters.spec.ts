import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { studyCards } from "../../apps/web/src/research/studies/cards.js";

for (const width of [320, 390, 768, 1366]) {
  test(`quiet library filters retain combinations and reset at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#/research/learn");
    const filters = page.getByRole("region", {
      name: "Filter studies",
      exact: true,
    });
    const topic = filters.getByLabel("Topic", { exact: true });
    const design = filters.getByLabel("Study design", { exact: true });
    await expect(filters.getByRole("combobox")).toHaveCount(2);
    await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
    await expect(filters.getByRole("status")).toHaveText(
      `${studyCards.length} studies`,
    );
    await expect(
      filters.getByRole("button", { name: "Reset filters" }),
    ).toHaveCount(0);
    if (width >= 768)
      expect((await filters.boundingBox())!.height).toBeLessThan(120);
    for (const group of new Set(studyCards.map((s) => s.group))) {
      await design.selectOption(group);
      await expect(page.locator(".library-card")).toHaveCount(
        studyCards.filter((s) => s.group === group).length,
      );
    }
    await design.selectOption("all");
    for (const value of new Set(studyCards.map((s) => s.topic))) {
      await topic.selectOption(value);
      await expect(page.locator(".library-card")).toHaveCount(
        studyCards.filter((s) => s.topic === value).length,
      );
    }
    const first = studyCards[0]!;
    await topic.selectOption(first.topic);
    await design.selectOption(first.group);
    const count = studyCards.filter(
      (s) => s.topic === first.topic && s.group === first.group,
    ).length;
    await expect(page.locator(".library-card")).toHaveCount(count);
    await expect(filters.getByRole("status")).toHaveText(
      `${count} of ${studyCards.length} ${count === 1 ? "study" : "studies"}`,
    );
    const empty = [...new Set(studyCards.map((s) => s.topic))]
      .flatMap((t) =>
        [...new Set(studyCards.map((s) => s.group))].map((g) => ({ t, g })),
      )
      .find(
        ({ t, g }) => !studyCards.some((s) => s.topic === t && s.group === g),
      )!;
    await topic.selectOption(empty.t);
    await design.selectOption(empty.g);
    await expect(
      page.getByText(/No studies match these filters/),
    ).toBeVisible();
    await filters.getByRole("button", { name: "Reset filters" }).click();
    await expect(topic).toHaveValue("all");
    await expect(design).toHaveValue("all");
    await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
    await topic.focus();
    await page.keyboard.press("Tab");
    await expect(design).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations.map((v) => v.id),
    ).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`filters-${width}.png`),
      fullPage: false,
    });
  });
}

for (const touch of [false, true]) {
  test(`dropdown focus stays inside its border with ${touch ? "touch" : "mouse"} and keyboard`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      hasTouch: touch,
      viewport: { width: touch ? 390 : 1366, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5173/#/research/learn");
    const topic = page.getByLabel("Topic", { exact: true });
    const design = page.getByLabel("Study design", { exact: true });
    const unfocused = await topic.evaluate((el) => {
      const style = getComputedStyle(el);
      return { border: style.borderColor, fill: style.backgroundColor };
    });
    for (const control of [topic, design]) {
      if (touch) await control.tap();
      else await control.click();
      await page.keyboard.press("Escape");
      await expect(control).toBeFocused();
      const focused = await control.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          outline: style.outlineStyle,
          shadow: style.boxShadow,
          border: style.borderColor,
          fill: style.backgroundColor,
          appearance: style.appearance,
        };
      });
      expect(focused).toMatchObject({
        outline: "none",
        shadow: "none",
        appearance: "none",
      });
      expect(focused.border).not.toBe(unfocused.border);
      expect(focused.fill).not.toBe(unfocused.fill);
    }
    await topic.focus();
    await page.keyboard.press("Tab");
    await expect(design).toBeFocused();
    await expect(design).toHaveCSS("outline-style", "none");
    await expect(design).toHaveCSS("box-shadow", "none");
    await expect(design).not.toHaveCSS("border-color", unfocused.border);
    await design.selectOption("longitudinal");
    await page.getByRole("button", { name: "Reset filters" }).click();
    await expect(topic).toBeFocused();
    await expect(topic).toHaveCSS("outline-style", "none");
    await expect(topic).toHaveCSS("box-shadow", "none");
    await page.emulateMedia({ forcedColors: "active" });
    await expect(topic).toHaveCSS("appearance", "auto");
    await expect(topic).toHaveCSS("outline-width", "1px");
    await expect(topic).toHaveCSS("outline-offset", "-2px");
    await context.close();
  });
}
