import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function PromoBanner() {
  return (
    <section className="container-page py-8">
      <div className="relative bg-teal text-paper overflow-hidden grid md:grid-cols-2 items-center">
        <div className="p-10 md:p-14">
          <p className="text-xs uppercase tracking-widest text-paper/70 mb-3">
            Limited time
          </p>
          <h3 className="font-display text-3xl mb-4">
            Up to 30% off select home essentials
          </h3>
          <p className="text-paper/80 text-sm mb-6 max-w-sm">
            Refresh your space with our curated home and living collection,
            while stock lasts.
          </p>
          <Link to="/shop?category=home-living">
            <Button variant="accent">Shop the Sale</Button>
          </Link>
        </div>
        <img
          src="https://plus.unsplash.com/premium_photo-1663047634444-b3192f901f5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9tZSUyMGVzc2VudGlhbHMlMjBwcm9kdWN0fGVufDB8fDB8fHww"
          alt="Home essentials promotion"
          className="w-full h-64 md:h-full object-cover"
        />
      </div>
    </section>
  );
}
