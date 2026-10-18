import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCatalog } from "../context/CatalogContext";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { PosterCard } from "../components/common/PosterCard";
import { buildPosterEnquiryUrl, SIZE_DIMENSIONS, FRAME_LABELS } from "../utils/whatsapp";
import type { PosterSize, FrameStyle } from "../types";
import {
  MessageCircle,
  Check,
  Copy,
  Shield,
  Layers,
  Truck,
  Maximize2,
  Sparkles,
  Info,
  ChevronDown
} from "lucide-react";

export const PosterDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, getRelatedProducts, settings } = useCatalog();
  const poster = slug ? getProductBySlug(slug) : undefined;

  // Selected Size
  const [selectedSize, setSelectedSize] = useState<PosterSize>(
    poster?.sizes?.[0] || "A3"
  );

  // Selected Frame Option
  const [frameStyle, setFrameStyle] = useState<FrameStyle>("unframed");

  // Selected Mockup View
  const [viewMode, setViewMode] = useState<"poster" | "livingRoom" | "bedroom" | "studio">("poster");

  // Accordion toggle
  const [openAccordion, setOpenAccordion] = useState<string>("specifications");

  // Copied indicator
  const [copied, setCopied] = useState(false);

  // Size guide modal state
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!poster) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#171717]">Poster Not Found</h2>
        <p className="text-sm text-[#8C7D70] mt-2">The requested artwork could not be found.</p>
        <Link
          to="/posters"
          className="mt-6 inline-flex items-center gap-2 bg-[#1C1A17] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-widest"
        >
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const related = getRelatedProducts(poster.slug, poster.categorySlug, 4);

  // Current price
  const currentPrice = poster.price?.[selectedSize];

  // Dynamic image depending on view mode
  const activeImage =
    viewMode === "livingRoom" && poster.mockupImages?.livingRoom
      ? poster.mockupImages.livingRoom
      : viewMode === "bedroom" && poster.mockupImages?.bedroom
      ? poster.mockupImages.bedroom
      : viewMode === "studio" && poster.mockupImages?.studio
      ? poster.mockupImages.studio
      : poster.image;

  // Copy enquiry text to clipboard
  const handleCopyDetails = () => {
    const text = [
      `Poster: ${poster.name}`,
      `Product ID: ${poster.id}`,
      `Category: ${poster.category}`,
      `Selected Size: ${selectedSize} (${SIZE_DIMENSIONS[selectedSize]})`,
      `Frame Preference: ${FRAME_LABELS[frameStyle]}`,
      `Price: ${currentPrice ? `${settings.currencySymbol}${currentPrice}` : "On Request"}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const enquiryUrl = buildPosterEnquiryUrl(poster, selectedSize, frameStyle, settings);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#EAE5DC] bg-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Posters", href: "/posters" },
              { label: poster.category, href: `/category/${poster.categorySlug}` },
              { label: poster.name },
            ]}
          />
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Large Artwork Visualizer & Mockup Switcher */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Main Visual Display */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#F2EDE4] border border-[#EAE5DC] p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-gallery">
              
              {/* Frame Wrapper Simulation */}
              <div
                className={`relative w-full h-full transition-all duration-300 overflow-hidden shadow-poster ${
                  frameStyle === "black-wood"
                    ? "p-3 sm:p-5 bg-[#171717] border-4 border-[#222222]"
                    : frameStyle === "natural-oak"
                    ? "p-3 sm:p-5 bg-[#C9B18F] border-4 border-[#B09774]"
                    : frameStyle === "white-gallery"
                    ? "p-3 sm:p-5 bg-white border-4 border-[#EAE5DC]"
                    : ""
                }`}
              >
                {/* White border passepartout / matting if framed */}
                <div
                  className={`w-full h-full overflow-hidden ${
                    frameStyle !== "unframed" ? "p-3 sm:p-4 bg-[#FAF8F5] shadow-inner" : ""
                  }`}
                >
                  <img
                    src={activeImage}
                    alt={`${poster.name} - ${viewMode}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-1.5 z-10 pointer-events-none">
                {poster.isBestseller && (
                  <span className="bg-[#1C1A17] text-[#FAF8F5] text-[10px] uppercase tracking-widest px-2.5 py-1 font-medium shadow-xs">
                    Collector Bestseller
                  </span>
                )}
                {poster.isNew && (
                  <span className="bg-[#C5A880] text-[#1C1A17] text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold shadow-xs">
                    New Release
                  </span>
                )}
              </div>
            </div>

            {/* Room Mockup View Switcher */}
            <div className="bg-white border border-[#EAE5DC] p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-[#8C7D70] font-medium flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Perspective:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode("poster")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    viewMode === "poster"
                      ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                      : "bg-[#FAF8F5] text-[#5C554E] hover:text-[#171717]"
                  }`}
                >
                  Artwork Isolated
                </button>
                <button
                  onClick={() => setViewMode("livingRoom")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    viewMode === "livingRoom"
                      ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                      : "bg-[#FAF8F5] text-[#5C554E] hover:text-[#171717]"
                  }`}
                >
                  Living Room
                </button>
                <button
                  onClick={() => setViewMode("bedroom")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    viewMode === "bedroom"
                      ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                      : "bg-[#FAF8F5] text-[#5C554E] hover:text-[#171717]"
                  }`}
                >
                  Bedroom
                </button>
                <button
                  onClick={() => setViewMode("studio")}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    viewMode === "studio"
                      ? "bg-[#1C1A17] text-[#FAF8F5] font-medium"
                      : "bg-[#FAF8F5] text-[#5C554E] hover:text-[#171717]"
                  }`}
                >
                  Studio Desk
                </button>
              </div>
            </div>

            {/* Frame Finish Selector */}
            <div className="bg-white border border-[#EAE5DC] p-4">
              <span className="block text-xs uppercase tracking-widest text-[#8C7D70] font-medium mb-3">
                Preview Framing Finish:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "unframed", label: "Unframed Print" },
                  { id: "black-wood", label: "Black Solid Wood" },
                  { id: "natural-oak", label: "Natural Oak" },
                  { id: "white-gallery", label: "White Gallery" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFrameStyle(f.id as FrameStyle)}
                    className={`py-2 px-3 text-xs text-center border transition-all cursor-pointer ${
                      frameStyle === f.id
                        ? "border-[#171717] bg-[#1C1A17] text-[#FAF8F5] font-medium"
                        : "border-[#EAE5DC] bg-[#FAF8F5] text-[#5C554E] hover:border-[#8C7D70]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Poster Details, Sizing, Price & WhatsApp Enquire */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            
            {/* Category & Collection Tags */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C7D70]">
              <Link
                to={`/category/${poster.categorySlug}`}
                className="hover:text-[#171717] underline underline-offset-2"
              >
                {poster.category}
              </Link>
              <span>·</span>
              <Link
                to={`/collection/${poster.collectionSlug}`}
                className="hover:text-[#171717] underline underline-offset-2"
              >
                {poster.collection}
              </Link>
            </div>

            {/* Poster Name */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#171717] font-normal mt-2 leading-tight">
              {poster.name}
            </h1>

            {/* Product ID & Orientation */}
            <div className="mt-2 flex items-center gap-3 text-xs font-mono text-[#8C7D70]">
              <span>ID: {poster.id}</span>
              <span>·</span>
              <span className="capitalize">{poster.orientation} Format</span>
            </div>

            {/* Tagline */}
            {poster.tagline && (
              <p className="mt-3 text-sm italic font-light text-[#786C5E] border-l-2 border-[#C5A880] pl-3">
                &ldquo;{poster.tagline}&rdquo;
              </p>
            )}

            {/* Pricing Section */}
            <div className="mt-6 py-4 border-y border-[#EAE5DC] flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C7D70] block">
                  Art Print Price
                </span>
                {poster.discount?.enabled && poster.discount.salePrice !== undefined && currentPrice && poster.discount.salePrice < currentPrice ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-serif text-3xl text-[#C44536] font-normal">
                      {settings.currencySymbol}{poster.discount.salePrice.toLocaleString()}
                    </span>
                    <span className="line-through text-sm text-[#8C7D70]">
                      {settings.currencySymbol}{currentPrice.toLocaleString()}
                    </span>
                    <span className="bg-[#C44536]/10 text-[#C44536] text-[11px] font-semibold px-2 py-0.5 rounded-xs">
                      {poster.discount.type === 'percentage' ? `${poster.discount.value}% OFF` : `Save ${settings.currencySymbol}${poster.discount.value}`}
                    </span>
                  </div>
                ) : (
                  <span className="font-serif text-3xl text-[#171717] font-normal">
                    {currentPrice ? `${settings.currencySymbol}${currentPrice.toLocaleString()}` : "Price on Request"}
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#25D366] font-medium bg-[#E8F8EE] px-2 py-0.5 border border-[#BCE8CA] inline-block">
                  Available in Stock
                </span>
                <span className="block text-[11px] text-[#8C7D70] mt-0.5">
                  Free shipping across India
                </span>
              </div>
            </div>


            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-[#171717] font-medium">
                  Select Print Size:
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#8C7D70] hover:text-[#171717] underline flex items-center gap-1 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Size Dimensions Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {poster.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const price = poster.price?.[size];
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#171717] bg-white ring-1 ring-[#171717] shadow-xs"
                          : "border-[#EAE5DC] bg-[#FAF8F5] hover:border-[#8C7D70]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-base font-medium text-[#171717]">
                          {size}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#171717]" />}
                      </div>
                      <span className="block text-[11px] text-[#7A7167] mt-0.5">
                        {SIZE_DIMENSIONS[size]}
                      </span>
                      {price && (
                        <span className="block text-xs font-semibold text-[#171717] mt-1.5">
                          {settings.currencySymbol}{price.toLocaleString()}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp Enquiry Primary CTA */}
            <div className="mt-8 space-y-3">
              <a
                href={enquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 px-6 text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-white text-transparent" />
                <span>Enquire on WhatsApp</span>
              </a>

              {/* Copy Details Secondary Helper */}
              <button
                onClick={handleCopyDetails}
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#EAE5DC] hover:border-[#171717] text-[#171717] py-3 px-4 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span>Enquiry Details Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C7D70]" />
                    <span>Copy Poster & Size Details</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#8C7D70] font-light">
                Opens directly in WhatsApp with prefilled poster name, chosen size, and framing preferences.
              </p>
            </div>

            {/* Description Paragraph */}
            <div className="mt-8 pt-6 border-t border-[#EAE5DC]">
              <h3 className="text-xs uppercase tracking-widest text-[#8C7D70] font-medium mb-2">
                Artwork Overview
              </h3>
              <p className="text-sm text-[#5C554E] leading-relaxed font-light">
                {poster.description}
              </p>
              {poster.artistNote && (
                <p className="text-xs text-[#8C7D70] italic mt-3 bg-[#F2EDE4]/60 p-3 border-l border-[#C5A880]">
                  <strong>Curator&apos;s Note:</strong> {poster.artistNote}
                </p>
              )}
            </div>

            {/* Specifications Accordion */}
            <div className="mt-8 border-t border-[#EAE5DC] divide-y divide-[#EAE5DC]">
              {/* Paper & Inks */}
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === "specifications" ? "" : "specifications")
                  }
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#171717]"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C5A880]" />
                    <span>Paper & Printing Standards</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === "specifications" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "specifications" && (
                  <div className="pb-4 text-xs text-[#7A7167] space-y-1.5 leading-relaxed">
                    <p>• <strong>Substrate:</strong> 300 GSM 100% natural cotton rag, acid-free.</p>
                    <p>• <strong>Printing:</strong> 12-colour UltraChrome pigment giclée technology.</p>
                    <p>• <strong>Finish:</strong> Anti-reflective museum-matte texture with deep carbon black density.</p>
                    <p>• <strong>Lifespan:</strong> Rated for 80+ years resistance against fading in indoor conditions.</p>
                  </div>
                )}
              </div>

              {/* Framing Quality */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "framing" ? "" : "framing")}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#171717]"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#C5A880]" />
                    <span>Handmade Framing Options</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === "framing" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "framing" && (
                  <div className="pb-4 text-xs text-[#7A7167] space-y-1.5 leading-relaxed">
                    <p>• <strong>Materials:</strong> Solid plantation-grown hardwood (Black, Oak, or White).</p>
                    <p>• <strong>Glazing:</strong> Shatterproof 2mm optical acrylic with 90% UV filtering.</p>
                    <p>• <strong>Mounting:</strong> Acid-free 4-ply archival museum-board passepartout.</p>
                    <p>• <strong>Ready to Hang:</strong> Pre-installed German hanging hardware & level bumpers.</p>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div>
                <button
                  onClick={() => setOpenAccordion(openAccordion === "shipping" ? "" : "shipping")}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-wider font-medium text-[#171717]"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    <span>Packaging & Transit Guarantee</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === "shipping" && (
                  <div className="pb-4 text-xs text-[#7A7167] space-y-1.5 leading-relaxed">
                    <p>• <strong>Unframed Prints:</strong> Rolled in glassine paper & heavy-duty 3-ply kraft cylinders.</p>
                    <p>• <strong>Framed Works:</strong> Triple bubble-cushioning with reinforced wooden edge protectors.</p>
                    <p>• <strong>Damage Guarantee:</strong> Instant free replacement if transit damages occur.</p>
                    <p>• <strong>Timelines:</strong> Dispatch within 24-48 hours. Express delivery available.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* RELATED POSTERS SECTION */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#EAE5DC]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70]">
                  Complementary Works
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal mt-1">
                  You May Also Admire
                </h2>
              </div>
              <Link
                to={`/category/${poster.categorySlug}`}
                className="text-xs uppercase tracking-wider text-[#171717] hover:underline"
              >
                More in {poster.category}
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item) => (
                <PosterCard key={item.id} poster={item} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="relative bg-[#FAF8F5] max-w-lg w-full p-6 sm:p-8 border border-[#EAE5DC] shadow-2xl z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DC]">
              <h3 className="font-serif text-2xl text-[#171717]">Print Dimensions Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-[#8C7D70] hover:text-[#171717]"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-3 bg-white border border-[#EAE5DC]">
                <div className="flex justify-between font-serif text-lg text-[#171717]">
                  <span>A4 Format</span>
                  <span className="font-sans text-xs text-[#8C7D70] mt-1">Desk & Shelf Art</span>
                </div>
                <p className="text-xs text-[#7A7167] mt-1 font-mono">
                  8.3 × 11.7 inches · 21.0 × 29.7 cm
                </p>
                <p className="text-[11px] text-[#8C7D70] mt-1">
                  Ideal for study desks, bedside tables, or compact gallery wall clusters.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#EAE5DC]">
                <div className="flex justify-between font-serif text-lg text-[#171717]">
                  <span>A3 Format</span>
                  <span className="font-sans text-xs text-[#C5A880] font-medium mt-1">Most Popular</span>
                </div>
                <p className="text-xs text-[#7A7167] mt-1 font-mono">
                  11.7 × 16.5 inches · 29.7 × 42.0 cm
                </p>
                <p className="text-[11px] text-[#8C7D70] mt-1">
                  The classic standard. Outstanding above computer monitors, credenzas, and bedrooms.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#EAE5DC]">
                <div className="flex justify-between font-serif text-lg text-[#171717]">
                  <span>A2 Format</span>
                  <span className="font-sans text-xs text-[#8C7D70] mt-1">Statement Wall Art</span>
                </div>
                <p className="text-xs text-[#7A7167] mt-1 font-mono">
                  16.5 × 23.4 inches · 42.0 × 59.4 cm
                </p>
                <p className="text-[11px] text-[#8C7D70] mt-1">
                  Commanding presence. Perfect as the centerpiece of living rooms and office walls.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#EAE5DC]">
                <div className="flex justify-between font-serif text-lg text-[#171717]">
                  <span>A1 Format</span>
                  <span className="font-sans text-xs text-[#8C7D70] mt-1">Exhibition Scale</span>
                </div>
                <p className="text-xs text-[#7A7167] mt-1 font-mono">
                  23.4 × 33.1 inches · 59.4 × 84.1 cm
                </p>
                <p className="text-[11px] text-[#8C7D70] mt-1">
                  Monumental museum format. Designed for large sofas, hallway vistas, and double-height walls.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#EAE5DC] text-center">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="bg-[#1C1A17] text-[#FAF8F5] px-6 py-2.5 text-xs uppercase tracking-widest font-medium"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#EAE5DC] px-4 py-2.5 z-30 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[10px] text-[#8C7D70] uppercase tracking-wider block font-medium truncate">
            {selectedSize} · {frameStyle === 'unframed' ? 'Print' : 'Framed'}
          </span>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {poster.discount?.enabled && poster.discount.salePrice !== undefined && currentPrice && poster.discount.salePrice < currentPrice ? (
              <>
                <span className="text-base font-bold text-[#C44536]">
                  {settings.currencySymbol}{poster.discount.salePrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#8C7D70] line-through">
                  {settings.currencySymbol}{currentPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-[#171717]">
                {currentPrice ? `${settings.currencySymbol}${currentPrice.toLocaleString()}` : "Price on Request"}
              </span>
            )}
          </div>
        </div>

        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 max-w-[200px] flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 px-3 rounded-xs text-xs uppercase tracking-wider font-bold shadow-xs transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white text-transparent shrink-0" />
          <span>Enquire Now</span>
        </a>
      </div>
    </div>
  );
};
