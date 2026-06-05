import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tes Kognitif IWARE — Tes Seleksi Karyawan",
  description:
    "Tes Kognitif IWARE adalah platform tes psikotes online untuk mengukur kemampuan berpikir, logika, numerik, verbal, dan analitis dalam proses seleksi karyawan baru.",
  keywords: ["tes kognitif", "psikotes", "IWARE", "seleksi karyawan", "rekrutmen"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
