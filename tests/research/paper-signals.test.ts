import { expect, it } from "vitest";
import {
  isHeadingLine,
  spotSections,
} from "../../apps/web/src/research/paper-signals.js";

it("spots numbered, capitalised and plain research headings", () => {
  const found = spotSections([
    { text: "Abstract\nWe asked a question.\n1. Introduction\nPrior work." },
    { text: "2 METHOD\nParticipants\n56 students took part.\nResults:" },
    { text: "General Discussion\nReferences" },
  ]);
  expect([...found].sort()).toEqual(
    [
      "abstract",
      "discussion",
      "introduction",
      "method",
      "participants",
      "references",
      "results",
    ].sort(),
  );
});

it("ignores section words inside prose and finds little in a résumé", () => {
  const found = spotSections([
    {
      text: "PROFESSIONAL SUMMARY\nThe results of my work show strong methods.\nEDUCATION\nTECHNICAL SKILLS",
    },
  ]);
  expect([...found]).toEqual([]);
});

it("treats short headings as headings and sentences as prose", () => {
  expect(isHeadingLine("3.1 Results")).toBe(true);
  expect(isHeadingLine("EDUCATION")).toBe(true);
  expect(
    isHeadingLine("Results suggest that texting lowered quiz scores."),
  ).toBe(false);
});
