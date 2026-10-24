import { describe, expect, inject, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type {} from "./papers-setup.js";

// Stored source papers must match the work their entry names. The 2014 CogSci
// proceedings file was once stored under a 2016 journal citation, so this check reads
// each PDF's own text and fails when the recorded DOI or title is not inside it.
const papersDir = fileURLToPath(
  new URL("../../docs/research/papers/", import.meta.url),
);
const readme = readFileSync(join(papersDir, "README.md"), "utf8");
const pdfFiles = readdirSync(papersDir)
  .filter((file) => file.toLowerCase().endsWith(".pdf"))
  .sort();

const documented = [...readme.matchAll(/^### (.+\.pdf)\b/gm)].map(
  (match) => match[1]!,
);

function sectionFor(file: string) {
  const lines = readme.split("\n");
  const start = lines.findIndex((line) => line.startsWith(`### ${file}`));
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(
    (line) => line.startsWith("## ") || line.startsWith("### "),
  );
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

// Page text comes from tests/research/papers-setup.ts, which parses each PDF once.
const paperPages = inject("paperPages");
const ownText = (file: string) =>
  (paperPages[file] ?? []).map((page) => page.text).join("\n");

// Whitespace is dropped so line breaks, hyphenation and PDF spacing cannot hide a match.
const squash = (value: string) => value.replace(/\s+/g, "").toLowerCase();

describe("stored source papers", () => {
  it("has a README entry for every stored PDF and a stored PDF for every entry", () => {
    expect(pdfFiles.length).toBeGreaterThan(0);
    expect(pdfFiles).toEqual([...documented].sort());
  });

  it.each(pdfFiles)("%s contains the identity its entry records", (file) => {
    const section = sectionFor(file);
    expect(section, `no README entry names ${file}`).not.toBe("");

    const doi = section.match(/doi:\s*(10\.\d{4,9}\/\S+)/i)?.[1];
    expect(doi, `entry for ${file} records no DOI`).toBeTruthy();

    const text = squash(ownText(file));
    expect(
      text.includes(squash(doi!)),
      `${file} does not contain its recorded DOI ${doi}`,
    ).toBe(true);

    const title = section.match(/"([^"]+)"/)?.[1] ?? "";
    const words = title
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length >= 5);
    expect(words.length, `entry for ${file} records no title`).toBeGreaterThan(
      0,
    );
    const present = words.filter((word) => text.includes(word));
    expect(
      present.length,
      `${file} text does not match its recorded title "${title}"`,
    ).toBeGreaterThanOrEqual(Math.ceil(words.length * 0.6));
  });
});
