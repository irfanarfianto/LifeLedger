"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Wallet = {
  id: string;
  name: string;
  type: "cash" | "bank" | "ewallet" | "investment";
  initial_balance: number;
  current_balance: number;
  created_at: string;
};

export async function getWallets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching wallets:", error);
    throw new Error("Failed to fetch wallets");
  }

  return data as Wallet[];
}

export async function createWallet(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const initialBalance = parseFloat(formData.get("initial_balance") as string) || 0;

  const { error } = await supabase.from("wallets").insert({
    user_id: user.id,
    name,
    type,
    initial_balance: initialBalance,
    current_balance: initialBalance, // Initially same as initial_balance
  });

  if (error) {
    console.error("Error creating wallet:", error);
    throw new Error("Failed to create wallet");
  }

  revalidatePath("/dashboard/finance");
}

export async function deleteWallet(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting wallet:", error);
    throw new Error("Failed to delete wallet");
  }

  revalidatePath("/dashboard/finance");
}

export type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string | null;
  budget_limit: number;
  created_at: string;
};

export async function getCategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data as Category[];
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const budgetLimit = parseFloat(formData.get("budget_limit") as string) || 0;
  // Icon handling will be added later, default to null for now or a generic icon string
  const icon = formData.get("icon") as string || null;

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
    budget_limit: budgetLimit,
    icon,
  });

  if (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }

  revalidatePath("/dashboard/finance");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  revalidatePath("/dashboard/finance");
}

// --- Transactions ---

export type Transaction = {
  id: string;
  amount: number;
  transaction_type: "income" | "expense" | "transfer";
  transaction_date: string;
  note: string | null;
  wallet_id: string;
  category_id: string | null;
  related_task_id: string | null;
  is_reimbursable: boolean;
  wallet: { name: string; type: string } | null;
  category: { name: string; icon: string | null } | null;
  created_at: string;
};

export async function getTransactions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      wallet:wallets(name, type),
      category:categories(name, icon)
    `)
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }

  return data as Transaction[];
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "income" | "expense" | "transfer";
  const walletId = formData.get("wallet_id") as string;
  const categoryId = formData.get("category_id") as string || null;
  const note = formData.get("note") as string || null;
  const date = formData.get("date") as string || new Date().toISOString();
  
  // Advanced features
  const relatedTaskId = formData.get("related_task_id") as string || null;
  const isReimbursable = formData.get("is_reimbursable") === "on";

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    transaction_type: type,
    wallet_id: walletId,
    category_id: categoryId,
    note,
    transaction_date: date,
    related_task_id: relatedTaskId,
    is_reimbursable: isReimbursable,
  });

  if (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }

  revalidatePath("/dashboard/finance");
}

// --- Wishlists ---

export type Wishlist = {
  id: string;
  item_name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
};

export async function getWishlists() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("wishlists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch wishlists");

  return data as Wishlist[];
}

export async function createWishlist(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const itemName = formData.get("item_name") as string;
  const targetAmount = parseFloat(formData.get("target_amount") as string);
  const savedAmount = parseFloat(formData.get("saved_amount") as string) || 0;
  const targetDate = formData.get("target_date") as string || null;

  const { error } = await supabase.from("wishlists").insert({
    user_id: user.id,
    item_name: itemName,
    target_amount: targetAmount,
    saved_amount: savedAmount,
    target_date: targetDate,
  });

  if (error) {
    console.error("Error creating wishlist:", error);
    throw new Error("Failed to create wishlist");
  }

  revalidatePath("/dashboard/finance");
}

export async function updateWishlist(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const itemName = formData.get("item_name") as string;
  const targetAmount = parseFloat(formData.get("target_amount") as string);
  const targetDate = formData.get("target_date") as string || null;

  const { error } = await supabase
    .from("wishlists")
    .update({
      item_name: itemName,
      target_amount: targetAmount,
      target_date: targetDate,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating wishlist:", error);
    throw new Error("Failed to update wishlist");
  }

  revalidatePath("/dashboard/finance");
}

export async function deleteWishlist(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting wishlist:", error);
    throw new Error("Failed to delete wishlist");
  }

  revalidatePath("/dashboard/finance");
}

export async function saveForWishlist(wishlistId: string, amount: number, walletId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  // 1. Deduct from wallet
  const { data: wallet, error: walletFetchError } = await supabase
    .from("wallets")
    .select("current_balance")
    .eq("id", walletId)
    .single();

  if (walletFetchError || !wallet) throw new Error("Wallet not found");

  if (wallet.current_balance < amount) {
    throw new Error("Insufficient funds in wallet");
  }

  const { error: walletUpdateError } = await supabase
    .from("wallets")
    .update({ current_balance: wallet.current_balance - amount })
    .eq("id", walletId);

  if (walletUpdateError) throw new Error("Failed to update wallet balance");

  // 2. Add to wishlist
  const { data: wishlist, error: wishlistFetchError } = await supabase
    .from("wishlists")
    .select("saved_amount, item_name")
    .eq("id", wishlistId)
    .single();

  if (wishlistFetchError || !wishlist) throw new Error("Wishlist not found");

  const { error: wishlistUpdateError } = await supabase
    .from("wishlists")
    .update({ saved_amount: wishlist.saved_amount + amount })
    .eq("id", wishlistId);

  if (wishlistUpdateError) throw new Error("Failed to update wishlist progress");

  // 3. Record transaction
  const { error: transactionError } = await supabase.from("transactions").insert({
    user_id: user.id,
    amount,
    transaction_type: "expense",
    wallet_id: walletId,
    category_id: null,
    note: `Tabungan untuk wishlist: ${wishlist.item_name}`,
    transaction_date: new Date().toISOString(),
    is_reimbursable: false,
  });

  if (transactionError) console.error("Failed to record transaction history", transactionError);

  revalidatePath("/dashboard/finance");
}

// --- Debts ---

export type Debt = {
  id: string;
  person_name: string;
  amount: number;
  type: "i_owe" | "they_owe";
  is_paid: boolean;
  note: string | null;
};

export async function getDebts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch debts");

  return data as Debt[];
}

export async function createDebt(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const personName = formData.get("person_name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as "i_owe" | "they_owe";
  const note = formData.get("note") as string || null;

  const { error } = await supabase.from("debts").insert({
    user_id: user.id,
    person_name: personName,
    amount,
    type,
    note,
    is_paid: false,
  });

  if (error) {
    console.error("Error creating debt:", error);
    throw new Error("Failed to create debt");
  }

  revalidatePath("/dashboard/finance");
}

export async function markDebtAsPaid(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("debts")
    .update({ is_paid: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating debt:", error);
    throw new Error("Failed to update debt");
  }

  revalidatePath("/dashboard/finance");
}

export async function deleteDebt(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("debts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting debt:", error);
    throw new Error("Failed to delete debt");
  }

  revalidatePath("/dashboard/finance");
}

// --- Subscriptions ---

export type Subscription = {
  id: string;
  name: string;
  cost: number;
  billing_cycle: "monthly" | "yearly";
  due_date_day: number;
  is_active: boolean;
};

export async function getSubscriptions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch subscriptions");

  return data as Subscription[];
}

export async function createSubscription(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const name = formData.get("name") as string;
  const cost = parseFloat(formData.get("cost") as string);
  const billingCycle = formData.get("billing_cycle") as "monthly" | "yearly";
  const dueDateDay = parseInt(formData.get("due_date_day") as string);

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    name,
    cost,
    billing_cycle: billingCycle,
    due_date_day: dueDateDay,
    is_active: true,
  });

  if (error) {
    console.error("Error creating subscription:", error);
    throw new Error("Failed to create subscription");
  }

  revalidatePath("/dashboard/settings");
}

export async function deleteSubscription(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting subscription:", error);
    throw new Error("Failed to delete subscription");
  }

  revalidatePath("/dashboard/settings");
}
