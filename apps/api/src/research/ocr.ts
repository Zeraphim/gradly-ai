import { createWorker, type Worker } from "tesseract.js";
import english from "@tesseract.js-data/eng";
import type { PDFParse } from "pdf-parse";
import type { PageText } from "./contracts.js";
export const OCR_MAX_PAGES = 6;
export class ExtractionError extends Error {}
export async function ocrPages(
  parser: PDFParse,
  pages: PageText[],
  dimensions: { pageNumber: number; width: number; height: number }[],
): Promise<PageText[]> {
  const candidates = pages.filter((p) => p.text.trim().length < 80);
  if (!candidates.length) return pages;
  if (candidates.length > OCR_MAX_PAGES)
    throw new ExtractionError(
      `This PDF needs OCR on more than ${OCR_MAX_PAGES} pages. Export a searchable PDF or upload a shorter scan.`,
    );
  for (const page of candidates) {
    const dimensionsForPage = dimensions.find(
      (d) => d.pageNumber === page.page,
    );
    if (
      !dimensionsForPage ||
      dimensionsForPage.width <= 0 ||
      dimensionsForPage.height <= 0 ||
      (1400 * 1400 * dimensionsForPage.height) / dimensionsForPage.width >
        6000000
    )
      throw new ExtractionError(
        "A scanned page has unsupported dimensions. Export a standard-size searchable PDF.",
      );
  }
  let worker: Worker | undefined;
  let timedOut = false;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    deadline = setTimeout(() => {
      timedOut = true;
      reject(
        new ExtractionError(
          "OCR timed out. Upload a smaller scan or a searchable PDF.",
        ),
      );
    }, 75000);
  });
  try {
    const recognize = async () => {
      worker = await createWorker("eng", 1, {
        langPath: english.langPath,
        gzip: english.gzip,
        cacheMethod: "none",
        logger: () => {},
        errorHandler: () => {},
      });
      if (timedOut) {
        await worker.terminate();
        throw new ExtractionError(
          "OCR timed out. Upload a smaller scan or a searchable PDF.",
        );
      }
      const result = pages.map((p) => ({ ...p }));
      for (const candidate of candidates) {
        const image = await parser.getScreenshot({
          partial: [candidate.page],
          desiredWidth: 1400,
          imageDataUrl: false,
          imageBuffer: true,
        });
        if (!image.pages[0])
          throw new ExtractionError(
            "The scanned page could not be rendered. Export a searchable PDF.",
          );
        const { data } = await worker.recognize(
          Buffer.from(image.pages[0].data),
        );
        const text = data.text.trim();
        if (text.length > 0 && data.confidence < 75)
          throw new ExtractionError(
            `OCR confidence is too low on PDF page ${candidate.page}. Use a clearer scan or export a searchable PDF.`,
          );
        const index = result.findIndex((p) => p.page === candidate.page);
        result[index] = {
          page: candidate.page,
          text,
          method: "ocr",
          confidence: Math.round(data.confidence),
        };
      }
      return result;
    };
    return await Promise.race([recognize(), timeout]);
  } catch (error) {
    if (error instanceof ExtractionError) throw error;
    throw new ExtractionError(
      timedOut
        ? "OCR timed out. Upload a smaller scan or a searchable PDF."
        : "OCR could not read this scan reliably. Use a clearer scan or export a searchable PDF.",
    );
  } finally {
    clearTimeout(deadline);
    await worker?.terminate();
  }
}
