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
        text: "Ten local people were interviewed, including regular volunteers and people who rarely joined in. The question concerns experiences of belonging, not a population rating of the garden.",
        sourceLabel: "Fictional case · Method and question",
      },
      {
        id: "garden-invitation",
        label: "Recognition can matter",
        kind: "finding",
        text: "Interview A describes feeling part of the garden after other volunteers asked for advice about seedlings. The account connects belonging with being recognised as someone who could contribute.",
        sourceLabel: "Fictional case · Interview A summary",
      },
      {
        id: "garden-quiet",
        label: "Participation need not mean more events",
        kind: "finding",
        text: "Interview B enjoys watering plants quietly after work and does not want more organised social events. This challenges a recommendation that more group activities would improve everyone’s experience.",
        sourceLabel: "Fictional case · Interview B summary",
      },
      {
        id: "garden-access",
        label: "Wanting to join is not the same as being able to",
        kind: "finding",
        text: "Interview C wants to participate but describes a narrow route and tasks that are difficult to access. Low participation in this account is not evidence of low interest.",
        sourceLabel: "Fictional case · Interview C summary",
      },
      {
        id: "garden-boundary",
        label: "An interpretation is not a vote",
        kind: "limitation",
        text: "Three selected accounts cannot establish a final theme or the prevalence of an experience. A defensible interpretation needs a coherent connection to the question and material, including accounts that complicate it.",
        sourceLabel: "Fictional case · Analytic limits",
      },
    ],
    claims: [
      {
        id: "garden-cautious",
        text: "Because these are personal accounts, no meaningful interpretation is possible.",
        feedback:
          "Personal accounts are relevant to a question about experience. Interpretive work can be rigorous when it explains its connections and limits; it does not require a single mechanical answer.",
      },
      {
        id: "garden-supported",
        text: "These accounts suggest that belonging involves recognition and workable forms of participation, while the garden means different things to different people.",
        feedback:
          "This is a defensible provisional reading of the supplied accounts. It includes difference, avoids a universal claim and leaves room to review the whole dataset or develop another coherent interpretation.",
      },
      {
        id: "garden-overreach",
        text: "The garden makes everyone feel connected, so more group events will benefit every resident.",
        feedback:
          "Wanting to participate can coexist with inaccessible conditions, and one person values quiet participation. The supplied accounts do not support a universal experience or a tested solution.",
      },
    ],
    supportedClaimId: "garden-supported",
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
          text: "Discard it because it conflicts with the idea that group events create belonging.",
          feedback:
            "A contrary account is evidence to examine, not an inconvenience to remove so that a preferred interpretation survives.",
        },
        {
          id: "garden-transfer-revisit",
          text: "Revisit how invitation and preferred forms of participation create belonging; retain the difference and review the wider dataset.",
          feedback:
            "The new account can refine the interpretation. It distinguishes feeling included from attending organised events without claiming that one extract settles the whole analysis.",
        },
        {
          id: "garden-transfer-vote",
          text: "Count mentions and call whichever activity is most frequent the true theme.",
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
