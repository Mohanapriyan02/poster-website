import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";
import { ArrowRight, Feather, ShieldCheck, Layers } from "lucide-react";

export const BrandStory: React.FC = () => {
  return (
    <section className="py-24 bg-[#F5F2EB] border-b border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Showcase (Craftsmanship & Paper Detail) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-white p-3 sm:p-4 border border-[#EAE5DC] shadow-gallery">
              <img
                src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=85"
                alt="Artisan inspecting print detail under studio light"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-5 hidden sm:block bg-[#1C1A17] text-[#FAF8F5] p-5 max-w-[220px] shadow-xl border border-[#2E2A25]">
                <p className="font-serif text-lg font-normal leading-snug">
                  &ldquo;A wall without art is simply a partition.&rdquo;
                </p>
                <span className="block text-[10px] uppercase tracking-widest text-[#C5A880] mt-2 font-mono">
                  — Atelier Studio Note
                </span>
              </div>
            </div>
          </div>

          {/* Text Editorial */}
          <div className="lg:col-span-7 lg:pl-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171717] font-normal mt-3 leading-tight">
              Great art changes the feeling of a space.
            </h2>
            <p className="mt-6 text-base text-[#5C554E] leading-relaxed font-light">
              We bring together posters inspired by cinema, creativity, culture, and the things you love. Instead of mass-produced glossy posters that curl and fade, our works are crafted like exhibition lithographs on heavy 300 GSM natural cotton paper.
            </p>
            <p className="mt-4 text-sm text-[#7A7167] leading-relaxed font-light">
              Every detail—from the choice of non-glare mineral matte finishes to sustainable solid wood framing—is designed so your art looks timeless in your home for decades to come.
            </p>

            {/* Core Values Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#EAE5DC]">
              <div>
                <Feather className="w-5 h-5 text-[#C5A880] mb-2" />
                <h4 className="text-sm font-medium text-[#171717]">Archival Paper</h4>
                <p className="text-xs text-[#7A7167] mt-1 leading-normal">
                  Acid-free 100% cotton rag that will not yellow over time.
                </p>
              </div>

              <div>
                <Layers className="w-5 h-5 text-[#C5A880] mb-2" />
                <h4 className="text-sm font-medium text-[#171717]">Giclée Standards</h4>
                <p className="text-xs text-[#7A7167] mt-1 leading-normal">
                  12-colour micro-piezo pigment inks with velvety tonal depth.
                </p>
              </div>

              <div>
                <ShieldCheck className="w-5 h-5 text-[#C5A880] mb-2" />
                <h4 className="text-sm font-medium text-[#171717]">Made to Last</h4>
                <p className="text-xs text-[#7A7167] mt-1 leading-normal">
                  Museum-standard mounting with anti-shatter acrylic framing.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#1C1A17] hover:bg-[#332E27] text-[#FAF8F5] px-6 py-3.5 text-xs uppercase tracking-widest font-medium transition-colors"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
