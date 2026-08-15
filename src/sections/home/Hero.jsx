import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../components/Button";

export default function Hero() {
  return (
    <section className="relative bg-warm-grey overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="price-tag text-teal text-xs uppercase tracking-widest mb-5">
            New season, new finds
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">
            Discover Products <br /> You'll Love
          </h1>
          <p className="text-ink-soft/80 text-base max-w-md mb-8">
            Shop premium electronics, fashion, beauty, and home goods at great
            prices, with fast delivery and secure checkout on every order.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg">
                Explore Collection
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-2 gap-3"
        >
          <img
            src="https://images.unsplash.com/photo-1558625786-7435d72023e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFja2FnZSUyMHZlcnZlfGVufDB8fDB8fHww"
            alt="Featured product"
            className="w-full h-full object-cover aspect-[3/4] col-span-1"
          />
          <div className="flex flex-col gap-3">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Featured product"
              className="w-full object-cover aspect-[6/5]"
            />
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D"
              alt="Featured product"
              className="w-full object-cover aspect-[6/5]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
