import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileEdit,
  Eye,
  CheckCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { toggleProductStatus } from '../../services/api';

export const AdminDraftsList: React.FC = () => {
  const { products, settings, refreshCatalog } = useCatalog();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const drafts = products.filter((p) => p.status === 'draft');

  const handlePublish = async (id: string, name: string) => {
    setPublishingId(id);
    setMessage(null);
    try {
      await toggleProductStatus(id);
      await refreshCatalog();
      setMessage(`"${name}" is now published and live on the public website.`);
      setTimeout(() => setMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to publish draft.');
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <FileEdit className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h3 className="font-bold text-amber-900">Draft Workspaces ({drafts.length})</h3>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              These posters are saved in <code>src/data/products.json</code> with <code>status: &quot;draft&quot;</code>. They are strictly hidden from visitors on the public website and excluded from search queries until published.
            </p>
          </div>
        </div>
        <Link
          to="/admin/posters/new"
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Poster</span>
        </Link>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Drafts List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {drafts.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 px-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Drafts Pending</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All {products.length} posters in your catalogue are currently published and live on the public showcase.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/posters/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create a New Draft Poster</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="py-3 px-4 w-12">Thumbnail</th>
                    <th className="py-3 px-4">Poster Name &amp; ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Last Modified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {drafts.map((poster) => {
                    const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
                    return (
                      <tr key={poster.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-9 h-12 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                            <img
                              src={poster.image}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://placehold.co/100x140?text=Draft';
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{poster.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">ID: {poster.id}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                            {poster.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {settings?.currencySymbol || '₹'}
                          {regPrice?.toLocaleString() || 'On Request'}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {poster.lastModified
                            ? new Date(poster.lastModified).toLocaleDateString()
                            : 'Initial Import'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            to={`/admin/preview/${poster.slug}`}
                            className="px-2 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium transition-colors"
                          >
                            Preview
                          </Link>
                          <Link
                            to={`/admin/posters/edit/${poster.id}`}
                            className="px-2 py-1 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded text-[11px] font-semibold transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handlePublish(poster.id, poster.name)}
                            disabled={publishingId === poster.id}
                            className="px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 rounded text-[11px] font-bold shadow-2xs transition-colors"
                          >
                            {publishingId === poster.id ? 'Publishing...' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-slate-100">
              {drafts.map((poster) => {
                const regPrice = poster.regularPrice || poster.price?.A3 || poster.price?.A4;
                return (
                  <div key={poster.id} className="p-3.5 space-y-3">
                    <div className="flex gap-3">
                      <div className="w-12 h-16 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0">
                        <img
                          src={poster.image}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://placehold.co/100x140?text=Draft';
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

                        <div className="mt-1 font-semibold text-slate-800 text-xs">
                          Base: {settings?.currencySymbol || '₹'}
                          {regPrice?.toLocaleString() || 'On Request'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
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

                      <button
                        type="button"
                        onClick={() => handlePublish(poster.id, poster.name)}
                        disabled={publishingId === poster.id}
                        className="px-3 py-1.5 text-white bg-emerald-600 active:bg-emerald-700 rounded text-xs font-bold shadow-2xs transition-colors"
                      >
                        {publishingId === poster.id ? 'Publishing...' : 'Publish Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
