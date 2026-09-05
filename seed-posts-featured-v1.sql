-- ──────────────────────────────────────────────────────────────────────────
-- Add 'featured' flag to posts — drives the homepage "Latest from the Blog"
-- section. New posts default to FALSE so they don't auto-appear on home.
-- Admin promotes posts via the dashboard star toggle.
--
-- Idempotent: safe to re-run.
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Index for the homepage query: WHERE featured = true ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_posts_featured_created
  ON posts (featured, created_at DESC)
  WHERE featured = true AND published = true;

-- Verify
SELECT
  column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts' AND column_name = 'featured';

-- Sample: see which posts are currently featured (should be empty after this runs)
SELECT id, title, published, featured, created_at
FROM posts
ORDER BY created_at DESC
LIMIT 10;
