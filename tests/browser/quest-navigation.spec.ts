import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  publicSession,
  transition,
} from "../../apps/api/src/research/engine.js";

test("Back preserves unfinished choices, resolved answers and first-attempt records", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/research/meet/featured");
  const heading = page.locator("h1.quest-heading");
  await expect(heading).toHaveText("Can students text and still keep up?");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(heading).toHaveText(
    "Which question best captures what we want to investigate?",
  );
  const choices = page.locator(".quest-screen").getByRole("radio");
  await choices.nth(1).check();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(heading).toHaveText("Why investigate texting during lectures?");
  await page
    .getByRole("button", { name: "Plan the study", exact: true })
    .click();
  await expect(choices.nth(1)).toBeChecked();
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await expect(page.locator(".quest-feedback")).toContainText(
    "Nicely reasoned!",
  );
  const stored = await page.evaluate(
    () =>
      JSON.parse(sessionStorage.getItem("gradly-texting-quest:featured")!)
        .records,
  );
  await page.locator(".quest-bar .is-go").click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(choices.nth(1)).toBeChecked();
  await expect(choices.nth(1)).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Check", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".quest-feedback")).toContainText(
    "Nicely reasoned!",
  );
  expect(
    await page.evaluate(
      () =>
        JSON.parse(sessionStorage.getItem("gradly-texting-quest:featured")!)
          .records,
    ),
  ).toEqual(stored);
});

test("pointer selection has no outline and keyboard focus stays visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/research/meet/featured");
  await expect(page.locator("h1.quest-heading")).toHaveText(
    "Can students text and still keep up?",
  );
  await expect(page.locator(".quest-briefing-source")).toHaveText(
    "Prepared from Gingerich & Lineweaver (2014), Experiment 2.",
  );
  await page.keyboard.press("Enter");
  await expect(page.locator("h1.quest-heading")).toHaveText(
    "Why investigate texting during lectures?",
  );
  await page.keyboard.press("Enter");
  const option = page.locator(".quest-option").nth(1);
  await option.click();
  await expect(option).toHaveCSS("outline-style", "none");
  await expect(option).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)");
  await expect(option.getByRole("radio")).toBeChecked();
  await page.keyboard.press("Tab");
  await option.getByRole("radio").focus();
  await expect(option).toHaveCSS("outline-style", "solid");
  for (const width of [375, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test("an uploaded paper gets its own briefing before questions", async ({
  page,
}) => {
  const lesson = structuredClone(featured);
  lesson.id = "uploaded-context";
  lesson.source = "generated";
  lesson.title = "A commuter interview investigation";
  lesson.briefing =
    "Researchers interviewed commuters about navigating an unfamiliar station. The study explores how people describe finding their way.\nAn interview is a conversation used to gather participants’ accounts.";
  let session = newSession(lesson, "uploaded-context-session");
  await page.route("**/api/research/learning**", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      if (body.action === "begin")
        session = transition(session, lesson, "begin");
    }
    await route.fulfill({ json: publicSession(session, lesson) });
  });
  await page.goto("/#/research/adventure/uploaded-context-session");
  const briefing = page
    .locator("div.card")
    .filter({ hasText: "Your investigation briefing" });
  const paragraphs = briefing.locator("p");
  await expect(paragraphs.nth(0)).toContainText(
    "Researchers interviewed commuters",
  );
  await expect(paragraphs.nth(1)).toContainText(
    "An interview is a conversation",
  );
  await expect(briefing).not.toContainText("texting");
  await expect(
    page.getByRole("button", { name: "Check Answer", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Start quest", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Check Answer", exact: true }),
  ).toBeVisible();
});
