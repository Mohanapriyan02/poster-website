import React, { useState } from 'react';
import {
  Library,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Layers,
  X,
} from 'lucide-react';
import { useCatalog } from '../../context/CatalogContext';
import { saveCollection, deleteCollection } from '../../services/api';
import { ImageUploadField } from '../../components/admin/ImageUploadField';
import type { Collection } from '../../types';

export const AdminCollections: React.FC = () => {
  const { collections, products, refreshCatalog } = useCatalog();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCollection(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setErrorMessage(null);
    setModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description || '');
    setImage(col.image || '');
    setErrorMessage(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCollection) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setErrorMessage('Collection name and slug are required.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      await saveCollection({
        id: editingCollection ? editingCollection.id : `col-${Date.now()}`,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: image.trim(),
      });

      await refreshCatalog();
      setSuccessMessage(`Collection "${name}" saved successfully.`);
      setModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save collection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (col: Collection) => {
    const assignedCount = products.filter((p) => p.collectionSlug === col.slug).length;
    if (
      !window.confirm(
        `Are you sure you want to delete collection "${col.name}"? (${assignedCount} posters currently in this collection)`
      )
    ) {
      return;
    }

    try {
      await deleteCollection(col.id);
      await refreshCatalog();
      setSuccessMessage(`Collection "${col.name}" was deleted.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete collection.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Collections ({collections.length})</h2>
          <p className="text-xs text-slate-500">
            Organise posters into thematic narrative series and gallery wall pairings.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => {
          const assignedCount = products.filter((p) => p.collectionSlug === col.slug).length;

          return (
            <div
              key={col.id}
              className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-14 bg-slate-100 rounded overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={col.image}
                      alt={col.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://placehold.co/100x120?text=Col';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{col.name}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">slug: {col.slug}</p>
                    <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      <Layers className="w-3 h-3 text-slate-500" />
                      <span>{assignedCount} posters in series</span>
                    </div>
                  </div>
                </div>

                {col.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                    {col.description}
                  </p>
                )}
              </div>

              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-mono">ID: {col.id}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                    title="Edit Collection"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(col)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCollection
                  ? `Edit Collection: ${editingCollection.name}`
                  : 'Create New Collection'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Collection Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Cinema Nostalgia"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. cinema-nostalgia"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-slate-800 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Theme and curator notes for this series..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
                />
              </div>

              <ImageUploadField
                label="Cover Image"
                value={image}
                onChange={(url) => setImage(url)}
                helperText="Backdrop image for the collection hero header"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded font-semibold shadow-xs transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
