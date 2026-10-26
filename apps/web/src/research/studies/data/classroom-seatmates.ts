// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/rohrer-2021-seating-friendships.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about randomised seating, counting friendship, points against percent, pair types, scale dependence and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-classroom-seatmates",
    title: "Proximity and Friendship in Classrooms",
    briefing:
      "Researchers randomised who sat next to whom in school classrooms for a semester. Decide what that lets them conclude, read how much friendship rose for different pairs, and judge how far the result travels.",
    source: "generated",
    paper: {
      title:
        "Proximity can induce diverse friendships: A large randomized classroom experiment",
      authors: "Rohrer, Keller & Elwert (2021)",
      journal: "PLOS ONE 16(8): e0255097",
      url: "https://doi.org/10.1371/journal.pone.0255097",
      limitations: [
        "The study took place in less prosperous rural schools in one country, among children who already knew each other well.",
        "Whether effects differ by similarity depends on the scale used: the same push toward friendship looks smaller in percentage points when the starting chance is low.",
        "Effects for pairs from different ethnic groups were uncertain because there were few such pairs.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 3,
        excerpt:
          "Classroom-seating charts were randomized for the duration of the fall semester (September 2017 through January 2018). Outcome variables were collected through student surveys between February and April 2018.",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "students were asked to nominate up to 5 of their “best friends” within the classroom as part of a written 45-minute in-class survey.",
      },
      {
        id: "e3",
        page: 5,
        excerpt:
          "come is students’ reciprocated friendships, coded = 1 if both dyad members nominated each other as best friends and = 0 otherwise.",
      },
      {
        id: "e4",
        page: 9,
        excerpt:
          "probability of a manifest friendship by 7.0 percentage points (CI95: [4.6; 9.4]), from 15.3 per- cent to 22.3 percent.",
      },
      {
        id: "e5",
        page: 11,
        excerpt:
          "Being seated next to each other increased the probability of a friendship among mixed-gender dyads by AMEmixed gender = 2.3 percentage points (CI95: [1.0, 3.9]), among all-female dyads by AMEboth girls = 9.3 percentage points (CI95: [4.0, 14.8]); and among all-male dyads by AMEboth boys = 13.1 percentage points (CI95: [8.0, 18.3]).",
      },
      {
        id: "e6",
        page: 12,
        excerpt:
          "Randomly seating boys and girls next to each other doubled their probability of nominating each other as best friends (from less than 2 to 4 percentage points).",
      },
      {
        id: "e7",
        page: 9,
        excerpt:
          "We did not find evidence that similarity modified the deskmate effect with respect to the latent continuous friendship propensity",
      },
      {
        id: "e8",
        page: 9,
        excerpt:
          "Support for the modification-by-similarity hypothesis was scale dependent, as is often the case in non-linear probability models (see Methods).",
      },
      {
        id: "e9",
        page: 13,
        excerpt:
          "It remains, of course, an open question whether our findings generalize to other settings and countries.",
      },
      {
        id: "e10",
        page: 13,
        excerpt:
          "Our study took place in a less prosperous area of rural Hungary, where students’ standardized reading and math scores fell below the national average, and fewer parents had graduated from college.",
      },
      {
        id: "e11",
        page: 2,
        excerpt:
          "in groups that already know each other well (from 1st grade onwards).",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Why Randomise Seats?",
        type: "single",
        prompt:
          "The team could have simply asked whether children who sit together are friends. Why randomise the seating charts instead?",
        evidence: [
          "Seating charts in 182 classrooms were set at random for one semester.",
          "Ordinarily, teachers decide most seating.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Random seating separates proximity from children choosing to sit with existing friends.",
          },
          {
            id: "o2",
            text: "Random seating exposes each child to every partner during the semester.",
          },
          {
            id: "o3",
            text: "Random seating balances the final number of friendships by assigning a friend to each child.",
          },
          {
            id: "o4",
            text: "Random seating identifies the quietest classrooms by letting teachers select compatible pairs.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If children choose where to sit, what might already be true about those who sit together?",
        misconceptions: {
          o2: "Random assignment does not mean every pair sits together.",
          o3: "Assignment determines seats, not friendships.",
          o4: "Random charts remove teachers' pair selection rather than formalise it.",
        },
        explanation:
          "Randomising seating removes the self-selection that makes ordinary seating patterns uninformative, so differences in later friendships between deskmates and non-deskmates reflect being seated together.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Counting a Friendship",
        type: "single",
        prompt:
          "A friendship counted only if both children named each other, in a survey taken after the seating semester ended. Why those two choices?",
        evidence: [
          "Each child could name up to 5 best friends in the class.",
          "Surveys were given in February to April, after the autumn seating period.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Mutual naming is easier to satisfy; later measurement raises the chance that any nomination counts.",
          },
          {
            id: "o1",
            text: "Mutual naming is stricter; later measurement tests whether friendship outlasts the seats.",
          },
          {
            id: "o3",
            text: "Mutual naming confirms a pre-existing tie, making the survey's timing unimportant.",
          },
          {
            id: "o4",
            text: "Mutual naming measures proximity directly; later measurement records where children still sit.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which is more convincing: one child naming another, or both naming each other?",
        misconceptions: {
          o2: "Requiring both nominations is stricter than accepting one.",
          o3: "Reciprocation does not show when a friendship began.",
          o4: "The outcome is friendship, not current seating distance.",
        },
        explanation:
          "The main outcome was reciprocated best-friend nominations, coded only when both named each other, measured after the seating semester.",
        refs: ["e1", "e2", "e3"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "From 15% to 22%",
        type: "single",
        prompt:
          "Sitting together raised the chance of a mutual friendship from about 15% to about 22%. How should that change be described?",
        evidence: [
          "Increase: 7.0 percentage points, interval 4.6 to 9.4.",
          "2,996 students analysed in 182 classrooms.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "About 7% relative growth, because subtracting 15 from 22 gives the percentage increase.",
          },
          {
            id: "o3",
            text: "About 22% relative growth, because the final probability is the size of the treatment effect.",
          },
          {
            id: "o1",
            text: "7 percentage points, which is nearly half as much again as the starting chance, with an interval well above zero.",
          },
          {
            id: "o4",
            text: "About 15 percentage points, because the starting probability defines the treatment effect.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Distinguish percentage points from a percent change.",
        misconceptions: {
          o2: "Subtraction gives percentage points; relative growth divides by the starting chance.",
          o3: "The final level is not the change from baseline.",
          o4: "The effect is the difference between the two probabilities.",
        },
        explanation:
          "The probability rose 7.0 percentage points (4.6 to 9.4), from 15.3% to 22.3%, which is roughly a 46% relative increase.",
        refs: ["e4"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Boys, Girls and Mixed Pairs",
        type: "single",
        prompt:
          "Mixed boy–girl pairs gained only 2.3 points, yet the authors say seating boys and girls together doubled their chance of friendship. Can both be true?",
        evidence: [
          "Increase in percentage points from sitting together, by pair type, with 95% intervals.",
          "Mixed pairs rarely named each other as best friends to begin with.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Gain from sitting together",
          instruction:
            "Compare the three gains, then think about where each type of pair started.",
          description:
            "Average increase in the chance of a mutual friendship, in percentage points, with 95% intervals.",
          provenance: {
            kind: "reported",
            refs: ["e5"],
            note: "Average marginal effects as printed in the results.",
          },
          measure: "Percentage points",
          min: 0,
          max: 20,
          reference: {
            value: 0,
            label: "No gain",
          },
          band: null,
          estimates: [
            {
              id: "mixed",
              label: "Boy–girl pairs",
              detail: "Mixed-gender pairs.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 2.3,
              lower: 1,
              upper: 3.9,
            },
            {
              id: "girls",
              label: "Two girls",
              detail: "All-female pairs.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 9.3,
              lower: 4,
              upper: 14.8,
            },
            {
              id: "boys",
              label: "Two boys",
              detail: "All-male pairs.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 13.1,
              lower: 8,
              upper: 18.3,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Small in points, large relative to a low start",
            detail:
              "Mixed pairs gained only about 2 points, but from under 2% that roughly doubles their chance.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e5", "e6"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o2",
              label: "Contradiction",
              targetIds: ["mixed"],
            },
            {
              optionId: "o3",
              label: "Mixed pairs largest",
              targetIds: ["mixed"],
            },
            {
              optionId: "o4",
              label: "No effect for mixed",
              targetIds: ["mixed"],
            },
            {
              optionId: "o1",
              label: "Both true",
              targetIds: ["mixed"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "No; doubling a probability requires a rise of 100 percentage points regardless of its starting level.",
          },
          {
            id: "o3",
            text: "Yes; doubling means mixed pairs had the largest percentage-point gain.",
          },
          {
            id: "o4",
            text: "No; a gain under 3 percentage points is too small to represent a change in friendship probability.",
          },
          {
            id: "o1",
            text: "Yes; a small point gain can double a probability that starts near 2%.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What happens to a small number when it gains 2 points?",
        misconceptions: {
          o2: "Doubling is a relative change, not a fixed point increase.",
          o3: "A larger relative increase can coexist with a smaller point gain.",
          o4: "Small absolute gains can still be real changes in probability.",
        },
        explanation:
          "Mixed-gender pairs gained 2.3 points (1.0 to 3.9), which took them from under 2% to 4%, doubling their chance. Same-gender pairs started higher and gained more points.",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Same Push, Different Points",
        type: "single",
        prompt:
          "On the model's underlying scale, sitting together pushed all kinds of pairs toward friendship by about the same amount. Yet in percentage points, similar pairs gained more. How can both be true?",
        evidence: [
          "The model estimates an underlying tendency toward friendship, which is then turned into a probability.",
          "Similar pairs, such as same-gender pairs, start with a higher chance of friendship.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Equal changes on the model scale must produce equal point gains.",
          },
          {
            id: "o1",
            text: "Equal changes on a nonlinear scale translate to different point gains at different baselines.",
          },
          {
            id: "o3",
            text: "Similar pairs received a stronger seating treatment, so model-scale effects must also be larger.",
          },
          {
            id: "o4",
            text: "The point differences show proximity affected only similar pairs, despite the common model-scale shift.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Is it easier to move 2% by a few points, or 20%?",
        misconceptions: {
          o2: "The conversion from the underlying scale to probability is nonlinear.",
          o3: "The finding describes similar model-scale effects, not stronger assignment for similar pairs.",
          o4: "Smaller point gains for dissimilar pairs do not imply no effect.",
        },
        explanation:
          "The authors found no evidence that similarity changed the effect on the underlying friendship tendency, but differences in percentage points, which they describe as scale dependent, as is common in such models.",
        refs: ["e7", "e8"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Would It Work Elsewhere?",
        type: "single",
        prompt:
          "A city wants to use random seating to build friendships between new students who have never met. What does this study suggest?",
        evidence: [
          "Schools were in a less prosperous rural area of one country.",
          "Classmates had usually known each other since first grade.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Directly applicable, since random assignment makes prior acquaintance irrelevant to generalisation.",
          },
          {
            id: "o3",
            text: "Unpromising, since an effect among classmates implies no effect among students who have never met.",
          },
          {
            id: "o4",
            text: "Directly applicable wherever seating is random, since a large sample removes regional differences.",
          },
          {
            id: "o1",
            text: "It is a promising lead, but the children already knew each other and lived in one rural region; effects among strangers or elsewhere were not tested.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How do the new students differ from the children in the study?",
        misconceptions: {
          o2: "Randomisation supports the comparison within this sample, not transfer to strangers.",
          o3: "An untested population is not evidence of no effect there.",
          o4: "Sample size does not establish transfer across settings.",
        },
        explanation:
          "The authors say whether the findings generalise to other settings and countries remains open. Their sample was in less prosperous rural schools, among children who already knew each other well.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Randomly seating schoolchildren next to each other for a semester raised the chance that two children named each other as best friends from about 15% to 22%. Mixed boy–girl pairs gained only about 2 points but doubled their low starting chance. The schools were rural, in one country, among children who already knew each other.",
};
