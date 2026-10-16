import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";
import { MessageCircle, ArrowUpRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1A17] text-[#FAF8F5] border-t border-[#2E2A25] pt-16 pb-12">
      {/* Brand values / trust pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2E2A25]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-3.5">
            <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#FAF8F5]">300 GSM Archival Paper</h4>
              <p className="text-xs text-[#A89E92] mt-1 leading-relaxed">
                Heavyweight 100% cotton fine-art rag engineered for lifetime lightfastness.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#FAF8F5]">12-Colour Giclée Pigment</h4>
              <p className="text-xs text-[#A89E92] mt-1 leading-relaxed">
                Ultra-high-density micro-piezo inks providing true deep blacks and pure tone.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <Truck className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#FAF8F5]">Shatterproof Packaging</h4>
              <p className="text-xs text-[#A89E92] mt-1 leading-relaxed">
                Reinforced industrial kraft tubes and corner-guarded wooden frames.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <HeartHandshake className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-[#FAF8F5]">Direct WhatsApp Care</h4>
              <p className="text-xs text-[#A89E92] mt-1 leading-relaxed">
                Personalized collector guidance, custom print advice, and order tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand intro */}
          <div className="md:col-span-2 pr-0 md:pr-8">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#FAF8F5]">
                {siteConfig.brandName}
              </span>
            </Link>
            <p className="text-sm text-[#A89E92] mt-3 leading-relaxed max-w-sm">
              We curate museum-quality art prints and wall posters celebrating auteur cinema, anime nostalgia, architecture, motorsport heritage, and peaceful minimalism.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={buildGeneralEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2E2A25] hover:bg-[#3E3831] text-[#FAF8F5] px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors border border-[#423C34]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Explore columns */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89E92]">
              <li>
                <Link to="/posters" className="hover:text-white transition-colors">
                  All Poster Prints
                </Link>
              </li>
              <li>
                <Link to="/category/anime-manga" className="hover:text-white transition-colors">
                  Anime & Manga
                </Link>
              </li>
              <li>
                <Link to="/category/movies-cinema" className="hover:text-white transition-colors">
                  Movies & Cinema
                </Link>
              </li>
              <li>
                <Link to="/category/cars-motorsports" className="hover:text-white transition-colors">
                  Cars & Motorsports
                </Link>
              </li>
              <li>
                <Link to="/category/minimalist-art" className="hover:text-white transition-colors">
                  Minimalist Art
                </Link>
              </li>
              <li>
                <Link to="/category/nature-photography" className="hover:text-white transition-colors">
                  Nature & Scenic
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89E92]">
              <li>
                <Link to="/collection/the-anime-edit" className="hover:text-white transition-colors">
                  The Anime Edit
                </Link>
              </li>
              <li>
                <Link to="/collection/cinema-on-your-walls" className="hover:text-white transition-colors">
                  Cinema on Your Walls
                </Link>
              </li>
              <li>
                <Link to="/collection/the-gaming-collection" className="hover:text-white transition-colors">
                  The Gaming Collection
                </Link>
              </li>
              <li>
                <Link to="/collection/automotive-culture" className="hover:text-white transition-colors">
                  Automotive Culture
                </Link>
              </li>
              <li>
                <Link to="/collection/minimalist-living" className="hover:text-white transition-colors">
                  Minimalist Living
                </Link>
              </li>
              <li>
                <Link to="/collection/the-collectors-wall" className="hover:text-white transition-colors">
                  The Collector&apos;s Wall
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Studio */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Studio & Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A89E92]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Craft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Custom Poster Prints
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Framing & Sizing Guide
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>{siteConfig.contactEmail}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2 text-xs text-[#7D7368]">
                Studio Location:<br />
                {siteConfig.studioLocation}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-[#2E2A25] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D7368] gap-4">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.brandName}. Designed for collectors & thoughtful interiors.
        </p>
        <div className="flex items-center space-x-6">
          <Link to="/about" className="hover:text-[#A89E92] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/about" className="hover:text-[#A89E92] transition-colors">
            Terms of Service
          </Link>
          <a
            href={buildGeneralEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25D366] transition-colors"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </footer>
  );
};
