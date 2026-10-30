# Gradly video

Remotion promotional film for Gradly. Kept in its own workspace so the web bundle,
root typecheck and Vercel build never load Remotion.

| Composition | Length | Output |
|---|---|---|
| `Gradly90` | 90 s (2700 frames, 30 fps, 1920×1080) | `out/gradly-90.mp4` |
| `GradlyWalkthrough` | 1:59 (3562 frames), the submission cut | `out/gradly-walkthrough.mp4` |

Run from the repository root:

```sh
npm run studio --workspace @paperquest/video      # live preview
npm run render:90 --workspace @paperquest/video
npm run render:full --workspace @paperquest/video
npm run typecheck --workspace @paperquest/video
```

`out/` is ignored by Git.

## App footage

Every product screen is a real screenshot of the running app, never generated.
`scripts/capture-app.mjs` drives the prepared texting-lecture study with Playwright
(1536×864 at 2× pixel density, reduced motion) against `npm run dev:preview` and
writes `public/captures/`. A screen listed in `src/components/Capture.tsx` with
`ready: false` renders a labelled "Capture pending" slate instead of fake UI.

Still pending for the walkthrough: `upload-review`, `preparing`, `warmup` and
`coach-feedback`. They need a real PDF upload prepared by the live model, so the
coach response shown is a genuine one.

## Asset provenance

- `public/plates/desk.png`: still frame from Mixkit stock clip 48285 (Mixkit
  Free License). The laptop screen is masked, not chroma-keyed.
- `public/music/` (not committed; licences do not clearly allow redistribution). Add the tracks locally before rendering.
  `bed-full.mp3`: "Royalty Free Music - Inspirational" by BlueTreeAudio
  (YouTube `-m_o3ON3108`, labelled free download), supplied by the project owner.
  Check its licence terms before public submission. `bed-90.mp3` is Mixkit stock music.
- `public/brand/`, `public/fonts/`: copied from `apps/web/public/brand/` and the
  self-hosted Plus Jakarta Sans.

## Honesty rules

Keep on-screen claims within what the app does: no live AI coach unless the capture
shows a real response, no claim of measured learning benefit, and keep the reveal
screen's "Not content-reviewed yet" notice visible.
