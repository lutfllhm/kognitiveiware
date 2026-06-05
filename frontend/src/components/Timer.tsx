"use client";

import { useEffect, useState, useCallback } from "react";

interface TimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

export default function Timer({ durationSeconds, onTimeUp, isRunning }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 60 && timeLeft > 0;
  const isCritical = timeLeft <= 30 && timeLeft > 0;
  const progress = (timeLeft / durationSeconds) * 100;

  return (
    <div
      className={`
        sticky top-16 z-30 transition-all duration-500
        ${isCritical
          ? "animate-timer-warning"
          : isWarning
          ? "bg-gradient-to-r from-amber-500 to-orange-500"
          : "bg-gradient-to-r from-primary-dark to-primary"
        }
      `}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
        <div
          className="h-full bg-white/50 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white/80 text-sm font-medium">Sisa Waktu</span>
          </div>
        </div>

        {/* Timer display */}
        <div className="flex items-center gap-1">
          <span className={`
            font-mono text-2xl sm:text-3xl font-bold text-white tracking-wider
            ${isCritical ? "animate-pulse" : ""}
          `}>
            {String(minutes).padStart(2, "0")}
          </span>
          <span className={`
            font-mono text-2xl sm:text-3xl font-bold text-white/70
            ${isCritical ? "animate-pulse" : ""}
          `}>:</span>
          <span className={`
            font-mono text-2xl sm:text-3xl font-bold text-white tracking-wider
            ${isCritical ? "animate-pulse" : ""}
          `}>
            {String(seconds).padStart(2, "0")}
          </span>
        </div>

        {/* Warning message */}
        <div className="hidden sm:block">
          {isWarning && (
            <span className="text-white text-sm font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              {isCritical ? "Waktu hampir habis!" : "Peringatan: sisa 1 menit!"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
