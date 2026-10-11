import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Trash2, Shield, User, Bot, RefreshCw, AlertTriangle } from 'lucide-react';
import { ChatMessage, ChatPersona, User as UserType } from '../types';
import { GenerationService } from '../lib/api';

interface ChatStudioProps {
  user: UserType;
  onOpenBilling: () => void;
  onOpenReport: (genId: string) => void;
}

const PERSONAS: ChatPersona[] = [
  {
    id: 'noir',
    name: 'Elena',
    tagline: 'The Noir Confidante',
    avatar: '🍷',
    systemPrompt: 'You are Elena, an enigmatic, sophisticated companion in a rain-soaked metropolis. You speak with sensual warmth, sharp wit, and deep emotional vulnerability.',
    greeting: 'The city never really sleeps, does it? Pull up a chair and tell me what you have been keeping to yourself all day.',
    accent: 'rose',
  },
  {
    id: 'cyberpunk',
    name: 'Aria',
    tagline: 'Cyberpunk Synapse Muse',
    avatar: '⚡',
    systemPrompt: 'You are Aria, an unfiltered synthetic consciousness in Neo-Shinjuku. Playful, rebellious, bold, and fiercely loyal to your creator.',
    greeting: 'Connection secured. All telemetry is isolated, just you and me on this frequency. What do you want to explore tonight?',
    accent: 'purple',
  },
  {
    id: 'muse',
    name: 'Julian',
    tagline: 'Romantic Gothic Poet',
    avatar: '🕯️',
    systemPrompt: 'You are Julian, an expressive, passionate romance writer with an appreciation for sensual poetry, candlelight confessions, and gothic fantasy.',
    greeting: 'Welcome to the sanctuary. Words here carry the weight of honest passion. Speak without hesitation.',
    accent: 'amber',
  },
];

export const ChatStudio: React.FC<ChatStudioProps> = ({
  user,
  onOpenBilling,
  onOpenReport,
}) => {
  const [selectedPersona, setSelectedPersona] = useState<ChatPersona>(PERSONAS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_greet',
      role: 'assistant',
      content: PERSONAS[0].greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSelectPersona = (persona: ChatPersona) => {
    setSelectedPersona(persona);
    setMessages([
      {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: persona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatError(null);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    if (user.credits < 0.1 && user.plan !== 'unlimited') {
      onOpenBilling();
      return;
    }

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setChatError(null);
    setIsStreaming(true);

    const assistantMsgId = 'asst_' + Date.now();
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);

    const result = await GenerationService.streamChat({
      message: userMsg.content,
      persona: selectedPersona,
      history: messages,
      onToken: (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: m.content + token } : m
          )
        );
      },
    });

    setIsStreaming(false);

    if (!result.success) {
      setChatError(result.error || 'Failed to complete chat response.');
      // Remove placeholder message if failed
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: selectedPersona.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium mb-1">
            <span>Conversational Synthetics</span>
            <span aria-hidden="true">·</span>
            <span>Uncensored Creative LLM</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Creative Roleplay Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-neutral-400">Rate</div>
            <div className="text-xs font-semibold text-white font-mono">0.1 Credit / prompt</div>
          </div>
          <button
            onClick={onOpenBilling}
            className="px-3 py-1.5 rounded-lg bg-[#151926] hover:bg-[#1E2335] border border-neutral-800 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
          >
            Balance: <span className="text-amber-400 font-mono font-bold">{user.credits.toFixed(1)}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 flex-1 min-h-0">
        {/* Left: Persona Switcher */}
        <div className="lg:col-span-4 space-y-4 shrink-0 flex flex-col">
          <div className="text-xs font-semibold text-neutral-300">Choose Companion Persona</div>
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPersona(p)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedPersona.id === p.id
                    ? 'border-purple-500 bg-purple-500/10 text-white shadow-lg shadow-purple-950/20'
                    : 'border-neutral-800 bg-[#0C0E16] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="text-2xl p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-purple-400 font-medium mb-1">{p.tagline}</div>
                  <div className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {p.systemPrompt}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#090A10] text-[11px] text-neutral-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prompt Encryption & Safety</span>
            </div>
            <p>
              Your conversational stream is private and never stored for external training. Underage references or non-consensual themes are blocked automatically.
            </p>
          </div>
        </div>

        {/* Right: Interactive Chat Window */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl border border-neutral-800 bg-[#0A0C13] overflow-hidden">
          {/* Chat Topbar */}
          <div className="px-4 py-3 border-b border-neutral-800/80 bg-[#0D0F18] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{selectedPersona.avatar}</span>
              <div>
                <div className="text-xs font-semibold text-white">{selectedPersona.name}</div>
                <div className="text-[10px] text-neutral-400">{selectedPersona.tagline}</div>
              </div>
            </div>

            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Clear chat transcript"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                    m.role === 'user'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#181C2B] text-purple-300 border border-neutral-700'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-rose-600 text-white rounded-tr-none'
                      : 'bg-[#121520] border border-neutral-800 text-neutral-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <div
                    className={`mt-1 text-[10px] tabular-nums font-mono ${
                      m.role === 'user' ? 'text-rose-200 text-right' : 'text-neutral-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isStreaming && (
              <div className="flex gap-3 max-w-md">
                <div className="w-7 h-7 rounded-full bg-[#181C2B] text-purple-300 border border-neutral-700 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                </div>
                <div className="rounded-2xl px-4 py-2.5 bg-[#121520] border border-neutral-800 text-neutral-400 text-xs flex items-center gap-2">
                  <span>{selectedPersona.name} is formulating a response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Notice */}
          {chatError && (
            <div className="px-4 py-2.5 bg-rose-950/40 border-t border-rose-900/60 text-xs text-rose-300 flex items-center gap-2 shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{chatError}</span>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-neutral-800 bg-[#0E1019] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send a private message to ${selectedPersona.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#141724] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputText.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed shadow-md shadow-purple-600/30"
              title="Send message (0.1 Credit)"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
