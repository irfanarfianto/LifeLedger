import { getWallets, getCategories, getDebts } from "@/lib/actions/finance";
import { WalletDebtManager } from "@/components/finance/wallet-debt-manager";
import { Suspense } from "react";
import { FinanceSkeleton } from "@/components/finance/finance-skeleton";

async function WalletsContent() {
  const [wallets, categories, debts] = await Promise.all([
    getWallets(),
    getCategories(),
    getDebts(),
  ]);

  return (
    <WalletDebtManager 
      wallets={wallets} 
      categories={categories} 
      debts={debts} 
    />
  );
}

export default function WalletsPage() {
  return (
    <div className="pb-20">
      <Suspense fallback={<FinanceSkeleton />}>
        <WalletsContent />
      </Suspense>
    </div>
  );
}
