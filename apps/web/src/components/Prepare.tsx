import React from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Lesson } from "@paperquest/contracts";
import { Owl } from "./Owl.js";
import { Progress } from "./Progress.js";
export function Prepare({
  lesson,
  label,
  error,
  onRetry,
  onStart,
  onBack,
}: {
  lesson: Lesson | null;
  label: string;
  error: string;
  onRetry: () => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <main id="main" className="prepare page-enter">
      <div className="guide-row">
        <Owl />
        <div className="speech">
          <p>
            {lesson
              ? "Your adventure is ready. Bring your curiosity. I’ll bring the evidence."
              : "Let’s get your research adventure ready."}
          </p>
        </div>
      </div>
      <section className="card study-cover">
        <span className="sample-icon">
          <FileText size={28} />
        </span>
        <div>
          <span className="eyebrow blue-text">COGNITIVE PSYCHOLOGY · 2014</span>
          <h1>Can you text and still learn?</h1>
          <p className="muted">{label}</p>
        </div>
      </section>
      <section className="card readiness" aria-live="polite">
        <div className="row-between">
          <strong>
            {lesson ? "ADVENTURE READY" : "LOADING THE CURATED LESSON"}
          </strong>
          <span className="green-text">{lesson ? "100%" : "Loading…"}</span>
        </div>
        <Progress value={lesson ? 1 : 0} label="Lesson readiness" />
      </section>
      <div className="preparation-list">
        <div className="card preparation-item">
          <span className="tile green">
            <BookOpen />
          </span>
          <div>
            <h2>A study to explore</h2>
            <p>Study design, group averages, and the limits of a claim.</p>
          </div>
          {lesson ? (
            <Check className="green-text" />
          ) : (
            <span className="loading-dot" />
          )}
        </div>
        <div className="card preparation-item">
          <span className="tile blue">
            <ShieldCheck />
          </span>
          <div>
            <h2>Evidence behind each answer</h2>
            <p>
              Curated paraphrases with source locations, revealed after an
              attempt.
            </p>
          </div>
          {lesson ? (
            <Check className="green-text" />
          ) : (
            <span className="loading-dot" />
          )}
        </div>
        <div className="card preparation-item">
          <span className="tile amber">
            <MessageCircle />
          </span>
          <div>
            <h2>Feedback on your thinking</h2>
            <p>
              {lesson?.mode === "nebius"
                ? "Your explanation will be assessed by Nemotron on Nebius."
                : lesson?.mode === "preview"
                  ? "Local preview checks choices. Explanations are not assessed."
                  : "The host must configure live feedback or enable local preview."}
            </p>
          </div>
          {lesson && lesson.mode !== "unconfigured" ? (
            <Check className="green-text" />
          ) : null}
        </div>
      </div>
      {error ? (
        <div className="error-message" role="alert">
          <p>{error}</p>
          <button className="button neutral" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : null}
      {lesson ? <p className="review-note">{lesson.reviewStatus}</p> : null}
      <div className="prepare-actions">
        <button
          className="button primary"
          onClick={onStart}
          disabled={!lesson || lesson.mode === "unconfigured"}
        >
          <Sparkles size={20} /> Let’s explore <ArrowRight size={20} />
        </button>
        <button className="text-button" onClick={onBack}>
          Choose another starting point
        </button>
      </div>
    </main>
  );
}
