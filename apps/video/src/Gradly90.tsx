import { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/** Counter-scale for captions rendered inside a scaled-down frame. */
export const CaptionScale = createContext(1);
import { Badge, MascotChip } from "./components/Badge";
import { Music } from "./components/Music";
import { Capture } from "./components/Capture";
import { Cursor } from "./components/Cursor";
import { DeskScene } from "./components/DeskScene";
import { BookIcon, CheckIcon, CodeIcon, DocIcon, GlobeIcon, SparkIcon } from "./components/Icons";
import { Stage } from "./components/Stage";
import { Headline, Label } from "./components/Type";
import { camera } from "./lib/motion";
import { color, FONT } from "./theme";

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

export const Scrim: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(to top, rgba(4,10,16,${0.88 * strength}) 0%, rgba(4,10,16,${0.4 * strength}) 38%, rgba(4,10,16,0) 68%)`,
      pointerEvents: "none",
    }}
  />
);

export const Caption: React.FC<{ at: number; until?: number; children: React.ReactNode; dark?: boolean }> = ({
  at,
  until = Number.POSITIVE_INFINITY,
  children,
}) => {
  const frame = useCurrentFrame();
  const k = useContext(CaptionScale);
  const ease = Easing.bezier(0.22, 1, 0.36, 1);
  const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const p = interpolate(frame, [at, at + 16], [0, 1], { ...clampOpts, easing: ease });
  const out = interpolate(frame, [until, until + 10], [0, 1], { ...clampOpts, easing: Easing.in(Easing.cubic) });
  if (p === 0 || out === 1) return null;

  const avatar = interpolate(frame, [at + 2, at + 18], [0, 1], { ...clampOpts, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  const bob = Math.sin((frame - at) / 18) * 2;
  const words = typeof children === "string" ? children.split(" ") : null;

  return (
    <div
      style={{
        position: "absolute",
        left: 64 * k,
        bottom: 60 * k,
        zoom: k,
        maxWidth: 1180,
        opacity: p * (1 - out),
        transform: `translateX(${(1 - p) * -36}px) translateY(${out * 12}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "16px 34px 16px 16px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(16px) saturate(150%)",
          boxShadow: "0 22px 56px rgba(0, 61, 89, 0.22), 0 2px 6px rgba(0, 61, 89, 0.08)",
          border: "1px solid rgba(28, 176, 246, 0.22)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            flex: "0 0 64px",
            borderRadius: 999,
            background: `linear-gradient(145deg, ${color.accentSoft}, #cdeeff)`,
            border: "2px solid #fff",
            boxShadow: "0 6px 16px rgba(0, 61, 89, 0.18)",
            backgroundImage: `url(${staticFile("brand/mascot-guiding.webp")}), linear-gradient(145deg, ${color.accentSoft}, #cdeeff)`,
            backgroundSize: "86%, cover",
            backgroundPosition: "center 70%, center",
            backgroundRepeat: "no-repeat",
            transform: `scale(${avatar}) translateY(${bob}px)`,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: color.accentInk,
            lineHeight: 1.25,
          }}
        >
          {words
            ? words.map((w, i) => {
                const wp = interpolate(frame, [at + 6 + i * 1.4, at + 16 + i * 1.4], [0, 1], { ...clampOpts, easing: ease });
                return (
                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      opacity: wp,
                      transform: `translateY(${(1 - wp) * 8}px)`,
                      filter: `blur(${(1 - wp) * 4}px)`,
                      whiteSpace: "pre",
                    }}
                  >
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                );
              })
            : children}
        </div>
      </div>
    </div>
  );
};

/** Camera wrapper for full-bleed captures: keeps cursor coordinates 1:1. */
export const Cam: React.FC<{
  from?: number;
  to?: number;
  duration: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ from = 1, to = 1.05, duration, origin = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        transform: camera(frame, { from, to, duration, ease: [0.33, 0, 0.67, 1] }),
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const CARD: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 22,
  padding: "26px 34px",
  borderRadius: 999,
  background: color.surface,
  boxShadow: "0 24px 60px rgba(16, 38, 58, 0.14)",
  fontFamily: FONT,
  fontSize: 40,
  fontWeight: 700,
  color: color.ink,
  letterSpacing: "-0.02em",
};

/* ------------------------------------------------------------------ */
/* 1 · Hook — 240 frames (8s)                                          */
/* ------------------------------------------------------------------ */

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Stage background="#080c11" grain={0.07} vignette={0.3}>
      <DeskScene
        cameraTransform={`translate(${interpolate(frame, [0, durationInFrames], [150, 128])}px, ${interpolate(frame, [0, durationInFrames], [0, -18])}px) scale(${interpolate(
          frame,
          [0, durationInFrames],
          [1.04, 1.14],
        )})`}
      >
        <Capture name="library" />
      </DeskScene>
      <Scrim strength={0.82} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(4,10,16,0.55) 0%, transparent 55%)" }} />

      <div style={{ position: "absolute", left: 120, bottom: 190 }}>
        <Headline at={14} size={92} color="#ffffff" lines={[{ text: "Months of work." }]} maxWidth={900} />
        <div style={{ height: 18 }} />
        <Headline
          at={32}
          size={54}
          weight={600}
          color="rgba(255,255,255,0.66)"
          lines={[{ text: "Still guessing which test to run?" }]}
          maxWidth={900}
        />
      </div>

      <MascotChip mascot="mascot-thinking" at={52} x={1590} y={300} size={136} background="#e9f6ff" floatPhase={0} />
      <Badge at={64} x={1748} y={548} size={92} background={color.warm} floatPhase={1.6}>
        <span style={{ fontSize: 40, fontWeight: 800, color: "#fff", fontFamily: FONT }}>?</span>
      </Badge>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 2 · Competitors — 240 frames (8s)                                   */
/* ------------------------------------------------------------------ */

const PILLS = [
  { icon: <CodeIcon size={40} color={color.accentInk} />, title: "Coding", tail: "LeetCode" },
  { icon: <GlobeIcon size={40} color={color.accentInk} />, title: "Languages", tail: "Duolingo" },
  { icon: <BookIcon size={40} color={color.warmDark} />, title: "Research", tail: "?" },
];

export const Competitors: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage background={color.bg} grain={0.03} vignette={0.06}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Label at={4} color={color.accentDark} size={24}>
          The gap
        </Label>
        <div style={{ height: 30 }} />
        <Headline
          at={12}
          size={76}
          align="center"
          lines={[{ text: "Coding has LeetCode." }, { text: "Languages have Duolingo." }]}
          maxWidth={1400}
        />
        <div style={{ height: 54 }} />
        <div style={{ display: "flex", gap: 26 }}>
          {PILLS.map((pill, i) => {
            const at = 56 + i * 12;
            const p = interpolate(frame, [at, at + 16], [0, 1], {
              easing: Easing.bezier(0.22, 1, 0.36, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const accent = i === 2;
            return (
              <div
                key={pill.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 30px",
                  borderRadius: 999,
                  background: accent ? color.warmSoft : color.surface,
                  border: `1px solid ${accent ? "rgba(147,68,0,0.22)" : color.line}`,
                  boxShadow: "0 18px 44px rgba(16, 38, 58, 0.1)",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px) scale(${0.94 + 0.06 * p})`,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: accent ? "rgba(255,132,20,0.16)" : color.accentSoft,
                  }}
                >
                  {pill.icon}
                </div>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 800, color: color.ink, letterSpacing: "-0.02em" }}>
                    {pill.title}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: color.muted }}>{pill.tail}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 46 }} />
        <Headline
          at={104}
          size={42}
          weight={600}
          align="center"
          color={color.muted}
          lines={[{ text: "Research decisions had no place to practice." }]}
          maxWidth={1200}
        />
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 3 · Gradly reveal — 180 frames (6s)                                 */
/* ------------------------------------------------------------------ */

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [4, 34], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = Math.sin(frame / fps) * 2.5;

  return (
    <Stage background={color.bg} grain={0.03} vignette={0.08}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          transform: `translateY(${drift}px)`,
        }}
      >
        <div
          style={{
            width: 780,
            height: 262,
            backgroundImage: `url(${staticFile("brand/gradly-logo-mark.png")})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: p,
            transform: `scale(${0.9 + 0.1 * p})`,
          }}
        />
        <div style={{ height: 56 }} />
        <Headline
          at={22}
          size={44}
          weight={600}
          align="center"
          color={color.muted}
          lines={[{ text: "Practice research decisions — on real papers." }]}
        />
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 4 · Library dive — 360 frames (12s)                                 */
/* ------------------------------------------------------------------ */

export const Library: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dive = interpolate(frame, [6, 58], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.3}>
      <DeskScene dive={dive} cameraTransform={`scale(${interpolate(frame, [0, 58], [1.06, 1.16])})`}>
        <Cam from={1} to={1.06} duration={durationInFrames} origin="34% 42%">
          <Capture name="library" />
        </Cam>
      </DeskScene>
      <Badge at={86} x={1660} y={250} size={132} background={color.accentSoft} floatPhase={0.4}>
        <span style={{ fontFamily: FONT, fontSize: 46, fontWeight: 800, color: color.accentInk }}>53</span>
      </Badge>
      <Caption at={92} until={durationInFrames - 22}>
        53 prepared studies — or upload your own paper.
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 5 · Briefing — 210 frames (7s)                                      */
/* ------------------------------------------------------------------ */

export const Briefing: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.28}>
      <Cam from={1.14} to={1.03} duration={durationInFrames} origin="50% 46%">
        <Capture name="briefing" />
        <Cursor
          visibleFrom={26}
          keys={[
            { frame: 26, x: 1760, y: 940 },
            { frame: 58, x: 1060, y: 723 },
          ]}
          clicks={[74]}
        />
      </Cam>
      <Caption at={84} until={durationInFrames - 16}>
        Step inside a study. Decide before you see the findings.
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 6 · Analysis challenge — 450 frames (15s)                           */
/* ------------------------------------------------------------------ */

export const Analysis: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const ramp = (from: number) =>
    interpolate(frame, [from, from + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hintOpacity = ramp(152) * (1 - ramp(232));
  const chosenOpacity = ramp(300) * (1 - ramp(352));
  const correctOpacity = ramp(356);
  const baseOpacity = Math.max(0, 1 - hintOpacity - chosenOpacity - correctOpacity);

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.26}>
      <Cam from={1.02} to={1.08} duration={durationInFrames} origin="50% 38%">
        <AbsoluteFill style={{ opacity: baseOpacity }}>
          <Capture name="challenge-analysis" />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: hintOpacity }}>
          <Capture name="challenge-analysis-hint" />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: chosenOpacity }}>
          <Capture name="challenge-analysis-selected" />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: correctOpacity }}>
          <Capture name="challenge-analysis-correct" />
        </AbsoluteFill>

        <Cursor
          visibleFrom={18}
          visibleUntil={350}
          clicks={[60, 96, 244, 270, 292, 322]}
          keys={[
            { frame: 18, x: 1760, y: 980 },
            { frame: 56, x: 980, y: 918 },
            { frame: 96, x: 1348, y: 1029 },
            { frame: 210, x: 1310, y: 1002 },
            { frame: 250, x: 980, y: 790 },
            { frame: 272, x: 980, y: 856 },
            { frame: 300, x: 1348, y: 1029 },
            { frame: 326, x: 1500, y: 1010 },
          ]}
        />
      </Cam>

      <Caption at={40} until={150} dark>
        Two groups. Numerical scores. Which test fits?
      </Caption>
      <Caption at={176} until={236} dark>
        Miss it and you get a hint — not the answer.
      </Caption>
      <Caption at={382} until={durationInFrames - 14} dark>
        Then the explanation connects the method to the design.
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 7 · Read the result — 270 frames (9s)                               */
/* ------------------------------------------------------------------ */

export const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const revealed = interpolate(frame, [134, 148], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.26}>
      <Cam from={1.08} to={1.02} duration={durationInFrames} origin="50% 44%">
        <AbsoluteFill style={{ opacity: 1 - revealed }}>
          <Capture name="challenge-results" />
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: revealed }}>
          <Capture name="challenge-results-revealed" />
        </AbsoluteFill>
        <Cursor
          visibleFrom={16}
          visibleUntil={140}
          clicks={[56]}
          keys={[
            { frame: 16, x: 1500, y: 600 },
            { frame: 52, x: 960, y: 818 },
          ]}
        />
      </Cam>
      <Caption at={24} until={130} dark>
        Read the result — then the limitations.
      </Caption>
      <Caption at={170} until={durationInFrames - 14} dark>
        “Lower on average” is not “every texting student.”
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 8 · Upload — 270 frames (9s)                                        */
/* ------------------------------------------------------------------ */

export const Upload: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.26}>
      <Cam from={1.12} to={1.04} duration={durationInFrames} origin="50% 40%">
        <Capture name="upload-pdf" />
        <Cursor
          visibleFrom={24}
          keys={[
            { frame: 24, x: 1600, y: 880 },
            { frame: 62, x: 780, y: 640 },
          ]}
          clicks={[80]}
        />
      </Cam>
      <Badge at={96} x={1560} y={300} size={110} background={color.accentSoft} floatPhase={0.2}>
        <DocIcon size={54} color={color.accentInk} />
      </Badge>
      <Badge at={110} x={1720} y={440} size={88} background={color.warmSoft} floatPhase={1.1}>
        <SparkIcon size={42} color={color.warmDark} />
      </Badge>
      <Caption at={40} until={durationInFrames - 14}>
        Bring your own paper. Nemotron on Nebius prepares the quest.
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 9 · The paper behind it — 240 frames (8s)                           */
/* ------------------------------------------------------------------ */

export const Paper: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Stage background="#070b10" grain={0.05} vignette={0.26}>
      <Cam from={1} to={1.12} duration={durationInFrames} origin="50% 52%">
        <Capture name="reveal" />
      </Cam>
      <Badge at={70} x={330} y={300} size={110} background={color.success} floatPhase={0}>
        <CheckIcon size={54} color="#ffffff" />
      </Badge>
      <Caption at={40} until={durationInFrames - 14}>
        At the end, the paper is revealed.
      </Caption>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 10 · End card — 240 frames (8s)                                     */
/* ------------------------------------------------------------------ */

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 26], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const url = interpolate(frame, [40, 60], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage background={color.bg} grain={0.03} vignette={0.05}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            width: 720,
            height: 242,
            backgroundImage: `url(${staticFile("brand/gradly-logo-mark.png")})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: p,
            transform: `scale(${0.94 + 0.06 * p})`,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: color.ink,
            opacity: p,
            marginTop: 52,
          }}
        >
          Choose a paper. Try a quest.
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: color.accentDark,
            opacity: url,
            padding: "14px 30px",
            borderRadius: 999,
            background: color.accentSoft,
          }}
        >
          gradly-ai.vercel.app
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

/** 90-second, music-led cut: 2700 frames at 30fps. */
export const Gradly90: React.FC = () => {
  const scenes = [
    { from: 0, duration: 240, node: <Hook /> },
    { from: 240, duration: 240, node: <Competitors /> },
    { from: 480, duration: 180, node: <Reveal /> },
    { from: 660, duration: 360, node: <Library /> },
    { from: 1020, duration: 210, node: <Briefing /> },
    { from: 1230, duration: 450, node: <Analysis /> },
    { from: 1680, duration: 270, node: <Result /> },
    { from: 1950, duration: 270, node: <Upload /> },
    { from: 2220, duration: 240, node: <Paper /> },
    { from: 2460, duration: 240, node: <EndCard /> },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <Music file="music/bed-90.mp3" />
      {scenes.map((scene) => (
        <Sequence key={scene.from} from={scene.from} durationInFrames={scene.duration} name={scene.from.toString()}>
          {scene.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
