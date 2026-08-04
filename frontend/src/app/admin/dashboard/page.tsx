"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getParticipants, getParticipantDetail, verifyToken, adminLogout, deleteParticipant, getExportUrl } from "@/lib/api";

interface Participant {
  id: number;
  nama_lengkap: string;
  usia: number;
  tanggal: string;
  pendidikan_terakhir: string;
  posisi: string;
  lokasi_kerja: string;
  created_at: string;
  session_status: string | null;
  waktu_mulai: string | null;
  waktu_selesai: string | null;
}

interface AnswerDetail {
  question_id: number;
  jawaban: string;
  teks_soal: string;
  tipe: string;
}

interface ParticipantDetail {
  participant: Participant;
  answers: AnswerDetail[];
  session: {
    status: string;
    waktu_mulai: string;
    waktu_selesai: string;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ParticipantDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Check auth on mount
  useEffect(() => {
    document.title = "Dashboard Admin | Tes Kognitif IWARE";
    async function checkAuth() {
      const token = sessionStorage.getItem("admin_token");
      if (!token) {
        router.replace("/admin");
        return;
      }

      try {
        const result = await verifyToken(token);
        if (!result.valid) {
          sessionStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_name");
          router.replace("/admin");
          return;
        }
        setAdminName(sessionStorage.getItem("admin_name") || "Admin");
        setAuthChecking(false);
        loadParticipants();
      } catch {
        router.replace("/admin");
      }
    }
    checkAuth();
  }, [router]);

  async function loadParticipants() {
    try {
      const data = await getParticipants();
      setParticipants(data);
    } catch (err) {
      console.error("Failed to load participants:", err);
    } finally {
      setLoading(false);
    }
  }

  async function viewDetail(id: number) {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const data = await getParticipantDetail(id);
      setDetail(data);
    } catch (err) {
      console.error("Failed to load detail:", err);
    } finally {
      setDetailLoading(false);
    }
  }

  function initiateDelete(id: number, name: string) {
    setDeleteTarget({ id, name });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteParticipant(deleteTarget.id);
      
      // If the currently viewed participant is the one deleted, clear the detail view
      if (selectedId === deleteTarget.id) {
        setSelectedId(null);
        setDetail(null);
      }
      
      // Close modal and reload list
      setDeleteTarget(null);
      loadParticipants();
    } catch (err: any) {
      console.error("Failed to delete participant:", err);
      alert(err.message || "Gagal menghapus peserta.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleLogout() {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      await adminLogout(token);
    }
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_name");
    router.replace("/admin");
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusBadge(status: string | null) {
    switch (status) {
      case "selesai":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
            ✓ Selesai
          </span>
        );
      case "timeout":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            ⏱ Timeout
          </span>
        );
      case "berlangsung":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            ⏳ Berlangsung
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
            — Belum Mulai
          </span>
        );
    }
  }

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-corporate flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto mb-4 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-muted">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-corporate min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                Admin Panel
              </h1>
              <p className="text-muted text-sm">
                Selamat datang, <strong className="text-foreground">{adminName}</strong>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadParticipants}
                className="btn-secondary text-sm px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="btn-danger text-sm px-4 py-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{participants.length}</div>
              <div className="text-xs text-muted font-medium mt-1">Total Peserta</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {participants.filter((p) => p.session_status === "selesai").length}
              </div>
              <div className="text-xs text-muted font-medium mt-1">Selesai</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">
                {participants.filter((p) => p.session_status === "timeout").length}
              </div>
              <div className="text-xs text-muted font-medium mt-1">Timeout</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {participants.filter((p) => p.session_status === "berlangsung").length}
              </div>
              <div className="text-xs text-muted font-medium mt-1">Berlangsung</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Participants list */}
          <div className="flex-1 min-w-0">
            <div className="card-elevated overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold text-foreground">Daftar Peserta</h2>
              </div>

              {loading ? (
                <div className="p-12 text-center text-muted">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Memuat data...
                </div>
              ) : participants.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-muted font-medium">Belum ada peserta</p>
                  <p className="text-xs text-muted mt-1">Data peserta akan muncul setelah mereka mengisi biodata</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-alt border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider">Nama</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Posisi</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider hidden md:table-cell">Lokasi</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {participants.map((p, i) => (
                        <tr
                          key={p.id}
                          className={`hover:bg-surface-alt/50 transition-colors ${selectedId === p.id ? "bg-blue-50/50" : ""}`}
                        >
                          <td className="py-3 px-4 text-muted">{i + 1}</td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold text-foreground">{p.nama_lengkap}</p>
                              <p className="text-xs text-muted">{p.usia} tahun · {p.pendidikan_terakhir}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell text-muted">{p.posisi}</td>
                          <td className="py-3 px-4 hidden md:table-cell text-muted">{p.lokasi_kerja}</td>
                          <td className="py-3 px-4">{getStatusBadge(p.session_status)}</td>
                           <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => viewDetail(p.id)}
                                className="text-primary hover:text-primary-dark font-medium text-xs hover:underline flex items-center"
                              >
                                Detail →
                              </button>
                              <button
                                onClick={() => initiateDelete(p.id, p.nama_lengkap)}
                                className="text-danger hover:text-red-700 font-medium text-xs hover:underline flex items-center gap-1"
                                title="Hapus Peserta"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Detail panel */}
          {selectedId && (
            <div className="lg:w-96 flex-shrink-0">
              <div className="card-elevated p-5 lg:sticky lg:top-20">
                {detailLoading ? (
                  <div className="text-center py-12">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-muted text-sm">Memuat detail...</p>
                  </div>
                ) : detail ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-foreground">Detail Peserta</h3>
                      <button
                        onClick={() => { setSelectedId(null); setDetail(null); }}
                        className="text-muted hover:text-foreground"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Participant info */}
                    <div className="space-y-2 mb-5 p-4 rounded-xl bg-surface-alt border border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Nama</span>
                        <span className="font-semibold text-foreground">{detail.participant.nama_lengkap}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Usia</span>
                        <span className="font-medium">{detail.participant.usia} tahun</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Pendidikan</span>
                        <span className="font-medium">{detail.participant.pendidikan_terakhir}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Posisi</span>
                        <span className="font-medium">{detail.participant.posisi}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Lokasi</span>
                        <span className="font-medium">{detail.participant.lokasi_kerja}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Tanggal</span>
                        <span className="font-medium">{formatDate(detail.participant.tanggal)}</span>
                      </div>
                    </div>

                    {/* Session info */}
                    {detail.session && (
                      <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-blue-600">Status</span>
                          {getStatusBadge(detail.session.status)}
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-blue-600">Mulai</span>
                          <span className="font-medium text-sm">{formatDateTime(detail.session.waktu_mulai)}</span>
                        </div>
                        {detail.session.waktu_selesai && (
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-blue-600">Selesai</span>
                            <span className="font-medium text-sm">{formatDateTime(detail.session.waktu_selesai)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Answers */}
                    <div>
                      <h4 className="font-bold text-foreground text-sm mb-3">
                        Jawaban ({detail.answers.length}/50)
                      </h4>
                      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                        {detail.answers.map((a) => (
                          <div
                            key={a.question_id}
                            className="p-3 rounded-lg border text-xs bg-surface-alt border-border"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-muted flex-shrink-0">#{a.question_id}</span>
                              <span className="font-medium text-foreground text-right">{a.jawaban || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border animate-fade-in space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => window.open(getExportUrl(detail.participant.id, "pdf"), "_blank")}
                          className="btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download PDF
                        </button>
                        <button
                          onClick={() => window.open(getExportUrl(detail.participant.id, "excel"), "_blank")}
                          className="btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download Excel
                        </button>
                      </div>
                      <button
                        onClick={() => initiateDelete(detail.participant.id, detail.participant.nama_lengkap)}
                        className="w-full btn-danger py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus Peserta & Semua Data Tes
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-4 text-danger mb-4">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Hapus Data Peserta</h3>
                <p className="text-xs text-muted">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-sm text-muted mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus peserta <strong className="text-foreground">"{deleteTarget.name}"</strong>?
              Seluruh biodata dan semua jawaban tes peserta ini akan dihapus secara permanen dari database.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="btn-secondary px-4 py-2 text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="btn-danger px-4 py-2 text-sm flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Ya, Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
