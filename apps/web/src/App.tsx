import { lazy, Suspense, useSyncExternalStore } from "react";

const PaperLab = lazy(() =>
  import("./research/PaperLab.js").then((module) => ({
    default: module.PaperLab,
  })),
);
const LegacyApp = lazy(() =>
  import("./LegacyApp.js").then((module) => ({ default: module.LegacyApp })),
);
function subscribe(changed: () => void) {
  window.addEventListener("hashchange", changed);
  return () => window.removeEventListener("hashchange", changed);
}

/** One public paper-exploration mode; old saved links remain compatible. */
export function App() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const legacy =
    hash.startsWith("#/classic") ||
    (hash.startsWith("#/research") && !/^#\/research\/lab(?:\/|$)/.test(hash));
  return (
    <Suspense
      fallback={
        <main className="app-opening" aria-busy="true">
          <p>Opening your paper trail…</p>
        </main>
      }
    >
      {legacy ? <LegacyApp /> : <PaperLab />}
    </Suspense>
  );
}
