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
  onResearchLink,
  complete = false,
  uploadFirst = false,
}: {
  onStart: (label: string, note?: string) => void;
  session: Session;
  onResume: () => void;
  onResearchFile?: (file: File) => void;
  /** Upload-first home: any pasted link starts the sample journey. */
  onResearchLink?: (link: string) => void;
  complete?: boolean;
  uploadFirst?: boolean;
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
    if (!value) {
      setError("Paste a paper link or DOI to continue.");
      return;
    }
    setError("");
    if (uploadFirst && onResearchLink) {
      onResearchLink(value);
      return;
    }
    const isSample =
      /^(?:https?:\/\/(?:dx\.)?doi\.org\/)?10\.1177\/0098628313514177\/?$/i.test(
        value,
      );
    if (!isSample) {
      setError(
        "We can’t open this link. Upload the PDF instead, or try a prepared study.",
      );
      return;
    }
    onStart("Gingerich & Lineweaver · 2014");
  }
  function drop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    void chooseFile(event.dataTransfer.files[0]);
  }
  return (
    <main
      id="main"
      tabIndex={-1}
      className={`welcome page-enter ${uploadFirst ? "upload-home" : ""}`}
    >
      {uploadFirst ? (
        <section
          className="welcome-intro home-guide"
          aria-label="Your research guide"
        >
          <Mascot pose="guiding" />
          <div className="speech">
            <p>
              Big paper? Small steps.
              <br />
              <strong>Let’s make sense of it.</strong>
            </p>
          </div>
        </section>
      ) : (
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
      )}
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
          {!uploadFirst ? (
            <>
              <span className="floating-tag">
                <Sparkles size={13} /> SIX QUESTS
              </span>
              <span className="paper-star">✦</span>
            </>
          ) : null}
        </div>
        {!uploadFirst ? (
          <span className="eyebrow green-text">
            YOUR NEXT RESEARCH ADVENTURE
          </span>
        ) : null}
        {uploadFirst ? (
          <h1 id="welcome-title">Upload your research paper</h1>
        ) : (
          <h1 id="welcome-title">
            A little curiosity.
            <br />A lot of discovery.
          </h1>
        )}
        <p className="lede">
          {uploadFirst ? (
            "Explore its ideas through questions, evidence and feedback."
          ) : (
            <>
              Make a choice. Explain your thinking.
              <br />
              Then see what the research actually says.
            </>
          )}
        </p>
        <div className="home-upload-well">
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
              : uploadFirst
                ? "Upload PDF"
                : onResearchFile
                  ? "Choose a research PDF"
                  : "Choose the study PDF"}
          </button>
          <p className="micro">
            {uploadFirst ? (
              "PDF up to 4 MB · or drag and drop"
            ) : (
              <>
                Or drop it here.{" "}
                {onResearchFile
                  ? "Review your PDF before server extraction and external AI processing."
                  : "Your file stays on your device."}
              </>
            )}
          </p>
        </div>
        <div className="home-paper-link">
          <div className="divider">
            <span />
            {uploadFirst ? "or" : "or use its paper link"}
            <span />
          </div>
          <label
            className={uploadFirst ? "paper-link-label" : "sr-only"}
            htmlFor="paper-link"
          >
            {uploadFirst
              ? "Paper URL or DOI"
              : "Paper link or digital object identifier"}
          </label>
          <form className="link-form" onSubmit={submitLink}>
            <Link size={20} aria-hidden="true" />
            <input
              id="paper-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={
                uploadFirst
                  ? "Paste any paper link or DOI (not fetched in this preview)"
                  : "Paste the curated paper’s link…"
              }
            />
            <button
              className="icon-button blue"
              type="submit"
              aria-label="Build my quest"
            >
              <ArrowRight size={22} />
            </button>
          </form>
          <p className="scope-note">
            {uploadFirst
              ? "Sample preview: links aren’t fetched yet. Any link opens the prepared texting study."
              : onResearchFile
                ? "Use a PDF for a new quest, or the curated paper’s DOI below for the eight-decision quest."
                : "A focused pilot with one curated paper. General paper extraction is not enabled on this host."}
          </p>
        </div>
        {error ? (
          <div>
            <p className="error-message" role="alert">
              {error}
            </p>
            {uploadFirst ? (
              <div className="actions">
                <button
                  className="btn outline compact"
                  onClick={() => fileInput.current?.click()}
                >
                  Upload a different paper
                </button>
                <a className="btn outline compact" href="#/research/learn">
                  View prepared studies
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
      {uploadFirst ? (
        <div
          className={`home-secondary-actions ${session.started ? "has-resume" : ""}`}
        >
          <button
            className="home-sample-action"
            onClick={() => onStart("Gingerich & Lineweaver · 2014")}
          >
            <span className="home-sample-icon">
              <BookOpen size={21} />
            </span>
            <span>
              <small>No paper handy?</small>
              <strong>Try a sample paper</strong>
            </span>
            <ArrowRight size={19} />
          </button>
          {session.started ? (
            <button className="home-resume-action" onClick={onResume}>
              {complete ? "Review quest" : "Resume quest"}
              <ArrowRight size={18} />
            </button>
          ) : null}
        </div>
      ) : null}
      {session.started && !uploadFirst ? (
        <div className="resume-card">
          <div>
            <strong>
              {complete
                ? "You completed this quest."
                : "You have a quest in progress."}
            </strong>
            <p>
              {complete
                ? "Revisit your answers and the evidence whenever you like."
                : "Your answers are saved on this device."}
            </p>
          </div>
          <button className="button neutral" onClick={onResume}>
            {complete ? "Review quest" : "Resume"} <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
      {!uploadFirst ? (
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
      ) : null}
    </main>
  );
}
