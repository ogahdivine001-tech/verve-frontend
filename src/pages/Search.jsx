import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { productService } from "../services/productService";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Loading";
import EmptyState from "../components/EmptyState";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => productService.getAll({ search: query, limit: 24 }),
    enabled: !!query,
  });

  const products = data?.data || [];

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-2xl mb-1">Search Results</h1>
      <p className="text-sm text-ink-soft/60 mb-8">
        {isLoading ? "Searching..." : `${products.length} results for "${query}"`}
      </p>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No results found"
          message={`We couldn't find anything matching "${query}". Try a different search term.`}
          actionLabel="Browse All Products"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
