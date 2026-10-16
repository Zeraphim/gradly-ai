import { useSyncExternalStore } from "react";
import { LegacyApp } from "./LegacyApp.js";

function subscribe(changed: () => void) {
  window.addEventListener("hashchange", changed);
  return () => window.removeEventListener("hashchange", changed);
}

/**
 * One upload-first entry, with the original curated journey preserved.
 *
 * LegacyApp is imported eagerly rather than code-split: it is the first
 * meaningful paint for the common routes, so loading it up front avoids an
 * intermediate "Opening Gradly…" screen flashing on every refresh.
 */
export function App() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  return <LegacyApp uploadFirst={!hash.startsWith("#/classic")} />;
}
