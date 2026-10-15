import { describe, expect, it } from "vitest";
import {
  boardReady,
  caseNotes,
  emptyNotebook,
  evidenceReview,
  freshCase,
  readNotebook,
  type CaseDraft,
} from "../../apps/web/src/research/case-state.js";
import { referenceCase } from "../../apps/web/src/research/reference-case.js";
import { practiceCases } from "../../apps/web/src/research/research-cases.js";
import type { ResearchCase } from "../../apps/web/src/research/case-types.js";

const studies = [referenceCase, ...practiceCases];
const qualitative = practiceCases[0]!;

function prepared(study: ResearchCase): CaseDraft {
  return {
    ...freshCase(),
    phase: "complete",
    initialClaim: study.claims[0]!.id,
    initialExplanation:
      "Before seeing the findings, I was unsure what the study could establish.",
    initialConfidence: 3,
    opened: study.evidence.map((item) => item.id),
    pinned: [study.usefulEvidenceIds[0]!, study.competingEvidenceId],
    claim: study.supportedClaimId,
    explanation: "I changed the reach of my claim after inspecting its limits.",
    confidence: 2,
    transferChoice: study.transfer.supportedOptionId,
    transferChecked: true,
    reflection:
      "A useful account must preserve the evidence that complicates it.",
  };
}

function serialized(study: ResearchCase, draft: unknown) {
  return JSON.stringify({ version: 1, cases: { [study.id]: draft } });
}

describe("case notebook persistence", () => {
  it("keeps reference and qualitative work separate and restores a complete notebook", () => {
    const notebook = {
      version: 1,
      cases: Object.fromEntries(
        studies.map((study) => [study.id, prepared(study)]),
      ),
    };
    expect(readNotebook(JSON.stringify(notebook), studies)).toEqual(notebook);
    expect(qualitative.provenance).toBe("fictional-study");
    expect(referenceCase.provenance).toBe("reference-paper");
  });

  it("keeps a pre-findings explanation across refreshes without mixing it with the revision", () => {
    const draft = prepared(referenceCase);
    const restored = readNotebook(serialized(referenceCase, draft), studies)
      .cases[referenceCase.id]!;
    expect(restored.initialExplanation).toBe(draft.initialExplanation);
    expect(restored.initialExplanation).not.toBe(restored.explanation);
    const atLimit = { ...draft, initialExplanation: "x".repeat(1500) };
    expect(
      readNotebook(serialized(referenceCase, atLimit), studies).cases[
        referenceCase.id
      ]?.initialExplanation,
    ).toHaveLength(1500);
  });

  it("restores older version-one notebooks that lack an initial explanation", () => {
    const draft = prepared(referenceCase);
    const { initialExplanation: _initialExplanation, ...legacy } = draft;
    expect(
      readNotebook(serialized(referenceCase, legacy), studies).cases[
        referenceCase.id
      ],
    ).toEqual({ ...draft, initialExplanation: "" });
  });

  it.each([
    null,
    "{malformed",
    "null",
    "[]",
    '{"version":2,"cases":{}}',
    '{"version":1,"cases":[]}',
  ])("starts fresh for an incompatible or corrupt notebook: %s", (input) =>
    expect(readNotebook(input, studies)).toEqual(emptyNotebook()),
  );

  it("ignores unknown casefiles and persisted verdicts instead of trusting them", () => {
    const draft = prepared(referenceCase);
    const restored = readNotebook(
      JSON.stringify({
        version: 1,
        cases: {
          [referenceCase.id]: {
            ...draft,
            assessment: "AI verified",
            score: 100,
          },
          "not-a-casefile": draft,
        },
      }),
      studies,
    );
    expect(restored.cases).toEqual({ [referenceCase.id]: draft });
  });

  it("rejects damaged reference work without discarding a valid qualitative case", () => {
    const restored = readNotebook(
      JSON.stringify({
        version: 1,
        cases: {
          [referenceCase.id]: {
            ...prepared(referenceCase),
            claim: qualitative.supportedClaimId,
          },
          [qualitative.id]: prepared(qualitative),
        },
      }),
      studies,
    );
    expect(restored.cases).toEqual({ [qualitative.id]: prepared(qualitative) });
  });

  it.each([
    { phase: "future-stage" },
    { initialConfidence: 0 },
    { initialExplanation: null },
    { initialExplanation: 12 },
    { initialExplanation: "x".repeat(1501) },
    { confidence: 4 },
    { confidence: "2" },
    { opened: ["invented-evidence"] },
    { pinned: ["invented-evidence", "scope"] },
    { pinned: ["scope", "scope"] },
    { explanation: "x".repeat(3001) },
    { reflection: "x".repeat(1501) },
    { transferChoice: "unknown-transfer" },
    { transferChecked: "true" },
  ])(
    "rejects invalid fields without attaching an assessment: %o",
    (changes) => {
      expect(
        readNotebook(
          serialized(referenceCase, { ...prepared(referenceCase), ...changes }),
          studies,
        ),
      ).toEqual(emptyNotebook());
    },
  );

  it("does not restore a pinned card that the learner never opened", () => {
    const draft = prepared(referenceCase);
    draft.opened = draft.opened.filter(
      (id) => id !== referenceCase.competingEvidenceId,
    );
    expect(readNotebook(serialized(referenceCase, draft), studies)).toEqual(
      emptyNotebook(),
    );
  });

  it("requires an initial claim before later stages and evidence before a revised claim", () => {
    const draft = prepared(referenceCase);
    expect(
      readNotebook(
        serialized(referenceCase, { ...draft, initialClaim: "" }),
        studies,
      ),
    ).toEqual(emptyNotebook());
    expect(
      readNotebook(
        serialized(referenceCase, {
          ...draft,
          phase: "claim",
          opened: [],
          pinned: [],
        }),
        studies,
      ),
    ).toEqual(emptyNotebook());
    expect(
      readNotebook(
        serialized(referenceCase, { ...draft, phase: "transfer", claim: "" }),
        studies,
      ),
    ).toEqual(emptyNotebook());
  });

  it("does not mark a case complete before a transfer choice has been checked", () => {
    const draft = prepared(qualitative);
    expect(
      readNotebook(
        serialized(qualitative, { ...draft, transferChecked: false }),
        studies,
      ),
    ).toEqual(emptyNotebook());
    expect(
      readNotebook(
        serialized(qualitative, { ...draft, transferChoice: "" }),
        studies,
      ),
    ).toEqual(emptyNotebook());
  });
});

describe.each(studies)("evidence and claims: $title", (study) => {
  it("asks the learner to inspect design, findings and limits before leaving the board", () => {
    const draft = prepared(study);
    expect(boardReady(study, draft)).toBe(true);
    expect(boardReady(study, { ...draft, pinned: [draft.pinned[0]!] })).toBe(
      false,
    );
    for (const kind of ["design", "finding", "limitation"]) {
      const opened = study.evidence
        .filter((item) => item.kind !== kind)
        .map((item) => item.id);
      expect(boardReady(study, { ...draft, opened })).toBe(false);
    }
  });

  it("separates a supported claim, useful support and the evidence that bounds it", () => {
    const draft = prepared(study);
    const complete = evidenceReview(study, draft);
    expect(complete).toMatchObject({
      supported: true,
      boundary: true,
      ready: true,
    });
    expect(complete.relevant).toContain(study.usefulEvidenceIds[0]);

    const overreach = evidenceReview(study, {
      ...draft,
      claim: study.claims.at(-1)!.id,
    });
    expect(overreach).toMatchObject({
      supported: false,
      boundary: true,
      ready: false,
    });
    const unsupported = evidenceReview(study, { ...draft, pinned: [] });
    expect(unsupported).toMatchObject({
      supported: true,
      relevant: [],
      ready: false,
    });
    const unbounded = evidenceReview(study, {
      ...draft,
      pinned: [study.usefulEvidenceIds[0]!],
    });
    expect(unbounded).toMatchObject({
      supported: true,
      boundary: false,
      ready: false,
    });
  });

  it("does not turn a structured evidence match into an assessment of writing", () => {
    const draft = prepared(study);
    const custom = {
      ...draft,
      explanation:
        "This deliberately unsupported explanation has not been assessed.",
    };
    expect(evidenceReview(study, custom)).toEqual(evidenceReview(study, draft));
    expect(evidenceReview(study, custom)).not.toHaveProperty(
      "reasoningAssessment",
    );
    expect(caseNotes(study, custom)).toContain(
      "MY EXPLANATION (not AI assessed)",
    );
  });

  it("exports the learner’s initial and revised claims with evidence provenance and limits", () => {
    const draft = prepared(study);
    const notes = caseNotes(study, draft);
    expect(notes).toContain(study.claims[0]!.text);
    expect(notes).toContain("MY INITIAL EXPLANATION (not AI assessed)");
    expect(notes).toContain(draft.initialExplanation);
    expect(notes).toContain(
      study.claims.find((option) => option.id === draft.claim)!.text,
    );
    expect(notes).toContain(draft.reflection);
    expect(notes).toContain(study.limitations[0]);
    expect(notes).toContain(study.paper.title);
    for (const id of draft.pinned) {
      const evidence = study.evidence.find((item) => item.id === id)!;
      expect(notes).toContain(
        `${evidence.label}: ${evidence.text} (${evidence.sourceLabel})`,
      );
    }
    expect(notes).toContain(
      study.provenance === "reference-paper"
        ? "Authored exploration of a published paper"
        : "Fictional learning study — not a published finding",
    );
  });
});

it("a new draft and notebook do not share mutable state", () => {
  const first = freshCase();
  first.pinned.push("example");
  expect(freshCase().pinned).toEqual([]);
  expect(freshCase().initialExplanation).toBe("");
  const notebook = emptyNotebook();
  notebook.cases[referenceCase.id] = first;
  expect(emptyNotebook().cases).toEqual({});
});

it("exports an explicit empty initial-explanation entry without claiming an assessment", () => {
  const notes = caseNotes(referenceCase, freshCase());
  expect(notes).toContain(
    "MY INITIAL EXPLANATION (not AI assessed)\nNo initial explanation added.",
  );
});
