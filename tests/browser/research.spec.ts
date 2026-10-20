import { AxeBuilder } from "@axe-core/playwright";
import { test, expect, type Page } from "@playwright/test";
import { pdfBytes, multiPagePdfBytes } from "../research/pdf-fixture.js";
import { settleMotion } from "./motion-helpers.js";
import { openAdventureBriefing } from "./journey-helpers.js";
async function begin(page: Page) {
  await openAdventureBriefing(page);
  await page.getByRole("button", { name: "Start quest" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the Research Question" }),
  ).toBeVisible();
}
async function choose(page: Page, ids: string[]) {
  await expect(page.locator(".feedback")).toHaveCount(0);
  // Comparison scenes make their evidence available before assessment. Predictions
  // are optional exploration; they must not be mistaken for assessed responses.
  const reveal = page.getByRole("button", { name: "Reveal group results" });
  if (await reveal.count()) await reveal.click();
  const responses = page.locator(".scene-responses");
  for (const id of ids) {
    const response = responses
      .getByRole("radio")
      .or(responses.getByRole("checkbox"))
      .and(page.locator(`input[value="${id}"]`));
    await response.check();
    await expect(response).toBeChecked();
  }
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
    if (i === 5) {
      await expect(page.getByRole("figure")).toHaveCount(0);
      await expect(page.locator(".scene-difference")).toHaveCount(0);
      await expect(page.locator(".scene-responses")).toHaveCount(0);
      await page
        .getByRole("radio", { name: "No-texting group higher", exact: true })
        .check();
      await expect(
        page.getByRole("button", { name: "Check Answer" }),
      ).toBeDisabled();
    }
    if (i === 2)
      await page
        .getByLabel("Defend your decision")
        .fill(
          "Different students contribute to each group; both tests compare means.",
        );
    await choose(page, keys[i]!);
    await expect(page.locator(".feedback")).toContainText(
      "Your choice matches",
    );
    if (i === 5)
      await expect(page.locator(".scene-difference")).toContainText("9.59");
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
  await page.getByRole("button", { name: "Finish quest" }).click();
  await expect(
    page.getByRole("heading", { name: "Quest complete!" }),
  ).toBeVisible();
  await expect(page.locator(".metrics")).toContainText("8/8");
  await page.getByRole("button", { name: "Review Decisions" }).click();
  await expect(
    page.getByRole("heading", { name: "Your research decisions" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Quest complete!" }),
  ).toBeVisible();
  await page.goto("/#/research/history");
  await expect(page.getByRole("link", { name: "Review quest" })).toBeVisible();
  await page.goto(sessionUrl);
  await expect(
    page.getByRole("heading", { name: "Quest complete!" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("two misses, retry, agent panel, resume, bonus skip and restart confirmation", async ({
  page,
}) => {
  await begin(page);
  await choose(page, ["B"]);
  await expect(page.locator(".feedback")).toContainText("reconsider");
  await page.getByText("See the answer guide and evidence").click();
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
  await page.getByRole("button", { name: "Finish quest" }).click();
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
  await page.getByRole("button", { name: "Restart quest" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Restart quest" }).click();
  await page.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  await page.goto("/#/research/history");
  await expect(page.getByRole("link", { name: "Resume quest" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Review quest" })).toHaveCount(2);
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
  // The original PDF sits behind the review card's second view.
  await page.getByRole("tab", { name: "Original PDF" }).click();
  await expect(page.getByTitle("Selected research PDF preview")).toBeVisible();
  await page.getByRole("tab", { name: "What we read" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(page.locator(".review-count")).toHaveText("1 page");
  await expect(
    page.getByRole("button", { name: "Start sample preview" }),
  ).toBeEnabled();
  await page.goto("/#/research/history");
  await expect(
    page.getByRole("heading", { name: "research.pdf" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View processing" }).click();
  await expect(
    page.getByRole("heading", { name: "Confirm before preparing" }),
  ).toBeVisible();
  const documentId = page.url().split("/").pop();
  const unconfirmed = await page.request.post("/api/research/jobs", {
    headers: { Origin: new URL(page.url()).origin },
    data: { id: documentId },
  });
  expect(unconfirmed.status()).toBe(400);
  expect((await unconfirmed.json()).error).toContain("Confirm sending");
  await page.locator(".prep-more > summary").click();
  await page
    .getByText("View all 5 preparation stages", { exact: true })
    .click();
  await expect(page.locator(".preparation-audits summary small")).toHaveText([
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
    headers: { Origin: new URL(page.url()).origin },
    data: { action: "next", id, version: state.version },
  });
  expect(noSkip.status()).toBe(400);
  const outsider = await browser.newContext();
  const hidden = await outsider.request.get(
    `${new URL(page.url()).origin}/api/research/learning?id=${id}`,
  );
  expect(hidden.status()).toBe(400);
  await outsider.close();
  await choose(page, ["A"]);
  const stale = await page.request.post("/api/research/learning", {
    headers: { Origin: new URL(page.url()).origin },
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
  await page.route("**/api/research/documents", (route) =>
    route.abort("failed"),
  );
  await page.goto("/#/research/upload");
  // Choosing a file starts the check immediately.
  await page.getByLabel("Choose PDF file").setInputFiles({
    name: "retry.pdf",
    mimeType: "application/pdf",
    buffer: pdfBytes(),
  });
  await expect(page.getByRole("alert")).toContainText("interrupted");
  await expect(page.getByText("retry.pdf", { exact: true })).toBeVisible();
  await page.unroute("**/api/research/documents");
  await page.getByRole("button", { name: "Check again" }).click();
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
});

test("automated accessibility checks on primary and supporting routes", async ({
  page,
}) => {
  // Audit settled pages rather than a partially transparent entrance frame.
  // Motion remains enabled and has its own interaction checks below.
  const settle = async () => {
    await settleMotion(page);
  };
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
    await settle();
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
  await settle();
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
    headers: { Origin: new URL(page.url()).origin },
    data: { id },
  });
  expect(response.status()).toBe(400);
  expect((await response.json()).mode).toBe("fallback");
  await page.reload();
  await expect(page.getByLabel("Defend your decision")).toHaveValue(
    "Independent students contributed one outcome each.",
  );
  await expect(page.locator(".feedback")).toContainText("Your choice matches");
  const reasoningReview = page.getByRole("region", {
    name: "Reasoning review",
  });
  await expect(reasoningReview).toBeVisible();
  await expect(reasoningReview).toContainText("has not been assessed");
  await expect(
    reasoningReview.getByRole("link", {
      name: "See a reasoning-and-revision example",
    }),
  ).toBeVisible();
  await expect(page.locator(".agent-panel")).not.toHaveAttribute("open", "");
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
  await expect(page.locator(".feedback")).toContainText("Your choice matches");
});

test("legacy hero composition, responsive scaling, color contrast and PDF handoff", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#/classic");
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
  // The home handoff checks the PDF and, in sample mode, goes straight to
  // preparation with the uploaded file named.
  await page.waitForURL(/#\/research\/processing\//, { timeout: 60000 });
  await expect(page.getByText("hero-study.pdf", { exact: true })).toBeVisible();
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
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  await expect(
    page.getByText("we prepare an authored texting study, not your PDF", {
      exact: false,
    }),
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
    page.getByRole("heading", { name: "Your investigation is ready" }),
  ).toBeVisible({ timeout: 20000 });
  await page.locator(".prep-more > summary").click();
  await page
    .getByText("View all 5 preparation stages", { exact: true })
    .click();
  await expect(page.locator(".preparation-audits summary small")).toHaveText(
    Array(5).fill("Completed"),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Your investigation is ready" }),
  ).toBeVisible();
  // Ready samples hand off to the authored texting quest.
  await page.getByRole("link", { name: "Start the quest" }).click();
  await expect(page).toHaveURL(/#\/research\/meet\//);
  await expect(page.getByLabel("Sample preview mode")).toContainText(
    "no AI calls",
  );
  // The sample job's lesson still plays through the shared challenge player.
  const jobId = processingUrl.split("/").pop()!;
  await openAdventureBriefing(page, jobId);
  await page.getByRole("button", { name: "Start quest" }).click();
  await expect(page.getByLabel("Sample preview mode")).toContainText(
    "no AI calls",
  );
  for (const [index, answer] of keys.entries()) {
    if (index === 2)
      await page
        .getByLabel("Defend your decision")
        .fill("Independent groups suggest comparing means.");
    await choose(page, answer);
    if (index === 2) {
      await page
        .getByText("See the answer guide and evidence", { exact: true })
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
  await page.getByRole("button", { name: "Finish quest" }).click();
  await expect(
    page.getByRole("heading", { name: "Quest complete!" }),
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
  await expect(
    page.getByRole("heading", { name: "Document checked" }),
  ).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(
      page.getByRole("button", { name: "Start sample preview" }),
    ).toBeEnabled();
    await expect(page.getByLabel("Extracted PDF page")).toBeVisible();
    const privacy = page.locator(".review-privacy");
    await expect(privacy).toContainText(
      "Extracted text is stored for 30 days or until deleted.",
    );
    // An icon alone must not satisfy visibility for this material privacy copy.
    expect(
      await privacy.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let text: Node | null;
        let count = 0;
        while ((text = walker.nextNode())) {
          if (!text.textContent?.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(text);
          const rects = [...range.getClientRects()].filter(
            (rect) => rect.width > 0 && rect.height > 0,
          );
          if (
            !rects.length ||
            rects.some(
              (rect) =>
                rect.left < bounds.left - 1 ||
                rect.right > bounds.right + 1 ||
                rect.bottom > bounds.bottom + 1,
            )
          )
            return false;
          count += rects.length;
        }
        return count > 0;
      }),
    ).toBe(true);
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
  // Hover may scroll a taller page. Compare document coordinates for layout stability.
  const initialY =
    (await other.boundingBox())!.y + (await page.evaluate(() => scrollY));
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
  expect(
    (await other.boundingBox())!.y + (await page.evaluate(() => scrollY)),
  ).toBe(initialY);
  await page.mouse.move(4, 4);
  await page.mouse.up();
  // The library start opens the authored quest; the briefing start saves state.
  await start.click();
  await expect(page).toHaveURL(/#\/research\/meet\/featured$/);
  await openAdventureBriefing(page);
  const briefingStart = page.getByRole("button", { name: "Start quest" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/research/learning", async (route) => {
    if (route.request().method() === "POST") await gate;
    await route.continue();
  });
  try {
    await briefingStart.click();
    await expect(briefingStart).toBeDisabled();
    await expect(briefingStart).toHaveAttribute("aria-busy", "true");
    await expect(briefingStart.locator(".is-spinning")).toBeVisible();
    expect(
      await briefingStart
        .locator(".is-spinning")
        .evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("gradly-spin");
  } finally {
    release();
  }
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
