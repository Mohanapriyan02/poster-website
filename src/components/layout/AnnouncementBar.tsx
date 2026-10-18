import React, { useState } from "react";
import { useCatalog } from "../../context/CatalogContext";
import { MessageCircle, X } from "lucide-react";
import { buildGeneralEnquiryUrl } from "../../utils/whatsapp";

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const { settings } = useCatalog();

  if (!visible) return null;

  return (
    <div className="bg-[#1C1A17] text-[#FAF8F5] text-xs font-normal tracking-wide py-2 px-4 transition-all relative z-50 border-b border-[#2E2A25]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:block w-6" /> {/* Spacer */}
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <span>{settings.announcement}</span>
          <span className="hidden md:inline text-[#C5A880]">·</span>
          <a
            href={buildGeneralEnquiryUrl("Hi! I would like to enquire about your poster catalogue.", settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1 text-[#C5A880] hover:text-[#E2D8CC] underline underline-offset-2 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat with Curator</span>
          </a>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss banner"
          className="text-[#FAF8F5]/60 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
