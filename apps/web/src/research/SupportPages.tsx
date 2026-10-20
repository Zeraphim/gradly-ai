import type { RefObject } from "react";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import { Speech } from "./learning-ui.js";
import type { ResearchConfig } from "./types.js";

const glossary: Record<string, string> = {
  Evidence:
    "Information that bears on a research question. Its relevance, source, collection, and limits matter when deciding what a claim can support.",
  "Qualitative theme":
    "A pattern of meaning developed through interpretation of material such as interview accounts. A theme does not by itself estimate how common an experience is in a population.",
  "Causal claim":
    "A claim that one factor changes another. The research design and competing explanations determine how well the evidence supports that claim; an association alone does not establish it.",
  Confounding:
    "Another factor provides an alternative explanation for an apparent relationship. Consider whether the design or analysis addresses that explanation before making a causal claim.",
  Transfer:
    "Applying a reasoning principle to a new setting while checking whether its conditions and limits still fit. Completing one example does not establish mastery in other settings.",
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
          Research glossary
        </h1>
        <p>
          From interpreting an interview to comparing group scores, keep these
          ideas beside your investigation. Use the terms that fit your paper.
        </p>
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
            <h2>Add your paper</h2>
            <p>
              Upload a PDF, inspect its extracted text and confirm processing.
              Without live AI, choose the clearly labeled sample lesson to try
              the flow.
            </p>
          </li>
          <li>
            <h2>Decide, explain, then reconsider</h2>
            <p>
              Choose an answer, explain your decision and inspect the evidence
              and feedback. Revise your explanation when you find a gap.
            </p>
          </li>
          <li>
            <h2>Connect decisions to findings</h2>
            <p>
              Review the paper’s findings and limits, then apply the idea in a
              new setting. Practice points record solved decisions, not mastery.
            </p>
          </li>
        </ol>
        <div className="card">
          <h2>Try the reasoning loop without AI</h2>
          <p>
            The authored example separates a matching choice from a sound
            explanation. Your written explanation is not assessed. Custom text
            stays unassessed; prepared feedback is labeled.
          </p>
          <Link className="btn outline" href="/reasoning">
            <ActionLabel>Try the reasoning preview</ActionLabel>
          </Link>
        </div>
        <details className="card">
          <summary>How Agents Collaborate</summary>
          <p>
            The planned live pipeline has five steps. Each step must finish
            before the next begins. Local sample lessons use authored evidence
            and guidance, without a live agent run.
          </p>
          <div className="flow">
            Evidence → Lesson → Methods review → Coach review → Verification
          </div>
          <p>
            This guide explains the process; it does not report a live run.
            Processing cards show tasks, output summaries, and evidence links.
            Gradly does not store or display a model’s private internal
            reasoning.
          </p>
          <p>
            Reviews should fit the research approach. Qualitative themes,
            observational relationships, experimental comparisons, and
            conceptual arguments support different kinds of conclusions. Missing
            evidence should lead to uncertainty, not invented details.
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
                  ? "Live Nebius AI processing is not configured. You can use the reference quest and sample preview, with saved progress and answer checking. Sample previews make no AI calls and do not analyze your upload."
                  : "Live Nebius AI processing is not configured. You can use the reference quest and answer checking."}
          </p>
          <p>{config?.model}</p>
          <p>
            The reasoning preview is available without live AI or backend
            access. Its prepared guide does not assess your written explanation.
          </p>
          <Link href="/reasoning">Try the reasoning preview</Link>
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
          <h2>Reasoning preview</h2>
          <p>
            The reasoning preview uses one authored reference example. Choices,
            explanations, and reflections stay in this browser tab and are not
            sent to the server or an AI service. Tab storage keeps the preview
            across refreshes when available; otherwise, keep the page open to
            retain your draft. Preview storage is scoped to this tab.
          </p>
          <p>
            Its prepared feedback illustrates expected behavior. Written
            explanations are not assessed, and the preview does not analyze your
            uploaded paper.
          </p>
          <h2>Your controls</h2>
          <p>
            Delete an uploaded document from Quests to remove its extracted
            text, processing record, generated lesson, and linked learner
            sessions. Records expire after 30 days. Gradly removes expired
            records when you open Quests.
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
