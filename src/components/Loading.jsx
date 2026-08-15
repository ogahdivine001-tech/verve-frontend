export function LoadingSpinner({ size = 24, className = "" }) {
  return (
    <div
      className={`rounded-full border-2 border-ink/20 border-t-ink animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-warm-grey mb-3" />
      <div className="h-3 bg-warm-grey w-1/3 mb-2" />
      <div className="h-4 bg-warm-grey w-4/5 mb-2" />
      <div className="h-4 bg-warm-grey w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ className = "" }) {
  return <div className={`animate-pulse bg-warm-grey ${className}`} />;
}
