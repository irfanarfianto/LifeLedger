"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createWallet } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface CreateWalletDialogProps {
  trigger?: React.ReactNode;
}

export function CreateWalletDialog({ trigger }: CreateWalletDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await createWallet(formData);
      toast.success("Dompet berhasil dibuat");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal membuat dompet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Dompet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Dompet Baru</DialogTitle>
            <DialogDescription>
              Buat dompet baru untuk melacak aset Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="cth. Dompet Utama"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipe
              </Label>
              <div className="col-span-3">
                <Select name="type" required defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                    <SelectItem value="investment">Investasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initial_balance_display" className="text-right">
                Saldo Awal
              </Label>
              <div className="col-span-3">
                <CurrencyInput
                  id="initial_balance_display"
                  name="initial_balance_display"
                  placeholder="Rp 0"
                  required
                  onChange={(value) => {
                    const hiddenInput = document.getElementById("initial_balance") as HTMLInputElement;
                    if (hiddenInput) {
                      hiddenInput.value = value.toString();
                    }
                  }}
                />
                <input type="hidden" id="initial_balance" name="initial_balance" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Dompet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
