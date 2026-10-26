import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { body as foodWarnings } from "../../apps/web/src/research/studies/data/food-warning-labels.js";
import { body as handHygiene } from "../../apps/web/src/research/studies/data/hand-washing-in-restrooms.js";
import { body as hearing } from "../../apps/web/src/research/studies/data/daily-conversation-hearing.js";
import { body as laterBorn } from "../../apps/web/src/research/studies/data/being-a-later-born.js";
import { body as trust } from "../../apps/web/src/research/studies/data/judging-statement-truthfulness.js";

// Studies whose questions were rewritten as decisions for issue #31. Each is walked
// from the first question to the reveal by choosing the accepted answer.
const rewritten = [
  ["judging-statement-truthfulness", trust],
  ["being-a-later-born", laterBorn],
  ["hand-washing-in-restrooms", handHygiene],
  ["food-warning-labels", foodWarnings],
  ["daily-conversation-hearing", hearing],
] as const;

for (const width of [375, 1366]) {
  for (const [slug, study] of rewritten) {
    test(`${slug} plays through at ${width}px without overflow or axe violations`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/#/research/studies/${slug}`);
      await page
        .getByRole("button", { name: /start|begin|continue/i })
        .first()
        .click();
      for (const challenge of study.lesson.challenges) {
        await expect(
          page.getByRole("heading", { name: challenge.prompt, exact: true }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        ).toBe(false);
        const right = challenge.options.find((o) =>
          challenge.accepted.includes(o.id),
        )!;
        const choice = page
          .locator(".study-choice, [role=radio]")
          .filter({ hasText: right.text })
          .first();
        await choice.scrollIntoViewIfNeeded();
        await choice.click();
        await page.getByRole("button", { name: "Check", exact: true }).click();
        await expect(page.locator(".journey-feedback h2")).toBeVisible();
        await expect(page.locator(".journey-feedback")).toContainText(
          challenge.explanation,
        );
        const axe = await new AxeBuilder({ page })
          .include(".studies")
          .analyze();
        expect(axe.violations.map((v) => v.id)).toEqual([]);
        // The player's deliberate double-click guard uses elapsed time.
        await page.waitForTimeout(300);
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
      }
    });
  }
}
