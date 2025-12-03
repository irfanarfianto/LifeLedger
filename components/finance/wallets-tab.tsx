"use client";

import { Wallet, Category } from "@/lib/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, CreditCard, Banknote, TrendingUp } from "lucide-react";

interface WalletsTabProps {
  wallets: Wallet[];
  categories: Category[];
}

export function WalletsTab({ wallets, categories }: WalletsTabProps) {
  const getIcon = (type: Wallet["type"]) => {
    switch (type) {
      case "cash":
        return <Banknote className="h-4 w-4 text-muted-foreground" />;
      case "bank":
        return <WalletIcon className="h-4 w-4 text-muted-foreground" />;
      case "ewallet":
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
      case "investment":
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      default:
        return <WalletIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-lg border-dashed text-muted-foreground">
            Tidak ada dompet ditemukan. Buat satu untuk memulai.
          </div>
        ) : (
          wallets.map((wallet) => (
            <Card key={wallet.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {wallet.name}
                </CardTitle>
                {getIcon(wallet.type)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {wallet.current_balance.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                  {wallet.type}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
