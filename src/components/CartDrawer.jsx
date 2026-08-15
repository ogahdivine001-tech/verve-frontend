import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../context/cartStore";
import PriceTag from "./PriceTag";
import Button from "./Button";
import EmptyState from "./EmptyState";
import { ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-ink/40 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-paper z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-line">
              <h2 className="font-display text-xl">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={ShoppingBag}
                  title="Your cart is empty"
                  message="Items you add will show up here."
                  actionLabel="Continue Shopping"
                  actionTo="/shop"
                />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover bg-warm-grey flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                        <div className="mt-1">
                          <PriceTag price={item.product?.finalPrice ?? item.product?.price} size="sm" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-line">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item._id)} aria-label="Remove item">
                            <Trash2 size={15} className="text-ink-soft/50 hover:text-error" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line px-6 py-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-ink-soft">Subtotal</span>
                    <PriceTag price={subtotal()} size="lg" />
                  </div>
                  <Link to="/checkout" onClick={closeCart}>
                    <Button variant="primary" className="w-full mb-2">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full" onClick={closeCart}>
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
