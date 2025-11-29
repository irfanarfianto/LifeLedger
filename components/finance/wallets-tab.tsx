"use client";

import { Wallet, Category } from "@/lib/actions/finance";
import { CreateWalletDialog } from "./create-wallet-dialog";
import { CreateTransactionDialog } from "./create-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet as WalletIcon, CreditCard, Banknote, TrendingUp, ArrowRightLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Dompet Saya</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <CreateTransactionDialog 
            wallets={wallets} 
            categories={categories} 
            defaultType="transfer"
            trigger={
              <Button variant="outline" className="flex-1 sm:flex-none">
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
              </Button>
            }
          />
          <CreateWalletDialog 
            trigger={
              <Button className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" /> Tambah
              </Button>
            }
          />
        </div>
      </div>
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
