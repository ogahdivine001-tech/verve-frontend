import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/Loading";

export default function ProductRow({ title, subtitle, params, viewAllTo, dark = false }) {
  const { data, isLoading } = useQuery({
    queryKey: ["products-row", params],
    queryFn: () => productService.getAll({ limit: 4, ...params }),
  });

  const products = data?.data || [];

  return (
    <section className={`py-16 ${dark ? "bg-ink text-paper" : ""}`}>
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <p className={`text-xs uppercase tracking-widest mb-2 ${dark ? "text-amber" : "text-teal"}`}>
                {subtitle}
              </p>
            )}
            <h2 className="font-display text-3xl">{title}</h2>
          </div>
          {viewAllTo && (
            <Link
              to={viewAllTo}
              className={`text-sm hover:underline ${dark ? "text-paper/80" : "text-teal"}`}
            >
              View all
            </Link>
          )}
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : products.length === 0 ? (
          <p className={`text-sm ${dark ? "text-paper/60" : "text-ink-soft/60"}`}>No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
