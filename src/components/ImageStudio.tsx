import React, { useState, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, Flag, Sliders, ShieldAlert, CheckCircle, AlertTriangle, Maximize2, X, Image as ImageIcon, Flame } from 'lucide-react';
import { Generation, User } from '../types';
import { GenerationService } from '../lib/api';
import { ImageUploadBox } from './ImageUploadBox';
import { Storage } from '../lib/storage';

interface ImageStudioProps {
  user: User;
  initialPrompt?: string;
  onOpenBilling: () => void;
  onOpenReport: (genId: string) => void;
  onGenerationComplete: (gen: Generation) => void;
}

const DEFAULT_MODELS = [
  { id: 'Spicy AI Flux 18+ Ultra', name: 'Spicy AI Flux 18+ Ultra', desc: 'Spicy API inference gateway: unrestricted uncensored prompts, anatomical precision & 8k studio lighting', creditsCost: 1.0 },
  { id: 'Velvet Flux Ultra 18+', name: 'Velvet Flux Ultra 18+', desc: 'State-of-the-art photorealism, natural skin tones & dynamic lighting via Spicy Gateway', creditsCost: 1.0 },
  { id: 'Nocturne Photoreal XL', name: 'Nocturne Photoreal XL', desc: 'Moody noir aesthetic, cinematic shadows, high dynamic range', creditsCost: 1.0 },
  { id: 'Anime Sensual Diffusion', name: 'Anime Sensual Diffusion', desc: 'Lush 2D anime illustration, vibrant colors & clean line art', creditsCost: 1.0 },
  { id: 'Cinema Realistic 2.1', name: 'Cinema Realistic 2.1', desc: '35mm anamorphic film simulation with natural grain and bokeh', creditsCost: 1.0 },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', iconWidth: 'w-4 h-4' },
  { id: '4:3', label: '4:3 Portrait', iconWidth: 'w-4 h-5' },
  { id: '3:4', label: '3:4 Studio', iconWidth: 'w-3.5 h-5' },
  { id: '16:9', label: '16:9 Cinema', iconWidth: 'w-6 h-3.5' },
  { id: '9:16', label: '9:16 Story', iconWidth: 'w-3 h-5' },
];

const PROMPT_SUGGESTIONS = [
  'Cinematic high-contrast editorial portrait of an elegant woman with dramatic chiaroscuro studio lighting, dark velvet moody backdrop, 8k',
  'Moody neon noir night scene with a stylish futuristic character in rain-slicked city streets, deep violet reflections',
  'Atmospheric ethereal digital art of an enigmatic celestial figure bathed in moonlight and golden stardust particles',
  'Sensual black and white studio portrait with delicate natural window shadows and soft rim lighting, Leica 35mm film aesthetic',
];

export const ImageStudio: React.FC<ImageStudioProps> = ({
  user,
  initialPrompt = '',
  onOpenBilling,
  onOpenReport,
  onGenerationComplete,
}) => {
  // Dynamically load active image models configured in Admin panel
  const [availableModels, setAvailableModels] = useState(() => {
    const fromStorage = Storage.getAiModels()
      .filter((m) => m.type === 'image' && m.isActive)
      .map((m) => ({ id: m.id, name: m.displayName, desc: m.description, creditsCost: m.creditsCost }));
    return fromStorage.length > 0 ? fromStorage : DEFAULT_MODELS;
  });

  const [prompt, setPrompt] = useState(initialPrompt || PROMPT_SUGGESTIONS[0]);
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, oversaturated, low quality, artifacts, extra limbs');
  const [model, setModel] = useState(availableModels[0]?.id || DEFAULT_MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 8999999 + 1000000));
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Reference Image (Img2Img) state
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceStrength, setReferenceStrength] = useState<number>(0.65);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [currentResult, setCurrentResult] = useState<Generation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoRefundNotif, setAutoRefundNotif] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (user.credits < 1 && user.plan !== 'unlimited') {
      onOpenBilling();
      return;
    }

    setIsGenerating(true);
    setProgress(5);
    setProgressStage(referenceImage ? 'Initializing image-to-image latent conditioning...' : 'Submitting to private inference engine...');
    setErrorMessage(null);
    setAutoRefundNotif(false);
    setSavedSuccess(false);

    const result = await GenerationService.generateImage({
      prompt,
      negativePrompt,
      model,
      aspectRatio,
      seed,
      referenceImageUrl: referenceImage,
      referenceStrength,
      onProgress: (p, stage) => {
        setProgress(p);
        setProgressStage(stage);
      },
    });

    setIsGenerating(false);

    if (result.success && result.data) {
      setCurrentResult(result.data);
      onGenerationComplete(result.data);
    } else {
      setErrorMessage(result.error || 'Generation encountered an error.');
      if (result.autoRefunded) {
        setAutoRefundNotif(true);
      }
    }
  };

  const handleDownload = () => {
    if (!currentResult?.resultUrl) return;
    const a = document.createElement('a');
    a.href = currentResult.resultUrl;
    a.download = `velvet-ai-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveToHistory = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium mb-1.5">
            <span className="text-rose-400">Studio Engine</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-300">{referenceImage ? 'Image-to-Image (Img2Img)' : 'Text-to-Image Diffusion'}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-300 text-[10px] font-mono font-bold shadow-sm shadow-rose-950/40">
              <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
              <span>Spicy API Connected (18+ Uncensored)</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            High-Resolution Image Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-neutral-400">Generation Cost</div>
            <div className="text-xs font-semibold text-white font-mono">1.0 Credit / image</div>
          </div>
          <button
            onClick={onOpenBilling}
            className="px-3 py-1.5 rounded-lg bg-[#151926] hover:bg-[#1E2335] border border-neutral-800 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
          >
            Balance: <span className="text-amber-400 font-mono font-bold">{user.credits.toFixed(1)}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Generation Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. Reference Image Upload Box (ABOVE Creative Prompt as instructed) */}
          <ImageUploadBox
            referenceImage={referenceImage}
            referenceStrength={referenceStrength}
            onImageChange={(img) => setReferenceImage(img)}
            onStrengthChange={(str) => setReferenceStrength(str)}
            userId={user.id}
          />

          {/* 2. Prompt Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-neutral-200">Creative Prompt</label>
              <button
                type="button"
                onClick={() => {
                  const random = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
                  setPrompt(random);
                }}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Inspire me</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene in detail (lighting, subject, framing, mood)..."
              className="w-full p-3.5 rounded-xl bg-[#0F121C] border border-neutral-800 focus:border-rose-500 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Negative Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Negative Prompt (Elements to avoid)</span>
            </label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, distorted, oversaturated..."
              className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-neutral-800 focus:border-rose-500 text-xs text-neutral-200 focus:outline-none"
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
              <span>Diffusion Model</span>
              <span className="text-[10px] text-neutral-500">Configured via Admin Models</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableModels.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    model === m.id
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : 'border-neutral-800 bg-[#0E1017] text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="text-xs font-semibold text-white truncate">{m.name}</div>
                    {m.creditsCost && (
                      <span className="text-[10px] font-mono text-amber-400 ml-1">
                        {m.creditsCost} cr
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 line-clamp-2">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-200">Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    aspectRatio === ratio.id
                      ? 'border-rose-500 bg-rose-500/10 text-white'
                      : 'border-neutral-800 bg-[#0E1017] text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className={`border border-current rounded-sm ${ratio.iconWidth}`}></div>
                  <span className="text-[10px] font-mono whitespace-nowrap">{ratio.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Accordion */}
          <div className="border border-neutral-800 rounded-xl bg-[#0A0C13] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                <span>Advanced Pipeline Controls (Seed, CFG, Steps)</span>
              </div>
              <span className="text-[11px] text-neutral-500">{showAdvanced ? 'Hide' : 'Configure'}</span>
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-neutral-800 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Guidance Scale (CFG): <span className="text-white font-mono">{cfgScale}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={cfgScale}
                      onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Denoise Steps: <span className="text-white font-mono">{steps}</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      step="2"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span>Random Seed</span>
                    <button
                      type="button"
                      onClick={() => setSeed(Math.floor(Math.random() * 8999999 + 1000000))}
                      className="text-rose-400 hover:underline"
                    >
                      Randomize
                    </button>
                  </div>
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141824] border border-neutral-700 font-mono text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Latents ({progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {referenceImage ? 'Generate with Reference (Img2Img)' : 'Generate Image'} (1 Credit)
                </span>
              </>
            )}
          </button>

          {/* Error / Moderation Notice */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-300 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Safety / Generation Notice</span>
              </div>
              <p className="leading-relaxed">{errorMessage}</p>
              {autoRefundNotif && (
                <div className="pt-1 text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>1.0 Credit has been automatically refunded to your balance.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Result Canvas & Preview */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
            <span>Result Canvas</span>
            {currentResult && (
              <span className="text-neutral-500 font-mono text-[11px]">
                {currentResult.isImg2Img ? 'Img2Img · ' : ''}Seed: {currentResult.seed} · {currentResult.model}
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[420px] rounded-2xl border border-neutral-800 bg-[#0C0E16] overflow-hidden flex flex-col justify-center items-center relative p-3">
            {isGenerating ? (
              <div className="w-full max-w-sm p-6 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-rose-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {referenceImage ? 'Synthesizing Image-to-Image Transformation' : 'Rendering Latent Diffusion'}
                  </div>
                  <div className="text-xs text-neutral-400 font-mono">{progressStage}</div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono tabular-nums">{progress}% complete</div>
              </div>
            ) : currentResult?.resultUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-between gap-4">
                <div className="relative w-full flex-1 max-h-[500px] rounded-xl overflow-hidden group bg-black/60 flex items-center justify-center">
                  <img
                    src={currentResult.resultUrl}
                    alt={currentResult.prompt}
                    referrerPolicy="no-referrer"
                    className="max-h-[500px] w-auto max-w-full object-contain cursor-pointer"
                    onClick={() => setFullscreenImage(currentResult.resultUrl || null)}
                  />
                  <button
                    onClick={() => setFullscreenImage(currentResult.resultUrl || null)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 hover:bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {currentResult.referenceImageUrl && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-rose-400" />
                      <span>Img2Img (Strength: {currentResult.referenceStrength || 0.65})</span>
                    </div>
                  )}
                </div>

                {/* Toolbar */}
                <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2436] text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download HD</span>
                    </button>
                    <button
                      onClick={handleSaveToHistory}
                      className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${savedSuccess ? 'text-emerald-400' : 'text-neutral-400'}`} />
                      <span>{savedSuccess ? 'Saved to Vault!' : 'Save to Vault'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Re-roll with new seed"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenReport(currentResult.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Report / Flag Content"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 text-neutral-500">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-neutral-300">Ready to Synthesize</div>
                <p className="text-xs max-w-sm mx-auto text-neutral-500">
                  Upload an optional reference image above, enter your prompt, choose a model, and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
