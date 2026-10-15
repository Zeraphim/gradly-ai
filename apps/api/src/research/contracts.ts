import { z } from "zod";
export const refSchema = z.object({
  id: z.string().min(1),
  page: z.number().int().positive(),
  excerpt: z.string().min(12).max(1200),
});
export const challengeSchema = z.object({
  id: z.string().min(1),
  stage: z.string(),
  title: z.string().min(1),
  type: z.enum(["single", "multiple"]),
  prompt: z.string().min(10),
  evidence: z.array(z.string()),
  options: z
    .array(z.object({ id: z.string(), text: z.string().min(1) }))
    .min(2)
    .max(6),
  accepted: z.array(z.string()).min(1),
  alternatives: z.array(z.array(z.string())),
  hint: z.string(),
  misconceptions: z.record(z.string(), z.string()),
  explanation: z.string().min(10),
  refs: z.array(z.string()).min(1),
  writtenReasoning: z.boolean(),
  reveal: z.enum(["design", "results", "significance", "bonus"]),
});
export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  briefing: z.string(),
  source: z.enum(["featured", "generated"]),
  paper: z.object({
    title: z.string(),
    authors: z.string(),
    journal: z.string(),
    url: z
      .string()
      .url()
      .regex(/^https:\/\//)
      .nullable(),
    limitations: z.array(z.string()),
  }),
  evidence: z.array(refSchema),
  challenges: z.array(challengeSchema).min(3).max(14),
  bonus: challengeSchema.nullable(),
});
export type Challenge = z.infer<typeof challengeSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Attempt = {
  reasoningRevisions?: { text: string; at: string }[];
  selected: string[];
  reasoning: string;
  correct: boolean;
  at: string;
  feedback: string;
};
export type LearningSession = {
  id: string;
  lessonId: string;
  title: string;
  index: number;
  phase:
    "briefing" | "challenge" | "bonus-choice" | "bonus" | "reveal" | "complete";
  answers: Record<string, Attempt[]>;
  retrying: boolean;
  version: number;
  created: string;
  reflection: string;
  reviewIds: string[] | null;
  aiFeedback?: Record<
    string,
    {
      category: string;
      guidance: string;
      followup: string;
      refs: string[];
      model: string;
    }
  >;
};
export type PageText = {
  page: number;
  text: string;
  method?: "text" | "ocr";
  confidence?: number;
};
export type Audit = {
  role: string;
  task: string;
  status:
    | "Pending"
    | "Processing"
    | "Completed"
    | "Needs Review"
    | "Failed"
    | "Retrying";
  summary: string;
  refs: string[];
  model: string;
  error?: string;
};
export type Job = {
  consented: boolean;
  id: string;
  name: string;
  pages: PageText[];
  stage: number;
  status: "pending" | "processing" | "failed" | "review" | "ready";
  audits: Audit[];
  evidence?: {
    findings: string;
    refs: z.infer<typeof refSchema>[];
    missing: string[];
  };
  lesson?: Lesson;
  review?: { approved: boolean; issues: string[]; summary: string };
  leaseUntil: number;
  error?: string;
  version: number;
};
export function verifyLesson(lesson: Lesson, pages: PageText[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const refs = new Set(lesson.evidence.map((r) => r.id));
  const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
  if (refs.size !== lesson.evidence.length)
    problems.push("Duplicate evidence identifiers.");
  if (lesson.paper.url) {
    const source = lesson.paper.url.replace(/^https:\/\/doi.org\//, "");
    if (!normalize(pages.map((p) => p.text).join(" ")).includes(source))
      problems.push("The paper source link is not supported by the document.");
  }
  for (const r of lesson.evidence) {
    const page = pages.find((p) => p.page === r.page);
    if (!page || !normalize(page.text).includes(normalize(r.excerpt)))
      problems.push(
        `Evidence ${r.id} is not an exact excerpt from page ${r.page}.`,
      );
  }
  for (const c of [
    ...lesson.challenges,
    ...(lesson.bonus ? [lesson.bonus] : []),
  ]) {
    if (ids.has(c.id)) problems.push("Duplicate challenge identifier.");
    ids.add(c.id);
    const optionIds = new Set(c.options.map((o) => o.id));
    if (optionIds.size !== c.options.length)
      problems.push(`${c.id}: duplicate options.`);
    for (const answers of [c.accepted, ...c.alternatives]) {
      if (
        answers.length === 0 ||
        answers.some((a) => !optionIds.has(a)) ||
        new Set(answers).size !== answers.length ||
        (c.type === "single" && answers.length !== 1)
      )
        problems.push(`${c.id}: invalid answer guide.`);
    }
    if (c.refs.some((r) => !refs.has(r)))
      problems.push(`${c.id}: unknown evidence reference.`);
    if (c.reveal === "bonus" && lesson.challenges.includes(c))
      problems.push(`${c.id}: bonus in required sequence.`);
  }
  return problems;
}
