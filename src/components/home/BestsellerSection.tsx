import React from "react";
import { Link } from "react-router-dom";
import { getBestsellerProducts } from "../../data/catalog";
import { PosterCard } from "../common/PosterCard";
import { ArrowRight, Star } from "lucide-react";

export const BestsellerSection: React.FC = () => {
  const bestsellers = getBestsellerProducts(4);

  return (
    <section className="py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium mb-2">
              <Star className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />
              <span>Collector Favourites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal">
              Most Loved Prints
            </h2>
          </div>
          <Link
            to="/posters?filter=bestseller"
            className="mt-3 md:mt-0 text-xs uppercase tracking-widest text-[#171717] hover:text-[#8C7D70] font-medium flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Bestseller Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((poster) => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </div>

      </div>
    </section>
  );
};
