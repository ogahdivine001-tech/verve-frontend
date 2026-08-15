import { Link } from "react-router-dom";
import { Camera, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { useToastStore } from "../context/toastStore";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "New Arrivals", to: "/shop?newArrival=true" },
      { label: "Best Sellers", to: "/shop?bestSeller=true" },
      { label: "Deals", to: "/shop?discount=true" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
      { label: "Shipping", to: "/faq#shipping" },
      { label: "Returns", to: "/faq#returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/about#careers" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const showToast = useToastStore((s) => s.showToast);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      showToast("Enter a valid email address", "error");
      return;
    }
    showToast("You're subscribed. Watch your inbox.");
    setEmail("");
  };

  return (
    <footer className="bg-ink text-paper mt-24">
      <div className="container-page py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <Link to="/" className="font-display text-2xl">
            Verve
          </Link>
          <p className="text-sm text-paper/60 mt-3 max-w-xs">
            Electronics, fashion, beauty, and home, curated in one store. Fast delivery, secure checkout.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a href="#" aria-label="Instagram"><Camera size={17} className="text-paper/70 hover:text-paper" /></a>
            <a href="#" aria-label="Facebook"><Share2 size={17} className="text-paper/70 hover:text-paper" /></a>
            <a href="#" aria-label="Twitter"><MessageCircle size={17} className="text-paper/70 hover:text-paper" /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs uppercase tracking-wide text-paper/50 mb-4">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-paper/80 hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-xs uppercase tracking-wide text-paper/50 mb-4">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-paper/10 border border-paper/20 px-3 py-2 text-sm outline-none focus:border-amber"
            />
            <button type="submit" className="bg-amber text-paper text-sm py-2 font-medium">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-paper/10 py-5">
        <p className="container-page text-xs text-paper/50 text-center">
          © {new Date().getFullYear()} Verve. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
