import { Users, Target, Eye, Award } from "lucide-react";

const stats = [
  { label: "Products", value: "2,000+" },
  { label: "Happy Customers", value: "15,000+" },
  { label: "Cities Delivered", value: "120+" },
  { label: "Years Running", value: "5" },
];

const values = [
  { icon: Target, title: "Curated, not cluttered", desc: "Every product is chosen with intent, not just listed to fill space." },
  { icon: Eye, title: "Transparent pricing", desc: "The price you see is the price you pay. No surprise fees at checkout." },
  { icon: Award, title: "Quality first", desc: "We work with brands and makers who stand behind what they sell." },
];

export default function About() {
  return (
    <div>
      <section className="bg-warm-grey py-16">
        <div className="container-page max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-teal mb-3">Our Story</p>
          <h1 className="font-display text-4xl mb-5">Built by people who actually shop online</h1>
          <p className="text-ink-soft/80 leading-relaxed">
            Verve started as a simple idea: online shopping shouldn't mean juggling five different
            apps for electronics, fashion, beauty, and home goods. We bring it together in one store,
            with the same bar for quality and service across every category.
          </p>
        </div>
      </section>

      <section className="container-page py-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl text-amber mb-1">{s.value}</p>
            <p className="text-xs text-ink-soft/60 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-16 border-t border-line">
        <h2 className="font-display text-2xl mb-8 text-center">What We Stand For</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <Icon size={22} strokeWidth={1.5} className="text-amber mx-auto mb-3" />
              <h3 className="font-medium text-sm mb-2">{title}</h3>
              <p className="text-xs text-ink-soft/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="careers" className="bg-ink text-paper py-16">
        <div className="container-page text-center max-w-lg mx-auto">
          <Users size={26} className="mx-auto mb-4 text-amber" />
          <h2 className="font-display text-2xl mb-3">We're hiring</h2>
          <p className="text-paper/70 text-sm mb-6">
            Curious, detail-oriented people who care about good products and good service.
            Reach out through our contact page if that sounds like you.
          </p>
        </div>
      </section>
    </div>
  );
}
