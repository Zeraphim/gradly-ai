// @vitest-environment jsdom
import { createElement as h, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  numbersIn,
  projectScene,
  responseStyles,
  sceneProblems,
  sceneSchema,
  tapTargets,
  type Scene,
  type SceneOf,
} from "@paperquest/contracts";
import {
  responseStyleProblems,
  SCENE_COVERAGE,
  sceneCoverage,
  sceneCoverageProblems,
  verifyLesson,
  type Lesson,
} from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  transition,
} from "../../apps/api/src/research/engine.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  loadStudy,
  studies as cards,
} from "../../apps/web/src/research/studies/catalog.js";
import { toStudyChallenge } from "../../apps/web/src/research/studies/uploaded.js";
import { StudySceneView } from "../../apps/web/src/research/studies/scenes/StudySceneView.js";
import { rowVerdict } from "../../apps/web/src/research/studies/scenes/MatrixScene.js";
import type { TapProps } from "../../apps/web/src/research/studies/scenes/TapNode.js";
import { SceneMotion } from "../../apps/web/src/research/scenes/scene-motion.js";
import {
  emptySceneDraft,
  type SceneDraft,
} from "../../apps/web/src/research/scenes/InvestigationScene.js";
import {
  fieldTrialSceneLesson as trial,
  sceneFixturePages,
} from "./fixtures/scene-lessons.js";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    }),
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const studies = await Promise.all(
  cards.map(async (card) => (await loadStudy(card.slug))!),
);
const scenesOf = (kind: Scene["kind"]) =>
  studies.flatMap((study) =>
    study.lesson.challenges
      .filter((c) => c.scene?.kind === kind)
      .map((c) => ({ study, challenge: c })),
  );
const units = trial.challenges[0]!.scene as SceneOf<"units">;
const tests = trial.challenges[1]!.scene as SceneOf<"tests">;
const matrix = trial.challenges[2]!.scene as SceneOf<"matrix">;

describe("one scene library for prepared and generated lessons", () => {
  it("parses every prepared scene and response style against the shared contract", () => {
    for (const study of studies)
      for (const c of [
        ...study.lesson.challenges,
        ...(study.lesson.bonus ? [study.lesson.bonus] : []),
      ]) {
        if (c.scene)
          expect(
            sceneSchema.safeParse(c.scene).success,
            `${study.slug} ${c.id}`,
          ).toBe(true);
        if (c.responseStyle) expect(responseStyles).toContain(c.responseStyle);
      }
  });

  it.each(["timeline", "association", "estimate", "tests", "units", "matrix"])(
    "uses %s in prepared studies from at least two design groups",
    (kind) => {
      const groups = new Set(
        scenesOf(kind as Scene["kind"]).map(({ study }) => study.group),
      );
      expect(groups.size).toBeGreaterThanOrEqual(2);
    },
  );
});

describe("new and promoted scene kinds", () => {
  it("validates relationships for each kind", () => {
    const problems = (scene: Scene, options = ["bounded", "broad", "other"]) =>
      sceneProblems(scene, options, ["trial", "outcomes"]);
    expect(problems(units)).toEqual([]);
    expect(problems(tests)).toEqual([]);
    expect(problems(matrix)).toEqual([]);
    expect(
      problems({
        ...units,
        levels: units.levels.map((l) => ({ ...l, role: "analysed" as const })),
      }),
    ).toContain("units need at least two different roles to compare");
    expect(
      problems({
        ...matrix,
        rows: [{ ...matrix.rows[0]!, cells: ["Sent"] }, matrix.rows[1]!],
      }),
    ).toContain("each matrix row needs one cell per condition");
    expect(
      sceneSchema.safeParse({
        ...tests,
        tests: [{ ...tests.tests[0]!, p: 1.5 }, tests.tests[1]],
      }).success,
    ).toBe(false);
    const association = scenesOf("association")[0]!.challenge.scene!;
    if (association.kind !== "association") throw Error("association");
    expect(
      sceneProblems(
        {
          ...association,
          pairs: [{ ...association.pairs[0]!, statistic: "r", value: 1.4 }],
        },
        association.responses.map((r) => r.optionId),
        association.provenance.refs,
      ),
    ).toContain("a correlation must lie between -1 and 1");
    const estimate = scenesOf("estimate")[0]!.challenge.scene!;
    if (estimate.kind !== "estimate") throw Error("estimate");
    const moved = structuredClone(estimate);
    moved.estimates[0]!.value = moved.estimates[0]!.upper + 1;
    expect(
      sceneProblems(
        moved,
        moved.responses.map((r) => r.optionId),
        [
          ...new Set(
            [moved.provenance, ...moved.estimates.map((e) => e.provenance)]
              .concat(moved.resolution ? [moved.resolution.provenance] : [])
              .flatMap((p) => p.refs),
          ),
        ],
      ),
    ).toContain("estimate outside its interval");
  });

  it("withholds gated rows, tests, levels and resolutions until permitted", () => {
    const gated = structuredClone(matrix);
    gated.rows.push({
      ...gated.rows[1]!,
      id: "staff",
      label: "Staff",
      at: "feedback",
    });
    gated.responses[0]!.targetIds = ["staff"];
    const setup = projectScene(gated, false, false) as SceneOf<"matrix">;
    expect(setup.rows.map((r) => r.id)).toEqual([
      "message",
      "weekend",
      "outcome",
    ]);
    expect(setup.resolution).toBeNull();
    expect(setup.responses[0]!.targetIds).toEqual([]);
    const after = projectScene(gated, true, false) as SceneOf<"matrix">;
    expect(after.rows.map((r) => r.id)).toEqual([
      "message",
      "weekend",
      "outcome",
      "staff",
    ]);
    // Too few setup rows makes the scene unsafe, so it falls back to choices.
    const thin = structuredClone(gated);
    thin.rows[1]!.at = "feedback";
    thin.rows[2]!.at = "feedback";
    expect(projectScene(thin, false, false)).toBeNull();
    expect(after.resolution).toBeNull();
    expect(projectScene(gated, true, true)!.resolution?.id).toBe(
      "matrix-resolution",
    );
    const hiddenTest = structuredClone(tests);
    hiddenTest.tests[2]!.at = "resolution";
    expect(
      (projectScene(hiddenTest, true, false) as SceneOf<"tests">).tests,
    ).toHaveLength(2);
  });

  it("allows tap answers only when each option is one distinct visible element", () => {
    expect(tapTargets(units)?.size).toBe(3);
    expect(
      tapTargets({
        ...units,
        responses: units.responses.map((r) => ({
          ...r,
          targetIds: ["clinics"],
        })),
      }),
    ).toBeNull();
    const [unitChallenge, , matrixChallenge] = trial.challenges;
    expect(responseStyleProblems(unitChallenge!)).toEqual([]);
    expect(responseStyleProblems(matrixChallenge!)).toEqual([]);
    const gated = structuredClone(matrixChallenge!);
    const scene = gated.scene as SceneOf<"matrix">;
    scene.rows[1]!.at = "feedback";
    expect(responseStyleProblems(gated)[0]).toContain(
      "responseStyle tap needs",
    );
    const connections = featured.challenges.find(
      (c) => c.scene?.kind === "connections",
    )!;
    expect(
      responseStyleProblems({ ...connections, responseStyle: "tap" }),
    ).toHaveLength(1);
  });
});

describe("generated lesson verification", () => {
  const pages = sceneFixturePages(trial);
  it("requires a valid scene on at least 90% of a generated lesson's required challenges", () => {
    expect(verifyLesson(trial, pages)).toEqual([]);
    const n = trial.challenges.length;
    const needed = Math.ceil(n * SCENE_COVERAGE);
    expect(sceneCoverage(trial.challenges)).toBe(n);
    const without = (count: number): Lesson => ({
      ...structuredClone(trial),
      challenges: trial.challenges.map((c, i) =>
        i < count ? { ...c, scene: null, responseStyle: undefined } : c,
      ),
    });
    // Below ten required challenges, 90% means every one.
    expect(needed).toBe(n);
    expect(verifyLesson(without(1), pages).join(" ")).toContain(
      `The lesson has ${n - 1} valid interactive scenes for ${n} required challenges; at least ${needed} are needed.`,
    );
    const plain = without(n);
    expect(verifyLesson(plain, pages).join(" ")).toContain(
      `The lesson has 0 valid interactive scenes for ${n} required challenges`,
    );
    expect(verifyLesson({ ...plain, source: "demo" }, pages)).toEqual([]);
    // Ten required challenges allow one without a scene.
    const ten = Array.from({ length: 10 }, (_, i) => ({
      ...trial.challenges[0]!,
      id: `c${i}`,
      scene: i ? trial.challenges[0]!.scene : null,
    }));
    expect(sceneCoverageProblems({ ...trial, challenges: ten })).toEqual([]);
    expect(
      sceneCoverageProblems({
        ...trial,
        challenges: ten.map((c, i) => (i < 2 ? { ...c, scene: null } : c)),
      }),
    ).toHaveLength(1);
  });

  it("checks every reported scene number against its cited excerpts", () => {
    const l = structuredClone(trial);
    (l.challenges[0]!.scene as SceneOf<"units">).levels[1]!.count = 2500;
    (l.challenges[1]!.scene as SceneOf<"tests">).tests[0]!.p = 0.02;
    const problems = verifyLesson(l, pages).join(" ");
    expect(problems).toContain(
      "reported scene value is not in its referenced evidence (records)",
    );
    expect(problems).toContain("(attendance)");
  });

  it("reads numbers the way papers print them", () => {
    expect(numbersIn("p = .04, n = 7,007, r = −0.05, ages 10-20")).toEqual([
      0.04, 7007, -0.05, 10, 20,
    ]);
  });

  it("serves responseStyle with the public challenge and maps it for the player", () => {
    const s = transition(newSession(trial, "s"), trial, "begin");
    const challenge = publicSession(s, trial).challenge!;
    expect(challenge.responseStyle).toBe("tap");
    expect(toStudyChallenge(challenge).responseStyle).toBe("tap");
  });
});

function Harness({
  scene,
  answered = false,
  tap = null,
}: {
  scene: Scene;
  answered?: boolean;
  tap?: TapProps | null;
}) {
  const [draft, setDraft] = useState<SceneDraft>(emptySceneDraft);
  return h(
    "div",
    { className: "research-lab" },
    h(SceneMotion, {
      reduced: true,
      children: h(StudySceneView, {
        scene,
        draft,
        onDraft: setDraft,
        answered,
        disabled: false,
        tap,
      }),
    }),
  );
}

describe("scene rendering", () => {
  it("tallies tests against the threshold, reveals on request and adds the chance check after an attempt", async () => {
    const { rerender } = render(h(Harness, { scene: tests }));
    expect(screen.getByText("The p-values are covered")).toBeTruthy();
    expect(screen.queryByText("Attendance")).toBeNull();
    await userEvent.click(screen.getByRole("radio", { name: "One" }));
    await userEvent.click(
      screen.getByRole("button", { name: /Reveal the results/ }),
    );
    expect(screen.getByText("Attendance")).toBeTruthy();
    expect(screen.getByText("p = .03")).toBeTruthy();
    expect(
      screen.getByText((_, el) => el?.textContent === "1 of 3 below .05"),
    ).toBeTruthy();
    expect(screen.queryByText(/by chance/)).toBeNull();
    rerender(h(Harness, { scene: tests, answered: true }));
    expect(screen.getByText(/by chance/).textContent).toContain("0.15");
  });

  it("draws nested units with counts and a derived ratio after an attempt", () => {
    const { rerender } = render(h(Harness, { scene: units }));
    expect(screen.getByText("2,400")).toBeTruthy();
    expect(screen.getAllByText("Assigned")).toHaveLength(2);
    expect(
      screen.getByText(/Each dot stands for about 60 records/),
    ).toBeTruthy();
    expect(screen.queryByText(/per clinic/)).toBeNull();
    rerender(h(Harness, { scene: units, answered: true }));
    expect(screen.getByText(/about 600 records per clinic/)).toBeTruthy();
  });

  it("marks differing matrix rows only after an attempt, and lets rows answer by tap", async () => {
    const onToggle = vi.fn();
    const tap: TapProps = {
      targets: tapTargets(matrix)!,
      selected: [],
      multiple: false,
      disabled: false,
      marks: {},
      onToggle,
    };
    const { rerender } = render(h(Harness, { scene: matrix, tap }));
    expect(screen.queryByText("Differs")).toBeNull();
    const group = screen.getByRole("radiogroup", {
      name: "Answer by choosing a diagram step",
    });
    await userEvent.click(
      within(group).getByRole("radio", { name: /Weekend opening/ }),
    );
    expect(onToggle).toHaveBeenCalledWith("bounded");
    rerender(h(Harness, { scene: matrix, answered: true }));
    expect(screen.getAllByText("Differs")).toHaveLength(2);
    expect(rowVerdict(["Text", "Text", "Images", "Images"])).toBe("2 levels");
    expect(rowVerdict(["a", "b", "c"])).toBe("All differ");
    expect(rowVerdict(["Same", "same "])).toBe("Same");
  });
});
