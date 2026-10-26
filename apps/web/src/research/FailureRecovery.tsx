import type { ProcessingJob } from "./types.js";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";

// One reason list for intake and preparation. `timeout`, `output_limit` and
// `not_applicable` are the stage `errorCode` values the server saves on a
// failed audit; the other four are proposed wire values (not yet sent by the
// server). Unknown values stay unclassified. Never derive suitability from
// free-text messages.
export type FailureReason =
  | "inaccessible"
  | "invalid_file"
  | "unreadable_scan"
  | "not_applicable"
  | "temporary"
  | "timeout"
  | "output_limit";

const reasons: FailureReason[] = [
  "inaccessible",
  "invalid_file",
  "unreadable_scan",
  "not_applicable",
  "temporary",
  "timeout",
  "output_limit",
];

export function readFailureReason(value: unknown): FailureReason | undefined {
  return typeof value === "string" && (reasons as string[]).includes(value)
    ? (value as FailureReason)
    : undefined;
}

/** The failed stage's saved `errorCode`, else a proposed job-level reason. */
export function jobFailureReason(job: ProcessingJob) {
  const failed = job.audits[job.stage] ?? job.audits.find((a) => a.errorCode);
  return (
    readFailureReason(failed?.errorCode) ??
    readFailureReason((job as { reason?: unknown }).reason)
  );
}

/** Both stage codes are retryable: the model call can succeed next time. */
const retryable = new Set<FailureReason>([
  "temporary",
  "timeout",
  "output_limit",
]);

const headings: Record<FailureReason, string> = {
  inaccessible: "We can’t open this link",
  invalid_file: "This file can’t be used",
  unreadable_scan: "We couldn’t read this scan",
  not_applicable: "This paper needs more research detail",
  temporary: "Preparation was interrupted",
  timeout: "The AI took too long on this step",
  output_limit: "This step needed a longer answer than the AI can give",
};

/** Plain explanations for the stage codes; their server text moves to a disclosure. */
const explanations: Partial<Record<FailureReason, string>> = {
  timeout:
    "Nebius didn’t answer in time, even after one automatic retry. Busy moments usually pass, so trying again often works.",
  output_limit:
    "Long or dense papers can produce more than one AI answer can hold. Each attempt is drafted fresh, so a retry often fits. If it happens again, a shorter paper or a prepared study will work better.",
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
    permanentOverride ?? (reason !== undefined && !retryable.has(reason));
  // An unsuitable paper may still pass on another attempt, so retry stays
  // available next to the prepared studies.
  const offerRetry = !!onRetry && (!permanent || reason === "not_applicable");
  const explanation = reason ? explanations[reason] : undefined;
  const choices = (
    <div className="failure-choices">
      <p>Do you want to try one of our prepared studies?</p>
      <div className="actions">
        <Link className="btn primary compact" href="/meet/featured">
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
        {explanation ? (
          <>
            <p role="alert">{explanation}</p>
            <details className="failure-detail">
              <summary>Technical detail</summary>
              <p>{message}</p>
            </details>
          </>
        ) : (
          <p role="alert">{message}</p>
        )}
        {offerRetry ? (
          <>
            <p className="failure-recovery-note">
              {reason === "timeout" || reason === "output_limit"
                ? "Your paper and finished steps are saved. Only this step runs again."
                : "Your document is still saved. Retry when you’re ready."}
            </p>
            <div className="actions">
              <button
                className={`btn ${permanent ? "outline" : "primary"} compact`}
                disabled={busy}
                onClick={onRetry}
              >
                <ActionLabel busy={busy} icon="retry">
                  {retryLabel}
                </ActionLabel>
              </button>
            </div>
            {permanent ? (
              <div className="failure-alternatives">{choices}</div>
            ) : (
              <details className="failure-alternatives">
                <summary>Explore another study instead</summary>
                {choices}
              </details>
            )}
          </>
        ) : (
          choices
        )}
      </div>
    </section>
  );
}
