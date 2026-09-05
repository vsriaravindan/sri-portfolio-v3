-- ──────────────────────────────────────────────────────────────────────────
-- Add liveUrl + liveLabel to Android project entries in site_content.projects
-- This complements seed-projects-apk-v1.sql — that one added apkUrl/apkVersion,
-- this one adds the "Live in production · vX.X" pill display on project cards.
--
-- Generated 2026-09-06 for sriaravindan.com
-- Idempotent: safe to re-run, only updates missing liveUrl/liveLabel fields
-- ──────────────────────────────────────────────────────────────────────────

UPDATE site_content
SET content = jsonb_set(
  content,
  '{projects}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN p->>'slug' = 'ledgercalc' THEN
          jsonb_set(
            jsonb_set(p, '{liveUrl}',
              '"https://github.com/vsriaravindan/ledgercalc/releases/download/v6.8/ledgercalc.apk"'),
            '{liveLabel}', '"Live in production · v6.8"'
          )
        WHEN p->>'slug' = 'sriboard' THEN
          jsonb_set(
            jsonb_set(p, '{liveUrl}',
              '"https://github.com/vsriaravindan/SriBoard/releases/download/v2.3/Sriboard-v2.3-release.apk"'),
            '{liveLabel}', '"Live in production · v2.3"'
          )
        WHEN p->>'slug' = 'netswitch' THEN
          jsonb_set(
            jsonb_set(p, '{liveUrl}',
              '"https://github.com/vsriaravindan/netswitch/releases/download/v1.0/netswitch.apk"'),
            '{liveLabel}', '"Live in production · v1.0"'
          )
        ELSE p
      END
    )
    FROM jsonb_array_elements(content->'projects') AS p
  )
),
updated_at = now()
WHERE section = 'projects';

-- Verify the update (should show all projects with liveUrl + label)
SELECT
  p->>'slug' AS slug,
  p->>'liveLabel' AS live_label,
  LEFT(p->>'liveUrl', 50) || '...' AS live_url_prefix
FROM site_content, jsonb_array_elements(content->'projects') AS p
WHERE section = 'projects'
  AND p->>'liveUrl' IS NOT NULL
ORDER BY p->>'slug';
