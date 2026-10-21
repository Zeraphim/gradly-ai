import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import type { FeedbackResponse, Lesson, Question } from "@paperquest/contracts";
import { emptyQuestion, type Session } from "@paperquest/lesson-state";
import { Mascot, type MascotPose } from "./Mascot.js";
import { Progress } from "./Progress.js";
export function LessonView({
  lesson,
  session,
  pending,
  error,
  onDraft,
  onSubmit,
  onNext,
  onPause,
  onReview,
}: {
  lesson: Lesson;
  session: Session;
  pending: boolean;
  error: string;
  onDraft: (draft: { choice?: string; explanation?: string }) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPause: () => void;
  onReview: (id: string) => void;
}) {
  const question = lesson.questions[session.current]!;
  const state = session.questions[question.id] ?? emptyQuestion();
  const latest = state.attempts.at(-1);
  const response = latest?.response;
  const completed = lesson.questions.filter(
    (q) => session.questions[q.id]?.finished,
  ).length;
  const [hint, setHint] = useState(false);
  const [prolonged, setProlonged] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    setHint(false);
  }, [question.id]);
  useEffect(() => {
    if (!pending) {
      setProlonged(false);
      return;
    }
    const timer = setTimeout(() => setProlonged(true), 8000);
    return () => clearTimeout(timer);
  }, [pending]);
  const pose: MascotPose = pending
    ? "studying"
    : error || response?.feedback.outcome === "needs_revision"
      ? "caring"
      : response?.feedback.outcome === "insufficient_evidence"
        ? "thinking"
        : response?.feedback.outcome === "correct"
          ? "approving"
          : hint
            ? "teaching"
            : question.transfer
              ? "determined"
              : "guiding";
  const valid = !!state.choice && !!state.explanation.trim();
  return (
    <main id="main" className="lesson-layout">
      <aside className="quest-sidebar">
        <button className="text-button" onClick={onPause}>
          <ChevronLeft size={18} /> Pause quest
        </button>
        <div className="sidebar-title">
          <span className="eyebrow">YOUR ADVENTURE</span>
          <h2>Follow the evidence.</h2>
          <p>One idea at a time.</p>
        </div>
        <ol className="quest-path">
          {lesson.questions.map((q, index) => {
            const finished = session.questions[q.id]?.finished;
            const active = index === session.current;
            return (
              <li
                key={q.id}
                className={active ? "current" : finished ? "done" : "locked"}
              >
                <button
                  disabled={!finished || active || pending}
                  onClick={() => onReview(q.id)}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="path-number">
                    {finished ? <Check size={16} /> : index + 1}
                  </span>
                  <span>
                    <strong>{q.stage}</strong>
                    <small>
                      {q.transfer ? "New scenario" : "The texting study"}
                    </small>
                  </span>
                  {!finished && !active ? <LockKeyhole size={13} /> : null}
                </button>
              </li>
            );
          })}
        </ol>
        <div className="sidebar-note">
          <Mascot size="small" pose="reading" />
          <p>
            A good answer says <strong>why.</strong>
            <br />
            Revising is part of the quest.
          </p>
        </div>
      </aside>
      <div className="lesson-main">
        <div className="lesson-progress">
          <div className="row-between">
            <span>
              QUEST {session.current + 1} OF {lesson.questions.length}
            </span>
            <span>{completed} completed</span>
          </div>
          <Progress
            value={completed / lesson.questions.length}
            label="Completed quests"
          />
        </div>
        <div className="quest-content page-enter" key={question.id}>
          <div className="guide-row compact">
            <Mascot size="small" pose={pose} />
            <div className="speech">
              <p>
                {question.transfer
                  ? "New setting. Same careful thinking. Try applying what you learned."
                  : "Take a closer look. Choose your answer, then tell me why."}
              </p>
            </div>
          </div>
          <div className="question-heading">
            <span className={`badge ${question.transfer ? "amber" : "green"}`}>
              {question.transfer ? (
                <Sparkles size={14} />
              ) : (
                <CircleHelp size={14} />
              )}{" "}
              {question.stage}
            </span>
            <h1 ref={headingRef} tabIndex={-1}>
              {question.title}
            </h1>
          </div>
          <section className="card study-info" aria-label="Study information">
            <div className="row-between">
              <span className="eyebrow">
                {question.transfer
                  ? "A NEW TEACHING SCENARIO"
                  : "EXPERIMENT 2 · THE STUDY"}
              </span>
              <button
                className="text-button"
                aria-expanded={hint}
                onClick={() => setHint(!hint)}
              >
                <Lightbulb size={17} /> {hint ? "Hide hint" : "Give me a hint"}
              </button>
            </div>
            <p>{question.study}</p>
            {question.chart ? <ScoreChart question={question} /> : null}
            {hint ? <p className="hint reveal-enter">{question.hint}</p> : null}
          </section>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (valid && !pending && !state.finished) onSubmit();
            }}
          >
            <fieldset disabled={pending || state.finished} className="choices">
              <legend>{question.prompt}</legend>
              {question.choices.map((choice, index) => (
                <label
                  className={`choice ${state.choice === choice ? "selected" : ""}`}
                  key={choice}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={choice}
                    checked={state.choice === choice}
                    onChange={() => onDraft({ choice })}
                  />
                  <span className="choice-number">{index + 1}</span>
                  <span className="choice-label">{choice}</span>
                  <span className="choice-check">
                    {state.choice === choice ? <Check size={17} /> : null}
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="explanation">
              <div className="row-between">
                <label htmlFor="explanation">What makes you think that?</label>
                <span className="micro">
                  {state.explanation.length} / 2,000
                </span>
              </div>
              <textarea
                id="explanation"
                value={state.explanation}
                maxLength={2000}
                rows={3}
                placeholder="Connect your choice to the study. A sentence or two is enough."
                disabled={pending || state.finished}
                onChange={(e) => onDraft({ explanation: e.target.value })}
                aria-describedby="explanation-note"
              />
              <p id="explanation-note" className="micro">
                Your explanation matters as much as your choice.
              </p>
            </div>
            {error ? (
              <div className="error-message" role="alert">
                {error}
              </div>
            ) : null}
            {response ? <FeedbackPanel response={response} /> : null}
            <div className={`action-dock ${state.finished ? "success" : ""}`}>
              <div className="action-status" aria-live="polite">
                {pending ? (
                  <>
                    <span className="spinner" />
                    <div>
                      <strong>
                        {prolonged
                          ? "Still reviewing your reasoning…"
                          : "Reviewing your reasoning…"}
                      </strong>
                      <p>
                        Your answer is saved. This can take up to 45 seconds.
                      </p>
                    </div>
                  </>
                ) : state.finished ? (
                  <>
                    <span className="status-icon">
                      <Check size={22} />
                    </span>
                    <div>
                      <strong>
                        {response?.feedback.outcome === "insufficient_evidence"
                          ? "The evidence has a boundary."
                          : lesson.mode === "preview"
                            ? "Sample choice matched."
                            : "Reasoning checked."}
                      </strong>
                      <p>
                        {response?.feedback.outcome === "insufficient_evidence"
                          ? "Knowing what is missing matters. No points for this decision."
                          : "Read the evidence, then take the next step."}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <strong>
                      {response
                        ? "Give it another try."
                        : "Your reasoning comes first."}
                    </strong>
                    <p>
                      {response
                        ? "Revise your explanation using the feedback."
                        : "Evidence appears after you submit an attempt."}
                    </p>
                  </div>
                )}
              </div>
              {state.finished ? (
                <button
                  className="button primary"
                  type="button"
                  onClick={onNext}
                >
                  {session.current === lesson.questions.length - 1
                    ? "Finish quest"
                    : "Continue"}
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  className="button primary"
                  type="submit"
                  disabled={!valid || pending}
                >
                  {pending
                    ? "Reviewing…"
                    : response
                      ? "Check revision"
                      : error
                        ? "Retry feedback"
                        : "Check my reasoning"}
                  {response || error ? (
                    <RotateCcw size={18} />
                  ) : (
                    <ArrowRight size={18} />
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
function ScoreChart({ question }: { question: Question }) {
  const chart = question.chart!;
  return (
    <figure className="score-chart">
      <div className="score-columns">
        {chart.values.map((value, index) => (
          <div
            className={`score-column ${index ? "green-score" : "blue-score"}`}
            key={chart.labels[index]}
          >
            <div className="score-top">
              <span>{chart.labels[index]}</span>
              <strong>
                {value.toFixed(2)}
                <small>%</small>
              </strong>
            </div>
            <div className="score-track">
              <span style={{ transform: `scaleX(${value / 100})` }} />
            </div>
          </div>
        ))}
      </div>
      <figcaption>{chart.caption}</figcaption>
    </figure>
  );
}
function FeedbackPanel({ response }: { response: FeedbackResponse }) {
  const f = response.feedback;
  return (
    <section
      className={`feedback-panel reveal-enter ${f.outcome}`}
      aria-labelledby="feedback-title"
    >
      <span className="eyebrow">
        {f.mode === "preview"
          ? "LOCAL PREVIEW · CHOICE CHECK ONLY"
          : "YOUR REASONING · FEEDBACK"}
      </span>
      <h2 id="feedback-title">
        {f.outcome === "correct"
          ? f.mode === "preview"
            ? "Your choice matches the sample."
            : "You’ve made the connection."
          : f.outcome === "insufficient_evidence"
            ? "There’s a limit to what we know."
            : "Let’s make that reasoning stronger."}
      </h2>
      {f.strength ? <p>{f.strength}</p> : null}
      {f.correction ? <p>{f.correction}</p> : null}
      <div className="next-step">
        <Lightbulb size={18} />
        <p>{f.nextStep}</p>
      </div>
      <details className="evidence" open>
        <summary>
          <BookEvidence /> Evidence revealed <ChevronDown size={16} />
        </summary>
        <div>
          {f.evidence.map((e) => (
            <blockquote key={e.ref}>
              <p>{e.text}</p>
              <cite>
                {e.location}
                {e.sourceUrl ? (
                  <>
                    {" "}
                    ·{" "}
                    <a href={e.sourceUrl} target="_blank" rel="noreferrer">
                      Source paper
                    </a>
                  </>
                ) : null}
              </cite>
            </blockquote>
          ))}
        </div>
      </details>
    </section>
  );
}
function BookEvidence() {
  return (
    <span aria-hidden="true" className="evidence-mark">
      ↳
    </span>
  );
}
