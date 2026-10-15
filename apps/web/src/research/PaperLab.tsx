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

export const paperCases: readonly ResearchCase[] = [
  referenceCase,
  ...practiceCases,
];
const stages: { id: CasePhase; label: string }[] = [
  { id: "question", label: "Wonder" },
  { id: "evidence", label: "Explore" },
  { id: "claim", label: "Connect" },
  { id: "transfer", label: "Try it" },
  { id: "complete", label: "Keep it" },
];
const confidenceLabels = ["Tentative", "Somewhat sure", "Very sure"];
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
  const draft = study ? (notebook.cases[study.id] ?? freshCase()) : null;
  const phase = draft?.phase;
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
    setNotebook((previous) => ({
      version: 1,
      cases: {
        ...previous.cases,
        [study.id]: { ...(previous.cases[study.id] ?? freshCase()), ...next },
      },
    }));
  }
  function reset() {
    if (!study) return;
    setNotebook((previous) => ({
      version: 1,
      cases: { ...previous.cases, [study.id]: freshCase() },
    }));
  }
  const progress =
    study && draft ? stages.findIndex((item) => item.id === draft.phase) : 0;
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
          <span className="paper-header-note">
            A little curiosity goes a long way.
          </span>
          <button
            className="paper-help"
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
          >
            <Icon name="book" size={18} />
            <span>How to play</span>
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
            aria-label="How to play"
            ref={guide}
            tabIndex={-1}
          >
            <div>
              <h2>Follow the evidence. Change your mind.</h2>
              <p>
                Make a first call, open the study’s evidence cards, pin what
                matters, then build a careful claim. Try the idea in a fresh
                situation and keep a one-page recap.
              </p>
              <p>
                Evidence and feedback are authored for this prototype. Guide
                checks cover selected claims and cards. Your own writing is
                saved here and is not AI assessed.
              </p>
            </div>
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
          </section>
        ) : null}
        {!study ? (
          <>
            {caseId ? (
              <div role="status" className="paper-inline-notice">
                That case file could not be found. Choose one below.
              </div>
            ) : null}
            <section className="paper-hero">
              <div className="paper-hero-copy">
                <span className="paper-eyebrow">
                  Less passive reading. More discovery.
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  Make the paper
                  <br />
                  <span>make sense.</span>
                </h1>
                <p>
                  Step inside a study. Uncover its evidence, connect the ideas,
                  and decide what the findings really let you say.
                </p>
                <Link href="/lab/texting-lecture" className="btn primary">
                  <ActionLabel>
                    {notebook.cases[referenceCase.id]
                      ? "Return to the case file"
                      : "Open the case file"}
                  </ActionLabel>
                </Link>
                <span className="paper-hero-meta">
                  One paper. A complete investigation. Ready to explore.
                </span>
              </div>
              <div
                className="paper-hero-scene"
                aria-label="A paper becomes an evidence trail"
              >
                <div className="paper-scene-sheet">
                  <span className="paper-file-tab">CASE FILE 01</span>
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
                    Question → Evidence → Understanding
                  </span>
                </div>
                <div className="paper-scene-note">
                  <Icon name="search" size={18} />
                  <span>What can we actually claim?</span>
                </div>
                <Mascot pose="thinking" size="large" />
              </div>
            </section>
            <section
              className="paper-library-section"
              aria-labelledby="paper-library-title"
            >
              <div className="paper-section-heading">
                <div>
                  <span className="paper-eyebrow">Choose your paper trail</span>
                  <h2 id="paper-library-title">
                    Two studies. One way to explore.
                  </h2>
                </div>
                <p>Research is more than a statistical test.</p>
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
                        <span className="paper-case-number">0{index + 1}</span>
                        <Icon
                          name={index === 0 ? "phone" : "coach"}
                          size={28}
                        />
                      </div>
                      <span className="paper-eyebrow">{item.topic}</span>
                      <h3>{item.title}</h3>
                      <p>{item.hook}</p>
                      <div className="paper-case-card-bottom">
                        <span>
                          {item.provenance === "reference-paper"
                            ? "Published paper · curated exploration"
                            : "Fictional study · learning example"}
                        </span>
                        <strong>
                          {saved?.phase === "complete"
                            ? "Revisit"
                            : saved
                              ? "Continue"
                              : "Explore"}
                          <Icon name="arrow" size={17} />
                        </strong>
                      </div>
                      {saved ? (
                        <span className="paper-case-saved">
                          {saved.phase === "complete"
                            ? "Case explored"
                            : `${stages.find((stage) => stage.id === saved.phase)?.label} · draft saved`}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </section>
            <div className="paper-promise">
              <Icon name="shield" size={20} />
              <p>
                Authored prototype · no AI calls. Your notes stay in this
                browser tab. This experience helps you examine a paper’s core
                ideas; it does not certify understanding or replace checking the
                source.
              </p>
            </div>
          </>
        ) : draft ? (
          <>
            <div className="paper-case-topline">
              <Link href="/lab">
                <Icon name="back" size={17} /> All case files
              </Link>
              <span>
                {study.provenance === "reference-paper"
                  ? "Published paper · curated evidence"
                  : "Fictional study · authored evidence"}
              </span>
            </div>
            <ol className="paper-trail" aria-label="Paper exploration stages">
              {stages.map((stage, index) => (
                <li
                  className={index < progress ? "done" : ""}
                  aria-current={stage.id === draft.phase ? "step" : undefined}
                  key={stage.id}
                >
                  <span>
                    {index < progress ? (
                      <Icon name="check" size={15} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {stage.label}
                </li>
              ))}
            </ol>
            <div className="paper-stage-heading">
              <div>
                <span className="paper-eyebrow">
                  {study.topic} · {progress + 1} of 5
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  {draft.phase === "question"
                    ? study.title
                    : draft.phase === "evidence"
                      ? "Build your evidence board."
                      : draft.phase === "claim"
                        ? "Give the finding the right reach."
                        : draft.phase === "transfer"
                          ? "New setting. Same careful thinking."
                          : "The paper, connected."}
                </h1>
                <p>
                  {draft.phase === "question"
                    ? study.hook
                    : draft.phase === "evidence"
                      ? "Open the cards. Pin the evidence you would use, including something that limits the claim."
                      : draft.phase === "claim"
                        ? "Move the claim dial. Connect it to the evidence you pinned, then explain the connection in your own words."
                        : draft.phase === "transfer"
                          ? "Take the idea beyond this paper. Notice what changes before carrying a conclusion across."
                          : "Keep the question, approach, findings and boundaries together. This is your starting point for explaining the study to someone else."}
                </p>
              </div>
              <span className="paper-prototype-label">
                Authored exploration
                <br />
                No AI calls
              </span>
            </div>
            {draft.phase === "question" ? (
              <div className="paper-question-layout">
                <section className="paper-panel paper-brief">
                  <span className="paper-eyebrow">
                    The question at the heart of the paper
                  </span>
                  <h2>{study.question}</h2>
                  <p>{study.context}</p>
                  <div className="paper-mentor">
                    <Mascot pose="guiding" size="small" />
                    <p>
                      Make a provisional call. You can change your mind when you
                      see the evidence.
                    </p>
                  </div>
                  <details>
                    <summary>About this case file</summary>
                    <p>{study.sourceNote}</p>
                    <p>
                      {study.provenance === "fictional-study"
                        ? "The study, participants and findings are invented for learning. They are not evidence about a real community."
                        : "The cards paraphrase selected study details. Later you can open the original source and inspect the wider argument."}
                    </p>
                  </details>
                </section>
                <section className="paper-panel">
                  <fieldset
                    className="paper-choice-list"
                    disabled={draft.opened.length > 0}
                  >
                    <legend>
                      What would be a defensible kind of conclusion?
                    </legend>
                    {study.claims.map((option) => (
                      <label
                        className={
                          draft.initialClaim === option.id ? "selected" : ""
                        }
                        key={option.id}
                      >
                        <input
                          type="radio"
                          name="initial-claim"
                          value={option.id}
                          checked={draft.initialClaim === option.id}
                          onChange={() =>
                            update({
                              initialClaim: option.id,
                              claim: option.id,
                            })
                          }
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </fieldset>
                  <label
                    className="paper-field-label"
                    htmlFor="initial-explanation"
                  >
                    What makes that seem plausible?{" "}
                    <span className="paper-small">(optional)</span>
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
                    aria-describedby="initial-writing-note"
                    placeholder="Capture your first thought before opening the evidence."
                  />
                  <p id="initial-writing-note" className="paper-small">
                    This is your starting thought, not an assessed answer.
                  </p>
                  <Confidence
                    value={draft.initialConfidence}
                    onChange={(value) => update({ initialConfidence: value })}
                    label="How sure are you before opening the evidence?"
                    disabled={draft.opened.length > 0}
                  />
                  {draft.opened.length > 0 ? (
                    <p className="paper-small">
                      Your first call is kept as it was before opening evidence.
                      Revise your current interpretation in Connect.
                    </p>
                  ) : null}
                </section>
              </div>
            ) : null}
            {draft.phase === "evidence" ? (
              <EvidenceBoard
                key={study.id}
                study={study}
                draft={draft}
                update={update}
              />
            ) : null}
            {draft.phase === "claim" ? (
              <div className="paper-connect-layout">
                <section className="paper-panel paper-claim-builder">
                  <span className="paper-eyebrow">
                    Your working interpretation
                  </span>
                  <label className="paper-field-label" htmlFor="claim-dial">
                    How far should the claim go?
                  </label>
                  <input
                    id="claim-dial"
                    className="paper-claim-dial"
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={Math.max(
                      0,
                      study.claims.findIndex(
                        (option) => option.id === draft.claim,
                      ),
                    )}
                    aria-valuetext={
                      study.claims.find((option) => option.id === draft.claim)
                        ?.text ?? "Choose a claim"
                    }
                    onChange={(event) =>
                      update({
                        claim: study.claims[Number(event.target.value)]!.id,
                      })
                    }
                  />
                  <div className="paper-dial-labels" aria-hidden="true">
                    <span>Hold back</span>
                    <span>Bounded</span>
                    <span>Reach further</span>
                  </div>
                  <fieldset className="paper-choice-list paper-claim-options">
                    <legend className="sr-only">Your revised claim</legend>
                    {study.claims.map((option) => (
                      <label
                        className={draft.claim === option.id ? "selected" : ""}
                        key={option.id}
                      >
                        <input
                          type="radio"
                          name="revised-claim"
                          checked={draft.claim === option.id}
                          onChange={() => update({ claim: option.id })}
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </fieldset>
                  <ClaimReview study={study} draft={draft} />
                  <details>
                    <summary>Revisit my first thought</summary>
                    <p>
                      {
                        study.claims.find(
                          (option) => option.id === draft.initialClaim,
                        )?.text
                      }
                    </p>
                    <blockquote>
                      {draft.initialExplanation ||
                        "No initial explanation added."}
                    </blockquote>
                    <p className="paper-small">
                      Kept from before the evidence. Your writing has not been
                      assessed.
                    </p>
                  </details>
                  <label
                    htmlFor="paper-explanation"
                    className="paper-field-label"
                  >
                    Connect the claim to the evidence
                  </label>
                  <textarea
                    id="paper-explanation"
                    rows={4}
                    maxLength={3000}
                    value={draft.explanation}
                    onChange={(event) =>
                      update({ explanation: event.target.value })
                    }
                    placeholder="What supports the claim? What keeps it bounded?"
                    aria-describedby="paper-writing-note"
                  />
                  <p id="paper-writing-note" className="paper-small">
                    Your writing is not assessed in this prototype. The guide
                    checks the selected claim and evidence cards.
                  </p>
                  <details>
                    <summary>See one authored explanation</summary>
                    <p>{study.revision.explanation}</p>
                    <button
                      className="btn outline compact"
                      onClick={() =>
                        update({ explanation: study.revision.explanation })
                      }
                    >
                      Use this example explanation
                    </button>
                  </details>
                  <Confidence
                    value={draft.confidence}
                    onChange={(value) => update({ confidence: value })}
                    label="How sure are you after examining the evidence?"
                  />
                </section>
                <section
                  className="paper-panel paper-pinned-summary"
                  aria-label="Your pinned evidence"
                >
                  <span className="paper-eyebrow">
                    Keep the evidence beside the claim
                  </span>
                  <h2>Why these cards?</h2>
                  {study.evidence
                    .filter((item) => draft.pinned.includes(item.id))
                    .map((item) => (
                      <article key={item.id}>
                        <span className={`paper-evidence-type ${item.kind}`}>
                          {item.kind}
                        </span>
                        <h3>{item.label}</h3>
                        <p>{item.text}</p>
                        <span className="paper-source">{item.sourceLabel}</span>
                      </article>
                    ))}
                  <button
                    className="btn outline compact"
                    onClick={() => update({ phase: "evidence" })}
                  >
                    <ActionLabel icon="back">
                      Change pinned evidence
                    </ActionLabel>
                  </button>
                </section>
              </div>
            ) : null}
            {draft.phase === "transfer" ? (
              <section className="paper-panel paper-transfer">
                <div className="paper-mentor">
                  <Mascot pose="thinking" size="small" />
                  <p>
                    The takeaway has to travel. A new setting can change which
                    claims the evidence supports.
                  </p>
                </div>
                <p className="paper-transfer-context">
                  {study.transfer.context}
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
                  >
                    <strong>
                      {draft.transferChoice === study.transfer.supportedOptionId
                        ? "The distinction carries over."
                        : "Look at what changed."}
                    </strong>
                    <p>
                      {
                        study.transfer.options.find(
                          (option) => option.id === draft.transferChoice,
                        )?.feedback
                      }
                    </p>
                  </div>
                ) : null}
                <button
                  className="btn outline"
                  disabled={!draft.transferChoice}
                  onClick={() => update({ transferChecked: true })}
                >
                  <ActionLabel icon="verify">Check this connection</ActionLabel>
                </button>
              </section>
            ) : null}
            {draft.phase === "complete" ? (
              <PaperRecap
                key={study.id}
                study={study}
                draft={draft}
                update={update}
                reset={reset}
              />
            ) : null}
            <div className="paper-save-note" role="status">
              {storageFailed
                ? "Tab storage is unavailable. Keep this page open to retain your notes."
                : "Saved in this tab · no account or AI request"}
            </div>
            {draft.phase !== "complete" ? (
              <footer className="paper-action-dock">
                <div>
                  {draft.phase === "question" ? (
                    <Link className="paper-back" href="/lab">
                      <Icon name="back" size={17} /> Case files
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
                  <p>
                    {draft.phase === "question"
                      ? "A first call is a starting point."
                      : draft.phase === "evidence"
                        ? boardReady(study, draft)
                          ? "Your board covers design, findings and limits."
                          : "Open a design, finding and limitation card. Pin at least two."
                        : draft.phase === "claim"
                          ? "A careful claim keeps its evidence and limits together."
                          : "Check the connection before your recap."}
                  </p>
                  <button
                    className="btn primary"
                    disabled={
                      draft.phase === "question"
                        ? !draft.initialClaim
                        : draft.phase === "evidence"
                          ? !boardReady(study, draft)
                          : draft.phase === "claim"
                            ? !draft.claim
                            : !draft.transferChecked
                    }
                    onClick={() => update({ phase: stages[progress + 1]!.id })}
                  >
                    <ActionLabel>
                      {draft.phase === "question"
                        ? "Open the evidence board"
                        : draft.phase === "evidence"
                          ? "Build my interpretation"
                          : draft.phase === "claim"
                            ? "Try it in a new setting"
                            : "See my paper recap"}
                    </ActionLabel>
                  </button>
                </div>
              </footer>
            ) : null}
          </>
        ) : null}
      </main>
      <footer className="paper-footer">
        <Link href="/lab">Gradly</Link>
        <span>Curiosity, with evidence.</span>
        <button onClick={() => setShowGuide(!showGuide)}>
          About this prototype
        </button>
      </footer>
    </div>
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
      <p>Self-report only. Confidence is not a score.</p>
    </fieldset>
  );
}

function EvidenceBoard({
  study,
  draft,
  update,
}: {
  study: ResearchCase;
  draft: CaseDraft;
  update: (next: Partial<CaseDraft>) => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const selected = study.evidence.find((item) => item.id === active);
  const cardHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active) cardHeading.current?.focus();
  }, [active]);
  function open(id: string, event: React.MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setActive(id);
    if (!draft.opened.includes(id)) update({ opened: [...draft.opened, id] });
  }
  function pin(id: string) {
    update({
      pinned: draft.pinned.includes(id)
        ? draft.pinned.filter((item) => item !== id)
        : [...draft.pinned, id],
    });
  }
  return (
    <>
      <div className="paper-board-map" aria-label="The paper’s evidence trail">
        <div>
          <Icon name="search" size={21} />
          <strong>Question</strong>
          <span>{study.question}</span>
        </div>
        {["design", "finding", "limitation"].map((kind) => (
          <div
            key={kind}
            className={
              study.evidence.some(
                (item) => item.kind === kind && draft.opened.includes(item.id),
              )
                ? "explored"
                : ""
            }
          >
            <Icon
              name={
                kind === "design"
                  ? "research"
                  : kind === "finding"
                    ? "document"
                    : "shield"
              }
              size={21}
            />
            <strong>
              {kind === "design"
                ? "Approach"
                : kind === "finding"
                  ? "Findings"
                  : "Boundaries"}
            </strong>
            <span>
              {
                study.evidence.filter(
                  (item) =>
                    item.kind === kind && draft.opened.includes(item.id),
                ).length
              }{" "}
              of {study.evidence.filter((item) => item.kind === kind).length}{" "}
              cards opened
            </span>
          </div>
        ))}
      </div>
      <section className="paper-pinboard" aria-label="Pinned evidence">
        <div>
          <Icon name="verify" size={20} />
          <strong>Your evidence trail</strong>
          <span>{draft.pinned.length} pinned</span>
        </div>
        {draft.pinned.length ? (
          <ul>
            {study.evidence
              .filter((item) => draft.pinned.includes(item.id))
              .map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <button
                    aria-label={`Unpin ${item.label}`}
                    onClick={() => pin(item.id)}
                  >
                    <Icon name="close" size={16} />
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <p>
            Open a card, then pin what you would use to explain the paper.
            Include a boundary, not just a result.
          </p>
        )}
      </section>
      <div className="paper-board-toolbar">
        <h2>
          On the table{" "}
          <span>
            {draft.opened.length}/{study.evidence.length} opened
          </span>
        </h2>
        <label>
          Show{" "}
          <select
            aria-label="Show evidence"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setActive(null);
            }}
          >
            <option value="all">All evidence</option>
            <option value="design">Approach</option>
            <option value="finding">Findings</option>
            <option value="limitation">Boundaries</option>
          </select>
        </label>
      </div>
      <div className="paper-evidence-layout">
        <div className="paper-evidence-grid">
          {study.evidence
            .filter((item) => filter === "all" || item.kind === filter)
            .map((item, index) => {
              const opened = draft.opened.includes(item.id);
              const pinned = draft.pinned.includes(item.id);
              return (
                <article
                  className={`paper-evidence-card evidence-${item.kind} ${active === item.id ? "active" : ""} ${opened ? "opened" : ""}`}
                  key={item.id}
                >
                  <span className="paper-evidence-index">
                    E{study.evidence.indexOf(item) + 1}
                  </span>
                  <span className="paper-evidence-type">
                    {item.kind === "design"
                      ? "Approach"
                      : item.kind === "finding"
                        ? "Finding"
                        : "Boundary"}
                  </span>
                  <h3>{item.label}</h3>
                  <p className="paper-card-preview">
                    {opened ? item.text : "Open this source note."}
                  </p>
                  <div>
                    <button
                      className="paper-card-open"
                      onClick={(event) => open(item.id, event)}
                      aria-expanded={active === item.id}
                    >
                      <Icon name={opened ? "book" : "search"} size={17} />
                      {opened ? "Inspect card" : "Open card"}
                      <span className="sr-only">: {item.label}</span>
                    </button>
                    {opened ? (
                      <button
                        className="paper-pin"
                        aria-label={`${pinned ? "Unpin" : "Pin"} ${item.label}`}
                        aria-pressed={pinned}
                        onClick={() => pin(item.id)}
                      >
                        <Icon name={pinned ? "check" : "verify"} size={18} />
                        {pinned ? "Pinned" : "Pin"}
                      </button>
                    ) : (
                      <span className="paper-card-seal">Not opened</span>
                    )}
                  </div>
                </article>
              );
            })}
        </div>
        {selected ? (
          <aside className="paper-card-reader" aria-label="Open evidence card">
            <div className="paper-reader-top">
              <span className="paper-eyebrow">
                Evidence E{study.evidence.indexOf(selected) + 1}
              </span>
              <button
                aria-label="Close evidence card"
                onClick={() => {
                  setActive(null);
                  opener.current?.focus();
                }}
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            <h2 ref={cardHeading} tabIndex={-1}>
              {selected.label}
            </h2>
            <p>{selected.text}</p>
            <span className="paper-source">{selected.sourceLabel}</span>
            <button
              className="btn outline compact"
              onClick={() => pin(selected.id)}
              aria-pressed={draft.pinned.includes(selected.id)}
            >
              <ActionLabel icon="verify">
                {draft.pinned.includes(selected.id)
                  ? "Remove from my evidence"
                  : "Pin to my evidence"}
              </ActionLabel>
            </button>
            <p className="paper-small">
              {selected.kind === "limitation"
                ? "A limitation helps decide how far a conclusion can travel."
                : selected.kind === "design"
                  ? "The approach shapes what the findings can mean."
                  : "A result is useful when you keep its measurement and context attached."}
            </p>
          </aside>
        ) : (
          <aside className="paper-reader-empty">
            <Mascot pose="reading" size="small" />
            <h2>Follow your curiosity.</h2>
            <p>
              Open any card to inspect the evidence. Pin the pieces that help
              you explain the study.
            </p>
          </aside>
        )}
      </div>
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
  return (
    <div
      className={`paper-guide-feedback ${review.ready ? "supported" : "reconsider"}`}
      role="status"
    >
      <span className="paper-eyebrow">
        Authored guide · selected claim and cards
      </span>
      <h3>{review.label}</h3>
      <p>
        {study.claims.find((option) => option.id === draft.claim)?.feedback}
      </p>
      <ul>
        <li>
          {review.relevant.length
            ? "You pinned evidence that supports the interpretation."
            : "Pin evidence that directly supports the interpretation."}
        </li>
        <li>
          {review.boundary
            ? "You kept the counterexample or boundary in view."
            : `Consider “${study.evidence.find((item) => item.id === study.competingEvidenceId)?.label}”. That card complicates the interpretation.`}
        </li>
      </ul>
      <p>
        <strong>Think about this:</strong> {study.coachingQuestion}
      </p>
    </div>
  );
}

function PaperRecap({
  study,
  draft,
  update,
  reset,
}: {
  study: ResearchCase;
  draft: CaseDraft;
  update: (next: Partial<CaseDraft>) => void;
  reset: () => void;
}) {
  const [exported, setExported] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
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
  const review = evidenceReview(study, draft);
  return (
    <>
      <section className="paper-recap-banner">
        <Mascot pose="approving" size="small" />
        <div>
          <h2>You followed a paper from question to claim.</h2>
          <p>{study.takeaway}</p>
          <span>Exploration complete · no mastery score awarded</span>
        </div>
      </section>
      <div className="paper-recap-grid">
        <section
          className="paper-panel paper-paper-map"
          aria-label="Paper recap"
        >
          <span className="paper-eyebrow">The paper in one connected view</span>
          <h2>{study.paper.title}</h2>
          <p className="paper-source">{study.paper.authors}</p>
          {[
            { label: "Question", text: study.question, icon: "search" },
            { label: "Approach", text: study.design, icon: "research" },
            { label: "Findings", text: study.findings, icon: "document" },
            {
              label: "What it does not settle",
              text: study.limitations.join(" "),
              icon: "shield",
            },
          ].map((part) => (
            <article key={part.label}>
              <span className="paper-map-icon">
                <Icon
                  name={
                    part.icon as "search" | "research" | "document" | "shield"
                  }
                  size={21}
                />
              </span>
              <div>
                <h3>{part.label}</h3>
                <p>{part.text}</p>
              </div>
            </article>
          ))}
          {study.paper.url ? (
            <a
              className="paper-original-source"
              href={study.paper.url}
              target="_blank"
              rel="noreferrer"
            >
              Inspect the original paper <Icon name="arrow" size={17} />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <p className="paper-small">
              Fictional study for learning. No original publication exists.
            </p>
          )}
        </section>
        <div className="paper-recap-personal">
          <section
            className="paper-panel"
            aria-label="Your interpretation journey"
          >
            <span className="paper-eyebrow">Your thinking trail</span>
            <h2>
              {draft.initialClaim === draft.claim
                ? "You kept your claim. What strengthened it?"
                : "Your claim changed. What changed it?"}
            </h2>
            <div className="paper-before-after">
              <div>
                <strong>Before opening the evidence</strong>
                <p>
                  {
                    study.claims.find(
                      (option) => option.id === draft.initialClaim,
                    )?.text
                  }
                </p>
                <span>{confidenceLabels[draft.initialConfidence - 1]}</span>
                {draft.initialExplanation ? (
                  <blockquote>{draft.initialExplanation}</blockquote>
                ) : null}
              </div>
              <div>
                <strong>After exploring</strong>
                <p>
                  {
                    study.claims.find((option) => option.id === draft.claim)
                      ?.text
                  }
                </p>
                <span>{confidenceLabels[draft.confidence - 1]}</span>
              </div>
            </div>
            <p
              className={`paper-recap-guide ${review.ready ? "supported" : "reconsider"}`}
            >
              <strong>Guide check: {review.label}</strong>
            </p>
            {!review.ready ? (
              <button
                className="btn outline compact"
                onClick={() => update({ phase: "claim" })}
              >
                Revisit my interpretation
              </button>
            ) : null}
            <details>
              <summary>My explanation and pinned evidence</summary>
              <p>{draft.explanation || "No written explanation added."}</p>
              <p className="paper-small">Writing not AI assessed.</p>
              <ul>
                {study.evidence
                  .filter((item) => draft.pinned.includes(item.id))
                  .map((item) => (
                    <li key={item.id}>
                      {item.label} · {item.sourceLabel}
                    </li>
                  ))}
              </ul>
            </details>
          </section>
          <section className="paper-panel" aria-label="Transfer reflection">
            <span className="paper-eyebrow">The idea in a new setting</span>
            <h2>
              {draft.transferChoice === study.transfer.supportedOptionId
                ? "You carried the distinction across."
                : "Keep this distinction in view."}
            </h2>
            <p>
              {
                study.transfer.options.find(
                  (option) => option.id === draft.transferChoice,
                )?.feedback
              }
            </p>
            <button
              className="paper-back"
              onClick={() => update({ phase: "transfer" })}
            >
              Revisit the new setting
            </button>
          </section>
          <section className="paper-panel">
            <label className="paper-field-label" htmlFor="paper-reflection">
              Explain the paper to your future self
            </label>
            <p id="reflection-help">
              What did it ask, what did it find, and what should someone be
              careful not to conclude?
            </p>
            <textarea
              id="paper-reflection"
              rows={5}
              maxLength={1500}
              value={draft.reflection}
              onChange={(event) => update({ reflection: event.target.value })}
              aria-describedby="reflection-help"
            />
            <div className="paper-recap-actions">
              <button className="btn primary" onClick={download}>
                <ActionLabel icon="document">Keep my paper notes</ActionLabel>
              </button>
              <button
                className="paper-back"
                onClick={() => update({ phase: "claim" })}
              >
                Edit my interpretation
              </button>
            </div>
            <p className="paper-small" role="status">
              {exported
                ? "Your notes file was prepared. It includes the paper recap and your current writing."
                : "Notes are saved in this tab. Export a copy to keep them after closing it."}
            </p>
            {exportError ? (
              <div className="paper-inline-notice" role="alert">
                <p>
                  The notes file could not be prepared. Your writing is still
                  saved here. You can select and copy the text below.
                </p>
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
          </section>
        </div>
      </div>
      <div className="paper-recap-end">
        <Link className="btn outline" href="/lab">
          <ActionLabel>Choose another paper trail</ActionLabel>
        </Link>
        {confirmReset ? (
          <div
            className="paper-replay-confirm"
            role="group"
            aria-label="Restart this case"
          >
            <span>
              Start a new trail? This replaces this case’s saved notes in this
              tab.
            </span>
            <button
              onClick={() => {
                reset();
                setConfirmReset(false);
              }}
            >
              Start fresh
            </button>
            <button onClick={() => setConfirmReset(false)}>
              Keep my trail
            </button>
          </div>
        ) : (
          <button className="paper-back" onClick={() => setConfirmReset(true)}>
            Explore this paper again
          </button>
        )}
      </div>
    </>
  );
}
