import { test, expect } from "@playwright/test";

test("the Gradly guide loops only on Upload a paper and moves after returning", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const guide = page.locator(".upload-guide-animated img");
  await expect(guide).toHaveCount(1);
  await expect
    .poll(() => guide.evaluate((e) => (e as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  const first = await guide.screenshot();
  await page.waitForTimeout(350);
  const moving = await guide.screenshot();
  expect(first.equals(moving), "the guide must actually change frames").toBe(
    false,
  );
  await page.waitForTimeout(5000);
  const later = await guide.screenshot();
  await page.waitForTimeout(350);
  expect(
    later.equals(await guide.screenshot()),
    "the guide continues beyond its first cycle",
  ).toBe(false);
  for (const route of ["Learn", "How it works"]) {
    if (route === "Learn")
      await page.getByRole("link", { name: route, exact: true }).click();
    else await page.getByRole("link", { name: route }).click();
    await page.getByRole("link", { name: "Gradly home", exact: true }).click();
    await expect(guide).toBeVisible();
    const returned = await guide.screenshot();
    await page.waitForTimeout(350);
    expect(
      returned.equals(await guide.screenshot()),
      "cached image must move on return",
    ).toBe(false);
  }
  await expect(page.locator(".gr-brand .brand-logo")).toHaveCSS(
    "animation-name",
    "none",
  );
  for (const path of [
    "learn",
    "studies/sleep-school",
    "help",
    "glossary",
    "history",
    "settings",
    "upload",
  ]) {
    await page.goto(`/#/research/${path}`);
    await expect(page.locator(".research-lab main")).toBeVisible();
    await expect(page.locator(".upload-guide-animated")).toHaveCount(0);
  }
});

test("system and saved reduced motion switch to a static guide without shifting layout", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".upload-guide-animated")).toHaveCount(1);
  const before = await page.locator(".home-guide .mascot").boundingBox();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".upload-guide-animated")).toHaveCount(0);
  await expect(page.locator('.home-guide [data-pose="guiding"]')).toBeVisible();
  const after = await page.locator(".home-guide .mascot").boundingBox();
  // Bounding boxes can differ by floating-point fractions of a CSS pixel.
  expect(after!.width).toBeCloseTo(before!.width, 2);
  expect(after!.height).toBeCloseTo(before!.height, 2);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".upload-guide-animated")).toHaveCount(1);
  await page.goto("/#/research/settings");
  await page.getByLabel("Reduce interface motion").check();
  await page.getByRole("link", { name: "Gradly home", exact: true }).click();
  await expect(page.locator(".upload-guide-animated")).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.home-guide [data-pose="guiding"]')).toBeVisible();
});

test("the guide loops seamlessly across the cycle boundary", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/brand/mascot-guiding-animated.svg");
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(6);
  expect(
    await page.evaluate(() =>
      document
        .getAnimations()
        .every((a) => a.effect!.getTiming().iterations === Infinity),
    ),
  ).toBe(true);
  const poseAt = (time: number) =>
    page.evaluate((time) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = time;
      }
      return ["gradly-body", "gradly-tassel"].map((id) => {
        const matrix = new DOMMatrix(
          getComputedStyle(document.getElementById(id)!).transform,
        );
        return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
      });
    }, time);
  const lastFrame = await poseAt(4799.999);
  const finished = await poseAt(4800.001);
  for (const [i, values] of lastFrame.entries())
    for (const [j, value] of values.entries())
      expect(Math.abs(value - finished[i]![j]!)).toBeLessThan(0.001);
});
