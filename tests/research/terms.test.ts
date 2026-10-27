import { describe, expect, it } from "vitest";
import {
  MAX_DEFINITION_LENGTH,
  MAX_TERMS,
  termIn,
  termProblems,
  validTerms,
  visibleTerms,
  type Term,
} from "@paperquest/contracts";
import {
  draftTerms,
  newJob,
  READY_STAGE,
  reviewLesson,
  runStage,
  STAGES,
  termsSummary,
  upgradeJob,
} from "../../apps/api/src/research/pipeline.js";
import { featured } from "../../apps/api/src/research/featured.js";
import {
  verifyLesson,
  type Challenge,
  type Job,
  type Lesson,
} from "../../apps/api/src/research/contracts.js";
import {
  newSession,
  publicSession,
  submit,
  transition,
} from "../../apps/api/src/research/engine.js";
import type { ModelProvider } from "../../apps/api/src/research/provider.js";

// q2 asks which design was used; its accepted answer names the design.
const q2 = (): Challenge => structuredClone(featured.challenges[1]!);
const evidenceIds = featured.evidence.map((r) => r.id);
const assignment: Term = {
  term: "randomly assigned",
  definition:
    "Here, chance alone decided whether each student texted during the lecture or kept their phone away.",
  refs: ["method"],
  source: "paper",
};
const participants: Term = {
  term: "participant",
  definition:
    "A student volunteer who watched the recorded lecture and took the quiz in this study.",
  refs: [],
  source: "model",
};

describe("term checks", () => {
  it("matches whole words regardless of case", () => {
    expect(termIn("Random assignment", "Uses random  ASSIGNMENT here")).toBe(
      true,
    );
    expect(termIn("ANOVA", "One-way between-groups ANOVA.")).toBe(true);
    expect(termIn("test", "a t-test")).toBe(true);
    expect(termIn("test", "the attestation")).toBe(false);
  });

  it("accepts valid paper and model terms", () => {
    expect(
      termProblems({ ...q2(), terms: [assignment, participants] }, evidenceIds),
    ).toEqual([]);
  });

  it(`caps terms at ${MAX_TERMS} and definitions at ${MAX_DEFINITION_LENGTH} characters`, () => {
    const many = Array.from({ length: MAX_TERMS + 1 }, () => participants);
    expect(termProblems({ ...q2(), terms: many }, evidenceIds)[0]).toMatch(
      /at most 4/,
    );
    const long = {
      ...participants,
      definition: "x".repeat(MAX_DEFINITION_LENGTH + 1),
    };
    expect(termProblems({ ...q2(), terms: [long] }, evidenceIds)).toHaveLength(
      1,
    );
  });

  it("requires the term to appear in the challenge text", () => {
    const absent = { ...participants, term: "placebo" };
    expect(termProblems({ ...q2(), terms: [absent] }, evidenceIds)).toEqual([
      'q2: term "placebo" is not in the challenge text.',
    ]);
  });

  it("requires paper terms to cite their challenge's evidence and model terms to cite none", () => {
    const check = (t: Term) =>
      termProblems({ ...q2(), terms: [t] }, evidenceIds);
    expect(check({ ...assignment, refs: [] })).toEqual([
      'q2: paper term "randomly assigned" needs an evidence ref.',
    ]);
    expect(check({ ...assignment, refs: ["invented"] })).toEqual([
      'q2: term "randomly assigned" cites unknown evidence.',
    ]);
    expect(check({ ...assignment, refs: ["exp1"] })).toEqual([
      'q2: term "randomly assigned" cites evidence its challenge does not cite.',
    ]);
    expect(check({ ...participants, refs: ["method"] })).toEqual([
      'q2: model term "participant" must not cite evidence.',
    ]);
  });

  it("rejects duplicate terms", () => {
    expect(
      termProblems(
        {
          ...q2(),
          terms: [participants, { ...participants, term: "Participant" }],
        },
        evidenceIds,
      ),
    ).toEqual(['q2: duplicate term "Participant".']);
  });

  it("rejects a design-stage term that cites results-side evidence", () => {
    const leaky = { ...assignment, refs: ["findings_1"] };
    const cited = { ...q2(), refs: ["method", "findings_1"] };
    expect(
      termProblems({ ...cited, terms: [leaky] }, [
        ...evidenceIds,
        "findings_1",
      ]),
    ).toEqual([
      'q2: design-stage term "randomly assigned" cites results-side evidence.',
    ]);
    // The same citation is allowed once the challenge is past the design stage.
    expect(
      termProblems({ ...cited, reveal: "results", terms: [leaky] }, [
        ...evidenceIds,
        "findings_1",
      ]),
    ).toEqual([]);
  });

  it("rejects a definition that quotes an accepted option", () => {
    const giveaway = {
      ...assignment,
      definition:
        "It makes this a between-participants experiment with separate texting and no-texting groups.",
    };
    expect(termProblems({ ...q2(), terms: [giveaway] }, evidenceIds)).toEqual([
      'q2: term "randomly assigned" definition quotes an accepted answer.',
    ]);
  });

  it("keeps the valid terms when one fails", () => {
    const absent = { ...participants, term: "placebo" };
    expect(
      validTerms(
        { ...q2(), terms: [absent, assignment, participants] },
        evidenceIds,
      ),
    ).toEqual([assignment, participants]);
  });

  it("flags invalid terms in the deterministic validator", () => {
    const lesson = structuredClone(featured);
    lesson.challenges[1]!.terms = [{ ...participants, refs: ["method"] }];
    const pages = [...new Set(lesson.evidence.map((r) => r.page))].map(
      (page) => ({
        page,
        text:
          lesson.evidence
            .filter((r) => r.page === page)
            .map((r) => r.excerpt)
            .join("\n") + `\n${lesson.paper.url}`,
      }),
    );
    expect(verifyLesson(lesson, pages)).toContain(
      'q2: model term "participant" must not cite evidence.',
    );
  });
});

describe("reveal gating", () => {
  const explanationOnly: Term = {
    term: "between-participants experiment",
    definition:
      "In this study, each student was in only one condition, so the groups were different people.",
    refs: ["method"],
    source: "paper",
  };

  it("withholds terms found only in the explanation until it is shown", () => {
    const c = {
      ...q2(),
      explanation:
        "Random assignment makes this a between-participants experiment.",
      options: q2().options.map((o) => ({ ...o, text: "An option" })),
      terms: [assignment, explanationOnly],
    };
    expect(visibleTerms(c, false).map((t) => t.term)).toEqual([
      "randomly assigned",
    ]);
    expect(visibleTerms(c, true).map((t) => t.term)).toEqual([
      "randomly assigned",
      "between-participants experiment",
    ]);
  });

  it("serves explanation-only terms under the explanation's gate", () => {
    const lesson: Lesson = structuredClone(featured);
    const c = lesson.challenges[0]!;
    // q1's explanation mentions GPA; its prompt and options do too, so use a
    // term that appears only in the explanation.
    const studyHabits: Term = {
      term: "semester study habits",
      definition:
        "How much students studied across the whole term, which this lecture study did not record.",
      refs: [],
      source: "model",
    };
    c.terms = [studyHabits];
    let s = transition(newSession(lesson, "gate"), lesson, "begin");
    expect(publicSession(s, lesson).challenge?.terms).toEqual([]);
    s = submit(s, lesson, c.accepted, "");
    expect(publicSession(s, lesson).challenge?.terms).toEqual([studyHabits]);
  });
});

describe("terms stage", () => {
  const page = featured.evidence.map((r) => r.excerpt).join("\n");
  function provider(outputs: unknown[]): ModelProvider & { roles: string[] } {
    const roles: string[] = [];
    return {
      roles,
      async generate<T>(role: string) {
        roles.push(role);
        const next = outputs.shift();
        if (next instanceof Error) throw next;
        return next as T;
      },
    };
  }

  it("runs between lesson generation and the reviewers", () => {
    expect(STAGES).toEqual({
      evidence: 0,
      lesson: 1,
      terms: 2,
      methods: 3,
      coach: 4,
      verify: 5,
    });
    expect(READY_STAGE).toBe(6);
    expect(newJob("j", "p.pdf", []).audits.map((a) => a.role)).toEqual([
      "Research Evidence Analyst",
      "Lesson Architect",
      "Terms Guide",
      "Research Methods Reviewer",
      "Learning Coach",
      "Evidence Verification",
    ]);
  });

  it("keeps checked terms, drops failing ones and reports both", async () => {
    const p = provider([
      {
        challenges: [
          {
            id: "q2",
            terms: [assignment, { ...participants, term: "placebo" }],
          },
        ],
      },
      { flagged: [] },
    ]);
    const result = await draftTerms(featured, p, "model");
    expect(p.roles).toEqual(["Terms Guide", "Answer Leak Check"]);
    expect(result.lesson.challenges[1]!.terms).toEqual([assignment]);
    expect(result.lesson.challenges[0]!.terms).toBeUndefined();
    expect(result).toMatchObject({
      defined: 1,
      challenges: 1,
      removed: 1,
      leaks: 0,
    });
    // The input lesson is not changed.
    expect(featured.challenges[1]!.terms).toBeUndefined();
  });

  it("removes definitions the leak check flags", async () => {
    const p = provider([
      { challenges: [{ id: "q2", terms: [assignment, participants] }] },
      {
        flagged: [{ id: "q2#1", reason: "Implies option B." }],
      },
    ]);
    const result = await draftTerms(featured, p, "model");
    expect(result.lesson.challenges[1]!.terms).toEqual([participants]);
    expect(result).toMatchObject({ defined: 1, removed: 1, leaks: 1 });
    expect(termsSummary(result)).toBe(
      "Defined 1 term across 1 challenge. Removed 1 that failed checks, 1 for giving an answer away.",
    );
  });

  it("does not ask the leak check about explanation-only terms", async () => {
    const lesson = structuredClone(featured);
    const studyHabits: Term = {
      term: "semester study habits",
      definition:
        "How much students studied across the whole term, which this lecture study did not record.",
      refs: [],
      source: "model",
    };
    const p = provider([{ challenges: [{ id: "q1", terms: [studyHabits] }] }]);
    const result = await draftTerms(lesson, p, "model");
    expect(p.roles).toEqual(["Terms Guide"]);
    expect(result.lesson.challenges[0]!.terms).toEqual([studyHabits]);
  });

  it("matches terms written with typographic dashes", () => {
    expect(
      termIn("between\u2011participants", "a between-participants design"),
    ).toBe(true);
    expect(termIn("participant’s", "each participant's score")).toBe(true);
  });

  it("continues without terms when the terms call fails", async () => {
    const j: Job = {
      ...newJob("j", "p.pdf", [{ page: 1, text: page }]),
      stage: STAGES.terms,
      lesson: structuredClone(featured),
    };
    const next = await runStage(j, provider([Error("Provider unavailable.")]));
    expect(next.stage).toBe(STAGES.methods);
    expect(next.status).toBe("pending");
    expect(next.audits[STAGES.terms]!.summary).toBe(
      "Term definitions unavailable, so the lesson continued without them. Provider unavailable.",
    );
  });

  it("removes term definitions a reviewer rejects", async () => {
    const lesson = structuredClone(featured);
    lesson.challenges[1]!.terms = [assignment, participants];
    const review = await reviewLesson(
      "methods",
      lesson,
      [{ page: 1, text: page }],
      provider([
        {
          approved: false,
          issues: ["A definition leaks the design answer."],
          summary: "Needs changes",
          rejectedTerms: [
            {
              challenge: "q2",
              term: "Randomly assigned",
              reason: "Leaks the answer.",
            },
          ],
        },
      ]),
      "model",
    );
    expect(review.lesson.challenges[1]!.terms).toEqual([participants]);
    expect(review.removed).toBe(1);
  });

  it("upgrades a five-stage job saved before the terms stage", () => {
    const legacy = newJob("old", "p.pdf", []);
    legacy.audits.splice(STAGES.terms, 1);
    legacy.stage = 2; // was the Methods Reviewer
    const upgraded = upgradeJob(legacy);
    expect(upgraded.stage).toBe(STAGES.methods);
    expect(upgraded.audits).toHaveLength(READY_STAGE);
    expect(upgraded.audits[STAGES.terms]).toMatchObject({
      role: "Terms Guide",
      status: "Completed",
    });
    const early = newJob("early", "p.pdf", []);
    early.audits.splice(STAGES.terms, 1);
    early.stage = 1;
    expect(upgradeJob(early)).toMatchObject({ stage: 1 });
    expect(upgradeJob(early).audits[STAGES.terms]!.status).toBe("Pending");
    const current = newJob("now", "p.pdf", []);
    expect(upgradeJob(current)).toBe(current);
  });
});
