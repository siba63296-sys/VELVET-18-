import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sliders, CheckCircle, AlertCircle, RefreshCw, Cloud } from 'lucide-react';
import { SupabaseService } from '../lib/supabase';

interface ImageUploadBoxProps {
  referenceImage: string | null;
  referenceStrength: number;
  onImageChange: (imageUrl: string | null, file?: File) => void;
  onStrengthChange: (strength: number) => void;
  userId?: string;
}

export const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  referenceImage,
  referenceStrength,
  onImageChange,
  onStrengthChange,
  userId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setUploadError(null);

    // Validate size (max 10MB)
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`File exceeds maximum size of ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Validate format (jpg, png, webp)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, and WEBP formats are accepted.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Supabase Storage bucket 'user-uploads'
      const { url: supabasePublicUrl, error: uploadErr } = await SupabaseService.uploadReferenceImage(file, userId);
      
      if (uploadErr) {
        console.warn('Supabase storage fallback warning:', uploadErr);
      }

      // 2. Read local data URL as immediate high-res preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const localPreview = e.target?.result as string;
        const finalUrl = supabasePublicUrl || localPreview;
        setStoragePath(`user-uploads/${file.name}`);
        onImageChange(finalUrl, file);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing file');
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl border border-neutral-800 bg-[#0B0D15]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>Reference Image (Optional — Image-to-Image)</span>
        </label>
        {referenceImage && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60 font-mono font-medium">
            IMG2IMG ACTIVE
          </span>
        )}
      </div>

      {!referenceImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-500 bg-rose-500/10'
              : 'border-neutral-800 hover:border-neutral-700 bg-[#0E1018]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-3">
              <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
              <p className="text-xs font-semibold text-neutral-200">
                Storing in Supabase Storage <span className="text-rose-400 font-mono">user-uploads</span>...
              </p>
              <p className="text-[11px] text-neutral-500">Preparing high-precision latent conditioning</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400">
                <Upload className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-300">
                  Click to upload or drag & drop reference image
                </p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Supports JPG, PNG, WEBP (Max 10MB) · Stores in Supabase <code className="text-neutral-400">user-uploads</code>
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-black flex items-center justify-center max-h-44 group">
            <img
              src={referenceImage}
              alt="Reference"
              className="max-h-44 w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white hover:bg-rose-600 transition-colors shadow-lg cursor-pointer"
              title="Remove reference image"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300 flex items-center gap-1.5 border border-neutral-700">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Reference Attached · Supabase <code className="text-rose-300">user-uploads</code></span>
            </div>
          </div>

          {/* Reference Strength Slider */}
          <div className="p-3 rounded-lg bg-[#121520] border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-neutral-300 flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-rose-400" />
                <span>Reference Strength (Img2Img Fidelity)</span>
              </span>
              <span className="font-mono text-rose-400 font-bold tabular-nums">
                {referenceStrength.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={referenceStrength}
              onChange={(e) => onStrengthChange(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-neutral-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>0.1 (Subtle composition hint)</span>
              <span>0.5 (Balanced)</span>
              <span>1.0 (Strict likeness adherence)</span>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
