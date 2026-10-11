const galleryKeywords = [
  "fashion,clothing",
  "accessories,jewelry",
  "shoes,sneakers",
  "bags,purses",
  "streetstyle,urban",
  "model,outfit",
];

export default function InstagramGallery() {
  return (
    <section className="py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-teal mb-2">
            @verve.store
          </p>
          <h2 className="font-display text-3xl font-bold">Follow Along</h2>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
          {galleryKeywords.map((keyword, i) => (
            <a
              key={keyword}
              href="#"
              className="relative aspect-square overflow-hidden bg-gray-200 block group"
            >
              <img
                src={`https://loremflickr.com/400/400/${keyword}?lock=${300 + i}`}
                alt="E-commerce customer outfit"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
