# Transcript v2.1 — Date-Edit Field and June 2026 Timestamp Correction

**Date:** July 14, 2026
**Version:** v2.1 (package.json 1.14.0)

---

## Issues Addressed

### 1. CLAUDE.md Documentation
- Ran `/init` to generate a project-specific `CLAUDE.md`
- Documented the key architectural quirk: `app.jsx` at repo root is the real source file; CI copies it to `src/App.jsx` on every deploy (`.github/workflows/deploy.yml`), so `src/App.jsx` isn't tracked in git and local `npm run dev` needs a manual copy first
- Documented the custom API auth scheme: MSAL access token sent as `X-Access-Token`, validated server-side by decoding the JWT payload and checking the `tid` claim only (no signature verification) — this is tenant-gating, not full token verification
- Documented data model notes: `is_historical` rows are read-only, month locking persists in `locked_months` (not client state)
- Committed and pushed (`e3240fd`), then added `project_nb_retention.md` and the prior recovery transcript that were sitting untracked (`b50cab9`)

### 2. Eric Szcurowski — Wrong Entry Date
- Entry was logged for June retention on 7/13/26 but displayed with a created_at of 7/13/26 instead of 6/30/26
- Found via direct DB query: `lease_entries` id `9698`, year 2026, month `Jun`, `created_at = 2026-07-13 15:13:06 UTC`
- Confirmed with John before writing to production DB
- Ran `UPDATE lease_entries SET created_at = '2026-06-30 00:00:00' WHERE id = 9698`, matching the precedent pattern in `scripts/fix_timestamps.py` (same fix applied to earlier June 2026 mis-dated entries)
- John confirmed the change is correct

### 3. Edit Button Couldn't Change the Date
- Root cause of the above needing a manual DB fix: the edit form (`startEdit`/`saveEdit` in `app.jsx`) had no field for `created_at` — name, outcome, disposition, broker, and our-customer were editable, but not the date
- Added `date` to `editForm` state, populated from `entry.timestamp||entry.created_at` via a new `toInputDate()` helper (formats to `YYYY-MM-DD` for an `<input type="date">`)
- Replaced the static date cell in the edit row with the date input
- `saveEdit()` now sends `created_at` in the PUT body
- `api/function_app.py`'s `entry_detail` PUT handler now accepts an optional `created_at` and applies it with `COALESCE(%s, created_at)` so omitting it leaves the existing value untouched
- Verified with `npm run build` (clean) and `python -m py_compile api/function_app.py` (clean)

### 4. Version Bump
- `APP_VERSION` in `app.jsx`: `v2.0` → `v2.1`
- `package.json` version: `1.13.0` → `1.14.0`

---

## Commits
- `e3240fd` — docs: add CLAUDE.md with app.jsx build quirk and auth flow details
- `b50cab9` — docs: add project notes and v1.14 recovery transcript
- `72d0ef7` — feat: allow editing entry date, bump version to v2.1

All pushed to `main`; each push triggers the Azure SWA deploy workflow (no PR gate, no path filter).

---

## Files Delivered
- `CLAUDE.md` (this repo)
- `app.jsx` (date-edit field, version bump)
- `api/function_app.py` (created_at accepted on PUT)
- `package.json` (version bump)
