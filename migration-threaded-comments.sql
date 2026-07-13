-- ============================================================
-- Migration: Threaded Comments + Comment Likes
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Add parent_id to comments for threading ──
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- ── 2. Add likes_count column to comments ──
ALTER TABLE comments ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- ── 3. Create comment_likes table ──
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comment likes are public" ON comment_likes;
CREATE POLICY "Comment likes are public"
  ON comment_likes FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- ── 4. Recreate insert_comment with optional parent_id ──
DROP FUNCTION IF EXISTS insert_comment(UUID, TEXT);

CREATE OR REPLACE FUNCTION insert_comment(p_post_id UUID, p_content TEXT, p_parent_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_comment JSON;
BEGIN
  INSERT INTO comments (post_id, author_id, content, parent_id)
  VALUES (p_post_id, auth.uid(), p_content, p_parent_id)
  RETURNING json_build_object(
    'id', id,
    'post_id', post_id,
    'author_id', author_id,
    'content', content,
    'parent_id', parent_id,
    'created_at', created_at
  ) INTO v_comment;

  RETURN v_comment;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_comment TO authenticated;

-- ── 5. Create delete_comment RPC (fixes DELETE 403) ──
CREATE OR REPLACE FUNCTION delete_comment(p_comment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM comments
  WHERE id = p_comment_id AND author_id = auth.uid();
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_comment TO authenticated;

-- ── 6. Create like_comment / unlike_comment RPCs ──

CREATE OR REPLACE FUNCTION like_comment(p_comment_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO comment_likes (comment_id, user_id)
  VALUES (p_comment_id, auth.uid())
  ON CONFLICT (comment_id, user_id) DO NOTHING;

  UPDATE comments SET likes_count = (
    SELECT COUNT(*) FROM comment_likes WHERE comment_id = p_comment_id
  ) WHERE id = p_comment_id
  RETURNING likes_count INTO v_count;

  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION unlike_comment(p_comment_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM comment_likes
  WHERE comment_id = p_comment_id AND user_id = auth.uid();

  UPDATE comments SET likes_count = (
    SELECT COUNT(*) FROM comment_likes WHERE comment_id = p_comment_id
  ) WHERE id = p_comment_id
  RETURNING likes_count INTO v_count;

  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION like_comment TO authenticated;
GRANT EXECUTE ON FUNCTION unlike_comment TO authenticated;

-- ── 7. Enable Realtime for comment_likes ──
ALTER TABLE comment_likes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE comment_likes;
