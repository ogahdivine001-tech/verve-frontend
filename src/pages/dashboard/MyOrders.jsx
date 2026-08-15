import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { orderService } from "../../services";
import { ProductGridSkeleton } from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import PriceTag from "../../components/PriceTag";
import { formatDate } from "../../utils/format";

const statusColors = {
  Pending: "bg-warm-grey text-ink-soft",
  Processing: "bg-teal-soft text-teal",
  Shipped: "bg-teal-soft text-teal",
  "Out for Delivery": "bg-amber/15 text-amber-dark",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-error/15 text-error",
};

export default function MyOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMine({ limit: 50 }),
  });

  const orders = data?.data || [];

  if (isLoading) return <ProductGridSkeleton count={4} />;

  if (orders.length === 0) {
    return <EmptyState icon={Package} title="No orders yet" message="Your order history will show up here." actionLabel="Start Shopping" actionTo="/shop" />;
  }

  return (
    <div className="flex flex-col divide-y divide-line">
      {orders.map((order) => (
        <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <p className="price-tag text-sm">{order.orderNumber}</p>
            <p className="text-xs text-ink-soft/50 mt-1">{formatDate(order.createdAt)} · {order.items.length} item(s)</p>
          </div>
          <PriceTag price={order.total} size="sm" />
          <span className={`text-xs px-2.5 py-1 ${statusColors[order.orderStatus] || "bg-warm-grey"}`}>
            {order.orderStatus}
          </span>
        </Link>
      ))}
    </div>
  );
}
