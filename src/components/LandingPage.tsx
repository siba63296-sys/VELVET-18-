import React, { useState } from 'react';
import { Sparkles, Video, MessageSquare, ShieldCheck, ArrowRight, Check, ChevronDown, Lock, Zap, Coins, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onStartGenerating: (initialPrompt?: string) => void;
  onOpenPricing: () => void;
  onOpenCompliance: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartGenerating,
  onOpenPricing,
  onOpenCompliance,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const showcaseItems = [
    {
      title: 'Editorial Noir Portrait',
      model: 'Velvet Flux Ultra 18+',
      ratio: '16:9',
      prompt: 'Cinematic high-contrast editorial portrait of an elegant character in a velvet gown, dramatic studio lighting, rich shadows, 8k',
      image: '/src/assets/images/hero_cinematic_portrait_1791715741768.jpg',
    },
    {
      title: 'Neon Noir Night Streets',
      model: 'Nocturne Photoreal XL',
      ratio: '4:3',
      prompt: 'Moody neon noir night scene with futuristic stylish character on rain-slicked city streets, deep violet reflections',
      image: '/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg',
    },
    {
      title: 'Celestial Dreamscape',
      model: 'Anime Sensual Diffusion',
      ratio: '4:3',
      prompt: 'Atmospheric ethereal digital art of an enigmatic celestial figure bathed in moonlight and golden stardust particles',
      image: '/src/assets/images/showcase_artistic_fantasy_1791715776608.jpg',
    },
  ];

  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-rose-400" />,
      title: 'Text-to-Image Studio',
      description: 'Ultra-photorealistic rendering with natural skin tones, cinematic lighting, and unrestricted creative prompts for consenting adults.',
      specs: 'FLUX 18+ · SDXL · 4K Upscale',
    },
    {
      icon: <Video className="w-5 h-5 text-amber-400" />,
      title: 'Image-to-Video Motion',
      description: 'Transform static images into fluid cinematic video sequences with custom camera motions, orbit angles, and variable frame rates.',
      specs: '24 FPS · Orbit & Pan · Up to 10s',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      title: 'Uncensored Creative Chat',
      description: 'Engage with customized creative personas for sensual dialogue, romantic storytelling, and immersive adult roleplay simulations.',
      specs: 'Real-time Streaming · Custom Personas',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Strict Ethical Guardrails',
      description: 'Our automated compliance engine enforces absolute zero tolerance for minors, non-consensual content, and unauthorized real-person likenesses.',
      specs: '18 U.S.C. § 2257 · Zero CSAM · Supabase RLS',
    },
  ];

  const faqs = [
    {
      q: 'How does age verification work?',
      a: 'All visitors must confirm they are at least 18 years of age (or legal age of majority in their jurisdiction) upon entering. Your verification consent is recorded with cryptographic timestamps, and strict server-side policies prohibit underage access.',
    },
    {
      q: 'What payment methods does Cashfree support?',
      a: 'Cashfree supports instant UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards (RuPay, Visa, Mastercard), and NetBanking across 50+ Indian banks with instant credit activation.',
    },
    {
      q: 'What content is prohibited on Velvet AI?',
      a: 'We enforce an absolute zero-tolerance policy against depictions of minors, non-consensual content, extreme violence, and non-consensual deepfakes of real living individuals. Prompts violating these guidelines are immediately blocked and logged.',
    },
    {
      q: 'Are my generations and prompts private?',
      a: 'Yes. All generations run through server-side private routes with ephemeral memory caching and database Row-Level Security (RLS) on Supabase. We never train public models on your private creative prompts.',
    },
    {
      q: 'How do credits work and what happens if a generation fails?',
      a: 'Images cost 1 credit, videos cost 5 credits, and chat messages cost 0.1 credit. If any generation fails due to a server error or is rejected by safety filters, your credits are automatically refunded immediately.',
    },
    {
      q: 'Is this compliant with 18 U.S.C. 2257?',
      a: 'Yes. All content generated on Velvet AI consists solely of synthetic, computer-generated visual outputs produced via algorithmic diffusion and neural networks. No living performers are depicted.',
    },
  ];

  return (
    <div className="w-full space-y-24 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>18+ Adult Generative Studio</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400">Next-Gen Creative Freedom</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
              Unfiltered Adult AI Generation. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200">
                Crafted for Consenting Creators.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              Synthesize photorealistic imagery, cinematic motion video, and deep conversational personas without arbitrary creative restrictions—powered by Supabase auth and secure Cashfree UPI payments.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onStartGenerating()}
                className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 group cursor-pointer whitespace-nowrap"
              >
                <span>Start Generating (10 Free Credits)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenPricing}
                className="px-6 py-3.5 rounded-xl bg-[#131620] hover:bg-[#1A1F2E] border border-neutral-800 text-neutral-200 font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Plans from ₹199 (Cashfree UPI)</span>
              </button>
            </div>

            {/* Proof & Trust Markers adjacent to CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-400 border-t border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Supabase RLS Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Strict 18+ Safety Filtering</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Instant Cashfree Auto-Refunds</span>
              </div>
            </div>
          </div>

          {/* Hero Media Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0E1018] shadow-2xl group">
              <img
                src="/src/assets/images/hero_cinematic_portrait_1791715741768.jpg"
                alt="Velvet AI sample generation"
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
                  <span className="font-semibold text-rose-400">Velvet Flux Ultra 18+</span>
                  <span aria-hidden="true">·</span>
                  <span>16:9 Cinema Aspect</span>
                </div>
                <p className="text-xs text-neutral-200 italic line-clamp-2">
                  "Cinematic high-contrast editorial portrait of an elegant character in a velvet gown, dramatic studio lighting..."
                </p>
                <button
                  onClick={() => onStartGenerating(showcaseItems[0].prompt)}
                  className="mt-3 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Try This Prompt in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Rigor Bar */}
      <section className="border-y border-neutral-800/80 bg-[#0A0C12] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tabular-nums">
                1,240,000+
              </div>
              <div className="text-xs text-neutral-400 mt-1">Adult Generations Synthesized</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tabular-nums">
                &lt; 3.8s
              </div>
              <div className="text-xs text-neutral-400 mt-1">Average Latent Denoise Time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-rose-400 tabular-nums">
                100%
              </div>
              <div className="text-xs text-neutral-400 mt-1">Zero Minor & CSAM Tolerance</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 tabular-nums">
                Cashfree PG
              </div>
              <div className="text-xs text-neutral-400 mt-1">Instant UPI & Auto-Refunds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
              Curated Synthetics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              High-Fidelity Studio Showcase
            </h2>
          </div>
          <button
            onClick={() => onStartGenerating()}
            className="text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Generator Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden border border-neutral-800 bg-[#0E1017] group hover:border-neutral-700 transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black/60">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-neutral-200">
                  {item.ratio}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="font-medium text-neutral-200">{item.title}</span>
                    <span className="text-[11px] text-rose-400 font-mono">{item.model}</span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {item.prompt}
                  </p>
                </div>

                <button
                  onClick={() => onStartGenerating(item.prompt)}
                  className="w-full py-2 rounded-lg bg-[#161A26] hover:bg-rose-600 hover:text-white text-xs font-medium text-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Synthesize Similar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Studio Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
            Creative Capabilities
          </div>
          <h2 className="text-3xl font-bold font-display text-white">
            Built for Total Sensual Imagination
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            No corporate watermarks, no prudish prompt rejections—just raw, high-performance generative models for adults.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-neutral-800 bg-[#0C0E15] space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-neutral-900 w-fit border border-neutral-800">
                {feat.icon}
              </div>
              <h3 className="text-base font-semibold text-white font-display">
                {feat.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {feat.description}
              </p>
              <div className="pt-2 text-[11px] font-mono text-neutral-400 border-t border-neutral-800/80">
                {feat.specs}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section (Exact INR requirements) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            Transparent INR Pricing
          </div>
          <h2 className="text-3xl font-bold font-display text-white">
            Plans for Every Creative Scale
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Start completely free with 10 welcome credits. Upgrade instantly via Cashfree UPI or Cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Tier */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0B0D14] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Free Starter</h3>
                <p className="text-xs text-neutral-400 mt-1">For new creators exploring models</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-display">₹0</span>
                <span className="text-xs text-neutral-400">/ forever</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>10 bonus credits on sign-up</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Standard Image & Chat models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Community vault access</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onStartGenerating()}
              className="w-full py-2.5 rounded-lg border border-neutral-700 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Start Free (10 Credits)
            </button>
          </div>

          {/* Basic Tier - ₹199/mo (100 credits) */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0B0D14] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Basic Creator</h3>
                <p className="text-xs text-neutral-400 mt-1">Consistent monthly allocations</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-display">₹199</span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span><strong>100 Monthly Credits</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Full access to Image & Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Cashfree UPI recurring</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full py-2.5 rounded-lg bg-[#141824] hover:bg-neutral-800 text-xs font-semibold text-white border border-neutral-700 transition-colors cursor-pointer"
            >
              Choose Basic (₹199)
            </button>
          </div>

          {/* Pro Tier - ₹599/mo (500 credits) */}
          <div className="p-6 rounded-2xl border-2 border-rose-500/80 bg-[#10131E] relative flex flex-col justify-between space-y-6 shadow-xl shadow-rose-950/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-semibold tracking-wide uppercase">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Pro Creator</h3>
                <p className="text-xs text-neutral-400 mt-1">High-speed priority synthesis</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-display">₹599</span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span><strong>500 Monthly Credits</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Priority GPU speed (&lt;3s)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>4K upscaling & Video Motion</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Uncensored chat personas</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors shadow-md shadow-rose-600/30 cursor-pointer"
            >
              Upgrade to Pro (₹599)
            </button>
          </div>

          {/* Unlimited VIP - ₹1999/mo */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0B0D14] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-display">Unlimited VIP</h3>
                <p className="text-xs text-neutral-400 mt-1">Zero credit caps & raw API</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-display">₹1,999</span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Unlimited Generations</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dedicated GPU cluster instance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Programmatic API access</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onOpenPricing}
              className="w-full py-2.5 rounded-lg border border-neutral-700 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Join VIP (₹1,999)
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Clear answers on compliance, credits, Cashfree payments, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-neutral-800 bg-[#0C0E15] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-rose-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#10121D] to-[#0D0F18] border border-rose-900/30 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Ready to unleash your creative vision?
          </h2>
          <p className="text-sm text-neutral-300 max-w-xl mx-auto">
            Experience unconstrained mature visual and conversational AI with strict ethical standards. 10 free credits loaded on sign-up.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onStartGenerating()}
              className="px-8 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-rose-600/30 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Enter Generation Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
