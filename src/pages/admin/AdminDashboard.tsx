import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FileCheck,
  FileEdit,
  FolderTree,
  Tag,
  Plus,
  ExternalLink,
  ArrowRight,
  Database,
  ShieldCheck,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { toggleProductStatus } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const { products, categories, collections, isBackendOnline, refreshCatalog, settings } =
    useCatalog();

  const totalPosters = products.length;
  const publishedPosters = products.filter((p) => p.status !== 'draft').length;
  const draftPosters = products.filter((p) => p.status === 'draft').length;
  const discountedPosters = products.filter((p) => p.discount?.enabled).length;

  const handleToggleStatus = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleProductStatus(id);
      await refreshCatalog();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const recentPosters = [...products].slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Backend Alert Banner if offline */}
      {!isBackendOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-amber-900">Local Backend Offline</p>
            <p className="mt-0.5 text-amber-700">
              The local Express server is not reachable at <code>http://127.0.0.1:5001</code>. Start it with{' '}
              <code>npm run dev</code> or <code>npm run server</code> to enable live file saving and image uploads.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {/* Total Posters */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">Total Posters</span>
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{totalPosters}</div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Full catalogue</p>
        </div>

        {/* Published */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">Live</span>
            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700">{publishedPosters}</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5 truncate">Visible online</p>
        </div>

        {/* Drafts */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">Drafts</span>
            <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700">{draftPosters}</div>
          <p className="text-[10px] text-amber-600 font-medium mt-0.5 truncate">Hidden drafts</p>
        </div>

        {/* Categories */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">Categories</span>
            <FolderTree className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{categories.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Disciplines</p>
        </div>

        {/* Collections */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">Collections</span>
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">{collections.length}</div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">Series</p>
        </div>

        {/* Discounts Active */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-medium text-[11px] sm:text-xs">On Sale</span>
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-700">{discountedPosters}</div>
          <p className="text-[10px] text-rose-600 font-medium mt-0.5 truncate">Active sales</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Quick Actions
        </div>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
          <Link
            to="/admin/posters/new"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors text-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Poster</span>
          </Link>
          <Link
            to="/admin/drafts"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center"
          >
            <FileEdit className="w-3.5 h-3.5 text-slate-500" />
            <span>Drafts ({draftPosters})</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center"
          >
            <FolderTree className="w-3.5 h-3.5 text-slate-500" />
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/settings"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors text-center"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Backups</span>
          </Link>
        </div>
      </div>

      {/* Recent Posters Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Recent Posters in Catalogue</h2>
            <p className="text-xs text-slate-500">
              Showing newest posters added or modified in the local JSON database.
            </p>
          </div>
          <Link
            to="/admin/posters"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span>View All ({totalPosters})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="py-2.5 px-4 w-12">Image</th>
                <th className="py-2.5 px-4">Poster Name &amp; ID</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Price</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentPosters.map((poster) => {
                const isDraft = poster.status === 'draft';
                const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
                const hasDiscount = poster.discount?.enabled && poster.discount?.salePrice;

                return (
                  <tr key={poster.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="w-9 h-12 bg-slate-100 border border-slate-200 rounded overflow-hidden">
                        <img
                          src={poster.image}
                          alt={poster.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://placehold.co/100x140?text=Art';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{poster.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">ID: {poster.id}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                        {poster.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {hasDiscount ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-rose-700">
                            {settings?.currencySymbol || '₹'}
                            {poster.discount?.salePrice?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through block">
                            {settings?.currencySymbol || '₹'}
                            {regPrice?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800">
                          {settings?.currencySymbol || '₹'}
                          {regPrice?.toLocaleString() || '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => handleToggleStatus(poster.id, e)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          isDraft
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isDraft ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span>{isDraft ? 'Draft' : 'Published'}</span>
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <Link
                        to={`/admin/preview/${poster.slug}`}
                        className="text-slate-500 hover:text-slate-900 font-medium"
                        title="Preview artwork in showcase style"
                      >
                        Preview
                      </Link>
                      <span className="text-slate-300">|</span>
                      <Link
                        to={`/admin/posters/edit/${poster.id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {recentPosters.map((poster) => {
            const isDraft = poster.status === 'draft';
            const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
            const hasDiscount = poster.discount?.enabled && poster.discount?.salePrice;

            return (
              <div key={poster.id} className="p-3.5 space-y-2.5">
                <div className="flex gap-3">
                  <div className="w-12 h-16 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                    <img
                      src={poster.image}
                      alt={poster.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/100x140?text=Art';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">
                      {poster.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px]">
                        {poster.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ID: {poster.id}
                      </span>
                    </div>

                    <div className="mt-1">
                      {hasDiscount ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-rose-700 text-xs">
                            {settings?.currencySymbol || '₹'}
                            {poster.discount?.salePrice?.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through">
                            {settings?.currencySymbol || '₹'}
                            {regPrice?.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium text-slate-800 text-xs">
                          {settings?.currencySymbol || '₹'}
                          {regPrice?.toLocaleString() || '—'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(poster.id, e)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                      isDraft
                        ? 'bg-amber-100 text-amber-800 active:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 active:bg-emerald-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDraft ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span>{isDraft ? 'Draft' : 'Published'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/preview/${poster.slug}`}
                      className="px-2.5 py-1 text-slate-600 bg-slate-100 rounded text-[11px] font-medium"
                    >
                      Preview
                    </Link>
                    <Link
                      to={`/admin/posters/edit/${poster.id}`}
                      className="px-2.5 py-1 text-indigo-700 bg-indigo-50 rounded text-[11px] font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Status Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local Environment Architecture</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All modifications write directly to local disk in <code>src/data/products.json</code>,{' '}
            <code>categories.json</code>, and <code>site.json</code>. Automatic snapshots are saved in{' '}
            <code>backups/</code> before every write.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Local Backend URL:</span>
            <code className="text-slate-800 font-mono">http://127.0.0.1:5001</code>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ExternalLink className="w-4 h-4 text-slate-600" />
            <span>Public Site Separation Guarantee</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The public showcase running at <code>http://localhost:5173</code> only displays published
            items with active pricing and pre-filled WhatsApp enquiry routing. Draft items remain
            completely hidden from visitors.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
            <span>Production Build Mode:</span>
            <code className="text-slate-800 font-mono">npm run build:public (Admin stripped)</code>
          </div>
        </div>
      </div>
    </div>
  );
};
