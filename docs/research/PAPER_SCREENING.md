# Paper screening for prepared studies

> Screening record for issue #13. Each candidate is checked against gates G1–G7 from that issue. Rejected candidates stay listed with their reason so nobody re-checks them. Licence (G6) was read from the Europe PMC licence field and the article's own licence statement. G7 was measured on the downloaded file against the limits in `apps/api/src/research/pdf.ts` and `limits.ts`. G1–G5 are screening judgements from the full text and still need content review.

| ID | Gate | Pass when |
| --- | --- | --- |
| G1 | Learner fit | Psychology, education or learning science, followable by a graduate psychology student |
| G2 | Research decisions | Supports at least three research decisions (design, fair comparison, analysis, meaning, overreach) |
| G3 | Evidence in the text | n, conditions, test and effect size or means stated in the text |
| G4 | One clear study | One experiment or a small self-contained set; not a review, meta-analysis, opinion or qualitative study |
| G5 | Teachable trap | A realistic misconception or overreach to teach |
| G6 | Licence | CC BY or CC0, read from the publisher licence |
| G7 | Technical fit | Text PDF, ≤80 pages, <4 MB, ≤250,000 characters |

Outcome values: **stored** (in `papers/`), **surplus** (passed every gate but left out to keep the 50 balanced across designs; not stored), **rejected**, **removed** (stored on 2026-10-20, then removed on 2026-10-24 to reduce school and academic-performance topics; the file and provenance entry were deleted, the row stays).

Sources were limited to PLOS ONE and Frontiers in Psychology because they are the only listed publishers whose PDFs could be retrieved by script (PeerJ, Collabra, Royal Society Open Science and PMC returned 403 on 2026-10-20).

## Coverage of stored papers

| Design group | Stored |
| --- | --- |
| Randomised between-subjects experiment | 7 |
| Within-subjects / repeated measures | 7 |
| Replication | 8 |
| Cross-sectional correlational | 7 |
| Longitudinal / cohort | 7 |
| Classroom, field or quasi-experiment | 7 |
| Null or equivalence result | 7 |

Plus the two earlier stored papers (Doyen 2012, Bobek & Tversky 2016): 52 prepared studies.

## Topic coverage

Tymee's review on 2026-10-24 found the first 50 anchored on student life (school, grades, cheating, study habits), following the seed paper and G1's education wording. G1–G7 still decide fit. Topic balance is a set-level rule added on top: on 2026-10-24, 14 school-topic papers were replaced by non-student papers from the same design group, so the design counts above did not change. Each topic is the paper's subject, not its sample. Several papers outside the school topic still recruited undergraduates.

| Topic | Stored 2026-10-20 | Stored 2026-10-24 |
| --- | --- | --- |
| School and academic performance | 19 | 6 |
| Learning, memory and cognition | 12 | 11 |
| Health and the body | 5 | 9 |
| Wellbeing and family | 2 | 3 |
| Social behaviour, beliefs and politics | 9 | 11 |
| Media and technology | 3 | 5 |
| Environment, transport, work and money | 0 | 5 |

Seven papers were kept because the prepared-study lessons in progress on branch `feat/study-journey-preview` use them: Creswell 2013, Franzen 2023, Gao 2021, Rogowsky 2020, Stormark 2019, Takahashi 2019 and Wienecke 2021. Four of them (Gao, Rogowsky, Stormark, Wienecke) are school topics. Lab learning and memory papers are still the largest group after social behaviour, so future candidates should come from the under-covered topics. Raff 2025 is flagged as close to academic life (academics invited to a survey) and is the first to swap if a better null-result paper appears.

### Stored papers by design group and topic

Prepared studies take their design group and topic from this table (`scripts/generate-prepared-studies.ts` reads it). Doyen 2012 and Bobek & Tversky 2016 were stored before this screening and are not counted in the tables above; they are listed here so every stored paper has a group and topic.

| File | DOI | Design group | Topic |
| --- | --- | --- | --- |
| `doyen-2012-behavioral-priming.pdf` | 10.1371/journal.pone.0029081 | Replication | Social behaviour, beliefs and politics |
| `bobek-tversky-2016-visual-explanations.pdf` | 10.1186/s41235-016-0031-6 | Randomised between-subjects experiment | School and academic performance |
| `creswell-2013-self-affirmation-problem-solving.pdf` | 10.1371/journal.pone.0062593 | Randomised between-subjects experiment | Learning, memory and cognition |
| `rozenkrantz-2017-placebo-creativity.pdf` | 10.1371/journal.pone.0182466 | Randomised between-subjects experiment | Learning, memory and cognition |
| `tsang-2024-stereotype-threat-prospective-memory.pdf` | 10.3389/fpsyg.2024.1379160 | Randomised between-subjects experiment | Social behaviour, beliefs and politics |
| `tan-2024-vaccine-safety-framing.pdf` | 10.1371/journal.pone.0302233 | Randomised between-subjects experiment | Health and the body |
| `ruzi-2021-narrative-perspective-science-video.pdf` | 10.1371/journal.pone.0257866 | Randomised between-subjects experiment | Media and technology |
| `taillie-2022-red-meat-warnings.pdf` | 10.1371/journal.pone.0268121 | Randomised between-subjects experiment | Health and the body |
| `gesser-edelsburg-2018-correcting-misinformation.pdf` | 10.1371/journal.pone.0209505 | Randomised between-subjects experiment | Health and the body |
| `takahashi-2019-running-badminton-executive.pdf` | 10.1371/journal.pone.0216842 | Within-subjects / repeated measures | Learning, memory and cognition |
| `cloutier-2020-background-music-attention-age.pdf` | 10.3389/fpsyg.2020.557225 | Within-subjects / repeated measures | Learning, memory and cognition |
| `icht-2014-production-effect-distinctiveness.pdf` | 10.3389/fpsyg.2014.00886 | Within-subjects / repeated measures | Learning, memory and cognition |
| `bentley-2017-self-reference-online.pdf` | 10.1371/journal.pone.0176611 | Within-subjects / repeated measures | Learning, memory and cognition |
| `meyers-2020-survival-processing-context.pdf` | 10.3389/fpsyg.2020.02244 | Within-subjects / repeated measures | Learning, memory and cognition |
| `carruth-2023-willpower-ego-depletion-replication.pdf` | 10.1371/journal.pone.0287911 | Replication | Learning, memory and cognition |
| `harris-2013-goal-priming-failures.pdf` | 10.1371/journal.pone.0072467 | Replication | Learning, memory and cognition |
| `sanchez-2017-analytic-thinking-religion-replication.pdf` | 10.1371/journal.pone.0172636 | Replication | Social behaviour, beliefs and politics |
| `schilder-2014-warmth-perceptual-focus-replication.pdf` | 10.1371/journal.pone.0112772 | Replication | Social behaviour, beliefs and politics |
| `imaizumi-2020-fluid-movements-creativity-replication.pdf` | 10.1371/journal.pone.0236825 | Replication | Learning, memory and cognition |
| `rotella-2021-watching-eyes-replication.pdf` | 10.1371/journal.pone.0255531 | Replication | Social behaviour, beliefs and politics |
| `franzen-2023-asch-conformity-replication.pdf` | 10.1371/journal.pone.0294325 | Replication | Social behaviour, beliefs and politics |
| `bonsaksen-2025-social-media-sleep-problems.pdf` | 10.1371/journal.pone.0318507 | Cross-sectional correlational | Media and technology |
| `marciano-2023-social-media-flourishing.pdf` | 10.3389/fpsyg.2023.1092109 | Cross-sectional correlational | Media and technology |
| `gorgol-2023-chronotype-religiosity-life-satisfaction.pdf` | 10.1371/journal.pone.0284787 | Cross-sectional correlational | Wellbeing and family |
| `gao-2021-breakfast-academic-achievement.pdf` | 10.3389/fpsyg.2021.700989 | Cross-sectional correlational | School and academic performance |
| `giuliani-2021-delay-gratification-eating.pdf` | 10.3389/fpsyg.2021.650046 | Longitudinal / cohort | Health and the body |
| `unanue-2019-gratitude-life-satisfaction.pdf` | 10.3389/fpsyg.2019.02480 | Longitudinal / cohort | Wellbeing and family |
| `dwyer-2019-activism-wellbeing-election.pdf` | 10.1371/journal.pone.0221754 | Longitudinal / cohort | Social behaviour, beliefs and politics |
| `vanderweiden-2020-self-control-habit-formation.pdf` | 10.3389/fpsyg.2020.00560 | Longitudinal / cohort | Health and the body |
| `stormark-2019-sleep-problems-school-performance.pdf` | 10.1371/journal.pone.0224139 | Longitudinal / cohort | School and academic performance |
| `janz-2019-mindfulness-calmspace.pdf` | 10.3389/fpsyg.2019.02052 | Classroom, field or quasi-experiment | School and academic performance |
| `rohrer-2021-seating-friendships.pdf` | 10.1371/journal.pone.0255097 | Classroom, field or quasi-experiment | School and academic performance |
| `wienecke-2021-basketball-mathematics.pdf` | 10.3389/fpsyg.2021.636578 | Classroom, field or quasi-experiment | School and academic performance |
| `rogowsky-2020-learning-styles-matching.pdf` | 10.3389/fpsyg.2020.00164 | Null or equivalence result | School and academic performance |
| `liu-2021-mindset-placebo-wm-training.pdf` | 10.3389/fpsyg.2021.712309 | Null or equivalence result | Learning, memory and cognition |
| `smit-2022-major-minor-png.pdf` | 10.1371/journal.pone.0269597 | Null or equivalence result | Social behaviour, beliefs and politics |
| `muller-2022-anxiety-political-attitudes.pdf` | 10.3389/fpsyg.2022.1006757 | Null or equivalence result | Social behaviour, beliefs and politics |
| `bertram-2025-trust-truth-null.pdf` | 10.3389/fpsyg.2025.1626047 | Null or equivalence result | Social behaviour, beliefs and politics |
| `stephens-2020-swearing-pain.pdf` | 10.3389/fpsyg.2020.00723 | Within-subjects / repeated measures | Health and the body |
| `mcnabb-2016-smartphone-driving.pdf` | 10.1371/journal.pone.0148555 | Within-subjects / repeated measures | Media and technology |
| `boch-2019-tv-death-penalty-replication.pdf` | 10.3389/fpsyg.2019.01601 | Replication | Social behaviour, beliefs and politics |
| `an-2016-nature-sunlight-work.pdf` | 10.1371/journal.pone.0155614 | Cross-sectional correlational | Environment, transport, work and money |
| `shevlin-2022-debt-mental-health.pdf` | 10.1371/journal.pone.0274052 | Cross-sectional correlational | Environment, transport, work and money |
| `fu-2022-hearing-loss-loneliness.pdf` | 10.3389/fpsyg.2022.917276 | Cross-sectional correlational | Health and the body |
| `taniguchi-2022-dog-ownership-disability.pdf` | 10.1371/journal.pone.0263791 | Longitudinal / cohort | Health and the body |
| `stannard-2019-birth-order-wellbeing.pdf` | 10.1371/journal.pone.0222184 | Longitudinal / cohort | Wellbeing and family |
| `franssens-2021-bus-nudge-social-label.pdf` | 10.3389/fpsyg.2021.633865 | Classroom, field or quasi-experiment | Environment, transport, work and money |
| `gaube-2018-emoticon-hand-hygiene.pdf` | 10.1371/journal.pone.0197465 | Classroom, field or quasi-experiment | Health and the body |
| `mundt-2020-straw-default-nudge.pdf` | 10.3389/fpsyg.2020.565537 | Classroom, field or quasi-experiment | Environment, transport, work and money |
| `baillon-2019-phishing-information-experience.pdf` | 10.1371/journal.pone.0224216 | Classroom, field or quasi-experiment | Media and technology |
| `rennung-2016-power-pose-backlash.pdf` | 10.3389/fpsyg.2016.01463 | Null or equivalence result | Social behaviour, beliefs and politics |
| `raff-2025-earmarking-donations.pdf` | 10.1371/journal.pone.0331498 | Null or equivalence result | Environment, transport, work and money |

## Screening table

| Study | DOI | Design group | G1 | G2 | G3 | G4 | G5 | G6 | G7 | Outcome | Reason or trap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Creswell, Dutcher, Klein et al. 2013 | 10.1371/journal.pone.0062593 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Overgeneralising a moderated effect from 73 US undergraduates to 'school settings'; the benefit is confined to high-stress participants (median split only for display), and the manipulation check measures value importance, not felt affirmation |
| Gesser-Edelsburg, Diamant, Hijazi et al. 2018 | 10.1371/journal.pone.0209505 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Confounded manipulation (the recommended correction differs in transparency, empathy and content at once) and 83% female social-welfare graduate students generalised to the public |
| Rozenkrantz, Mayo, Ilan et al. 2017 | 10.1371/journal.pone.0182466 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Multiple comparisons and selective focus: about 11 outcome measures across 3 tests, only a few reach p<.05 (several near .05), and the null test is set aside; 'placebo enhances creativity' overreaches |
| Ruzi, Lee & Smith 2021 | 10.1371/journal.pone.0257866 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Multiple comparisons across 8 outcomes and small effects; covariates chosen by testing baseline differences after randomisation; one fabricated ant story generalised to science communication |
| Taillie, Prestemon, Hall et al. 2022 | 10.1371/journal.pone.0268121 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Perceived effectiveness and 7-day intentions read as behaviour change; 8 vs 10 messages per condition; exploratory convenience sample |
| Tan, Liu & Zhang 2024 | 10.1371/journal.pone.0302233 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Statistical vs practical significance: with n=3,861 an eta2 of .001-.003 is 'significant'; many outcomes and subgroup tests invite multiple-comparison false positives; convenience sample used to advise governments |
| Tsang, Chan, Lu & Wong 2024 | 10.3389/fpsyg.2024.1379160 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | stored | Manipulation check only tests reading comprehension, not felt threat; a post hoc age split with about 22 people is presented as a key finding |
| Smith, Flick & Michalski 2024 | 10.3389/fpsyg.2024.1439463 | Randomised between-subjects experiment | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: mixes a correlational study with the experiment; politically charged topic |
| Abraham, McRae & Mangels 2019 | 10.3389/fpsyg.2019.01179 | Randomised between-subjects experiment | **fail**: complex mixed design and rank-transformed MANOVAs | pass | pass | – | – | pass | pass | rejected | Design (4 groups x gender x repeated test phases, rank-transformed MANOVAs, 92k characters) is too complex for a clear single teaching case. The gender-specific headline would be a good subgroup trap, but the analysis is hard to follow |
| Giblin, Morewedge & Norton 2013 | 10.3389/fpsyg.2013.00598 | Randomised between-subjects experiment | – | – | – | pass | pass | pass | – | rejected | The key claim is an equivalence/null result ('just as positively'), which falls under the null-result category another agent covers |
| Gosling & Moutier 2017 | 10.3389/fpsyg.2017.00081 | Randomised between-subjects experiment | – | – | – | – | – | pass | – | rejected | Core contribution is the within-subjects design and correlational emotion analysis, not a clean between-subjects comparison. Outside c1 scope |
| Langeborg & Eriksson 2016 | 10.3389/fpsyg.2016.00225 | Randomised between-subjects experiment | – | – | – | – | – | pass | – | rejected | Per the abstract, the key conclusions rest on non-significant interactions (anchoring unaffected by load or credibility), which makes it null-focused and outside c1 scope. Not downloaded |
| Oliveira, Baldé, Madeira et al. 2021 | 10.3389/fpsyg.2021.588691 | Randomised between-subjects experiment | **fail**: moderated serial-parallel mediation is hard to follow | – | **fail**: no simple group means for the main outcome | – | – | pass | pass | rejected | Results rest on a moderated serial-parallel PROCESS mediation; no simple condition means for the outcome and the direct effect is non-significant (b=0.06, p=.35). Analysis too advanced for the target learner |
| Bentley, Greenaway & Haslam 2017 | 10.1371/journal.pone.0176611 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | Within-subject encoding conditions risk primacy/recency and question-order confounds; a replicated effect online is read as validating the self-concept explanation |
| Cloutier, Fernandez, Houde-Archambault et al. 2020 | 10.3389/fpsyg.2020.557225 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | Age is a non-randomised between factor, and 'no age x condition interaction' is read as 'music affects both ages equally' despite a small sample |
| Icht, Mama & Algom 2014 | 10.3389/fpsyg.2014.00886 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | A within-subjects (mixed-list) advantage read as an absolute benefit of reading aloud, when it depends on the relative mix of conditions in the same list |
| Karpicke, Blunt & Smith 2016 | 10.3389/fpsyg.2016.00350 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Non-significant individual-difference interactions read as proof retrieval practice works equally for all children, and a mixed-list lab effect generalised to whole-class study |
| Meyers, McCurdy, Leach et al. 2020 | 10.3389/fpsyg.2020.02244 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | A small within-subject sample with a 'marginal' (p = .06) follow-up treated as evidence, and an evolutionary explanation inferred from one encoding-task contrast |
| Sundqvist, Mäntylä & Jönsson 2017 | 10.3389/fpsyg.2017.01018 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Results differing between between- and within-subject versions, and order/carryover effects in blocked testing, are ignored when claiming overt retrieval is better |
| Takahashi & Grove 2019 | 10.1371/journal.pone.0216842 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | Concluding complex exercise beats simple exercise because one comparison with rest is significant and the other is not, when the direct badminton-vs-running test was not significant |
| Stephens & Robertson 2020 | 10.3389/fpsyg.2020.00723 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | Four ice-water immersions per person in random (not counterbalanced) order invite carryover; a hidden 3-minute cap (20 people hit it at least once, 10 on all four trials) truncates tolerance, so the '33% increase' is a ceiling-limited estimate; funded by Nurofen, whose agency generated the candidate words, while the conflict-of-interest statement declares no commercial or financial relationship; the authors note the preregistration specified unrelated rather than related ANOVAs in error; mediation found no pathway, so the reason swearing helps remains untested |
| McNabb & Gray 2016 | 10.1371/journal.pone.0148555 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | stored | The baseline drive always came first, so practice and fatigue are confounded with phone use; 'not significantly different from baseline' (Instagram 0.89 s vs 0.88 s, n=18) is read as image apps being 'safer ways to stay connected'; 'no order effect, p>0.25' with 18 drivers is weak evidence; one contrast is reported as t(85) when 18 participants imply df=17. Sample is undergraduates, but the topic is road safety |
| Stenling, Moylan, Fulton et al. 2019 | 10.3389/fpsyg.2019.02300 | Within-subjects / repeated measures | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: second acute-exercise crossover after Takahashi 2019 |
| Gilbert, Dring, Williams et al. 2023 | 10.3389/fpsyg.2023.1098861 | Within-subjects / repeated measures | – | – | – | **fail**: Overall null result with effects only in median-split subgroups and school-lesson setting; | – | – | – | rejected | Overall null result with effects only in median-split subgroups and school-lesson setting; overlaps null-result and classroom categories |
| Nadon, Tillmann, Saj et al. 2021 | 10.3389/fpsyg.2021.729037 | Within-subjects / repeated measures | – | – | – | – | **fail**: Main finding is a null (no RT or Stroop interference difference across 5 sound conditions) | – | – | rejected | Main finding is a null (no RT or Stroop interference difference across 5 sound conditions); null-focused papers belong to another category, and Cloutier 2020 covers the same paradigm |
| Pastötter & Bäuml 2014 | 10.3389/fpsyg.2014.00286 | Within-subjects / repeated measures | – | – | – | **fail**: Review article, not a single study | – | – | – | rejected | Review article, not a single study |
| Ritchie, Della Sala & McIntosh 2013 | 10.1371/journal.pone.0078976 | Within-subjects / repeated measures | – | **fail**: Crossed-factorial between-subjects school study, not a within-subjects design | – | – | – | – | – | rejected | Crossed-factorial between-subjects school study, not a within-subjects design |
| Burtan, Burn & Leonards 2021 | 10.1371/journal.pone.0256635 | Within-subjects / repeated measures | **fail**: gait-kinematics outcomes analysed with likeability as predictor | – | – | – | – | pass | – | rejected | Not downloaded; gait kinematics plus likeability regression too technical for a clean within-subjects case |
| Carruth, Ramos & Miyake 2023 | 10.1371/journal.pone.0287911 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Null read as 'no effect': study is 3x the original yet still powered only for d~.41 when multilab estimates are d~.04-.10; also original N=60 moderation claim inflated by trial-level (df=1433) analysis |
| Franzen & Mader 2023 | 10.1371/journal.pone.0294325 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Treating a nonsignificant difference from the original (t(16), small df) as a 'perfect replication' is a null-as-equivalence error; equivalence needs a bound or CI |
| Harris, Coburn, Rohrer et al. 2013 | 10.1371/journal.pone.0072467 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | A highly cited original with large effects (d=0.5-1) from small samples; teaches that citation count is not evidence, and that a failed replication signals likely inflation rather than fraud |
| Imaizumi, Tagami & Yang 2020 | 10.1371/journal.pone.0236825 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Partial replication: 'significant' at n=30/group with a CI spanning 0.12-1.55 is weak evidence of the true size; one outcome replicating and the other not does not license a cultural explanation |
| Inglis & O'Hagan 2022 | 10.1371/journal.pone.0267699 | Replication | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Policy overreach from a small interaction (original explained <10% variance yet extrapolated to 4,700 extra credits); conceptual (different test, country) failure does not prove stereotype threat never occurs, and does not imply the original was fraud |
| Rotella, Sparks, Mishra et al. 2021 | 10.1371/journal.pone.0255531 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Underpowered moderator analysis presented as a 'direction for research'; a manipulation check that fails means a null on the outcome cannot test the theory |
| Sanchez, Sundermeier, Gray et al. 2017 | 10.1371/journal.pone.0172636 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Original n=26 vs 31 published in Science gave d=-0.59; CI-based reading of a precise null; heterogeneity across sites (one site significant the wrong way) is not evidence of a hidden moderator |
| Schilder, IJzerman & Denissen 2014 | 10.1371/journal.pone.0112772 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | A successful replication run by the original lab is not independent confirmation; one replication does not establish the effect size or settle 'social priming' in general |
| Boch, Tran & Voracek 2019 | 10.3389/fpsyg.2019.01601 | Replication | pass | pass | pass | pass | pass | pass | pass | stored | Measurement artifact: the original 5-item questionnaire again gives about 1 in 10 wrong (9.9%, 95% CI 7.7-12.1), but asked directly only 0.3% (2 of 597) believe Austria has the death penalty; the original TV link (r = .19) did not replicate (direct-question r = -.02), yet a 3-study meta-analysis is 'nominally' significant; OR = 1.04 with p < .001 is significant but trivial; a self-selected online sample (50% with a degree) |
| Pashler, Coburn & Harris 2012 | 10.1371/journal.pone.0042510 | Replication | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: priming already covered by Doyen 2012 and Harris 2013 |
| Xu, Demos, Leahey et al. 2014 | 10.1371/journal.pone.0109950 | Replication | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: third ego-depletion paper after Carruth 2023 and Keller 2021 |
| Belaus, Reyna & Freidin 2018 | 10.1371/journal.pone.0209263 | Replication | – | – | – | – | – | – | – | rejected | Lesser-known original (Kay & Ross 2003) and original materials unavailable, weakening the direct-replication comparison; target already met with better-known effects |
| Metzler, Vilarem, Petschen et al. 2023 | 10.1371/journal.pone.0286904 | Replication | – | – | – | – | – | – | – | rejected | Not a replication study; three-way interaction in generalized linear mixed models (~170k chars) is too heavy for the learner (G1/G4) |
| Miyake & Carruth 2023 | 10.3389/fpsyg.2023.1208299 | Replication | – | – | – | – | – | – | – | rejected | Discussion/opinion article evaluating existing evidence, not an empirical study (G4); overlaps the accepted Carruth et al. replication |
| Silva, Belim & Castro 2020 | 10.3389/fpsyg.2020.538194 | Replication | – | – | – | – | – | – | – | rejected | Not a replication of the original Mozart effect (new episodic-memory paradigm); headline 'exception' rests on a 12-person pilot and Bayesian-only inference; off-category for c3 |
| Rachev, Han, Lacko et al. 2021 | 10.1371/journal.pone.0257151 | Replication | **fail**: frequentist and Bayesian multilevel model selection is too heavy | – | pass | pass | pass | pass | pass | rejected | N = 88,181 across 47 countries; the pandemic-vs-Many-Labs comparison is confounded by sample differences (a good trap), but the analysis exceeds the classic-statistics target |
| Armand, Biassoni & Corrias 2021 | 10.3389/fpsyg.2021.672238 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: 'Academic performance has a direct effect on sleep quality' from correlational data; 15 candidate predictors and many correlations with n=140 invite overfitting and multiple-comparison false positives; GPA is self-reported |
| Bonsaksen, Price, Lamph et al. 2025 | 10.1371/journal.pone.0318507 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Non-significant adjusted OR read as 'unrelated'; adjusting for psychological distress may remove a pathway (overcontrol), and a self-selected social-media-recruited sample limits generalisation |
| Bracero-Malagón, Juárez-Ruiz de Mier, Reigal et al. 2022 | 10.3389/fpsyg.2022.833844 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Title says 'determined by' from correlations in 63 children; stepwise selection across many fitness-cognition pairs capitalises on chance; age, SES and motivation are unmeasured confounders |
| Gao, Zhao & Shu 2021 | 10.3389/fpsyg.2021.700989 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Tiny r=0.05 is 'significant' only because n=8000 and is called a 'contributing factor'; a yes/no item with 93% 'yes' plus SES confounding cannot support advice to eat breakfast |
| Gorgol, Łowicki & Stolarski 2023 | 10.1371/journal.pone.0284787 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Cross-sectional mediation read as 'explains its effects': temporal order is assumed, not shown, and very small indirect effects are framed as mechanisms |
| Marciano & Viswanath 2023 | 10.3389/fpsyg.2023.1092109 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Small betas with n=1429 read as practically important, 'influences flourishing' language from cross-sectional data, reverse causation, and controlling for self-esteem/ill-being that may sit on the pathway |
| Zhang, Dimitriou & Halstead 2021 | 10.3389/fpsyg.2021.678839 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Two-school comparison read as 'the longer school day impacted sleep' when school is confounded with everything else; correlations with anxiety read as directional; reverse-coded rank confuses the sign |
| An, Colarelli, O'Brien & Boyajian 2016 | 10.1371/journal.pone.0155614 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Title says 'Effects of' natural elements and sunlight from a one-wave, single-source self-report MTurk survey (n=444); direct sunlight is positively related to anxiety (β=.21), which a causal reading cannot explain; mediation tested on cross-sectional data; moderation plotted with mean splits |
| Shevlin, Redican, Hyland et al. 2022 | 10.1371/journal.pone.0274052 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Dose-response in one survey wave is offered as a causal criterion, but the predictor is perceived manageability, so depression can shape how debt is judged (reverse causation); the 'cannot manage at all' cell has n=15, giving depression aOR 16.22 (95% CI 4.17–62.99), and its non-significant help-seeking result is not evidence of no association; odds ratios read as risk |
| Fu, Eikelboom, Liu et al. 2022 | 10.3389/fpsyg.2022.917276 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | stored | Title claims an 'impact' of hearing loss on depression, yet the paper finds mental health not associated with hearing loss; stress predicts loneliness (β=.333) and loneliness predicts stress (β=.341) in the same one-wave data, so direction cannot be read; forward stepwise selection across many predictors with n=293 capitalises on chance |
| Lippolis, Müllensiefen, Frieler et al. 2022 | 10.3389/fpsyg.2022.982704 | Cross-sectional correlational | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: internal inconsistencies (n=285 vs 324; F=6.10 with p=.025) would mislead exact-excerpt questions |
| Alzhrani, Aboalshamat, Badawoud et al. 2023 | 10.1371/journal.pone.0280681 | Cross-sectional correlational | – | – | – | – | – | pass | – | rejected | G1/G5 weak: clinical health-workforce framing and a teaching trap that duplicates the accepted Bonsaksen and Zhang screen-sleep papers; not downloaded |
| Coenen, Golsteyn, Stolp et al. 2021 | 10.1371/journal.pone.0248629 | Cross-sectional correlational | – | – | – | – | – | pass | – | rejected | G1 fail: economics framing and ordered-probit/anchoring-vignette methods are hard for psychology students to follow; results mostly in regression tables |
| Westphal, Vock & Kretschmann 2021 | 10.3389/fpsyg.2021.627440 | Cross-sectional correlational | – | – | – | – | – | pass | – | rejected | G1 fail: exploratory structural equation modelling with acquiescence factor and clustered SEs is beyond the classic-statistics target; drawn from a longitudinal panel |
| Reid, Rieves & Carlson 2022 | 10.1371/journal.pone.0263779 | Cross-sectional correlational | – | – | – | – | – | pass | pass | rejected | Green space overlaps An 2016's nature-at-work topic; not screened further |
| Dwyer, Chang & Hannay et al. 2019 | 10.1371/journal.pone.0221754 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Interaction read as 'activism benefits wellbeing'; attrition from 299 to 167 and self-selection; non-significant main effect read as no effect |
| Giuliani & Kelly 2021 | 10.3389/fpsyg.2021.650046 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Marshmallow-style follow-up: one marginal p=.04 among three predictors read as robust; nulls for other measures read as 'no effect'; stable traits/family factors confound |
| Gygi, Hagmann-von Arx & Schweizer et al. 2017 | 10.3389/fpsyg.2017.00375 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Significant vs non-significant read as 'WISC-IV is worse' without testing the difference; attrition 103 to 54; restricted grade range (4-6) attenuates prediction |
| Mazzocco, Feigenson & Halberda 2011 | 10.1371/journal.pone.0023749 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Temporal precedence read as causal foundation; tiny n inflates and destabilises r2; outlier/exclusion decisions change results |
| Stormark, Fosse & Pallesen et al. 2019 | 10.1371/journal.pone.0224139 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Association read as 'sleep problems cause poor grades'; OR shrinks with each covariate (confounding); attrition from 7,007 to 3,543; odds ratio read as relative risk |
| Unanue, Gomez Mella & Cortez et al. 2019 | 10.3389/fpsyg.2019.02480 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Cross-lagged betas read as causal 'increase'; small cross-lags beside large stability paths; traditional CLPM mixes stable between-person traits with within-person change; high attrition |
| van der Weiden, Benjamins & Gillebaart et al. 2020 | 10.3389/fpsyg.2020.00560 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Null for self-control read as proof it does not matter; 50% attrition to post-test; habit increase over time read as caused by repetition without a control group |
| Taniguchi, Seino, Headey et al. 2022 | 10.1371/journal.pone.0263791 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Title says dog ownership 'protects' from an observational cohort (n=11,233, 3.5-year follow-up, OR=0.54): current owners were younger, more educated, richer, less frail and more active at baseline, so healthier people may keep dogs (confounding, healthy-owner selection); the non-significant mortality result is not evidence of no effect; odds ratio read as risk |
| Stannard, Berrington & Alwan 2019 | 10.1371/journal.pone.0222184 | Longitudinal / cohort | pass | pass | pass | pass | pass | pass | pass | stored | Significance flips across adjustment models (−0.79 [−1.57, −0.02] → −0.86 [−1.78, 0.07] → −1.19 [−2.28, −0.09] → −1.04 [−2.11, 0.03]) on a 14–70 scale, so a ~1-point gap is practically small and model-dependent; the 'significant' model adjusts for a proposed mediator (conduct disorder at 10); only ~47–50% of the cohort remains and dropout was higher for birth order 4+; men-only effect among gender-stratified tests on three outcomes |
| Chen & Page 2016 | 10.1371/journal.pone.0156399 | Longitudinal / cohort | **fail**: latent transition analysis | – | – | – | – | – | – | rejected | Latent profile and latent transition analysis, too complex for the target learner |
| Li & Geary 2013 | 10.1371/journal.pone.0070160 | Longitudinal / cohort | marginal: growth-curve mixed model with intercept/slope effe | – | – | – | – | – | – | rejected | Passed checker (9 pages, 0.13 MB) but growth-curve intercept/slope coding is hard for the target learner; dropped once 7 simpler papers were accepted |
| Mulder, Verhagen & Van der Ven et al. 2017 | 10.3389/fpsyg.2017.01706 | Longitudinal / cohort | **fail**: SEM-heavy | – | – | – | – | – | – | rejected | Latent-variable SEM is the core analysis, too complex for the target learner |
| Pitchford, Papini & Outhwaite et al. 2016 | 10.3389/fpsyg.2016.00783 | Longitudinal / cohort | **fail**: for category: cross-sectional | – | – | – | – | – | – | rejected | Concurrent (cross-sectional) design, not longitudinal |
| Svraka, Álvarez & Szücs 2024 | 10.3389/fpsyg.2024.1335952 | Longitudinal / cohort | **fail**: for category: cross-sectional | – | – | – | – | – | – | rejected | Cross-sectional correlational design despite 'predicts' in title |
| Turunen, Poskiparta & Salmivalli et al. 2021 | 10.1371/journal.pone.0249112 | Longitudinal / cohort | – | – | **fail**: path coefficients only in figure | – | – | – | – | rejected | Cross-lagged coefficients reported only in figures, not in text |
| Winter, Riordan & Hunter et al. 2021 | 10.3389/fpsyg.2021.659163 | Longitudinal / cohort | – | – | – | **fail**: risk: Perspective article type | – | – | – | rejected | Published as a Perspective article type (risk of failing G4 'not opinion'), although it reports a Bayesian regression; PDF downloaded, passed G7, then deleted |
| Ter Kuile, Finkenauer, van der Lippe & Kluwer 2021 | 10.3389/fpsyg.2021.622160 | Longitudinal / cohort | **fail**: dyadic latent growth curve (APIM, multiple-group) | – | – | – | – | pass | pass | rejected | Transition to parenthood is a good new domain, but the core analysis is too complex for the target learner |
| Duncan, Avery, Tsang et al. 2021 | 10.1371/journal.pone.0260218 | Longitudinal / cohort | **fail**: parallel latent growth curve models | – | – | – | – | pass | pass | rejected | Twin-registry physical activity and mental health study; latent growth curve models are the core analysis |
| Posel, Oyenubi & Kollamparambil 2021 | 10.1371/journal.pone.0249352 | Longitudinal / cohort | **fail**: economics framing; generalized ordered logit | – | – | – | – | pass | pass | rejected | Job loss and depression framed as a natural experiment by economists; methods exceed the target level, like the rejected Coenen 2021 |
| Torske, Krokstad, Stamatakis & Bauman 2017 | 10.1371/journal.pone.0179832 | Longitudinal / cohort | – | – | – | – | – | pass | pass | rejected | Dog ownership and mortality (HUNT) duplicates the pets topic already covered by Taniguchi 2022 |
| Franzoi, Cembrani, Mulatti et al. 2025 | 10.3389/fpsyg.2025.1632206 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Class is confounded with condition in Phases 3-4 (one class per condition), and the non-significant spacing effect with n=25 is read as 'spacing does not help' (null read as no effect) |
| Janz, Dawe & Wyllie 2019 | 10.3389/fpsyg.2019.02052 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Only a handful of classes were randomised but students were analysed as independent (clustering ignored); teachers delivered the program and rated behaviour (unblinded, Hawthorne); abstract claims Flanker gains despite a non-significant interaction |
| Keller & Kiss 2021 | 10.1371/journal.pone.0260141 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Headline 'causal evidence of ego depletion' rests on a marginal full-sample effect that becomes significant only in a subsample, with a small d; multiple outcome definitions |
| Nemeth, Werker, Arend et al. 2019 | 10.3389/fpsyg.2019.00086 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Large pre-post gains in both groups (d up to 1.74) could be read as the interleaving effect, but only the between-group difference is causal; split classes risk contamination and are nested in classes not modelled |
| Rohrer, Keller & Elwert 2021 | 10.1371/journal.pone.0255097 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | A 7-point absolute increase from a 15% base is a ~47% relative increase (relative vs absolute); 'equal effect on latent scale' vs 'larger effect on probability scale' shows interactions depend on the scale |
| Solanki, McPartlan, Xu et al. 2019 | 10.1371/journal.pone.0213827 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Assignment by a test-score cutoff makes groups non-equivalent; covariate adjustment cannot fully remove selection, and many subgroup analyses (gender, race, first-gen) invite multiple-comparison overreach |
| Wienecke, Hauge, Nielsen et al. 2021 | 10.3389/fpsyg.2021.636578 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Title says BM 'improves' motivation, but BM did not change; the effect is CON declining. ~40% of enrolled children excluded (attrition), novelty of the activity, and acute within-BM comparison has no control |
| Franssens, Botchway, de Swart et al. 2021 | 10.3389/fpsyg.2021.633865 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Only 6 bus lines were randomised (3 vs 3, one per matched pair), yet the test treats 91,326 line-hours as independent (t(91058) = 7.75); the effect is 1.18 extra rides on a ~2,014-ride day (~0.06%), yet the abstract says the experiment 'shows' operators can increase use; card holders reached ~21.5% of riders, and survey baselines already differed between line sets (e.g. satisfaction d = 0.16) |
| Gaube, Tsivrikos, Dollinger et al. 2018 | 10.1371/journal.pone.0197465 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Only 8 rooms, 2 per condition, so F(3, 4) and eta2 = .957 rest on n = 2 rooms per group; 'no baseline difference' from an F(3, 4) test is weak when emoticon rooms already led (4.18 vs 2.74); the 12.5% month-1 effect fell to 9.0% in month 2 and was only marginal against two controls; the denominator counts bathroom trips, not hand-hygiene opportunities; a pilot 'strong effect' is generalised to hospitals |
| Mundt, Carl & Harhoff 2020 | 10.3389/fpsyg.2020.565537 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Called random assignment, but conditions alternated in time blocks of 20-50 passers-by (quasi-assignment); the control put straws in only half the cups, so it is not a straw default; the coefficient sign and odds ratio disagree (B = 1.129 with z = -3.77, OR = 0.32); the post hoc power of .96 uses the observed OR; demographics were guessed by experimenters; 75 ml tasting cups at three sites are generalised to restaurants |
| Baillon, de Bruin, Emirmahmutoglu et al. 2019 | 10.1371/journal.pone.0224216 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | stored | Cluster-randomised by 184 work units, not 10,929 individuals; a notice in division C leaked the first fake email to control staff (spillover), and dropping C leaves unbalanced groups; Fill given Visit conditions on a post-treatment choice, so it compares different people; 'combining did not have a larger impact' reads a non-significant difference as no difference; the Exp groups had practice on a look-alike email; '800 passwords saved' extrapolates a 22% to 13-16% drop |
| Booth, Chesham, Brooks et al. 2022 | 10.3389/fpsyg.2022.812616 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | not run | rejected | No assigned conditions: schools self-selected into the programme, so it is a correlational comparison, outside c6 scope |
| Feron & Schils 2020 | 10.3389/fpsyg.2020.01356 | Classroom, field or quasi-experiment | partial: IV methods hard to follow | pass | partial | pass | pass | pass | pass | rejected | Main results rest on ITT, complier and instrumental-variable specifications that exceed the target statistics level; mostly null outcomes with little numeric detail per effect for a student exercise |
| Keller & Szakál 2021 | 10.1371/journal.pone.0256960 | Classroom, field or quasi-experiment | partial: education but econometric | pass | pass | pass | pass | pass | pass | rejected | Not a classroom intervention (individually randomised messages outside class) and long econometric regression-table paper (27 pages); weaker fit for c6 than the accepted set |
| Will, Bischof & Kingstone 2020 | 10.1371/journal.pone.0236131 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | not run | rejected | Purely correlational (students chose seats and laptop use); excluded by category rules |
| de Jong, Jellesma, Koomen et al. 2016 | 10.3389/fpsyg.2016.00691 | Classroom, field or quasi-experiment | pass | pass | pass | **fail**: replication framing (category rule) | pass | pass | not run | rejected | Framed as a test of whether the US values-affirmation effect (Cohen et al.) generalises, i.e. a conceptual replication, which this category excludes |
| Linder, Lindahl & Borgström 2018 | 10.3389/fpsyg.2018.00352 | Classroom, field or quasi-experiment | pass | pass | pass | pass | pass | pass | pass | surplus | Surplus: second environment/waste paper after Mundt 2020; its trap (DiD gain driven by the control declining, 4 vs 5 sorting stations assigned by geography) duplicates Wienecke 2021 |
| Lee & Walker 2019 | 10.1371/journal.pone.0225520 | Classroom, field or quasi-experiment | **fail**: university student halls of residence | – | – | – | – | pass | pass | rejected | Stair-prompt quasi-experiment run in student residences; conflicts with the topic-balance aim |
| Krull, Boecker & Loschelder 2021 | 10.3389/fpsyg.2021.624198 | Classroom, field or quasi-experiment | **fail**: university buildings | – | – | – | – | pass | pass | rejected | Stair-use field study on a university campus with null results (F(4, 99) = 0.39); student setting and null-focused |
| Kanngiesser, Serko & Woike 2023 | 10.3389/fpsyg.2023.1097239 | Classroom, field or quasi-experiment | **fail**: student sample (N = 406 at a university cafeteria) | pass | pass | pass | pass | pass | pass | rejected | Good trap (the control did not ask for €2 back, so promise is confounded with the request), but the population is students; backup if the topic balance allows |
| Hammami, Garcia, Darcel et al. 2023 | 10.3389/fpsyg.2023.1081700 | Classroom, field or quasi-experiment | – | – | – | **fail**: lab study plus an observational (not assigned) restaurant study | – | pass | pass | rejected | The field part has no assigned conditions; the lab part has n = 37 |
| Vernby & Dancygier 2019 | 10.1371/journal.pone.0218044 | Classroom, field or quasi-experiment | **fail**: political-science framing with linear-probability regression tables | – | partial | pass | pass | pass | pass | rejected | Hiring-discrimination audit; results rest on regression tables and the topic is politically charged (as with surplus Smith 2024) |
| Bertram, Lalot, van der Werff et al. 2025 | 10.3389/fpsyg.2025.1626047 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Bayes factor strength depends on the prior: a wide prior inflates 'support for the null' (BF01 fell to 1.05 under a restrictive prior); null correlations do not show trust is irrelevant |
| Liu, Zhang & Zhou 2021 | 10.3389/fpsyg.2021.712309 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Underpowered null (25 per group, 1 h training) read as 'mindset does not contribute'; groups not randomly assigned; absence of evidence vs evidence of absence |
| Müller, Bahnsen & Alpers 2022 | 10.3389/fpsyg.2022.1006757 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Stopped short of its power target (75 of 100) yet titled 'does not change'; Bayes factors help but small effects (d<0.4) remain plausible; smallest effect size of interest |
| Richey, Phillips, Schunn et al. 2014 | 10.1371/journal.pone.0106616 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Null transfer read as 'working memory does not cause analogy' despite power below .80 for a moderate effect and a control group that was not randomly assigned |
| Rode, Robson, Purviance et al. 2014 | 10.1371/journal.pone.0104796 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | removed | Removed 2026-10-24 for topic balance (school, learning or academic-performance topic; see Topic coverage). Passed G1–G7. Original trap: Large N claimed to rule out low power, but only 11 classrooms were assigned; baseline imbalance in teacher ratings (18.2 vs 10.6) invites regression to the mean; passive control |
| Rogowsky, Calhoun & Tallal 2020 | 10.3389/fpsyg.2020.00164 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Non-significant matching interaction read as proof of no effect, while the key test rests on only n=34 (below the planned 76); a main effect of style mistaken for support of matching |
| Smit, Milne, Sarvasy et al. 2022 | 10.1371/journal.pone.0269597 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | 'No convincing evidence for an effect' is not evidence of no effect: ROPE probability shows the data cannot support either claim; exposure groups are not randomly assigned |
| Rennung, Blum & Göritz 2016 | 10.3389/fpsyg.2016.01463 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Headline 'no backlash' rests on non-significant Power x Gender interactions (warmth F(1,2469)=1.36, p=.24; emotions MANOVA p=.09) with no equivalence test or smallest effect of interest; N=2,473 makes the null informative about these stimuli, but only 3 male and 3 female blurred-face models were used, so the result may not generalise beyond them; rating photos is not reacting to real women at work |
| Raff, Böhm & Fuchs 2025 | 10.1371/journal.pone.0331498 | Null or equivalence result | pass | pass | pass | pass | pass | pass | pass | stored | Equivalence is shown only against a 2-point bound chosen from an assumed 10% baseline, while the observed rate was 7.2%, so the same 2 points is a ~28% relative change; not every comparison is equivalent (earmarking vs flexibility p_eq=.052; clicks p_eq=.297); 'earmarking is not an effective way to increase participation' generalises from psychology faculty and a $5 donation. Topic flag: the population is academics and the outcome is survey participation, so it sits close to academic life |
| Clark, Lawlor-Savage & Goghari 2017 | 10.1371/journal.pone.0177707 | Null or equivalence result | pass | pass | pass | pass | pass | pass | **fail**: 4.75 MB > 4 MB | rejected | G7 fail: PDF 4.75 MB exceeds 4 MB (deleted) |
| Law, McGuire, Winterbottom et al. 2021 | 10.3389/fpsyg.2021.641695 | Null or equivalence result | pass | pass | not checked | pass | **fail**: main finding is positive, not null | pass | not checked | rejected | Not a null-result study; main finding significant |
| Liu, Lan, Teng et al. 2017 | 10.1371/journal.pone.0172940 | Null or equivalence result | **fail**: ERP-heavy methods | pass | not checked | pass | pass | pass | not checked | rejected | G1 fail: findings rest on ERP components |
| Negen 2024 | 10.1371/journal.pone.0312018 | Null or equivalence result | **fail**: Bayesian observer modelling of perception too specialised for the learner | pass | not checked | pass | pass | pass | not checked | rejected | G1 fail: computational perception modelling hard for target learners |
| Thompson, Waskom, Garel et al. 2013 | 10.1371/journal.pone.0063614 | Null or equivalence result | pass | pass | not checked | pass | pass | pass | not checked | rejected | Out of scope: explicitly 'attempted to replicate' prior n-back findings (replication category) |
| Landini, Segovia, Palma & Nayga 2024 | 10.1371/journal.pone.0312811 | Null or equivalence result | **fail**: economics framing; quasi-Poisson regression with log link | pass | pass | pass | pass | pass | pass | rejected | Strong trap (the '3-hour' group actually fasted 8.4 h vs 10.2 h; 'power 99.57%' computed from observed means), but quasi-Poisson regression tables and economics framing exceed the classic-statistics target, as with Coenen 2021; 77.5% undergraduates |
| Trammell, Harriger & Krumrei-Mancuso 2023 | 10.3389/fpsyg.2023.1258378 | Null or equivalence result | **fail**: undergraduate sample, cognition and working-memory outcomes | – | – | – | – | pass | pass | rejected | 188 undergraduates on course credit; null outcomes are digit span, recall and trail making, which overlap the memory and working-memory topics being reduced |
| Hollingdale & Greitemeyer 2014 | 10.1371/journal.pone.0111790 | Null or equivalence result | – | – | – | – | **fail**: headline is a positive effect (violent > neutral), not a null | pass | – | rejected | Not null-focused; not downloaded |

## Stored paper summaries for content review

Each stored paper needs Tymee's statistics and design check before it is used in a curated journey or the demo. Record the result as approved, corrections needed, or rejected.

### Randomised between-subjects experiment

#### Creswell, Dutcher, Klein et al. (2013), Self-Affirmation Improves Problem-Solving under Stress

- **File:** `papers/creswell-2013-self-affirmation-problem-solving.pdf` · doi:10.1371/journal.pone.0062593
- **Design:** Randomised between-subjects lab experiment, 80 undergraduates (73 analysed), self-affirmation vs control, chronic stress as measured moderator
- **Key result:** Regression on Remote Associates score: affirmation main effect beta=.31, t(72)=2.88, p=.005; stress x affirmation interaction beta=.35, t(72)=2.09, p=.041; manipulation check F(1,71)=142.6, eta2=.67
- **Trap:** Overgeneralising a moderated effect from 73 US undergraduates to 'school settings'; the benefit is confined to high-stress participants (median split only for display), and the manipulation check measures value importance, not felt affirmation
- **Tymee review:** pending

#### Rozenkrantz, Mayo, Ilan et al. (2017), Placebo can enhance creativity

- **File:** `papers/rozenkrantz-2017-placebo-creativity.pdf` · doi:10.1371/journal.pone.0182466
- **Design:** Randomised between-subjects lab experiment, n=90 (45 placebo vs 45 control odorant), 3 creativity tests (subset n=57 for AUT/TTCT)
- **Key result:** Originality higher with placebo: CFG Mann-Whitney U=753, p=.036, d=0.46; AUT U=278, p=.048, d=0.43; TTCT originality 28 vs 28, p=.75 (dropped from further analysis)
- **Trap:** Multiple comparisons and selective focus: about 11 outcome measures across 3 tests, only a few reach p<.05 (several near .05), and the null test is set aside; 'placebo enhances creativity' overreaches
- **Tymee review:** pending

#### Tsang, Chan, Lu & Wong (2024), Effects of age-based stereotype threat on time-based prospective memory

- **File:** `papers/tsang-2024-stereotype-threat-prospective-memory.pdf` · doi:10.3389/fpsyg.2024.1379160
- **Design:** Randomised between-subjects experiment, n=74 older adults in Hong Kong (36 stereotype-threat vs 38 neutral news article)
- **Key result:** ANCOVA on prospective-memory accuracy: F(1,70)=6.16, p<.05, partial eta2=.08 (M=0.76 vs 0.88); 70-80-year subgroup F(1,20)=4.71, partial eta2=.19 (M=0.66 vs 0.91)
- **Trap:** Manipulation check only tests reading comprehension, not felt threat; a post hoc age split with about 22 people is presented as a key finding
- **Tymee review:** pending

#### Tan, Liu & Zhang (2024), Effects of COVID-19 vaccine safety framing on parental reactions

- **File:** `papers/tan-2024-vaccine-safety-framing.pdf` · doi:10.1371/journal.pone.0302233
- **Design:** Randomised between-subjects online framing experiment, n=3,861 Chinese parents (1,978 positive vs 1,883 negative frame)
- **Key result:** Government-priority rating 3.38 vs 3.30, p=.002, r=.05; ANCOVA F(1,3854)=10.28, eta2=.003; policy support F(1,3854)=4.06, p=.044, eta2=.001; most other outcomes p>.05
- **Trap:** Statistical vs practical significance: with n=3,861 an eta2 of .001-.003 is 'significant'; many outcomes and subgroup tests invite multiple-comparison false positives; convenience sample used to advise governments
- **Tymee review:** pending

#### Ruzi, Lee & Smith (2021), Testing how different narrative perspectives achieve communication objectives and goals in online natural science videos

- **File:** `papers/ruzi-2021-narrative-perspective-science-video.pdf` · doi:10.1371/journal.pone.0257866
- **Design:** Randomised between-subjects online experiment, n=515 (5 videos, 3 treatments: scientist, third-party, no on-screen presenter)
- **Key result:** Spokesperson expertise F(2,510)=6.13, p=.002 (FDR-adjusted .03), partial eta2=.023, means 6.04 vs 5.67 vs 5.63; trustworthiness adjusted p=.05; 6 other outcomes ns (partial eta2 <=.005)
- **Trap:** Multiple comparisons across 8 outcomes and small effects; covariates chosen by testing baseline differences after randomisation; one fabricated ant story generalised to science communication
- **Tymee review:** pending

#### Taillie, Prestemon, Hall et al. (2022), Developing health and environmental warning messages about red meat: An online experiment

- **File:** `papers/taillie-2022-red-meat-warnings.pdf` · doi:10.1371/journal.pone.0268121
- **Design:** Randomised between-subjects online experiment, n=1,199 US red-meat consumers (health vs environmental warnings); messages within condition shown in random order
- **Key result:** Perceived message effectiveness 2.66 (SD 1.18) vs 2.26 (SD 1.14), p<.001; intention to reduce 2.45 vs 2.19, p<.001 (5-point scales)
- **Trap:** Perceived effectiveness and 7-day intentions read as behaviour change; 8 vs 10 messages per condition; exploratory convenience sample
- **Tymee review:** pending

#### Gesser-Edelsburg, Diamant, Hijazi et al. (2018), Correcting misinformation by health organizations during measles outbreaks: A controlled experiment

- **File:** `papers/gesser-edelsburg-2018-correcting-misinformation.pdf` · doi:10.1371/journal.pone.0209505
- **Design:** Randomised between-subjects experiment, n=243 graduate students (common vs theory-based correction of a misinformation post)
- **Key result:** Reliability of Health Ministry response M=5.68 (SD 1.39) vs 4.64 (SD 1.77), t-test p<.001; satisfaction 5.75 vs 4.66, p<.001
- **Trap:** Confounded manipulation (the recommended correction differs in transparency, empathy and content at once) and 83% female social-welfare graduate students generalised to the public
- **Tymee review:** pending

### Within-subjects / repeated measures

#### Takahashi & Grove (2019), Comparison of the effects of running and badminton on executive function: A within-subjects design

- **File:** `papers/takahashi-2019-running-badminton-executive.pdf` · doi:10.1371/journal.pone.0216842
- **Design:** Within-subjects, n=20, three counterbalanced sessions (badminton, running, seated rest), Stroop pre/post; repeated-measures ANOVA and Bonferroni-adjusted paired t-tests
- **Key result:** Stroop gain: badminton > rest, t(19) = 3.6, p = .002, d = 0.80; running vs rest t(19) = 1.3, p = .207, d = 0.29; badminton vs running t(19) = 1.8, p = .082, d = 0.44
- **Trap:** Concluding complex exercise beats simple exercise because one comparison with rest is significant and the other is not, when the direct badminton-vs-running test was not significant
- **Tymee review:** pending

#### Cloutier, Fernandez, Houde-Archambault et al. (2020), Effect of Background Music on Attentional Control in Older and Young Adults

- **File:** `papers/cloutier-2020-background-music-attention-age.pdf` · doi:10.3389/fpsyg.2020.557225
- **Design:** Mixed design, n=40 (19 older, 21 young adults); within factors auditory condition (stimulating music, relaxing music, silence) x flanker congruency, blocks in random order; mixed ANOVA
- **Key result:** Auditory condition x congruency on RT F(2,67) = 4.00, p = .027, eta2 = .095; flanker effect larger with relaxing than stimulating music F(1,38) = 10.61, p = .002, eta2 = .22; no age interaction
- **Trap:** Age is a non-randomised between factor, and 'no age x condition interaction' is read as 'music affects both ages equally' despite a small sample
- **Tymee review:** pending

#### Karpicke, Blunt & Smith (2016), Retrieval-Based Learning: Positive Effects of Retrieval Practice in Elementary School Children

- **File:** `papers/karpicke-2016-retrieval-practice-children.pdf` · doi:10.3389/fpsyg.2016.00350
- **Design:** Three experiments, n=88 children (~10 years), mixed-list within-subject design (retrieval practice vs repeated study), word sets counterbalanced across conditions; paired t-tests and ANCOVA
- **Key result:** Exp 1 recall 0.55 vs 0.44, t(39) = 3.02, d = 0.48; Exp 2 0.42 vs 0.28, t(39) = 3.57, d = 0.56; Exp 3 recognition 0.77 vs 0.66, t(41) = 4.17, d = 0.64; no reading-comprehension x condition interaction, F(1,38) = 1.21
- **Trap:** Non-significant individual-difference interactions read as proof retrieval practice works equally for all children, and a mixed-list lab effect generalised to whole-class study
- **Tymee review:** pending

#### Icht, Mama & Algom (2014), The production effect in memory: multiple species of distinctiveness

- **File:** `papers/icht-2014-production-effect-distinctiveness.pdf` · doi:10.3389/fpsyg.2014.00886
- **Design:** Mixed design, n=60 randomly assigned to 20%, 50% or 80% aloud lists (between) with aloud vs silent reading within subjects; mixed ANOVA and paired t-tests
- **Key result:** Recall: 20% aloud group 46.2% vs 19.8%, t(19) = 6.66; 80% aloud group reversed, silent 31.8% vs aloud 20.9%, t(19) = 2.09; list proportion x item type F(2,57) = 17.80, p < .0001
- **Trap:** A within-subjects (mixed-list) advantage read as an absolute benefit of reading aloud, when it depends on the relative mix of conditions in the same list
- **Tymee review:** pending

#### Sundqvist, Mäntylä & Jönsson (2017), Assessing Boundary Conditions of the Testing Effect: On the Relative Efficacy of Covert vs. Overt Retrieval

- **File:** `papers/sundqvist-2017-covert-overt-retrieval.pdf` · doi:10.3389/fpsyg.2017.01018
- **Design:** Four experiments on paired-associate learning; response format manipulated between (Exp 1) and within subjects (Exp 2-4), blocked vs random list order with fully counterbalanced testing sequences (Exp 4); repeated-measures and mixed ANOVA
- **Key result:** Exp 2: response format F(3,93) = 5.98, eta_p2 = .16, format x retention interval F(3,93) = 8.97, eta_p2 = .22; Exp 4 at 1 week overt > covert F(1,41) = 9.35, eta_p2 = .19; authors call the effects small
- **Trap:** Results differing between between- and within-subject versions, and order/carryover effects in blocked testing, are ignored when claiming overt retrieval is better
- **Tymee review:** pending

#### Bentley, Greenaway & Haslam (2017), An online paradigm for exploring the self-reference effect

- **File:** `papers/bentley-2017-self-reference-online.pdf` · doi:10.1371/journal.pone.0176611
- **Design:** Four online studies (total N=658 MTurk); encoding level (self-referential, semantic, structural) within subjects, filler task or recall procedure between; mixed ANOVA and linear mixed models
- **Key result:** Study 1 (n=103): encoding main effect F(2,202) = 35.79, p < .001, eta_p2 = .24, filler task F(1,101) = 0.02; self vs semantic recall d = 0.63 across studies
- **Trap:** Within-subject encoding conditions risk primacy/recency and question-order confounds; a replicated effect online is read as validating the self-concept explanation
- **Tymee review:** pending

#### Meyers, McCurdy, Leach et al. (2020), Effects of Survival Processing on Item and Context Memory: Enhanced Memory for Survival-Relevant Details

- **File:** `papers/meyers-2020-survival-processing-context.pdf` · doi:10.3389/fpsyg.2020.02244
- **Design:** Within-subjects, n=27; survival vs moving scenario x colour plausibility at encoding, items counterbalanced across conditions; repeated-measures ANOVA on item, colour and source memory
- **Key result:** Item recognition better after survival (M = 0.92, SD = 0.07) than moving (M = 0.86, SD = 0.11), F(1,26) = 11.09, p = .003, eta2 = .30; condition x plausibility interaction for colour memory
- **Trap:** A small within-subject sample with a 'marginal' (p = .06) follow-up treated as evidence, and an evolutionary explanation inferred from one encoding-task contrast
- **Tymee review:** pending

### Replication

#### Carruth, Ramos & Miyake (2023), Does willpower mindset really moderate the ego-depletion effect? A preregistered replication of Job, Dweck, and Walton (2010)

- **File:** `papers/carruth-2023-willpower-ego-depletion-replication.pdf` · doi:10.1371/journal.pone.0287911
- **Design:** Preregistered replication; random assignment to depletion vs control letter-cancellation, willpower mindset as measured moderator, Stroop outcome; N=187 (original N=60)
- **Key result:** No depletion effect on Stroop interference (errors t(185)=-1.62, p=.107, d=-0.24; log RT t(185)=-0.36, p=.719, d=-0.05) and no mindset x condition moderation (B=.287, p=.414); sensitivity: 80% power only for d>=.41
- **Trap:** Null read as 'no effect': study is 3x the original yet still powered only for d~.41 when multilab estimates are d~.04-.10; also original N=60 moderation claim inflated by trial-level (df=1433) analysis
- **Tymee review:** pending

#### Inglis & O'Hagan (2022), Stereotype threat, gender and mathematics attainment: A conceptual replication of Stricker & Ward

- **File:** `papers/inglis-2022-stereotype-threat-replication.pdf` · doi:10.1371/journal.pone.0267699
- **Design:** Preregistered conceptual field replication; answer sheets with gender question first vs last randomly assigned in 5 English schools; 2 (version) x 2 (gender) between-subjects ANOVA, N~1,169
- **Key result:** No version x gender interaction, F(1,1165)=0.525, p=.469, eta2=.000; no version main effect F(1,1165)=1.586, p=.208, d=0.091; girls outscored boys 46.2 vs 42.7, F(1,1165)=8.41, p=.004, d=0.177
- **Trap:** Policy overreach from a small interaction (original explained <10% variance yet extrapolated to 4,700 extra credits); conceptual (different test, country) failure does not prove stereotype threat never occurs, and does not imply the original was fraud
- **Tymee review:** pending

#### Harris, Coburn, Rohrer et al. (2013), Two Failures to Replicate High-Performance-Goal Priming Effects

- **File:** `papers/harris-2013-goal-priming-failures.pdf` · doi:10.1371/journal.pone.0072467
- **Design:** Two direct replications of Bargh et al. (2001); random assignment to achievement vs neutral word primes, word-search performance; Exp 1 n=98, Exp 2 n=66 with 5-min delay; between-subjects ANOVA
- **Key result:** Exp 1: no prime effect, F(1,94)=1.45, p=.23, d=-0.24 (achievement M=17.81 vs neutral M=19.36, opposite direction); Exp 2: M=19.28 vs 19.29, F(1,62)=0.02, p=.88, d=-0.03
- **Trap:** A highly cited original with large effects (d=0.5-1) from small samples; teaches that citation count is not evidence, and that a failed replication signals likely inflation rather than fraud
- **Tymee review:** pending

#### Sanchez, Sundermeier, Gray et al. (2017), Direct replication of Gervais & Norenzayan (2012): No evidence that analytic thinking decreases religious belief

- **File:** `papers/sanchez-2017-analytic-thinking-religion-replication.pdf` · doi:10.1371/journal.pone.0172636
- **Design:** Preregistered direct replication of one experiment (original n=57) at 4 collection sites; random assignment to The Thinker vs Discobolus images; 2 (prime) x 4 (site) ANOVA, N=941
- **Key result:** No prime effect, F(1,944)=0.78, p=.38, eta2=0.001, d=0.07 wrong direction, 95% CI [-0.12, 0.25]; no prime x site interaction F(3,944)=1.22, p=.30; one site significant in the opposite direction
- **Trap:** Original n=26 vs 31 published in Science gave d=-0.59; CI-based reading of a precise null; heterogeneity across sites (one site significant the wrong way) is not evidence of a hidden moderator
- **Tymee review:** pending

#### Schilder, IJzerman & Denissen (2014), Physical Warmth and Perceptual Focus: A Replication of IJzerman and Semin (2009)

- **File:** `papers/schilder-2014-warmth-perceptual-focus-replication.pdf` · doi:10.1371/journal.pone.0112772
- **Design:** Successful replication by the original lab with experimenter-bias safeguards; random assignment to warm vs cold drink, relational-focus task; N=128 (original N=39); regression/t-test with gender covariate
- **Key result:** Warm participants more relational, t(125)=3.84, p<.01, sr=.33; without covariate d=.60, t(126)=3.54, p<.01; residualised M=1.69 vs 1.51
- **Trap:** A successful replication run by the original lab is not independent confirmation; one replication does not establish the effect size or settle 'social priming' in general
- **Tymee review:** pending

#### Imaizumi, Tagami & Yang (2020), Fluid movements enhance creative fluency: A replication of Slepian and Ambady (2012)

- **File:** `papers/imaizumi-2020-fluid-movements-creativity-replication.pdf` · doi:10.1371/journal.pone.0236825
- **Design:** Between-subjects replication with a Japanese sample; random assignment to tracing curved (fluid) vs angular drawings, alternative-uses task; n=30 per condition (original n=15 per condition); t-tests plus GLM with covariates
- **Key result:** Fluency higher after fluid tracing, t(58)=2.34, p=.023, d=0.60, 95% CI [0.12, 1.55] (M=4.17 vs 3.33); originality not different, t(58)=1.16, p=.250, d=0.30
- **Trap:** Partial replication: 'significant' at n=30/group with a CI spanning 0.12-1.55 is weak evidence of the true size; one outcome replicating and the other not does not license a cultural explanation
- **Tymee review:** pending

#### Rotella, Sparks, Mishra et al. (2021), No effect of 'watching eyes': An attempted replication and extension investigating individual differences

- **File:** `papers/rotella-2021-watching-eyes-replication.pdf` · doi:10.1371/journal.pone.0255531
- **Design:** Preregistered replication; random assignment to No Eyes (n=113), Eyes (n=117), Public (n=100) during a dictator game; ANOVA and Welch t-tests; social value orientation moderator (n=189)
- **Key result:** Eyes vs no eyes felt-observed M=2.39 vs 2.74, t(247.93)=-1.67, p=.097, d=0.21; no condition effect on giving, F(2,182)=0.61, p=.542, partial eta2=.007; condition x SVO F(2,182)=0.30, p=.740
- **Trap:** Underpowered moderator analysis presented as a 'direction for research'; a manipulation check that fails means a null on the outcome cannot test the theory
- **Tymee review:** pending

#### Franzen & Mader (2023), The power of social influence: A replication and extension of the Asch experiment

- **File:** `papers/franzen-2023-asch-conformity-replication.pdf` · doi:10.1371/journal.pone.0294325
- **Design:** Successful lab replication with extension in Switzerland; random assignment to non-incentivised vs incentivised line-judgement task with confederates; N=202 valid; t-tests and regression
- **Key result:** 33% incorrect answers on critical trials without incentives vs Asch's 36.8%, t(16)=0.59, p=.57; conformity also present with monetary incentives
- **Trap:** Treating a nonsignificant difference from the original (t(16), small df) as a 'perfect replication' is a null-as-equivalence error; equivalence needs a bound or CI
- **Tymee review:** pending

### Cross-sectional correlational

#### Bonsaksen, Price, Lamph et al. (2025), Sleep problems were unrelated to social media use in the late COVID-19 pandemic phase: A cross-national study

- **File:** `papers/bonsaksen-2025-social-media-sleep-problems.pdf` · doi:10.1371/journal.pone.0318507
- **Design:** Cross-sectional online convenience survey, n=1405 adults in 4 countries; t-tests, chi-square, unadjusted and multivariable logistic regression
- **Key result:** Sleep-problem group reported more social media time (M 4.4 vs 4.1, p<0.001) but after adjusting for age, gender, employment and distress the association vanished (OR 1.06, ns); distress OR 1.20, female OR 1.69
- **Trap:** Non-significant adjusted OR read as 'unrelated'; adjusting for psychological distress may remove a pathway (overcontrol), and a self-selected social-media-recruited sample limits generalisation
- **Tymee review:** pending

#### Marciano & Viswanath (2023), Social media use and adolescents' well-being: A note on flourishing

- **File:** `papers/marciano-2023-social-media-flourishing.pdf` · doi:10.3389/fpsyg.2023.1092109
- **Design:** Cross-sectional self-report survey, n=1429 Swiss adolescents; Pearson correlations and hierarchical regression with Bonferroni correction
- **Key result:** Positive social media experiences correlate r=0.314 with flourishing but beta=0.112 (p<0.001) after controls incl. self-esteem and ill-being; negative experiences r=-0.417, beta=-0.076
- **Trap:** Small betas with n=1429 read as practically important, 'influences flourishing' language from cross-sectional data, reverse causation, and controlling for self-esteem/ill-being that may sit on the pathway
- **Tymee review:** pending

#### Armand, Biassoni & Corrias (2021), Sleep, Well-Being and Academic Performance: A Study in a Singapore Residential College

- **File:** `papers/armand-2021-sleep-wellbeing-grades.pdf` · doi:10.3389/fpsyg.2021.672238
- **Design:** Cross-sectional survey, n=140 undergraduates in one residential college; 30 Spearman correlations plus moderated polynomial regression starting from 15 predictors
- **Key result:** Global PSQI vs affect balance rho=-0.454, vs flourishing rho=-0.374; vs self-reported GPA rho=-0.114 (p=0.245, ns); final model with quadratic and interaction terms R2=0.411
- **Trap:** 'Academic performance has a direct effect on sleep quality' from correlational data; 15 candidate predictors and many correlations with n=140 invite overfitting and multiple-comparison false positives; GPA is self-reported
- **Tymee review:** pending

#### Gorgol, Łowicki & Stolarski (2023), Godless owls, devout larks: Religiosity and conscientiousness are associated with morning preference and (partly) explain its effects on life satisfaction

- **File:** `papers/gorgol-2023-chronotype-religiosity-life-satisfaction.pdf` · doi:10.1371/journal.pone.0284787
- **Design:** Two cross-sectional self-report studies of Polish adults (n=500 and n=728); partial correlations and parallel mediation with age and gender as covariates
- **Key result:** Morningness correlates with life satisfaction r=.12 (S1) and .23 (S2); total indirect effect via religiosity and conscientiousness .05 [.03,.08] in S1 and .01 [.01,.02] in S2 (about 28-33% of total)
- **Trap:** Cross-sectional mediation read as 'explains its effects': temporal order is assumed, not shown, and very small indirect effects are framed as mechanisms
- **Tymee review:** pending

#### Zhang, Dimitriou & Halstead (2021), Sleep, Anxiety, and Academic Performance: A Study of Adolescents From Public High Schools in China

- **File:** `papers/zhang-2021-sleep-anxiety-academic-performance.pdf` · doi:10.3389/fpsyg.2021.678839
- **Design:** Cross-sectional online questionnaire, n=99 adolescents from 2 schools; Mann-Whitney U, Spearman correlations, simple linear regressions
- **Key result:** School A (earlier start, later end) had higher sleep disturbance, U=778, p<0.05, r=0.32; sleep impairment predicted anxiety, F(1,95)=53.67, R2=0.361; screen time did not predict sleep disturbance, R2=0.002
- **Trap:** Two-school comparison read as 'the longer school day impacted sleep' when school is confounded with everything else; correlations with anxiety read as directional; reverse-coded rank confuses the sign
- **Tymee review:** pending

#### Bracero-Malagón, Juárez-Ruiz de Mier, Reigal et al. (2022), Logical Intelligence and Mathematical Competence Are Determined by Physical Fitness in a Sample of School Children

- **File:** `papers/bracero-malagon-2022-physical-fitness-math-intelligence.pdf` · doi:10.3389/fpsyg.2022.833844
- **Design:** Cross-sectional, incidental sample n=63 children aged 11-12; Pearson correlations and stepwise linear regression
- **Key result:** Horizontal jump correlated with logic r=0.43 and predicted logical intelligence (R2=0.24, beta=0.50); speed-agility predicted maths competence (R2=0.16, beta=-0.41)
- **Trap:** Title says 'determined by' from correlations in 63 children; stepwise selection across many fitness-cognition pairs capitalises on chance; age, SES and motivation are unmeasured confounders
- **Tymee review:** pending

#### Gao, Zhao & Shu (2021), Breakfast Consumption and Academic Achievement Among Chinese Adolescents: A Moderated Mediation Model

- **File:** `papers/gao-2021-breakfast-academic-achievement.pdf` · doi:10.3389/fpsyg.2021.700989
- **Design:** Secondary analysis of cross-sectional PISA 2015 data, n=8000 Chinese 15-year-olds; correlations and PROCESS moderated mediation
- **Key result:** 93.4% ate breakfast; breakfast-achievement correlation r=0.050 (p<0.001); mediation via achievement motivation 0.147 of total 0.262 effect
- **Trap:** Tiny r=0.05 is 'significant' only because n=8000 and is called a 'contributing factor'; a yes/no item with 93% 'yes' plus SES confounding cannot support advice to eat breakfast
- **Review flag:** Some numbers in the text disagree with each other; check excerpts before use.
- **Tymee review:** pending

### Longitudinal / cohort

#### Mazzocco, Feigenson & Halberda (2011), Preschoolers' Precision of the Approximate Number System Predicts Later School Mathematics Performance

- **File:** `papers/mazzocco-2011-ans-predicts-math.pdf` · doi:10.1371/journal.pone.0023749
- **Design:** Prospective cohort, n=17 preschoolers tested at age 3-4 and followed up at ~6.7 years; simple linear regressions
- **Key result:** Preschool ANS precision predicted age-6 TEMA-3 math score, r2=.278, t(16)=2.405, p=.030; 35% of variance in n=13 subsample excluding at-chance children; did not predict non-numerical abilities
- **Trap:** Temporal precedence read as causal foundation; tiny n inflates and destabilises r2; outlier/exclusion decisions change results
- **Review flag:** n=17; the small sample is the lesson, but confirm it suits learners.
- **Tymee review:** pending

#### Giuliani & Kelly (2021), Delay of Gratification Predicts Eating in the Absence of Hunger in Preschool-Aged Children

- **File:** `papers/giuliani-2021-delay-gratification-eating.pdf` · doi:10.3389/fpsyg.2021.650046
- **Design:** Prospective cohort, n=47 preschoolers, self-regulation tasks at Session 1, eating in absence of hunger 1 year later; multiple regression with covariates, multiple imputation
- **Key result:** Delay of gratification predicted later EAH kcal, b=-12.46, 95% CI [-23.95, -0.97], t(41.13)=-2.13, p=.040; flanker (p=.71) and Go/NoGo (p=.33) did not
- **Trap:** Marshmallow-style follow-up: one marginal p=.04 among three predictors read as robust; nulls for other measures read as 'no effect'; stable traits/family factors confound
- **Tymee review:** pending

#### Unanue, Gomez Mella & Cortez et al. (2019), The Reciprocal Relationship Between Gratitude and Life Satisfaction: Evidence From Two Longitudinal Field Studies

- **File:** `papers/unanue-2019-gratitude-life-satisfaction.pdf` · doi:10.3389/fpsyg.2019.02480
- **Design:** Two three-wave cross-lagged panel studies of Chilean adults, Study 1 N=725 (1-month lags), Study 2 N=1,841 (3-month lags)
- **Key result:** Gratitude T1 -> life satisfaction T2 beta=0.10 (95% CI 0.03, 0.18) in Study 1 and 0.11 (0.05, 0.16) in Study 2; reverse path beta=0.11; autoregressive paths beta=0.63-0.78
- **Trap:** Cross-lagged betas read as causal 'increase'; small cross-lags beside large stability paths; traditional CLPM mixes stable between-person traits with within-person change; high attrition
- **Tymee review:** pending

#### Dwyer, Chang & Hannay et al. (2019), When does activism benefit well-being? Evidence from a longitudinal study of Clinton voters in the 2016 U.S. presidential election

- **File:** `papers/dwyer-2019-activism-wellbeing-election.pdf` · doi:10.1371/journal.pone.0221754
- **Design:** Prospective panel, pre-election predictors and two post-election follow-ups, n=167 Clinton voters retained from 299 invited; two-level random-intercept regression with interaction
- **Key result:** Activism x identification with Clinton predicted depressive symptoms, gamma=-0.05, t=-2.59, p=.010, and sleep disturbance, gamma=-0.09, t=-2.85, p=.005; activism main effect not significant
- **Trap:** Interaction read as 'activism benefits wellbeing'; attrition from 299 to 167 and self-selection; non-significant main effect read as no effect
- **Tymee review:** pending

#### van der Weiden, Benjamins & Gillebaart et al. (2020), How to Form Good Habits? A Longitudinal Field Study on the Role of Self-Control in Habit Formation

- **File:** `papers/vanderweiden-2020-self-control-habit-formation.pdf` · doi:10.3389/fpsyg.2020.00560
- **Design:** Intensive longitudinal app study, 180 adults at pre-measurement, 146 with habit data, 90 at post-measurement, ~90 days; multilevel regression with lagged predictors
- **Key result:** Habit strength rose ~0.8 SD over 110 days (linear t=15.30, p<.001); lagged self-control did not predict habit strength (b=0.01, ns), behaviour consistency did (b=0.47, p<.001)
- **Trap:** Null for self-control read as proof it does not matter; 50% attrition to post-test; habit increase over time read as caused by repetition without a control group
- **Tymee review:** pending

#### Stormark, Fosse & Pallesen et al. (2019), The association between sleep problems and academic performance in primary school-aged children: Findings from a Norwegian longitudinal population-based study

- **File:** `papers/stormark-2019-sleep-problems-school-performance.pdf` · doi:10.1371/journal.pone.0224139
- **Design:** Population cohort (Bergen Child Study), two waves at 7-9 and 11-13 years, N=3,543 analysed of 7,007 at T1; logistic regression with stepwise covariates
- **Key result:** Persistent sleep problems vs none: OR=3.15 (2.07-4.78) crude, 1.87 (1.19-2.95) fully adjusted; transitory problems OR=0.69 (0.35-1.36), ns
- **Trap:** Association read as 'sleep problems cause poor grades'; OR shrinks with each covariate (confounding); attrition from 7,007 to 3,543; odds ratio read as relative risk
- **Tymee review:** pending

#### Gygi, Hagmann-von Arx & Schweizer et al. (2017), The Predictive Validity of Four Intelligence Tests for School Grades: A Small Sample Longitudinal Study

- **File:** `papers/gygi-2017-intelligence-tests-school-grades.pdf` · doi:10.3389/fpsyg.2017.00375
- **Design:** Prospective cohort, 103 children given four IQ tests at ~9 years, school grades 3 years later for 54; hierarchical regression controlling sex and age
- **Key result:** All four tests predicted averaged grades (estimates 0.126-0.175, e.g. IDS 0.175, 95% CI [0.056, 0.293]); WISC-IV did not significantly predict math (0.242, CI [-0.088, 0.590])
- **Trap:** Significant vs non-significant read as 'WISC-IV is worse' without testing the difference; attrition 103 to 54; restricted grade range (4-6) attenuates prediction
- **Tymee review:** pending

### Classroom, field or quasi-experiment

#### Franzoi, Cembrani, Mulatti et al. (2025), Retrieval practice enhances learning in real primary school settings, whether distributed or not

- **File:** `papers/franzoi-2025-retrieval-practice-primary.pdf` · doi:10.3389/fpsyg.2025.1632206
- **Design:** Classroom quasi-experiment: two intact 5th-grade classes (n=33; 25-27 analysed) rotated through re-reading vs testing and short vs long spacing across 4 phases; mixed ANOVA
- **Key result:** Phases 1-2: testing 67.0% vs re-reading 48.6%, F(1,25)=41.42, p<.001, eta2=.154; Phase 4 spacing: long 45.9% vs short 44.6%, n.s.
- **Trap:** Class is confounded with condition in Phases 3-4 (one class per condition), and the non-significant spacing effect with n=25 is read as 'spacing does not help' (null read as no effect)
- **Tymee review:** pending

#### Janz, Dawe & Wyllie (2019), Mindfulness-Based Program Embedded Within the Existing Curriculum Improves Executive Functioning and Behavior in Young Children: A Waitlist Controlled Trial

- **File:** `papers/janz-2019-mindfulness-calmspace.pdf` · doi:10.3389/fpsyg.2019.02052
- **Design:** Waitlist-controlled school trial: a few whole classes in one school randomly allocated by hat draw (n=55 intervention, 36 waitlist); repeated-measures ANCOVA at student level
- **Key result:** DCCS Group x Time F(1,83)=4.34, p=.040 (d=0.48 at T2); Flanker Group x Time F(1,83)=1.29, p=.260 n.s. although abstract reports d=0.77; teacher-rated SDQ d=0.32 at T2
- **Trap:** Only a handful of classes were randomised but students were analysed as independent (clustering ignored); teachers delivered the program and rated behaviour (unblinded, Hawthorne); abstract claims Flanker gains despite a non-significant interaction
- **Tymee review:** pending

#### Nemeth, Werker, Arend et al. (2019), Interleaved Learning in Elementary School Mathematics: Effects on the Flexible and Adaptive Use of Subtraction Strategies

- **File:** `papers/nemeth-2019-interleaved-subtraction.pdf` · doi:10.3389/fpsyg.2019.00086
- **Design:** Within-class randomised field experiment: 236 third graders in 12 classes split into interleaved (n=119) vs blocked (n=117) for a 14-lesson unit; pre, post and two follow-ups; repeated-measures ANOVA
- **Key result:** Interleaved advantage for adaptive use of standard algorithm F(1,193)=25.62, p<.001, eta_p2=.12; Time x Group F(3,579), eta_p2=.04; baseline MANOVA F(5,230)=0.38, p=.87
- **Trap:** Large pre-post gains in both groups (d up to 1.74) could be read as the interleaving effect, but only the between-group difference is causal; split classes risk contamination and are nested in classes not modelled
- **Tymee review:** pending

#### Rohrer, Keller & Elwert (2021), Proximity can induce diverse friendships: A large randomized classroom experiment

- **File:** `papers/rohrer-2021-seating-friendships.pdf` · doi:10.1371/journal.pone.0255097
- **Design:** Cluster field experiment: seating charts randomised within 182 classrooms (N=2,966 students, grades 3-8) for one semester; dyadic probit and linear probability models with classroom fixed effects
- **Key result:** Sitting together raised probability of mutual friendship from 15% to 22% (average marginal effect); effect on latent propensity equal across similar and dissimilar dyads
- **Trap:** A 7-point absolute increase from a 15% base is a ~47% relative increase (relative vs absolute); 'equal effect on latent scale' vs 'larger effect on probability scale' shows interactions depend on the scale
- **Review flag:** Probit models on student pairs; the most advanced analysis in the set.
- **Tymee review:** pending

#### Keller & Kiss (2021), Do exhausted primary school students cheat more? A randomized field experiment

- **File:** `papers/keller-2021-ego-depletion-cheating.pdf` · doi:10.1371/journal.pone.0260141
- **Design:** Preregistered randomised field experiment in schools: students randomised within classrooms to a 20-min depleting task vs control, then incentivised dice-roll cheating task (N≈1,143); OLS with classroom fixed effects, SEs clustered by school
- **Key result:** Depleted students misreported 4.4 percentage points more (b=0.044, SE 0.024, p marginal, d=0.13); significant only after restricting to those choosing the more valuable gift (b=0.045, SE 0.016, d=0.16); control mean 8.8%
- **Trap:** Headline 'causal evidence of ego depletion' rests on a marginal full-sample effect that becomes significant only in a subsample, with a small d; multiple outcome definitions
- **Tymee review:** pending

#### Solanki, McPartlan, Xu et al. (2019), Success with EASE: Who benefits from a STEM learning community?

- **File:** `papers/solanki-2019-ease-learning-community.pdf` · doi:10.1371/journal.pone.0213827
- **Design:** Non-randomised quasi-experiment: biology freshmen assigned to a learning community by SAT Math score (n=388 EASE vs 519 non-EASE); OLS regression with covariates and subgroup interactions
- **Key result:** EASE associated with +0.25 cumulative first-year GPA (0-4 scale) after controls; groups differ sharply at baseline (SAT Math 524 vs 653; first-gen 63% vs 37%)
- **Trap:** Assignment by a test-score cutoff makes groups non-equivalent; covariate adjustment cannot fully remove selection, and many subgroup analyses (gender, race, first-gen) invite multiple-comparison overreach
- **Tymee review:** pending

#### Wienecke, Hauge, Nielsen et al. (2021), Six Weeks of Basketball Combined With Mathematics in Physical Education Classes Can Improve Children's Motivation for Mathematics

- **File:** `papers/wienecke-2021-basketball-mathematics.pdf` · doi:10.3389/fpsyg.2021.636578
- **Design:** Cluster-randomised school study: 40 classes in 5 schools randomised to basketball+maths (BM) vs basketball only (CON) for 6 weeks; 757 enrolled, 459 analysed; linear mixed model with group x time
- **Key result:** Intrinsic motivation fell in CON (-9.38%, p<.001) but not in BM (-0.39%, p=.98); group x time p=.006; within-BM acute IMI intrinsic motivation +16.09% vs classroom maths (p<.0001)
- **Trap:** Title says BM 'improves' motivation, but BM did not change; the effect is CON declining. ~40% of enrolled children excluded (attrition), novelty of the activity, and acute within-BM comparison has no control
- **Tymee review:** pending

### Null or equivalence result

#### Rogowsky, Calhoun & Tallal (2020), Providing Instruction Based on Students' Learning Style Preferences Does Not Improve Learning

- **File:** `papers/rogowsky-2020-learning-styles-matching.pdf` · doi:10.3389/fpsyg.2020.00164
- **Design:** Within-subjects instruction mode (reading vs listening) x measured learning-style preference, 5th graders, N=136 enrolled, n=112 analysed, n=34 with clear auditory/visual style
- **Key result:** Style x instruction interaction n.s., F(1,38)=1.16, p=.29; visual-style students scored higher overall (M=39.07 vs 28.58), F(1,32)=12.92, eta2=.29; power analysis targeted f=0.15 needing n=76
- **Trap:** Non-significant matching interaction read as proof of no effect, while the key test rests on only n=34 (below the planned 76); a main effect of style mistaken for support of matching
- **Tymee review:** pending

#### Liu, Zhang & Zhou (2021), The Mindset of Intelligence Is Not a Contributor of Placebo Effects in Working Memory Training

- **File:** `papers/liu-2021-mindset-placebo-wm-training.pdf` · doi:10.3389/fpsyg.2021.712309
- **Design:** Quasi-experimental pre/post, groups formed by Theories of Intelligence Scale score (growth n=25 vs fixed n=25), single 1 h working memory training session
- **Key result:** No group difference on Raven's matrices at post-test, t(48)=-0.304, p=.762; no group x time interactions on near or far transfer; no Bayes factor or equivalence test
- **Trap:** Underpowered null (25 per group, 1 h training) read as 'mindset does not contribute'; groups not randomly assigned; absence of evidence vs evidence of absence
- **Tymee review:** pending

#### Smit, Milne, Sarvasy et al. (2022), Emotional responses in Papua New Guinea show negligible evidence for a universal effect of major versus minor music

- **File:** `papers/smit-2022-major-minor-png.pdf` · doi:10.1371/journal.pone.0269597
- **Design:** Cross-cultural forced-choice experiment, 170 PNG participants in 3 communities differing in Western music exposure plus 79 Sydney participants; Bayesian multilevel logistic regression with ROPE
- **Key result:** Major vs minor cadence: minimal-exposure group est=-0.14, 90% CI [-1.19, 0.91], evidence ratio 0.69, only 23% probability inside ROPE; Sydney non-musicians est=3.47, evidence ratio >19999
- **Trap:** 'No convincing evidence for an effect' is not evidence of no effect: ROPE probability shows the data cannot support either claim; exposure groups are not randomly assigned
- **Tymee review:** pending

#### Müller, Bahnsen & Alpers (2022), State anxiety by itself does not change political attitudes: A threat of shock experiment

- **File:** `papers/muller-2022-anxiety-political-attitudes.pdf` · doi:10.3389/fpsyg.2022.1006757
- **Design:** Pre-registered randomised between-subjects lab experiment, threat-of-shock vs safety during attitude measurement, N=75 (planned ~100, stopped by COVID-19)
- **Key result:** Conservatism under threat vs safety n.s., e.g. t(73)=0.11, p=.911; all /d/ <= 0.25; Bayes factors favoured the null; manipulation check confirmed anxiety
- **Trap:** Stopped short of its power target (75 of 100) yet titled 'does not change'; Bayes factors help but small effects (d<0.4) remain plausible; smallest effect size of interest
- **Tymee review:** pending

#### Bertram, Lalot, van der Werff et al. (2025), Distrusting minds, skeptical judgments? No evidence for a trust-truth link

- **File:** `papers/bertram-2025-trust-truth-null.pdf` · doi:10.3389/fpsyg.2025.1626047
- **Design:** Three correlational studies (total N=679) with pre-registered power targets (n=250 for r=.10 stability), logistic mixed-effects models plus Bayes factors
- **Key result:** Study 1 trust propensity b=-0.02, SE=0.03, p=.52, OR=0.98, BF01 ~1235; Study 3 BF01 ranged 9.17 to 2043 for trust and 1.05 to 266 for social trust depending on prior
- **Trap:** Bayes factor strength depends on the prior: a wide prior inflates 'support for the null' (BF01 fell to 1.05 under a restrictive prior); null correlations do not show trust is irrelevant
- **Tymee review:** pending

#### Richey, Phillips, Schunn et al. (2014), Is the Link from Working Memory to Analogy Causal? No Analogy Improvements following Working Memory Training Gains

- **File:** `papers/richey-2014-wm-training-analogy.pdf` · doi:10.1371/journal.pone.0106616
- **Design:** Pre/post training study, complex working memory training (n=25) vs separately recruited test-retest control (n=29), young adults
- **Key result:** Verbal analogy accuracy CWM M=.77 vs control M=.76, F(1,50)=0.04, p=.84, d=0.05; reported power only .67-.74 for d=0.5
- **Trap:** Null transfer read as 'working memory does not cause analogy' despite power below .80 for a moderate effect and a control group that was not randomly assigned
- **Tymee review:** pending

#### Rode, Robson, Purviance et al. (2014), Is Working Memory Training Effective? A Study in a School Setting

- **File:** `papers/rode-2014-wm-training-school.pdf` · doi:10.1371/journal.pone.0104796
- **Design:** Cluster-assigned field study, 11 third-grade classrooms (training n=156 vs business-as-usual n=126), pre/post, multilevel models
- **Key result:** Both groups gained, e.g. WIAT Reading 18.09->24.39 (training) vs 19.08->24.39 (control); predicted transfer d up to .62 but observed transfer effects very small and inconsistent
- **Trap:** Large N claimed to rule out low power, but only 11 classrooms were assigned; baseline imbalance in teacher ratings (18.2 vs 10.6) invites regression to the mean; passive control
- **Tymee review:** pending
