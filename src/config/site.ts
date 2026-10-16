export interface SiteConfig {
  brandName: string;
  tagline: string;
  whatsappNumber: string; // International format without +, spaces, or hyphens (e.g. 919876543210)
  currency: string;
  currencySymbol: string;
  announcement: string;
  defaultEnquiryMessage: string;
  contactEmail: string;
  studioLocation: string;
  socials: {
    instagram: string;
    pinterest: string;
    twitter: string;
  };
  navigation: { label: string; href: string }[];
}

export const siteConfig: SiteConfig = {
  brandName: "LUMINA & ARCHIVE",
  tagline: "Fine Art Prints & Archival Poster Gallery",
  whatsappNumber: "919876543210", // Business WhatsApp number (configure here)
  currency: "INR",
  currencySymbol: "₹",
  announcement: "Art for your walls. Inspiration for your everyday. Direct WhatsApp inquiries welcome.",
  defaultEnquiryMessage: "Hi! I'd like to know more about your poster collection.",
  contactEmail: "enquiry@lumina-archive.art",
  studioLocation: "Indiranagar, Bengaluru, India",
  socials: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
    twitter: "https://twitter.com",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Explore Posters", href: "/posters" },
    { label: "Collections", href: "/#collections" },
    { label: "Categories", href: "/#categories" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
