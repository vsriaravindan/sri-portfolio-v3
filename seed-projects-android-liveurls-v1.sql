-- ──────────────────────────────────────────────────────────────────────────
-- Fix: Android app liveUrl was pointing at the APK download. Should point
-- at the new static GitHub Pages info site instead.
--
-- Idempotent: only rewrites liveUrl if it currently points at the APK
-- (the old broken state). Safe to re-run.
-- ──────────────────────────────────────────────────────────────────────────

UPDATE site_content
SET content = jsonb_set(
  content,
  '{projects}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN p->>'slug' = 'ledgercalc'
             AND p->>'liveUrl' LIKE '%/releases/download/%ledgercalc.apk%' THEN
          jsonb_set(p, '{liveUrl}', '"https://vsriaravindan.github.io/ledgercalc/"')
        WHEN p->>'slug' = 'sriboard'
             AND p->>'liveUrl' LIKE '%/releases/download/%Sriboard%' THEN
          jsonb_set(p, '{liveUrl}', '"https://vsriaravindan.github.io/SriBoard/"')
        WHEN p->>'slug' = 'netswitch'
             AND p->>'liveUrl' LIKE '%/releases/download/%netswitch.apk%' THEN
          jsonb_set(p, '{liveUrl}', '"https://vsriaravindan.github.io/netswitch/"')
        ELSE p
      END
    )
    FROM jsonb_array_elements(content->'projects') AS p
  )
),
updated_at = now()
WHERE section = 'projects';

-- Verify
SELECT
  p->>'slug' AS slug,
  p->>'liveUrl' AS live_url,
  p->>'infoUrl' AS info_url
FROM site_content, jsonb_array_elements(content->'projects') AS p
WHERE section = 'projects'
  AND p->>'category' = 'Android'
ORDER BY p->>'slug';
