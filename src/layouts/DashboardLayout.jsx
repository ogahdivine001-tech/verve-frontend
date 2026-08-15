import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, User, MapPin, Heart, Bell, Lock } from "lucide-react";

const links = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "My Orders", to: "/dashboard/orders", icon: Package },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Addresses", to: "/dashboard/addresses", icon: MapPin },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Notifications", to: "/dashboard/notifications", icon: Bell },
  { label: "Security", to: "/dashboard/security", icon: Lock },
];

export default function DashboardLayout() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl mb-8">My Account</h1>
      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 text-sm whitespace-nowrap ${
                  isActive ? "bg-ink text-paper" : "text-ink-soft hover:bg-warm-grey"
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
