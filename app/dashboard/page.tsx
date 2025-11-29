import { Suspense } from "react";
import { GreetingCard } from "@/components/dashboard/greeting-card";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { PomodoroWidget } from "@/components/dashboard/pomodoro-widget";
import { FocusTasks } from "@/components/dashboard/focus-tasks";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { WishlistProgress } from "@/components/dashboard/wishlist-progress";
import { getWallets, getTransactions, getWishlists } from "@/lib/actions/finance";
import { getFocusTasks } from "@/lib/actions/tasks";
import { getUserProfile } from "@/lib/actions/profile";

async function DashboardContent() {
  const [wallets, transactions, focusTasks, profile, wishlists] = await Promise.all([
    getWallets(),
    getTransactions(),
    getFocusTasks(),
    getUserProfile(),
    getWishlists(),
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
  const upcomingTasks = focusTasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="flex flex-col gap-6 pb-20">
      <OnboardingDialog currentRole={profile?.role} />
      
      {/* Greeting and Balance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full md:col-span-2 lg:col-span-3">
          <GreetingCard userName={profile?.full_name} />
        </div>
        <BalanceCard totalBalance={totalBalance} />
      </div>

      {/* Quick Stats */}
      <QuickStats 
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        upcomingTasks={upcomingTasks}
      />

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-2">
          <FocusTasks initialTasks={focusTasks} />
        </div>
        <div className="space-y-4">
          <RecentActivity transactions={transactions} />
          <WishlistProgress wishlists={wishlists} />
        </div>
      </div>

      <PomodoroWidget />
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
