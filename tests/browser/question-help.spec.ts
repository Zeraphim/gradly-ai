import { test, expect, type Page } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";

async function question(page: Page) {
  const lesson = structuredClone(featured);
  lesson.source = "generated";
  const c = lesson.challenges[0]!;
  c.prompt = "How could confounding affect this comparison?";
  c.evidence = ["The groups also met at different times."];
  c.scene = null;
  c.responseStyle = "cards";
  c.options = [
    { id: "A", text: "Consider another difference between groups." },
    { id: "B", text: "Choose the p-value." },
    { id: "C", text: "Ignore the comparison." },
  ];
  c.accepted = ["A"];
  c.hint = "HINT_UNLOCKED_AFTER_MISS";
  let s = transition(newSession(lesson, "question-help"), lesson, "begin");
  const posts: string[] = [];
  await page.route("**/api/research/learning**", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      posts.push(body.action);
      s = {
        ...(body.action === "submit"
          ? submit(s, lesson, body.selected, "")
          : transition(s, lesson, body.action)),
        version: s.version + 1,
      };
    }
    await route.fulfill({ json: publicSession(s, lesson) });
  });
  await page.goto("/#/research/play/question-help");
  await expect(page.locator("h1.journey-title")).toBeVisible();
  return { posts };
}

for (const width of [390, 1024, 1366]) {
  test(`context help preserves answer and hint gates at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1024 ? 600 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const { posts } = await question(page);
    const term = page.getByRole("button", { name: "confounding", exact: true });
    await term.focus();
    // Heading text must expose its nested term control to accessibility APIs.
    await expect(page.locator("h1.journey-title")).not.toHaveAttribute(
      "aria-label",
    );
    const popover = page.getByRole("group", {
      name: /confounding: definition/i,
    });
    await expect(popover).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(term).toBeFocused();
    const help = page.getByRole("button", {
      name: "Help me understand this",
      exact: true,
    });
    await help.click();
    const modal = page.getByRole("dialog");
    await expect(modal.locator("dt")).toHaveText(["Confounding"]);
    await expect(modal).not.toContainText("p-value");
    await expect(modal).not.toContainText("HINT_UNLOCKED_AFTER_MISS");
    expect(posts).toEqual([]);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations.map((v) => v.id),
    ).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(help).toBeFocused();
    await page
      .locator(".study-choice")
      .filter({ hasText: "Choose the p-value." })
      .click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Not quite yet" }),
    ).toBeVisible();
    await help.click();
    await expect(modal).toContainText("HINT_UNLOCKED_AFTER_MISS");
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("radio", { name: "Choose the p-value.", exact: true }),
    ).toBeChecked();
    expect(posts).toEqual(["submit"]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(0);
  });
}

test("Research terms live under Help, with three primary destinations", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".gr-nav a")).toHaveCount(3);
  await expect(page.locator(".gr-nav")).toContainText("Learn");
  await expect(page.locator(".gr-nav")).not.toContainText("Glossary");
  await page.getByRole("link", { name: "How it works", exact: true }).click();
  await page.getByRole("link", { name: "Research terms", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Research terms", exact: true }),
  ).toBeVisible();
  await expect(page.locator("details.glossary")).toHaveCount(15);
});
