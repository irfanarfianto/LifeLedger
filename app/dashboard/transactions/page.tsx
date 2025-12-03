import { Suspense } from "react";
import { OverviewTab } from "@/components/finance/overview-tab";
import { getWallets, getCategories, getTransactions } from "@/lib/actions/finance";
import { FinanceSkeleton } from "@/components/finance/finance-skeleton";

async function TransactionsContent() {
  const [wallets, categories, transactions] = await Promise.all([
    getWallets(),
    getCategories(),
    getTransactions(),
  ]);

  return (
    <OverviewTab transactions={transactions} wallets={wallets} categories={categories} />
  );
}

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold">Transaksi</h1>
      <Suspense fallback={<FinanceSkeleton />}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}
