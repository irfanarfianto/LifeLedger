"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { updateCategory, Category } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(category.type);
  const [budgetLimit, setBudgetLimit] = useState(category.budget_limit);

  useEffect(() => {
    if (open) {
      setType(category.type);
      setBudgetLimit(category.budget_limit);
    }
  }, [open, category]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await updateCategory(category.id, formData);
      toast.success("Kategori berhasil diperbarui");
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal memperbarui kategori");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>
              Ubah detail kategori dan batas anggaran.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_name" className="text-right">
                Nama
              </Label>
              <Input
                id="edit_name"
                name="name"
                defaultValue={category.name}
                placeholder="cth. Makanan, Gaji"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_type" className="text-right">
                Tipe
              </Label>
              <div className="col-span-3">
                <Select name="type" required value={type} onValueChange={(value) => setType(value as "expense" | "income")}>
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
                <Label htmlFor="edit_budget_limit_display" className="text-right">
                  Batas Anggaran
                </Label>
                <div className="col-span-3">
                  <CurrencyInput
                    id="edit_budget_limit_display"
                    placeholder="Rp 0 (Opsional)"
                    value={budgetLimit}
                    onChange={setBudgetLimit}
                  />
                  <input type="hidden" name="budget_limit" value={budgetLimit} />
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
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
