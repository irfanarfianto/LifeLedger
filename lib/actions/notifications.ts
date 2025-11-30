"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveFCMToken(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  // Update fcm_token in profiles table
  const { error } = await supabase
    .from("profiles")
    .update({ fcm_token: token })
    .eq("id", user.id);

    console.log("FCM Token saved to profiles for user:", user.id);

  if (error) {
    console.error("Error saving FCM token to profiles:", error);
  } else {
    console.log("FCM Token saved to profiles for user:", user.id);
  }
}
