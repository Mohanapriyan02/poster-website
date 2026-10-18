import React from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { ArrowRight } from "lucide-react";

export const FeaturedCategories: React.FC = () => {
  const { categories } = useCatalog();

  return (
    <section id="categories" className="py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium">
              Explore by Discipline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal mt-2">
              Curated Categories
            </h2>
          </div>
          <p className="text-sm text-[#7A7167] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
            From iconic anime horizons to brutalist motorsport blueprints, explore prints arranged by genre and aesthetic.
          </p>
        </div>

        {/* Categories Grid (Editorial Art Gallery Style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group flex flex-col bg-white border border-[#EAE5DC] overflow-hidden hover:border-[#171717] transition-all duration-300 hover:shadow-poster-hover"
            >
              {/* Category Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F2EDE4]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Poster count chip */}
                <div className="absolute top-3 right-3 bg-[#1C1A17]/80 text-[#FAF8F5] text-[10px] px-2 py-0.5 backdrop-blur-xs font-mono">
                  {cat.posterCount || 4} Prints
                </div>

                {/* Floating title on image */}
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-normal drop-shadow-xs">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-white flex items-center justify-between text-xs text-[#8C7D70] group-hover:text-[#171717] transition-colors">
                <span className="text-[11px] uppercase tracking-wider font-medium">Explore Gallery</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
