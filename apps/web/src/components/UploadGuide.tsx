import { useSyncExternalStore } from "react";
import { Mascot } from "./Mascot.js";
import {
  readReducedMotion,
  subscribeReducedMotion,
} from "../research/client-state.js";

const preference = "(prefers-reduced-motion: reduce)";
function subscribe(changed: () => void) {
  const media = window.matchMedia(preference);
  media.addEventListener("change", changed);
  document.addEventListener("visibilitychange", changed);
  const unsubscribe = subscribeReducedMotion(changed);
  return () => {
    media.removeEventListener("change", changed);
    document.removeEventListener("visibilitychange", changed);
    unsubscribe();
  };
}
function still() {
  return (
    readReducedMotion() ||
    window.matchMedia(preference).matches ||
    document.visibilityState === "hidden"
  );
}

/** The Gradly guide animation is owned only by the upload-first introduction. */
export function UploadGuide() {
  const reduced = useSyncExternalStore(subscribe, still, () => true);
  return reduced ? (
    <Mascot pose="guiding" />
  ) : (
    <div
      className="mascot mascot-normal upload-guide-animated"
      aria-hidden="true"
    >
      <img
        src="/brand/mascot-guiding-animated.svg"
        alt=""
        width="375"
        height="372"
      />
    </div>
  );
}
