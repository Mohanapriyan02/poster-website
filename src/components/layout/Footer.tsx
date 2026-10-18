import React from "react";
import { Link } from "react-router-dom";
import { useCatalog } from "../../context/CatalogContext";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";

export const Footer: React.FC = () => {
  const { settings } = useCatalog();

  return (
    <footer className="bg-[#1C1A17] text-[#FAF8F5] border-t border-[#2E2A25] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-12 border-b border-[#2E2A25]">
          {/* Brand & WhatsApp */}
          <div className="max-w-md">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#FAF8F5]">
                {settings.brandName}
              </span>
            </Link>
            <p className="text-sm text-[#A89E92] mt-3 leading-relaxed">
              We curate museum-quality art prints and wall posters celebrating auteur cinema, anime nostalgia, architecture, motorsport heritage, and peaceful minimalism.
            </p>
            <div className="mt-6">
              <a
                href={buildGeneralEnquiryUrl(undefined, settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2E2A25] hover:bg-[#3E3831] text-[#FAF8F5] px-4 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors border border-[#423C34]"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Studio & Contact Section */}
          <div className="md:min-w-[260px]">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold mb-4">
              Studio &amp; Contact
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
                  Framing &amp; Sizing Guide
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>{settings.contactEmail}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li className="pt-2 text-xs text-[#7D7368]">
                Studio Location:<br />
                {settings.studioLocation}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D7368] gap-4">
          <p>
            &copy; {new Date().getFullYear()} {settings.brandName}. Designed for collectors &amp; thoughtful interiors.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-[#A89E92] transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-[#A89E92] transition-colors">
              Contact
            </Link>
            <a
              href={buildGeneralEnquiryUrl(undefined, settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
