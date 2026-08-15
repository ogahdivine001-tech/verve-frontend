import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { userService } from "../../services";
import { useToastStore } from "../../context/toastStore";
import Badge from "../../components/Badge";
import Pagination from "../../components/Pagination";
import { ProductGridSkeleton } from "../../components/Loading";
import { formatDate } from "../../utils/format";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const showToast = useToastStore((s) => s.showToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers", search, page],
    queryFn: () => userService.getAll({ search, page, limit: 15 }),
  });

  const customers = data?.data || [];
  const pagination = data?.pagination;

  const handleToggleStatus = async (user) => {
    try {
      await userService.toggleStatus(user._id);
      showToast(`${user.firstName} ${user.isActive ? "disabled" : "enabled"}`);
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
    } catch (err) {
      showToast(err.message || "Could not update customer", "error");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Customers</h1>

      <div className="flex items-center gap-2 border border-line px-3 py-2 max-w-sm mb-6 bg-paper">
        <Search size={14} className="text-ink-soft/40" />
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="bg-paper border border-line overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft/50">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0">
                  <td className="py-3 px-4">{c.firstName} {c.lastName}</td>
                  <td className="py-3 px-4 text-ink-soft/60">{c.email}</td>
                  <td className="py-3 px-4 text-ink-soft/60">{formatDate(c.createdAt)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={c.isActive ? "teal" : "error"}>{c.isActive ? "Active" : "Disabled"}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleToggleStatus(c)} className="text-xs text-teal hover:underline">
                      {c.isActive ? "Disable" : "Enable"}
                    </button>
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
