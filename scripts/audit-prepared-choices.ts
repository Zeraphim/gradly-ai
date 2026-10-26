/** Local content audit for PR #33. No model calls; no factual-accuracy verdict. */
import { rewrittenStudySlugs } from "../tests/fixtures/rewritten-studies.js";
import type { StudyBody } from "../apps/web/src/research/studies/types.js";

const rows = await Promise.all(
  rewrittenStudySlugs.map(async (slug) => {
    const { body } = (await import(
      `../apps/web/src/research/studies/data/${slug}.ts`
    )) as { body: StudyBody };
    const single = body.lesson.challenges.filter((c) => c.type === "single");
    const positions = [0, 1, 2, 3].map(
      (i) =>
        single.filter((c) => c.accepted.includes(c.options[i]?.id ?? ""))
          .length,
    );
    const lengthWins = (extreme: typeof Math.min) =>
      single.filter((c) => {
        const right = c.options.find((o) => c.accepted.includes(o.id))!;
        return (
          right.text.length === extreme(...c.options.map((o) => o.text.length))
        );
      }).length;
    return {
      slug,
      required: body.lesson.challenges.length,
      single: single.length,
      positions,
      shortest: lengthWins(Math.min),
      longest: lengthWins(Math.max),
    };
  }),
);
console.log(
  JSON.stringify(
    {
      scope:
        "26 PR #33 studies; required questions only; length ties counted as wins",
      totals: rows.reduce(
        (a, r) => ({
          studies: a.studies + 1,
          required: a.required + r.required,
          single: a.single + r.single,
          positions: a.positions.map((n, i) => n + r.positions[i]!),
          shortest: a.shortest + r.shortest,
          longest: a.longest + r.longest,
        }),
        {
          studies: 0,
          required: 0,
          single: 0,
          positions: [0, 0, 0, 0],
          shortest: 0,
          longest: 0,
        },
      ),
      rows,
    },
    null,
    2,
  ),
);
