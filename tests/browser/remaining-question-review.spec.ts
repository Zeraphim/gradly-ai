import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { remainingStudies } from "../fixtures/remaining-studies.js";

for (const width of [375, 1366]) {
  for (const [slug, body] of remainingStudies) {
    test(`${slug}: revised questions reach the reveal at ${width}px`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 768 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/#/research/studies/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() =>
          document.fonts.check('16px "Plus Jakarta Sans Variable"'),
        ),
      ).toBe(true);
      await page
        .getByRole("button", { name: "Begin study", exact: true })
        .click();
      for (const challenge of body.lesson.challenges) {
        await expect(page.locator("h1.journey-title")).toHaveText(
          challenge.prompt,
        );
        const reveal = page.getByRole("button", {
          name: /^Reveal (reported results|the results|the estimate)$/,
        });
        if (await reveal.isVisible()) await reveal.click();
        if (width === 375 && challenge.id === body.lesson.challenges[0]!.id) {
          const wrong = challenge.options.find(
            (option) => !challenge.accepted.includes(option.id),
          )!;
          await page.locator(`[data-option="${wrong.id}"]`).first().click();
          await page
            .getByRole("button", { name: "Check", exact: true })
            .click();
          // The player deliberately ignores a second action within 280 ms.
          await page.waitForTimeout(300);
          await page
            .getByRole("button", { name: "Try again", exact: true })
            .click();
          await expect(page.locator(".journey-retry-hint")).toHaveText(
            challenge.hint,
          );
        }
        for (const id of challenge.accepted) {
          const choice = page.locator(`[data-option="${id}"]`).first();
          await choice.scrollIntoViewIfNeeded();
          await choice.click();
        }
        await page.getByRole("button", { name: "Check", exact: true }).click();
        await expect(page.locator(".journey-feedback")).toContainText(
          challenge.explanation,
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        ).toBe(false);
        expect(
          (
            await new AxeBuilder({ page }).include(".studies").analyze()
          ).violations.map((v) => v.id),
        ).toEqual([]);
        if (challenge.id === body.lesson.challenges[0]!.id)
          await page.screenshot({
            path: info.outputPath(`${slug}-${width}.png`),
          });
        await page.waitForTimeout(300);
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
      }
      await expect(
        page.getByRole("heading", {
          name: body.lesson.paper.title,
          exact: true,
        }),
      ).toBeVisible();
    });
  }
}
