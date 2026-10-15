import type { publicSession } from "../../../api/src/research/engine.js";
import type { publicJob } from "../../../api/src/research/pipeline.js";
import type { PageText } from "../../../api/src/research/contracts.js";

export type ResearchSession = ReturnType<typeof publicSession>;
export type ProcessingJob = ReturnType<typeof publicJob>;
export type ResearchConfig = {
  liveAI: boolean;
  demoAvailable: boolean;
  maxUploadBytes: number;
  storage: boolean;
  model: string;
};
export type AdventureRecord = {
  id: string;
  title: string;
  phase: string;
  index: number;
  created: string;
  source?: "featured" | "generated" | "demo";
  points?: number;
};
export type DocumentRecord = {
  id: string;
  name: string;
  status: string;
  pages: number;
  mode?: string;
};
export type CheckedDocument = {
  id: string;
  pageCount: number;
  excerpt: string;
  pages: PageText[];
  extraction: { page: number; method: string; confidence?: number }[];
};
export type UploadDraft = {
  file: File | null;
  uploaded: CheckedDocument | null;
};
