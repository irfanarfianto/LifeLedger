"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProfileDetails, deleteAccount } from "@/lib/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileSettingsProps {
  profile: any;
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string>(profile?.role || "student");
  const [semesterBudget, setSemesterBudget] = useState(profile?.semester_budget || 0);
  const [grossSalary, setGrossSalary] = useState(profile?.gross_salary || 0);
  const [salaryDeductions, setSalaryDeductions] = useState(profile?.salary_deductions || 0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.set("semester_budget", semesterBudget.toString());
    formData.set("gross_salary", grossSalary.toString());
    formData.set("salary_deductions", salaryDeductions.toString());

    try {
      await updateProfileDetails(formData);
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil Pengguna</CardTitle>
          <CardDescription>
            Kelola informasi pribadi dan preferensi akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={profile?.email || ""} 
                disabled 
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input 
                id="full_name" 
                name="full_name" 
                defaultValue={profile?.full_name || ""} 
                placeholder="Nama Anda" 
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Persona / Peran</Label>
              <Select name="role" value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Mahasiswa / Pelajar</SelectItem>
                  <SelectItem value="worker">Pekerja Kantoran</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Pilihan ini akan menyesuaikan fitur yang ditampilkan di dashboard.
              </p>
            </div>

            {role === "student" && (
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg border">
                <Label>Uang Saku Semesteran (Target)</Label>
                <CurrencyInput 
                  placeholder="Rp 0"
                  value={semesterBudget}
                  onChange={(val) => setSemesterBudget(val)}
                />
                <p className="text-xs text-muted-foreground">
                  Digunakan untuk menghitung sisa budget semester ini.
                </p>
              </div>
            )}

            {role === "worker" && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                <div className="space-y-2">
                  <Label>Gaji Kotor Bulanan</Label>
                  <CurrencyInput 
                    placeholder="Rp 0"
                    value={grossSalary}
                    onChange={(val) => setGrossSalary(val)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Potongan (Pajak/BPJS/Lainnya)</Label>
                  <CurrencyInput 
                    placeholder="Rp 0"
                    value={salaryDeductions}
                    onChange={(val) => setSalaryDeductions(val)}
                  />
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium flex justify-between">
                    <span>Estimasi Gaji Bersih:</span>
                    <span>Rp {(grossSalary - salaryDeductions).toLocaleString("id-ID")}</span>
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda dan semua data yang terkait secara permanen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog email={profile?.email} />
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteAccountDialog({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmEmail !== email) {
      toast.error("Email tidak cocok");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(email);
      toast.success("Akun berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus akun");
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Hapus Akun</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apakah Anda yakin?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ketik email Anda <strong>{email}</strong> untuk mengonfirmasi.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="confirm-email">Email Konfirmasi</Label>
          <Input
            id="confirm-email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={email}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            Batal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={confirmEmail !== email || isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus Akun Saya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
