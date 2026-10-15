import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "../components/BrandLogo.js";
import { Mascot } from "../components/Mascot.js";
import { ResearchLink as Link, useResearchPath } from "./navigation.js";
import { ActionLabel, Icon } from "./icon.js";
import { readReducedMotion, writeReducedMotion } from "./client-state.js";
import { referenceCase } from "./reference-case.js";
import { practiceCases } from "./research-cases.js";
import {
  CASE_STORAGE_KEY,
  boardReady,
  caseNotes,
  emptyNotebook,
  evidenceReview,
  freshCase,
  readNotebook,
  type CaseDraft,
  type CaseNotebook,
  type CasePhase,
} from "./case-state.js";
import type { ResearchCase } from "./case-types.js";
import "./styles.css";
import "./paper-lab.css";

const paperCases: readonly ResearchCase[] = [referenceCase, ...practiceCases];
const stages: { id: CasePhase; label: string }[] = [
  { id: "question", label: "Start" },
  { id: "evidence", label: "Read" },
  { id: "claim", label: "Choose" },
  { id: "transfer", label: "Try" },
  { id: "complete", label: "Recap" },
];
const confidenceLabels = ["Tentative", "Somewhat sure", "Very sure"];
const evidenceKinds = {
  design: "Approach",
  finding: "Finding",
  limitation: "Limit",
};
let memoryNotebook: CaseNotebook | null = null;
let writesFailed = false;
function restoreNotebook() {
  if (writesFailed && memoryNotebook) return memoryNotebook;
  try {
    return readNotebook(sessionStorage.getItem(CASE_STORAGE_KEY), paperCases);
  } catch {
    return memoryNotebook ?? emptyNotebook();
  }
}

export function PaperLab() {
  const path = useResearchPath();
  const caseId = path.split("/")[2];
  const study = paperCases.find((item) => item.id === caseId);
  const [notebook, setNotebook] = useState(restoreNotebook);
  const [storageFailed, setStorageFailed] = useState(false);
  const [reduced, setReduced] = useState(readReducedMotion);
  const [showGuide, setShowGuide] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const guide = useRef<HTMLElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const transferFeedback = useRef<HTMLDivElement>(null);
  const draft = study ? (notebook.cases[study.id] ?? freshCase()) : null;
  const phase = draft?.phase;
  useEffect(() => {
    if (phase === "transfer" && draft?.transferChecked) {
      transferFeedback.current?.focus();
    }
  }, [phase, draft?.transferChecked]);
  useEffect(() => {
    memoryNotebook = notebook;
    try {
      sessionStorage.setItem(CASE_STORAGE_KEY, JSON.stringify(notebook));
      writesFailed = false;
      setStorageFailed(false);
    } catch {
      writesFailed = true;
      setStorageFailed(true);
    }
  }, [notebook]);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);
  useEffect(() => {
    const oldTitle = document.title;
    document.title = study
      ? `${study.title} · Gradly`
      : "Gradly · Make sense of a paper";
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.title = oldTitle;
    };
  }, [caseId, phase, study]);
  useEffect(() => {
    if (showGuide) guide.current?.focus();
  }, [showGuide]);
  function update(next: Partial<CaseDraft>) {
    if (!study) return;
    setNotebook((previous) => {
      const current = previous.cases[study.id] ?? freshCase();
      return {
        version: 1,
        cases: {
          ...previous.cases,
          [study.id]: {
            ...current,
            ...next,
            ...(next.claim !== undefined && next.claim !== current.claim
              ? { claimChecked: false }
              : {}),
          },
        },
      };
    });
  }
  function reset() {
    if (!study) return;
    setNotebook((previous) => ({
      version: 1,
      cases: { ...previous.cases, [study.id]: freshCase() },
    }));
  }
  function closeGuide() {
    setShowGuide(false);
    helpButton.current?.focus();
  }
  const progress = draft
    ? stages.findIndex((item) => item.id === draft.phase)
    : 0;
  function canVisit(index: number) {
    if (!study || !draft) return false;
    if (index === 0) return true;
    if (index === 1) return Boolean(draft.initialClaim);
    if (index === 2)
      return Boolean(draft.initialClaim) && boardReady(study, draft);
    if (index === 3) return boardReady(study, draft) && draft.claimChecked;
    return (
      boardReady(study, draft) && draft.claimChecked && draft.transferChecked
    );
  }
  return (
    <div className="research-lab paper-lab">
      <a
        className="skip-link"
        href="#paper-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("paper-main")?.focus();
        }}
      >
        Skip to paper exploration
      </a>
      <header className="paper-header">
        <div>
          <Link className="brand" href="/lab" aria-label="Gradly home">
            <BrandLogo />
          </Link>
          <span className="paper-header-note">One step at a time.</span>
          <button
            className="paper-help"
            ref={helpButton}
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
          >
            <Icon name="book" size={18} />
            <span>Help</span>
          </button>
        </div>
      </header>
      <main
        id="paper-main"
        tabIndex={-1}
        className={`paper-main ${study ? "paper-playing" : "paper-library"}`}
      >
        {showGuide ? (
          <section
            className="paper-guide"
            aria-label="Help"
            ref={guide}
            tabIndex={-1}
          >
            <div>
              <h2>Read. Choose. Try it.</h2>
              <p>
                Read one note at a time, choose a conclusion, then try a new
                situation. Use the numbered steps to go back.
              </p>
              <details>
                <summary>About this preview</summary>
                <p>
                  Content and feedback are authored, with no AI calls. Your
                  writing is saved in this tab and is not AI assessed. The
                  garden study is fictional; the texting study uses a published
                  paper.
                </p>
              </details>
              <label className="paper-motion">
                <input
                  type="checkbox"
                  checked={reduced}
                  onChange={(event) => {
                    setReduced(event.target.checked);
                    writeReducedMotion(event.target.checked);
                  }}
                />{" "}
                Reduce motion
              </label>
            </div>
            <button
              className="paper-back"
              onClick={closeGuide}
              aria-label="Close help"
            >
              <Icon name="close" size={20} />
            </button>
          </section>
        ) : null}
        {!study ? (
          <>
            {caseId ? (
              <div role="status" className="paper-inline-notice">
                Study not found. Choose one below.
              </div>
            ) : null}
            <section className="paper-hero">
              <div className="paper-hero-copy">
                <span className="paper-eyebrow">
                  Research, made approachable
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  Understand a paper.
                  <br />
                  <span>One step at a time.</span>
                </h1>
                <p>
                  Read a little. Make a choice. See what the evidence supports.
                </p>
                <Link href="/lab/texting-lecture" className="btn primary">
                  <ActionLabel>
                    {notebook.cases[referenceCase.id]
                      ? "Continue my study"
                      : "Start exploring"}
                  </ActionLabel>
                </Link>
              </div>
              <div className="paper-hero-scene" aria-hidden="true">
                <div className="paper-scene-sheet">
                  <span className="paper-file-tab">YOUR FIRST STUDY</span>
                  <Icon name="phone" size={30} />
                  <strong>
                    One lecture.
                    <br />
                    One distraction.
                  </strong>
                  <div className="paper-scene-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="paper-scene-stamp">
                    Read → Choose → Understand
                  </span>
                </div>
                <Mascot pose="thinking" size="large" />
              </div>
            </section>
            <section
              className="paper-library-section"
              aria-labelledby="paper-library-title"
            >
              <div className="paper-section-heading">
                <h2 id="paper-library-title">Choose a study</h2>
              </div>
              <div className="paper-case-grid">
                {paperCases.map((item, index) => {
                  const saved = notebook.cases[item.id];
                  return (
                    <Link
                      className={`paper-case-card paper-case-${index}`}
                      href={`/lab/${item.id}`}
                      key={item.id}
                    >
                      <div className="paper-case-card-top">
                        <span className="paper-eyebrow">
                          {item.provenance === "reference-paper"
                            ? "Published paper"
                            : "Fictional practice study"}
                        </span>
                        <Icon
                          name={index === 0 ? "phone" : "coach"}
                          size={24}
                        />
                      </div>
                      <h3>{item.title}</h3>
                      <div className="paper-case-card-bottom">
                        <span>
                          {index === 0
                            ? "Texting & learning"
                            : "Belonging & participation"}
                        </span>
                        <strong>
                          {saved?.phase === "complete"
                            ? "Revisit"
                            : saved
                              ? "Continue"
                              : "Start"}
                          <Icon name="arrow" size={17} />
                        </strong>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
            <p className="paper-preview-note">
              <Icon name="shield" size={16} /> Preview · authored content, no AI
              calls.
            </p>
          </>
        ) : draft ? (
          <>
            <div className="paper-case-topline">
              <Link href="/lab">
                <Icon name="back" size={17} /> Home
              </Link>
              <span>
                {study.provenance === "reference-paper"
                  ? "Published paper · guided preview"
                  : "Fictional practice study"}
              </span>
            </div>
            <nav aria-label="Study steps">
              <ol className="paper-trail">
                {stages.map((stage, index) => (
                  <li
                    className={
                      canVisit(index) && index !== progress ? "available" : ""
                    }
                    aria-current={stage.id === draft.phase ? "step" : undefined}
                    key={stage.id}
                  >
                    <button
                      disabled={!canVisit(index)}
                      aria-label={`Step ${index + 1}: ${stage.label}`}
                      onClick={() => update({ phase: stage.id })}
                    >
                      <span>
                        {index < progress ? (
                          <Icon name="check" size={14} />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span>{stage.label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="paper-stage-heading">
              <div>
                <span className="paper-eyebrow">Step {progress + 1} of 5</span>
                <h1 ref={heading} tabIndex={-1}>
                  {draft.phase === "question"
                    ? study.title
                    : draft.phase === "evidence"
                      ? "Read the study."
                      : draft.phase === "claim"
                        ? "What can we conclude?"
                        : draft.phase === "transfer"
                          ? "Try a new situation."
                          : "Your paper recap."}
                </h1>
                {draft.phase === "question" ? (
                  <p>Start with your best guess. You can change it later.</p>
                ) : draft.phase === "claim" ? (
                  <p>Choose the answer that fits what you just read.</p>
                ) : null}
              </div>
            </div>
            {draft.phase === "question" ? (
              <section className="paper-panel paper-focus-card">
                <h2 className="paper-study-question">{study.question}</h2>
                <Choices
                  study={study}
                  value={draft.initialClaim}
                  label="Your starting answer"
                  name="initial-claim"
                  disabled={draft.opened.length > 0}
                  onChange={(id) => update({ initialClaim: id, claim: id })}
                />
                {draft.opened.length > 0 ? (
                  <p className="paper-small">
                    Your starting answer is kept. Change your conclusion in step
                    3.
                  </p>
                ) : null}
                <details className="paper-optional">
                  <summary>
                    Add a starting note <span>(optional)</span>
                  </summary>
                  <label
                    className="paper-field-label"
                    htmlFor="initial-explanation"
                  >
                    Why do you think so?
                  </label>
                  <textarea
                    id="initial-explanation"
                    rows={2}
                    maxLength={1500}
                    value={draft.initialExplanation}
                    readOnly={draft.opened.length > 0}
                    onChange={(event) =>
                      update({ initialExplanation: event.target.value })
                    }
                  />
                  <Confidence
                    value={draft.initialConfidence}
                    onChange={(value) => update({ initialConfidence: value })}
                    label="Your starting confidence"
                    disabled={draft.opened.length > 0}
                  />
                  <p className="paper-small">
                    Personal notes only. Writing is not AI assessed.
                  </p>
                </details>
                <details className="paper-optional">
                  <summary>Study background & source</summary>
                  <p>{study.context}</p>
                  <p>{study.sourceNote}</p>
                  {study.provenance === "fictional-study" ? (
                    <p>
                      All people, accounts and findings in this practice study
                      are fictional.
                    </p>
                  ) : null}
                </details>
              </section>
            ) : null}
            {draft.phase === "evidence" ? (
              <EvidenceReader
                key={study.id}
                study={study}
                draft={draft}
                update={update}
              />
            ) : null}
            {draft.phase === "claim" ? (
              <section className="paper-panel paper-focus-card">
                <Choices
                  study={study}
                  value={draft.claim}
                  label="Your conclusion"
                  name="revised-claim"
                  onChange={(id) => update({ claim: id })}
                />
                {draft.claimChecked ? (
                  <ClaimReview study={study} draft={draft} />
                ) : null}
                <details className="paper-optional">
                  <summary>Review study notes</summary>
                  <ul className="paper-note-checklist">
                    {study.evidence.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={draft.pinned.includes(item.id)}
                            onChange={() =>
                              update({
                                pinned: draft.pinned.includes(item.id)
                                  ? draft.pinned.filter((id) => id !== item.id)
                                  : [...draft.pinned, item.id],
                                opened: draft.opened.includes(item.id)
                                  ? draft.opened
                                  : [...draft.opened, item.id],
                              })
                            }
                          />
                          <span>
                            <strong>{item.label}</strong>
                            <span>{item.summary}</span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <p className="paper-small">
                    Checked notes are included in your download. Saving notes is
                    optional.
                  </p>
                </details>
                <details className="paper-optional">
                  <summary>
                    Add my explanation <span>(optional)</span>
                  </summary>
                  <label
                    htmlFor="paper-explanation"
                    className="paper-field-label"
                  >
                    My explanation
                  </label>
                  <textarea
                    id="paper-explanation"
                    rows={3}
                    maxLength={3000}
                    value={draft.explanation}
                    onChange={(event) =>
                      update({ explanation: event.target.value })
                    }
                    aria-describedby="paper-writing-note"
                    placeholder="Which evidence changed or supported your answer?"
                  />
                  <p id="paper-writing-note" className="paper-small">
                    Your writing is not AI assessed.
                  </p>
                  <Confidence
                    value={draft.confidence}
                    onChange={(value) => update({ confidence: value })}
                    label="Your confidence now"
                  />
                  <details>
                    <summary>See an example explanation</summary>
                    <p>{study.revision.explanation}</p>
                    <button
                      className="paper-back"
                      onClick={() =>
                        update({ explanation: study.revision.explanation })
                      }
                    >
                      Use this example
                    </button>
                  </details>
                </details>
                <details className="paper-optional">
                  <summary>My starting answer</summary>
                  <p>
                    {
                      study.claims.find(
                        (option) => option.id === draft.initialClaim,
                      )?.text
                    }
                  </p>
                  {draft.initialExplanation ? (
                    <blockquote>{draft.initialExplanation}</blockquote>
                  ) : null}
                </details>
              </section>
            ) : null}
            {draft.phase === "transfer" ? (
              <section className="paper-panel paper-focus-card paper-transfer">
                <span className="paper-eyebrow">Fictional example</span>
                <p className="paper-transfer-context">
                  {study.transfer.context.replace(
                    /^Fictional transfer case: /,
                    "",
                  )}
                </p>
                <fieldset className="paper-choice-list">
                  <legend>{study.transfer.prompt}</legend>
                  {study.transfer.options.map((option) => (
                    <label
                      className={
                        draft.transferChoice === option.id ? "selected" : ""
                      }
                      key={option.id}
                    >
                      <input
                        type="radio"
                        name="transfer-choice"
                        checked={draft.transferChoice === option.id}
                        onChange={() =>
                          update({
                            transferChoice: option.id,
                            transferChecked: false,
                          })
                        }
                      />
                      <span>{option.text}</span>
                    </label>
                  ))}
                </fieldset>
                {draft.transferChecked ? (
                  <div
                    className={`paper-guide-feedback ${draft.transferChoice === study.transfer.supportedOptionId ? "supported" : "reconsider"}`}
                    role="status"
                    tabIndex={-1}
                    ref={transferFeedback}
                  >
                    <strong>
                      {draft.transferChoice === study.transfer.supportedOptionId
                        ? "That connection holds."
                        : "Look at what changed."}
                    </strong>
                    <p>
                      {
                        study.transfer.options.find(
                          (option) => option.id === draft.transferChoice,
                        )?.feedback
                      }
                    </p>
                    <span className="paper-small">
                      Authored feedback · no AI assessment
                    </span>
                  </div>
                ) : null}
              </section>
            ) : null}
            {draft.phase === "complete" ? (
              <PaperRecap
                key={study.id}
                study={study}
                draft={draft}
                update={update}
                reset={reset}
                storageFailed={storageFailed}
              />
            ) : null}
            {storageFailed ? (
              <p className="paper-inline-notice" role="status">
                Tab storage is unavailable. Keep this page open to retain your
                notes.
              </p>
            ) : null}
            {draft.phase !== "complete" && draft.phase !== "evidence" ? (
              <footer className="paper-action-dock">
                <div>
                  {progress === 0 ? (
                    <Link className="paper-back" href="/lab">
                      <Icon name="back" size={17} /> Studies
                    </Link>
                  ) : (
                    <button
                      className="paper-back"
                      onClick={() =>
                        update({ phase: stages[progress - 1]!.id })
                      }
                    >
                      <Icon name="back" size={17} /> Back
                    </button>
                  )}
                  <span className="paper-dock-hint" role="status">
                    {draft.phase === "question" && !draft.initialClaim
                      ? "Choose an answer to begin"
                      : draft.phase === "transfer" && !draft.transferChoice
                        ? "Choose an answer"
                        : ""}
                  </span>
                  <button
                    className="btn primary"
                    disabled={
                      draft.phase === "question"
                        ? !draft.initialClaim
                        : draft.phase === "claim"
                          ? !draft.claim
                          : !draft.transferChoice
                    }
                    onClick={() => {
                      if (draft.phase === "claim" && !draft.claimChecked)
                        update({ claimChecked: true });
                      else if (
                        draft.phase === "transfer" &&
                        !draft.transferChecked
                      )
                        update({ transferChecked: true });
                      else update({ phase: stages[progress + 1]!.id });
                    }}
                  >
                    <ActionLabel>
                      {draft.phase === "question"
                        ? "Start exploring"
                        : draft.phase === "claim" && !draft.claimChecked
                          ? "Check answer"
                          : draft.phase === "transfer" && !draft.transferChecked
                            ? "Check answer"
                            : draft.phase === "transfer"
                              ? "See recap"
                              : "Continue"}
                    </ActionLabel>
                  </button>
                </div>
              </footer>
            ) : null}
          </>
        ) : null}
      </main>
      {!study ? (
        <footer className="paper-footer">
          <Link href="/lab">Gradly</Link>
          <button
            onClick={() => {
              setShowGuide(true);
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            About this preview
          </button>
        </footer>
      ) : null}
    </div>
  );
}

function Choices({
  study,
  value,
  label,
  name,
  disabled = false,
  onChange,
}: {
  study: ResearchCase;
  value: string;
  label: string;
  name: string;
  disabled?: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="paper-choice-list" disabled={disabled}>
      <legend>{label}</legend>
      {study.claims.map((option) => (
        <label
          className={value === option.id ? "selected" : ""}
          key={option.id}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </fieldset>
  );
}
function Confidence({
  value,
  onChange,
  label,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <fieldset className="paper-confidence" disabled={disabled}>
      <legend>{label}</legend>
      <div>
        {confidenceLabels.map((text, index) => (
          <label className={value === index + 1 ? "selected" : ""} key={text}>
            <input
              type="radio"
              name={label}
              checked={value === index + 1}
              onChange={() => onChange(index + 1)}
            />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function EvidenceReader({
  study,
  draft,
  update,
}: {
  study: ResearchCase;
  draft: CaseDraft;
  update: (next: Partial<CaseDraft>) => void;
}) {
  // Resume at the first unread note; going back never discards notes or choices.
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      study.evidence.findIndex((item) => !draft.opened.includes(item.id)),
    ),
  );
  const selected = study.evidence[index]!;
  const cardHeading = useRef<HTMLHeadingElement>(null);
  // Mark the automatically displayed first note once, after it is rendered.
  const initialNote = useRef(selected.id);
  useEffect(() => {
    if (!draft.opened.includes(initialNote.current))
      update({ opened: [...draft.opened, initialNote.current] });
    // Subsequent notes are recorded by the navigation event below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    cardHeading.current?.focus();
  }, [index]);
  function read(nextIndex: number) {
    const note = study.evidence[nextIndex]!;
    setIndex(nextIndex);
    if (!draft.opened.includes(note.id))
      update({ opened: [...draft.opened, note.id] });
  }
  function next() {
    if (index < study.evidence.length - 1) read(index + 1);
    else {
      const unread = study.evidence.findIndex(
        (item) => !draft.opened.includes(item.id),
      );
      if (unread !== -1) read(unread);
      else update({ phase: "claim" });
    }
  }
  const allRead = study.evidence.every((item) =>
    draft.opened.includes(item.id),
  );
  return (
    <>
      <div className="paper-reading-layout">
        <nav className="paper-note-nav" aria-label="Study notes">
          <ol>
            {study.evidence.map((item, itemIndex) => (
              <li key={item.id}>
                <button
                  aria-current={index === itemIndex ? "step" : undefined}
                  aria-label={`Read note ${itemIndex + 1}: ${item.label}`}
                  onClick={() => read(itemIndex)}
                >
                  <span className="paper-note-number">
                    {draft.opened.includes(item.id) && index !== itemIndex ? (
                      <Icon name="check" size={15} />
                    ) : (
                      itemIndex + 1
                    )}
                  </span>
                  <span className="paper-note-nav-title">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <article
          className="paper-panel paper-reading-card"
          aria-label="Current study note"
        >
          <div className="paper-note-top">
            <span className="paper-eyebrow">
              {evidenceKinds[selected.kind]}
            </span>
            <span>
              Note {index + 1} of {study.evidence.length}
            </span>
          </div>
          <h2 ref={cardHeading} tabIndex={-1}>
            {selected.label}
          </h2>
          <p className="paper-note-summary">{selected.summary}</p>
          {selected.id === "difference" ? (
            <div
              className="paper-score-comparison"
              role="img"
              aria-label="Average quiz scores: 83 percent without texting; 73.41 percent with texting."
            >
              <div>
                <span>No texting</span>
                <div>
                  <i style={{ width: "83%" }} />
                </div>
                <strong>83.00%</strong>
              </div>
              <div>
                <span>Texting</span>
                <div>
                  <i style={{ width: "73.41%" }} />
                </div>
                <strong>73.41%</strong>
              </div>
            </div>
          ) : null}
          <span className="paper-source">{selected.sourceLabel}</span>
          <div className="paper-note-extras">
            <details key={selected.id}>
              <summary>More detail</summary>
              <p>{selected.text}</p>
            </details>
            <button
              className="paper-save-button"
              aria-pressed={draft.pinned.includes(selected.id)}
              onClick={() =>
                update({
                  pinned: draft.pinned.includes(selected.id)
                    ? draft.pinned.filter((id) => id !== selected.id)
                    : [...draft.pinned, selected.id],
                })
              }
            >
              <Icon
                name={draft.pinned.includes(selected.id) ? "check" : "document"}
                size={17}
              />
              {draft.pinned.includes(selected.id) ? "Saved note" : "Save note"}
            </button>
          </div>
        </article>
      </div>
      <footer className="paper-action-dock">
        <div>
          <button
            className="paper-back"
            onClick={() =>
              index > 0 ? read(index - 1) : update({ phase: "question" })
            }
          >
            <Icon name="back" size={17} /> Back
          </button>
          <span className="paper-dock-hint">
            {index + 1} of {study.evidence.length} notes
          </span>
          <button className="btn primary" onClick={next}>
            <ActionLabel>
              {index === study.evidence.length - 1 && allRead
                ? "Choose a conclusion"
                : index === study.evidence.length - 1
                  ? "Read remaining notes"
                  : "Next note"}
            </ActionLabel>
          </button>
        </div>
      </footer>
    </>
  );
}

function ClaimReview({
  study,
  draft,
}: {
  study: ResearchCase;
  draft: CaseDraft;
}) {
  const review = evidenceReview(study, draft);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <div
      className={`paper-guide-feedback ${review.supported ? "supported" : "reconsider"}`}
      role="status"
    >
      <h2 ref={heading} tabIndex={-1}>
        {review.supported ? "That fits the evidence." : "Look more closely."}
      </h2>
      <p>
        {study.claims.find((option) => option.id === draft.claim)?.feedback}
      </p>
      <details>
        <summary>Why?</summary>
        <p>{study.coachingQuestion}</p>
        <ul>
          {study.evidence
            .filter(
              (item) =>
                item.id === study.usefulEvidenceIds[0] ||
                item.id === study.competingEvidenceId,
            )
            .map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <p>{item.summary}</p>
                <span className="paper-source">{item.sourceLabel}</span>
              </li>
            ))}
        </ul>
      </details>
      {draft.pinned.length > 0 ? (
        <details>
          <summary>Check my saved notes</summary>
          <strong>{review.label}</strong>
          <p>
            {review.ready
              ? "Your notes include support and a boundary."
              : review.relevant.length === 0
                ? "Save a note that directly supports the conclusion, as well as its limits."
                : "Include the note that complicates the conclusion."}
          </p>
        </details>
      ) : null}
      <span className="paper-small">Authored feedback · no AI assessment</span>
    </div>
  );
}

function PaperRecap({
  study,
  draft,
  update,
  reset,
  storageFailed,
}: {
  study: ResearchCase;
  draft: CaseDraft;
  update: (next: Partial<CaseDraft>) => void;
  reset: () => void;
  storageFailed: boolean;
}) {
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const confirmation = useRef<HTMLDivElement>(null);
  const restartButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (confirmReset) confirmation.current?.focus();
  }, [confirmReset]);
  function download() {
    try {
      const url = URL.createObjectURL(
        new Blob([caseNotes(study, draft)], {
          type: "text/plain;charset=utf-8",
        }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `gradly-${study.id}-notes.txt`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExported(true);
      setExportError(false);
    } catch {
      setExportError(true);
    }
  }
  return (
    <section
      className="paper-panel paper-focus-card paper-recap"
      aria-label="Paper recap"
    >
      <div className="paper-recap-intro">
        <Mascot pose="approving" size="small" />
        <div>
          <span className="paper-eyebrow">Exploration complete</span>
          <h2>The key ideas, together.</h2>
        </div>
      </div>
      <dl className="paper-recap-facts">
        {[
          ["Question", study.question],
          ["Approach", study.overview.approach],
          ["Finding", study.overview.finding],
          ["Limit", study.overview.limit],
        ].map(([label, text]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      <button className="btn primary" onClick={download}>
        <ActionLabel icon="document">Download my notes</ActionLabel>
      </button>
      <p className="paper-small" role="status">
        {exported
          ? "Your notes file was prepared."
          : storageFailed
            ? "Export your notes to keep a copy."
            : "Saved in this tab. Download to keep a copy."}
      </p>
      {exportError ? (
        <div className="paper-inline-notice" role="alert">
          <p>The notes file could not be prepared. You can copy it below.</p>
          <label className="paper-field-label" htmlFor="paper-notes-copy">
            Your paper notes
          </label>
          <textarea
            id="paper-notes-copy"
            readOnly
            rows={8}
            value={caseNotes(study, draft)}
          />
        </div>
      ) : null}
      <details className="paper-optional">
        <summary>My answers & notes</summary>
        <section aria-label="My answers and notes">
          <h3>Starting answer</h3>
          <p>
            {
              study.claims.find((option) => option.id === draft.initialClaim)
                ?.text
            }
          </p>
          <p className="paper-small">
            {confidenceLabels[draft.initialConfidence - 1]}
          </p>
          {draft.initialExplanation ? (
            <blockquote>{draft.initialExplanation}</blockquote>
          ) : null}
          <h3>My conclusion</h3>
          <p>
            {study.claims.find((option) => option.id === draft.claim)?.text}
          </p>
          <p className="paper-small">
            {confidenceLabels[draft.confidence - 1]}
          </p>
          <p>{draft.explanation || "No explanation added."}</p>
          <p className="paper-small">
            Personal writing and confidence are not assessed.
          </p>
          {draft.pinned.length > 0 ? (
            <ul>
              {study.evidence
                .filter((item) => draft.pinned.includes(item.id))
                .map((item) => (
                  <li key={item.id}>
                    {item.label} · {item.sourceLabel}
                  </li>
                ))}
            </ul>
          ) : null}
          <h3>New situation</h3>
          <p>
            {
              study.transfer.options.find(
                (option) => option.id === draft.transferChoice,
              )?.feedback
            }
          </p>
          <label className="paper-field-label" htmlFor="paper-reflection">
            A note for my future self
          </label>
          <textarea
            id="paper-reflection"
            rows={3}
            maxLength={1500}
            value={draft.reflection}
            onChange={(event) => update({ reflection: event.target.value })}
          />
        </section>
      </details>
      <details className="paper-optional">
        <summary>Full study recap & source</summary>
        <h3>{study.paper.title}</h3>
        <p className="paper-source">{study.paper.authors}</p>
        <p>{study.design}</p>
        <p>{study.findings}</p>
        <ul>
          {study.limitations.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
        {study.paper.url ? (
          <a
            className="paper-original-source"
            href={study.paper.url}
            target="_blank"
            rel="noreferrer"
          >
            Open the original paper <Icon name="arrow" size={17} />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <p>Fictional study for learning. No original publication exists.</p>
        )}
      </details>
      <div className="paper-recap-end">
        <Link className="paper-back" href="/lab">
          <Icon name="back" size={17} /> Home
        </Link>
        {confirmReset ? (
          <div
            className="paper-replay-confirm"
            role="group"
            aria-label="Restart this study"
            tabIndex={-1}
            ref={confirmation}
          >
            <span>Replace this study’s saved notes?</span>
            <button onClick={reset}>Start fresh</button>
            <button
              onClick={() => {
                setConfirmReset(false);
                requestAnimationFrame(() => restartButton.current?.focus());
              }}
            >
              Keep my notes
            </button>
          </div>
        ) : (
          <button
            className="paper-back"
            ref={restartButton}
            onClick={() => setConfirmReset(true)}
          >
            Start again
          </button>
        )}
      </div>
    </section>
  );
}
