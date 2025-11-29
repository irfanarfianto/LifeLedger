"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Progress Keinginan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topWishlists.map((wishlist) => {
          const progress = (wishlist.saved_amount / wishlist.target_amount) * 100;
          return (
            <div key={wishlist.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{wishlist.item_name}</span>
                <span className="text-muted-foreground">
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
        })}
      </CardContent>
    </Card>
  );
}
