import React, { useState, useEffect, useRef } from 'react';
import { Video, Sparkles, Play, Pause, RotateCcw, Download, Flag, Upload, Sliders, AlertTriangle, CheckCircle, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import { Generation, User } from '../types';
import { GenerationService } from '../lib/api';
import { SupabaseService } from '../lib/supabase';
import { Storage } from '../lib/storage';

interface VideoStudioProps {
  user: User;
  onOpenBilling: () => void;
  onOpenReport: (genId: string) => void;
  onGenerationComplete: (gen: Generation) => void;
}

const DEFAULT_VIDEO_MODELS = [
  { id: 'Velvet Motion SVD', name: 'Velvet Motion SVD', desc: 'Optimized for sensual fluidity, cloth dynamics & natural breathing motion' },
  { id: 'AnimateDiff Pro 18+', name: 'AnimateDiff Pro 18+', desc: 'High coherence stylization, expressive lighting & anime movements' },
  { id: 'Luma Nocturne Cinematic', name: 'Luma Nocturne Cinematic', desc: 'Photorealistic 35mm optical depth, slow pans & cinematic atmospheric camera' },
];

const CAMERA_MOTIONS = [
  'Slow Orbit 360',
  'Gentle Zoom In',
  'Horizontal Pan Left',
  'Horizontal Pan Right',
  'Cinematic Dolly Crane',
  'Static Subtle Breathing',
];

export const VideoStudio: React.FC<VideoStudioProps> = ({
  user,
  onOpenBilling,
  onOpenReport,
  onGenerationComplete,
}) => {
  // Load video models dynamically from Storage (Admin Models)
  const [videoModels, setVideoModels] = useState(() => {
    const fromStorage = Storage.getAiModels()
      .filter((m) => m.type === 'video' && m.isActive)
      .map((m) => ({ id: m.id, name: m.displayName, desc: m.description }));
    return fromStorage.length > 0 ? fromStorage : DEFAULT_VIDEO_MODELS;
  });

  const [prompt, setPrompt] = useState('Slow cinematic close-up of a glamorous character turning toward the camera under warm amber neon rain');
  const [model, setModel] = useState(videoModels[0]?.id || DEFAULT_VIDEO_MODELS[0].id);
  const [duration, setDuration] = useState(5);
  const [motionIntensity, setMotionIntensity] = useState(6);
  const [cameraMotion, setCameraMotion] = useState(CAMERA_MOTIONS[0]);
  const [sourceImage, setSourceImage] = useState<string>('/src/assets/images/hero_cinematic_portrait_1791715741768.jpg');

  // Custom keyframe upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);
  const [isUploadingKeyframe, setIsUploadingKeyframe] = useState<boolean>(false);
  const [keyframeUploadSuccess, setKeyframeUploadSuccess] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [currentResult, setCurrentResult] = useState<Generation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentResult) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= (currentResult.duration || 5)) return 0;
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentResult]);

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingKeyframe(true);
      setKeyframeUploadSuccess(false);

      try {
        const { url: supabasePublicUrl } = await SupabaseService.uploadReferenceImage(file, user.id);
        const reader = new FileReader();
        reader.onload = (uploadEv) => {
          const localPreview = uploadEv.target?.result as string;
          const finalUrl = supabasePublicUrl || localPreview;
          setCustomUploadedImage(finalUrl);
          setSourceImage(finalUrl);
          setIsUploadingKeyframe(false);
          setKeyframeUploadSuccess(true);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsUploadingKeyframe(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (user.credits < 5 && user.plan !== 'unlimited') {
      onOpenBilling();
      return;
    }

    setIsGenerating(true);
    setProgress(5);
    setProgressStage('Initializing temporal diffusion pipeline...');
    setErrorMessage(null);

    const result = await GenerationService.generateVideo({
      prompt,
      model,
      duration,
      motionIntensity,
      cameraMotion,
      sourceImageUrl: sourceImage,
      onProgress: (p, stage) => {
        setProgress(p);
        setProgressStage(stage);
      },
    });

    setIsGenerating(false);

    if (result.success && result.data) {
      setCurrentResult(result.data);
      setPlaybackTime(0);
      setIsPlaying(true);
      onGenerationComplete(result.data);
    } else {
      setErrorMessage(result.error || 'Video generation failed.');
    }
  };

  const handleDownload = () => {
    alert('Simulating MP4 download: High-bitrate 1080p video stream packaged.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
            <span>Video Motion Engine</span>
            <span aria-hidden="true">·</span>
            <span>Image-to-Video & Text-to-Video</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Cinematic Motion Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-neutral-400">Generation Cost</div>
            <div className="text-xs font-semibold text-white font-mono">5.0 Credits / video</div>
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
        {/* Left Column Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Source Image Keyframe Upload & Picker */}
          <div className="space-y-3 p-4 rounded-xl border border-neutral-800 bg-[#0A0C13]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-200 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Source Keyframe Image</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Custom Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCustomFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-700 bg-black shrink-0 relative group">
                <img
                  src={sourceImage}
                  alt="Source"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="text-xs text-neutral-200 font-medium">
                  {customUploadedImage ? 'Custom Uploaded Keyframe' : 'Selected Preset Keyframe'}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setSourceImage('/src/assets/images/hero_cinematic_portrait_1791715741768.jpg')}
                    className="text-neutral-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Velvet Portrait
                  </button>
                  <span className="text-neutral-600">·</span>
                  <button
                    type="button"
                    onClick={() => setSourceImage('/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg')}
                    className="text-neutral-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Neon Noir
                  </button>
                  <span className="text-neutral-600">·</span>
                  <button
                    type="button"
                    onClick={() => setSourceImage('/src/assets/images/showcase_artistic_fantasy_1791715776608.jpg')}
                    className="text-neutral-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Celestial Art
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-200">Motion Description Prompt</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the movement, lighting changes, camera trajectory..."
              className="w-full p-3.5 rounded-xl bg-[#0F121C] border border-neutral-800 focus:border-rose-500 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
              <span>Temporal Motion Model</span>
              <span className="text-[10px] text-neutral-500">Configured via Admin Models</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {videoModels.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    model === m.id
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-neutral-800 bg-[#0E1017] text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-white mb-0.5">{m.name}</div>
                  <div className="text-[10px] text-neutral-400 line-clamp-2">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Camera Motion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`py-2 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      duration === sec
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-neutral-800 bg-[#0E1017] text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">Camera Motion</label>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F121C] border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {CAMERA_MOTIONS.map((cm) => (
                  <option key={cm} value={cm}>
                    {cm}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motion Intensity Slider */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-[#0A0C13] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-300">Motion Magnitude</span>
              <span className="font-mono text-amber-400 font-bold">{motionIntensity} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={motionIntensity}
              onChange={(e) => setMotionIntensity(parseInt(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-500">
              <span>Subtle breathing & micro-moves</span>
              <span>High kinetic transformation</span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Temporal Frames ({progress}%)...</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Generate Video (5 Credits)</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-300 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Video Generation Notice</span>
              </div>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Right Column Video Canvas */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="text-xs font-semibold text-neutral-300 mb-2 flex items-center justify-between">
            <span>Video Motion Viewport</span>
            {currentResult && (
              <span className="text-neutral-500 font-mono text-[11px]">
                {currentResult.duration}s @ 24fps · {cameraMotion}
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[420px] rounded-2xl border border-neutral-800 bg-[#0C0E16] overflow-hidden flex flex-col justify-center items-center relative p-3">
            {isGenerating ? (
              <div className="w-full max-w-sm p-6 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                  <Video className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">Rendering Video Interpolation</div>
                  <div className="text-xs text-neutral-400 font-mono">{progressStage}</div>
                </div>
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-rose-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono tabular-nums">{progress}% complete</div>
              </div>
            ) : currentResult?.resultUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-between gap-4">
                <div className="relative w-full flex-1 max-h-[480px] rounded-xl overflow-hidden group bg-black flex items-center justify-center">
                  <img
                    src={currentResult.resultUrl}
                    alt="Video playback"
                    referrerPolicy="no-referrer"
                    className={`max-h-[480px] w-full object-cover transition-transform duration-1000 ${
                      isPlaying ? 'scale-105 filter brightness-105' : 'scale-100'
                    }`}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>24 FPS LIVE RENDER</span>
                  </div>

                  {/* Play / Pause overlay */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-black/70 text-white backdrop-blur-md">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </div>
                  </button>

                  {/* Timeline bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-amber-400"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-100"
                        style={{
                          width: `${(playbackTime / (currentResult.duration || 5)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-300 tabular-nums">
                      {playbackTime.toFixed(1)}s / {currentResult.duration}s
                    </span>
                  </div>
                </div>

                {/* Video action bar */}
                <div className="w-full flex items-center justify-between pt-2 border-t border-neutral-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1E2436] text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </button>
                    <button
                      onClick={() => setPlaybackTime(0)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restart</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenReport(currentResult.id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Report / Flag Content"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3 text-neutral-500">
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-neutral-300">Motion Stage Ready</div>
                <p className="text-xs max-w-sm mx-auto text-neutral-500">
                  Upload a keyframe image or pick a preset, then choose duration and camera motion to generate video.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
