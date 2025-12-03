"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import Link from "next/link";
import type { Wishlist } from "@/lib/actions/finance";

interface WishlistProgressProps {
  wishlists: Wishlist[];
}

export function WishlistProgress({ wishlists }: WishlistProgressProps) {
  const topWishlists = wishlists.slice(0, 3);

  if (topWishlists.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Target Keuangan
        </CardTitle>
        <Link href="/dashboard/wishlist" className="text-sm text-primary hover:underline">
          Kelola
        </Link>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {topWishlists.length === 0 ? (
           <div className="text-center py-6 space-y-2">
             <p className="text-sm text-muted-foreground">Belum ada target keuangan</p>
             <Link href="/dashboard/wishlist" className="text-xs text-primary hover:underline">
               + Tambah Target Baru
             </Link>
           </div>
        ) : (
          topWishlists.map((wishlist) => {
            const progress = (wishlist.saved_amount / wishlist.target_amount) * 100;
            return (
              <div key={wishlist.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{wishlist.item_name}</span>
                  <span className="text-muted-foreground font-medium">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rp {wishlist.saved_amount.toLocaleString('id-ID')}</span>
                  <span>Rp {wishlist.target_amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
