import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../../services/productService";
import { TextSkeleton } from "../../components/Loading";

export default function FeaturedCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = data?.data?.slice(0, 6) || [];

  return (
    <section className="container-page py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-3xl">Shop by Category</h2>
        <Link to="/categories" className="text-sm text-teal hover:underline">
          View all
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <TextSkeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/shop?category=${cat._id}`} className="group">
              <div className="aspect-square overflow-hidden bg-warm-grey mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-sm text-center font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
