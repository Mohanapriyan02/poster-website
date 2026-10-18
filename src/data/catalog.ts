import productsData from "./products.json";
import categoriesData from "./categories.json";
import collectionsData from "./collections.json";
import type { PosterProduct, Category, Collection, FilterState } from "../types";

export const products: PosterProduct[] = productsData as PosterProduct[];
export const categories: Category[] = categoriesData as Category[];
export const collections: Collection[] = collectionsData as Collection[];

export function getAllProducts(includeDrafts = false): PosterProduct[] {
  return products.filter((p) => (includeDrafts || p.status !== "draft") && p.available !== false);
}

export function getProductBySlug(slug: string, includeDrafts = false): PosterProduct | undefined {
  return products.find(
    (p) =>
      p.slug.toLowerCase() === slug.toLowerCase() &&
      (includeDrafts || (p.status !== "draft" && p.available !== false))
  );
}

export function getProductById(id: string, includeDrafts = false): PosterProduct | undefined {
  return products.find(
    (p) =>
      p.id.toLowerCase() === id.toLowerCase() &&
      (includeDrafts || (p.status !== "draft" && p.available !== false))
  );
}

export function getFeaturedProducts(limit = 8): PosterProduct[] {
  return products
    .filter((p) => p.featured && p.available !== false && p.status !== "draft")
    .slice(0, limit);
}

export function getBestsellerProducts(limit = 8): PosterProduct[] {
  return products
    .filter((p) => p.isBestseller && p.available !== false && p.status !== "draft")
    .slice(0, limit);
}

export function getNewArrivals(limit = 8): PosterProduct[] {
  return products
    .filter((p) => p.isNew && p.available !== false && p.status !== "draft")
    .slice(0, limit);
}

export function getProductsByCategory(categorySlug: string): PosterProduct[] {
  return products.filter(
    (p) =>
      p.categorySlug.toLowerCase() === categorySlug.toLowerCase() &&
      p.available !== false &&
      p.status !== "draft"
  );
}

export function getProductsByCollection(collectionSlug: string): PosterProduct[] {
  return products.filter(
    (p) =>
      p.collectionSlug.toLowerCase() === collectionSlug.toLowerCase() &&
      p.available !== false &&
      p.status !== "draft"
  );
}

export function getRelatedProducts(
  currentSlug: string,
  categorySlug: string,
  limit = 4
): PosterProduct[] {
  return products
    .filter(
      (p) =>
        p.slug !== currentSlug &&
        p.categorySlug === categorySlug &&
        p.available !== false &&
        p.status !== "draft"
    )
    .slice(0, limit);
}

export function getCategories(): Category[] {
  return categories.map((cat) => ({
    ...cat,
    posterCount: products.filter(
      (p) => p.categorySlug === cat.slug && p.available !== false && p.status !== "draft"
    ).length,
  }));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function filterAndSortProducts(
  filters: FilterState,
  sourceProducts?: PosterProduct[]
): PosterProduct[] {
  let list = sourceProducts ? [...sourceProducts] : getAllProducts();

  // Search filter (name, tags, description, category)
  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    list = list.filter((p) => p.categorySlug === filters.category);
  }

  // Collection filter
  if (filters.collection && filters.collection !== "all") {
    list = list.filter((p) => p.collectionSlug === filters.collection);
  }

  // Orientation filter
  if (filters.orientation && filters.orientation !== "all") {
    list = list.filter((p) => p.orientation === filters.orientation);
  }

  // Sorting
  switch (filters.sortBy) {
    case "price-asc":
      list.sort((a, b) => {
        const pa = a.price?.A3 || a.price?.A4 || a.regularPrice || 0;
        const pb = b.price?.A3 || b.price?.A4 || b.regularPrice || 0;
        return pa - pb;
      });
      break;
    case "price-desc":
      list.sort((a, b) => {
        const pa = a.price?.A3 || a.price?.A4 || a.regularPrice || 0;
        const pb = b.price?.A3 || b.price?.A4 || b.regularPrice || 0;
        return pb - pa;
      });
      break;
    case "name-asc":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "bestseller":
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      break;
    case "newest":
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case "featured":
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return list;
}
