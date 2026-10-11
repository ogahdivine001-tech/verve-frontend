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
          {[...Array(6)].map((_, i) => (
            <a
              key={i}
              href="#"
              className="relative aspect-square overflow-hidden bg-gray-200 block group"
            >
              <img
                src={`https://picsum.photos/400/400?random=${i + 1}`}
                alt={`Customer photo ${i + 1}`}
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
