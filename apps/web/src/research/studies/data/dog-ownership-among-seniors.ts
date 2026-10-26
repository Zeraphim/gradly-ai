// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/taniguchi-2022-dog-ownership-disability.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about who owns dogs, time order, adjustment, odds against risk, dogs against cats and the title's claim.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-dog-ownership-among-seniors",
    title:
      "Investigating Dog Ownership and Disability Risk in Older Japanese Adults",
    briefing:
      "Researchers asked older adults in Tokyo about owning dogs and cats, then tracked who developed a disability. Decide what the comparison can show, read the odds ratios carefully, and judge how strong the paper's title claim is.",
    source: "generated",
    paper: {
      title:
        "Evidence that dog ownership protects against the onset of disability in an older community-dwelling Japanese population",
      authors: "Taniguchi, Seino, Headey et al. (2022)",
      journal: "PLOS ONE 17(2): e0263791",
      url: "https://doi.org/10.1371/journal.pone.0263791",
      limitations: [
        "Owners were assigned by their own choices, and current owners differed from non-owners at the start (younger, wealthier, less frail).",
        "The follow-up lasted about 3.5 years in one Japanese city.",
        "The study measured ownership, not dog walking itself, apart from a general exercise question.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 4,
        excerpt:
          "As compared with those who had never owned a dog or cat, participants who were current own- ers were disproportionately women, younger, married or living with a partner, had more for- mal education, higher equivalent incomes, were more likely to drink alcohol and smoke, had a lower rate of frailty status, took more exercise, went outdoors more, and had closer relation- ships with neighbors (Table 1).",
      },
      {
        id: "e2",
        page: 2,
        excerpt:
          "All participants were physically and cognitively indepen- dent, defined as absence of long-term care insurance certification.",
      },
      {
        id: "e3",
        page: 3,
        excerpt:
          "In this study the onset of disability was defined as new certification by the LTCI service [23].",
      },
      {
        id: "e4",
        page: 2,
        excerpt: "The follow-up period was approximately 3.5 years.",
      },
      {
        id: "e5",
        page: 7,
        excerpt:
          "Dog ownership Never § 1339/7575 (17.7%) 1 1 Past 419/2493 (16.8%) 0.87 (0.70–1.07) 0.84 (0.68–1.03) Current 124/947 (13.1%) 0.54 (0.37–0.78) �� 0.54 (0.38–0.79) ��",
      },
      {
        id: "e6",
        page: 7,
        excerpt:
          "Cat ownership Never § 1564/9102 (17.2%) 1 1 Past 216/1222 (17.7%) 1.00 (0.76–1.30) 0.98 (0.75–1.29) Current 102/691 (14.8%) 1.08 (0.75–1.54)",
      },
      {
        id: "e7",
        page: 7,
        excerpt:
          "Adjusting for sociodemographic variables and health makes virtually no difference to this result.",
      },
      {
        id: "e8",
        page: 7,
        excerpt:
          "They have approximately half the risk of disability (odds ratio = 0.54, 95% CI:0.37–0.78) as those who never had a dog.",
      },
      {
        id: "e9",
        page: 4,
        excerpt:
          "onset of disability rate of 13.1% for current dog owners was lower than for past owners (16.8%) and ‘never’ owners (17.7%); these differences being statistically significant at the 0.01 level.",
      },
      {
        id: "e10",
        page: 8,
        excerpt:
          "cial result here is that the odds ratio of disability for current dog owners who do regular exer- cise is 0.44 (95% CI:0.28–0.71), after controlling for socio-economic variables and health measures (Fig 1).",
      },
      {
        id: "e11",
        page: 10,
        excerpt:
          "Most dog owners take their pet for regular walks; indeed, dog owners are four times more likely than non-owners to meet rec- ommended physical activity guidelines [29].",
      },
      {
        id: "e12",
        page: 7,
        excerpt:
          "Cat ownership appears to have no effect on the onset of disability (Table 2, S1 Table).",
      },
      {
        id: "e13",
        page: 10,
        excerpt:
          "It will also be important to assess whether linkages found in Japan are replicated in Western and other Asian countries.",
      },
      {
        id: "e14",
        page: 10,
        excerpt:
          "In summary, this prospective study is the first, so far as we are aware, to indicate that dog ownership may well be protective against the onset of disability in older adults.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Who Owns a Dog?",
        type: "single",
        prompt:
          "At the start, current pet owners differed from people who had never owned one. Why does that matter for a claim that dogs protect against disability?",
        evidence: [
          "Current owners were more often younger, married, better educated and better off.",
          "They were also less often frail and went outdoors more.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Starting disability-free makes owners and non-owners comparable on all other health-related factors.",
          },
          {
            id: "o3",
            text: "The baseline differences establish that dog ownership changed owners' age and economic circumstances.",
          },
          {
            id: "o1",
            text: "Those differences could lower disability on their own; the team adjusted for many of them, but unmeasured differences between owners and non-owners can remain.",
          },
          {
            id: "o4",
            text: "Baseline imbalance prevents even an adjusted comparison from describing the observed association.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Could the same traits that make someone likely to keep a dog also protect them from disability?",
        misconceptions: {
          o2: "Absence of certified disability does not balance all baseline differences.",
          o3: "Owners selecting themselves into pet ownership can already differ at baseline.",
          o4: "Adjustment can inform an association while leaving residual confounding possible.",
        },
        explanation:
          "Current owners were younger, more often partnered, better educated, wealthier and less frail. The analysis adjusted for many such variables, but people who keep dogs may still differ in ways not measured.",
        refs: ["e1"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Starting Disability-Free",
        type: "single",
        prompt:
          "Everyone was free of certified disability when ownership was recorded, and new disability was tracked for about 3.5 years. What does that order protect against, and what does it not?",
        evidence: [
          "Ownership was asked in a 2016 questionnaire.",
          "Disability came from new certifications in Japan's long-term care insurance system.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The ordering establishes protection, since an outcome measured later cannot share an earlier cause with ownership.",
          },
          {
            id: "o1",
            text: "Disability recorded later cannot have caused the ownership answer, but people who already sensed their health declining might have avoided getting a dog.",
          },
          {
            id: "o3",
            text: "The ordering makes later disability self-reported, since ownership and disability use the same survey response.",
          },
          {
            id: "o4",
            text: "The ordering adds no information, since self-reported ownership cannot precede a certified outcome reliably.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which came first, the answer about dogs or the disability? Could anything earlier shape both?",
        misconceptions: {
          o2: "Confounding and early decline can still explain a prospective association.",
          o3: "Later disability came from certification rather than the ownership report.",
          o4: "The timing is informative even though ownership itself was self-reported.",
        },
        explanation:
          "Participants were physically and cognitively independent at the start, and disability was defined as new certification over about 3.5 years. That fixes the time order, but early unrecorded decline could still influence who keeps a dog.",
        refs: ["e2", "e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "Dogs, Cats and Adjustment",
        type: "single",
        prompt:
          "Here are odds ratios for new disability compared with people who never owned that kind of pet. Which reading fits?",
        evidence: [
          "Odds ratio below 1: lower odds of disability than never-owners.",
          "Model 1 adjusts for social and economic factors; Model 2 also for baseline health.",
        ],
        scene: {
          version: 1,
          kind: "estimate",
          title: "Odds of new disability",
          instruction:
            "Compare each interval with 1, and compare the two current-dog estimates.",
          description:
            "Odds ratios for new disability with 95% intervals, compared with never-owners.",
          provenance: {
            kind: "reported",
            refs: ["e5", "e6"],
            note: "Odds ratios and intervals as printed in Table 2.",
          },
          measure: "Odds ratio",
          min: 0.2,
          max: 1.7,
          reference: {
            value: 1,
            label: "Same odds as never-owners",
          },
          band: null,
          estimates: [
            {
              id: "dog1",
              label: "Current dog, Model 1",
              detail: "947 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.54,
              lower: 0.37,
              upper: 0.78,
            },
            {
              id: "dog2",
              label: "Current dog, Model 2",
              detail: "Adds baseline health.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.54,
              lower: 0.38,
              upper: 0.79,
            },
            {
              id: "pastdog",
              label: "Past dog, Model 2",
              detail: "2,493 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e5"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 0.84,
              lower: 0.68,
              upper: 1.03,
            },
            {
              id: "cat",
              label: "Current cat, Model 1",
              detail: "691 people.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Estimate and interval as printed in the results.",
              },
              value: 1.08,
              lower: 0.75,
              upper: 1.54,
            },
          ],
          prediction: null,
          resolution: {
            id: "resolution",
            label: "Current dogs only, unchanged by health adjustment",
            detail:
              "Current dog owners' odds stay at 0.54 when baseline health is added. Past dog owners and cat owners overlap 1.",
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
              label: "Any pet",
              targetIds: ["cat"],
            },
            {
              optionId: "o3",
              label: "Health explains it",
              targetIds: ["dog1", "dog2"],
            },
            {
              optionId: "o4",
              label: "Past dogs best",
              targetIds: ["pastdog"],
            },
            {
              optionId: "o1",
              label: "Current dogs only",
              targetIds: ["dog1", "dog2", "pastdog", "cat"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "Every pet-ownership category showed lower adjusted disability odds.",
          },
          {
            id: "o3",
            text: "Baseline health adjustment removed the current-dog association, leaving only the past-owner association.",
          },
          {
            id: "o4",
            text: "Past dog ownership had the lowest odds after adjustment, with current owners closer to never-owners.",
          },
          {
            id: "o1",
            text: "Current dog ownership had lower odds after adjustment; past dogs and cats had no clear link.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Which intervals stay clear of 1, and did adjusting for health change the dog estimate?",
        misconceptions: {
          o2: "The clear association was specific to current dog ownership.",
          o3: "The current-dog estimate remained similar after that adjustment.",
          o4: "The displayed estimates show the lower odds for current dog owners.",
        },
        explanation:
          "Current dog owners had an odds ratio of 0.54 in both models, so measured health differences did not explain the link. Past dog owners and current cat owners did not differ clearly from never-owners.",
        refs: ["e5", "e6", "e7", "e12"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Half the Risk?",
        type: "single",
        prompt:
          "The paper says dog owners have “approximately half the risk” of disability, based on an odds ratio of 0.54. Is that the right way to put it?",
        evidence: [
          "About 17% of the whole sample developed a disability during follow-up.",
          "Raw rates: 13.1% for current dog owners, 17.7% for never-owners.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "Not quite: it is lower odds, which overstate the risk reduction for this common outcome.",
          },
          {
            id: "o2",
            text: "It is approximately half the risk, because odds and probability ratios are interchangeable at any event rate.",
          },
          {
            id: "o3",
            text: "It indicates higher risk, because odds below 1 imply that disability became more likely among owners.",
          },
          {
            id: "o4",
            text: "It cannot describe a reduction, because the confidence interval crosses the no-difference value of 1.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the raw rates directly: 13.1 against 17.7.",
        misconceptions: {
          o2: "Odds ratios approximate risk ratios only when outcomes are sufficiently rare.",
          o3: "An odds ratio below 1 indicates lower, not higher, odds.",
          o4: "The displayed interval for current dog ownership excludes 1.",
        },
        explanation:
          "13.1% against 17.7% is roughly a quarter lower in raw terms. An adjusted odds ratio of 0.54 means roughly half the odds, not half the risk, because odds ratios overstate risk changes for common outcomes.",
        refs: ["e8", "e9"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Why Dogs and Not Cats?",
        type: "single",
        prompt:
          "Dog ownership went with less disability but cat ownership did not. Dog owners who also exercised regularly had the lowest odds (0.44). What explanation fits best?",
        evidence: [
          "Most dog owners take their dogs for regular walks.",
          "The study asked about general exercise habits, not dog walking itself.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Cat care raises disability risk, because its estimate did not show the lower odds seen for current dog owners.",
          },
          {
            id: "o1",
            text: "Daily walking and outdoor activity that come with dog care may matter, which cats do not require; the study suggests this but did not measure walking directly.",
          },
          {
            id: "o3",
            text: "Companionship explains the whole benefit, because the dog-versus-cat contrast directly isolates that mechanism.",
          },
          {
            id: "o4",
            text: "Exercise cannot contribute, because the lowest odds occurred in dog owners who also exercised regularly.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What do dog owners do every day that cat owners usually don't?",
        misconceptions: {
          o2: "A null cat association does not establish harmful effects.",
          o3: "The observational comparison does not isolate companionship from activity or selection.",
          o4: "That pattern is compatible with an activity explanation, not evidence against it.",
        },
        explanation:
          "The authors note that most dog owners walk their dogs and are far more likely to meet activity guidelines. The dog–cat contrast and the low odds for exercising dog owners fit an activity explanation, but walking itself was not measured.",
        refs: ["e10", "e11", "e12"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "“Evidence That Dogs Protect”",
        type: "single",
        prompt:
          "The paper's title says it gives “evidence that dog ownership protects against the onset of disability”. How strong is that claim?",
        evidence: [
          "Owners chose to keep dogs; nobody was assigned one.",
          "The study was carried out in Ota City, Tokyo.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It is a well-controlled association that fits protection, but with owners choosing to keep dogs, other differences may explain part of it, and it may not hold elsewhere.",
          },
          {
            id: "o2",
            text: "Protection is established, because a large adjusted sample has the same causal strength as random assignment.",
          },
          {
            id: "o3",
            text: "The association is uninformative, because an observational follow-up cannot describe later disability patterns.",
          },
          {
            id: "o4",
            text: "Protection extends to mortality, because a lower disability estimate establishes the same effect on survival.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Did anyone assign dogs to people at random?",
        misconceptions: {
          o2: "Size and adjustment do not remove all unmeasured confounding.",
          o3: "It can describe prospective associations without proving protection.",
          o4: "Disability and mortality are separate outcomes; one does not establish the other.",
        },
        explanation:
          "The authors' own summary says dog ownership may well be protective, and they call for replication in other countries. Because people chose whether to keep dogs, the evidence is suggestive rather than proof.",
        refs: ["e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "Among 11,015 initially independent older adults in Tokyo, current dog owners had about half the odds of a new disability over 3.5 years, even after adjusting for social factors and baseline health; cat owners did not differ. The odds ratio overstates the drop in risk, and because people chose to keep dogs, the link is suggestive rather than proof of protection.",
};
