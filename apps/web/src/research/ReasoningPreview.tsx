import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "../components/BrandLogo.js";
import { ResearchLink as Link } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import { readReducedMotion } from "./client-state.js";
import {
  evaluatePreview,
  previewChoices,
  previewExamples,
  previewReveal,
  previewStudyContext,
  revisedPreviewExample,
  type PreviewExample,
  type PreviewReview,
} from "./reasoning-preview.js";
import {
  initialPreviewState,
  parsePreviewState,
  PREVIEW_STORAGE_KEY,
  type PreviewAttempt,
  type PreviewPhase,
  type PreviewState,
} from "./reasoning-preview-state.js";
import "./reasoning-preview.css";

const phases: { id: PreviewPhase; label: string }[] = [
  { id: "decide", label: "Choose" },
  { id: "explain", label: "Explain" },
  { id: "review", label: "Inspect" },
  { id: "revise", label: "Revise" },
  { id: "summary", label: "Reflect" },
];
let memoryDraft: PreviewState | null = null;
let storageWriteFailed = false;

function restore() {
  if (storageWriteFailed && memoryDraft) return memoryDraft;
  try {
    return parsePreviewState(sessionStorage.getItem(PREVIEW_STORAGE_KEY));
  } catch {
    return memoryDraft ?? initialPreviewState();
  }
}

function Review({ review }: { review: PreviewReview }) {
  return (
    <div
      className="preview-verdicts"
      role="group"
      aria-label="Separate review outcomes"
    >
      <section className="preview-verdict">
        <span className="tag">Method choice</span>
        <h2>{review.choice.label}</h2>
        <p>{review.choice.explanation}</p>
      </section>
      <section
        className={`preview-verdict reasoning-${review.reasoning.category}`}
      >
        <span className="tag">Explanation · authored feedback</span>
        <h2>{review.reasoning.label}</h2>
        <p>{review.reasoning.issue ?? review.reasoning.claim}</p>
      </section>
    </div>
  );
}

export function ReasoningPreview({
  onExit,
  returnHref,
}: {
  onExit: () => void;
  returnHref: string;
}) {
  const [state, setState] = useState(restore);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const paper = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const phaseIndex = phases.findIndex((p) => p.id === state.phase);
  const attempt = { choiceId: state.choiceId, text: state.text };
  const before = state.before;
  const after = state.after;
  const review = evaluatePreview(
    before?.choiceId ?? state.choiceId,
    before?.text ?? state.text,
  );
  const revisedReview = after
    ? evaluatePreview(after.choiceId, after.text)
    : null;
  const currentReview = evaluatePreview(state.choiceId, state.text);
  const improved =
    review.fixtureId === "right-method-weak-reason" &&
    revisedReview?.fixtureId === "right-method-supported-reason";
  const titles: Record<PreviewPhase, string> = {
    decide: "A right answer is only the beginning.",
    explain: "Why does your method fit?",
    review: "Check the reasoning, not just the answer.",
    revise: "Build a stronger explanation.",
    summary: improved
      ? "The method stayed. The reasoning changed."
      : "What changed in your explanation?",
  };
  useEffect(() => {
    memoryDraft = state;
    try {
      sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(state));
      storageWriteFailed = false;
    } catch {
      storageWriteFailed = true;
      setStorageUnavailable(true);
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion =
      String(readReducedMotion());
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state.phase]);
  useEffect(() => {
    if (state.revealed) paper.current?.focus();
  }, [state.revealed]);
  function patch(next: Partial<PreviewState>) {
    setState((previous) => ({ ...previous, ...next }));
  }
  function loadExample(example: PreviewExample) {
    patch({
      choiceId: example.choiceId,
      text: example.text,
      before: null,
      after: null,
      reflection: "",
      revealed: false,
    });
  }
  const choiceLabel = (a: PreviewAttempt) =>
    previewChoices.find((choice) => choice.id === a.choiceId)?.label;
  return (
    <>
      <a
        className="skip-link"
        href="#reasoning-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("reasoning-main")?.focus();
        }}
      >
        Skip to reasoning preview
      </a>
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
          <Link href={returnHref}>
            <Icon name="back" size={18} /> Back to learning
          </Link>
          <span className="mode-pill">Frontend preview</span>
        </div>
      </header>
      <main
        id="reasoning-main"
        className="main reasoning-preview"
        tabIndex={-1}
      >
        <aside className="preview-provenance" aria-label="Authored preview">
          <Icon name="layout" size={22} />
          <div>
            <strong>Authored preview · no AI calls</strong>
            <p>
              Example feedback is written in advance. Custom writing is not
              assessed. Your input stays in this tab.
            </p>
          </div>
        </aside>
        <ol className="preview-steps" aria-label="Reasoning learning stages">
          {phases.map((phase, index) => (
            <li
              key={phase.id}
              aria-current={state.phase === phase.id ? "step" : undefined}
              className={index < phaseIndex ? "done" : ""}
            >
              <span aria-hidden="true">
                {index < phaseIndex ? (
                  <Icon name="check" size={16} />
                ) : (
                  index + 1
                )}
              </span>
              {phase.label}
            </li>
          ))}
        </ol>
        <div className="preview-heading">
          <span className="tag">
            Research reasoning · {phaseIndex + 1} of 5
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {titles[state.phase]}
          </h1>
          <p>
            {state.phase === "decide"
              ? "Try a decision where the selected method fits, but the explanation contains a misconception."
              : state.phase === "explain"
                ? "A prepared explanation is loaded so you can explore the complete feedback loop. Edit it or try another example."
                : state.phase === "review"
                  ? "Two judgments. A suitable method does not automatically make its justification sound."
                  : state.phase === "revise"
                    ? "Use the evidence to repair the explanation. You can keep a method and change the reason behind it."
                    : "Compare the explanations, then reflect before revealing the published findings."}
          </p>
        </div>
        <div className="preview-workspace">
          <div className="preview-primary">
            {state.phase === "decide" ? (
              <section className="preview-panel">
                <span className="tag">The decision · findings hidden</span>
                <h2>{previewStudyContext.question}</h2>
                <div
                  className="preview-design-summary"
                  role="region"
                  aria-label="Design facts for your decision"
                >
                  <strong>Before you choose</strong>
                  <p>
                    {previewStudyContext.evidence[0]!.text}{" "}
                    {previewStudyContext.evidence[2]!.text}
                  </p>
                </div>
                <fieldset className="preview-choices">
                  <legend>Choose an analysis</legend>
                  {previewChoices.map((choice) => (
                    <label
                      key={choice.id}
                      className={state.choiceId === choice.id ? "selected" : ""}
                    >
                      <input
                        type="radio"
                        name="preview-method"
                        value={choice.id}
                        checked={state.choiceId === choice.id}
                        onChange={() =>
                          patch({
                            choiceId: choice.id,
                            before: null,
                            after: null,
                            revealed: false,
                          })
                        }
                      />
                      <span>
                        <strong>{choice.label}</strong>
                        <small>{choice.description}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
                <p className="quiet">
                  The first method is preselected for the authored example. Your
                  next step is to explain the decision.
                </p>
                <button
                  className="btn primary"
                  onClick={() => patch({ phase: "explain" })}
                >
                  <ActionLabel>Defend this decision</ActionLabel>
                </button>
              </section>
            ) : null}
            {state.phase === "explain" ? (
              <section className="preview-panel">
                <p className="preview-choice-recap">
                  <strong>Chosen method</strong>
                  {choiceLabel(attempt)}
                </p>
                <label
                  className="preview-field-label"
                  htmlFor="preview-explanation"
                >
                  Explain your choice
                </label>
                <textarea
                  id="preview-explanation"
                  rows={6}
                  maxLength={3000}
                  value={state.text}
                  onChange={(event) =>
                    patch({
                      text: event.target.value,
                      before: null,
                      after: null,
                      revealed: false,
                    })
                  }
                  aria-describedby="preview-writing-state"
                />
                <p
                  id="preview-writing-state"
                  className="preview-input-state"
                  role="status"
                >
                  {currentReview.fixtureId
                    ? "Authored example loaded. The review below will show its prepared feedback."
                    : "Custom writing · not assessed. You can explore the flow, or load an authored example for prepared feedback."}
                </p>
                <details className="preview-examples">
                  <summary>Try another authored example</summary>
                  <p>
                    Each example loads both its selected method and explanation.
                  </p>
                  <div>
                    {previewExamples.map((example) => (
                      <button
                        key={example.id}
                        className="btn outline compact"
                        onClick={() => loadExample(example)}
                        aria-pressed={currentReview.fixtureId === example.id}
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </details>
                <div className="preview-actions">
                  <button
                    className="btn primary"
                    disabled={!state.text.trim()}
                    onClick={() =>
                      patch({
                        phase: "review",
                        before: attempt,
                        after: null,
                        revealed: false,
                      })
                    }
                  >
                    <ActionLabel>Show example review</ActionLabel>
                  </button>
                  <button
                    className="btn outline compact"
                    onClick={() => patch({ phase: "decide" })}
                  >
                    Change method
                  </button>
                </div>
              </section>
            ) : null}
            {state.phase === "review" && before ? (
              <>
                <section className="preview-panel preview-submission">
                  <span className="tag">Explanation being reviewed</span>
                  <strong>{choiceLabel(before)}</strong>
                  <blockquote>{before.text}</blockquote>
                </section>
                <div aria-live="polite">
                  <Review review={review} />
                </div>
                <section className="preview-panel preview-coaching">
                  <Icon name="coach" />
                  <div>
                    <h2>A question to work through</h2>
                    <p>{review.reasoning.coachingQuestion}</p>
                    <p className="quiet">{review.reasoning.nextStep}</p>
                  </div>
                </section>
                <button
                  className="btn primary"
                  onClick={() =>
                    patch({
                      phase: "revise",
                      choiceId: before.choiceId,
                      text: before.text,
                    })
                  }
                >
                  <ActionLabel>Revise this explanation</ActionLabel>
                </button>
              </>
            ) : null}
            {state.phase === "revise" && before ? (
              <section className="preview-panel">
                <span className="tag">From feedback to a better reason</span>
                <h2>Connect the method to the observations.</h2>
                <p>{review.reasoning.coachingQuestion}</p>
                <details className="preview-original">
                  <summary>Read the original explanation</summary>
                  <blockquote>{before.text}</blockquote>
                </details>
                <label
                  className="preview-field-label"
                  htmlFor="preview-revision"
                >
                  Revise your explanation
                </label>
                <textarea
                  id="preview-revision"
                  rows={7}
                  maxLength={3000}
                  value={state.text}
                  onChange={(event) =>
                    patch({
                      text: event.target.value,
                      after: null,
                      revealed: false,
                    })
                  }
                  aria-describedby="preview-revision-state"
                />
                <p
                  id="preview-revision-state"
                  className="preview-input-state"
                  role="status"
                >
                  {currentReview.fixtureId
                    ? "This writing matches an authored example. Its prepared review will appear in the comparison."
                    : "Custom revision · not assessed. No live review has evaluated this writing."}
                </p>
                <button
                  className="btn outline compact"
                  onClick={() =>
                    patch({
                      choiceId: revisedPreviewExample.choiceId,
                      text: revisedPreviewExample.text,
                      after: null,
                      revealed: false,
                    })
                  }
                >
                  Use the authored revision
                </button>
                <p className="quiet preview-revision-note">
                  Loads a supported independent-samples t-test explanation and
                  selects that method.
                </p>
                <button
                  className="btn primary"
                  disabled={!state.text.trim()}
                  onClick={() =>
                    patch({ phase: "summary", after: attempt, revealed: false })
                  }
                >
                  <ActionLabel>Compare my revision</ActionLabel>
                </button>
              </section>
            ) : null}
            {state.phase === "summary" && before && after && revisedReview ? (
              <>
                <div className="preview-comparison">
                  {[
                    { label: "Before revision", value: before, result: review },
                    {
                      label: "After revision",
                      value: after,
                      result: revisedReview,
                    },
                  ].map(({ label, value, result }) => (
                    <section
                      key={label}
                      className="preview-panel"
                      aria-label={label}
                    >
                      <span className="tag">{label}</span>
                      <h2>{choiceLabel(value)}</h2>
                      <blockquote>{value.text}</blockquote>
                      <p className="preview-comparison-verdict">
                        <strong>{result.reasoning.label}</strong>
                      </p>
                      <p>{result.reasoning.issue ?? result.reasoning.claim}</p>
                    </section>
                  ))}
                </div>
                <section className="preview-panel preview-insight">
                  <Icon name="verify" />
                  <div>
                    <h2>
                      {improved
                        ? "The improvement is in the explanation."
                        : "Make the difference explicit."}
                    </h2>
                    <p>
                      {improved
                        ? "Before: a shared lecture was mistaken for paired observations. After: the explanation connects separate groups and numerical scores, and identifies assumptions still needing evidence. The selected method is unchanged."
                        : "Compare how each explanation uses the design and names missing evidence. Custom writing has no assessment here; an authored review applies only to its matching example."}
                    </p>
                    <p className="quiet">
                      This demonstration awards no points and does not change
                      investigation progress.
                    </p>
                  </div>
                </section>
                <section className="preview-panel">
                  <label
                    className="preview-field-label"
                    htmlFor="preview-reflection"
                  >
                    What changed in your reasoning?
                  </label>
                  <p id="preview-reflection-help">
                    Name one distinction you would use in another study. This
                    reflection is saved only in this tab.
                  </p>
                  <textarea
                    id="preview-reflection"
                    rows={3}
                    maxLength={1500}
                    value={state.reflection}
                    onChange={(event) =>
                      patch({ reflection: event.target.value })
                    }
                    aria-describedby="preview-reflection-help"
                  />
                </section>
                {!state.revealed ? (
                  <section className="preview-panel preview-reveal-prompt">
                    <h2>Now compare with the researchers.</h2>
                    <p>
                      Your recommendation came first. Reveal the paper to
                      compare methods, findings and limits.
                    </p>
                    <button
                      className="btn primary"
                      onClick={() => patch({ revealed: true })}
                    >
                      <ActionLabel icon="book">
                        Reveal the reference paper
                      </ActionLabel>
                    </button>
                  </section>
                ) : (
                  <section
                    className="preview-panel preview-paper"
                    aria-label="Reference paper reveal"
                    tabIndex={-1}
                    ref={paper}
                  >
                    <span className="tag">
                      Reference study · published page {previewReveal.page}
                    </span>
                    <h2>{previewReveal.title}</h2>
                    <a
                      href={previewReveal.paper.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {previewReveal.paper.title}{" "}
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <p>
                      {previewReveal.paper.authors}
                      <br />
                      {previewReveal.paper.journal}
                    </p>
                    <h3>The reported analysis</h3>
                    <p>{previewReveal.reportedMethod}</p>
                    <p>{previewReveal.methodComparison}</p>
                    <h3>Findings and interpretation</h3>
                    <p>{previewReveal.finding}</p>
                    <p>{previewReveal.interpretation}</p>
                    <h3>Keep the scope in view</h3>
                    <ul>
                      {previewReveal.limits.map((limit) => (
                        <li key={limit}>{limit}</li>
                      ))}
                    </ul>
                    <strong>{previewReveal.takeaway}</strong>
                  </section>
                )}
                <Link className="btn primary" href={returnHref}>
                  <ActionLabel>Return to learning</ActionLabel>
                </Link>
              </>
            ) : null}
          </div>
          <aside className="preview-context" aria-label="Study evidence">
            <section className="preview-panel">
              <span className="tag">Study briefing</span>
              <h2>{previewStudyContext.title}</h2>
              <p>{previewStudyContext.summary}</p>
              <ul>
                {previewStudyContext.evidence.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
              <details className="preview-evidence">
                <summary>Inspect supporting evidence</summary>
                <p className="quiet">
                  Authored summaries of the reference study’s methods ·
                  published page 47. These are paraphrases, not quotations or
                  extracts from your upload.
                </p>
                {(review.reasoning.evidence.length &&
                ["review", "revise", "summary"].includes(state.phase)
                  ? review.reasoning.evidence
                  : previewStudyContext.evidence
                ).map((evidence) => (
                  <article key={evidence.id}>
                    <strong>Published page {evidence.page}</strong>
                    <p>{evidence.text}</p>
                  </article>
                ))}
              </details>
              <details className="preview-unknowns">
                <summary>What we cannot establish yet</summary>
                <ul>
                  {previewStudyContext.unknowns.map((unknown) => (
                    <li key={unknown}>{unknown}</li>
                  ))}
                </ul>
              </details>
            </section>
            <details className="preview-panel preview-live-contract">
              <summary>What changes with live AI?</summary>
              <p>
                The expected review will examine the submitted explanation,
                identify a specific gap, cite permitted evidence and ask a
                focused question.
              </p>
              <p>
                It must acknowledge missing evidence, allow defensible
                alternatives, and clear the old review when the writing changes.
                Unavailable or unreliable reviews must remain unassessed.
              </p>
              <p>That live review is not connected to this showcase.</p>
            </details>
          </aside>
        </div>
        <div className="preview-bottom">
          <p className="quiet">
            {storageUnavailable
              ? "Browser storage is unavailable. Your draft lasts while this page stays open."
              : "Draft saved in this tab · separate from your quest"}
          </p>
          <button
            className="btn outline compact"
            onClick={() => setState(initialPreviewState())}
          >
            <ActionLabel icon="retry">Start over</ActionLabel>
          </button>
        </div>
      </main>
      <footer className="site-footer">
        <span>Gradly · Learn to question. Grow with evidence.</span>
        <Link href="/privacy">Privacy</Link>
        <Link href={returnHref}>Back to learning</Link>
      </footer>
    </>
  );
}
