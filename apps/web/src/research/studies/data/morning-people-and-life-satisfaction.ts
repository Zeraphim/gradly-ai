// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/gorgol-2023-chronotype-religiosity-life-satisfaction.pdf
// Revised 26 October 2026: answers were copied from the evidence lines; now decisions about measurement, subgroups, intervals, unexplained share, causation and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-morning-people-and-life-satisfaction",
    title:
      "Godless owls, devout larks: Religiosity and conscientiousness are associated with morning preference and (partly) explain its effects on life satisfaction",
    briefing:
      "Decide how to test why morning people report higher life satisfaction, and how far two surveys can explain it.",
    source: "generated",
    paper: {
      title:
        "Godless owls, devout larks: Religiosity and conscientiousness are associated with morning preference and (partly) explain its effects on life satisfaction",
      authors: "Gorgol, Łowicki & Stolarski (2023)",
      journal: "PLOS ONE 18(5): e0284787",
      url: "https://doi.org/10.1371/journal.pone.0284787",
      limitations: [
        "Both studies were cross-sectional, so the direction of cause is speculative.",
        "Everything was self-reported, and Study 1 measured belief in God with a 3-item scale of limited reliability (alpha = .64).",
        "Participants were Polish adults, mostly Catholic, and in Study 2 the pattern held only among Catholic believers.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 6,
        excerpt:
          "we used a 3-item scale to measure belief in God which in our study had rather limited reliability (Cronbach’s alpha = .64).",
      },
      {
        id: "e2",
        page: 6,
        excerpt:
          "Therefore, since this measure turned out to be suboptimal, in Study 2 we decided to both replicate and extend our preliminary findings using a more sophisticated measure of religiosity",
      },
      {
        id: "e3",
        page: 7,
        excerpt:
          "we decided to run a mediation analysis on these two subsam- ples in order to reduce potential confounding variability resulting from having a small propor- tion of other believers.",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Therefore, a total of 728 individuals participated in the study (570 Catholics and 158 non-believers).",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "The total indirect effect amounted to .05 (95% confidence intervals: .03–.08).",
      },
      {
        id: "e6",
        page: 6,
        excerpt:
          ".01 for belief in God (95% CI: .00–.03) and .04 for conscientiousness (95% CI: .01–.06).",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "The total indirect effect amounted to .01 (95% confidence intervals: .01–.02).",
      },
      {
        id: "e8",
        page: 6,
        excerpt:
          "The ratio of indirect to total effect amounted to .33; thus, approximately 33% of the effect may be explained by belief in God and conscientiousness.",
      },
      {
        id: "e9",
        page: 8,
        excerpt:
          "The ratio of indirect to total effect amounted to .28; thus, approximately 28% of the effect may be explained by religiosity and conscientiousness.",
      },
      {
        id: "e10",
        page: 9,
        excerpt:
          "Here, we propose that yet another underlying mechanism may be connected with the level of perceived social support",
      },
      {
        id: "e11",
        page: 10,
        excerpt:
          "First of all, both cur- rent studies were cross-sectional, and therefore any inferences regarding the direction of causality between the investigated variables remain speculative or, at best, are based on previ- ous research.",
      },
      {
        id: "e12",
        page: 8,
        excerpt:
          "Importantly, obtained results also remained significant only in the group of Roman Catholic believers (see Supplementary material).",
      },
      {
        id: "e13",
        page: 11,
        excerpt:
          "Similarly, the current findings should be replicated with participants of other cultural backgrounds",
      },
      {
        id: "e14",
        page: 6,
        excerpt:
          "All of the participants declared that Poland was their country of origin.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "A Shaky Measure",
        type: "single",
        prompt:
          "Study 1 measured belief in God with three questions, and the scale's reliability was low (alpha = .64). What is the likely effect on the results, and what did the team do about it?",
        evidence: [
          "Study 1: 500 adults, belief in God measured with three items.",
          "Reliability of the scale: Cronbach's alpha = .64.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Noise inflates every link; Study 2 therefore removes any need to interpret the first study.",
          },
          {
            id: "o3",
            text: "A large sample corrects low reliability, so Study 1's scale cannot understate an association.",
          },
          {
            id: "o4",
            text: "The second study kept the same brief scale, because alpha measures sample size rather than reliability.",
          },
          {
            id: "o1",
            text: "A noisy measure tends to hide links, so belief in God's role may be understated; they repeated the study with a fuller religiosity scale.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What happens to a link between two things when one of them is measured with a lot of noise?",
        misconceptions: {
          o2: "Measurement error often attenuates links, rather than uniformly inflating them.",
          o3: "Sample size does not eliminate measurement error.",
          o4: "They used a fuller measure; alpha concerns scale consistency, not sample size.",
        },
        explanation:
          "The authors called the 3-item scale suboptimal and, in Study 2, used a comprehensive 15-item measure of religiosity to replicate and extend the findings.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Dropping Smaller Groups",
        type: "single",
        prompt:
          "In Study 2, 774 adults took part but only 728 were analysed: Catholics and non-believers. What is the trade-off?",
        evidence: [
          "About 74% of participants were Roman Catholic and about 20% were non-believers.",
          "The remaining participants belonged to several very small groups.",
          "Analysed: 570 Catholics and 158 non-believers.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "It enlarges the analysed sample and makes the estimates representative of all religious traditions.",
          },
          {
            id: "o3",
            text: "Dropping a small subgroup leaves the findings equally applicable to all faiths.",
          },
          {
            id: "o1",
            text: "It avoids tiny faith subgroups but narrows the population covered by the analysis.",
          },
          {
            id: "o4",
            text: "It establishes that other faith groups cannot be studied with any common religiosity measure.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What do you gain by removing very small groups, and what do you lose?",
        misconceptions: {
          o2: "Exclusion reduced sample size and narrowed coverage.",
          o3: "Excluding faith groups changes the scope even if their share is small.",
          o4: "Small subgroups here do not establish a universal measurement impossibility.",
        },
        explanation:
          "The authors ran the mediation analysis on Catholics and non-believers to reduce confounding from a small share of other believers. The cost is that the findings say little about people of other faiths.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Who Carries the Effect?",
        type: "single",
        prompt:
          "Study 1 split the indirect effect between belief in God and conscientiousness. Which reading of the intervals is best?",
        evidence: [
          "Indirect effects of morningness on life satisfaction, with 95% confidence intervals.",
          "Study 2 used a different religiosity scale, so its total is on a different footing.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Indirect effects",
          instruction:
            "Compare the intervals with zero and with each other, then choose the best reading.",
          description:
            "Indirect effect of morningness on life satisfaction through the mediators, with 95% confidence intervals.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e6", "e7"],
            note: "Estimates and intervals as printed in the results.",
          },
          measure: "Indirect effect",
          min: -0.02,
          max: 0.1,
          reference: {
            value: 0,
            label: "No indirect effect",
          },
          band: null,
          estimates: [
            {
              id: "s1-total",
              label: "Study 1, total",
              detail: "Through belief in God and conscientiousness.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.05,
              lower: 0.03,
              upper: 0.08,
            },
            {
              id: "s1-god",
              label: "Study 1, belief in God",
              detail: "Single mediator.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.01,
              lower: 0,
              upper: 0.03,
            },
            {
              id: "s1-con",
              label: "Study 1, conscientiousness",
              detail: "Single mediator.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.04,
              lower: 0.01,
              upper: 0.06,
            },
            {
              id: "s2-total",
              label: "Study 2, total",
              detail: "Through religiosity and conscientiousness.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e7"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.01,
              lower: 0.01,
              upper: 0.02,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Conscientiousness carries more; all effects are small",
            detail:
              "In Study 1 conscientiousness (.04) carries most of the total (.05), while belief in God (.01) has an interval touching zero. Study 2's total is only .01.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e5", "e6", "e7"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o2",
              label: "Belief in God carries it",
              targetIds: ["s1-god"],
            },
            {
              optionId: "o1",
              label: "Conscientiousness carries more; all small",
              targetIds: ["s1-total", "s1-god", "s1-con", "s2-total"],
            },
            {
              optionId: "o3",
              label: "Large indirect effects",
              targetIds: ["s1-total", "s2-total"],
            },
            {
              optionId: "o4",
              label: "Belief in God irrelevant",
              targetIds: ["s1-god"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "Belief carries most of the link; conscientiousness adds little.",
          },
          {
            id: "o1",
            text: "Conscientiousness carries more of the small indirect link; belief's interval touches zero.",
          },
          {
            id: "o3",
            text: "The indirect links are large, since intervals excluding zero establish practical importance.",
          },
          {
            id: "o4",
            text: "Belief has exactly zero contribution, because touching zero rules out every nonzero indirect effect.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare each interval with zero and with the others, and note the size of the numbers.",
        misconceptions: {
          o2: "The displayed estimates show the reverse pattern.",
          o3: "Statistical distinction from zero does not establish a large effect.",
          o4: "An interval touching zero allows uncertainty rather than proving zero.",
        },
        explanation:
          "In Study 1 conscientiousness (.04) carries most of the total indirect effect (.05), and belief in God (.01) adds a little with an interval that just reaches zero. In Study 2 the total is only .01.",
        refs: ["e5", "e6", "e7"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "What Is Left Over?",
        type: "single",
        prompt:
          "The mediators explained about 33% of the link in Study 1 and 28% in Study 2. What does that imply about the rest?",
        evidence: [
          "Share of the total effect explained by religiosity and conscientiousness: .33 in Study 1, .28 in Study 2.",
          "Both studies also controlled for age and gender.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Most of the association remains unexplained by these two proposed mediators.",
          },
          {
            id: "o2",
            text: "The two mediators explain almost the whole association.",
          },
          {
            id: "o3",
            text: "The unexplained share cancels the association.",
          },
          {
            id: "o4",
            text: "The remaining share belongs to age and gender.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If a third is explained, how much is not?",
        misconceptions: {
          o2: "About 28–33% leaves roughly two-thirds or more unexplained.",
          o3: "Partial explanation does not erase the overall association.",
          o4: "Adjusted factors cannot simply be assigned the remaining mediation share.",
        },
        explanation:
          "About two-thirds or more of the link remains unexplained. The authors suggest other mechanisms may be involved, such as perceived social support, and call for tests of alternative models.",
        refs: ["e8", "e9", "e10"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Do the Arrows Show Cause?",
        type: "single",
        prompt:
          "The model draws arrows from morningness to religiosity and conscientiousness to life satisfaction. What in these surveys supports the direction of those arrows?",
        evidence: [
          "Both studies were single-time online questionnaires.",
          "All measures were self-reported.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The mediation coefficients reveal the chronological order in which the measured traits developed.",
          },
          {
            id: "o1",
            text: "Nothing in the data: the order is assumed from earlier research and theory, so the results fit the model without proving it.",
          },
          {
            id: "o3",
            text: "The sample size reveals direction by making the larger correlations point toward their causes.",
          },
          {
            id: "o4",
            text: "Significant paths establish the direction by ruling out reverse links between the same variables.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Everything was measured once. What could that tell you about order?",
        misconceptions: {
          o2: "Cross-sectional coefficients do not establish temporal ordering.",
          o3: "Precision does not identify causal direction.",
          o4: "Significance does not rule out reverse causation.",
        },
        explanation:
          "The authors state that both studies were cross-sectional, so inferences about the direction of causality remain speculative or rest on earlier research, and they call for longitudinal studies and tests of alternative models.",
        refs: ["e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Would It Hold Elsewhere?",
        type: "single",
        prompt:
          "A researcher in a mostly non-religious country asks whether these findings apply to people there. What is the best answer?",
        evidence: [
          "Participants: Polish adults, about 74% Roman Catholic in Study 2.",
          "In Study 2 the mediation held in the Catholic subgroup.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Established across cultures, because the large sample makes religious context irrelevant to the link.",
          },
          {
            id: "o3",
            text: "Established for non-believers, because the mediation model showed the same pattern in every subgroup.",
          },
          {
            id: "o4",
            text: "Ruled out elsewhere, because a context-specific finding implies the link cannot occur in another country.",
          },
          {
            id: "o1",
            text: "Not established; the Polish samples and believer-specific pattern limit transfer.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who was in the samples, and what did the authors say about other cultures?",
        misconceptions: {
          o2: "More participants in one context do not establish transfer to another.",
          o3: "Study 2 did not show the same pattern in both subgroups.",
          o4: "A limited finding leaves transfer untested rather than impossible.",
        },
        explanation:
          "All participants were from Poland, most were Catholic, and in Study 2 the results remained significant only in the group of Roman Catholic believers. The authors say the findings should be replicated with participants of other cultural backgrounds.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In two surveys of Polish adults, morning-oriented people reported more religiosity, more conscientiousness and higher life satisfaction, and the two traits explained about a third or less of the link with satisfaction. The data are cross-sectional and self-reported, so direction is unproven, and in Study 2 the pattern held only among Catholic believers.",
};
