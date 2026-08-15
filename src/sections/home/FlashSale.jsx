import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Timer } from "lucide-react";
import { productService } from "../../services/productService";
import ProductCard from "../../components/ProductCard";
import { ProductGridSkeleton } from "../../components/Loading";

const getEndOfDay = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

function useCountdown() {
  const [target] = useState(getEndOfDay);
  const [remaining, setRemaining] = useState(target - new Date());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - new Date()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const h = Math.max(0, Math.floor(remaining / 3600000));
  const m = Math.max(0, Math.floor((remaining % 3600000) / 60000));
  const s = Math.max(0, Math.floor((remaining % 60000) / 1000));
  return { h, m, s };
}

export default function FlashSale() {
  const { h, m, s } = useCountdown();

  const { data, isLoading } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: () => productService.getAll({ limit: 4, minRating: 0, sort: "price_desc" }),
  });

  const products = (data?.data || []).filter((p) => p.discount > 0).slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="container-page py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-3xl">Flash Sale</h2>
          <div className="flex items-center gap-1.5 price-tag text-error text-sm">
            <Timer size={15} />
            {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </div>
        </div>
        <Link to="/shop?discount=true" className="text-sm text-teal hover:underline">
          View all
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
