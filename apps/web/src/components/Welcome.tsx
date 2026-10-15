import React from "react";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Link,
  Upload,
  Sparkles,
  Clock3,
} from "lucide-react";
import { Mascot } from "./Mascot.js";
import type { Session } from "@paperquest/lesson-state";
const PAPER_DIGEST =
  "6df5c8f670f4cf8ac0044e0f26111f479a130ce62d5a7d31d763ea5beee7b178";
export function Welcome({
  onStart,
  session,
  onResume,
  onResearchFile,
  complete = false,
}: {
  onStart: (label: string) => void;
  session: Session;
  onResume: () => void;
  onResearchFile?: (file: File) => void;
  complete?: boolean;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const checkVersion = useRef(0);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [checking, setChecking] = useState(false);
  useEffect(
    () => () => {
      checkVersion.current += 1;
    },
    [],
  );
  async function chooseFile(file?: File) {
    if (!file || checking) return;
    setError("");
    if (
      !file.name.toLowerCase().endsWith(".pdf") ||
      file.size > (onResearchFile ? 4000000 : 20 * 1024 * 1024)
    ) {
      setError(
        onResearchFile
          ? "Choose a PDF under 4 megabytes."
          : "Choose a research paper in PDF format, under 20 megabytes.",
      );
      return;
    }
    const version = ++checkVersion.current;
    const isCurrent = () => checkVersion.current === version;
    setChecking(true);
    try {
      if (onResearchFile) {
        const header = new TextDecoder().decode(
          await file.slice(0, 5).arrayBuffer(),
        );
        if (!isCurrent()) return;
        if (!file.size || header !== "%PDF-") {
          setError(
            "This file is empty or does not contain a valid PDF header.",
          );
          return;
        }
        onResearchFile(file);
        return;
      }
      const bytes = await file.arrayBuffer();
      if (!isCurrent()) return;
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      if (!isCurrent()) return;
      const hex = [...new Uint8Array(digest)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("");
      if (hex !== PAPER_DIGEST) {
        setError(
          "This pilot supports one curated texting study. This file does not match that version. Choose the sample below to continue.",
        );
        return;
      }
      onStart(file.name);
    } catch {
      if (isCurrent())
        setError(
          "This file could not be checked. Choose the curated sample below.",
        );
    } finally {
      if (isCurrent()) {
        setChecking(false);
        if (fileInput.current) fileInput.current.value = "";
      }
    }
  }
  function submitLink(event: FormEvent) {
    event.preventDefault();
    const value = link.trim();
    if (
      /^(?:https?:\/\/(?:dx\.)?doi\.org\/)?10\.1177\/0098628313514177\/?$/i.test(
        value,
      )
    ) {
      setError("");
      onStart("Gingerich & Lineweaver · 2014");
    } else
      setError(
        "For this pilot, use 10.1177/0098628313514177 or choose the curated sample below.",
      );
  }
  function drop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void chooseFile(event.dataTransfer.files[0]);
  }
  return (
    <main id="main" className="welcome page-enter">
      <div className="welcome-intro">
        <Mascot pose="approving" />
        <div className="speech">
          <span className="eyebrow">MEET YOUR RESEARCH GUIDE</span>
          <p>
            Big paper? Small steps.
            <br />
            Let’s turn reading into <strong>reasoning.</strong>
          </p>
        </div>
      </div>
      <section
        className={`upload-card ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        aria-labelledby="welcome-title"
      >
        <div className="paper-illustration" aria-hidden="true">
          <FileText size={58} strokeWidth={1.8} />
          <span className="floating-tag">
            <Sparkles size={13} /> SIX QUESTS
          </span>
          <span className="paper-star">✦</span>
        </div>
        <span className="eyebrow green-text">YOUR NEXT RESEARCH ADVENTURE</span>
        <h1 id="welcome-title">
          A little curiosity.
          <br />A lot of discovery.
        </h1>
        <p className="lede">
          Make a choice. Explain your thinking.
          <br />
          Then see what the research actually says.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept=".pdf,application/pdf"
          hidden
          onChange={(e) => void chooseFile(e.target.files?.[0])}
        />
        <button
          className="button primary upload-button"
          onClick={() => fileInput.current?.click()}
          disabled={checking}
        >
          <Upload size={20} />
          {checking
            ? "Checking your paper…"
            : onResearchFile
              ? "Choose a research PDF"
              : "Choose the study PDF"}
        </button>
        <p className="micro">
          Or drop it here.{" "}
          {onResearchFile
            ? "Review your PDF before server extraction and external AI processing."
            : "Your file stays on your device."}
        </p>
        <div className="divider">
          <span />
          or use its paper link
          <span />
        </div>
        <form className="link-form" onSubmit={submitLink}>
          <Link size={20} aria-hidden="true" />
          <label className="sr-only" htmlFor="paper-link">
            Paper link or digital object identifier
          </label>
          <input
            id="paper-link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Paste the curated paper’s link…"
          />
          <button
            className="icon-button blue"
            type="submit"
            aria-label="Open paper adventure"
          >
            <ArrowRight size={22} />
          </button>
        </form>
        <p className="scope-note">
          {onResearchFile
            ? "Use a PDF for a new investigation, or the curated paper’s DOI below for the six-quest adventure."
            : "A focused pilot with one curated paper. General paper extraction is not enabled on this host."}
        </p>
        {error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : null}
      </section>
      {session.started ? (
        <div className="resume-card">
          <div>
            <strong>
              {complete
                ? "You completed this adventure."
                : "You have an adventure in progress."}
            </strong>
            <p>
              {complete
                ? "Revisit your answers and the evidence whenever you like."
                : "Your answers are saved on this device."}
            </p>
          </div>
          <button className="button neutral" onClick={onResume}>
            {complete ? "Review adventure" : "Resume"} <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
      <section className="sample-section" aria-labelledby="sample-title">
        <div className="section-label">
          <span className="line" />
          <h2 id="sample-title">No paper handy? Start here.</h2>
          <span className="line" />
        </div>
        <button
          className="sample-card"
          onClick={() => onStart("Gingerich & Lineweaver · 2014")}
        >
          <span className="sample-icon">
            <BookOpen size={28} />
          </span>
          <span className="sample-copy">
            <span className="eyebrow blue-text">
              COGNITIVE PSYCHOLOGY · 2014
            </span>
            <strong>Can you text and still learn?</strong>
            <span>Gingerich & Lineweaver · A classroom experiment</span>
          </span>
          <span className="sample-arrow">
            <ArrowRight size={23} />
          </span>
        </button>
        <div className="reasoning-preview-entry">
          <div>
            <strong>A correct choice can still hide a misconception.</strong>
            <p>Choose → Explain → Check evidence → Revise</p>
            <span>Authored example · no AI calls</span>
          </div>
          <a href="#/research/reasoning" className="reasoning-preview-link">
            Try the reasoning preview
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="welcome-details">
          <span>
            <Clock3 size={16} /> About 10 minutes
          </span>
          <span>
            <Check size={16} /> Evidence after your attempt
          </span>
          <span>
            <Sparkles size={16} /> Two new scenarios
          </span>
        </div>
      </section>
    </main>
  );
}
