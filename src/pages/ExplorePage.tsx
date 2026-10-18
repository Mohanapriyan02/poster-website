import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { PosterCard } from "../components/common/PosterCard";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import type { FilterState, PosterOrientation } from "../types";

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { publishedProducts: allProducts, categories, collections } = useCatalog();

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    collection: searchParams.get("collection") || "all",
    orientation: searchParams.get("orientation") || "all",
    sortBy: (searchParams.get("filter") === "bestseller" ? "bestseller" : "featured") as any,
  });

  // Sync state if url params change
  useEffect(() => {
    const s = searchParams.get("search");
    const cat = searchParams.get("category");
    const col = searchParams.get("collection");
    const sort = searchParams.get("filter");
    if (s !== null) setFilters((prev) => ({ ...prev, search: s }));
    if (cat !== null) setFilters((prev) => ({ ...prev, category: cat }));
    if (col !== null) setFilters((prev) => ({ ...prev, collection: col }));
    if (sort === "bestseller") setFilters((prev) => ({ ...prev, sortBy: "bestseller" }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category && filters.category !== "all") {
      list = list.filter((p) => p.categorySlug === filters.category);
    }

    // Collection
    if (filters.collection && filters.collection !== "all") {
      list = list.filter((p) => p.collectionSlug === filters.collection);
    }

    // Orientation
    if (filters.orientation && filters.orientation !== "all") {
      list = list.filter((p) => p.orientation === filters.orientation);
    }

    // Sort
    switch (filters.sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.price?.A4 || 0) - (b.price?.A4 || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price?.A4 || 0) - (a.price?.A4 || 0));
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "bestseller":
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      case "newest":
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [allProducts, filters]);

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      collection: "all",
      orientation: "all",
      sortBy: "featured",
    });
    setSearchParams({});
  };

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.collection !== "all" ||
    filters.orientation !== "all" ||
    filters.sortBy !== "featured";

  const activeFiltersCount = [
    filters.category !== "all",
    filters.collection !== "all",
    filters.orientation !== "all",
    filters.sortBy !== "featured",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Header */}
      <div className="bg-[#F5F2EB] border-b border-[#EAE5DC] py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Catalogue & Archive" }]} />
          <div className="mt-2 sm:mt-3 flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-4">
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#8C7D70]">
                Curated Print Archive
              </span>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#171717] font-normal mt-0.5 sm:mt-1">
                Explore All Posters
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#7A7167] font-light font-mono">
              Showing {filteredProducts.length} of {allProducts.length} Artworks
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Controls & Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 border border-[#EAE5DC] shadow-xs mb-6 sm:mb-8">
          {/* Search + Mobile Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-[#8C7D70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search titles, anime, cinema, tags..."
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] text-xs py-2.5 pl-9 pr-8 text-[#171717] placeholder-[#A89E92] focus:outline-hidden focus:border-[#171717]"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7D70] hover:text-[#171717]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAF8F5] border border-[#EAE5DC] text-xs uppercase tracking-wider font-medium text-[#171717]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C7D70]" />
              <span>{showMobileFilters ? "Hide Filters" : "Filter & Sort"}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#1C1A17] text-[#FAF8F5] text-[10px] flex items-center justify-center font-mono">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdowns: Desktop always visible, mobile toggleable */}
          <div
            className={`mt-3 pt-3 border-t border-[#F2EDE4] grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 ${
              showMobileFilters ? "grid" : "hidden sm:grid"
            }`}
          >
            {/* Category Filter */}
            <div>
              <label className="sm:hidden text-[10px] uppercase tracking-wider text-[#8C7D70] block mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] text-xs py-2 px-2.5 text-[#171717] focus:outline-hidden focus:border-[#171717] cursor-pointer"
              >
                <option value="all">All Categories ({allProducts.length})</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Orientation Filter */}
            <div>
              <label className="sm:hidden text-[10px] uppercase tracking-wider text-[#8C7D70] block mb-1">
                Orientation
              </label>
              <select
                value={filters.orientation}
                onChange={(e) => setFilters({ ...filters, orientation: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] text-xs py-2 px-2.5 text-[#171717] focus:outline-hidden focus:border-[#171717] cursor-pointer"
              >
                <option value="all">All Orientations</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
                <option value="square">Square</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="sm:hidden text-[10px] uppercase tracking-wider text-[#8C7D70] block mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full bg-[#FAF8F5] border border-[#EAE5DC] text-xs py-2 px-2.5 text-[#171717] focus:outline-hidden focus:border-[#171717] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="bestseller">Sort: Most Loved Bestsellers</option>
                <option value="newest">Sort: Newest Editions</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="name-asc">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-[#F2EDE4] flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[#8C7D70]">Active filters:</span>
                {filters.search && (
                  <span className="bg-[#F2EDE4] px-2 py-0.5 text-[#171717] flex items-center gap-1">
                    &ldquo;{filters.search}&rdquo;
                    <button onClick={() => setFilters({ ...filters, search: "" })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.category !== "all" && (
                  <span className="bg-[#F2EDE4] px-2 py-0.5 text-[#171717] flex items-center gap-1">
                    Category: {categories.find((c) => c.slug === filters.category)?.name}
                    <button onClick={() => setFilters({ ...filters, category: "all" })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.orientation !== "all" && (
                  <span className="bg-[#F2EDE4] px-2 py-0.5 text-[#171717] flex items-center gap-1 capitalize">
                    {filters.orientation}
                    <button onClick={() => setFilters({ ...filters, orientation: "all" })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <button
                onClick={resetFilters}
                className="text-xs uppercase tracking-wider text-[#8C7D70] hover:text-[#171717] underline cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Poster Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((poster) => (
              <PosterCard key={poster.id} poster={poster} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-24 text-center bg-white border border-[#EAE5DC] p-8 max-w-xl mx-auto shadow-xs">
            <SlidersHorizontal className="w-8 h-8 text-[#8C7D70] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#171717] font-normal">
              No matching artworks found
            </h3>
            <p className="text-sm text-[#7A7167] mt-2 font-light leading-relaxed">
              We couldn&apos;t find any poster matching your current search criteria. Try clearing search keywords or selecting another category.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 inline-flex items-center gap-2 bg-[#1C1A17] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-[#332E27] transition-colors cursor-pointer"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
