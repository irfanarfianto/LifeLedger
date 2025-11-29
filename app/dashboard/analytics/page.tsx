import { Suspense } from "react";
import { getExpensesByCategory, getBocorHalus } from "@/lib/actions/analytics";
import { ExpensePieChart } from "@/components/analytics/expense-pie-chart";
import { BocorHalusCard } from "@/components/analytics/bocor-halus-card";
import { CostOfTimeCalculator } from "@/components/analytics/cost-of-time-calculator";
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton";
import { getUserProfile } from "@/lib/actions/profile";

async function AnalyticsContent() {
  const [expensesByCategory, bocorHalusItems, profile] = await Promise.all([
    getExpensesByCategory(),
    getBocorHalus(),
    getUserProfile(),
  ]);

  const isWorker = profile?.role === 'worker' || profile?.role === 'freelancer';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className={isWorker ? "lg:col-span-2" : "lg:col-span-1"}>
        <ExpensePieChart data={expensesByCategory} />
      </div>
      
      {isWorker && (
        <div>
          <CostOfTimeCalculator />
        </div>
      )}

      <div className={isWorker ? "lg:col-span-3" : "lg:col-span-2"}>
        <BocorHalusCard items={bocorHalusItems} />
      </div>
    </div>
  );
}


export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold">Analitik & Laporan</h1>
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
