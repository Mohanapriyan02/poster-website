import { siteConfig, type SiteConfig } from "../config/site";
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
  frameStyle?: FrameStyle,
  overrideConfig?: Partial<SiteConfig>
): string {
  const config = { ...siteConfig, ...overrideConfig };

  const sizeText = selectedSize
    ? `${selectedSize} (${SIZE_DIMENSIONS[selectedSize] || selectedSize})`
    : poster.sizes && poster.sizes.length > 0
    ? `${poster.sizes[0]} (${SIZE_DIMENSIONS[poster.sizes[0]] || poster.sizes[0]})`
    : "Standard Size";

  const firstSize = poster.sizes?.[0];
  const firstPrice = firstSize && poster.price ? poster.price[firstSize] : poster.regularPrice;
  let sizePrice = selectedSize && poster.price?.[selectedSize]
    ? `${config.currencySymbol}${poster.price[selectedSize]?.toLocaleString()}`
    : firstPrice
    ? `From ${config.currencySymbol}${firstPrice.toLocaleString()}`
    : "Price on request";

  // Check for active discount
  if (poster.discount?.enabled && poster.discount.salePrice !== undefined) {
    const reg = selectedSize && poster.price?.[selectedSize] ? poster.price[selectedSize] : (poster.regularPrice || firstPrice);
    const sale = poster.discount.salePrice;
    if (reg && sale < reg) {
      const discountLabel = poster.discount.type === "percentage"
        ? `${poster.discount.value}% OFF`
        : `Save ${config.currencySymbol}${poster.discount.value}`;
      sizePrice = `${config.currencySymbol}${sale.toLocaleString()} (Special Offer: ${discountLabel}, Regular: ${config.currencySymbol}${reg.toLocaleString()})`;
    }
  }

  const frameText = frameStyle ? FRAME_LABELS[frameStyle] : "Unframed Print";

  const lines = [
    `Hi ${config.brandName}! I'm interested in this poster:`,
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
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the official wa.me link for general inquiries.
 */
export function buildGeneralEnquiryUrl(customMessage?: string, overrideConfig?: Partial<SiteConfig>): string {
  const config = { ...siteConfig, ...overrideConfig };
  const message = customMessage || config.defaultEnquiryMessage;
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds custom artwork enquiry message
 */
export function buildCustomPrintEnquiryUrl(
  details: {
    name: string;
    artType: string;
    size: string;
    notes?: string;
  },
  overrideConfig?: Partial<SiteConfig>
): string {
  const config = { ...siteConfig, ...overrideConfig };
  const lines = [
    `Hi ${config.brandName}! I'd like to enquire about a custom art print:`,
    ``,
    `👤 Name: ${details.name || "Collector"}`,
    `🎨 Art / Subject: ${details.artType}`,
    `📐 Desired Size: ${details.size}`,
    details.notes ? `📝 Notes: ${details.notes}` : "",
    ``,
    `Could you guide me on requirements and pricing?`,
  ].filter(Boolean);

  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
