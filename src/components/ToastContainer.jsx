import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore } from "../context/toastStore";

const icons = {
  success: <CheckCircle2 size={18} className="text-success flex-shrink-0" />,
  error: <XCircle size={18} className="text-error flex-shrink-0" />,
  info: <Info size={18} className="text-teal flex-shrink-0" />,
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 w-[calc(100%-2.5rem)] max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.2 }}
            className="bg-ink text-paper px-4 py-3 flex items-center gap-3 shadow-lg"
          >
            {icons[toast.type]}
            <p className="text-sm flex-1">{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
              <X size={15} className="text-paper/60 hover:text-paper" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
