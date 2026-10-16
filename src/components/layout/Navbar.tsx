import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "../../config/site";
import { Search, Menu, X, MessageCircle, ArrowRight } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";
import { SearchModal } from "../common/SearchModal";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Posters", href: "/posters" },
    { label: "Collections", href: "/#collections" },
    { label: "Categories", href: "/#categories" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/95 backdrop-blur-md shadow-xs border-b border-[#EAE5DC]/80 py-3"
            : "bg-[#FAF8F5] border-b border-[#EAE5DC]/50 py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-[#171717] hover:text-[#8C7D70] transition-colors focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex flex-col items-center lg:items-start group">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-wider text-[#171717] group-hover:text-[#8C7D70] transition-colors">
                {siteConfig.brandName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7D70] -mt-1 font-light">
                Art Prints & Archive
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isAnchor = link.href.startsWith("/#");
                const isActive =
                  link.href === "/"
                    ? location.pathname === "/"
                    : isAnchor
                    ? false
                    : location.pathname.startsWith(link.href);

                if (isAnchor) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => {
                        const id = link.href.replace("/#", "");
                        if (location.pathname !== "/") {
                          window.location.href = `#/${link.href.replace("/#", "")}`;
                        } else {
                          const el = document.getElementById(id);
                          el?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-sm tracking-wide text-[#5C554E] hover:text-[#171717] transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`text-sm tracking-wide transition-colors ${
                      isActive
                        ? "text-[#171717] font-semibold border-b border-[#171717] pb-1"
                        : "text-[#5C554E] hover:text-[#171717]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>


            {/* Actions: Search & WhatsApp Enquire CTA */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#5C554E] hover:text-[#171717] transition-colors focus:outline-hidden"
                aria-label="Search posters"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={buildGeneralEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[#1C1A17] hover:bg-[#332E27] text-[#FAF8F5] px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 border border-transparent shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire on WhatsApp</span>
              </a>

              <a
                href={buildGeneralEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden p-2 text-[#25D366] hover:text-[#1EBE5D] transition-colors"
                aria-label="WhatsApp enquiry"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] shadow-xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EAE5DC]">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <span className="font-serif text-2xl font-normal tracking-wide text-[#171717]">
                    {siteConfig.brandName}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#5C554E] hover:text-[#171717]"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href.startsWith("/#") ? "/" : link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (link.href.startsWith("/#")) {
                        setTimeout(() => {
                          const el = document.getElementById(link.href.replace("/#", ""));
                          el?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }
                    }}
                    className="text-base tracking-wide text-[#2B2724] hover:text-[#8C7D70] py-2 border-b border-[#EAE5DC]/40 flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#8C7D70]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE5DC]">
              <p className="text-xs text-[#8C7D70] mb-3">Questions about sizing or framing?</p>
              <a
                href={buildGeneralEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#1C1A17] text-[#FAF8F5] py-3 text-xs uppercase tracking-widest font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
