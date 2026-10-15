import { it, expect } from "vitest";
import { extractPdf } from "../../apps/api/src/research/pdf.js";
import { pdfBytes } from "./pdf-fixture.js";
const file = (data: Buffer, name = "paper.pdf", type = "application/pdf") =>
  new File([new Uint8Array(data)], name, { type });
it("extracts real PDF text and retains page number", async () => {
  const pages = await extractPdf(file(pdfBytes()));
  expect(pages[0]!.page).toBe(1);
  expect(pages[0]!.text.replace(/\s+/g, " ")).toContain("randomly assigned");
});
it("rejects wrong extension, fake content, empty and oversized PDFs", async () => {
  await expect(extractPdf(file(pdfBytes(), "paper.txt"))).rejects.toThrow(
    "PDF document",
  );
  await expect(extractPdf(file(Buffer.from("fake document")))).rejects.toThrow(
    "contents",
  );
  await expect(extractPdf(file(Buffer.alloc(0)))).rejects.toThrow("empty");
  await expect(extractPdf(file(Buffer.alloc(4000001)))).rejects.toThrow(
    "exceeds",
  );
});
it("handles corrupt PDF and textless scans with recovery guidance", async () => {
  await expect(extractPdf(file(Buffer.from("%PDF-broken")))).rejects.toThrow(
    "could not be read",
  );
  await expect(extractPdf(file(pdfBytes("")))).rejects.toThrow("OCR");
});

it("reads an image-only English PDF with actual OCR and records provenance", async () => {
  const { scannedPdfBytes } = await import("./pdf-fixture.js");
  const pages = await extractPdf(file(await scannedPdfBytes()));
  expect(pages[0]!.method).toBe("ocr");
  expect(pages[0]!.confidence).toBeGreaterThanOrEqual(75);
  expect(pages[0]!.text.replace(/\s+/g, " ")).toContain("independent groups");
  expect(pages[0]!.page).toBe(1);
}, 30000);
