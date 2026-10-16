import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PosterProduct } from "../../types";
import { siteConfig } from "../../config/site";
import { MessageCircle, Eye, ArrowUpRight } from "lucide-react";
import { buildPosterEnquiryUrl } from "../../utils/whatsapp";

interface PosterCardProps {
  poster: PosterProduct;
  priority?: boolean;
}

export const PosterCard: React.FC<PosterCardProps> = ({ poster, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Compute starting price
  const startingPrice = poster.price?.A4 || poster.price?.A3;

  return (
    <div
      className="group flex flex-col bg-white border border-[#EAE5DC] transition-all duration-300 hover:border-[#D1C7BA] hover:shadow-poster-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Artwork Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EDE4] p-3 sm:p-4 flex items-center justify-center">
        {/* Poster Paper Shadow Effect */}
        <div className="relative w-full h-full shadow-poster overflow-hidden bg-white">
          <img
            src={isHovered && poster.secondaryImage ? poster.secondaryImage : poster.image}
            alt={poster.name}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
          />

          {/* Subtle vignette/sheen */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
        </div>

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {poster.isBestseller && (
            <span className="bg-[#1C1A17] text-[#FAF8F5] text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium shadow-xs">
              Bestseller
            </span>
          )}
          {poster.isNew && (
            <span className="bg-[#C5A880] text-[#1C1A17] text-[10px] uppercase tracking-widest px-2 py-0.5 font-semibold shadow-xs">
              New Art
            </span>
          )}
        </div>

        {/* Quick action overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-20">
          <Link
            to={`/poster/${poster.slug}`}
            className="flex-1 bg-[#1C1A17]/95 hover:bg-[#1C1A17] text-[#FAF8F5] py-2.5 text-xs uppercase tracking-wider font-medium text-center flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Print</span>
          </Link>

          <a
            href={buildPosterEnquiryUrl(poster, poster.sizes[0])}
            target="_blank"
            rel="noopener noreferrer"
            title="Enquire on WhatsApp"
            className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-2.5 transition-colors flex items-center justify-center shrink-0 shadow-xs"
            aria-label={`Enquire about ${poster.name} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Information Area */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white border-t border-[#EAE5DC]/60">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#8C7D70] uppercase tracking-wider mb-1">
            <span>{poster.category}</span>
            <span className="capitalize">{poster.orientation}</span>
          </div>

          <Link to={`/poster/${poster.slug}`} className="block group/title">
            <h3 className="font-serif text-lg font-normal text-[#171717] group-hover/title:text-[#8C7D70] transition-colors line-clamp-1">
              {poster.name}
            </h3>
          </Link>

          {poster.tagline && (
            <p className="text-xs text-[#7A7167] mt-1 line-clamp-1 italic font-light">
              &ldquo;{poster.tagline}&rdquo;
            </p>
          )}
        </div>

        {/* Footer info: Sizes and Pricing */}
        <div className="mt-4 pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[11px] text-[#8C7D70]">
            {poster.sizes.slice(0, 3).join(" · ")}
            {poster.sizes.length > 3 && " +"}
          </div>

          <div className="font-medium text-[#171717]">
            {startingPrice ? (
              <span>From {siteConfig.currencySymbol}{startingPrice.toLocaleString()}</span>
            ) : (
              <span className="text-[#8C7D70] text-[11px]">Enquire for price</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
