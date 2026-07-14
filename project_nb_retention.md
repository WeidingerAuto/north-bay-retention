---
name: project-nb-retention
description: North Bay Lease Retention app — React/Vite SPA migrated to Azure SWA + Entra ID + PostgreSQL (v2.0)
metadata: 
  node_type: memory
  type: project
  originSessionId: 15ff3ca0-3761-489c-baf4-6e945235412b
---

# North Bay Lease Retention

**Repo:** WeidingerAuto/north-bay-retention (branch `main`)  
**Azure SWA:** `weidinger-retention` in RG `weidinger-inventory`  
**URL (SWA default):** `zealous-rock-04ad81b0f.7.azurestaticapps.net`  
**Version:** v2.0 (deployed 2026-06-24)

## Stack
- Frontend: React 19 + Vite (SPA, no router) — `app.jsx` at repo root, copied to `src/App.jsx` during CI
- Hosting: Azure Static Web Apps (FREE tier), ubuntu-latest runner
- Auth: Microsoft Entra ID via SWA built-in auth (`staticwebapp.config.json`)
- API: Azure Functions v2 Python (`api/function_app.py`) — CRUD for entries + locked months
- DB: Azure PostgreSQL Flexible Server, `retention` database, user `invadmin`
  - Same server as nbc-inventory: `weidinger-inventory-db.postgres.database.azure.com`
  - Password: `Nbc-Inv-2026-Sync-K9m`

## Entra ID
- Tenant: `a7909e90-bb02-46e4-8538-57cd8a2d66f9`
- Client ID (app reg): `b56e75a9-9b5b-4154-9646-3514d1f6d0f8`
- Client Secret (GitHub secret + SWA app setting): `AZURE_CLIENT_SECRET`
- SWA deploy token: GitHub secret `AZURE_STATIC_WEB_APPS_API_TOKEN`

## DB Schema
```sql
lease_entries (id SERIAL PK, name, outcome CHAR(1) CHECK A/B/C, disposition, broker,
               our_customer BOOLEAN DEFAULT TRUE, year INT, month VARCHAR(3),
               is_historical BOOLEAN DEFAULT FALSE, created_at, updated_at)
locked_months  (year INT, month VARCHAR(3), is_unlocked BOOLEAN, PRIMARY KEY(year,month))
```

## API endpoints (`/api/`)
- `GET  entries?year=&month=` — list entries for year (optional month filter)
- `POST entries` — create entry
- `PUT  entries/{id}` — update (non-historical only)
- `DELETE entries/{id}` — delete (non-historical only)
- `GET  locked` — list unlocked months
- `POST locked` — set unlock status

## Key features
- `our_customer` checkbox on entry form (default checked)
- TotalsCard shows "All Customers" row + "Our Customers" row
- ReportTotalsTable shows "All" row + "Ours" row
- Historical entries (9,109 rows from EXCEL_DATA 2012–present) seeded, read-only
- Month locking: auto-locks 60 days after month end; persisted unlock in DB

## How to apply
When working on this project, remember: no localStorage, no EXCEL_DATA in app.jsx.
All data comes from `/api/entries`. The NB_LOGO is a large base64 data URI inline in app.jsx.
