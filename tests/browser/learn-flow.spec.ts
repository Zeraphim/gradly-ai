import { expect, test, type Page, type Locator } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  newSession,
  publicSession,
  transition,
} from "../../apps/api/src/research/engine.js";
import { studyCards } from "../../apps/web/src/research/studies/cards.js";

test.setTimeout(30000);
test.use({ actionTimeout: 8000 });

async function inView(page: Page, control: Locator) {
  await expect(control).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  const box = await control.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
}
async function uploaded(page: Page) {
  const lesson = structuredClone(featured);
  lesson.source = "generated";
  let session = newSession(lesson, "viewport-fixture");
  await page.route("**/api/research/learning**", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      session = {
        ...transition(session, lesson, body.action),
        version: session.version + 1,
      };
    }
    await route.fulfill({ json: publicSession(session, lesson) });
  });
  await page.goto("/#/research/play/viewport-fixture");
  await expect(page.locator(".orient")).toBeVisible();
}

for (const width of [390, 768, 1366]) {
  test(`one library and consistent header from upload at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const legacy: string[] = [];
    page.on("request", (r) => {
      if (/\/api\/(lesson|feedback)(?:\?|$)/.test(r.url()))
        legacy.push(r.url());
    });
    await page.addInitScript(() => {
      localStorage.setItem(
        "paperquest.session.v1",
        JSON.stringify({ started: true, current: 2, questions: {} }),
      );
    });
    await page.goto("/");
    const header = page.locator(".gr-header");
    const before = await header.boundingBox();
    const labels = await header.locator("nav a").allTextContents();
    await expect(
      page.getByRole("button", { name: /Resume quest|Review quest/ }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: /Try a sample paper/ }).click();
    await expect(page).toHaveURL(/#\/research\/learn$/);
    await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
    expect(await header.locator("nav a").allTextContents()).toEqual(labels);
    expect((await header.boundingBox())!.height).toBe(before!.height);
    await expect(header.locator('[aria-current="page"]')).toHaveAttribute(
      "href",
      "#/research/learn",
    );
    await header
      .getByRole("link", { name: "Upload", exact: true })
      .or(header.getByRole("link", { name: "Upload a paper", exact: true }))
      .click();
    await expect(
      page.getByRole("heading", { name: "Upload your research paper" }),
    ).toBeVisible();
    await page.goBack();
    await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
    await noOverflow(page);
    for (const route of ["history", "glossary", "reasoning"]) {
      await page.goto(`/#/research/${route}`);
      await expect(header).toBeVisible();
      expect(await header.locator("nav a").allTextContents()).toEqual(labels);
      expect((await header.boundingBox())!.height).toBe(before!.height);
      await noOverflow(page);
    }
    expect(legacy).toEqual([]);
  });
}

test("retired library, picker and classic links recover to Learn without a second picker", async ({
  page,
}) => {
  for (const path of [
    "studies",
    "featured",
    "meet/featured",
    "lab/texting-lecture",
    "",
  ]) {
    await page.goto(`/#/research/${path}`);
    await expect(page).toHaveURL(/#\/research\/learn$/);
    await expect(page.locator(".library-card")).toHaveCount(studyCards.length);
    await expect(page.locator(".mode-pill")).toHaveCount(0);
  }
  await page.goto("/#/classic");
  await expect(page).toHaveURL(/#\/research\/learn$/);
  await page.goto("/#/research/studies/sleep-school");
  await expect(
    page.getByRole("button", { name: "Begin study", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /All studies/ }).click();
  await expect(page).toHaveURL(/#\/research\/learn$/);
});

for (const [width, height] of [
  [1062, 835],
  [1366, 768],
  [1024, 600],
  [900, 640],
  [860, 640],
  [859, 900],
  [1024, 1366],
  [1920, 1080],
  [768, 1024],
  [390, 844],
  [320, 640],
]) {
  test(`uploaded intro and orientation stay usable at ${width}x${height}`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await uploaded(page);
    await noOverflow(page);
    if (width! >= 860 || (width! >= 390 && height! >= 800)) {
      await inView(
        page,
        page.getByRole("button", { name: "Next", exact: true }),
      );
      expect(await page.evaluate(() => scrollY)).toBe(0);
    }
    await page.screenshot({
      path: info.outputPath("intro.png"),
      fullPage: true,
    });
    await page
      .locator(".orient .study-choice")
      .filter({ hasText: "One thing causes another" })
      .click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: /Design/ }).click();
    await noOverflow(page);
    if (width! >= 860 || (width! >= 390 && height! >= 800))
      await inView(
        page,
        page.getByRole("button", { name: "Next", exact: true }),
      );
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page
      .locator(".orient .study-choice")
      .filter({ hasText: "Never, it stays hidden" })
      .click();
    expect(
      (await page
        .getByRole("button", { name: "Check", exact: true })
        .boundingBox())!.height,
    ).toBeGreaterThanOrEqual(44);
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await expect(
      page.getByText("Not quite. You have one retry."),
    ).toBeVisible();
    await noOverflow(page);
    if (width! >= 860 || (width! >= 390 && height! >= 800))
      await inView(
        page,
        page.getByRole("button", { name: "Begin study", exact: true }),
      );
    await page
      .locator(".orient .study-choice")
      .filter({ hasText: "Before the first decision" })
      .click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await expect(page.getByText(/Miss twice and I’ll explain/)).toBeVisible();
    if (width! >= 860 || (width! >= 390 && height! >= 800))
      await inView(
        page,
        page.getByRole("button", { name: "Begin study", exact: true }),
      );
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "One thing causes another" }),
    ).toBeChecked();
    await page
      .getByRole("button", { name: "Read the full briefing", exact: true })
      .click();
    await noOverflow(page);
    if (width === 1062) {
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(audit.violations.map((v) => v.id)).toEqual([]);
    }
    await page
      .getByRole("button", { name: "Skip to study", exact: true })
      .click();
    await expect(page.getByRole("progressbar")).toBeVisible();
  });
}

for (const [width, height] of [
  [1366, 768],
  [1024, 600],
]) {
  test(`every prepared intro keeps Begin in view at ${width}x${height}`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const card of studyCards) {
      await page.goto(`/#/research/studies/${card.slug}`);
      await test.step(card.slug, async () => {
        await inView(
          page,
          page.getByRole("button", { name: "Begin study", exact: true }),
        );
        await noOverflow(page);
      });
    }
  });
}

test("unavailable-study skip link focuses its main landmark", async ({
  page,
}) => {
  await page.goto("/#/research/studies/no-such-study");
  await expect(
    page.getByRole("heading", { name: "This study isn’t available" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("reasoning preview returns to the current learning route, not an older upload", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await expect(page.locator("main")).toBeVisible();
  const preview = async () => {
    await page.getByRole("link", { name: "How it works", exact: true }).click();
    await page
      .getByRole("link", { name: "Try the reasoning preview", exact: true })
      .click();
    return page.getByRole("link", { name: "Back to learning", exact: true });
  };
  const back = await preview();
  await expect(back).toHaveAttribute("href", "#/research/upload");
  await back.click();
  await page.locator('.gr-nav a[href="#/research/learn"]').click();
  await expect(await preview()).toHaveAttribute("href", "#/research/learn");
  await page
    .getByRole("link", { name: "Back to learning", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Pick a study. Make the calls." }),
  ).toBeVisible();
});
