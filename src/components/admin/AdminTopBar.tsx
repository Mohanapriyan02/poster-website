import React, { useState } from 'react';
import { Menu, Plus, RefreshCw, ExternalLink, ShieldCheck, AlertCircle, CloudUpload, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import { syncToGitHub } from '../../services/api';

interface AdminTopBarProps {
  onToggleMobile: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onToggleMobile }) => {
  const { isBackendOnline, refreshCatalog, loading } = useCatalog();
  const location = useLocation();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncToGitHub = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await syncToGitHub();
      setSyncMessage(res.message);
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to sync with GitHub.');
    } finally {
      setSyncing(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard Overview';
    if (path === '/admin/posters') return 'Poster Catalogue';
    if (path === '/admin/posters/new') return 'Add New Poster';
    if (path.startsWith('/admin/posters/edit')) return 'Edit Poster';
    if (path === '/admin/drafts') return 'Draft Posters';
    if (path === '/admin/categories') return 'Category Management';
    if (path === '/admin/collections') return 'Collection Management';
    if (path === '/admin/settings') return 'Site Settings & Backups';
    if (path.startsWith('/admin/preview')) return 'Artwork Preview Mode';
    return 'Admin Console';
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden text-slate-500 hover:text-slate-800 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight leading-tight truncate max-w-[160px] xs:max-w-[200px] sm:max-w-none">
            {getPageTitle()}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Local Management &middot; Real-time JSON persistence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Connection status pill */}
        <div
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isBackendOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={
            isBackendOnline
              ? 'Connected to local Express server at http://127.0.0.1:5001'
              : 'Local server not detected; operating with bundled fallback files'
          }
        >
          {isBackendOnline ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>127.0.0.1:5001 Online</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Backend Offline</span>
            </>
          )}
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => refreshCatalog()}
          disabled={loading}
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          title="Reload catalogue from disk"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Sync with GitHub 1-Click Action */}
        <button
          type="button"
          onClick={handleSyncToGitHub}
          disabled={syncing || !isBackendOnline}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
          title="Push local catalogue changes directly to GitHub"
        >
          {syncing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Pushing...</span>
            </>
          ) : (
            <>
              <CloudUpload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync to GitHub</span>
              <span className="sm:hidden">Push</span>
            </>
          )}
        </button>

        {/* Add Poster Quick Action */}
        <Link
          to="/admin/posters/new"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Poster</span>
        </Link>
      </div>

      {/* Sync Success Floating Toast */}
      {syncMessage && (
        <div className="fixed top-14 right-4 z-50 bg-emerald-900 text-emerald-100 border border-emerald-600 px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}
    </header>
  );
};
