import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// One prepared challenge per scene kind, opened directly through saved progress.
// Set SCENE_SHOTS_DIR to also save screenshots for visual review.
const scenes = [
  { kind: "flow", slug: "breakfast-grades", index: 1, id: "q2", answer: ["A"] },
  {
    kind: "connections",
    slug: "breakfast-grades",
    index: 2,
    id: "q3",
    answer: ["A"],
  },
  {
    kind: "comparison",
    slug: "learning-styles",
    index: 4,
    id: "q5",
    answer: ["B"],
  },
  {
    kind: "designs",
    slug: "learning-styles",
    index: 1,
    id: "q2",
    answer: ["A"],
  },
  { kind: "timeline", slug: "sleep-school", index: 1, id: "q2", answer: ["B"] },
  {
    kind: "association",
    slug: "dog-ownership-among-seniors",
    index: 5,
    id: "c6",
    answer: ["o2"],
  },
  {
    kind: "estimate",
    slug: "learning-styles",
    index: 3,
    id: "q4",
    answer: ["B"],
  },
  {
    kind: "tests",
    slug: "remembering-doctor-appointments",
    index: 2,
    id: "c3",
    answer: ["opt1"],
  },
  {
    kind: "tests",
    slug: "stroop-task-performance",
    index: 3,
    id: "c4",
    answer: ["c2", "c3", "c4"],
  },
  {
    kind: "units",
    slug: "bus-ridership-behavior",
    index: 4,
    id: "c5",
    answer: ["opt1"],
  },
  {
    kind: "units",
    slug: "breakfast-grades",
    index: 0,
    id: "q1",
    answer: ["B"],
  },
  {
    kind: "matrix",
    slug: "vaccine-misinformation-correction",
    index: 0,
    id: "c1",
    answer: ["o1"],
  },
  {
    kind: "matrix",
    slug: "phone-use-while-driving",
    index: 0,
    id: "c1",
    answer: ["o1"],
  },
] as const;
const added = new Set(["tests", "units", "matrix", "association"]);
const shots = process.env.SCENE_SHOTS_DIR;

async function open(
  page: Page,
  scene: (typeof scenes)[number],
  solved: boolean,
) {
  await page.addInitScript(
    ({ slug, index, id, answer, solved }) => {
      localStorage.setItem(
        "gradly-study-progress:v1",
        JSON.stringify({
          [slug]: {
            phase: "challenge",
            index,
            bonus: false,
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
    { ...scene, answer: [...scene.answer], solved },
  );
  // A fresh document each time, so the seeded progress is read again.
  await page.goto("about:blank");
  await page.goto(`/#/research/studies/${scene.slug}`);
  const view = page.locator(`.study-scene.kind-${scene.kind}`);
  await expect(view).toBeVisible();
  await page.waitForFunction(() =>
    document.getAnimations().every((a) => a.playState !== "running"),
  );
  return view;
}

for (const scheme of ["light", "dark"] as const)
  for (const width of [360, 1280])
    for (const scene of scenes)
      test(`${scene.kind} scene in ${scene.slug} fits ${width}px (${scheme})`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.setViewportSize({ width, height: 900 });
        for (const solved of [false, true]) {
          const view = await open(page, scene, solved);
          const overflow = await page.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth,
          );
          expect(overflow).toBeLessThanOrEqual(0);
          if (added.has(scene.kind)) {
            const result = await new AxeBuilder({ page })
              .include(".study-scene")
              .analyze();
            expect(
              result.violations.map((v) => `${v.id}: ${v.nodes.length}`),
            ).toEqual([]);
          }
          if (shots) {
            // The fixed answer dock would cover the scene's lower edge.
            await page.addStyleTag({
              content: ".journey-dock { display: none !important; }",
            });
            await view.screenshot({
              path: `${shots}/${scene.kind}-${scene.slug}-${width}-${scheme}-${solved ? "solved" : "answering"}.png`,
            });
          }
          await page.evaluate(() => localStorage.clear());
        }
      });
