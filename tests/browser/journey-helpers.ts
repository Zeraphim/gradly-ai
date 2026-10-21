import { expect, type Page } from "@playwright/test";

// The library's "Start quest" opens the authored texting quest (/meet). Suites
// that cover the saved challenge player start its session through the same
// learning API the app uses, then open the briefing route.
export async function openAdventureBriefing(page: Page, lessonId?: string) {
  if (!lessonId) {
    await page.goto("/#/research/learn");
    await expect(
      page.getByRole("heading", { name: "Think like a researcher." }),
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

// A ready sample hands off to the authored quest. The sample job's own lesson
// still plays through the shared challenge player, so continue there as well.
export async function continueSampleToPlayer(page: Page) {
  const jobId = new URL(page.url()).hash.split("/").pop()!;
  await page.getByRole("link", { name: "Start the quest" }).click();
  await expect(page).toHaveURL(new RegExp(`#/research/meet/${jobId}$`));
  await openAdventureBriefing(page, jobId);
  await page.getByRole("button", { name: "Start quest" }).click();
}
