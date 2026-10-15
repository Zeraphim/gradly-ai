import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { referenceCase } from "../../apps/web/src/research/reference-case.js";
import { practiceCases } from "../../apps/web/src/research/research-cases.js";
import type { ResearchCase } from "../../apps/web/src/research/case-types.js";

const garden = practiceCases[0]!;
const notebookKey = "gradly.casefiles.v1";
const apiRequests = new WeakMap<Page, string[]>();
const errors = new WeakMap<Page, string[]>();
const initialWriting = "My starting thought, before reading the evidence.";
const explanation =
  "I changed the reach of my claim because of the study's limits.";
const headings = {
  evidence: "Read the study.",
  claim: "What can we conclude?",
  transfer: "Try a new situation.",
  complete: "Your paper recap.",
};
function route(study = referenceCase) {
  return `/#/research/lab/${study.id}`;
}
async function stage(page: Page, phase: keyof typeof headings) {
  await expect(
    page.getByRole("heading", { level: 1, name: headings[phase], exact: true }),
  ).toBeVisible();
}
async function begin(page: Page, study = referenceCase, notes = false) {
  await page.goto(route(study));
  await expect(
    page.getByRole("heading", { level: 1, name: study.title }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start exploring", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("group", { name: "Your starting answer", exact: true })
    .getByRole("radio", { name: study.claims[2]!.text, exact: true })
    .check();
  if (notes) {
    await page.getByText("Add a starting note", { exact: false }).click();
    await page
      .getByLabel("Why do you think so?", { exact: true })
      .fill(initialWriting);
    await page
      .getByRole("group", { name: "Your starting confidence", exact: true })
      .getByRole("radio", { name: "Very sure", exact: true })
      .check();
  }
  await page
    .getByRole("button", { name: "Start exploring", exact: true })
    .click();
  await stage(page, "evidence");
}
async function readAll(page: Page, study = referenceCase, save = false) {
  for (let i = 0; i < study.evidence.length; i++) {
    const note = study.evidence[i]!;
    const reader = page.getByRole("article", {
      name: "Current study note",
      exact: true,
    });
    await expect(
      reader.getByRole("heading", { name: note.label, exact: true }),
    ).toBeVisible();
    await expect(reader).toContainText(note.summary);
    if (
      save &&
      (study.usefulEvidenceIds.includes(note.id) ||
        note.id === study.competingEvidenceId)
    )
      await reader
        .getByRole("button", { name: "Save note", exact: true })
        .click();
    if (i < study.evidence.length - 1)
      await page
        .getByRole("button", { name: "Next note", exact: true })
        .click();
  }
  await page
    .getByRole("button", { name: "Choose a conclusion", exact: true })
    .click();
  await stage(page, "claim");
}
async function conclude(page: Page, study = referenceCase) {
  await page
    .getByRole("group", { name: "Your conclusion", exact: true })
    .getByRole("radio", { name: study.claims[1]!.text, exact: true })
    .check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "That fits the evidence.", exact: true }),
  ).toBeFocused();
}
async function tryIt(page: Page, study = referenceCase) {
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await stage(page, "transfer");
  await page
    .getByRole("radio", {
      name: study.transfer.options.find(
        (item) => item.id === study.transfer.supportedOptionId,
      )!.text,
      exact: true,
    })
    .check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(
    page.getByText("That connection holds.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "See recap", exact: true }).click();
  await stage(page, "complete");
}

test.beforeEach(async ({ page }) => {
  apiRequests.set(page, []);
  errors.set(page, []);
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/api/"))
      apiRequests.get(page)!.push(request.url());
  });
  page.on("pageerror", (error) => errors.get(page)!.push(error.message));
  await page.route("**/api/**", (request) => request.abort("failed"));
});
test.afterEach(async ({ page }) => {
  expect(apiRequests.get(page)).toEqual([]);
  expect(errors.get(page)).toEqual([]);
});

test("authored examples keep lightweight artwork, provenance and a path to the upload home", async ({
  page,
}) => {
  const images: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/brand/"))
      images.push(request.url());
  });
  await page.goto(route());
  await expect(
    page.getByRole("heading", { level: 1, name: referenceCase.title }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Gradly home", exact: true }),
  ).toHaveAttribute("href", "#/research/lab");
  await expect.poll(() => images.length).toBeGreaterThan(0);
  expect(images.some((url) => url.endsWith(".png"))).toBe(false);
  await page.getByRole("button", { name: "Help", exact: true }).click();
  const help = page.getByRole("region", { name: "Help", exact: true });
  await help.getByText("About this preview", { exact: true }).click();
  await expect(help).toContainText("not AI assessed");
  await page.getByRole("button", { name: "Close help", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Help", exact: true }),
  ).toBeFocused();
});

for (const study of [referenceCase, garden]) {
  test(`${study.id}: a guided trail preserves thinking, source details and an honest export`, async ({
    page,
  }, testInfo) => {
    await begin(page, study, true);
    const reader = page.getByRole("article", {
      name: "Current study note",
      exact: true,
    });
    await reader.getByText("More detail", { exact: true }).click();
    await expect(reader).toContainText(study.evidence[0]!.text);
    await readAll(page, study, true);
    await expect(page.getByRole("slider")).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        name: "That fits the evidence.",
        exact: true,
      }),
    ).toHaveCount(0);
    await conclude(page, study);
    await page.getByText("Add my explanation", { exact: false }).click();
    await page.getByLabel("My explanation", { exact: true }).fill(explanation);
    await page
      .getByRole("group", { name: "Your confidence now", exact: true })
      .getByRole("radio", { name: "Tentative", exact: true })
      .check();
    await expect(
      page.getByText("Your writing is not AI assessed.", { exact: true }),
    ).toBeVisible();
    await tryIt(page, study);
    const recap = page.getByRole("region", {
      name: "Paper recap",
      exact: true,
    });
    for (const value of [study.question, ...Object.values(study.overview)])
      await expect(recap).toContainText(value);
    await page.getByText("My answers & notes", { exact: true }).click();
    const personal = page.getByRole("region", {
      name: "My answers and notes",
      exact: true,
    });
    for (const text of [
      study.claims[2]!.text,
      study.claims[1]!.text,
      initialWriting,
      explanation,
      "Very sure",
      "Tentative",
    ])
      await expect(personal).toContainText(text);
    await page
      .getByLabel("A note for my future self", { exact: true })
      .fill("Keep the measured outcome and limits attached.");
    await page.getByText("Full study recap & source", { exact: true }).click();
    await expect(recap).toContainText(study.findings);
    if (study.paper.url)
      await expect(
        page.getByRole("link", { name: /Open the original paper/ }),
      ).toHaveAttribute("href", study.paper.url);
    else {
      await expect(recap).toContainText("No original publication exists.");
      await expect(
        page.getByRole("link", { name: /Open the original paper/ }),
      ).toHaveCount(0);
    }
    const event = page.waitForEvent("download");
    await page
      .getByRole("button", { name: "Download my notes", exact: true })
      .click();
    const download = await event;
    expect(download.suggestedFilename()).toBe(`gradly-${study.id}-notes.txt`);
    const path = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(path);
    const notes = await readFile(path, "utf8");
    for (const text of [
      study.question,
      study.design,
      study.findings,
      study.limitations[0]!,
      initialWriting,
      explanation,
      "MY INITIAL EXPLANATION (not AI assessed)",
      "AUTHORED TRANSFER GUIDANCE",
      "Keep the measured outcome and limits attached.",
    ])
      expect(notes).toContain(text);
    expect(notes).toContain(
      study.provenance === "reference-paper"
        ? "Authored exploration of a published paper"
        : "Fictional learning study — not a published finding",
    );
  });
}

test("one-card navigation reads every note without requiring saved notes and resumes at the next unread note", async ({
  page,
}) => {
  await begin(page);
  await expect(
    page.getByRole("button", { name: "Step 3: Choose", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next note", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("article", { name: "Current study note" }),
  ).toContainText(referenceCase.evidence[2]!.summary);
  await page
    .getByRole("button", {
      name: `Read note 5: ${referenceCase.evidence[4]!.label}`,
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Read remaining notes", exact: true })
    .click();
  await expect(
    page.getByRole("article", { name: "Current study note" }),
  ).toContainText(referenceCase.evidence[3]!.summary);
  await page.getByRole("button", { name: "Next note", exact: true }).click();
  await page
    .getByRole("button", { name: "Choose a conclusion", exact: true })
    .click();
  await stage(page, "claim");
  const notebook = await page.evaluate(
    (key) => JSON.parse(sessionStorage.getItem(key)!),
    notebookKey,
  );
  expect(notebook.cases[referenceCase.id].pinned).toEqual([]);
  await conclude(page);
  await tryIt(page);
});

test("checked feedback resets when an answer changes, with no invented assessment of personal writing", async ({
  page,
}) => {
  await begin(page);
  await readAll(page);
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Look more closely.", exact: true }),
  ).toBeFocused();
  await page.getByText("Add my explanation", { exact: false }).click();
  await page
    .getByLabel("My explanation", { exact: true })
    .fill("This is arbitrary writing, not assessed by an AI.");
  await expect(
    page.getByRole("heading", { name: "Look more closely.", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Your conclusion", exact: true })
    .getByRole("radio", { name: referenceCase.claims[1]!.text, exact: true })
    .check();
  await expect(
    page.getByRole("heading", { name: "Look more closely.", exact: true }),
  ).toHaveCount(0);
  await conclude(page);
  await page.reload();
  await stage(page, "claim");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const option = referenceCase.transfer.options[0]!;
  await page.getByRole("radio", { name: option.text, exact: true }).check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(
    page.getByText("Look at what changed.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("radio", {
      name: referenceCase.transfer.options[1]!.text,
      exact: true,
    })
    .check();
  await expect(
    page.getByText("Look at what changed.", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "See recap", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Check answer", exact: true }),
  ).toBeVisible();
});

test("optional saved-note checks distinguish positive evidence from limits and counterexamples", async ({
  page,
}) => {
  await begin(page, garden);
  await readAll(page, garden);
  await conclude(page, garden);
  await page.getByText("Review study notes", { exact: true }).click();
  for (const id of ["garden-boundary", "garden-quiet"])
    await page
      .getByRole("checkbox", {
        name: new RegExp(garden.evidence.find((item) => item.id === id)!.label),
      })
      .check();
  await page.getByText("Check my saved notes", { exact: true }).click();
  await expect(
    page.getByText("A bounded claim still needs supporting evidence", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("checkbox", { name: /Recognition can matter/ }).check();
  await expect(
    page.getByText("Your selected claim and evidence connect", { exact: true }),
  ).toBeVisible();
});

test("step navigation keeps the original answer frozen and preserves drafts across studies and reset", async ({
  page,
}) => {
  await begin(page, referenceCase, true);
  await page
    .getByRole("button", { name: "Step 1: Start", exact: true })
    .click();
  await expect(
    page.getByRole("radio", {
      name: referenceCase.claims[2]!.text,
      exact: true,
    }),
  ).toBeDisabled();
  await page.getByText("Add a starting note", { exact: false }).click();
  await expect(
    page.getByLabel("Why do you think so?", { exact: true }),
  ).toHaveValue(initialWriting);
  await expect(
    page.getByLabel("Why do you think so?", { exact: true }),
  ).toHaveAttribute("readonly", "");
  await page.getByRole("button", { name: "Step 2: Read", exact: true }).click();
  // Returning to the reading step resumes at the first unread note.
  await page
    .getByRole("button", {
      name: `Read note 1: ${referenceCase.evidence[0]!.label}`,
      exact: true,
    })
    .click();
  await readAll(page);
  await conclude(page);
  await page.getByText("Add my explanation", { exact: false }).click();
  await page.getByLabel("My explanation", { exact: true }).fill(explanation);
  await page.goto(route(garden));
  await page
    .getByRole("radio", { name: garden.claims[1]!.text, exact: true })
    .check();
  await page.goto(route(referenceCase));
  await stage(page, "claim");
  await page.getByText("Add my explanation", { exact: false }).click();
  await expect(page.getByLabel("My explanation", { exact: true })).toHaveValue(
    explanation,
  );
  await tryIt(page);
  await page.getByRole("button", { name: "Start again", exact: true }).click();
  const confirmation = page.getByRole("group", {
    name: "Restart this study",
    exact: true,
  });
  await confirmation
    .getByRole("button", { name: "Keep my notes", exact: true })
    .click();
  await stage(page, "complete");
  await page.getByRole("button", { name: "Start again", exact: true }).click();
  await confirmation
    .getByRole("button", { name: "Start fresh", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start exploring", exact: true }),
  ).toBeDisabled();
  await page.goto(route(garden));
  await expect(
    page.getByRole("radio", { name: garden.claims[1]!.text, exact: true }),
  ).toBeChecked();
});

test("a blocked export exposes a copy without losing personal writing", async ({
  page,
}) => {
  await begin(page, garden, true);
  await readAll(page, garden);
  await conclude(page, garden);
  await tryIt(page, garden);
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page
    .getByRole("button", { name: "Download my notes", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "The notes file could not be prepared",
  );
  await expect(
    page.getByLabel("Your paper notes", { exact: true }),
  ).toHaveValue(/Fictional learning study — not a published finding/);
  await expect(
    page.getByLabel("Your paper notes", { exact: true }),
  ).toHaveValue(new RegExp(initialWriting.replace(/\./g, "\\.")));
  await expect(
    page.getByText("Your notes file was prepared.", { exact: true }),
  ).toHaveCount(0);
});

test("denied storage leaves navigation and the complete frontend trail working", async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"] as const)
      Storage.prototype[method] = () => {
        throw new DOMException("Denied", "SecurityError");
      };
  });
  await begin(page, garden);
  await readAll(page, garden);
  await conclude(page, garden);
  await expect(
    page.getByText(
      "Tab storage is unavailable. Keep this page open to retain your notes.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.goto(route(garden));
  await stage(page, "claim");
  await tryIt(page, garden);
});

for (const [name, value] of [
  ["malformed JSON", "{broken"],
  [
    "invalid completed work",
    JSON.stringify({
      version: 1,
      cases: {
        "texting-lecture": {
          phase: "complete",
          initialClaim: "overreach",
          initialConfidence: 3,
          claim: "bounded",
          confidence: 1,
          opened: [],
          pinned: ["unknown"],
          explanation: "A poisoned saved answer",
          transferChoice: "association",
          transferChecked: true,
          reflection: "",
        },
      },
    }),
  ],
] as const) {
  test(`${name} recovers to the beginning`, async ({ page }) => {
    await page.addInitScript(
      ({ key, value }) => sessionStorage.setItem(key, value),
      { key: notebookKey, value },
    );
    await page.goto(route());
    await expect(
      page.getByRole("button", { name: "Start exploring", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByText("A poisoned saved answer", { exact: true }),
    ).toHaveCount(0);
  });
}

for (const width of [1440, 768, 390]) {
  test(`the simplified trail stays concise, navigable and accessible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    async function audit(name: string) {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const words = (await page.getByRole("main").innerText())
        .trim()
        .split(/\s+/).length;
      expect(words).toBeLessThan(300);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ).toEqual([]);
      await page.getByRole("heading", { level: 1 }).focus();
      await page.screenshot({
        path: resolve(
          "..",
          "gradly-repo-preview",
          `simple-${name}-${width}.png`,
        ),
        fullPage: true,
        animations: "disabled",
      });
      const dock = page.locator(".paper-action-dock");
      if (await dock.count()) {
        const box = await dock.boundingBox();
        expect(box!.y + box!.height).toBeLessThanOrEqual(901);
      }
    }
    await page.goto(route());
    await page.getByRole("button", { name: "Help", exact: true }).click();
    await page
      .getByRole("checkbox", { name: "Reduce motion", exact: true })
      .check();
    await page.getByRole("button", { name: "Close help", exact: true }).click();
    await audit("help");
    await page.goto(route());
    await page
      .getByRole("radio", { name: referenceCase.claims[2]!.text, exact: true })
      .check();
    await audit("start");
    await page
      .getByRole("button", { name: "Start exploring", exact: true })
      .focus();
    await page.keyboard.press("Enter");
    await stage(page, "evidence");
    await audit("read");
    await readAll(page);
    await audit("choose");
    await conclude(page);
    await audit("feedback");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await stage(page, "transfer");
    await audit("try");
    await page
      .getByRole("radio", {
        name: referenceCase.transfer.options[1]!.text,
        exact: true,
      })
      .check();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page.getByRole("button", { name: "See recap", exact: true }).click();
    await audit("recap");
  });
}
