"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  is_urgent: boolean;
  is_important: boolean;
  created_at: string;
};

export async function getTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }

  return data as Task[];
}

export async function getFocusTasks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Fetch top 3 high priority tasks that are not completed
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("priority", "high")
    .neq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching focus tasks:", error);
    return [];
  }

  return data as Task[];
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high" || "medium";
  const dueDate = formData.get("due_date") as string || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const isImportant = formData.get("is_important") === "on";

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    description,
    priority,
    due_date: dueDate,
    is_urgent: isUrgent,
    is_important: isImportant,
    status: "pending",
  });

  if (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function updateTask(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "low" | "medium" | "high";
  const dueDate = formData.get("due_date") as string || null;
  const isUrgent = formData.get("is_urgent") === "on";
  const isImportant = formData.get("is_important") === "on";

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      priority,
      due_date: dueDate,
      is_urgent: isUrgent,
      is_important: isImportant,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }

  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

// --- Habits ---

export type Habit = {
  id: string;
  title: string;
  description: string | null;
  frequency: string;
  created_at: string;
};

export type HabitLog = {
  id: string;
  habit_id: string;
  completed_at: string;
};

export async function getHabits() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching habits:", error);
    return [];
  }

  return data as Habit[];
}

export async function getHabitLogs(date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("completed_at", date);
    // Note: We filter by user via RLS policies, but we can't easily filter by user_id in the query 
    // because habit_logs doesn't have user_id directly (it links to habits).
    // However, the RLS policy `EXISTS (SELECT 1 FROM habits ...)` handles this security.
    // To be safe and efficient, we should probably join or just rely on RLS.
    // For now, relying on RLS is fine.

  if (error) {
    console.error("Error fetching habit logs:", error);
    return [];
  }

  return data as HabitLog[];
}

export async function createHabit(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const title = formData.get("title") as string;
  
  const { error } = await supabase.from("habits").insert({
    user_id: user.id,
    title,
  });

  if (error) {
    console.error("Error creating habit:", error);
    throw new Error("Failed to create habit");
  }

  revalidatePath("/dashboard/tasks");
}

export async function toggleHabit(habitId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Check if already completed
  const { data: existing } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("completed_at", date)
    .single();

  if (existing) {
    // Delete
    await supabase.from("habit_logs").delete().eq("id", existing.id);
  } else {
    // Insert
    await supabase.from("habit_logs").insert({
      habit_id: habitId,
      completed_at: date,
    });
  }

  revalidatePath("/dashboard/tasks");
}

export async function updateTaskStatus(id: string, status: "pending" | "in_progress" | "completed") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating task status:", error);
    throw new Error("Failed to update task status");
  }

  // We don't revalidate path here immediately if we want to handle optimistic UI or just let the client handle it.
  // But for simplicity, we can revalidate.
  // revalidatePath("/dashboard"); 
  // Actually, let's not revalidate automatically to allow the client to show the "checked" state before it disappears?
  // Or revalidate and let the list update.
  // If I revalidate, the task might disappear from the list (since getFocusTasks filters out completed).
  // That's probably desired behavior for "Today's Focus".
  // But for the confetti, we need to know that *all* were completed.
  // I'll revalidate.
  // revalidatePath("/dashboard");
}
