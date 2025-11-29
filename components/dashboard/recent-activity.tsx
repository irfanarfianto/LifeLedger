"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils/currency";
import type { Transaction } from "@/lib/actions/finance";

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada transaksi
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.transaction_type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/20' 
                      : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {transaction.transaction_type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{transaction.note || 'Transaksi'}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category?.name || 'Tanpa Kategori'}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.transaction_type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
