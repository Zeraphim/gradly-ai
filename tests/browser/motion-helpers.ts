import type { Page } from "@playwright/test";

/**
 * Wait for finite entrance animations to finish before auditing a page.
 * Reduced-motion and looping animations are not part of the settled state.
 */
export async function settleMotion(page: Page) {
  await page.getByRole("main").evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished.catch(() => {})),
    );
  });
}
