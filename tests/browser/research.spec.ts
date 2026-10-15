import { AxeBuilder } from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";
import { pdfBytes, multiPagePdfBytes } from "../research/pdf-fixture.js";
async function begin(page: Page) {
  await page.goto("/#/research/learn");
  await page.getByRole("button", { name: "Start investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();
}
async function choose(page: Page, ids: string[]) {
  for (const id of ids)
    await page
      .locator(".choice")
      .filter({
        has: page.locator(".keycap", { hasText: new RegExp(`^${id}$`) }),
      })
      .click();
  await page.getByRole("button", { name: "Check Answer" }).click();
}
const keys = [["A"], ["B"], ["A", "B"], ["B"], ["A", "B"], ["A"], ["B"], ["B"]];
test("featured adventure, ordered challenges, bonus, reveal, review and saved history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await begin(page);
  const sessionUrl = page.url();
  const titles = [
    "Frame the Research Question",
    "Identify the Research Design",
    "Recommend Statistical Methods",
    "Justify the Analysis",
    "Examine Assumptions",
    "Interpret the Mean Difference",
    "Interpret Statistical Significance",
    "Write a Defensible Conclusion",
  ];
  for (let i = 0; i < 8; i++) {
    await expect(
      page.getByRole("heading", { name: titles[i], exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Check Answer" }),
    ).toBeDisabled();
    await expect(page.locator(".feedback")).toHaveCount(0);
    await expect(page.getByText("Gingerich", { exact: false })).toHaveCount(0);
    if (i < 5)
      await expect(page.getByText("73.41%", { exact: true })).toHaveCount(0);
    if (i === 5) await expect(page.locator(".difference")).toHaveCount(0);
    if (i === 2)
      await page
        .getByLabel("Defend your decision")
        .fill(
          "Different students contribute to each group; both tests compare means.",
        );
    await choose(page, keys[i]!);
    await expect(page.locator(".feedback")).toContainText("Well reasoned");
    if (i === 5)
      await expect(page.locator(".difference")).toContainText("9.59");
    await page.getByRole("button", { name: "Continue", exact: false }).click();
  }
  await expect(
    page.getByRole("heading", { name: "One more question?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try the bonus" }).click();
  await choose(page, ["B"]);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(
    page.getByRole("heading", { name: "Research Paper Unlocked!" }),
  ).toBeVisible();
  await expect(
    page.getByText("Amanda C. Gingerich", { exact: false }),
  ).toBeVisible();
  await page
    .getByLabel("What will you check first")
    .fill("The study design and independence of observations.");
  await page.getByRole("button", { name: "Finish adventure" }).click();
  await expect(
    page.getByRole("heading", { name: "Investigation complete!" }),
  ).toBeVisible();
  await expect(page.locator(".metrics")).toContainText("8/8");
  await page.getByRole("button", { name: "Review Decisions" }).click();
  await expect(
    page.getByRole("heading", { name: "Your research decisions" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Investigation complete!" }),
  ).toBeVisible();
  await page.goto("/#/research/history");
  await expect(
    page.getByRole("link", { name: "Review adventure" }),
  ).toBeVisible();
  await page.goto(sessionUrl);
  await expect(
    page.getByRole("heading", { name: "Investigation complete!" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("two misses, retry, agent panel, resume, bonus skip and restart confirmation", async ({
  page,
}) => {
  await begin(page);
  await choose(page, ["B"]);
  await expect(page.locator(".feedback")).toContainText("reconsider");
  await page.getByText("See How Gradly’s AI Agents Helped").click();
  await page.getByText("Identified Misconception", { exact: true }).click();
  await expect(
    page.getByText("no model was called", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".feedback")).toHaveCount(0);
  await choose(page, ["C"]);
  await expect(page.locator(".feedback")).toContainText(
    "reference explanation",
  );
  await page.reload();
  await expect(page.locator(".feedback")).toContainText(
    "reference explanation",
  );
  await page.getByRole("button", { name: "Continue" }).click();
  for (let i = 1; i < 8; i++) {
    await choose(page, keys[i]!);
    await page.getByRole("button", { name: "Continue" }).click();
  }
  await page.getByRole("button", { name: "Skip to paper reveal" }).click();
  await page.getByRole("button", { name: "Finish adventure" }).click();
  await expect(page.locator(".metrics")).toContainText("7/8");
  const original = page.url();
  await page.getByRole("button", { name: "Retry Missed Concepts" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();
  await choose(page, ["A"]);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(".metrics")).toContainText("1/1");
  await page.goto(original);
  await expect(page.locator(".metrics")).toContainText("7/8");
  await page.getByRole("button", { name: "Restart Adventure" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Restart Adventure" }).click();
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  await page.goto("/#/research/history");
  await expect(
    page.getByRole("link", { name: "Resume investigation" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Review adventure" }),
  ).toHaveCount(2);
});
test("PDF preview, real extraction, no-key recovery and document deletion", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "bad.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("not a real PDF"),
  });
  await expect(page.locator(".error[role=alert]")).toContainText("contents");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "research.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await expect(page.getByTitle("Selected research PDF preview")).toBeVisible();
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(
    page.getByText("1 page with extracted text", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start sample preview" }),
  ).toBeEnabled();
  await page.goto("/#/research/history");
  await expect(
    page.getByRole("heading", { name: "research.pdf" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View processing" }).click();
  await expect(
    page.getByRole("heading", { name: "Preview the adventure flow" }),
  ).toBeVisible();
  const documentId = page.url().split("/").pop();
  const unconfirmed = await page.request.post("/api/research/jobs", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: { id: documentId },
  });
  expect(unconfirmed.status()).toBe(400);
  expect((await unconfirmed.json()).error).toContain("Confirm sending");
  await expect(page.locator(".status")).toHaveText([
    "Pending",
    "Pending",
    "Pending",
    "Pending",
    "Pending",
  ]);
  await page.goto("/#/research/history");
  await page.getByRole("button", { name: "Delete document" }).click();
  await page
    .getByRole("button", { name: "Delete document", exact: true })
    .last()
    .click();
  await expect(page.getByRole("heading", { name: "research.pdf" })).toHaveCount(
    0,
  );
});
test("server ownership, version conflict, incomplete-stage protection and no secret exposure", async ({
  page,
  browser,
}) => {
  await begin(page);
  const id = page.url().split("/").pop();
  const response = await page.request.get(`/api/research/learning?id=${id}`);
  const state = await response.json();
  expect(JSON.stringify(state)).not.toContain("3514177");
  const noSkip = await page.request.post("/api/research/learning", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: { action: "next", id, version: state.version },
  });
  expect(noSkip.status()).toBe(400);
  const outsider = await browser.newContext();
  const hidden = await outsider.request.get(
    `http://127.0.0.1:5173/api/research/learning?id=${id}`,
  );
  expect(hidden.status()).toBe(400);
  await outsider.close();
  await choose(page, ["A"]);
  const stale = await page.request.post("/api/research/learning", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: { action: "submit", id, version: state.version, selected: ["A"] },
  });
  expect(stale.status()).toBe(409);
  const config = await (await page.request.get("/api/research/config")).json();
  expect(config).not.toHaveProperty("NEBIUS_API_KEY");
});
test("desktop, tablet, mobile layouts and keyboard access", async ({
  page,
}) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/upload",
      "/glossary",
      "/help",
      "/settings",
      "/privacy",
    ]) {
      await page.goto("/#/research" + route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await begin(page);
    await page.getByText("Hint", { exact: true }).click();
    await expect(
      page.getByText("Identify the outcome the researchers actually measured."),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/challenge-${width}.png`,
      fullPage: true,
    });
  }
  await page.goto("/#/research/settings");
  await page.getByLabel("Reduce interface motion").check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await page.reload();
  await expect(page.getByLabel("Reduce interface motion")).toBeChecked();
  await page.goto("/#/research/learn");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Think like a researcher." }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});

test("interrupted upload preserves the file and allows real retry", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "retry.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await page.route("**/api/research/documents", (route) =>
    route.abort("failed"),
  );
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(page.locator(".error")).toContainText("interrupted");
  await expect(page.getByText("retry.pdf", { exact: true })).toBeVisible();
  await page.unroute("**/api/research/documents");
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
});

test("automated accessibility checks on primary and supporting routes", async ({
  page,
}) => {
  for (const path of [
    "/",
    "/upload",
    "/glossary",
    "/help",
    "/settings",
    "/privacy",
  ]) {
    await page.goto("/#/research" + path);
    await page.getByRole("heading", { level: 1 }).waitFor();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
  await begin(page);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("scanned PDF OCR warning and no-key reasoning fallback are honest", async ({
  page,
}) => {
  const { scannedPdfBytes } = await import("../research/pdf-fixture.js");
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "scan.pdf",
    mimeType: "application/pdf",
    buffer: await scannedPdfBytes(),
  });
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(page.locator(".ocr-warning")).toContainText("English OCR");
  await begin(page);
  for (const ids of [["A"], ["B"]]) {
    await choose(page, ids);
    await page.getByRole("button", { name: "Continue" }).click();
  }
  await page
    .getByLabel("Defend your decision")
    .fill("Independent students contributed one outcome each.");
  await choose(page, ["A", "B"]);
  const id = page.url().split("/").pop();
  const response = await page.request.post("/api/research/feedback", {
    headers: { Origin: "http://127.0.0.1:5173" },
    data: { id },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).mode).toBe("fallback");
  await page.reload();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(
    "Independent students contributed one outcome each.",
  );
  await expect(page.locator(".feedback")).toContainText("Well reasoned");
  await page.getByRole("button", { name: "Revise explanation" }).click();
  await page
    .getByLabel("Defend your decision")
    .fill(
      "The groups contain separate participants, so the observations are not paired.",
    );
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("button", { name: "Save revised explanation" }).click();
  await page.reload();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(
    "The groups contain separate participants, so the observations are not paired.",
  );
  await expect(page.locator(".feedback")).toContainText("Well reasoned");
});

test("deployed hero composition, responsive scaling, color contrast and PDF handoff", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "A little curiosity. A lot of discovery.",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Choose a research PDF" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", {
        name: "Paper link or digital object identifier",
      }),
    ).toBeVisible();
    const bounds = await page.evaluate(() => {
      const pdf = document
        .querySelector(".upload-button")!
        .getBoundingClientRect();
      const link = document
        .querySelector(".link-form")!
        .getBoundingClientRect();
      return {
        pdfY: pdf.bottom,
        linkY: link.top,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    expect(bounds.linkY).toBeGreaterThan(bounds.pdfY);
    expect(bounds.overflow).toBe(false);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/hero-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
  await page.locator("input[type=file]").setInputFiles({
    name: "hero-study.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await expect(
    page.getByRole("heading", { name: "Upload your Research Paper" }),
  ).toBeVisible();
  await expect(page.getByText("hero-study.pdf", { exact: true })).toBeVisible();
  const preview = page.getByTitle("Selected research PDF preview");
  await expect(preview).toHaveAttribute("src", /^blob:/);
  expect(
    await preview.evaluate(async (frame) => {
      const response = await fetch((frame as HTMLIFrameElement).src);
      return (await response.text()).slice(0, 5);
    }),
  ).toBe("%PDF-");
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
});

test("no-key sample flow is explicit, resumable and separate from uploaded evidence", async ({
  page,
}) => {
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "not-the-sample.pdf",
    mimeType: "application/pdf",
    buffer: multiPagePdfBytes(9),
  });
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(
    page.getByText("Preview uses a separate sample study.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Extracted PDF page").selectOption("8");
  await expect(
    page.getByRole("region", { name: "Text from PDF page 9" }),
  ).toContainText("Project planning page 9");
  await page.getByRole("button", { name: "Previous extracted page" }).click();
  await expect(page.getByLabel("Extracted PDF page")).toHaveValue("7");
  await page.getByRole("button", { name: "Start sample preview" }).click();
  await expect(page.getByLabel("Sample preview mode")).toBeVisible();
  const processingUrl = page.url();
  await expect(
    page.getByRole("heading", { name: "Your adventure is ready!" }),
  ).toBeVisible();
  await expect(page.locator(".status")).toHaveText(Array(5).fill("Completed"));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your adventure is ready!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  await expect(page.getByLabel("Sample preview mode")).toContainText(
    "not an analysis of your upload",
  );
  await page.getByRole("button", { name: "Begin investigation" }).click();
  for (const [index, answer] of keys.entries()) {
    if (index === 2)
      await page
        .getByLabel("Defend your decision")
        .fill("Independent groups suggest comparing means.");
    await choose(page, answer);
    if (index === 2) {
      await page
        .getByText("See How Gradly’s AI Agents Helped", { exact: true })
        .click();
      await page
        .getByRole("button", { name: "Explore sample guidance" })
        .click();
      await expect(
        page.getByText(
          "Your writing is saved; no AI assessment was performed.",
          { exact: false },
        ),
      ).toBeVisible();
    }
    await page.getByRole("button", { name: "Continue", exact: false }).click();
  }
  await page.getByRole("button", { name: "Skip to paper reveal" }).click();
  await page.getByRole("button", { name: "Finish adventure" }).click();
  await expect(
    page.getByRole("heading", { name: "Investigation complete!" }),
  ).toBeVisible();
  await expect(page.locator(".metrics")).toContainText("8/8");
  await page.goto("/#/research/history");
  await expect(
    page.getByText("Sample preview · Completed", { exact: true }),
  ).toBeVisible();
  await page.goto(processingUrl);
  await expect(page.getByLabel("Sample preview mode")).toBeVisible();
});

test("learning paths and nine-page document review fit desktop, tablet and mobile", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/research/learn");
    await expect(
      page.getByRole("heading", { name: "Think like a researcher." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/learn-${width}.png`,
      fullPage: true,
    });
  }
  await page.goto("/#/research/upload");
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "nine-page-plan.pdf",
    mimeType: "application/pdf",
    buffer: multiPagePdfBytes(9),
  });
  await page.getByRole("button", { name: "Check this document" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(
      page.getByRole("button", { name: "Start sample preview" }),
    ).toBeEnabled();
    await expect(page.getByLabel("Extracted PDF page")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/document-review-${width}.png`,
      fullPage: true,
    });
  }
});

test("tactile actions stay stable, show real loading, and honor both motion preferences", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/research/learn");
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "false",
  );
  const start = page.locator(".featured-card button");
  await expect(start).toBeEnabled();
  await page.locator(".main").evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => {})),
    );
  });
  expect(
    await page
      .locator(".main")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("gradly-arrive");
  const other = page.locator(".path-card").nth(1);
  const initial = await other.boundingBox();
  const height = await start.evaluate((el) => (el as HTMLElement).offsetHeight);
  await start.hover();
  await expect
    .poll(() =>
      start
        .locator(".action-icon")
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe("none");
  await page.mouse.down();
  await expect
    .poll(() => start.evaluate((el) => getComputedStyle(el).scale))
    .toBe("0.96");
  expect(await start.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(
    height,
  );
  expect((await other.boundingBox())!.y).toBe(initial!.y);
  await page.mouse.move(4, 4);
  await page.mouse.up();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/research/learning", async (route) => {
    if (route.request().method() === "POST") await gate;
    await route.continue();
  });
  try {
    await start.click();
    await expect(start).toBeDisabled();
    await expect(start).toHaveAttribute("aria-busy", "true");
    await expect(start.locator(".is-spinning")).toBeVisible();
    expect(
      await start
        .locator(".is-spinning")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("gradly-spin");
  } finally {
    release();
  }
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();
  expect(consoleErrors).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/research/learn");
  await expect(start).toBeEnabled();
  expect(
    await page
      .locator(".main")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await start.hover();
  expect(
    await start
      .locator(".action-icon")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#/research/settings");
  await page.getByLabel("Reduce interface motion").check();
  await page.goto("/#/research/learn");
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  expect(
    await page
      .locator(".main")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
