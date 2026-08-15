import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, count, size = 14 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= Math.round(rating) ? "fill-amber text-amber" : "fill-warm-grey-dark text-warm-grey-dark"}
          />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-ink-soft/70">({count})</span>}
    </div>
  );
}
