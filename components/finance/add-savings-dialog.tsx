"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Wallet, saveForWishlist } from "@/lib/actions/finance";
import { toast } from "sonner";
import { PiggyBank } from "lucide-react";

interface AddSavingsDialogProps {
  wishlistId: string;
  wishlistName: string;
  currentSaved: number;
  targetAmount: number;
  wallets: Wallet[];
}

export function AddSavingsDialog({
  wishlistId,
  wishlistName,
  currentSaved,
  targetAmount,
  wallets,
}: AddSavingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedWalletId, setSelectedWalletId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const remaining = targetAmount - currentSaved;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWalletId) {
      toast.error("Pilih dompet sumber dana");
      return;
    }

    if (amount <= 0) {
      toast.error("Masukkan jumlah yang valid");
      return;
    }

    const wallet = wallets.find(w => w.id === selectedWalletId);
    if (wallet && wallet.current_balance < amount) {
      toast.error("Saldo dompet tidak mencukupi");
      return;
    }

    if (amount > remaining) {
      toast.error(`Jumlah melebihi sisa target (Rp ${remaining.toLocaleString("id-ID")})`);
      return;
    }

    startTransition(async () => {
      try {
        await saveForWishlist(wishlistId, amount, selectedWalletId);
        toast.success(`Berhasil menabung Rp ${amount.toLocaleString("id-ID")} untuk ${wishlistName}`);
        setOpen(false);
        setAmount(0);
        setSelectedWalletId("");
      } catch (error) {
        toast.error("Gagal menabung");
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-4">
          <PiggyBank className="mr-2 h-4 w-4" />
          Tabung
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tabung untuk {wishlistName}</DialogTitle>
          <DialogDescription>
            Alokasikan dana dari dompet Anda ke wishlist ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Sisa Target</Label>
            <div className="text-2xl font-bold">
              Rp {remaining.toLocaleString("id-ID")}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallet">Sumber Dana</Label>
            <Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih dompet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} (Rp {wallet.current_balance.toLocaleString("id-ID")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <CurrencyInput
              id="amount"
              placeholder="Rp 0"
              value={amount}
              onChange={setAmount}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
