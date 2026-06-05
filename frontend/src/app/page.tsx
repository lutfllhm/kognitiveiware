"use client";

import { useEffect } from "react";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import {
  BrainIcon,
  CalculatorIcon,
  BookOpenIcon,
  SearchIcon,
  ClipboardListIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export default function HomePage() {
  useEffect(() => {
    document.title = "Selamat Datang | Tes Kognitif IWARE";
  }, []);

  return (
    <div className="bg-gradient-corporate min-h-[calc(100vh-4rem)]">
      <Stepper currentStep={0} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 sm:p-12 mb-8 animate-fade-in-up relative overflow-hidden shadow-lg border border-primary-dark/20">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <BrainIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase">
                  Portal Rekrutmen iware
                </p>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Evaluasi Kemampuan
              <br />
              <span className="text-blue-200">Kognitif</span>
            </h1>
            <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Sistem penilaian terstandarisasi untuk mengukur kapasitas kognitif, logika pemecahan masalah, dan kecerdasan analitis calon karyawan baru iware.
            </p>
          </div>

          {/* Elegant geometric elements instead of raw floating circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-16 -right-8 w-36 h-36 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        </div>

        {/* Content Cards */}
        <div className="space-y-6">
          {/* About the test */}
          <div className="card-elevated p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                <BrainIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-bold text-foreground">Dimensi Evaluasi Kognitif</h2>
                <p className="text-xs text-muted mt-0.5">Penilaian ini mengukur potensi berpikir kandidat melalui empat area kompetensi utama:</p>
              </div>
            </div>
            <div className="pl-0 sm:pl-14">
              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                {[
                  {
                    icon: <BrainIcon className="w-5 h-5 text-primary-light" />,
                    title: "Logika & Penalaran",
                    desc: "Mengukur kapasitas berpikir logis, deduktif, dan pengambilan keputusan terstruktur.",
                  },
                  {
                    icon: <CalculatorIcon className="w-5 h-5 text-primary-light" />,
                    title: "Keterampilan Numerik",
                    desc: "Mengukur akurasi berhitung, pemecahan masalah matematis, dan analisis data kuantitatif.",
                  },
                  {
                    icon: <BookOpenIcon className="w-5 h-5 text-primary-light" />,
                    title: "Kemampuan Verbal",
                    desc: "Mengukur pemahaman semantik, logika bahasa, dan hubungan analogi antarkata.",
                  },
                  {
                    icon: <SearchIcon className="w-5 h-5 text-primary-light" />,
                    title: "Analitis & Problem Solving",
                    desc: "Mengukur kecepatan mengidentifikasi pola informasi dan merumuskan solusi logis.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3.5 p-4 rounded-xl bg-surface border border-border/80 shadow-sm transition-all hover:border-slate-300">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test info */}
          <div className="card-elevated p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                <ClipboardListIcon className="w-5 h-5 text-success" />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-bold text-foreground">Struktur & Ketentuan Asesmen</h2>
                <p className="text-xs text-muted mt-0.5">Sesi pengerjaan diatur berdasarkan parameter standardisasi berikut:</p>
              </div>
            </div>
            <div className="pl-0 sm:pl-14">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm">
                  <div className="text-xl font-bold text-primary">50 Butir</div>
                  <div className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">Jumlah Soal</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm">
                  <div className="text-xl font-bold text-amber-600">15 Menit</div>
                  <div className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">Durasi Maksimal</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm">
                  <div className="text-xl font-bold text-emerald-600">Pilihan & Isian</div>
                  <div className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">Format Jawaban</div>
                </div>
              </div>
              <div className="mt-5 p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
                <div className="text-xs text-amber-800 font-medium flex items-start gap-2.5 leading-relaxed">
                  <AlertTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 block mb-0.5">Pernyataan Integritas & Keamanan</span>
                    Asesmen ini wajib diselesaikan secara mandiri. Demi objektivitas hasil, sistem keamanan kami akan mendeteksi aktivitas mencurigakan secara otomatis. Penggunaan alat bantu luar seperti kalkulator, browser eksternal, atau asisten AI akan didokumentasikan dan dapat mempengaruhi evaluasi kelulusan.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="card-elevated p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                <ClipboardListIcon className="w-5 h-5 text-purple-700" />
              </div>
              <div className="pt-1">
                <h2 className="text-lg font-bold text-foreground">Signifikansi Hasil Asesmen</h2>
                <p className="text-muted text-sm mt-1.5 leading-relaxed">
                  Evaluasi kognitif ini bertujuan untuk memastikan setiap kandidat memiliki kemampuan pemecahan masalah dan adaptabilitas belajar yang selaras dengan kualifikasi profesional iware. Hasil akhir dari asesmen ini akan menjadi parameter komparatif yang digunakan secara objektif oleh tim rekrutmen dalam proses seleksi berkas lanjutan.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link href="/biodata" className="btn-primary text-base px-8 py-3.5 group inline-flex items-center gap-2">
              Lanjutkan Registrasi
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-xs text-muted mt-4">
              Anda akan diarahkan untuk melengkapi informasi biodata resmi sebelum memulai sesi asesmen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
