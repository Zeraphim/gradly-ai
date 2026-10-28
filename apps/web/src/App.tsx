import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { AppLoading } from "./components/AppLoading.js";
import { ChunkBoundary } from "./components/ChunkBoundary.js";
import { SiteFooter, SiteHeader } from "./components/SiteChrome.js";
import { Welcome } from "./components/Welcome.js";
import { linkNotePdf, linkNotesAllowed } from "./research/link-note.js";
import {
  readReducedMotion,
  subscribeReducedMotion,
} from "./research/client-state.js";
import { useResearchConfig } from "./research/useResearchConfig.js";

const ResearchApp = lazy(() =>
  import("./research/ResearchApp.js").then((m) => ({ default: m.ResearchApp })),
);
function subscribe(changed: () => void) {
  window.addEventListener("hashchange", changed);
  return () => window.removeEventListener("hashchange", changed);
}

/** Upload first; one library, with recovery for retired sample entry points. */
export function App() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
  const retired =
    /^#\/(?:classic(?:\/.*)?|research\/?|research\/(?:studies\/?|(?:featured|home)\/?|meet(?:\/.*)?|lab(?:\/.*)?))$/.test(
      hash,
    );
  const research = hash.startsWith("#/research");
  const configuration = useResearchConfig();
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const sync = () => {
      const reduced = String(readReducedMotion());
      if (document.documentElement.dataset.reducedMotion !== reduced)
        document.documentElement.dataset.reducedMotion = reduced;
    };
    sync();
    return subscribeReducedMotion(sync);
  }, []);
  useEffect(() => {
    // History navigation can return home without calling the header callback.
    // The original File has already been handed to the mounted workspace.
    if (!research && !retired) setFile(null);
    if (retired) {
      window.history.replaceState(null, "", "#/research/learn");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, retired]);
  const home = () => {
    setFile(null);
    window.location.hash = "/";
  };
  const library = () => {
    setFile(null);
    window.location.hash = "/research/learn";
  };
  const upload = (next: File) => {
    setFile(next);
    window.location.hash = "/research/upload";
  };
  if (research || retired)
    return (
      <ChunkBoundary label="The research workspace">
        <Suspense fallback={<AppLoading label="Opening Gradly…" />}>
          <ResearchApp
            initialFile={file}
            configuration={configuration}
            onExit={home}
          />
        </Suspense>
      </ChunkBoundary>
    );
  return (
    <div className="app-shell upload-home-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <SiteHeader current="upload" onHome={home} />
      <Welcome
        onStart={library}
        onResearchFile={upload}
        onResearchLink={(link) =>
          linkNotesAllowed(configuration.config)
            ? upload(linkNotePdf(link))
            : library()
        }
      />
      <SiteFooter />
    </div>
  );
}
