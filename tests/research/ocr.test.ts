import { it, expect, vi, afterEach } from "vitest";
import type { PDFParse } from "pdf-parse";
const mocks = vi.hoisted(() => ({
  recognize: vi.fn(),
  terminate: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("tesseract.js", () => ({
  createWorker: vi.fn().mockResolvedValue(mocks),
}));
import { ocrPages } from "../../apps/api/src/research/ocr.js";
const parser = {
  getScreenshot: vi
    .fn()
    .mockResolvedValue({ pages: [{ data: new Uint8Array([1]) }] }),
} as unknown as PDFParse;
const pages = [{ page: 1, text: "" }];
const dimensions = [{ pageNumber: 1, width: 612, height: 792 }];
afterEach(() => {
  vi.useRealTimers();
  mocks.recognize.mockReset();
  mocks.terminate.mockClear();
});
it("terminates a hung OCR worker and returns a recoverable timeout", async () => {
  vi.useFakeTimers();
  mocks.recognize.mockImplementation(() => new Promise(() => {}));
  const result = ocrPages(parser, pages, dimensions);
  const rejection = expect(result).rejects.toThrow("OCR timed out");
  await vi.advanceTimersByTimeAsync(75000);
  await rejection;
  expect(mocks.terminate).toHaveBeenCalled();
});
it("rejects uncertain OCR output and enforces page/pixel bounds before worker use", async () => {
  mocks.recognize.mockResolvedValue({
    data: { text: "Unreadable text ".repeat(10), confidence: 40 },
  });
  await expect(ocrPages(parser, pages, dimensions)).rejects.toThrow(
    "confidence",
  );
  await expect(
    ocrPages(
      parser,
      Array.from({ length: 7 }, (_, i) => ({ page: i + 1, text: "" })),
      dimensions,
    ),
  ).rejects.toThrow("more than 6");
  await expect(
    ocrPages(parser, pages, [{ pageNumber: 1, width: 1, height: 100000 }]),
  ).rejects.toThrow("dimensions");
});
