import React, { useId } from "react";

// Viewports select the supplied artwork without including neighboring poses.
const poses = {
  teaching: "102 13 408 349",
  approving: "590 14 347 347",
  reading: "1069 11 284 356",
  celebrating: "111 368 371 328",
  thinking: "610 370 323 330",
  guiding: "1071 369 339 336",
  caring: "156 698 325 326",
  determined: "609 701 335 323",
  studying: "1080 705 279 319",
} as const;
export type MascotPose = keyof typeof poses;

export function Mascot({
  pose = "guiding",
  size = "normal",
}: {
  pose?: MascotPose;
  size?: "small" | "normal" | "large";
}) {
  const clipId = useId();
  const [x, y, width, height] = poses[pose].split(" ").map(Number);
  return (
    <div className={"mascot mascot-" + size} aria-hidden="true">
      <span
        key={pose}
        className={pose === "celebrating" ? "mascot-celebrate" : "mascot-pose"}
      >
        <svg viewBox={poses[pose]} width="120" height="120" data-pose={pose}>
          <defs>
            <clipPath id={clipId}>
              <rect x={x} y={y} width={width} height={height} />
            </clipPath>
          </defs>
          <image
            href="/brand/gradly-sprites.png"
            width="1536"
            height="1024"
            clipPath={"url(#" + clipId + ")"}
          />
        </svg>
      </span>
    </div>
  );
}
