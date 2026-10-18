import siteData from "../data/site.json";

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

export const siteConfig: SiteConfig = siteData as SiteConfig;

