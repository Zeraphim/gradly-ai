/**
 * Scenes replaced after reading every design-stage scene the prepared run
 * wrote (#42). Each entry says how the scene gave the answer away; the
 * challenge gets the evidence scene built from its cited excerpts instead.
 * scripts/define-prepared-scenes.ts applies these on generation and `prune`
 * applies them to saved files.
 */
export const removedScenes: {
  slug: string;
  challenge: string;
  reason: string;
}[] = [
  {
    slug: "clicking-phishing-links",
    challenge: "c1",
    reason:
      "Its statements spell out how coworkers in different groups would talk and blur the comparison, the accepted reason.",
  },
  {
    slug: "natural-light-at-work",
    challenge: "c1",
    reason:
      "The rungs work through shared method variance to an overstated link, the reasoning the question asks for.",
  },
  {
    slug: "morning-people-and-life-satisfaction",
    challenge: "c1",
    reason:
      "Says Study 2 used a fuller religiosity measure, the part of the answer the question asks the learner to find.",
  },
  {
    slug: "morning-people-and-life-satisfaction",
    challenge: "c2",
    reason:
      "Says the small faith groups were dropped to reduce variability, the accepted trade-off.",
  },
  {
    slug: "exercise-focus",
    challenge: "q1",
    reason:
      "Adds that the colour-word test ran before and after each session, which only the accepted option states.",
  },
  {
    slug: "memory-training",
    challenge: "c2",
    reason: "Says one candidate comparison was not reported, ruling it out.",
  },
  {
    slug: "recalling-personal-details",
    challenge: "c2",
    reason: "Bin labels carry stray JSON characters.",
  },
  {
    slug: "imagining-survival-scenarios",
    challenge: "c2",
    reason: "Bin labels carry stray JSON characters.",
  },
  {
    slug: "online-charity-giving",
    challenge: "c4",
    reason:
      "A bin label carries the model's own JSON repair notes after stray characters.",
  },
  {
    slug: "vaccine-misinformation-correction",
    challenge: "c4",
    reason: "Bin labels carry a leaked detail field.",
  },
  {
    slug: "body-posture-judgments",
    challenge: "c1",
    reason:
      "The rungs say blurring and uniform clothing remove appearance confounds, the accepted reason.",
  },
  {
    slug: "building-daily-habits",
    challenge: "c2",
    reason:
      "Passages are repeated sentence fragments rather than distinct steps.",
  },
  {
    slug: "cursing-while-in-pain",
    challenge: "c1",
    reason: "Refers to the prompt and an evidence id instead of the study.",
  },
  {
    slug: "cursing-while-in-pain",
    challenge: "c2",
    reason: "The cards repeat the options with placeholder details.",
  },
  {
    slug: "daily-conversation-hearing",
    challenge: "c2",
    reason: "Panels hold placeholder steps such as “Summary” and “Purpose”.",
  },
  {
    slug: "holding-a-warm-drink",
    challenge: "c1",
    reason: "Holds placeholder nodes such as an arrow and an evidence id.",
  },
  {
    slug: "judging-statement-truthfulness",
    challenge: "c1",
    reason:
      "Its description says the evidence supports only the lowest rung, which is the accepted reason.",
  },
  {
    slug: "learning-styles",
    challenge: "q1",
    reason:
      "Its description states the result pattern that would support the idea, the answer.",
  },
  {
    slug: "managing-personal-debt",
    challenge: "c1d",
    reason:
      "The first rung says the score is a screening cut-off, not a diagnosis, the accepted answer.",
  },
  {
    slug: "puzzle-solving-after-motivation",
    challenge: "c1",
    reason:
      "Says the experimenter was kept blind, the reason the question asks for and the evidence lines do not state.",
  },
  {
    slug: "remembering-doctor-appointments",
    challenge: "c2",
    reason:
      "Says the researchers adjusted for reading scores, the accepted answer.",
  },
  {
    slug: "science-video-trust",
    challenge: "q1",
    reason:
      "Presents the on-screen title, the accepted answer, as the only rung with study evidence.",
  },
  {
    slug: "science-video-trust",
    challenge: "q2",
    reason: "Matrix cells hold placeholder ids such as /cell_MS.",
  },
  {
    slug: "social-media-and-sleep",
    challenge: "c1",
    reason:
      "Says the population is limited to social media users, the accepted answer.",
  },
  {
    slug: "social-media-and-sleep",
    challenge: "c2",
    reason:
      "Cards hold placeholder labels such as C1 and split the band list into fragments.",
  },
  {
    slug: "tracing-shapes-while-brainstorming",
    challenge: "c1",
    reason:
      "The top rung says matching isolates curvature, the accepted answer.",
  },
  {
    slug: "science-video-trust",
    challenge: "q5",
    reason:
      "Element text cites evidence ids such as (e9) instead of reading as prose.",
  },
  {
    slug: "understanding-how-pumps-work",
    challenge: "c3",
    reason: 'Elements hold placeholder text such as "Option o5 text".',
  },
  {
    slug: "classroom-mindfulness-practice",
    challenge: "c5",
    reason:
      "Element text cites evidence ids such as (e11) instead of reading as prose.",
  },
  {
    slug: "bus-ridership-behavior",
    challenge: "c1",
    reason:
      "Says geographic separation reduces spillover, the accepted reason.",
  },
  {
    slug: "classroom-mindfulness-practice",
    challenge: "c2",
    reason:
      "Each card names its own placement, which lays out the clean comparison.",
  },
  {
    slug: "music-and-attention",
    challenge: "c2",
    reason: "Says heart rate was not measured, ruling an option out.",
  },
  {
    slug: "natural-light-at-work",
    challenge: "c2",
    reason:
      "Passages reason through to merging being justified, the accepted answer.",
  },
  {
    slug: "reasoning-and-belief-study",
    challenge: "c2",
    reason:
      "States the positive control's purpose, the answer, and its result before the results stage.",
  },
];

export function isRemovedScene(slug: string, challenge: string) {
  return removedScenes.some(
    (r) => r.slug === slug && r.challenge === challenge,
  );
}
