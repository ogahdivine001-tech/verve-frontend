import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, Search, PackageX } from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Loading";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import FilterPanel from "../sections/shop/FilterPanel";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    inStock: false,
    featured: searchParams.get("featured") === "true" ? true : undefined,
    bestSeller: searchParams.get("bestSeller") === "true" ? true : undefined,
    newArrival: searchParams.get("newArrival") === "true" ? true : undefined,
    sort: "newest",
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchParams.get("q") || prev.search }));
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["shop-products", filters],
    queryFn: () =>
      productService.getAll({
        ...filters,
        inStock: filters.inStock || undefined,
      }),
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Shop</h1>
          {pagination && <p className="text-sm text-ink-soft/60 mt-1">{pagination.total} products</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 border border-line px-3 py-2 flex-1 max-w-sm">
          <Search size={15} className="text-ink-soft/40" />
          <input
            type="text"
            placeholder="Search this collection..."
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 border border-line px-3 py-2 text-sm"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>

        <select
          value={filters.sort}
          onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))}
          className="border border-line px-3 py-2 text-sm outline-none ml-auto"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden lg:block">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-paper lg:hidden overflow-y-auto">
            <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setMobileFiltersOpen(false)} isMobile />
          </div>
        )}

        <div>
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="No products found"
              message="Try adjusting your filters or search term."
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination
                page={pagination?.page || 1}
                pages={pagination?.pages || 1}
                onChange={(page) => {
                  setFilters((p) => ({ ...p, page }));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
