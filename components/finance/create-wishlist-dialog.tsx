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
import { createWishlist } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function CreateWishlistDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.append("target_date", date.toISOString());
    }
    
    try {
      await createWishlist(formData);
      toast.success("Item keinginan berhasil dibuat");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal membuat item keinginan");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Keinginan</DialogTitle>
            <DialogDescription>
              Apa yang sedang Anda tabung?
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
                  required
                  onChange={(value) => {
                    const hiddenInput = document.getElementById("target_amount") as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = value.toString();
                  }}
                />
                <input type="hidden" id="target_amount" name="target_amount" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="saved_amount_display" className="text-right">
                Terkumpul
              </Label>
              <div className="col-span-3">
                <CurrencyInput
                  id="saved_amount_display"
                  placeholder="Rp 0 (Opsional)"
                  onChange={(value) => {
                    const hiddenInput = document.getElementById("saved_amount") as HTMLInputElement;
                    if (hiddenInput) hiddenInput.value = value.toString();
                  }}
                />
                <input type="hidden" id="saved_amount" name="saved_amount" value="0" />
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
              Simpan Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
