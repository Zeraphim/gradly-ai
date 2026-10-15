import React from "react";

/**
 * Branded, full-viewport screen shown while a code-split section loads.
 * Centered on every width so a slow connection never flashes a bare,
 * top-left paragraph on wide screens.
 */
export function AppLoading({ label = "Opening Gradly…" }: { label?: string }) {
  return (
    <main className="app-opening" aria-busy="true">
      <div className="app-opening-inner">
        <svg
          className="app-opening-mark"
          viewBox="0 0 64 64"
          width="58"
          height="58"
          aria-hidden="true"
        >
          <g
            stroke="#233553"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m24 55-2 6q5 1 7-6m14 0-1 6q5 1 7-7" fill="#233553" />
            <path d="M16 26q-3 0-3 5l2 23q1 5 6 5l32-5-1-5" fill="#087fac" />
            <path
              d="m16 42-8 8q-2 4 2 4l9-6m30-7 8 6q5 2 4 5l-10-2"
              fill="#12acd6"
            />
            <path
              d="m19 25 6-1q8-3 12 0l9-4q6-2 7 4l3 25q0 4-5 4l-30 4Z"
              fill="#13b2dc"
            />
            <path d="m20 26 3 28" fill="none" stroke="#087fac" />
            <path d="m22 52 28-4q3 0 4 3l-1 4-30 4q-5 0-5-3t4-4Z" fill="#fff" />
            <path d="M21 17q10-7 20-3l3 8q-10-3-17 3l-6-2Z" fill="#30395f" />
            <path d="m9 31-3 9 7-1-2-9" fill="#13b2dc" />
            <circle cx="10" cy="29" r="3" fill="#13b2dc" />
          </g>
          <ellipse cx="30" cy="35" rx="4" ry="5" fill="#233553" />
          <ellipse cx="44" cy="33" rx="4" ry="5" fill="#233553" />
          <circle cx="31" cy="33" r="1.6" fill="#fff" />
          <circle cx="45" cy="31" r="1.6" fill="#fff" />
          <path d="M34 41q4 2 8-1-1 9-7 5Z" fill="#233553" />
        </svg>
        <span className="app-opening-spinner" aria-hidden="true" />
        <p role="status">{label}</p>
      </div>
    </main>
  );
}
