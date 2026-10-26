// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/gaube-2018-emoticon-hand-hygiene.pdf
// Revised 26 October 2026: answers were readable from the evidence lines; now decisions about comparisons, assignment, interactions and measures.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-hand-washing-in-restrooms",
    title: "Prepared study: Emoticon feedback and hand hygiene",
    briefing:
      "A hospital ward fitted screens and pictures above hand-rub dispensers in eight patient rooms. Work out which comparison isolates the message, why rooms were assigned at random, how to read an interaction, how far a fading effect can be pushed, and what the outcome measure does and does not show.",
    source: "generated",
    paper: {
      title:
        "How a smiley protects health: A pilot intervention to improve hand hygiene in hospitals by activating injunctive norms through emoticons",
      authors: "Gaube, Tsivrikos, Dollinger et al. (2018)",
      journal: "PLOS ONE 13(5): e0197465",
      url: "https://doi.org/10.1371/journal.pone.0197465",
      limitations: [
        "Only eight patient rooms took part, two per condition.",
        "Some sensor data were missing and were filled in by multiple imputation.",
        "Hospital staff, patients and visitors could not be told apart.",
        "The outcome counts dispenser use per sensor activation and is not a compliance rate; it says nothing about the quality of hand hygiene.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "In the emoticon condition, the screen at the device turned on whenever the motion sensor was activated (i.e., when people entered or left the room), displaying a frowny face.",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "In the first neutral control condition, the screen turned on whenever the motion sensor was activated, displaying a neutral image of a flower that changed to a slightly different flower when the dispenser was used",
      },
      {
        id: "e3",
        page: 6,
        excerpt:
          "In the second neutral control condition, there were no changing screens. Instead, a stationary image of a flower was presented at all times.",
      },
      {
        id: "e4",
        page: 6,
        excerpt:
          "The setup of the eye condition was identical to the Picture-Neutral condi- tion, except that an image of human eyes was presented.",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "two rooms each, making up the total of eight rooms, were randomly allocated to one of the four conditions (Screen-Emoticons, Screen-Neutral, Picture-Eyes, Pic- ture-Neutral).",
      },
      {
        id: "e6",
        page: 9,
        excerpt:
          "No statistically significant difference in HHE ratio between the four conditions at the baseline phase was found, F(3, 4) = 2.065, p = .248, Z2 p = .608.",
      },
      {
        id: "e7",
        page: 8,
        excerpt:
          "The ANOVA revealed a significant interaction between the phase of the experiment and the four conditions on HHE ratio, F(6, 8) = 11.128, p = .002, Z2 p = .893.",
      },
      {
        id: "e8",
        page: 8,
        excerpt:
          "The HHE data were analysed using a two-way repeated-measures ANOVA with phase (baseline vs intervention timepoint 1 vs intervention timepoint 2) as the within-subjects factor and condition (Screen-Emoticons vs Screen-Neutral vs Picture-Eyes vs Picture-Neutral) as the between-subjects factor.",
      },
      {
        id: "e9",
        page: 9,
        excerpt: "three separate one-way ANOVAs were conducted.",
      },
      {
        id: "e10",
        page: 9,
        excerpt:
          "The HHE ratio in the Screen-Emoticons group increased from 4.2% at baseline phase to 12.5% at intervention timepoint 1, which is almost a three-fold surge in hand hygiene behav- iour.",
      },
      {
        id: "e11",
        page: 9,
        excerpt:
          "However, HHE ratio decreased from 12.5% at intervention timepoint 1 to 9% at intervention timepoint 2.",
      },
      {
        id: "e12",
        page: 9,
        excerpt:
          "The HHE ratio in the Screen-Neutral condition increased from 2.7% at baseline phase to 5.3% at intervention timepoint 1.",
      },
      {
        id: "e13",
        page: 9,
        excerpt:
          "The HHE ratio remained comparatively stable within the intervention phase (5.2% and 5.6% respectively).",
      },
      {
        id: "e14",
        page: 7,
        excerpt:
          "In total, 65,907 hand hygiene opportunities (motion sensor activations) and 3,340 HHE were registered over the entire study period.",
      },
      {
        id: "e15",
        page: 11,
        excerpt: "First, the sample size of eight patient rooms was small.",
      },
      {
        id: "e16",
        page: 6,
        excerpt:
          "The dependent variable was the percentage (ratio) of hand hygiene events (HHE, i.e., using the hand-rub dispenser) among all motion sensor activations, which covers every entrance and exit of the rooms.",
      },
      {
        id: "e17",
        page: 7,
        excerpt:
          "Thus, the total number of activations also includes the traffic between beds and bathrooms.",
      },
      {
        id: "e18",
        page: 11,
        excerpt:
          "Therefore, HHE ratios measured in this study must not be misunderstood as a compliance rate, which is usually the dependent measure to evaluate interventions.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "design",
        title: "Which Comparison?",
        type: "single",
        prompt:
          "Which comparison best isolates the effect of the approving or disapproving face from the effect of simply having a screen that changes after the dispenser is used?",
        evidence: [
          "Four conditions: Screen-Emoticons, Screen-Neutral, Picture-Neutral and Picture-Eyes.",
          "Both screen conditions change their image after the dispenser is used.",
        ],
        scene: {
          version: 1,
          kind: "matrix",
          title: "What each room showed",
          instruction:
            "Compare the four conditions row by row, then pick the comparison that changes only the message.",
          description:
            "The four conditions compared on display, what happens after dispenser use, image and message.",
          provenance: {
            kind: "source-summary",
            refs: ["e1", "e2", "e3", "e4"],
            note: "Summary of the condition descriptions.",
          },
          conditions: [
            {
              id: "emo",
              label: "Screen-Emoticons",
            },
            {
              id: "sneu",
              label: "Screen-Neutral",
            },
            {
              id: "pneu",
              label: "Picture-Neutral",
            },
            {
              id: "eyes",
              label: "Picture-Eyes",
            },
          ],
          rows: [
            {
              id: "display",
              label: "Display",
              detail: "Screen or fixed picture.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e2", "e3", "e4"],
                note: "Summary of the condition descriptions.",
              },
              cells: ["Screen", "Screen", "Fixed picture", "Fixed picture"],
            },
            {
              id: "change",
              label: "Changes after dispenser use",
              detail: "Whether the image reacts.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e2", "e3", "e4"],
                note: "Summary of the condition descriptions.",
              },
              cells: [
                "Frowny to smiley",
                "Flower to another flower",
                "No change",
                "No change",
              ],
            },
            {
              id: "image",
              label: "Image",
              detail: "What is shown.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e2", "e3", "e4"],
                note: "Summary of the condition descriptions.",
              },
              cells: ["Face", "Flower", "Flower", "Human eyes"],
            },
            {
              id: "message",
              label: "Social message",
              detail: "What the image is meant to convey.",
              at: "setup",
              provenance: {
                kind: "source-summary",
                refs: ["e1", "e2", "e3", "e4"],
                note: "Summary of the condition descriptions.",
              },
              cells: [
                "Approval or disapproval",
                "None",
                "None",
                "Being watched",
              ],
            },
          ],
          resolution: {
            id: "resolution",
            label: "Two screens, one difference in message",
            detail:
              "Screen-Emoticons and Screen-Neutral share the screen and the reaction to dispenser use. Only the message differs.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e1", "e2"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o1",
              label: "Emoticons vs neutral screen",
              targetIds: ["image", "message"],
            },
            {
              optionId: "o2",
              label: "Emoticons vs baseline weeks",
              targetIds: ["display", "change"],
            },
            {
              optionId: "o3",
              label: "Eyes vs neutral picture",
              targetIds: ["image", "message"],
            },
            {
              optionId: "o4",
              label: "Neutral screen vs picture",
              targetIds: ["display", "change"],
            },
          ],
        },
        options: [
          {
            id: "o1",
            text: "Screen-Emoticons against Screen-Neutral.",
          },
          {
            id: "o2",
            text: "Screen-Emoticons against the same rooms in the baseline weeks.",
          },
          {
            id: "o3",
            text: "Picture-Eyes against Picture-Neutral.",
          },
          {
            id: "o4",
            text: "Screen-Neutral against Picture-Neutral.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Find two conditions that match on everything except the message.",
        misconceptions: {
          o2: "The baseline comparison also changes the screen, the time of year and traffic, so it cannot isolate the message.",
          o3: "That tests the watching-eyes idea, not the approval message.",
          o4: "That tests whether a changing screen helps, not whether the message matters.",
        },
        explanation:
          "Both screens react to dispenser use, so a difference between them points to the message. The authors read the smaller rise in Screen-Neutral as showing that attention from a changing screen cannot explain the whole emoticon effect.",
        refs: ["e1", "e2", "e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "design",
        title: "Random Rooms",
        type: "single",
        prompt:
          "The team assigned rooms to conditions at random instead of putting the emoticon screens where staff thought they would work best. What does random assignment buy here?",
        evidence: [
          "Eight patient rooms in one unit: two assigned to each of the four conditions.",
          "Rooms differ in traffic, patient mix and staff.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It makes it unlikely that a feature of the rooms, such as heavy traffic, lines up with one condition.",
          },
          {
            id: "o2",
            text: "It guarantees that the four groups of rooms are identical.",
          },
          {
            id: "o3",
            text: "It means staff cannot tell which rooms have screens.",
          },
          {
            id: "o4",
            text: "It removes the need for a baseline phase.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Think about what a manager's choice of rooms could bring along with it.",
        misconceptions: {
          o2: "With two rooms per condition, chance differences remain. The team also compared the baseline weeks to check.",
          o3: "Staff could see the screens; assignment does not hide them.",
          o4: "The baseline phase is still needed to see how each room behaved before the screens.",
        },
        explanation:
          "Random assignment spreads room differences across conditions by chance. With only two rooms per condition it cannot guarantee equality, so the authors also checked that baseline hand hygiene did not differ significantly between conditions.",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "results",
        title: "Reading the Interaction",
        type: "single",
        prompt:
          "The two-way analysis found a significant interaction between phase and condition. What does that tell you, and what does it leave open?",
        evidence: [
          "Phase: baseline, intervention month 1, intervention month 2.",
          "Condition: Screen-Emoticons, Screen-Neutral, Picture-Eyes, Picture-Neutral.",
          "Interaction: F(6, 8) = 11.13, p = .002.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The change across phases was not the same in every condition, but it does not say which conditions differ, so follow-up comparisons are needed.",
          },
          {
            id: "o2",
            text: "It proves that the emoticon condition beat all the others.",
          },
          {
            id: "o3",
            text: "It shows that phase and condition work independently of each other.",
          },
          {
            id: "o4",
            text: "It shows the conditions already differed before the screens were installed.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "An interaction says the effect of one factor depends on the other. Does it say how?",
        misconceptions: {
          o2: "An interaction says the pattern differs by condition. It does not identify which condition differs from which.",
          o3: "That is the opposite of an interaction.",
          o4: "A baseline difference would be tested within the baseline phase; the interaction concerns change across phases.",
        },
        explanation:
          "The interaction means the conditions did not change in the same way. The authors then ran three separate one-way analyses, one per phase, and post hoc tests to see where the differences lay.",
        refs: ["e7", "e8", "e9"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "results",
        title: "Which Claim Goes Too Far?",
        type: "single",
        prompt:
          "Look at how dispenser use moved across baseline and the two months of the intervention. Which claim goes beyond these numbers?",
        evidence: [
          "Dispenser uses per 100 sensor activations, by phase.",
          "The nine intervention weeks were analysed as two time points, month 1 and month 2.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Dispenser use by phase",
          instruction:
            "Read how each condition moved, then choose the claim the numbers do not support.",
          description:
            "Hand hygiene events per 100 sensor activations for the emoticon and neutral-screen rooms.",
          provenance: {
            kind: "reported",
            refs: ["e10", "e11", "e12", "e13"],
            note: "Percentages as printed in the results text.",
          },
          measure: "Hand hygiene events per 100 sensor activations",
          unit: "%",
          decimals: 1,
          min: 0,
          max: 15,
          values: [
            {
              id: "emo0",
              label: "Emoticon rooms, baseline",
              detail: "Eight baseline weeks.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10"],
                note: "Percentage as printed in the results text.",
              },
              value: 4.2,
            },
            {
              id: "emo1",
              label: "Emoticon rooms, month 1",
              detail: "First intervention timepoint.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e10"],
                note: "Percentage as printed in the results text.",
              },
              value: 12.5,
            },
            {
              id: "emo2",
              label: "Emoticon rooms, month 2",
              detail: "Second intervention timepoint.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e11"],
                note: "Percentage as printed in the results text.",
              },
              value: 9,
            },
            {
              id: "neu0",
              label: "Neutral screen, baseline",
              detail: "Eight baseline weeks.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e12"],
                note: "Percentage as printed in the results text.",
              },
              value: 2.7,
            },
            {
              id: "neu1",
              label: "Neutral screen, month 1",
              detail: "First intervention timepoint.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e12"],
                note: "Percentage as printed in the results text.",
              },
              value: 5.3,
            },
            {
              id: "neu2",
              label: "Neutral screen, month 2",
              detail: "Second intervention timepoint.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e13"],
                note: "Percentage as printed in the results text.",
              },
              value: 5.6,
            },
          ],
          difference: {
            from: "emo1",
            to: "emo2",
            label: "Emoticon rooms fell 3.5 points between months 1 and 2",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "Above own baseline",
              targetIds: ["emo0", "emo2"],
            },
            {
              optionId: "o2",
              label: "Neutral screens rose too",
              targetIds: ["neu0", "neu1"],
            },
            {
              optionId: "o3",
              label: "Will fall to zero",
              targetIds: ["emo1", "emo2"],
            },
            {
              optionId: "o4",
              label: "Fell between months",
              targetIds: ["emo1", "emo2"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "In month 2 the emoticon rooms were still above their own baseline.",
          },
          {
            id: "o2",
            text: "Neutral screens also coincided with higher use than at baseline, so some of the rise may come from having a screen at all.",
          },
          {
            id: "o3",
            text: "The emoticon effect will keep shrinking until it disappears.",
          },
          {
            id: "o4",
            text: "Dispenser use in the emoticon rooms fell from month 1 to month 2.",
          },
        ],
        accepted: ["o3"],
        alternatives: [],
        hint: "Which claim talks about something the study did not measure?",
        misconceptions: {
          o1: "Supported: 9.0 is above 4.2.",
          o2: "Supported: 2.7 rose to 5.3 and 5.6 in the neutral-screen rooms.",
          o4: "Supported: 12.5 fell to 9.0.",
        },
        explanation:
          "Only two intervention timepoints were analysed, so a trend to zero is a prediction, not a result. The numbers show a fall from 12.5 to 9.0 with use still above baseline; the authors call the effect rather temporary and ask for more research.",
        refs: ["e10", "e11", "e12", "e13"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c5",
        stage: "interpretation",
        title: "Many Events, Few Rooms",
        type: "single",
        prompt:
          "A reader argues that the huge number of recorded events makes the result very solid. What is the best response?",
        evidence: [
          "Over 17 weeks, the sensors registered tens of thousands of room entries and exits.",
          "Those events came from eight rooms, two per condition.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The events are clustered in only two rooms per condition, so a quirk of one room could drive a condition's result. The authors call the sample small and the study a pilot.",
          },
          {
            id: "o2",
            text: "Large event counts guarantee that results will replicate.",
          },
          {
            id: "o3",
            text: "Event counts are irrelevant because only hospital size matters.",
          },
          {
            id: "o4",
            text: "The events came from patients, so staff are not represented.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many separate rooms stand behind each condition?",
        misconceptions: {
          o2: "Counting more events from the same rooms does not add rooms; replication depends on more independent units.",
          o3: "Event counts matter for precision of each room's rate; they just do not replace more rooms.",
          o4: "The study could not tell staff, patients and visitors apart.",
        },
        explanation:
          "Tens of thousands of events came from eight rooms. The authors state the sample was small and that more rooms are needed, while arguing the measured effects were strong enough to interpret.",
        refs: ["e14", "e15"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "interpretation",
        title: "What the Measure Shows",
        type: "single",
        prompt:
          "A hospital manager announces: “The emoticons raised hand-hygiene compliance from about 4% to about 12%.” What is the best reply?",
        evidence: [
          "Outcome: dispenser uses divided by motion-sensor activations.",
          "A sensor activation is any movement past the dispenser, including trips between a bed and the bathroom.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The measure shows more dispenser use per sensor activation, not compliance with guidelines or the quality of cleaning.",
          },
          {
            id: "o2",
            text: "Correct: the ratio is the standard way to calculate compliance.",
          },
          {
            id: "o3",
            text: "The measure is useless because it ignores patients.",
          },
          {
            id: "o4",
            text: "The ratio understates compliance because every entry is counted.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Ask what is in the numerator and in the denominator.",
        misconceptions: {
          o2: "The authors state it must not be mistaken for a compliance rate.",
          o3: "The study included patients and visitors as well as staff; the problem lies in what the ratio counts.",
          o4: "The ratio is not a compliance rate in either direction, so it cannot be said to under- or overstate one.",
        },
        explanation:
          "The denominator includes every sensor activation, even trips between a bed and the bathroom, so it is not a count of hygiene opportunities. The authors warn the ratio must not be read as a compliance rate and cannot speak to cleaning quality.",
        refs: ["e16", "e17", "e18"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In an eight-room hospital pilot, rooms with a frowny-to-smiley screen used the hand-rub dispenser far more often than rooms with a neutral screen, a neutral picture or an eyes picture. The effect was largest in the first month and smaller in the second. With two rooms per condition and a measure that is not a compliance rate, the authors present it as preliminary evidence.",
};
