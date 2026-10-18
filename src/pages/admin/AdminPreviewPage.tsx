import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { toggleProductStatus } from '../../services/api';
import { buildPosterEnquiryUrl, SIZE_DIMENSIONS, FRAME_LABELS } from '../../utils/whatsapp';
import type { PosterSize, FrameStyle } from '../../types';

export const AdminPreviewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, settings, refreshCatalog } = useCatalog();

  // Find product by slug among ALL products (including drafts)
  const poster = products.find((p) => p.slug.toLowerCase() === slug?.toLowerCase());

  const [selectedSize, setSelectedSize] = useState<PosterSize>(poster?.sizes?.[0] || 'A3');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('unframed');
  const [viewMode, setViewMode] = useState<'poster' | 'livingRoom' | 'bedroom' | 'studio'>('poster');
  const [copied, setCopied] = useState(false);
  const [statusToggling, setStatusToggling] = useState(false);

  if (!poster) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Poster Not Found</h2>
        <p className="text-xs text-slate-500">
          No poster was found matching the slug &quot;{slug}&quot;.
        </p>
        <Link
          to="/admin/posters"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Posters</span>
        </Link>
      </div>
    );
  }

  const isDraft = poster.status === 'draft';
  const currentPrice = poster.price?.[selectedSize] || poster.regularPrice;

  const handleToggleStatus = async () => {
    setStatusToggling(true);
    try {
      await toggleProductStatus(poster.id);
      await refreshCatalog();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setStatusToggling(false);
    }
  };

  const enquiryUrl = buildPosterEnquiryUrl(poster, selectedSize, frameStyle, settings);

  return (
    <div className="space-y-6">
      {/* Admin Preview Warning Banner */}
      <div className="bg-slate-900 text-white p-3 sm:p-3.5 rounded-lg shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isDraft ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <div>
            <div className="text-xs font-bold flex items-center gap-2 flex-wrap">
              <span>ADMIN PREVIEW MODE</span>
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold ${
                  isDraft ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {isDraft ? 'Draft (Hidden)' : 'Published (Public)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Testing artwork layout &amp; WhatsApp routing before visitors see it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to="/admin/posters"
            className="flex-1 sm:flex-none text-center px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            All Posters
          </Link>
          <Link
            to={`/admin/posters/edit/${poster.id}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={statusToggling}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded transition-colors ${
              isDraft
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {statusToggling ? 'Updating...' : isDraft ? 'Publish' : 'To Draft'}
          </button>
        </div>
      </div>

      {/* Embedded Showcase Detail Page Experience */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 sm:p-10 space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Artwork Viewport */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full bg-[#F2EDE4] p-4 sm:p-6 flex items-center justify-center border border-slate-200">
              <div className="relative w-full h-full shadow-2xl bg-white overflow-hidden">
                <img
                  src={
                    viewMode === 'poster'
                      ? poster.image
                      : poster.secondaryImage || poster.image
                  }
                  alt={poster.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Discount Badge */}
              {poster.discount?.enabled && poster.discount.salePrice !== undefined && (
                <div className="absolute top-8 left-8 bg-[#C44536] text-white text-[11px] uppercase tracking-widest px-2.5 py-1 font-bold shadow-md">
                  {poster.discount.type === 'percentage'
                    ? `${poster.discount.value}% OFF`
                    : `Save ${settings.currencySymbol}${poster.discount.value}`}
                </div>
              )}
            </div>

            {/* View switcher */}
            {poster.secondaryImage && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('poster')}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${
                    viewMode === 'poster'
                      ? 'border-slate-800 bg-slate-900 text-white'
                      : 'border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  Artwork Focus
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('livingRoom')}
                  className={`px-3 py-1.5 text-xs font-medium rounded border ${
                    viewMode === 'livingRoom'
                      ? 'border-slate-800 bg-slate-900 text-white'
                      : 'border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  Wall Mockup View
                </button>
              </div>
            )}
          </div>

          {/* Right: Info, Sizing, and WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                {poster.category} &middot; {poster.collection}
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-slate-900 mt-1">
                {poster.name}
              </h1>
              {poster.tagline && (
                <p className="text-xs text-slate-500 italic mt-1 font-light">&ldquo;{poster.tagline}&rdquo;</p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                Listed Price for {selectedSize} Print:
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                {poster.discount?.enabled &&
                poster.discount.salePrice !== undefined &&
                currentPrice &&
                poster.discount.salePrice < currentPrice ? (
                  <>
                    <span className="text-2xl font-bold text-rose-600 font-mono">
                      {settings.currencySymbol}
                      {poster.discount.salePrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {settings.currencySymbol}
                      {currentPrice.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      {poster.discount.type === 'percentage'
                        ? `${poster.discount.value}% OFF`
                        : `Save ${settings.currencySymbol}${poster.discount.value}`}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {currentPrice
                      ? `${settings.currencySymbol}${currentPrice.toLocaleString()}`
                      : 'Price on Request'}
                  </span>
                )}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Dimensions:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {poster.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2.5 rounded border text-left text-xs transition-colors ${
                      selectedSize === sz
                        ? 'border-slate-900 bg-slate-900 text-white font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div>{sz} Format</div>
                    <div className="text-[10px] opacity-75">{SIZE_DIMENSIONS[sz]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Styles */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Select Framing Option:
              </label>
              <div className="space-y-1.5">
                {(['unframed', 'black-wood', 'natural-oak', 'white-gallery'] as FrameStyle[]).map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrameStyle(f)}
                      className={`w-full p-2 rounded border text-left text-xs transition-colors ${
                        frameStyle === f
                          ? 'border-slate-900 bg-slate-50 font-bold text-slate-900'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {FRAME_LABELS[f]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* WhatsApp Enquiry Button */}
            <div className="space-y-2 pt-2">
              <a
                href={enquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 px-4 rounded text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Test WhatsApp Enquiry Link</span>
              </a>
              <p className="text-[11px] text-slate-400 text-center">
                Opens <code>wa.me/{settings.whatsappNumber}</code> with pre-filled poster name, ID, and selected size.
              </p>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
              <h4 className="font-bold text-slate-800">Curator Description:</h4>
              <p className="leading-relaxed font-light">{poster.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
