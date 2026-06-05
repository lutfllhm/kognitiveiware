"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import QuestionNav from "@/components/QuestionNav";
import { questions } from "@/data/questions";
import { saveAnswer, finishSession } from "@/lib/api";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
} from "@/components/Icons";

const TEST_DURATION = 15 * 60; // 15 minutes in seconds

export default function TesPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const saveTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const hasFinished = useRef(false);

  // Check participant
  useEffect(() => {
    document.title = "Ujian Sedang Berlangsung... | Tes Kognitif IWARE";

    const pid = sessionStorage.getItem("participant_id");
    if (!pid) {
      router.replace("/biodata");
      return;
    }
    setParticipantId(parseInt(pid));
  }, [router]);

  // Prevent back navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Prevent copy/paste and right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "u")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasFinished.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Auto-save answer with debounce
  const handleAnswer = useCallback(
    (answer: string) => {
      const qId = questions[currentIndex].id;
      setAnswers((prev) => ({ ...prev, [qId]: answer }));

      // Debounce API call
      if (saveTimeoutRef.current[qId]) {
        clearTimeout(saveTimeoutRef.current[qId]);
      }

      saveTimeoutRef.current[qId] = setTimeout(async () => {
        if (participantId && answer) {
          try {
            await saveAnswer(participantId, qId, answer);
          } catch (err) {
            console.error("Auto-save failed:", err);
          }
        }
      }, 500);
    },
    [currentIndex, participantId]
  );

  // Finish test
  const handleFinish = useCallback(
    async (status: "selesai" | "timeout") => {
      if (hasFinished.current || !participantId) return;
      hasFinished.current = true;
      setIsTimerRunning(false);
      setIsSubmitting(true);
      setShowFinishModal(false);

      try {
        // Save any pending answers
        const savePromises = Object.entries(answers).map(([qId, answer]) => {
          if (answer) {
            return saveAnswer(participantId, parseInt(qId), answer);
          }
          return Promise.resolve();
        });
        await Promise.all(savePromises);

        // Finish session
        await finishSession(participantId, status);
      } catch (err) {
        console.error("Finish error:", err);
      }

      router.push("/selesai");
    },
    [participantId, answers, router]
  );

  const handleTimeUp = useCallback(() => {
    handleFinish("timeout");
  }, [handleFinish]);

  const answeredSet = new Set(
    Object.entries(answers)
      .filter(([, v]) => v && v.trim() !== "")
      .map(([k]) => parseInt(k))
  );

  const currentQuestion = questions[currentIndex];

  if (!participantId) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-corporate no-select">
      {/* Timer */}
      <Timer
        durationSeconds={TEST_DURATION}
        onTimeUp={handleTimeUp}
        isRunning={isTimerRunning}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content - Question */}
          <div className="flex-1 min-w-0">
            {/* Navigation buttons */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                disabled={currentIndex === 0}
                className="btn-secondary text-xs px-3.5 py-1.5 disabled:opacity-30 flex items-center gap-1.5"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                Sebelumnya
              </button>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Soal {currentIndex + 1} dari {questions.length}
              </span>
              <button
                onClick={() =>
                  setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))
                }
                disabled={currentIndex === questions.length - 1}
                className="btn-secondary text-xs px-3.5 py-1.5 disabled:opacity-30 flex items-center gap-1.5"
              >
                Selanjutnya
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Question Card */}
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />

            {/* Finish button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowFinishModal(true)}
                className="btn-danger px-6 py-3 flex items-center gap-2 mx-auto"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Selesaikan & Kirim Jawaban
              </button>
            </div>
          </div>

          {/* Sidebar - Question Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <QuestionNav
                totalQuestions={questions.length}
                currentQuestion={currentIndex}
                answeredQuestions={answeredSet}
                questionIds={questions.map((q) => q.id)}
                onNavigate={setCurrentIndex}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Finish confirmation modal */}
      {showFinishModal && (
        <div className="modal-overlay">
          <div className="modal-content border border-border shadow-xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <AlertTriangleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Konfirmasi Akhiri Ujian
              </h3>
              <p className="text-muted text-xs leading-relaxed">
                Anda telah menjawab{" "}
                <strong className="text-foreground">{answeredSet.size}</strong> dari{" "}
                <strong className="text-foreground">{questions.length}</strong> soal.
                {answeredSet.size < questions.length && (
                  <span className="text-amber-600 block mt-2 font-medium">
                    Peringatan: Masih ada {questions.length - answeredSet.size} soal yang belum Anda isi.
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFinishModal(false)}
                className="btn-secondary flex-1 py-2.5 text-xs"
              >
                Kembali ke Ujian
              </button>
              <button
                onClick={() => handleFinish("selesai")}
                disabled={isSubmitting}
                className="btn-danger flex-1 py-2.5 text-xs font-semibold"
              >
                {isSubmitting ? "Mengirim..." : "Ya, Selesai"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitting overlay */}
      {isSubmitting && !showFinishModal && (
        <div className="modal-overlay">
          <div className="modal-content text-center border border-border shadow-xl">
            <svg className="animate-spin h-10 w-10 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <h3 className="text-base font-bold text-foreground mb-1.5">Mengirim Jawaban Ujian...</h3>
            <p className="text-muted text-xs">Lembar jawaban Anda sedang diarsipkan. Harap jangan menutup jendela ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}
