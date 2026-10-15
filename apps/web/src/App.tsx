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

/** Upload first. Authored paper examples remain available at their saved URLs. */
export function App() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const paperExample = /^#\/research\/lab\/.+/.test(hash);
  return (
    <Suspense
      fallback={
        <main className="app-opening" aria-busy="true">
          <p>Opening Gradly…</p>
        </main>
      }
    >
      {paperExample ? (
        <PaperLab />
      ) : (
        <LegacyApp uploadFirst={!hash.startsWith("#/classic")} />
      )}
    </Suspense>
  );
}
