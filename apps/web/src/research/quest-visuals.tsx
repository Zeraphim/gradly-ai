import type { ReactNode } from "react";
import {
  Activity,
  ArrowUpDown,
  Ban,
  BadgeCheck,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Columns2,
  Dices,
  FlaskConical,
  Frown,
  Gauge,
  GraduationCap,
  Hand,
  Link2,
  Meh,
  Minus,
  Percent,
  Scale,
  Shuffle,
  Smile,
  Star,
  Target,
  Users,
  UsersRound,
  Brain,
  BookX,
} from "lucide-react";
import { m, useSceneMotion } from "./scenes/scene-motion.js";
import {
  StudyDesignVisual,
  type StudyDesignPlan,
} from "./scenes/StudyDesignVisual.js";
import { questSource } from "./texting-quest.js";
import type { QuestIcon } from "./texting-quest.js";

const icons: Record<QuestIcon, typeof Users> = {
  grades: GraduationCap,
  quiz: ClipboardCheck,
  confidence: Gauge,
  students: Users,
  survey: ClipboardList,
  random: Shuffle,
  choose: Hand,
  distraction: Activity,
  groups: Columns2,
  pairs: Link2,
  anova: ChartColumn,
  histogram: ChartColumn,
  percent: Percent,
  people: UsersRound,
  difference: Minus,
  spread: Activity,
  target: Target,
  range: ArrowUpDown,
  probability: Dices,
  ability: Brain,
  fail: BookX,
  experiment: FlaskConical,
  scale: Scale,
  certain: BadgeCheck,
  blocked: Ban,
};

export function OptionIcon({ icon }: { icon?: QuestIcon }) {
  if (!icon) return null;
  const Icon = icons[icon];
  return (
    <span className="quest-option-icon" aria-hidden="true">
      <Icon size={22} strokeWidth={2.2} />
    </span>
  );
}

/** Selection changes its text immediately; the working surface stays mounted. */
function VisualContent({ children }: { children: ReactNode }) {
  return <div className="qv-content">{children}</div>;
}

function Prompt({ children }: { children: ReactNode }) {
  return <p className="qv-prompt">{children}</p>;
}

/** 03 · A research question links something that varies to an outcome. */
export function FrameVisual({ selected }: { selected?: string }) {
  const map: Record<string, [string, string]> = {
    A: ["Usual texting habits", "Overall university grades"],
    B: ["Texting during one lecture", "Quiz on that lecture"],
    C: ["Feeling distracted", "Confidence in learning"],
  };
  const pair = selected ? map[selected] : undefined;
  return (
    <figure className="quest-figure qv-frame">
      <div className="qv-frame-row">
        <div className={`qv-slot ${pair ? "is-filled" : ""}`}>
          <small>What varies</small>
          <VisualContent>
            <strong>{pair?.[0] ?? "?"}</strong>
          </VisualContent>
        </div>
        <span className="qv-arrow" aria-hidden="true">
          →
        </span>
        <div className={`qv-slot ${pair ? "is-filled" : ""}`}>
          <small>What gets measured</small>
          <VisualContent>
            <strong>{pair?.[1] ?? "?"}</strong>
          </VisualContent>
        </div>
      </div>
      <figcaption>
        {pair
          ? "This is the comparison your chosen question would set up."
          : "Pick a question to see what it would compare."}
      </figcaption>
    </figure>
  );
}

/** 04 · Who ends up in the sample under each recruitment rule. */
export function SampleVisual({ selected }: { selected?: string }) {
  const motion = useSceneMotion();
  // Beliefs about texting across an illustrative group of 18 students.
  const beliefs = [
    "hurts",
    "fine",
    "unsure",
    "fine",
    "hurts",
    "unsure",
    "unsure",
    "hurts",
    "fine",
    "hurts",
    "unsure",
    "fine",
    "fine",
    "unsure",
    "hurts",
    "unsure",
    "fine",
    "hurts",
  ] as const;
  const keep = (belief: (typeof beliefs)[number]) =>
    !selected ||
    selected === "C" ||
    (selected === "A" && belief === "hurts") ||
    (selected === "B" && belief === "fine");
  const count = beliefs.filter(keep).length;
  const face = { hurts: Frown, fine: Smile, unsure: Meh };
  return (
    <figure className="quest-figure qv-sample">
      <div className="qv-crowd" aria-hidden="true">
        {beliefs.map((belief, i) => {
          const Face = face[belief];
          return (
            <m.span
              key={i}
              className={`qv-person is-${belief}`}
              initial={false}
              animate={{
                opacity: keep(belief) ? 1 : 0.18,
                scale: keep(belief) ? 1 : 0.86,
              }}
              transition={motion.still ? { duration: 0 } : motion.copy}
            >
              <Face size={20} strokeWidth={2.2} />
            </m.span>
          );
        })}
      </div>
      <div className="qv-legend">
        <span>
          <Frown size={14} /> “Texting hurts my focus”
        </span>
        <span>
          <Smile size={14} /> “I can text and learn”
        </span>
        <span>
          <Meh size={14} /> No strong view
        </span>
      </div>
      <figcaption>
        {selected
          ? `${count} of 18 students would be recruited. Illustration only.`
          : "Pick a recruitment rule to see who joins. Illustration only."}
      </figcaption>
    </figure>
  );
}

const studyPlans: Record<string, StudyDesignPlan> = {
  A: {
    id: "A",
    title: "Existing habits",
    grouping: "observe",
    groups: ["Usually texts", "Usually does not text"],
    outcome: "Latest course grades",
    description:
      "Ask about existing texting habits, then compare course grades. Neither the groups nor their lecture experiences are assigned.",
  },
  B: {
    id: "B",
    title: "Random assignment",
    grouping: "assign",
    groups: ["Assigned to text", "Assigned not to text"],
    outcome: "Same lecture · same quiz",
    description:
      "Chance assigns students to the two groups. Both groups watch the same lecture and take the same quiz.",
  },
  C: {
    id: "C",
    title: "Self-selection",
    grouping: "choose",
    groups: ["Chooses to text", "Chooses not to text"],
    outcome: "Same lecture · same quiz",
    description:
      "Students decide which group to join. Both groups watch the same lecture and take the same quiz.",
  },
};

/** 05 · The same diagram responds to each proposed study design. */
export function PlansVisual({
  selected,
  resolved = false,
}: {
  selected?: string;
  resolved?: boolean;
}) {
  return (
    <StudyDesignVisual
      participantsLabel="Students"
      plan={selected ? studyPlans[selected] : undefined}
      source={
        resolved
          ? {
              summary:
                "In Experiment 2, the researchers randomly assigned undergraduates to text or not text during the same lecture, then gave them a quiz about it.",
              citation:
                "Gingerich & Lineweaver (2014), Experiment 2 · procedure summary",
              href: `https://doi.org/${questSource.doi}`,
            }
          : undefined
      }
    />
  );
}

/** 06 · What each outcome measure would look like to a participant. */
export function InstrumentsVisual({ selected }: { selected?: string }) {
  return (
    <figure className="quest-figure qv-instrument">
      <VisualContent>
        {selected === "A" ? (
          <div className="qv-form">
            <small>Self-report</small>
            <strong>
              How confident are you that you understood the lecture?
            </strong>
            <div className="qv-stars" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={26} className={n <= 4 ? "is-on" : ""} />
              ))}
            </div>
          </div>
        ) : selected === "B" ? (
          <div className="qv-form">
            <small>Self-report</small>
            <strong>How distracted did you feel during the lecture?</strong>
            <div className="qv-scale" aria-hidden="true">
              {["Not at all", "", "", "", "Very"].map((label, n) => (
                <span key={n} className={n === 2 ? "is-on" : ""}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        ) : selected === "C" ? (
          <div className="qv-form">
            <small>Performance test</small>
            <strong>Quiz on the lecture</strong>
            <ol className="qv-quiz" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <li key={n}>
                  <span>Q{n}</span>
                  <i />
                  <i />
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <Prompt>Pick a measure to see what participants would answer.</Prompt>
        )}
      </VisualContent>
    </figure>
  );
}

/** 08 · Two separate groups; a paired design would need links between people. */
export function GroupsVisual({ selected }: { selected?: string }) {
  const motion = useSceneMotion();
  const paired = selected === "B";
  const dots = (text: boolean) => (
    <div className="qv-dots" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={text ? "is-text" : ""} />
      ))}
    </div>
  );
  return (
    <figure className="quest-figure qv-groups">
      <div className="qv-groups-row">
        <div className="qv-group">
          <strong>Text</strong>
          {dots(true)}
        </div>
        <div className="qv-links" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <m.span
              key={i}
              initial={false}
              animate={{ scaleX: paired ? 1 : 0, opacity: paired ? 1 : 0 }}
              transition={
                motion.still
                  ? { duration: 0 }
                  : { duration: 0.3, delay: i * 0.05 }
              }
            />
          ))}
        </div>
        <div className="qv-group">
          <strong>No text</strong>
          {dots(false)}
        </div>
      </div>
      <figcaption>
        {paired
          ? "A paired test assumes each score is linked to a partner score like this."
          : "Each student is in one group and gives one quiz score."}
      </figcaption>
    </figure>
  );
}

/** 09 · How the data were collected, from the paper's procedure. */
export function InspectVisual() {
  return (
    <figure className="quest-figure qv-inspect">
      <span className="qv-plan-name">
        <ClipboardList size={18} /> Field notes from the study
      </span>
      <ul>
        <li>
          <ChartColumn size={18} /> 56 quiz scores across two groups
        </li>
        <li>
          <Users size={18} /> Students were tested in group sessions
        </li>
        <li>
          <Link2 size={18} /> Texting meant messaging another person
        </li>
      </ul>
    </figure>
  );
}

/** 12 · Where F(1, 54) = 4.33 falls if the population means were equal. */
export function DistributionVisual() {
  const motion = useSceneMotion();
  // Approximate F(1, 54) density, drawn for illustration on 0–8.
  const points: [number, number][] = [];
  for (let i = 0; i <= 80; i++) {
    const x = 0.1 + (i / 80) * 7.9;
    const y = Math.exp(-x / 2) / Math.sqrt(x);
    points.push([(x / 8) * 300, 150 - Math.min(y, 2.4) * 55]);
  }
  const curve = `M${points.map(([x, y]) => `${x},${y}`).join(" L")}`;
  const xc = (4.02 / 8) * 300;
  const xo = (4.33 / 8) * 300;
  // The tail beyond the 5% cut-off, filled down to the axis and exaggerated
  // in height slightly so the rare zone reads at a glance.
  const tail = points.filter(([x]) => x >= xc);
  const tailArea = `M${xc},150 ${tail
    .map(([x, y]) => `L${x},${Math.min(y, 150) - 6}`)
    .join(" ")} L300,150 Z`;
  return (
    <figure className="quest-figure qv-dist">
      <svg viewBox="0 0 300 175" aria-hidden="true">
        <path d={tailArea} className="qv-tail" />
        <m.path
          d={curve}
          className="qv-curve"
          initial={motion.still ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={motion.still ? { duration: 0 } : { duration: 0.8 }}
        />
        <line x1="0" x2="300" y1="150" y2="150" className="qv-axis" />
        <m.g
          initial={motion.still ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            motion.still ? { duration: 0 } : { delay: 0.7, duration: 0.3 }
          }
        >
          <line x1={xo} x2={xo} y1="60" y2="150" className="qv-marker" />
          <text x={xo + 6} y="70">
            Observed F = 4.33
          </text>
        </m.g>
        <text x={xc + 30} y="140" className="qv-small">
          rare zone: under 5%
        </text>
        <text x="8" y="168" className="qv-small">
          0
        </text>
        <text x="282" y="168" className="qv-small">
          F
        </text>
      </svg>
      <figcaption>
        Illustration: the shape of F values if the true means were equal and the
        assumptions held.
      </figcaption>
    </figure>
  );
}

/** 13 · What this study tested, and wider claims it did not test. */
export function ScopeVisual() {
  return (
    <figure
      className="quest-figure qv-scope"
      aria-label="What the study tested"
    >
      <div className="qv-ring is-outer">
        <span>Academic ability · course grades · passing courses</span>
        <div className="qv-ring is-middle">
          <span>Every lecture · every student</span>
          <div className="qv-ring is-inner">
            <FlaskConical size={18} aria-hidden="true" />
            <span>
              Tested here: students assigned to text or not, one lecture, one
              quiz
            </span>
          </div>
        </div>
      </div>
      <figcaption>
        Match your sentence to the ring the evidence supports.
      </figcaption>
    </figure>
  );
}
