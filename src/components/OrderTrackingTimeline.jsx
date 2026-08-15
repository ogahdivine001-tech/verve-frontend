import { Check } from "lucide-react";

const STAGES = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderTrackingTimeline({ currentStatus }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3">
        This order has been cancelled.
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(currentStatus);

  return (
    <div className="flex items-start">
      {STAGES.map((stage, i) => {
        const isDone = i <= currentIndex;
        return (
          <div key={stage} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-3.5 right-1/2 w-full h-0.5 ${i <= currentIndex ? "bg-teal" : "bg-line"}`}
              />
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs z-10 ${
                isDone ? "bg-teal text-paper" : "bg-warm-grey text-ink-soft/40"
              }`}
            >
              {isDone && <Check size={13} />}
            </div>
            <span className={`text-[11px] mt-2 text-center px-1 ${isDone ? "text-ink" : "text-ink-soft/40"}`}>
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}
