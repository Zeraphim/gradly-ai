import { m, useSceneMotion } from "../scenes/scene-motion.js";

/** The single completion moment: rings and sparks, once, never on restore. */
export function Burst() {
  const motion = useSceneMotion();
  if (motion.still) return null;
  const sparks = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
  return (
    <svg
      className="journey-burst"
      viewBox="-100 -100 200 200"
      aria-hidden="true"
    >
      {[0, 1].map((ring) => (
        <m.circle
          key={ring}
          r="40"
          fill="none"
          stroke={ring ? "#1cb0f6" : "#ffc845"}
          strokeWidth="4"
          initial={{ scale: 0.4, opacity: 0.9 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: ring * 0.12 }}
        />
      ))}
      {sparks.map((angle, i) => (
        <m.circle
          key={angle}
          r={i % 2 ? 4 : 6}
          fill={["#1cb0f6", "#ffc845", "#58cc9b", "#ff8a65"][i % 4]}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
          animate={{
            x: Math.cos(angle) * 88,
            y: Math.sin(angle) * 88,
            opacity: 0,
            scale: 1,
          }}
          transition={{ duration: 0.75, ease: [0.2, 0.7, 0.3, 1], delay: 0.05 }}
        />
      ))}
    </svg>
  );
}
