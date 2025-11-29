"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { updateUserRole } from "@/lib/actions/profile";
import { toast } from "sonner";
import { Loader2, GraduationCap, Briefcase, Laptop } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingDialogProps {
  currentRole?: string;
}

export function OnboardingDialog({ currentRole }: OnboardingDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"student" | "worker" | "freelancer">("student");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If role is 'general' (default) or missing, show the dialog
    if (!currentRole || currentRole === "general") {
      setOpen(true);
    }
  }, [currentRole]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await updateUserRole(role);
      toast.success("Profil berhasil diperbarui!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Selamat Datang di LifeLedger! 👋</DialogTitle>
          <DialogDescription className="text-center">
            Untuk pengalaman terbaik, beri tahu kami status Anda saat ini.
            Kami akan menyesuaikan fitur sesuai kebutuhan Anda.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <RadioGroup value={role} onValueChange={(val: "student" | "worker" | "freelancer") => setRole(val)} className="grid grid-cols-1 gap-4">
            <div>
              <RadioGroupItem value="student" id="student" className="peer sr-only" />
              <Label
                htmlFor="student"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Mahasiswa / Pelajar</div>
                    <p className="text-sm text-muted-foreground">Fokus pada hemat uang saku & wishlist.</p>
                  </div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="worker" id="worker" className="peer sr-only" />
              <Label
                htmlFor="worker"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Pekerja Kantoran</div>
                    <p className="text-sm text-muted-foreground">Kelola gaji, reimburse, & cost of time.</p>
                  </div>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="freelancer" id="freelancer" className="peer sr-only" />
              <Label
                htmlFor="freelancer"
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300">
                    <Laptop className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Freelancer</div>
                    <p className="text-sm text-muted-foreground">Lacak invoice, proyek, & pendapatan tidak tetap.</p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full text-lg h-12">
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Mulai Perjalanan Saya 🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
