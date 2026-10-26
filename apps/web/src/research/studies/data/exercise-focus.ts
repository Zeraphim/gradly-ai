import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody } from "../types.js";

const summary = (
  refs: string[],
  note = "Paraphrase of the cited study text.",
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
const reported = (refs: string[], note: string) => ({
  kind: "reported" as const,
  refs,
  note,
});
const step = (
  id: string,
  label: string,
  detail: string,
  provenance: SceneItem["provenance"],
  column?: number,
): SceneItem => ({
  id,
  label,
  detail,
  at: "setup",
  provenance,
  ...(column === undefined ? {} : { column }),
});
const resolution = (
  label: string,
  detail: string,
  refs: string[],
): SceneItem => ({
  id: "resolution",
  label,
  detail,
  at: "resolution",
  provenance: summary(
    refs,
    "Authored resolution based on the cited study text.",
  ),
});
const value = (
  id: string,
  label: string,
  detail: string,
  v: number,
): SceneItem & { value: number } => ({
  id,
  label,
  detail,
  at: "setup",
  value: v,
  provenance: reported(
    ["table3"],
    "Mean correct items as reported in Table 3.",
  ),
});

export const body: StudyBody = {
  takeaway:
    "After a 10-minute badminton game, students improved on a distraction-resisting colour-word test more than after seated rest, while running did not clear the bar against rest. The direct badminton-versus-running test was not significant (p = .082), so the study does not show that the game beats the run.",
  lesson: {
    id: "prepared-exercise-focus",
    title: "Game or Treadmill?",
    source: "featured",
    briefing:
      "A research team asks whether a short burst of exercise changes how well people ignore distracting information, and whether the type of exercise matters. You will read the design before seeing any numbers, then interpret the results and decide what they can support.",
    paper: {
      title:
        "Comparison of the effects of running and badminton on executive function: A within-subjects design",
      authors: "Shinji Takahashi and Philip M. Grove (2019)",
      journal: "PLOS ONE, 14(9), e0216842",
      url: "https://doi.org/10.1371/journal.pone.0216842",
      limitations: [
        "Twenty undergraduate volunteers from one university took part.",
        "The badminton session was not a real match: no score was kept and the investigator opponents gave tips.",
        "None of the participants were experienced badminton players.",
        "The reverse-Stroop task showed no exercise effect, so the result depends on which test of inhibition is used.",
      ],
    },
    evidence: [
      {
        id: "sample",
        page: 1,
        excerpt:
          "Twenty young adults performed three interventions, which were running, badminton, and seated rest as a control condition for 10 min each.",
      },
      {
        id: "design",
        page: 3,
        excerpt:
          "Laboratory visits 2, 3, and 4 were experimental sessions. To minimize any order or learning effects, the orders of the experimental sessions were counterbalanced.",
      },
      {
        id: "procedure",
        page: 3,
        excerpt:
          "the participants completed the Stroop/reverse-Stroop test (duration: 6 min) before and after each intervention.",
      },
      {
        id: "walk",
        page: 3,
        excerpt:
          "the participants moved from the laboratory to a badminton court, which took 2 min. For both the running and the control interventions, the participants walked on a treadmill at 4.2",
      },
      {
        id: "measure",
        page: 5,
        excerpt:
          "In each subtest, participants were instructed to check as many correct items as possible in 60 s. Assessment of inhibitory function was defined as the difference in correct responses between neutral and incongruent tasks.",
      },
      {
        id: "alpha",
        page: 5,
        excerpt:
          "significance levels of three-way repeated ANOVAs, two-way repeated ANOVAs, and paired t tests were set at p = .05, p = .025, and p = .008, respectively.",
      },
      {
        id: "table3",
        page: 6,
        excerpt:
          "Incongruent (Test 4) Badminton 48.8 ± 1.5 53.8 ± 1.7 Running 50.3 ± 1.6 52.9 ± 1.4 Control 49.9 ± 1.8 51.2 ± 1.7",
      },
      {
        id: "vsrest",
        page: 6,
        excerpt:
          "(t (19) = 3.6, p = .002, Cohen’s d = 0.80), while the change in the running intervention was not greater than that in the control (t (19) = 1.3, p = .207, Cohen’s d = 0.29).",
      },
      {
        id: "direct",
        page: 7,
        excerpt:
          "between the badminton and running interventions was observed (t (19) = 1.8, p = .082, Cohen’s d = 0.44).",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Frame the question",
        title: "Pick the Outcome",
        prompt:
          "The team wants to know whether exercise changes how well people resist distracting information. Which measurement fits that question?",
        type: "single",
        options: [
          {
            id: "B",
            text: "Average heart rate during each session, comparing the activity with seated rest.",
          },
          {
            id: "A",
            text: "Correct clashing-ink items on a colour-word test before and after each session.",
          },
          {
            id: "C",
            text: "Badminton points won during each session, compared with the student's usual score.",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "Which measurement asks people to ignore something misleading?",
        explanation:
          "A colour-word test with clashing ink (the Stroop test) forces people to suppress the automatic urge to read the word. Measuring it before and after each session lets the team see whether the session changed that skill.",
        misconceptions: {
          B: "Heart rate measures physical exertion rather than resistance to distracting words.",
          C: "Game points measure sport performance; no score was kept in this session.",
        },
        reveal: "design",
        evidence: [
          "Each colour-word subtest asks for as many correct items as possible in 60 seconds.",
        ],
        scene: null,
        refs: ["measure", "procedure"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Who Does Which Session?",
        prompt:
          "Every student came to the lab on separate days for a badminton session, a running session and a seated-rest session. The team worried that getting better at the test with practice could favour whichever session came last. Tap the plan that handles that worry.",
        type: "single",
        options: [
          {
            id: "B",
            text: "Separate groups, each assigned one of the sessions",
          },
          {
            id: "C",
            text: "Same students, session order fixed across students",
          },
          {
            id: "A",
            text: "Same students, session order rotated across students",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "Every student did all three sessions. What stops one session from always being the most practised?",
        explanation:
          "This is a within-subjects design: each student is compared with themselves across all three sessions. Rotating (counterbalancing) the session order means practice gains are spread across badminton, running and rest instead of always landing on one of them.",
        misconceptions: {
          B: "Each student did all three sessions, so these are not separate groups.",
          C: "With a fixed order, the last session always gets the most practice, so practice and session type are tangled together.",
        },
        reveal: "design",
        evidence: [
          "Visits 2, 3 and 4 were the three experimental sessions.",
          "Each session lasted 10 minutes.",
        ],
        scene: {
          version: 1,
          kind: "designs",
          title: "Three ways to schedule the sessions",
          instruction:
            "Compare the three plans, then tap the one that matches this study.",
          description:
            "Three scheduling plans for a badminton, running and seated-rest comparison. Only one describes how this study was run.",
          provenance: summary(
            ["sample", "design"],
            "One panel summarises the study design. The other two are teaching alternatives.",
          ),
          panels: [
            {
              id: "separate",
              label: "Plan 1",
              steps: [
                step(
                  "separate-who",
                  "Three separate groups",
                  "One group plays badminton, one runs, one rests.",
                  illustration(
                    "Teaching alternative, not this study's design.",
                  ),
                ),
                step(
                  "separate-compare",
                  "Compare groups",
                  "Each student contributes a score for one session only.",
                  illustration(
                    "Teaching alternative, not this study's design.",
                  ),
                ),
              ],
            },
            {
              id: "fixed",
              label: "Plan 2",
              steps: [
                step(
                  "fixed-who",
                  "The same students do all three",
                  "Each student completes every session on different days.",
                  illustration(
                    "Teaching alternative, not this study's design.",
                  ),
                ),
                step(
                  "fixed-order",
                  "Same order for everyone",
                  "Everyone runs first, plays badminton second and rests last.",
                  illustration(
                    "Teaching alternative, not this study's design.",
                  ),
                ),
              ],
            },
            {
              id: "rotated",
              label: "Plan 3",
              steps: [
                step(
                  "rotated-who",
                  "The same students do all three",
                  "Each student completes badminton, running and seated rest on different days.",
                  summary(["sample", "design"]),
                ),
                step(
                  "rotated-order",
                  "Order rotated across students",
                  "Different students meet the sessions in different orders.",
                  summary(["design"]),
                ),
              ],
            },
          ],
          responses: [
            {
              optionId: "B",
              label: "Plan 1",
              targetIds: ["separate-who"],
            },
            {
              optionId: "C",
              label: "Plan 2",
              targetIds: ["fixed-who"],
            },
            {
              optionId: "A",
              label: "Plan 3",
              targetIds: ["rotated-who"],
            },
          ],
          resolution: resolution(
            "Same people, rotated order",
            "Each student is their own comparison, and counterbalancing spreads practice effects across all three sessions.",
            ["design"],
          ),
        },
        refs: ["sample", "design"],
        writtenReasoning: false,
        responseStyle: "tap",
      },
      {
        id: "q3",
        stage: "Read the design",
        title: "The Two-Minute Walk",
        prompt:
          "The badminton session included a two-minute walk to the court; the running and rest sessions included a two-minute treadmill walk. A follow-up removes only the treadmill walk. What becomes harder to interpret?",
        type: "single",
        options: [
          {
            id: "A",
            text: "Whether a score difference comes from the activity or the extra walking.",
          },
          {
            id: "B",
            text: "Whether running was safe, since the rest session is the only one that needs a warm-up.",
          },
          {
            id: "C",
            text: "Whether baseline fitness differs, since the walk is the only fitness assessment.",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "Which session would now contain an extra activity before the main ten-minute comparison?",
        explanation:
          "A fair comparison keeps everything the same except the thing being tested. Without the treadmill walk, badminton sessions would include 2 extra minutes of walking, and any difference in test scores could come from that walk rather than from the game.",
        misconceptions: {
          B: "The extra walking would be confounded with session type. A rest session does not need a running warm-up.",
          C: "Fitness was assessed separately; removing this walk changes what activities precede the test.",
        },
        reveal: "design",
        evidence: [
          "The colour-word test took 6 minutes and was given before and after each activity.",
          "Badminton sessions included a 2-minute walk to the court.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "One experimental session",
          instruction: "Trace a session from the first test to the second.",
          description:
            "The order of steps in each session, with the badminton branch and the running or rest branch shown side by side.",
          provenance: summary(["procedure", "walk", "sample"]),
          nodes: [
            step(
              "pre",
              "Colour-word test (before)",
              "6 minutes, taken before the activity.",
              summary(["procedure"]),
              0,
            ),
            step(
              "court",
              "Walk to the court",
              "2 minutes, badminton sessions only.",
              summary(["walk"]),
              0,
            ),
            step(
              "treadmill",
              "Treadmill walk",
              "2 minutes, running and seated-rest sessions.",
              summary(["walk"]),
              1,
            ),
            step(
              "badminton",
              "Badminton",
              "10 minutes of singles play.",
              summary(["sample"]),
              0,
            ),
            step(
              "other",
              "Running or seated rest",
              "10 minutes.",
              summary(["sample"]),
              1,
            ),
            step(
              "post",
              "Colour-word test (after)",
              "6 minutes, taken after the activity.",
              summary(["procedure"]),
              0,
            ),
          ],
          edges: [
            { from: "pre", to: "court", label: "badminton day", at: "setup" },
            {
              from: "pre",
              to: "treadmill",
              label: "running or rest day",
              at: "setup",
            },
            { from: "court", to: "badminton", label: "then", at: "setup" },
            { from: "treadmill", to: "other", label: "then", at: "setup" },
            { from: "badminton", to: "post", label: "then", at: "setup" },
            { from: "other", to: "post", label: "then", at: "setup" },
          ],
          responses: [
            {
              optionId: "A",
              label: "Activity versus incidental walking",
              targetIds: ["court", "treadmill"],
            },
            {
              optionId: "B",
              label: "Warm-up for running",
              targetIds: ["treadmill", "other"],
            },
            {
              optionId: "C",
              label: "Measure fitness",
              targetIds: ["treadmill"],
            },
          ],
          resolution: resolution(
            "Matched before the activity",
            "Every session includes 2 minutes of walking, so the walk cannot explain a difference between sessions.",
            ["walk"],
          ),
        },
        refs: ["walk", "procedure", "sample"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "Who Gained Most?",
        prompt:
          "These are the average correct items on the clashing-ink test before and after each session. Which session gained the most?",
        type: "single",
        options: [
          {
            id: "B",
            text: "Running",
          },
          {
            id: "A",
            text: "Badminton",
          },
          {
            id: "C",
            text: "Seated rest",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "Subtract each before score from its after score. A high after score is not a big gain if it started high.",
        explanation:
          "Badminton rose from 48.8 to 53.8 (+5.0 items), running from 50.3 to 52.9 (+2.6) and seated rest from 49.9 to 51.2 (+1.3). Even rest improved, which shows practice on the test. That is why each exercise is compared with rest, not with zero.",
        misconceptions: {
          B: "Running started higher at 50.3, so its gain was only 2.6 items.",
          C: "Rest gained 1.3 items, the smallest change. It still improved, a sign of practice on the test.",
        },
        reveal: "results",
        evidence: [
          "Clashing-ink test, correct items in 60 seconds, mean before → after.",
          "Badminton 48.8 → 53.8. Running 50.3 → 52.9. Seated rest 49.9 → 51.2.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Before and after each session",
          instruction: "Compare each session's before and after bars.",
          description:
            "Reported mean correct items on the clashing-ink colour-word test, before and after each 10-minute session.",
          provenance: reported(
            ["table3"],
            "Means as reported in Table 3 (n = 20 each).",
          ),
          measure: "Correct items in 60 s on the clashing-ink test",
          unit: "items",
          min: 40,
          max: 60,
          values: [
            value(
              "bad-pre",
              "Badminton · before",
              "Reported mean before badminton.",
              48.8,
            ),
            value(
              "bad-post",
              "Badminton · after",
              "Reported mean after badminton.",
              53.8,
            ),
            value(
              "run-pre",
              "Running · before",
              "Reported mean before running.",
              50.3,
            ),
            value(
              "run-post",
              "Running · after",
              "Reported mean after running.",
              52.9,
            ),
            value(
              "rest-pre",
              "Seated rest · before",
              "Reported mean before seated rest.",
              49.9,
            ),
            value(
              "rest-post",
              "Seated rest · after",
              "Reported mean after seated rest.",
              51.2,
            ),
          ],
          difference: {
            from: "bad-pre",
            to: "bad-post",
            label: "Badminton gain: +5.0 items (derived from reported means)",
            at: "feedback",
          },
          prediction: {
            label:
              "Before you subtract, which session do you expect gained most?",
            options: ["Badminton", "Running", "Seated rest"],
          },
          responses: [
            {
              optionId: "B",
              label: "Running",
              targetIds: ["run-pre", "run-post"],
            },
            {
              optionId: "A",
              label: "Badminton",
              targetIds: ["bad-pre", "bad-post"],
            },
            {
              optionId: "C",
              label: "Seated rest",
              targetIds: ["rest-pre", "rest-post"],
            },
          ],
          resolution: resolution(
            "Gains, not end points",
            "Badminton +5.0, running +2.6, rest +1.3 items. Running sits between the other two.",
            ["table3"],
          ),
        },
        refs: ["table3"],
        writtenReasoning: false,
        responseStyle: "pills",
      },
      {
        id: "q5",
        stage: "Read the results",
        title: "Clearing the Bar",
        prompt:
          "The team compared each exercise's gain with the rest gain using paired t tests. Because they ran several tests, a result needed p below .008 to count. Which statement is accurate?",
        type: "single",
        options: [
          {
            id: "B",
            text: "Both beat rest on the corrected tests, since both average gains exceeded the rest gain.",
          },
          {
            id: "C",
            text: "Running performed worse than rest on the corrected test, despite a larger average gain.",
          },
          {
            id: "A",
            text: "Badminton beat rest on the corrected test; running did not show a clear advantage.",
          },
        ],
        accepted: ["A"],
        alternatives: [],
        hint: "Compare each p-value with .008, not with the raw gains.",
        explanation:
          "Badminton versus rest gave p = .002, below .008. Running versus rest gave p = .207, well above it. Running's larger raw gain could easily come from chance variation with 20 students, so it does not count as a demonstrated improvement over rest.",
        misconceptions: {
          B: "A larger mean gain alone is not enough; running's p-value did not meet the threshold.",
          C: "Running's non-significant contrast does not establish worse performance.",
        },
        reveal: "results",
        evidence: [
          "Paired t tests needed p < .008 after correction for multiple tests.",
          "Badminton vs rest: t(19) = 3.6, p = .002, d = 0.80.",
          "Running vs rest: t(19) = 1.3, p = .207, d = 0.29.",
        ],
        scene: {
          version: 1,
          kind: "tests",
          title: "Two comparisons with seated rest",
          instruction: "Compare each p-value with the corrected threshold.",
          description: "Two comparisons with seated rest",
          provenance: {
            kind: "reported",
            refs: ["alpha", "vsrest"],
            note: "Threshold and p-values as reported in the cited passages.",
          },
          responses: [
            {
              optionId: "B",
              label:
                "Both beat rest on the corrected tests, since both average gains exceeded the rest gain.",
              targetIds: ["badminton", "running"],
            },
            {
              optionId: "C",
              label:
                "Running performed worse than rest on the corrected test, despite a larger average gain.",
              targetIds: ["badminton", "running"],
            },
            {
              optionId: "A",
              label:
                "Badminton beat rest on the corrected test; running did not show a clear advantage.",
              targetIds: ["badminton", "running"],
            },
          ],
          resolution: null,
          alpha: 0.008,
          tests: [
            {
              id: "badminton",
              label: "Badminton vs rest",
              detail: "p = .002.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["alpha", "vsrest"],
                note: "Threshold and p-values as reported in the cited passages.",
              },
              p: 0.002,
            },
            {
              id: "running",
              label: "Running vs rest",
              detail: "p = .207.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["alpha", "vsrest"],
                note: "Threshold and p-values as reported in the cited passages.",
              },
              p: 0.207,
            },
          ],
          prediction: null,
        },
        refs: ["alpha", "vsrest"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "Did the Game Beat the Run?",
        prompt:
          "Badminton cleared the bar against rest and running did not. Does this study show that badminton improves focus more than running?",
        type: "single",
        options: [
          {
            id: "B",
            text: "Not established; the direct badminton-versus-running contrast was non-significant.",
          },
          {
            id: "A",
            text: "Yes; significance against rest for badminton alone establishes an advantage over running.",
          },
          {
            id: "C",
            text: "Yes; the direct effect-size estimate establishes an advantage despite the uncertain paired test.",
          },
          {
            id: "D",
            text: "No; the non-significant running-versus-rest test establishes that running has zero effect.",
          },
        ],
        accepted: ["B"],
        alternatives: [],
        hint: "Which single test actually compares badminton with running?",
        explanation:
          "One result crossing a line while another does not is not itself a test of the gap between them. A difference in significance is not a significant difference. Only the direct comparison answers the question, and it gave p = .082, not significant even at .05. The effect size of 0.44 hints at a possible moderate advantage that 20 students could not confirm. The paper's own conclusion leans toward badminton, but its direct test does not support that step.",
        misconceptions: {
          A: "Two separate significance decisions do not test the gap between the exercises.",
          C: "An effect-size point estimate does not remove its uncertainty.",
          D: "Non-significance does not prove a zero effect.",
        },
        reveal: "interpretation",
        evidence: [
          "Badminton vs rest: t(19) = 3.6, p = .002, d = 0.80.",
          "Running vs rest: t(19) = 1.3, p = .207, d = 0.29.",
          "Badminton vs running: t(19) = 1.8, p = .082, d = 0.44.",
        ],
        scene: {
          version: 1,
          kind: "connections",
          title: "Three paired tests",
          instruction: "Connect your conclusion to the tests it relies on.",
          description:
            "The three reported paired comparisons of gains on the clashing-ink test.",
          provenance: reported(
            ["vsrest", "direct"],
            "Paired t tests as reported in the results.",
          ),
          actionLabel: "Connect a conclusion",
          anchors: [
            step(
              "bad-rest",
              "Badminton vs rest",
              "t(19) = 3.6, p = .002, d = 0.80",
              reported(["vsrest"], "Reported paired t test."),
            ),
            step(
              "run-rest",
              "Running vs rest",
              "t(19) = 1.3, p = .207, d = 0.29",
              reported(["vsrest"], "Reported paired t test."),
            ),
            step(
              "bad-run",
              "Badminton vs running",
              "t(19) = 1.8, p = .082, d = 0.44",
              reported(["direct"], "Reported paired t test."),
            ),
          ],
          responses: [
            {
              optionId: "B",
              label: "The direct test",
              targetIds: ["bad-run"],
            },
            {
              optionId: "A",
              label: "Two tests against rest",
              targetIds: ["bad-rest", "run-rest"],
            },
            {
              optionId: "C",
              label: "The effect size",
              targetIds: ["bad-run"],
            },
            {
              optionId: "D",
              label: "Running vs rest",
              targetIds: ["run-rest"],
            },
          ],
          resolution: resolution(
            "Test the gap directly",
            "A difference in significance is not a significant difference. The direct badminton-versus-running test gave p = .082.",
            ["direct"],
          ),
        },
        refs: ["vsrest", "direct"],
        writtenReasoning: false,
        responseStyle: "cards",
      },
    ],
    bonus: {
      id: "bonus",
      stage: "Draw a conclusion",
      title: "Designing the Follow-Up",
      prompt:
        "A follow-up study wants to show that a quick badminton game beats a quick run for focus. What result would actually support that claim?",
      type: "single",
      options: [
        {
          id: "A",
          text: "A clear direct badminton-versus-running difference in a study powered for that comparison.",
        },
        {
          id: "B",
          text: "A stronger badminton-versus-rest result, with no direct comparison between the two exercise conditions.",
        },
        {
          id: "C",
          text: "Another non-significant running-versus-rest result, even if badminton and running remain indistinguishable.",
        },
      ],
      accepted: ["A"],
      alternatives: [],
      hint: "The claim is about badminton and running, so which comparison must the study test?",
      explanation:
        "A claim about two exercises needs a test of those two exercises. Strengthening the comparisons with rest cannot show the gap between them. With an observed d of 0.44, a follow-up would need a sample planned to detect a difference of about that size.",
      misconceptions: {
        B: "A comparison with rest does not directly test the exercise-to-exercise claim.",
        C: "Failure to beat rest does not establish a difference between exercises.",
      },
      reveal: "bonus",
      evidence: ["Badminton vs running: t(19) = 1.8, p = .082, d = 0.44."],
      scene: null,
      refs: ["direct"],
      writtenReasoning: false,
      responseStyle: "cards",
    },
  },
};
