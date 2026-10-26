import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { body } from "../../apps/web/src/research/studies/data/selecting-a-beverage.js";

for (const width of [375, 768, 1366]) {
  test(`revised beverage decisions keep answers out of context and work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    // A stored answer to the old recall question must not solve its replacement.
    await page.addInitScript(() =>
      localStorage.setItem(
        "gradly-study-progress:v1",
        JSON.stringify({
          "selecting-a-beverage": {
            phase: "challenge",
            index: 0,
            bonus: false,
            attempts: { c1: [{ selected: ["o1"], correct: true }] },
            retrying: null,
            draft: null,
            completed: false,
            updated: 0,
          },
        }),
      ),
    );
    await page.goto("/#/research/studies/selecting-a-beverage");
    for (const [index, challenge] of body.lesson.challenges.entries()) {
      await expect(
        page.getByRole("heading", { name: challenge.prompt, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Check", exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByRole("heading", { name: "Nice reasoning", exact: true }),
      ).toHaveCount(0);
      if (index === 0) {
        await expect(page.locator(".journey-evidence")).not.toContainText(
          "logistic regression",
        );
        await expect(page.locator(".journey-evidence")).not.toContainText(
          "binary",
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      const right = challenge.options.find((o) =>
        challenge.accepted.includes(o.id),
      )!;
      const choice = page
        .locator(".study-choice")
        .filter({ hasText: right.text });
      await choice.scrollIntoViewIfNeeded();
      await choice.click();
      await page.getByRole("button", { name: "Check", exact: true }).click();
      await expect(page.locator(".journey-feedback h2")).toBeVisible();
      await expect(page.locator(".journey-feedback")).toContainText(
        challenge.explanation,
      );
      if (index === 2)
        await expect(page.locator(".journey-feedback")).toContainText(
          "unresolved reporting inconsistency",
        );
      const axe = await new AxeBuilder({ page }).include(".studies").analyze();
      expect(axe.violations.map((v) => v.id)).toEqual([]);
      // The player's deliberate double-click guard uses elapsed time.
      await page.waitForTimeout(300);
      await page.getByRole("button", { name: "Continue", exact: true }).click();
    }
    await expect(
      page.getByRole("heading", { name: body.lesson.paper.title, exact: true }),
    ).toBeVisible();
  });
}

for (const width of [375, 768, 1366]) {
  for (const slug of ["exercise-focus", "sleep-school"]) {
    test(`${slug} added numerical scene is accessible and keyboard usable at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(
        (studySlug) =>
          localStorage.setItem(
            "gradly-study-progress:v1",
            JSON.stringify({
              [studySlug]: {
                phase: "challenge",
                index: 4,
                bonus: false,
                attempts: {},
                retrying: null,
                draft: null,
                completed: false,
                updated: 0,
              },
            }),
          ),
        slug,
      );
      await page.goto(`/#/research/studies/${slug}`);
      const figure = page.locator(
        slug === "exercise-focus" ? ".study-tests" : ".study-association",
      );
      await expect(figure).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
      ).toBe(false);
      const axe = await new AxeBuilder({ page }).include(".studies").analyze();
      expect(axe.violations.map((v) => v.id)).toEqual([]);
      await page.getByRole("radio").first().focus();
      await page.keyboard.press("Space");
      await expect(
        page.getByRole("button", { name: "Check", exact: true }),
      ).toBeEnabled();
      await page.getByRole("button", { name: "Check", exact: true }).click();
      await expect(page.locator(".journey-feedback h2")).toBeFocused();
    });
  }
}
