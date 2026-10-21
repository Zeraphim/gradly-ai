import React from "react";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  ExternalLink,
  RotateCcw,
  Trophy,
} from "lucide-react";
import type { Lesson } from "@paperquest/contracts";
import { points, type Session } from "@paperquest/lesson-state";
import { Mascot } from "./Mascot.js";
export function Complete({
  lesson,
  session,
  onRestart,
  onReview,
}: {
  lesson: Lesson;
  session: Session;
  onRestart: () => void;
  onReview: (id: string) => void;
}) {
  const [notice, setNotice] = useState("");
  const firstTry = lesson.questions.filter(
    (q) =>
      session.questions[q.id]?.attempts[0]?.response?.feedback.outcome ===
      "correct",
  ).length;
  const scoringCount = lesson.questions.length - 1;
  /* Count what the learner actually finished, not a number typed into the copy. */
  const requiredCount = lesson.questions.filter((q) => !q.transfer).length;
  const bonusCount = lesson.questions.filter((q) => q.transfer).length;
  function download() {
    const text = [
      "Gradly · Quest notes",
      lesson.title,
      lesson.authors,
      lesson.sourceUrl,
      `Feedback mode: ${lesson.mode}. ${lesson.reviewStatus}`,
      "",
      ...lesson.questions.flatMap((q) => {
        const state = session.questions[q.id];
        const f = state?.attempts.at(-1)?.response?.feedback;
        return [
          q.title,
          q.prompt,
          `Choice: ${state?.choice ?? ""}`,
          `Your explanation: ${state?.explanation ?? ""}`,
          f?.strength ?? "",
          f?.correction ?? "",
          `Next step: ${f?.nextStep ?? ""}`,
          ...(f?.evidence.map((e) => `Evidence: ${e.text} (${e.location})`) ??
            []),
          "",
        ];
      }),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gradly-quest-notes.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Your quest notes are ready to keep.");
  }
  return (
    <main id="main" className="complete page-enter">
      <div className="completion-hero">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
        <Mascot size="large" pose="celebrating" />
        <span className="badge green">
          <Check size={15} /> QUEST COMPLETE
        </span>
        <h1>Curiosity, meet evidence.</h1>
        <p>
          You explored the study, revised your reasoning,
          <br className="desktop-break" /> and tried two new scenarios.
        </p>
      </div>
      <div className="result-stats">
        <div className="card">
          <span className="tile amber">
            <Trophy />
          </span>
          <div>
            <span className="eyebrow">
              {lesson.mode === "preview" ? "SAMPLE POINTS" : "REASONING POINTS"}
            </span>
            <strong>
              {points(session)} / {scoringCount * 10}
            </strong>
            <small>One award per correct quest</small>
          </div>
        </div>
        <div className="card">
          <span className="tile blue">
            <Check />
          </span>
          <div>
            <span className="eyebrow">
              {lesson.mode === "preview"
                ? "FIRST CHOICE MATCHES"
                : "FIRST-ATTEMPT CHECKS"}
            </span>
            <strong>
              {firstTry} / {scoringCount}
            </strong>
            <small>Evidence boundary is ungraded</small>
          </div>
        </div>
      </div>
      {lesson.mode === "preview" ? (
        <p className="preview-note">
          Local preview checked your choices, not your explanations. These
          results do not measure learning or reasoning quality.
        </p>
      ) : (
        <p className="review-note">
          These checks record lesson activity. They do not establish mastery or
          a learning benefit.
        </p>
      )}
      <section className="card paper-reveal">
        <div className="paper-reveal-top">
          <span className="sample-icon">
            <BookOpen size={25} />
          </span>
          <div>
            <span className="eyebrow blue-text">
              THE ORIGINAL INVESTIGATION
            </span>
            <h2>Keep the paper. Keep questioning.</h2>
          </div>
        </div>
        <div className="paper-citation">
          <h3>{lesson.sourceTitle}</h3>
          <p>
            {lesson.authors} · {lesson.year}
          </p>
          <p className="muted">Teaching of Psychology · 41(1), 44–51</p>
          <a
            className="text-button blue-text"
            href={lesson.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open the original paper <ExternalLink size={16} />
          </a>
        </div>
        <p className="micro">
          Publisher access may be required. The original paper is not
          distributed with this app.
        </p>
      </section>
      <section className="recap">
        <div className="row-between">
          <h2>Your reasoning trail</h2>
          <span className="micro">Six completed checkpoints</span>
        </div>
        <div className="recap-list">
          {lesson.questions.map((q, index) => (
            <button
              className="recap-item"
              key={q.id}
              onClick={() => onReview(q.id)}
            >
              <span className="path-number">
                <Check size={15} />
              </span>
              <span>
                <strong>{q.title}</strong>
                <small>
                  {q.transfer ? "New scenario" : "The texting study"} ·{" "}
                  {session.questions[q.id]?.attempts.length ?? 0} attempt
                  {session.questions[q.id]?.attempts.length === 1 ? "" : "s"}
                </small>
              </span>
              <ArrowRight size={19} />
            </button>
          ))}
        </div>
      </section>
      <div className="complete-actions">
        <button className="button neutral" onClick={download}>
          <Download size={18} /> Keep my notes
        </button>
        <button className="button primary" onClick={onRestart}>
          <RotateCcw size={18} /> Try another quest
        </button>
      </div>
      <p className="micro notice" role="status">
        {notice}
      </p>
    </main>
  );
}
