# Testing

Use Node 22. Run from the repository root:

```sh
npm ci
npm run check
npm run test:e2e
npm run build:vercel
npm audit --audit-level=moderate
```

`check` runs TypeScript, the original Node tests, Vitest research tests and production builds. Playwright starts both existing development services and waits for API health. It uses local SQLite, preview mode and an empty model key, so browser verification does not incur inference requests. The API uses a non-watching test entry point so development file watchers cannot interrupt a request during the suite. Chromium is required; install it with `npx playwright install chromium` if unavailable.

## Automated coverage

| Suite                                           | Coverage                                                                                                                                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts` — 18 tests                    | Original six-quest interface, guarded service, transitions, duplicate attempts, model override and hosted research isolation                                                                                                  |
| `tests/research/` — 28 tests                    | Eight-challenge engine, disclosures/revisions, PDF and real OCR, bounded worker behavior, provider schemas/errors, sequential generation/review, ownership-aware retention                                                    |
| `tests/browser/research.spec.ts` — 12 scenarios | Full reference adventure, retries, bonus/reveal/review/history, owner/version boundaries, consent, upload/extraction/OCR, interruption/deletion, support routes, responsive/keyboard/axe checks and original hero/PDF handoff |

Provider and orchestration tests explicitly mock model outputs. PDF and OCR tests process real synthetic PDF files, including an image-only fixture. These categories must not be described as live model verification. Demo tests additionally exercise explicit local gating, production/Vercel rejection, immutable document modes, sample identity, no-provider-call guarantees, saved processing and disabled-demo rejection. Browser coverage includes a real nine-page PDF, page navigation, sample processing through completion/history, sample reasoning guidance and viewport/axe checks on the checked-document state.

The hero handoff assertion reads the PDF blob used by the preview, so an iframe pointing at a revoked object URL cannot satisfy the test. It complements file-name visibility and extraction checks.

Format modified files with the installed Prettier (`npx prettier --check <paths>`). TypeScript is the static correctness gate; a separate semantic ESLint configuration is not currently installed.

The motion/button browser scenario checks that pressing an action preserves its height and neighboring layout, a deliberately delayed request exposes a disabled busy state and spinner, rendering produces no console errors, and both OS and saved application reduced-motion settings remove animation and hover movement.

## Runtime and visual evidence

Local source checks, all suites above, production builds and the dependency audit passed during integration. The compiled Express server was separately started with preview mode and local SQLite; health/static assets, searchable PDF extraction, scanned PDF OCR and document deletion passed. No external AI calls were needed.

Browser screenshots were inspected at 1440, 768 and 390 CSS pixels for the original hero and research challenge. The PDF control remains above the paper-link field, mobile navigation has its own row, and tested layouts do not overflow horizontally. Playwright writes screenshots under ignored `test-results/`; traces are retained on failure. Exported review images are available alongside the local deliverable in `gradly-repo-preview/`.

Axe scans cover the hero, research entry/upload/support screens and a challenge, plus tested keyboard interactions. This is automated coverage for those states, not complete WCAG certification. Safari/Firefox, assistive-technology sessions and every possible uploaded-document layout remain outside the verified browser matrix.

## Hosted/live acceptance still required

Follow `RESEARCH_INTEGRATION.md`, then verify on the intended Vercel environment:

1. Confirm remote libSQL access, signed guest isolation and persistence across independent function invocations.
2. Upload a searchable paper and an English image scan; inspect transcription, page references, duration and packaged OCR files.
3. Confirm external-processing consent, exercise all generation stages with actual Nebius responses, inspect rejected evidence and recovery, then complete an approved lesson.
4. Exercise explanation feedback with real supported, alternative, incorrect and uncertain reasoning; confirm failures preserve the saved response.
5. Reload history, delete test documents and verify authenticated retention cleanup. Recheck the original curated adventure.

The current automatic Vercel preview reports **blocked**. GitHub exposes that status but not a cause; the authenticated local CLI account cannot access the project's scope. No successful preview or production deployment is claimed. Existing dated production-feedback evidence in README refers to the earlier curated service, not the new research integration.
