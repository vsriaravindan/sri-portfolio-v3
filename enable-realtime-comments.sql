-- ============================================================
-- Enable Realtime on the comments table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Ensure REPLICA IDENTITY FULL so the WebSocket receives full row payload
ALTER TABLE comments REPLICA IDENTITY FULL;

-- 2. Add comments table to the supabase_realtime publication
--    (this is what makes INSERT/UPDATE/DELETE fire WebSocket events)
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
