import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  Eye,
  Tag,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { toggleProductStatus, deleteProduct } from '../../services/api';
import type { PosterProduct } from '../../types';

export const AdminPostersList: React.FC = () => {
  const { products, categories, collections, settings, refreshCatalog } = useCatalog();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDiscount, setSelectedDiscount] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'price-asc' | 'price-desc'>('newest');

  // Deletion modal state
  const [deletingPoster, setDeletingPoster] = useState<PosterProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    // Discount filter
    if (selectedDiscount === 'sale') {
      list = list.filter((p) => p.discount?.enabled);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        list.sort((a, b) => {
          const pa = a.discount?.salePrice || a.regularPrice || a.price?.A3 || 0;
          const pb = b.discount?.salePrice || b.regularPrice || b.price?.A3 || 0;
          return pa - pb;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => {
          const pa = a.discount?.salePrice || a.regularPrice || a.price?.A3 || 0;
          const pb = b.discount?.salePrice || b.regularPrice || b.price?.A3 || 0;
          return pb - pa;
        });
        break;
      case 'newest':
      default:
        // Already naturally ordered or by lastModified
        list.sort((a, b) => {
          const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return tb - ta;
        });
        break;
    }

    return list;
  }, [products, searchTerm, selectedCategory, selectedStatus, selectedDiscount, sortBy]);

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await toggleProductStatus(id);
      await refreshCatalog();
      setActionMessage({
        type: 'success',
        text: `Poster "${updated.name}" is now marked as ${updated.status}.`,
      });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to toggle status.' });
    }
  };

  const confirmDelete = async () => {
    if (!deletingPoster) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingPoster.id);
      await refreshCatalog();
      setActionMessage({
        type: 'success',
        text: `Poster "${deletingPoster.name}" was permanently removed.`,
      });
      setDeletingPoster(null);
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to delete poster.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-3 rounded-md text-xs font-medium flex items-center justify-between shadow-2xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Posters</h2>
          <p className="text-xs text-slate-500">
            Manage catalogue items, pricing, discounts, and publication visibility.
          </p>
        </div>
        <Link
          to="/admin/posters/new"
          className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Poster</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by poster name, ID, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-md focus:border-slate-800 focus:outline-none bg-white text-slate-700"
            >
              <option value="newest">Sort: Recently Modified</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 flex-wrap gap-2 text-slate-500">
          <div className="flex items-center gap-2">
            <span>Filter:</span>
            <button
              onClick={() => setSelectedDiscount(selectedDiscount === 'sale' ? 'all' : 'sale')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedDiscount === 'sale'
                  ? 'bg-rose-100 text-rose-800 font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              On Sale Only
            </button>
            {(searchTerm ||
              selectedCategory !== 'all' ||
              selectedStatus !== 'all' ||
              selectedDiscount !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSelectedDiscount('all');
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 underline"
              >
                Reset filters
              </button>
            )}
          </div>
          <div>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of{' '}
            <strong className="text-slate-800">{products.length}</strong> posters
          </div>
        </div>
      </div>

      {/* Posters Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-3 px-4 w-14">Image</th>
                <th className="py-3 px-4">Poster Details</th>
                <th className="py-3 px-4">Category / Series</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No posters match your current filters.</p>
                    <p className="text-xs mt-1">Try clearing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((poster) => {
                  const isDraft = poster.status === 'draft';
                  const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
                  const discount = poster.discount;
                  const hasDiscount = discount?.enabled && discount?.salePrice;

                  return (
                    <tr key={poster.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-10 h-14 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                          <img
                            src={poster.image}
                            alt={poster.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://placehold.co/100x140?text=Poster';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{poster.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ID: <span className="text-slate-600">{poster.id}</span> &middot;{' '}
                          <span className="capitalize">{poster.orientation}</span>
                        </div>
                        {poster.tags && poster.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {poster.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                          {poster.category}
                        </span>
                        {poster.collection && (
                          <div className="text-[11px] text-slate-400 mt-1 truncate">
                            {poster.collection}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {hasDiscount ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-rose-700">
                                {settings?.currencySymbol || '₹'}
                                {discount.salePrice?.toLocaleString()}
                              </span>
                              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                {discount.type === 'percentage'
                                  ? `${discount.value}% OFF`
                                  : `Save ${settings?.currencySymbol || '₹'}${discount.value}`}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 line-through block">
                              Regular: {settings?.currencySymbol || '₹'}
                              {regPrice?.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-900">
                            {settings?.currencySymbol || '₹'}
                            {regPrice?.toLocaleString() || 'On Request'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(poster.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            isDraft
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title={`Click to switch to ${isDraft ? 'published' : 'draft'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDraft ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span>{isDraft ? 'Draft' : 'Published'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/admin/preview/${poster.slug}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Preview Poster"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/posters/edit/${poster.id}`}
                            className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit Poster Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeletingPoster(poster)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Poster"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Posters Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-400">
            <p className="text-sm font-medium">No posters match your current filters.</p>
            <p className="text-xs mt-1">Try clearing your search or filters.</p>
          </div>
        ) : (
          filteredProducts.map((poster) => {
            const isDraft = poster.status === 'draft';
            const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
            const discount = poster.discount;
            const hasDiscount = discount?.enabled && discount?.salePrice;

            return (
              <div
                key={poster.id}
                className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-3"
              >
                {/* Top Row: Thumbnail + Details + Pricing */}
                <div className="flex gap-3">
                  <div className="w-14 h-20 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                    <img
                      src={poster.image}
                      alt={poster.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/100x140?text=Poster';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate leading-snug">
                      {poster.name}
                    </h3>

                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-[10px] font-medium">
                        {poster.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono capitalize">
                        {poster.orientation}
                      </span>
                    </div>

                    <div className="mt-1.5">
                      {hasDiscount ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-rose-700 text-xs">
                            {settings?.currencySymbol || '₹'}
                            {discount.salePrice?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through">
                            {settings?.currencySymbol || '₹'}
                            {regPrice?.toLocaleString()}
                          </span>
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            {discount.type === 'percentage'
                              ? `${discount.value}% OFF`
                              : `Save ${settings?.currencySymbol || '₹'}${discount.value}`}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900 text-xs">
                          {settings?.currencySymbol || '₹'}
                          {regPrice?.toLocaleString() || 'On Request'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Toggle & ID Meta Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Status:</span>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(poster.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        isDraft
                          ? 'bg-amber-100 text-amber-800 active:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-800 active:bg-emerald-200'
                      }`}
                      title="Tap to toggle status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDraft ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span>{isDraft ? 'Draft' : 'Published'}</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                    ID: {poster.id}
                  </span>
                </div>

                {/* Action Buttons Row with touch targets */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  <Link
                    to={`/admin/preview/${poster.slug}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium text-slate-700 bg-slate-100 active:bg-slate-200 rounded transition-colors text-center"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </Link>

                  <Link
                    to={`/admin/posters/edit/${poster.id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold text-indigo-700 bg-indigo-50 active:bg-indigo-100 rounded transition-colors text-center"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeletingPoster(poster)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium text-rose-700 bg-rose-50 active:bg-rose-100 rounded transition-colors text-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-full">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Poster</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>&ldquo;{deletingPoster.name}&rdquo;</strong> (ID: {deletingPoster.id})? This will update <code>src/data/products.json</code> and unlink unused uploaded images. A backup snapshot will be saved automatically.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingPoster(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-xs transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Poster'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
