"use client";

import { Transaction } from "@/lib/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari transaksi..."
            className="pl-8 w-full md:w-[300px]"
          />
        </div>
        {/* Filter buttons can go here */}
      </div>

      <div className="space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
            Tidak ada transaksi ditemukan.
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  transaction.transaction_type === "income" ? "bg-green-100 text-green-600" :
                  transaction.transaction_type === "expense" ? "bg-red-100 text-red-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  {transaction.transaction_type === "income" && <ArrowDownLeft className="h-4 w-4" />}
                  {transaction.transaction_type === "expense" && <ArrowUpRight className="h-4 w-4" />}
                  {transaction.transaction_type === "transfer" && <ArrowRightLeft className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.category?.name || transaction.note || "Tanpa Kategori"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.transaction_date), "PPP", { locale: id })} • {transaction.wallet?.name}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${
                transaction.transaction_type === "income" ? "text-green-600" :
                transaction.transaction_type === "expense" ? "text-red-600" :
                "text-blue-600"
              }`}>
                {transaction.transaction_type === "expense" ? "-" : "+"}
                Rp {transaction.amount.toLocaleString("id-ID")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
