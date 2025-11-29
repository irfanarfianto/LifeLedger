"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

  return data;
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
