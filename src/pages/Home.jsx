import Hero from "../sections/home/Hero";
import FeaturedCategories from "../sections/home/FeaturedCategories";
import FlashSale from "../sections/home/FlashSale";
import ProductRow from "../sections/home/ProductRow";
import PromoBanner from "../sections/home/PromoBanner";
import WhyChooseUs from "../sections/home/WhyChooseUs";
import Testimonials from "../sections/home/Testimonials";
import InstagramGallery from "../sections/home/InstagramGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FlashSale />
      <ProductRow
        title="Featured Products"
        subtitle="Handpicked for you"
        params={{ featured: true }}
        viewAllTo="/shop?featured=true"
      />
      <ProductRow
        title="New Arrivals"
        subtitle="Just landed"
        params={{ newArrival: true, sort: "newest" }}
        viewAllTo="/shop?newArrival=true"
      />
      <ProductRow
        title="Best Sellers"
        subtitle="Customer favorites"
        params={{ bestSeller: true, sort: "popular" }}
        viewAllTo="/shop?bestSeller=true"
      />
      <PromoBanner />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
