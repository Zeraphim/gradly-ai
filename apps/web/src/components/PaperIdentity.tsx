import React from "react";
import { BookOpen } from "lucide-react";
import { paperCitation, paperIdentity } from "../research/paper-context.js";

/**
 * The published identity of the reference study. Authored text: it is never
 * derived from an upload and it never stands in for an AI analysis.
 */
export function PaperIdentity({ plain = false }: { plain?: boolean }) {
  return (
    <div className={plain ? "paper-cite is-plain" : "paper-cite"}>
      {plain ? null : (
        <span className="paper-cite-icon">
          <BookOpen size={19} aria-hidden="true" />
        </span>
      )}
      <div className="paper-cite-body">
        {plain ? null : (
          <span className="paper-cite-kicker">
            Peer-reviewed study · {paperCitation.year}
          </span>
        )}
        <p className="paper-cite-title">{paperCitation.title}</p>
        <p>{paperIdentity}</p>
        <p className="paper-cite-doi">DOI {paperCitation.doi}</p>
      </div>
    </div>
  );
}
