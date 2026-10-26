// Originally generated 2026-10-25; questions and scenes manually revised for issues #31/#32.
// Source paper: docs/research/papers/franssens-2021-bus-nudge-social-label.pdf
// Revised 27 October 2026: answers were copied from the evidence lines; now decisions about paired lines, the control holder, effect size, few assigned units, a robustness check and reach.
// Source excerpts remain verbatim. Not approved by the content-review owner.
import type { StudyBody } from "../types.js";

export const body: StudyBody = {
  lesson: {
    id: "prepared-bus-ridership-behavior",
    title: "Design: Unit of Analysis",
    briefing:
      "A bus company handed out free card holders, some with a message calling riders sustainable travellers. Decide how bus lines were compared, how big the change was, and what a field test on six lines can show.",
    source: "generated",
    paper: {
      title:
        "Nudging Commuters to Increase Public Transport Use: A Field Experiment in Rotterdam",
      authors: "Franssens, Botchway, de Swart et al. (2021)",
      journal: "Frontiers in Psychology 12: 633865",
      url: "https://doi.org/10.3389/fpsyg.2021.633865",
      limitations: [
        "Treatment was assigned to whole bus lines, three per condition, because rides could not be linked to individual passengers.",
        "The control holder had no message, so a social label cannot be separated from any positive message.",
        "There was no check of whether riders noticed the message, and external events on a line cannot be ruled out.",
      ],
    },
    evidence: [
      {
        id: "e1",
        page: 2,
        excerpt:
          "We chose three pairs of lines in which the two lines did not overlap geographically and were similar in terms of passengers’ socio-economic background.",
      },
      {
        id: "e2",
        page: 2,
        excerpt:
          "The geographic separation of experimental and control lines was important to reduce the likelihood that bus passengers receiving an experimental card holder would end up riding a control line or vice versa.",
      },
      {
        id: "e3",
        page: 2,
        excerpt:
          "On three other bus lines, passengers received a standard card holder distributed by the public transport operator, which displayed no message.",
      },
      {
        id: "e4",
        page: 5,
        excerpt:
          "We therefore cannot be sure whether the intervention will also increase bus use compared to a control condition that receives card holders with a positive message, similar to the one we used, but that does not rely on social labeling.",
      },
      {
        id: "e5",
        page: 4,
        excerpt:
          "Conversion of the estimate of this interaction term to the original scale gives an effect size of 0.059 extra rides per hour on the experimental (vs. control) lines or 1.18 extra rides on a typical day (0.059 extra rides × 20 h).",
      },
      {
        id: "e6",
        page: 4,
        excerpt:
          "This constitutes an increase of 0.059%, compared to the average number of rides in the pre-intervention period (100.68 rides per hour or 2013.51 per day).",
      },
      {
        id: "e7",
        page: 5,
        excerpt:
          "Also, the card holders were distributed among only an estimated 21.5% of bus passengers during peak hours of one work week (peak hours accounted for 71% of rides during that work week).",
      },
      {
        id: "e8",
        page: 4,
        excerpt:
          "The unit of analysis is the number of rides in 1 hour on a particular bus line.",
      },
      {
        id: "e9",
        page: 4,
        excerpt:
          "This results in a data set with 91326 observations (1757 observations or 1.89% were removed).",
      },
      {
        id: "e10",
        page: 5,
        excerpt:
          "Finally, even though we assigned comparable lines to the treatments and included a number of variables in the model to control for existing patterns of bus use (see Supplementary Material), we cannot rule out that the effect of the intervention was caused by external events not captured by the model.",
      },
      {
        id: "e11",
        page: 5,
        excerpt:
          "Results show that the interaction between condition and period is significantly positive in the period immediately after the intervention, for almost every possible length of the period immediately after the intervention, lowering the likelihood that the effect is due to a random event such as construction works on the control line (unless this happened right after the intervention).",
      },
      {
        id: "e12",
        page: 2,
        excerpt:
          "This survey showed that most passengers took the bus five times per week or more (63.2%) or one to four times per week (26.7%).",
      },
      {
        id: "e13",
        page: 5,
        excerpt:
          "It would be interesting to test whether increases in bus use can be obtained with people who take the bus less often.",
      },
      {
        id: "e14",
        page: 5,
        excerpt:
          "First, after the intervention, the survey only asked passengers whether they had received a card holder in the week before, not which card holder they had received.",
      },
    ],
    challenges: [
      {
        id: "c1",
        stage: "Read the design",
        title: "Pairs of Lines",
        type: "single",
        prompt:
          "The team chose three pairs of similar bus lines, far apart, and randomly gave one line in each pair the message. Why pair them and keep them apart?",
        evidence: [
          "Six suburban lines, each running to a metro stop.",
          "Pairs were matched on passengers' socio-economic background.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "Expose riders to both holders, creating a within-person comparison of messages.",
          },
          {
            id: "o3",
            text: "Keep the line pairs apart so that card-holder delivery itself becomes the tested treatment.",
          },
          {
            id: "o4",
            text: "Match routes after assignment, using successful routes to define the comparison pairs.",
          },
          {
            id: "o1",
            text: "Match comparable lines and reduce message spillover onto the comparison lines.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "What could go wrong if a rider with a message holder often rode a control line?",
        misconceptions: {
          o2: "Distant lines were intended to reduce crossover, not create within-person comparisons.",
          o3: "Both conditions received holders; the message was the treatment difference.",
          o4: "Pairing preceded random assignment; outcomes did not define the pairs.",
        },
        explanation:
          "The lines in each pair were similar and did not overlap geographically. Separation reduced the chance that riders with a message holder would ride a control line or the other way round.",
        refs: ["e1", "e2"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c2",
        stage: "Read the design",
        title: "A Plain Holder for Comparison",
        type: "single",
        prompt:
          "Control lines also received free card holders, but without a message. What does that rule out, and what does it leave open?",
        evidence: [
          "Message holder: “Naturally, I use public transport… it is natural you travel sustainably.”",
          "Control holder: the company's standard holder.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "It rules out the free gift itself as the cause, but not whether any positive message would work as well as calling riders sustainable.",
          },
          {
            id: "o2",
            text: "It isolates the sustainable label from every other feature, including receiving any positive message.",
          },
          {
            id: "o3",
            text: "It removes the treatment difference because both groups received the same kind of physical holder.",
          },
          {
            id: "o4",
            text: "It tests whether free holders work, by comparing recipients with riders given no holder at all.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Compare what both groups received with what only one group received.",
        misconceptions: {
          o2: "There was no generic-positive-message condition.",
          o3: "The holders differed in message, which is the comparison of interest.",
          o4: "Control riders also received holders; there was no no-holder comparison.",
        },
        explanation:
          "Both groups got a free holder, so the difference is the message. The authors note they cannot tell whether a positive message without a social label would work too.",
        refs: ["e3", "e4"],
        writtenReasoning: false,
        reveal: "design",
      },
      {
        id: "c3",
        stage: "Read the results",
        title: "How Big Is 1.18 Rides?",
        type: "single",
        prompt:
          "Lines with the message gained about 1.18 extra rides per day compared with control lines. A line averaged about 2,014 rides a day before. How big is that change?",
        evidence: [
          "The change was statistically significant.",
          "Holders reached an estimated 21.5% of peak-hour passengers in one week.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "A large practical gain, because the test found a statistically reliable increase in daily rides.",
          },
          {
            id: "o3",
            text: "About 1.18% more daily rides, using the extra ride count as a percentage of the baseline.",
          },
          {
            id: "o1",
            text: "About 0.06% more daily rides: detectable, but a small practical change.",
          },
          {
            id: "o4",
            text: "No practical change to count, because fractional daily averages cannot represent additional rides.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Divide the extra rides by the usual daily rides.",
        misconceptions: {
          o2: "Statistical reliability does not establish practical size.",
          o3: "Divide 1.18 by about 2,014 before converting to percent.",
          o4: "Averages can be fractional even though individual rides are whole events.",
        },
        explanation:
          "1.18 extra rides on about 2,014 a day is an increase of about 0.059%. The authors explain that one short message on a holder, given to about a fifth of peak-hour riders for a week, is bound to have a small effect.",
        refs: ["e5", "e6", "e7"],
        writtenReasoning: false,
        reveal: "results",
      },
      {
        id: "c4",
        stage: "Read the results",
        title: "Many Hours, Few Lines",
        type: "single",
        prompt:
          "The analysis used over 91,000 hourly counts and gave p < .001. Why should a reader still be careful about how much evidence this is?",
        evidence: [
          "Each count is the number of rides in one hour on one line.",
          "The message was assigned to three lines and the plain holder to three.",
        ],
        scene: {
          version: 1,
          kind: "units",
          title: "What was assigned, what was counted",
          instruction:
            "Compare how many lines got a condition with how many counts were analysed.",
          description:
            "Six bus lines were assigned to conditions; over 91,000 hourly counts from those lines were analysed.",
          provenance: {
            kind: "reported",
            refs: ["e8", "e9"],
            note: "Counts as printed in the analysis section.",
          },
          levels: [
            {
              id: "lines",
              label: "Bus lines assigned",
              detail: "Three with the message, three without.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e8"],
                note: "Count as printed in the method and analysis.",
              },
              count: 6,
              unit: "bus lines",
              role: "assigned",
            },
            {
              id: "hours",
              label: "Hourly ride counts analysed",
              detail: "Rides per line per hour over about two years.",
              at: "setup",
              provenance: {
                kind: "reported",
                refs: ["e9"],
                note: "Count as printed in the method and analysis.",
              },
              count: 91326,
              unit: "hourly counts",
              role: "analysed",
            },
          ],
          resolution: {
            id: "resolution",
            label: "Six lines, not thousands",
            detail:
              "Thousands of hourly counts come from only six lines, so an event on one line could resemble a treatment effect.",
            at: "resolution",
            provenance: {
              kind: "authored",
              refs: ["e8", "e9"],
              note: "Authored teaching guidance.",
            },
          },
          responses: [
            {
              optionId: "o2",
              label: "Too few counts",
              targetIds: ["hours"],
            },
            {
              optionId: "o1",
              label: "Few lines assigned",
              targetIds: ["lines"],
            },
            {
              optionId: "o3",
              label: "Passengers counted",
              targetIds: ["hours"],
            },
            {
              optionId: "o4",
              label: "No reason",
              targetIds: [],
            },
          ],
        },
        responseStyle: "pills",
        options: [
          {
            id: "o2",
            text: "The hourly counts provide over 91,000 independently assigned units.",
          },
          {
            id: "o1",
            text: "Only six lines were assigned; many counts do not create more independent lines.",
          },
          {
            id: "o3",
            text: "The main limit is that each hourly count identifies the same passenger returning later that day.",
          },
          {
            id: "o4",
            text: "The small p-value removes uncertainty about whether unrelated line events affected the estimate.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "How many separate units actually received the message?",
        misconceptions: {
          o2: "Assignment was at the line level, not independently for each count.",
          o3: "Counts are aggregate rides, not linked passenger records.",
          o4: "A small p-value does not eliminate design or clustering concerns.",
        },
        explanation:
          "Rides could not be linked to passengers, so whole lines were assigned. With three lines per condition, the authors cannot rule out that external events not captured by the model explain the effect.",
        refs: ["e8", "e9", "e10"],
        writtenReasoning: false,
        reveal: "significance",
      },
      {
        id: "c5",
        stage: "Draw a conclusion",
        title: "Ruling Out a One-Off Event",
        type: "single",
        prompt:
          "Suppose roadworks had cut rides on a control line at some point after the intervention. Which check makes that explanation less likely?",
        evidence: [
          "There were 176 days of data after the intervention.",
          "The team re-ran the analysis with many different lengths for the period right after the intervention.",
        ],
        scene: null,
        options: [
          {
            id: "o1",
            text: "The positive estimate across many follow-up windows weakens a single-event explanation.",
          },
          {
            id: "o2",
            text: "The many hourly observations rule out roadworks by averaging away changes on individual routes.",
          },
          {
            id: "o3",
            text: "The separate message pre-test excludes changes caused by roadworks.",
          },
          {
            id: "o4",
            text: "The matching of routes before treatment rules out any later disruption affecting only one route.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "If a disruption happened at one moment, would the effect hold whatever window you chose?",
        misconceptions: {
          o2: "Repeated observations do not automatically remove a route-specific event.",
          o3: "A message pre-test cannot test events on the bus routes.",
          o4: "Matching baseline characteristics cannot prevent later roadworks.",
        },
        explanation:
          "The authors report the effect was significantly positive for almost every possible length of the period right after the intervention, which lowers the chance that a random event such as roadworks explains it, unless it happened right after the intervention.",
        refs: ["e11"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
      {
        id: "c6",
        stage: "Draw a conclusion",
        title: "Will It Win Over Drivers?",
        type: "single",
        prompt:
          "A city wants to use this message to get car drivers onto buses. What does the study say about that?",
        evidence: [
          "Most passengers already rode five or more times a week.",
          "The outcome was the number of rides on each line.",
        ],
        scene: null,
        options: [
          {
            id: "o2",
            text: "The rise in ride counts estimates how many former drivers switched to taking the bus each day.",
          },
          {
            id: "o3",
            text: "The small average increase shows that car drivers would be less responsive than existing riders.",
          },
          {
            id: "o4",
            text: "The distance between routes ensures that drivers encountered the label outside the bus system.",
          },
          {
            id: "o1",
            text: "Little: the riders were mostly regular bus users, and the study counted rides, not people switching from cars.",
          },
        ],
        accepted: ["o1"],
        alternatives: [],
        hint: "Who received the holders, and what was counted?",
        misconceptions: {
          o2: "Ride counts do not identify previous travel mode.",
          o3: "The study did not compare those populations.",
          o4: "Distance reduced spillover between lines; it does not establish exposure among drivers.",
        },
        explanation:
          "Most passengers were regular riders, which the authors say may have limited the effect, and they suggest testing people who ride less often. The study did not measure car use.",
        refs: ["e12", "e13", "e14"],
        writtenReasoning: false,
        reveal: "interpretation",
      },
    ],
    bonus: null,
  },
  takeaway:
    "In a field test on six Rotterdam bus lines, card holders calling riders sustainable travellers were followed by a reliable but tiny rise in rides, about 1.18 per line per day, compared with lines given plain holders. With only six lines, mostly regular riders and no check on whether riders saw the message, the result says little about attracting new riders.",
};
