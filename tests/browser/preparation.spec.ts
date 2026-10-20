import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import type { ProcessingJob } from "../../apps/web/src/research/types.js";

const roles = [
  "Research Evidence Analyst",
  "Lesson Architect",
  "Research Methods Reviewer",
  "Learning Coach",
  "Evidence Verification",
];
function savedJob(): ProcessingJob {
  return {
    id: "preparation-fixture",
    mode: "live",
    name: "Research paper.pdf",
    consented: true,
    stage: 1,
    status: "processing",
    audits: roles.map((role, index) => ({
      role,
      task: "Review source-supported learning material.",
      status:
        index === 0 ? "Completed" : index === 1 ? "Processing" : "Pending",
      summary:
        index === 1
          ? "Mapping decisions to source evidence."
          : "Saved stage summary.",
      refs: [],
      model: "browser fixture",
    })),
    version: 1,
    leaseUntil: Date.now() + 120000,
    excerpt: "Extracted source text.",
    pageCount: 2,
    extraction: [
      { page: 1, method: "text", confidence: undefined },
      { page: 2, method: "ocr", confidence: 80 },
    ],
    evidence: [],
    ready: false,
    error: undefined,
  };
}

test("history retains a failed job and reads its persisted reason", async ({
  page,
}) => {
  const job = {
    ...savedJob(),
    status: "failed",
    error: "The source did not contain a readable methods section.",
  };
  await page.route("**/api/research/learning", (route) =>
    route.fulfill({ json: [] }),
  );
  await page.route("**/api/research/documents", (route) =>
    route.fulfill({
      json: [
        {
          id: job.id,
          name: job.name,
          status: job.status,
          pages: job.pageCount,
          mode: job.mode,
        },
      ],
    }),
  );
  await page.route("**/api/research/jobs?**", (route) =>
    route.fulfill({ json: job }),
  );
  await page.goto("/#/research/history");
  await expect(page.getByRole("heading", { name: job.name })).toBeVisible();
  await expect(page.getByText(job.error, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(job.error, { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View processing", exact: true }),
  ).toHaveAttribute("href", `#/research/processing/${job.id}`);
});

test("processing waits for saved state, stops on failure, retries and resumes without fake progress", async ({
  page,
}) => {
  let job = savedJob();
  let polls = 0;
  let retries = 0;
  await page.route("**/api/research/config", (route) =>
    route.fulfill({
      json: {
        liveAI: true,
        demoAvailable: false,
        maxUploadBytes: 4000000,
        storage: true,
        model: "browser fixture",
      },
    }),
  );
  await page.route("**/api/research/jobs**", async (route) => {
    if (route.request().method() === "POST") {
      expect(route.request().postDataJSON().retry).toBe(true);
      retries++;
      job = { ...job, status: "processing", error: undefined };
      job.audits[1]!.status = "Processing";
    } else polls++;
    await route.fulfill({ json: job });
  });
  await page.goto("/#/research/processing/preparation-fixture");
  const track = page.getByRole("region", { name: "Saved preparation stages" });
  await expect(track).toContainText("2/5 · Lesson Architect");
  await expect.poll(() => polls).toBeGreaterThanOrEqual(2);
  await expect(track).toContainText("2/5 · Lesson Architect");
  await expect(
    page.getByRole("button", { name: "Start the first challenge" }),
  ).toHaveCount(0);
  job = { ...job, status: "failed", error: "Provider connection interrupted." };
  job.audits[1]!.status = "Failed";
  await expect(track).toContainText("Stopped at Lesson Architect");
  await expect(
    page.getByRole("heading", { level: 1, name: "Preparation paused" }),
  ).toBeVisible();
  // A temporary failure offers retry first; prepared studies stay optional.
  await expect(
    page.getByRole("link", { name: "View prepared studies" }),
  ).toBeHidden();
  await expect(
    page.getByText("Provider connection interrupted.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry this stage", exact: true })
    .click();
  await expect.poll(() => retries).toBe(1);
  await expect(track).toContainText("2/5 · Lesson Architect");
  await page.reload();
  await expect(track).toContainText("2/5 · Lesson Architect");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.locator(".scene-motion-scope").filter({ has: track }).first(),
  ).toHaveAttribute("data-scene-reduced", "true");
  for (const width of [375, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  job = { ...job, stage: 5, status: "ready", ready: true };
  job.audits.forEach((audit) => {
    audit.status = "Completed";
  });
  // Live lessons keep their generated briefing, so the handoff opens it.
  await expect(
    page.getByRole("button", { name: "Open your investigation" }),
  ).toBeVisible();
});
