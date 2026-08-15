import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import PriceTag from "./PriceTag";
import RatingStars from "./RatingStars";
import Badge from "./Badge";
import { useCartStore } from "../context/cartStore";
import { useWishlistStore } from "../context/wishlistStore";
import { useAuthStore } from "../context/authStore";
import { useToastStore } from "../context/toastStore";

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const showToast = useToastStore((s) => s.showToast);

  const outOfStock = product.stock <= 0;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (outOfStock) return;
    try {
      await addItem(product);
      showToast(`${product.name} added to cart`);
    } catch (err) {
      showToast(err.message || "Could not add to cart", "error");
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast("Log in to save items to your wishlist", "info");
      return;
    }
    try {
      await toggleItem(product);
    } catch {
      showToast("Could not update wishlist", "error");
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-warm-grey overflow-hidden mb-3">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {product.discount > 0 && (
          <Badge variant="amber" className="absolute top-3 left-3">
            -{product.discount}%
          </Badge>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-paper/70 flex items-center justify-center">
            <Badge variant="ink">Out of Stock</Badge>
          </div>
        )}

        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-8 h-8 bg-paper/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Heart size={15} className={wishlisted ? "fill-error text-error" : "text-ink"} />
        </button>

        {!outOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-ink text-paper text-xs font-medium tracking-wide uppercase py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <ShoppingBag size={13} /> Add to cart
          </button>
        )}
      </div>

      <p className="text-xs text-teal uppercase tracking-wide mb-1">{product.category?.name}</p>
      <h3 className="text-sm font-medium mb-1.5 line-clamp-1">{product.name}</h3>
      <RatingStars rating={product.rating} count={product.reviewCount} />
      <div className="mt-1.5">
        <PriceTag price={product.finalPrice ?? product.price} oldPrice={product.discount ? product.price : null} />
      </div>
    </Link>
  );
}
