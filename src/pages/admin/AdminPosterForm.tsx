import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Percent,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { createProduct, updateProduct } from '../../services/api';
import { ImageUploadField } from '../../components/admin/ImageUploadField';
import type { PosterProduct, PosterSize, PosterOrientation } from '../../types';

export const AdminPosterForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { products, categories, collections, settings, refreshCatalog } = useCatalog();

  // Find existing poster if editing
  const existingProduct = isEditMode
    ? products.find((p) => p.id === id || p.slug === id)
    : undefined;

  // Form State
  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [collectionSlug, setCollectionSlug] = useState('');
  const [orientation, setOrientation] = useState<PosterOrientation>('portrait');
  const [sizes, setSizes] = useState<PosterSize[]>(['A4', 'A3', 'A2', 'A1']);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Pricing
  const [regularPrice, setRegularPrice] = useState<number>(899);
  const [priceA4, setPriceA4] = useState<number>(899);
  const [priceA3, setPriceA3] = useState<number>(1299);
  const [priceA2, setPriceA2] = useState<number>(1899);
  const [priceA1, setPriceA1] = useState<number>(2499);

  // Discount
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);

  // Images
  const [image, setImage] = useState('');
  const [secondaryImage, setSecondaryImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Descriptions & Tags
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [tagsString, setTagsString] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-fill fields when editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name || '');
      setProductId(existingProduct.id || '');
      setSlug(existingProduct.slug || '');
      setTagline(existingProduct.tagline || '');
      setCategorySlug(existingProduct.categorySlug || '');
      setCollectionSlug(existingProduct.collectionSlug || '');
      setOrientation(existingProduct.orientation || 'portrait');
      setSizes(existingProduct.sizes || ['A4', 'A3', 'A2', 'A1']);
      setStatus(existingProduct.status || 'published');
      setFeatured(Boolean(existingProduct.featured));
      setIsBestseller(Boolean(existingProduct.isBestseller));
      setIsNew(Boolean(existingProduct.isNew));

      const reg = existingProduct.regularPrice || existingProduct.price?.A4 || 899;
      setRegularPrice(reg);
      setPriceA4(existingProduct.price?.A4 || reg);
      setPriceA3(existingProduct.price?.A3 || Math.round(reg * 1.5));
      setPriceA2(existingProduct.price?.A2 || Math.round(reg * 2.2));
      setPriceA1(existingProduct.price?.A1 || Math.round(reg * 3.0));

      if (existingProduct.discount) {
        setDiscountEnabled(Boolean(existingProduct.discount.enabled));
        setDiscountType(existingProduct.discount.type || 'percentage');
        setDiscountValue(existingProduct.discount.value || 0);
      }

      setImage(existingProduct.image || '');
      setSecondaryImage(existingProduct.secondaryImage || '');
      setGalleryImages(existingProduct.galleryImages || []);
      setDescription(existingProduct.description || '');
      setShortDescription(existingProduct.shortDescription || '');
      setTagsString(existingProduct.tags?.join(', ') || '');
    } else if (!isEditMode && categories.length > 0) {
      // Default to first category
      setCategorySlug(categories[0].slug);
      if (collections.length > 0) setCollectionSlug(collections[0].slug);
    }
  }, [existingProduct, isEditMode, categories, collections]);

  // Auto-slugify when typing name in Add Mode
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditMode) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (!productId || productId.startsWith('art-')) {
        setProductId(generatedSlug ? `art-${generatedSlug.slice(0, 16)}` : '');
      }
    }
  };

  // Auto-update price tiers when regular price changes
  const handleRegularPriceChange = (val: number) => {
    setRegularPrice(val);
    setPriceA4(val);
    setPriceA3(Math.round(val * 1.45));
    setPriceA2(Math.round(val * 2.1));
    setPriceA1(Math.round(val * 2.8));
  };

  // Calculate live sale price
  const calculateSalePrice = (): number => {
    if (!discountEnabled) return regularPrice;
    if (discountType === 'percentage') {
      const pct = Math.max(0, Math.min(100, discountValue));
      return Math.round(regularPrice * (1 - pct / 100));
    } else {
      return Math.max(0, regularPrice - discountValue);
    }
  };

  const salePrice = calculateSalePrice();
  const savings = Math.max(0, regularPrice - salePrice);

  const toggleSize = (sz: PosterSize) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGalleryImages((prev) => [...prev, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (submitStatus = status) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter a poster name.');
      return;
    }
    if (!productId.trim()) {
      setErrorMessage('Please enter a unique product ID.');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('Please enter a URL slug.');
      return;
    }
    if (!categorySlug) {
      setErrorMessage('Please select a category.');
      return;
    }
    if (!image.trim()) {
      setErrorMessage('Please provide a primary image (upload or enter a URL).');
      return;
    }
    if (sizes.length === 0) {
      setErrorMessage('Please select at least one available size.');
      return;
    }
    if (discountEnabled && salePrice >= regularPrice) {
      setErrorMessage('Discount must result in a sale price lower than the regular price.');
      return;
    }

    const matchedCategory = categories.find((c) => c.slug === categorySlug);
    const matchedCollection = collections.find((c) => c.slug === collectionSlug);

    const payload: Partial<PosterProduct> = {
      id: productId.trim(),
      name: name.trim(),
      slug: slug.trim(),
      tagline: tagline.trim(),
      category: matchedCategory?.name || 'Curated Art',
      categorySlug: categorySlug,
      collection: matchedCollection?.name || 'Studio Archive',
      collectionSlug: collectionSlug || 'studio-archive',
      orientation,
      sizes,
      status: submitStatus,
      available: true,
      featured,
      isBestseller,
      isNew,
      regularPrice,
      price: {
        A4: priceA4,
        A3: priceA3,
        A2: priceA2,
        A1: priceA1,
      },
      discount: {
        enabled: discountEnabled,
        type: discountType,
        value: discountValue,
        salePrice: discountEnabled ? salePrice : undefined,
      },
      image: image.trim(),
      secondaryImage: secondaryImage.trim() || undefined,
      galleryImages,
      description: description.trim() || `${name.trim()} fine art exhibition poster.`,
      shortDescription: shortDescription.trim() || tagline.trim(),
      tags: tagsString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      lastModified: new Date().toISOString(),
    };

    setSaving(true);
    try {
      if (isEditMode) {
        await updateProduct(productId, payload);
        setSuccessMessage(`Poster "${name}" was successfully updated.`);
      } else {
        await createProduct(payload);
        setSuccessMessage(`Poster "${name}" was created successfully.`);
      }
      await refreshCatalog();
      setTimeout(() => {
        navigate('/admin/posters');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save poster.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-28 sm:pb-16">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posters"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            title="Back to All Posters"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {isEditMode ? `Edit Poster: ${name || 'Untitled'}` : 'Add New Poster'}
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {isEditMode
                ? 'Update specifications, pricing, discounts, and images.'
                : 'Create and publish a new art print into the catalogue.'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {isEditMode && slug && (
            <Link
              to={`/admin/preview/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md shadow-2xs transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Publish Poster'}</span>
          </button>
        </div>

        {/* Mobile Preview Action */}
        {isEditMode && slug && (
          <Link
            to={`/admin/preview/${slug}`}
            target="_blank"
            className="sm:hidden p-2 text-slate-700 bg-slate-100 rounded-md"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Core Info, Pricing, Description */}
        <div className="md:col-span-2 space-y-6">
          {/* Section: Basic Details */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Basic Information
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Poster Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Neo Tokyo Skyline"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  disabled={isEditMode}
                  placeholder="art-neo-tokyo"
                  className={`w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none font-mono ${
                    isEditMode ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {isEditMode ? 'Unique ID cannot be changed' : 'Unique identifier for catalogue'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="neo-tokyo-skyline"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Used in URL: /poster/{slug || '...'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Cyberpunk Nostalgia & Neon Reflections"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Collection / Series
                </label>
                <select
                  value={collectionSlug}
                  onChange={(e) => setCollectionSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none bg-white"
                >
                  <option value="">None / General Archive</option>
                  {collections.map((col) => (
                    <option key={col.id} value={col.slug}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Pricing & Discount Manager */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Pricing &amp; Promotional Discount</span>
              <span className="text-[11px] font-normal text-slate-500">
                Currency: {settings?.currencySymbol || '₹'} ({settings?.currency || 'INR'})
              </span>
            </h3>

            {/* Regular Base Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Regular Price ({settings?.currencySymbol || '₹'}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={regularPrice}
                onChange={(e) => handleRegularPriceChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Standard starting price for standard print sizing.
              </span>
            </div>

            {/* Discount Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={discountEnabled}
                    onChange={(e) => setDiscountEnabled(e.target.checked)}
                    className="w-4 h-4 text-slate-900 rounded focus:ring-slate-800"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-rose-600" />
                    Enable Promotional Sale Discount
                  </span>
                </label>
                {discountEnabled && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                    Active on Public Website
                  </span>
                )}
              </div>

              {discountEnabled && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Discount Type
                      </label>
                      <select
                        value={discountType}
                        onChange={(e: any) => setDiscountType(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="fixed">Fixed Reduction Amount ({settings?.currencySymbol || '₹'})</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Discount Value ({discountType === 'percentage' ? '%' : settings?.currencySymbol || '₹'})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={discountType === 'percentage' ? 95 : regularPrice - 1}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      />
                    </div>
                  </div>

                  {/* Live Calculation Preview Banner */}
                  <div className="p-3 bg-white border border-rose-200 rounded-md text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-500">Calculated Sale Price:</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-base font-bold text-rose-700 font-mono">
                          {settings?.currencySymbol || '₹'}
                          {salePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {settings?.currencySymbol || '₹'}
                          {regularPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Collector saves {settings?.currencySymbol || '₹'}
                        {savings.toLocaleString()} ({discountType === 'percentage' ? `${discountValue}%` : 'off'})
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Size Price Breakdown */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-700">
                Detailed Sizing Prices ({settings?.currencySymbol || '₹'})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">A4 Print:</span>
                  <input
                    type="number"
                    value={priceA4}
                    onChange={(e) => setPriceA4(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">A3 Print:</span>
                  <input
                    type="number"
                    value={priceA3}
                    onChange={(e) => setPriceA3(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">A2 Print:</span>
                  <input
                    type="number"
                    value={priceA2}
                    onChange={(e) => setPriceA2(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">A1 Print:</span>
                  <input
                    type="number"
                    value={priceA1}
                    onChange={(e) => setPriceA1(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Narrative & Tags */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Story &amp; Tags
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Artwork Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed story, historical inspiration, printing notes..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Excerpt
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One sentence summary for search and previews..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsString}
                onChange={(e) => setTagsString(e.target.value)}
                placeholder="e.g. vintage, cinema, cyberpunk, monochrome"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Tags make posters easily searchable in the website header search bar.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Media, Attributes, Visibility */}
        <div className="space-y-6">
          {/* Section: Publishing Status */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Visibility Status
            </h3>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Published</span>
                  <span className="text-[11px] text-slate-500">Live on public showcase</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">Draft</span>
                  <span className="text-[11px] text-slate-500">Hidden from public visitors</span>
                </div>
              </label>
            </div>

            {/* Badges & Flags */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Showcase Flags
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span>Collector Bestseller</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>

          {/* Section: Orientation & Sizes */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Format &amp; Sizing
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Orientation
              </label>
              <select
                value={orientation}
                onChange={(e: any) => setOrientation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white capitalize"
              >
                <option value="portrait">Portrait (3:4)</option>
                <option value="landscape">Landscape (4:3)</option>
                <option value="square">Square (1:1)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Available Sizes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['A4', 'A3', 'A2', 'A1'] as PosterSize[]).map((sz) => (
                  <label
                    key={sz}
                    className={`flex items-center gap-2 p-2 rounded border text-xs cursor-pointer ${
                      sizes.includes(sz)
                        ? 'border-slate-800 bg-slate-50 font-semibold text-slate-900'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={sizes.includes(sz)}
                      onChange={() => toggleSize(sz)}
                      className="rounded text-slate-900"
                    />
                    <span>{sz} Print</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Artwork Images */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              Poster Imagery
            </h3>

            {/* Primary Image */}
            <ImageUploadField
              label="Primary Artwork Image *"
              value={image}
              onChange={(url) => setImage(url)}
              helperText="Saved directly to public/images/posters/"
            />

            {/* Secondary / Mockup Image */}
            <ImageUploadField
              label="Secondary / Wall Mockup Image"
              value={secondaryImage}
              onChange={(url) => setSecondaryImage(url)}
              helperText="Shown on hover in the product cards"
            />

            {/* Gallery Images */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Gallery Mockups ({galleryImages.length})
              </label>

              {galleryImages.map((gUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                >
                  <img
                    src={gUrl}
                    alt=""
                    className="w-7 h-7 object-cover rounded shrink-0 bg-slate-200"
                  />
                  <span className="flex-1 truncate text-slate-600 font-mono text-[10px]">
                    {gUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Paste additional mockup URL..."
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleSubmit('draft')}
          disabled={saving}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 active:bg-slate-200 rounded-md border border-slate-300 text-center transition-colors"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit('published')}
          disabled={saving}
          className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-slate-900 active:bg-slate-800 rounded-md shadow-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Publish'}</span>
        </button>
      </div>
    </div>
  );
};
