"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Determine context badge content and style
  let contextBadge = "";
  let badgeClass = "";

  if (pathname === "/biodata") {
    contextBadge = "Registrasi";
    badgeClass = "bg-blue-50 text-blue-700 border-blue-200/60";
  } else if (pathname === "/instruksi") {
    contextBadge = "Petunjuk";
    badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200/60";
  } else if (pathname === "/tes") {
    contextBadge = "Ujian Aktif";
    badgeClass = "bg-red-50 text-red-700 border-red-200/60 animate-pulse";
  } else if (pathname === "/selesai") {
    contextBadge = "Selesai";
    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
  } else if (pathname?.startsWith("/admin")) {
    contextBadge = "Admin Portal";
    badgeClass = "bg-teal-50 text-teal-700 border-teal-200/60";
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="IWARE Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
                  IWARE
                </span>
                {contextBadge && (
                  <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-md border ${badgeClass}`}>
                    {contextBadge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold text-muted/80 tracking-widest uppercase leading-tight mt-0.5">
                Cognitive Assessment
              </span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {pathname === "/tes" ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-700 shadow-sm animate-pulse-glow">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                Sesi Ujian Berjalan
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-alt border border-border text-xs font-medium text-muted hover:text-foreground transition-colors duration-200">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Sistem Aktif
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
