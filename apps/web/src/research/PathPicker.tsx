import type { RefObject } from "react";
import { ResearchLink as Link } from "./navigation.js";
import { Mascot } from "./learning-ui.js";
import { ActionLabel, Icon } from "./icon.js";
import type { ResearchConfig } from "./types.js";

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
      <div className="path-intro">
        <Mascot small />
        <p>Small decisions. Deeper understanding.</p>
        <span className="tag">Your research companion</span>
      </div>
      <section className="welcome">
        <span className="tag">Your research-learning companion</span>
        <h1 ref={heading} tabIndex={-1}>
          Think like a researcher.
        </h1>
        <p>
          Start with a guided investigation, or explore the journey with your
          own PDF.
        </p>
        <div className="path-grid">
          <article className="path-card featured-card">
            <div className="symbol blue">
              <Icon name="phone" />
            </div>
            <span className="tag">Start here · guided investigation</span>
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
              <span>8 challenges</span>
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
                {busy ? "Opening…" : "Start investigation"}
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
                ? "Bring an empirical research PDF. Review its evidence, then let Gradly build and check your investigation."
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
        <p className="quiet">
          Decisions first. Findings next. Understanding throughout.
        </p>
      </section>
    </>
  );
}
