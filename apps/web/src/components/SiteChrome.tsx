import React from "react";
import { CircleHelp, Settings, Star } from "lucide-react";
import { BrandLogo } from "./BrandLogo.js";
// Styles load globally from main.tsx so Node interface tests can import this.

export type SiteSection = "upload" | "studies" | "quests" | "glossary" | null;

const links: {
  id: Exclude<SiteSection, null>;
  href: string;
  label: string;
  short: string;
}[] = [
  { id: "upload", href: "#/", label: "Upload a paper", short: "Upload" },
  {
    id: "studies",
    href: "#/research/learn",
    label: "Learn",
    short: "Learn",
  },
  {
    id: "quests",
    href: "#/research/history",
    label: "My quests",
    short: "Quests",
  },
];

/**
 * One header for the upload-first home and every research screen, so moving
 * from intake into review, preparation and play never swaps the site chrome.
 */
export function SiteHeader({
  current,
  points,
  onHome,
}: {
  current: SiteSection;
  points?: number | null;
  onHome?: () => void;
}) {
  const home = (event: React.MouseEvent) => {
    if (!onHome) return;
    event.preventDefault();
    onHome();
  };
  return (
    <header className="gr-header">
      <div className="gr-header-inner">
        <a
          className="gr-brand"
          href="#/"
          aria-label="Gradly home"
          onClick={home}
        >
          <BrandLogo />
        </a>
        <nav className="gr-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={current === link.id ? "page" : undefined}
              onClick={link.id === "upload" ? home : undefined}
            >
              <span className="gr-label-long">{link.label}</span>
              {/* Only one label is displayed, so only one is announced. */}
              <span className="gr-label-short">{link.short}</span>
            </a>
          ))}
        </nav>
        <div className="gr-header-tools">
          {typeof points === "number" ? (
            <span
              className="gr-points"
              aria-label={`${points} practice points`}
            >
              <Star size={16} aria-hidden="true" />
              <strong>{points}</strong>
              <span>points</span>
            </span>
          ) : null}
          <a
            className="gr-icon-link"
            href="#/research/settings"
            aria-label="Guest settings"
          >
            <Settings size={20} aria-hidden="true" />
          </a>
          <a
            className="gr-icon-link"
            href="#/research/help"
            aria-label="How it works"
          >
            <CircleHelp size={21} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="gr-footer">
      <div className="gr-footer-inner">
        <span className="gr-footer-brand">
          <BrandLogo />
          <span>Learn to question. Grow with evidence.</span>
        </span>
        <nav aria-label="Footer">
          <a href="#/research/privacy">Privacy</a>
          <a href="#/research/help">Help</a>
        </nav>
      </div>
    </footer>
  );
}
