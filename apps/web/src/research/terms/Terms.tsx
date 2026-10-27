import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { BookOpen, FileText, Sparkles } from "lucide-react";
import { AnimatePresence, m, useSceneMotion } from "../scenes/scene-motion.js";
import {
  excerptSnippet,
  pageLabel,
  placePopover,
  segmentText,
  type Placement,
  type TermEntry,
} from "./term-logic.js";
import "./terms.css";

/** Hover intent before a popover opens, and grace before it closes. */
const OPEN_DELAY = 120;
const CLOSE_DELAY = 150;

type Mode = "hover" | "focus" | "pinned";
type Open = { key: string; anchor: HTMLElement; mode: Mode };

type TermsApi = {
  entries: TermEntry[];
  open: Open | null;
  visited: ReadonlySet<string>;
  bodyId: string;
  hoverIn: (key: string, anchor: HTMLElement, e: PointerEvent) => void;
  hoverOut: () => void;
  focusIn: (key: string, anchor: HTMLElement) => void;
  focusOut: (e: FocusEvent) => void;
  toggle: (key: string, anchor: HTMLElement) => void;
  triggerKey: (e: KeyboardEvent) => void;
};

const TermsContext = createContext<TermsApi | null>(null);

/** Viewed terms per study, kept for the page session so marks stay tinted. */
const visitedByScope = new Map<string, Set<string>>();

const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

/**
 * Supplies one challenge's markable terms and owns the single popover. Any
 * change of `resetKey`, such as a submitted answer or a new challenge, closes
 * it immediately.
 */
export function TermProvider({
  entries,
  scope,
  resetKey,
  children,
}: {
  entries: TermEntry[];
  scope: string;
  resetKey: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState<Open | null>(null);
  const [, setVisitedVersion] = useState(0);
  const openRef = useRef(open);
  openRef.current = open;
  const frame = useRef<HTMLDivElement>(null);
  const timers = useRef<{ open?: number; close?: number }>({});
  const bodyId = useId();
  const visited = useMemo(() => {
    let set = visitedByScope.get(scope);
    if (!set) visitedByScope.set(scope, (set = new Set()));
    return set;
  }, [scope]);

  const clearTimers = () => {
    window.clearTimeout(timers.current.open);
    window.clearTimeout(timers.current.close);
  };
  const show = useCallback(
    (next: Open) => {
      clearTimers();
      if (!visited.has(next.key)) {
        visited.add(next.key);
        setVisitedVersion((v) => v + 1);
      }
      setOpen(next);
    },
    [visited],
  );
  const close = useCallback(() => {
    clearTimers();
    setOpen(null);
  }, []);

  // A new challenge or a submitted answer closes the popover at once.
  useEffect(() => close, [resetKey, close]);

  const api = useMemo<TermsApi>(
    () => ({
      entries,
      open,
      visited,
      bodyId,
      hoverIn(key, anchor, e) {
        if (e.pointerType !== "mouse" || !finePointer()) return;
        window.clearTimeout(timers.current.close);
        const current = openRef.current;
        if (current?.mode === "pinned") return;
        // Already showing a term: move to the next one without a delay.
        if (current) return show({ key, anchor, mode: "hover" });
        window.clearTimeout(timers.current.open);
        timers.current.open = window.setTimeout(
          () => show({ key, anchor, mode: "hover" }),
          OPEN_DELAY,
        );
      },
      hoverOut() {
        window.clearTimeout(timers.current.open);
        if (openRef.current?.mode !== "hover") return;
        timers.current.close = window.setTimeout(
          () => setOpen((o) => (o?.mode === "hover" ? null : o)),
          CLOSE_DELAY,
        );
      },
      focusIn(key, anchor) {
        const current = openRef.current;
        if (current?.key === key && current.anchor === anchor) return;
        show({ key, anchor, mode: "focus" });
      },
      focusOut(e) {
        const next = e.relatedTarget as Node | null;
        if (next && frame.current?.contains(next)) return;
        // Focus leaving to nowhere is a click elsewhere; that path closes it.
        if (next && openRef.current && openRef.current.mode !== "hover")
          close();
      },
      toggle(key, anchor) {
        const current = openRef.current;
        if (current?.key === key && current.mode === "pinned") close();
        else show({ key, anchor, mode: "pinned" });
      },
      triggerKey(e) {
        // Tab from a pinned term moves into its popover's source control.
        const current = openRef.current;
        if (e.key !== "Tab" || e.shiftKey || current?.mode !== "pinned") return;
        const target = frame.current?.querySelector<HTMLElement>("button");
        if (!target) return;
        e.preventDefault();
        target.focus();
      },
    }),
    [entries, open, visited, bodyId, show, close],
  );

  // Escape closes from anywhere; a press outside the popover and its terms
  // closes it without blocking that press.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const inside =
        frame.current?.contains(document.activeElement) ||
        document.activeElement === open.anchor;
      close();
      if (inside && open.anchor.tabIndex >= 0) open.anchor.focus();
    };
    const onPointer = (e: globalThis.PointerEvent) => {
      const target = e.target as Element | null;
      if (frame.current?.contains(target)) return;
      if (target?.closest?.("[data-term]")) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open, close]);

  useEffect(() => () => clearTimers(), []);

  const entry = open ? entries.find((e) => e.key === open.key) : undefined;
  return (
    <TermsContext.Provider value={api}>
      {children}
      {typeof document === "undefined"
        ? null
        : createPortal(
            <div className="research-lab term-layer">
              <AnimatePresence>
                {open && entry ? (
                  <TermPopover
                    key="term-popover"
                    ref={frame}
                    entry={entry}
                    open={open}
                    bodyId={bodyId}
                    onClose={close}
                    onPointerEnter={() =>
                      window.clearTimeout(timers.current.close)
                    }
                    onPointerLeave={api.hoverOut}
                  />
                ) : null}
              </AnimatePresence>
            </div>,
            document.body,
          )}
    </TermsContext.Provider>
  );
}

export const useTerms = () => useContext(TermsContext);

/**
 * Text with its terms marked. Marks are buttons, except inside an answer's
 * label, where a button would be part of the answer control: there they are
 * plain marks that open on hover or tap, and the answer's chips row gives
 * keyboard access to the same definitions.
 */
export function TermText({
  text,
  passive = false,
}: {
  text: string;
  passive?: boolean;
}) {
  const terms = useTerms();
  if (!terms?.entries.length || !text) return <>{text}</>;
  return (
    <>
      {segmentText(text, terms.entries).map((segment, i) =>
        segment.key ? (
          <TermMark
            key={`${i}-${segment.key}`}
            entryKey={segment.key}
            passive={passive}
          >
            {segment.text}
          </TermMark>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}

function TermMark({
  entryKey,
  passive,
  chip = false,
  children,
}: {
  entryKey: string;
  passive: boolean;
  chip?: boolean;
  children: ReactNode;
}) {
  const terms = useTerms()!;
  const isOpen = terms.open?.key === entryKey;
  const className = [
    chip ? "term-chip" : "term-mark",
    passive ? "is-passive" : "",
    isOpen ? "is-open" : "",
    terms.visited.has(entryKey) ? "is-visited" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const pointer = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) =>
      terms.hoverIn(entryKey, e.currentTarget, e),
    onPointerLeave: terms.hoverOut,
  };
  if (passive)
    return (
      <span
        className={className}
        data-term={entryKey}
        {...pointer}
        // Keep the answer's press feedback and selection for the answer itself.
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e: MouseEvent<HTMLSpanElement>) => {
          e.preventDefault();
          e.stopPropagation();
          terms.toggle(entryKey, e.currentTarget);
        }}
      >
        {children}
      </span>
    );
  return (
    <button
      type="button"
      className={className}
      data-term={entryKey}
      aria-expanded={isOpen}
      aria-describedby={isOpen ? terms.bodyId : undefined}
      {...pointer}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible"))
          terms.focusIn(entryKey, e.currentTarget);
      }}
      onBlur={terms.focusOut}
      onKeyDown={terms.triggerKey}
      onClick={(e) => terms.toggle(entryKey, e.currentTarget)}
    >
      {children}
    </button>
  );
}

/**
 * Keyboard and screen-reader access to terms that appear only inside answer
 * options. Terms already marked in the question or hint are not repeated.
 */
export function TermChips({
  texts,
  covered,
}: {
  texts: string[];
  covered: string[];
}) {
  const terms = useTerms();
  if (!terms?.entries.length) return null;
  const keys = (list: string[]) =>
    new Set(
      list.flatMap((t) =>
        segmentText(t, terms.entries).flatMap((s) => (s.key ? [s.key] : [])),
      ),
    );
  const shown = keys(covered);
  const chips = terms.entries.filter(
    (e) => keys(texts).has(e.key) && !shown.has(e.key),
  );
  if (!chips.length) return null;
  return (
    <div className="term-chips" role="group" aria-label="Terms in the answers">
      <span className="term-chips-label" aria-hidden="true">
        Terms in the answers
      </span>
      {chips.map((e) => (
        <TermMark key={e.key} entryKey={e.key} passive={false} chip>
          {e.term}
        </TermMark>
      ))}
    </div>
  );
}

const origins = {
  paper: { label: "From the paper", Icon: FileText },
  model: { label: "In this study's context", Icon: Sparkles },
  glossary: { label: "General research term", Icon: BookOpen },
} as const;

const TermPopover = ({
  ref,
  entry,
  open,
  bodyId,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  ref: RefObject<HTMLDivElement | null>;
  entry: TermEntry;
  open: Open;
  bodyId: string;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) => {
  const motion = useSceneMotion();
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [excerpt, setExcerpt] = useState(false);
  const settled = useRef(false);
  // The source excerpt belongs to one term, so a new term starts collapsed.
  const [shownKey, setShownKey] = useState(entry.key);
  if (shownKey !== entry.key) {
    setShownKey(entry.key);
    setExcerpt(false);
  }

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (!open.anchor.isConnected) return onClose();
    const rect =
      open.anchor.getClientRects()[0] ?? open.anchor.getBoundingClientRect();
    const next = placePopover(
      rect,
      { width: el.offsetWidth, height: el.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
    );
    setPlacement((p) =>
      p &&
      p.side === next.side &&
      Math.abs(p.top - next.top) < 0.5 &&
      Math.abs(p.left - next.left) < 0.5 &&
      Math.abs(p.arrow - next.arrow) < 0.5
        ? p
        : next,
    );
  }, [ref, open.anchor, onClose]);

  useLayoutEffect(place, [place, entry.key, excerpt]);
  useEffect(() => {
    if (placement) settled.current = true;
  }, [placement]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    if (ref.current) observer?.observe(ref.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      observer?.disconnect();
    };
  }, [place, ref]);

  const side = placement?.side ?? "top";
  const origin = origins[entry.origin];
  const pinned = open.mode === "pinned";
  const snippet =
    excerpt && entry.sources[0]
      ? excerptSnippet(entry.sources[0].excerpt, entry.term)
      : null;
  const returnFocus = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    open.anchor.focus();
    if (!e.shiftKey) onClose();
  };
  return (
    <div
      ref={ref}
      className={`term-popover-frame side-${side}${pinned ? " is-pinned" : ""}${motion.still ? " is-still" : ""}${settled.current ? " is-settled" : ""}`}
      style={{
        top: placement?.top ?? 0,
        left: placement?.left ?? 0,
        visibility: placement ? "visible" : "hidden",
      }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <m.div
        className="term-popover"
        role="group"
        aria-label={`${entry.term}: definition`}
        style={{
          transformOrigin: `${placement?.arrow ?? 0}px ${side === "top" ? "100%" : "0%"}`,
        }}
        initial={
          motion.still
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.94, y: side === "top" ? 6 : -6 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          motion.still
            ? { opacity: 0, transition: { duration: 0.08 } }
            : { opacity: 0, scale: 0.97, transition: { duration: 0.1 } }
        }
        transition={
          motion.still
            ? { duration: 0.12 }
            : { type: "spring", duration: 0.32, bounce: 0.28 }
        }
      >
        <span
          className="term-popover-arrow"
          aria-hidden="true"
          style={{ left: placement?.arrow ?? 0 }}
        />
        <AnimatePresence initial={false} mode="popLayout">
          <m.div
            key={entry.key}
            className="term-popover-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={{ duration: motion.still ? 0.1 : 0.16 }}
          >
            <div id={bodyId} className="term-popover-body">
              <p className="term-popover-term">{entry.term}</p>
              <p className="term-popover-definition">{entry.definition}</p>
            </div>
            {entry.origin === "paper" && entry.sources.length ? (
              <button
                type="button"
                className={`term-source-chip${excerpt ? " is-active" : ""}`}
                aria-expanded={excerpt}
                tabIndex={pinned ? 0 : -1}
                onClick={() => setExcerpt((x) => !x)}
                onKeyDown={returnFocus}
              >
                <origin.Icon size={14} strokeWidth={2.4} aria-hidden="true" />
                {origin.label}, {pageLabel(entry.sources)}
              </button>
            ) : (
              <p className={`term-origin origin-${entry.origin}`}>
                <origin.Icon size={14} strokeWidth={2.4} aria-hidden="true" />
                {origin.label}
              </p>
            )}
            <AnimatePresence initial={false}>
              {snippet ? (
                <m.blockquote
                  key="excerpt"
                  className="term-excerpt"
                  initial={
                    motion.still
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                  exit={
                    motion.still
                      ? { opacity: 0 }
                      : { opacity: 0, height: 0, marginTop: 0 }
                  }
                  transition={
                    motion.still
                      ? { duration: 0.1 }
                      : { type: "spring", duration: 0.3, bounce: 0 }
                  }
                >
                  <p>
                    {snippet.before}
                    {snippet.mark ? <mark>{snippet.mark}</mark> : null}
                    {snippet.after}
                  </p>
                </m.blockquote>
              ) : null}
            </AnimatePresence>
          </m.div>
        </AnimatePresence>
      </m.div>
    </div>
  );
};
