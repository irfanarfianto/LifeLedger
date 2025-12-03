"use client";

import { useState } from "react";
import { Wallet, Category, Debt } from "@/lib/actions/finance";
import { WalletsTab } from "@/components/finance/wallets-tab";
import { DebtsTab } from "@/components/finance/debts-tab";
import { CreateWalletDialog } from "@/components/finance/create-wallet-dialog";
import { CreateTransactionDialog } from "@/components/finance/create-transaction-dialog";
import { CreateDebtDialog } from "@/components/finance/create-debt-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRightLeft, Plus } from "lucide-react";

interface WalletDebtManagerProps {
  wallets: Wallet[];
  categories: Category[];
  debts: Debt[];
}

export function WalletDebtManager({ wallets, categories, debts }: WalletDebtManagerProps) {
  const [activeTab, setActiveTab] = useState("wallets");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {activeTab === "wallets" ? "Dompet Saya" : "Catatan Hutang"}
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          {activeTab === "wallets" ? (
            <>
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
                    <Plus className="mr-2 h-4 w-4" /> Tambah Dompet
                  </Button>
                }
              />
            </>
          ) : (
            <CreateDebtDialog />
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="wallets">Dompet</TabsTrigger>
          <TabsTrigger value="debts">Hutang</TabsTrigger>
        </TabsList>
        <TabsContent value="wallets" className="mt-6">
          <WalletsTab wallets={wallets} categories={categories} />
        </TabsContent>
        <TabsContent value="debts" className="mt-6">
          <DebtsTab debts={debts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
