import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { body as foodWarnings } from "../../apps/web/src/research/studies/data/food-warning-labels.js";
import { body as handHygiene } from "../../apps/web/src/research/studies/data/hand-washing-in-restrooms.js";
import { body as gratitude } from "../../apps/web/src/research/studies/data/daily-gratitude-and-well-being.js";
import { body as hearing } from "../../apps/web/src/research/studies/data/daily-conversation-hearing.js";
import { body as laterBorn } from "../../apps/web/src/research/studies/data/being-a-later-born.js";
import { body as morning } from "../../apps/web/src/research/studies/data/morning-people-and-life-satisfaction.js";
import { body as tracing } from "../../apps/web/src/research/studies/data/tracing-shapes-while-brainstorming.js";
import { body as reasoning } from "../../apps/web/src/research/studies/data/reasoning-and-belief-study.js";
import { body as socialSleep } from "../../apps/web/src/research/studies/data/social-media-and-sleep.js";
import { body as habits } from "../../apps/web/src/research/studies/data/building-daily-habits.js";
import { body as phishing } from "../../apps/web/src/research/studies/data/clicking-phishing-links.js";
import { body as debt } from "../../apps/web/src/research/studies/data/managing-personal-debt.js";
import { body as nature } from "../../apps/web/src/research/studies/data/natural-light-at-work.js";
import { body as puzzle } from "../../apps/web/src/research/studies/data/puzzle-solving-after-motivation.js";
import { body as appointments } from "../../apps/web/src/research/studies/data/remembering-doctor-appointments.js";
import { body as video } from "../../apps/web/src/research/studies/data/science-video-trust.js";
import { body as posture } from "../../apps/web/src/research/studies/data/body-posture-judgments.js";
import { body as bus } from "../../apps/web/src/research/studies/data/bus-ridership-behavior.js";
import { body as mindful } from "../../apps/web/src/research/studies/data/classroom-mindfulness-practice.js";
import { body as seatmates } from "../../apps/web/src/research/studies/data/classroom-seatmates.js";
import { body as cursing } from "../../apps/web/src/research/studies/data/cursing-while-in-pain.js";
import { body as dogs } from "../../apps/web/src/research/studies/data/dog-ownership-among-seniors.js";
import { body as trust } from "../../apps/web/src/research/studies/data/judging-statement-truthfulness.js";

// Studies whose questions were rewritten as decisions for issue #31. Each is walked
// from the first question to the reveal by choosing the accepted answer.
const rewritten = [
  ["judging-statement-truthfulness", trust],
  ["being-a-later-born", laterBorn],
  ["hand-washing-in-restrooms", handHygiene],
  ["food-warning-labels", foodWarnings],
  ["daily-conversation-hearing", hearing],
  ["daily-gratitude-and-well-being", gratitude],
  ["tracing-shapes-while-brainstorming", tracing],
  ["morning-people-and-life-satisfaction", morning],
  ["reasoning-and-belief-study", reasoning],
  ["social-media-and-sleep", socialSleep],
  ["building-daily-habits", habits],
  ["clicking-phishing-links", phishing],
  ["managing-personal-debt", debt],
  ["natural-light-at-work", nature],
  ["puzzle-solving-after-motivation", puzzle],
  ["remembering-doctor-appointments", appointments],
  ["science-video-trust", video],
  ["body-posture-judgments", posture],
  ["bus-ridership-behavior", bus],
  ["classroom-mindfulness-practice", mindful],
  ["classroom-seatmates", seatmates],
  ["cursing-while-in-pain", cursing],
  ["dog-ownership-among-seniors", dogs],
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
