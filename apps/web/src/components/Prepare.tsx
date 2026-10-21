import React, { lazy, Suspense } from "react";
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
const PaperStory = lazy(() =>
  import("./PaperStory.js").then((module) => ({
    default: module.PaperStory,
  })),
);
import { PaperIdentity } from "./PaperIdentity.js";
import { ChunkBoundary } from "./ChunkBoundary.js";

export function Prepare({
  lesson,
  error,
  onRetry,
  onStart,
  onBack,
}: {
  lesson: Lesson | null;
  error: string;
  onRetry: () => void;
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <main id="main" className="prepare page-enter">
      <section className="card study-cover">
        <span className="sample-icon">
          <FileText size={28} />
        </span>
        <div className="study-cover-body">
          <span className="eyebrow blue-text">A CLASSROOM EXPERIMENT</span>
          <h1>Can you text and still learn?</h1>
          <PaperIdentity plain />
        </div>
      </section>
      <ChunkBoundary label="The study story">
        <Suspense fallback={<p role="status">Opening the study story…</p>}>
          <PaperStory />
        </Suspense>
      </ChunkBoundary>
      <div className="paper-actions">
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
      <section className="source-card">
        <details className="preparation-details" open={!lesson}>
          <summary>How this investigation works</summary>
          <div className="preparation-list">
            <div className="preparation-item">
              <span className="tile green">
                <BookOpen />
              </span>
              <div>
                <h3>A study to explore</h3>
                <p>Study design, group averages, and the limits of a claim.</p>
              </div>
              {lesson ? (
                <Check className="green-text" />
              ) : (
                <span className="loading-dot" />
              )}
            </div>
            <div className="preparation-item">
              <span className="tile blue">
                <ShieldCheck />
              </span>
              <div>
                <h3>Evidence behind each answer</h3>
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
            <div className="preparation-item">
              <span className="tile amber">
                <MessageCircle />
              </span>
              <div>
                <h3>Feedback on your thinking</h3>
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
          {lesson ? <p className="review-note">{lesson.reviewStatus}</p> : null}
        </details>
      </section>
      {error ? (
        <div className="error-message" role="alert">
          <p>{error}</p>
          <button className="button neutral" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : null}
    </main>
  );
}
