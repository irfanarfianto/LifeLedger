"use client";

import { Task, updateTask, deleteTask } from "@/lib/actions/tasks";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Trash2, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface TaskDialogProps {
  task?: Task;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TaskDialog({ task, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: TaskDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(task?.due_date ? new Date(task.due_date) : undefined);
  const [isUrgent, setIsUrgent] = useState(task?.is_urgent || false);
  const [isImportant, setIsImportant] = useState(task?.is_important || false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    if (date) {
      formData.append("due_date", date.toISOString());
    }
    if (isUrgent) formData.append("is_urgent", "on");
    if (isImportant) formData.append("is_important", "on");

    try {
      if (task) {
        await updateTask(task.id, formData);
        toast.success("Tugas berhasil diperbarui");
      } else {
        // Create logic is handled by a separate CreateTaskDialog if needed, 
        // but this dialog can handle both if we import createTask.
        // For now, let's assume this is primarily for editing details or we import createTask dynamically.
        // Actually, let's import createTask to make it versatile.
        const { createTask } = await import("@/lib/actions/tasks");
        await createTask(formData);
        toast.success("Tugas berhasil dibuat");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Gagal menyimpan tugas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!task) return;
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    
    setIsLoading(true);
    try {
      await deleteTask(task.id);
      toast.success("Tugas dihapus");
      setOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus tugas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Tugas" : "Tambah Tugas"}</DialogTitle>
            <DialogDescription>
              Kelola detail tugas Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                name="title"
                defaultValue={task?.title}
                required
                placeholder="Apa yang perlu dilakukan?"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={task?.description || ""}
                placeholder="Detail tambahan..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prioritas</Label>
                <Select name="priority" defaultValue={task?.priority || "medium"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Tenggat Waktu</Label>
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
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t">
              <Label className="text-base font-semibold">Eisenhower Matrix</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mendesak (Urgent)?</Label>
                  <p className="text-xs text-muted-foreground">
                    Perlu perhatian segera.
                  </p>
                </div>
                <Switch checked={isUrgent} onCheckedChange={setIsUrgent} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Penting (Important)?</Label>
                  <p className="text-xs text-muted-foreground">
                    Berkontribusi pada misi jangka panjang.
                  </p>
                </div>
                <Switch checked={isImportant} onCheckedChange={setIsImportant} />
              </div>
            </div>

            {/* Budget vs Actual Placeholder - As requested */}
            {task && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                <h4 className="text-sm font-semibold mb-2">Anggaran vs Realisasi</h4>
                <div className="flex justify-between text-sm">
                  <span>Rencana: <span className="font-mono">Rp 0</span></span>
                  <span>Realisasi: <span className="font-mono">Rp 0</span></span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  *Fitur ini akan terhubung dengan transaksi di masa mendatang.
                </p>
              </div>
            )}

          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {task && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
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
