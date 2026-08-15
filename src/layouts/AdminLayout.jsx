import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import ToastContainer from "../components/ToastContainer";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Coupons", to: "/admin/coupons", icon: Ticket },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Notifications", to: "/admin/notifications", icon: Bell },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <Link to="/" className="font-display text-xl block px-6 py-6">
        Verve <span className="text-xs text-paper/50 font-body">Admin</span>
      </Link>
      <nav className="flex flex-col gap-0.5 px-3">
        {links.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={label}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive ? "bg-amber text-paper" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen flex bg-warm-grey">
      <aside className="hidden lg:block w-60 bg-ink flex-shrink-0">{sidebarContent}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-ink">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-4 text-paper"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-ink px-4 py-4 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="text-paper" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg text-paper">Verve Admin</span>
          <div className="w-5" />
        </div>
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
