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
