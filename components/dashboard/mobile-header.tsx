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

    ]
  },
  "/dashboard/transactions": {
    title: "Transaksi",
    description: "Kelola pemasukan dan pengeluaran Anda.",
    tips: [
      "Lihat riwayat transaksi Anda",
      "Gunakan filter untuk mencari transaksi tertentu",
      "Tambah transaksi baru dengan tombol '+'",
      "Kategorikan transaksi untuk analisis yang lebih baik"
    ]
  },
  "/dashboard/wallets": {
    title: "Dompet",
    description: "Kelola sumber dana Anda.",
    tips: [
      "Tambah dompet baru (Bank, E-Wallet, Tunai)",
      "Lihat saldo per dompet",
      "Transfer antar dompet jika diperlukan",
      "Pastikan saldo sesuai dengan kenyataan"
    ]
  },
  "/dashboard/wishlist": {
    title: "Target Keuangan",
    description: "Rencanakan pembelian impian Anda.",
    tips: [
      "Buat target tabungan untuk barang impian",
      "Alokasikan dana ke target tertentu",
      "Pantau progress tabungan Anda",
      "Prioritaskan target yang paling penting"
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
