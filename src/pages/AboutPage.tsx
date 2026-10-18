import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { useCatalog } from "../context/CatalogContext";
import { Sparkles, Layers, ShieldCheck, HeartHandshake, MessageCircle, ArrowRight } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../utils/whatsapp";

export const AboutPage: React.FC = () => {
  const { settings } = useCatalog();
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Editorial Header */}
      <div className="bg-[#F5F2EB] border-b border-[#EAE5DC] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Breadcrumbs items={[{ label: "About Our Studio" }]} />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium block mt-4">
            The Atelier Story
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171717] font-normal mt-2 leading-tight">
            Art Built for Longevity & Thoughtful Spaces
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#5C554E] font-light leading-relaxed max-w-2xl mx-auto">
            We started {settings.brandName} with a singular belief: the posters on your wall should possess the same paper weight, tonal richness, and craftsmanship as pieces hanging in modern art galleries.
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="prose prose-stone max-w-none space-y-12 text-[#2B2724]">
          
          {/* Section 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
                Beyond Disposable Prints
              </h2>
              <p className="text-sm text-[#5C554E] mt-3 leading-relaxed font-light">
                For decades, popular posters were mass-manufactured on thin, glossy commercial paper that wrinkled in humidity, cast distracting glares, and faded after a season of sunlight.
              </p>
              <p className="text-sm text-[#5C554E] mt-3 leading-relaxed font-light">
                We rebelled against that temporary culture. Every single print in our archive is outputted individually using 12-colour Japanese pigment giclée technology on archival 300 GSM cotton rag. The surface is velvety, matte, and reflection-free from any viewing angle.
              </p>
            </div>
            <div className="md:col-span-5 aspect-[4/5] bg-[#EAE5DC] border border-[#D9D2C9] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80"
                alt="Studio printing archive"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Standards Grid */}
          <div className="pt-12 border-t border-[#EAE5DC]">
            <h2 className="font-serif text-3xl text-[#171717] text-center mb-10">
              Our 4 Pillars of Craft
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 border border-[#EAE5DC]">
                <Layers className="w-6 h-6 text-[#C5A880] mb-3" />
                <h3 className="font-serif text-lg font-medium text-[#171717]">
                  300 GSM Archival Cotton Paper
                </h3>
                <p className="text-xs text-[#7A7167] mt-2 leading-relaxed">
                  Naturally acid-free, buffered with calcium carbonate to prevent yellowing or deterioration across generations.
                </p>
              </div>

              <div className="bg-white p-6 border border-[#EAE5DC]">
                <Sparkles className="w-6 h-6 text-[#C5A880] mb-3" />
                <h3 className="font-serif text-lg font-medium text-[#171717]">
                  12-Colour Pigment Giclée
                </h3>
                <p className="text-xs text-[#7A7167] mt-2 leading-relaxed">
                  Micro-piezo ink nozzles deliver microscopic pigment drops creating velvety transitions, true carbon blacks, and museum-grade tonal depth.
                </p>
              </div>

              <div className="bg-white p-6 border border-[#EAE5DC]">
                <ShieldCheck className="w-6 h-6 text-[#C5A880] mb-3" />
                <h3 className="font-serif text-lg font-medium text-[#171717]">
                  Solid Plantation Hardwood
                </h3>
                <p className="text-xs text-[#7A7167] mt-2 leading-relaxed">
                  Sustainably harvested natural timber frames paired with crystal-clear 90% UV-shielding shatterproof acrylic glazing.
                </p>
              </div>

              <div className="bg-white p-6 border border-[#EAE5DC]">
                <HeartHandshake className="w-6 h-6 text-[#C5A880] mb-3" />
                <h3 className="font-serif text-lg font-medium text-[#171717]">
                  Human Curator Consultations
                </h3>
                <p className="text-xs text-[#7A7167] mt-2 leading-relaxed">
                  No automated bots. Direct conversations via WhatsApp to help you choose the ideal dimensions, framing, and layout for your room.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-[#1C1A17] text-[#FAF8F5] p-8 sm:p-12 text-center mt-16 border border-[#2E2A25]">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal">
              Have a Wall in Need of Inspiration?
            </h3>
            <p className="text-sm text-[#A89E92] mt-3 max-w-lg mx-auto font-light leading-relaxed">
              Message our studio curator directly on WhatsApp for personalized size recommendations or custom framing consultations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={buildGeneralEnquiryUrl("Hi! I would like to consult with your curator on poster selection for my room.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Curator on WhatsApp</span>
              </a>

              <Link
                to="/posters"
                className="inline-flex items-center gap-2 border border-[#EAE5DC] text-[#FAF8F5] hover:bg-white/10 px-6 py-3.5 text-xs uppercase tracking-widest transition-colors"
              >
                <span>Browse Poster Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
