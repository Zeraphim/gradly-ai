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

| Suite                                                        | Coverage                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/*.test.ts` — 21 tests, including 3 nested regressions | Original six-quest interface, guarded service, transitions, duplicate attempts, completed-home review and stale PDF-check cancellation                                                                                                                                                                                                                                                                                                        |
| `tests/research/` — 147 tests                                | Eight-challenge engine, disclosures/revisions, PDF and real OCR, provider schemas/errors, sequential generation/review, cascade retention, transient database recovery, safe draft storage and request errors                                                                                                                                                                                                                                 |
| `tests/browser/research.spec.ts` — 12 scenarios              | Full reference adventure, retries, bonus/reveal/review/history, owner/version boundaries, consent, upload/extraction/OCR, interruption/deletion, support routes, responsive/keyboard/axe checks and original hero/PDF handoff                                                                                                                                                                                                                 |
| `tests/browser/final-polish.spec.ts` — 10 scenarios          | Draft/selection/revision recovery across help, exit and refresh; feedback focus; checked-PDF retention and usable original link; storage-denied settings; missing links; loading/error/retry history; late-request navigation protection; native confirmation focus/failure recovery; touch hover gating; availability failure/retry and configuration reuse                                                                                  |
| `tests/browser/reasoning-preview.spec.ts` — 11 scenarios     | Browser-only loop with all API routes blocked; home/learn entry; design facts before mobile choice; separate verdicts; custom-writing invalidation; alternatives and uncertainty; reveal timing; reset/refresh/corrupt and write-failed storage; all five phases at three viewport widths, keyboard focus and axe                                                                                                                             |
| `tests/browser/paper-lab.spec.ts` — 14 scenarios             | Single-mode front door with zero API requests; complete published/fictional trails; one-note Back/Next/resume; optional saved notes and confidence; immutable original claim/explanation; explicit checks and invalidation; step navigation; transfer invalidation; whole-paper recap and text export/fallback; per-case/reset/reload/corrupt/denied storage; responsive axe/keyboard/reduced-motion states and a default visible-word budget |

Provider and orchestration tests explicitly mock model outputs. PDF and OCR tests process real synthetic PDF files, including an image-only fixture. These categories must not be described as live model verification. Demo tests additionally exercise explicit local gating, production/Vercel rejection, immutable document modes, sample identity, no-provider-call guarantees, saved processing and disabled-demo rejection. Browser coverage includes a real nine-page PDF, page navigation, sample processing through completion/history, sample reasoning guidance and viewport/axe checks on the checked-document state.

The current paper experience has 42 focused notebook/state checks and 14 browser scenarios. Both content cases complete through the same interface. All five stages, the library and the open source reader pass automated accessibility and overflow checks at 1440, 768 and 390 CSS pixels. The tests abort every API route and separately assert that the front door makes zero API requests. Custom explanations are preserved but never classified. Conclusion and transfer checks are authored. Saving notes is optional; full study detail and writing are collapsed by default. Older drafts without the new claim-check field migrate without losing writing. A qualitative limitation and counterexample alone cannot produce a supporting-evidence verdict; the guide requires a relevant participant account.

The earlier browser reasoning showcase is tested with every `/api/**` request aborted. All five phases pass automated accessibility and overflow checks at 1440, 768 and 390 CSS pixels under reduced motion. Its 50 fixture/state unit checks verify exact authored matching, custom-text abstention, safe pre-reveal content and validated input-only restoration. No model result or teaching benefit is claimed.

The hero handoff assertion reads the PDF blob used by the preview, so an iframe pointing at a revoked object URL cannot satisfy the test. It complements file-name visibility and extraction checks.

Draft tests distinguish unsubmitted tab storage from submitted server progress. Drafts are restored only when the server version and challenge match, and only valid option IDs are applied. Deletion tests cover linked sessions newer than an expired document. A failed database initialization can be retried without restarting the application, and a successfully retried processing stage clears its previous error.

Format modified files with the installed Prettier (`npx prettier --check <paths>`). TypeScript is the static correctness gate; a separate semantic ESLint configuration is not currently installed.

The motion/button browser scenario checks that pressing an action preserves its layout height and neighboring positions while its visual press scale reaches 0.96, a deliberately delayed request exposes a disabled busy state and spinner, rendering produces no console errors, and both OS and saved application reduced-motion settings remove animation and hover movement.

## Runtime and visual evidence

TypeScript, 168 unit/service checks, all 47 browser scenarios, production builds and the dependency audit pass. The simplified flow rechecks both full case trails, optional notes, direct navigation, checked-answer invalidation and every responsive stage. Default main-content states stay below 300 visible words in browser checks. The dependency audit reports zero vulnerabilities. No runtime dependency was added. The compiled Express server was separately started with preview mode and local SQLite; health/static assets, searchable PDF extraction, scanned PDF OCR and document deletion passed. No external AI calls were needed.

Browser screenshots were inspected at 1440, 768 and 390 CSS pixels for the simplified library, reading/answer/feedback stages and compact recap, as well as the compatibility hero and research challenge. The PDF control remains above the paper-link field, mobile navigation has its own row, and tested layouts do not overflow horizontally. Playwright writes screenshots under ignored `test-results/`; traces are retained on failure. Exported review images are available alongside the local deliverable in `gradly-repo-preview/`.

Axe scans cover the new library and every paper stage/open reader, plus the compatibility hero, research entry/upload/support screens and a challenge. Keyboard actions and focus restoration are covered in the exercised paths. This is automated coverage for those states, not complete WCAG certification. Safari/Firefox, assistive-technology sessions and every possible uploaded-document layout remain outside the verified browser matrix.

## Hosted/live acceptance still required

Follow `RESEARCH_INTEGRATION.md`, then verify on the intended Vercel environment:

1. Confirm remote libSQL access, signed guest isolation and persistence across independent function invocations.
2. Upload a searchable paper and an English image scan; inspect transcription, page references, duration and packaged OCR files.
3. Confirm external-processing consent, exercise all generation stages with actual Nebius responses, inspect rejected evidence and recovery, then complete an approved lesson.
4. Exercise explanation feedback with real supported, alternative, incorrect and uncertain reasoning; confirm failures preserve the saved response.
5. Reload history, delete test documents and verify authenticated retention cleanup. Recheck the original curated adventure.

The current automatic Vercel preview reports **blocked**. An earlier check linked to a Vercel team invitation for the commit author; the authenticated local CLI account cannot access the project's scope. No successful preview or production deployment is claimed. Existing dated production-feedback evidence in README refers to the earlier curated service, not the new research integration.
