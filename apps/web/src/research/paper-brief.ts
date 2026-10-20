// The context a learner reads before the quiz. The renderer is data-driven so a
// generated brief can use the same shape later; today only the authored sample
// exists. Numerical findings, the authors' conclusion and the statistical
// method stay locked because the quiz asks the learner to reach them.

export type PaperBrief = {
  label: string;
  title: string;
  subtitle: string;
  authors: string;
  year: number;
  venue: string;
  doi: string;
  focus: string;
  readMinutes: number;
  glance: { value: string; label: string }[];
  question: string;
  thesis: { claim: string; reasoning: string };
  background: { known: string; open: string };
  participants: { count: number; summary: string };
  design: { label: string; detail: string }[];
  conditions: [string, string];
  variables: { changed: string; measured: string; same: string[] };
  compare: string;
  locked: { id: string; title: string; note: string }[];
  words: { term: string; plain: string }[];
  provenance: string;
};

export const sampleBrief: PaperBrief = {
  label: "Sample study · authored brief",
  title: "OMG! Texting in Class = U Fail :(",
  subtitle:
    "Empirical evidence that text messaging during class disrupts comprehension",
  authors: "Gingerich & Lineweaver",
  year: 2014,
  venue: "Teaching of Psychology, 41(1), 44–51",
  doi: "10.1177/0098628313514177",
  focus:
    "This brief covers Experiment 2, the classroom experiment the quiz uses.",
  readMinutes: 3,
  glance: [
    { value: "56", label: "undergraduate participants" },
    { value: "2", label: "conditions: text or no text" },
    { value: "1", label: "recorded lecture for everyone" },
    { value: "9", label: "quiz questions afterwards" },
  ],
  question:
    "Does texting during a lecture affect how well students do on a quiz about that lecture?",
  thesis: {
    claim:
      "Texting during a lecture interferes with learning what the lecture teaches.",
    reasoning:
      "The idea is divided attention: when two activities compete for attention, performance on one of them can suffer.",
  },
  background: {
    known:
      "Students often text in class and may feel they are still following along. Research on divided attention suggests that doing two things at once can cost performance.",
    open: "Whether texting during a lecture actually lowers what students learn from it, measured by a quiz rather than by how students feel.",
  },
  participants: {
    count: 56,
    summary:
      "Undergraduate students at Butler University, recruited from psychology courses.",
  },
  design: [
    {
      label: "Random assignment",
      detail: "Each student was placed in one condition by chance.",
    },
    {
      label: "Same recorded lecture",
      detail:
        "Both groups watched it and took notes. The texting group texted a scripted conversation during it.",
    },
    {
      label: "Short intervening task",
      detail: "A brief, unrelated activity before testing.",
    },
    {
      label: "Nine-item quiz",
      detail: "Questions about the lecture's content, scored as a percentage.",
    },
  ],
  conditions: ["Text during the lecture", "No texting"],
  variables: {
    changed: "Whether a student texted during the lecture",
    measured:
      "Quiz score: the percentage of nine lecture questions answered correctly",
    same: ["The lecture", "Note-taking", "The quiz", "The timing"],
  },
  compare:
    "The average quiz score of the texting group against the average of the no-texting group.",
  locked: [
    {
      id: "method",
      title: "The statistical test",
      note: "Which analysis fits two separate groups? You decide in the quiz.",
    },
    {
      id: "results",
      title: "Results",
      note: "The group scores unlock when the quiz reaches the evidence.",
    },
    {
      id: "discussion",
      title: "Discussion",
      note: "What the authors concluded unlocks after your own verdict.",
    },
  ],
  words: [
    {
      term: "Research question",
      plain: "The one thing a study sets out to find out.",
    },
    {
      term: "Variable",
      plain: "Anything that can differ between people or situations.",
    },
    {
      term: "Condition",
      plain: "One version of the situation that a group experiences.",
    },
    {
      term: "Outcome measure",
      plain: "What researchers record to answer the question.",
    },
  ],
  provenance:
    "Authored from the published paper for this sample. With live processing, Gradly builds this brief from your paper’s extracted text.",
};
