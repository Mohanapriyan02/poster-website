import React from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryBySlug, getProductsByCategory, getCategories } from "../data/catalog";
import { PosterCard } from "../components/common/PosterCard";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const posters = slug ? getProductsByCategory(slug) : [];
  const allCategories = getCategories();

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#171717]">Category Not Found</h2>
        <p className="text-sm text-[#8C7D70] mt-2">The requested category could not be located.</p>
        <Link
          to="/posters"
          className="mt-6 inline-flex items-center gap-2 bg-[#1C1A17] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Posters</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Category Editorial Hero Banner */}
      <div className="relative bg-[#1C1A17] text-[#FAF8F5] overflow-hidden py-14 sm:py-20 border-b border-[#2E2A25]">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Categories", href: "/#categories" },
              { label: category.name },
            ]}
          />
          <div className="mt-4 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-mono">
              Curated Genre · {posters.length} Prints Available
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#FAF8F5] font-normal mt-2">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-[#D4CDC3] mt-4 leading-relaxed font-light">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE5DC]">
          <span className="text-xs uppercase tracking-widest text-[#8C7D70]">
            All {category.name} Artworks
          </span>
          <Link
            to="/posters"
            className="text-xs uppercase tracking-wider text-[#171717] hover:text-[#8C7D70] flex items-center gap-1 font-medium"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {posters.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {posters.map((poster) => (
              <PosterCard key={poster.id} poster={poster} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-[#7A7167]">No posters currently catalogued in this category.</p>
          </div>
        )}

        {/* Other Categories Carousel */}
        <div className="mt-20 pt-12 border-t border-[#EAE5DC]">
          <h3 className="font-serif text-2xl text-[#171717] mb-6">Explore Other Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {allCategories
              .filter((c) => c.slug !== category.slug)
              .slice(0, 6)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  className="bg-white border border-[#EAE5DC] p-3 hover:border-[#171717] transition-all group"
                >
                  <span className="block font-serif text-sm font-medium text-[#171717] group-hover:text-[#8C7D70] truncate">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-[#8C7D70]">{c.posterCount || 4} Prints</span>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
