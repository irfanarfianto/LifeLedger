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
import { createCategory } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface CreateCategoryDialogProps {
  trigger?: React.ReactNode;
}

export function CreateCategoryDialog({ trigger }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("expense");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await createCategory(formData);
      toast.success("Kategori berhasil dibuat");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal membuat kategori");
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
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
            <DialogDescription>
              Kategorikan transaksi Anda untuk pelacakan yang lebih baik.
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
                placeholder="cth. Makanan, Gaji"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipe
              </Label>
              <div className="col-span-3">
                <Select name="type" required defaultValue="expense" onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {type === "expense" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget_limit_display" className="text-right">
                  Batas Anggaran
                </Label>
                <div className="col-span-3">
                  <CurrencyInput
                    id="budget_limit_display"
                    placeholder="Rp 0 (Opsional)"
                    onChange={(value) => {
                      const hiddenInput = document.getElementById("budget_limit") as HTMLInputElement;
                      if (hiddenInput) hiddenInput.value = value.toString();
                    }}
                  />
                  <input type="hidden" id="budget_limit" name="budget_limit" value="0" />
                  <p className="text-[0.8rem] text-muted-foreground mt-1">
                    Biarkan 0 jika tidak ada batas.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Kategori
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
