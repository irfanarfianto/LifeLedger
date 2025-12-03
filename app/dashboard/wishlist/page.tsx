import { Suspense } from "react";
import { WishlistTab } from "@/components/finance/wishlist-tab";
import { getWishlists, getWallets } from "@/lib/actions/finance";
import { FinanceSkeleton } from "@/components/finance/finance-skeleton";

import { CreateWishlistDialog } from "@/components/finance/create-wishlist-dialog";

async function WishlistContent() {
  const [wishlists, wallets] = await Promise.all([
    getWishlists(),
    getWallets(),
  ]);

  return (
    <WishlistTab wishlists={wishlists} wallets={wallets} />
  );
}

export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Target Keuangan</h1>
        <CreateWishlistDialog />
      </div>
      <Suspense fallback={<FinanceSkeleton />}>
        <WishlistContent />
      </Suspense>
    </div>
  );
}
