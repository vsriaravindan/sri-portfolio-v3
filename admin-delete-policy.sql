-- Run this in Supabase Dashboard → SQL Editor
-- This allows vsriaravindan@gmail.com to delete any post

-- Drop the existing delete policy
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- Recreate: users can delete their own, admin can delete any
CREATE POLICY "Users can delete own posts" ON public.posts
  FOR DELETE
  USING (
    auth.uid() = author_id
    OR
    auth.jwt() ->> 'email' = 'vsriaravindan@gmail.com'
  );
