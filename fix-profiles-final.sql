-- Force-fix profiles RLS: drop all existing policies and recreate

-- Drop any existing policies
DROP POLICY IF EXISTS "Profiles are public" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Full access for read (anyone, including anon key)
CREATE POLICY "Profiles are public"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own row
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own row
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Grant anon role usage so the REST API can read
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;
