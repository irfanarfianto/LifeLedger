 
# 🗄️ Database Schema (Full Version)

  

Dokumen ini berisi struktur database lengkap untuk **LifeLedger**, mencakup fitur Keuangan, Produktivitas, Integrasi Hybrid, serta fitur lanjutan seperti Split Bill dan Subscription.

  

## 1. 📊 Visual Structure (ERD)

  

Diagram ini menggambarkan hubungan antar tabel. Perhatikan garis penghubung pada `TRANSACTIONS` yang menjadi pusat data (menghubungkan dompet, kategori, tugas, langganan, dll).

  

```mermaid

erDiagram

    PROFILES ||--o{ WALLETS : owns

    PROFILES ||--o{ CATEGORIES : owns

    PROFILES ||--o{ TASKS : owns

    PROFILES ||--o{ TRANSACTIONS : makes

    PROFILES ||--o{ SUBSCRIPTIONS : has

    PROFILES ||--o{ WISHLISTS : wants

    PROFILES ||--o{ DEBTS : tracks



    TASKS ||--o{ TRANSACTIONS : hybrid_link

    SUBSCRIPTIONS ||--o{ TRANSACTIONS : generates

    WISHLISTS ||--o{ TRANSACTIONS : saves_for

    WALLETS ||--o{ TRANSACTIONS : funds

    CATEGORIES ||--o{ TRANSACTIONS : classifies


    TRANSACTIONS {

        uuid id PK

        numeric amount

        boolean is_reimbursable "Fitur Worker"

        boolean is_potential_leak "Fitur Bocor Halus"

        uuid related_task_id FK "Link ke Kegiatan"

    }

  ```

## 2. 📚 Data Dictionary (Struktur Tabel Detail)

Rincian kolom, tipe data, dan kegunaan setiap tabel.
#### A. Core Tables (User & Finance)

**1. Tabel `profiles` (Data Pengguna)**

- **`id`** (`UUID`, PK): Primary Key. Terhubung langsung dengan `auth.users`.
    
- **`full_name`** (`Text`): Nama lengkap pengguna.
    
- **`role`** (`Text`): Peran pengguna (`student`, `worker`, `freelancer`).
    
- **`avatar_url`** (`Text`): Link foto profil.

**2. Tabel `wallets` (Dompet & Rekening)

- **`id`** (`UUID`, PK): ID Unik Dompet.
    
- **`name`** (`Text`): Contoh: "BCA", "Dompet Saku", "Gopay".
    
- **`type`** (`Text`): Jenis: `cash`, `bank`, `ewallet`, `investment`.
    
- **`initial_balance`** (`Numeric`): Saldo awal saat dompet dibuat.
    
- **`current_balance`** (`Numeric`): **Auto-Update**. Berubah otomatis via Trigger saat ada transaksi.

**3. Tabel `categories` (Pos Anggaran)

- **`id`** (`UUID`, PK): ID Unik Kategori.
    
- **`name`** (`Text`): Contoh: "Makan", "Transport", "Gaji".
    
- **`type`** (`Text`): `income` atau `expense`.
    
- **`budget_limit`** (`Numeric`): Batas anggaran bulanan (untuk fitur alert).

#### B. Productivity Tables (Planner)

** 4. Tabel `tasks` (Kegiatan & Tugas)

- **`id`** (`UUID`, PK): ID Unik Tugas.
    
- **`title`** (`Text`): Judul tugas/acara.
    
- **`due_date`** (`Timestamp`): Tanggal deadline atau jadwal acara.
    
- **`priority`** (`Text`): `high`, `medium`, `low`.
    
- **`status`** (`Text`): `pending`, `in_progress`, `completed`.
    
- **`is_event`** (`Boolean`): Jika `TRUE` muncul di Kalender. Jika `FALSE` hanya di To-Do List.
    
- **`estimated_cost`** (`Numeric`): Rencana anggaran untuk kegiatan ini (Planner Budget).

#### C. Advanced Features (Integrasi)

** 5. Tabel `subscriptions` (Langganan Rutin)

- **`id`** (`UUID`, PK): ID Langganan.
    
- **`name`** (`Text`): Contoh: "Netflix", "Spotify".
    
- **`cost`** (`Numeric`): Biaya per siklus.
    
- **`due_date_day`** (`Integer`): Tanggal jatuh tempo (1-31).
    
- **`is_active`** (`Boolean`): Status langganan aktif/tidak.

** 6. Tabel `wishlists` (Target Tabungan)

- **`id`** (`UUID`, PK): ID Wishlist.
    
- **`item_name`** (`Text`): Barang yang ingin dibeli.
    
- **`target_amount`** (`Numeric`): Harga barang.
    
- **`saved_amount`** (`Numeric`): Uang yang sudah dialokasikan ke sini.

** 7. Tabel `debts` (Split Bill / Utang)

- **`id`** (`UUID`, PK): ID Catatan Utang.
    
- **`person_name`** (`Text`): Nama orang (teman/kerabat).
    
- **`amount`** (`Numeric`): Nominal uang.
    
- **`type`** (`Text`): `i_owe` (Saya Hutang) atau `they_owe` (Saya Mengutangi).
    
- **`is_paid`** (`Boolean`): Status lunas.

#### D. The Master Table (Transactions)

** 8. Tabel `transactions`

- **`id`** (`UUID`, PK): ID Unik Transaksi.
    
- **`amount`** (`Numeric`): Jumlah uang (Rupiah).
    
- **`transaction_type`** (`Text`): `income`, `expense`, `transfer`.
    
- **`wallet_id`** (`UUID`, FK): Sumber dana (`-> wallets`).
    
- **`category_id`** (`UUID`, FK): Klasifikasi pengeluaran (`-> categories`).
    
- **`related_task_id`** (`UUID`, FK): **FITUR HYBRID** - Menghubungkan biaya ke Event/Tugas (`-> tasks`).
    
- **`subscription_id`** (`UUID`, FK): Jika transaksi ini pembayaran langganan (`-> subscriptions`).
    
- **`wishlist_id`** (`UUID`, FK): Jika transaksi ini menabung ke wishlist (`-> wishlists`).
    
- **`debt_id`** (`UUID`, FK): Jika transaksi ini pelunasan utang (`-> debts`).
    
- **`is_reimbursable`** (`Boolean`): Flag untuk Worker (Klaim kantor).
    
- **`is_potential_leak`** (`Boolean`): Flag otomatis sistem (Bocor Halus).
  

## 3. ⚙️ Implementation (SQL Code)

  

> [!WARNING] SQL Execution


```sql

-- 1. Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wallets
CREATE TABLE wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cash', 'bank', 'ewallet', 'investment')),
  initial_balance NUMERIC DEFAULT 0,
  current_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  icon TEXT,
  budget_limit NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

  

-- 4. Tasks

CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  is_event BOOLEAN DEFAULT FALSE,
  estimated_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  cost NUMERIC NOT NULL,
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly')),
  due_date_day INT CHECK (due_date_day BETWEEN 1 AND 31),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Wishlists
CREATE TABLE wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  item_name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  saved_amount NUMERIC DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Debts
CREATE TABLE debts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  person_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT CHECK (type IN ('i_owe', 'they_owe')),
  is_paid BOOLEAN DEFAULT FALSE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Transactions (Master)
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  wishlist_id UUID REFERENCES wishlists(id) ON DELETE SET NULL,
  debt_id UUID REFERENCES debts(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('income', 'expense', 'transfer')),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  note TEXT,
  is_reimbursable BOOLEAN DEFAULT FALSE,
  is_potential_leak BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Automation Trigger
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE' OR TG_OP = 'UPDATE') THEN
    IF OLD.transaction_type = 'income' THEN
      UPDATE wallets SET current_balance = current_balance - OLD.amount WHERE id = OLD.wallet_id;
    ELSIF OLD.transaction_type = 'expense' THEN
      UPDATE wallets SET current_balance = current_balance + OLD.amount WHERE id = OLD.wallet_id;
    END IF;
  END IF;
  
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.transaction_type = 'income' THEN
      UPDATE wallets SET current_balance = current_balance + NEW.amount WHERE id = NEW.wallet_id;
    ELSIF NEW.transaction_type = 'expense' THEN
      UPDATE wallets SET current_balance = current_balance - NEW.amount WHERE id = NEW.wallet_id;
    END IF;
  END IF;
  RETURN NULL;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER on_transaction_change
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balance();

-- 10. 🔒 Security Policies (RLS) - LENGKAP
-- A. Aktifkan RLS untuk SEMUA Tabel
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- B. Policy untuk Tabel 'profiles'
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- C. Policy untuk Tabel 'wallets'
CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallets" ON wallets FOR DELETE USING (auth.uid() = user_id);
 
-- D. Policy untuk Tabel 'categories'
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- E. Policy untuk Tabel 'tasks'
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- F. Policy untuk Tabel 'transactions'
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- G. Policy untuk Tabel 'subscriptions'
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON subscriptions FOR DELETE USING (auth.uid() = user_id);

-- H. Policy untuk Tabel 'wishlists'
CREATE POLICY "Users can view own wishlists" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlists" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wishlists" ON wishlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlists" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- I. Policy untuk Tabel 'debts'
CREATE POLICY "Users can view own debts" ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts" ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts" ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts" ON debts FOR DELETE USING (auth.uid() = user_id);