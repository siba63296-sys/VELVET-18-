import React, { useState } from 'react';
import { Sparkles, Video, MessageSquare, Download, Trash2, RefreshCw, Flag, Search, Filter, Maximize2, X } from 'lucide-react';
import { Generation } from '../types';
import { Storage } from '../lib/storage';

interface HistoryViewProps {
  generations: Generation[];
  onRegenerate: (prompt: string, type: 'image' | 'video') => void;
  onOpenReport: (genId: string) => void;
  onDelete: (genId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  generations,
  onRegenerate,
  onOpenReport,
  onDelete,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered = generations.filter((gen) => {
    if (filterType !== 'all' && gen.type !== filterType) return false;
    if (searchQuery.trim() && !gen.prompt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleDownload = (url?: string) => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `velvet-vault-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-1">
            <span>Private Storage Vault</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{generations.length} items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Generation Vault History
          </h1>
        </div>

        {/* Filter controls compliant with zero-pill interactive segmented tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#121520] border border-neutral-800 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#22273B] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Vault Items
          </button>
          <button
            onClick={() => setFilterType('image')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'image'
                ? 'bg-[#22273B] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>Images</span>
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'video'
                ? 'bg-[#22273B] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Video className="w-3 h-3 text-amber-400" />
            <span>Videos</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter your history by prompt keywords..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F17] border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-neutral-800 bg-[#0C0E16] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Generations Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search filters, or head over to the Image or Video Studio to synthesize something new.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((gen) => (
            <div
              key={gen.id}
              className="rounded-2xl border border-neutral-800 bg-[#0E1017] overflow-hidden group hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                {gen.resultUrl ? (
                  <img
                    src={gen.resultUrl}
                    alt={gen.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                    onClick={() => setSelectedImage(gen.resultUrl || null)}
                  />
                ) : (
                  <div className="text-neutral-500 text-xs font-mono">No preview</div>
                )}

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1">
                  {gen.type === 'image' ? (
                    <Sparkles className="w-3 h-3 text-rose-400" />
                  ) : (
                    <Video className="w-3 h-3 text-amber-400" />
                  )}
                  <span className="capitalize">{gen.type}</span>
                </div>

                <button
                  onClick={() => setSelectedImage(gen.resultUrl || null)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Expand"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Details & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="font-mono text-neutral-300">{gen.model}</span>
                    <span className="tabular-nums font-mono">
                      {new Date(gen.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {gen.prompt}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(gen.resultUrl)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRegenerate(gen.prompt, gen.type === 'video' ? 'video' : 'image')}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Re-synthesize prompt"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenReport(gen.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Report generation"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onDelete(gen.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Vault item full"
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
