import { Img, staticFile } from "remotion";
import { color, RADIUS } from "../theme";
import { useFloat, usePop } from "../lib/motion";

type BadgeProps = {
  /** Frame (relative to the parent sequence) at which the badge pops in. */
  at: number;
  /** Frame at which it leaves again, if any. */
  until?: number;
  x: number;
  y: number;
  size?: number;
  background: string;
  /** Mascot art, icon node, or nothing for a plain colour dot. */
  children?: React.ReactNode;
  label?: string;
  floatPhase?: number;
  ring?: string;
};

/**
 * The floating circular chips from the reference: an avatar or glyph in a
 * solid disc, hovering with an idle drift and a spring entrance.
 */
export const Badge: React.FC<BadgeProps> = ({
  at,
  until,
  x,
  y,
  size = 112,
  background,
  children,
  label,
  floatPhase = 0,
  ring,
}) => {
  const { opacity, scale, progress } = usePop(at, "pop", until);
  const float = useFloat(7, 0.55, floatPhase);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) translateY(${float * progress}px) scale(${scale})`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RADIUS.chip,
        background,
        boxShadow: ring
          ? `0 0 0 6px ${ring}, 0 18px 34px rgba(15, 34, 51, 0.22)`
          : "0 18px 34px rgba(15, 34, 51, 0.22)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: size * 0.58,
          height: size * 0.58,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
      {label ? (
        <div
          style={{
            position: "absolute",
            bottom: -46,
            whiteSpace: "nowrap",
            background: color.ink,
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            padding: "9px 16px",
            borderRadius: 999,
            opacity: progress,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Mascot chip helper: keeps every mascot cropped to the disc the same way. */
export const MascotChip: React.FC<BadgeProps & { mascot: string; background?: string }> = ({
  mascot,
  background = color.accentSoft,
  size = 112,
  ...rest
}) => (
  <Badge {...rest} size={size} background={background}>
    <Img
      src={staticFile(`brand/${mascot}.webp`)}
      style={{ width: size * 0.72, height: size * 0.72, objectFit: "contain" }}
    />
  </Badge>
);
