import type { ResearchCase } from "./case-types.js";

/**
 * Fictional study casefiles for practising paper comprehension and judgment.
 * Every event, participant account and finding below was authored for learning.
 * No case is a published paper or an analysis of an uploaded document.
 */
export const practiceCases: ResearchCase[] = [
  {
    id: "garden-belonging",
    title: "A shared garden. Different experiences.",
    topic: "Qualitative evidence & interpretation",
    hook: "One place can mean connection to one person and exclusion to another.",
    question:
      "How do people with different levels of participation experience belonging in a neighbourhood garden?",
    context:
      "A fictional qualitative study explores a neighbourhood garden as a shared place. The team interviews active volunteers and people who rarely take part. You have an authored summary and selected accounts, so you can examine an interpretation without pretending that three extracts constitute a complete thematic analysis.",
    provenance: "fictional-study",
    sourceNote:
      "An authored learning case, not a published study. All participant accounts and findings were invented for this exercise. Interpretations are provisional and bounded to the supplied material.",
    paper: {
      title: "Belonging in a neighbourhood garden",
      authors: "Fictional research team · authored casefile",
    },
    design:
      "Interviews with ten local people, purposefully recruited to include regular volunteers and people who seldom joined in. The team uses a reflexive thematic approach to consider patterned meanings and differences. The casefile includes an authored interpretation and three selected accounts; it does not supply full transcripts or a finished audit of the analysis.",
    findings:
      "The authored interpretation connects belonging with feeling invited, having useful ways to contribute and being able to participate. One account links connection with being asked for advice. Another describes enjoying quiet gardening without seeking more social events. A third describes wanting to join but finding a narrow route and inaccessible tasks difficult. A shared location did not create the same experience for everyone.",
    limitations: [
      "These selected accounts are not the whole dataset. A final thematic account would need engagement with the full material and the analytic context.",
      "The interpretation does not estimate how common each experience is or represent every local resident.",
      "Other coherent interpretations may be defensible when they explain the accounts, their differences and the research question.",
    ],
    evidence: [
      {
        id: "garden-design",
        label: "Experiences, including less active voices",
        kind: "design",
        summary:
          "Ten local people were interviewed, including regular volunteers and people who rarely took part.",
        text: "Ten local people were interviewed, including regular volunteers and people who rarely joined in. The question concerns experiences of belonging, not a population rating of the garden.",
        sourceLabel: "Fictional case · Method and question",
      },
      {
        id: "garden-invitation",
        label: "Recognition can matter",
        kind: "finding",
        summary:
          "One person felt included when others asked for advice about seedlings. Being recognised as a contributor mattered.",
        text: "Interview A describes feeling part of the garden after other volunteers asked for advice about seedlings. The account connects belonging with being recognised as someone who could contribute.",
        sourceLabel: "Fictional case · Interview A summary",
      },
      {
        id: "garden-quiet",
        label: "Participation need not mean more events",
        kind: "finding",
        summary:
          "Another person enjoyed gardening quietly and did not want more group events. Participation can mean different things.",
        text: "Interview B enjoys watering plants quietly after work and does not want more organised social events. This challenges a recommendation that more group activities would improve everyone’s experience.",
        sourceLabel: "Fictional case · Interview B summary",
      },
      {
        id: "garden-access",
        label: "Wanting to join is not the same as being able to",
        kind: "finding",
        summary:
          "A third person wanted to join, but the route and tasks were hard to access. Low participation did not mean low interest.",
        text: "Interview C wants to participate but describes a narrow route and tasks that are difficult to access. Low participation in this account is not evidence of low interest.",
        sourceLabel: "Fictional case · Interview C summary",
      },
      {
        id: "garden-boundary",
        label: "An interpretation is not a vote",
        kind: "limitation",
        summary:
          "Three selected accounts are not the whole dataset. They cannot tell us how everyone feels.",
        text: "Three selected accounts cannot establish a final theme or the prevalence of an experience. A defensible interpretation needs a coherent connection to the question and material, including accounts that complicate it.",
        sourceLabel: "Fictional case · Analytic limits",
      },
    ],
    claims: [
      {
        id: "garden-cautious",
        text: "Personal accounts cannot tell us anything useful.",
        feedback:
          "These accounts help us understand experience. A useful interpretation explains their connections and differences.",
      },
      {
        id: "garden-supported",
        text: "These accounts link belonging with recognition and access; experiences differ.",
        feedback:
          "This is one defensible provisional reading. It connects the accounts without claiming everyone has the same experience.",
      },
      {
        id: "garden-overreach",
        text: "More garden events will make every resident feel included.",
        feedback:
          "One person values quiet gardening; another faces access barriers. More events are not a tested solution for everyone.",
      },
    ],
    supportedClaimId: "garden-supported",
    overview: {
      approach:
        "Interviews with ten local people, including regular volunteers and less active participants.",
      finding:
        "Recognition and access shaped belonging. One person preferred quiet gardening to group events.",
      limit:
        "Selected accounts allow a provisional interpretation, not a final theme or a claim about all residents.",
    },
    usefulEvidenceIds: ["garden-invitation", "garden-access"],
    competingEvidenceId: "garden-quiet",
    coachingQuestion:
      "What meaning connects these accounts, and which account stops your interpretation from becoming a claim about everyone?",
    revision: {
      claim:
        "Belonging in these accounts depends partly on recognition and ways of participating that people can and want to use.",
      explanation:
        "A connects belonging with being invited to contribute, C describes interest constrained by access, and B values quiet gardening rather than more organised social activity. I would preserve those differences and examine the full dataset before developing a final theme. This is a defensible interpretation of selected accounts, not a frequency estimate or the only possible reading.",
    },
    transfer: {
      context:
        "A new fictional interview says that organised welcome events feel uncomfortable, but exchanging seedlings one to one makes the person feel included.",
      prompt: "How should this new account affect the interpretation?",
      options: [
        {
          id: "garden-transfer-force-fit",
          text: "Discard it because it conflicts with the other accounts.",
          feedback:
            "A contrary account is evidence to examine, not an inconvenience to remove so that a preferred interpretation survives.",
        },
        {
          id: "garden-transfer-revisit",
          text: "Keep the difference and revisit the interpretation using the wider dataset.",
          feedback:
            "The new account can refine the interpretation. It distinguishes feeling included from attending organised events without claiming that one extract settles the whole analysis.",
        },
        {
          id: "garden-transfer-vote",
          text: "Treat the most frequently mentioned activity as the true theme.",
          feedback:
            "Frequency alone does not establish a theme’s meaning or importance in this reflexive thematic exercise. The interpretation needs to address the question and explain the material.",
        },
      ],
      supportedOptionId: "garden-transfer-revisit",
    },
    takeaway:
      "Good interpretation connects accounts without erasing their differences. A counterexample can refine a claim rather than destroy the value of qualitative evidence.",
  },
];
