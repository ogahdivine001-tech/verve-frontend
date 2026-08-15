import { Check } from "lucide-react";

const steps = ["Information", "Shipping", "Delivery", "Payment"];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  isDone ? "bg-teal text-paper" : isActive ? "bg-ink text-paper" : "bg-warm-grey text-ink-soft/50"
                }`}
              >
                {isDone ? <Check size={14} /> : stepNum}
              </div>
              <span className={`text-xs hidden sm:block ${isActive ? "font-medium" : "text-ink-soft/50"}`}>
                {label}
              </span>
            </div>
            {stepNum < steps.length && <div className={`w-8 sm:w-16 h-px mx-1 ${isDone ? "bg-teal" : "bg-line"}`} />}
          </div>
        );
      })}
    </div>
  );
}
