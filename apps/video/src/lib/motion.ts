import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { springs } from "../theme";

/**
 * Spring-driven entrance: scale + opacity + optional blur-in.
 * Every overlay in the reference arrives this way, never linearly.
 */
export const usePop = (at: number, config: keyof typeof springs = "pop", at2?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - at, fps, config: springs[config] });
  const opacity = interpolate(frame - at, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitFrame = at2 ?? Number.POSITIVE_INFINITY;
  const exit = Number.isFinite(exitFrame)
    ? interpolate(frame - exitFrame, [0, 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return { progress, opacity: opacity * exit, scale: 0.82 + 0.18 * progress, exit };
};

/** Slow idle float, so nothing on screen is ever perfectly still. */
export const useFloat = (amplitude = 6, speed = 0.9, phase = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return Math.sin((frame / fps) * Math.PI * speed + phase) * amplitude;
};

/** Camera move helper: returns a transform string for a 2.5D push. */
export const camera = (
  frame: number,
  opts: {
    from?: number;
    to?: number;
    duration: number;
    dx?: number;
    dy?: number;
    rotate?: number;
    ease?: readonly [number, number, number, number];
  },
) => {
  const { from = 1, to = 1.06, duration, dx = 0, dy = 0, rotate = 0, ease } = opts;
  const scale = interpolate(frame, [0, duration], [from, to], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: ease ? (t) => cubic(t, ease) : undefined,
  });
  const x = interpolate(frame, [0, duration], [0, dx], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const y = interpolate(frame, [0, duration], [0, dy], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const r = interpolate(frame, [0, duration], [0, rotate], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return `translate(${x}px, ${y}px) scale(${scale}) rotate(${r}deg)`;
};

const cubic = (t: number, [a, b, c, d]: readonly [number, number, number, number]) => {
  // Cubic-bezier solve (bisection). Good enough for camera moves at 30fps.
  const bezier = (u: number) => 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u ** 2 * c + u ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bezier(mid) < a) lo = mid;
    else hi = mid;
  }
  const u = (lo + hi) / 2;
  return 3 * (1 - u) ** 2 * u * d + 3 * (1 - u) * u ** 2 * d + u ** 3 * d;
};
