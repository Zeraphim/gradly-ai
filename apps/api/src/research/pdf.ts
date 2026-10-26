import { PDFParse } from "pdf-parse";
import { ocrPages, ExtractionError } from "./ocr.js";
import { type PageText } from "./contracts.js";
import { uploadLimit } from "./limits.js";
export { uploadLimit } from "./limits.js";
export async function extractPdf(file: File): Promise<PageText[]> {
  if (
    !file.name.toLowerCase().endsWith(".pdf") ||
    (file.type && file.type !== "application/pdf")
  )
    throw Error("Choose a PDF document.");
  if (!file.size) throw Error("This file is empty. Choose a readable PDF.");
  if (file.size > uploadLimit())
    throw Error(
      `This PDF exceeds the ${uploadLimit() / 1000000} MB limit. Choose a smaller document.`,
    );
  const data = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(data.slice(0, 5)) !== "%PDF-")
    throw Error("The file contents are not a PDF.");
  const parser = new PDFParse({ data });
  try {
    const info = await parser.getInfo();
    if (info.total > 80)
      throw Error("Use a research paper of 80 pages or fewer.");
    const result = await parser.getText();
    if (result.total > 80)
      throw Error("Use a research paper of 80 pages or fewer.");
    let pages: PageText[] = result.pages.map((p) => ({
      page: p.num,
      text: p.text,
      method: "text",
    }));
    if (pages.some((p) => p.text.trim().length < 80)) {
      const details = await parser.getInfo({ parsePageInfo: true });
      pages = await ocrPages(parser, pages, details.pages);
    }
    if (pages.reduce((n, p) => n + p.text.trim().length, 0) < 250)
      throw Error(
        "Readable text is insufficient even after OCR. Use a clearer scan or export a searchable PDF and try again.",
      );
    if (
      pages.some((p) => p.text.length > 100000) ||
      pages.reduce((n, p) => n + p.text.length, 0) > 250000
    )
      throw Error(
        "This document has too much text for reliable processing. Upload a shorter paper.",
      );
    return pages;
  } catch (e) {
    if (e instanceof ExtractionError) throw e;
    const message = e instanceof Error ? e.message : "";
    console.warn(
      `[PDF Extraction Warning] ${file.size} bytes — detail: ${message.slice(0, 300)}`,
    );
    if (/password|encrypted/i.test(message))
      throw Error(
        "This PDF is password-protected. Upload an unlocked copy you may use.",
      );
    if (/insufficient|pages or fewer|too much text/.test(message)) throw e;
    throw Error(
      "This PDF could not be read. It may be corrupt; export a fresh PDF and try again.",
    );
  } finally {
    await parser.destroy();
  }
}
