import React from "react";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import { ArrowRight, BookOpen, FileText, Link, Upload } from "lucide-react";
import { UploadGuide } from "./UploadGuide.js";
import { readActivePreparation } from "../research/client-state.js";
const PAPER_DIGEST =
  "6df5c8f670f4cf8ac0044e0f26111f479a130ce62d5a7d31d763ea5beee7b178";
export function Welcome({
  onStart,
  onResearchFile,
  onResearchLink,
}: {
  onStart: (label: string) => void;
  onResearchFile?: (file: File) => void;
  /** Upload-first home: any pasted link starts the sample journey. */
  onResearchLink?: (link: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const checkVersion = useRef(0);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [checking, setChecking] = useState(false);
  // A paper still being prepared in this browser comes first on return.
  const [preparing] = useState(readActivePreparation);
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
    if (onResearchLink) {
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
    <main id="main" tabIndex={-1} className="welcome page-enter upload-home">
      <section
        className="welcome-intro home-guide"
        aria-label="Your research guide"
      >
        <UploadGuide />
        <div className="speech">
          <p>
            Big paper? Small steps.
            <br />
            <strong>Let’s make sense of it.</strong>
          </p>
        </div>
      </section>
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
        </div>
        <h1 id="welcome-title">Upload your research paper</h1>
        <p className="lede">
          Explore its ideas through questions, evidence and feedback.
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
            {checking ? "Checking your paper…" : "Upload PDF"}
          </button>
          <p className="micro">PDF up to 4 MB · or drag and drop</p>
        </div>
        <div className="home-paper-link">
          <div className="divider">
            <span />
            or
            <span />
          </div>
          <label className="paper-link-label" htmlFor="paper-link">
            Paper URL or DOI
          </label>
          <form className="link-form" onSubmit={submitLink}>
            <Link size={20} aria-hidden="true" />
            <input
              id="paper-link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste any paper link or DOI (not fetched in this preview)"
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
            Links aren’t fetched yet. Upload the PDF, or choose a prepared
            study.
          </p>
        </div>
        {error ? (
          <div>
            <p className="error-message" role="alert">
              {error}
            </p>
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
          </div>
        ) : null}
      </section>
      <div
        className={`home-secondary-actions ${preparing ? "has-resume" : ""}`}
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
        {preparing ? (
          <a
            className="home-resume-action"
            href={`#/research/processing/${encodeURIComponent(preparing.id)}`}
          >
            Return to your paper
            <ArrowRight size={18} />
          </a>
        ) : null}
      </div>
    </main>
  );
}
