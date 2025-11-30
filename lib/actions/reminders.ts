"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SavingsReminder {
  id: string;
  reminder_time: string;
  days: number[];
  title: string;
  body: string;
  is_active: boolean;
}

export async function getReminders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("savings_reminders")
    .select("*")
    .eq("user_id", user.id)
    .order("reminder_time");

  if (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }

  return data as SavingsReminder[];
}

export async function createReminder(data: Omit<SavingsReminder, "id" | "is_active">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("savings_reminders").insert({
    user_id: user.id,
    reminder_time: data.reminder_time,
    days: data.days,
    title: data.title,
    body: data.body,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}

export async function toggleReminder(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("savings_reminders")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}

export async function deleteReminder(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("savings_reminders")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}
