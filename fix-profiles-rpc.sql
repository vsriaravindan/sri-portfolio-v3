-- Run this in Supabase Dashboard → SQL Editor
-- Creates a function that bypasses RLS for profile saves

CREATE OR REPLACE FUNCTION upsert_my_profile(
  p_display_name TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_github_url TEXT DEFAULT NULL,
  p_github_username TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_blog_handle TEXT DEFAULT NULL
)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO profiles (id, display_name, avatar_url, github_url, github_username, bio, blog_handle)
  VALUES (
    auth.uid(),
    p_display_name,
    p_avatar_url,
    p_github_url,
    p_github_username,
    p_bio,
    p_blog_handle
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    github_url = COALESCE(EXCLUDED.github_url, profiles.github_url),
    github_username = COALESCE(EXCLUDED.github_username, profiles.github_username),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    blog_handle = COALESCE(EXCLUDED.blog_handle, profiles.blog_handle),
    updated_at = NOW()
  RETURNING *;
END;
$$;

-- Grant authenticated users permission to run it
GRANT EXECUTE ON FUNCTION upsert_my_profile TO authenticated;
