"use client";

import { Wishlist, Wallet } from "@/lib/actions/finance";
import { CreateWishlistDialog } from "./create-wishlist-dialog";
import { AddSavingsDialog } from "./add-savings-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { differenceInDays } from "date-fns";
import { Target } from "lucide-react";

interface WishlistTabProps {
  wishlists: Wishlist[];
  wallets: Wallet[];
}

export function WishlistTab({ wishlists, wallets }: WishlistTabProps) {
  const calculateDailySaving = (targetAmount: number, savedAmount: number, targetDate: string | null) => {
    if (!targetDate) return null;
    
    const remainingAmount = targetAmount - savedAmount;
    if (remainingAmount <= 0) return 0;

    const daysRemaining = differenceInDays(new Date(targetDate), new Date());
    if (daysRemaining <= 0) return remainingAmount; // Should save all today if overdue

    return Math.ceil(remainingAmount / daysRemaining);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Wishlist Saya</h2>
        <CreateWishlistDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlists.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg border-dashed text-muted-foreground">
            Tidak ada item wishlist. Mulailah bermimpi!
          </div>
        ) : (
          wishlists.map((item) => {
            const progress = Math.min(100, (item.saved_amount / item.target_amount) * 100);
            const dailySaving = calculateDailySaving(item.target_amount, item.saved_amount, item.target_date);
            const isCompleted = item.saved_amount >= item.target_amount;

            return (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {item.item_name}
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    Rp {item.target_amount.toLocaleString("id-ID")}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Terkumpul: Rp {item.saved_amount.toLocaleString("id-ID")}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    {dailySaving !== null && dailySaving > 0 && !isCompleted && (
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        Nabung Rp {dailySaving.toLocaleString("id-ID")}/hari lagi!
                      </p>
                    )}
                    {isCompleted && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        Target tercapai! 🎉
                      </p>
                    )}
                    
                    {!isCompleted && (
                      <AddSavingsDialog
                        wishlistId={item.id}
                        wishlistName={item.item_name}
                        currentSaved={item.saved_amount}
                        targetAmount={item.target_amount}
                        wallets={wallets}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
