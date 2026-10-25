import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FileSearch,
  Lightbulb,
  LockOpen,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import {
  emptySceneDraft,
  type SceneDraft,
} from "../scenes/InvestigationScene.js";
import { SceneTransition, m, useSceneMotion } from "../scenes/scene-motion.js";
import { FeedbackDock, type DockFeedback } from "./FeedbackDock.js";
import { JourneyChrome } from "./JourneyChrome.js";
import {
  POINTS_PER_SOLVE,
  challengeStatus,
  isCorrect,
  journeyChallenges,
  tapTargets,
  visibleScene,
} from "./journey.js";
import { updateProgress, type StudyProgress } from "./progress.js";
import { ResponseChoices, type ChoiceMark } from "./ResponseChoices.js";
import { StudySceneView } from "./scenes/StudySceneView.js";
import { BonusOffer, StudyIntro, StudyReveal } from "./JourneyStages.js";
import type { PreparedStudy, StudyChallenge } from "./types.js";

export function solvedCount(study: PreparedStudy, progress: StudyProgress) {
  return journeyChallenges(study, true).filter((c) =>
    progress.attempts[c.id]?.some((a) => a.correct),
  ).length;
}

/** One question per screen: choose → check → feedback → retry or continue. */
export function JourneyPlayer({
  study,
  progress,
}: {
  study: PreparedStudy;
  progress: StudyProgress;
}) {
  const list = journeyChallenges(study, progress.bonus);
  const main = study.lesson.challenges.length;
  const finished = study.lesson.challenges.filter((c) => {
    const attempts = progress.attempts[c.id] ?? [];
    return attempts.some((a) => a.correct) || attempts.length >= 2;
  }).length;
  const points = solvedCount(study, progress) * POINTS_PER_SOLVE;
  const save = useCallback(
    (change: (p: StudyProgress) => StudyProgress) =>
      updateProgress(study.slug, change),
    [study.slug],
  );
  const chrome = (
    <JourneyChrome
      done={progress.phase === "reveal" ? main : finished}
      total={main}
      points={points}
      label={`${study.teaser} progress`}
    />
  );
  if (progress.phase === "intro")
    return (
      <StudyIntro
        study={study}
        onBegin={() => save((p) => ({ ...p, phase: "challenge", index: 0 }))}
      />
    );
  if (progress.phase === "bonus-offer" && study.lesson.bonus)
    return (
      <>
        {chrome}
        <BonusOffer
          onAccept={() =>
            save((p) => ({
              ...p,
              bonus: true,
              phase: "challenge",
              index: main,
            }))
          }
          onSkip={() =>
            save((p) => ({ ...p, phase: "reveal", completed: true }))
          }
        />
      </>
    );
  if (progress.phase === "reveal")
    return (
      <>
        {chrome}
        <StudyReveal study={study} progress={progress} points={points} />
      </>
    );
  const challenge = list[Math.min(progress.index, list.length - 1)]!;
  return (
    <>
      {chrome}
      <ChallengeScreen
        key="challenge"
        study={study}
        challenge={challenge}
        position={progress.index}
        previous={list[progress.index - 1] ?? null}
        progress={progress}
        save={save}
        solvedSoFar={solvedCount(study, progress)}
        onContinue={() =>
          save((p) => {
            const next = p.index + 1;
            if (next < journeyChallenges(study, p.bonus).length)
              return { ...p, index: next, draft: null, retrying: null };
            if (!p.bonus && study.lesson.bonus)
              return {
                ...p,
                phase: "bonus-offer",
                draft: null,
                retrying: null,
              };
            return {
              ...p,
              phase: "reveal",
              completed: true,
              draft: null,
              retrying: null,
            };
          })
        }
      />
    </>
  );
}

const stageCue: Record<
  StudyChallenge["reveal"],
  { label: string; icon: typeof LockOpen } | null
> = {
  design: null,
  results: { label: "Results unlocked", icon: LockOpen },
  significance: { label: "Results unlocked", icon: LockOpen },
  interpretation: { label: "Time to interpret", icon: MessagesSquare },
  bonus: { label: "Bonus challenge", icon: Sparkles },
};
const revealRank = {
  design: 0,
  results: 1,
  significance: 1,
  interpretation: 2,
  bonus: 3,
};

function ChallengeScreen({
  study,
  challenge,
  position,
  previous,
  progress,
  save,
  solvedSoFar,
  onContinue,
}: {
  study: PreparedStudy;
  challenge: StudyChallenge;
  position: number;
  previous: StudyChallenge | null;
  progress: StudyProgress;
  save: (change: (p: StudyProgress) => StudyProgress) => void;
  solvedSoFar: number;
  onContinue: () => void;
}) {
  const motion = useSceneMotion();
  const attempts = progress.attempts[challenge.id] ?? [];
  const status = challengeStatus(attempts, progress.retrying === challenge.id);
  const answering = status === "answering" || status === "retrying";
  const draft =
    progress.draft?.challengeId === challenge.id ? progress.draft : null;
  const selected = answering
    ? (draft?.selected ?? [])
    : (attempts.at(-1)?.selected ?? []);
  const sceneDraft = draft?.scene ?? emptySceneDraft;
  const optionIds = challenge.options.map((o) => o.id);
  const scene = useMemo(
    () => visibleScene(challenge.scene, optionIds, status),
    [challenge, status],
  );
  const multiple = challenge.type === "multiple";
  const writeDraft = (next: { selected?: string[]; scene?: SceneDraft }) =>
    save((p) => ({
      ...p,
      draft: {
        challengeId: challenge.id,
        selected: next.selected ?? selected,
        scene: next.scene ?? sceneDraft,
      },
    }));
  const setSelected = (ids: string[]) =>
    answering && writeDraft({ selected: ids });

  const marks: Record<string, ChoiceMark> = {};
  if (status === "retry-feedback")
    for (const id of selected) marks[id] = "missed";
  if (status === "retrying")
    for (const id of attempts[0]?.selected ?? []) marks[id] = "tried";
  if (status === "explained") {
    for (const id of selected)
      if (!challenge.accepted.includes(id)) marks[id] = "missed";
    for (const id of challenge.accepted) marks[id] = "best";
  }
  const tapMap = challenge.responseStyle === "tap" ? tapTargets(scene) : null;
  const tap = tapMap
    ? {
        targets: tapMap,
        selected,
        multiple,
        disabled: !answering,
        marks: Object.fromEntries(
          Object.entries(marks).map(([id, mark]) => [
            id,
            mark === "best"
              ? ("best" as const)
              : mark === "missed"
                ? ("missed" as const)
                : undefined,
          ]),
        ),
        onToggle: (id: string) =>
          setSelected(
            multiple
              ? selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id]
              : [id],
          ),
      }
    : null;

  const lastChange = useRef(0);
  const statusRef = useRef(status);
  if (statusRef.current !== status) {
    statusRef.current = status;
    lastChange.current = performance.now();
  }
  const heading = useRef<HTMLHeadingElement>(null);
  const feedbackHeading = useRef<HTMLHeadingElement>(null);
  const act = () => {
    // A double click on Check must not also skip the feedback it just opened.
    if (!answering && performance.now() - lastChange.current < 280) return;
    if (answering) {
      if (!selected.length) return;
      const correct = isCorrect(challenge, selected);
      save((p) => ({
        ...p,
        attempts: {
          ...p.attempts,
          [challenge.id]: [
            ...(p.attempts[challenge.id] ?? []),
            { selected, correct },
          ],
        },
        retrying: null,
        // Keep exploration (inspected cards, reveals) for the retry; drop the answer.
        draft: { challengeId: challenge.id, selected: [], scene: sceneDraft },
      }));
      requestAnimationFrame(() =>
        feedbackHeading.current?.focus({ preventScroll: true }),
      );
    } else if (status === "retry-feedback") {
      save((p) => ({
        ...p,
        retrying: challenge.id,
        draft: { challengeId: challenge.id, selected: [], scene: sceneDraft },
      }));
      requestAnimationFrame(() =>
        heading.current?.focus({ preventScroll: true }),
      );
    } else {
      onContinue();
    }
  };

  // Keyboard: number keys choose, Enter checks or continues.
  const actRef = useRef(act);
  actRef.current = act;
  const chooseRef = useRef((_: number) => {});
  chooseRef.current = (n: number) => {
    const option = challenge.options[n];
    if (!option || !answering) return;
    setSelected(
      multiple
        ? selected.includes(option.id)
          ? selected.filter((s) => s !== option.id)
          : [...selected, option.id]
        : [option.id],
    );
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat)
        return;
      const target = event.target as HTMLElement;
      if (target.closest("textarea, select, input[type=text]")) return;
      if (/^[1-6]$/.test(event.key)) {
        chooseRef.current(Number(event.key) - 1);
        event.preventDefault();
      } else if (
        event.key === "Enter" &&
        !target.closest("button, a, summary")
      ) {
        actRef.current();
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Move focus to the new question only after a learner action, never on restore.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: motion.still ? "instant" : "smooth" });
  }, [challenge.id]);

  const cue =
    !previous || revealRank[challenge.reveal] > revealRank[previous.reveal]
      ? stageCue[challenge.reveal]
      : null;
  const CueIcon = cue?.icon;
  const missed = attempts
    .at(-1)
    ?.selected.find((id) => challenge.misconceptions[id]);
  const feedback: DockFeedback | null =
    status === "solved"
      ? {
          status,
          title:
            attempts.length === 1 ? pick(praise, position) : "You got there",
          body: challenge.explanation,
          hint: null,
          gained: POINTS_PER_SOLVE,
          mascot:
            solvedSoFar === 1 && attempts.length === 1 ? "approving" : null,
        }
      : status === "retry-feedback"
        ? {
            status,
            title: "Not quite yet",
            body:
              (missed && challenge.misconceptions[missed]) ||
              "Take another look at the evidence.",
            hint: challenge.hint,
            gained: 0,
            mascot: null,
          }
        : status === "explained"
          ? {
              status,
              title: "Here’s the reasoning",
              body: challenge.explanation,
              hint: null,
              gained: 0,
              mascot: "caring",
            }
          : null;
  const total = study.lesson.challenges.length;
  return (
    <>
      <main className="journey-main">
        <SceneTransition identity={challenge.id}>
          <div className={`journey-challenge status-${status}`}>
            {cue && CueIcon ? (
              <m.p
                className={`journey-cue cue-${challenge.reveal}`}
                initial={
                  motion.canEnter() ? { opacity: 0, scale: 0.92 } : false
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={
                  motion.still
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.4, bounce: 0.35 }
                }
              >
                <CueIcon size={15} strokeWidth={2.5} aria-hidden="true" />
                {cue.label}
              </m.p>
            ) : null}
            <p className="journey-stage">
              {challenge.reveal === "bonus"
                ? "Bonus"
                : `${position + 1} of ${total}`}{" "}
              · {challenge.stage}
            </p>
            <h1 ref={heading} tabIndex={-1} className="journey-title">
              {challenge.prompt}
            </h1>
            {challenge.evidence.length ? (
              <ul
                className="journey-evidence"
                aria-label="Evidence for this challenge"
              >
                {challenge.evidence.map((line) => (
                  <li key={line}>
                    <FileSearch size={15} aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
            {status === "retrying" ? (
              <m.p
                className="journey-retry-hint"
                initial={motion.canEnter() ? { opacity: 0, y: 4 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={motion.copy}
              >
                <Lightbulb size={16} aria-hidden="true" />
                {challenge.hint}
              </m.p>
            ) : null}
            {multiple && answering ? (
              <p className="journey-multi">Choose all that apply.</p>
            ) : null}
            {scene ? (
              <StudySceneView
                scene={scene}
                draft={sceneDraft}
                onDraft={(next) => writeDraft({ scene: next })}
                answered={!answering}
                disabled={false}
                tap={tap}
              />
            ) : null}
            {!tap && sceneGatesChoices(scene, sceneDraft, answering) ? (
              <ResponseChoices
                name={`choice-${challenge.id}`}
                options={challenge.options}
                multiple={multiple}
                selected={selected}
                disabled={!answering}
                marks={marks}
                pills={challenge.responseStyle === "pills"}
                onChange={setSelected}
              />
            ) : null}
          </div>
        </SceneTransition>
      </main>
      <FeedbackDock
        ref={feedbackHeading}
        identity={challenge.id}
        feedback={feedback}
        ready={answering ? selected.length > 0 : true}
        action={
          answering
            ? "Check"
            : status === "retry-feedback"
              ? "Try again"
              : "Continue"
        }
        note={
          status === "retrying"
            ? "One more try. The hint is with your first answer."
            : selected.length
              ? "Press Check when you are ready."
              : multiple
                ? "Select every answer that fits."
                : "Select an answer."
        }
        onAction={act}
      />
    </>
  );
}

/** A covered comparison or estimate asks for a reveal before answers appear. */
function sceneGatesChoices(
  scene: ReturnType<typeof visibleScene>,
  draft: SceneDraft,
  answering: boolean,
) {
  if (!scene || !answering) return true;
  if (
    (scene.kind === "comparison" || scene.kind === "estimate") &&
    scene.prediction
  )
    return !!draft.revealed;
  return true;
}

const praise = [
  "Nice reasoning",
  "Exactly right",
  "Sharp eye",
  "That’s it",
  "Well read",
];
const pick = (list: string[], seed: number) => list[seed % list.length]!;
