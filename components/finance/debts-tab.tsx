"use client";

import { Debt, markDebtAsPaid } from "@/lib/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DebtsTabProps {
  debts: Debt[];
}

export function DebtsTab({ debts }: DebtsTabProps) {
  const handleMarkAsPaid = async (id: string) => {
    try {
      await markDebtAsPaid(id);
      toast.success("Hutang ditandai lunas");
    } catch (error) {
      toast.error("Gagal memperbarui hutang");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {debts.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg border-dashed text-muted-foreground">
            Tidak ada catatan hutang.
          </div>
        ) : (
          debts.map((debt) => (
            <Card key={debt.id} className={cn(debt.is_paid && "opacity-60")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                  {debt.type === "they_owe" ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                  {debt.person_name}
                </CardTitle>
                {debt.is_paid && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "text-2xl font-bold mb-2",
                  debt.type === "they_owe" ? "text-green-600" : "text-red-600"
                )}>
                  Rp {debt.amount.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  {debt.type === "they_owe" ? "Dia berhutang padamu" : "Kamu berhutang"}
                  {debt.note && ` • ${debt.note}`}
                </p>
                {!debt.is_paid && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleMarkAsPaid(debt.id)}
                  >
                    Tandai Lunas
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
