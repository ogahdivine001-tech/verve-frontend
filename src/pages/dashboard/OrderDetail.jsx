import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService, reviewService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import OrderTrackingTimeline from "../../components/OrderTrackingTimeline";
import PriceTag from "../../components/PriceTag";
import RatingStars from "../../components/RatingStars";
import Button from "../../components/Button";
import { TextSkeleton } from "../../components/Loading";
import { formatDate } from "../../utils/format";

function ReviewForm({ productId, orderId, onDone }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const submit = async () => {
    if (!comment.trim()) {
      showToast("Please write a short review", "error");
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.create({ productId, orderId, rating, comment });
      showToast("Review submitted, thank you");
      onDone();
    } catch (err) {
      showToast(err.message || "Could not submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-grey p-4 mt-3">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`Rate ${n} stars`}>
            <RatingStars rating={n <= rating ? 5 : 0} size={16} />
          </button>
        ))}
      </div>
      <textarea
        rows={2}
        placeholder="Share your thoughts on this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink mb-2 resize-none"
      />
      <Button size="sm" variant="primary" loading={submitting} onClick={submit}>Submit Review</Button>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.showToast);

  const { data, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getById(id),
  });

  const order = data?.data;

  const handleCancel = async () => {
    if (!confirm("Cancel this order? This cannot be undone.")) return;
    try {
      await orderService.cancel(id);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      showToast("Order cancelled");
    } catch (err) {
      showToast(err.message || "Could not cancel order", "error");
    }
  };

  if (isLoading) return <TextSkeleton className="h-64" />;
  if (!order) return <p className="text-sm text-ink-soft/60">Order not found.</p>;

  const canCancel = !["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(order.orderStatus);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl">{order.orderNumber}</h2>
          <p className="text-xs text-ink-soft/50 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        {canCancel && (
          <Button variant="danger" size="sm" onClick={handleCancel}>Cancel Order</Button>
        )}
      </div>

      <div className="mb-10 py-6 border-y border-line">
        <OrderTrackingTimeline currentStatus={order.orderStatus} />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-2">Shipping Address</h3>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-ink-soft/70">{order.shippingAddress.address}</p>
          <p className="text-sm text-ink-soft/70">
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </p>
          <p className="text-sm text-ink-soft/70">{order.shippingAddress.phone}</p>
        </div>
        <div>
          <h3 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-2">Payment</h3>
          <p className="text-sm">Status: <span className="font-medium">{order.paymentStatus}</span></p>
          <p className="text-sm text-ink-soft/70 font-mono mt-1">Ref: {order.paymentReference}</p>
        </div>
      </div>

      <h3 className="text-xs uppercase tracking-wide text-ink-soft/60 mb-3">Items</h3>
      <div className="flex flex-col divide-y divide-line mb-8">
        {order.items.map((item, i) => (
          <div key={i} className="py-4">
            <div className="flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-warm-grey flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-ink-soft/50">Qty: {item.quantity}</p>
              </div>
              <PriceTag price={item.price * item.quantity} size="sm" />
            </div>

            {order.orderStatus === "Delivered" && (
              reviewingProductId === item.product ? (
                <ReviewForm
                  productId={item.product}
                  orderId={order._id}
                  onDone={() => setReviewingProductId(null)}
                />
              ) : (
                <button
                  onClick={() => setReviewingProductId(item.product)}
                  className="text-xs text-teal hover:underline mt-2"
                >
                  Leave a review
                </button>
              )
            )}
          </div>
        ))}
      </div>

      <div className="bg-warm-grey p-5 flex flex-col gap-2 text-sm max-w-xs ml-auto">
        <div className="flex justify-between"><span className="text-ink-soft/60">Subtotal</span><span>₦{order.subtotal.toLocaleString()}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-₦{order.discount.toLocaleString()}</span></div>}
        <div className="flex justify-between"><span className="text-ink-soft/60">Shipping</span><span>₦{order.shipping.toLocaleString()}</span></div>
        <div className="flex justify-between pt-2 border-t border-line font-medium"><span>Total</span><PriceTag price={order.total} size="sm" /></div>
      </div>
    </div>
  );
}
