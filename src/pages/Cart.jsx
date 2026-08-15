import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "../context/cartStore";
import PriceTag from "../components/PriceTag";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse the shop and add items you love."
          actionLabel="Continue Shopping"
          actionTo="/shop"
        />
      </div>
    );
  }

  const shipping = 2000;
  const total = subtotal() + shipping;

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div>
          <div className="hidden md:grid grid-cols-[1fr_120px_100px_40px] gap-4 pb-3 border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
            <span>Product</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Subtotal</span>
            <span />
          </div>

          {items.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_100px_40px] gap-4 items-center py-5 border-b border-line"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={item.product?.images?.[0]}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover bg-warm-grey flex-shrink-0"
                />
                <div>
                  <Link to={`/products/${item.product?.slug}`} className="text-sm font-medium hover:underline">
                    {item.product?.name}
                  </Link>
                  <div className="mt-1">
                    <PriceTag price={item.product?.finalPrice ?? item.product?.price} size="sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center border border-line w-fit md:justify-self-center">
                <button
                  onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className="md:text-right">
                <PriceTag price={(item.product?.finalPrice ?? item.product?.price ?? 0) * item.quantity} size="sm" />
              </div>

              <button onClick={() => removeItem(item._id)} aria-label="Remove item" className="justify-self-end">
                <Trash2 size={16} className="text-ink-soft/50 hover:text-error" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between mt-6">
            <Link to="/shop" className="text-sm text-teal hover:underline">
              Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-sm text-ink-soft/60 hover:text-error">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="bg-warm-grey p-6 h-fit">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <div className="flex flex-col gap-3 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-ink-soft/70">Subtotal</span>
              <PriceTag price={subtotal()} size="sm" />
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft/70">Shipping</span>
              <PriceTag price={shipping} size="sm" />
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-line mb-6">
            <span className="font-medium">Total</span>
            <PriceTag price={total} size="lg" />
          </div>
          <Link to="/checkout">
            <Button variant="primary" className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
