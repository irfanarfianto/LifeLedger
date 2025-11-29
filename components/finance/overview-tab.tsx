"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "@/components/finance/transaction-list";
import { CreateTransactionDialog } from "@/components/finance/create-transaction-dialog";
import { Transaction, Wallet, Category } from "@/lib/actions/finance";

interface OverviewTabProps {
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
}

export function OverviewTab({ transactions, wallets, categories }: OverviewTabProps) {
  // Calculate total balance
  const totalBalance = wallets.reduce((acc, wallet) => acc + wallet.current_balance, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalBalance.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground">
              Di {wallets.length} dompet
            </p>
          </CardContent>
        </Card>
        {/* Add more summary cards here later */}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Transaksi Terakhir</h3>
        <TransactionList transactions={transactions} />
      </div>

      <CreateTransactionDialog wallets={wallets} categories={categories} />
    </div>
  );
}
