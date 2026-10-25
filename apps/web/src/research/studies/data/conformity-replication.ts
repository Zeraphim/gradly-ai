import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody, StudyChallenge } from "../types.js";

const summary = (
  refs: string[],
  note = "Paraphrase of the cited passage.",
) => ({
  kind: "source-summary" as const,
  refs,
  note,
});
const illustration = (note: string) => ({
  kind: "illustration" as const,
  refs: [] as string[],
  note,
});
const item = (
  id: string,
  label: string,
  detail: string,
  provenance: SceneItem["provenance"],
  at: SceneItem["at"] = "setup",
): SceneItem => ({ id, label, detail, at, provenance });
const options = (texts: string[]) =>
  texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));

const challenges: StudyChallenge[] = [
  {
    id: "q1",
    stage: "Frame the question",
    title: "What is this study asking?",
    type: "single",
    prompt:
      "A lab study shows a real participant a line-matching task after several other people, secretly working with the researchers, call out their answers. The first part of the study repeats a well-known earlier experiment. Which question does that part set out to answer?",
    evidence: [
      "Planted group members answer aloud before the real participant.",
      "The task is to say which of three lines matches a reference line.",
    ],
    options: options([
      "Does the earlier finding, people giving a wrong answer after a group gives it, show up again in a new sample decades later?",
      "Does hearing the group change how long the lines actually look to people?",
      "Which personality type causes people to go along with a group?",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "The study records what people say out loud, and this part copies an earlier procedure.",
    misconceptions: {
      B: "The study records spoken answers, not what people privately see. A wrong spoken answer does not show the lines looked different to them.",
      C: "Personality was measured in a later part of the study, and measured traits cannot show cause. The replication part asks whether an earlier result appears again.",
    },
    explanation:
      "A replication runs a close copy of an earlier study on a new sample and asks whether the original result appears again. Here the result in question is whether people publicly give a wrong answer after a group has given it.",
    refs: ["original", "setup"],
    writtenReasoning: false,
    reveal: "design",
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "connections",
      title: "What does the setup let you ask?",
      instruction:
        "Inspect the task and the group, then connect the question this part of the study is built to answer.",
      description:
        "Two parts of the procedure: a line-matching task and a group that answers aloud first.",
      provenance: summary(["original", "setup"]),
      actionLabel: "Connect a research question",
      anchors: [
        item(
          "task",
          "Line-matching task",
          "Say which of three lines matches a reference line.",
          summary(["original"]),
        ),
        item(
          "group",
          "Planted group answers first",
          "Other people in the room work with the researchers and give their answers aloud before the real participant.",
          summary(["original", "setup"]),
        ),
      ],
      responses: [
        {
          optionId: "A",
          label: "Does the earlier result recur?",
          targetIds: ["task", "group"],
        },
        {
          optionId: "B",
          label: "Does perception change?",
          targetIds: ["task"],
        },
        {
          optionId: "C",
          label: "Which personality causes it?",
          targetIds: ["group"],
        },
      ],
      resolution: item(
        "q1-resolution",
        "A replication question",
        "This part copies an earlier procedure to see whether the same public behaviour appears in a new sample.",
        summary(["original", "setup"]),
        "resolution",
      ),
    },
  },
  {
    id: "q2",
    stage: "Read the design",
    title: "Spot the change in procedure",
    type: "single",
    prompt:
      "A replication is rarely an exact copy. Compare the two procedures and tap the replication step that is the clearest change from the original.",
    evidence: [
      "Original: 6 to 8 planted group members gave false answers in a line-matching task.",
      "Replication: 5 planted group members, and the real participant sat in seat 5 of 6.",
    ],
    options: options([
      "The number of planted group members",
      "The line-matching task itself",
      "Planted members answering wrongly on some trials",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "Look for a step whose detail differs between the two panels, not one that appears in both.",
    misconceptions: {
      B: "Both studies used the same kind of task: match a reference line to one of three lines. That was kept on purpose.",
      C: "Both studies had planted members give wrong answers on some trials. That is the core of the procedure, kept from the original.",
    },
    explanation:
      "The original used 6 to 8 planted group members. The replication used 5. The task and the planted wrong answers were kept. Small procedural changes like this are one reason a replication's result can differ a little from the original even if the underlying effect is the same.",
    refs: ["original", "setup", "trials"],
    writtenReasoning: false,
    reveal: "design",
    responseStyle: "tap",
    scene: {
      version: 1,
      kind: "designs",
      title: "Original and replication, side by side",
      instruction:
        "Compare the steps, then tap the replication step that changed.",
      description:
        "Two procedures for the same line-matching experiment. Steps are summaries of each study's description.",
      provenance: summary(["original", "setup", "trials"]),
      panels: [
        {
          id: "original-panel",
          label: "Original study",
          steps: [
            item(
              "o-group",
              "6 to 8 planted members",
              "Group members working with the researcher gather in the room.",
              summary(["original"]),
            ),
            item(
              "o-task",
              "Line-matching task",
              "Match a line with one of three reference lines.",
              summary(["original"]),
            ),
            item(
              "o-wrong",
              "Planted false answers",
              "The planted members were instructed to give false answers.",
              summary(["original"]),
            ),
          ],
        },
        {
          id: "replication-panel",
          label: "Replication",
          steps: [
            item(
              "r-group",
              "5 planted members",
              "Five planted members and one real participant sit in a numbered front row.",
              summary(["setup"]),
            ),
            item(
              "r-seat",
              "Real participant in seat 5",
              "The last seat goes to another planted member, so one person answers after the participant.",
              summary(["setup"]),
            ),
            item(
              "r-task",
              "Line-matching task",
              "Ten line tasks. Everyone calls out a line number in seat order.",
              summary(["trials"]),
            ),
            item(
              "r-trials",
              "Planted answers vary by trial",
              "The group calls out the correct line on trials 1, 2, 4 and 8.",
              summary(["trials"]),
            ),
          ],
        },
      ],
      responses: [
        { optionId: "A", label: "Group size", targetIds: ["r-group"] },
        { optionId: "B", label: "The task", targetIds: ["r-task"] },
        { optionId: "C", label: "Wrong answers", targetIds: ["r-trials"] },
      ],
      resolution: item(
        "q2-resolution",
        "Close, not identical",
        "6 to 8 planted members in the original, 5 in the replication. The task and the planted wrong answers were kept.",
        summary(["original", "setup"]),
        "resolution",
      ),
    },
  },
  {
    id: "q3",
    stage: "Read the design",
    title: "Choose a comparable outcome",
    type: "single",
    prompt:
      "To compare the replication with the original, both need the same outcome. Which measure fits?",
    evidence: [
      "On trials 1, 2, 4 and 8 the planted group called out the correct line.",
      "On the other six trials, the critical trials, the group called out a wrong line.",
    ],
    options: options([
      "The share of wrong answers on the critical trials, where the group answered wrongly",
      "The share of wrong answers across all ten trials",
      "Whether each person ever gave a wrong answer at least once",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "Going along with the group is only possible when the group is wrong.",
    misconceptions: {
      B: "Trials where the group answers correctly cannot show going along with a wrong group. Including them dilutes the measure and makes it depend on how many such trials each study used.",
      C: "A yes-or-no measure loses how often people went along. It also depends on the number of critical trials, which differed between studies.",
    },
    explanation:
      "Both studies report the error rate on critical trials: the share of answers that were wrong on trials where the group gave a wrong answer. That is the outcome that can be lined up across the two studies.",
    refs: ["trials"],
    writtenReasoning: false,
    reveal: "design",
    responseStyle: "cards",
    scene: null,
  },
  {
    id: "q4",
    stage: "Read the results",
    title: "Put the two rates side by side",
    type: "single",
    prompt:
      "The original reported 36.8% wrong answers on critical trials. The replication's group without payment for correct answers reported 33%. What does this pair of numbers show on its own?",
    evidence: [
      "Original: mean error rate of 36.8% on critical trials.",
      "Replication, no incentive: average of incorrect answers 33%.",
    ],
    options: options([
      "In both studies, roughly a third of critical-trial answers followed a wrong group.",
      "Going along with the group has declined since the original, because 33% is lower than 36.8%.",
      "The replication reproduced the original rate exactly.",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "Describe what both numbers have in common before reading anything into the small gap.",
    misconceptions: {
      B: "A gap of a few points between two studies with different samples and slightly different procedures is not evidence of a trend over time on its own.",
      C: "33% and 36.8% are close but not the same. Close is not exact.",
    },
    explanation:
      "Both rates show that about a third of answers on critical trials followed a wrong group. The rates are 3.8 percentage points apart. These two numbers alone cannot tell you whether that gap is real, zero, or larger in the population.",
    refs: ["asch", "result"],
    writtenReasoning: false,
    reveal: "results",
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "comparison",
      title: "Two error rates on one scale",
      instruction:
        "Record an optional expectation, then compare the reported rates and connect a reading you can defend.",
      description:
        "Reported error rates on critical trials, as percentages. These are study-level averages, not individual answers.",
      provenance: {
        kind: "reported",
        refs: ["asch", "result"],
        note: "Rates as reported in the replication paper. No individual data are shown.",
      },
      measure: "Wrong answers on critical trials",
      unit: "%",
      min: 0,
      max: 50,
      values: [
        {
          ...item(
            "v-original",
            "Original study",
            "Mean error rate on critical trials, 123 real participants.",
            {
              kind: "reported",
              refs: ["asch"],
              note: "Original rate as reported in the replication paper.",
            },
          ),
          value: 36.8,
        },
        {
          ...item(
            "v-replication",
            "Replication, no incentive",
            "Average of incorrect answers on critical trials.",
            {
              kind: "reported",
              refs: ["result"],
              note: "Reported average for the group without payment for correct answers.",
            },
          ),
          value: 33,
        },
        {
          ...item(
            "v-meta",
            "Average of 44 strict replications",
            "Meta-analysis average error rate cited in the paper.",
            {
              kind: "reported",
              refs: ["asch"],
              note: "Meta-analysis average as cited in the paper's literature review.",
            },
            "feedback",
          ),
          value: 25,
        },
      ],
      difference: {
        from: "v-original",
        to: "v-replication",
        label: "Original minus replication · percentage points",
        at: "feedback",
      },
      prediction: {
        label: "Before comparing, how far apart do you expect the two rates?",
        options: ["Under 5 points", "5 to 15 points", "Over 15 points"],
      },
      responses: [
        {
          optionId: "A",
          label: "A shared pattern",
          targetIds: ["v-original", "v-replication"],
        },
        {
          optionId: "B",
          label: "A decline over time",
          targetIds: ["v-original", "v-replication"],
        },
        {
          optionId: "C",
          label: "An exact match",
          targetIds: ["v-original", "v-replication"],
        },
      ],
      resolution: {
        ...item(
          "q4-resolution",
          "Similar, and not identical",
          "36.8 minus 33 is 3.8 percentage points. Earlier replications averaged 25%, so rates in this range vary from study to study.",
          {
            kind: "derived",
            refs: ["asch", "result"],
            note: "Subtraction of the two reported rates on the same percentage scale.",
          },
        ),
        at: "resolution",
      },
    },
  },
  {
    id: "q5",
    stage: "Read the results",
    title: "Read the test of the gap",
    type: "single",
    prompt:
      "The authors tested the gap between 33% and 36.8% with a two-sided t-test: t(16) = 0.59, p = 0.57. What does this result say about the gap?",
    evidence: ["Two sample two-sided t-test: t(16) = 0.59, p = 0.57."],
    options: options([
      "Gap not detected",
      "Rates shown equal",
      "Gap shown real",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "A p-value is computed assuming no true gap. Ask what a large one does, and does not, tell you.",
    misconceptions: {
      B: "A large p-value means a gap this size would be unsurprising if the true rates were equal. It does not show they are equal, because many other gaps would also be unsurprising.",
      C: "With p = 0.57 the test did not distinguish the gap from zero. It gives no support for a real difference.",
    },
    explanation:
      "p = 0.57 means a gap of 3.8 points would be quite ordinary even if the true rates were identical. So the test did not detect a difference. That is absence of evidence for a gap, which is not the same as evidence that there is no gap.",
    refs: ["result"],
    writtenReasoning: false,
    reveal: "results",
    responseStyle: "pills",
    scene: {
      version: 1,
      kind: "connections",
      title: "What does the test tell you?",
      instruction:
        "Inspect the observed gap and the reported test, then connect a reading of the result.",
      description:
        "The two reported rates and the reported significance test for their difference.",
      provenance: {
        kind: "reported",
        refs: ["result"],
        note: "Reported rates and test statistic from the replication paper.",
      },
      actionLabel: "Read the test",
      anchors: [
        item(
          "a-gap",
          "Observed gap",
          "Original 36.8% against replication 33%.",
          {
            kind: "reported",
            refs: ["result"],
            note: "Both rates appear in the cited passage.",
          },
        ),
        item(
          "a-test",
          "Reported test",
          "Two-sided t-test: t(16) = 0.59, p = 0.57.",
          {
            kind: "reported",
            refs: ["result"],
            note: "Test statistic and p-value as reported.",
          },
        ),
      ],
      responses: [
        {
          optionId: "A",
          label: "Not detected",
          targetIds: ["a-gap", "a-test"],
        },
        { optionId: "B", label: "Shown equal", targetIds: ["a-gap", "a-test"] },
        { optionId: "C", label: "Shown real", targetIds: ["a-gap", "a-test"] },
      ],
      resolution: item(
        "q5-resolution",
        "Not detected is not the same as absent",
        "The test could not tell the two rates apart. It did not measure how close they are.",
        {
          kind: "authored",
          refs: ["result"],
          note: "Statistical interpretation guidance.",
        },
        "resolution",
      ),
    },
  },
  {
    id: "q6",
    stage: "Draw a conclusion",
    title: "Is it a perfect replication?",
    type: "single",
    prompt:
      "The authors call 33% “a perfect replication” of 36.8%, citing p = 0.57 from a test with 16 degrees of freedom. What would you need before claiming the two rates are effectively the same?",
    evidence: [
      "Original vs replication: t(16) = 0.59, p = 0.57.",
      "Incentive vs no incentive in the same paper: t(208) = 2.24, p = 0.03.",
      "No interval for the original-versus-replication gap and no equivalence bound are reported.",
    ],
    options: options([
      "A smallest gap that would matter, set in advance, and an interval for the gap that sits entirely inside it.",
      "Nothing more. A nonsignificant difference already shows the rates match.",
      "An even larger p-value from the same test.",
      "Both rates being well above zero.",
    ]),
    accepted: ["A"],
    alternatives: [],
    hint: "To say two things are the same, you must say how different they could be and still count as the same, then show the data rule out anything larger.",
    misconceptions: {
      B: "This treats a failure to detect a gap as proof of no gap. A small or noisy comparison fails to detect even sizeable gaps.",
      C: "A larger p-value still only says the gap was not detected. It never bounds how large the true gap could be.",
      D: "Both rates being above zero shows conformity appeared in both studies. It says nothing about whether the two rates are equal.",
    },
    explanation:
      "Equivalence needs a bound and an interval: decide the smallest gap that would matter, then show the interval for the observed gap lies inside it. The paper reports neither for this comparison. The test also had only 16 degrees of freedom. In a two-sample t-test that implies just 18 observations in total, far fewer than the roughly 220 participants across both studies (the paper does not say what those observations are). Compare the incentive test in the same paper, which had 208. A test with so few observations would often miss a gap of several points. A fair reading: the replication's rate is similar to and compatible with the original, but the data do not show the rates are equal.",
    refs: ["result", "persontest"],
    writtenReasoning: false,
    reveal: "interpretation",
    responseStyle: "cards",
    scene: {
      version: 1,
      kind: "flow",
      title: "Two routes from an observed gap",
      instruction:
        "Follow both routes from the observed gap, then propose what a claim of sameness needs.",
      description:
        "A conceptual diagram. One route asks whether a gap is detectable. The other asks whether the gap is small enough to ignore.",
      provenance: illustration(
        "Conceptual guide to significance and equivalence testing. No simulated data or intervals are implied.",
      ),
      nodes: [
        item(
          "n-gap",
          "Observed gap",
          "The difference between the two reported rates.",
          illustration("Conceptual starting point."),
        ),
        {
          ...item(
            "n-test",
            "Significance test",
            "Asks: can this gap be told apart from zero?",
            illustration("Conceptual step."),
          ),
          column: 0,
        },
        {
          ...item(
            "n-nodetect",
            "Gap not detected",
            "The data are compatible with no gap, and with other gaps too.",
            illustration("Conceptual outcome."),
          ),
          column: 0,
        },
        {
          ...item(
            "n-bound",
            "Smallest gap that matters",
            "A threshold chosen before looking at the data.",
            illustration("Conceptual step."),
          ),
          column: 1,
        },
        {
          ...item(
            "n-interval",
            "Interval for the gap",
            "The range of gaps the data are compatible with.",
            illustration("Conceptual step."),
          ),
          column: 1,
        },
        {
          ...item(
            "n-equiv",
            "Claim of sameness",
            "Supported only if the whole interval sits inside the threshold.",
            illustration("Conceptual outcome."),
          ),
          column: 1,
        },
      ],
      edges: [
        {
          from: "n-gap",
          to: "n-test",
          label: "test against zero",
          at: "setup",
        },
        {
          from: "n-test",
          to: "n-nodetect",
          label: "large p-value",
          at: "setup",
        },
        {
          from: "n-gap",
          to: "n-interval",
          label: "estimate the gap",
          at: "setup",
        },
        {
          from: "n-bound",
          to: "n-equiv",
          label: "compare with",
          at: "setup",
        },
        {
          from: "n-interval",
          to: "n-equiv",
          label: "inside the threshold?",
          at: "setup",
        },
      ],
      responses: [
        {
          optionId: "A",
          label: "Threshold and interval",
          targetIds: ["n-bound", "n-interval", "n-equiv"],
        },
        {
          optionId: "B",
          label: "Not detected is enough",
          targetIds: ["n-nodetect", "n-equiv"],
        },
        { optionId: "C", label: "A larger p-value", targetIds: ["n-test"] },
        { optionId: "D", label: "Both above zero", targetIds: ["n-gap"] },
      ],
      resolution: item(
        "q6-resolution",
        "Only one route reaches sameness",
        "This paper took the significance route only. With 16 degrees of freedom and no interval or threshold, “perfect replication” overstates what the test shows.",
        {
          kind: "authored",
          refs: ["result", "persontest"],
          note: "Interpretation guidance based on the reported tests.",
        },
        "resolution",
      ),
    },
  },
];

const bonus: StudyChallenge = {
  id: "bonus",
  stage: "Bonus",
  title: "Does paying for accuracy end conformity?",
  type: "single",
  prompt:
    "The replication also randomly assigned some participants to be paid for each correct answer. Unpaid participants gave on average 1.97 wrong answers out of 6 critical trials. Paid participants gave 1.47 (t(208) = 2.24, p = 0.03). Which reading fits?",
  evidence: [
    "No incentive: 1.97 incorrect answers on average. Incentive: 1.47.",
    "Difference of 0.5 incorrect answers, t(208) = 2.24, p = 0.03.",
  ],
  options: options([
    "Paying for accuracy reduced, but did not remove, going along with the group.",
    "Paying for accuracy eliminated going along with the group.",
    "p = 0.03 means there is a 97% chance that paying for accuracy works.",
  ]),
  accepted: ["A"],
  alternatives: [],
  hint: "Compare the paid group's average with zero, and recall what a p-value is conditional on.",
  misconceptions: {
    B: "Paid participants still gave about 1.5 wrong answers out of 6 on average. Fewer is not none.",
    C: "A p-value is the chance of data this extreme if there were no effect. It is not the probability that the effect is real.",
  },
  explanation:
    "Payment lowered the average number of wrong answers by 0.5, but paid participants still went along with the group on some critical trials. Note this test used 208 degrees of freedom, comparing individual participants, unlike the 16 used for the comparison with the original.",
  refs: ["persontest"],
  writtenReasoning: false,
  reveal: "bonus",
  responseStyle: "cards",
  scene: null,
};

export const body: StudyBody = {
  lesson: {
    id: "prepared-conformity-replication",
    title: "Would You Go Along With the Group?",
    source: "featured",
    briefing:
      "A research team repeats a classic experiment in which a real participant judges line lengths after a planted group answers aloud. You will read both procedures, choose a comparable outcome, then decide what the replication's numbers can and cannot support.",
    paper: {
      title:
        "The power of social influence: A replication and extension of the Asch experiment",
      authors: "Axel Franzen and Sebastian Mader (2023)",
      journal: "PLOS ONE, 18(11), e0294325",
      url: "https://doi.org/10.1371/journal.pone.0294325",
      limitations: [
        "Participants were university students, so the result may not hold for non-student groups.",
        "Participants were strangers to the planted group members. Pressure among friends may differ.",
        "The payment for correct answers was small, one Swiss franc per correct answer.",
        "The comparison with the original rate reports only a significance test with 16 degrees of freedom, with no interval or equivalence bound.",
      ],
    },
    evidence: [
      {
        id: "original",
        page: 2,
        excerpt:
          "In Asch’s [2] original experiment 6 to 8 confederates gathered in an experimental room and were instructed to give false answers in matching a line with the length of three reference lines.",
      },
      {
        id: "setup",
        page: 6,
        excerpt:
          "For this purpose, we placed 5 confederates in addi- tion to a naïve subject in a room. The confederates were asked to behave as naïve subjects and entered the room one after the other. The front row of the seats in the experimental room were numbered such that subjects sat next to each other. The naïve subject was always assigned to seat number 5, leaving the last seat to another confederate.",
      },
      {
        id: "trials",
        page: 6,
        excerpt:
          "We presented 10 such line tasks (see Fig A1 in the S1 Appendix). In the first two trials as well as in trials number 4 and 8, con- federates pointed out the correct lines.",
      },
      {
        id: "asch",
        page: 3,
        excerpt:
          "Asch [2] reports a mean error rate of 36.8% of the 123 real subjects in the critical trials in which the group provided the wrong answer. This result was replicated remarkably consistently. Bond and Smith [12] conducted a meta study including 44 strict replications, and report an average error rate of 25%.",
      },
      {
        id: "result",
        page: 8,
        excerpt:
          "The average of incorrect answers is 33% in the non-incentivized group, which is a perfect replication of Asch’s (1955) original 36.8% result (two sample two-sided T- test, t(16) = 0.59, p = 0.57).",
      },
      {
        id: "persontest",
        page: 8,
        excerpt:
          "When decisions were not incentivized subjects gave on average 1.97 incorrect answers. In the incentivized condition the average number dropped to 1.47, leading to a statistically significant difference of 0.5 incorrect answers (t(208) = 2.24, p = 0.03 for two-sided T-test).",
      },
    ],
    challenges,
    bonus,
  },
  takeaway:
    "Without payment for accuracy, 33% of answers on critical trials followed a wrong group, close to the original 36.8%. But that comparison was a nonsignificant test with 16 degrees of freedom and no interval or equivalence bound, so it shows the rates are compatible, not that they are the same.",
};
