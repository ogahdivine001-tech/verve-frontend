import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LayoutDashboard,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "../context/cartStore";
import { useWishlistStore } from "../context/wishlistStore";
import { useAuthStore } from "../context/authStore";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "Deals", to: "/shop?discount=true" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.count());
  const openCart = useCartStore((s) => s.openCart);
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-paper transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}
    >
      <div className="border-b border-line py-2 hidden md:block">
        <p className="container-page text-center text-xs tracking-wide text-ink-soft/70">
          Free shipping on orders over ₦50,000. New arrivals dropping weekly.
        </p>
      </div>

      <div className="container-page flex items-center justify-between h-16">
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="font-display text-2xl tracking-tight">
          Verve
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-ink-soft hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <button onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search size={19} />
          </button>
          <Link
            to="/wishlist"
            className="relative hidden sm:block"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber text-paper text-[10px] flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button onClick={openCart} className="relative" aria-label="Cart">
            <ShoppingBag size={19} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber text-paper text-[10px] flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((s) => !s)}
                className="flex items-center gap-1"
                aria-label="Account menu"
                aria-expanded={accountOpen}
              >
                <User size={19} />
                <ChevronDown
                  size={13}
                  className={`hidden sm:block transition-transform ${accountOpen ? "rotate-180" : ""}`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 bg-paper border border-line shadow-lg py-1.5 z-50">
                  <p className="px-4 py-2 text-xs text-ink-soft/50 border-b border-line mb-1">
                    Signed in as{" "}
                    <span className="text-ink font-medium">
                      {user?.firstName}
                    </span>
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-warm-grey"
                  >
                    <Package size={14} /> My Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-warm-grey"
                    >
                      <LayoutDashboard size={14} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-warm-grey text-left border-t border-line mt-1 pt-2.5"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="Account">
              <User size={19} />
            </Link>
          )}
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-line bg-paper">
          <form
            onSubmit={handleSearch}
            className="container-page py-4 flex items-center gap-3"
          >
            <Search size={18} className="text-ink-soft/50" />
            <input
              autoFocus
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-paper md:hidden">
          <div className="container-page py-5 flex items-center justify-between border-b border-line">
            <span className="font-display text-xl">Verve</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="container-page py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="py-3 border-b border-line text-base"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="py-3 border-b border-line text-base"
            >
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 border-b border-line text-base"
                >
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="py-3 border-b border-line text-base"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="py-3 border-b border-line text-base text-left text-error"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="py-3 border-b border-line text-base"
              >
                Log In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
