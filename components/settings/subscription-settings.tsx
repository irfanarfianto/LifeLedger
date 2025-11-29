"use client";

import { Subscription, deleteSubscription } from "@/lib/actions/finance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, CalendarClock } from "lucide-react";
import { CreateSubscriptionDialog } from "./create-subscription-dialog";
import { toast } from "sonner";
import { useState } from "react";

interface SubscriptionSettingsProps {
  subscriptions: Subscription[];
}

export function SubscriptionSettings({ subscriptions }: SubscriptionSettingsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus langganan ini?")) return;
    setIsLoading(id);
    try {
      await deleteSubscription(id);
      toast.success("Langganan dihapus");
    } catch (error) {
      toast.error("Gagal menghapus langganan");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manajemen Langganan</CardTitle>
          <CardDescription>
            Kelola layanan berlangganan Anda agar tidak lupa bayar.
          </CardDescription>
        </div>
        <CreateSubscriptionDialog trigger={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        } />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada langganan.</p>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rp {sub.cost.toLocaleString("id-ID")} / {sub.billing_cycle === 'monthly' ? 'Bulan' : 'Tahun'} • Tgl {sub.due_date_day}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(sub.id)}
                  disabled={isLoading === sub.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
