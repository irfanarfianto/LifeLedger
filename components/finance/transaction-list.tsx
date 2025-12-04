"use client";

import { Transaction } from "@/lib/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TransactionIcon } from "@/components/ui/transaction-icon";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    const note = transaction.note?.toLowerCase() || "";
    const categoryName = transaction.category?.name?.toLowerCase() || "";
    const walletName = transaction.wallet?.name?.toLowerCase() || "";
    const amount = transaction.amount.toString();

    return (
      note.includes(query) ||
      categoryName.includes(query) ||
      walletName.includes(query) ||
      amount.includes(query)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari transaksi..."
            className="pl-8 w-full md:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Filter buttons can go here */}
      </div>

      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
            Tidak ada transaksi ditemukan.
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <TransactionIcon type={transaction.transaction_type} />
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
