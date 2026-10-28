import { expect, type Page } from "@playwright/test";

// Saved-session compatibility tests open the retained server challenge player
// through its learning API. Public sample actions use the prepared-study library;
// these helpers do not represent that new browser-only entry flow.
export async function openAdventureBriefing(page: Page, lessonId?: string) {
  if (!lessonId) {
    await page.goto("/#/research/learn");
    await expect(
      page.getByRole("heading", { name: "Pick a study. Make the calls." }),
    ).toBeVisible();
  }
  const id = await page.evaluate(async (lessonId) => {
    const response = await fetch("/api/research/learning", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        ...(lessonId ? { lessonId } : {}),
      }),
    });
    if (!response.ok) throw new Error(`start failed: ${response.status}`);
    return ((await response.json()) as { id: string }).id;
  }, lessonId);
  await page.goto(`/#/research/adventure/${id}`);
  await expect(
    page.getByRole("heading", { name: "Your investigation briefing" }),
  ).toBeVisible();
  return id;
}

// First verify a ready demo hands off to the prepared sample. Then explicitly
// open that job's saved server lesson for compatibility assertions.
export async function continueSampleToPlayer(page: Page) {
  const jobId = new URL(page.url()).hash.split("/").pop()!;
  await page.getByRole("link", { name: "Start the quest" }).click();
  await expect(page).toHaveURL(/#\/research\/studies\/texting-lecture$/);
  await openAdventureBriefing(page, jobId);
  await page.getByRole("button", { name: "Start quest" }).click();
}
