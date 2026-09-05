-- ──────────────────────────────────────────────────────────────────────────
-- Add infoUrl to Android projects — points to the new static GitHub Pages
-- sites for ledgercalc, SriBoard, netswitch.
--
-- Idempotent: only sets infoUrl on the 3 projects that don't already have it.
-- ──────────────────────────────────────────────────────────────────────────

UPDATE site_content
SET content = jsonb_set(
  content,
  '{projects}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN p->>'slug' = 'ledgercalc' THEN
          jsonb_set(p, '{infoUrl}', '"https://vsriaravindan.github.io/ledgercalc/"')
        WHEN p->>'slug' = 'sriboard' THEN
          jsonb_set(p, '{infoUrl}', '"https://vsriaravindan.github.io/SriBoard/"')
        WHEN p->>'slug' = 'netswitch' THEN
          jsonb_set(p, '{infoUrl}', '"https://vsriaravindan.github.io/netswitch/"')
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
  p->>'infoUrl' AS info_url
FROM site_content, jsonb_array_elements(content->'projects') AS p
WHERE section = 'projects'
  AND p->>'infoUrl' IS NOT NULL
ORDER BY p->>'slug';
