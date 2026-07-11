"""
One-time migration: import localStorage entries from old retention app into PostgreSQL.

Usage:
    python scripts/migrate_localstorage.py <path_to_retention_export.json>

The JSON file is exported from the old app's browser console:
    const d = localStorage.getItem('nb_lease_entries_v1');
    const b = new Blob([d||'[]'],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(b);
    a.download='retention_export.json'; a.click();
"""

import json
import sys
import os
import psycopg2

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise SystemExit("Set DATABASE_URL before running (see cred-rotation runbook).")

VALID_OUTCOMES = {"A", "B", "C"}
VALID_MONTHS = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"}


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/migrate_localstorage.py <retention_export.json>")
        sys.exit(1)

    path = sys.argv[1]
    with open(path, encoding="utf-8") as f:
        raw = f.read().strip()

    entries = json.loads(raw) if raw else []
    print(f"Loaded {len(entries)} entries from {path}")

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    inserted = skipped = dupes = 0

    for e in entries:
        name = (e.get("name") or "").strip()
        outcome = (e.get("outcome") or "").upper()
        month = e.get("month") or ""
        year = e.get("year")

        if not name or outcome not in VALID_OUTCOMES or month not in VALID_MONTHS or not year:
            skipped += 1
            continue

        # Skip if an identical non-historical row already exists (idempotent re-run)
        cur.execute(
            "SELECT 1 FROM lease_entries WHERE name=%s AND outcome=%s AND year=%s AND month=%s AND is_historical=FALSE",
            (name, outcome, int(year), month),
        )
        if cur.fetchone():
            dupes += 1
            continue

        cur.execute(
            """INSERT INTO lease_entries
                   (name, outcome, disposition, broker, our_customer, year, month, is_historical, created_at)
               VALUES (%s, %s, %s, %s, TRUE, %s, %s, FALSE, %s)""",
            (
                name,
                outcome,
                (e.get("disposition") or "").strip(),
                (e.get("broker") or "").strip(),
                int(year),
                month,
                e.get("timestamp"),
            ),
        )
        inserted += 1

    conn.commit()
    cur.close()
    conn.close()

    print(f"Done — inserted: {inserted}  dupes skipped: {dupes}  invalid skipped: {skipped}")


if __name__ == "__main__":
    main()
