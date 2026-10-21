import { expect, it } from "vitest";
import { extractPdf } from "../../apps/api/src/research/pdf.js";
import {
  linkNoteLabel,
  linkNoteName,
  linkNotePdf,
  linkNotesAllowed,
} from "../../apps/web/src/research/link-note.js";

it("names a link note after the link's host", () => {
  expect(linkNoteName("https://www.nature.com/articles/x")).toBe(
    "Paper link - www.nature.com.pdf",
  );
  expect(linkNoteName("10.1177/0098628313514177")).toMatch(/^Paper link - /);
});

it("produces a PDF the server reads, saying plainly the link was not fetched", async () => {
  const pages = await extractPdf(linkNotePdf("https://example.org/paper (v2)"));
  expect(pages).toHaveLength(1);
  const text = pages[0]!.text;
  expect(text).toContain("example.org/paper");
  expect(text).toMatch(/noted but not fetched/);
  expect(text).toMatch(/authored study/);
});

it("reads the link label back from a saved link-note name only", () => {
  expect(linkNoteLabel(linkNoteName("https://example.org/x"))).toBe(
    "example.org",
  );
  expect(linkNoteLabel("Attention study.pdf")).toBeNull();
});

it("never turns a link into a document when live AI would process it", () => {
  expect(linkNotesAllowed({ liveAI: false, demoAvailable: true })).toBe(true);
  expect(linkNotesAllowed({ liveAI: true, demoAvailable: true })).toBe(false);
  expect(linkNotesAllowed({ liveAI: false, demoAvailable: false })).toBe(false);
  expect(linkNotesAllowed(null)).toBe(false);
});
