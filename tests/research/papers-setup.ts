import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import type { TestProject } from "vitest/node";

// Stored PDFs are parsed once per run and shared with every test file through
// inject("paperPages"), so adding studies does not add PDF parsing.
const papersDir = fileURLToPath(
  new URL("../../docs/research/papers/", import.meta.url),
);

export type PaperPages = Record<string, { num: number; text: string }[]>;

declare module "vitest" {
  export interface ProvidedContext {
    paperPages: PaperPages;
  }
}

export default async function setup(project: TestProject) {
  const files = readdirSync(papersDir).filter((file) =>
    file.toLowerCase().endsWith(".pdf"),
  );
  const pages: PaperPages = {};
  await Promise.all(
    files.map(async (file) => {
      const parser = new PDFParse({
        data: new Uint8Array(readFileSync(join(papersDir, file))),
      });
      try {
        pages[file] = ((await parser.getText()).pages ?? []).map((page) => ({
          num: page.num,
          text: page?.text ?? "",
        }));
      } finally {
        await parser.destroy();
      }
    }),
  );
  project.provide("paperPages", pages);
}
