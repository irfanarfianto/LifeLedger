import { Suspense } from "react";
import { GreetingCard } from "@/components/dashboard/greeting-card";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { PomodoroWidget } from "@/components/dashboard/pomodoro-widget";
import { FocusTasks } from "@/components/dashboard/focus-tasks";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { getWallets, getTransactions } from "@/lib/actions/finance";
import { getFocusTasks } from "@/lib/actions/tasks";
import { getUserProfile } from "@/lib/actions/profile";

async function DashboardContent() {
  const [wallets, transactions, focusTasks, profile] = await Promise.all([
    getWallets(),
    getTransactions(),
    getFocusTasks(),
    getUserProfile(),
  ]);

  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.current_balance), 0);

  return (
    <div className="flex flex-col gap-4 pb-20">
      <OnboardingDialog currentRole={profile?.role} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full md:col-span-2 lg:col-span-3">
          <GreetingCard />
        </div>
        <BalanceCard totalBalance={totalBalance} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-1 lg:col-span-2">
          <FocusTasks initialTasks={focusTasks} />
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
