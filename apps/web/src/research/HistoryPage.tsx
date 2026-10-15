import type { RefObject } from "react";
import { ResearchLink as Link } from "./navigation.js";
import { Mascot } from "./learning-ui.js";
import { ActionLabel, Icon } from "./icon.js";
import type { AdventureRecord, DocumentRecord } from "./types.js";

type HistoryPageProps = {
  heading: RefObject<HTMLHeadingElement | null>;
  history: AdventureRecord[];
  documents: DocumentRecord[];
  status: "loading" | "error" | "ready";
  onRetry: () => void;
  onDelete: (id: string) => void;
  busy: boolean;
};

export function HistoryPage({
  heading,
  history,
  documents,
  status,
  onRetry,
  onDelete,
  busy,
}: HistoryPageProps) {
  return (
    <div className="history-page">
      <header className="workspace-heading">
        <span className="tag">Your learning journey</span>
        <h1 ref={heading} tabIndex={-1}>
          Previous Adventures
        </h1>
        <p>Your progress belongs to this browser’s guest profile.</p>
      </header>

      {status === "loading" ? (
        <div className="card history-state" role="status">
          <Icon name="loading" size={22} className="is-spinning" />
          <p>Loading your adventures…</p>
        </div>
      ) : status === "error" ? (
        <div className="card history-state">
          <span className="symbol blue">
            <Icon name="retry" />
          </span>
          <h2>Your adventures couldn’t be loaded.</h2>
          <p>
            We couldn’t refresh your saved adventures. Try again when you’re
            connected.
          </p>
          <button className="btn primary" onClick={onRetry}>
            <ActionLabel icon="retry">Try again</ActionLabel>
          </button>
        </div>
      ) : (
        <>
          {busy ? (
            <p role="status" className="quiet">
              Deleting your document…
            </p>
          ) : null}
          <section
            className="history-section"
            aria-labelledby="saved-investigations-title"
          >
            {history.length ? (
              <>
                <div className="section-heading">
                  <div>
                    <span className="tag">Answers and progress</span>
                    <h2 id="saved-investigations-title">Your investigations</h2>
                  </div>
                  <span className="quiet">{history.length} saved</span>
                </div>
                <div className="history-list">
                  {history.map((adventure) => (
                    <article
                      className="history-card card"
                      key={adventure.id}
                      aria-labelledby={`adventure-${adventure.id}`}
                    >
                      <div>
                        <span className="tag">
                          {adventure.source === "demo"
                            ? "Sample preview · "
                            : ""}
                          {adventure.phase === "complete"
                            ? "Completed"
                            : "In progress"}
                        </span>
                        <h3 id={`adventure-${adventure.id}`}>
                          {adventure.title}
                        </h3>
                        <p>
                          Started{" "}
                          <time dateTime={adventure.created}>
                            {new Date(adventure.created).toLocaleDateString()}
                          </time>
                        </p>
                      </div>
                      <Link
                        className="btn outline"
                        href={`/adventure/${adventure.id}`}
                      >
                        <ActionLabel>
                          {adventure.phase === "complete"
                            ? "Review adventure"
                            : "Resume investigation"}
                        </ActionLabel>
                      </Link>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="card history-state">
                <Mascot small />
                <h2 id="saved-investigations-title">
                  Your next investigation starts here.
                </h2>
                <p>
                  Adventures appear here after you begin. Every submitted
                  decision is saved.
                </p>
                <Link className="btn primary" href="/learn">
                  <ActionLabel>Choose a learning path</ActionLabel>
                </Link>
              </div>
            )}
          </section>

          <section
            className="history-section"
            aria-labelledby="uploaded-documents-title"
          >
            <div className="section-heading">
              <div>
                <span className="tag">Your source material</span>
                <h2 id="uploaded-documents-title">Your uploaded documents</h2>
              </div>
              {documents.length ? (
                <span className="quiet">{documents.length} saved</span>
              ) : null}
            </div>
            <p className="quiet">
              Review processing or delete a document and its linked adventures.
            </p>
            {documents.length ? (
              <div className="history-list">
                {documents.map((document) => (
                  <article
                    className="history-card card"
                    key={document.id}
                    aria-labelledby={`document-${document.id}`}
                  >
                    <div>
                      <h3 id={`document-${document.id}`}>{document.name}</h3>
                      <p>
                        {document.pages} extracted{" "}
                        {document.pages === 1 ? "page" : "pages"} ·{" "}
                        {document.status}
                      </p>
                    </div>
                    <div className="actions">
                      <Link
                        className="btn outline compact"
                        href={`/processing/${document.id}`}
                      >
                        <ActionLabel icon="document">
                          View processing
                        </ActionLabel>
                      </Link>
                      <button
                        className="btn danger compact"
                        disabled={busy}
                        onClick={() => onDelete(document.id)}
                      >
                        Delete document
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card history-state document-empty">
                <span className="symbol blue">
                  <Icon name="document" />
                </span>
                <p>No uploaded document records.</p>
                <Link className="btn outline" href="/upload">
                  <ActionLabel icon="upload">
                    Upload a research paper
                  </ActionLabel>
                </Link>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
