import { expect, test } from "@playwright/test";

for (const [width, height] of [
  [375, 812],
  [1024, 600],
  [1366, 768],
]) {
  test(`revised study separates old answers and preserves other saves at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      if (localStorage.getItem("gradly-study-progress:v1")) return;
      const old = {
        phase: "reveal",
        index: 4,
        bonus: false,
        attempts: { c1: [{ selected: ["A"], correct: true }] },
        retrying: null,
        draft: null,
        completed: true,
        updated: 77,
      };
      localStorage.setItem(
        "gradly-study-progress:v1",
        JSON.stringify({
          "memory-training": old,
          "sleep-school": old,
        }),
      );
    });
    await page.goto("/#/research/studies/memory-training");
    const begin = page.getByRole("button", {
      name: "Begin study",
      exact: true,
    });
    await expect(begin).toBeVisible();
    await expect(page.getByRole("status")).toContainText(
      "questions have changed",
    );
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const saved = () =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("gradly-study-progress:v1")!),
      );
    expect((await saved())["memory-training"].completed).toBe(true);
    await begin.click();
    await expect(
      page.getByLabel("0 practice points in this study"),
    ).toBeVisible();
    const current = await saved();
    expect(current["memory-training"].revision).toBe(2);
    expect(current["memory-training"].attempts).toEqual({});
    expect(current["sleep-school"].completed).toBe(true);
    expect(current["sleep-school"].updated).toBe(77);
    await page.reload();
    await expect(
      page.getByLabel("0 practice points in this study"),
    ).toBeVisible();
    await expect(begin).toHaveCount(0);
  });
}
