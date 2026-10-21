import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";

// Proposed wire values; no backend contract is changed here. Unknown values stay
// unclassified. Never derive suitability from a provider's free-text message.
export type FailureReason =
  | "inaccessible"
  | "invalid_file"
  | "unreadable_scan"
  | "not_applicable"
  | "temporary";

const reasons: FailureReason[] = [
  "inaccessible",
  "invalid_file",
  "unreadable_scan",
  "not_applicable",
  "temporary",
];

export function readFailureReason(value: unknown): FailureReason | undefined {
  return typeof value === "string" && (reasons as string[]).includes(value)
    ? (value as FailureReason)
    : undefined;
}

const headings: Record<FailureReason, string> = {
  inaccessible: "We can’t open this link",
  invalid_file: "This file can’t be used",
  unreadable_scan: "We couldn’t read this scan",
  not_applicable: "This paper needs more research detail",
  temporary: "Preparation was interrupted",
};

/**
 * One recovery surface for intake and preparation. Permanent problems offer
 * the prepared-study library or a different paper as a choice, never an
 * automatic redirect. Retryable problems keep the document and offer retry.
 */
export function FailureRecovery({
  reason,
  message,
  busy,
  onRetry,
  retryLabel = "Try again",
  permanent: permanentOverride,
  heading,
  onChooseFile,
}: {
  reason?: FailureReason;
  message: string;
  busy: boolean;
  onRetry?: () => void;
  retryLabel?: string;
  /** Set when the failure location alone proves the file can't be used. */
  permanent?: boolean;
  heading?: string;
  /** Opens the file picker in place instead of returning to the home page. */
  onChooseFile?: () => void;
}) {
  const permanent =
    permanentOverride ?? (reason !== undefined && reason !== "temporary");
  const choices = (
    <div className="failure-choices">
      <p>Do you want to try one of our prepared studies?</p>
      <div className="actions">
        <Link className="btn primary compact" href="/learn">
          <ActionLabel icon="research">View prepared studies</ActionLabel>
        </Link>
        {onChooseFile ? (
          <button
            className="btn outline compact"
            disabled={busy}
            onClick={onChooseFile}
          >
            Upload a different paper
          </button>
        ) : (
          <a className="btn outline compact" href="#/">
            Upload a different paper
          </a>
        )}
      </div>
    </div>
  );
  return (
    <section
      className={`failure-recovery ${permanent ? "is-permanent" : "is-retryable"}`}
      aria-label="Recovery options"
    >
      <span className="failure-recovery-icon" aria-hidden="true">
        <Icon name={permanent ? "document" : "retry"} size={20} />
      </span>
      <div className="failure-recovery-body">
        <h2>
          {heading ??
            (reason ? headings[reason] : "We couldn’t finish this step")}
        </h2>
        <p role="alert">{message}</p>
        {!permanent && onRetry ? (
          <>
            <p className="failure-recovery-note">
              Your document is still saved. Retry when you’re ready.
            </p>
            <div className="actions">
              <button
                className="btn primary compact"
                disabled={busy}
                onClick={onRetry}
              >
                <ActionLabel busy={busy} icon="retry">
                  {retryLabel}
                </ActionLabel>
              </button>
            </div>
            <details className="failure-alternatives">
              <summary>Explore another study instead</summary>
              {choices}
            </details>
          </>
        ) : (
          choices
        )}
      </div>
    </section>
  );
}
