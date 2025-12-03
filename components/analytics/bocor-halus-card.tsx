"use client";

import { BocorHalusItem } from "@/lib/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Droplets } from "lucide-react";

interface BocorHalusCardProps {
  items: BocorHalusItem[];
}

export function BocorHalusCard({ items }: BocorHalusCardProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Droplets className="h-4 w-4 text-orange-500" />
          Bocor Halus
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Pengeluaran kecil yang sering terjadi.
        </p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-xs">
            <p>Aman! Tidak ada kebocoran.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full text-orange-600 dark:text-orange-300">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count}x transaksi (Rata-rata Rp {item.average.toLocaleString("id-ID")})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    Rp {item.total.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
