# Gradly

Gradly turns a paper into an interactive evidence trail. The current prototype has one public experience: **Wonder → Explore → Connect → Try it → Keep it**. Start with a question, uncover and pin source evidence, calibrate a claim, try the distinction in a new setting, and export a connected paper recap.

Open `/` or `/#/research/lab`. Two content cases use the same interface: a curated exploration of Gingerich & Lineweaver’s texting experiment, and a clearly fictional qualitative garden study. Research judgment extends beyond statistical test selection.

The frontend makes no API request. Guide feedback checks selected claims and evidence cards; custom writing is not assessed. Confidence is a self-report, and completion is not a mastery score. Original claims stay fixed after evidence is opened. Notes remain in tab storage with a memory fallback and can be exported locally.

See [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) for the single-mode scope and demonstration, [INTERACTION_REFERENCES.md](INTERACTION_REFERENCES.md) for the inspected educational interfaces, and [RESEARCH_LEARNING_DESIGN.md](RESEARCH_LEARNING_DESIGN.md) for the source-linked rationale and learning limits. These are design hypotheses, not evidence of an established learning benefit.

## Compatibility workspaces

The earlier six-quest curated adventure remains at `/#/classic`, the eight-challenge/upload workspace at `/#/research/learn`, and the authored explanation showcase at `/#/research/reasoning`. Existing saved links keep working when their API is available. They are not promoted as separate modes in the current front door. The [earlier curated production demo](https://nebius-hackathon-submission.vercel.app) predates this paper-exploration prototype.

The research API retains PDF extraction/OCR, guest history and reviewed generation. Its prompts now adapt to a paper’s research approach without requiring statistical tests for qualitative or conceptual material. This orchestration is tested with synthetic fixtures; new live generation remains unverified. See [RESEARCH_INTEGRATION.md](RESEARCH_INTEGRATION.md) for configuration and [REASONING_PREVIEW.md](REASONING_PREVIEW.md) for future live-review guardrails.

Design, module boundaries, acceptance and verification are in [DESIGN.md](DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [REQUIREMENTS.md](REQUIREMENTS.md) and [TESTING.md](TESTING.md).

## Run

Requires Node.js **22.18 or newer within version 22** and npm.

For the refined frontend prototype:

```sh
npm ci
npm run dev:prototype
```

Open **http://127.0.0.1:5173**. No environment file, database or AI credential is needed for the paper experience.

To run the compatibility API and upload workspaces too:

```sh
cp .env.example .env
npm run dev
```

The example configuration enables local preview. `DEMO_MODE=true` also enables a separate sample study after real PDF extraction; that sample path is refused in production/Vercel. It never invents findings from an upload or silently replaces failed live inference.

For live reasoning assessment, set these values in the ignored root `.env`:

```dotenv
NEBIUS_API_KEY=your_server_only_credential
PREVIEW_MODE=false
```

Restart the server. The live route uses `nvidia/Nemotron-3-Ultra-550b-a55b` at Nebius Token Factory’s [documented regional endpoint](https://github.com/nebius/token-factory-cookbook/blob/main/models/nemotron/nemotron3-ultra-550b-a55b.md). An absent credential with preview disabled produces an explicit unavailable state. Provider failure never silently switches to preview.

## Workspaces

```text
apps/web                React learner interface, Vite, responsive styles and motion
apps/api                Express server, trusted content and bounded model adapter
packages/contracts      Shared request, response and lesson types
packages/lesson-state   Attempts, reveal timing, progression and unique rewards
scripts                 Development orchestration and opt-in live verification
tests                   Service, state and simulated learner interaction checks
```

In the compatibility curated workspace, the browser requests the public lesson from `GET /api/lesson` and submits only its version, question identifier, attempt identifier, choice, and explanation to `POST /api/feedback`. `GET /api/health` reports server health and feedback configuration. Initial lesson payloads omit answer criteria and authored solutions. The server supplies trusted evidence and criteria to the model, validates its single-field assessment, and selects authored teaching text. Model-generated teaching copy or citations never pass directly to learners.

The original six quests cover separate groups, method assumptions, percentage points, missing evidence, and two original transfer scenarios. Five correct quests award 10 points each, once. The missing-evidence checkpoint reveals an evidence boundary after an attempt and awards no points. Revisions stay in the same quest. New scenarios have separate answers.

## Production and verification

```sh
npm run check
npm run build
npm start
```

The production server serves the built interface and routes together at **http://127.0.0.1:3001**. Set `HOST=0.0.0.0` and the host-provided `PORT` when deploying. Keep `.env` and credentials out of the browser and source control. Vercel hosting uses the root `server.ts` adapter and `vercel.json`. The existing local server remains available with `npm start`.

An opt-in live check makes up to seven billed model requests plus one curated missing-evidence response, with no automatic retries:

```sh
npm run test:live
```

Verified October 14, 2026: type checking, production builds, and 15 automated checks passed. The simulated learner flow covers initial answer hiding, a failed request and retry, wrong-answer revision, saved-progress resumption, six completed quests, independent transfer answers, and dialog cancellation. All eight live cases produced the expected outcomes. Seven model-request durations ranged from 0.595 to 1.900 seconds in that run. This small check does not establish statistical teaching quality or a learning benefit.

The current source passes 164 unit/service checks and 47 Chromium browser scenarios, including desktop/tablet/mobile layouts, keyboard use, automated accessibility checks, both reduced-motion controls, full reference/sample completion, and draft recovery. See [TESTING.md](TESTING.md) for coverage and remaining browser/live limits. Unsubmitted research answers stay in this tab; submitted decisions use the guest profile. Upload review includes an original-PDF link when the embedded preview is unavailable.

## Scope and data

The teaching content is a draft awaiting expert review. Research facts are attributed to [Gingerich & Lineweaver (2014)](https://doi.org/10.1177/0098628313514177), with [author metadata](https://butler.elsevierpure.com/en/publications/omg-texting-in-class-u-fail-empirical-evidence-that-text-messagin-2/). Evidence is curated and paraphrased, not extracted automatically. Fictional transfer examples are labeled. The original copyrighted paper is not redistributed. Publisher access may be required.

The original curated path accepts the sample card or the paper’s digital object identifier `10.1177/0098628313514177`, and checks the supplied PDF version’s fingerprint in the browser. The research extension accepts general PDFs, parses them on the application server, and retains extracted text for up to 30 days; original PDF bytes are not retained there. Reviewed lesson generation uses external AI only after confirmation, while local sample preview uses a separate labeled study. Accounts, leaderboards and shops remain outside the application.

In the original six-quest path, answers and progress use versioned browser-local storage. Uploaded files are not stored. Downloadable notes include your explanations. Live mode sends explanations to Nebius for assessment. The application keeps a bounded, in-memory request cache for 15 minutes and does not persist learner answers on the server. Local progress is for a pilot, not tamper-resistant assessment.

Repeated identical attempts share a request and cached result within one server process. Edited text must use a new attempt identifier. Failures preserve the answer, award no progress, and remain retryable where appropriate. Limits are 2,000 explanation characters, two concurrent model calls, 20 feedback submissions per client per 15 minutes, and 120 model calls per process per hour. Cache, concurrency, and budget limits reset on restart and are not shared across replicas. Vercel can run multiple function instances. These in-memory limits and duplicate-request protection apply separately to each instance, not across the whole deployment.

Motion includes button compression, quest entrances, evidence reveals, progress updates, a dialog transition, and a once-only completion celebration. Movement uses transforms and opacity. Reduced-motion preferences disable motion. Typography is self-hosted Plus Jakarta Sans.

Application code is licensed under MIT. Third-party fonts, packages, and the referenced paper retain their own licenses.

## Deploy to Vercel

Deploy this repository root as one Express project. `npm run build:vercel` builds the learner interface and copies its assets into a generated, ignored `public/` directory for Vercel static hosting. The shared contracts package is compiled to JavaScript before bundling so the hosted function imports a runtime file instead of TypeScript source. The exported server adapter supplies the existing lesson and feedback routes without opening a local port. The function now has a 240-second execution limit for bounded document/OCR work; the original model request retains its 45-second timeout.

Configure `NEBIUS_API_KEY` as a sensitive production environment variable and `PREVIEW_MODE=false` for live reasoning feedback. Credentials stay on the server. Preview deployments can explicitly use `PREVIEW_MODE=true` without a model credential. The adapter trusts Vercel's immediate proxy so per-client request limits use the forwarded client address.

```sh
npx vercel link --yes --project nebius-hackathon-submission --scope <your-workspace>
npm run build:vercel
npx vercel deploy --prod
```

Build before uploading with the command above so Vercel receives the generated static assets. The local `.vercel/` link, pulled environment files, and generated assets are ignored by source control.

Production hosting verified October 14, 2026: the public page, lesson, and real reasoning feedback are accessible without sign-in. Seven hosted feedback cases covered all six quests and incorrect reasoning, followed by a separate anonymous production check. The hosting changes passed 16 automated checks. Automatic deployments from GitHub remain unconfigured because Vercel could not connect to this repository; allow repository access in the project’s Git integration settings to enable them.
