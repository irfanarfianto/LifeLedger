
# 🗺️ Development Roadmap & Sitemap

Dokumen ini berisi panduan tahapan pengerjaan (*Phasing*) dan struktur halaman website (*Sitemap*) beserta fungsi detail di dalamnya.

---

## I. Development Flow (Tahapan Pengerjaan)

Kita menggunakan pendekatan **Iterative**. Fokus selesaikan satu fase hingga tuntas sebelum pindah ke fase berikutnya.

### 🟢 Phase 1: The Foundation (Minggu 1)
*Goal: User bisa login, database siap, dan navigasi dasar berjalan.*
- [x] **Setup Project:** Next.js 14 + Supabase + Tailwind + Shadcn/UI.
- [x] **Auth:** Halaman Login & Register (Google Auth & Email).
- [x] **Middleware:** Proteksi halaman `/dashboard` (Redirect jika belum login).
- [x] **Database Deployment:** Push schema SQL final ke Supabase.
- [x] **Layouting:** Membuat Sidebar (Desktop) & Bottom Nav (Mobile).

### 🟡 Phase 2: Core Finance (Minggu 2)
*Goal: User bisa mencatat keuangan (Basic Expense Tracker).*
- [ ] **CRUD Wallets:** Fitur tambah/edit dompet (Saldo Awal).
- [ ] **CRUD Categories:** Master data kategori pengeluaran.
- [ ] **CRUD Transactions:** Form input standar (Amount, Wallet, Category).
- [ ] **Backend Logic:** Verifikasi Trigger Database untuk update saldo otomatis.
- [ ] **UI Finance:** Menampilkan list transaksi dan total saldo di card.

### 🟠 Phase 3: Core Productivity (Minggu 3)
*Goal: User bisa mencatat jadwal dan tugas.*
- [ ] **CRUD Tasks:** Form input tugas (Judul, Priority, Due Date).
- [ ] **Calendar Integration:** Setup library kalender (FullCalendar / React-Big-Calendar).
- [ ] **Kanban View:** Implementasi Eisenhower Matrix (4 Kuadran).
- [ ] **Habit Tracker:** Komponen checklist sederhana di sidebar planner.

### 🔴 Phase 4: The Hybrid Integration (Minggu 4)
*Goal: Menggabungkan Phase 2 & 3 (Fitur Unggulan).*
- [ ] **Hybrid Link:** Modifikasi Form Transaksi agar bisa memilih `Related Task/Event`.
- [ ] **Subscription Logic:** Auto-generate "Ghost Task" di kalender berdasarkan data subscription.
- [ ] **Cost of Event UI:** Menampilkan Progress Bar (Budget vs Realisasi) di detail event.
- [ ] **Split Bill Logic:** Menambah input utang/piutang saat catat transaksi.

### 🟣 Phase 5: Persona & Intelligence (Minggu 5)
*Goal: Fitur pintar dan penyesuaian user.*
- [ ] **Bocor Halus Algorithm:** Query SQL untuk mendeteksi pengeluaran kecil berulang.
- [ ] **Time is Money Calc:** Input gaji -> hitung hourly rate -> alert saat procrastinate.
- [ ] **Gamification:** Logika confetti 🎉 jika semua task High Priority selesai.
- [ ] **Persona Toggles:** Menyembunyikan/memunculkan fitur berdasarkan role (Student/Worker).

---

## II. Sitemap & Functional Requirements

Daftar halaman yang harus dibuat beserta fitur spesifik di dalamnya.

### 1. 🔐 Authentication
* **Route:** `/login`
* **Fitur:**
    * Tombol **"Sign in with Google"**.
    * Form Login Email/Password.
    * Link ke Register & Forgot Password.

### 2. 🏠 Dashboard (Pusat Kontrol)
* **Route:** `/dashboard`
* **Komponen:**
    * **Greeting Card:** Sapaan user + Quote Motivasi Random.
    * **Balance Card:** Total Saldo (Semua Wallet).
        * *Logic:* Jika saldo < limit, ubah background jadi Merah (**Low Balance Alert**).
    * **Pomodoro Widget:** Timer 25 menit (Floating/Sticky).
    * **Today's Focus:** List 3 Task prioritas tertinggi (High).
    * **Productivity Reward:** Animasi Confetti jika semua focus task selesai.

### 3. 💸 Finance Module
* **Route:** `/finance`
* **Tabs:**
    * **Tab 1: Overview & Transactions**
        * List Transaksi (Filter by Date/Category).
        * **FAB (Floating Action Button):** Tambah Transaksi Baru.
            * *Form:* Amount, Category, Wallet.
            * *Toggle:* **"Link to Activity?"** (Dropdown pilih Task).
            * *Toggle:* **"Split Bill?"** (Input nama teman & nominal).
            * *Toggle:* **"Reimbursable?"** (Khusus Worker).
    * **Tab 2: Wallets**
        * Card Dompet (BCA, Gopay, Cash) dengan saldo real-time.
        * Tombol Transfer antar dompet.
    * **Tab 3: Wishlist**
        * List barang impian.
        * Progress Bar: `(Saved / Target) * 100%`.
        * Insight: "Nabung Rp X/hari lagi!".
    * **Tab 4: Debts**
        * List Hutang & Piutang.
        * Tombol "Mark as Paid" (Lunas).

### 4. 📅 Planner Module
* **Route:** `/planner`
* **Views:**
    * **Calendar View:** Tampilan bulanan.
        * Menampilkan Event/Tugas.
        * **Subscription Icon:** Logo Netflix/Spotify di tanggal tagihan.
    * **Eisenhower Matrix:** Tampilan Grid 2x2 (Do First, Schedule, Delegate, Eliminate).
* **Fitur Detail Task (Modal):**
    * Edit Judul/Waktu.
    * **Budget vs Actual:** Menampilkan "Rencana Rp 500rb" vs "Realisasi Rp 450rb" (Data dari `transactions`).
* **Sidebar Tools:**
    * **Brain Dump:** Textarea bebas + tombol "Convert to Task".
    * **Habit Tracker:** Checklist harian.

### 5. 📊 Analytics & Reports
* **Route:** `/analytics`
* **Fitur:**
    * **Pie Chart:** Pengeluaran per Kategori.
    * **Bocor Halus Card:** Alert pengeluaran kecil yang sering.
    * **Cost of Time (Worker):**
        * Input: Gaji Bulanan.
        * Output: "Harga 1 jam kamu = Rp X".
        * Statistik: "Minggu ini kamu membuang waktu senilai Rp Y".

### 6. ⚙️ Settings / Profile
* **Route:** `/settings`
* **Fitur:**
    * **Profile Update:** Foto & Nama.
    * **Persona Setting:** Dropdown (Mahasiswa / Pekerja / Freelancer).
        * *Mahasiswa:* Input "Uang Saku Semesteran".
        * *Pekerja:* Input "Gaji Kotor & Potongan" (**Slip Gaji Checker**).
    * **Category Management:** Tambah/Edit kategori.
    * **Subscription Management:** Input langganan & tanggal tagihan.

---

> [!TIP] Recommended Coding Order
> 1. `/login`
> 2. `/dashboard` (Skeleton)
> 3. `/finance` (Prioritas Utama)
> 4. `/planner`
> 5. `/analytics`