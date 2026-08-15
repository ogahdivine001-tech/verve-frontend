import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pageNumbers.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pageNumbers[i - 1] !== p - 1 && <span className="px-1 text-ink-soft/40">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 text-sm ${p === page ? "bg-ink text-paper" : "hover:bg-warm-grey"}`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
