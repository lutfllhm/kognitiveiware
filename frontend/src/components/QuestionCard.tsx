"use client";

import { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="card-elevated p-6 sm:p-8 animate-scale-in no-select border border-border shadow-md">
      {/* Question header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-primary-dark">
            <span className="text-white font-bold text-xs">{questionNumber}</span>
          </div>
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Butir Evaluasi
          </span>
        </div>
        <span
          className={`
            text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border
            ${
              question.type === "pilihan_ganda"
                ? "bg-slate-50 text-slate-700 border-slate-200"
                : "bg-emerald-50/50 text-emerald-700 border-emerald-200"
            }
          `}
        >
          {question.type === "pilihan_ganda" ? "Pilihan Ganda" : "Isian Singkat"}
        </span>
      </div>

      {/* Question text */}
      <div className="mb-6">
        <p className="text-base text-foreground leading-relaxed font-medium whitespace-pre-line">
          {question.text}
        </p>
        {question.headerImage && (
          <div className="mb-4 flex justify-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm max-w-md mx-auto">
            <img
              src={question.headerImage}
              alt={`Petunjuk Soal ${questionNumber}`}
              className="max-h-[120px] object-contain rounded-lg"
            />
          </div>
        )}
        {question.image && (
          <div className="mt-5 flex justify-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm max-w-md mx-auto">
            <img
              src={question.image}
              alt={`Ilustrasi Soal ${questionNumber}`}
              className="max-h-[200px] object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Answer options */}
      {question.type === "pilihan_ganda" && question.options ? (
        <div className="space-y-2.5">
          {question.options.map((option, index) => {
            const optionLetter = option.charAt(0).toLowerCase();
            const isSelected = selectedAnswer === optionLetter;

            return (
              <label
                key={index}
                className={`
                  flex items-center gap-4.5 p-4 rounded-lg border cursor-pointer transition-all duration-150
                  ${
                    isSelected
                      ? "border-primary bg-slate-50 shadow-sm ring-1 ring-primary/10"
                      : "border-border hover:border-slate-300 hover:bg-slate-50/30"
                  }
                `}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionLetter}
                  checked={isSelected}
                  onChange={() => onAnswer(optionLetter)}
                  className="sr-only"
                />
                <div
                  className={`
                    w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150
                    ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-slate-300 bg-white"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  className={`text-sm sm:text-base leading-relaxed ${
                    isSelected ? "font-semibold text-primary" : "text-foreground"
                  }`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <label className="form-label mb-2 block text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Masukkan Jawaban Anda:
          </label>
          <input
            type="text"
            className="form-input text-base py-3 font-medium placeholder:font-normal"
            placeholder="Ketikkan jawaban di sini..."
            value={selectedAnswer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            autoComplete="off"
          />
        </div>
      )}
    </div>
  );
}
