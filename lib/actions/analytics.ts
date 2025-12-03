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

export async function getCashFlowData(range: "daily" | "weekly" | "monthly" = "monthly") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const now = new Date();
  const startDate = new Date();
  
  // Determine start date based on range
  if (range === "daily") {
    startDate.setDate(now.getDate() - 30);
  } else if (range === "weekly") {
    startDate.setDate(now.getDate() - (7 * 12)); // Last 12 weeks
  } else {
    startDate.setMonth(now.getMonth() - 11); // Last 12 months
    startDate.setDate(1);
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount, transaction_type, created_at")
    .eq("user_id", user.id)
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching cash flow data:", error);
    return [];
  }

  // Helper to format date keys
  const formatDateKey = (date: Date) => {
    if (range === "daily") {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } else if (range === "weekly") {
      // Get start of week
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
      d.setDate(diff);
      return `Minggu ${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
    } else {
      return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    }
  };

  // Initialize map with all dates in range to ensure continuous line
  const dataMap = new Map<string, { date: string, income: number, expense: number }>();
  
  const currentDate = new Date(startDate);
  while (currentDate <= now) {
    const key = formatDateKey(currentDate);
    if (!dataMap.has(key)) {
      dataMap.set(key, { date: key, income: 0, expense: 0 });
    }
    
    // Increment
    if (range === "daily") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (range === "weekly") {
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  // Fill with actual data
  transactions.forEach(curr => {
    const date = new Date(curr.created_at);
    const key = formatDateKey(date);
    
    if (dataMap.has(key)) {
      const entry = dataMap.get(key)!;
      if (curr.transaction_type === 'income') {
        entry.income += curr.amount;
      } else {
        entry.expense += curr.amount;
      }
    }
  });

  return Array.from(dataMap.values());
}
