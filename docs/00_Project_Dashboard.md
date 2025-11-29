# 🚀 LifeLedger: Project Dashboard

> [!INFO] Project Summary
> Aplikasi web **Hybrid-Management** yang menggabungkan pencatatan keuangan (*Expense Tracker*) dan produktivitas (*Task Planner*). 
> **Goal Utama:** Memberikan wawasan "Cost of Activity" (Berapa biaya dari sebuah kegiatan) serta fitur spesifik untuk Mahasiswa & Pekerja.

## 🔗 Quick Links
- [[01_Database_Schema|🗄️ Database Schema (Full)]]
- [[03_Feature_Specs|📋 Feature Specifications]]
- [[04_User_Flows|🔄 User Flows Diagram]]
- [[02_Dev_Log|📓 Daily Dev Log]]
- **Repository:** https://github.com/irfanarfianto/LifeLedger.git
- **Supabase Dashboard:** `[Link Dashboard]`

---

## 🎯 Roadmap & Progress

### 🏗️ Phase 1: Foundation (Minggu 1)
*Membangun pondasi aplikasi dan database.*
- [x] Inisialisasi Project (`npx create-next-app -e with-supabase`)
- [ ] Setup Environment Variables (`.env.local`)
- [ ] **Database:** Run SQL Script Full Version di Supabase
- [ ] **Auth:** Buat halaman Login/Register Custom
- [ ] Setup Row Level Security (RLS) Policies

### 💸 Phase 2: Core Finance (Minggu 2)
*Fitur dasar manajemen uang.*
- [ ] Fitur: CRUD Dompet (Wallets) & Kategori
- [ ] Fitur: Input Transaksi (Income/Expense/Transfer)
- [ ] **Backend:** Pastikan Trigger Update Saldo berjalan
- [ ] UI: Dashboard Saldo Real-time
- [ ] Fitur: Low Balance Alert (Mode "Dompet Menipis")

### 📅 Phase 3: Core Productivity (Minggu 3)
*Fitur dasar manajemen waktu.*
- [ ] Fitur: CRUD Tasks (To-Do List)
- [ ] Fitur: Tampilan Kalender (Calendar View)
- [ ] Logic: Eisenhower Matrix (Sorting Priority)
- [ ] Fitur: Pomodoro Timer Widget

### 🚀 Phase 4: Advanced & Hybrid (Minggu 4)
*Fitur unggulan yang membedakan LifeLedger.*
- [ ] **Hybrid Link:** Dropdown untuk menghubungkan Transaksi <-> Task
- [ ] **Subscriptions:** Modul manajemen langganan rutin
- [ ] **Wishlist:** Modul tabungan target dengan progress bar
- [ ] **Split Bill:** Modul mencatat utang/piutang teman
- [ ] Analytics: Grafik "Cost of Activity"

### 🎨 Phase 5: Persona & Polish (Minggu 5)
*Finishing touch dan penyesuaian user.*
- [ ] **Persona Logic:** Toggle fitur Worker (Reimburse) vs Student (Semester Budget)
- [ ] **UI/UX Polish:** Dark Mode, Loading States, Toast Notifications
- [ ] **Testing:** Cek kebocoran data (RLS Test)
- [ ] **Deploy:** Vercel Production

---

## 🛠️ Tech Stack Cheatsheet

| Komponen | Teknologi | Catatan |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router) | Gunakan Server Actions untuk Mutasi Data |
| **Styling** | Tailwind CSS + ShadcnUI | Komponen UI modern & cepat |
| **Backend** | Supabase | PostgreSQL Database + Auth |
| **Icons** | Lucide React | Icon set standar |
| **Charts** | Recharts | Untuk grafik keuangan |
| **Date** | date-fns | Manipulasi tanggal & format |

---

> [!TIP] Focus of The Week
> Saat ini kita sedang berada di **Phase 1**. Pastikan Database Schema sudah di-upload ke Supabase sebelum mulai coding Frontend.