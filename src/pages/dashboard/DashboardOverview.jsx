import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, Heart } from "lucide-react";
import { orderService } from "../../services";
import { useWishlistStore } from "../../context/wishlistStore";
import { useAuthStore } from "../../context/authStore";
import { TextSkeleton } from "../../components/Loading";

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.count());

  const { data, isLoading } = useQuery({
    queryKey: ["my-orders-overview"],
    queryFn: () => orderService.getMine({ limit: 100 }),
  });

  const orders = data?.data || [];
  const pending = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.orderStatus)).length;
  const completed = orders.filter((o) => o.orderStatus === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: orders.length, icon: Package },
    { label: "Pending Orders", value: pending, icon: Clock },
    { label: "Completed Orders", value: completed, icon: CheckCircle2 },
    { label: "Wishlist Items", value: wishlistCount, icon: Heart },
  ];

  return (
    <div>
      <p className="text-sm text-ink-soft/60 mb-6">Welcome back, {user?.firstName}.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-line p-5">
            <Icon size={18} className="text-amber mb-3" />
            {isLoading ? <TextSkeleton className="h-6 w-10 mb-1" /> : <p className="font-display text-2xl">{value}</p>}
            <p className="text-xs text-ink-soft/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">Recent Orders</h2>
        <Link to="/dashboard/orders" className="text-sm text-teal hover:underline">View all</Link>
      </div>

      {isLoading ? (
        <TextSkeleton className="h-40" />
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink-soft/60">You haven't placed any orders yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-line">
          {orders.slice(0, 5).map((order) => (
            <Link key={order._id} to={`/dashboard/orders/${order._id}`} className="flex items-center justify-between py-4 text-sm">
              <div>
                <p className="price-tag">{order.orderNumber}</p>
                <p className="text-xs text-ink-soft/50 mt-0.5">{order.items.length} item(s)</p>
              </div>
              <span className="text-xs px-2 py-1 bg-warm-grey">{order.orderStatus}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
