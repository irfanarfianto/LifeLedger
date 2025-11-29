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
import { createTransaction, Wallet, Category } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface CreateTransactionDialogProps {
  wallets: Wallet[];
  categories: Category[];
  defaultType?: "income" | "expense" | "transfer";
  trigger?: React.ReactNode;
}

export function CreateTransactionDialog({ wallets, categories, defaultType = "expense", trigger }: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<"income" | "expense" | "transfer">(defaultType);
  
  // Advanced Toggles
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isReimbursable, setIsReimbursable] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.append("date", date.toISOString());
    }
    
    // Handle toggles
    if (isReimbursable) {
      formData.append("is_reimbursable", "on");
    }

    try {
      await createTransaction(formData);
      toast.success("Transaksi berhasil dibuat");
      setOpen(false);
      // Reset form state if needed
      setIsReimbursable(false);
      setShowAdvanced(false);
    } catch (error) {
      toast.error("Gagal membuat transaksi");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="fixed bottom-20 right-4 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-lg z-50">
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[95vh] flex flex-col">
        <form onSubmit={onSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Tambah Transaksi</DialogTitle>
            <DialogDescription className="text-xs">
              Catat pemasukan, pengeluaran, atau transfer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {/* Type Selection */}
            <div className="flex justify-center gap-2">
              <Button 
                type="button" 
                size="sm"
                variant={type === "expense" ? "default" : "outline"}
                onClick={() => setType("expense")}
                className={cn(type === "expense" && "bg-red-600 hover:bg-red-700")}
              >
                Pengeluaran
              </Button>
              <Button 
                type="button" 
                size="sm"
                variant={type === "income" ? "default" : "outline"}
                onClick={() => setType("income")}
                className={cn(type === "income" && "bg-green-600 hover:bg-green-700")}
              >
                Pemasukan
              </Button>
              <Button 
                type="button" 
                size="sm"
                variant={type === "transfer" ? "default" : "outline"}
                onClick={() => setType("transfer")}
                className={cn(type === "transfer" && "bg-blue-600 hover:bg-blue-700")}
              >
                Transfer
              </Button>
            </div>
            <input type="hidden" name="type" value={type} />

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="amount_display" className="text-right text-sm">
                Jumlah
              </Label>
              <div className="col-span-3">
                <CurrencyInput
                  id="amount_display"
                  placeholder="Rp 0"
                  required
                  onChange={(value) => {
                    const hiddenInput = document.getElementById("amount") as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = value.toString();
                  }}
                />
                <input type="hidden" id="amount" name="amount" />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="wallet_id" className="text-right text-sm">
                {type === "transfer" ? "Dari" : "Dompet"}
              </Label>
              <div className="col-span-3">
                <Select name="wallet_id" required>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih dompet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {type === "transfer" && (
               <div className="grid grid-cols-4 items-center gap-3">
               <Label htmlFor="to_wallet_id" className="text-right text-sm">
                 Ke
               </Label>
               <div className="col-span-3">
                 <Select name="to_wallet_id">
                   <SelectTrigger className="h-9">
                     <SelectValue placeholder="Pilih tujuan" />
                   </SelectTrigger>
                   <SelectContent>
                     {wallets.map((wallet) => (
                       <SelectItem key={wallet.id} value={wallet.id}>
                         {wallet.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             </div>
            )}

            {type !== "transfer" && (
              <div className="grid grid-cols-4 items-center gap-3">
                <Label htmlFor="category_id" className="text-right text-sm">
                  Kategori
                </Label>
                <div className="col-span-3">
                  <Select name="category_id">
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right text-sm">Tanggal</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "d MMM yyyy", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="note" className="text-right text-sm">
                Catatan
              </Label>
              <Input
                id="note"
                name="note"
                placeholder="Catatan opsional"
                className="col-span-3 h-9"
              />
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center space-x-2 pt-1">
              <Switch 
                id="advanced-mode" 
                checked={showAdvanced} 
                onCheckedChange={setShowAdvanced} 
              />
              <Label htmlFor="advanced-mode" className="text-xs font-medium text-muted-foreground cursor-pointer">
                Opsi Lanjutan
              </Label>
            </div>

            {/* Advanced Fields */}
            {showAdvanced && (
              <div className="space-y-3 pt-2 border-t">
                
                {/* Reimbursable Toggle (Worker Persona) */}
                {type === "expense" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Dapat Diganti (Reimburse)?</Label>
                      <p className="text-xs text-muted-foreground">
                        Tandai jika akan diganti kantor/klien.
                      </p>
                    </div>
                    <Switch 
                      checked={isReimbursable}
                      onCheckedChange={setIsReimbursable}
                    />
                  </div>
                )}

              </div>
            )}

          </div>
          <DialogFooter className="flex-shrink-0 pt-3">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Transaksi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
