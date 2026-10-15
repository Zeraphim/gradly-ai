import { lazy, Suspense, useSyncExternalStore } from "react";

const LegacyApp = lazy(() =>
  import("./LegacyApp.js").then((module) => ({ default: module.LegacyApp })),
);
function subscribe(changed: () => void) {
  window.addEventListener("hashchange", changed);
  return () => window.removeEventListener("hashchange", changed);
}

/** One upload-first entry, with the original curated journey preserved. */
export function App() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  return (
    <Suspense
      fallback={
        <main className="app-opening" aria-busy="true">
          <p>Opening Gradly…</p>
        </main>
      }
    >
      <LegacyApp uploadFirst={!hash.startsWith("#/classic")} />
    </Suspense>
  );
}
