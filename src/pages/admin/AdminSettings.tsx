import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Database,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { saveSettings, getBackups, triggerBackup, restoreBackup } from '../../services/api';
import type { SiteConfig } from '../../config/site';

export const AdminSettings: React.FC = () => {
  const { settings, refreshCatalog, isBackendOnline } = useCatalog();

  // Settings form state
  const [formData, setFormData] = useState<SiteConfig>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Backup state
  const [backups, setBackups] = useState<Array<{ name: string; createdAt: string }>>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [backupActionStatus, setBackupActionStatus] = useState<string | null>(null);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const loadBackups = async () => {
    if (!isBackendOnline) return;
    setLoadingBackups(true);
    try {
      const list = await getBackups();
      setBackups(list);
    } catch (err) {
      console.warn('Could not load backups:', err);
    } finally {
      setLoadingBackups(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, [isBackendOnline]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      await saveSettings(formData);
      await refreshCatalog();
      setSettingsMessage({
        type: 'success',
        text: 'Website configuration saved to src/data/site.json successfully.',
      });
      loadBackups();
      setTimeout(() => setSettingsMessage(null), 3500);
    } catch (err: any) {
      setSettingsMessage({
        type: 'error',
        text: err.message || 'Failed to save website configuration.',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackupActionStatus('Creating backup snapshot...');
    try {
      const msg = await triggerBackup();
      setBackupActionStatus(msg);
      await loadBackups();
      setTimeout(() => setBackupActionStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to create backup.');
      setBackupActionStatus(null);
    }
  };

  const handleRestore = async (backupName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to restore the entire catalogue from "${backupName}"?\n\nA safety snapshot will be created before restoring.`
      )
    ) {
      return;
    }

    setBackupActionStatus(`Restoring from ${backupName}...`);
    try {
      const msg = await restoreBackup(backupName);
      await refreshCatalog();
      await loadBackups();
      setBackupActionStatus(msg);
      setTimeout(() => setBackupActionStatus(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to restore backup.');
      setBackupActionStatus(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900">Website Settings &amp; Local Backups</h2>
        <p className="text-xs text-slate-500">
          Configure global website metadata, WhatsApp direct routing, and manage local JSON snapshots.
        </p>
      </div>

      {settingsMessage && (
        <div
          className={`p-3.5 rounded-md text-xs font-medium flex items-center gap-2 ${
            settingsMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {settingsMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{settingsMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Brand Identity &amp; Editorial Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={formData.announcement}
              onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Displayed prominently at the top of every public showcase page.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Inquiries Routing */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>WhatsApp Enquiry Integration</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              wa.me Pre-filled Routing
            </span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp Business Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="e.g. 919876543210"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Include country code without leading &apos;+&apos;, dashes, or spaces (e.g.{' '}
              <code>919876543210</code> for India, <code>12125551234</code> for US).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default General Inquiry Message
            </label>
            <textarea
              rows={2}
              value={formData.defaultEnquiryMessage}
              onChange={(e) =>
                setFormData({ ...formData, defaultEnquiryMessage: e.target.value })
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Studio Email Address
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Studio Location / Atelier Address
              </label>
              <input
                type="text"
                value={formData.studioLocation}
                onChange={(e) => setFormData({ ...formData, studioLocation: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram</label>
              <input
                type="text"
                value={formData.socials?.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pinterest</label>
              <input
                type="text"
                value={formData.socials?.pinterest || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, pinterest: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Twitter / X</label>
              <input
                type="text"
                value={formData.socials?.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'Saving Configuration...' : 'Save Settings to Disk'}</span>
          </button>
        </div>
      </form>

      {/* Snapshot Backups & Restore Section */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Catalogue Snapshots &amp; Backups</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated safety copies stored in <code>backups/</code> directory before mutations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded text-xs font-semibold transition-colors shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Create Snapshot Now</span>
          </button>
        </div>

        {backupActionStatus && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded text-xs font-medium">
            {backupActionStatus}
          </div>
        )}

        {/* Backups List */}
        <div className="space-y-2">
          {loadingBackups ? (
            <p className="text-xs text-slate-400 py-4">Checking backup directory...</p>
          ) : backups.length === 0 ? (
            <p className="text-xs text-slate-500 py-3">
              No previous backups found in <code>backups/</code>. Click &quot;Create Snapshot Now&quot; to make an initial archive.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {backups.map((bk) => (
                <div
                  key={bk.name}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-slate-50 rounded transition-colors text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-semibold text-slate-800">{bk.name}</span>
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(bk.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(bk.name)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Restore</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
