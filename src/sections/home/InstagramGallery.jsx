const galleryKeywords = [
  "fashion,outfit",
  "sneakers",
  "skincare,beauty",
  "home,decor",
  "watch,accessory",
  "gamer,tech",
];

export default function InstagramGallery() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-teal mb-2">
            @verve.store
          </p>
          <h2 className="font-display text-3xl">Follow Along</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {galleryKeywords.map((keyword, i) => (
            <a
              key={keyword}
              href="#"
              className="aspect-square overflow-hidden bg-warm-grey block group"
            >
              <img
                src={`https://loremflickr.com/400/400/${keyword}?lock=${400 + i}`}
                alt="Customer photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
