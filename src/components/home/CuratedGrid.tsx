import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { PosterCard } from "../common/PosterCard";
import { ArrowRight } from "lucide-react";

export const CuratedGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { publishedProducts: allProducts, categories } = useCatalog();
  const visibleCategories = categories.slice(0, 5);

  const displayedProducts =
    activeTab === "all"
      ? allProducts.slice(0, 8)
      : allProducts.filter((p) => p.categorySlug === activeTab).slice(0, 8);

  return (
    <section id="curated-collection" className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium">
            Handcrafted Catalogue
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#171717] font-normal mt-1 sm:mt-2">
            Art Worth Looking At
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7167] mt-2 sm:mt-3 font-light leading-relaxed">
            Each poster is treated like a gallery exhibition piece. Printed using 12-colour archival pigment technology on heavyweight 300 GSM cotton rag.
          </p>
        </div>

        {/* Mobile Horizontal Pill Scroll / Desktop Centered Wrap */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 sm:pb-0 sm:flex-wrap sm:justify-center mb-8 sm:mb-12 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-xs ${
              activeTab === "all"
                ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                : "bg-white border border-[#EAE5DC] text-[#5C554E] hover:border-[#171717]"
            }`}
          >
            All Works
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.slug)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-xs ${
                activeTab === cat.slug
                  ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                  : "bg-white border border-[#EAE5DC] text-[#5C554E] hover:border-[#171717]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 8 Product Grid: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.map((poster, index) => (
            <PosterCard key={poster.id} poster={poster} priority={index < 4} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/posters"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#171717] bg-white hover:bg-[#171717] text-[#171717] hover:text-[#FAF8F5] px-8 py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-300"
          >
            <span>Explore All {allProducts.length} Posters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
