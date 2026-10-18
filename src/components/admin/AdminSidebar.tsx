import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  FolderTree,
  Library,
  FileEdit,
  Settings,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { products, settings, isBackendOnline } = useCatalog();

  const draftsCount = products.filter((p) => p.status === 'draft').length;
  const totalCount = products.length;

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'All Posters', to: '/admin/posters', icon: Layers, badge: totalCount },
    { label: 'Add New Poster', to: '/admin/posters/new', icon: PlusCircle },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Collections', to: '/admin/collections', icon: Library },
    {
      label: 'Drafts',
      to: '/admin/drafts',
      icon: FileEdit,
      badge: draftsCount,
      badgeColor: draftsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
    },
    { label: 'Settings & Backups', to: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#181E29] text-slate-200 border-r border-slate-800 w-64 select-none">
      {/* Brand / Admin Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white tracking-wide text-sm uppercase font-mono">
              CMS Console
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[190px]">
            {settings?.brandName || 'LUMINA & ARCHIVE'}
          </p>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 font-mono">
          Catalogue Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Backend Status indicator */}
      <div className="p-3 mx-3 mb-3 rounded-md bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            Local API (127.0.0.1:5001)
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
            }`}
            title={isBackendOnline ? 'Backend Online' : 'Backend Offline'}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {isBackendOnline ? 'Connected to local JSON store' : 'Using bundled fallback store'}
        </p>
      </div>

      {/* View Public Website Link */}
      <div className="p-3 border-t border-slate-800">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>View Public Website</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
