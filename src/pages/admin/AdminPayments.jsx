import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services";
import PriceTag from "../../components/PriceTag";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";
import { ProductGridSkeleton } from "../../components/Loading";
import { formatDate } from "../../utils/format";

export default function AdminPayments() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", page],
    queryFn: () => orderService.getAll({ page, limit: 15 }),
  });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Payments</h1>

      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="bg-paper border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="text-left py-3 px-4">Order</th>
                <th className="text-left py-3 px-4">Reference</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-line last:border-0">
                  <td className="py-3 px-4 price-tag">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-ink-soft/60 font-mono text-xs">{order.paymentReference}</td>
                  <td className="py-3 px-4"><PriceTag price={order.total} size="sm" /></td>
                  <td className="py-3 px-4">
                    <Badge variant={order.paymentStatus === "Paid" ? "teal" : order.paymentStatus === "Failed" ? "error" : "outline"}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-ink-soft/60">{formatDate(order.createdAt)}</td>
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
