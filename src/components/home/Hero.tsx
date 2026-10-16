import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";

export const Hero: React.FC = () => {
  const scrollToCollection = () => {
    const el = document.getElementById("curated-collection");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-16 sm:pb-24 border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center pr-0 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2EDE4] border border-[#E2D8CC] text-[#8C7D70] text-xs uppercase tracking-widest font-medium w-fit mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Artisan Wall Poster Showcase</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171717] font-normal leading-[1.12] tracking-tight">
              Make Your Walls <br />
              <span className="italic font-normal font-serif text-[#786C5E]">
                Feel Like You.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#5C554E] leading-relaxed max-w-xl font-light">
              Discover curated art prints and posters that bring your favourite worlds, cinematic moments, and thoughtful moods into your everyday sanctuary. Hand-printed on museum-grade cotton archival paper.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={scrollToCollection}
                className="inline-flex items-center justify-center gap-2.5 bg-[#1C1A17] hover:bg-[#332E27] text-[#FAF8F5] px-7 py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Explore the Collection</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/posters?filter=bestseller"
                className="inline-flex items-center justify-center gap-2 border border-[#C5A880] hover:bg-[#F2EDE4] text-[#171717] px-6 py-3.5 text-xs uppercase tracking-widest font-medium transition-all duration-200"
              >
                <span>Discover Best Sellers</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C7D70]" />
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="mt-12 pt-8 border-t border-[#EAE5DC] grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="block font-serif text-2xl font-normal text-[#171717]">300 GSM</span>
                <span className="text-[11px] uppercase tracking-wider text-[#8C7D70]">Museum Cotton</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-normal text-[#171717]">100% Pigment</span>
                <span className="text-[11px] uppercase tracking-wider text-[#8C7D70]">12-Color Giclée</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-normal text-[#171717]">WhatsApp</span>
                <span className="text-[11px] uppercase tracking-wider text-[#8C7D70]">Direct Enquiries</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase (Realistic Interior Wall Mockup) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Primary Interior Mockup Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EFE9DF] shadow-gallery border border-[#EAE5DC]/80">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern minimalist living room wall featuring framed art prints"
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating Artwork Card in bottom corner */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 border border-[#EAE5DC] shadow-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#8C7D70]">
                    <span>Featured Composition</span>
                    <span className="text-[#C5A880] font-semibold">In Focus</span>
                  </div>
                  <h3 className="font-serif text-base font-normal text-[#171717] mt-1">
                    Neo Tokyo: Cyberpunk Horizon
                  </h3>
                  <p className="text-[11px] text-[#7A7167] mt-0.5">
                    Available in A4, A3, A2 & A1 with archival natural wood framing.
                  </p>
                  <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#F2EDE4]">
                    <span className="text-xs font-medium text-[#171717]">From ₹499</span>
                    <Link
                      to="/poster/neo-tokyo-cyberpunk-horizon"
                      className="text-xs text-[#8C7D70] hover:text-[#171717] font-medium underline underline-offset-2 flex items-center gap-1"
                    >
                      <span>View Print</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Offset Accent Mini-Frame (Asymmetrical styling) */}
              <div className="hidden sm:block absolute -top-6 -right-6 w-36 aspect-[3/4] bg-white p-2 shadow-2xl border border-[#EAE5DC] rotate-2 pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80"
                  alt="Bauhaus minimal preview"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
