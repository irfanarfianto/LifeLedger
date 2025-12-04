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
import { createDebt } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function CreateDebtDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("they_owe");
  const [date, setDate] = useState<Date>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await createDebt(formData);
      toast.success("Catatan hutang berhasil dibuat");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal membuat catatan hutang");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Catatan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Catat Hutang/Piutang</DialogTitle>
            <DialogDescription>
              Lacak siapa yang berhutang atau kepada siapa Anda berhutang.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="person_name" className="text-right">
                Nama Orang
              </Label>
              <Input
                id="person_name"
                name="person_name"
                placeholder="cth. Budi"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipe
              </Label>
              <div className="col-span-3">
                <Select name="type" required defaultValue="they_owe" onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="they_owe">Mereka Berhutang (Piutang)</SelectItem>
                    <SelectItem value="i_owe">Saya Berhutang (Hutang)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount_display" className="text-right">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Catatan
              </Label>
              <Input
                id="note"
                name="note"
                placeholder="cth. Makan siang"
                className="col-span-3"
              />
            </div>
            {type === "i_owe" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Jatuh Tempo
                </Label>
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
                        {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
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
                  <input type="hidden" name="due_date" value={date ? date.toISOString() : ""} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
