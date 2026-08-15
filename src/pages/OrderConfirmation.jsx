import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { paymentService } from "../services";
import { useCartStore } from "../context/cartStore";
import { LoadingSpinner } from "../components/Loading";
import PriceTag from "../components/PriceTag";
import Button from "../components/Button";
import { formatDate } from "../utils/format";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [order, setOrder] = useState(null);
  const loadCart = useCartStore((s) => s.loadCart);
  const verifiedRef = useRef(null);

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    // React 19 Strict Mode runs effects twice in development. Without this
    // guard, two concurrent verify calls race each other, and whichever
    // resolves last "wins" and sets the page state, even if it's the
    // redundant call. This ensures only one verify request ever fires per
    // reference, and a stray second call can't overwrite a good result.
    if (verifiedRef.current === reference) return;
    verifiedRef.current = reference;

    const verify = async () => {
      try {
        const res = await paymentService.verify(reference);
        setOrder(res.data);
        setStatus(res.data.paymentStatus === "Paid" ? "success" : "failed");
        if (res.data.paymentStatus === "Paid") loadCart();
      } catch {
        setStatus("failed");
      }
    };

    verify();
  }, [reference]);

  if (status === "verifying") {
    return (
      <div className="container-page py-24 flex flex-col items-center gap-4">
        <LoadingSpinner size={30} />
        <p className="text-sm text-ink-soft/60">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container-page py-24 text-center">
        <XCircle size={44} className="text-error mx-auto mb-5" />
        <h1 className="font-display text-2xl mb-2">Payment Failed</h1>
        <p className="text-sm text-ink-soft/60 mb-8 max-w-sm mx-auto">
          We couldn't verify your payment. If you were charged, please contact
          support with your reference.
        </p>
        <Link to="/checkout">
          <Button variant="primary">Try Again</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-20 max-w-lg mx-auto text-center">
      <CheckCircle2 size={44} className="text-success mx-auto mb-5" />
      <h1 className="font-display text-3xl mb-2">Order Confirmed!</h1>
      <p className="text-sm text-ink-soft/60 mb-8">
        Thank you, we've received your order.
      </p>

      <div className="bg-warm-grey p-6 text-left mb-8">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-ink-soft/60">Order Number</span>
          <span className="price-tag">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-ink-soft/60">Payment Status</span>
          <span className="text-success font-medium">
            {order.paymentStatus}
          </span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-ink-soft/60">Order Date</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-ink-soft/60">Estimated Delivery</span>
          <span>
            {order.deliveryMethod === "express"
              ? "1-2 business days"
              : "2-5 business days"}
          </span>
        </div>
        <div className="flex justify-between pt-4 border-t border-line">
          <span className="font-medium">Total</span>
          <PriceTag price={order.total} size="lg" />
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to={`/dashboard/orders/${order._id}`}>
          <Button variant="primary">View Order</Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
