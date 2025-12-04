"use client";

import { BudgetProgressItem } from "@/lib/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatRupiah } from "@/lib/utils/currency";
import { Target } from "lucide-react";

interface BudgetProgressCardProps {
  items: BudgetProgressItem[];
}

export function BudgetProgressCard({ items }: BudgetProgressCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="h-4 w-4 text-primary" />
          Anggaran Bulanan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-xs text-center">
            <p>Belum ada anggaran yang diatur.</p>
            <p className="mt-1">Atur batas anggaran di menu Pengaturan &gt; Kategori.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.categoryName}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatRupiah(item.spent)} / {formatRupiah(item.limit)}
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" indicatorColor={item.percentage >= 90 ? "bg-red-500" : item.percentage >= 75 ? "bg-yellow-500" : "bg-primary"} />
                <div className="flex justify-end">
                  <span className={`text-[10px] ${item.percentage >= 90 ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
                    {item.percentage.toFixed(0)}% terpakai
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
