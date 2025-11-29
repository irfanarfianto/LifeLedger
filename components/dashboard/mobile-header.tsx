"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { HelpCircle } from "lucide-react";

const helpContent: Record<string, { title: string; description: string; tips: string[] }> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Halaman utama untuk melihat ringkasan aktivitas Anda.",
    tips: [
      "Lihat saldo total Anda di kartu Balance",
      "Fokus pada tugas prioritas tinggi di bagian 'Fokus Hari Ini'",
      "Gunakan Pomodoro timer untuk meningkatkan produktivitas",
      "Klik icon gear di Pomodoro untuk custom waktu fokus"
    ]
  },
  "/dashboard/finance": {
    title: "Keuangan",
    description: "Kelola semua aspek keuangan Anda dalam satu tempat.",
    tips: [
      "Tab 'Ringkasan & Transaksi': Lihat semua transaksi dan tambah transaksi baru",
      "Tab 'Dompet': Kelola berbagai dompet (tunai, bank, e-wallet, investasi)",
      "Tab 'Keinginan': Catat barang yang ingin dibeli dan lacak progressnya",
      "Tab 'Hutang': Catat hutang piutang agar tidak lupa",
      "Gunakan tombol '+' untuk menambah transaksi cepat"
    ]
  },
  "/dashboard/tasks": {
    title: "Perencana (Planner)",
    description: "Rencanakan dan kelola tugas Anda dengan efektif.",
    tips: [
      "Tab 'Kalender': Lihat tugas berdasarkan tanggal",
      "Tab 'Eisenhower Matrix': Prioritaskan tugas berdasarkan urgensi dan kepentingan",
      "Brain Dump: Tulis ide atau tugas yang terlintas di pikiran",
      "Habit Tracker: Lacak kebiasaan harian Anda",
      "Tandai tugas sebagai urgent untuk highlight merah"
    ]
  },
  "/dashboard/analytics": {
    title: "Analitik & Laporan",
    description: "Analisis pola keuangan dan produktivitas Anda.",
    tips: [
      "Expense Pie Chart: Lihat distribusi pengeluaran per kategori",
      "Cost of Time Calculator: Hitung nilai waktu Anda (untuk pekerja/freelancer)",
      "Bocor Halus: Deteksi pengeluaran kecil yang sering terlupakan",
      "Gunakan insight untuk membuat keputusan finansial lebih baik"
    ]
  },
  "/dashboard/settings": {
    title: "Pengaturan",
    description: "Kelola profil dan preferensi aplikasi Anda.",
    tips: [
      "Tab 'Profil & Persona': Ubah nama dan role (Mahasiswa/Pekerja/Freelancer)",
      "Mahasiswa: Set budget semester untuk tracking",
      "Pekerja: Input gaji dan potongan untuk kalkulasi otomatis",
      "Tab 'Kategori': Kelola kategori pemasukan dan pengeluaran",
      "Tab 'Langganan': Lacak semua subscription bulanan/tahunan",
      "Tab 'Akun': Logout dari aplikasi"
    ]
  }
};

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const currentHelp = helpContent[pathname] || {
    title: "Bantuan",
    description: "Panduan penggunaan fitur Life Ledger",
    tips: ["Navigasi menggunakan bottom bar", "Klik icon '?' untuk bantuan di setiap halaman"]
  };

  return (
    <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            LifeLedger
          </span>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] px-6">
            <SheetHeader className="text-left">
              <SheetTitle>{currentHelp.title}</SheetTitle>
              <SheetDescription>{currentHelp.description}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4 pb-6">
              <h4 className="font-semibold text-sm">💡 Tips & Panduan:</h4>
              <ul className="space-y-4">
                {currentHelp.tips.map((tip, index) => (
                  <li key={index} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-primary font-semibold shrink-0">{index + 1}.</span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
