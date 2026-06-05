"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Stepper from "@/components/Stepper";
import { createSession } from "@/lib/api";
import {
  ClipboardListIcon,
  BrainIcon,
  ClockIcon,
  CheckCircleIcon,
  UserIcon,
  BanIcon,
  RotateCwIcon,
  EditIcon,
  ArrowRightIcon,
  InfoIcon,
} from "@/components/Icons";

export default function InstruksiPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    document.title = "Instruksi Ujian | Tes Kognitif IWARE";

    // Check if participant exists
    const pid = sessionStorage.getItem("participant_id");
    if (!pid) {
      router.replace("/biodata");
    }
  }, [router]);

  async function handleStartTest() {
    const pid = sessionStorage.getItem("participant_id");
    if (!pid) {
      router.replace("/biodata");
      return;
    }

    setIsStarting(true);
    try {
      await createSession(parseInt(pid));
      router.push("/tes");
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Gagal memulai sesi tes");
      setIsStarting(false);
    }
  }

  return (
    <div className="bg-gradient-corporate min-h-[calc(100vh-4rem)]">
      <Stepper currentStep={2} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <ClipboardListIcon className="w-3.5 h-3.5" />
            Langkah 3 dari 5
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Tata Tertib & Petunjuk Ujian
          </h1>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            Harap baca instruksi pengerjaan dan contoh soal di bawah ini secara saksama sebelum memulai sesi.
          </p>
        </div>

        {/* Instructions */}
        <div className="card-elevated p-6 sm:p-8 mb-6 animate-fade-in-up shadow-lg border border-border" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
              <ClipboardListIcon className="w-4 h-4 text-primary" />
            </div>
            Ketentuan Umum Pengerjaan
          </h2>

          <div className="space-y-3.5">
            {[
              {
                icon: <BrainIcon className="w-4 h-4 text-primary-light" />,
                title: "Manajemen Waktu & Akurasi",
                text: "Selesaikan setiap butir soal secara **fokus, teliti, dan dengan efisiensi waktu** yang optimal.",
              },
              {
                icon: <RotateCwIcon className="w-4 h-4 text-primary-light" />,
                title: "Fleksibilitas Navigasi",
                text: "Anda dapat mengerjakan soal secara **tidak berurutan**, melompati soal, dan kembali ke nomor yang terlewat selama sisa waktu masih tersedia.",
              },
              {
                icon: <EditIcon className="w-4 h-4 text-primary-light" />,
                title: "Format Input Jawaban",
                text: "Pilih opsi jawaban yang menurut Anda paling tepat untuk soal **Pilihan Ganda**, dan ketikkan angka/kata secara tepat pada kolom yang disediakan untuk soal **Isian**.",
              },
              {
                icon: <UserIcon className="w-4 h-4 text-primary-light" />,
                title: "Integritas Individu",
                text: "Evaluasi ini bersifat **mandiri**. Seluruh lembar soal wajib diselesaikan secara independen tanpa bantuan dari pihak lain.",
              },
              {
                icon: <BanIcon className="w-4 h-4 text-red-500" />,
                title: "Larangan Alat Bantu",
                text: "**Dilarang keras menggunakan alat bantu luar** seperti kalkulator, pencarian internet, catatan fisik, asisten AI, atau membuka tab browser lain selama tes berlangsung.",
              },
              {
                icon: <ClockIcon className="w-4 h-4 text-primary-light" />,
                title: "Batas Waktu Otomatis",
                text: "Durasi ujian dibatasi maksimal **15 menit**. Sistem secara otomatis mengunci halaman dan mengirim jawaban saat waktu berakhir.",
              },
              {
                icon: <CheckCircleIcon className="w-4 h-4 text-primary-light" />,
                title: "Konfirmasi Final",
                text: "Pastikan seluruh nomor telah Anda tinjau kembali sebelum menekan tombol **\"Selesai & Kirim Jawaban\"**.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-surface-alt border border-slate-200/50 hover:border-slate-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground mb-0.5 uppercase tracking-wider">{item.title}</p>
                  <p
                    className="text-sm text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: item.text.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="text-primary-dark font-semibold">$1</strong>'
                      ),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example Questions */}
        <div className="card-elevated p-6 sm:p-8 mb-6 animate-fade-in-up shadow-lg border border-border" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200">
              <InfoIcon className="w-4 h-4 text-primary" />
            </div>
            Simulasi & Contoh Soal
          </h2>
          <p className="text-muted text-xs mb-5">
            Berikut adalah simulasi format soal yang akan Anda hadapi pada lembar kerja ujian:
          </p>

          <div className="space-y-4">
            {/* Example 1 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-start">
                <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-primary text-white text-[11px] font-bold mr-2.5 mt-0.5">1</span>
                Manakah yang tidak termasuk kelompok bidang studi ilmiah di bawah ini:
              </p>
              <div className="flex flex-wrap gap-2 mb-3 pl-8">
                {["a. Hukum", "b. Psikologi", "c. Politik", "d. Persidangan", "e. Ekonomi"].map((opt) => (
                  <span
                    key={opt}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      opt.startsWith("d.")
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
              <p className="text-xs text-emerald-700 font-medium pl-8 flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Jawaban benar: <strong>(d) Persidangan</strong> (karena persidangan merupakan aktivitas hukum, bukan nama disiplin ilmu).
              </p>
            </div>

            {/* Example 2 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-start">
                <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-primary text-white text-[11px] font-bold mr-2.5 mt-0.5">2</span>
                Harga sebuah buah alpukat adalah Rp 28,-. Berapakah harga 5 buah alpukat?
              </p>
              <p className="text-xs text-emerald-700 font-medium pl-8 flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Jawaban benar: <strong>140</strong>. Input jawaban numerik ditulis langsung dengan angka (contoh: <strong>140</strong>) tanpa simbol mata uang.
                </span>
              </p>
            </div>

            {/* Example 3 */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <p className="text-sm font-semibold text-foreground mb-3 flex items-start">
                <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-md bg-primary text-white text-[11px] font-bold mr-2.5 mt-0.5">3</span>
                JULY – JULI. Hubungan antara kedua kata ini adalah:
              </p>
              <div className="flex flex-wrap gap-2 mb-3 pl-8">
                {[
                  "a. Memiliki arti sama",
                  "b. Memiliki arti berlawanan",
                  "c. Tidak memiliki arti sama atau berlawanan",
                ].map((opt) => (
                  <span
                    key={opt}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      opt.startsWith("a.")
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
              <p className="text-xs text-emerald-700 font-medium pl-8 flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Jawaban benar: <strong>(a) Memiliki arti sama</strong> (hanya berbeda translasi bahasa).
              </p>
            </div>
          </div>
        </div>

        {/* Agreement & Start */}
        <div className="card-elevated p-6 sm:p-8 animate-fade-in-up shadow-lg border border-border" style={{ animationDelay: "0.3s" }}>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Konfirmasi: Dengan menekan tombol &quot;Mulai Ujian&quot;, Anda dianggap telah memahami dan bersedia mematuhi seluruh tata tertib integritas akademik yang berlaku.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartTest}
              disabled={isStarting}
              className="btn-primary text-base px-8 py-3.5 group inline-flex items-center gap-2"
            >
              {isStarting ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mempersiapkan Lembar Ujian...
                </>
              ) : (
                <>
                  Mulai Ujian
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
