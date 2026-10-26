// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/baillon-2019-phishing-information-experience.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about cluster assignment, the combined group, behaviour after clicking, combining and spillover.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-clicking-phishing-links",
    title:
      "Informing, simulating experience, or both: A field experiment on phishing risks",
    briefing:
      "Decide how to test anti-phishing training in a real workplace, and what the results show about information, experience and both.",
    source: "generated",
    paper: {
      title:
        "Informing, simulating experience, or both: A field experiment on phishing risks",
      authors: "Baillon, de Bruin, Emirmahmutoglu et al. (2019)",
      journal: "PLOS ONE 14(12): e0224216",
      url: "https://doi.org/10.1371/journal.pone.0224216",
      limitations: [
        "An online warning reached all groups in one division after the first fake email, which shrinks the measured effects there.",
        "The team could not check whether employees opened or read the emails.",
        "Experience may have worked partly because employees believed their employer could see who gave away a password.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 5,
        excerpt:
          "We randomized the subjects at the level of the lowest known organizational unit, henceforth referred to as “basic unit”. In total we had 184 unique basic units, with an average of 61 sub- jects per basic unit.",
      },
      {
        id: "e2",
        page: 5,
        excerpt:
          "With randomization at the individual level, it would have been possible that two subjects working together were divided into different treatment groups. This could have led some subjects to be affected by more than one treatment.",
      },
      {
        id: "e3",
        page: 4,
        excerpt:
          "We used a 2x2 design and subjects were divided into four groups of roughly equal size: Control (2723 employees), Info (2740), Exp (2724) and ExpInfo (2742).",
      },
      {
        id: "e4",
        page: 11,
        excerpt:
          "Many suggested that combining the two types of intervention yields the best results by reinforcing the effect of each other [14, 15, 19, 20].",
      },
      {
        id: "e5",
        page: 8,
        excerpt:
          "Among those who visited the link, 68% also filled in their password in the Control group. This proportion was very similar in Info, being only reduced by 4 points, which was not signifi- cant. By contrast, Fill|Visit was 58% in Exp, and 54% in ExpInfo, both significantly lower than in the Control group.",
      },
      {
        id: "e6",
        page: 9,
        excerpt:
          "The unconditional frequency of subjects filling in their password, as measured by Fill, was 22% in Control, and dropped to 16%, 14%, and 13% in Info, Exp, and ExpInfo respectively.",
      },
      {
        id: "e7",
        page: 9,
        excerpt:
          "We tested the differences between the treatment effects and found no significant difference, with three exceptions.",
      },
      {
        id: "e8",
        page: 11,
        excerpt:
          "Surprisingly, in our experiment, the effectiveness of combining both experience and information did not differ from the effectiveness",
      },
      {
        id: "e9",
        page: 5,
        excerpt:
          "Unfortunately (and out of our control), after the first phishing email at T = 1, an online notification was posted for the employees in organizational division C, stating that the phishing email that some employees received was a fake one.",
      },
      {
        id: "e10",
        page: 5,
        excerpt:
          "We would then expect treatments effects to be smaller for that division. In what follows, we will always report the analysis with and without this division. Including the division can be expected to give more conservative estimates.",
      },
      {
        id: "e11",
        page: 9,
        excerpt: "The effects were stronger after exclusion of Division C.",
      },
      {
        id: "e12",
        page: 11,
        excerpt:
          "Personal experience may have led people to see threats as more probable, and to view themselves as potential future victims",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Randomise People or Teams?",
        type: "single",
        prompt:
          "The ministry could have assigned each employee to a group individually. Why might that have spoiled the comparison?",
        evidence: [
          "10,929 employees, working in 184 organisational units with an average of 61 people each.",
          "Each unit as a whole was assigned to one of the four groups.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Individual assignment would remove randomisation by allowing more employees into some groups.",
          },
          {
            id: "o3",
            text: "Individual assignment would stop the team comparing employees who received different training.",
          },
          {
            id: "o4",
            text: "Individual assignment would let managers choose which employees receive the strongest training.",
          },
          {
            id: "o1",
            text: "Colleagues in different groups could talk, so someone in the control group could be warned by a trained neighbour and the groups would blur together.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What happens when two people who sit together are in different groups?",
        misconceptions: {
          o2: "Random individual assignment remains random even if group sizes differ slightly.",
          o3: "Individual randomisation permits that comparison; spillover is the concern.",
          o4: "Random individual assignment does not give managers that choice.",
        },
        explanation:
          "With individual assignment, two people working together could end up in different groups and be affected by more than one treatment. Randomising whole units avoids that, and the analysis accounted for the clustering.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "Why a Fourth Group?",
        type: "single",
        prompt:
          "The study had a control group, an information group, an experience group, and a group that got both. What does the group that got both let the team test?",
        evidence: [
          "Information: three emails explaining phishing and how to spot and handle it.",
          "Experience: a fake phishing email, followed by a short note saying it was fake.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Whether training beats no training, without needing any comparison with the single-method groups.",
          },
          {
            id: "o1",
            text: "Whether the combination adds benefit beyond either method used alone.",
          },
          {
            id: "o3",
            text: "Whether information beats experience, without needing either of those methods tested separately.",
          },
          {
            id: "o4",
            text: "Whether employees opened the training emails, regardless of their later responses to phishing.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Others had claimed the two approaches reinforce each other. Which group can test that claim?",
        misconceptions: {
          o2: "The combined arm specifically permits testing added value over the individual methods.",
          o3: "That requires directly comparing the two single-method arms.",
          o4: "The combined arm tests outcomes of combining methods, not email reading itself.",
        },
        explanation:
          "Crossing the two treatments in a 2×2 design gives a group with both, which tests the common suggestion that combining information and experience works best.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "After the Click",
        type: "single",
        prompt:
          "Among people who clicked the link in the final fake email, how often did they then type in their password? What does the pattern suggest?",
        evidence: [
          "Password given, among those who clicked: Control 68%; Information 4 points lower.",
          "Experience 58%, Both 54%.",
          "The Information drop was not significant; Experience and Both were significantly lower than Control.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Information helped most after clicking; experience mainly reduced the number opening the fake link.",
          },
          {
            id: "o3",
            text: "All groups had similar password-giving rates after clicking; differences arose only before the click.",
          },
          {
            id: "o1",
            text: "Experience helped people stop after clicking; information mainly reduced initial clicks.",
          },
          {
            id: "o4",
            text: "The combined arm eliminated password entry; single methods only reduced it.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare the groups that had a fake email before with the group that only had information.",
        misconceptions: {
          o2: "This reverses where the training effects appeared.",
          o3: "Conditional password-giving differed between groups.",
          o4: "The combined arm did not eliminate password entry.",
        },
        explanation:
          "After clicking, password-giving fell from 68% to 58% and 54% in the two groups that had a fake email before, but only by 4 points (not significant) with information alone. Information helped by reducing clicks; experience also helped after the click.",
        refs: ["e5"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Does Combining Help?",
        type: "single",
        prompt:
          "Overall password-giving was 14% with experience alone and 13% with both. Does adding information to experience help?",
        evidence: [
          "Share of all employees who gave their password in the final fake email.",
          "The team tested whether the treatment effects differed from each other.",
        ],
        scene: {
          version: 1,
          kind: "comparison",
          title: "Passwords given",
          instruction:
            "Compare each group with Control, then compare Experience with Both.",
          description:
            "Share of all employees in each group who filled in their password in the final fake email (whole sample).",
          provenance: {
            kind: "reported",
            refs: ["e6"],
            note: "Percentages as printed in the results text.",
          },
          measure: "Employees who gave their password",
          unit: "%",
          decimals: 0,
          min: 0,
          max: 25,
          values: [
            {
              id: "control",
              label: "Control",
              detail: "No training.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Percentage as printed in the results text.",
              },
              value: 22,
            },
            {
              id: "info",
              label: "Information",
              detail: "Three information emails.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Percentage as printed in the results text.",
              },
              value: 16,
            },
            {
              id: "exp",
              label: "Experience",
              detail: "One fake email and a short note.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Percentage as printed in the results text.",
              },
              value: 14,
            },
            {
              id: "both",
              label: "Both",
              detail: "Fake email, then information.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e6"],
                note: "Percentage as printed in the results text.",
              },
              value: 13,
            },
          ],
          difference: {
            from: "exp",
            to: "both",
            label: "One percentage point",
            at: "feedback",
          },
          prediction: null,
          resolution: null,
          responses: [
            {
              optionId: "o1",
              label: "No detectable extra benefit",
              targetIds: ["exp", "both"],
            },
            {
              optionId: "o2",
              label: "Clearly better",
              targetIds: ["both"],
            },
            {
              optionId: "o3",
              label: "Worse than control",
              targetIds: ["both", "control"],
            },
            {
              optionId: "o4",
              label: "Information is useless",
              targetIds: ["info", "control"],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o1",
            text: "No detectable extra benefit: the combined group did not differ significantly from experience alone, so the one-point gap is within noise.",
          },
          {
            id: "o2",
            text: "A clear added benefit; any lower percentage demonstrates that the combination outperforms experience.",
          },
          {
            id: "o3",
            text: "A harmful added effect; both combined methods performed worse than the untrained comparison group.",
          },
          {
            id: "o4",
            text: "No useful role for information; failure to add benefit shows it cannot work when used on its own.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Is a one-point gap between two treatments the same as a reliable difference?",
        misconceptions: {
          o2: "A numerical difference alone does not establish a reliable benefit.",
          o3: "The reported comparison does not show that reversal.",
          o4: "Lack of added benefit does not establish lack of standalone benefit.",
        },
        explanation:
          "All three interventions reduced password-giving compared with Control, but the combined group did not differ significantly from experience alone. The authors call this surprising, given claims that the two reinforce each other.",
        refs: ["e6", "e7", "e8"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "A Warning That Leaked",
        type: "single",
        prompt:
          "After the first fake email, one division posted an online warning that it was fake, seen by everyone in that division, including the control group. How does that affect the results?",
        evidence: [
          "The warning reached Control and Information groups in that division, not only those who got the fake email.",
          "Results were reported with and without that division.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It made the untrained groups there more alert, shrinking the differences, so including that division understates the true effects.",
          },
          {
            id: "o2",
            text: "Warning the control group could enlarge the contrast by making untrained staff easier to deceive.",
          },
          {
            id: "o3",
            text: "The warning cannot affect the contrast because no employees changed their assigned training group.",
          },
          {
            id: "o4",
            text: "The warning prevents any useful analysis, even one that compares results with and without that division.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If the comparison group also gets warned, does the gap between groups grow or shrink?",
        misconceptions: {
          o2: "Alerting controls would more plausibly reduce their susceptibility.",
          o3: "Contamination can change behaviour without changing assignment.",
          o4: "Sensitivity analysis can assess the influence of the contaminated division.",
        },
        explanation:
          "The authors expected smaller treatment effects in that division and say including it gives more conservative estimates. Indeed, the effects were stronger after excluding it.",
        refs: ["e9", "e10", "e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In a field experiment with 10,929 ministry employees, information emails, one fake phishing email with a short debrief, and both together each reduced password-giving compared with no training (22% to 16%, 14% and 13%). Combining them added no detectable benefit over experience alone, and a leaked warning in one division made the overall estimates conservative.",
};
