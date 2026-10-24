# Research Extension Configuration Matrix & Handoff Guide

## 1. Overview & Architecture Conformance
- **Storage Subsystem:** Preserves the existing `@libsql/client` remote adapter and first-use schema bootstrap (`records` table, `records_owner` index, and `limits` table).
- **Hosting Constraint:** Local SQLite `file:` paths are strictly rejected on Vercel; a remote libSQL / HTTPS endpoint is required.
- **Preview vs Production:** Dedicated, isolated database instances must be used for Preview and Production.

---

## 2. Configuration Matrix

| Variable Name | Purpose & Format | Environment | Owner | How Value is Obtained |
|---|---|---|---|---|
| `RESEARCH_ENABLED` | Feature flag gating the research extension routes. Set to `true` to enable. | Preview, Production, Local | JC (@Zeraphim) / Developer | Explicitly set to `"true"`. |
| `DATABASE_URL` | Remote libSQL / Turso connection URL (`libsql://<db-name>.turso.io` or `https://...`). *Must not start with `file:` on Vercel.* | Preview, Production | Jan (@jananonuevo) provisions; JC applies | Created in Turso dashboard. Separate instances for Preview (`gradly-preview`) and Production (`gradly-prod`). |
| `DATABASE_AUTH_TOKEN` | Bearer token authenticating against the remote libSQL instance. | Preview, Production | Jan provisions; JC applies | Generated via Turso dashboard / CLI (`turso db tokens create <db>`). |
| `SESSION_SECRET` | Secret key for HMAC-SHA256 signing of the guest session cookie (`gradly-research-guest`). Minimum 32 random characters. | Preview, Production, Local | JC generates & applies | Generated via `openssl rand -hex 32`. Keep independent between preview and production. |
| `CRON_SECRET` | Bearer token authorizing the daily retention cleanup cron (`/api/research/maintenance`). Minimum 32 random characters. | Preview, Production | JC generates & applies | Generated via `openssl rand -hex 32`. Configured in Vercel CRON authorization header. |
| `NEBIUS_API_KEY` | Server-only API key authorizing inference requests to Nebius Nemotron. *(Verified operational with `nvidia/Nemotron-3-Ultra-550b-a55b`)* | Preview (if live testing), Production | Jan supplies securely or JC applies | Obtained from Nebius Token Factory console. Verified locally with test completions. |
| `PREVIEW_MODE` | Boolean flag. `true` runs the research extension without external AI inference (reference answers & extracted text checks only). `false` invokes Nebius Nemotron. | Preview, Production, Local | JC applies | Set `true` initially for zero-cost preview verification; switch to `false` when enabling live generation. |
| `DEMO_MODE` | Explicit sample-flow opt-in. Refused on Vercel and in production by runtime guard. | Local only | Developer | Set `false` on Vercel preview/production; `true` only for local offline walkthroughs. |
| `NEBIUS_BASE_URL` | Regional API base URL for Nebius Token Factory. | Preview, Production, Local | Default / JC | Default: `https://api.tokenfactory.us-central1.nebius.com/v1`. Override only if region changes. |
| `NEBIUS_MODEL_ID` | Model identifier for Nemotron inference. | Preview, Production, Local | Default / JC | Default: `nvidia/Nemotron-3-Ultra-550b-a55b`. |
| `APP_ORIGIN` | Allowed origin for CSRF/origin checks (`sameOrigin()`). | *Not required / Omitted* | JC | The deployment is same-origin (frontend & API served from the same domain). Leave unset unless distinct origins are used. |

---

## 3. Local Development Workflows

### Mode A: Zero-Credential Local Sample Walkthrough
To test locally without any model credentials or remote database:
```ini
RESEARCH_ENABLED=true
PREVIEW_MODE=true
DEMO_MODE=true
DATABASE_URL=file:.data/gradly.db
```
- Real PDF extraction runs locally.
- Sample reference challenges load without making external AI calls.

### Mode B: Live Model Mode (Local or Preview)
To test live Nemotron model generation:
```ini
RESEARCH_ENABLED=true
PREVIEW_MODE=false
DEMO_MODE=false
NEBIUS_API_KEY=your-actual-nebius-key
DATABASE_URL=libsql://gradly-preview-xxxx.turso.io
DATABASE_AUTH_TOKEN=your-preview-auth-token
```
*Note:* Sample records created in demo mode are tagged `source=demo` and are never promoted to live lessons. To test live generation, upload and confirm the PDF while in live mode.

---

## 4. Secure Handoff Protocol to JC (@Zeraphim)

1. **Database Credentials Transfer:**
   - Send `DATABASE_URL` and `DATABASE_AUTH_TOKEN` to JC through a 1-to-1 secure private channel (e.g. 1Password, Bitwarden Send, or encrypted private chat).
   - **Never** post real values in GitHub issues, PRs, comments, or public channels.
2. **Secrets Generation by JC:**
   - JC generates independent `SESSION_SECRET` and `CRON_SECRET` using `openssl rand -hex 32`.
   - JC supplies the team's `NEBIUS_API_KEY`.
3. **Vercel Application:**
   - JC applies the variables in Vercel Project Settings for Preview environment.
   - Initial deployment smoke check: Start with `PREVIEW_MODE=true` to confirm database connectivity, guest cookie issuance, and PDF extraction before toggling `PREVIEW_MODE=false`.
