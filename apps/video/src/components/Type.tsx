import { interpolate, Easing, useCurrentFrame } from "remotion";
import { color, FONT } from "../theme";

type Line = { text: string; accent?: boolean; muted?: boolean };

/**
 * Kinetic type: words rise into place on a short stagger.
 * Used where the reference would put a headline — inside a moving plate.
 */
export const Headline: React.FC<{
  at: number;
  lines: Line[];
  size?: number;
  weight?: number;
  align?: "left" | "center";
  color?: string;
  accentColor?: string;
  stagger?: number;
  maxWidth?: number;
  letterSpacing?: number;
  until?: number;
}> = ({
  at,
  lines,
  size = 84,
  weight = 800,
  align = "left",
  color: inkColor = color.ink,
  accentColor = color.accentDark,
  stagger = 3,
  maxWidth = 1100,
  letterSpacing = -0.02,
  until = Number.POSITIVE_INFINITY,
}) => {
  const frame = useCurrentFrame();
  let wordIndex = 0;

  return (
    <div style={{ maxWidth, textAlign: align }}>
      {lines.map((line, lineIdx) => {
        const words = line.text.split(" ");
        return (
          <div
            key={lineIdx}
            style={{
              fontFamily: FONT,
              fontSize: size,
              fontWeight: weight,
              lineHeight: 1.05,
              letterSpacing: `${letterSpacing}em`,
              color: line.accent ? accentColor : line.muted ? color.muted : inkColor,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: align === "center" ? "center" : "flex-start",
              gap: `0 ${size * 0.24}px`,
            }}
          >
            {words.map((word) => {
              const index = wordIndex++;
              const start = at + index * stagger;
              const p = interpolate(frame, [start, start + 14], [0, 1], {
                easing: Easing.bezier(0.22, 1, 0.36, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const exit = Number.isFinite(until)
                ? interpolate(frame, [until!, until! + 10], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 1;
              return (
                <span
                  key={`${word}-${index}`}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${(1 - p) * size * 0.36}px)`,
                    opacity: p * exit,
                    filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Small tracked-out label, used for section slates and captions. */
export const Label: React.FC<{
  at: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  until?: number;
  uppercase?: boolean;
}> = ({ at, children, color: c = color.muted, size = 22, until = Number.POSITIVE_INFINITY, uppercase = true }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = Number.isFinite(until)
    ? interpolate(frame, [until, until + 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: uppercase ? "0.16em" : "-0.01em",
        textTransform: uppercase ? "uppercase" : "none",
        color: c,
        opacity: p * exit,
        transform: `translateY(${(1 - p) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};
