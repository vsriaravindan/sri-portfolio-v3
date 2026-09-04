-- ============================================================================
-- Verify and Fix: Supabase Realtime publication for blog comments + likes
-- Idempotent: safe to re-run, no destructive ops.
-- Run in Supabase SQL Editor (postgres role, bypasses RLS).
-- ============================================================================

-- ── 1. Verify current state ────────────────────────────────────────────────
DO $$
DECLARE
  has_comments     boolean;
  has_comment_likes boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) INTO has_comments;

  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comment_likes'
  ) INTO has_comment_likes;

  RAISE NOTICE 'Realtime publication status:';
  RAISE NOTICE '  comments      → %', CASE WHEN has_comments THEN 'ENABLED ✓' ELSE 'MISSING ✗' END;
  RAISE NOTICE '  comment_likes → %', CASE WHEN has_comment_likes THEN 'ENABLED ✓' ELSE 'MISSING ✗' END;
END $$;

-- ── 2. Ensure REPLICA IDENTITY FULL (so DELETE events include full row) ──
ALTER TABLE comments       REPLICA IDENTITY FULL;
ALTER TABLE comment_likes  REPLICA IDENTITY FULL;

-- ── 3. Add tables to publication (idempotent via DO block) ───────────────
BEGIN;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE comments;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comment_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE comment_likes;
  END IF;
COMMIT;

-- ── 4. Final verification ────────────────────────────────────────────────
DO $$
DECLARE
  has_comments     boolean;
  has_comment_likes boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comments'
  ) INTO has_comments;

  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'comment_likes'
  ) INTO has_comment_likes;

  IF has_comments AND has_comment_likes THEN
    RAISE NOTICE '✓ DONE — both tables in Realtime. WebSocket events will fire on INSERT/DELETE.';
  ELSE
    RAISE WARNING '✗ INCOMPLETE — comments=% comment_likes=%', has_comments, has_comment_likes;
  END IF;
END $$;