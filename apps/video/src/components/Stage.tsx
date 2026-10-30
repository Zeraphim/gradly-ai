import { AbsoluteFill } from "remotion";
import { useContext } from "react";
import { CaptionScale } from "../Gradly90";
import { color } from "../theme";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.5'/></svg>\")";

/**
 * The base canvas: flat colour, a very light film grain, and a soft vignette.
 * The reference keeps grade work minimal — the depth comes from the plate, not from filters.
 */
export const Stage: React.FC<{
  background?: string;
  grain?: number;
  vignette?: number;
  children?: React.ReactNode;
}> = ({ background = color.bg, grain = 0.05, vignette = 0.18, children }) => {
  // inside an app window the frame is a screen, not a camera: no grade
  if (useContext(CaptionScale) !== 1) {
    grain = 0;
    vignette = 0;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: background, overflow: "hidden" }}>
      {children}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: GRAIN,
          opacity: grain,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
