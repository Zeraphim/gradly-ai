import { useEffect, useState } from "react";
import { AppLoading } from "../../components/AppLoading.js";
import { BrandLogo } from "../../components/BrandLogo.js";
import { readReducedMotion } from "../client-state.js";
import { ResearchLink as Link } from "../navigation.js";
import { SceneMotion } from "../scenes/scene-motion.js";
import { findCard, loadStudy } from "./catalog.js";
import { JourneyPlayer } from "./JourneyPlayer.js";
import {
  freshProgress,
  useAllProgress,
  useShowUnreviewed,
} from "./progress.js";
import { StudyLibrary } from "./StudyLibrary.js";
import type { PreparedStudy } from "./types.js";
import "./studies.css";

/**
 * Browser-only prepared-study preview: `/studies` lists studies and
 * `/studies/<slug>` plays one. Answers are checked against authored keys in this
 * tab; the server-assessed path arrives when uploaded papers share this player.
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
  const showUnreviewed = useShowUnreviewed();
  const blocked = !!card && !card.reviewed && !showUnreviewed;
  // A hidden study's body is never fetched; a missing body shows the recovery screen.
  const [loaded, setLoaded] = useState<{
    slug: string;
    study: PreparedStudy | null;
  } | null>(null);
  useEffect(() => {
    if (!card || blocked) return;
    let live = true;
    loadStudy(card.slug).then(
      (study) => live && setLoaded({ slug: card.slug, study }),
      () => live && setLoaded({ slug: card.slug, study: null }),
    );
    return () => {
      live = false;
    };
  }, [card, blocked]);
  const loading = !!card && !blocked && loaded?.slug !== card.slug;
  const study = !blocked && loaded?.slug === slug ? loaded.study : null;
  useEffect(() => {
    document.title = `${card ? card.teaser : "Prepared studies"} · Gradly`;
  }, [card]);
  const playing = study && (all[study.slug]?.phase ?? "intro") !== "intro";
  return (
    <SceneMotion reduced={readReducedMotion()}>
      <div className={`studies ${playing ? "is-playing" : ""}`}>
        {playing ? null : (
          <header className="header">
            <div className="nav preview-nav">
              <a
                className="brand"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onExit();
                }}
              >
                <BrandLogo />
              </a>
              <Link href="/studies">All studies</Link>
              <span className="mode-pill">Frontend preview</span>
            </div>
          </header>
        )}
        {loading ? (
          <AppLoading label="Opening study…" />
        ) : study ? (
          <JourneyPlayer
            study={study}
            progress={all[study.slug] ?? freshProgress()}
          />
        ) : slug ? (
          <main className="library">
            <div className="library-empty">
              <h1 tabIndex={-1}>This study isn’t available</h1>
              <p>
                {blocked
                  ? "It is waiting for content review. Turn on unreviewed studies in the library to preview it."
                  : "The link may be out of date."}
              </p>
              <Link className="journey-begin" href="/studies">
                Browse studies
              </Link>
            </div>
          </main>
        ) : (
          <StudyLibrary />
        )}
      </div>
    </SceneMotion>
  );
}
