#!/usr/bin/env python3
"""
Fix entries with 07/10/2023 timestamps by changing them to 06/30/2026.
This script updates the created_at column in the lease_entries table.

Usage: python fix_timestamps.py
"""

import os
import psycopg2
import psycopg2.extras
from datetime import datetime

def get_conn():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise ValueError("DATABASE_URL environment variable not set")
    return psycopg2.connect(database_url)

def fix_timestamps():
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # First, show what we're about to change
            print("Finding entries with created_at on 07/10/2023...")
            cur.execute(
                """SELECT id, name, outcome, created_at, year, month
                   FROM lease_entries
                   WHERE created_at >= %s AND created_at < %s
                   ORDER BY id""",
                ('2023-07-10 00:00:00', '2023-07-11 00:00:00')
            )
            entries = cur.fetchall()

            if not entries:
                print("No entries found with 07/10/2023 timestamp.")
                return

            print(f"\nFound {len(entries)} entries to update:")
            for entry in entries:
                print(f"  ID {entry['id']}: {entry['name']} (outcome={entry['outcome']}, created={entry['created_at']})")

            # Confirm before updating
            response = input(f"\nUpdate {len(entries)} entries? (yes/no): ").strip().lower()
            if response != 'yes':
                print("Cancelled.")
                return

            # Update the timestamps
            print("\nUpdating timestamps to 2026-06-30...")
            cur.execute(
                """UPDATE lease_entries
                   SET created_at = %s
                   WHERE created_at >= %s AND created_at < %s""",
                ('2026-06-30 00:00:00', '2023-07-10 00:00:00', '2023-07-11 00:00:00')
            )

            conn.commit()
            print(f"Updated {cur.rowcount} entries.")

            # Show the updated records
            print("\nVerifying updates:")
            cur.execute(
                """SELECT id, name, outcome, created_at, year, month
                   FROM lease_entries
                   WHERE created_at = %s
                   ORDER BY id""",
                ('2026-06-30 00:00:00',)
            )
            updated = cur.fetchall()
            for entry in updated[:5]:  # Show first 5
                print(f"  ID {entry['id']}: {entry['name']} (created={entry['created_at']})")
            if len(updated) > 5:
                print(f"  ... and {len(updated) - 5} more")

    finally:
        conn.close()

if __name__ == "__main__":
    try:
        fix_timestamps()
        print("\nDone!")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
