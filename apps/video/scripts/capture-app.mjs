/**
 * Captures the running Gradly app for the Remotion film.
 *
 * Deterministic by design: the dev server runs in demo/preview mode, the
 * viewport is exactly 1920×1080 at 2× density, reduced motion is forced on, and
 * scrollbars/caret are hidden so stills tile cleanly into video. The walkthrough
 * uses the texting-lecture answer key so every screenshot shows a real state.
 *
 * Usage (dev server already running):
 *   node apps/video/scripts/capture-app.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../public/captures");
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:5173";

/** Answer key for `texting-lecture` (apps/api/src/research/featured.ts). */
const KEY = { q1: ["A"], q2: ["B"], q3: ["A", "B"], q4: ["B"], q5: ["A", "B"], q6: ["A"], q7: ["B"], q8: ["B"] };

const PREPARE_CSS = `
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  html { scrollbar-width: none; caret-color: transparent; }
  *, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; }
`;

const settle = async (page, ms = 300) => {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(ms);
};

const shot = async (page, name) => {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), animations: "disabled" });
  console.log("captured", name);
};

const pick = async (page, ids) => {
  for (const id of ids) await page.locator(`[data-option="${id}"]`).first().click();
};

const check = async (page) => {
  await page.getByRole("button", { name: "Check", exact: true }).click();
  await settle(page, 350);
};

/** Some stages gate the options behind an explicit evidence reveal. */
const revealIfPresent = async (page) => {
  const button = page.getByRole("button", { name: /^Reveal / }).first();
  if (!(await button.count())) return false;
  await button.click().catch(() => {});
  await settle(page, 450);
  return true;
};

/** Frame the answer choices and the sticky action bar together. */
const frameOptions = async (page) => {
  // A fixed offset keeps every state of one challenge on the same framing, so
  // cross-fades between them do not jump.
  await page.evaluate(() => window.scrollTo({ top: 40, behavior: "instant" })).catch(() => {});
  await settle(page, 500);
};

const advance = async (page) => {  for (const name of [/^Continue/, /^See the paper/, /^Skip to the paper/]) {
    const button = page.getByRole("button", { name }).first();
    if (await button.count()) {
      await button.click().catch(() => {});
      await settle(page, 300);
      return true;
    }
  }
  return false;
};

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.addInitScript((css) => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    });
  }, PREPARE_CSS);

  try {
    await page.goto(`${BASE}/#/research/learn`);
    await settle(page, 700);
    await shot(page, "library");

    await page.getByRole("link", { name: "Texting in class" }).first().click();
    await settle(page, 600);
    await shot(page, "briefing");

    await page.getByRole("button", { name: /Begin study/ }).first().click();
    await settle(page, 600);
    await shot(page, "challenge-question");

    // q1 → correct
    await pick(page, KEY.q1);
    await check(page);
    await advance(page);

    // q2 → correct, capture the design call
    await pick(page, KEY.q2);
    await check(page);
    await shot(page, "challenge-design");
    await advance(page);

    // q3 → the analysis choice the script narrates
    await frameOptions(page);
    await shot(page, "challenge-analysis");

    // a genuine miss, so the hint state is real
    await pick(page, ["C"]);
    await check(page);
    await frameOptions(page);
    await shot(page, "challenge-analysis-hint");
    await page.getByRole("button", { name: /Try again/ }).click();
    await settle(page, 300);
    await pick(page, KEY.q3);
    await shot(page, "challenge-analysis-selected");
    await check(page);
    await frameOptions(page);
    await shot(page, "challenge-analysis-correct");
    await advance(page);

    // q4, q5 quietly, then capture the results reading
    for (const q of ["q4", "q5"]) {
      await pick(page, KEY[q]);
      await check(page);
      await advance(page);
    }
    await frameOptions(page);
    await shot(page, "challenge-results");

    for (const q of ["q6", "q7", "q8"]) {
      if (await revealIfPresent(page)) {
        if (q === "q6") await shot(page, "challenge-results-revealed");
      }
      await pick(page, KEY[q]);
      if (q === "q6") await shot(page, "challenge-results-selected");
      await check(page);
      await advance(page);
    }

    // Optional bonus, then the reveal
    const skip = page.getByRole("button", { name: /Skip to the paper/i }).first();
    if (await skip.count()) await skip.click();
    else await advance(page);
    await settle(page, 900);
    await shot(page, "reveal");

    await page.goto(`${BASE}/#/research/upload`);
    await settle(page, 700);
    await shot(page, "upload-pdf");
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
