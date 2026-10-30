/**
 * Authored warm-up shown while a paper is prepared. The cards are general
 * research habits, written for Gradly and unrelated to any uploaded paper, so
 * they cannot reveal its findings. Answers are checked here, never scored and
 * never sent anywhere.
 */
export type WarmupCard = {
  id: string;
  skill: string;
  prompt: string;
  options: { id: string; text: string }[];
  answer: string;
  explanation: string;
};

export const warmupCards: WarmupCard[] = [
  {
    id: "oat-milk",
    skill: "Association or cause?",
    prompt:
      "A café notices that customers who order oat milk leave bigger tips. What can it say?",
    options: [
      { id: "a", text: "Oat milk makes people more generous." },
      {
        id: "b",
        text: "Oat-milk customers tip more here, but something else could explain it.",
      },
    ],
    answer: "b",
    explanation:
      "That is an association. People who choose oat milk may differ in other ways, such as income or how often they visit.",
  },
  {
    id: "fair-test",
    skill: "Fair comparison",
    prompt:
      "A school wants to test a new study app fairly. Who should get the app?",
    options: [
      { id: "a", text: "The students who ask for it." },
      { id: "b", text: "A randomly chosen half of the class." },
    ],
    answer: "b",
    explanation:
      "Random assignment makes the two groups alike on average, so a later difference points to the app rather than to who volunteered.",
  },
  {
    id: "podcast-survey",
    skill: "Who was asked?",
    prompt:
      "An online survey of 2,000 volunteers finds most people love podcasts. What is the main catch?",
    options: [
      { id: "a", text: "2,000 people is far too few." },
      {
        id: "b",
        text: "People who answer a podcast survey may already like podcasts.",
      },
    ],
    answer: "b",
    explanation:
      "Two thousand is plenty for many questions. Volunteers who choose to answer are often not like everyone else.",
  },
  {
    id: "no-difference",
    skill: "Reading \"no difference\"",
    prompt:
      "A study finds no significant difference between two groups. Does that prove the groups are the same?",
    options: [
      { id: "a", text: "Yes, the groups are equal." },
      {
        id: "b",
        text: "Not necessarily. The study may have been too small or imprecise to detect a difference.",
      },
    ],
    answer: "b",
    explanation:
      "Absence of evidence is not evidence of absence. Look at the size of the estimate and how uncertain it is.",
  },
  {
    id: "exercise-sleep",
    skill: "Association or cause?",
    prompt:
      "People who exercise regularly report sleeping better. Does exercise cause better sleep?",
    options: [
      { id: "a", text: "Yes, exercise directly improves sleep." },
      {
        id: "b",
        text: "Not necessarily—healthier people may both exercise more and sleep better.",
      },
    ],
    answer: "b",
    explanation:
      "This is an observational finding. Randomized trials are needed to show causation. Other factors like overall health could explain both.",
  },
  {
    id: "big-sample",
    skill: "Sample size",
    prompt:
      "A survey of 100,000 people finds that 51% prefer blue over green. Is this result reliable?",
    options: [
      { id: "a", text: "Extremely reliable—100,000 is a huge sample." },
      {
        id: "b",
        text: "The large sample makes the estimate precise, but bias could still skew the result.",
      },
    ],
    answer: "b",
    explanation:
      "Large samples reduce random error but don't fix systematic bias. How people were sampled matters more than the count.",
  },
  {
    id: "correlation-cause",
    skill: "Association or cause?",
    prompt:
      "Countries with more vaccines have lower child mortality. Does this prove vaccines save lives?",
    options: [
      {
        id: "a",
        text: "No, wealthy countries just have both better healthcare and more vaccines.",
      },
      {
        id: "b",
        text: "This correlation is meaningful, especially supported by randomized trials of specific vaccines.",
      },
    ],
    answer: "b",
    explanation:
      "While correlation alone isn't proof, this relationship is backed by extensive experimental evidence. Context matters.",
  },
  {
    id: "outliers",
    skill: "Outliers",
    prompt:
      "One participant in a study scored 10x higher than everyone else. What should researchers do?",
    options: [
      { id: "a", text: "Remove the outlier—it skews the results." },
      {
        id: "b",
        text: "Investigate first. Outliers can be errors or genuine extreme cases worth understanding.",
      },
    ],
    answer: "b",
    explanation:
      "Never remove outliers automatically. They might reveal data entry errors, interesting phenomena, or problems with the study design.",
  },
  {
    id: "control-group",
    skill: "Controls",
    prompt:
      "A drug trial gives everyone the new pill and measures improvement. What's missing?",
    options: [
      {
        id: "a",
        text: "Nothing—if they improve, the drug works.",
      },
      {
        id: "b",
        text: "A control group getting a placebo or standard treatment, to compare against.",
      },
    ],
    answer: "b",
    explanation:
      "Without a control, you can't know if improvement came from the drug, placebo effect, or natural recovery. Comparison is essential.",
  },
  {
    id: "p-value-1",
    skill: "Significance",
    prompt:
      "A study reports p < 0.05. What does this mean?",
    options: [
      { id: "a", text: "There's less than 5% chance the finding is wrong." },
      {
        id: "b",
        text: "If there were truly no effect, results this extreme would appear less than 5% of the time.",
      },
    ],
    answer: "b",
    explanation:
      "P-values are about the probability of the data assuming no effect, not the probability that the finding is correct. This is a common misunderstanding.",
  },
  {
    id: "multiple-testing",
    skill: "Multiple comparisons",
    prompt:
      "Researchers tested 20 different foods for cancer links and found one with p < 0.05. What's the concern?",
    options: [
      {
        id: "a",
        text: "Great! They found a significant result.",
      },
      {
        id: "b",
        text: "With 20 tests, you'd expect about one false positive by chance alone at p < 0.05.",
      },
    ],
    answer: "b",
    explanation:
      "Multiple testing inflates false positives. Researchers should correct for multiple comparisons or pre-register their hypothesis.",
  },
  {
    id: "effect-size",
    skill: "Effect size",
    prompt:
      "A new diet shows a statistically significant 0.1 pound weight loss. What does 'significant' mean here?",
    options: [
      { id: "a", text: "The diet is meaningfully effective." },
      {
        id: "b",
        text: "The result is unlikely due to chance, but 0.1 pounds may be trivial in practical terms.",
      },
    ],
    answer: "b",
    explanation:
      "Statistical significance ≠ practical importance. Large samples can detect tiny real effects that don't matter in real life.",
  },
  {
    id: "self-report",
    skill: "Measurement",
    prompt:
      "A study asks people how many vegetables they eat. What's a potential problem?",
    options: [
      {
        id: "a",
        text: "People might report more vegetables than they actually eat.",
      },
      {
        id: "b",
        text: "Vegetables are too hard to count accurately.",
      },
    ],
    answer: "a",
    explanation:
      "Self-report bias is common—people often report healthier behaviors than reality. Better studies use objective measures or validate self-reports.",
  },
  {
    id: "confounding",
    skill: "Confounding",
    prompt:
      "Coffee drinkers have more heart attacks. Should you stop drinking coffee?",
    options: [
      { id: "a", text: "Yes, coffee clearly harms heart health." },
      {
        id: "b",
        text: "Not necessarily—coffee drinkers might also smoke or have other risk factors.",
      },
    ],
    answer: "b",
    explanation:
      "This is classic confounding. Coffee drinkers might differ in many ways from non-drinkers. Good studies adjust for these confounders.",
  },
  {
    id: "selection-bias",
    skill: "Bias",
    prompt:
      "An app tracks users who choose to use it. What type of bias is this?",
    options: [
      { id: "a", text: "Random sampling error." },
      {
        id: "b",
        text: "Selection bias—the people who choose to use the app may differ from the general population.",
      },
    ],
    answer: "b",
    explanation:
      "Self-selection creates biased samples. People who opt in often differ systematically from those who don't, limiting generalizability.",
  },
  {
    id: "randomization",
    skill: "Study design",
    prompt:
      "Why randomize who gets a treatment vs. who gets a placebo?",
    options: [
      {
        id: "a",
        text: "To make sure each person has the same chance of getting better.",
      },
      {
        id: "b",
        text: "To make the groups similar on average, so any difference after treatment likely comes from the treatment itself.",
      },
    ],
    answer: "b",
    explanation:
      "Randomization balances both known and unknown factors across groups. It's the foundation of causal inference in experiments.",
  },
  {
    id: "replication",
    skill: "Replication",
    prompt:
      "One study finds a surprising result. What should happen next?",
    options: [
      { id: "a", text: "Accept it—if it's published, it's verified." },
      {
        id: "b",
        text: "Other researchers should try to replicate the finding in new studies.",
      },
    ],
    answer: "b",
    explanation:
      "Single studies can be wrong due to chance, bias, or error. Replication across independent labs builds real confidence.",
  },
  {
    id: "blinding",
    skill: "Controls",
    prompt:
      "In a drug trial, neither patients nor doctors know who got the real drug. This is called:",
    options: [
      { id: "a", text: "Single-blinding." },
      { id: "b", text: "Double-blinding—a stronger design that reduces bias." },
    ],
    answer: "b",
    explanation:
      "Double-blinding prevents both placebo effects in patients and experimenter bias in outcome assessment. It's the gold standard for drug trials.",
  },
  {
    id: "confidence-interval",
    skill: "Uncertainty",
    prompt:
      "A result is reported as 50% ± 4%. What does the ± 4% likely represent?",
    options: [
      {
        id: "a",
        text: "The true value is definitely between 46% and 54%.",
      },
      {
        id: "b",
        text: "A confidence interval—if you repeated the study many times, most intervals would capture the true value.",
      },
    ],
    answer: "b",
    explanation:
      "Confidence intervals express uncertainty. They don't guarantee the true value is in this specific interval, but indicate precision of the estimate.",
  },
  {
    id: "base-rate",
    skill: "Base rates",
    prompt:
      "A medical test is 95% accurate and you test positive. Do you likely have the disease?",
    options: [
      { id: "a", text: "Yes, 95% accuracy means high confidence." },
      {
        id: "b",
        text: "It depends on how common the disease is—if it's rare, most positives are false alarms.",
      },
    ],
    answer: "b",
    explanation:
      "Base rates matter enormously. For rare diseases, even accurate tests produce mostly false positives. Always consider prevalence.",
  },
  {
    id: "regression-mean",
    skill: "Regression to the mean",
    prompt:
      "Students who score highest on test 1 often score lower on test 2. Why?",
    options: [
      { id: "a", text: "They got overconfident and studied less." },
      {
        id: "b",
        text: "Extreme scores tend to become less extreme—luck played a role, and pure luck doesn't repeat.",
      },
    ],
    answer: "b",
    explanation:
      "Regression to the mean is a statistical inevitability. Extreme observations include random variation that won't repeat.",
  },
  {
    id: "natural-experiment",
    skill: "Study design",
    prompt:
      "A law change affected some states but not others. Researchers compare outcomes. What is this?",
    options: [
      { id: "a", text: "A randomized controlled trial." },
      {
        id: "b",
        text: "A natural experiment—observational data where circumstances created comparison groups.",
      },
    ],
    answer: "b",
    explanation:
      "Natural experiments use real-world variation to approximate randomization. They're valuable but require careful analysis of potential confounders.",
  },
  {
    id: "sensitivity",
    skill: "Test accuracy",
    prompt:
      "A screening test catches 99% of actual cases. This is its:",
    options: [
      { id: "a", text: "Specificity." },
      { id: "b", text: "Sensitivity—how good it is at detecting true positives." },
    ],
    answer: "b",
    explanation:
      "Sensitivity = true positive rate. Specificity = true negative rate. Both matter for judging a test, along with disease prevalence.",
  },
  {
    id: "publication-bias",
    skill: "Bias",
    prompt:
      "Studies finding 'no effect' are less likely to be published. This creates:",
    options: [
      { id: "a", text: "Better quality control—only real effects get published." },
      {
        id: "b",
        text: "Publication bias—the literature makes effects look stronger than they really are.",
      },
    ],
    answer: "b",
    explanation:
      "File-drawer bias means null results stay unpublished. This distorts the evidence base, making effects appear more robust than reality.",
  },
  {
    id: "anecdote",
    skill: "Evidence quality",
    prompt:
      "Your friend took vitamin C and didn't get a cold. Does this prove it works?",
    options: [
      { id: "a", text: "Yes, it's a personal observation." },
      {
        id: "b",
        text: "No, anecdotal evidence can't distinguish real effects from coincidence.",
      },
    ],
    answer: "b",
    explanation:
      "Anecdotes are starting points, not evidence. Without comparison and controls, we can't know what would have happened otherwise.",
  },
  {
    id: "relative-risk",
    skill: "Risk communication",
    prompt:
      "A drug 'doubles the risk' of a side effect from 0.001% to 0.002%. What does this mean?",
    options: [
      { id: "a", text: "The drug is dangerous—the risk doubled." },
      {
        id: "b",
        text: "The absolute risk is still tiny; relative risk changes can sound scarier than the reality.",
      },
    ],
    answer: "b",
    explanation:
      "Relative risks without absolute numbers are misleading. Always ask: risk of what, from what baseline, for how many people?",
  },
  {
    id: "placebo",
    skill: "Placebo effect",
    prompt:
      "Patients getting sugar pills often feel better. Why?",
    options: [
      { id: "a", text: "The sugar has healing properties." },
      {
        id: "b",
        text: "Expectations, care, and natural improvement create perceived benefits—this is the placebo effect.",
      },
    ],
    answer: "b",
    explanation:
      "The placebo effect is real and powerful. That's why we need placebo controls—to isolate the drug's true effect from expectation effects.",
  },
  {
    id: "longitudinal",
    skill: "Study design",
    prompt:
      "Researchers follow the same people over 20 years. This is a:",
    options: [
      { id: "a", text: "Cross-sectional study." },
      {
        id: "b",
        text: "Longitudinal study—tracking changes over time within individuals.",
      },
    ],
    answer: "b",
    explanation:
      "Longitudinal studies track individuals over time, unlike cross-sectional snapshots. They're better for studying how things change but expensive.",
  },
  {
    id: "cross-sectional",
    skill: "Study design",
    prompt:
      "A survey asks 10,000 people about their health today. What can it show?",
    options: [
      {
        id: "a",
        text: "How people's health changes over time.",
      },
      {
        id: "b",
        text: "A snapshot of health at one moment, but not causes or changes.",
      },
    ],
    answer: "b",
    explanation:
      "Cross-sectional studies describe prevalence at one point in time. They can't establish causation or sequence.",
  },
  {
    id: "meta-analysis",
    skill: "Evidence synthesis",
    prompt:
      "A meta-analysis combines 15 studies on the same topic. What's its advantage?",
    options: [
      {
        id: "a",
        text: "It guarantees the correct answer.",
      },
      {
        id: "b",
        text: "It increases statistical power and can reveal patterns that individual studies miss.",
      },
    ],
    answer: "b",
    explanation:
      "Meta-analysis synthesizes evidence across studies. It's powerful but depends on the quality of included studies and proper methods.",
  },
  {
    id: "heterogeneity",
    skill: "Evidence synthesis",
    prompt:
      "Studies in a meta-analysis show very different results. What does this suggest?",
    options: [
      {
        id: "a",
        text: "The meta-analysis should be abandoned.",
      },
      {
        id: "b",
        text: "Heterogeneity—look for factors that might explain why studies differ, like populations or methods.",
      },
    ],
    answer: "b",
    explanation:
      "Heterogeneity isn't a failure to hide. It's a clue that the effect might depend on context. Investigating it often reveals important insights.",
  },
  {
    id: "cohort-study",
    skill: "Study design",
    prompt:
      "Researchers track 5,000 people who smoke and 5,000 who don't for 10 years. This is:",
    options: [
      { id: "a", text: "A case-control study." },
      { id: "b", text: "A cohort study—following groups forward in time." },
    ],
    answer: "b",
    explanation:
      "Cohort studies follow groups over time. They're good for studying risk factors but can still have confounding, unlike randomized trials.",
  },
  {
    id: "case-control",
    skill: "Study design",
    prompt:
      "Researchers compare people with a disease to similar people without it. This is:",
    options: [
      { id: "a", text: "A cohort study." },
      {
        id: "b",
        text: "A case-control study—looking backward to find past exposures.",
      },
    ],
    answer: "b",
    explanation:
      "Case-control studies start with outcomes and work backward. They're efficient for rare diseases but vulnerable to recall bias.",
  },
  {
    id: "recall-bias",
    skill: "Bias",
    prompt:
      "People with cancer might remember past chemical exposures differently. What bias is this?",
    options: [
      { id: "a", text: "Selection bias." },
      {
        id: "b",
        text: "Recall bias—knowing your diagnosis affects how you remember the past.",
      },
    ],
    answer: "b",
    explanation:
      "Recall bias distorts case-control studies. Sick people may search for explanations and recall exposures more than healthy controls.",
  },
  {
    id: "hawthorne",
    skill: "Observer effect",
    prompt:
      "Workers improve productivity when researchers observe them. This is called:",
    options: [
      {
        id: "a",
        text: "Placebo effect.",
      },
      {
        id: "b",
        text: "Hawthorne effect—people change behavior when watched or studied.",
      },
    ],
    answer: "b",
    explanation:
      "The Hawthorne effect means observation itself changes behavior. Good studies try to measure this or use unobtrusive methods.",
  },
  {
    id: "internal-validity",
    skill: "Validity",
    prompt:
      "A randomized trial shows the drug works in the study. What does this establish?",
    options: [
      {
        id: "a",
        text: "The drug works for everyone in the real world.",
      },
      {
        id: "b",
        text: "Good internal validity—the effect is real for the study sample under study conditions.",
      },
    ],
    answer: "b",
    explanation:
      "Internal validity = confidence the effect is real for the study. External validity = generalizing to other populations and settings.",
  },
  {
    id: "external-validity",
    skill: "Validity",
    prompt:
      "A drug works in a trial of healthy young adults. Will it work for elderly patients?",
    options: [
      {
        id: "a",
        text: "Yes, if the trial was randomized.",
      },
      {
        id: "b",
        text: "Not necessarily—external validity depends on how similar the target population is to the study sample.",
      },
    ],
    answer: "b",
    explanation:
      "External validity requires the study population to resemble the population you want to generalize to. Age, health status, and setting matter.",
  },
  {
    id: "surrogate-endpoint",
    skill: "Endpoints",
    prompt:
      "A drug lowers cholesterol (surrogate) but doesn't prevent heart attacks (clinical endpoint). Why might this happen?",
    options: [
      {
        id: "a",
        text: "Lab measurements are always wrong.",
      },
      {
        id: "b",
        text: "Surrogate endpoints may not capture the full causal pathway to clinical outcomes.",
      },
    ],
    answer: "b",
    explanation:
      "Surrogate endpoints are easier to measure but may not reflect true clinical benefit. Some drugs improve markers without improving health.",
  },
  {
    id: "hierarchy-evidence",
    skill: "Evidence quality",
    prompt:
      "Which is generally stronger evidence?",
    options: [
      { id: "a", text: "A case series of 5 patients." },
      {
        id: "b",
        text: "A systematic review of 20 randomized controlled trials.",
      },
    ],
    answer: "b",
    explanation:
      "Evidence hierarchies prioritize well-designed studies over weaker designs. Systematic reviews of RCTs rank higher than case reports.",
  },
  {
    id: "n-of-1",
    skill: "Study design",
    prompt:
      "A patient tries a medication, then placebo, then medication again, comparing their own symptoms. This is:",
    options: [
      { id: "a", text: "Anecdotal evidence." },
      {
        id: "b",
        text: "An N-of-1 trial—a rigorous single-patient experiment with randomization and blinding.",
      },
    ],
    answer: "b",
    explanation:
      "N-of-1 trials apply trial rigor to individual patients. They're valuable for personalized medicine and rare conditions.",
  },
  {
    id: "censoring",
    skill: "Survival analysis",
    prompt:
      "In a 5-year study, some patients move away and are lost to follow-up. What is this?",
    options: [
      { id: "a", text: "Dropout—just remove them from analysis." },
      {
        id: "b",
        text: "Censoring—specialized methods account for incomplete observation time.",
      },
    ],
    answer: "b",
    explanation:
      "Censored data requires special handling. Simply removing censored cases biases results. Survival analysis methods like Kaplan-Meier handle this.",
  },
  {
    id: "intention-to-treat",
    skill: "Analysis",
    prompt:
      "In a drug trial, some patients assigned to treatment never took it. How should they be analyzed?",
    options: [
      {
        id: "a",
        text: "Remove them—they didn't get the treatment.",
      },
      {
        id: "b",
        text: "Analyze them in their assigned group (intention-to-treat) to preserve randomization.",
      },
    ],
    answer: "b",
    explanation:
      "Intention-to-treat analysis preserves the balance from randomization. Per-protocol analyses can introduce bias and should be secondary.",
  },
  {
    id: "per-protocol",
    skill: "Analysis",
    prompt:
      "Analyzing only patients who completed treatment as prescribed is called:",
    options: [
      { id: "a", text: "Intention-to-treat analysis." },
      {
        id: "b",
        text: "Per-protocol analysis—it shows efficacy under ideal conditions but risks bias.",
      },
    ],
    answer: "b",
    explanation:
      "Per-protocol analysis excludes non-adherers. This risks bias because people who adhere may differ systematically from those who don't.",
  },
  {
    id: "subgroup-analysis",
    skill: "Analysis",
    prompt:
      "A trial shows no overall effect, but 1 of 20 subgroups shows benefit. What should you think?",
    options: [
      {
        id: "a",
        text: "The treatment works for that specific subgroup.",
      },
      {
        id: "b",
        text: "Skeptically—this could easily be a chance finding from multiple subgroup tests.",
      },
    ],
    answer: "b",
    explanation:
      "Subgroup analyses are notorious for false positives. Without pre-specification and correction for multiple testing, they're exploratory at best.",
  },
  {
    id: "interaction",
    skill: "Effect modification",
    prompt:
      "A drug helps men but not women. What is this called?",
    options: [
      { id: "a", text: "Confounding." },
      {
        id: "b",
        text: "Effect modification or interaction—the drug's effect differs by subgroup.",
      },
    ],
    answer: "b",
    explanation:
      "Effect modification means the treatment effect differs across groups. Unlike confounding, it doesn't bias the overall estimate—it's real variation.",
  },
  {
    id: "doseresponse",
    skill: "Evidence patterns",
    prompt:
      "Higher doses produce larger effects. This pattern suggests:",
    options: [
      {
        id: "a",
        text: "The treatment is dangerous.",
      },
      {
        id: "b",
        text: "A dose-response relationship, which strengthens evidence for causality.",
      },
    ],
    answer: "b",
    explanation:
      "Dose-response relationships are one of Bradford Hill's criteria for causation. More exposure → more effect suggests a real causal relationship.",
  },
  {
    id: "plausibility",
    skill: "Evidence patterns",
    prompt:
      "A finding contradicting basic biology should be scrutinized carefully because:",
    options: [
      {
        id: "a",
        text: "Biology is always right and studies are wrong.",
      },
      {
        id: "b",
        text: "Biological plausibility matters—extraordinary claims need extraordinary evidence.",
      },
    ],
    answer: "b",
    explanation:
      "Plausibility helps prioritize scrutiny. Surprising findings might be real breakthroughs or might be errors—replication becomes especially important.",
  },
  {
    id: "bradford-hill",
    skill: "Causation",
    prompt:
      "Bradford Hill's criteria for causation include all except:",
    options: [
      { id: "a", text: "Strength, consistency, and temporality." },
      {
        id: "b",
        text: "Statistical significance at p < 0.05.",
      },
    ],
    answer: "b",
    explanation:
      "Bradford Hill's criteria are strength, consistency, specificity, temporality, plausibility, coherence, experiment, analogy, and dose-response. Not p-values.",
  },
  {
    id: "temporality",
    skill: "Causation",
    prompt:
      "Why must the cause come before the effect for causation?",
    options: [
      { id: "a", text: "It's a philosophical preference." },
      {
        id: "b",
        text: "Temporal sequence is logically necessary—you can't have backward causation.",
      },
    ],
    answer: "b",
    explanation:
      "Temporality is the only absolutely necessary criterion for causation. The cause must precede the effect—no exceptions.",
  },
  {
    id: "clustering",
    skill: "Randomness",
    prompt:
      "Three cancer cases appear in one workplace. Should you assume something's wrong?",
    options: [
      {
        id: "a",
        text: "Yes, cancer clusters always indicate a problem.",
      },
      {
        id: "b",
        text: "Not necessarily—random clustering happens. Investigate, but don't assume causation.",
      },
    ],
    answer: "b",
    explanation:
      "Random clusters occur by chance. The Texas sharpshooter fallacy is drawing the target after the shots. Systematic investigation beats alarm.",
  },
  {
    id: "gamblers-fallacy",
    skill: "Randomness",
    prompt:
      "A coin landed heads 5 times. Is tails 'due'?",
    options: [
      { id: "a", text: "Yes, probability balances out." },
      {
        id: "b",
        text: "No—each flip is independent. Past outcomes don't affect future ones.",
      },
    ],
    answer: "b",
    explanation:
      "The gambler's fallacy assumes independent events will 'balance.' In reality, each flip is 50/50 regardless of history.",
  },
  {
    id: "bayesian",
    skill: "Probability",
    prompt:
      "A Bayesian approach updates beliefs with new evidence. What's the key insight?",
    options: [
      {
        id: "a",
        text: "Ignore prior beliefs and trust only new data.",
      },
      {
        id: "b",
        text: "Combine prior knowledge with new evidence—extraordinary claims need strong evidence to shift strong priors.",
      },
    ],
    answer: "b",
    explanation:
      "Bayesian thinking quantifies how evidence updates beliefs. Strong priors need strong evidence to overcome; weak priors shift easily.",
  },
  {
    id: "p-hacking",
    skill: "Research integrity",
    prompt:
      "Researchers tweak analyses until p < 0.05. This is called:",
    options: [
      { id: "a", text: "Good statistical practice." },
      {
        id: "b",
        text: "P-hacking—cherry-picking analyses to achieve significance, invalidating results.",
      },
    ],
    answer: "b",
    explanation:
      "P-hacking inflates false positives. Pre-registration and specifying analyses in advance are safeguards against this misuse of statistics.",
  },
  {
    id: "preregistration",
    skill: "Research integrity",
    prompt:
      "Pre-registering hypotheses and analyses before data collection helps prevent:",
    options: [
      {
        id: "a",
        text: "Errors by making researchers commit to a plan.",
      },
      {
        id: "b",
        text: "P-hacking and HARKing (hypothesizing after results are known), improving credibility.",
      },
    ],
    answer: "b",
    explanation:
      "Pre-registration documents intentions before seeing results. It doesn't prevent errors but reduces flexibility that leads to false positives.",
  },
  {
    id: "power",
    skill: "Sample size",
    prompt:
      "A study with 20% power to detect an effect means:",
    options: [
      { id: "a", text: "The effect is 20% of what was expected." },
      {
        id: "b",
        text: "If the effect exists, the study has only a 20% chance of detecting it—very underpowered.",
      },
    ],
    answer: "b",
    explanation:
      "Power is the probability of detecting a true effect. Low-powered studies waste resources and may miss real, important effects.",
  },
  {
    id: "precision",
    skill: "Measurement",
    prompt:
      "A bathroom scale gives slightly different weights each time you step on it. This reflects:",
    options: [
      { id: "a", text: "Poor accuracy—the scale is wrong." },
      {
        id: "b",
        text: "Poor precision—the scale gives variable readings, even if they average to the right value.",
      },
    ],
    answer: "b",
    explanation:
      "Precision = reproducibility. Accuracy = correctness. A scale can be precise but biased (consistently wrong) or imprecise but accurate on average.",
  },
  {
    id: "accuracy",
    skill: "Measurement",
    prompt:
      "A speedometer reads 75 when you're going 70. It is:",
    options: [
      {
        id: "a",
        text: "Precise—it gives the same reading each time, but inaccurate.",
      },
      {
        id: "b",
        text: "Inaccurate—it systematically overreads. The precision depends on consistency.",
      },
    ],
    answer: "b",
    explanation:
      "Inaccuracy means systematic bias. This speedometer has a 5 mph positive bias. Whether it's precise depends on how much readings vary.",
  },
  {
    id: "missing-data",
    skill: "Data quality",
    prompt:
      "A survey has 30% missing responses. What should researchers consider?",
    options: [
      {
        id: "a",
        text: "Delete incomplete cases and proceed.",
      },
      {
        id: "b",
        text: "Why data is missing—depending on the mechanism, deletion could severely bias results.",
      },
    ],
    answer: "b",
    explanation:
      "Missing data can be missing completely at random, at random, or not at random. Each has different implications and appropriate handling methods.",
  },
  {
    id: "imputation",
    skill: "Data quality",
    prompt:
      'Filling in missing values with estimates is called "imputation." When is it appropriate?',
    options: [
      {
        id: "a",
        text: "Never—it's fabricating data.",
      },
      {
        id: "b",
        text: "When done properly (e.g., multiple imputation), it can reduce bias compared to excluding incomplete cases.",
      },
    ],
    answer: "b",
    explanation:
      "Multiple imputation is often better than complete-case analysis when data aren't missing completely at random. The key is proper method choice.",
  },
  {
    id: "ecological-fallacy",
    skill: "Inference",
    prompt:
      "Countries with more doctors have worse health outcomes. Should we fire doctors?",
    options: [
      { id: "a", text: "Yes, fewer doctors would improve outcomes." },
      {
        id: "b",
        text: "No—this is the ecological fallacy. Group-level associations don't apply to individuals.",
      },
    ],
    answer: "b",
    explanation:
      "The ecological fallacy misapplies group patterns to individuals. Countries with more doctors might have sicker populations that need more doctors.",
  },
];

const predictionKey = (lessonId: string) => `gradly-prediction:${lessonId}`;

/** The learner's own guess about the paper, kept in this browser only. */
export function readPrediction(lessonId: string) {
  try {
    const text = localStorage.getItem(predictionKey(lessonId)) ?? "";
    return text.slice(0, 600);
  } catch {
    return "";
  }
}

export function writePrediction(lessonId: string, text: string) {
  try {
    if (text.trim())
      localStorage.setItem(predictionKey(lessonId), text.slice(0, 600));
    else localStorage.removeItem(predictionKey(lessonId));
  } catch {}
}

const selectionKey = (jobId: string) => `gradly-warmup-selection:${jobId}`;

/**
 * Randomly select 5 warmup cards for a session.
 * Stores selection in sessionStorage so the user sees the same cards
 * throughout their warmup session.
 */
export function getSelectedWarmupCards(jobId: string): WarmupCard[] {
  try {
    const stored = sessionStorage.getItem(selectionKey(jobId));
    if (stored) {
      const ids: string[] = JSON.parse(stored);
      // Reconstruct cards in stored order, preserving randomization
      const cardMap = new Map(warmupCards.map((c) => [c.id, c]));
      const cards = ids.map((id) => cardMap.get(id)).filter(Boolean);
      if (cards.length === 5) return cards as WarmupCard[];
    }
  } catch {}
  // No valid stored selection → create new randomized selection
  const shuffled = [...warmupCards];
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const selected = shuffled.slice(0, 5);
  try {
    sessionStorage.setItem(
      selectionKey(jobId),
      JSON.stringify(selected.map((c) => c.id)),
    );
  } catch {}
  return selected;
}
