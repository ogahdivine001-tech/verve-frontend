import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "../context/wishlistStore";
import { useCartStore } from "../context/cartStore";
import { useAuthStore } from "../context/authStore";
import { useToastStore } from "../context/toastStore";
import PriceTag from "../components/PriceTag";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { LoadingSpinner } from "../components/Loading";

export default function Wishlist() {
  const { products, isLoading, loadWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (isAuthenticated) loadWishlist();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Heart}
          title="Log in to see your wishlist"
          message="Save products you love and find them here anytime."
          actionLabel="Log In"
          actionTo="/login"
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-page py-24 flex justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          actionLabel="Explore Products"
          actionTo="/shop"
        />
      </div>
    );
  }

  const handleMoveToCart = async (product) => {
    try {
      await addItem(product);
      await toggleItem(product);
      showToast(`${product.name} moved to cart`);
    } catch (err) {
      showToast(err.message || "Could not move to cart", "error");
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Wishlist</h1>

      <div className="flex flex-col divide-y divide-line">
        {products.map((product) => (
          <div key={product._id} className="flex items-center gap-4 py-5">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-20 h-20 object-cover bg-warm-grey flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link to={`/products/${product.slug}`} className="text-sm font-medium hover:underline line-clamp-1">
                {product.name}
              </Link>
              <div className="mt-1">
                <PriceTag price={product.finalPrice ?? product.price} size="sm" />
              </div>
              {product.stock <= 0 && <p className="text-xs text-error mt-1">Out of stock</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                disabled={product.stock <= 0}
                onClick={() => handleMoveToCart(product)}
              >
                <ShoppingBag size={13} /> Move to Cart
              </Button>
              <button onClick={() => toggleItem(product)} aria-label="Remove from wishlist">
                <Heart size={17} className="fill-error text-error" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
