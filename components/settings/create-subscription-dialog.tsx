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
import { createSubscription } from "@/lib/actions/finance";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";

interface CreateSubscriptionDialogProps {
  trigger?: React.ReactNode;
}

export function CreateSubscriptionDialog({ trigger }: CreateSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cost, setCost] = useState(0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("cost", cost.toString());

    try {
      await createSubscription(formData);
      toast.success("Langganan berhasil ditambahkan");
      setOpen(false);
      setCost(0);
    } catch (error) {
      toast.error("Gagal menambahkan langganan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Langganan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Langganan Baru</DialogTitle>
            <DialogDescription>
              Catat langganan rutin Anda seperti Netflix, Spotify, dll.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Layanan</Label>
              <Input id="name" name="name" placeholder="Contoh: Netflix Premium" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cost">Biaya</Label>
              <CurrencyInput 
                placeholder="Rp 0"
                value={cost}
                onChange={(val) => setCost(val)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billing_cycle">Siklus Tagihan</Label>
                <Select name="billing_cycle" defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="due_date_day">Tanggal Tagihan</Label>
                <Input 
                  id="due_date_day" 
                  name="due_date_day" 
                  type="number" 
                  min="1" 
                  max="31" 
                  placeholder="Tgl (1-31)" 
                  required 
                />
              </div>
            </div>
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
