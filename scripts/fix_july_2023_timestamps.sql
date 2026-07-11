-- Fix entries with created_at timestamp of 07/10/2023
-- Change to 06/30/2026
UPDATE lease_entries
SET created_at = '2026-06-30 00:00:00'
WHERE created_at >= '2023-07-10 00:00:00'
  AND created_at < '2023-07-11 00:00:00';

-- Show updated records
SELECT id, name, outcome, created_at, year, month
FROM lease_entries
WHERE created_at = '2026-06-30 00:00:00'
ORDER BY id;
