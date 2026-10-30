import { Img, staticFile, useCurrentFrame } from "remotion";
import { color, FONT } from "../theme";

export type CaptureName =
  | "library"
  | "briefing"
  | "challenge-analysis"
  | "challenge-analysis-hint"
  | "challenge-analysis-correct"
  | "challenge-analysis-selected"
  | "challenge-results"
  | "challenge-results-revealed"
  | "challenge-results-selected"
  | "upload-pdf"
  | "upload-review"
  | "preparing"
  | "coach-feedback"
  | "reveal"
  | "warmup";

/**
 * Real screenshots of the running app, captured by `scripts/capture-app.mjs`.
 * A missing capture renders a labelled slate — never a mocked-up interface.
 * Flip `ready` only when the file exists on disk.
 */
export const CAPTURES: Record<CaptureName, { file: string; ready: boolean; label: string }> = {
  library: { file: "captures/library.png", ready: true, label: "Library" },
  briefing: { file: "captures/briefing.png", ready: true, label: "Study briefing" },
  "challenge-analysis": { file: "captures/challenge-analysis.png", ready: true, label: "Choose an analysis" },
  "challenge-analysis-hint": { file: "captures/challenge-analysis-hint.png", ready: true, label: "Hint" },
  "challenge-analysis-correct": { file: "captures/challenge-analysis-correct.png", ready: true, label: "Correct answer" },
  "challenge-analysis-selected": { file: "captures/challenge-analysis-selected.png", ready: true, label: "Chosen methods" },
  "challenge-results": { file: "captures/challenge-results.png", ready: true, label: "Interpret the results" },
  "challenge-results-revealed": { file: "captures/challenge-results-revealed.png", ready: true, label: "Reported results" },
  "challenge-results-selected": { file: "captures/challenge-results-selected.png", ready: true, label: "Reading chosen" },
  "upload-pdf": { file: "captures/upload-pdf.png", ready: true, label: "Upload a paper" },
  "upload-review": { file: "captures/upload-review.png", ready: false, label: "Review extracted text" },
  preparing: { file: "captures/preparing.png", ready: false, label: "Preparing the quest" },
  "coach-feedback": { file: "captures/coach-feedback.png", ready: false, label: "Coach feedback" },
  reveal: { file: "captures/reveal.png", ready: true, label: "Paper reveal" },
  warmup: { file: "captures/warmup.png", ready: false, label: "Warm-up question" },
};

/**
 * Renders a capture at its native 1920×1080 composition size.
 * `scale` + `origin` give a cheap sub-frame camera without re-shooting.
 */
export const Capture: React.FC<{
  name: CaptureName;
  scale?: number;
  origin?: string;
  offsetX?: number;
  offsetY?: number;
  style?: React.CSSProperties;
}> = ({ name, scale = 1, origin = "50% 50%", offsetX = 0, offsetY = 0, style }) => {
  const entry = CAPTURES[name];

  if (!entry.ready) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101820",
          color: "#7f8f9f",
          fontFamily: FONT,
          fontSize: 26,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          border: "3px dashed #2b3a48",
          boxSizing: "border-box",
        }}
      >
        Capture pending · {entry.label}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", ...style }}>
      <Img
        src={staticFile(entry.file)}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: origin,
        }}
      />
    </div>
  );
};

/** Highlight that walks the eye to one control the narration is talking about. */
export const Spotlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  until?: number;
  radius?: number;
}> = ({ x, y, w, h, at, until = Number.POSITIVE_INFINITY, radius = 14 }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (frame - at) / 10));
  const out = Math.max(0, Math.min(1, (frame - until) / 8));
  if (p === 0 || out === 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        boxShadow: `0 0 0 4px ${color.accent}, 0 0 0 9999px rgba(6, 20, 32, 0.35)`,
        opacity: (1 - out) * 0.9,
        transform: `scale(${0.96 + 0.04 * p})`,
      }}
    />
  );
};
