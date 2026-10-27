import { describe, it, expect } from "vitest";
import {
  termMatches,
  relevantTerms,
  researchTerms,
  termExamples,
} from "../../apps/web/src/research/research-terms.js";

describe("research term lookup", () => {
  it("keeps the original text and matches complete terms, longest first", () => {
    const text =
      "Random assignment differs from random sampling; CONFOUNDING is another idea.";
    const matches = termMatches(text);
    expect(matches.map((m) => m.term)).toEqual([
      "Random assignment",
      "Random sampling",
      "Confounding",
    ]);
    for (const m of matches) expect(text.slice(m.start, m.end)).toBe(m.text);
    expect(termMatches("counterevidence transferral p-valued")).toEqual([]);
  });
  it("deduplicates repeated visible terms and treats source text as text", () => {
    expect(
      relevantTerms("Confounding. Confounding. <script>p-value</script>"),
    ).toEqual(["Confounding", "p-value"]);
    expect(relevantTerms("")).toEqual([]);
  });
  it("has an authored illustration for every reference term", () => {
    expect(Object.keys(termExamples).sort()).toEqual(
      Object.keys(researchTerms).sort(),
    );
    expect(
      Object.values(termExamples).every((example) => example.length > 20),
    ).toBe(true);
  });
});
