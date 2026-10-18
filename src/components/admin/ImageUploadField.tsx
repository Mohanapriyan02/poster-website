import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '../../services/api';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Ensure the backend server is running.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Local Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
              mode === 'url'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            id={`file-input-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`file-input-${label.replace(/\s+/g, '-')}`}
            className="flex-1 cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50 hover:bg-slate-100/70 text-slate-600 py-3 px-4 rounded text-xs font-medium transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                <span>Saving to local disk (public/images/posters/)...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Choose local image (JPG, PNG, WebP)</span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://... or /images/posters/..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:border-slate-800 focus:outline-none"
            />
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Preview Box */}
      {value && (
        <div className="relative mt-2 p-2 border border-slate-200 rounded bg-slate-50 flex items-center gap-3">
          <div className="w-14 h-18 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-300">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://placehold.co/100x140?text=Preview';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-800 truncate">{value}</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Image linked</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
