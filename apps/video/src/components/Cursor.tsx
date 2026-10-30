import { interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../theme";

type Key = { frame: number; x: number; y: number };

/**
 * Animated pointer. Position comes from keyframes in composition pixels;
 * clicks drop a ripple and a press-squash, matching the reference's cursor work.
 */
export const Cursor: React.FC<{
  keys: Key[];
  clicks?: number[];
  visibleFrom?: number;
  visibleUntil?: number;
  size?: number;
  tint?: string;
}> = ({ keys, clicks = [], visibleFrom = 0, visibleUntil = Number.POSITIVE_INFINITY, size = 44, tint = "#111" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < visibleFrom || frame > visibleUntil || keys.length === 0) return null;

  const sorted = [...keys].sort((a, b) => a.frame - b.frame);
  const first = sorted[0]!;
  let x = first.x;
  let y = first.y;

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    if (frame >= a.frame && frame <= b.frame) {
      const t = interpolate(frame, [a.frame, b.frame], [0, 1], {
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
      break;
    }
    if (frame > b.frame) {
      x = b.x;
      y = b.y;
    }
  }

  const press = Math.min(
    ...clicks.map((c) =>
      interpolate(frame, [c - 3, c, c + 8], [1, 0.82, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
    1,
  );

  const enter = interpolate(frame, [visibleFrom, visibleFrom + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      {clicks.map((c) => {
        const p = interpolate(frame, [c, c + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (frame < c || p >= 1) return null;
        const { x: cx, y: cy } = positionAt(sorted, c);
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: cx - 46,
              top: cy - 46,
              width: 92,
              height: 92,
              borderRadius: 999,
              border: `3px solid ${color.accent}`,
              transform: `scale(${0.25 + p * 1.15})`,
              opacity: 1 - p,
            }}
          />
        );
      })}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x - size * 0.18,
          top: y - size * 0.1,
          transform: `scale(${press})`,
          transformOrigin: "18% 10%",
          opacity: enter,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
          pointerEvents: "none",
        }}
      >
        <path
          d="M4.5 2.8 19.6 11.3l-6.9 1.5-3.4 6.1L4.5 2.8Z"
          fill={tint}
          stroke="#fff"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

const positionAt = (keys: Key[], frame: number) => {
  const before = [...keys].reverse().find((k) => k.frame <= frame) ?? keys[0]!;
  return before;
};

export const useFrame = () => useCurrentFrame();
