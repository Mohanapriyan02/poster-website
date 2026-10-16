import React, { useState } from "react";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { siteConfig } from "../config/site";
import { buildGeneralEnquiryUrl, buildCustomPrintEnquiryUrl } from "../utils/whatsapp";
import { MessageCircle, Mail, MapPin, Clock, HelpCircle, Send } from "lucide-react";

export const ContactPage: React.FC = () => {
  const [customName, setCustomName] = useState("");
  const [customArt, setCustomArt] = useState("");
  const [customSize, setCustomSize] = useState("A3 (11.7 × 16.5 in)");
  const [customNotes, setCustomNotes] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = buildCustomPrintEnquiryUrl({
      name: customName,
      artType: customArt || "Custom Wall Poster Request",
      size: customSize,
      notes: customNotes,
    });
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Top Header */}
      <div className="bg-[#F5F2EB] border-b border-[#EAE5DC] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Contact & Enquiries" }]} />
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7D70] font-medium block mt-3">
            Concierge & Studio Care
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#171717] font-normal mt-1">
            Get in Touch
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5C554E] font-light max-w-xl">
            Whether you have questions about a specific poster, want custom print sizing, or need framing recommendations, we are ready to assist.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct WhatsApp & Studio Info */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Primary WhatsApp Card */}
            <div className="bg-[#1C1A17] text-[#FAF8F5] p-8 border border-[#2E2A25] shadow-md">
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-mono">
                Fastest Response
              </span>
              <h3 className="font-serif text-2xl text-[#FAF8F5] font-normal mt-2">
                WhatsApp Studio Concierge
              </h3>
              <p className="text-xs text-[#A89E92] mt-2 leading-relaxed font-light">
                Message our team directly on WhatsApp for instantaneous assistance regarding availability, framing, custom commissions, or delivery queries.
              </p>
              
              <a
                href={buildGeneralEnquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-4 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Open WhatsApp Chat</span>
              </a>

              <div className="mt-4 flex items-center justify-between text-[11px] text-[#A89E92] pt-4 border-t border-[#2E2A25]">
                <span>Number: +{siteConfig.whatsappNumber}</span>
                <span className="text-[#25D366]">Online Mon-Sat</span>
              </div>
            </div>

            {/* Studio Contact Information */}
            <div className="bg-white p-6 border border-[#EAE5DC] space-y-5">
              <div className="flex items-start gap-3.5">
                <Mail className="w-4 h-4 text-[#C5A880] mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8C7D70] font-medium">Email Enquiries</h4>
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="text-sm text-[#171717] hover:underline"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8C7D70] font-medium">Print Studio</h4>
                  <p className="text-sm text-[#171717]">{siteConfig.studioLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-4 h-4 text-[#C5A880] mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#8C7D70] font-medium">Studio Hours</h4>
                  <p className="text-sm text-[#171717]">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Custom Art Print Enquiry Builder */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 border border-[#EAE5DC] shadow-xs">
              <span className="text-xs uppercase tracking-widest text-[#8C7D70] font-medium">
                Custom Print Requests
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal mt-1">
                Custom Art Print Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7167] mt-2 font-light leading-relaxed">
                Looking for a specific movie frame, anime artwork, or custom size not listed in our catalogue? Fill in your preference below to generate a prefilled WhatsApp enquiry.
              </p>

              <form onSubmit={handleCustomSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] p-3 text-xs text-[#171717] placeholder-[#A89E92] focus:outline-hidden focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                    Poster Subject / Artwork Name / Movie / Anime
                  </label>
                  <input
                    type="text"
                    required
                    value={customArt}
                    onChange={(e) => setCustomArt(e.target.value)}
                    placeholder="e.g. 2001 A Space Odyssey Monolith or Studio Ghibli Landscape"
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] p-3 text-xs text-[#171717] placeholder-[#A89E92] focus:outline-hidden focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                    Desired Size
                  </label>
                  <select
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] p-3 text-xs text-[#171717] focus:outline-hidden focus:border-[#171717]"
                  >
                    <option value="A4 (8.3 × 11.7 in)">A4 (8.3 × 11.7 in)</option>
                    <option value="A3 (11.7 × 16.5 in)">A3 (11.7 × 16.5 in) — Recommended</option>
                    <option value="A2 (16.5 × 23.4 in)">A2 (16.5 × 23.4 in)</option>
                    <option value="A1 (23.4 × 33.1 in)">A1 (23.4 × 33.1 in)</option>
                    <option value="Custom Dimensions">Custom Dimensions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1.5">
                    Additional Notes (Framing, Paper, or Delivery City)
                  </label>
                  <textarea
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Looking for a natural oak wood frame delivered to Mumbai."
                    className="w-full bg-[#FAF8F5] border border-[#EAE5DC] p-3 text-xs text-[#171717] placeholder-[#A89E92] focus:outline-hidden focus:border-[#171717]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#1C1A17] hover:bg-[#332E27] text-[#FAF8F5] py-3.5 text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Send Custom Enquiry on WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Quick FAQs */}
            <div className="mt-8 bg-[#F5F2EB] p-6 border border-[#EAE5DC]">
              <h3 className="font-serif text-lg font-medium text-[#171717] flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-[#C5A880]" />
                <span>Frequently Asked Questions</span>
              </h3>
              <div className="space-y-3 text-xs text-[#5C554E]">
                <div>
                  <strong className="text-[#171717]">How do I place an order?</strong>
                  <p className="mt-0.5">Explore our catalogue, choose your poster and size, then click &ldquo;Enquire on WhatsApp&rdquo;. Our team will confirm your shipping details and send an invoice.</p>
                </div>
                <div>
                  <strong className="text-[#171717]">What payment options are supported?</strong>
                  <p className="mt-0.5">We accept UPI, Google Pay, PhonePe, Net Banking, and major cards through secure direct billing once your order specifications are finalized.</p>
                </div>
                <div>
                  <strong className="text-[#171717]">How are framed prints shipped safely?</strong>
                  <p className="mt-0.5">We utilize shatterproof 90% UV acrylic and custom reinforced wooden corner packaging with 100% transit insurance protection.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
