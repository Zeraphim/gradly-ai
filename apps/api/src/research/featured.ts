import { type Challenge, type Lesson } from "./contracts.js";
const options = (texts: string[]) =>
  texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));
function c(
  id: number,
  title: string,
  prompt: string,
  texts: string[],
  accepted: string[],
  hint: string,
  explanation: string,
  misconceptions: Record<string, string>,
  reveal: Challenge["reveal"] = "design",
  evidence: string[] = [],
): Challenge {
  return {
    id: `q${id}`,
    stage:
      id <= 2
        ? "Frame the investigation"
        : id <= 5
          ? "Plan the analysis"
          : id <= 7
            ? "Read the evidence"
            : "Draw a conclusion",
    title,
    prompt,
    type: accepted.length > 1 ? "multiple" : "single",
    options: options(texts),
    accepted,
    alternatives: [],
    hint,
    explanation,
    misconceptions,
    reveal,
    evidence,
    refs: [id === 9 ? "exp1" : id >= 6 ? "results" : "method"],
    writtenReasoning: [3, 4, 8].includes(id),
  };
}
export const featured: Lesson = {
  id: "featured-texting",
  title: "Can You Text and Still Learn?",
  source: "featured",
  briefing:
    "A research team asks whether texting during a lecture changes comprehension. You will recommend an analysis before seeing the findings, defend your decisions, then compare them with the published study. There are eight challenges and an optional bonus. Your first attempt and revisions are recorded separately.",
  paper: {
    title:
      "OMG! Texting in Class = U Fail :( Empirical Evidence That Text Messaging During Class Disrupts Comprehension.",
    authors: "Amanda C. Gingerich and Tara T. Lineweaver (2014)",
    journal: "Teaching of Psychology, 41(1), 44–51",
    url: "https://doi.org/10.1177/0098628313514177",
    limitations: [
      "A single university sample limits generalizability.",
      "Prescribed text conversations may differ from everyday texting.",
      "Expectations could still affect performance.",
      "A short comprehension quiz does not measure long-term achievement or overall GPA.",
    ],
  },
  evidence: [
    {
      id: "method",
      page: 47,
      excerpt:
        "56 undergraduates; random assignment to texting or no texting; approximately 30-minute lecture; approximately 10-minute distractor; nine-item comprehension quiz.",
    },
    {
      id: "results",
      page: 47,
      excerpt:
        "Texting M=73.41%, SD=16.95%; no texting M=83.00%, SD=17.26%; F(1,54)=4.33, p<.05.",
    },
    {
      id: "exp1",
      page: 46,
      excerpt:
        "Experiment 1 did not randomly assign students; volunteers with unlimited texting were selected into the text condition.",
    },
  ],
  challenges: [
    c(
      1,
      "Frame the Research Question",
      "Which research question matches the outcome measured in this investigation?",
      [
        "Does texting during a lecture affect the percentage of comprehension quiz questions answered correctly?",
        "Does texting lower students’ overall college GPA?",
        "Do students who text spend less time studying throughout the semester?",
      ],
      ["A"],
      "Identify the outcome the researchers actually measured.",
      "The quiz measures comprehension of this lecture. GPA and semester study habits were not the measured outcomes.",
      {
        B: "GPA is broader than the measured quiz outcome.",
        C: "Study time across the semester was not measured.",
      },
    ),
    c(
      2,
      "Identify the Research Design",
      "Each participant was randomly assigned to one condition. What design compares the comprehension scores?",
      [
        "A within-participants design in which everyone completes both conditions.",
        "A between-participants experiment with separate texting and no-texting groups.",
        "A correlational survey of usual texting habits.",
      ],
      ["B"],
      "Did the same participant contribute a score to both conditions?",
      "Each participant experienced one condition. Random assignment makes this a between-participants experiment.",
      {
        A: "There are no repeated observations of the same participants across conditions.",
        C: "Researchers assigned the condition rather than only measuring usual habits.",
      },
    ),
    c(
      3,
      "Recommend Statistical Methods",
      "Which methods could compare the average quiz scores of these two independent groups? Select both defensible methods.",
      [
        "Independent-samples t-test.",
        "One-way between-groups ANOVA.",
        "Paired-samples t-test.",
        "Pearson correlation between two repeated quiz scores.",
      ],
      ["A", "B"],
      "Think about the number of groups, the numerical outcome, and whether observations are paired.",
      "Both an independent-samples t-test and a one-way between-groups ANOVA can compare two independent means. A paired test needs linked observations. The usual equal-variance two-group ANOVA and pooled t-test have F=t²; Welch variants address unequal variances.",
      {
        A: "A t-test is defensible, but select the other suitable method too.",
        B: "ANOVA is defensible with two groups, but another method also fits.",
        C: "Paired analysis needs linked observations. Does each student have a score in both groups?",
        D: "This question compares independent groups, not an association between repeated quiz scores.",
      },
    ),
    c(
      4,
      "Justify the Analysis",
      "Which justification best supports your recommended analysis?",
      [
        "Any test is appropriate as long as its p-value is below .05.",
        "The outcome is numerical, the groups are independent, and the test’s distribution and variance assumptions need examination.",
        "The groups must be paired because they listened to the same lecture.",
      ],
      ["B"],
      "Link the outcome’s scale and the relationship between observations to the analysis.",
      "A suitable analysis follows the research question, numerical outcome, independent observations, and relevant assumptions. A low p-value cannot make an unsuitable test valid.",
      {
        A: "Select a method before interpreting its significance.",
        C: "A shared lecture does not create paired observations.",
      },
    ),
    c(
      5,
      "Examine Assumptions",
      "Which checks matter for this comparison? Select both.",
      [
        "Inspect group distributions and unusual scores; consider variance equality or a suitable alternative.",
        "Check that observations are independent, including whether the testing or texting arrangement could introduce dependence.",
        "Require every participant to earn the same score.",
        "Assume random assignment guarantees normally distributed scores.",
      ],
      ["A", "B"],
      "Random assignment helps causal inference, but it does not guarantee every analysis assumption.",
      "Consider distributions, outliers, variance, and the independence supported by the design. Group testing and texting partners deserve attention when assessing possible dependence. Equal-variance methods and Welch methods have different variance requirements.",
      {
        A: "Distribution and variance matter; also inspect independence.",
        B: "Independence matters; also inspect distributions and variance.",
        C: "Identical scores are not an assumption.",
        D: "Random assignment does not guarantee normality.",
      },
    ),
    c(
      6,
      "Interpret the Mean Difference",
      "Which statement correctly describes the observed difference in comprehension quiz scores?",
      [
        "The no-texting group scored 9.59 percentage points higher on average than the texting group.",
        "Every student in the no-texting group scored 9.59 percentage points higher than every student in the texting group.",
        "The no-texting group scored 9.59% higher relative to the texting group’s mean.",
      ],
      ["A"],
      "Subtract the two percentage scores. A difference between percentages uses percentage points.",
      "83.00 − 73.41 = 9.59 percentage points. This is a difference between group means, not a claim about every student. A relative percentage change would divide the difference by a baseline.",
      {
        B: "Group means do not determine every individual score.",
        C: "A percentage-point difference is not the same as a relative percentage change.",
      },
      "results",
      [
        "Texting: M=73.41%, SD=16.95%.",
        "No texting: M=83.00%, SD=17.26%.",
        "Outcome: percentage correct on a nine-item comprehension quiz.",
      ],
    ),
    c(
      7,
      "Interpret Statistical Significance",
      "The reported result is F(1,54)=4.33, p<.05. Which interpretation is defensible?",
      [
        "There is less than a 5% probability that the null hypothesis is true.",
        "Under the null model and test assumptions, results at least this extreme would occur with probability below .05.",
        "The result proves texting has a large effect on every student.",
      ],
      ["B"],
      "The p-value is conditional on a null model. It is not the probability that the hypothesis is true.",
      "The p-value describes how unusual the data are under the null model and assumptions. It does not give the probability of the null hypothesis, the effect’s practical importance, or certainty about every student.",
      {
        A: "A p-value does not assign a probability to the null hypothesis.",
        C: "Statistical significance does not establish effect size or individual certainty.",
      },
      "significance",
      ["F(1,54)=4.33, p<.05."],
    ),
    c(
      8,
      "Write a Defensible Conclusion",
      "Which conclusion respects both the experimental design and the scope of the evidence?",
      [
        "Texting necessarily lowers all students’ GPA in every course.",
        "Random assignment supports a causal interpretation for the lower quiz performance under these study conditions; broader generalization needs more evidence.",
        "No causal interpretation is possible because there were only two groups.",
      ],
      ["B"],
      "Separate random assignment from representative sampling, and keep the conclusion tied to the measured outcome.",
      "Random assignment strengthens causal inference for the manipulated condition and measured comprehension outcome. It does not guarantee broad generalizability, eliminate every design concern, or establish long-term GPA effects.",
      {
        A: "The experiment did not measure GPA or all courses.",
        C: "Two randomly assigned groups can support causal inference.",
      },
      "significance",
      [
        "The texting group had a lower mean comprehension score.",
        "The groups were randomly assigned; the participants came from one university.",
      ],
    ),
  ],
  bonus: c(
    9,
    "Can Significance Fix the Design?",
    "Experiment 1 used nonrandom selection into conditions; Experiment 2 used random assignment. Can a significant result remove Experiment 1’s selection-bias concern?",
    [
      "Yes. A significant p-value establishes that the groups were equivalent before the study.",
      "No. Significance cannot fix nonrandom selection; Experiment 2’s random assignment better addresses that design concern.",
      "Yes. A bigger observed difference automatically proves causation.",
    ],
    ["B"],
    "A statistical result cannot change how the study’s groups were formed.",
    "A p-value does not repair selection bias. Random assignment in Experiment 2 addresses a limitation of Experiment 1, although generalizability and other design concerns still require judgment.",
    {
      A: "Significance cannot show the groups started equivalent.",
      C: "A large difference can still reflect selection bias.",
    },
    "bonus",
    [
      "Experiment 1 used volunteers and nonrandom selection.",
      "Experiment 2 randomly assigned participants to conditions.",
    ],
  ),
};
