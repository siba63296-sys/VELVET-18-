export type GenerationType = 'image' | 'video' | 'chat';

export type PlanTier = 'free' | 'basic' | 'pro' | 'unlimited';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
  plan: PlanTier;
  role: UserRole;
  isBanned?: boolean;
  isAgeVerified: boolean;
  ageVerifiedAt?: string;
  createdAt: string;
}

export interface Generation {
  id: string;
  userId?: string;
  userEmail?: string;
  type: GenerationType;
  prompt: string;
  negativePrompt?: string;
  model: string;
  aspectRatio?: string;
  duration?: number;
  motionIntensity?: number;
  seed?: number;
  resultUrl?: string;
  referenceImageUrl?: string;
  referenceStrength?: number;
  isImg2Img?: boolean;
  content?: string;
  mediaType: 'image' | 'video' | 'text';
  createdAt: string;
  creditsUsed: number;
  status: 'completed' | 'failed' | 'processing';
  flagged?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatPersona {
  id: string;
  name: string;
  tagline: string;
  avatar: string;
  systemPrompt: string;
  greeting: string;
  accent: string;
}

export interface CreditTransaction {
  id: string;
  userId?: string;
  amount: number;
  type: 'generation' | 'refund' | 'purchase' | 'subscription' | 'signup_bonus' | 'admin_adjustment';
  description: string;
  createdAt: string;
  status: 'succeeded' | 'refunded' | 'pending';
  invoiceId?: string;
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  paymentGateway?: 'cashfree';
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceInr: number;
  badge?: string;
}

export interface SubscriptionTier {
  id: PlanTier;
  name: string;
  priceInr: number;
  creditsPerMonth: number;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface SafetyCheckResult {
  allowed: boolean;
  violationCategory?: 'underage' | 'non_consensual' | 'violence' | 'real_person' | 'illegal';
  explanation?: string;
  flaggedKeywords?: string[];
}

export interface ReportItem {
  id: string;
  generationId: string;
  reason: 'inappropriate_content' | 'copyright' | 'low_quality' | 'safety_hazard' | 'other';
  notes: string;
  createdAt: string;
  status: 'investigating' | 'resolved' | 'dismissed';
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CashfreeOrderResponse {
  order_id: string;
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
  order_status: string;
}

// ---------------------------------------------------------------------------
// ADMIN & PROVIDER TYPES
// ---------------------------------------------------------------------------

export interface ApiProvider {
  id: string;
  name: string;
  apiKey: string; // Encrypted or masked on client
  baseUrl: string;
  modelName: string;
  type: 'image' | 'video' | 'chat';
  isActive: boolean;
  creditsCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiModelConfig {
  id: string;
  displayName: string;
  description: string;
  providerId: string;
  type: 'image' | 'video' | 'chat';
  creditsCost: number;
  is18Plus: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CashfreeOrderRecord {
  id: string;
  orderId: string;
  userId: string;
  userEmail: string;
  amountInr: number;
  credits: number;
  status: 'PAID' | 'ACTIVE' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  accentColor: string;
  ageVerificationRequired: boolean;
  signupCredits: number;
  rateLimitPerMinute: number;
  maintenanceMode: boolean;
}
