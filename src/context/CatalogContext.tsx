import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { PosterProduct, Category, Collection } from '../types';
import type { SiteConfig } from '../config/site';
import * as api from '../services/api';

import initialProducts from '../data/products.json';
import initialCategories from '../data/categories.json';
import initialCollections from '../data/collections.json';
import initialSettings from '../data/site.json';

interface CatalogContextType {
  products: PosterProduct[];
  publishedProducts: PosterProduct[];
  categories: Category[];
  collections: Collection[];
  settings: SiteConfig;
  loading: boolean;
  isBackendOnline: boolean;
  refreshCatalog: () => Promise<void>;
  getProductBySlug: (slug: string, includeDrafts?: boolean) => PosterProduct | undefined;
  getProductById: (id: string, includeDrafts?: boolean) => PosterProduct | undefined;
  getProductsByCategory: (categorySlug: string) => PosterProduct[];
  getProductsByCollection: (collectionSlug: string) => PosterProduct[];
  getRelatedProducts: (currentSlug: string, categorySlug: string, limit?: number) => PosterProduct[];
  getFeaturedProducts: (limit?: number) => PosterProduct[];
  getBestsellerProducts: (limit?: number) => PosterProduct[];
  getNewArrivals: (limit?: number) => PosterProduct[];
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<PosterProduct[]>(initialProducts as PosterProduct[]);
  const [rawCategories, setRawCategories] = useState<Category[]>(initialCategories as Category[]);
  const [collections, setCollections] = useState<Collection[]>(initialCollections as Collection[]);
  const [settings, setSettings] = useState<SiteConfig>(initialSettings as SiteConfig);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  const refreshCatalog = useCallback(async () => {
    try {
      const [prods, cats, cols, sets] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getCollections(),
        api.getSettings(),
      ]);

      setProducts(prods);
      setRawCategories(cats);
      setCollections(cols);
      setSettings(sets);
      setIsBackendOnline(true);
    } catch (err) {
      console.warn('Could not fetch from local backend API:', err);
      setIsBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();

    // Re-fetch when switching back to this tab/window
    const onFocus = () => {
      refreshCatalog();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshCatalog]);

  // Published products: exclude any draft or unavailable posters
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.status !== 'draft' && p.available !== false);
  }, [products]);

  // Compute live poster counts for categories
  const categories = useMemo(() => {
    return rawCategories.map((cat) => ({
      ...cat,
      posterCount: publishedProducts.filter(
        (p) => p.categorySlug.toLowerCase() === cat.slug.toLowerCase()
      ).length,
    }));
  }, [rawCategories, publishedProducts]);

  const getProductBySlug = useCallback(
    (slug: string, includeDrafts = false) => {
      const list = includeDrafts ? products : publishedProducts;
      return list.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    },
    [products, publishedProducts]
  );

  const getProductById = useCallback(
    (id: string, includeDrafts = false) => {
      const list = includeDrafts ? products : publishedProducts;
      return list.find((p) => p.id.toLowerCase() === id.toLowerCase());
    },
    [products, publishedProducts]
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string) => {
      return publishedProducts.filter(
        (p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase()
      );
    },
    [publishedProducts]
  );

  const getProductsByCollection = useCallback(
    (collectionSlug: string) => {
      return publishedProducts.filter(
        (p) => p.collectionSlug.toLowerCase() === collectionSlug.toLowerCase()
      );
    },
    [publishedProducts]
  );

  const getRelatedProducts = useCallback(
    (currentSlug: string, categorySlug: string, limit = 4) => {
      return publishedProducts
        .filter(
          (p) =>
            p.slug.toLowerCase() !== currentSlug.toLowerCase() &&
            p.categorySlug.toLowerCase() === categorySlug.toLowerCase()
        )
        .slice(0, limit);
    },
    [publishedProducts]
  );

  const getFeaturedProducts = useCallback(
    (limit = 8) => {
      return publishedProducts.filter((p) => p.featured).slice(0, limit);
    },
    [publishedProducts]
  );

  const getBestsellerProducts = useCallback(
    (limit = 8) => {
      return publishedProducts.filter((p) => p.isBestseller).slice(0, limit);
    },
    [publishedProducts]
  );

  const getNewArrivals = useCallback(
    (limit = 8) => {
      return publishedProducts.filter((p) => p.isNew).slice(0, limit);
    },
    [publishedProducts]
  );

  return (
    <CatalogContext.Provider
      value={{
        products,
        publishedProducts,
        categories,
        collections,
        settings,
        loading,
        isBackendOnline,
        refreshCatalog,
        getProductBySlug,
        getProductById,
        getProductsByCategory,
        getProductsByCollection,
        getRelatedProducts,
        getFeaturedProducts,
        getBestsellerProducts,
        getNewArrivals,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
