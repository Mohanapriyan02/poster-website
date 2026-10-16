import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";
import { siteConfig } from "../../config/site";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip / Speech bubble */}
      {showTooltip && (
        <div className="hidden sm:block bg-[#1C1A17] text-[#FAF8F5] text-xs py-2 px-3.5 shadow-lg border border-[#332E27] max-w-xs animate-in fade-in slide-in-from-right-2 duration-200">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-[#C5A880]">Have a question?</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[#A89E92] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-[#A89E92] mt-0.5">
            Ask us about custom sizes, framing, or instant delivery via WhatsApp.
          </p>
        </div>
      )}

      {/* Button */}
      <a
        href={buildGeneralEnquiryUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-hidden"
        aria-label="Enquire on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#FAF8F5] animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[#FAF8F5]" />
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
};
