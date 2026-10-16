export type PosterOrientation = "portrait" | "landscape" | "square";

export type PosterSize = "A4" | "A3" | "A2" | "A1";

export interface PosterPrice {
  A4?: number;
  A3?: number;
  A2?: number;
  A1?: number;
  [key: string]: number | undefined;
}

export interface PosterProduct {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  category: string;
  categorySlug: string;
  collection: string;
  collectionSlug: string;
  price?: PosterPrice;
  sizes: PosterSize[];
  image: string;
  secondaryImage: string;
  mockupImages?: {
    livingRoom?: string;
    bedroom?: string;
    studio?: string;
    desk?: string;
  };
  galleryImages: string[];
  featured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  orientation: PosterOrientation;
  tags: string[];
  available: boolean;
  materials?: string;
  finish?: string;
  artistNote?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: string;
  posterCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  featuredProductSlugs?: string[];
}

export interface FilterState {
  search: string;
  category: string;
  collection: string;
  orientation: string;
  sortBy: "featured" | "bestseller" | "newest" | "price-asc" | "price-desc" | "name-asc";
}

export type FrameStyle = "unframed" | "black-wood" | "natural-oak" | "white-gallery";

export interface FrameOption {
  id: FrameStyle;
  name: string;
  description: string;
  borderClass: string;
  frameMatte: string;
}
