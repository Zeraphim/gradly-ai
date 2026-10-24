import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody } from "../types.js";

const summary = (
  refs: string[],
  note = "Paraphrase of the cited passage.",
) => ({
  kind: "source-summary" as const,
  refs,
  note,
});
const reported = (
  refs: string[],
  note = "Value as reported in the paper.",
) => ({
  kind: "reported" as const,
  refs,
  note,
});
const illustration = (note: string) => ({
  kind: "illustration" as const,
  refs: [] as string[],
  note,
});
const authored = (refs: string[], note = "Authored teaching guidance.") => ({
  kind: "authored" as const,
  refs,
  note,
});
const item = (
  id: string,
  label: string,
  detail: string,
  provenance: SceneItem["provenance"],
  at: SceneItem["at"] = "setup",
  column?: number,
): SceneItem => ({
  id,
  label,
  detail,
  at,
  provenance,
  ...(column === undefined ? {} : { column }),
});
const resolution = (label: string, detail: string, refs: string[]): SceneItem =>
  item("resolution", label, detail, authored(refs), "resolution");

export const body: StudyBody = {
  lesson: {
    id: "prepared-learning-styles",
    title: "Teaching to Learning Styles",
    source: "featured",
    briefing:
      "A school team tests a popular classroom idea: that children learn best when lessons arrive in their preferred mode, by reading or by listening. You will work out what result would support the idea, read the design, then judge what the evidence can and cannot rule out.",
    paper: {
      title:
        "Providing Instruction Based on Students’ Learning Style Preferences Does Not Improve Learning",
      authors: "Beth A. Rogowsky, Barbara M. Calhoun and Paula Tallal (2020)",
      journal: "Frontiers in Psychology, 11, 164",
      url: "https://doi.org/10.3389/fpsyg.2020.00164",
      limitations: [
        "All students came from one rural Pennsylvania middle school, so the findings may not transfer to other populations.",
        "The key matching test used only the 34 students with a clear preference (12 auditory, 22 visual), below the 76 students the power analysis called for.",
        "Comprehension was always tested with written questions, which may favour stronger readers in both instruction modes.",
        "Only visual and auditory preferences, short passages and one session per mode were tested.",
      ],
    },
    evidence: [
      {
        id: "meshing",
        page: 2,
        excerpt:
          "For the meshing hypothesis to be supported, the data analysis must reveal (1) that learning is optimal when individuals receive instruction in their preferred learning style and (2) the instructional method that proves most effective for individuals with one learning style is not the most effective method for individuals with a different learning style.",
      },
      {
        id: "power",
        page: 3,
        excerpt:
          "A power analysis showed that for an 80% chance of detecting a moderate effect size (Cohen’s f) of 0.15, with three predictors in the model and a type-I error rate of 0.05, the minimum sample size should be 76 students.",
      },
      {
        id: "procedure",
        page: 4,
        excerpt:
          "For counterbalancing purposes, students were randomly assigned to one of four groups: two instructional modalities (auditory, visual) and two test forms (S and T). Each group received a different test form/modality combination on the first day and, in a crossover design, the opposite test form/modality on the second day. This counterbalanced the order of instruction across participants to mitigate order effects. On Day 3, students completed the learning style inventory.",
      },
      {
        id: "groups",
        page: 5,
        excerpt:
          "Participants were limited to those who had a strong auditory and indifferent or weak visual learning style (n = 12; 11%) and those who had a strong visual and indifferent or weak auditory learning style (n = 22; 21%). Seventy-three students (68%) had similar preferences for auditory and visual learning styles",
      },
      {
        id: "anova",
        page: 5,
        excerpt:
          "There was a significant main effect of learning styles (auditory vs. visual; F(1, 32) = 12.92; p = 0.001) with an effect size of η2 = 0.29, indicating that students in one learning style group (visual: M = 39.07, SE = 1.73) performed significantly better than those in the other learning style group (auditory, M = 28.58, SE = 2.35). There was not a significant main effect of instruction (F(1, 32) = 1.15, p = 0.29), nor an instruction by learning styles interaction (F(1, 38) = 1.16; p = 0.29).",
      },
      {
        id: "ci",
        page: 5,
        excerpt:
          "The 95% Confidence Interval for the L-AT ranged from 24.1 to 34.8 for students with an auditory learning style to 35.7–43.6 for students with a visual learning style. The 95% Confidence Interval for the R-AT ranged from 22.6 to 32.9 for students with an auditory learning style to 34.7–42.3 for students with a visual learning style.",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Frame the question",
        title: "What Would Count as Support?",
        prompt:
          "The idea says children learn best in their preferred mode. Which result pattern would actually support it?",
        type: "single",
        options: [
          { id: "A", text: "Visual learners score higher" },
          { id: "B", text: "Each group wins in its mode" },
          { id: "C", text: "Listening beats reading for all" },
        ],
        accepted: ["B"],
        alternatives: [],
        hint: "The claim is about a match. The best mode for one group should differ from the best mode for the other group.",
        explanation:
          "Matching predicts a crossover: visual learners do best when reading, auditory learners do best when listening. One group scoring higher overall, or one mode winning for everyone, can happen without any benefit from matching.",
        misconceptions: {
          A: "A group that scores higher in every mode shows a difference between groups, not a benefit from matching.",
          C: "If one mode is best for everyone, matching each child to a different mode would not help.",
        },
        reveal: "design",
        evidence: [
          "Matching is supported only if the best method for one style is not the best method for the other style.",
        ],
        scene: null,
        refs: ["meshing"],
        writtenReasoning: false,
        responseStyle: "pills",
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Assigned or Measured?",
        prompt:
          "Every student both read and listened to passages, and also filled in a learning-style survey. Tap the part of the study that the researchers randomly assigned.",
        type: "single",
        options: [
          {
            id: "A",
            text: "The order of reading and listening, and which test form went with each.",
          },
          { id: "B", text: "Each student’s learning-style survey score." },
          {
            id: "C",
            text: "Whether a student was labelled a visual or an auditory learner.",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "A researcher can decide what a student does on Day 1. Can a researcher decide what a student prefers?",
        explanation:
          "Instruction mode was varied within each student, with the order and test form randomly counterbalanced. Learning style was only measured on Day 3. That means style groups are not randomly formed, so any difference between them may reflect other traits, such as reading skill.",
        misconceptions: {
          B: "The survey score was measured, not assigned. Researchers cannot hand a child a preference.",
          C: "The visual or auditory label came from a scoring rule applied to the survey. It describes students, it was not assigned to them.",
        },
        reveal: "design",
        evidence: [
          "Days 1 and 2: each student read one test form and listened to the other, in counterbalanced order.",
          "Day 3: each student completed a learning-style inventory.",
        ],
        scene: {
          version: 1,
          kind: "designs",
          title: "Two factors, two origins",
          instruction:
            "Inspect both panels, then tap the step the researchers controlled by random assignment.",
          description:
            "One panel shows how instruction mode was delivered. The other shows how learning style was obtained.",
          provenance: summary(["procedure"]),
          panels: [
            {
              id: "mode",
              label: "Instruction mode",
              steps: [
                item(
                  "order",
                  "Random order and form",
                  "Students were randomly assigned to one of four mode and test-form combinations for Day 1.",
                  summary(["procedure"]),
                ),
                item(
                  "crossover",
                  "Crossover on Day 2",
                  "On Day 2 each student received the opposite mode with the other test form.",
                  summary(["procedure"]),
                ),
              ],
            },
            {
              id: "style",
              label: "Learning style",
              steps: [
                item(
                  "inventory",
                  "Survey on Day 3",
                  "Each student completed a learning-style inventory after both comprehension sessions.",
                  summary(["procedure"]),
                ),
                item(
                  "label",
                  "Visual or auditory label",
                  "Survey scores were turned into a visual or auditory classification by the inventory’s scoring rule.",
                  summary(["groups"]),
                ),
              ],
            },
          ],
          responses: [
            { optionId: "A", label: "Mode order", targetIds: ["order"] },
            { optionId: "B", label: "Survey score", targetIds: ["inventory"] },
            { optionId: "C", label: "Style label", targetIds: ["label"] },
          ],
          resolution: resolution(
            "Mode is assigned, style is measured",
            "Random assignment protects the comparison of reading against listening. It does not make the style groups comparable on anything else.",
            ["procedure"],
          ),
        },
        refs: ["procedure", "groups"],
        writtenReasoning: false,
        responseStyle: "tap",
      },
      {
        id: "q3",
        stage: "Read the design",
        title: "Who Enters the Key Test?",
        prompt:
          "The matching test compares only students with a clear visual or a clear auditory preference. Students who like both modes about equally are left out. Why does this matter for the power plan?",
        type: "single",
        options: [
          {
            id: "A",
            text: "The key test can end up with fewer students than the plan required, so a real matching effect would be easier to miss.",
          },
          {
            id: "B",
            text: "Leaving out mixed students makes the groups purer, so the test needs fewer students than planned.",
          },
          {
            id: "C",
            text: "It does not matter, because the power plan only applies if the result is significant.",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "The plan names a minimum number of students. Follow the arrows and ask how many students reach the last box.",
        explanation:
          "The power analysis asked for at least 76 students. Filtering down to clear-preference students shrinks the key test, and a smaller test has a lower chance of detecting a real but modest effect. Cleaner groups do not cancel that loss, and power matters most when a result is not significant.",
        misconceptions: {
          B: "Cleaner groups may sharpen the contrast, but they do not lower the sample size a power plan requires.",
          C: "Power is about the chance of detecting an effect that exists. It matters most when nothing is detected.",
        },
        reveal: "design",
        evidence: [
          "Power plan: at least 76 students for an 80% chance of detecting the target effect.",
          "Only students with a clear visual or auditory preference enter the matching test.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "From classroom to key test",
          instruction:
            "Follow the students from the survey to the matching test. Compare the last box with the power plan.",
          description:
            "Survey results split students into three branches. Only two branches continue to the matching test.",
          provenance: summary(["power", "groups"]),
          nodes: [
            item(
              "surveyed",
              "Students with survey and test scores",
              "Every student read and listened, then completed the learning-style survey.",
              summary(["procedure"]),
              "setup",
              1,
            ),
            item(
              "visual",
              "Clear visual preference",
              "Strong visual and indifferent or weak auditory preference.",
              summary(["groups"]),
              "setup",
              0,
            ),
            item(
              "similar",
              "Similar preferences",
              "Auditory and visual preferences about equal.",
              summary(["groups"]),
              "setup",
              1,
            ),
            item(
              "auditory",
              "Clear auditory preference",
              "Strong auditory and indifferent or weak visual preference.",
              summary(["groups"]),
              "setup",
              2,
            ),
            item(
              "keytest",
              "Matching test",
              "Compares the two clear-preference groups on reading and listening scores.",
              summary(["groups"]),
              "setup",
              1,
            ),
            item(
              "plan",
              "Power plan: 76 students",
              "Minimum sample for an 80% chance of detecting the target effect size.",
              reported(["power"]),
              "setup",
              2,
            ),
          ],
          edges: [
            {
              from: "surveyed",
              to: "visual",
              label: "Clear visual",
              at: "setup",
            },
            {
              from: "surveyed",
              to: "similar",
              label: "No clear style",
              at: "setup",
            },
            {
              from: "surveyed",
              to: "auditory",
              label: "Clear auditory",
              at: "setup",
            },
            { from: "visual", to: "keytest", label: "Included", at: "setup" },
            { from: "auditory", to: "keytest", label: "Included", at: "setup" },
            { from: "plan", to: "keytest", label: "Planned size", at: "setup" },
          ],
          responses: [
            {
              optionId: "A",
              label: "Fewer than planned",
              targetIds: ["keytest", "plan"],
            },
            {
              optionId: "B",
              label: "Purer groups",
              targetIds: ["visual", "auditory"],
            },
            { optionId: "C", label: "Power irrelevant", targetIds: ["plan"] },
          ],
          resolution: resolution(
            "The filter sets the sample size",
            "The key test can only be as large as the two clear-preference branches. Check that number against the plan once results arrive.",
            ["power", "groups"],
          ),
        },
        refs: ["power", "groups", "procedure"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "Look for the Crossover",
        prompt:
          "Here are the 95% confidence intervals for each style group in each mode. Which pattern do they show?",
        type: "single",
        options: [
          {
            id: "A",
            text: "A crossover: visual learners do best reading and auditory learners do best listening.",
          },
          {
            id: "B",
            text: "No crossover: the visual group sits higher in both modes, and both groups sit slightly higher for listening.",
          },
          {
            id: "C",
            text: "The auditory group scores above the visual group when listening.",
          },
        ],
        accepted: ["B"],
        alternatives: [],
        hint: "Compare each group with itself across the two modes, then compare the two groups within one mode.",
        explanation:
          "Both groups’ listening intervals sit a little above their reading intervals, so listening was not the best mode for one group and reading for the other. The visual group’s intervals sit above the auditory group’s in both modes. That is a gap between groups, not a crossover.",
        misconceptions: {
          A: "The visual group’s reading interval sits slightly below its own listening interval, so reading was not its best mode.",
          C: "The auditory group’s listening interval tops out at 34.8, below the visual group’s lower bound of 35.7.",
        },
        reveal: "results",
        evidence: [
          "Listening, auditory group: 95% CI 24.1 to 34.8. Visual group: 35.7 to 43.6.",
          "Reading, auditory group: 95% CI 22.6 to 32.9. Visual group: 34.7 to 42.3.",
          "Matching test sample: 12 auditory and 22 visual students.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Four intervals, two modes",
          instruction:
            "Make a prediction, then compare each group across reading and listening.",
          description:
            "95% confidence intervals for comprehension score, by learning-style group and instruction mode.",
          provenance: reported(
            ["ci", "anova"],
            "Interval bounds are reported in the figure caption. The paper prints no cell means, so each centre is the interval midpoint.",
          ),
          measure: "Comprehension score",
          min: 15,
          max: 50,
          reference: {
            value: 39.07,
            label: "Visual-group mean across both tests",
          },
          band: null,
          estimates: [
            {
              ...item(
                "aud-listen",
                "Auditory group, listening",
                "12 students. Interval as reported. Centre is the midpoint.",
                {
                  kind: "derived",
                  refs: ["ci", "groups"],
                  note: "Bounds reported. Centre is the midpoint of the reported 95% interval.",
                },
              ),
              value: 29.45,
              lower: 24.1,
              upper: 34.8,
            },
            {
              ...item(
                "aud-read",
                "Auditory group, reading",
                "12 students. Interval as reported. Centre is the midpoint.",
                {
                  kind: "derived",
                  refs: ["ci", "groups"],
                  note: "Bounds reported. Centre is the midpoint of the reported 95% interval.",
                },
              ),
              value: 27.75,
              lower: 22.6,
              upper: 32.9,
            },
            {
              ...item(
                "vis-listen",
                "Visual group, listening",
                "22 students. Interval as reported. Centre is the midpoint.",
                {
                  kind: "derived",
                  refs: ["ci", "groups"],
                  note: "Bounds reported. Centre is the midpoint of the reported 95% interval.",
                },
              ),
              value: 39.65,
              lower: 35.7,
              upper: 43.6,
            },
            {
              ...item(
                "vis-read",
                "Visual group, reading",
                "22 students. Interval as reported. Centre is the midpoint.",
                {
                  kind: "derived",
                  refs: ["ci", "groups"],
                  note: "Bounds reported. Centre is the midpoint of the reported 95% interval.",
                },
              ),
              value: 38.5,
              lower: 34.7,
              upper: 42.3,
            },
          ],
          prediction: {
            label: "Will each group score highest in its own preferred mode?",
            options: ["Yes, a crossover", "No crossover", "Too close to tell"],
          },
          responses: [
            {
              optionId: "A",
              label: "Crossover",
              targetIds: ["vis-read", "aud-listen"],
            },
            {
              optionId: "B",
              label: "Parallel gap",
              targetIds: ["vis-listen", "vis-read", "aud-listen", "aud-read"],
            },
            {
              optionId: "C",
              label: "Auditory ahead listening",
              targetIds: ["aud-listen", "vis-listen"],
            },
          ],
          resolution: resolution(
            "Parallel, not crossed",
            "The two groups move in the same direction across modes. Matching needed them to move in opposite directions.",
            ["ci", "meshing"],
          ),
        },
        refs: ["ci", "anova", "groups"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q5",
        stage: "Read the results",
        title: "A Big Gap, but Which Kind?",
        prompt:
          "Across both tests, visual-preference students averaged clearly higher than auditory-preference students, a significant difference. Does this support teaching to learning styles?",
        type: "single",
        options: [
          {
            id: "A",
            text: "Yes. Visual learners clearly learn better, which is what the learning-styles idea predicts.",
          },
          {
            id: "B",
            text: "No. A group that scores higher in both modes is a main effect of group, not evidence that matching the mode helps.",
          },
          {
            id: "C",
            text: "Yes. The effect is large, and a large effect confirms the theory.",
          },
        ],
        accepted: ["B"],
        alternatives: [],
        hint: "Return to the pattern you said would support matching. Does this gap depend on the instruction mode?",
        explanation:
          "The visual group scored higher whether they read or listened, so the gap does not depend on mode. Matching needs the best mode to differ by group. Because style was measured, not assigned, the gap may also reflect something else, such as reading skill. The authors suggest an auditory preference may reflect reading difficulty.",
        misconceptions: {
          A: "The idea predicts that each group does best in its own mode, not that one group does better everywhere.",
          C: "Effect size tells you how large a difference is, not whether it is the difference the theory predicts.",
        },
        reveal: "results",
        evidence: [
          "Visual group: M = 39.07, SE = 1.73. Auditory group: M = 28.58, SE = 2.35.",
          "Main effect of learning style: F(1, 32) = 12.92, p = 0.001, η2 = 0.29.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Average across both tests",
          instruction: "Predict the gap, then reveal the two group averages.",
          description:
            "Mean comprehension score for each learning-style group, combining reading and listening.",
          provenance: reported(["anova"]),
          measure: "Mean comprehension score, both tests combined",
          unit: "points",
          min: 0,
          max: 50,
          values: [
            {
              ...item(
                "visual-mean",
                "Visual preference",
                "M = 39.07, SE = 1.73, 22 students.",
                reported(["anova", "groups"]),
              ),
              value: 39.07,
            },
            {
              ...item(
                "auditory-mean",
                "Auditory preference",
                "M = 28.58, SE = 2.35, 12 students.",
                reported(["anova", "groups"]),
              ),
              value: 28.58,
            },
          ],
          difference: {
            from: "auditory-mean",
            to: "visual-mean",
            label: "Visual group higher, in both modes alike",
            at: "feedback",
          },
          prediction: {
            label: "How large will the gap between the groups be?",
            options: ["Under 5 points", "5 to 15 points", "Over 15 points"],
          },
          responses: [
            {
              optionId: "A",
              label: "Supports styles",
              targetIds: ["visual-mean"],
            },
            {
              optionId: "B",
              label: "Group effect only",
              targetIds: ["visual-mean", "auditory-mean"],
            },
            {
              optionId: "C",
              label: "Large means confirmed",
              targetIds: ["visual-mean", "auditory-mean"],
            },
          ],
          resolution: resolution(
            "A gap is not a match",
            "This difference holds in both modes, so it cannot show that matching the mode helps.",
            ["anova", "meshing"],
          ),
        },
        refs: ["anova", "groups", "meshing"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "What Does Non-Significant Mean Here?",
        prompt:
          "The test of matching (the style by mode interaction) gave p = 0.29. It used 34 students, 12 of them auditory. Which conclusion is defensible?",
        type: "single",
        options: [
          {
            id: "A",
            text: "Matching instruction to learning style has been shown to have zero effect for children.",
          },
          {
            id: "B",
            text: "This sample shows no sign of a matching benefit, but the test was smaller than planned, so a modest benefit is not ruled out.",
          },
          {
            id: "C",
            text: "Matching probably works, and the study simply hid it.",
          },
          {
            id: "D",
            text: "Visual learners scored higher, so teachers should present everything visually.",
          },
        ],
        accepted: ["B"],
        alternatives: [],
        hint: "Separate two claims: we did not find an effect, and we showed there is no effect. Which one does a small non-significant test support?",
        explanation:
          "A non-significant result is absence of evidence, not evidence of absence. The pattern did not lean toward a crossover, so the study gives no support for matching. But the 34-student test was below the planned 76, and no interval for the matching effect itself was reported, so a modest benefit cannot be excluded. The paper’s own discussion phrases the null more strongly than this test alone can support.",
        misconceptions: {
          A: "A p-value above .05 does not show an effect is zero, especially with 12 students in one group.",
          C: "The data leaned away from a crossover. A small test is not evidence that a hidden effect exists.",
          D: "The visual group did better in both modes, and style was measured, not assigned. That does not recommend a mode for anyone.",
        },
        reveal: "interpretation",
        evidence: [
          "Interaction of style and mode: F(1, 38) = 1.16, p = 0.29.",
          "Planned minimum sample: 76. Matching test: 22 visual and 12 auditory students.",
          "68% of students had no clear visual or auditory preference and were left out.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "Plan against reality",
          instruction:
            "Compare the planned sample with the students who reached the matching test.",
          description:
            "The power plan, the two clear-preference groups and the matching test result.",
          provenance: reported(["power", "groups", "anova"]),
          nodes: [
            item(
              "plan2",
              "Planned: 76 students",
              "Minimum for an 80% chance of detecting the target effect.",
              reported(["power"]),
              "setup",
              0,
            ),
            item(
              "vis22",
              "Clear visual: 22",
              "Strong visual and indifferent or weak auditory preference.",
              reported(["groups"]),
              "setup",
              1,
            ),
            item(
              "aud12",
              "Clear auditory: 12",
              "Strong auditory and indifferent or weak visual preference.",
              reported(["groups"]),
              "setup",
              2,
            ),
            item(
              "result",
              "Matching test: p = 0.29",
              "Interaction of learning style and instruction mode, F(1, 38) = 1.16.",
              reported(["anova"]),
              "setup",
              1,
            ),
          ],
          edges: [
            { from: "plan2", to: "result", label: "Planned size", at: "setup" },
            { from: "vis22", to: "result", label: "Tested", at: "setup" },
            { from: "aud12", to: "result", label: "Tested", at: "setup" },
          ],
          responses: [
            {
              optionId: "A",
              label: "Zero effect shown",
              targetIds: ["result"],
            },
            {
              optionId: "B",
              label: "Not detected",
              targetIds: ["result", "plan2", "aud12"],
            },
            { optionId: "C", label: "Hidden effect", targetIds: ["result"] },
            { optionId: "D", label: "Teach visually", targetIds: ["vis22"] },
          ],
          resolution: resolution(
            "No support, not proof of zero",
            "The study adds to evidence against matching without settling it alone. A larger test, or an interval for the matching effect, would be needed to rule out a modest benefit.",
            ["power", "groups", "anova"],
          ),
        },
        refs: ["anova", "power", "groups"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
    ],
    bonus: {
      id: "bonus",
      stage: "Check the report",
      title: "Do the Numbers Add Up?",
      prompt:
        "The matching test reports F(1, 38), yet only 34 students were in that analysis, and the style effect in the same model reports F(1, 32). What should a careful reader do?",
      type: "single",
      options: [
        {
          id: "A",
          text: "Ignore it. Degrees of freedom are a formatting detail.",
        },
        {
          id: "B",
          text: "Flag it as a likely reporting error and treat the exact test value with some caution, since 34 students should give 32 error degrees of freedom.",
        },
        {
          id: "C",
          text: "Conclude the whole study is invalid.",
        },
      ],
      accepted: ["B"],
      alternatives: [],
      hint: "With two groups and 34 students, how many error degrees of freedom should every test in this model have?",
      explanation:
        "In a two-group mixed design with 34 students, each test should have 32 error degrees of freedom, as the style effect does. The 38 is probably a typo, and it changes the p-value only slightly here, but it is worth checking with the authors before relying on the exact value.",
      misconceptions: {
        A: "Degrees of freedom show how many observations a test used. A mismatch can reveal a reporting or analysis error.",
        C: "One inconsistent number calls for checking, not for discarding the design, the procedure or the other results.",
      },
      reveal: "bonus",
      evidence: [
        "Style: F(1, 32) = 12.92. Mode: F(1, 32) = 1.15. Interaction: F(1, 38) = 1.16.",
        "Matching test sample: 34 students.",
      ],
      scene: null,
      refs: ["anova", "groups"],
      writtenReasoning: false,
      responseStyle: "cards",
    },
  },
  takeaway:
    "Among the 34 fifth graders with a clear visual or auditory preference, there was no sign that teaching in the preferred mode helped: both groups did slightly better listening, and visual-preference students scored higher on both tests. The matching test was smaller than planned, so it shows no detectable benefit rather than proof of zero benefit.",
};
