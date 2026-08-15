import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, ShoppingCart, Users, Package, Clock, AlertTriangle } from "lucide-react";
import { analyticsService } from "../../services";
import { TextSkeleton } from "../../components/Loading";
import { formatPrice } from "../../utils/format";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
];

export default function AdminDashboard() {
  const [range, setRange] = useState("30d");

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ["admin-overview", range],
    queryFn: () => analyticsService.getOverview(range),
  });

  const { data: revenueChart, isLoading: loadingChart } = useQuery({
    queryKey: ["admin-revenue-chart", range],
    queryFn: () => analyticsService.getRevenueChart(range),
  });

  const stats = overview?.data;
  const chartData = revenueChart?.data || [];

  const cards = [
    { label: "Total Revenue", value: stats ? formatPrice(stats.totalRevenue) : "—", icon: DollarSign },
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: ShoppingCart },
    { label: "Total Customers", value: stats?.totalCustomers ?? "—", icon: Users },
    { label: "Total Products", value: stats?.totalProducts ?? "—", icon: Package },
    { label: "Pending Orders", value: stats?.pendingOrders ?? "—", icon: Clock },
    { label: "Low Stock Products", value: stats?.lowStockProducts ?? "—", icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl">Dashboard</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-line px-3 py-2 text-sm outline-none bg-paper"
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-paper border border-line p-5">
            <Icon size={18} className="text-amber mb-3" />
            {loadingOverview ? <TextSkeleton className="h-7 w-16 mb-1" /> : <p className="font-display text-2xl">{value}</p>}
            <p className="text-xs text-ink-soft/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-paper border border-line p-6">
        <h2 className="font-display text-lg mb-5">Revenue</h2>
        {loadingChart ? (
          <TextSkeleton className="h-64" />
        ) : chartData.length === 0 ? (
          <p className="text-sm text-ink-soft/60 py-12 text-center">No revenue data for this period.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#E7E4DC" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E7E4DC" }} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => formatPrice(value)} />
              <Line type="monotone" dataKey="revenue" stroke="#C9962B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
