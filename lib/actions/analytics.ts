"use server";

import { createClient } from "@/lib/supabase/server";

export type CategoryExpense = {
  name: string;
  value: number;
  color: string;
};

export type BocorHalusItem = {
  name: string;
  count: number;
  total: number;
  average: number;
};

export async function getExpensesByCategory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Fetch expenses with category details
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(`
      amount,
      categories (
        name
      )
    `)
    .eq("user_id", user.id)
    .eq("transaction_type", "expense");

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  // Aggregate by category
  const aggregated = transactions.reduce((acc, curr) => {
    // @ts-ignore - Supabase types join handling
    const categoryName = curr.categories?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort
  const result: CategoryExpense[] = Object.entries(aggregated)
    .map(([name, value], index) => ({
      name,
      value,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    }))
    .sort((a, b) => b.value - a.value);

  return result;
}

export async function getBocorHalus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // Fetch small expenses (< 100k)
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("note, amount, created_at")
    .eq("user_id", user.id)
    .eq("transaction_type", "expense")
    .lt("amount", 100000); // Threshold for "small"

  if (error) {
    console.error("Error fetching small expenses:", error);
    return [];
  }

  // Group by note (assuming note describes the item, e.g., "Kopi", "Parkir")
  // This is a simple heuristic. Ideally, we'd use AI or more complex clustering.
  const grouped = transactions.reduce((acc, curr) => {
    const key = (curr.note || "Unknown").toLowerCase().trim();
    if (!acc[key]) {
      acc[key] = { count: 0, total: 0 };
    }
    acc[key].count += 1;
    acc[key].total += curr.amount;
    return acc;
  }, {} as Record<string, { count: number, total: number }>);

  // Filter for frequent items (> 3 times)
  const result: BocorHalusItem[] = Object.entries(grouped)
    .filter(([_, data]) => data.count > 3)
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      count: data.count,
      total: data.total,
      average: data.total / data.count,
    }))
    .sort((a, b) => b.total - a.total);

  return result;
}
