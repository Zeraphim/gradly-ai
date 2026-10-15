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
  return (
    <div className="extracted-pages">
      {pages.map((page) => (
        <details className="support" key={page.page}>
          <summary>
            PDF page {page.page} •{" "}
            {page.method === "ocr" ? "English OCR" : "Embedded text"}
          </summary>
          {page.method === "ocr" ? (
            <p>
              OCR confidence estimate: {page.confidence}%. Compare transcription
              with the original PDF.
            </p>
          ) : null}
          <blockquote>
            {page.text || "No readable text was found on this page."}
          </blockquote>
        </details>
      ))}
    </div>
  );
}
