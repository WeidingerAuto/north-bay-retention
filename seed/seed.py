"""
North Bay Retention – DB seed script
Run once to:
  1. Create tables (lease_entries, locked_months)
  2. Import historical EXCEL_DATA from ../app.jsx

Usage:
  pip install psycopg2-binary
  python seed.py
"""
import json
import os
import re
import sys
import psycopg2
import psycopg2.extras

DB_URL = os.environ.get("DATABASE_URL")
if not DB_URL:
    raise SystemExit("Set DATABASE_URL env var before running seed.py")

CREATE_SCHEMA = """
CREATE TABLE IF NOT EXISTS lease_entries (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(200)  NOT NULL,
    outcome       CHAR(1)       NOT NULL CHECK (outcome IN ('A','B','C')),
    disposition   VARCHAR(20)   NOT NULL DEFAULT '',
    broker        VARCHAR(100)  NOT NULL DEFAULT '',
    our_customer  BOOLEAN       NOT NULL DEFAULT TRUE,
    year          INTEGER       NOT NULL,
    month         VARCHAR(3)    NOT NULL,
    is_historical BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS locked_months (
    year        INTEGER     NOT NULL,
    month       VARCHAR(3)  NOT NULL,
    is_unlocked BOOLEAN     NOT NULL DEFAULT FALSE,
    PRIMARY KEY (year, month)
);
"""


def load_excel_data():
    """Load EXCEL_DATA from excel_data.json (extracted from original app.jsx)."""
    json_path = os.path.join(os.path.dirname(__file__), "excel_data.json")
    with open(json_path, encoding="utf-8") as f:
        return json.load(f)


def seed(conn, excel_data):
    inserted = 0
    with conn.cursor() as cur:
        # Check if already seeded
        cur.execute("SELECT COUNT(*) FROM lease_entries WHERE is_historical = TRUE")
        if cur.fetchone()[0] > 0:
            print("Historical data already present – skipping seed.")
            return 0

        for month, year, rows in excel_data:
            for row in rows:
                name       = row[0] if len(row) > 0 else ""
                outcome    = row[1] if len(row) > 1 else "B"
                disposition = row[2] if len(row) > 2 else ""
                broker     = row[3] if len(row) > 3 else ""
                if not name or outcome not in ("A", "B", "C"):
                    continue
                cur.execute(
                    """INSERT INTO lease_entries
                       (name, outcome, disposition, broker, our_customer, year, month, is_historical)
                       VALUES (%s, %s, %s, %s, TRUE, %s, %s, TRUE)""",
                    (name, outcome, disposition or "", broker or "", int(year), month),
                )
                inserted += 1
    conn.commit()
    return inserted


def main():
    print(f"Connecting to database…")
    conn = psycopg2.connect(DB_URL)
    try:
        print("Creating schema…")
        with conn.cursor() as cur:
            cur.execute(CREATE_SCHEMA)
        conn.commit()
        print("Schema ready.")

        print("Seeding historical data…")
        data = load_excel_data()
        n = seed(conn, data)
        print(f"Inserted {n} historical entries.")
    finally:
        conn.close()
    print("Done.")


if __name__ == "__main__":
    main()
