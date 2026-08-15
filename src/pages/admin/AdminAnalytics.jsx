import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { analyticsService } from "../../services";
import { TextSkeleton } from "../../components/Loading";
import { formatPrice } from "../../utils/format";

const RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "3m", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
];

const COLORS = ["#C9962B", "#1F5C52", "#C0392B", "#2E7D5B", "#A67A1F", "#13151A"];

export default function AdminAnalytics() {
  const [range, setRange] = useState("30d");

  const { data: topProducts, isLoading: loadingTop } = useQuery({
    queryKey: ["top-products", range],
    queryFn: () => analyticsService.getTopProducts(range),
  });

  const { data: categoryData, isLoading: loadingCat } = useQuery({
    queryKey: ["category-breakdown"],
    queryFn: () => analyticsService.getCategoryBreakdown(),
  });

  const { data: growthData, isLoading: loadingGrowth } = useQuery({
    queryKey: ["customer-growth", range],
    queryFn: () => analyticsService.getCustomerGrowth(range),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl">Analytics</h1>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-line px-3 py-2 text-sm outline-none bg-paper"
        >
          {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-paper border border-line p-6">
          <h2 className="font-display text-lg mb-5">Top Products</h2>
          {loadingTop ? (
            <TextSkeleton className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts?.data || []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#E7E4DC" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="unitsSold" fill="#C9962B" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-paper border border-line p-6">
          <h2 className="font-display text-lg mb-5">Category Breakdown</h2>
          {loadingCat ? (
            <TextSkeleton className="h-64" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData?.data || []} dataKey="count" nameKey="name" innerRadius={55} outerRadius={90}>
                  {(categoryData?.data || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-paper border border-line p-6">
        <h2 className="font-display text-lg mb-5">Customer Growth</h2>
        {loadingGrowth ? (
          <TextSkeleton className="h-64" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={growthData?.data || []}>
              <CartesianGrid stroke="#E7E4DC" vertical={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#E7E4DC" }} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="newCustomers" stroke="#1F5C52" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
