export type InvestigationDraft = {
  version: number;
  challengeId: string;
  selected: string[];
  reasoning: string;
  reflection: string;
  editingReasoning: boolean;
  scene?: {
    inspectedId: string | null;
    prediction: string | null;
    pinnedIds?: string[];
    revealed?: boolean;
  };
};
const drafts = new Map<string, InvestigationDraft>();
let motionOverride: boolean | undefined;
const key = (id: string) => `gradly-draft:${id}`;
function validDraft(value: unknown): value is InvestigationDraft {
  if (!value || typeof value !== "object") return false;
  const d = value as InvestigationDraft;
  return (
    Number.isSafeInteger(d.version) &&
    d.version >= 0 &&
    typeof d.challengeId === "string" &&
    d.challengeId.length <= 100 &&
    Array.isArray(d.selected) &&
    d.selected.length <= 30 &&
    d.selected.every((id) => typeof id === "string" && id.length <= 100) &&
    typeof d.reasoning === "string" &&
    d.reasoning.length <= 3000 &&
    typeof d.reflection === "string" &&
    d.reflection.length <= 3000 &&
    typeof d.editingReasoning === "boolean" &&
    (d.scene === undefined ||
      (d.scene !== null &&
        typeof d.scene === "object" &&
        (d.scene.inspectedId === null ||
          (typeof d.scene.inspectedId === "string" &&
            d.scene.inspectedId.length <= 80)) &&
        (d.scene.prediction === null ||
          (typeof d.scene.prediction === "string" &&
            d.scene.prediction.length <= 600)) &&
        (d.scene.revealed === undefined ||
          typeof d.scene.revealed === "boolean") &&
        (d.scene.pinnedIds === undefined ||
          (Array.isArray(d.scene.pinnedIds) &&
            d.scene.pinnedIds.length <= 12 &&
            d.scene.pinnedIds.every(
              (id) => typeof id === "string" && id.length <= 80,
            )))))
  );
}
export function readDraft(id: string, version: number, challengeId: string) {
  let draft: unknown = drafts.get(id);
  if (!draft) {
    try {
      draft = JSON.parse(sessionStorage.getItem(key(id)) ?? "null");
    } catch {}
  }
  return validDraft(draft) &&
    draft.version === version &&
    draft.challengeId === challengeId
    ? draft
    : null;
}
export function writeDraft(id: string, draft: InvestigationDraft) {
  if (!validDraft(draft)) return;
  if (drafts.size >= 50 && !drafts.has(id))
    drafts.delete(drafts.keys().next().value!);
  drafts.set(id, draft);
  try {
    sessionStorage.setItem(key(id), JSON.stringify(draft));
  } catch {}
}
export function clearDraft(id: string) {
  drafts.delete(id);
  try {
    sessionStorage.removeItem(key(id));
  } catch {}
}
export function readLastAdventure() {
  try {
    const id = localStorage.getItem("gradly-last-adventure");
    return id && /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(id)
      ? id
      : null;
  } catch {
    return null;
  }
}
export function readReducedMotion() {
  if (motionOverride !== undefined) return motionOverride;
  try {
    return localStorage.getItem("gradly-reduced-motion") === "true";
  } catch {
    return false;
  }
}
export function writeReducedMotion(reduced: boolean) {
  motionOverride = reduced;
  try {
    localStorage.setItem("gradly-reduced-motion", String(reduced));
  } catch {}
}
/**
 * Live subscription to the saved motion preference. The setting is written by
 * another screen, so the change arrives through a storage event; the document
 * attribute carries the same state for the interface that toggles it.
 */
export function subscribeReducedMotion(changed: () => void) {
  window.addEventListener("storage", changed);
  const observer = new MutationObserver(changed);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-reduced-motion"],
  });
  return () => {
    window.removeEventListener("storage", changed);
    observer.disconnect();
  };
}

/** The preparation still running in this browser, so home can lead back to it. */
export type ActivePreparation = { id: string; name: string };
const preparationKey = "gradly-active-preparation";
export function readActivePreparation(): ActivePreparation | null {
  try {
    const value = JSON.parse(localStorage.getItem(preparationKey) ?? "null");
    return value &&
      typeof value.id === "string" &&
      /^[\w-]{1,100}$/.test(value.id) &&
      typeof value.name === "string"
      ? { id: value.id, name: value.name.slice(0, 200) }
      : null;
  } catch {
    return null;
  }
}
export function writeActivePreparation(preparation: ActivePreparation) {
  try {
    localStorage.setItem(preparationKey, JSON.stringify(preparation));
  } catch {}
}
export function clearActivePreparation(id: string) {
  try {
    if (readActivePreparation()?.id === id)
      localStorage.removeItem(preparationKey);
  } catch {}
}
