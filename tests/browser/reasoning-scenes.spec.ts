import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import type { SceneOf } from "@paperquest/contracts";
import { studyCards } from "../../apps/web/src/research/studies/cards.js";
import type { SavedScene } from "../../apps/web/src/research/studies/catalog.js";
import type {
  StudyBody,
  StudyChallenge,
} from "../../apps/web/src/research/studies/types.js";

/**
 * One prepared challenge per new scene kind, found in the saved scene files so
 * the spec follows a rerun of scripts/define-prepared-scenes.ts. A kind no
 * prepared study received fails here: tune the authoring rules, do not skip.
 */
async function pick(kind: "ladder" | "sort" | "spot") {
  for (const card of studyCards) {
    const { body } = (await import(
      `../../apps/web/src/research/studies/data/${card.slug}.ts`
    )) as { body: StudyBody };
    const { scenes } = (await import(
      `../../apps/web/src/research/studies/data/scenes/${card.slug}.ts`
    ).catch(() => ({ scenes: {} }))) as {
      scenes: Record<string, SavedScene>;
    };
    const all = [
      ...body.lesson.challenges,
      ...(body.lesson.bonus ? [body.lesson.bonus] : []),
    ];
    for (const [index, c] of all.entries()) {
      const saved = scenes[c.id];
      if (c.scene || saved?.scene.kind !== kind) continue;
      return {
        slug: card.slug,
        index,
        bonus: index >= body.lesson.challenges.length,
        challenge: c as StudyChallenge,
        saved,
      };
    }
  }
  throw Error(`No prepared study has a saved ${kind} scene.`);
}
const picks = {
  ladder: await pick("ladder"),
  sort: await pick("sort"),
  spot: await pick("spot"),
};
type Pick = (typeof picks)[keyof typeof picks];

async function open(page: Page, p: Pick, solved: boolean) {
  await page.addInitScript(
    ({ slug, index, bonus, id, answer, solved }) => {
      localStorage.setItem(
        "gradly-study-progress:v1",
        JSON.stringify({
          [slug]: {
            phase: "challenge",
            index,
            bonus,
            attempts: solved
              ? { [id]: [{ selected: answer, correct: true }] }
              : {},
            retrying: null,
            draft: null,
            completed: false,
            updated: Date.now(),
          },
        }),
      );
    },
    {
      slug: p.slug,
      index: p.index,
      bonus: p.bonus,
      id: p.challenge.id,
      answer: p.challenge.accepted,
      solved,
    },
  );
  await page.goto("about:blank");
  await page.goto(`/#/research/studies/${p.slug}`);
  const view = page.locator(`.study-scene.kind-${p.saved.scene.kind}`);
  await expect(view).toBeVisible();
  await settled(page);
  return view;
}

async function settled(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

async function checks(page: Page, name: string) {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await settled(page);
  const result = await new AxeBuilder({ page })
    .include(".study-scene")
    .analyze();
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual(
    [],
  );
  // The fixed answer dock would cover the scene's lower edge.
  await page.addStyleTag({
    content: ".journey-dock { display: none !important; }",
  });
  await page
    .locator(".study-scene")
    .screenshot({ path: `test-results/scenes/${name}.png` });
}

for (const [device, use] of [
  ["desktop", { viewport: { width: 1280, height: 900 } }],
  [
    "phone",
    { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true },
  ],
] as const)
  test.describe(`new scene kinds on ${device}`, () => {
    test.use(use);
    const press = async (page: Page, selector: string) => {
      const target = page.locator(selector).first();
      if (device === "phone") await target.tap();
      else await target.click();
    };

    test("claim ladder: rungs read modest to strong and answer or inspect", async ({
      page,
    }) => {
      const p = picks.ladder;
      const scene = p.saved.scene as SceneOf<"ladder">;
      await open(page, p, false);
      const rungs = page.locator(".study-ladder-rung");
      await expect(rungs).toHaveCount(scene.rungs.length);
      await expect(rungs.first()).toContainText(scene.rungs[0]!.label);
      // Nothing reveals the supported claim before an answer.
      await expect(page.locator(".study-ladder-reach")).toHaveCount(0);
      await expect(page.locator(".study-ladder-beyond")).toHaveCount(0);
      // A cards-style ladder has no control of its own; its answers are the
      // cards below, which other specs drive by keyboard.
      if (p.saved.responseStyle === "tap") {
        if (device === "desktop") {
          await page.locator(".study-ladder-rung button[role]").first().focus();
          await page.keyboard.press("Space");
        } else await press(page, ".study-ladder-rung button[role]");
        await expect(
          page.locator(".study-ladder-rung button[role]").first(),
        ).toHaveAttribute("aria-checked", "true");
      }
      await checks(page, `ladder-${device}-answering`);
      await open(page, p, true);
      if (scene.reach)
        await expect(page.locator(".study-ladder-reach")).toBeVisible();
      await checks(page, `ladder-${device}-solved`);
    });

    test("sort: a card moves into a bin and back, by press and by keyboard", async ({
      page,
    }) => {
      const p = picks.sort;
      const scene = p.saved.scene as SceneOf<"sort">;
      await open(page, p, false);
      const tray = page.locator(".study-sort-tray");
      await expect(tray.locator(".study-sort-card")).toHaveCount(
        scene.cards.length,
      );
      const bin = scene.bins[0]!;
      const first = scene.cards[0]!;
      await press(page, ".study-sort-tray .study-sort-move");
      const target = page.locator(".study-sort-bin", { hasText: bin.label });
      await expect(target.locator(".study-sort-card")).toContainText(
        first.label,
      );
      await expect(
        page.locator(".study-sort [aria-live=polite]"),
      ).toContainText(bin.label);
      await settled(page);
      // Pressing the active bin again returns the card to the tray.
      const active = target.locator(".study-sort-move.active").first();
      await expect(active).toHaveAttribute("aria-pressed", "true");
      if (device === "desktop") {
        await active.focus();
        await page.keyboard.press("Enter");
      } else await active.tap();
      await expect(tray.locator(".study-sort-card")).toHaveCount(
        scene.cards.length,
      );
      await press(page, ".study-sort-tray .study-sort-move");
      await settled(page);
      await checks(page, `sort-${device}-answering`);
      await open(page, p, true);
      await expect(page.locator(".study-sort-move")).toHaveCount(0);
      await checks(page, `sort-${device}-solved`);
    });

    test("close reading: passages highlight and explain or answer", async ({
      page,
    }) => {
      const p = picks.spot;
      const scene = p.saved.scene as SceneOf<"spot">;
      await open(page, p, false);
      await expect(page.locator(".study-spot-text")).toContainText(
        scene.passages[0]!.label,
      );
      if (p.saved.responseStyle === "tap") {
        await press(page, ".study-spot-passage.answer");
        await expect(
          page.locator(".study-spot-passage.answer").first(),
        ).toHaveAttribute("aria-checked", "true");
      } else {
        const passage = page.locator(".study-spot-passage.inspect").first();
        if (device === "desktop") {
          await passage.focus();
          await page.keyboard.press("Enter");
        } else await passage.tap();
        await expect(passage).toHaveAttribute("aria-expanded", "true");
        await expect(page.locator(".study-spot-note")).toContainText(
          scene.passages[0]!.detail,
        );
      }
      await checks(page, `spot-${device}-answering`);
      await open(page, p, true);
      await checks(page, `spot-${device}-solved`);
    });
  });
