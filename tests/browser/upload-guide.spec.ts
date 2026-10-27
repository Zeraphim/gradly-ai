import { test, expect } from "@playwright/test";

test("the recovered OpenCode guide animates only on Upload a paper", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const guide = page.locator(".upload-guide-animated img");
  await expect(guide).toHaveCount(1);
  await expect
    .poll(() => guide.evaluate((e) => (e as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
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
  expect(after!.width).toBe(before!.width);
  expect(after!.height).toBe(before!.height);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".upload-guide-animated")).toHaveCount(1);
  await page.goto("/#/research/settings");
  await page.getByLabel("Reduce interface motion").check();
  await page.getByRole("link", { name: "Gradly home", exact: true }).click();
  await expect(page.locator(".upload-guide-animated")).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.home-guide [data-pose="guiding"]')).toBeVisible();
});
