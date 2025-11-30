-- Create savings_reminders table
CREATE TABLE IF NOT EXISTS public.savings_reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_time TIME NOT NULL, -- Format HH:MM:SS
  days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=Sunday, 1=Monday, etc.
  title TEXT DEFAULT 'Waktunya Menabung! 💰',
  body TEXT DEFAULT 'Sisihkan sedikit rezekimu untuk masa depan.',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.savings_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" ON public.savings_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON public.savings_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON public.savings_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" ON public.savings_reminders
  FOR DELETE USING (auth.uid() = user_id);
