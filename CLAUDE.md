# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Global working preferences (version-bump rules, file delivery, transcript rule, server IPs) and the multi-store platform architecture live in the vault-root `CLAUDE.md` (`E:\Obsidian\Weidinger Projects\CLAUDE.md`), which Claude Code also loads when you work here. This file covers only what is specific to this app.

## App — Lease Retention Log (North Bay)

Lease retention log for North Bay Cadillac GMC. Page title: *Lease Retention | North Bay*.

**Stack**
- Frontend: **React 19 + Vite** (SPA, no router); Entra sign-in via **`@azure/msal-browser`** (`src/auth.js`).
- API: **Python** Azure Functions v2, anonymous auth level (`api/function_app.py`, `api/requirements.txt`).
- Hosting: **Azure SWA** (`weidinger-retention`, free tier) + Entra ID (`staticwebapp.config.json`).
- DB: Azure PostgreSQL Flexible Server, `retention` database — schema in `setup_db.sql`.

**Commands** (in this folder)
```
npm install
npm run dev       # vite dev server
npm run build     # -> dist/
npm run preview
npm run lint       # eslint .
```
API: `cd api && func start`.

## Architecture: the `app.jsx` build quirk

**The entire app lives in `app.jsx` at the repo root — that is the file to edit, not `src/App.jsx`.**
`src/App.jsx` doesn't exist in git; CI copies `app.jsx` → `src/App.jsx` on every deploy (`.github/workflows/deploy.yml`, "Copy app to src" step) before the Vite build. `src/main.jsx` imports from `./App.jsx`, which only exists post-copy. If you need to run `npm run dev` locally, copy the file yourself first (`cp app.jsx src/App.jsx`).

Deploys are push-to-`main`-triggered (no PR gate) via `Azure/static-web-apps-deploy`.

## Auth flow

- **Frontend session**: MSAL PublicClientApplication against tenant `a7909e90-bb02-46e4-8538-57cd8a2d66f9`. `initAuth()` in `src/auth.js` tries silent SSO first, falls back to `loginRedirect`. Supports a `?login_hint=<email>` query param for seamless entry from the parent portal (skips the account picker).
- **API auth is custom, not SWA's built-in auth**: every request goes through `apiFetch()` (`src/auth.js`), which attaches the MSAL access token as an `X-Access-Token` header. `function_app.py`'s `validate_token()` just base64-decodes the JWT payload (no signature check) and confirms the `tid` claim matches the tenant — this is tenant-gating, not full token verification. All API routes are Azure Functions `AuthLevel.ANONYMOUS` and rely entirely on this header check.

## Data model

```sql
lease_entries (id SERIAL PK, name, outcome CHAR(1) CHECK A/B/C, disposition, broker,
               our_customer BOOLEAN DEFAULT TRUE, year INT, month VARCHAR(3),
               is_historical BOOLEAN DEFAULT FALSE, created_at, updated_at)
locked_months  (year INT, month VARCHAR(3), is_unlocked BOOLEAN, PRIMARY KEY(year, month))
```

- `is_historical` rows (9,109 seeded from `EXCEL_DATA`, 2012–present) are read-only — API rejects PUT/DELETE on them.
- Month locking: months auto-lock 60 days after month end; explicit unlocks persist in `locked_months`, not client state.
- No `localStorage`, no client-side `EXCEL_DATA` — all data comes from `/api/entries`.

## API endpoints (`/api/`)
- `GET  entries?year=&month=` — list entries for year (optional month filter)
- `POST entries` — create entry
- `PUT  entries/{id}` — update (non-historical only)
- `DELETE entries/{id}` — delete (non-historical only)
- `GET  locked` — list unlocked months
- `POST locked` — set unlock status

## Migration/seed scripts (`scripts/`)
One-off historical-data tooling, not part of the app runtime: `migrate_excel.py`, `migrate_localstorage.py`, `fix_timestamps.py`, `fix_july_2023_timestamps.sql`.
