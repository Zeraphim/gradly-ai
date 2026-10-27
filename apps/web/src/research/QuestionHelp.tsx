import { Fragment, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHelp } from "lucide-react";
import { Dialog } from "../components/Dialog.js";
import {
  researchTerms,
  termExamples,
  relevantTerms,
  termMatches,
} from "./research-terms.js";

/** Only annotate visible prose, leaving answer choices and hidden results alone. */
export function ResearchTermText({ text }: { text: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const matches = termMatches(text);
  let end = 0;
  const parts = matches.map((match) => {
    const before = text.slice(end, match.start);
    end = match.end;
    return (
      <Fragment key={match.start}>
        {before}
        <button
          type="button"
          className="research-term"
          aria-haspopup="dialog"
          title="Explain this term"
          onClick={() => setOpen(match.term)}
        >
          {match.text}
        </button>
      </Fragment>
    );
  });
  return (
    <>
      {parts}
      {text.slice(end)}
      {open
        ? createPortal(
            <Dialog title={open} onClose={() => setOpen(null)}>
              <p>{researchTerms[open]}</p>
              <p>
                <strong>Illustrative example:</strong> {termExamples[open]}
              </p>
            </Dialog>,
            document.querySelector(".research-lab") ?? document.body,
          )
        : null}
    </>
  );
}

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
