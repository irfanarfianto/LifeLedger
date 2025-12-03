"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import { createReminder, deleteReminder, toggleReminder, type SavingsReminder } from "@/lib/actions/reminders";
import { messaging } from "@/lib/firebase/config";
import { getToken } from "firebase/messaging";
import { createClient } from "@/lib/supabase/client";

const DAYS = [
  { label: "Min", value: 0 },
  { label: "Sen", value: 1 },
  { label: "Sel", value: 2 },
  { label: "Rab", value: 3 },
  { label: "Kam", value: 4 },
  { label: "Jum", value: 5 },
  { label: "Sab", value: 6 },
];

export function ReminderSettings({ initialReminders }: { initialReminders: SavingsReminder[] }) {
  const router = useRouter();
  const [reminders, setReminders] = useState(initialReminders);
  
  // Sync state with props when router.refresh() updates the server data
  useEffect(() => {
    setReminders(initialReminders);
  }, [initialReminders]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTime, setNewTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [title, setTitle] = useState("Waktunya Menabung! 💰");

  const initializeFCM = async () => {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) return;

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const msg = await messaging();
        if (!msg) return;

        let registration;
        if ('serviceWorker' in navigator) {
          if (process.env.NODE_ENV === 'development') {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          } else {
            registration = await navigator.serviceWorker.ready;
          }

          const token = await getToken(msg, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
          });

          if (token) {
            console.log("FCM Token generated manually:", token);
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              await supabase
                .from("profiles")
                .upsert({ id: user.id, fcm_token: token }, { onConflict: "id" });
              console.log("FCM Token saved manually");
            }
          }
        }
      }
    } catch (error) {
      console.error("Manual FCM initialization failed:", error);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      // Try to initialize FCM when creating a reminder
      await initializeFCM();

      await createReminder({
        reminder_time: newTime,
        days: selectedDays.sort((a, b) => a - b),
        title,
        body: "Sisihkan sedikit rezekimu untuk masa depan.",
      });
      toast.success("Pengingat berhasil dibuat");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal membuat pengingat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleReminder(id, !currentStatus);
      setReminders(reminders.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r));
      toast.success("Status pengingat diperbarui");
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
      toast.success("Pengingat dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus pengingat");
    }
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pengingat Menabung</CardTitle>
          <CardDescription>Atur jadwal notifikasi untuk mengingatkan Anda menabung.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Pengingat Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Waktu</Label>
                <Input 
                  type="time" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Judul Notifikasi</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Contoh: Waktunya Menabung!"
                />
              </div>
              <div className="space-y-2">
                <Label>Hari</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day) => (
                    <Button
                      key={day.value}
                      type="button"
                      variant={selectedDays.includes(day.value) ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10 p-0 rounded-full"
                      onClick={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Belum ada pengingat yang diatur</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{reminder.reminder_time.slice(0, 5)}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.days.length === 7 
                      ? "Setiap Hari" 
                      : reminder.days.sort((a, b) => a - b).map(d => DAYS.find(day => day.value === d)?.label).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{reminder.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={reminder.is_active} 
                  onCheckedChange={() => handleToggle(reminder.id, reminder.is_active)} 
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleDelete(reminder.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
