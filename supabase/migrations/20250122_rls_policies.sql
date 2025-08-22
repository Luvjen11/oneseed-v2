-- Enable RLS and create policies for faith_verses table
ALTER TABLE faith_verses ENABLE ROW LEVEL SECURITY;

-- User can CRUD only their verses
CREATE POLICY "fv_select_own" ON faith_verses
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "fv_insert_own" ON faith_verses
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fv_update_own" ON faith_verses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "fv_delete_own" ON faith_verses
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_faith_verses_user_created ON faith_verses(user_id, created_at DESC);

-- Enable RLS and create policies for faith_prayers table
ALTER TABLE faith_prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fp_select_own" ON faith_prayers
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "fp_cud_own" ON faith_prayers
  FOR ALL TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_faith_prayers_user_created ON faith_prayers(user_id, created_at DESC);

-- Enable RLS and create policies for faith_reflections table
ALTER TABLE faith_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fr_select_own" ON faith_reflections
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "fr_cud_own" ON faith_reflections
  FOR ALL TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_faith_reflections_user_created ON faith_reflections(user_id, created_at DESC);

-- Enable RLS and create policies for faith_profiles table (if not already done)
ALTER TABLE faith_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON faith_profiles
  FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_cud_own" ON faith_profiles
  FOR ALL TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile trigger function
CREATE OR REPLACE FUNCTION handle_new_user_faith_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.faith_profiles (user_id, full_name) VALUES (new.id, null);
  RETURN new;
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created_faith ON auth.users;
CREATE TRIGGER on_auth_user_created_faith
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user_faith_profile();