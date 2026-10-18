import type { PosterProduct, Category, Collection } from '../types';
import type { SiteConfig } from '../config/site';

import fallbackProducts from '../data/products.json';
import fallbackCategories from '../data/categories.json';
import fallbackCollections from '../data/collections.json';
import fallbackSettings from '../data/site.json';

const API_BASE = '/api';

export async function getProducts(): Promise<PosterProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using bundled fallback products:', err);
    return fallbackProducts as PosterProduct[];
  }
}

export async function getProduct(idOrSlug: string): Promise<PosterProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(idOrSlug)}`);
    if (!res.ok) throw new Error('Product not found in API');
    return await res.json();
  } catch (err) {
    const found = (fallbackProducts as PosterProduct[]).find(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );
    return found || null;
  }
}

export async function createProduct(product: Partial<PosterProduct>): Promise<PosterProduct> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create poster.');
  }
  return data.product;
}

export async function updateProduct(id: string, product: Partial<PosterProduct>): Promise<PosterProduct> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update poster.');
  }
  return data.product;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete poster.');
  }
}

export async function toggleProductStatus(id: string): Promise<PosterProduct> {
  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}/toggle-status`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to toggle status.');
  }
  return data.product;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackCategories as Category[];
  }
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save category.');
  }
  return data.category;
}

export async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete category.');
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await fetch(`${API_BASE}/collections`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackCollections as Collection[];
  }
}

export async function saveCollection(collection: Partial<Collection>): Promise<Collection> {
  const res = await fetch(`${API_BASE}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save collection.');
  }
  return data.collection;
}

export async function deleteCollection(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/collections/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete collection.');
  }
}

export async function getSettings(): Promise<SiteConfig> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('API request failed');
    return await res.json();
  } catch (err) {
    return fallbackSettings as SiteConfig;
  }
}

export async function saveSettings(settings: Partial<SiteConfig>): Promise<SiteConfig> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save settings.');
  }
  return data.settings;
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload image.');
  }
  return data;
}

export async function getBackups(): Promise<Array<{ name: string; createdAt: string }>> {
  const res = await fetch(`${API_BASE}/backups`);
  if (!res.ok) throw new Error('Failed to fetch backups.');
  return await res.json();
}

export async function triggerBackup(): Promise<string> {
  const res = await fetch(`${API_BASE}/backup`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Backup creation failed.');
  return data.message;
}

export async function restoreBackup(backupName: string): Promise<string> {
  const res = await fetch(`${API_BASE}/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ backupName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Restore failed.');
  return data.message;
}

export async function syncToGitHub(): Promise<{ success: boolean; message: string; liveUrl: string }> {
  const res = await fetch(`${API_BASE}/git/push`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to sync changes with GitHub.');
  return data;
}

