import { afterEach, beforeEach, expect, it, vi } from "vitest";

function storage() {
  const values = new Map<string, string>();
  return {
    values,
    get length() {
      return values.size;
    },
    key: (index: number) => [...values.keys()][index] ?? null,
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, String(value)),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
  };
}

const draft = () => ({
  version: 3,
  challengeId: "q3",
  selected: ["A", "B"],
  reasoning: "Independent participants support an independent-groups test.",
  reflection: "Check the study design first.",
  editingReasoning: true,
});

let browserStorage: ReturnType<typeof storage>;
let state: typeof import("../../apps/web/src/research/client-state.js");

beforeEach(async () => {
  vi.resetModules();
  browserStorage = storage();
  vi.stubGlobal("localStorage", browserStorage);
  vi.stubGlobal("sessionStorage", browserStorage);
  vi.stubGlobal("window", {
    localStorage: browserStorage,
    sessionStorage: browserStorage,
  });
  state = await import("../../apps/web/src/research/client-state.js");
});

afterEach(() => vi.unstubAllGlobals());

it("restores a matching draft across module reloads without mixing sessions", async () => {
  const saved = draft();
  expect(state.readDraft("adventure-a", 3, "q3")).toBeNull();
  state.writeDraft("adventure-a", saved);

  vi.resetModules();
  state = await import("../../apps/web/src/research/client-state.js");
  expect(state.readDraft("adventure-a", 3, "q3")).toEqual(saved);
  expect(state.readDraft("adventure-b", 3, "q3")).toBeNull();
});

it("rejects drafts from a different saved version or challenge", () => {
  state.writeDraft("versioned-adventure", draft());
  expect(state.readDraft("versioned-adventure", 4, "q3")).toBeNull();
  state.writeDraft("versioned-adventure", draft());
  expect(state.readDraft("versioned-adventure", 3, "q4")).toBeNull();
});

it.each([
  "{broken json",
  "null",
  "[]",
  JSON.stringify({ ...draft(), version: "3" }),
  JSON.stringify({ ...draft(), selected: ["A", 2] }),
  JSON.stringify({ ...draft(), reasoning: 12 }),
  JSON.stringify({ ...draft(), reflection: null }),
  JSON.stringify({ ...draft(), editingReasoning: "true" }),
])("rejects malformed persisted draft %s", async (invalid) => {
  state.writeDraft("malformed-adventure", draft());
  const key = [...browserStorage.values.keys()][0];
  expect(key).toBeDefined();
  browserStorage.setItem(key!, invalid);
  vi.resetModules();
  state = await import("../../apps/web/src/research/client-state.js");

  expect(state.readDraft("malformed-adventure", 3, "q3")).toBeNull();
});

it("clears the persisted and in-memory copies of a draft", async () => {
  state.writeDraft("cleared-adventure", draft());
  state.clearDraft("cleared-adventure");
  expect(state.readDraft("cleared-adventure", 3, "q3")).toBeNull();
  expect(browserStorage.length).toBe(0);
  vi.resetModules();
  state = await import("../../apps/web/src/research/client-state.js");
  expect(state.readDraft("cleared-adventure", 3, "q3")).toBeNull();
});

it("retains and clears a draft in memory when browser storage is blocked", () => {
  const blocked = {
    getItem() {
      throw new DOMException("Storage is blocked", "SecurityError");
    },
    setItem() {
      throw new DOMException("Storage is blocked", "SecurityError");
    },
    removeItem() {
      throw new DOMException("Storage is blocked", "SecurityError");
    },
  };
  vi.stubGlobal("localStorage", blocked);
  vi.stubGlobal("sessionStorage", blocked);
  vi.stubGlobal("window", { localStorage: blocked, sessionStorage: blocked });
  const saved = draft();

  expect(() => state.writeDraft("memory-adventure", saved)).not.toThrow();
  expect(state.readDraft("memory-adventure", 3, "q3")).toEqual(saved);
  expect(() => state.clearDraft("memory-adventure")).not.toThrow();
  expect(state.readDraft("memory-adventure", 3, "q3")).toBeNull();
  expect(state.readLastAdventure()).toBeNull();
  expect(state.readReducedMotion()).toBe(false);
  state.writeReducedMotion(true);
  expect(state.readReducedMotion()).toBe(true);
  state.writeReducedMotion(false);
  expect(state.readReducedMotion()).toBe(false);
});

it("reads last-adventure and motion preferences with safe defaults", () => {
  expect(state.readLastAdventure()).toBeNull();
  expect(state.readReducedMotion()).toBe(false);
  const adventureId = "9ad635cf-d31b-4865-9aaa-9db186e39b92";
  browserStorage.setItem("gradly-last-adventure", adventureId);
  browserStorage.setItem("gradly-reduced-motion", "true");
  expect(state.readLastAdventure()).toBe(adventureId);
  expect(state.readReducedMotion()).toBe(true);
  browserStorage.setItem("gradly-reduced-motion", "false");
  expect(state.readReducedMotion()).toBe(false);
  browserStorage.setItem("gradly-reduced-motion", "unrecognized");
  expect(state.readReducedMotion()).toBe(false);
});

it("keeps a changed motion preference when reads work but storage writes fail", () => {
  vi.stubGlobal("localStorage", {
    getItem: () => "false",
    setItem: () => {
      throw new DOMException("Storage full", "QuotaExceededError");
    },
  });
  state.writeReducedMotion(true);
  expect(state.readReducedMotion()).toBe(true);
});
