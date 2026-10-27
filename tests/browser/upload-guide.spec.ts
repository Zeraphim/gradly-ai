import { test, expect } from "@playwright/test";

test("the Gradly guide animates once only on Upload a paper", async ({
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
  const settled = await guide.screenshot();
  await page.waitForTimeout(350);
  expect(
    settled.equals(await guide.screenshot()),
    "the guide settles after one cycle",
  ).toBe(true);
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
