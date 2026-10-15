export type CaseEvidence = {
  id: string;
  label: string;
  kind: "design" | "finding" | "limitation";
  summary: string;
  text: string;
  sourceLabel: string;
};
export type CaseOption = { id: string; text: string; feedback: string };
export type ResearchCase = {
  id: string;
  title: string;
  topic: string;
  hook: string;
  question: string;
  context: string;
  provenance: "reference-paper" | "fictional-study";
  sourceNote: string;
  paper: { title: string; authors: string; url?: string };
  design: string;
  findings: string;
  limitations: string[];
  overview: { approach: string; finding: string; limit: string };
  evidence: CaseEvidence[];
  claims: CaseOption[];
  supportedClaimId: string;
  usefulEvidenceIds: string[];
  competingEvidenceId: string;
  coachingQuestion: string;
  revision: { claim: string; explanation: string };
  transfer: {
    context: string;
    prompt: string;
    options: CaseOption[];
    supportedOptionId: string;
  };
  takeaway: string;
};
