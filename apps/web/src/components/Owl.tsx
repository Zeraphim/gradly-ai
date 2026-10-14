import React from "react";
export function Owl({
  size = "normal",
  celebrate = false,
}: {
  size?: "small" | "normal" | "large";
  celebrate?: boolean;
}) {
  return (
    <div
      className={`owl owl-${size} ${celebrate ? "owl-celebrate" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" fill="none">
        <path
          d="M23 75C20 44 27 20 60 20s40 24 37 55c-2 23-20 36-37 36S25 98 23 75Z"
          fill="#58cc02"
        />
        <path d="M25 57 11 71l17 7M95 57l14 14-17 7" fill="#2b6c00" />
        <path
          d="M34 77c0-20 12-29 26-29s26 9 26 29c0 17-12 26-26 26S34 94 34 77Z"
          fill="#a3ed63"
        />
        <circle cx="44" cy="61" r="17" fill="white" />
        <circle cx="76" cy="61" r="17" fill="white" />
        <circle cx="46" cy="62" r="9" fill="#1b1c1c" />
        <circle cx="74" cy="62" r="9" fill="#1b1c1c" />
        <circle cx="49" cy="58" r="3" fill="white" />
        <circle cx="77" cy="58" r="3" fill="white" />
        <circle cx="44" cy="61" r="17" stroke="#173e00" strokeWidth="3" />
        <circle cx="76" cy="61" r="17" stroke="#173e00" strokeWidth="3" />
        <path d="M59 61h2" stroke="#173e00" strokeWidth="3" />
        <path d="m60 71-7 1 7 9 7-9Z" fill="#ddad00" />
        <path d="m18 27 42-15 42 15-42 14Z" fill="#006590" />
        <path d="m29 27 31-10 31 10-31 10Z" fill="#2fb8ff" />
        <path d="M41 35v9c12-7 26-7 38 0v-9" fill="#006590" />
        <path d="M97 29v19" stroke="#ddad00" strokeWidth="3" />
        <circle cx="97" cy="51" r="4" fill="#ddad00" />
        <path
          d="m43 106-5 7m39-7 5 7"
          stroke="#755b00"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
