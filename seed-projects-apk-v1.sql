-- ──────────────────────────────────────────────────────────────────────────
-- Add APK download URLs to Android project entries in site_content.projects
-- Generated 2026-09-06 for sriaravindan.com
-- Idempotent: safe to re-run, only updates missing apkUrl/apkVersion fields
-- ──────────────────────────────────────────────────────────────────────────

UPDATE site_content
SET content = jsonb_set(
  jsonb_set(
    content,
    '{projects}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN p->>'slug' = 'ledgercalc' THEN
            jsonb_set(
              jsonb_set(p, '{apkUrl}',
                '"https://github.com/vsriaravindan/ledgercalc/releases/download/v6.8/ledgercalc.apk"'),
              '{apkVersion}', '"v6.8"'
            )
          WHEN p->>'slug' = 'sriboard' THEN
            jsonb_set(
              jsonb_set(p, '{apkUrl}',
                '"https://github.com/vsriaravindan/SriBoard/releases/download/v2.3/Sriboard-v2.3-release.apk"'),
              '{apkVersion}', '"v2.3"'
            )
          WHEN p->>'slug' = 'netswitch' THEN
            jsonb_set(
              jsonb_set(p, '{apkUrl}',
                '"https://github.com/vsriaravindan/netswitch/releases/download/v1.0/netswitch.apk"'),
              '{apkVersion}', '"v1.0"'
            )
          ELSE p
        END
      )
      FROM jsonb_array_elements(content->'projects') AS p
    )
  ),
  '{updated_at}', to_jsonb(now()::text)
),
updated_at = now()
WHERE section = 'projects';

-- Verify the update (should show 3 projects with apkUrl)
SELECT
  p->>'slug' AS slug,
  p->>'apkVersion' AS apk_version,
  p->>'apkUrl' AS apk_url
FROM site_content, jsonb_array_elements(content->'projects') AS p
WHERE section = 'projects'
  AND p->>'apkUrl' IS NOT NULL
ORDER BY p->>'slug';
