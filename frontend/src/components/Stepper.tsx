"use client";

interface StepperProps {
  currentStep: number; // 0-based index
}

const steps = [
  { label: "Pengenalan", icon: "1" },
  { label: "Biodata", icon: "2" },
  { label: "Instruksi", icon: "3" },
  { label: "Ujian", icon: "4" },
  { label: "Selesai", icon: "5" },
];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-5">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border z-0 mx-8" />
        
        {/* Progress line */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary z-[1] mx-8 transition-all duration-700 ease-out"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            maxWidth: 'calc(100% - 4rem)',
          }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.label}
              className="flex flex-col items-center relative z-10"
            >
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300
                  ${isCompleted
                    ? "bg-primary text-white shadow-sm"
                    : isActive
                    ? "bg-white border-[3px] border-primary text-primary shadow-md animate-pulse-glow font-bold"
                    : "bg-white border-2 border-border text-muted font-medium"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-2 text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors duration-300 uppercase tracking-wider
                  ${isActive ? "text-primary font-bold" : isCompleted ? "text-primary/70" : "text-muted"}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
