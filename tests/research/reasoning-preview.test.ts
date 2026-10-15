import { describe, expect, it, vi } from "vitest";
import {
  PREVIEW_FIXTURE_VERSION,
  evaluatePreview,
  initialPreviewExample,
  previewChoices,
  previewExamples,
  previewReveal,
  previewStudyContext,
  revisedPreviewExample,
} from "../../apps/web/src/research/reasoning-preview.js";

describe("authored reasoning preview", () => {
  it("separates a suitable method from an explanation that needs revision", () => {
    const initial = evaluatePreview(
      initialPreviewExample.choiceId,
      initialPreviewExample.text,
    );
    expect(initial.choice.judgment).toBe("suitable");
    expect(initial.reasoning.category).toBe("needs-revision");
    expect(initial.reasoning.issue).toContain("matched pair");
    expect(initial.reasoning.coachingQuestion).toContain("both conditions");
    expect(initial.provenance).toBe("authored-preview");
    expect(initial.fixtureVersion).toBe(PREVIEW_FIXTURE_VERSION);
  });

  it("changes the reasoning judgment after revision without changing the method", () => {
    expect(initialPreviewExample.choiceId).toBe(revisedPreviewExample.choiceId);
    expect(initialPreviewExample.revisionExampleId).toBe(
      revisedPreviewExample.id,
    );
    const revised = evaluatePreview(
      revisedPreviewExample.choiceId,
      revisedPreviewExample.text,
    );
    expect(revised.choice.judgment).toBe("suitable");
    expect(revised.reasoning.category).toBe("well-supported");
    expect(revised.reasoning.issue).toBeNull();
  });

  it.each(previewExamples)(
    "returns the explicit authored review for $id",
    (example) => {
      const result = evaluatePreview(example.choiceId, example.text);
      expect(result).toBe(example.review);
      expect(result.fixtureId).toBe(example.id);
      expect(result.reasoning.evidence.length).toBeGreaterThan(0);
      for (const evidence of result.reasoning.evidence) {
        expect(evidence.page).toBe(47);
        expect(previewStudyContext.evidence).toContainEqual(evidence);
      }
    },
  );

  it("shows a supported alternative and evidence-aware uncertainty separately", () => {
    const alternative = previewExamples.find(
      (example) => example.id === "defensible-anova",
    )!;
    const uncertainty = previewExamples.find(
      (example) => example.id === "supported-uncertainty",
    )!;
    expect(
      evaluatePreview(alternative.choiceId, alternative.text).reasoning
        .category,
    ).toBe("defensible-alternative");
    const review = evaluatePreview(uncertainty.choiceId, uncertainty.text);
    expect(review.reasoning.category).toBe("needs-evidence");
    expect(review.reasoning.claim).toContain("does not establish");
    expect(review.choice.judgment).toBe("not-selected");
  });

  it("accepts case and whitespace presentation changes without broadening matching", () => {
    const presentationOnly = ` \n${initialPreviewExample.text.toUpperCase().replaceAll(" ", "\n  ")}\t `;
    expect(
      evaluatePreview(initialPreviewExample.choiceId, presentationOnly)
        .fixtureId,
    ).toBe(initialPreviewExample.id);
  });

  it.each([
    "",
    "I think a t-test is right.",
    "The groups are independent and the outcome is numerical.",
    `${initialPreviewExample.text} I am not sure.`,
    initialPreviewExample.text.replace("is paired", "is not paired"),
    revisedPreviewExample.text.replace(
      "different students",
      "the same students",
    ),
  ])("does not infer a judgment for custom or edited writing: %s", (text) => {
    const review = evaluatePreview(initialPreviewExample.choiceId, text);
    expect(review.fixtureId).toBeNull();
    expect(review.choice.judgment).toBe("not-assessed");
    expect(review.reasoning.category).toBe("not-assessed");
    expect(review.reasoning.evidence).toEqual([]);
    expect(review.reasoning.label).toContain("has not been assessed");
  });

  it("does not apply a fixture review when the method selection changes", () => {
    for (const example of previewExamples) {
      for (const choice of previewChoices) {
        if (choice.id === example.choiceId) continue;
        const result = evaluatePreview(choice.id, example.text);
        expect(result.fixtureId).toBeNull();
        expect(result.reasoning.category).toBe("not-assessed");
      }
    }
    expect(
      evaluatePreview("unrecognized-method", initialPreviewExample.text)
        .reasoning.category,
    ).toBe("not-assessed");
  });

  it("keeps source identity and findings out of all material shown before the reveal", () => {
    const beforeReveal = JSON.stringify({
      context: previewStudyContext,
      choices: previewChoices,
      examples: previewExamples,
    });
    expect(beforeReveal).not.toMatch(
      /Gingerich|Lineweaver|OMG!|U Fail|73\.41|83\.00|4\.33|9\.59|0098628313514177/iu,
    );
    expect(previewReveal.paper.authors).toContain("Gingerich");
    expect(previewReveal.finding).toContain("73.41%");
    expect(previewReveal.page).toBe(47);
  });

  it("requires no model, network, or browser storage to evaluate an example", () => {
    const fetcher = vi.fn(() => {
      throw new Error("A preview must not make network requests");
    });
    vi.stubGlobal("fetch", fetcher);
    try {
      const result = evaluatePreview(
        initialPreviewExample.choiceId,
        initialPreviewExample.text,
      );
      expect(result.fixtureId).toBe(initialPreviewExample.id);
      expect(fetcher).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
