-- ============================================================
-- Comments + Likes schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Comments are public"
  ON comments FOR SELECT
  USING (true);

-- Only authenticated users can insert their own comments
CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

-- Only the author can update/delete their comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Index for fast comment loading per post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(post_id, created_at DESC);

-- 2. Add likes_count column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- 3. Likes table (tracks who liked what)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes
CREATE POLICY "Likes are public"
  ON likes FOR SELECT
  USING (true);

-- 4. RPC functions for like/unlike (bypass RLS — any user can call)

CREATE OR REPLACE FUNCTION like_post(p_post_id UUID, p_visitor_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the like (ignore if already exists for this visitor+post)
  INSERT INTO likes (post_id, visitor_id)
  VALUES (p_post_id, p_visitor_id)
  ON CONFLICT (post_id, visitor_id) DO NOTHING;

  -- Return updated count
  RETURN (SELECT COUNT(*) FROM likes WHERE post_id = p_post_id);
END;
$$;

CREATE OR REPLACE FUNCTION unlike_post(p_post_id UUID, p_visitor_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the like
  DELETE FROM likes
  WHERE post_id = p_post_id AND visitor_id = p_visitor_id;

  -- Return updated count
  RETURN (SELECT COUNT(*) FROM likes WHERE post_id = p_post_id);
END;
$$;

-- Unique constraint so same visitor can't like twice
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_post_visitor_unique;
ALTER TABLE likes ADD CONSTRAINT likes_post_visitor_unique UNIQUE (post_id, visitor_id);

-- Grant public access to the RPC functions
GRANT EXECUTE ON FUNCTION like_post TO anon, authenticated;
GRANT EXECUTE ON FUNCTION unlike_post TO anon, authenticated;

-- 5. Index on likes for fast counting
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
