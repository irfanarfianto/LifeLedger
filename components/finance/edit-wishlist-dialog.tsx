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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWishlist, Wishlist } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Loader2, CalendarIcon, Pencil } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface EditWishlistDialogProps {
  wishlist: Wishlist;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWishlistDialog({ wishlist, open, onOpenChange }: EditWishlistDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [amount, setAmount] = useState(wishlist.target_amount);

  // Initialize/Reset state when dialog opens or wishlist changes
  useEffect(() => {
    if (open) {
      setDate(wishlist.target_date ? new Date(wishlist.target_date) : undefined);
      setAmount(wishlist.target_amount);
    }
  }, [open, wishlist]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.append("target_date", date.toISOString());
    }
    // Ensure amount is correct in formData (though hidden input handles it)
    
    try {
      await updateWishlist(wishlist.id, formData);
      toast.success("Item keinginan berhasil diperbarui");
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal memperbarui item keinginan");
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
            <DialogTitle>Edit Keinginan</DialogTitle>
            <DialogDescription>
              Ubah detail target tabungan Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item_name" className="text-right">
                Nama Item
              </Label>
              <Input
                id="item_name"
                name="item_name"
                defaultValue={wishlist.item_name}
                placeholder="cth. Laptop Baru"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target_amount_display" className="text-right">
                Target Dana
              </Label>
              <div className="col-span-3">
                <CurrencyInput
                  id="target_amount_display"
                  placeholder="Rp 0"
                  value={amount}
                  onChange={setAmount}
                  required
                />
                <input type="hidden" name="target_amount" value={amount} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Target Tanggal</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal (Opsional)</span>}
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
