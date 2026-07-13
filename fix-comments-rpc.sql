-- ============================================================
-- Fix: RLS on comments INSERT — create SECURITY DEFINER RPC
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop existing first (return type changed from earlier attempt)
DROP FUNCTION IF EXISTS insert_comment(UUID, TEXT);

-- 1. Create an RPC function that bypasses RLS (same pattern as upsert_my_profile)
CREATE OR REPLACE FUNCTION insert_comment(p_post_id UUID, p_content TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_comment JSON;
BEGIN
  INSERT INTO comments (post_id, author_id, content)
  VALUES (p_post_id, auth.uid(), p_content)
  RETURNING json_build_object(
    'id', id,
    'post_id', post_id,
    'author_id', author_id,
    'content', content,
    'created_at', created_at
  ) INTO v_comment;

  RETURN v_comment;
END;
$$;

-- 2. Grant execution to authenticated users only
GRANT EXECUTE ON FUNCTION insert_comment TO authenticated;
