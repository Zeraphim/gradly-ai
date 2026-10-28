import { useMemo, useSyncExternalStore } from "react";
import { studyCards } from "./cards.js";
import type { SceneDraft } from "../scenes/InvestigationScene.js";
import type { ChallengeAttempt } from "./journey.js";

/**
 * Browser-only progress for the prepared-study preview. Checked attempts are the
 * record; the unchecked selection and scene exploration are a draft for the
 * current challenge only, so refresh and back navigation never lose an answer.
 */
export type StudyProgress = {
  /** Missing in legacy browser saves; those belong to the original questions. */
  revision?: number;
  phase: "intro" | "challenge" | "bonus-offer" | "reveal";
  index: number;
  bonus: boolean;
  attempts: Record<string, ChallengeAttempt[]>;
  retrying: string | null;
  draft: { challengeId: string; selected: string[]; scene: SceneDraft } | null;
  completed: boolean;
  updated: number;
};
type Store = Record<string, StudyProgress>;

const KEY = "gradly-study-progress:v1";
const listeners = new Set<() => void>();
let memory: Store | null = null;

function valid(value: unknown): value is StudyProgress {
  if (!value || typeof value !== "object") return false;
  const p = value as StudyProgress;
  return (
    ["intro", "challenge", "bonus-offer", "reveal"].includes(p.phase) &&
    Number.isSafeInteger(p.index) &&
    p.index >= 0 &&
    p.index < 40 &&
    typeof p.bonus === "boolean" &&
    (p.revision === undefined ||
      (Number.isSafeInteger(p.revision) && p.revision > 0)) &&
    !!p.attempts &&
    typeof p.attempts === "object" &&
    !Array.isArray(p.attempts) &&
    Object.values(p.attempts).every(
      (list) =>
        Array.isArray(list) &&
        list.length <= 2 &&
        list.every(
          (a) =>
            !!a &&
            typeof a === "object" &&
            Array.isArray(a.selected) &&
            a.selected.every((id) => typeof id === "string") &&
            typeof a.correct === "boolean",
        ),
    ) &&
    (p.retrying === null || typeof p.retrying === "string") &&
    (p.draft === null ||
      (typeof p.draft === "object" &&
        typeof p.draft.challengeId === "string" &&
        Array.isArray(p.draft.selected) &&
        p.draft.selected.every((id) => typeof id === "string") &&
        !!p.draft.scene &&
        typeof p.draft.scene === "object")) &&
    typeof p.completed === "boolean" &&
    (p.updated === undefined ||
      (typeof p.updated === "number" && Number.isFinite(p.updated)))
  );
}

function read(): Store {
  if (memory) return memory;
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {}
  const store: Store = {};
  if (parsed && typeof parsed === "object")
    for (const [slug, value] of Object.entries(parsed))
      if (valid(value)) store[slug] = value;
  memory = store;
  return store;
}

function write(next: Store) {
  memory = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const sync = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) {
      memory = null;
      listener();
    }
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}

export const freshProgress = (): StudyProgress => ({
  phase: "intro",
  index: 0,
  bonus: false,
  attempts: {},
  retrying: null,
  draft: null,
  completed: false,
  updated: 0,
});

const emptyStore: Store = {};
const revisionFor = (slug: string) =>
  studyCards.find((card) => card.slug === slug)?.revision ?? 1;

function outdated(slug: string, progress: StudyProgress | undefined) {
  return !!progress && (progress.revision ?? 1) !== revisionFor(slug);
}

/** Old answers stay stored until the learner starts the revised study. */
export function useOutdatedProgress(slug: string | null) {
  return useSyncExternalStore(
    subscribe,
    () => !!slug && outdated(slug, read()[slug]),
    () => false,
  );
}

export function useAllProgress() {
  const saved = useSyncExternalStore(subscribe, read, () => emptyStore);
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(saved).filter(
          ([slug, progress]) => !outdated(slug, progress),
        ),
      ),
    [saved],
  );
}

export function updateProgress(
  slug: string,
  change: (current: StudyProgress) => StudyProgress,
) {
  const store = read();
  write({
    ...store,
    [slug]: {
      ...change(
        outdated(slug, store[slug])
          ? freshProgress()
          : (store[slug] ?? freshProgress()),
      ),
      revision: revisionFor(slug),
      updated: Date.now(),
    },
  });
}

export function resetProgress(slug: string) {
  const { [slug]: _removed, ...rest } = read();
  write(rest);
}

export type StudyState = "new" | "started" | "done";
export function studyState(progress: StudyProgress | undefined): StudyState {
  if (!progress) return "new";
  if (progress.completed) return "done";
  return progress.phase === "intro" && !Object.keys(progress.attempts).length
    ? "new"
    : "started";
}
