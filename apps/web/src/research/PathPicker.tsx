import type { RefObject } from "react";
import { ResearchLink as Link } from "./navigation.js";
import { Mascot } from "./learning-ui.js";
import { ActionLabel, Icon } from "./icon.js";
import type { ResearchConfig } from "./types.js";
import { textingQuest } from "./texting-quest.js";

// Start quest opens the authored texting quest; count its required decisions.
const questDecisions = textingQuest.filter(
  (screen) => screen.kind === "choice" && !screen.optional,
).length;

export function PathPicker({
  config,
  busy,
  heading,
  onStart,
}: {
  config: ResearchConfig;
  busy: boolean;
  heading: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  return (
    <>
      <section className="welcome">
        <div className="path-intro">
          <Mascot small />
        </div>
        <span className="tag">Prepared studies</span>
        <h1 ref={heading} tabIndex={-1}>
          Think like a researcher.
        </h1>
        <p>Start with the guided quest, or bring your own paper.</p>
        <div className="path-grid">
          <article className="path-card featured-card">
            <div className="symbol blue">
              <Icon name="phone" />
            </div>
            <span className="tag">Start here · guided quest</span>
            <h2>
              Can You Text
              <br />
              and Still Learn?
            </h2>
            <p>
              Explore a classroom experiment. Make your research decisions, then
              discover what the evidence says.
            </p>
            <div className="pills">
              <span>{questDecisions} decisions</span>
              <span>Optional bonus</span>
              <span>No API key needed</span>
            </div>
            <button
              disabled={busy}
              className="btn primary"
              aria-busy={busy}
              onClick={onStart}
            >
              <ActionLabel busy={busy}>
                {busy ? "Opening…" : "Start quest"}
              </ActionLabel>
            </button>
          </article>
          <article className="path-card">
            <div className="symbol green">
              <Icon name="document" />
            </div>
            <span className="tag">Bring your own paper</span>
            <h2>
              Your paper.
              <br />A new perspective.
            </h2>
            <p>
              {config.liveAI
                ? "Bring an empirical research PDF. Review its evidence, then let Gradly build and check your quest."
                : "Check your PDF and walk through processing, learning and review with a clearly labeled sample study."}
            </p>
            <div className="pills">
              <span>Page-linked evidence</span>
              <span>
                {config.liveAI
                  ? "Live AI ready"
                  : config.demoAvailable
                    ? "Sample preview available"
                    : "Live AI needed"}
              </span>
            </div>
            <Link className="btn outline" href="/upload">
              <ActionLabel icon="upload">Upload a research paper</ActionLabel>
            </Link>
          </article>
        </div>
        {/* Secondary practice stays below the two main paths. */}
        <nav className="path-more" aria-label="More practice">
          <span>More practice</span>
          <div className="path-more-item">
            <Link href="/reasoning">Try the reasoning preview</Link>
            <small>Choose → explain → check evidence → revise</small>
          </div>
          <div className="path-more-item">
            <Link href="/studies">Browse prepared studies</Link>
            <small>Short runs of research decisions on real papers</small>
          </div>
        </nav>
      </section>
    </>
  );
}
