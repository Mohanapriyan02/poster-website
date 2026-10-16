import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Tag } from "lucide-react";
import { getAllProducts, getCategories } from "../../data/catalog";
import type { PosterProduct, Category } from "../../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PosterProduct[]>([]);
  const navigate = useNavigate();
  const categories = getCategories();

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.toLowerCase().trim();
      const all = getAllProducts();
      const matched = all.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
      setResults(matched.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSelectPoster = (slug: string) => {
    onClose();
    navigate(`/poster/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    onClose();
    navigate(`/category/${slug}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/posters?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] shadow-2xl border border-[#EAE5DC] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EAE5DC] bg-white">
          <Search className="w-5 h-5 text-[#8C7D70] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleViewAll();
              }
            }}
            placeholder="Search by poster title, movie, anime, artist, or aesthetic..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#171717] placeholder-[#A89E92] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#8C7D70] hover:text-[#171717] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-[#8C7D70] hover:text-[#171717] px-2 py-1 border border-[#EAE5DC]"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
          {query.trim().length > 1 ? (
            results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8C7D70]">
                  <span>Matching Artworks ({results.length})</span>
                  <button
                    onClick={handleViewAll}
                    className="text-[#171717] font-medium hover:underline flex items-center gap-1"
                  >
                    <span>View all matching posters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.map((poster) => (
                    <div
                      key={poster.id}
                      onClick={() => handleSelectPoster(poster.slug)}
                      className="flex items-center gap-3 p-2 bg-white border border-[#EAE5DC] hover:border-[#C5A880] cursor-pointer transition-colors group"
                    >
                      <img
                        src={poster.image}
                        alt={poster.name}
                        className="w-14 h-18 object-cover shrink-0 bg-[#F2EDE4]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#8C7D70]">
                          {poster.category}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-[#171717] group-hover:text-[#8C7D70] truncate">
                          {poster.name}
                        </h4>
                        <p className="text-xs text-[#7A7167]">
                          {poster.sizes.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-[#5C554E]">No posters found matching &ldquo;{query}&rdquo;.</p>
                <p className="text-xs text-[#8C7D70] mt-1">
                  Try searching for keywords like &ldquo;Anime&rdquo;, &ldquo;Cinema&rdquo;, &ldquo;Motorsport&rdquo;, or &ldquo;Minimalist&rdquo;.
                </p>
              </div>
            )
          ) : (
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8C7D70] mb-3 font-semibold">
                Browse Popular Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className="px-3 py-1.5 bg-white border border-[#EAE5DC] hover:border-[#171717] text-xs text-[#2B2724] transition-colors"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-[#EAE5DC]">
                <p className="text-xs uppercase tracking-widest text-[#8C7D70] mb-3 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Trending Tags</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Cyberpunk", "Vintage F1", "Interstellar", "Bauhaus", "Ghibli", "Dolomites", "Terracotta"].map(
                    (tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="text-xs text-[#5C554E] hover:text-[#171717] bg-[#F2EDE4]/60 px-2.5 py-1 rounded-xs"
                      >
                        #{tag}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
