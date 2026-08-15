import RatingStars from "../../components/RatingStars";

const testimonials = [
  {
    name: "Amara O.",
    text: "Ordered a watch and it arrived in three days, exactly as pictured. Checkout was painless.",
    rating: 5,
  },
  {
    name: "Tunde B.",
    text: "Good range of products across categories. I don't need five different apps anymore.",
    rating: 5,
  },
  {
    name: "Fatima Y.",
    text: "Had an issue with a size and support sorted it same day. Would order again.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-warm-grey py-16">
      <div className="container-page">
        <h2 className="font-display text-3xl mb-10 text-center">What Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-paper p-6">
              <RatingStars rating={t.rating} size={13} />
              <p className="text-sm text-ink-soft/80 my-4 leading-relaxed">"{t.text}"</p>
              <p className="text-sm font-medium">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
