import type { DesignGroup, StudyTopic } from "./types.js";

/** Pale surface and ink per design group. Ink values keep 4.5:1 on their surface. */
export const groupTone: Record<
  DesignGroup,
  { wash: string; tint: string; ink: string }
> = {
  between: { wash: "#e5f5ff", tint: "#9fd8f7", ink: "#005a80" },
  within: { wash: "#efedff", tint: "#c3bbfb", ink: "#4b3cb0" },
  replication: { wash: "#e3f6ee", tint: "#a5dcc4", ink: "#0a6847" },
  correlational: { wash: "#fff1de", tint: "#f6c48c", ink: "#8a4000" },
  longitudinal: { wash: "#e0f3f5", tint: "#9dd3da", ink: "#0a5f6b" },
  classroom: { wash: "#fff6d4", tint: "#f1d77a", ink: "#6e5100" },
  null: { wash: "#edf1f6", tint: "#bfc9d6", ink: "#3d4c60" },
};

/**
 * Decorative topic illustration. Shapes are generic motifs, never data, so they
 * are hidden from assistive technology and carry no findings.
 */
export function StudyArt({
  topic,
  group,
  className = "",
  fit = "slice",
}: {
  topic: StudyTopic;
  group: DesignGroup;
  className?: string;
  /** "meet" keeps the whole motif visible in tall frames. */
  fit?: "slice" | "meet";
}) {
  const tone = groupTone[group];
  return (
    <svg
      className={`study-art ${className}`}
      viewBox="0 0 320 180"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio={`xMidYMid ${fit}`}
      style={{ background: tone.wash }}
    >
      <rect width="320" height="180" fill={tone.wash} />
      <circle cx="270" cy="30" r="64" fill={tone.tint} opacity="0.35" />
      <circle cx="40" cy="170" r="48" fill={tone.tint} opacity="0.3" />
      <g className="study-art-motif">{motifs[topic](tone)}</g>
    </svg>
  );
}

type Tone = (typeof groupTone)[DesignGroup];
const paper = "#ffffff";
const line = (tone: Tone) => ({
  stroke: tone.ink,
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const motifs: Record<StudyTopic, (tone: Tone) => React.ReactNode> = {
  school: (t) => (
    <>
      <path
        d="M86 132 v-72 q37 -14 74 0 v72 q-37 -14 -74 0z"
        fill={paper}
        {...line(t)}
      />
      <path
        d="M160 132 v-72 q37 -14 74 0 v72 q-37 -14 -74 0z"
        fill={t.tint}
        {...line(t)}
      />
      <path
        d="M100 78 q23 -6 46 0 M100 94 q23 -6 46 0 M100 110 q23 -6 46 0"
        fill="none"
        {...line(t)}
        opacity="0.5"
      />
      <circle cx="248" cy="44" r="14" fill={paper} {...line(t)} />
      <path d="M242 62 h12" fill="none" {...line(t)} />
    </>
  ),
  cognition: (t) => (
    <>
      <rect
        x="92"
        y="52"
        width="70"
        height="88"
        rx="10"
        fill={paper}
        {...line(t)}
        transform="rotate(-8 127 96)"
      />
      <rect
        x="150"
        y="44"
        width="70"
        height="88"
        rx="10"
        fill={t.tint}
        {...line(t)}
        transform="rotate(6 185 88)"
      />
      <path
        d="M170 82 l10 10 l18 -20"
        fill="none"
        {...line(t)}
        transform="rotate(6 185 88)"
      />
      <path
        d="M108 80 h36 M108 94 h28 M108 108 h32"
        fill="none"
        {...line(t)}
        transform="rotate(-8 127 96)"
      />
    </>
  ),
  health: (t) => (
    <>
      <path
        d="M160 146 l-46 -44 a26 26 0 0 1 46 -32 a26 26 0 0 1 46 32z"
        fill={paper}
        {...line(t)}
      />
      <path
        d="M120 100 h18 l8 -16 l12 30 l10 -22 l6 8 h26"
        fill="none"
        {...line(t)}
      />
      <path d="M238 46 v28 M224 60 h28" fill="none" {...line(t)} />
      <circle cx="84" cy="56" r="10" fill={t.tint} />
    </>
  ),
  wellbeing: (t) => (
    <>
      <path d="M96 92 l64 -50 l64 50 v54 h-128z" fill={paper} {...line(t)} />
      <path d="M144 146 v-32 h32 v32" fill={t.tint} {...line(t)} />
      <path
        d="M160 98 l-12 -11 a7 7 0 0 1 12 -8 a7 7 0 0 1 12 8z"
        fill={t.ink}
        opacity="0.7"
      />
      <circle cx="252" cy="54" r="16" fill={t.tint} />
      <path
        d="M252 26 v8 M252 74 v8 M224 54 h8 M272 54 h8"
        fill="none"
        {...line(t)}
        opacity="0.6"
      />
    </>
  ),
  social: (t) => (
    <>
      {[80, 124, 168, 212].map((x, i) => (
        <g key={x}>
          <circle
            cx={x + 14}
            cy="74"
            r="14"
            fill={i === 3 ? t.tint : paper}
            {...line(t)}
          />
          <path
            d={`M${x} 140 v-20 a14 14 0 0 1 28 0 v20`}
            fill={i === 3 ? t.tint : paper}
            {...line(t)}
          />
        </g>
      ))}
      <path d="M88 40 h120" fill="none" {...line(t)} opacity="0.4" />
      <path d="M232 36 l8 -8 l8 8" fill="none" {...line(t)} opacity="0.7" />
    </>
  ),
  media: (t) => (
    <>
      <rect
        x="128"
        y="34"
        width="64"
        height="112"
        rx="14"
        fill={paper}
        {...line(t)}
      />
      <rect x="140" y="52" width="40" height="70" rx="5" fill={t.tint} />
      <circle cx="160" cy="133" r="4" fill={t.ink} />
      <path
        d="M206 58 h50 a10 10 0 0 1 10 10 v18 a10 10 0 0 1 -10 10 h-30 l-12 10 v-10 h-8 a10 10 0 0 1 -10 -10 v-18 a10 10 0 0 1 10 -10z"
        fill={paper}
        {...line(t)}
      />
      <circle cx="222" cy="77" r="3" fill={t.ink} />
      <circle cx="234" cy="77" r="3" fill={t.ink} />
      <circle cx="246" cy="77" r="3" fill={t.ink} />
      <path
        d="M62 112 h52 M62 98 h40 M62 126 h46"
        fill="none"
        {...line(t)}
        opacity="0.55"
      />
    </>
  ),
  environment: (t) => (
    <>
      <path
        d="M104 140 c-6 -50 26 -86 76 -92 c6 52 -26 88 -76 92z"
        fill={t.tint}
        {...line(t)}
      />
      <path d="M104 140 q28 -40 60 -70" fill="none" {...line(t)} />
      <circle cx="226" cy="104" r="30" fill={paper} {...line(t)} />
      <path
        d="M226 88 v32 M216 96 q10 -8 20 0 q-10 8 -10 8 q10 0 10 8 q-10 8 -20 0"
        fill="none"
        {...line(t)}
        opacity="0.75"
      />
      <path d="M200 150 h56" fill="none" {...line(t)} opacity="0.4" />
    </>
  ),
};
