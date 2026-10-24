import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody } from "../types.js";

const options = (texts: string[]) =>
  texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));

const summary = (refs: string[]) => ({
  kind: "source-summary" as const,
  refs,
  note: "Authored summary of the study, not a verbatim quotation.",
});
const reported = (refs: string[]) => ({
  kind: "reported" as const,
  refs,
  note: "Value as reported in the paper's text.",
});
const item = (
  id: string,
  label: string,
  detail: string,
  refs: string[],
  at: SceneItem["at"] = "setup",
  column?: number,
): SceneItem => ({
  id,
  label,
  detail,
  at,
  provenance: summary(refs),
  ...(column === undefined ? {} : { column }),
});

export const body: StudyBody = {
  takeaway:
    "Students who wrote about their most important value solved more hard word-association problems under evaluative pressure, but the benefit was concentrated among those reporting more chronic stress. It was one lab study of undergraduates, and its manipulation check showed only that the essays concerned values of different importance, not that anyone felt affirmed.",
  lesson: {
    id: "prepared-stress-affirmation",
    title: "Values, Stress, and Hard Problems",
    source: "featured",
    briefing:
      "Students wrote a short essay and then tackled difficult word puzzles while an evaluator watched. You will read the design, decide what each measurement can and cannot show, then weigh the results before seeing the published study. There are seven challenges.",
    paper: {
      title: "Self-Affirmation Improves Problem-Solving under Stress",
      authors:
        "J. David Creswell, Janine M. Dutcher, William M. P. Klein, Peter R. Harris and John M. Levine (2013)",
      journal: "PLOS ONE, 8(5), e62593",
      url: "https://doi.org/10.1371/journal.pone.0062593",
      limitations: [
        "Seventy-three undergraduates from two Pittsburgh universities were analysed after seven exclusions, a small and narrow sample.",
        "Chronic stress was self-reported at the end of the session. It was measured, not assigned, so it is not a randomised factor.",
        "Everyone solved problems under time pressure in front of a critical evaluator. The authors note the effect may be specific to evaluative settings.",
        "The manipulation check rated how important the written-about value was, not whether people felt affirmed. Its reported means also exceed what two 6-point items could sum to, so its scoring is unclear.",
      ],
    },
    evidence: [
      {
        id: "abstract",
        page: 1,
        excerpt:
          "Eighty undergraduates indicated their perceived chronic stress over the previous month and were randomly assigned to either a self-affirmation or control condition. They then completed 30 difficult remote associate problem-solving items under time pressure in front of an evaluator. Results showed that self-affirmation improved problem-solving performance in underperforming chronically stressed individuals. This research suggests a novel means for boosting problem-solving under stress and may have important implications for understanding how self-affirmation boosts academic achievement in school settings.",
      },
      {
        id: "procedure",
        page: 2,
        excerpt:
          "Participants were randomly assigned either to the self- affirmation or control condition. In both cases, they rated 11 values (i.e., art, business, friends/family) in order of personal importance. Next, they wrote about their first ranked value and why it was important to them (self-affirmation condition) or their ninth ranked value and why it might be important to others (control condition) [12]. Following the self-affirmation writing task, as a manipulation check, participants were asked to respond to two items assessing how important the value they wrote about was, using a 6-point response scale (1 = Strongly Disagree to 6 = Strongly Agree). Items were, ‘‘This value has influenced my life’’ and ‘‘This value is an important part of who I am’’",
      },
      {
        id: "stressmeasure",
        page: 2,
        excerpt:
          "Participants then completed individual difference measures, including the 10-item Perceived Stress Scale [26] to assess perceived stress over the last month (all items were summed to form a composite index of chronic stress, study a = .87). To reduce potential confounding effects, we administered these measures at the end of the experimental session because previous studies indicate that completing individual difference measures at the beginning of an experimental session may act as an affirmation manipulation",
      },
      {
        id: "check",
        page: 3,
        excerpt:
          "A one- way ANCOVA confirmed that the self-affirmation group (M = 22.97, SD = 1.38) rated the value as significantly more important than did the control group (M = 15.13, SD = 3.69), F(1, 71) = 142.6, p,.001, g2 = .671, indicating success of the value- affirmation manipulation.",
      },
      {
        id: "regression",
        page: 4,
        excerpt:
          "Moreover, we observed a significant main effect for self-affirmation condition, (b = .31, t(72) = 2.88, p = .005), such that affirmed participants performed significantly better on the RAT task than control participants (Figure 1). Consistent with our self- affirmation stress buffering hypothesis, these main effects were qualified by a significant chronic stress 6 self-affirmation interaction on RAT problem-solving performance (b = .35, t(72) = 2.09, p = .041). As shown in Figure 1, self-affirmation (compared to the control condition) improved the RAT problem solving performance of underperforming high chronic stress individuals, but had a minimal impact on the performance of participants low in chronic stress.",
      },
      {
        id: "mediansplit",
        page: 5,
        excerpt:
          "Low and high stress groups (as measured by the Perceived Stress Scale) were determined by median split for visual presentation.",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Frame the question",
        title: "Name the outcome",
        prompt:
          "Every participant ends the session with the same timed task. What outcome does this study actually measure?",
        type: "single",
        options: options([
          "Problems solved",
          "Stress afterwards",
          "Course grades",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Look at what happens last in front of the evaluator, and what gets scored.",
        explanation:
          "The outcome is the number of difficult word-association problems solved correctly in one timed session. Stress was a questionnaire about the past month, not an outcome of the essay, and grades were never collected.",
        misconceptions: {
          B: "Stress was asked about, but as a background score for the past month, not as the outcome of the essay.",
          C: "No grades were collected. The task was a set of word puzzles in a lab session.",
        },
        reveal: "design",
        evidence: [
          "Participants wrote a short essay, then solved 30 difficult word-association problems under time pressure in front of an evaluator.",
        ],
        scene: null,
        refs: ["abstract"],
        writtenReasoning: false,
        responseStyle: "pills",
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Assigned or only measured?",
        prompt:
          "The researchers later ask whether the essay helps some people more than others. Tap the step that gives them a factor they measured rather than assigned.",
        type: "single",
        options: options([
          "Random assignment to an essay",
          "Ranking 11 values",
          "The timed problem set",
          "The questionnaire at the end",
        ]),
        accepted: ["D"],
        alternatives: [],
        hint: "Only one thing here was decided by chance. Which step records something people brought with them?",
        explanation:
          "The end-of-session questionnaire measured perceived stress over the past month. It was given last so it would not itself act as an affirmation. Because nobody was assigned a stress level, stress is a measured moderator. Its role can be described, but it does not carry the causal protection that random assignment gives the essay.",
        misconceptions: {
          A: "Random assignment decides the essay condition. That is the assigned factor, not a measured one.",
          B: "Everyone ranked the values. The ranking only chose which value each person wrote about.",
          C: "The problem set produces the outcome. It is not the factor used to ask who benefits.",
        },
        reveal: "design",
        evidence: [
          "Chronic stress was assessed with a 10-item questionnaire about the past month.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "One participant's session",
          instruction:
            "Follow the session from start to finish. Tap the step that supplies the measured factor.",
          description:
            "Participants are randomly assigned, rank values, write one of two essays, rate the value, solve timed problems, then complete questionnaires.",
          provenance: summary(["procedure", "abstract", "stressmeasure"]),
          nodes: [
            item(
              "assign",
              "Random assignment",
              "Each participant is assigned by chance to one of two essay conditions.",
              ["procedure"],
            ),
            item(
              "rank",
              "Rank 11 values",
              "Everyone orders values such as art, business, and friends/family by personal importance.",
              ["procedure"],
            ),
            item(
              "affirm",
              "Affirmation essay",
              "Write about your #1 value and why it is important to you.",
              ["procedure"],
              "setup",
              0,
            ),
            item(
              "control",
              "Control essay",
              "Write about your #9 value and why it might be important to others.",
              ["procedure"],
              "setup",
              1,
            ),
            item(
              "rate",
              "Rate the value",
              "Two quick items about the value just written about.",
              ["procedure"],
            ),
            item(
              "rat",
              "Timed problem set",
              "30 difficult word-association problems under time pressure, in front of an evaluator.",
              ["abstract"],
            ),
            item(
              "pss",
              "Questionnaire at the end",
              "Individual difference measures completed after the problem set.",
              ["stressmeasure"],
            ),
            item(
              "why-last",
              "Why last?",
              "Answering these first might itself act like an affirmation, so they came after the task.",
              ["stressmeasure"],
              "resolution",
            ),
          ],
          edges: [
            { from: "assign", to: "rank", label: "then", at: "setup" },
            { from: "rank", to: "affirm", label: "one group", at: "setup" },
            { from: "rank", to: "control", label: "other group", at: "setup" },
            { from: "affirm", to: "rate", label: "then", at: "setup" },
            { from: "control", to: "rate", label: "then", at: "setup" },
            { from: "rate", to: "rat", label: "then", at: "setup" },
            { from: "rat", to: "pss", label: "then", at: "setup" },
          ],
          responses: [
            { optionId: "A", label: "Assignment", targetIds: ["assign"] },
            { optionId: "B", label: "Value ranking", targetIds: ["rank"] },
            { optionId: "C", label: "Problem set", targetIds: ["rat"] },
            { optionId: "D", label: "End questionnaire", targetIds: ["pss"] },
          ],
          resolution: null,
        },
        refs: ["procedure", "abstract", "stressmeasure"],
        writtenReasoning: false,
        responseStyle: "tap",
      },
      {
        id: "q3",
        stage: "Read the design",
        title: "What does the check measure?",
        prompt:
          "Right after writing, everyone answered two items about the value they wrote about. What do these items measure most directly?",
        type: "single",
        options: options([
          "How important the written-about value is to the writer.",
          "How affirmed, secure, or unthreatened the writer feels.",
          "How stressed the writer feels right now.",
          "How much effort the writer put into the essay.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Read the two items word for word. What are they about: the value, or the person's state?",
        explanation:
          "Both items ask about the value itself: whether it has influenced your life and is part of who you are. Since affirmed writers chose their #1 value and control writers their #9 value, the check confirms the essays were about values of different importance. It does not ask whether anyone felt affirmed.",
        misconceptions: {
          B: "Neither item asks about feeling secure or affirmed. Both rate the value.",
          C: "Neither item mentions stress. Stress was measured separately at the end.",
          D: "Effort is not asked about. The items rate the value, not the writing.",
        },
        reveal: "design",
        evidence: [
          "Items: ‘This value has influenced my life’ and ‘This value is an important part of who I am’ (1 = Strongly Disagree to 6 = Strongly Agree).",
        ],
        scene: null,
        refs: ["procedure"],
        writtenReasoning: false,
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "A very large check result",
        prompt:
          "The two groups' ratings differ enormously, and the authors call this success of the value-affirmation manipulation. What has the check actually shown?",
        type: "single",
        options: options([
          "The groups wrote about values of very different personal importance, so the essay task was delivered as designed.",
          "Affirmed participants entered a state of felt affirmation, which explains their later problem solving.",
          "Because the check effect is so large, the effect on problem solving must be large too.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Connect the size of this gap to what the two items asked about in the previous challenge.",
        explanation:
          "A #1-ranked value will be rated as more important than a #9-ranked value almost by construction, so the large gap confirms the task was delivered. It does not show a felt sense of affirmation, and the size of a check effect says nothing about the size of the effect on the outcome.",
        misconceptions: {
          B: "The items rated the value, not the person's state. Felt affirmation was not measured, so it cannot be the demonstrated route.",
          C: "A manipulation check and an outcome are different measures. A large check effect does not size the outcome effect.",
        },
        reveal: "results",
        evidence: [
          "Affirmation essay: M = 22.97, SD = 1.38. Control essay: M = 15.13, SD = 3.69.",
          "F(1, 71) = 142.6, p < .001, η² = .671 (as reported).",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Rated importance of the written-about value",
          instruction:
            "Predict which group rated its value higher, then compare the two reported means.",
          description:
            "Mean manipulation-check ratings for the two essay conditions, as reported in the text.",
          provenance: reported(["check"]),
          measure: "Rated importance of the written-about value",
          unit: "rating points (scoring as reported)",
          min: 0,
          max: 25,
          values: [
            {
              id: "affirmed",
              label: "Affirmation essay",
              detail: "Wrote about their #1 value. M = 22.97, SD = 1.38.",
              at: "setup",
              provenance: reported(["check"]),
              value: 22.97,
            },
            {
              id: "control",
              label: "Control essay",
              detail: "Wrote about their #9 value. M = 15.13, SD = 3.69.",
              at: "setup",
              provenance: reported(["check"]),
              value: 15.13,
            },
          ],
          difference: {
            from: "control",
            to: "affirmed",
            label: "Gap in rated importance of the value",
            at: "feedback",
          },
          prediction: {
            label:
              "Which group rated its written-about value as more important?",
            options: ["Affirmation essay", "Control essay", "About the same"],
          },
          responses: [
            {
              optionId: "A",
              label: "Task delivered as designed",
              targetIds: ["affirmed", "control"],
            },
            {
              optionId: "B",
              label: "Felt affirmation explains it",
              targetIds: ["affirmed"],
            },
            {
              optionId: "C",
              label: "Big check, big outcome",
              targetIds: ["affirmed", "control"],
            },
          ],
          resolution: {
            id: "check-scope",
            label: "A check of delivery, not of experience",
            detail:
              "The items rate the value. They confirm which kind of value each group wrote about, not how affirmed anyone felt.",
            at: "resolution",
            provenance: summary(["procedure", "check"]),
          },
        },
        refs: ["check", "procedure"],
        writtenReasoning: false,
      },
      {
        id: "q5",
        stage: "Read the results",
        title: "Who did the essay help?",
        prompt:
          "The model predicted problems solved from essay condition, chronic stress, and their interaction. Which conclusion matches the full set of results?",
        type: "single",
        options: options([
          "The essay improved problem solving for everyone by about the same amount.",
          "The essay's benefit depended on stress: it helped people reporting high stress and did little for those reporting low stress.",
          "The interaction can be set aside because its p-value is larger than the main effect's.",
          "Stress made no difference. Only the essay condition mattered.",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "When an interaction is significant, the main effect is an average. Ask: an average over whom?",
        explanation:
          "The authors say the main effects were qualified by the interaction. Affirmation improved the scores of underperforming high-stress participants and had minimal impact on low-stress participants. The positive main effect is an average across both, so it should not be read as a uniform benefit.",
        misconceptions: {
          A: "The main effect is an average. The significant interaction says the benefit was not the same at every stress level.",
          C: "Both effects met the usual threshold. A larger p-value does not make an interaction ignorable, and here it changes how the main effect reads.",
          D: "The interaction is precisely a statement that stress changed the essay's effect.",
        },
        reveal: "results",
        evidence: [
          "Essay main effect: β = .31, t(72) = 2.88, p = .005.",
          "Stress × essay interaction: β = .35, t(72) = 2.09, p = .041.",
        ],
        scene: {
          version: 1,
          kind: "connections",
          title: "Two reported effects",
          instruction:
            "Read both reported effects together, then connect a conclusion to them.",
          description:
            "A main effect of essay condition and a stress by essay interaction, both from the same regression on problems solved.",
          provenance: summary(["regression"]),
          actionLabel: "Connect a conclusion",
          anchors: [
            item(
              "main",
              "Essay main effect",
              "Affirmed participants scored higher on average. β = .31, p = .005.",
              ["regression"],
            ),
            item(
              "interaction",
              "Stress × essay interaction",
              "The essay's effect differed with reported chronic stress. β = .35, p = .041.",
              ["regression"],
            ),
            item(
              "pattern",
              "Authors' description of the pattern",
              "Improved performance of underperforming high-stress individuals, minimal impact for those low in stress.",
              ["regression"],
              "feedback",
            ),
          ],
          responses: [
            {
              optionId: "A",
              label: "Same benefit for all",
              targetIds: ["main"],
            },
            {
              optionId: "B",
              label: "Benefit depends on stress",
              targetIds: ["main", "interaction"],
            },
            {
              optionId: "C",
              label: "Set the interaction aside",
              targetIds: ["main"],
            },
            {
              optionId: "D",
              label: "Stress irrelevant",
              targetIds: ["main"],
            },
          ],
          resolution: null,
        },
        refs: ["regression"],
        writtenReasoning: false,
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "Four bars, two kinds of student?",
        prompt:
          "A reader sees the paper's figure, with low- and high-stress groups in each condition, and concludes: 'There are two kinds of students, high-stress ones the essay helps and low-stress ones it does not.' What is the problem?",
        type: "single",
        options: options([
          "The low/high groups were cut at this sample's median only to draw the figure. The test treated stress as a continuous score, so the benefit grows with stress rather than switching on past a line.",
          "Nothing. The low- and high-stress groups were the groups randomly assigned in the analysis.",
          "The figure proves the essay harms low-stress students.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Compare how stress entered the statistical test with how it was grouped for the picture.",
        explanation:
          "The figure caption says low and high stress groups were made by median split for visual presentation. The tested interaction used stress as a continuous score. The median is just the middle of these 73 students, so 'high stress' here is relative to this sample and is not a clinical category. 'Minimal impact' for low-stress participants is not evidence of harm.",
        misconceptions: {
          B: "Only the essay was randomly assigned. Stress groups were formed afterwards from a measured score, and only for the figure.",
          C: "The authors describe a minimal impact for low-stress participants, not a harmful one.",
        },
        reveal: "interpretation",
        evidence: [
          "Figure caption: low and high stress groups were determined by median split for visual presentation.",
        ],
        scene: {
          version: 1,
          kind: "designs",
          title: "Same data, two treatments of stress",
          instruction:
            "Compare how stress is handled in the test and in the figure.",
          description:
            "The left panel shows the statistical test. The right panel shows how the figure groups people.",
          provenance: summary(["stressmeasure", "regression", "mediansplit"]),
          panels: [
            {
              id: "test",
              label: "Statistical test",
              steps: [
                item(
                  "score",
                  "Stress as a summed score",
                  "Ten questionnaire items summed into one chronic stress index per person.",
                  ["stressmeasure"],
                ),
                item(
                  "model",
                  "Regression with an interaction",
                  "Essay condition, stress, and essay × stress predict problems solved.",
                  ["regression"],
                ),
              ],
            },
            {
              id: "figure",
              label: "Figure",
              steps: [
                item(
                  "split",
                  "Cut at the median",
                  "People below the sample's middle stress score become 'low', those above become 'high'.",
                  ["mediansplit"],
                ),
                item(
                  "bars",
                  "Four bars",
                  "Each essay condition is shown separately for low and high stress groups.",
                  ["mediansplit"],
                ),
              ],
            },
          ],
          responses: [
            {
              optionId: "A",
              label: "Split only for display",
              targetIds: ["score", "model", "split"],
            },
            {
              optionId: "B",
              label: "Stress groups were assigned",
              targetIds: ["split", "bars"],
            },
            {
              optionId: "C",
              label: "Harm for low stress",
              targetIds: ["bars"],
            },
          ],
          resolution: {
            id: "relative",
            label: "'High' is relative to this sample",
            detail:
              "A median split divides these participants at their own middle score. It is a display choice, not a threshold the study tested.",
            at: "resolution",
            provenance: summary(["mediansplit"]),
          },
        },
        refs: ["mediansplit", "regression", "stressmeasure"],
        writtenReasoning: false,
      },
      {
        id: "q7",
        stage: "Draw a conclusion",
        title: "Write the headline",
        prompt:
          "A school newsletter wants to report this study. Which summary stays within the evidence?",
        type: "single",
        options: options([
          "A short values essay boosts students' problem solving in school.",
          "In one lab study of undergraduates working under evaluative pressure, a brief values essay went with better scores on hard word puzzles, mainly for those reporting more stress. Effects in school were not tested.",
          "The essay did not really work, because low-stress participants did not improve.",
          "The essay works by making people feel affirmed, as the manipulation check shows.",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "Check the summary against who took part, where they did the task, who benefited, and what the check measured.",
        explanation:
          "The design supports a causal claim about the essay for these undergraduates on this evaluative lab task, with the benefit concentrated among people reporting more chronic stress. The authors suggest implications for school settings, but no school outcome was measured. The authors themselves note the effect may be specific to evaluative settings.",
        misconceptions: {
          A: "This drops the moderation, the lab setting, and the evaluative pressure. School achievement was not measured.",
          C: "A moderated effect is still an effect. The benefit appeared where it was predicted, among more stressed participants.",
          D: "The check rated the importance of the value, not felt affirmation. The route from essay to performance was not shown.",
        },
        reveal: "interpretation",
        evidence: [
          "The abstract says the work may have important implications for academic achievement in school settings.",
          "All participants solved problems under time pressure in front of an evaluator.",
        ],
        scene: null,
        refs: ["abstract", "regression", "procedure"],
        writtenReasoning: false,
      },
    ],
    bonus: null,
  },
};
