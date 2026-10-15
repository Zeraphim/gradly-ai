import type { RefObject } from "react";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import { Speech } from "./learning-ui.js";
import type { ResearchConfig } from "./types.js";

const glossary: Record<string, string> = {
  "Between-participants design":
    "Different participants contribute observations in each condition.",
  "Random assignment":
    "A chance process assigns participants to conditions. It supports causal comparisons by reducing systematic differences between groups before the study begins.",
  "Random sampling":
    "A chance process selects people from a population. It concerns how well a sample represents that population. It differs from random assignment to study conditions.",
  "Independent-samples t-test":
    "Compares the means of two independent groups. The pooled version assumes equal population variances. Welch’s version does not require that assumption.",
  "One-way ANOVA":
    "Analysis of variance tests group mean differences for one factor. With two groups, the usual equal-variance ANOVA and pooled t-test are equivalent: F = t².",
  "Paired-samples t-test":
    "Tests the mean difference between linked observations, such as repeated measurements of the same people.",
  "Percentage points":
    "The arithmetic difference between two percentages. For example, 80% minus 70% is 10 percentage points. A relative percentage change instead divides the difference by a baseline.",
  "p-value":
    "Under a specified null model and test assumptions, the probability of a result at least as extreme as the one observed.",
  "Standard deviation":
    "Describes how much observations vary around a mean, in the same units as the outcome.",
  Generalizability:
    "Whether findings apply to people, contexts, and outcomes beyond those studied.",
};

export type SupportPagesProps = {
  route: string;
  heading: RefObject<HTMLHeadingElement | null>;
  config: ResearchConfig | null;
  reduced: boolean;
  onReducedChange: (reduced: boolean) => void;
  resumeHref: string;
  resumeLabel: string;
  hasReturnPath: boolean;
  configError?: string;
};

export function SupportPages({
  route,
  heading,
  config,
  reduced,
  onReducedChange,
  resumeHref,
  resumeLabel,
  hasReturnPath,
  configError,
}: SupportPagesProps) {
  if (route === "glossary")
    return (
      <>
        <h1 ref={heading} tabIndex={-1}>
          Statistics Glossary
        </h1>
        <p>Keep these ideas beside your investigation.</p>
        {Object.entries(glossary).map(([term, definition]) => (
          <details className="card glossary" key={term}>
            <summary className="icon-summary">
              {term}
              <Icon name="chevron" size={17} className="disclosure-chevron" />
            </summary>
            <p>{definition}</p>
          </details>
        ))}
        <Link className="btn primary" href={resumeHref}>
          <ActionLabel>{resumeLabel}</ActionLabel>
        </Link>
      </>
    );

  if (route === "help")
    return (
      <>
        <Speech>
          Research judgment grows through practice. You can change your mind—and
          explain why.
        </Speech>
        <h1 ref={heading} tabIndex={-1}>
          How Gradly works
        </h1>
        <ol className="how-list">
          <li>
            <h2>Choose an investigation</h2>
            <p>
              Start the reference investigation, or upload a research PDF to
              review its extracted text.
            </p>
          </li>
          <li>
            <h2>Inspect the evidence</h2>
            <p>
              {!config
                ? "Review extracted text before choosing a learning path. Gradly will show which processing options are available."
                : config.liveAI
                  ? "Gradly checks your PDF on the application server. Review the extracted text before you confirm AI processing. Gradly then builds a lesson from evidence linked to the paper’s pages. Lessons that fail the checks stay blocked."
                  : config?.demoAvailable
                    ? "Gradly checks your PDF on the application server. Review the extracted text, then explore the complete flow with a separate sample study. The preview does not analyze your upload or send it to an AI service."
                    : "Gradly can check your PDF and show its extracted text. Live AI processing is unavailable. Continue learning with the guided reference investigation."}
            </p>
          </li>
          <li>
            <h2>Make and defend decisions</h2>
            <p>
              Choose methods and interpretations. Use the hints and study
              details to support your reasoning. Try a revision after your first
              miss.
            </p>
          </li>
          <li>
            <h2>Connect decisions to findings</h2>
            <p>
              See the study’s paper at the end. Review your responses and
              practice concepts you missed.
            </p>
          </li>
        </ol>
        <details className="card">
          <summary>How Agents Collaborate</summary>
          <p>
            Five steps prepare an investigation. Each step must finish before
            the next begins. In sample preview, these steps use a separate
            reference study and make no AI calls.
          </p>
          <div className="flow">
            Evidence → Lesson → Statistical review → Coach review → Verification
          </div>
          <p>
            This guide explains the process; it does not report a live run.
            Processing cards show tasks, output summaries, and evidence links.
            Gradly does not store or display a model’s private internal
            reasoning.
          </p>
        </details>
        <Link className="btn primary" href={resumeHref}>
          <ActionLabel>{resumeLabel}</ActionLabel>
        </Link>
      </>
    );

  if (route === "settings")
    return (
      <>
        <h1 ref={heading} tabIndex={-1}>
          Your learning settings
        </h1>
        <div className="card">
          <h2>Guest profile</h2>
          <p>
            You do not need an account. This browser keeps access to your saved
            adventures. Clearing cookies can remove your access to saved
            progress.
          </p>
          <label className="toggle">
            <input
              type="checkbox"
              checked={reduced}
              onChange={(event) => onReducedChange(event.target.checked)}
            />{" "}
            Reduce interface motion
          </label>
          <p>Gradly also respects your device’s reduced-motion setting.</p>
        </div>
        <div className="card">
          <h2>AI availability</h2>
          <p>
            {!config
              ? configError
                ? "AI availability couldn’t be confirmed. Reload saved state to check again."
                : "Checking AI availability…"
              : config.liveAI
                ? "Live Nebius AI processing is configured. Generated lessons must pass all review steps before you can begin."
                : config?.demoAvailable
                  ? "Live Nebius AI processing is not configured. You can use the reference investigation and sample preview, with saved progress and answer checking. Sample previews make no AI calls and do not analyze your upload."
                  : "Live Nebius AI processing is not configured. You can use the reference investigation and answer checking."}
          </p>
          <p>{config?.model}</p>
          <Link href="/privacy">
            <ActionLabel icon="shield">
              Read processing and retention information
            </ActionLabel>
          </Link>
        </div>
      </>
    );

  if (route === "privacy")
    return (
      <>
        <h1 ref={heading} tabIndex={-1}>
          Privacy & AI processing
        </h1>
        <div className="card">
          <h2>What is stored</h2>
          <p>
            Gradly reads uploaded PDFs on the application server. It stores
            extracted page text, processing summaries, generated lessons,
            answers, written reasoning, and progress for up to 30 days. The
            server does not retain the original PDF bytes.
          </p>
          <p>
            This browser tab keeps unsubmitted choices and writing for your
            current adventure. If tab storage is unavailable, drafts last only
            until you refresh the page. Submit a decision to save it with your
            guest profile.
          </p>
          <h2>When an external model is used</h2>
          <p>
            With live AI enabled, Gradly sends extracted text to Nebius Token
            Factory only after you confirm AI processing. If you request AI
            feedback, Gradly sends the current challenge’s permitted evidence
            and your submitted reasoning. Avoid sensitive or identifiable
            participant information.
          </p>
          <p>
            Sample preview uses a separate reference study. It makes no AI calls
            and does not analyze your uploaded document.
          </p>
          <h2>Your controls</h2>
          <p>
            Delete an uploaded document from Adventures to remove its extracted
            text, processing record, generated lesson, and linked learner
            sessions. Records expire after 30 days. Gradly removes expired
            records when you open Adventures.
          </p>
          <h2>Limits of AI review</h2>
          <p>
            AI review and checks against source excerpts reduce errors. They
            cannot certify that a lesson is correct. The featured investigation
            uses a reference answer guide. Failed AI feedback never changes that
            guide.
          </p>
          <a
            href="https://nebius.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nebius privacy information ↗
          </a>
        </div>
        <div className="actions">
          {hasReturnPath ? (
            <Link className="btn primary" href={resumeHref}>
              <ActionLabel>{resumeLabel}</ActionLabel>
            </Link>
          ) : null}
          <Link className="btn outline" href="/history">
            Manage uploaded documents
          </Link>
        </div>
      </>
    );

  return null;
}
