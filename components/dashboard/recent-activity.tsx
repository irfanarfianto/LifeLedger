"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils/currency";
import type { Transaction } from "@/lib/actions/finance";

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
        <Link href="/dashboard/transactions" className="text-sm text-primary hover:underline">
          Lihat Semua
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Belum ada transaksi terbaru.
            </p>
          ) : (
            recentTransactions.map((transaction) => {
              const type = transaction.transaction_type;
              const date = new Date(transaction.transaction_date); // Use transaction_date instead of date if available, or fallback. The type says transaction_date.
              // Wait, the type definition showed transaction_date, but previous code used transaction.date. 
              // Let's check the type definition again. It says transaction_date. 
              // But the previous code used transaction.date. 
              // I should probably check if transaction.date exists or if I should use transaction_date.
              // The type definition I saw in step 476 has transaction_date and created_at. It does NOT have 'date'.
              // However, the previous code was using transaction.date. This might be why the user saw "Invalid Date" in previous screenshots (though I fixed it with a fallback).
              // I should use transaction.transaction_date.
              
              const displayDate = new Date(transaction.transaction_date || transaction.created_at);
              const isValidDate = !isNaN(displayDate.getTime());

              let icon, colorClass, textClass, sign, label;

              if (type === 'income') {
                icon = <ArrowUpRight className="h-4 w-4" />;
                colorClass = "bg-green-100 text-green-600 dark:bg-green-900/20";
                textClass = "text-green-600";
                sign = "+";
                label = "Pemasukan";
              } else if (type === 'transfer') {
                icon = <ArrowLeftRight className="h-4 w-4" />;
                colorClass = "bg-blue-100 text-blue-600 dark:bg-blue-900/20";
                textClass = "text-blue-600";
                sign = "";
                label = "Transfer";
              } else {
                icon = <ArrowDownRight className="h-4 w-4" />;
                colorClass = "bg-red-100 text-red-600 dark:bg-red-900/20";
                textClass = "text-red-600";
                sign = "-";
                label = "Pengeluaran";
              }

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 hover:bg-muted/50 transition-colors rounded-lg px-2 -mx-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${colorClass}`}
                    >
                      {icon}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none truncate">
                        {transaction.note || label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isValidDate ? displayDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold whitespace-nowrap ml-2 ${textClass}`}
                  >
                    {sign}
                    {formatRupiah(transaction.amount)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
