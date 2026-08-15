import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping in 2-5 business days" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "Payments verified and protected end to end" },
  { icon: RotateCcw, title: "Easy Returns", desc: "14-day return window on eligible items" },
  { icon: Headphones, title: "Real Support", desc: "Reach a human whenever you need help" },
];

export default function WhyChooseUs() {
  return (
    <section className="container-page py-16 border-t border-line">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center md:text-left">
            <Icon size={22} strokeWidth={1.5} className="text-amber mx-auto md:mx-0 mb-3" />
            <h4 className="font-medium text-sm mb-1">{title}</h4>
            <p className="text-xs text-ink-soft/60">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
