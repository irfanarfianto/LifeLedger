"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  totalBalance: number;
  lowBalanceThreshold?: number;
}

export function BalanceCard({ totalBalance, lowBalanceThreshold = 500000 }: BalanceCardProps) {
  const isLowBalance = totalBalance < lowBalanceThreshold;

  return (
    <Card className={cn(
      "transition-colors duration-300 shadow-sm h-full",
      isLowBalance ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900" : ""
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Saldo</CardTitle>
        <Wallet className={cn(
          "h-4 w-4",
          isLowBalance ? "text-red-500" : "text-muted-foreground"
        )} />
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-xl md:text-2xl font-bold",
          isLowBalance ? "text-red-600 dark:text-red-400" : ""
        )}>
          Rp {totalBalance.toLocaleString("id-ID")}
        </div>
        {isLowBalance && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            ⚠️ Saldo Rendah! (Di bawah Rp {lowBalanceThreshold.toLocaleString("id-ID")})
          </p>
        )}
        {!isLowBalance && (
          <p className="text-xs text-muted-foreground mt-1">
            Di semua dompet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
