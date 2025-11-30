"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveFCMToken(token: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  // Check if token already exists for this user
  const { data: existingToken } = await supabase
    .from("user_devices")
    .select("id")
    .eq("user_id", user.id)
    .eq("fcm_token", token)
    .single();

  if (existingToken) {
    // Update last active
    await supabase
      .from("user_devices")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", existingToken.id);
  } else {
    // Insert new token
    await supabase.from("user_devices").insert({
      user_id: user.id,
      fcm_token: token,
      device_type: "web", // Default to web for now
    });
  }
}
