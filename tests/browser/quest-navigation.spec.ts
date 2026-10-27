import { test, expect } from "@playwright/test";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  publicSession,
  transition,
} from "../../apps/api/src/research/engine.js";

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
