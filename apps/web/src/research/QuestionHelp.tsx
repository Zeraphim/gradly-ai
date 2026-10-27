import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Dialog } from "../components/Dialog.js";
import {
  researchTerms,
  termExamples,
  relevantTerms,
} from "./research-terms.js";

export function QuestionHelp({
  text,
  hint,
}: {
  text: string;
  hint: string | null;
}) {
  const [open, setOpen] = useState(false);
  const terms = relevantTerms(text);
  return (
    <>
      <button
        type="button"
        className="question-help-trigger"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <CircleHelp size={18} aria-hidden="true" />
        <span>Help me understand this</span>
      </button>
      {open ? (
        <Dialog title="Help me understand this" onClose={() => setOpen(false)}>
          <p>
            General definitions explain the wording. They do not assess your
            answer.
          </p>
          {terms.length ? (
            <dl className="question-help-terms">
              {terms.map((term) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>
                    {researchTerms[term]}
                    <p>
                      <strong>Illustrative example:</strong>{" "}
                      {termExamples[term]}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>
              No specialist terms from the reference appear in this question’s
              text.
            </p>
          )}
          <section aria-label="Question hint">
            <h3>Question hint</h3>
            {hint ? (
              <p>{hint}</p>
            ) : (
              <p>Hints appear with feedback after the first missed attempt.</p>
            )}
          </section>
        </Dialog>
      ) : null}
    </>
  );
}
