import React from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../../data/catalog";
import { ArrowUpRight } from "lucide-react";

export const CuratedCollections: React.FC = () => {
  const collections = getCollections();

  return (
    <section id="collections" className="py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium">
              Thematic Narratives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal mt-2">
              Curated Collections
            </h2>
          </div>
          <p className="text-sm text-[#7A7167] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
            Cohesive print edits created to build balanced gallery wall arrangements with harmonic colour palettes and complementary themes.
          </p>
        </div>

        {/* 6 Curated Collection Banners (3x2 grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collection/${col.slug}`}
              className="group relative flex flex-col justify-end aspect-[16/11] overflow-hidden bg-[#24211D] border border-[#EAE5DC] p-6 text-white hover:border-[#171717] transition-all duration-300 hover:shadow-poster-hover"
            >
              {/* Background photography */}
              <img
                src={col.image}
                alt={col.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Dark subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between text-xs text-[#C5A880] mb-2 font-mono">
                  <span>COLLECTION</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center group-hover:bg-[#C5A880] group-hover:text-[#1C1A17] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-normal text-white group-hover:text-[#F2EDE4] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-[#EAE5DC]/80 mt-1.5 line-clamp-2 font-light leading-relaxed">
                  {col.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
