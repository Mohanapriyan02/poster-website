import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { PosterCard } from "../components/common/PosterCard";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { collections: otherCollections, getProductsByCollection } = useCatalog();
  const collection = slug ? otherCollections.find(c => c.slug.toLowerCase() === slug.toLowerCase()) : undefined;
  const posters = slug ? getProductsByCollection(slug) : [];

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#171717]">Collection Not Found</h2>
        <p className="text-sm text-[#8C7D70] mt-2">The requested collection could not be located.</p>
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
      {/* Large Thematic Banner */}
      <div className="relative bg-[#1C1A17] text-[#FAF8F5] overflow-hidden py-16 sm:py-24 border-b border-[#2E2A25]">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17] via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Explore Posters", href: "/posters" },
              { label: collection.name },
            ]}
          />
          <div className="mt-6 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-mono">
              Thematic Edit · {posters.length} Curated Prints
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mt-2">
              {collection.name}
            </h1>
            <p className="text-base sm:text-lg text-[#EAE5DC] mt-4 font-light italic">
              &ldquo;{collection.tagline}&rdquo;
            </p>
            <p className="text-sm text-[#BDB5A9] mt-3 leading-relaxed font-light">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EAE5DC]">
          <span className="text-xs uppercase tracking-widest text-[#8C7D70]">
            The {collection.name} Gallery
          </span>
          <Link
            to="/posters"
            className="text-xs uppercase tracking-wider text-[#171717] hover:text-[#8C7D70] flex items-center gap-1 font-medium"
          >
            <span>All Catalogues</span>
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
            <p className="text-sm text-[#7A7167]">No posters currently assigned to this collection.</p>
          </div>
        )}

        {/* Other Collections */}
        <div className="mt-20 pt-12 border-t border-[#EAE5DC]">
          <h3 className="font-serif text-2xl text-[#171717] mb-6">Explore Other Edits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherCollections
              .filter((c) => c.slug !== collection.slug)
              .slice(0, 3)
              .map((c) => (
                <Link
                  key={c.id}
                  to={`/collection/${c.slug}`}
                  className="group relative aspect-[16/10] overflow-hidden bg-[#24211D] border border-[#EAE5DC] p-5 text-white flex flex-col justify-end"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                  />
                  <div className="relative z-10">
                    <h4 className="font-serif text-xl font-normal">{c.name}</h4>
                    <p className="text-xs text-[#FAF8F5]/80 line-clamp-1 mt-1 font-light">
                      {c.tagline}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
