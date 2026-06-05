"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";
import { createParticipant, ParticipantData } from "@/lib/api";
import { UserIcon, ArrowRightIcon } from "@/components/Icons";

const PENDIDIKAN_OPTIONS = ["SMA/SMK", "D1", "D2", "D3", "D4/S1", "S2", "S3"];
const LOKASI_OPTIONS = [
  "Surabaya",
  "Jakarta",
  "Tangerang (Jurumudi)",
  "Bali",
  "Jogja",
  "Semarang",
];

interface FormErrors {
  [key: string]: string;
}

export default function BiodataPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = "Registrasi Biodata | Tes Kognitif IWARE";
  }, []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<ParticipantData>({
    nama_lengkap: "",
    usia: 0,
    tanggal: new Date().toISOString().split("T")[0],
    pendidikan_terakhir: "",
    posisi: "",
    lokasi_kerja: "",
  });

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.nama_lengkap.trim()) e.nama_lengkap = "Nama lengkap wajib diisi";
    if (!form.usia || form.usia < 15 || form.usia > 65)
      e.usia = "Usia harus antara 15–65 tahun";
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
    if (!form.pendidikan_terakhir)
      e.pendidikan_terakhir = "Pendidikan terakhir wajib dipilih";
    if (!form.posisi.trim()) e.posisi = "Posisi yang dilamar wajib diisi";
    if (!form.lokasi_kerja) e.lokasi_kerja = "Lokasi kerja wajib dipilih";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await createParticipant(form);
      sessionStorage.setItem("participant_id", String(res.participant_id));
      sessionStorage.setItem("participant_name", form.nama_lengkap);
      router.push("/instruksi");
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField(field: keyof ParticipantData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  }

  return (
    <div className="bg-gradient-corporate min-h-[calc(100vh-4rem)]">
      <Stepper currentStep={1} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <UserIcon className="w-3.5 h-3.5" />
            Langkah 2 dari 5
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Registrasi Informasi Diri
          </h1>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            Harap isi seluruh kolom informasi di bawah ini secara akurat sebelum memulai sesi pengerjaan evaluasi.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="card-elevated p-6 sm:p-8 space-y-5 animate-fade-in-up shadow-lg border border-border"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Nama Lengkap */}
          <div className="form-group">
            <label htmlFor="nama_lengkap" className="form-label">
              Nama Lengkap <span className="text-danger">*</span>
            </label>
            <input
              id="nama_lengkap"
              type="text"
              className={`form-input ${errors.nama_lengkap ? "error" : ""}`}
              placeholder="Masukkan nama lengkap sesuai identitas resmi"
              value={form.nama_lengkap}
              onChange={(e) => updateField("nama_lengkap", e.target.value)}
            />
            {errors.nama_lengkap && (
              <p className="form-error mt-1">{errors.nama_lengkap}</p>
            )}
          </div>

          {/* Usia & Tanggal (row) */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="form-group">
              <label htmlFor="usia" className="form-label">
                Usia (Tahun) <span className="text-danger">*</span>
              </label>
              <input
                id="usia"
                type="number"
                className={`form-input ${errors.usia ? "error" : ""}`}
                placeholder="Contoh: 25"
                min={15}
                max={65}
                value={form.usia || ""}
                onChange={(e) => updateField("usia", parseInt(e.target.value) || 0)}
              />
              {errors.usia && <p className="form-error mt-1">{errors.usia}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="tanggal" className="form-label">
                Tanggal Pengerjaan <span className="text-danger">*</span>
              </label>
              <input
                id="tanggal"
                type="date"
                className={`form-input ${errors.tanggal ? "error" : ""}`}
                value={form.tanggal}
                onChange={(e) => updateField("tanggal", e.target.value)}
              />
              {errors.tanggal && <p className="form-error mt-1">{errors.tanggal}</p>}
            </div>
          </div>

          {/* Pendidikan */}
          <div className="form-group">
            <label htmlFor="pendidikan" className="form-label">
              Pendidikan Terakhir <span className="text-danger">*</span>
            </label>
            <select
              id="pendidikan"
              className={`form-select ${errors.pendidikan_terakhir ? "error" : ""}`}
              value={form.pendidikan_terakhir}
              onChange={(e) => updateField("pendidikan_terakhir", e.target.value)}
            >
              <option value="">Pilih pendidikan terakhir</option>
              {PENDIDIKAN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.pendidikan_terakhir && (
              <p className="form-error mt-1">{errors.pendidikan_terakhir}</p>
            )}
          </div>

          {/* Posisi */}
          <div className="form-group">
            <label htmlFor="posisi" className="form-label">
              Posisi yang Dilamar <span className="text-danger">*</span>
            </label>
            <input
              id="posisi"
              type="text"
              className={`form-input ${errors.posisi ? "error" : ""}`}
              placeholder="Contoh: Senior Business Analyst"
              value={form.posisi}
              onChange={(e) => updateField("posisi", e.target.value)}
            />
            {errors.posisi && <p className="form-error mt-1">{errors.posisi}</p>}
          </div>

          {/* Lokasi */}
          <div className="form-group">
            <label htmlFor="lokasi" className="form-label">
              Lokasi Kerja <span className="text-danger">*</span>
            </label>
            <select
              id="lokasi"
              className={`form-select ${errors.lokasi_kerja ? "error" : ""}`}
              value={form.lokasi_kerja}
              onChange={(e) => updateField("lokasi_kerja", e.target.value)}
            >
              <option value="">Pilih lokasi kerja penempatan</option>
              {LOKASI_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.lokasi_kerja && (
              <p className="form-error mt-1">{errors.lokasi_kerja}</p>
            )}
          </div>

          {/* Divider & Submission */}
          <div className="border-t border-slate-100 pt-5 mt-6">
            <p className="text-xs text-muted mb-4">
              <span className="text-danger">*</span> Menunjukkan bidang input yang wajib diisi. Seluruh data yang diinput diarsipkan secara rahasia dan aman.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 group flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan Data...
                </>
              ) : (
                <>
                  Lanjutkan ke Petunjuk
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
