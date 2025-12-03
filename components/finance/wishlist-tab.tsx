import { Wishlist, Wallet } from "@/lib/actions/finance";
import { WishlistCard } from "./wishlist-card";

interface WishlistTabProps {
  wishlists: Wishlist[];
  wallets: Wallet[];
}

export function WishlistTab({ wishlists, wallets }: WishlistTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wishlists.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg border-dashed text-muted-foreground">
            Tidak ada item wishlist. Mulailah bermimpi!
          </div>
        ) : (
          wishlists.map((item) => (
            <WishlistCard key={item.id} item={item} wallets={wallets} />
          ))
        )}
      </div>
    </div>
  );
}
