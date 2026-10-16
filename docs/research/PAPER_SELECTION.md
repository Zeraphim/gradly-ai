# Candidate paper studies for Gradly

> Reference document. This is a vetted shortlist of source studies that could seed
> Gradly paper cases. It is a research input, not an implementation commitment and
> not evidence of learning benefit. It records what was checked, by what route, and
> where verification stopped. Register or cite it in `.agents/context-manifest.json`;
> update this file rather than duplicating its prose elsewhere.

## Purpose

Gradly turns a study into evidence-linked judgment challenges. The selection
criteria for source papers are:

- **C1 Relevant subjects** — statistics, mathematics education, machine learning,
  psychology, or learning research; accessible questions preferred over highly
  specialised technical material.
- **C2 Measurable comparisons** — clear variables, numerical outcomes, and an
  analysis or experiment comparing groups, conditions, relationships, or models.
- **C3 Teachable decisions** — enough detail to ask "Why this method?", "Is this
  comparison fair?", "What does this result mean?", and "What conclusion would
  overreach?".
- **C4 Visual potential** — results or methods representable through group diagrams,
  timelines, charts, predictions, or evidence comparisons.
- **C5 Manageable complexity** — prefer one clear study or a self-contained
  experiment; full text, methods, and readable results must be accessible.
- **C6 Exclusions** — no qualitative, descriptive-only, opinion, or literature-summary
  work, and no purely theoretical proofs without an empirical evaluation. Descriptive
  statistics may appear but must go beyond reporting counts or averages.

For machine-learning papers, prefer understandable experiments comparing models or
methods with defined evaluation measures that explain dataset, comparison setup, and
limitations rather than only claiming a better score.

## How candidates were checked

Each candidate was verified against its full text or publisher record, not a search
snippet. Full text was read directly for Doyen et al. (2012), Watts et al. (2018),
Deslauriers et al. (2019), and Bobek & Tversky (2016). The machine-learning and
economics entries were checked from their proceedings or arXiv records (abstract plus
publisher metadata). Where a specific number could only be confirmed secondhand, it
is marked **[secondhand]** in the entry.

This is a curated set from targeted searches, not a systematic review. No bibliographic
database (Scopus/Web of Science) was queried; treat it as a starting set, not a
complete census.

### Access and licensing

**Open to read is not the same as open to redistribute.** Only studies with an explicit
licence permitting redistribution are stored under `papers/`. Free-to-read items
(arXiv, PMLR) keep a link because their default terms do not grant third-party
redistribution. Paywalled versions of record are linked, never copied. See
[papers/README.md](papers/README.md) for per-file provenance and licence text.

| Marker       | Meaning                                                             |
| ------------ | ------------------------------------------------------------------- |
| ✅ committed | Explicit licence permits redistribution; PDF stored under `papers/` |
| 🔗 linked    | Open to read, no redistribution licence verified; link only         |
| ⚠️ paywalled | Version of record is paywalled; an author/repository copy may exist |

## Summary

| #   | Study                       | Area                  | Design                                        | Headline result                                           | Access         |
| --- | --------------------------- | --------------------- | --------------------------------------------- | --------------------------------------------------------- | -------------- |
| 1   | Deslauriers et al. 2019     | Learning              | Randomised within-student crossover, _n_=149  | Active learning: +0.46 SD test, −0.56 SD felt learning    | 🔗 CC BY-NC-ND |
| 2   | Roediger & Karpicke 2006    | Learning              | Three study/test schedules, delay manipulated | Immediate: study wins; 1 week: testing wins               | ⚠️             |
| 3   | Bobek & Tversky 2016        | Learning              | Randomised draw-vs-write, grades 7–8          | Drawing > writing (_d_=0.88); aids low-spatial learners   | ✅ committed   |
| 4   | Rohrer & Taylor 2007        | Mathematics education | Blocked vs shuffled practice, 1-week test     | Interleaved ~63% vs blocked ~20% **[secondhand]**         | ⚠️             |
| 5   | Chi et al. 1994             | Learning              | Prompted vs unprompted self-explanation       | Prompted group gains more; high explainers reach model    | ⚠️             |
| 6   | Doyen et al. 2012           | Psychology            | Two priming replications, _n_=120/50          | Exp 1 null; Exp 2 effect only via experimenter expectancy | ✅ CC BY       |
| 7   | Watts et al. 2018           | Psychology            | Longitudinal replication, _n_=918             | β≈.28 → ≈.05 under controls; threshold at 20 s            | 🔗             |
| 8   | Miller & Sanjurjo 2018      | Statistics            | Measure-bias proof + reanalysis               | Correcting the bias reverses the hot-hand conclusion      | 🔗             |
| 9   | Recht et al. 2019           | Machine learning      | New test sets for CIFAR/ImageNet              | Accuracy drops 3–15% / 11–14%; not adaptivity             | 🔗             |
| 10  | Lučić et al. 2018           | Machine learning      | Seven GANs, equal tuning budget               | No GAN reliably beats the basic baseline                  | 🔗             |
| 11  | Musgrave et al. 2020        | Machine learning      | Re-run metric-learning methods fairly         | Reported gains largely disappear                          | 🔗             |
| 12  | Ferrari Dacrema et al. 2019 | Machine learning      | 18 neural recommenders vs baselines           | 6 of 7 reproducible ones beaten by simple baselines       | 🔗             |

## Studies

### 1. Deslauriers et al. (2019) — active learning vs feeling of learning

- **Source:** _PNAS_ 116(39):19251–19257 · doi:10.1073/pnas.1821936116
  · open-access deposit: PMC6765278 (CC BY-NC-ND 4.0)
- **Design (verified):** two Harvard introductory physics courses, identical content and
  handouts; students randomly assigned and each experienced both modes (crossover:
  statics = active then passive; fluids = reversed). _n_=149 (8 of 157 excluded). Tests
  were 12-item multiple-choice, written independently of the instructors; felt learning
  (FOL) was a Likert survey.
- **Result (verified):** active learning produced **FOL 0.56 SD lower** and **test score
  0.46 SD higher**, both _P_<0.001. Of 17 follow-up interviews, 15 found active
  instruction disjointed; perceived instructor fluency predicted FOL (+0.51 SD).
- **Fits:** C1, C2 (randomised comparison, standardised effects), C3 (strong), C4
  (paired FOL-vs-test bars per topic), C5 (open text), C6 (empirical).
- **Teachable decisions:** why the crossover? is a student-level randomisation fair when
  teaching is delivered by class? what does 0.46 SD mean for a 12-item quiz?
- **Would overreach:** "student evaluations are worthless", or generalising a Harvard
  physics result to all subjects.

### 2. Roediger & Karpicke (2006) — testing effect

- **Source:** _Psychological Science_ 17(3):249–255 · doi:10.1111/j.1467-9280.2006.01693.x
  (paywalled version of record; author/handout copies widely mirrored)
- **Design:** students read passages under three schedules — repeated study (SSSS),
  study-study-study-test (SSST), study-test-test-test (STTT) — then took a free-recall
  test at 5 minutes or 1 week.
- **Result [secondhand, consistent across secondary sources]:** at 5 min, more study won
  (SSSS ≈83% > SSST ≈78% > STTT ≈71%); at 1 week the order reversed (≈61% testing vs
  ≈40% repeated study). Confirm exact percentages against the version of record before
  publishing.
- **Fits:** C1, C2 (three conditions), C3 (the ranking flip is the lesson), C4
  (retention-vs-delay line chart), C6 (empirical). **C5 caveat:** paywalled.
- **Would overreach:** "testing always beats studying", or reading a one-week memory
  effect as durable learning.

### 3. Bobek & Tversky (2016) — creating visual explanations

- **Source:** _Cognitive Research: Principles and Implications_ 1:27
  · doi:10.1186/s41235-016-0031-6 (open access, CC BY 4.0; PMC5256450)
- **Local copy:** `papers/bobek-tversky-2016-visual-explanations.pdf` (published version
  of record, CC BY 4.0)
- **Design (verified):** Experiment 1 — 127 grade 7–8 students randomised (within class)
  to draw or write an explanation of a bicycle pump, then a 16-item true/false post-test;
  spatial ability measured with a mental-rotation test. Experiment 2 — 126 grade 8
  students watched a bonding video, took an immediate post-test, were randomised to draw
  or write, then a delayed post-test, measuring learning with no extra teaching.
- **Result (verified):** Experiment 1 — significant interaction: drawing selectively
  helped low-spatial-ability students (11.45 vs 9.75), high-spatial students unaffected.
  Experiment 2 — both groups improved with no new instruction; visual **0.822 vs verbal
  0.631**, _d_=0.88.
- **Fits:** C1, C2 (randomised, two domains), C3 (interaction; no re-study), C4 (2×2
  condition × ability chart), C5 (fully open), C6 (empirical).
- **Teachable decisions:** is the median split of spatial ability a fair grouping? what
  does the interaction mean?
- **Would overreach:** "drawing always beats writing" — in Experiment 1 it helped only
  low-spatial students.

### 4. Rohrer & Taylor (2007) — interleaved mathematics practice

- **Source:** _Instructional Science_ 35:481–498 · doi:10.1007/s11251-007-9015-8
  (paywalled; no clean open full text verified)
- **Design:** students practised several kinds of mathematics problems blocked by type
  or shuffled (interleaved), then were tested (mixed) one week later.
- **Result [secondhand]:** large advantage for shuffled practice; Taylor & Rohrer (2010)
  describe the 2007 effect as roughly tripling test scores (~63% vs ~20%). Verify against
  the version of record.
- **Fits:** C1 (mathematics education), C2, C3 (strong), C4 (practice-vs-test
  divergence), C6. **C5 caveat:** access is the weak point.
- **Teachable decisions:** why delay the test? the shuffled group looks worse during
  practice — judging by practice performance reverses the conclusion.
- **Would overreach:** "always interleave"; the finding is about choosing the right
  method, and one study is not a universal rule.

### 5. Chi et al. (1994) — self-explanation

- **Source:** _Cognitive Science_ 18(3):439–477 · doi:10.1207/s15516709cog1803_3
  (paywalled; author copies hosted at Arizona State University and elsewhere)
- **Design:** grade 8 students studied a text on the human circulatory system; one group
  was prompted to self-explain, one was not; knowledge assessed before and after.
- **Result [secondhand]:** prompted students made larger gains; students who
  spontaneously produced many explanations reached the correct mental model.
- **Fits:** C1, C3 (what counts as an explanation?), C4 (pre-test→post-test gains),
  C6. **C2** present but softer; **C5 caveat:** paywalled.
- **Would overreach:** "any explanation works" — explanation quality, not mere presence,
  tracked understanding.

### 6. Doyen et al. (2012) — failing to replicate elderly priming

- **Source:** _PLoS ONE_ 7(1):e29081 · doi:10.1371/journal.pone.0029081 (CC BY 4.0)
- **Local copy:** `papers/doyen-2012-behavioral-priming.pdf`
- **Design (verified):** Experiment 1 — 120 students, prime vs no-prime, infrared-timed
  walking speed. Experiment 2 — 50 students; experimenters primed to expect slow or fast
  walking; both objective (infrared) and subjective (stopwatch) timings recorded.
- **Result (verified):** Experiment 1 — no priming effect (F(1,119)<1, η²=.01).
  Experiment 2 — the effect appeared only when experimenters expected slowness
  (objective: 6.95 s vs 6.52 s, F=7.07, _p_=.014), and reversed under subjective timing
  for the "fast" expectation.
- **Fits:** C1, C2 (group comparisons with interactions), C3 (outstanding: measurement
  and expectancy), C4 (two timing-modality charts), C5 (fully open), C6 (empirical).
- **Teachable decisions:** does improving one study's method prove the original wrong?
  what does the objective-vs-subjective split identify?
- **Would overreach:** "social priming is fake" — the authors conclude it is real but
  mechanism-dependent.

### 7. Watts et al. (2018) — revisiting the marshmallow test

- **Source:** _Psychological Science_ 29(7):1159–1177 · doi:10.1177/0956797618761661
  (free author manuscript: PMC6050075)
- **Design (verified):** conceptual replication using NICHD SECCYD data, _n_=918
  (552 children of non-degreed mothers); delay of gratification at 54 months vs
  achievement and behaviour at 15 years, adding controls in stages.
- **Result (verified):** bivariate standardised association with achievement ≈**0.28**
  (Grade 1) / **0.24** (age 15); falls to ≈**0.10/0.08** with early background and home
  controls, then to ≈**0.05 (ns)** with concurrent controls. Most achievement variation
  came from waiting **at least ~20 s**; behavioural associations near zero.
- **Fits:** C1, C2 (comparison across model specifications), C3 (strongest possible
  causal-misreading lesson), C4 (threshold plot; coefficient ladder), C5 (open via PMC),
  C6 (model-based inference, not description).
- **Teachable decisions:** it is observational — no random assignment; controlling
  changes the estimate but does not prove causation.
- **Would overreach:** "self-control doesn't matter" or "the marshmallow test is
  debunked" — the association shrinks, it does not vanish.

### 8. Miller & Sanjurjo (2018) — hot-hand measurement bias

- **Source:** _Econometrica_ 86(6):2019–2047 · doi:10.3982/ECTA14943
  (free preprint: arXiv:1902.01265)
- **Design:** proves a streak-selection bias in the conditional-mean statistic used
  across hot-hand studies, then reanalyses the canonical basketball data.
- **Result:** after correcting the bias, the long-standing "hot hand fallacy" conclusion
  is reversed.
- **Fits:** C1 (statistics), C2 (corrected vs uncorrected), C3 (what is the estimand?),
  C4 (bias-vs-sequence-length illustration), C6 (has empirical reanalysis, not
  proof-only).
- **Caveat:** **borderline C1/C5** — the topic is accessible (basketball) but the
  derivation is specialised maths. This is the entry most likely to breach "prefer
  accessible over highly specialised".
- **Would overreach:** "the hot hand is proven real."

### 9. Recht et al. (2019) — Do ImageNet Classifiers Generalize to ImageNet?

- **Source:** ICML, PMLR 97:5389–5400 (free: proceedings.mlr.press/v97/recht19a.html)
- **Design/result:** rebuilt CIFAR-10.1 and ImageNetV2 following the original collection
  process and evaluated many models. Accuracy drops of 3–15% (CIFAR-10) and 11–14%
  (ImageNet); gains on the original test set translate to larger gains on the new sets;
  the drop is not adaptive overfitting.
- **Fits:** C2 (model comparison), C3 (what would overfitting-to-the-test-set look like?),
  C4 (old-vs-new accuracy scatter), C6. **Would overreach:** "deep learning is broken."

### 10. Lučić et al. (2018) — Are GANs Created Equal?

- **Source:** NeurIPS 2018 (free: arXiv:1711.10337)
- **Design/result:** seven GAN variants, five datasets, FID plus precision/recall,
  equal hyperparameter budget and random restarts. No method reliably beats the basic
  non-saturating baseline; the authors added an explicit limitations section.
- **Fits:** C2 (model comparison with defined measures), C3 (is the tuning budget
  equal?), C6. **Would overreach:** "all GANs are equal."

### 11. Musgrave et al. (2020) — A Metric Learning Reality Check

- **Source:** ECCV 2020 (free: arXiv:2003.08505)
- **Design/result:** identifies experimental-methodology flaws in prior work and
  reproduces methods under a controlled protocol; claimed gains over a decade are
  marginal at best.
- **Fits:** C2, C3 (what is a fair baseline?), C6. **Would overreach:** "there has been
  no progress in metric learning."

### 12. Ferrari Dacrema et al. (2019) — neural recommendation progress

- **Source:** RecSys 2019 (free: arXiv:1907.06902)
- **Design/result:** 18 neural recommenders; only 7 reproducible; 6 of those were beaten
  by simple heuristics, and the seventh did not consistently beat a tuned non-neural
  linear ranker.
- **Fits:** C2, C3, C6. **Would overreach:** "neural methods don't work."

## Considered and set aside

- **Freeman et al. 2014** (active learning, _PNAS_) — meta-analysis; hits C6's "no
  literature summaries" even though it is quantitative.
- **Mueller & Oppenheimer 2014** ("pen is mightier") — its own result is contested by a
  direct replication (Morehead et al. 2019); risky as a "published finding".
- **Open Science Collaboration 2015** — mostly a descriptive summary of replication
  rates.
- **Gilovich et al. 1985** (original hot hand) — the measurement is exactly what study 8
  shows to be biased.
- **Dunlosky et al. 2013** — review article, C6.
- **Karpicke & Blunt 2011** (retrieval vs concept mapping, _Science_) — strong, but a
  natural pair for study 2 rather than a separate case; same access caveat.

## Open questions about the criteria

1. **C2's wording** ("groups, conditions, relationships, or models") admits observational
   designs such as study 7. If only designs with a manipulation should qualify, tighten
   "relationships"; otherwise a correlation-only study can pass while teaching less about
   fair comparison.
2. **C5 is the binding constraint.** Much of the classic learning-science canon is
   paywalled at the version of record. Decide whether an open author copy is acceptable,
   or whether C5 requires a genuinely open publication — that choice would reshape the
   learning/education half of this list toward open venues.

## Verification log

- Read directly: full text of Doyen et al. (2012), Watts et al. (2018), Deslauriers
  et al. (2019), Bobek & Tversky (2016); proceedings/arXiv records for studies 8–12.
- Secondhand only (marked above): exact percentages for studies 2, 4, and 5, and the
  Karpicke & Blunt note.
- Not done: no bibliographic-database search; no attempt was made to open publisher PDFs
  for the paywalled entries. The PNAS site returned HTTP 403 to the retrieval tool, so
  study 1 was read through its PMC deposit.
- Redistribution note: only studies 3 and 6 have PDFs under `papers/`, because they are
  the two whose licence permits redistribution (study 6 under CC BY 4.0; study 3 under
  CC BY 4.0, published version of record retrieved via PMC5256450). Studies 9–12 are free
  to read, but their terms (PMLR author copyright; arXiv non-exclusive licence) do not
  grant redistribution, so they are linked only. Study 1 (Deslauriers, CC BY-NC-ND) is
  still unretrieved — PNAS, PMC, Europe PMC, and Semantic Scholar all blocked automated
  download.
