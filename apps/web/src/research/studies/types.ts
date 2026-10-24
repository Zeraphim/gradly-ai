import type { Scene, SceneItem } from "@paperquest/contracts";
import type {
  Challenge,
  Lesson,
} from "../../../../api/src/research/contracts.js";

/**
 * Prepared-study preview format. It reuses the pipeline's Lesson and Challenge
 * shapes so prepared and generated papers can share one player. The three extra
 * scene kinds below are frontend proposals only. They are not part of the shared
 * contract until agreed with the pipeline owner (#8).
 */
export type DesignGroup =
  | "between"
  | "within"
  | "replication"
  | "correlational"
  | "longitudinal"
  | "classroom"
  | "null";

/** The topic groups in docs/research/PAPER_SCREENING.md "Topic coverage". */
export type StudyTopic =
  | "school"
  | "cognition"
  | "health"
  | "wellbeing"
  | "social"
  | "media"
  | "environment";

export const studyTopics: Record<StudyTopic, { label: string; short: string }> =
  {
    school: { label: "School and academic performance", short: "School" },
    cognition: {
      label: "Learning, memory and cognition",
      short: "Learning & memory",
    },
    health: { label: "Health and the body", short: "Health" },
    wellbeing: { label: "Wellbeing and family", short: "Wellbeing & family" },
    social: {
      label: "Social behaviour, beliefs and politics",
      short: "Social & beliefs",
    },
    media: { label: "Media and technology", short: "Media & tech" },
    environment: {
      label: "Environment, transport, work and money",
      short: "Work, money & environment",
    },
  };

/** A wave or event on a shared time axis. `n` is the reported sample at that point. */
export type TimelineEvent = SceneItem & { when: string; n?: number };
export type TimelineScene = Omit<Scene, "kind"> & {
  kind: "timeline";
  events: TimelineEvent[];
  responses: Scene["responses"];
};

/** A reported association. `value` is the coefficient as stated in the paper. */
export type AssociationPair = SceneItem & {
  x: string;
  y: string;
  statistic: "r" | "beta" | "OR";
  value: number;
  n?: number;
};
export type AssociationScene = Omit<Scene, "kind"> & {
  kind: "association";
  pairs: AssociationPair[];
  responses: Scene["responses"];
};

/** A reported estimate with its interval, drawn against a reference value. */
export type IntervalEstimate = SceneItem & {
  value: number;
  lower: number;
  upper: number;
};
export type EstimateScene = Omit<Scene, "kind"> & {
  kind: "estimate";
  measure: string;
  min: number;
  max: number;
  reference: { value: number; label: string };
  band: {
    lower: number;
    upper: number;
    label: string;
    at: SceneItem["at"];
  } | null;
  estimates: IntervalEstimate[];
  prediction: { label: string; options: string[] } | null;
  responses: Scene["responses"];
};

export type StudyScene =
  Scene | TimelineScene | AssociationScene | EstimateScene;

/** How a challenge collects its answer. All styles submit the same option ids. */
export type ResponseStyle = "cards" | "pills" | "tap";

export type StudyChallenge = Omit<Challenge, "scene"> & {
  scene: StudyScene | null;
  responseStyle?: ResponseStyle;
};

/**
 * Library card for one study. Cards live in `cards.ts` so the library loads without
 * any lesson body; `challenges` lists the required challenge ids for progress.
 */
export type StudyCard = {
  slug: string;
  /** Learner-facing title. It must not reveal the paper's identity or findings. */
  teaser: string;
  question: string;
  group: DesignGroup;
  topic: StudyTopic;
  /** Authored estimate in minutes, always labelled as an estimate. */
  minutes: number;
  /** Set only after Tymee's content review. */
  reviewed: boolean;
  challenges: string[];
};

/** Lesson body in `data/<slug>.ts`, loaded only when the study opens. */
export type StudyBody = {
  lesson: Omit<Lesson, "challenges" | "bonus"> & {
    challenges: StudyChallenge[];
    bonus: StudyChallenge | null;
  };
  /** What the final reveal says the study found, in plain language. */
  takeaway: string;
};

export type PreparedStudy = Omit<StudyCard, "challenges"> & StudyBody;

export const designGroups: Record<
  DesignGroup,
  { label: string; short: string }
> = {
  between: { label: "Randomised experiment", short: "Experiment" },
  within: { label: "Within-subjects", short: "Within" },
  replication: { label: "Replication", short: "Replication" },
  correlational: { label: "Correlational", short: "Correlational" },
  longitudinal: { label: "Longitudinal", short: "Longitudinal" },
  classroom: { label: "Classroom experiment", short: "Classroom" },
  null: { label: "Null result", short: "Null result" },
};
