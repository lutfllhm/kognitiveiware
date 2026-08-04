// ============================================
// Tes Kognitif IWARE — API Helper Functions
// ============================================

const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Check if it's local development (localhost or local IP)
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.");

    if (!isLocal) {
      // Production: use relative path to route through Nginx proxy
      return `${window.location.origin}/api`;
    }
    // Development: fallback dynamically using current hostname and port 5000
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

// Safe fetch wrapper to handle JSON & HTML errors (e.g., Nginx 502/504)
async function apiFetch(path: string, options?: RequestInit) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const res = await fetch(url, options);
  
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    let errorMessage = `HTTP error! status: ${res.status}`;
    if (isJson) {
      try {
        const err = await res.json();
        errorMessage = err.error || errorMessage;
      } catch (e) {
        // ignore
      }
    } else {
      try {
        const text = await res.text();
        if (text.includes("502 Bad Gateway") || text.includes("Gateway")) {
          errorMessage = "Server backend sedang tidak aktif atau terjadi error (502 Bad Gateway). Silakan hubungi administrator.";
        } else if (text.includes("504 Gateway Timeout")) {
          errorMessage = "Koneksi ke backend mengalami timeout (504 Gateway Timeout).";
        } else {
          errorMessage = `Terjadi kesalahan server (Status: ${res.status})`;
        }
      } catch (e) {
        errorMessage = `Terjadi kesalahan koneksi server (Status: ${res.status})`;
      }
    }
    throw new Error(errorMessage);
  }

  if (isJson) {
    return res.json();
  }
  
  return res.text();
}

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
  return apiFetch("/participants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getParticipants() {
  return apiFetch("/participants");
}

export async function getParticipantDetail(id: number) {
  return apiFetch(`/participants/${id}`);
}

export async function deleteParticipant(id: number) {
  return apiFetch(`/participants/${id}`, {
    method: "DELETE",
  });
}

export function getExportUrl(id: number, format: "excel" | "pdf") {
  return `${API_URL}/participants/${id}/export/${format}`;
}

// ---- Sessions ----

export async function createSession(participantId: number) {
  return apiFetch("/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_id: participantId }),
  });
}

export async function finishSession(participantId: number, status: "selesai" | "timeout") {
  return apiFetch("/sessions/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participant_id: participantId, status }),
  });
}

// ---- Answers ----

export async function saveAnswer(participantId: number, questionId: number, jawaban: string) {
  return apiFetch("/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant_id: participantId,
      question_id: questionId,
      jawaban,
    }),
  });
}

export async function saveBulkAnswers(
  participantId: number,
  answers: Array<{ question_id: number; jawaban: string }>
) {
  return apiFetch("/answers/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      participant_id: participantId,
      answers,
    }),
  });
}

export async function getAnswers(participantId: number) {
  return apiFetch(`/answers/${participantId}`);
}

// ---- Auth ----

export async function adminLogin(username: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function verifyToken(token: string) {
  return apiFetch("/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }).catch(() => ({ valid: false }));
}

export async function adminLogout(token: string) {
  await apiFetch("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }).catch(() => {});
}

