import { Icon } from "./icon.js";

/** One progress vocabulary from intake through the existing player handoff. */
export function IntakeSteps({ current }: { current: 0 | 1 | 2 | 3 }) {
  return (
    <ol className="upload-review-steps" aria-label="Paper to investigation">
      {["Upload", "Review", "Prepare", "Play"].map((label, index) => (
        <li
          key={label}
          className={
            index < current
              ? "is-complete"
              : index === current
                ? "is-current"
                : ""
          }
          aria-current={index === current ? "step" : undefined}
        >
          <span className="upload-step-number" aria-hidden="true">
            {index < current ? <Icon name="check" size={16} /> : index + 1}
          </span>
          <strong>{label}</strong>
        </li>
      ))}
    </ol>
  );
}
