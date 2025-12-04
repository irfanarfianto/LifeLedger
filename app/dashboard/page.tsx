import { Suspense } from "react";
import { GreetingCard } from "@/components/dashboard/greeting-card";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { FinancialOverview } from "@/components/dashboard/quick-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { WishlistProgress } from "@/components/dashboard/wishlist-progress";
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart";
import { ExpensePieChart } from "@/components/analytics/expense-pie-chart";
import { BocorHalusCard } from "@/components/analytics/bocor-halus-card";
import { BudgetProgressCard } from "@/components/analytics/budget-progress-card";
import { getWallets, getTransactions, getWishlists } from "@/lib/actions/finance";
import { getCashFlowData, getExpensesByCategory, getBocorHalus, getBudgetProgress } from "@/lib/actions/analytics";
import { getUserProfile } from "@/lib/actions/profile";

async function DashboardContent() {
  const [wallets, transactions, profile, wishlists, cashFlowData, expensesByCategory, bocorHalusItems, budgetProgress] = await Promise.all([
    getWallets(),
    getTransactions(),
    getUserProfile(),
    getWishlists(),
    getCashFlowData(),
    getExpensesByCategory(),
    getBocorHalus(),
    getBudgetProgress(),
  ]);

  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.current_balance), 0);
  
  // Calculate monthly stats
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyTransactions = transactions.filter(t => new Date(t.created_at) >= firstDayOfMonth);
  const monthlyIncome = monthlyTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlyExpense = monthlyTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);


  return (
    <div className="flex flex-col gap-6 pb-20">
      <OnboardingDialog currentRole={profile?.role} />
      
      {/* Header & Stats */}
      <div className="space-y-6">
        <GreetingCard userName={profile?.full_name} />
        <FinancialOverview 
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpense={monthlyExpense}
        />
      </div>

      {/* Unified Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Cash Flow Chart (Top Left - 66%) */}
        <div className="md:col-span-4 min-w-0">
          <CashFlowChart data={cashFlowData} />
        </div>

        {/* Expense Chart (Top Right - 33%) */}
        <div className="md:col-span-2 min-w-0">
          <ExpensePieChart data={expensesByCategory} />
        </div>

        {/* Recent Activity (Bottom Left - 66%) */}
        <div className="md:col-span-4 min-w-0">
          <RecentActivity transactions={transactions} />
        </div>

        {/* Side Content (Bottom Right - 33%) */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          <BudgetProgressCard items={budgetProgress} />
          <WishlistProgress wishlists={wishlists} />
          <BocorHalusCard items={bocorHalusItems} />
        </div>
      </div>
    </div>
  );
}

import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
