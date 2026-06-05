"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Stepper from "@/components/Stepper";
import {
  CheckShieldIcon,
  ClipboardListIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@/components/Icons";

export default function SelesaiPage() {
  const [participantName, setParticipantName] = useState("");

  useEffect(() => {
    document.title = "Ujian Selesai | Tes Kognitif IWARE";

    const name = sessionStorage.getItem("participant_name");
    if (name) setParticipantName(name);

    // Clean up session data
    sessionStorage.removeItem("participant_id");
    sessionStorage.removeItem("participant_name");
  }, []);

  return (
    <div className="bg-gradient-corporate min-h-[calc(100vh-4rem)]">
      <Stepper currentStep={4} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card-elevated p-8 sm:p-12 text-center animate-fade-in-up border border-border shadow-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-sm animate-scale-in">
            <CheckShieldIcon className="w-10 h-10 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            Lembar Ujian Diterima
          </h1>

          {participantName && (
            <p className="text-primary font-semibold text-base mb-4 tracking-wide uppercase">
              {participantName}
            </p>
          )}

          <p className="text-muted text-sm leading-relaxed max-w-md mx-auto mb-8">
            Terima kasih atas partisipasi Anda. Berkas jawaban Anda untuk <strong className="text-foreground">Tes Kognitif IWARE</strong> telah berhasil terunggah dan diarsipkan secara aman di database rekrutmen kami.
          </p>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 border border-blue-500/20">
                <ClipboardListIcon className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Status Arsip</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Lembar kerja terkunci dan tersimpan dengan tanda waktu resmi.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 shadow-sm text-left">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/20">
                <ClockIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-foreground">Tahap Evaluasi</p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Menunggu penilaian objektif dan peninjauan oleh tim HRD.
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left mb-8">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-1">Informasi Kelanjutan</span>
              Hasil evaluasi kognitif Anda akan dianalisis oleh tim rekrutmen <strong className="text-slate-800">iware</strong> bersama dengan berkas administrasi lamaran Anda. Kandidat yang memenuhi kriteria kualifikasi kompetensi untuk tahap berikutnya akan dihubungi secara langsung melalui kontak resmi yang terdaftar.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link href="/" className="btn-secondary text-xs px-6 py-3 group inline-flex items-center gap-1.5">
              <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
