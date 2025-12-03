"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return {
    ...data,
    email: user.email,
  };
}

export async function updateUserRole(role: "student" | "worker" | "freelancer") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating role:", error);
    throw new Error("Failed to update role");
  }

  revalidatePath("/dashboard");
}

export async function updateProfileDetails(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as "student" | "worker" | "freelancer";
  
  // Role specific fields
  const semesterBudget = parseFloat(formData.get("semester_budget") as string) || 0;
  const grossSalary = parseFloat(formData.get("gross_salary") as string) || 0;
  const salaryDeductions = parseFloat(formData.get("salary_deductions") as string) || 0;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role,
      semester_budget: semesterBudget,
      gross_salary: grossSalary,
      salary_deductions: salaryDeductions,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile details:", error);
    throw new Error("Failed to update profile details");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
}

export async function deleteAccount(email: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  if (user.email !== email) {
    throw new Error("Email does not match");
  }

  const supabaseAdmin = createAdminClient();
  
  // Manually delete data from related tables to ensure cleanup
  // We use Promise.allSettled to try deleting from all tables even if some fail (e.g. table doesn't exist)
  // Transactions first as it depends on others
  await supabaseAdmin.from('transactions').delete().eq('user_id', user.id);
  
  // Delete habits (cascades to habit_logs)
  await supabaseAdmin.from('habits').delete().eq('user_id', user.id);

  // Delete other related tables
  await Promise.allSettled([
    supabaseAdmin.from('wallets').delete().eq('user_id', user.id),
    supabaseAdmin.from('categories').delete().eq('user_id', user.id),

    supabaseAdmin.from('subscriptions').delete().eq('user_id', user.id),
    supabaseAdmin.from('wishlists').delete().eq('user_id', user.id),
    supabaseAdmin.from('debts').delete().eq('user_id', user.id),
  ]);

  // Delete profile
  await supabaseAdmin.from('profiles').delete().eq('id', user.id);

  // Finally delete the auth user
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete account");
  }

  redirect("/");
}
