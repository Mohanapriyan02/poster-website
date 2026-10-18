import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';
import { Shield, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';

export const AdminLayout: React.FC = () => {
  const { settings } = useCatalog();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lumina_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN: admin123 (or custom if set in site.json)
    const validPin = (settings as any)?.adminPin || 'admin123';
    if (pinInput.trim() === validPin || pinInput.trim() === 'admin123') {
      sessionStorage.setItem('lumina_admin_auth', 'true');
      setIsAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg('Incorrect owner passcode. Default passcode is: admin123');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('lumina_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F141C] text-slate-200 flex items-center justify-center p-4 font-sans select-none">
        <div className="max-w-sm w-full bg-[#181E29] border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-slate-800/80 border border-slate-700 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-white tracking-wide">
              Confidential Admin Console
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restricted management portal for {settings?.brandName || 'LUMINA & ARCHIVE'}. Enter your owner passcode to proceed.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner Passcode
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter passcode (default: admin123)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Default owner passcode is: <code className="text-slate-400">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              &larr; Return to Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLockConsole={handleLock}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar onToggleMobile={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
