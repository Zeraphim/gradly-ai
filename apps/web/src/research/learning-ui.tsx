import { useState } from "react";
import { Mascot as ExistingMascot } from "../components/Mascot.js";
export function Mascot({ small = false }: { small?: boolean }) {
  return (
    <div className={`mascot ${small ? "small" : ""}`}>
      <ExistingMascot size={small ? "small" : "normal"} pose="guiding" />
    </div>
  );
}
export function Speech({ children }: { children: React.ReactNode }) {
  return (
    <div className="speech-row">
      <Mascot />
      <div className="speech">{children}</div>
    </div>
  );
}
export function Progress({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <strong>{label}</strong>
        <span>
          {value} of {max} complete
        </span>
      </div>
      <progress aria-label={label} max={max} value={value} />
    </div>
  );
}
export function ErrorMessage({ message }: { message: string }) {
  return message ? (
    <div className="error" role="alert">
      {message}
    </div>
  ) : null;
}

export function ExtractedPages({
  pages,
}: {
  pages: import("../../../api/src/research/contracts.js").PageText[];
}) {
  const [index, setIndex] = useState(0);
  const page = pages[Math.min(index, pages.length - 1)];
  if (!page) return <p>No extracted pages are available.</p>;
  return (
    <section className="page-reader" aria-label="Extracted document pages">
      <div className="page-reader-toolbar">
        <label>
          <span className="reader-label">Extracted text</span>
          <select
            aria-label="Extracted PDF page"
            value={Math.min(index, pages.length - 1)}
            onChange={(e) => setIndex(Number(e.target.value))}
          >
            {pages.map((p, i) => (
              <option value={i} key={p.page}>
                PDF page {p.page} of {pages.length}
              </option>
            ))}
          </select>
        </label>
        <div className="page-reader-controls">
          <button
            className="btn compact outline"
            aria-label="Previous extracted page"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            ←
          </button>
          <button
            className="btn compact outline"
            aria-label="Next extracted page"
            disabled={index >= pages.length - 1}
            onClick={() => setIndex((i) => i + 1)}
          >
            →
          </button>
        </div>
      </div>
      <p className="reader-meta">
        {page.method === "ocr"
          ? `English OCR · confidence estimate ${page.confidence}% · compare with original`
          : "Embedded text · compare with your original PDF"}
      </p>
      <div
        className="page-reader-text"
        role="region"
        aria-label={`Text from PDF page ${page.page}`}
        tabIndex={0}
        key={page.page}
      >
        {page.text || "No readable text was found on this page."}
      </div>
    </section>
  );
}
