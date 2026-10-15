# Research extension integration

The deployed repository remains the primary architecture: React/Vite, Express, npm workspaces, shared contracts, self-hosted Plus Jakarta Sans, the supplied Gradly logo and multi-pose mascot, and the Vercel Express adapter. The separate Next.js prototype was adapted into these modules; no second framework or Next.js runtime is introduced.

## Preserved behavior

The home hero retains its headline, mascot/speech composition, paper illustration, Choose PDF button, and the DOI/link field below it. The current six-quest curated adventure, reasoning assessment, fictional transfer scenarios, local progress and downloadable notes remain available. Existing reasoning assessment still uses a bounded single-field verdict and authored teaching text; the research extension never changes its answer criteria.

The whole interface uses Gradly’s blue palette: deep blue primary actions with white text, sky-blue selections/progress and light blue information surfaces. Neutral colors and heading sizing are tuned for 1440, 768 and 390px. The research module is loaded only when opened, with scoped styles that cannot replace the home hero or the curated workspace styles.

## Added capabilities

- Eight-challenge reference investigation with single/multiple responses, hints, one retry, first-attempt accuracy, optional bonus, staged statistical findings and paper identity, completion/review, and independent explanation revisions.
- PDF validation by size/MIME/contents, local browser preview, explicit extraction request, upload progress/cancellation, per-page text inspection, bounded English OCR and recovery.
- Persistent sessions/jobs in SQLite locally or remote libSQL on Vercel, signed guest ownership, optimistic version checks, document deletion and a protected retention-cleanup endpoint.
- Five observable stages: evidence analysis, lesson architecture, statistical review, coach review and deterministic verification. Actual requests drive statuses; lessons that fail review cannot be opened.
- Configurable Nebius model/endpoint shared with the existing service. The default remains the repository’s regional endpoint and Nemotron Ultra identifier. `PREVIEW_MODE=true` disables external AI calls for the research extension; reference answer checking still works.

The reference adventure checks option selections against its authored answer guide. Optional live review of written explanations cannot change that score. The original curated adventure assesses both the choice and reasoning; its six-quest teaching behavior is preserved.

## API and routing

`/api/research/config`, `/learning`, `/documents`, `/jobs`, `/feedback`, and `/maintenance` live under a separate Express router. The existing `/api/health`, `/api/lesson` and `/api/feedback` contracts are unchanged. Research navigation uses `#/research/…` so existing Express/Vercel static hosting remains compatible. No server rewrite or second server is required.

When the extension is enabled, the existing hero’s PDF control hands a selected document into its review screen. The original DOI field still opens the supported curated paper; arbitrary link retrieval is not added because unsupported URLs should not silently trigger downloads or expose server networking. When the extension is disabled on a host, its existing local fingerprint check and curated entry remain usable.

## Local use

```sh
npm ci
cp .env.example .env
npm run dev
```

The extension works with local SQLite and reference guidance without a model credential. Select a PDF in the original hero or open Research Lab. The paper is not sent to Nebius until you confirm after extraction/review. Original PDF bytes are not stored on the server.

## Vercel configuration

The existing curated production demo needs only its existing `NEBIUS_API_KEY` and `PREVIEW_MODE` settings. To enable the extension, set:

| Variable                             | Requirement                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| `RESEARCH_ENABLED`                   | `true`                                                                           |
| `DATABASE_URL`                       | Remote `libsql://…` or HTTPS libSQL endpoint; local files are rejected on Vercel |
| `DATABASE_AUTH_TOKEN`                | Remote database token                                                            |
| `SESSION_SECRET`                     | At least 32 random characters for signed guest cookies                           |
| `CRON_SECRET`                        | Separate random secret to authorize retention cleanup                            |
| `NEBIUS_API_KEY`                     | Server-only key for live generation/feedback                                     |
| `PREVIEW_MODE`                       | `false` for live calls; `true` for explicitly offline reference use              |
| `NEBIUS_BASE_URL`, `NEBIUS_MODEL_ID` | Optional overrides; defaults preserve the deployed repository’s configuration    |

### Setup sequence

1. Create a remote libSQL database (for example, in Turso), then obtain its database URL and an authentication token. Keep the token in server settings only; local SQLite is for local use.
2. In the existing Vercel project's **Settings → Environment Variables**, add the required variables above for the intended environment. Generate independent cookie and cron secrets with `openssl rand -hex 32`. Never commit the resulting values or use a `VITE_` prefix for secrets.
3. Start with `PREVIEW_MODE=true` to check reference learning, remote history, PDF extraction, and deletion without inference. The database schema is created on the first research storage request; no manual migration command is required.
4. Add a Nebius server credential with access to the configured model, then set `PREVIEW_MODE=false` to enable new-paper generation and explanation feedback. Restart locally or create a new Vercel deployment to load changed environment values.
5. Before enabling the extension for learners, smoke-test a searchable PDF and an image scan on the actual hosted function, complete generation, reload the saved adventure, and delete the test document. Confirm the original curated adventure still works. Local checks cannot verify hosted database access, OCR packaging, model access or generation quality.
6. Configure the optional retention cron below when `CRON_SECRET` is set. Leave the extension disabled if these dependencies are unavailable; the curated adventure remains usable.

The Express function duration is 240 seconds to accommodate bounded OCR (75-second deadline), while existing curated model requests remain bounded at 45 seconds and research model requests at 20 seconds per attempt. The function configuration explicitly includes OCR worker, WASM and language files using [Vercel’s `includeFiles` setting](https://vercel.com/docs/project-configuration/vercel-json#functions). These are source/package settings; the new extension has not been deployed or tested with hosted storage.

Records become inaccessible after 30 days. History reads remove expired records, and the maintenance endpoint atomically removes expired papers, their linked sessions and stale rate counters. For unattended production cleanup, add this cron after enabling the extension and setting `CRON_SECRET`:

```json
{ "crons": [{ "path": "/api/research/maintenance", "schedule": "0 3 * * *" }] }
```

Vercel sends the configured cron secret in the Authorization header. The endpoint rejects unauthenticated requests and returns aggregate removal counts only. See [Vercel cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

## Verification and limits

```sh
npm run check
npm run test:e2e
npm run build:vercel
```

Locally verified on Node 22: 18 original/integration tests, 25 research tests and all 9 browser scenarios passed. `npm run check`, `npm run build:vercel`, and `npm audit --audit-level=moderate` passed with zero reported vulnerabilities. The compiled Express server also passed real searchable/scanned PDF extraction and deletion smoke checks.

The check command includes the repository’s original tests, the ported research tests, type checking and production builds. Browser tests cover the full reference adventure, retries/bonus, persisted revisions, ownership/conflicts, consent, real PDF/OCR upload and recovery, deletion, responsive layouts and accessibility. The research routes share a persistent limit of 120 logical AI requests per hour, in addition to per-guest limits. Provider retries can make additional inference calls, so this is not an exact billing cap. Model tests are explicitly mocked; they do not establish live generation quality.

English OCR is limited to six low-text image pages, with page/pixel limits and a 75 confidence threshold for nonempty text. Confidence is an estimate, not proof of numerical correctness. Students should compare transcriptions with the original. Arbitrary visual-chart interpretation and other OCR languages are outside the implemented path.

Remote libSQL persistence and new live generated lessons/feedback remain unverified until configuration and actual smoke tests are available. The currently deployed health endpoint was observed returning `feedback: nebius`; no billed model calls or production modifications were made during integration. After PR creation, GitHub triggered an automatic preview attempt, which Vercel reported as blocked. The current CLI account cannot access that project’s scope to inspect its cause. No production deployment was performed. The README’s dated Git integration note describes the earlier state; resolve the current preview restriction before relying on hosted verification.
