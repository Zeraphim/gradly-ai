import { useState } from "react";
import { Check, CornerUpLeft, Inbox, MoveRight } from "lucide-react";
import type { SceneItem, SceneOf } from "@paperquest/contracts";
import type { SceneDraft } from "../../scenes/InvestigationScene.js";
import {
  AnimatePresence,
  m,
  useSceneMotion,
} from "../../scenes/scene-motion.js";

type Sort = SceneOf<"sort">;

/**
 * Where each card sits: the paper's placement once the explanation shows it,
 * otherwise the learner's own sort. Unknown bins fall back to the tray.
 */
export function sortLayout(scene: Sort, sorted: Record<string, string> = {}) {
  const bins = new Set(scene.bins.map((bin) => bin.id));
  const paper = new Map(scene.placements.map((p) => [p.cardId, p.binId]));
  const at = (card: SceneItem) => {
    const bin = paper.get(card.id) ?? sorted[card.id];
    return bin && bins.has(bin) ? bin : null;
  };
  return new Map(scene.cards.map((card) => [card.id, at(card)]));
}

/**
 * Statements the learner sorts into bins before answering. The sort is
 * unscored exploration kept in the draft. When the explanation shows, cards
 * glide to where the paper places them and say whether that matches.
 */
export function SortScene({
  scene,
  draft,
  onDraft,
  answered,
}: {
  scene: Sort;
  draft: SceneDraft;
  onDraft: (draft: SceneDraft) => void;
  answered: boolean;
}) {
  const motion = useSceneMotion();
  const [announcement, setAnnouncement] = useState("");
  const sorted = draft.sorted ?? {};
  const layout = sortLayout(scene, sorted);
  const paper = new Map(scene.placements.map((p) => [p.cardId, p.binId]));
  const revealed = paper.size > 0;
  const binLabel = (id: string) =>
    scene.bins.find((bin) => bin.id === id)?.label ?? "";
  const place = (card: SceneItem, bin: string | null) => {
    const next = { ...sorted };
    if (bin) next[card.id] = bin;
    else delete next[card.id];
    onDraft({ ...draft, sorted: next });
    setAnnouncement(
      bin
        ? `Moved “${card.label}” to ${binLabel(bin)}.`
        : `Moved “${card.label}” back to the cards to sort.`,
    );
  };
  const cardView = (card: SceneItem, i: number) => {
    const current = layout.get(card.id) ?? null;
    const mine = sorted[card.id];
    const placed = paper.get(card.id);
    const verdict =
      revealed && placed && mine
        ? mine === placed
          ? "match"
          : "differs"
        : null;
    return (
      <m.li
        key={card.id}
        layoutId={`sort-${card.id}`}
        data-scene-layout
        className={`study-sort-card ${verdict ? `is-${verdict}` : ""}`}
        initial={motion.canEnter() ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...motion.copy, delay: motion.stagger(i) }}
      >
        <strong>{card.label}</strong>
        <span className="study-tap-detail">{card.detail}</span>
        {!answered ? (
          <span
            className="study-sort-actions"
            role="group"
            aria-label={`Sort “${card.label}”`}
          >
            {scene.bins.map((bin) => (
              <m.button
                key={bin.id}
                type="button"
                className={`study-sort-move ${current === bin.id ? "active" : ""}`}
                aria-pressed={current === bin.id}
                data-scene-motion-control
                style={{ borderRadius: 999 }}
                {...motion.gestures(false)}
                onClick={() => place(card, current === bin.id ? null : bin.id)}
              >
                {current === bin.id ? (
                  <CornerUpLeft size={13} aria-hidden="true" />
                ) : (
                  <MoveRight size={13} aria-hidden="true" />
                )}
                {bin.label}
              </m.button>
            ))}
          </span>
        ) : null}
        <AnimatePresence initial={false}>
          {verdict ? (
            <m.span
              key={verdict}
              className={`study-sort-verdict ${verdict}`}
              data-scene-settle
              initial={motion.still ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...motion.copy, delay: motion.stagger(i) }}
            >
              {verdict === "match" ? (
                <>
                  <Check size={13} aria-hidden="true" />
                  Matches your sort
                </>
              ) : (
                <>You sorted it into {binLabel(mine!)}</>
              )}
            </m.span>
          ) : null}
        </AnimatePresence>
      </m.li>
    );
  };
  const tray = scene.cards.filter((card) => !layout.get(card.id));
  return (
    <div
      className="study-sort"
      style={{ "--bins": scene.bins.length } as React.CSSProperties}
    >
      {tray.length || !answered ? (
        <section className="study-sort-tray" aria-label="Cards to sort">
          <h3>
            <Inbox size={14} aria-hidden="true" />
            {answered ? "Not sorted" : "To sort"}
            <span className="study-sort-count">{tray.length}</span>
          </h3>
          {tray.length ? (
            <ul>
              {tray.map((card) => cardView(card, scene.cards.indexOf(card)))}
            </ul>
          ) : (
            <p className="study-sort-done">
              <Check size={14} aria-hidden="true" />
              All sorted. Change any card, then answer below.
            </p>
          )}
        </section>
      ) : null}
      <div className="study-sort-bins">
        {scene.bins.map((bin) => {
          const cards = scene.cards.filter(
            (card) => layout.get(card.id) === bin.id,
          );
          return (
            <section
              key={bin.id}
              className={`study-sort-bin ${cards.length ? "filled" : ""}`}
              aria-label={bin.label}
            >
              <h3>
                {bin.label}
                <span className="study-sort-count">{cards.length}</span>
              </h3>
              <ul>
                {cards.map((card) => cardView(card, scene.cards.indexOf(card)))}
              </ul>
              {!cards.length ? (
                <p className="study-sort-empty" aria-hidden="true">
                  Empty
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
      {revealed ? (
        <p className="study-scene-note">
          Cards now sit where the paper places them.
        </p>
      ) : !answered ? (
        <p className="study-scene-note">
          Sorting is for thinking it through. It is not scored.
        </p>
      ) : null}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
