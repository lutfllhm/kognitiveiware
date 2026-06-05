// ============================================
// Tes Kognitif IWARE — API Helper Functions
// ============================================

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // Dynamically use the current hostname to access the backend on port 5000
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

// ---- Participants ----

export interface ParticipantData {
  nama_lengkap: string;
  usia: number;
  tanggal: string;
  pendidikan_terakhir: string;
  posisi: string;
  lokasi_kerja: string;
}

export async function createParticipant(data: ParticipantData) {
  const res = await fetch(`${API_URL}/participants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal menyimpan biodata");
  }
  return res.json();
}

export async function getParticipants() {
  const res = await fetch(`${API_URL}/participants`);
  if (!res.ok) throw new Error("Gagal memuat data peserta");
  return res.json();
}

export async function getParticipantDetail(id: number) {
  const res = await fetch(`${API_URL}/participants/${id}`);
  if (!res.ok) throw new Error("Gagal memuat detail peserta");
  return res.json();
}

export async function deleteParticipant(id: number) {
  const res = await fetch(`${API_URL}/participants/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal menghapus peserta");
  }
  return res.json();
}

// ---- Sessions ----

export async function createSession(participantId: number) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_id: participantId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal membuat sesi");
  }
  return res.json();
}

export async function finishSession(participantId: number, status: "selesai" | "timeout") {
  const res = await fetch(`${API_URL}/sessions/finish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_id: participantId, status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal menyelesaikan sesi");
  }
  return res.json();
}

// ---- Answers ----

export async function saveAnswer(participantId: number, questionId: number, jawaban: string) {
  const res = await fetch(`${API_URL}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant_id: participantId,
      question_id: questionId,
      jawaban,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal menyimpan jawaban");
  }
  return res.json();
}

export async function saveBulkAnswers(
  participantId: number,
  answers: Array<{ question_id: number; jawaban: string }>
) {
  const res = await fetch(`${API_URL}/answers/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant_id: participantId,
      answers,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Gagal menyimpan jawaban");
  }
  return res.json();
}

export async function getAnswers(participantId: number) {
  const res = await fetch(`${API_URL}/answers/${participantId}`);
  if (!res.ok) throw new Error("Gagal memuat jawaban");
  return res.json();
}

// ---- Auth ----

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login gagal");
  }
  return res.json();
}

export async function verifyToken(token: string) {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) return { valid: false };
  return res.json();
}

export async function adminLogout(token: string) {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}
