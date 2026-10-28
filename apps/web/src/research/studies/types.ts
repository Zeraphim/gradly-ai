import type { ResponseStyle, Scene, SceneOf } from "@paperquest/contracts";
import type {
  Challenge,
  Lesson,
} from "../../../../api/src/research/contracts.js";

/**
 * Prepared-study preview format. It reuses the pipeline's Lesson and Challenge
 * shapes so prepared and generated papers can share one player. Every scene kind,
 * including timeline, association and estimate (first proposed in #8), is part of
 * the shared contract in packages/contracts.
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

/** Scene families come from the shared contract, so prepared and generated papers match. */
export type TimelineScene = SceneOf<"timeline">;
export type TimelineEvent = TimelineScene["events"][number];
export type AssociationScene = SceneOf<"association">;
export type AssociationPair = AssociationScene["pairs"][number];
export type EstimateScene = SceneOf<"estimate">;
export type IntervalEstimate = EstimateScene["estimates"][number];
export type TestsScene = SceneOf<"tests">;
export type UnitsScene = SceneOf<"units">;
export type MatrixScene = SceneOf<"matrix">;
export type LadderScene = SceneOf<"ladder">;
export type SortScene = SceneOf<"sort">;
export type SpotScene = SceneOf<"spot">;
export type StudyScene = Scene;
export type { ResponseStyle };

export type StudyChallenge = Omit<Challenge, "scene"> & {
  scene: StudyScene | null;
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
  /** Shown instead of the design-group label, for example on an uploaded paper. */
  kicker?: string;
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
