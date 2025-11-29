import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/finance/overview-tab";
import { WalletsTab } from "@/components/finance/wallets-tab";
import { WishlistTab } from "@/components/finance/wishlist-tab";
import { DebtsTab } from "@/components/finance/debts-tab";
import { getWallets, getCategories, getTransactions, getWishlists, getDebts } from "@/lib/actions/finance";
import { FinanceSkeleton } from "@/components/finance/finance-skeleton";

async function FinanceContent() {
  const [wallets, categories, transactions, wishlists, debts] = await Promise.all([
    getWallets(),
    getCategories(),
    getTransactions(),
    getWishlists(),
    getDebts(),
  ]);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="w-full justify-start inline-flex min-w-max">
          <TabsTrigger value="overview">Ringkasan & Transaksi</TabsTrigger>
          <TabsTrigger value="wallets">Dompet</TabsTrigger>
          <TabsTrigger value="wishlist">Keinginan</TabsTrigger>
          <TabsTrigger value="debts">Hutang</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="overview" className="space-y-4">
        <OverviewTab transactions={transactions} wallets={wallets} categories={categories} />
      </TabsContent>
      <TabsContent value="wallets" className="space-y-4">
        <WalletsTab wallets={wallets} categories={categories} />
      </TabsContent>
      <TabsContent value="wishlist" className="space-y-4">
        <WishlistTab wishlists={wishlists} />
      </TabsContent>
      <TabsContent value="debts" className="space-y-4">
        <DebtsTab debts={debts} />
      </TabsContent>
    </Tabs>
  );
}

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <h1 className="text-2xl font-bold">Keuangan</h1>
      <Suspense fallback={<FinanceSkeleton />}>
        <FinanceContent />
      </Suspense>
    </div>
  );
}
