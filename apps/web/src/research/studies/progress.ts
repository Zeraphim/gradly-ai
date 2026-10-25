import { useSyncExternalStore } from "react";
import type { SceneDraft } from "../scenes/InvestigationScene.js";
import type { ChallengeAttempt } from "./journey.js";

/**
 * Browser-only progress for the prepared-study preview. Checked attempts are the
 * record; the unchecked selection and scene exploration are a draft for the
 * current challenge only, so refresh and back navigation never lose an answer.
 */
export type StudyProgress = {
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
    !!p.attempts &&
    typeof p.attempts === "object" &&
    Object.values(p.attempts).every(
      (list) =>
        Array.isArray(list) &&
        list.length <= 2 &&
        list.every(
          (a) =>
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
        !!p.draft.scene &&
        typeof p.draft.scene === "object")) &&
    typeof p.completed === "boolean"
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
    if (event.key === KEY) {
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

export function useAllProgress() {
  return useSyncExternalStore(subscribe, read, () => ({}) as Store);
}

export function updateProgress(
  slug: string,
  change: (current: StudyProgress) => StudyProgress,
) {
  const store = read();
  write({
    ...store,
    [slug]: { ...change(store[slug] ?? freshProgress()), updated: Date.now() },
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
