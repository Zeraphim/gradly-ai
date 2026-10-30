import { Img, staticFile } from "remotion";
import { color, RADIUS } from "../theme";

/** Screen geometry of the hero plate, measured in plate pixels (1280×720). */
export const PLATE = { width: 1280, height: 720 };
export const SCREEN = { x: 328, y: 114, w: 636, h: 390 };

/** Same rectangle expressed in composition pixels for a 1920×1080 stage. */
export const SCREEN_IN_STAGE = {
  x: (SCREEN.x / PLATE.width) * 1920,
  y: (SCREEN.y / PLATE.height) * 1080,
  w: (SCREEN.w / PLATE.width) * 1920,
  h: (SCREEN.h / PLATE.height) * 1080,
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The hero shot: a real desk plate with the app living inside the laptop screen.
 *
 * `dive` (0→1) flies the screen content out to full frame while the plate recedes —
 * the reference's signature transition between "product in the world" and "inside
 * the product". The plate is a frozen frame on purpose: the UI has to stay
 * registered to the screen while the camera moves, so the camera is ours, not the
 * footage's.
 */
export const DeskScene: React.FC<{
  dive?: number;
  /** Camera transform applied to plate + screen together, e.g. `scale(1.04)`. */
  cameraTransform?: string;
  /** Screenshot or any 1920×1080 node that should live inside the screen. */
  children?: React.ReactNode;
  dim?: number;
}> = ({ dive = 0, cameraTransform = "scale(1)", children, dim = 0 }) => {
  const plateOpacity = lerp(1, 0, Math.min(1, dive / 0.55));
  const w = lerp(SCREEN_IN_STAGE.w, 1920, dive);
  const h = lerp(SCREEN_IN_STAGE.h, 1080, dive);
  const x = lerp(SCREEN_IN_STAGE.x, 0, dive);
  const y = lerp(SCREEN_IN_STAGE.y, 0, dive);
  const radius = lerp(10, 0, dive);
  const cameraWeight = 1 - dive;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#07090d" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: plateOpacity,
          transform: cameraTransform,
          transformOrigin: "center",
          transformStyle: "preserve-3d",
        }}
      >
        <Img
          src={staticFile("plates/desk.png")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Screen glass sits under the UI so any green edge is masked by the bezel colour. */}
        <div
          style={{
            position: "absolute",
            left: `${(SCREEN.x / PLATE.width) * 100}%`,
            top: `${(SCREEN.y / PLATE.height) * 100}%`,
            width: `${(SCREEN.w / PLATE.width) * 100}%`,
            height: `${(SCREEN.h / PLATE.height) * 100}%`,
            background: "#05070a",
            borderRadius: 4,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          overflow: "hidden",
          borderRadius: radius,
          boxShadow: dive > 0 ? undefined : "0 30px 80px rgba(0,0,0,0.45)",
          // Keep the content from scaling with the plate camera once the dive starts.
          transform: `translateZ(0)`,
        }}
      >
        <div
          style={{
            width: 1920,
            height: 1080,
            transformOrigin: "top left",
            transform: `scale(${w / 1920}) translate(${(cameraWeight === 0 ? 0 : 0)}px, 0)`,
          }}
        >
          {children}
        </div>
        {/* Glass reflection: a soft diagonal, never a hard gradient. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 52%)",
            opacity: dive > 0.4 ? 0 : 1,
            pointerEvents: "none",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(4,8,12,${(lerp(0.06, 0.35, dive) + dim) * (1 - dive * 0.9)})`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/** A macOS-style window frame, used once the film moves into product close-ups. */
export const Window: React.FC<{
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  url?: string;
}> = ({ width, height, style, children, url = "gradly-ai.vercel.app" }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: RADIUS.window,
        overflow: "hidden",
        background: color.surface,
        boxShadow: "0 40px 90px rgba(12, 28, 45, 0.28), 0 2px 0 rgba(255,255,255,0.6) inset",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          flex: "0 0 44px",
          background: "#eef1f4",
          borderBottom: `1px solid ${color.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          position: "relative",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 999, background: c }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 15,
            color: color.muted,
            letterSpacing: 0.2,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};
