// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/ruzi-2021-narrative-perspective-science-video.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about a hidden title difference, presenters in both roles, a non-significant pairwise gap, adjustment, correlation and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-science-video-trust",
    title: "Experimental Design",
    briefing:
      "Viewers watched one of five short videos about a new ant species. Decide what the versions really differed in, read a borderline trust result, and judge what the videos did and did not change.",
    source: "generated",
    paper: {
      title:
        "Testing how different narrative perspectives achieve communication objectives and goals in online natural science videos",
      authors: "Ruzi, Lee & Smith (2021)",
      journal: "PLOS ONE 16(10): e0257866",
      url: "https://doi.org/10.1371/journal.pone.0257866",
      limitations: [
        "The scientist versions also showed the title “Dr.”, so title and narrative perspective were changed together.",
        "Only two presenters, one script and one fabricated ant story were used.",
        "Viewers came from an opt-in volunteer survey panel, not a probability sample.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 7,
        excerpt:
          "The only differences between our first- and third-person stimuli were 14 instances in the script where the person on-screen either makes an “I” or “my” statement versus saying “scientists” or “researchers”, and a “Dr.” title with their fictionalized gender-neutral name, Jaimie Miller.",
      },
      {
        id: "e2",
        page: 15,
        excerpt:
          "The finding that first-person narra- tives were perceived as more trustworthy than third-person narratives could also be attributed to the spokesperson being identified through on-screen, in-video text as “Dr.” in the first-per- son factor.",
      },
      {
        id: "e3",
        page: 7,
        excerpt:
          "Two videos were created for each treatment that included a person on-screen (one male-presenting, one-female presenting) to help control for idiosyncratic effects of the individual presenter.",
      },
      {
        id: "e4",
        page: 7,
        excerpt:
          "Each presenter recorded a video as a scientist and a third-party, appearing on- screen talking directly to the audience between 25–29% of the total runtime of the video.",
      },
      {
        id: "e5",
        page: 11,
        excerpt:
          "Trustworthiness 5.81 (0.08)a 5.61 (0.08)ab 5.40 (0.11)b 5.07 (2, 510) 0.007 (0.05) 0.019",
      },
      {
        id: "e6",
        page: 9,
        excerpt:
          "(scientist vs. third-party: P = 0.20; scientist vs. no on-screen spokesperson: P = 0.006;",
      },
      {
        id: "e7",
        page: 11,
        excerpt: "Adjusted P values account for false discovery rates.",
      },
      {
        id: "e8",
        page: 11,
        excerpt:
          "Spokesperson Expertise 6.04 (0.09)a 5.67 (0.09)b 5.63 (0.12)b 6.13 (2, 510) 0.002 (0.03) 0.023",
      },
      {
        id: "e9",
        page: 13,
        excerpt:
          "Treatment did not have a significant effect on attitudes towards natural history and museum collections research or funding (Fig 2F and 2G; Table 3).",
      },
      {
        id: "e10",
        page: 13,
        excerpt:
          "stimulus enjoyment and attitude towards funding (Pearson correlation: r = 0.42, P = 0.00).",
      },
      {
        id: "e11",
        page: 15,
        excerpt:
          "We used an opt-in volunteer-based survey panel, which was appropriate because the purpose of our study was to test the effects of experimental treatment.",
      },
      {
        id: "e12",
        page: 15,
        excerpt:
          "two scientists are not representative of the population of scientists.",
      },
      {
        id: "e13",
        page: 15,
        excerpt:
          "Additionally, we assessed a single narrative script accompanied by all the same ant visual media.",
      },
    ],
    challenges: [
      {
        id: "q1",
        stage: "Read the design",
        title: "What Else Changed?",
        type: "single",
        prompt:
          "The scientist and third-party versions were meant to differ only in who tells the story. Looking at what changed between them, what else could explain a difference in trust?",
        evidence: [
          "Scientist version: the presenter says “I” and “my” in 14 places.",
          "Third-party version: the presenter says “scientists” or “researchers” in those places.",
          "On-screen text named the presenter.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Different presenters appeared in the two versions, mixing personal likeability with narrative perspective.",
          },
          {
            id: "o3",
            text: "Different research stories appeared in the two versions, mixing topic interest with narrative perspective.",
          },
          {
            id: "o4",
            text: "No other feature differed between the versions, leaving narrative perspective isolated from title cues.",
          },
          {
            id: "o1",
            text: "The scientist version also showed the title “Dr.” on screen, so a title effect is mixed in with the change in perspective.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Read what the on-screen text said in each version.",
        misconceptions: {
          o2: "Both presenters recorded both versions.",
          o3: "The story was held constant across versions.",
          o4: "The on-screen title also changed.",
        },
        explanation:
          "Besides the “I” and “my” wording, the scientist versions identified the presenter as “Dr.” on screen. The authors note that the trust difference could also be due to that title.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "q2",
        stage: "Read the design",
        title: "Same People, Both Roles",
        type: "single",
        prompt:
          "Two presenters, a man and a woman, each recorded both a scientist version and a third-party version. What does that buy?",
        evidence: [
          "Five videos: scientist (two presenters), third party (same two presenters), and no presenter on screen.",
          "Each presenter appeared for about a quarter of the video.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It keeps presenter identity from being exclusive to either storytelling role.",
          },
          {
            id: "o2",
            text: "It independently tests a gender effect with enough different presenters to represent men and women generally.",
          },
          {
            id: "o3",
            text: "It makes the two roles representative of scientists across research topics.",
          },
          {
            id: "o4",
            text: "It doubles the analysed audience, since each presenter contributes an independent participant sample twice.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If one presenter only played the scientist and another only the third party, what would be mixed together?",
        misconceptions: {
          o2: "One presenter per gender does not isolate a general gender effect from individual differences.",
          o3: "Two presenters on one topic do not establish that generality.",
          o4: "Reusing presenters in two roles does not itself double the sample.",
        },
        explanation:
          "Using the same two presenters in both roles helps control for idiosyncratic effects of an individual presenter. It does not allow comparison of presenter gender, which was confounded with other differences.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "q3",
        stage: "Read the results",
        title: "Scientist Against Third Party",
        type: "single",
        prompt:
          "Viewers rated the scientist presenter highest on trustworthiness. Is the scientist reliably more trusted than the third-party presenter?",
        evidence: [
          "Trustworthiness, 7-point scale, adjusted for age and ideology.",
          "Pairwise test, scientist against third party: P = 0.20.",
          "Pairwise test, scientist against no presenter: P = 0.006.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Presenter trustworthiness",
          instruction:
            "Compare the three intervals with each other, especially the first two.",
          description:
            "Estimated mean trustworthiness of the presenter, with intervals computed from the reported standard errors.",
          provenance: {
            kind: "derived",
            refs: ["e5"],
            note: "Means as printed; intervals computed as mean ± 1.96 standard errors.",
          },
          measure: "Trustworthiness, 1 to 7",
          min: 5,
          max: 6.2,
          reference: {
            value: 5.61,
            label: "Third-party mean",
          },
          band: null,
          estimates: [
            {
              id: "sci",
              label: "Scientist",
              detail: "Presenter tells their own research.",
              at: "setup",
              provenance: {
                kind: "derived",
                refs: ["e5"],
                note: "Mean as printed; interval computed as the mean ± 1.96 standard errors.",
              },
              value: 5.81,
              lower: 5.65,
              upper: 5.97,
            },
            {
              id: "third",
              label: "Third party",
              detail: "Presenter summarises others' research.",
              at: "setup",
              provenance: {
                kind: "derived",
                refs: ["e5"],
                note: "Mean as printed; interval computed as the mean ± 1.96 standard errors.",
              },
              value: 5.61,
              lower: 5.45,
              upper: 5.77,
            },
            {
              id: "none",
              label: "No presenter",
              detail: "Infographic-style video.",
              at: "setup",
              provenance: {
                kind: "derived",
                refs: ["e5"],
                note: "Mean as printed; interval computed as the mean ± 1.96 standard errors.",
              },
              value: 5.4,
              lower: 5.18,
              upper: 5.62,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Scientist beats no presenter, not clearly the third party",
            detail:
              "Scientist and third party overlap; only the gap between scientist and no presenter was significant.",
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
              label: "Yes, clearly",
              targetIds: ["sci", "third"],
            },
            {
              optionId: "o3",
              label: "Third party lowest",
              targetIds: ["third"],
            },
            {
              optionId: "o1",
              label: "Not reliably",
              targetIds: ["sci", "third"],
            },
            {
              optionId: "o4",
              label: "All equal",
              targetIds: ["sci", "third", "none"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "Established: the highest mean is reliably above every lower-rated condition.",
          },
          {
            id: "o3",
            text: "Not established: the third-party version had the lowest mean, below the no-presenter version.",
          },
          {
            id: "o1",
            text: "Not established: the direct pairwise gap was non-significant at P = 0.20.",
          },
          {
            id: "o4",
            text: "Established equality: the pairwise result shows both versions have exactly the same trustworthiness.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Look at the pairwise test for the two presenter versions.",
        misconceptions: {
          o2: "A mean ranking alone does not establish each pairwise difference.",
          o3: "That is not the reported ordering of means.",
          o4: "Non-significance does not prove equality.",
        },
        explanation:
          "The scientist was rated 5.81, the third party 5.61 and the no-presenter video 5.40. Only scientist against no presenter was significant. Scientist against third party was not (P = 0.20).",
        refs: ["e5", "e6"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "q4",
        stage: "Read the results",
        title: "Many Outcomes, One Adjustment",
        type: "single",
        prompt:
          "The team tested eight outcomes and also reported p-values adjusted for testing many outcomes. Trust's overall test went from P = 0.007 to an adjusted 0.05. What does the adjustment tell you?",
        evidence: [
          "Outcomes included trust, expertise, enjoyment, views of scientists, and attitudes to research and funding.",
          "Expertise: P = 0.002, adjusted 0.03. Trust: P = 0.007, adjusted 0.05.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Adjustment confirms the trust finding, since a corrected value at .05 establishes a true effect.",
          },
          {
            id: "o1",
            text: "Multiple testing weakens the trust evidence; expertise survives adjustment more clearly.",
          },
          {
            id: "o3",
            text: "Adjustment can be ignored, since a smaller unadjusted p-value always provides the most reliable inference.",
          },
          {
            id: "o4",
            text: "Adjustment makes trust the stronger finding, since expertise no longer meets the threshold.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Why would someone testing eight outcomes adjust their p-values?",
        misconceptions: {
          o2: "Adjustment does not establish truth, particularly for a borderline result.",
          o3: "Selecting the smaller value ignores the multiple-testing problem.",
          o4: "Expertise held up better than trust under the reported adjustment.",
        },
        explanation:
          "Adjusted P values account for false discovery rates across the outcomes. Expertise (adjusted 0.03) holds up better than trust (adjusted 0.05), which is at the edge.",
        refs: ["e5", "e7", "e8"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "q5",
        stage: "Draw a conclusion",
        title: "Enjoyment and Funding",
        type: "single",
        prompt:
          "Video type did not change support for funding museum research. But viewers who enjoyed their video more supported funding more (r = 0.42). What can a museum conclude?",
        evidence: [
          "Funding support by video type: 5.17, 5.16 and 5.02 out of 7, not significantly different.",
          "Enjoyment did not differ between video types either.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Changing who presents did not move funding support; the link with enjoyment is a correlation, so it does not show that more enjoyable videos would raise support.",
          },
          {
            id: "o2",
            text: "Scientist presenters increase support, since viewers rated them as more expert than the other presenters.",
          },
          {
            id: "o3",
            text: "Increasing enjoyment will increase support, since the positive correlation identifies the causal direction.",
          },
          {
            id: "o4",
            text: "Videos cannot relate to funding views, since the presenter-type comparison did not detect a difference.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which variable was randomly assigned, and which was only measured?",
        misconceptions: {
          o2: "An expertise rating does not establish an effect on funding support.",
          o3: "The correlation does not establish that changing enjoyment changes support.",
          o4: "A null experimental contrast does not erase the enjoyment association.",
        },
        explanation:
          "Video type was randomised and had no significant effect on funding attitudes. Enjoyment was only measured, so its correlation with funding support may reflect that people who like the topic both enjoy the video and support funding.",
        refs: ["e9", "e10"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "q6",
        stage: "Draw a conclusion",
        title: "How Far Does It Reach?",
        type: "single",
        prompt:
          "A university tells all its scientists to present their own research on video, citing this study. What is the best caution?",
        evidence: [
          "Two presenters, one script, one made-up story about ants.",
          "Viewers: 515 volunteers from an online survey panel.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "No caution is needed, since a randomised comparison of two presenters establishes a rule for all scientists.",
          },
          {
            id: "o1",
            text: "Two presenters and one topic limit transfer; the clearest gain concerned expertise.",
          },
          {
            id: "o3",
            text: "Scientists should avoid presenting, since the pairwise trust result establishes a disadvantage to doing so.",
          },
          {
            id: "o4",
            text: "Only fiction limits transfer, since the videos were based on an invented story rather than real research.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many presenters, scripts and topics stand behind the result?",
        misconceptions: {
          o2: "Randomisation within this experiment does not establish universal transfer.",
          o3: "The non-significant contrast does not establish a disadvantage.",
          o4: "The research story was real; presenter and topic coverage are the relevant limits.",
        },
        explanation:
          "The authors note an opt-in volunteer panel, that two scientists are not representative of scientists, and a single script with the same ant visuals. Those limit how far the result generalises.",
        refs: ["e11", "e12", "e13"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In an online experiment with 515 volunteers, a scientist presenting their own research was rated as more expert than a third-party presenter or a video with no presenter, and more trustworthy than the no-presenter video. The trust result was borderline after adjustment and mixed with an on-screen “Dr.” title, and video type did not change attitudes to research funding.",
};
