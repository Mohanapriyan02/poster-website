import { siteConfig } from "../config/site";
import type { PosterProduct, PosterSize, FrameStyle } from "../types";

export const SIZE_DIMENSIONS: Record<PosterSize, string> = {
  A4: "8.3 × 11.7 in (21 × 29.7 cm)",
  A3: "11.7 × 16.5 in (29.7 × 42 cm)",
  A2: "16.5 × 23.4 in (42 × 59.4 cm)",
  A1: "23.4 × 33.1 in (59.4 × 84.1 cm)",
};

export const FRAME_LABELS: Record<FrameStyle, string> = {
  unframed: "Unframed Fine Art Print",
  "black-wood": "Matte Black Solid Wood Frame",
  "natural-oak": "Natural Oak Wood Frame",
  "white-gallery": "Museum White Gallery Frame",
};

/**
 * Builds the official wa.me enquiry link for a specific poster.
 */
export function buildPosterEnquiryUrl(
  poster: PosterProduct,
  selectedSize?: PosterSize,
  frameStyle?: FrameStyle
): string {
  const sizeText = selectedSize
    ? `${selectedSize} (${SIZE_DIMENSIONS[selectedSize] || selectedSize})`
    : poster.sizes && poster.sizes.length > 0
    ? `${poster.sizes[0]} (${SIZE_DIMENSIONS[poster.sizes[0]] || poster.sizes[0]})`
    : "Standard Size";

  const firstSize = poster.sizes?.[0];
  const firstPrice = firstSize && poster.price ? poster.price[firstSize] : undefined;
  const sizePrice = selectedSize && poster.price?.[selectedSize]
    ? `${siteConfig.currencySymbol}${poster.price[selectedSize]?.toLocaleString()}`
    : firstPrice
    ? `From ${siteConfig.currencySymbol}${firstPrice.toLocaleString()}`
    : "Price on request";


  const frameText = frameStyle ? FRAME_LABELS[frameStyle] : "Unframed Print";

  const lines = [
    `Hi ${siteConfig.brandName}! I'm interested in this poster:`,
    ``,
    `🖼️ Poster: ${poster.name}`,
    `🏷️ Product ID: ${poster.id}`,
    `📁 Category: ${poster.category}`,
    `📐 Size: ${sizeText}`,
    `🖼️ Finish / Frame: ${frameText}`,
    `💳 Listed Price: ${sizePrice}`,
    ``,
    `Could you please share details on availability, framing options, and estimated delivery?`,
  ];

  const message = lines.join("\n");
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the official wa.me link for general inquiries.
 */
export function buildGeneralEnquiryUrl(customMessage?: string): string {
  const message = customMessage || siteConfig.defaultEnquiryMessage;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds custom artwork enquiry message
 */
export function buildCustomPrintEnquiryUrl(details: {
  name: string;
  artType: string;
  size: string;
  notes?: string;
}): string {
  const lines = [
    `Hi ${siteConfig.brandName}! I'd like to enquire about a custom art print:`,
    ``,
    `👤 Name: ${details.name || "Collector"}`,
    `🎨 Art / Subject: ${details.artType}`,
    `📐 Desired Size: ${details.size}`,
    details.notes ? `📝 Notes: ${details.notes}` : "",
    ``,
    `Could you guide me on requirements and pricing?`,
  ].filter(Boolean);

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
