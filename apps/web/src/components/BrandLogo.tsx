import React, { useId } from "react";

export function BrandLogo() {
  const clipId = useId();
  return (
    <svg
      className="brand-logo"
      viewBox="505 480 1740 585"
      width="174"
      height="59"
      role="img"
      aria-label="Gradly"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="505" y="480" width="1740" height="585" />
        </clipPath>
      </defs>
      <image
        href="/brand/gradly-logo.png"
        width="2752"
        height="1536"
        clipPath={"url(#" + clipId + ")"}
      />
    </svg>
  );
}
