import { expect, test } from "@playwright/test";

const cases = [
  {
    name: "answer cards",
    slug: "selecting-a-beverage",
    index: 0,
    selector: ".study-choice",
  },
  {
    name: "answer pills",
    slug: "stress-affirmation",
    index: 0,
    selector: ".study-choice",
  },
  {
    name: "multiple answers",
    slug: "basketball-maths",
    index: 6,
    bonus: true,
    selector: ".study-choice",
  },
  {
    name: "prediction choices",
    slug: "learning-styles",
    index: 3,
    selector: ".study-predict-options label",
  },
  {
    name: "diagram answers",
    slug: "stress-affirmation",
    index: 1,
    selector: ".study-tap",
  },
];

for (const touch of [false, true]) {
  test.describe(touch ? "touch selection" : "mouse selection", () => {
    test.use({
      viewport: { width: touch ? 375 : 1366, height: 900 },
      hasTouch: touch,
    });
    for (const sample of cases) {
      test(`${sample.name} has no pointer focus ring and retains keyboard focus`, async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.addInitScript(
          ({ slug, index, bonus }) => {
            if (!localStorage.getItem("gradly-study-progress:v1"))
              localStorage.setItem(
                "gradly-study-progress:v1",
                JSON.stringify({
                  [slug]: {
                    phase: "challenge",
                    index,
                    bonus: !!bonus,
                    attempts: {},
                    retrying: null,
                    draft: null,
                    completed: false,
                    updated: 0,
                  },
                }),
              );
          },
          { ...sample, bonus: sample.bonus ?? false },
        );
        await page.goto(`/#/research/studies/${sample.slug}`);
        const choices = page.locator(sample.selector);
        for (const index of sample.bonus ? [0, 1] : [0, 1, 0]) {
          const choice = choices.nth(index);
          await choice.scrollIntoViewIfNeeded();
          if (touch) await choice.tap();
          else await choice.click();
          await expect(choice).toHaveClass(/selected/);
          await expect(choice).toHaveCSS("outline-style", "none");
        }
        await page.reload();
        await expect(choices.first()).toHaveClass(/selected/);
        await expect(choices.first()).toHaveCSS("outline-style", "none");
        // An actual keyboard action establishes keyboard modality before focus.
        await page.keyboard.press("Tab");
        const target =
          sample.selector === ".study-tap"
            ? choices.first()
            : choices.first().locator("input");
        await target.focus();
        await expect(choices.first()).toHaveCSS("outline-style", "solid");
        await expect(choices.first()).toHaveCSS("outline-width", "3px");
      });
    }
  });
}

for (const touch of [false, true]) {
  test.describe(
    touch ? "touch activity answers" : "mouse activity answers",
    () => {
      test.use({
        viewport: { width: touch ? 375 : 1366, height: 900 },
        hasTouch: touch,
      });
      test("shared scene answers reserve their outline for keyboard navigation", async ({
        page,
      }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/#/research/activities");
        await page
          .getByRole("radio", { name: "Visual explanation", exact: true })
          .check();
        await page
          .getByRole("button", { name: "Reveal reported results" })
          .click();
        const choice = page.locator(".scene-response").first();
        await choice.scrollIntoViewIfNeeded();
        if (touch) await choice.tap();
        else await choice.click();
        await expect(choice.locator("input")).toBeChecked();
        await expect(choice).toHaveCSS("outline-style", "none");
        await page.keyboard.press("Tab");
        await choice.locator("input").focus();
        await expect(choice).toHaveCSS("outline-style", "solid");
        await expect(choice).toHaveCSS("outline-width", "3px");
      });
    },
  );
}
