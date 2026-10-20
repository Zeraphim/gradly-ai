import { expect, it } from "vitest";
import { extractPdf } from "../../apps/api/src/research/pdf.js";
import {
  linkNoteName,
  linkNotePdf,
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
