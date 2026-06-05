# Tes Kognitif IWARE

Aplikasi web tes psikotes (Tes Kognitif) untuk seleksi karyawan baru **PT IWARE**.

## 📋 Deskripsi

Aplikasi ini digunakan untuk melakukan tes kognitif terhadap calon karyawan baru. Tes mencakup 50 soal (pilihan ganda & isian) dengan batas waktu 15 menit.

### Fitur Utama
- ✅ Alur lengkap: Pengenalan → Biodata → Instruksi → Tes → Selesai
- ✅ Timer 15 menit dengan peringatan saat waktu menipis
- ✅ Auto-save jawaban (tersimpan otomatis saat menjawab)
- ✅ Navigasi soal dengan penanda sudah/belum dijawab
- ✅ Anti-cheat (disable right-click, copy, back button)
- ✅ Responsive design (desktop & mobile)
- ✅ Admin panel untuk melihat hasil peserta
- ✅ Auto-scoring jika kunci jawaban tersedia

## 🛠 Tech Stack

| Layer      | Teknologi                                  |
|------------|-------------------------------------------|
| Frontend   | Next.js 15 (App Router) + TypeScript      |
| Styling    | Tailwind CSS v4                            |
| Backend    | Express.js 5 (REST API)                    |
| Database   | MySQL (phpMyAdmin)                         |

## 📁 Struktur Proyek

```
tesiware/
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/       # Pages (homepage, biodata, instruksi, tes, selesai, admin)
│   │   ├── components/ # Reusable components (Header, Stepper, Timer, etc.)
│   │   ├── data/      # Question data (questions.ts)
│   │   └── lib/       # API helper functions
│   └── .env.example
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── index.js   # Entry point
│   │   ├── db.js      # MySQL connection
│   │   └── routes/    # API routes
│   └── .env.example
├── database/
│   └── schema.sql     # MySQL schema + seed data
└── README.md
```

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** v18+ ([download](https://nodejs.org))
- **MySQL** v5.7+ dengan phpMyAdmin
- **npm** (sudah termasuk dalam Node.js)

### 1. Setup Database

1. Buka **phpMyAdmin** di browser (biasanya `http://localhost/phpmyadmin`)
2. Klik tab **SQL** atau **Import**
3. Salin dan jalankan seluruh isi file `database/schema.sql`
4. Pastikan database `tesiware` berhasil dibuat dengan 4 tabel:
   - `participants`
   - `questions` (50 soal sudah di-insert)
   - `sessions`
   - `answers`

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Salin file environment
cp .env.example .env

# Edit .env sesuai konfigurasi MySQL Anda
# (terutama DB_PASSWORD jika ada)

# Install dependencies
npm install

# Jalankan backend
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
# Buka terminal baru, masuk ke folder frontend
cd frontend

# Salin file environment
cp .env.example .env.local

# Install dependencies
npm install

# Jalankan frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

### 4. Akses Aplikasi

| Halaman        | URL                           |
|----------------|-------------------------------|
| Homepage       | http://localhost:3000          |
| Biodata        | http://localhost:3000/biodata  |
| Instruksi      | http://localhost:3000/instruksi|
| Tes            | http://localhost:3000/tes      |
| Selesai        | http://localhost:3000/selesai  |
| Admin Panel    | http://localhost:3000/admin    |

## 🔧 Konfigurasi

### Backend `.env`
```
PORT=5000
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tesiware
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

| Method | Endpoint                    | Deskripsi                        |
|--------|----------------------------|----------------------------------|
| POST   | `/api/participants`         | Simpan biodata peserta           |
| GET    | `/api/participants`         | List semua peserta (admin)       |
| GET    | `/api/participants/:id`     | Detail peserta + jawaban         |
| POST   | `/api/sessions`             | Mulai sesi tes                   |
| POST   | `/api/sessions/finish`      | Selesaikan sesi tes              |
| GET    | `/api/sessions/:pid`        | Info sesi peserta                |
| POST   | `/api/answers`              | Simpan jawaban (auto-save)       |
| POST   | `/api/answers/bulk`         | Simpan banyak jawaban sekaligus  |
| GET    | `/api/answers/:pid`         | Semua jawaban peserta            |
| GET    | `/api/health`               | Health check                     |

## 📝 Mengelola Soal

Soal dapat dikelola melalui dua cara:

1. **File `questions.ts`** (frontend) — edit data soal di `frontend/src/data/questions.ts`
2. **Tabel `questions`** (database) — edit/tambah soal melalui phpMyAdmin

Format soal:
```typescript
{
  id: 1,
  type: "pilihan_ganda", // atau "isian"
  text: "Teks soal...",
  options: ["a. Opsi A", "b. Opsi B", "c. Opsi C"], // hanya untuk pilihan_ganda
}
```

## 👥 Tim

Dikembangkan untuk **PT IWARE** — Divisi Rekrutmen & HR.

---

*© 2026 IWARE. All rights reserved.*
