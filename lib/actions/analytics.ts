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

export type BudgetProgressItem = {
  categoryName: string;
  spent: number;
  limit: number;
  percentage: number;
  color: string;
};

export async function getBudgetProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // 1. Get all expense categories with budget limits > 0
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name, budget_limit")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gt("budget_limit", 0);

  if (catError) {
    console.error("Error fetching categories for budget:", catError);
    return [];
  }

  if (!categories || categories.length === 0) return [];

  // 2. Get expenses for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

  const { data: transactions, error: transError } = await supabase
    .from("transactions")
    .select("amount, category_id")
    .eq("user_id", user.id)
    .eq("transaction_type", "expense")
    .gte("created_at", startOfMonth)
    .lte("created_at", endOfMonth);

  if (transError) {
    console.error("Error fetching transactions for budget:", transError);
    return [];
  }

  // 3. Calculate spent per category
  const spentMap = new Map<string, number>();
  transactions.forEach(t => {
    if (t.category_id) {
      const current = spentMap.get(t.category_id) || 0;
      spentMap.set(t.category_id, current + t.amount);
    }
  });

  // 4. Combine data
  const result: BudgetProgressItem[] = categories.map((cat, index) => {
    const spent = spentMap.get(cat.id) || 0;
    const percentage = Math.min((spent / cat.budget_limit) * 100, 100);
    
    return {
      categoryName: cat.name,
      spent,
      limit: cat.budget_limit,
      percentage,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
  }).sort((a, b) => b.percentage - a.percentage);

  return result;
}

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  amount: number;
  type: "subscription" | "debt_payment";
  isPaid: boolean;
};

export async function getCalendarEvents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const events: CalendarEvent[] = [];

  // 1. Get Subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!subError && subscriptions) {
    const now = new Date();
    // Generate events for current month and next month
    [0, 1].forEach(monthOffset => {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      
      subscriptions.forEach(sub => {
        const eventDate = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), sub.due_date_day);
        
        // Handle invalid dates (e.g., Feb 30)
        if (eventDate.getMonth() !== targetMonth.getMonth()) {
          // Set to last day of month
          eventDate.setDate(0); 
        }

        events.push({
          id: `sub-${sub.id}-${monthOffset}`,
          title: `Tagihan: ${sub.name}`,
          date: eventDate,
          amount: sub.cost,
          type: "subscription",
          isPaid: false, // Subscriptions are recurring, logic for "paid" this month is complex, assuming false for forecast
        });
      });
    });
  }

  // 2. Get Debts (I Owe) with due dates
  const { data: debts, error: debtError } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "i_owe")
    .eq("is_paid", false)
    .not("due_date", "is", null);

  if (!debtError && debts) {
    debts.forEach(debt => {
      if (debt.due_date) {
        events.push({
          id: `debt-${debt.id}`,
          title: `Bayar Hutang: ${debt.person_name}`,
          date: new Date(debt.due_date),
          amount: debt.amount,
          type: "debt_payment",
          isPaid: false,
        });
      }
    });
  }

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
}
