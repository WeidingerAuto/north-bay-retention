# Transcript v1.14 — Recovering and Versioning the Correct App File for GitHub Deployment

**Date:** June 19, 2026  
**Version:** v1.14  

---

## Issues Addressed

### 1. Missing v1.14 File
- The project folder had a file named `app_v1_14.jsx` but it was not the correct updated file
- The true latest version was `App_v1.13.jsx` stored in the Claude Project files panel
- John uploaded `App_v1.13.jsx` directly so it could be presented as a clean downloadable file

### 2. Version Bump to v1.14
- To avoid future confusion, the version string was updated from `v1.13` to `v1.14`
- `APP_VERSION` constant on line 186 was changed from `"v1.13"` to `"v1.14"`
- File saved as `App_v1_14.jsx`

### 3. Edit Button Not Showing for June 2026 Entries
- John noticed no 📝 edit button appeared for current month entries
- Root cause: June 2026 entries were hardcoded into the historical data (`EXCEL_DATA`)
- The app treats all historical entries as `hist-` IDs and restricts editing
- Edit and delete buttons only appear on live entries added through the app UI
- Decision: Leave as-is; going forward all new entries will be editable

---

## GitHub Actions Status
- All 18 workflow runs confirmed green ✅
- Latest deployed version on GitHub: v1.13 "Hepl added" (Jun 12)
- Next deploy will be v1.14 once John uploads the file

---

## Workflow Clarification
- **Claude Project** = where app is built and versions are stored
- **GitHub repo** (`north-bay-retention`) = source of truth for deployment
- **GitHub Actions** = automatically builds and deploys to IIS on nb-serve1
- Manual step: download file from Claude → rename to `app.jsx` → upload to GitHub

---

## Files Delivered
- `App_v1_14.jsx` — ready to upload to GitHub as `app.jsx`
