-- Add Eisenhower Matrix fields to tasks
ALTER TABLE tasks 
ADD COLUMN is_urgent BOOLEAN DEFAULT false,
ADD COLUMN is_important BOOLEAN DEFAULT false;

-- Create Habits table
CREATE TABLE habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily', -- daily, weekly
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Habit Logs table
CREATE TABLE habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_at)
);

-- RLS Policies
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habit logs" ON habit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert their own habit logs" ON habit_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own habit logs" ON habit_logs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id = auth.uid())
  );
