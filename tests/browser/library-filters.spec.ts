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
