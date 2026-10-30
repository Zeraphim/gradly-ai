import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Music } from "./components/Music";
import { Stage } from "./components/Stage";
import { Headline } from "./components/Type";
import { Analysis, Briefing, Cam, Caption, CaptionScale, Competitors, EndCard, Result, Reveal } from "./Gradly90";
import { Badge } from "./components/Badge";
import { Capture } from "./components/Capture";
import { color, FONT } from "./theme";

/*
 * The hackathon submission cut.
 *
 * The backbone is a real screen recording of one uploaded paper going through
 * Gradly end to end (`public/rec/*.mp4`, cut and speed-ramped from the source
 * recording with ffmpeg). Prepared-study beats reuse the Playwright captures.
 * Clips avoid the system file picker (private file names) and two challenges
 * whose scene rendering showed placeholder labels.
 */

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/* building blocks                                                     */
/* ------------------------------------------------------------------ */

/** Soft brand backdrop with slow drifting light, behind the app window. */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = Math.sin(frame / 70) * 60;
  const b = Math.cos(frame / 90) * 80;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(900px 600px at ${22 + a / 40}% ${18 + b / 50}%, rgba(28,176,246,0.20), transparent 70%),
          radial-gradient(800px 520px at ${82 - a / 40}% ${86 - b / 60}%, rgba(255,132,20,0.14), transparent 70%),
          linear-gradient(160deg, #eef7fd 0%, #fbf9f8 55%, #fff6ec 100%)`,
      }}
    />
  );
};

type Shot = { f: number; zoom: number; x: number; y: number };

/**
 * A browser window holding a recorded clip. `shots` keyframes a camera:
 * zoom with a focus point (0–1 of the window), eased between keys.
 */
const AppWindow: React.FC<{
  src: string;
  shots?: Shot[];
  playbackRate?: number;
  startFrom?: number;
}> = ({ src, shots = [{ f: 0, zoom: 1, x: 0.5, y: 0.5 }], playbackRate = 1, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const W = 1560;
  const H = Math.round((W * 1202) / 1920);
  const BAR = 44;

  const frames = shots.map((s) => s.f);
  const pick = (key: "zoom" | "x" | "y") =>
    shots.length === 1
      ? shots[0]![key]
      : interpolate(
          frame,
          frames,
          shots.map((s) => s[key]),
          { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
        );
  const zoom = pick("zoom");
  const fx = pick("x");
  const fy = pick("y");

  // keep the focus point centred while zoomed, without exposing the edges
  const maxX = (zoom - 1) / (2 * zoom);
  const tx = Math.max(-maxX, Math.min(maxX, 0.5 - fx)) * W * zoom;
  const ty = Math.max(-maxX, Math.min(maxX, 0.5 - fy)) * (H + BAR) * zoom;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: W,
          height: H + BAR,
          borderRadius: 18,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 50px 120px rgba(16,38,58,0.28), 0 0 0 1px rgba(16,38,58,0.08)",
          transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            height: BAR,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 18px",
            background: "#f1f3f5",
            borderBottom: "1px solid #e1e5ea",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
          ))}
          <div
            style={{
              margin: "0 auto",
              padding: "6px 80px",
              borderRadius: 9,
              background: "#fff",
              border: "1px solid #e1e5ea",
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 600,
              color: color.muted,
            }}
          >
            gradly-ai.vercel.app
          </div>
        </div>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          playbackRate={playbackRate}
          startFrom={startFrom}
          style={{ width: W, height: H, display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Puts a full-frame 1920×1080 capture scene inside the same app window. */
const Framed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const W = 1560;
  const k = W / 1920;
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: W,
            height: 1080 * k + 44,
            borderRadius: 18,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 50px 120px rgba(16,38,58,0.28), 0 0 0 1px rgba(16,38,58,0.08)",
            position: "relative",
          }}
        >
          <div style={{ height: 44, display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: "#f1f3f5", borderBottom: "1px solid #e1e5ea" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
            ))}
            <div style={{ margin: "0 auto", padding: "6px 80px", borderRadius: 9, background: "#fff", border: "1px solid #e1e5ea", fontFamily: FONT, fontSize: 17, fontWeight: 600, color: color.muted }}>
              gradly-ai.vercel.app
            </div>
          </div>
          <div style={{ position: "absolute", top: 44, left: 0, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: "0 0" }}>
            <CaptionScale.Provider value={1 / k}>{children}</CaptionScale.Provider>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Small chapter label, top left. */
const Chapter: React.FC<{ children: React.ReactNode; at?: number; tone?: "blue" | "warm" }> = ({
  children,
  at = 4,
  tone = "blue",
}) => {
  const frame = useCurrentFrame();
  const p =
    interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: ease }) *
    (1 - interpolate(frame, [at + 80, at + 94], [0, 1], clamp));
  if (p === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 30,
        padding: "10px 22px",
        borderRadius: 999,
        background: tone === "blue" ? color.accentInk : color.warmDark,
        color: "#fff",
        fontFamily: FONT,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        opacity: p,
        transform: `translateX(${(1 - p) * -24}px)`,
        boxShadow: "0 12px 30px rgba(0,61,89,0.25)",
      }}
    >
      {children}
    </div>
  );
};

/** Wraps a scene with a quick push-in entrance and fade-out exit. */
const Enter: React.FC<{ children: React.ReactNode; fadeOut?: boolean }> = ({ children, fadeOut = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: ease });
  const out = fadeOut ? interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill
      style={{
        opacity: p * (1 - out),
        transform: `scale(${0.975 + 0.025 * p + 0.015 * out})`,
        filter: p < 1 || out > 0 ? `blur(${(1 - p) * 8 + out * 6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* scenes                                                              */
/* ------------------------------------------------------------------ */

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const qs = ["Which statistical test fits?", "What does this result actually mean?"];
  return (
    <Stage background="#0a1118" grain={0.06} vignette={0.35}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <Headline at={4} size={96} color="#fff" align="center" lines={[{ text: "A thesis takes months." }]} />
        <div style={{ display: "flex", gap: 24 }}>
          {qs.map((q, i) => {
            const at = 40 + i * 14;
            const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={q}
                style={{
                  padding: "20px 32px",
                  borderRadius: 999,
                  background: i === 0 ? "rgba(28,176,246,0.16)" : "rgba(255,132,20,0.16)",
                  border: `1px solid ${i === 0 ? "rgba(28,176,246,0.5)" : "rgba(255,132,20,0.5)"}`,
                  color: "#fff",
                  fontFamily: FONT,
                  fontSize: 38,
                  fontWeight: 700,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 30}px)`,
                }}
              >
                {q}
              </div>
            );
          })}
        </div>
        <Headline
          at={84}
          size={44}
          weight={600}
          align="center"
          color="rgba(255,255,255,0.7)"
          lines={[{ text: "Students still reach that point unsure." }]}
        />
      </AbsoluteFill>
    </Stage>
  );
};

/** Prepared-study library, full frame (no laptop plate). */
const Library: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <Stage background={color.bg} grain={0.02} vignette={0.05}>
      <Cam from={1.0} to={1.08} duration={durationInFrames} origin="40% 40%">
        <Capture name="library" />
      </Cam>
      <Badge at={20} x={1660} y={250} size={132} background={color.accentSoft} floatPhase={0.4}>
        <span style={{ fontFamily: FONT, fontSize: 46, fontWeight: 800, color: color.accentInk }}>53</span>
      </Badge>
      <Caption at={14} until={durationInFrames - 10}>
        Or pick one of 53 prepared studies — like texting in class.
      </Caption>
    </Stage>
  );
};

const Home: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AppWindow
      src="rec/upload.mp4"
      shots={[
        { f: 0, zoom: 1.0, x: 0.5, y: 0.5 },
        { f: 110, zoom: 1.18, x: 0.5, y: 0.4 },
      ]}
    />
    <Caption at={12} until={108}>
      Gradly turns real research papers into interactive quests.
    </Caption>
  </AbsoluteFill>
);

/** Upload → reading → check what we read, one continuous recorded beat. */
const UploadFlow: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence durationInFrames={100}>
      <AppWindow
        src="rec/upload.mp4"
        shots={[
          { f: 0, zoom: 1.0, x: 0.5, y: 0.5 },
          { f: 90, zoom: 1.12, x: 0.5, y: 0.5 },
        ]}
      />
    </Sequence>
    <Sequence from={100} durationInFrames={84}>
      <AppWindow src="rec/reading.mp4" shots={[{ f: 0, zoom: 1.25, x: 0.5, y: 0.4 }]} />
    </Sequence>
    <Sequence from={184} durationInFrames={196}>
      <AppWindow
        src="rec/check.mp4"
        shots={[
          { f: 0, zoom: 1.0, x: 0.5, y: 0.5 },
          { f: 60, zoom: 1.28, x: 0.5, y: 0.45 },
          { f: 170, zoom: 1.28, x: 0.62, y: 0.88 },
        ]}
      />
    </Sequence>
    <Chapter>Creating a new quest</Chapter>
    <Caption at={14} until={176}>
      Upload a PDF. Gradly extracts the text first.
    </Caption>
    <Caption at={196} until={368}>
      You check what was read before anything is sent to an AI service.
    </Caption>
  </AbsoluteFill>
);

const Preparing: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  // the clip covers 332 s of real preparation at 20× speed
  const real = Math.min(332, (frame / fps) * 20);
  const mm = Math.floor(real / 60);
  const ss = Math.floor(real % 60)
    .toString()
    .padStart(2, "0");
  return (
    <AbsoluteFill>
      <Backdrop />
      <AppWindow
        src="rec/prep.mp4"
        shots={[
          { f: 0, zoom: 1.0, x: 0.5, y: 0.5 },
          { f: 70, zoom: 1.3, x: 0.5, y: 0.5 },
          { f: durationInFrames - 60, zoom: 1.3, x: 0.5, y: 0.5 },
          { f: durationInFrames, zoom: 1.1, x: 0.5, y: 0.45 },
        ]}
      />
      <Chapter>Preparing · Nemotron 3 Super on Nebius</Chapter>
      <div
        style={{
          position: "absolute",
          right: 64,
          top: 30,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px",
          borderRadius: 999,
          background: "rgba(8,14,22,0.85)",
          color: "#fff",
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: color.warm }}>▶▶ 20×</span>
        <span>
          {mm}:{ss} real time
        </span>
      </div>
      <Caption at={10} until={200}>
        NVIDIA’s open Nemotron 3 Super, via Nebius Token Factory, prepares the quest.
      </Caption>
      <Caption at={210} until={durationInFrames - 8}>
        Seven agents in turn: evidence, challenges, scenes, terms and reviews.
      </Caption>
    </AbsoluteFill>
  );
};

const Ready: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AppWindow
      src="rec/ready.mp4"
      startFrom={36}
      shots={[
        { f: 0, zoom: 1.0, x: 0.5, y: 0.5 },
        { f: 120, zoom: 1.3, x: 0.5, y: 0.35 },
      ]}
    />
    <Chapter tone="warm">After preparation</Chapter>
    <Caption at={14} until={124}>
      NVIDIA Nemotron 3 Super on Nebius prepares the quest in a few minutes.
    </Caption>
  </AbsoluteFill>
);

const Hunch: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AppWindow
      src="rec/hunch.mp4"
      shots={[
        { f: 0, zoom: 1.12, x: 0.5, y: 0.45 },
        { f: 270, zoom: 1.28, x: 0.5, y: 0.35 },
      ]}
    />
    <Caption at={8} until={124}>
      Start with a hunch about what the study can show.
    </Caption>
    <Caption at={134} until={268}>
      A practice question first — you always get a retry.
    </Caption>
  </AbsoluteFill>
);

const Challenge: React.FC<{ src: string; shots: Shot[]; lines: { at: number; until: number; text: string }[] }> = ({
  src,
  shots,
  lines,
}) => (
  <AbsoluteFill>
    <Backdrop />
    <AppWindow src={src} shots={shots} />
    {lines.map((l) => (
      <Caption key={l.at} at={l.at} until={l.until}>
        {l.text}
      </Caption>
    ))}
  </AbsoluteFill>
);

const Evaluation: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { value: "4", label: "Nemotron models tested" },
    { value: "240", label: "evaluation runs" },
    { value: "Super", label: "most reliable, ⅕ the cost of Ultra" },
  ];
  return (
    <Stage background={color.bg} grain={0.03} vignette={0.06}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44 }}>
        <Headline at={4} size={64} align="center" lines={[{ text: "Model chosen on evidence." }]} />
        <div style={{ display: "flex", gap: 30 }}>
          {items.map((item, i) => {
            const at = 18 + i * 8;
            const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={item.label}
                style={{
                  width: 380,
                  padding: "34px 28px",
                  borderRadius: 26,
                  background: color.surface,
                  border: `1px solid ${color.line}`,
                  boxShadow: "0 24px 60px rgba(16,38,58,0.1)",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px)`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: FONT, fontSize: 84, fontWeight: 800, color: color.accentInk, letterSpacing: "-0.04em" }}>
                  {item.value}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: color.muted, marginTop: 6 }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
        <Headline
          at={60}
          size={34}
          weight={600}
          align="center"
          color={color.muted}
          lines={[{ text: "Next: testing with students and expert reviewers." }]}
        />
      </AbsoluteFill>
    </Stage>
  );
};


/** Animated overview of the pipeline: paper in, verified quest out. */
const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { title: "Your paper", sub: "PDF, text checked by you" },
    { title: "Evidence", sub: "quotes pulled per page" },
    { title: "Challenges", sub: "decisions with hints" },
    { title: "Scenes", sub: "interactive, per challenge" },
    { title: "Review", sub: "methods + learning checks" },
    { title: "Quest", sub: "paper revealed at the end" },
  ];
  const line = interpolate(frame, [30, 30 + steps.length * 16], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 70 }}>
        <Headline at={4} size={66} align="center" lines={[{ text: "From any paper to a quest." }]} />
        <div style={{ position: "relative", display: "flex", gap: 28 }}>
          <div style={{ position: "absolute", left: 120, right: 120, top: 46, height: 6, borderRadius: 9, background: color.line }} />
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 46,
              height: 6,
              borderRadius: 9,
              width: `calc((100% - 240px) * ${line})`,
              background: `linear-gradient(90deg, ${color.accent}, ${color.accentDark})`,
            }}
          />
          {steps.map((s, i) => {
            const at = 30 + i * 16;
            const p = interpolate(frame, [at, at + 14], [0, 1], { ...clamp, easing: ease });
            const last = i === steps.length - 1;
            return (
              <div key={s.title} style={{ width: 240, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 0.25 + 0.75 * p }}>
                <div
                  style={{
                    width: 98,
                    height: 98,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: last ? color.warm : p > 0.5 ? color.accentInk : "#fff",
                    border: `3px solid ${last ? color.warm : color.accentInk}`,
                    color: p > 0.5 || last ? "#fff" : color.accentInk,
                    fontFamily: FONT,
                    fontSize: 38,
                    fontWeight: 800,
                    transform: `scale(${0.8 + 0.2 * p})`,
                    boxShadow: "0 18px 40px rgba(0,61,89,0.18)",
                    zIndex: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: color.ink }}>{s.title}</div>
                <div style={{ fontFamily: FONT, fontSize: 21, fontWeight: 600, color: color.muted, textAlign: "center" }}>{s.sub}</div>
              </div>
            );
          })}
        </div>
        <Headline
          at={150}
          size={36}
          weight={600}
          align="center"
          color={color.muted}
          lines={[{ text: "Starting with quantitative research papers." }]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** The guards that keep a generated quest honest. */
const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { k: "Quotes", v: "Code checks every quote appears on its cited page." },
    { k: "Answers", v: "Checked against the lesson’s answer key, not a model’s mood." },
    { k: "Reviews", v: "Methods and learning reviewers read each lesson." },
    { k: "Coach", v: "Feedback on written reasoning — with a reminder it can be wrong." },
  ];
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
        <Headline at={4} size={64} align="center" lines={[{ text: "Grounded in the paper, every step." }]} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 640px)", gap: 26 }}>
          {items.map((it, i) => {
            const at = 24 + i * 12;
            const p = interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={it.k}
                style={{
                  display: "flex",
                  gap: 22,
                  alignItems: "center",
                  padding: "28px 30px",
                  borderRadius: 24,
                  background: "#fff",
                  border: `1px solid ${color.line}`,
                  boxShadow: "0 22px 50px rgba(16,38,58,0.1)",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: 999, background: color.success, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, fontFamily: FONT }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, color: color.ink }}>{it.k}</div>
                  <div style={{ fontFamily: FONT, fontSize: 23, fontWeight: 600, color: color.muted, marginTop: 4 }}>{it.v}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* composition                                                         */
/* ------------------------------------------------------------------ */

const SCENES: { name: string; duration: number; node: React.ReactNode }[] = [
  { name: "hook", duration: 170, node: <Hook /> },
  { name: "gap", duration: 170, node: <Competitors /> },
  { name: "reveal", duration: 120, node: <Reveal /> },
  { name: "pipeline", duration: 240, node: <Pipeline /> },
  { name: "upload", duration: 380, node: <UploadFlow /> },
  { name: "ready", duration: 136, node: <Ready /> },
  { name: "hunch", duration: 278, node: <Hunch /> },
  {
    name: "challenge-evidence",
    duration: 248,
    node: (
      <Challenge
        src="rec/ch1.mp4"
        shots={[
          { f: 0, zoom: 1.2, x: 0.5, y: 0.3 },
          { f: 120, zoom: 1.35, x: 0.5, y: 0.6 },
          { f: 248, zoom: 1.35, x: 0.5, y: 0.8 },
        ]}
        lines={[{ at: 10, until: 238, text: "Every challenge quotes the paper — code checks each quote on its cited page." }]}
      />
    ),
  },
  {
    name: "challenge-hint",
    duration: 382,
    node: (
      <Challenge
        src="rec/ch3.mp4"
        shots={[
          { f: 0, zoom: 1.2, x: 0.5, y: 0.3 },
          { f: 90, zoom: 1.35, x: 0.5, y: 0.65 },
          { f: 382, zoom: 1.35, x: 0.5, y: 0.8 },
        ]}
        lines={[
          { at: 10, until: 190, text: "Answers are checked against the lesson’s answer key." },
          { at: 200, until: 372, text: "Miss, and you get a hint — then another try." },
        ]}
      />
    ),
  },
  {
    name: "challenge-sort",
    duration: 212,
    node: (
      <Challenge
        src="rec/ch4.mp4"
        shots={[
          { f: 0, zoom: 1.25, x: 0.5, y: 0.45 },
          { f: 212, zoom: 1.3, x: 0.5, y: 0.75 },
        ]}
        lines={[{ at: 10, until: 202, text: "Interactive scenes, designed for each challenge." }]}
      />
    ),
  },
  {
    name: "complete",
    duration: 226,
    node: (
      <Challenge
        src="rec/done.mp4"
        shots={[
          { f: 0, zoom: 1.3, x: 0.5, y: 0.35 },
          { f: 150, zoom: 1.3, x: 0.5, y: 0.6 },
          { f: 226, zoom: 1.0, x: 0.5, y: 0.5 },
        ]}
        lines={[{ at: 14, until: 216, text: "Then the paper is revealed — compare your calls with its findings." }]}
      />
    ),
  },
  {
    name: "quests",
    duration: 158,
    node: (
      <Challenge
        src="rec/quests.mp4"
        shots={[{ f: 0, zoom: 1.0, x: 0.5, y: 0.5 }, { f: 158, zoom: 1.12, x: 0.45, y: 0.45 }]}
        lines={[{ at: 8, until: 72, text: "Your uploads and quests stay in one place." },
          { at: 80, until: 150, text: "Or practise on 53 prepared studies." }]}
      />
    ),
  },
  { name: "trust", duration: 240, node: <Trust /> },
  { name: "evaluation", duration: 210, node: <Evaluation /> },
  { name: "end", duration: 240, node: <EndCard /> },
];

export const WALKTHROUGH_FRAMES = SCENES.reduce((sum, s) => sum + s.duration, 0);

export const GradlyWalkthrough: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: color.bg }}>
      <Music file="music/bed-full.mp3" gain={0.95} fadeIn={60} fadeOut={120} />
      {SCENES.map((scene, i) => {
        const at = from;
        from += scene.duration;
        return (
          <Sequence key={scene.name} from={at} durationInFrames={scene.duration} name={scene.name}>
            <Enter fadeOut={i < SCENES.length - 1}>{scene.node}</Enter>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
