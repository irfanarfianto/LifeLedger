-- Add role-specific fields to profiles
ALTER TABLE profiles 
ADD COLUMN semester_budget NUMERIC DEFAULT 0, -- For Students
ADD COLUMN gross_salary NUMERIC DEFAULT 0,    -- For Workers
ADD COLUMN salary_deductions NUMERIC DEFAULT 0; -- For Workers

-- Ensure subscriptions table exists (it was in the full schema, but let's be safe or add if missing)
-- If it already exists from 01_Database_Schema.sql, this might error if run again, 
-- but usually we assume incremental migrations. 
-- I will assume the base schema is there.

-- RLS for Subscriptions (if not already set)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);
