"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Wallet } from "lucide-react";

interface FinancialOverviewProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export function FinancialOverview({ totalBalance, monthlyIncome, monthlyExpense }: FinancialOverviewProps) {
  const savings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: "Total Saldo",
      value: `Rp ${totalBalance.toLocaleString('id-ID')}`,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Pemasukan",
      value: `Rp ${monthlyIncome.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Pengeluaran",
      value: `Rp ${monthlyExpense.toLocaleString('id-ID')}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Tabungan",
      value: `${savingsRate}%`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {stat.title}
            </CardTitle>
            <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-lg sm:text-2xl font-bold tracking-tight truncate">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
