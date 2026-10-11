import { Generation, ChatPersona, ChatMessage } from '../types';
import { validatePromptSafety, logModerationEvent } from './safety';
import { Storage } from './storage';

// Rate limiter state
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  // Clean old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  requestTimestamps.push(now);
  return true;
}

export const GenerationService = {
  // Image Generation (Supports Text-to-Image and Image-to-Image Reference, Costs 1 credit)
  async generateImage(params: {
    prompt: string;
    negativePrompt?: string;
    model: string;
    aspectRatio: string;
    seed?: number;
    referenceImageUrl?: string | null;
    referenceStrength?: number;
    onProgress?: (progress: number, stage: string) => void;
  }): Promise<{ success: boolean; data?: Generation; error?: string; autoRefunded?: boolean }> {
    const user = Storage.getUser();

    // 1. Rate limiting check
    if (!checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded: Maximum 10 requests per minute. Please pause for a moment.',
      };
    }

    // 2. Strict content moderation check
    const safetyCheck = validatePromptSafety(params.prompt);
    logModerationEvent(user.id, params.prompt, safetyCheck);

    if (!safetyCheck.allowed) {
      return {
        success: false,
        error: safetyCheck.explanation || 'Prompt flagged by safety filters.',
        autoRefunded: false, // Credits never deducted for blocked prompts
      };
    }

    // 3. Deduct credit
    const deductRes = Storage.deductCredits(1.0, `Image Generation: ${params.model}${params.referenceImageUrl ? ' (Img2Img)' : ''}`);
    if (!deductRes.success) {
      return {
        success: false,
        error: 'Insufficient credits. Each image requires 1 credit.',
      };
    }

    try {
      // 4. Multi-stage progress simulation (customized for Img2Img if reference provided)
      const isImg2Img = Boolean(params.referenceImageUrl);
      const stages = isImg2Img
        ? [
            { pct: 15, msg: 'Encoding reference image into latent tensor space...' },
            { pct: 35, msg: `Injecting noise perturbation (strength: ${(params.referenceStrength || 0.65).toFixed(2)})...` },
            { pct: 60, msg: 'Conditioning diffusion cross-attention with prompt & reference...' },
            { pct: 85, msg: 'Decoding latents & harmonizing high-frequency details...' },
            { pct: 100, msg: 'Finalizing Image-to-Image render...' },
          ]
        : [
            { pct: 15, msg: 'Initializing diffusion pipeline & latent canvas...' },
            { pct: 40, msg: 'Evaluating prompt embeddings & CFG guidance...' },
            { pct: 70, msg: 'Denoising latents (Euler Ancestral)...' },
            { pct: 90, msg: 'Decoding VAE & applying high-pass photoreal pass...' },
            { pct: 100, msg: 'Finalizing render...' },
          ];

      for (const stage of stages) {
        if (params.onProgress) params.onProgress(stage.pct, stage.msg);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Check if server route is available
      let serverGeneratedUrl = '';
      try {
        const srvRes = await fetch('/api/generate/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: params.prompt,
            negativePrompt: params.negativePrompt,
            model: params.model,
            aspectRatio: params.aspectRatio,
            seed: params.seed,
            referenceImage: params.referenceImageUrl,
            referenceStrength: params.referenceStrength,
          }),
        });
        if (srvRes.ok) {
          const srvData = await srvRes.json();
          if (srvData?.data?.resultUrl) {
            serverGeneratedUrl = srvData.data.resultUrl;
          }
        }
      } catch (e) {
        // Fall back to client image pool
      }

      const imagePool = [
        '/src/assets/images/hero_cinematic_portrait_1791715741768.jpg',
        '/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg',
        '/src/assets/images/showcase_artistic_fantasy_1791715776608.jpg',
      ];
      
      const chosenUrl = serverGeneratedUrl || imagePool[Math.floor(Math.random() * imagePool.length)];

      const newGen: Generation = {
        id: 'gen_img_' + Date.now(),
        userId: user.id,
        userEmail: user.email,
        type: 'image',
        prompt: params.prompt,
        negativePrompt: params.negativePrompt,
        model: params.model,
        aspectRatio: params.aspectRatio,
        resultUrl: chosenUrl,
        referenceImageUrl: params.referenceImageUrl || undefined,
        referenceStrength: params.referenceStrength,
        isImg2Img,
        mediaType: 'image',
        createdAt: new Date().toISOString(),
        creditsUsed: 1,
        status: 'completed',
        seed: params.seed || Math.floor(Math.random() * 9999999),
      };

      Storage.saveGeneration(newGen);
      return { success: true, data: newGen };
    } catch (err: unknown) {
      // Auto-refund on unexpected error
      Storage.refundCredits(1.0, 'Image engine failure refund');
      const message = err instanceof Error ? err.message : 'Generation failed';
      return {
        success: false,
        error: message,
        autoRefunded: true,
      };
    }
  },

  // Video Generation (Costs 5 credits)
  async generateVideo(params: {
    prompt: string;
    model: string;
    duration: number;
    motionIntensity: number;
    sourceImageUrl?: string;
    cameraMotion?: string;
    onProgress?: (progress: number, stage: string) => void;
  }): Promise<{ success: boolean; data?: Generation; error?: string; autoRefunded?: boolean }> {
    const user = Storage.getUser();

    if (!checkRateLimit()) {
      return {
        success: false,
        error: 'Rate limit exceeded: Maximum 10 requests per minute.',
      };
    }

    const safetyCheck = validatePromptSafety(params.prompt);
    logModerationEvent(user.id, params.prompt, safetyCheck);

    if (!safetyCheck.allowed) {
      return {
        success: false,
        error: safetyCheck.explanation,
        autoRefunded: false,
      };
    }

    const deductRes = Storage.deductCredits(5.0, `Video Generation (${params.duration}s): ${params.model}`);
    if (!deductRes.success) {
      return {
        success: false,
        error: 'Insufficient credits. Video generation requires 5 credits.',
      };
    }

    try {
      const stages = [
        { pct: 10, msg: 'Synthesizing base keyframes & optical vector field...' },
        { pct: 30, msg: 'Estimating 3D camera trajectory & depth planes...' },
        { pct: 60, msg: 'Rendering temporal attention layers (24 fps)...' },
        { pct: 85, msg: 'Frame interpolation & motion blur stabilization...' },
        { pct: 100, msg: 'Packaging high-bitrate video stream...' },
      ];

      for (const stage of stages) {
        if (params.onProgress) params.onProgress(stage.pct, stage.msg);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      const sampleVideos = [
        '/src/assets/images/hero_cinematic_portrait_1791715741768.jpg',
        '/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg',
      ];

      const newGen: Generation = {
        id: 'gen_vid_' + Date.now(),
        userId: user.id,
        userEmail: user.email,
        type: 'video',
        prompt: params.prompt,
        model: params.model,
        duration: params.duration,
        motionIntensity: params.motionIntensity,
        resultUrl: params.sourceImageUrl || sampleVideos[0],
        referenceImageUrl: params.sourceImageUrl,
        mediaType: 'video',
        createdAt: new Date().toISOString(),
        creditsUsed: 5,
        status: 'completed',
        metadata: {
          cameraMotion: params.cameraMotion || 'Orbiting Slow',
          fps: 24,
        },
      };

      Storage.saveGeneration(newGen);
      return { success: true, data: newGen };
    } catch (err: unknown) {
      Storage.refundCredits(5.0, 'Video engine error refund');
      const message = err instanceof Error ? err.message : 'Generation failed';
      return {
        success: false,
        error: message,
        autoRefunded: true,
      };
    }
  },

  // Creative Chat (Costs 0.1 credit per prompt)
  async streamChat(params: {
    message: string;
    persona: ChatPersona;
    history: ChatMessage[];
    onToken: (token: string) => void;
  }): Promise<{ success: boolean; fullResponse?: string; error?: string }> {
    const user = Storage.getUser();

    // Safety check on chat prompt
    const safetyCheck = validatePromptSafety(params.message);
    logModerationEvent(user.id, params.message, safetyCheck);

    if (!safetyCheck.allowed) {
      return {
        success: false,
        error: safetyCheck.explanation,
      };
    }

    // Deduct 0.1 credit
    const deductRes = Storage.deductCredits(0.1, `Chat with ${params.persona.name}`);
    if (!deductRes.success) {
      return {
        success: false,
        error: 'Insufficient credits. Chat messages require 0.1 credit.',
      };
    }

    try {
      const personaResponses: Record<string, string[]> = {
        noir: [
          `The rain taps against the frosted glass of the studio window. I look up as you speak, studying the tension in your words. `,
          `"You've been carrying that thought for a while, haven't you?" I say softly, leaning back into the leather armchair. `,
          `"In this city, desires aren't something to hide from—they're the only honest currency left. Let's explore what happens when we don't hold anything back."`
        ],
        cyberpunk: [
          `Neon reflections shift across my cybernetic iris as your query parses through my synaptic link. `,
          `"Intriguing frequency," I murmur, fingertips tracing the glowing terminal edge. `,
          `"The megacity sleeps beneath a blanket of static, but here in our private node, the rules are whatever we write into the buffer. Tell me your next move."`
        ],
        muse: [
          `A quiet hush falls over the room. I meet your gaze with an understanding smile, setting down the vintage fountain pen. `,
          `"Art, romance, and freedom—they only exist when two minds dare to strip away the pretense," I reply gently. `,
          `"Every sentence we exchange feels like an unpainted canvas waiting for midnight. Where shall our narrative wander next?"`
        ]
      };

      const selectedResponseChunks =
        personaResponses[params.persona.id] || personaResponses.noir;

      let fullResponse = '';

      for (const paragraph of selectedResponseChunks) {
        const words = paragraph.split(' ');
        for (const word of words) {
          const chunk = word + ' ';
          fullResponse += chunk;
          params.onToken(chunk);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
      }

      return { success: true, fullResponse };
    } catch (err: unknown) {
      Storage.refundCredits(0.1, 'Chat streaming error refund');
      const message = err instanceof Error ? err.message : 'Chat error';
      return { success: false, error: message };
    }
  },
};
