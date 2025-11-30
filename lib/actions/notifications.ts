"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendNotification(userId: string, title: string, body: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title: title,
      body: body,
    });

  if (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}

export async function getUserNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data;
}
