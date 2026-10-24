import type { SceneItem } from "@paperquest/contracts";
import type { StudyBody } from "../types.js";

const summary = (
  refs: string[],
  note = "Authored summary of the study, not a verbatim quotation.",
) => ({
  kind: "source-summary" as const,
  refs,
  note,
});
const reported = (refs: string[], note: string) => ({
  kind: "reported" as const,
  refs,
  note,
});
const illustration = (note: string) => ({
  kind: "illustration" as const,
  refs: [] as string[],
  note,
});
const authored = (refs: string[], note: string) => ({
  kind: "authored" as const,
  refs,
  note,
});
const item = (
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
  id: string,
  label: string,
  detail: string,
  provenance: SceneItem["provenance"],
): SceneItem => ({ id, label, detail, at: "resolution", provenance });
const options = (texts: string[]) =>
  texts.map((text, i) => ({ id: String.fromCharCode(65 + i), text }));

export const body: StudyBody = {
  takeaway:
    "Among 8,000 15-year-olds, students who said they ate breakfast scored slightly higher in science, but the correlation was only r = 0.050, about a quarter of one percent of the variation in scores. A single yes/no question that 93% answered yes, measured once alongside unmeasured family factors, cannot show that eating breakfast would raise anyone's grades.",
  lesson: {
    id: "prepared-breakfast-grades",
    title: "Does Breakfast Boost Grades?",
    source: "featured",
    briefing:
      "A research team uses a large international student survey to ask whether teenagers who eat breakfast before school also achieve more. You will read how breakfast and achievement were measured, decide what a statistically significant result can mean in a sample this size, then judge whether the findings support advice to families.",
    paper: {
      title:
        "Breakfast Consumption and Academic Achievement Among Chinese Adolescents: A Moderated Mediation Model",
      authors: "Chun Lei Gao, Nan Zhao and Ping Shu (2021)",
      journal: "Frontiers in Psychology, 12, 700989",
      url: "https://doi.org/10.3389/fpsyg.2021.700989",
      limitations: [
        "The cross-sectional design cannot establish that breakfast causes higher achievement.",
        "Breakfast was a single yes/no item about eating before school, with no frequency or breakfast type.",
        "Achievement was one science plausible value from four Chinese regions in PISA 2015.",
        "Family routines and other factors that could drive both breakfast and achievement were not measured.",
      ],
    },
    evidence: [
      {
        id: "method",
        page: 4,
        excerpt:
          "After excluding missing data, the final sample included 8,000 15-year-old students (females = 3,774, males = 4,226) from 268 schools.",
      },
      {
        id: "item",
        page: 4,
        excerpt:
          "The questionnaire data on whether students eat breakfast before school (YES = 2, NO = 1) were collected and analyzed.",
      },
      {
        id: "results",
        page: 5,
        excerpt:
          "the study found that 7,473 students (93.41%) had breakfast before school, compared with 6.59% of students who skipped breakfast. The SES of the family students is normally distributed. Descriptive Statistics and Intercorrelations Between Variables The correlation matrix of each study variable is shown in Table 1. Breakfast consumption and achievement motivation were significantly and positively correlated with academic achievement, indicating that they were all contributing factors to the academic achievement of adolescents.",
      },
      {
        id: "table1",
        page: 5,
        excerpt:
          "3. Socioeconomic status −0.842 1.114 0.029** 0.107*** – 4. Academic achievement 531.388 97.457 0.050*** 0.131*** 0.293*** – N = 8,000. **p < 0.01 and ***p < 0.001.",
      },
      {
        id: "limits",
        page: 8,
        excerpt:
          "which prevented the results from being extrapolated to a causal relationship. Future studies should use a longitudinal design or experimental approach to investigate the causal relationship between breakfast consumption and academic achievement. Second, since the 2015 PISA data mainly tested the science literacy of 15-year-old students, this study mainly used science literacy scores as a variable for the academic achievement of students, and future studies will provide a comprehensive analysis of student achievement. Third, this study did not investigate the number of students eating breakfast every week, or the types of breakfasts students eat, which is the biggest limitation of this study.",
      },
      {
        id: "advice",
        page: 8,
        excerpt:
          "First, it was necessary for parents and educators to help adolescents know that breakfast consumption had positive impacts on academic achievement and to help them develop the habit of eating breakfast.",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Frame the question",
        title: "Name the Design",
        prompt:
          "Teenagers answered a questionnaire about eating breakfast and took a science test in the same assessment. Nobody was told whether to eat breakfast. What kind of study is this?",
        type: "single",
        options: options([
          "Randomised experiment",
          "Cross-sectional survey",
          "Longitudinal follow-up",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "Ask two things: did researchers assign breakfast, and was anyone measured more than once?",
        explanation:
          "Breakfast was reported, not assigned, and everything was measured at one point in time. That makes this a cross-sectional correlational survey. It can describe associations but cannot order cause and effect.",
        misconceptions: {
          A: "No one was assigned to eat or skip breakfast, so this is not an experiment.",
          C: "Students were measured once. A longitudinal study follows the same people over time.",
        },
        reveal: "design",
        evidence: [
          "Students reported whether they ate breakfast before school.",
          "Science achievement was measured in the same assessment.",
        ],
        scene: null,
        responseStyle: "pills",
        refs: ["item", "limits"],
        writtenReasoning: false,
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Inspect the Measures",
        prompt:
          "Look at how each variable was measured. Which measure tells you the least about the habit it is named after?",
        type: "single",
        options: options([
          "The breakfast measure",
          "The science measure",
          "The family background measure",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Compare how many answers each measure allows. How much can one answer reveal about a daily habit?",
        explanation:
          "Breakfast was a single yes/no question about eating before school. It says nothing about how often, what was eaten, or how long the habit has lasted. The science score and the family background index each combine many items.",
        misconceptions: {
          B: "The science score comes from a full assessment scaled across many items, not from one question.",
          C: "The family background index combines parental education, parental occupation and household possessions.",
        },
        reveal: "design",
        evidence: [
          "Breakfast: one questionnaire item, yes or no.",
          "Family background: a composite of parental education, occupation and household possessions.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "How each variable was measured",
          instruction:
            "Inspect each measure, then tap the one that captures the least about the habit it names.",
          description:
            "One sample of 15-year-olds feeds three measures taken in the same assessment.",
          provenance: summary(["method", "item"]),
          nodes: [
            item(
              "sample",
              "15-year-old students",
              "Students in a large international assessment, with incomplete records removed.",
              summary(["method"]),
              0,
            ),
            item(
              "breakfast",
              "Breakfast question",
              "Did you eat breakfast before school? Answered yes or no.",
              summary(["item"]),
              1,
            ),
            item(
              "science",
              "Science score",
              "A scaled science literacy score from the assessment's test items.",
              summary(
                ["method"],
                "Authored summary of the study's described achievement measure, not a verbatim quotation.",
              ),
              1,
            ),
            item(
              "family",
              "Family background index",
              "A composite of parental education, parental occupation and household possessions.",
              summary(
                ["method"],
                "Authored summary of the study's described socioeconomic index, not a verbatim quotation.",
              ),
              1,
            ),
          ],
          edges: [
            { from: "sample", to: "breakfast", label: "answered", at: "setup" },
            { from: "sample", to: "science", label: "tested", at: "setup" },
            { from: "sample", to: "family", label: "reported", at: "setup" },
          ],
          responses: [
            { optionId: "A", label: "Breakfast", targetIds: ["breakfast"] },
            { optionId: "B", label: "Science", targetIds: ["science"] },
            { optionId: "C", label: "Family", targetIds: ["family"] },
          ],
          resolution: resolution(
            "breakfast-resolution",
            "One yes/no answer stands in for a habit",
            "The breakfast item cannot separate a daily breakfast eater from someone who ate once that morning. The authors list missing frequency and breakfast type as the biggest limitation.",
            summary(["item", "limits"]),
          ),
        },
        responseStyle: "tap",
        refs: ["item", "method", "limits"],
        writtenReasoning: false,
      },
      {
        id: "q3",
        stage: "Read the design",
        title: "Plan for Significance",
        prompt:
          "The analysis includes 8,000 students. Before you see any results, what should a 'statistically significant' correlation in a sample this size tell you?",
        type: "single",
        options: options([
          "Even a very small association can be significant with this many students, so its size must be checked separately.",
          "With this many students, a significant correlation must be large.",
          "A significant correlation shows that breakfast causes the difference.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "As a sample grows, what happens to the smallest correlation that can pass a significance test?",
        explanation:
          "Significance tests ask whether an association is distinguishable from zero. With thousands of participants, tiny associations clear that bar easily. Size and practical importance need a separate look, and significance never establishes cause.",
        misconceptions: {
          B: "Large samples make small effects easier to detect. Significance does not measure size.",
          C: "A significance test cannot turn a correlation into a causal effect.",
        },
        reveal: "design",
        evidence: ["Final sample: 8,000 students from 268 schools."],
        scene: {
          version: 1,
          kind: "connections",
          title: "What will a significant result mean?",
          instruction:
            "Inspect the ingredients, then connect the reading you would plan for.",
          description:
            "Sample size, a significance test and an effect size are separate ingredients of one result.",
          provenance: illustration(
            "Teaching layout. No results are shown; only the sample size comes from the study.",
          ),
          actionLabel: "Connect a reading",
          anchors: [
            item(
              "sample-size",
              "Sample size",
              "8,000 students from 268 schools.",
              summary(["method"]),
            ),
            item(
              "p-value",
              "Significance test",
              "Asks whether an association this strong would be unusual if the true correlation were zero.",
              authored(
                ["method"],
                "Methods guidance, not a claim about this study's results.",
              ),
            ),
            item(
              "effect-size",
              "Effect size",
              "How strong the association is, regardless of how many people were measured.",
              authored(
                ["method"],
                "Methods guidance, not a claim about this study's results.",
              ),
            ),
          ],
          responses: [
            {
              optionId: "A",
              label: "Check size separately",
              targetIds: ["sample-size", "p-value", "effect-size"],
            },
            {
              optionId: "B",
              label: "Significant means large",
              targetIds: ["sample-size", "p-value"],
            },
            {
              optionId: "C",
              label: "Significant means causal",
              targetIds: ["p-value"],
            },
          ],
          resolution: resolution(
            "significance-resolution",
            "Significance and size are different questions",
            "A large sample shrinks the threshold for significance. Read the correlation's size before deciding whether it matters.",
            authored(
              ["method"],
              "Methods guidance, not a claim about this study's results.",
            ),
          ),
        },
        refs: ["method"],
        writtenReasoning: false,
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "Size Up the Correlation",
        prompt:
          "Breakfast and science achievement correlated at r = 0.050 (p < 0.001, N = 8,000). Roughly how much of the variation in science scores does breakfast account for?",
        type: "single",
        options: options([
          "About a quarter of one percent (0.050² ≈ 0.0025).",
          "About 5 percent, because r = 0.050.",
          "About half, because the result is highly significant.",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Variance explained is the correlation squared, not the correlation itself.",
        explanation:
          "0.050² = 0.0025, so breakfast accounts for about 0.25% of the variation in science scores. The tiny p-value reflects the large sample, not a strong link. Family background, by comparison, correlated 0.293 with achievement, about 8.6% of the variation.",
        misconceptions: {
          B: "r is not a percentage. Square it to get the share of variation: 0.050² ≈ 0.0025.",
          C: "A small p-value with 8,000 students says the association is not zero. It says nothing about it being large.",
        },
        reveal: "results",
        evidence: [
          "Breakfast and science achievement: r = 0.050, p < 0.001.",
          "Family background and science achievement: r = 0.293, p < 0.001.",
          "N = 8,000.",
        ],
        scene: {
          version: 1,
          kind: "association",
          title: "Two reported correlations with achievement",
          instruction:
            "Compare the strength of each association, then choose how much variation breakfast accounts for.",
          description:
            "Reported correlations from the study's correlation table, each with science achievement.",
          provenance: reported(
            ["table1"],
            "Correlations as reported in Table 1.",
          ),
          pairs: [
            {
              ...item(
                "breakfast-achievement",
                "Breakfast and achievement",
                "Reported r = 0.050, marked p < 0.001.",
                reported(["table1"], "Correlation as reported in Table 1."),
              ),
              x: "Ate breakfast (yes/no)",
              y: "Science achievement",
              statistic: "r",
              value: 0.05,
              n: 8000,
            },
            {
              ...item(
                "ses-achievement",
                "Family background and achievement",
                "Reported r = 0.293, marked p < 0.001.",
                reported(["table1"], "Correlation as reported in Table 1."),
              ),
              x: "Family background index",
              y: "Science achievement",
              statistic: "r",
              value: 0.293,
              n: 8000,
            },
          ],
          responses: [
            {
              optionId: "A",
              label: "About 0.25%",
              targetIds: ["breakfast-achievement"],
            },
            {
              optionId: "B",
              label: "About 5%",
              targetIds: ["breakfast-achievement"],
            },
            {
              optionId: "C",
              label: "About half",
              targetIds: ["breakfast-achievement"],
            },
          ],
          resolution: resolution(
            "association-resolution",
            "Significant, but very small",
            "Squaring r = 0.050 gives about 0.25% of variation. Family background's r = 0.293 squares to about 8.6%.",
            {
              kind: "derived",
              refs: ["table1"],
              note: "Variance explained calculated as r squared from the reported correlations.",
            },
          ),
        },
        refs: ["table1", "results"],
        writtenReasoning: false,
      },
      {
        id: "q5",
        stage: "Draw a conclusion",
        title: "Find the Third Variable",
        prompt:
          "The paper describes breakfast as a 'contributing factor' to achievement. In this diagram, which element could create a breakfast–achievement link even if breakfast itself changed nothing?",
        type: "single",
        options: options([
          "Family circumstances",
          "Eating breakfast",
          "Science score",
        ]),
        accepted: ["A"],
        alternatives: [],
        hint: "Look for an element with arrows into both of the other two.",
        explanation:
          "Family circumstances such as income, parental education, routines and supervision can shape both whether a teenager eats breakfast and how well they do at school. The study measured one family index, but routines and supervision were not measured, and a single snapshot cannot show which came first. When the observed link is only r = 0.050, a modest third-variable path could account for much of it.",
        misconceptions: {
          B: "Breakfast is one end of the observed link. The question asks what could produce the link without breakfast mattering.",
          C: "Science scores are the outcome. They cannot explain why breakfast eaters differ.",
        },
        reveal: "interpretation",
        evidence: [
          "Breakfast and achievement: r = 0.050.",
          "The authors call breakfast a contributing factor to achievement.",
          "The study design was cross-sectional.",
        ],
        scene: {
          version: 1,
          kind: "flow",
          title: "One possible path behind the link",
          instruction:
            "Inspect the arrows, then tap the element that could produce the link on its own.",
          description:
            "A teaching diagram of a possible third-variable path. The dashed relationships are illustrations, not measured effects.",
          provenance: illustration(
            "Teaching diagram of a possible confounding path. Only the breakfast–achievement correlation is reported by the study.",
          ),
          nodes: [
            item(
              "family-circumstances",
              "Family circumstances",
              "Income, parental education, daily routines and supervision. The study measured one composite index; routines and supervision were not measured.",
              illustration(
                "Conceptual node for a possible confounder, not a measured path.",
              ),
              0,
            ),
            item(
              "eats-breakfast",
              "Eating breakfast",
              "Reported yes or no before school.",
              summary(["item"]),
              1,
            ),
            item(
              "science-score",
              "Science score",
              "Scaled science achievement score.",
              summary(["method"]),
              2,
            ),
          ],
          edges: [
            {
              from: "family-circumstances",
              to: "eats-breakfast",
              label: "could shape",
              at: "setup",
            },
            {
              from: "family-circumstances",
              to: "science-score",
              label: "could shape",
              at: "setup",
            },
            {
              from: "eats-breakfast",
              to: "science-score",
              label: "observed r = 0.050",
              at: "setup",
            },
          ],
          responses: [
            {
              optionId: "A",
              label: "Family",
              targetIds: ["family-circumstances"],
            },
            {
              optionId: "B",
              label: "Breakfast",
              targetIds: ["eats-breakfast"],
            },
            { optionId: "C", label: "Score", targetIds: ["science-score"] },
          ],
          resolution: resolution(
            "confounder-resolution",
            "A correlation cannot rule out a common cause",
            "The authors themselves note that the cross-sectional design prevents a causal conclusion and call for longitudinal or experimental studies.",
            summary(["limits"]),
          ),
        },
        responseStyle: "tap",
        refs: ["results", "table1", "limits", "item", "method"],
        writtenReasoning: false,
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "Judge the Advice",
        prompt:
          "The paper says parents and educators should help adolescents know that breakfast has positive impacts on achievement and build the habit. Does this study support that advice?",
        type: "single",
        options: options([
          "Yes. The correlation is significant at p < 0.001 with 8,000 students.",
          "No. The link is tiny, breakfast was one yes/no item that 93% answered yes, the data are a single snapshot, and family factors could explain it.",
          "Yes. Because almost every student eats breakfast, the habit must be what drives achievement.",
        ]),
        accepted: ["B"],
        alternatives: [],
        hint: "List what an intervention claim needs: a meaningful size, a good measure, and evidence that changing breakfast changes scores.",
        explanation:
          "Advice to change behaviour needs evidence that changing breakfast changes achievement. This study offers a very small association (about 0.25% of variation), a crude yes/no measure with only 6.59% answering no, one time point, and no way to rule out family factors. It can motivate an experiment or a longitudinal study, not a recommendation.",
        misconceptions: {
          A: "Significance with 8,000 students only shows the association is not zero. It is neither large nor causal.",
          C: "A habit almost everyone shares cannot explain differences between students, and how common it is says nothing about its effect.",
        },
        reveal: "interpretation",
        evidence: [
          "93.41% of students said they ate breakfast before school.",
          "Breakfast and achievement: r = 0.050, N = 8,000.",
          "The design was cross-sectional.",
        ],
        scene: {
          version: 1,
          kind: "connections",
          title: "Weigh the evidence against the advice",
          instruction:
            "Inspect each piece of evidence, then connect the verdict it supports.",
          description:
            "Four facts from the study sit beside the recommendation the authors made.",
          provenance: summary(["results", "table1", "limits", "advice"]),
          actionLabel: "Connect a verdict",
          anchors: [
            item(
              "size",
              "Size of the link",
              "Breakfast and achievement: r = 0.050, marked p < 0.001, N = 8,000.",
              reported(["table1"], "Correlation as reported in Table 1."),
            ),
            item(
              "measure",
              "The breakfast measure",
              "One yes/no item. 93.41% said yes; 6.59% said no.",
              reported(
                ["item", "results"],
                "Measure and percentages as reported in the methods and results.",
              ),
            ),
            item(
              "design",
              "The design",
              "One time point. The authors say this prevents a causal conclusion.",
              summary(["limits"]),
            ),
            item(
              "advice-claim",
              "The recommendation",
              "Help adolescents know breakfast has positive impacts on achievement and develop the habit.",
              summary(["advice"]),
            ),
          ],
          responses: [
            {
              optionId: "A",
              label: "Supported by significance",
              targetIds: ["size", "advice-claim"],
            },
            {
              optionId: "B",
              label: "Not supported yet",
              targetIds: ["size", "measure", "design", "advice-claim"],
            },
            {
              optionId: "C",
              label: "Supported by prevalence",
              targetIds: ["measure", "advice-claim"],
            },
          ],
          resolution: resolution(
            "advice-resolution",
            "A tiny correlation cannot carry a recommendation",
            "The study describes a small association. Testing the advice needs an experiment or a longitudinal design with a better breakfast measure.",
            summary(["limits"]),
          ),
        },
        refs: ["advice", "results", "table1", "limits", "item"],
        writtenReasoning: false,
      },
    ],
    bonus: {
      id: "bonus",
      stage: "Bonus",
      title: "Who Are the Skippers?",
      prompt:
        "Only 6.59% of the 8,000 students said they skipped breakfast. Why does this lopsided split matter for comparing breakfast eaters with skippers?",
      type: "single",
      options: options([
        "The skipper group is small, about 527 students, and may differ from everyone else in many ways besides breakfast.",
        "It does not matter. With 8,000 students overall, every comparison is precise and fair.",
        "It proves breakfast is beneficial, because most students choose it.",
      ]),
      accepted: ["A"],
      alternatives: [],
      hint: "Subtract the breakfast eaters from the total, then ask what else might be unusual about that group.",
      explanation:
        "8,000 − 7,473 = 527 students said no. Any difference between groups rests on this small, self-selected minority, whose circumstances (illness, early travel, family stress) could differ in ways unrelated to food. A large total does not make that comparison balanced.",
      misconceptions: {
        B: "The total is large, but the comparison depends heavily on the much smaller group that said no.",
        C: "Popularity is not evidence of benefit.",
      },
      reveal: "bonus",
      evidence: [
        "7,473 of 8,000 students (93.41%) said they ate breakfast before school.",
      ],
      scene: null,
      refs: ["results", "method"],
      writtenReasoning: false,
    },
  },
};
