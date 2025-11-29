"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

interface QuickStatsProps {
  monthlyIncome: number;
  monthlyExpense: number;
  upcomingTasks: number;
}

export function QuickStats({ monthlyIncome, monthlyExpense, upcomingTasks }: QuickStatsProps) {
  const savings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100).toFixed(1) : 0;

  const stats = [
    {
      title: "Pemasukan Bulan Ini",
      value: `Rp ${monthlyIncome.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: `Rp ${monthlyExpense.toLocaleString('id-ID')}`,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Tingkat Tabungan",
      value: `${savingsRate}%`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Tugas Mendatang",
      value: upcomingTasks.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
