import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { productService } from "../services/productService";
import { reviewService } from "../services";
import { useCartStore } from "../context/cartStore";
import { useWishlistStore } from "../context/wishlistStore";
import { useAuthStore } from "../context/authStore";
import { useToastStore } from "../context/toastStore";
import PriceTag from "../components/PriceTag";
import RatingStars from "../components/RatingStars";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import { TextSkeleton } from "../components/Loading";
import { formatDate } from "../utils/format";

const TABS = ["Description", "Specifications", "Reviews", "Shipping & Returns"];

export default function ProductDetails() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const showToast = useToastStore((s) => s.showToast);

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productService.getBySlug(slug),
  });

  const product = data?.data;

  const { data: relatedData } = useQuery({
    queryKey: ["related", product?._id],
    queryFn: () => productService.getRelated(product._id),
    enabled: !!product,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", product?._id],
    queryFn: () => reviewService.getForProduct(product._id),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="container-page py-10 grid md:grid-cols-2 gap-10">
        <TextSkeleton className="aspect-square" />
        <div className="flex flex-col gap-3">
          <TextSkeleton className="h-6 w-1/3" />
          <TextSkeleton className="h-8 w-2/3" />
          <TextSkeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h2 className="font-display text-2xl mb-3">Product not found</h2>
        <Link to="/shop" className="text-teal text-sm hover:underline">Back to shop</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const outOfStock = product.stock <= 0;
  const relatedProducts = relatedData?.data || [];
  const reviews = reviewsData?.data || [];

  const handleAddToCart = async () => {
    try {
      await addItem(product, selectedVariantId, quantity);
      showToast(`${product.name} added to cart`);
    } catch (err) {
      showToast(err.message || "Could not add to cart", "error");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showToast("Log in to save items to your wishlist", "info");
      return;
    }
    await toggleItem(product);
  };

  return (
    <div className="container-page py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-warm-grey mb-3 overflow-hidden">
            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 overflow-hidden border ${activeImage === i ? "border-ink" : "border-line"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-teal uppercase tracking-wide mb-2">{product.category?.name}</p>
          <h1 className="font-display text-3xl mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <RatingStars rating={product.rating} count={product.reviewCount} />
            <span className="text-xs text-ink-soft/50 font-mono">SKU: {product.sku}</span>
          </div>

          <PriceTag price={product.finalPrice} oldPrice={product.discount ? product.price : null} size="lg" />

          <p className="text-sm text-ink-soft/80 mt-5 leading-relaxed">{product.shortDescription || product.description}</p>

          <div className="mt-3">
            {outOfStock ? (
              <Badge variant="error">Out of Stock</Badge>
            ) : (
              <Badge variant="teal">In Stock ({product.stock} available)</Badge>
            )}
          </div>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-ink-soft/60 mb-2">
                {product.variants[0].name}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariantId(v._id)}
                    disabled={v.stock <= 0}
                    className={`px-4 py-2 text-sm border disabled:opacity-30 ${
                      selectedVariantId === v._id ? "border-ink bg-ink text-paper" : "border-line"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-7">
            <div className="flex items-center border border-line">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            <Button variant="primary" size="lg" className="flex-1" disabled={outOfStock} onClick={handleAddToCart}>
              <ShoppingBag size={16} /> Add to Cart
            </Button>

            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className="w-11 h-11 flex-shrink-0 border border-line flex items-center justify-center"
            >
              <Heart size={17} className={wishlisted ? "fill-error text-error" : ""} />
            </button>
          </div>

          <Link to="/checkout" className="block mt-3">
            <Button variant="outline" size="lg" className="w-full" disabled={outOfStock}>
              Buy Now
            </Button>
          </Link>

          <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-line text-center">
            <div>
              <Truck size={17} className="mx-auto mb-1.5 text-amber" />
              <p className="text-xs text-ink-soft/60">2-5 day delivery</p>
            </div>
            <div>
              <RotateCcw size={17} className="mx-auto mb-1.5 text-amber" />
              <p className="text-xs text-ink-soft/60">14-day returns</p>
            </div>
            <div>
              <ShieldCheck size={17} className="mx-auto mb-1.5 text-amber" />
              <p className="text-xs text-ink-soft/60">Secure checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-6 border-b border-line overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab ? "border-ink font-medium" : "border-transparent text-ink-soft/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-8 max-w-2xl">
          {activeTab === "Description" && <p className="text-sm text-ink-soft/80 leading-relaxed">{product.description}</p>}

          {activeTab === "Specifications" && (
            <table className="w-full text-sm">
              <tbody>
                {product.specifications?.map((spec) => (
                  <tr key={spec.key} className="border-b border-line">
                    <td className="py-2.5 text-ink-soft/60 w-1/3">{spec.key}</td>
                    <td className="py-2.5">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "Reviews" && (
            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p className="text-sm text-ink-soft/60">No reviews yet for this product.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="border-b border-line pb-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium">{r.user?.firstName} {r.user?.lastName}</p>
                      <span className="text-xs text-ink-soft/50">{formatDate(r.createdAt)}</span>
                    </div>
                    <RatingStars rating={r.rating} size={12} />
                    <p className="text-sm text-ink-soft/80 mt-2">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "Shipping & Returns" && (
            <div className="text-sm text-ink-soft/80 leading-relaxed flex flex-col gap-3">
              <p>Standard delivery takes 2-5 business days. Express delivery is available at checkout.</p>
              <p>Items can be returned within 14 days of delivery if unused and in original packaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-display text-2xl mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
