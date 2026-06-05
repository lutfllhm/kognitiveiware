"use client";

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number; // 0-based
  answeredQuestions: Set<number>; // question IDs
  questionIds: number[];
  onNavigate: (index: number) => void;
}

export default function QuestionNav({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  questionIds,
  onNavigate,
}: QuestionNavProps) {
  const answeredCount = answeredQuestions.size;

  return (
    <div className="card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Navigasi Soal</h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-alt rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question grid */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qId = questionIds[i];
          const isCurrent = i === currentQuestion;
          const isAnswered = answeredQuestions.has(qId);

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`
                relative w-full aspect-square rounded-lg text-xs font-bold transition-all duration-200
                flex items-center justify-center
                ${isCurrent
                  ? "bg-primary text-white shadow-md ring-2 ring-primary/30 scale-110"
                  : isAnswered
                  ? "bg-success/15 text-success border border-success/30 hover:bg-success/25"
                  : "bg-surface-alt text-muted border border-border hover:bg-border hover:text-foreground"
                }
              `}
              title={`Soal ${i + 1}${isAnswered ? " (sudah dijawab)" : " (belum dijawab)"}`}
            >
              {i + 1}
              {isAnswered && !isCurrent && (
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-[10px] text-muted font-medium">Aktif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-success/20 border border-success/40" />
          <span className="text-[10px] text-muted font-medium">Dijawab</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-surface-alt border border-border" />
          <span className="text-[10px] text-muted font-medium">Belum</span>
        </div>
      </div>
    </div>
  );
}
