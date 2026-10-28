/**
 * Definitions removed after reading every design-stage term of the prepared
 * studies for answer leaks (#39). The automated leak check misses some
 * study-specific definitions of terms inside answer options. Each entry says
 * how the definition gave the answer away. scripts/define-prepared-terms.ts
 * drops these on generation and `prune` drops them from saved files.
 */
export const removedTerms: {
  slug: string;
  challenge: string;
  term: string;
  reason: string;
}[] = [
  {
    slug: "breakfast-grades",
    challenge: "q1",
    term: "cross-sectional",
    reason:
      "Describes this study's single-assessment design, matching the accepted design.",
  },
  {
    slug: "breakfast-grades",
    challenge: "q2",
    term: "yes/no question",
    reason:
      "Says the yes/no measure cannot convey the habit, which is the accepted answer.",
  },
  {
    slug: "conformity-replication",
    challenge: "q3",
    term: "critical trials",
    reason:
      "Says the critical trials measure conformity, pointing at the accepted measure.",
  },
  {
    slug: "conformity-replication",
    challenge: "q3",
    term: "all ten trials",
    reason:
      "Implies counting all trials mixes in correct-group trials, ruling that option out.",
  },
  {
    slug: "exercise-focus",
    challenge: "q2",
    term: "counterbalancing",
    reason:
      "Restates the accepted plan: session order rotated across students.",
  },
  {
    slug: "texting-lecture",
    challenge: "q1",
    term: "comprehension quiz",
    reason:
      "Names the quiz as this study's measure, pointing at the only option that mentions it.",
  },
  {
    slug: "texting-lecture",
    challenge: "q2",
    term: "within-participants design",
    reason:
      "With the prompt's one-condition assignment, rules out the within-participants option.",
  },
  {
    slug: "texting-lecture",
    challenge: "q2",
    term: "correlational survey",
    reason:
      "Says a survey would not manipulate texting, ruling out that option given the prompt.",
  },
  {
    slug: "dog-ownership-among-seniors",
    challenge: "c2",
    term: "later disability self-reported",
    reason: "Says the study used certification, ruling out an option.",
  },
  {
    slug: "dog-ownership-among-seniors",
    challenge: "c2",
    term: "ordering establishes protection",
    reason: "States what the ordering protects against, the accepted answer.",
  },
  {
    slug: "anticipating-a-shock",
    challenge: "c2",
    term: "explicit measures",
    reason: "Names this study's explicit scales, showing they were measured.",
  },
  {
    slug: "anticipating-a-shock",
    challenge: "c2",
    term: "implicit measures",
    reason: "Names this study's implicit task, showing it was measured.",
  },
  {
    slug: "anticipating-a-shock",
    challenge: "c3",
    term: "statistical power",
    reason: "Explains null results from low power, the accepted reason.",
  },
  {
    slug: "body-posture-judgments",
    challenge: "c1",
    term: "confounding",
    reason:
      "Names faces and clothing as factors to exclude, the accepted reason.",
  },
  {
    slug: "body-posture-judgments",
    challenge: "c1",
    term: "appearance differences",
    reason: "Names clothing and faces as alternatives, the accepted reason.",
  },
  {
    slug: "body-posture-judgments",
    challenge: "c2",
    term: "contrast effect",
    reason:
      "Says sequential photos reduce contrast effects, part of the answer.",
  },
  {
    slug: "building-daily-habits",
    challenge: "c2",
    term: "earlier habit strength",
    reason: "Calls it each person's baseline, the accepted reason.",
  },
  {
    slug: "bus-ridership-behavior",
    challenge: "c1",
    term: "message spillover",
    reason: "Explains why lines are kept apart, the accepted reason.",
  },
  {
    slug: "bus-ridership-behavior",
    challenge: "c2",
    term: "positive message",
    reason: "Describes the open alternative the accepted answer names.",
  },
  {
    slug: "clicking-phishing-links",
    challenge: "c1",
    term: "randomisation",
    reason: "Says teams stayed together, pointing at the accepted reason.",
  },
  {
    slug: "clicking-phishing-links",
    challenge: "c1",
    term: "individual assignment",
    reason: "Says it would split coworkers, the accepted reason.",
  },
  {
    slug: "clicking-phishing-links",
    challenge: "c1",
    term: "clustering",
    reason: "Says coworkers influence each other, the accepted reason.",
  },
  {
    slug: "clicking-phishing-links",
    challenge: "c2",
    term: "2×2 design",
    reason: "Says the design tests joint effects, the accepted answer.",
  },
  {
    slug: "clicking-phishing-links",
    challenge: "c2",
    term: "crossing",
    reason:
      "Says it tests whether the methods reinforce each other, the answer.",
  },
  {
    slug: "clinton-voter-activism",
    challenge: "c2",
    term: "longitudinal design",
    reason: "Says it tracks change over time, the accepted answer.",
  },
  {
    slug: "clinton-voter-activism",
    challenge: "c2",
    term: "multiple time points",
    reason: "Says the waves let researchers examine change, the answer.",
  },
  {
    slug: "daily-gratitude-and-well-being",
    challenge: "c2",
    term: "cross-lagged",
    reason: "Defines the link the accepted answer separates from stability.",
  },
  {
    slug: "daily-gratitude-and-well-being",
    challenge: "c2",
    term: "stability",
    reason:
      "Names the paths the question describes, mapping them to the answer.",
  },
  {
    slug: "food-warning-labels",
    challenge: "c1",
    term: "control group",
    reason: "Says the no-warning comparison was omitted, the accepted answer.",
  },
  {
    slug: "imagining-survival-scenarios",
    challenge: "c1",
    term: "Color plausibility",
    reason:
      "Describes colour pairing as part of the study, suggesting a manipulation.",
  },
  {
    slug: "imagining-survival-scenarios",
    challenge: "c2",
    term: "Item memory",
    reason: "Describes it as a measure in this study, giving the answer.",
  },
  {
    slug: "imagining-survival-scenarios",
    challenge: "c2",
    term: "Color context memory",
    reason: "Describes it as a measure in this study, giving the answer.",
  },
  {
    slug: "imagining-survival-scenarios",
    challenge: "c2",
    term: "Source context memory",
    reason: "Describes it as a measure in this study, giving the answer.",
  },
  {
    slug: "managing-personal-debt",
    challenge: "c1d",
    term: "caseness",
    reason: "Restates the accepted answer: a cut-off score, not a diagnosis.",
  },
  {
    slug: "memory-training",
    challenge: "c1",
    term: "Random assignment",
    reason: "Implies the groups used pre-existing scores, the accepted answer.",
  },
  {
    slug: "memory-training",
    challenge: "c2",
    term: "Between‑group difference",
    reason: "Describes the comparison at pretest and posttest, the answer.",
  },
  {
    slug: "morning-people-and-life-satisfaction",
    challenge: "c2",
    term: "tiny faith subgroups",
    reason: "Says they were omitted to avoid unstable estimates, the answer.",
  },
  {
    slug: "music-and-attention",
    challenge: "c1",
    term: "mixed-design ANOVA",
    reason: "States which factors varied within participants, the answer.",
  },
  {
    slug: "music-and-mood-perception",
    challenge: "c3",
    term: "tonic key",
    reason: "Says keys varied to prevent pitch confounding, the answer.",
  },
  {
    slug: "music-and-mood-perception",
    challenge: "c3",
    term: "balancing",
    reason: "Says keys were spread equally across conditions, the answer.",
  },
  {
    slug: "phone-use-while-driving",
    challenge: "c2",
    term: "Brake reaction time (BRT)",
    reason: "Describes it as this study's measure, giving the answer.",
  },
  {
    slug: "phone-use-while-driving",
    challenge: "c2",
    term: "Time‑headway (TH) variability",
    reason: "Describes it as this study's measure, giving the answer.",
  },
  {
    slug: "puzzle-solving-after-motivation",
    challenge: "c2",
    term: "arrangements",
    reason: "Says layouts varied while primes stayed constant, the answer.",
  },
  {
    slug: "recalling-personal-details",
    challenge: "c1",
    term: "within‑subjects",
    reason: "States which factor was within-subjects, the answer.",
  },
  {
    slug: "recalling-personal-details",
    challenge: "c1",
    term: "between‑subjects",
    reason: "States which factor was between-subjects, the answer.",
  },
  {
    slug: "recalling-personal-details",
    challenge: "c2",
    term: "encoding",
    reason: "Describes the study's phases, which the question asks for.",
  },
  {
    slug: "recalling-personal-details",
    challenge: "c2",
    term: "recall",
    reason: "Places recall after the filler task, the accepted order.",
  },
  {
    slug: "remembering-doctor-appointments",
    challenge: "c1",
    term: "ageing-related content",
    reason: "Says only the content differed between stories, the answer.",
  },
  {
    slug: "remembering-doctor-appointments",
    challenge: "c2",
    term: "quiz scores",
    reason: "Says quiz scores were a covariate, the accepted answer.",
  },
  {
    slug: "science-video-trust",
    challenge: "q2",
    term: "idiosyncratic effects",
    reason:
      "Says using both presenters in both roles controls them, the answer.",
  },
  {
    slug: "sharing-money-in-public",
    challenge: "c3",
    term: "Post‑experiment questionnaire",
    reason: "Says it assessed feelings after the game, the answer.",
  },
  {
    slug: "stroop-task-performance",
    challenge: "c1",
    term: "willpower mindset",
    reason: "Calls it a moderator, completing the accepted aim.",
  },
  {
    slug: "tracing-shapes-while-brainstorming",
    challenge: "c2",
    term: "later rating",
    reason: "Says it measured mood after the task, the accepted weakness.",
  },
  {
    slug: "understanding-how-pumps-work",
    challenge: "c1",
    term: "random assignment",
    reason: "Implies groups used test scores, pointing at the answer.",
  },
  {
    slug: "vaccine-misinformation-correction",
    challenge: "c2",
    term: "Haifa University",
    reason: "Says the graduate students were enrolled there, the answer.",
  },
  {
    slug: "walking-speed-test",
    challenge: "c1",
    term: "age‑related primes",
    reason: "Describes the manipulation, the accepted independent variable.",
  },
  {
    slug: "walking-speed-test",
    challenge: "c2",
    term: "experimenter expectation",
    reason: "Describes the experimenter manipulation, the answer.",
  },
  {
    slug: "stress-affirmation",
    challenge: "q2",
    term: "random assignment",
    reason: "Says the essay was assigned, ruling out that option.",
  },
  {
    slug: "learning-styles",
    challenge: "q2",
    term: "learning‑style survey",
    reason: "Says the survey labels students, ruling it out as assigned.",
  },
  {
    slug: "hand-washing-in-restrooms",
    challenge: "c1",
    term: "Screen-Emoticons",
    reason: "Describes the condition so the matching comparison is evident.",
  },
  {
    slug: "hand-washing-in-restrooms",
    challenge: "c1",
    term: "Screen-Neutral",
    reason: "Says the neutral screen also changes, giving the answer.",
  },
  {
    slug: "classroom-seatmates",
    challenge: "c1",
    term: "randomise",
    reason: "Says children could not choose seats, the accepted reason.",
  },
  {
    slug: "reading-words-aloud",
    challenge: "c5",
    term: "interaction",
    reason:
      "States that the learning-mode effect depends on list proportion, which answers the revised interaction question.",
  },
  {
    slug: "understanding-how-pumps-work",
    challenge: "c3",
    term: "interaction",
    reason:
      "States the explanation-format by spatial-ability conclusion asked by the revised question.",
  },
  {
    slug: "music-and-attention",
    challenge: "c6",
    term: "success rate",
    reason:
      "Names the ceiling interpretation before the learner reasons about the high accuracy.",
  },
  {
    slug: "anticipating-a-shock",
    challenge: "c3",
    term: "Bayes factor",
    reason:
      "Gives the model-evidence comparison that is the keyed response to the revised question.",
  },
  {
    slug: "teen-social-media-use",
    challenge: "c4",
    term: "hierarchical regression",
    reason:
      "Explains the conditional social-media contribution before the learner distinguishes it from the full-model R².",
  },
  {
    slug: "holding-a-warm-drink",
    challenge: "c6",
    term: "neutral condition",
    reason:
      "Names the room-temperature comparison requested by the follow-up question.",
  },
];

const key = (s: string) =>
  s.normalize("NFKC").toLowerCase().replace(/[‐-―]/g, "-").trim();

export function isRemoved(slug: string, challenge: string, term: string) {
  return removedTerms.some(
    (r) =>
      r.slug === slug && r.challenge === challenge && key(r.term) === key(term),
  );
}
