/**
 * Gradly video design tokens.
 *
 * The palette and type face are lifted from the shipped learner interface
 * (`apps/web/src/styles.css`) so the film and the product cannot drift apart.
 * The reference film's language (white surface, single saturated accent,
 * warm photographic plate) is expressed here as `color.accent` + `color.warm`.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const color = {
  ink: "#1b1c1c",
  bg: "#fbf9f8",
  surface: "#ffffff",
  muted: "#4e5b6e",
  line: "#dfe5ec",
  accent: "#1cb0f6",
  accentDark: "#006b93",
  accentInk: "#003d59",
  accentSoft: "#e5f5ff",
  warm: "#ff8414",
  warmDark: "#934400",
  warmSoft: "#fff1de",
  danger: "#d14343",
  success: "#1f8f5f",
} as const;

export const FONT = "Plus Jakarta Sans, system-ui, sans-serif";

/** Spring presets tuned against the reference: quick, slightly overshooting, never bouncy. */
export const springs = {
  pop: { damping: 14, mass: 0.55, stiffness: 160 },
  soft: { damping: 24, mass: 0.9, stiffness: 90 },
  drift: { damping: 200, mass: 3, stiffness: 20 },
} as const;

/** The reference never uses linear easing for entrances. */
export const ease = {
  out: [0.23, 1, 0.32, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const BADGE = 112;
export const RADIUS = { window: 18, chip: 999, card: 22 };
