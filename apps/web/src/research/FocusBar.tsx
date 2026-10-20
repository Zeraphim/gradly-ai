import { CircleHelp } from "lucide-react";
import { Icon } from "./icon.js";

export type JourneyStep = number;
/** The upload journey; a library start uses its own shorter list. */
export const uploadSteps = ["Upload", "Prepare", "Investigate"];
export const libraryJourneySteps = ["Choose a study", "Investigate"];

/**
 * The slim bar for the paper journey. Like a lesson screen, it drops the site
 * navigation: the brand mark and the journey stepper sit top-left, the exit
 * top-right, and nothing else competes with the task.
 */
export function FocusBar({
  step,
  steps = uploadSteps,
  sample = false,
  onExit,
  onHome = onExit,
  exitLabel = "Exit to home",
  children,
}: {
  exitLabel?: string;
  /** The brand always returns home, even when exit goes elsewhere. */
  onHome?: () => void;
  step: JourneyStep;
  steps?: string[];
  sample?: boolean;
  onExit: () => void;
  /** Optional right-side content, such as practice points. */
  children?: React.ReactNode;
}) {
  return (
    <header className="focus-bar">
      <div className="focus-bar-inner">
        <a
          className="focus-brand"
          href="#/"
          aria-label="Gradly home"
          onClick={(event) => {
            event.preventDefault();
            onHome();
          }}
        >
          <img src="/brand/gradly-logo.webp" alt="" width="104" height="35" />
        </a>
        <ol className="focus-steps" aria-label="Paper to investigation">
          {steps.map((label, index) => (
            <li
              key={label}
              className={
                index < step ? "is-done" : index === step ? "is-current" : ""
              }
              aria-current={index === step ? "step" : undefined}
            >
              <span className="focus-step-dot" aria-hidden="true">
                {index < step ? <Icon name="check" size={12} strong /> : null}
              </span>
              <span className="focus-step-label">{label}</span>
            </li>
          ))}
        </ol>
        <span className="focus-step-mobile">
          {step + 1}/{steps.length} · {steps[step]}
        </span>
        <div className="focus-bar-tools">
          {sample ? (
            <span className="focus-sample" aria-label="Sample preview mode">
              Sample
              <span className="focus-sample-detail">
                {" "}
                preview · no AI calls
              </span>
            </span>
          ) : null}
          {children}
          <a
            className="focus-icon"
            href="#/research/glossary"
            aria-label="Glossary"
          >
            <Icon name="book" size={19} />
          </a>
          <a
            className="focus-icon"
            href="#/research/help"
            aria-label="How it works"
          >
            <CircleHelp size={20} aria-hidden="true" />
          </a>
          <a
            className="focus-exit"
            href="#/"
            aria-label={exitLabel}
            onClick={(event) => {
              event.preventDefault();
              onExit();
            }}
          >
            <Icon name="close" size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
