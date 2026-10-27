import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { termIn, type Term } from "@paperquest/contracts";
import { studyCards } from "../../apps/web/src/research/studies/cards.js";
import type { StudyBody } from "../../apps/web/src/research/studies/types.js";

/**
 * A prepared study whose first challenge plays as plain choices, with a
 * paper-sourced term in its prompt. Chosen from the saved data, so the spec
 * follows regenerated terms.
 */
async function pickStudy() {
  const found = [];
  for (const card of studyCards) {
    const { body } = (await import(
      `../../apps/web/src/research/studies/data/${card.slug}.ts`
    )) as { body: StudyBody };
    const { terms } = (await import(
      `../../apps/web/src/research/studies/data/terms/${card.slug}.ts`
    ).catch(() => ({ terms: {} }))) as { terms: Record<string, Term[]> };
    const c = body.lesson.challenges[0]!;
    if (c.scene || c.responseStyle === "tap") continue;
    for (const term of terms[c.id] ?? []) {
      if (!termIn(term.term, c.prompt)) continue;
      const page = body.lesson.evidence.find((r) =>
        term.refs.includes(r.id),
      )?.page;
      found.push({ slug: card.slug, challenge: c, term, page });
    }
  }
  // A paper term also exercises the source chip.
  const pick = found.find((f) => f.term.source === "paper") ?? found[0];
  if (!pick) throw Error("No prepared study has a term in its first prompt.");
  return pick;
}
const pick = await pickStudy();

const popover = (page: Page) => page.locator(".term-popover");
const promptMark = (page: Page) =>
  page
    .locator(".journey-title .term-mark")
    .filter({ hasText: new RegExp(`^${escape(pick.term.term)}$`, "i") })
    .first();
const escape = (s: string) =>
  s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[-\u2010-\u2015]/g, ".");

async function begin(page: Page) {
  await page.goto(`/#/research/studies/${pick.slug}`);
  await page.getByRole("button", { name: /Begin study/ }).click();
  await expect(promptMark(page)).toBeVisible();
  // Marks draw in after the question settles.
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

async function settled(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
}

async function noViolations(page: Page) {
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
  const result = await new AxeBuilder({ page })
    .include(".studies")
    .include(".term-layer")
    .analyze();
  expect(result.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual(
    [],
  );
}

test.describe("term definitions on desktop", () => {
  test.use({ viewport: { width: 1280, height: 860 } });

  test("hover opens a contextual definition after a short delay and closes on leave", async ({
    page,
  }) => {
    await begin(page);
    await promptMark(page).hover();
    await expect(popover(page)).toBeVisible();
    await expect(popover(page)).toContainText(pick.term.definition);
    await expect(popover(page)).toContainText(
      pick.term.source === "paper"
        ? `From the paper, p. ${pick.page}`
        : "In this study's context",
    );
    // The popover never takes a press meant for the page underneath.
    await expect(page.locator(".term-popover-frame")).toHaveCSS(
      "pointer-events",
      "none",
    );
    await page.mouse.move(5, 5);
    await expect(popover(page)).toHaveCount(0);
    await expect(promptMark(page)).toHaveClass(/is-visited/);
  });

  test("click pins the definition and a paper source opens its excerpt", async ({
    page,
  }) => {
    await begin(page);
    await promptMark(page).click();
    await expect(promptMark(page)).toHaveAttribute("aria-expanded", "true");
    if (pick.term.source === "paper") {
      const chip = page.getByRole("button", {
        name: `From the paper, p. ${pick.page}`,
      });
      await chip.click();
      await expect(page.locator(".term-excerpt")).toBeVisible();
      await expect(chip).toHaveAttribute("aria-expanded", "true");
    }
    await noViolations(page);
    await settled(page);
    await page.screenshot({ path: "test-results/terms/desktop-light.png" });
  });

  test("keyboard focus opens it, Escape closes it and keeps focus", async ({
    page,
  }) => {
    await begin(page);
    const mark = promptMark(page);
    await mark.focus();
    // Programmatic focus is not focus-visible, so reach it with Tab.
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(mark).toBeFocused();
    await expect(popover(page)).toBeVisible();
    const described = await mark.getAttribute("aria-describedby");
    expect(described).toBeTruthy();
    await expect(page.locator(`[id="${described}"]`)).toContainText(
      pick.term.definition,
    );
    await page.keyboard.press("Escape");
    await expect(popover(page)).toHaveCount(0);
    await expect(mark).toBeFocused();
  });

  test("an open definition does not block the answers and closes on Check", async ({
    page,
  }) => {
    await begin(page);
    await promptMark(page).click();
    await expect(popover(page)).toBeVisible();
    // Press each answer at its centre, even where the popover covers it.
    const first = page.locator(".study-choice").first();
    const box = (await first.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(first).toHaveClass(/selected/);
    // The press on an answer closed the pinned definition.
    await expect(popover(page)).toHaveCount(0);
    await promptMark(page).hover();
    await expect(popover(page)).toBeVisible();
    await page.getByRole("button", { name: /^Check/ }).click();
    await expect(popover(page)).toHaveCount(0);
  });

  test("dark colour preference keeps the popover readable", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await begin(page);
    await promptMark(page).click();
    await expect(popover(page)).toBeVisible();
    await noViolations(page);
    await settled(page);
    await page.screenshot({ path: "test-results/terms/desktop-dark.png" });
  });
});

test.describe("term definitions on a phone", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("tap toggles a definition without selecting the answer", async ({
    page,
  }) => {
    await begin(page);
    await promptMark(page).tap();
    await expect(popover(page)).toBeVisible();
    const box = await page.locator(".term-popover-frame").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    await settled(page);
    await page.screenshot({ path: "test-results/terms/phone-light.png" });
    await promptMark(page).tap();
    await expect(popover(page)).toHaveCount(0);
    const optionMark = page.locator("label .term-mark").first();
    if (await optionMark.count()) {
      await optionMark.tap();
      await expect(popover(page)).toBeVisible();
      await expect(page.locator(".study-choice.selected")).toHaveCount(0);
      // A tap elsewhere closes it.
      await page.locator(".journey-stage").tap();
      await expect(popover(page)).toHaveCount(0);
    }
    await page.emulateMedia({ colorScheme: "dark" });
    await promptMark(page).tap();
    await expect(popover(page)).toBeVisible();
    await noViolations(page);
    await settled(page);
    await page.screenshot({ path: "test-results/terms/phone-dark.png" });
  });
});
