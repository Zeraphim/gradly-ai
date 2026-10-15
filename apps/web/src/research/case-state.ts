import type { ResearchCase } from "./case-types.js";

export const CASE_STORAGE_KEY = "gradly.casefiles.v1";
export type CasePhase =
  "question" | "evidence" | "claim" | "transfer" | "complete";
export type CaseDraft = {
  phase: CasePhase;
  initialClaim: string;
  initialExplanation: string;
  initialConfidence: number;
  opened: string[];
  pinned: string[];
  claim: string;
  claimChecked: boolean;
  explanation: string;
  confidence: number;
  transferChoice: string;
  transferChecked: boolean;
  reflection: string;
};
export type CaseNotebook = { version: 1; cases: Record<string, CaseDraft> };
export const emptyNotebook = (): CaseNotebook => ({ version: 1, cases: {} });
export const freshCase = (): CaseDraft => ({
  phase: "question",
  initialClaim: "",
  initialExplanation: "",
  initialConfidence: 2,
  opened: [],
  pinned: [],
  claim: "",
  claimChecked: false,
  explanation: "",
  confidence: 2,
  transferChoice: "",
  transferChecked: false,
  reflection: "",
});

export function readNotebook(
  value: string | null,
  cases: readonly ResearchCase[],
): CaseNotebook {
  try {
    const raw = JSON.parse(value ?? "null");
    if (
      !raw ||
      raw.version !== 1 ||
      !raw.cases ||
      typeof raw.cases !== "object" ||
      Array.isArray(raw.cases)
    )
      return emptyNotebook();
    const result = emptyNotebook();
    for (const study of cases) {
      const draft = raw.cases[study.id];
      if (!draft || typeof draft !== "object") continue;
      const phases = ["question", "evidence", "claim", "transfer", "complete"];
      const choice = (id: unknown) =>
        id === "" || study.claims.some((option) => option.id === id);
      const evidence = (ids: unknown): ids is string[] =>
        Array.isArray(ids) &&
        ids.length <= study.evidence.length &&
        new Set(ids).size === ids.length &&
        ids.every((id) => study.evidence.some((item) => item.id === id));
      const text = (v: unknown, max: number) =>
        typeof v === "string" && v.length <= max;
      const initialExplanation = Object.hasOwn(draft, "initialExplanation")
        ? draft.initialExplanation
        : "";
      const claimChecked = Object.hasOwn(draft, "claimChecked")
        ? draft.claimChecked
        : ["transfer", "complete"].includes(draft.phase);
      const confidence = (v: unknown) =>
        Number.isInteger(v) && Number(v) >= 1 && Number(v) <= 3;
      if (
        !phases.includes(draft.phase) ||
        !choice(draft.initialClaim) ||
        !text(initialExplanation, 1500) ||
        !choice(draft.claim) ||
        typeof claimChecked !== "boolean" ||
        !confidence(draft.initialConfidence) ||
        !confidence(draft.confidence) ||
        !evidence(draft.opened) ||
        !evidence(draft.pinned) ||
        draft.pinned.some((id: string) => !draft.opened.includes(id)) ||
        !text(draft.explanation, 3000) ||
        !text(draft.reflection, 1500) ||
        typeof draft.transferChecked !== "boolean" ||
        !(
          draft.transferChoice === "" ||
          study.transfer.options.some(
            (option) => option.id === draft.transferChoice,
          )
        )
      )
        continue;
      if (draft.phase !== "question" && !draft.initialClaim) continue;
      if (
        ["claim", "transfer", "complete"].includes(draft.phase) &&
        !boardReady(study, draft)
      )
        continue;
      if (["transfer", "complete"].includes(draft.phase) && !draft.claim)
        continue;
      if (["transfer", "complete"].includes(draft.phase) && !claimChecked)
        continue;
      if (
        draft.phase === "complete" &&
        (!draft.transferChecked || !draft.transferChoice)
      )
        continue;
      result.cases[study.id] = {
        phase: draft.phase,
        initialClaim: draft.initialClaim,
        initialExplanation,
        initialConfidence: draft.initialConfidence,
        opened: [...draft.opened],
        pinned: [...draft.pinned],
        claim: draft.claim,
        claimChecked,
        explanation: draft.explanation,
        confidence: draft.confidence,
        transferChoice: draft.transferChoice,
        transferChecked: draft.transferChecked,
        reflection: draft.reflection,
      };
    }
    return result;
  } catch {
    return emptyNotebook();
  }
}

export function boardReady(
  study: ResearchCase,
  draft: Pick<CaseDraft, "opened" | "pinned">,
) {
  return ["design", "finding", "limitation"].every((kind) =>
    study.evidence.some(
      (item) => item.kind === kind && draft.opened.includes(item.id),
    ),
  );
}

export function evidenceReview(
  study: ResearchCase,
  draft: Pick<CaseDraft, "pinned" | "claim">,
) {
  const supported = draft.claim === study.supportedClaimId;
  const relevant = study.usefulEvidenceIds.filter((id) =>
    draft.pinned.includes(id),
  );
  const boundary = draft.pinned.includes(study.competingEvidenceId);
  return {
    supported,
    relevant,
    boundary,
    ready: supported && relevant.length > 0 && boundary,
    label: !supported
      ? "Reconsider the reach of this claim"
      : relevant.length === 0
        ? "A bounded claim still needs supporting evidence"
        : !boundary
          ? "Show what keeps this claim bounded"
          : "Your selected claim and evidence connect",
  };
}

export function caseNotes(study: ResearchCase, draft: CaseDraft) {
  const label = (id: string) =>
    study.claims.find((option) => option.id === id)?.text ?? "Not selected";
  return [
    study.title,
    study.provenance === "reference-paper"
      ? "Authored exploration of a published paper"
      : "Fictional learning study — not a published finding",
    "",
    "QUESTION",
    study.question,
    "",
    "DESIGN",
    study.design,
    "",
    "FINDINGS",
    study.findings,
    "",
    "LIMITS",
    ...study.limitations.map((limit) => `- ${limit}`),
    "",
    "MY INITIAL CLAIM",
    label(draft.initialClaim),
    "",
    "MY INITIAL EXPLANATION (not AI assessed)",
    draft.initialExplanation || "No initial explanation added.",
    "",
    "MY REVISED CLAIM",
    label(draft.claim),
    "",
    "CONFIDENCE (self-report, not a score)",
    `Before: ${draft.initialConfidence}/3. After: ${draft.confidence}/3.`,
    "",
    "MY EXPLANATION (not AI assessed)",
    draft.explanation || "No written explanation added.",
    "",
    "EVIDENCE I PINNED",
    ...study.evidence
      .filter((item) => draft.pinned.includes(item.id))
      .map((item) => `- ${item.label}: ${item.text} (${item.sourceLabel})`),
    "",
    "MY REFLECTION",
    draft.reflection || "No reflection added.",
    "",
    "TRANSFER TO A NEW SETTING",
    study.transfer.context,
    study.transfer.options.find((option) => option.id === draft.transferChoice)
      ?.text ?? "Not selected",
    "AUTHORED TRANSFER GUIDANCE",
    study.transfer.options.find((option) => option.id === draft.transferChoice)
      ?.feedback ?? "No transfer connection checked.",
    "",
    "SOURCE",
    study.paper.title,
    study.paper.authors,
    study.paper.url ?? study.sourceNote,
  ].join("\n");
}
