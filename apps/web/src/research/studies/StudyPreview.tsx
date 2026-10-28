import { useEffect, useState } from "react";
import { AppLoading } from "../../components/AppLoading.js";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome.js";
import { readReducedMotion } from "../client-state.js";
import { ResearchLink as Link } from "../navigation.js";
import { SceneMotion } from "../scenes/scene-motion.js";
import { findCard, loadStudy } from "./catalog.js";
import { JourneyPlayer } from "./JourneyPlayer.js";
import {
  freshProgress,
  useAllProgress,
  useOutdatedProgress,
} from "./progress.js";
import { StudyLibrary } from "./StudyLibrary.js";
import type { PreparedStudy } from "./types.js";
import "./studies.css";

/**
 * The Learn library and `/studies/<slug>` prepared player. Prepared answers
 * are checked against authored keys in this tab; uploaded sessions use the
 * separate server-backed UploadedJourney driver.
 */
export function StudyPreview({
  path,
  onExit,
}: {
  path: string;
  onExit: () => void;
}) {
  const slug = /^\/studies\/([a-z0-9-]+)\/?$/.exec(path)?.[1] ?? null;
  const card = slug ? findCard(slug) : null;
  const all = useAllProgress();
  const outdated = useOutdatedProgress(slug);
  // A missing body shows the recovery screen.
  const [loaded, setLoaded] = useState<{
    slug: string;
    study: PreparedStudy | null;
  } | null>(null);
  useEffect(() => {
    if (!card) return;
    let live = true;
    loadStudy(card.slug).then(
      (study) => live && setLoaded({ slug: card.slug, study }),
      () => live && setLoaded({ slug: card.slug, study: null }),
    );
    return () => {
      live = false;
    };
  }, [card]);
  const loading = !!card && loaded?.slug !== card.slug;
  const study = loaded?.slug === slug ? loaded.study : null;
  useEffect(() => {
    document.title = `${card ? card.teaser : "Prepared studies"} · Gradly`;
  }, [card]);
  const playing = study && (all[study.slug]?.phase ?? "intro") !== "intro";
  return (
    <SceneMotion reduced={readReducedMotion()}>
      <div className={`studies ${playing ? "is-playing" : ""}`}>
        {playing ? null : (
          <>
            <a
              className="skip"
              href="#main"
              onClick={(event) => {
                event.preventDefault();
                document.querySelector<HTMLElement>(".studies main")?.focus();
              }}
            >
              Skip to content
            </a>
            <SiteHeader current="studies" onHome={onExit} />
          </>
        )}
        {loading ? (
          <AppLoading label="Opening study…" />
        ) : study ? (
          <JourneyPlayer
            study={study}
            progressNotice={
              outdated
                ? "These questions have changed. Begin again to answer the updated study; your other saved studies are unchanged."
                : undefined
            }
            progress={all[study.slug] ?? freshProgress()}
          />
        ) : slug ? (
          <main id="main" className="library" tabIndex={-1}>
            <div className="library-empty">
              <h1 tabIndex={-1}>This study isn’t available</h1>
              <p>The link may be out of date.</p>
              <Link className="journey-begin" href="/studies">
                Browse studies
              </Link>
            </div>
          </main>
        ) : (
          <StudyLibrary />
        )}
        {!slug ? <SiteFooter /> : null}
      </div>
    </SceneMotion>
  );
}
