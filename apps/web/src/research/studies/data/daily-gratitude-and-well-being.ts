// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/unanue-2019-gratitude-life-satisfaction.pdf
// Revised 26 October 2026: placeholder scene and lookup questions replaced by decisions about design, effect size, direction, dropout and causation.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-daily-gratitude-and-well-being",
    title:
      "The Reciprocal Relationship Between Gratitude and Life Satisfaction: Evidence From Two Longitudinal Field Studies",
    briefing:
      "Decide how to test whether gratitude and life satisfaction lead to each other over time, and what the results can and cannot show.",
    source: "generated",
    paper: {
      title:
        "The Reciprocal Relationship Between Gratitude and Life Satisfaction: Evidence From Two Longitudinal Field Studies",
      authors: "Unanue, Gomez Mella & Cortez et al. (2019)",
      journal: "Frontiers in Psychology 10: 2480",
      url: "https://doi.org/10.3389/fpsyg.2019.02480",
      limitations: [
        "Many respondents dropped out: about 22% of those who started completed all three waves in each study, and in Study 2 dropouts had lower gratitude and life satisfaction.",
        "The results do not provide conclusive evidence for causality; a third variable may be involved.",
        "Participants were all Chilean working adults, so caution is needed in generalising to other cultures.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 6,
        excerpt:
          "we collected full panel data in a three-wave cross-lagged longitudinal design with 1 month between waves, among a wide sample of Chilean working adults.",
      },
      {
        id: "e2",
        page: 7,
        excerpt:
          "Thus, all constructs were represented as potential antecedents and as potential consequences of the other constructs, while controlling for stability effects.",
      },
      {
        id: "e3",
        page: 5,
        excerpt:
          "CLPM allows “looking at autoregressive effects (linking a variable at earlier time points to itself at later time points) and cross-lagged effects (linking two different variables across time)”",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Supporting H1, we found that gratitude at T1 was a positive prospective predictor of life satisfaction at T2: β = 0.10 (95% CI: 0.03, 0.18), p < 0.01.",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "Supporting H2, life satisfaction at T1 was a positive prospective predictor of gratitude at T2: β = 0.11 (95% CI 0.03, 0.19), p < 0.01.",
      },
      {
        id: "e6",
        page: 7,
        excerpt:
          "We also found that life satisfaction at T1 was a positive prospective predictor of life satisfaction at T2 [β = 0.76 (95% CI 0.69, 0.83), p < 0.001] and gratitude at T1 was a positive prospective predictor of gratitude at T2 [β = 0.78 (95% CI 0.71, 0.86), p < 0.001].",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "Thus, the strength of the link from gratitude to life satisfaction is not significantly different from the strength of the link from life satisfaction to gratitude.",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "Seven hundred and twenty-five participants (52.1% male) between the ages of 21 and 72 years (mean age = 38.30; SD = 10.01) completed the T1 measures.",
      },
      {
        id: "e9",
        page: 6,
        excerpt:
          "In total, 161 respondents (54.7% male) between the ages of 21 and 72 (mean age = 40.65; SD = 10.50) answered the three waves (22.21% of Wave 1).",
      },
      {
        id: "e10",
        page: 8,
        excerpt:
          "Finally, 421 respondents (54.4% male) between the ages of 24 to 71 (mean age = 38.70; SD = 9.63) answered the three waves (22.9% of Wave 1).",
      },
      {
        id: "e11",
        page: 8,
        excerpt:
          "Our analysis suggests that younger participants as well as respondents with lower gratitude and life satisfaction were especially likely to drop the survey.",
      },
      {
        id: "e12",
        page: 11,
        excerpt:
          "However, these results do not provide conclusive evidence for causality. A third variable may be involved.",
      },
      {
        id: "e13",
        page: 11,
        excerpt:
          "although we sampled adults from a non-Western country, the participants were all from Chile.",
      },
      {
        id: "e14",
        page: 3,
        excerpt:
          "Experimental studies are the strongest evidence for causality between gratitude and life satisfaction.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "Three Waves, Both Scales",
        type: "single",
        prompt:
          "Why did the researchers measure both gratitude and life satisfaction at every wave, rather than gratitude once and satisfaction once later?",
        evidence: [
          "Study 1: three waves, 1 month apart. Study 2: three waves, 3 months apart.",
          "Both questions were answered by the same people at each wave.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Measuring both at each wave lets each be tested as a predictor and as an outcome, so both directions can be examined.",
          },
          {
            id: "o2",
            text: "It makes the design experimental, so cause can be proved.",
          },
          {
            id: "o3",
            text: "It lets the team average the three waves into one score.",
          },
          {
            id: "o4",
            text: "It guarantees that no participants will drop out.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "The question is about a relationship in both directions. What would you need to measure at each point?",
        misconceptions: {
          o2: "Nobody was assigned to a condition. Measuring more often does not turn a survey into an experiment.",
          o3: "The point of repeated waves is to look at change and order, not to average them away.",
          o4: "Dropout was large; about 22% of those who started completed all three waves.",
        },
        explanation:
          "The model treats each construct as both an antecedent and a consequence of the other, which needs both measured at every wave. Prospective links are a requirement for causality but do not test it directly.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Why Include Stability?",
        type: "single",
        prompt:
          "The model also links gratitude at one wave to gratitude at the next, and satisfaction to satisfaction. The question is about links between the two. Why include these?",
        evidence: [
          "People who are grateful now are likely to be grateful a month later.",
          "The same holds for life satisfaction.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Without them, a link between earlier gratitude and later satisfaction could simply reflect that both are stable traits, not a real lagged effect.",
          },
          {
            id: "o2",
            text: "Stability links are needed because gratitude and satisfaction are the same construct.",
          },
          {
            id: "o3",
            text: "They make the cross-lagged links larger, which strengthens the hypothesis.",
          },
          {
            id: "o4",
            text: "They are only included to improve the model's appearance.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What else could connect Wave 1 gratitude to Wave 2 satisfaction, other than gratitude doing something?",
        misconceptions: {
          o2: "Factor analyses showed they are two different constructs.",
          o3: "Controlling for stability usually makes cross-lagged links smaller, which is the point of a stricter test.",
          o4: "They change what the cross-lagged links mean by holding earlier levels constant.",
        },
        explanation:
          "Cross-lagged panel models include autoregressive paths so that each cross-lagged effect shows what one construct adds beyond the other's own earlier level. They describe the model as controlling for stability effects.",
        refs: ["e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Small Links, Big Stability",
        type: "single",
        prompt:
          "In Study 1, the links between gratitude and satisfaction were significant. How do they compare with the stability links, and what does that mean?",
        evidence: [
          "Standardised paths from Wave 1 to Wave 2 in Study 1.",
          "Higher values mean one score predicts the other more strongly.",
        ],
        scene: {
          version: 1,
          kind: "association",
          title: "Paths from Wave 1 to Wave 2",
          instruction:
            "Compare the four paths, then choose what the pattern means.",
          description:
            "Standardised path coefficients (β) in Study 1, 725 participants analysed.",
          provenance: {
            kind: "reported",
            refs: ["e4", "e5", "e6"],
            note: "Paths as printed in the Study 1 results.",
          },
          pairs: [
            {
              id: "g-ls",
              label: "Gratitude to later satisfaction",
              detail: "Cross-lagged.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e4"],
                note: "Standardised path as printed in the Study 1 results.",
              },
              x: "Gratitude, Wave 1",
              y: "Life satisfaction, Wave 2",
              statistic: "beta",
              value: 0.1,
              n: 725,
            },
            {
              id: "ls-g",
              label: "Satisfaction to later gratitude",
              detail: "Cross-lagged.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Standardised path as printed in the Study 1 results.",
              },
              x: "Life satisfaction, Wave 1",
              y: "Gratitude, Wave 2",
              statistic: "beta",
              value: 0.11,
              n: 725,
            },
            {
              id: "ls-ls",
              label: "Satisfaction to later satisfaction",
              detail: "Stability.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Standardised path as printed in the Study 1 results.",
              },
              x: "Life satisfaction, Wave 1",
              y: "Life satisfaction, Wave 2",
              statistic: "beta",
              value: 0.76,
              n: 725,
            },
            {
              id: "g-g",
              label: "Gratitude to later gratitude",
              detail: "Stability.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Standardised path as printed in the Study 1 results.",
              },
              x: "Gratitude, Wave 1",
              y: "Gratitude, Wave 2",
              statistic: "beta",
              value: 0.78,
              n: 725,
            },
          ],
          resolution: {
            id: "resolution",
            label: "Reliable, but small next to stability",
            detail:
              "Each cross-lagged path is about 0.1, while each score predicts itself at about 0.77. Earlier gratitude adds a little to later satisfaction beyond satisfaction's own earlier level, and the reverse.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e4", "e5", "e6"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Small beyond stability",
              targetIds: ["g-ls", "ls-g", "ls-ls", "g-g"],
            },
            {
              optionId: "o2",
              label: "Large effects",
              targetIds: ["g-ls", "ls-g"],
            },
            {
              optionId: "o3",
              label: "Gratitude stronger",
              targetIds: ["g-ls"],
            },
            {
              optionId: "o4",
              label: "Stability unimportant",
              targetIds: ["ls-ls", "g-g"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "Each cross-lagged link is small (about 0.1) next to the stability links (about 0.77): earlier gratitude or satisfaction adds only a little beyond a person's own earlier score.",
          },
          {
            id: "o2",
            text: "The cross-lagged links are large, because both are significant.",
          },
          {
            id: "o3",
            text: "Gratitude drives satisfaction more than the reverse, because its path is listed first.",
          },
          {
            id: "o4",
            text: "Stability does not matter, because the cross-lagged links are the hypotheses.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the size of the two cross-lagged paths with the two stability paths.",
        misconceptions: {
          o2: "Significance does not mean large. At about 0.1, each link is small next to stability.",
          o3: "The two paths are 0.10 and 0.11, and the authors found they were not significantly different.",
          o4: "Stability is what the cross-lagged links are measured beyond; it explains most of the later scores.",
        },
        explanation:
          "The cross-lagged paths are 0.10 and 0.11, while the stability paths are 0.76 and 0.78. The links are reliable but small once each score's own earlier level is taken into account.",
        refs: ["e4", "e5", "e6"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Which Direction Is Stronger?",
        type: "single",
        prompt:
          "The authors forced the two cross-lagged paths to be equal, and the model did not fit significantly worse (p = 0.760). What does that show?",
        evidence: [
          "Gratitude to later satisfaction: β = 0.10. Satisfaction to later gratitude: β = 0.11.",
          "Model comparison: equal paths against free paths, p = 0.760.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "There is no evidence that one direction is stronger; the two links are about equal in this sample.",
          },
          {
            id: "o2",
            text: "It proves the two true effects are exactly identical.",
          },
          {
            id: "o3",
            text: "It shows gratitude causes satisfaction but not the reverse.",
          },
          {
            id: "o4",
            text: "It shows the model is wrong, since it fit worse.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "A non-significant difference means the data cannot separate the two. Does that prove they are identical?",
        misconceptions: {
          o2: "Failing to find a difference does not prove there is none; it only means the data do not show one.",
          o3: "The test found the two paths not different, which cuts against a one-way story.",
          o4: "The equal-paths model did not fit significantly worse.",
        },
        explanation:
          "The constrained model was not significantly different from the free one, so the authors conclude the two links are not significantly different in strength. This is an absence of a detected difference, not proof of equality.",
        refs: ["e7"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Who Stayed In?",
        type: "single",
        prompt:
          "In both studies only about 22% of those who started completed all three waves. In Study 2, dropouts had lower gratitude and life satisfaction. What does that mean for the findings?",
        evidence: [
          "Study 1: 725 started; 161 completed all three waves.",
          "Study 2: 1,841 started; 421 completed all three waves.",
          "In Study 2, missing data were not random.",
        ],
        scene: {
          version: 1,
          kind: "timeline",
          title: "How many stayed in, Study 1",
          instruction:
            "Read how many people were left at each wave, then choose what that means.",
          description: "Respondents at each wave in Study 1.",
          provenance: {
            kind: "reported",
            refs: ["e8", "e9"],
            note: "Counts as printed in the participants section.",
          },
          events: [
            {
              id: "t1",
              label: "Wave 1",
              detail: "All who started.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e8"],
                note: "Count as printed in the Study 1 participants section.",
              },
              when: "Month 0",
              n: 725,
            },
            {
              id: "t3",
              label: "All three waves",
              detail: "Completed every wave.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Count as printed in the Study 1 participants section.",
              },
              when: "Month 2",
              n: 161,
            },
          ],
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Fits stayers best",
              targetIds: ["t1", "t3"],
            },
            {
              optionId: "o2",
              label: "Dropout irrelevant",
              targetIds: ["t1"],
            },
            {
              optionId: "o3",
              label: "Dropout proves effect",
              targetIds: ["t3"],
            },
            {
              optionId: "o4",
              label: "Both studies invalid",
              targetIds: ["t1", "t3"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "The results may fit the people who stayed in better than everyone who started, especially in Study 2, where dropouts differed on the very variables studied.",
          },
          {
            id: "o2",
            text: "It does not matter, because thousands of people started.",
          },
          {
            id: "o3",
            text: "Dropout shows that low gratitude causes people to quit surveys.",
          },
          {
            id: "o4",
            text: "Both studies are invalid and should be ignored.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Were the people who left like the people who stayed?",
        misconceptions: {
          o2: "A large first wave does not help if the people who left differ from those who stayed.",
          o3: "Dropout was related to lower scores, but that does not show gratitude caused it, and it is not the paper's question.",
          o4: "The authors used a method for handling missing data and the findings still matter; the point is caution, not dismissal.",
        },
        explanation:
          "Younger respondents and those with lower gratitude and life satisfaction were more likely to drop out of Study 2, and missing data there were not completely random. The estimates are therefore more secure for those who stayed.",
        refs: ["e8", "e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "A Workplace Programme?",
        type: "single",
        prompt:
          "A company wants to run a gratitude programme to raise staff life satisfaction and cites this study. What is the best-supported reply?",
        evidence: [
          "Participants: Chilean working adults who answered surveys at three times.",
          "Nobody was assigned to practise gratitude.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Earlier gratitude predicted later satisfaction slightly, but the design cannot prove it causes it; trials that assign gratitude practice are stronger evidence.",
          },
          {
            id: "o2",
            text: "The study proves gratitude raises life satisfaction, so the programme will work.",
          },
          {
            id: "o3",
            text: "The study shows gratitude only works in Western countries.",
          },
          {
            id: "o4",
            text: "The study is useless because it was not an experiment.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Did anyone assign people to practise gratitude? What would a third variable do to the link?",
        misconceptions: {
          o2: "The authors state the results are not conclusive evidence for causality and a third variable may be involved.",
          o3: "The link appeared in Chile, a non-Western country; the study does not say it fails elsewhere.",
          o4: "Prospective links are a key requirement for causality even though they do not test it directly.",
        },
        explanation:
          "The authors say that prospective designs do not test causality directly, that their results do not provide conclusive evidence for it, and that experiments are the strongest evidence. They also warn about generalising beyond Chile.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In two studies of Chilean working adults, gratitude predicted later life satisfaction and the reverse, with small links of about the same size beside very strong stability. The studies lost about three quarters of their participants and cannot show cause. The authors suggest caution in applying the findings to other cultures.",
};
