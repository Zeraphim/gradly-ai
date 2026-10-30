import { useEffect } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Loads the brand face before the first frame is captured.
 * Remotion renders offline, so the font must come from `public/fonts`, not a CDN.
 */
export const Fonts: React.FC = () => {
  const handle = delayRender("Loading Plus Jakarta Sans");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: "Plus Jakarta Sans";
        font-style: normal;
        font-weight: 200 800;
        src: url("${staticFile("fonts/plus-jakarta-sans.woff2")}") format("woff2");
      }
      @font-face {
        font-family: "Plus Jakarta Sans";
        font-style: italic;
        font-weight: 200 800;
        src: url("${staticFile("fonts/plus-jakarta-sans-italic.woff2")}") format("woff2");
      }
    `;
    document.head.appendChild(style);

    Promise.all([
      document.fonts.load('400 100px "Plus Jakarta Sans"'),
      document.fonts.load('600 100px "Plus Jakarta Sans"'),
      document.fonts.load('800 100px "Plus Jakarta Sans"'),
    ])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));

    return () => {
      style.remove();
    };
  }, [handle]);

  return null;
};
