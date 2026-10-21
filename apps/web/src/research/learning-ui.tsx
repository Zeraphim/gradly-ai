import { Icon } from "./icon.js";
import { Fragment, useState } from "react";
import { isHeadingLine } from "./paper-signals.js";
import {
  Mascot as ExistingMascot,
  type MascotPose,
} from "../components/Mascot.js";
export function Mascot({
  small = false,
  pose = "guiding",
}: {
  small?: boolean;
  pose?: MascotPose;
}) {
  return (
    <div className={`mascot ${small ? "small" : ""}`}>
      <ExistingMascot size={small ? "small" : "normal"} pose={pose} />
    </div>
  );
}
export function Speech({
  children,
  pose,
}: {
  children: React.ReactNode;
  pose?: MascotPose;
}) {
  return (
    <div className="speech-row">
      <Mascot pose={pose} />
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
        <span aria-live="polite">
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
            <Icon name="back" size={17} />
          </button>
          <button
            className="btn compact outline"
            aria-label="Next extracted page"
            disabled={index >= pages.length - 1}
            onClick={() => setIndex((i) => i + 1)}
          >
            <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
      {page.method === "ocr" ? (
        <p className="reader-meta">
          English OCR · confidence estimate {page.confidence}% · compare with
          the original
        </p>
      ) : null}
      <div
        className="page-reader-text"
        role="region"
        aria-label={`Text from PDF page ${page.page}`}
        tabIndex={0}
        key={page.page}
      >
        {page.text
          ? page.text.split("\n").map((line, i, lines) => (
              <Fragment key={i}>
                {isHeadingLine(line) ? (
                  <strong className="reader-heading">{line}</strong>
                ) : (
                  line
                )}
                {i < lines.length - 1 ? "\n" : null}
              </Fragment>
            ))
          : "No readable text was found on this page."}
      </div>
    </section>
  );
}
