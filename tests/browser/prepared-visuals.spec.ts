import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { preparedVisualAdditions } from "../fixtures/prepared-visuals.js";
import { body as study0 } from "../../apps/web/src/research/studies/data/anticipating-a-shock.js";
import { body as study1 } from "../../apps/web/src/research/studies/data/clinton-voter-activism.js";
import { body as study2 } from "../../apps/web/src/research/studies/data/holding-a-warm-drink.js";
import { body as study3 } from "../../apps/web/src/research/studies/data/imagining-survival-scenarios.js";
import { body as study4 } from "../../apps/web/src/research/studies/data/kids-eating-when-not-hungry.js";
import { body as study5 } from "../../apps/web/src/research/studies/data/memory-training.js";
import { body as study6 } from "../../apps/web/src/research/studies/data/music-and-attention.js";
import { body as study7 } from "../../apps/web/src/research/studies/data/music-and-mood-perception.js";
import { body as study8 } from "../../apps/web/src/research/studies/data/online-charity-giving.js";
import { body as study9 } from "../../apps/web/src/research/studies/data/parents-viewing-vaccine-safety-info.js";
import { body as study10 } from "../../apps/web/src/research/studies/data/phone-use-while-driving.js";
import { body as study11 } from "../../apps/web/src/research/studies/data/reading-words-aloud.js";
import { body as study12 } from "../../apps/web/src/research/studies/data/recalling-personal-details.js";
import { body as study13 } from "../../apps/web/src/research/studies/data/sharing-money-in-public.js";
import { body as study14 } from "../../apps/web/src/research/studies/data/stroop-task-performance.js";
import { body as study15 } from "../../apps/web/src/research/studies/data/teen-social-media-use.js";
import { body as study16 } from "../../apps/web/src/research/studies/data/television-viewing-habits.js";
import { body as study17 } from "../../apps/web/src/research/studies/data/understanding-how-pumps-work.js";
import { body as study18 } from "../../apps/web/src/research/studies/data/using-scented-air-while-brainstorming.js";
import { body as study19 } from "../../apps/web/src/research/studies/data/vaccine-misinformation-correction.js";
import { body as study20 } from "../../apps/web/src/research/studies/data/walking-speed-test.js";
const addedStudies = [
  ["anticipating-a-shock", study0],
  ["clinton-voter-activism", study1],
  ["holding-a-warm-drink", study2],
  ["imagining-survival-scenarios", study3],
  ["kids-eating-when-not-hungry", study4],
  ["memory-training", study5],
  ["music-and-attention", study6],
  ["music-and-mood-perception", study7],
  ["online-charity-giving", study8],
  ["parents-viewing-vaccine-safety-info", study9],
  ["phone-use-while-driving", study10],
  ["reading-words-aloud", study11],
  ["recalling-personal-details", study12],
  ["sharing-money-in-public", study13],
  ["stroop-task-performance", study14],
  ["teen-social-media-use", study15],
  ["television-viewing-habits", study16],
  ["understanding-how-pumps-work", study17],
  ["using-scented-air-while-brainstorming", study18],
  ["vaccine-misinformation-correction", study19],
  ["walking-speed-test", study20],
] as const;
for (const width of [375, 768, 1366])
  for (const [slug, body] of addedStudies) {
    test(`${slug} source visuals work at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: width === 1366 ? 768 : 812 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/#/research/studies/${slug}`);
      await page
        .getByRole("button", { name: /start|begin|continue/i })
        .first()
        .click();
      for (const challenge of body.lesson.challenges) {
        await expect(
          page.getByRole("heading", { name: challenge.prompt, exact: true }),
        ).toBeVisible();
        const addition = preparedVisualAdditions.find(
          (x) => x.slug === slug && x.id === challenge.id,
        );
        if (addition) {
          await expect(
            page.locator(`.study-scene.kind-${addition.kind}`),
          ).toBeVisible();
          await expect(page.locator(".study-scene h2")).toHaveText(
            challenge.scene!.title,
          );
        }
        const reveal = page.getByRole("button", { name: /^Reveal / });
        if (await reveal.isVisible()) await reveal.click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
        ).toBe(false);
        if (addition) {
          const axe = await new AxeBuilder({ page })
            .include(".studies")
            .analyze();
          expect(axe.violations.map((v) => v.id)).toEqual([]);
          if (
            [
              "kids-eating-when-not-hungry",
              "memory-training",
              "phone-use-while-driving",
            ].includes(slug)
          )
            await page.screenshot({
              path: testInfo.outputPath(`${slug}-${challenge.id}-${width}.png`),
              fullPage: true,
            });
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
        if (addition) {
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
          ).toBe(false);
          const axe = await new AxeBuilder({ page })
            .include(".studies")
            .analyze();
          expect(axe.violations.map((v) => v.id)).toEqual([]);
        }
        await page.waitForTimeout(300);
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
      }
      if (body.lesson.bonus)
        await page
          .getByRole("button", { name: "Skip to the paper", exact: true })
          .click();
      await expect(
        page.getByRole("heading", {
          name: body.lesson.paper.title,
          exact: true,
        }),
      ).toBeVisible();
    });
  }
