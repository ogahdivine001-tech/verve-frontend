import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/productService";
import { TextSkeleton } from "../components/Loading";

export default function Categories() {
  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: () => categoryService.getAll() });
  const categories = data?.data || [];

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">All Categories</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <TextSkeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link key={cat._id} to={`/shop?category=${cat._id}`} className="group relative aspect-[4/3] overflow-hidden bg-warm-grey">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/35 transition-colors flex items-end p-5">
                <h3 className="text-paper font-display text-xl">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
