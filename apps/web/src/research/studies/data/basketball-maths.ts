import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody } from "../types.js";

const summary = (refs: string[]) => ({
  kind: "source-summary" as const,
  refs,
  note: "Authored paraphrase of the study report, not a verbatim quotation.",
});
const reported = (refs: string[]) => ({
  kind: "reported" as const,
  refs,
  note: "Value as reported in the study's table or text.",
});
const derived = (refs: string[], note: string) => ({
  kind: "derived" as const,
  refs,
  note,
});
const illustration = {
  kind: "illustration" as const,
  refs: [] as string[],
  note: "Teaching diagram. Shapes are concepts, not participant records or group counts.",
};
const step = (
  id: string,
  label: string,
  detail: string,
  refs: string[],
  at: SceneItem["at"] = "setup",
): SceneItem => ({ id, label, detail, at, provenance: summary(refs) });
const resolution = (
  label: string,
  detail: string,
  refs: string[],
): SceneItem => ({
  ...step("resolution", label, detail, refs),
  at: "resolution",
});
const options = (texts: string[]) =>
  texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));

export const body: StudyBody = {
  takeaway:
    'Over six weeks, intrinsic motivation for classroom maths stayed flat in the basketball-maths classes (2.53 to 2.52) and fell in the basketball-only classes (2.68 to 2.44), so the group difference reflects a decline that did not happen, not a rise. About 39% of enrolled children were left out of that analysis and classes, not children, were assigned, so treat "improves" as a weak claim.',
  lesson: {
    id: "study-basketball-maths",
    title: "Maths on the Court",
    source: "featured",
    briefing:
      "Researchers worked with whole primary-school classes during their weekly PE lessons for several weeks and asked children about their motivation for maths. You will work out how the groups were formed, what was measured and who was left out before seeing any results. Then you will judge how far the headline claim can go.",
    paper: {
      title:
        "Six Weeks of Basketball Combined With Mathematics in Physical Education Classes Can Improve Children's Motivation for Mathematics",
      authors:
        "Jacob Wienecke, Jesper Hauge, Glen Nielsen, Kristian Mouritzen and Linn Damsgaard (2021)",
      journal: "Frontiers in Psychology, 12, 636578",
      url: "https://doi.org/10.3389/fpsyg.2021.636578",
      limitations: [
        "The basketball-maths group's motivation did not rise. The between-group effect comes from the basketball-only group's decline, and that group also started higher.",
        "Of 757 enrolled children, 459 were in the motivation analysis. Only complete cases were analysed, so about 39% were left out.",
        "Whole classes were randomised, but the reported model adjusted for school and grade level rather than class, so the precision of the group comparison may be overstated.",
        "Six weeks of a new activity led by visiting researchers, with self-reported motivation only, no maths achievement measure and no longer follow-up.",
      ],
    },
    evidence: [
      {
        id: "sample",
        page: 3,
        excerpt:
          "In total, 757 students took part in this school-based study after obtaining written consent from parents, corresponding to 78.60% of the invited children. All students were recruited from five Danish elementary schools from within and outside the Copenhagen area. The included children came from 40 different classes at different grade levels; elementary school (1st to 3rd grade) and middle school (4th to 5th grade) (see Table 1). 125 participants were absent at tests days and were excluded. 207 participants were excluded from the analysis of the Academic Self-Regulation Questionnaire (SRQ-A) and 92 participants from the analysis of the Post-Experimental Intrinsic Motivation Inventory (IMI) due to incomplete data (see flow diagram, Figure 1). In total, the statistical analysis was made upon 459 participants for the SRQ-A questionnaire and 248 for the IMI questionnaire. At every school, the classes were randomly selected to have either BM or CON with just regular basketball",
      },
      {
        id: "intervention",
        page: 4,
        excerpt:
          "The 374 students in the intervention group received teaching in basketball combined with mathematics built into the exercises (BM) once a week over a coherent 6 week period. Each lesson had a duration of 90 min including time to change into sportswear. That allowed ∼70 min of isolated time to focus on the exercises with basketball combined with mathematics. The control group (CON), which consisted of 383 students, received the same amount of teaching in basketball without any kind of mathematics built into the exercises. In both groups (CON and BM), the lessons were planned and ran by external trained researchers, specially recruited and educated for this project, but supported by and in cooperation with the class’ normal teacher.",
      },
      {
        id: "timing",
        page: 4,
        excerpt:
          "For all participating school classes in both CON and BM, children’s motivation for mathematics was measured using the Academic Self-Regulation Questionnaire (SRQ-A). The questionnaire was filled in during a CM lesson 1 week before the 6 weeks intervention (T0) and 1 week after the last lesson of",
      },
      {
        id: "analysis",
        page: 6,
        excerpt:
          "To account for the cluster structure and the repeated measures in the data, “subjects,” “school,” and “grade-level” were added as fixed effects.",
      },
      {
        id: "interaction",
        page: 7,
        excerpt:
          "Further analyses showed a significant decrease in means of intrinsic motivation from T0 to T1 for CON [-9.38%, p < 0.001 but not for BM (+0.39%, p = 0.98)], see Figure 4, Table 3. A significant interaction was found for BM compared to CON from T0–T1 (p = 0.006) for intrinsic motivation, meaning that BM had a more positive influence on children’s intrinsic motivation for classroom-based mathematics compared to CON. No differences were seen between the intervention and control groups in changes in any of the extrinsic types of motivation for mathematics, where both groups showed insignificant declines.",
      },
      {
        id: "means",
        page: 8,
        excerpt:
          "TABLE 3 | Motivation score from SRQ-A questionnaire from T0 and T1 for classroom-based mathematics for the two intervention groups (CON and BM). Motivation measures External regulation Introjected regulation Identified regulation Intrinsic motivation T0 T1 % Diff T0 T1 % Diff T0 T1 % Diff T0 T1 % Diff CON 2.19 ± 0.54 2.0 ± 0.59 −9.07 2.00 ± 0.57 1.90 ± 0.58 −5.13 3.0 ± 0.63 2.74 ± 0.73 −9.06 2.68 ± 0.71 2.44 ± 0.71*# −9.38 BM 2.29 ± 0.63 2.22 ± 0.61 −3.10 2.05 ± 0.63 1.96 ± 0.61 −4.49 3.04 ± 0.63 2.83 ± 0.73 −7.16 2.53 ± 0.72 2.52 ± 0.74 −0.39",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Frame the question",
        title: "Pin down the outcome",
        prompt:
          "Children filled in a motivation questionnaire before and after the programme. Which kind of motivation did it ask about?",
        type: "single",
        responseStyle: "pills",
        options: options([
          "Motivation for classroom maths",
          "Enjoyment of basketball",
          "Maths test scores",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Notice where and when the questionnaire was filled in.",
        explanation:
          "The questionnaire asked about motivation for mathematics and was completed during an ordinary maths lesson, before and after the programme. It did not measure basketball enjoyment as the main outcome, and the study did not test maths achievement at all.",
        misconceptions: {
          B: "Enjoying basketball is not the same outcome as motivation for maths in the classroom.",
          C: "No maths test was given. A motivation questionnaire measures how children feel, not what they can do.",
        },
        reveal: "design",
        evidence: [
          "The questionnaire was answered during a classroom maths lesson, one week before and one week after the programme.",
        ],
        scene: null,
        refs: ["timing"],
        writtenReasoning: false,
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Find the one planned difference",
        prompt:
          "Both groups had extra basketball in PE. Tap the one ingredient that was planned to differ between the two groups.",
        type: "single",
        responseStyle: "tap",
        options: options([
          "Which schools the classes came from",
          "How often and how long the PE sessions ran",
          "Whether maths tasks were built into the drills",
          "The questionnaire used before and after",
        ]),
        accepted: ["C"],
        alternatives: [],
        hint: "Compare the two columns step by step. Which step changes its wording?",
        explanation:
          "Both groups came from the same schools, had the same amount of weekly basketball run by trained researchers, and answered the same questionnaire. Only the maths content differed. So the comparison is basketball-with-maths versus basketball-only, not active lessons versus ordinary lessons.",
        misconceptions: {
          A: "Classes in every school were split between the two groups, so school was shared, not a difference.",
          B: "The control group received the same amount of basketball teaching.",
          D: "Both groups answered the same motivation questionnaire at the same two points.",
        },
        reveal: "design",
        evidence: [
          "Control classes received the same amount of basketball teaching without maths.",
          "In both groups, external trained researchers planned and ran the lessons.",
        ],
        scene: {
          version: 1,
          kind: "designs",
          title: "Two ways to spend PE",
          instruction:
            "Read both columns. Tap the step that marks the planned difference.",
          description:
            "Each column follows one group of classes from the school through the weekly sessions to the questionnaire.",
          provenance: summary(["sample", "intervention", "timing"]),
          panels: [
            {
              id: "bm",
              label: "Basketball + maths",
              steps: [
                step(
                  "bm-school",
                  "Classes from the five schools",
                  "At every school, some classes were assigned to this group.",
                  ["sample"],
                ),
                step(
                  "bm-weekly",
                  "Weekly PE session",
                  "Once a week for six weeks, 90 minutes including changing time, run by trained researchers.",
                  ["intervention"],
                ),
                step(
                  "bm-maths",
                  "Maths inside the drills",
                  "Exercises had mathematics built in, matched to each class's level.",
                  ["intervention"],
                ),
                step(
                  "bm-survey",
                  "Maths motivation questionnaire",
                  "Answered in a maths lesson before and after the six weeks.",
                  ["timing"],
                ),
              ],
            },
            {
              id: "con",
              label: "Basketball only",
              steps: [
                step(
                  "con-school",
                  "Classes from the five schools",
                  "At every school, the other classes were assigned to this group.",
                  ["sample"],
                ),
                step(
                  "con-weekly",
                  "Weekly PE session",
                  "The same amount of basketball teaching, run by trained researchers.",
                  ["intervention"],
                ),
                step(
                  "con-plain",
                  "Drills without maths",
                  "Basketball exercises with no mathematics built in.",
                  ["intervention"],
                ),
                step(
                  "con-survey",
                  "Maths motivation questionnaire",
                  "Answered in a maths lesson before and after the six weeks.",
                  ["timing"],
                ),
              ],
            },
          ],
          responses: [
            { optionId: "A", label: "Schools", targetIds: ["bm-school"] },
            {
              optionId: "B",
              label: "Session amount",
              targetIds: ["bm-weekly"],
            },
            { optionId: "C", label: "Maths content", targetIds: ["bm-maths"] },
            {
              optionId: "D",
              label: "Questionnaire",
              targetIds: ["con-survey"],
            },
          ],
          resolution: resolution(
            "An active control group",
            "Both groups got new basketball sessions from visiting researchers. The comparison isolates adding maths to the drills, not being active versus sitting still.",
            ["intervention"],
          ),
        },
        refs: ["intervention", "sample", "timing"],
        writtenReasoning: false,
      },
      {
        id: "q3",
        stage: "Read the design",
        title: "Who was randomised?",
        prompt:
          "Whole classes, not individual children, were assigned to a group. Why does that matter when analysing the children's answers?",
        type: "single",
        options: options([
          "Children in the same class share a teacher, a room and a mood, so their answers are not independent. The class should be treated as a unit in the analysis.",
          "With hundreds of children, how they were grouped makes no difference to the analysis.",
          "Assigning whole classes guarantees the two groups start with equal motivation.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Would two children from the same class be more alike than two children from different classes?",
        explanation:
          "Classmates share experiences, so their answers move together. With 40 classes, the effective sample is closer to the number of classes than to the number of children. The reported model listed subjects, school and grade level, but not class, which can make the group difference look more precise than it is.",
        misconceptions: {
          B: "Many children inside a few clusters carry less independent information than the same number of children each assigned separately.",
          C: "Random assignment balances groups on average across many repeats. One draw of a few dozen classes can still leave the groups different at the start.",
        },
        reveal: "design",
        evidence: [
          "Children came from 40 classes in five schools.",
          "At every school, classes were randomly assigned to one of the two groups.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "From schools to children",
          instruction:
            "Follow the arrows. Find the level at which the coin was tossed.",
          description:
            "Schools contain classes, classes are assigned to a group, and children inside each class answer the questionnaire.",
          provenance: summary(["sample"]),
          nodes: [
            {
              ...step(
                "schools",
                "Five schools",
                "Schools inside and outside the Copenhagen area.",
                ["sample"],
              ),
              column: 0,
            },
            {
              ...step(
                "classes",
                "40 classes",
                "Classes from first to fifth grade.",
                ["sample"],
              ),
              column: 1,
            },
            {
              ...step(
                "bm-classes",
                "Basketball + maths classes",
                "Classes randomly selected for maths in the drills.",
                ["sample"],
              ),
              column: 2,
            },
            {
              ...step(
                "con-classes",
                "Basketball-only classes",
                "Classes randomly selected for basketball without maths.",
                ["sample"],
              ),
              column: 2,
            },
            {
              ...step(
                "children",
                "Children answer",
                "Each child fills in the questionnaire with classmates.",
                ["sample", "timing"],
              ),
              column: 3,
            },
            {
              ...step(
                "model",
                "What the model adjusted for",
                "Subjects, school and grade level were added to the model. Class was not listed.",
                ["analysis"],
                "feedback",
              ),
              column: 4,
            },
          ],
          edges: [
            { from: "schools", to: "classes", label: "contain", at: "setup" },
            {
              from: "classes",
              to: "bm-classes",
              label: "assigned",
              at: "setup",
            },
            {
              from: "classes",
              to: "con-classes",
              label: "assigned",
              at: "setup",
            },
            {
              from: "bm-classes",
              to: "children",
              label: "contain",
              at: "setup",
            },
            {
              from: "con-classes",
              to: "children",
              label: "contain",
              at: "setup",
            },
            {
              from: "children",
              to: "model",
              label: "analysed",
              at: "feedback",
            },
          ],
          responses: [
            {
              optionId: "A",
              label: "Classmates are linked",
              targetIds: ["bm-classes", "con-classes", "children"],
            },
            {
              optionId: "B",
              label: "Size makes grouping irrelevant",
              targetIds: ["children"],
            },
            {
              optionId: "C",
              label: "Equal start guaranteed",
              targetIds: ["classes"],
            },
          ],
          resolution: resolution(
            "Randomised classes, analysed children",
            "The unit that was randomised was the class. An analysis that treats every child as independent can understate uncertainty.",
            ["sample", "analysis"],
          ),
        },
        refs: ["sample", "analysis", "timing"],
        writtenReasoning: false,
      },
      {
        id: "q4",
        stage: "Read the design",
        title: "Who made it to the analysis?",
        prompt:
          "Only children with complete questionnaires at both time points were analysed. Why is that a concern?",
        type: "single",
        options: options([
          "Children who missed a test day or skipped questions may differ in motivation, and if the losses differ between groups, the comparison can be biased.",
          "Losing children only makes the estimate less precise. It cannot push the result in either direction.",
          "Because classes were randomised at the start, later exclusions cannot affect the comparison.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Randomisation protects the groups as they were formed. Does it still hold for whoever is left at the end?",
        explanation:
          "Of 757 enrolled children, 459 were in the motivation analysis, so about 39% were left out. Missing a test day or leaving items blank is unlikely to be random with respect to motivation. Exclusions after randomisation can bias the comparison, not only reduce precision.",
        misconceptions: {
          B: "If the children who drop out differ from those who stay, the remaining groups can be unbalanced, which biases the comparison.",
          C: "Randomisation balances the groups at the start. Excluding children afterwards can undo that balance.",
        },
        reveal: "design",
        evidence: [
          "757 children enrolled.",
          "125 were absent on test days and 207 had incomplete motivation questionnaires.",
          "459 children were in the motivation analysis.",
        ],
        scene: {
          version: 1,
          kind: "timeline",
          title: "Six weeks, start to finish",
          instruction:
            "Follow the sample along the time line. Watch how many children reach the analysis.",
          description:
            "Enrolment, the first questionnaire, six weekly sessions, the second questionnaire and the analysis, in order.",
          provenance: summary(["sample", "intervention", "timing"]),
          events: [
            {
              ...step(
                "enrolled",
                "Enrolled",
                "Children whose parents gave written consent.",
                ["sample"],
              ),
              when: "Start",
              n: 757,
            },
            {
              ...step(
                "t0",
                "First questionnaire (T0)",
                "Motivation for maths, answered in a maths lesson.",
                ["timing"],
              ),
              when: "1 week before",
            },
            {
              ...step(
                "sessions",
                "Weekly PE sessions",
                "One 90-minute session a week, with or without maths in the drills.",
                ["intervention"],
              ),
              when: "Weeks 1–6",
            },
            {
              ...step(
                "t1",
                "Second questionnaire (T1)",
                "The same questionnaire, again in a maths lesson.",
                ["timing"],
              ),
              when: "1 week after",
            },
            {
              ...step(
                "analysed",
                "Complete cases analysed",
                "125 children were absent on test days and 207 had incomplete questionnaires.",
                ["sample"],
              ),
              when: "Analysis",
              n: 459,
            },
            {
              id: "left-out",
              label: "About 39% left out",
              detail:
                "757 − 459 = 298 enrolled children were not in the motivation analysis.",
              at: "feedback",
              provenance: derived(
                ["sample"],
                "Calculated from the reported enrolled and analysed counts.",
              ),
              when: "Analysis",
            },
          ],
          responses: [
            {
              optionId: "A",
              label: "Losses may bias",
              targetIds: ["enrolled", "analysed"],
            },
            {
              optionId: "B",
              label: "Only less precise",
              targetIds: ["analysed"],
            },
            {
              optionId: "C",
              label: "Randomisation protects",
              targetIds: ["enrolled"],
            },
          ],
          resolution: resolution(
            "Randomised at the start, filtered at the end",
            "Randomisation applied to the classes that enrolled. The analysis used a filtered subset, so balance between groups is no longer guaranteed.",
            ["sample"],
          ),
        },
        refs: ["sample", "intervention", "timing"],
        writtenReasoning: false,
      },
      {
        id: "q5",
        stage: "Read the results",
        title: "What actually moved?",
        prompt:
          "Here are the average intrinsic motivation scores for classroom maths before and after the six weeks. Which description matches them?",
        type: "single",
        options: options([
          "Basketball-maths children became more motivated, while basketball-only children stayed the same.",
          "Basketball-maths children stayed about the same, while basketball-only children became less motivated.",
          "Both groups became more motivated, and basketball-maths children more so.",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "Compare each group with its own starting point before comparing the groups with each other.",
        explanation:
          "Basketball-maths went from 2.53 to 2.52 (−0.39%). Basketball-only went from 2.68 to 2.44 (−9.38%). Nothing rose. The groups differ because one fell and the other held steady.",
        misconceptions: {
          A: "Check the basketball-maths bars: 2.53 before and 2.52 after is flat, not a rise.",
          C: "Neither group's mean went up. Compare each after score with its before score.",
        },
        reveal: "results",
        evidence: [
          "Basketball + maths: 2.53 at T0, 2.52 at T1 (−0.39%).",
          "Basketball only: 2.68 at T0, 2.44 at T1 (−9.38%).",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Before and after, by group",
          instruction:
            "Make a prediction, then compare each group's after score with its before score.",
          description:
            "Mean intrinsic motivation for classroom maths for each group at the first and second questionnaire.",
          provenance: reported(["means"]),
          measure: "Intrinsic motivation for classroom maths",
          unit: "mean score",
          min: 1,
          max: 4,
          values: [
            {
              id: "bm-t0",
              label: "Basketball + maths, T0",
              detail: "Mean 2.53 (SD 0.72).",
              at: "setup",
              provenance: reported(["means"]),
              value: 2.53,
            },
            {
              id: "bm-t1",
              label: "Basketball + maths, T1",
              detail: "Mean 2.52 (SD 0.74).",
              at: "setup",
              provenance: reported(["means"]),
              value: 2.52,
            },
            {
              id: "con-t0",
              label: "Basketball only, T0",
              detail: "Mean 2.68 (SD 0.71).",
              at: "setup",
              provenance: reported(["means"]),
              value: 2.68,
            },
            {
              id: "con-t1",
              label: "Basketball only, T1",
              detail: "Mean 2.44 (SD 0.71).",
              at: "setup",
              provenance: reported(["means"]),
              value: 2.44,
            },
          ],
          difference: {
            from: "con-t0",
            to: "con-t1",
            label: "Basketball only fell 9.38%",
            at: "feedback",
          },
          prediction: {
            label: "Which group do you expect changed more over six weeks?",
            options: [
              "Basketball + maths",
              "Basketball only",
              "About the same",
            ],
          },
          responses: [
            {
              optionId: "A",
              label: "Maths group rose",
              targetIds: ["bm-t0", "bm-t1"],
            },
            {
              optionId: "B",
              label: "Control group fell",
              targetIds: ["con-t0", "con-t1"],
            },
            {
              optionId: "C",
              label: "Both rose",
              targetIds: ["bm-t0", "bm-t1", "con-t0", "con-t1"],
            },
          ],
          resolution: {
            id: "resolution",
            label: "A held line, not a climb",
            detail:
              "Basketball + maths changed by −0.39%. Basketball only changed by −9.38%. The control group also started higher.",
            at: "resolution",
            provenance: reported(["means"]),
          },
        },
        refs: ["means"],
        writtenReasoning: false,
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "Read the headline carefully",
        prompt:
          "The group-by-time interaction was significant (p = 0.006), and the paper's title says basketball maths can improve motivation. Which conclusion do the results support?",
        type: "single",
        options: options([
          "Basketball maths raised children's motivation for classroom maths.",
          "Over six weeks, motivation fell in basketball-only classes but held steady in basketball-maths classes. The difference is a decline that did not happen, not a rise.",
          "Because p = 0.006, the effect is large and certain to appear in other schools.",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "A significant interaction says the two groups changed differently. It does not say which group moved.",
        explanation:
          'The interaction compares the two changes. Here the control group dropped and the basketball-maths group did not, so the defensible claim is that basketball maths was followed by motivation being maintained relative to basketball only. "Improve" suggests a rise that the data do not show. A small p-value says the difference is unlikely under no true difference, not that it is large or will generalise.',
        misconceptions: {
          A: "The basketball-maths mean went from 2.53 to 2.52. A significant group difference does not mean that group went up.",
          C: "A p-value does not measure effect size or guarantee the result will repeat elsewhere.",
        },
        reveal: "interpretation",
        evidence: [
          "Group-by-time interaction for intrinsic motivation: p = 0.006.",
          "Basketball only: −9.38%. Basketball + maths: −0.39%.",
          "No group differences in changes in the extrinsic types of motivation.",
        ],
        scene: {
          version: 1,
          kind: "connections",
          title: "Assemble the claim",
          instruction:
            "Look at the pieces of evidence, then connect the conclusion they support.",
          description:
            "Three reported results feed into one claim about what six weeks of basketball maths did.",
          provenance: summary(["interaction", "means"]),
          actionLabel: "Connect a conclusion",
          anchors: [
            step(
              "bm-change",
              "Basketball + maths change",
              "Mean 2.53 before and 2.52 after.",
              ["means"],
            ),
            step(
              "con-change",
              "Basketball only change",
              "Mean 2.68 before and 2.44 after.",
              ["means"],
            ),
            step(
              "interaction-test",
              "Group-by-time test",
              "The two groups changed differently, p = 0.006.",
              ["interaction"],
            ),
          ],
          responses: [
            {
              optionId: "A",
              label: "Motivation rose",
              targetIds: ["interaction-test"],
            },
            {
              optionId: "B",
              label: "Decline avoided",
              targetIds: ["bm-change", "con-change", "interaction-test"],
            },
            {
              optionId: "C",
              label: "Large and certain",
              targetIds: ["interaction-test"],
            },
          ],
          resolution: resolution(
            "Maintained, not improved",
            "The difference between groups comes from the basketball-only group's decline. The title's \"improve\" goes beyond what the means show.",
            ["interaction", "means"],
          ),
        },
        refs: ["interaction", "means"],
        writtenReasoning: false,
      },
    ],
    bonus: {
      id: "bonus",
      stage: "Draw a conclusion",
      title: "What else could explain it?",
      prompt:
        "Suppose adding maths to basketball had no real effect on motivation. Which explanations could still produce this pattern? Select two.",
      type: "multiple",
      options: options([
        "The basketball-only classes started higher (2.68 vs 2.53), so part of their drop could be scores drifting back toward the average.",
        "Maths turning up in PE was new and fun for a few weeks, so the lift could fade once the novelty wears off.",
        "Random assignment of classes rules out every alternative explanation.",
        "The basketball-only group stopped having PE, which lowered their motivation.",
      ]),
      accepted: ["A", "B"],
      alternatives: [],
      hint: "Look for explanations that fit the numbers and the six-week window without needing maths-in-basketball to work.",
      explanation:
        "A group that starts higher has more room to slide back, and one round of class randomisation can leave groups unequal at the start. A novel activity can lift feelings briefly, and the study measured only once, one week after the six weeks ended. Neither is proven here, but both remain open, along with the 39% of children left out of the analysis.",
      misconceptions: {
        A: "This is one plausible explanation. Pick the other one as well.",
        B: "This is one plausible explanation. Pick the other one as well.",
        C: "Randomisation helps but cannot rule out chance imbalance, later exclusions or novelty effects.",
        D: "The control classes received the same amount of basketball teaching, without maths.",
      },
      reveal: "bonus",
      evidence: [
        "Intrinsic motivation at T0: basketball only 2.68, basketball + maths 2.53.",
        "Motivation was measured one week before and one week after the six weeks.",
      ],
      scene: null,
      refs: ["means", "timing", "intervention"],
      writtenReasoning: false,
    },
  },
};
