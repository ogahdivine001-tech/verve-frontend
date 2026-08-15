import { formatPrice } from "../utils/format";

export default function PriceTag({ price, oldPrice, size = "md" }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`price-tag font-medium text-ink ${sizeClasses[size]}`}>{formatPrice(price)}</span>
      {oldPrice && oldPrice > price && (
        <span className="price-tag text-ink-soft/50 line-through text-xs">{formatPrice(oldPrice)}</span>
      )}
    </div>
  );
}
