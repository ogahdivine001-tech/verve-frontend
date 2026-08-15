import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { categoryService } from "../../services/productService";
import Button from "../../components/Button";

export default function FilterPanel({ filters, setFilters, onClose, isMobile = false }) {
  const { data } = useQuery({ queryKey: ["categories"], queryFn: () => categoryService.getAll() });
  const categories = data?.data || [];

  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const clearAll = () =>
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", minRating: "", inStock: false, sort: "newest", page: 1 });

  return (
    <div className={isMobile ? "p-5" : ""}>
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl">Filters</h3>
          <button onClick={onClose} aria-label="Close filters">
            <X size={20} />
          </button>
        </div>
      )}

      <div className="mb-8">
        <h4 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => update("category", "")}
            />
            All categories
          </label>
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === c._id}
                onChange={() => update("category", c._id)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
          />
          <span className="text-ink-soft/40">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-3">Minimum Rating</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="rating"
                checked={String(filters.minRating) === String(r)}
                onChange={() => update("minRating", r)}
              />
              {r}+ stars
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="rating" checked={!filters.minRating} onChange={() => update("minRating", "")} />
            Any rating
          </label>
        </div>
      </div>

      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => update("inStock", e.target.checked)} />
          In stock only
        </label>
      </div>

      <Button variant="ghost" size="sm" onClick={clearAll} className="w-full border border-line">
        Clear Filters
      </Button>
    </div>
  );
}
