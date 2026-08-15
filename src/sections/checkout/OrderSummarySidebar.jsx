import PriceTag from "../../components/PriceTag";

export default function OrderSummarySidebar({ items, subtotal, shipping, discount = 0, couponCode }) {
  const total = subtotal - discount + shipping;

  return (
    <div className="bg-warm-grey p-6 h-fit">
      <h2 className="font-display text-xl mb-5">Order Summary</h2>

      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-5 pr-1">
        {items.map((item) => (
          <div key={item._id} className="flex gap-3 items-center">
            <div className="relative flex-shrink-0">
              <img src={item.product?.images?.[0]} alt="" className="w-12 h-12 object-cover bg-paper" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ink text-paper text-[10px] rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <p className="text-xs flex-1 line-clamp-1">{item.product?.name}</p>
            <PriceTag price={(item.product?.finalPrice ?? item.product?.price ?? 0) * item.quantity} size="sm" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 text-sm border-t border-line pt-4">
        <div className="flex justify-between">
          <span className="text-ink-soft/70">Subtotal</span>
          <PriceTag price={subtotal} size="sm" />
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Coupon ({couponCode})</span>
            <span className="price-tag text-sm">-₦{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-ink-soft/70">Shipping</span>
          <PriceTag price={shipping} size="sm" />
        </div>
      </div>

      <div className="flex justify-between pt-4 mt-3 border-t border-line">
        <span className="font-medium">Total</span>
        <PriceTag price={total} size="lg" />
      </div>
    </div>
  );
}
