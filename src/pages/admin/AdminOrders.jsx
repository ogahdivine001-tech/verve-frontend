import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye } from "lucide-react";
import { orderService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import PriceTag from "../../components/PriceTag";
import Pagination from "../../components/Pagination";
import { ProductGridSkeleton } from "../../components/Loading";
import { formatDate } from "../../utils/format";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", search, status, page],
    queryFn: () => orderService.getAll({ search, status, page, limit: 15 }),
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const handleStatusChange = async (order, newStatus) => {
    try {
      await orderService.updateStatus(order._id, newStatus, order.user?.email);
      showToast(`Order marked as ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err) {
      showToast(err.message || "Could not update order", "error");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Orders</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper">
          <Search size={14} className="text-ink-soft/40" />
          <input
            placeholder="Search order number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="outline-none text-sm bg-transparent"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-line px-3 py-2 text-sm outline-none bg-paper"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="bg-paper border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="text-left py-3 px-4">Order</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Payment</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">View</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-line last:border-0">
                  <td className="py-3 px-4 price-tag">{order.orderNumber}</td>
                  <td className="py-3 px-4">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="py-3 px-4 text-ink-soft/60">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4"><PriceTag price={order.total} size="sm" /></td>
                  <td className="py-3 px-4">
                    <span className={order.paymentStatus === "Paid" ? "text-success" : "text-ink-soft/60"}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className="border border-line px-2 py-1 text-xs outline-none bg-paper"
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/dashboard/orders/${order._id}`} aria-label="View order">
                      <Eye size={15} className="text-ink-soft/60 hover:text-ink inline-block" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={pagination?.page || 1} pages={pagination?.pages || 1} onChange={setPage} />
    </div>
  );
}
