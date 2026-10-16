import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts, getCategories } from "../../data/catalog";
import { PosterCard } from "../common/PosterCard";
import { ArrowRight } from "lucide-react";

export const CuratedGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const allProducts = getAllProducts();
  const categories = getCategories().slice(0, 5);

  const displayedProducts =
    activeTab === "all"
      ? allProducts.slice(0, 8)
      : allProducts.filter((p) => p.categorySlug === activeTab).slice(0, 8);

  return (
    <section id="curated-collection" className="py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium">
            Handcrafted Catalogue
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171717] font-normal mt-2">
            Art Worth Looking At
          </h2>
          <p className="text-sm text-[#7A7167] mt-3 font-light leading-relaxed">
            Each poster is treated like a gallery exhibition piece. Printed using 12-colour archival pigment technology on heavyweight 300 GSM cotton rag.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-12">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                : "bg-white border border-[#EAE5DC] text-[#5C554E] hover:border-[#171717]"
            }`}
          >
            All Works
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === cat.slug
                  ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                  : "bg-white border border-[#EAE5DC] text-[#5C554E] hover:border-[#171717]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Poster Grid: 4 cols on large, 3 on md, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayedProducts.map((poster, index) => (
            <PosterCard key={poster.id} poster={poster} priority={index < 4} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            to="/posters"
            className="inline-flex items-center gap-2.5 bg-[#FAF8F5] hover:bg-[#1C1A17] text-[#171717] hover:text-[#FAF8F5] border border-[#171717] px-8 py-4 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            <span>Explore All {allProducts.length} Posters</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
