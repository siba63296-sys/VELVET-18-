import {
  User,
  Generation,
  CreditTransaction,
  ApiKey,
  ReportItem,
  ApiProvider,
  AiModelConfig,
  CashfreeOrderRecord,
  SiteSettings,
} from '../types';

const STORAGE_KEYS = {
  AGE_VERIFIED: 'velvet_age_verified',
  USER: 'velvet_current_user',
  ALL_USERS: 'velvet_admin_all_users',
  GENERATIONS: 'velvet_generations_history',
  TRANSACTIONS: 'velvet_transactions_log',
  API_KEYS: 'velvet_api_keys',
  REPORTS: 'velvet_reports',
  API_PROVIDERS: 'velvet_api_providers',
  MODELS: 'velvet_ai_models',
  CASHFREE_ORDERS: 'velvet_cashfree_orders',
  SITE_SETTINGS: 'velvet_site_settings',
};

// Initial API Providers for Admin
const INITIAL_PROVIDERS: ApiProvider[] = [
  {
    id: 'prov_spicy_flux',
    name: 'Spicy AI Flux 18+ Gateway',
    apiKey: 'sk_spicy_live_839f20194812a',
    baseUrl: 'https://api.spicyai.cloud/v1/diffusion',
    modelName: 'flux-1-dev-mature',
    type: 'image',
    isActive: true,
    creditsCost: 1.0,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'prov_runpod_sdxl',
    name: 'RunPod Mature SDXL Endpoint',
    apiKey: 'rpa_live_49182390123fa',
    baseUrl: 'https://api.runpod.ai/v2/nocturne-mature/runsync',
    modelName: 'nocturne-xl-v2',
    type: 'image',
    isActive: true,
    creditsCost: 1.0,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prov_svd_motion',
    name: 'Velvet Motion Video Node',
    apiKey: 'vm_vid_940182390812b',
    baseUrl: 'https://video-node.velvet-ai.internal/v1/svd',
    modelName: 'svd-xt-18plus',
    type: 'video',
    isActive: true,
    creditsCost: 5.0,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prov_nocturne_llm',
    name: 'Nocturne 70B Roleplay Gateway',
    apiKey: 'llm_noc_84920193821a',
    baseUrl: 'https://api.nocturne-llm.cloud/v1/chat/completions',
    modelName: 'nocturne-uncensored-70b',
    type: 'chat',
    isActive: true,
    creditsCost: 0.1,
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Models configurable by Admin
const INITIAL_MODELS: AiModelConfig[] = [
  {
    id: 'Velvet Flux Ultra 18+',
    displayName: 'Velvet Flux Ultra 18+',
    description: 'Ultra-photorealistic rendering with natural anatomy, cinematic lighting, and unrestricted creative prompts',
    providerId: 'prov_spicy_flux',
    type: 'image',
    creditsCost: 1.0,
    is18Plus: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'Nocturne Photoreal XL',
    displayName: 'Nocturne Photoreal XL',
    description: 'Moody noir aesthetic, cinematic shadows, high dynamic range & studio texture',
    providerId: 'prov_runpod_sdxl',
    type: 'image',
    creditsCost: 1.0,
    is18Plus: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'Anime Sensual Diffusion',
    displayName: 'Anime Sensual Diffusion',
    description: 'Lush 2D anime illustration, vibrant colors & clean line art',
    providerId: 'prov_spicy_flux',
    type: 'image',
    creditsCost: 1.0,
    is18Plus: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'Cinema Realistic 2.1',
    displayName: 'Cinema Realistic 2.1',
    description: '35mm anamorphic film simulation with natural grain and bokeh',
    providerId: 'prov_runpod_sdxl',
    type: 'image',
    creditsCost: 1.0,
    is18Plus: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'Velvet Motion SVD',
    displayName: 'Velvet Motion SVD',
    description: 'Fluid sensual temporal synthesis and natural breathing dynamics (24 FPS)',
    providerId: 'prov_svd_motion',
    type: 'video',
    creditsCost: 5.0,
    is18Plus: true,
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'Nocturne Uncensored Creative LLM',
    displayName: 'Nocturne Uncensored Creative LLM',
    description: 'Deep conversational roleplay personas with streaming token responses',
    providerId: 'prov_nocturne_llm',
    type: 'chat',
    creditsCost: 0.1,
    is18Plus: true,
    isActive: true,
    sortOrder: 6,
  },
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'VELVET 18+ AI Studio',
  logoText: 'VELVET 18+',
  accentColor: '#E11D48',
  ageVerificationRequired: true,
  signupCredits: 10.0,
  rateLimitPerMinute: 10,
  maintenanceMode: false,
};

// Initial Mock Users list for Admin view
const INITIAL_ALL_USERS: User[] = [
  {
    id: 'usr_rajsiba_admin',
    email: 'rajsiba2005@gmail.com',
    name: 'Raj Siba (Super Admin)',
    avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
    credits: 9999.0,
    plan: 'unlimited',
    role: 'admin',
    isAgeVerified: true,
    ageVerifiedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'usr_velvet_admin',
    email: 'admin@velvet-ai.studio',
    name: 'Alex Vance (Admin)',
    avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
    credits: 500.0,
    plan: 'unlimited',
    role: 'admin',
    isAgeVerified: true,
    ageVerifiedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'usr_creator_2',
    email: 'sibarajray11@gmail.com',
    name: 'Sibaraj Ray',
    avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
    credits: 84.0,
    plan: 'pro',
    role: 'user',
    isAgeVerified: true,
    ageVerifiedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'usr_creator_3',
    email: 'priya.sharma@designlab.in',
    name: 'Priya Sharma',
    avatar: '/src/assets/images/hero_cinematic_portrait_1791715741768.jpg',
    credits: 140.0,
    plan: 'basic',
    role: 'user',
    isAgeVerified: true,
    ageVerifiedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'usr_creator_4',
    email: 'karan.mehta@nocturne.io',
    name: 'Karan Mehta',
    avatar: '/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg',
    credits: 10.0,
    plan: 'free',
    role: 'user',
    isAgeVerified: true,
    ageVerifiedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

const INITIAL_CASHFREE_ORDERS: CashfreeOrderRecord[] = [
  {
    id: 'rec_cf_1',
    orderId: 'order_cf_948192831',
    userId: 'usr_creator_2',
    userEmail: 'sibarajray11@gmail.com',
    amountInr: 599,
    credits: 500,
    status: 'PAID',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'rec_cf_2',
    orderId: 'order_cf_718291048',
    userId: 'usr_creator_3',
    userEmail: 'priya.sharma@designlab.in',
    amountInr: 199,
    credits: 100,
    status: 'PAID',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'rec_cf_3',
    orderId: 'order_cf_184920194',
    userId: 'usr_creator_2',
    userEmail: 'sibarajray11@gmail.com',
    amountInr: 399,
    credits: 250,
    status: 'PAID',
    createdAt: new Date(Date.now() - 3600000 * 42).toISOString(),
  },
];

// Default sample generations
const INITIAL_GENERATIONS: Generation[] = [
  {
    id: 'gen_init_1',
    userId: 'usr_velvet_admin',
    userEmail: 'admin@velvet-ai.studio',
    type: 'image',
    prompt: 'Cinematic high-contrast editorial portrait of an elegant character in a velvet gown, dramatic studio lighting, rich shadows, 8k',
    negativePrompt: 'blurry, oversaturated, deformed hands, cartoonish',
    model: 'Velvet Flux Ultra 18+',
    aspectRatio: '16:9',
    resultUrl: '/src/assets/images/hero_cinematic_portrait_1791715741768.jpg',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    creditsUsed: 1,
    status: 'completed',
    seed: 8492041,
  },
  {
    id: 'gen_init_2',
    userId: 'usr_creator_2',
    userEmail: 'sibarajray11@gmail.com',
    type: 'image',
    prompt: 'Moody neon noir night scene with futuristic stylish character on rain-slicked city streets, deep violet reflections',
    negativePrompt: 'low quality, noisy, artifacts',
    model: 'Nocturne Photoreal XL',
    aspectRatio: '4:3',
    resultUrl: '/src/assets/images/showcase_cyberpunk_noir_1791715760591.jpg',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    creditsUsed: 1,
    status: 'completed',
    seed: 5120938,
  },
  {
    id: 'gen_init_3',
    userId: 'usr_creator_3',
    userEmail: 'priya.sharma@designlab.in',
    type: 'image',
    prompt: 'Atmospheric ethereal digital art of an enigmatic celestial figure bathed in moonlight and golden stardust particles',
    negativePrompt: 'washed out, flat colors, bad composition',
    model: 'Anime Sensual Diffusion',
    aspectRatio: '4:3',
    resultUrl: '/src/assets/images/showcase_artistic_fantasy_1791715776608.jpg',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    creditsUsed: 1,
    status: 'completed',
    seed: 9283711,
  },
];

export const Storage = {
  // Age Verification
  isAgeVerified(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED) === 'true';
  },

  setAgeVerified(verified: boolean) {
    if (typeof window === 'undefined') return;
    if (verified) {
      localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, 'true');
      document.cookie = `velvet_age_verified=true; max-age=${365 * 24 * 3600}; path=/; SameSite=Lax`;
    } else {
      localStorage.removeItem(STORAGE_KEYS.AGE_VERIFIED);
      document.cookie = 'velvet_age_verified=; max-age=0; path=/';
    }
  },

  // Current User Profile (Defaults with role='admin' for immediate full feature inspection)
  getUser(): User {
    if (typeof window === 'undefined') return INITIAL_ALL_USERS[0];
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      this.setUser(INITIAL_ALL_USERS[0]);
      return INITIAL_ALL_USERS[0];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.role) parsed.role = 'admin';
      return parsed;
    } catch {
      return INITIAL_ALL_USERS[0];
    }
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    // Also sync back to all users list
    this.updateUserInAllUsers(user);
  },

  toggleUserRole(): User {
    const user = this.getUser();
    user.role = user.role === 'admin' ? 'user' : 'admin';
    this.setUser(user);
    return user;
  },

  // Admin login credential validator for rajsiba2005@gmail.com and password Siba2005@
  loginAdminWithCredentials(
    email: string,
    pass: string
  ): { success: boolean; user?: User; error?: string } {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    if (cleanEmail !== 'rajsiba2005@gmail.com') {
      return {
        success: false,
        error: 'Invalid administrator email address. Please use rajsiba2005@gmail.com',
      };
    }

    if (cleanPass !== 'Siba2005@') {
      return {
        success: false,
        error: 'Incorrect administrator password. Please check your admin credentials.',
      };
    }

    // Retrieve or initialize the Raj Siba admin record
    const allUsers = this.getAllUsers();
    let adminRecord = allUsers.find(
      (u) => u.email.toLowerCase() === 'rajsiba2005@gmail.com'
    );

    if (!adminRecord) {
      adminRecord = {
        id: 'usr_rajsiba_admin',
        email: 'rajsiba2005@gmail.com',
        name: 'Raj Siba (Super Admin)',
        avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
        credits: 9999.0,
        plan: 'unlimited',
        role: 'admin',
        isAgeVerified: true,
        ageVerifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      allUsers.unshift(adminRecord);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
    } else {
      adminRecord.role = 'admin';
      this.updateUserInAllUsers(adminRecord);
    }

    this.setUser(adminRecord);
    this.setAgeVerified(true);
    return { success: true, user: adminRecord };
  },

  // All Users Management (Admin)
  getAllUsers(): User[] {
    if (typeof window === 'undefined') return INITIAL_ALL_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(INITIAL_ALL_USERS));
      return INITIAL_ALL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ALL_USERS;
    }
  },

  updateUserInAllUsers(user: User): void {
    const users = this.getAllUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.unshift(user);
    }
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  },

  adminAdjustCredits(userId: string, delta: number): User | null {
    const users = this.getAllUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return null;

    target.credits = Math.max(0, Number((target.credits + delta).toFixed(2)));
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

    const currentUser = this.getUser();
    if (currentUser.id === userId) {
      this.setUser(target);
    }

    this.recordTransaction({
      id: 'tx_adj_' + Date.now(),
      userId,
      amount: delta,
      type: 'admin_adjustment',
      description: `Admin manual credit adjustment: ${delta > 0 ? '+' + delta : delta} credits`,
      createdAt: new Date().toISOString(),
      status: 'succeeded',
    });

    return target;
  },

  adminToggleBan(userId: string): User | null {
    const users = this.getAllUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return null;

    target.isBanned = !target.isBanned;
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

    const currentUser = this.getUser();
    if (currentUser.id === userId) {
      this.setUser(target);
    }
    return target;
  },

  adminDeleteUser(userId: string): void {
    const users = this.getAllUsers().filter((u) => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  },

  adminChangeRole(userId: string, newRole: 'user' | 'admin'): User | null {
    const users = this.getAllUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) return null;

    target.role = newRole;
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

    const currentUser = this.getUser();
    if (currentUser.id === userId) {
      this.setUser(target);
    }
    return target;
  },

  // Credits Management
  deductCredits(amount: number, description: string): { success: boolean; newBalance: number } {
    const user = this.getUser();
    if (user.plan === 'unlimited') {
      this.recordTransaction({
        id: 'tx_' + Date.now(),
        userId: user.id,
        amount: 0,
        type: 'generation',
        description: `${description} (Unlimited Plan)`,
        createdAt: new Date().toISOString(),
        status: 'succeeded',
      });
      return { success: true, newBalance: user.credits };
    }

    if (user.credits < amount) {
      return { success: false, newBalance: user.credits };
    }

    const newCredits = Math.max(0, Number((user.credits - amount).toFixed(2)));
    user.credits = newCredits;
    this.setUser(user);

    this.recordTransaction({
      id: 'tx_' + Date.now(),
      userId: user.id,
      amount: -amount,
      type: 'generation',
      description,
      createdAt: new Date().toISOString(),
      status: 'succeeded',
    });

    return { success: true, newBalance: newCredits };
  },

  refundCredits(amount: number, reason: string, targetUserId?: string): number {
    const user = this.getUser();
    const newCredits = Number((user.credits + amount).toFixed(2));
    user.credits = newCredits;
    this.setUser(user);

    this.recordTransaction({
      id: 'tx_ref_' + Date.now(),
      userId: targetUserId || user.id,
      amount: amount,
      type: 'refund',
      description: `Refund: ${reason}`,
      createdAt: new Date().toISOString(),
      status: 'refunded',
    });

    return newCredits;
  },

  addCredits(amount: number, description: string, cashfreeOrderId?: string): number {
    const user = this.getUser();
    const newCredits = Number((user.credits + amount).toFixed(2));
    user.credits = newCredits;
    this.setUser(user);

    const generatedOrderId = cashfreeOrderId || 'CF_ORD_' + Math.floor(100000 + Math.random() * 900000);

    this.recordTransaction({
      id: 'tx_add_' + Date.now(),
      userId: user.id,
      amount: amount,
      type: 'purchase',
      description,
      createdAt: new Date().toISOString(),
      status: 'succeeded',
      invoiceId: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      cashfreeOrderId: generatedOrderId,
      paymentGateway: 'cashfree',
    });

    // Record into Cashfree Orders for Admin
    this.recordCashfreeOrder({
      id: 'ord_' + Date.now(),
      orderId: generatedOrderId,
      userId: user.id,
      userEmail: user.email,
      amountInr: amount === 50 ? 99 : amount === 250 ? 399 : 999,
      credits: amount,
      status: 'PAID',
      createdAt: new Date().toISOString(),
    });

    return newCredits;
  },

  updatePlan(plan: 'free' | 'basic' | 'pro' | 'unlimited', initialCredits: number, cashfreeOrderId?: string): User {
    const user = this.getUser();
    user.plan = plan;
    user.credits = Number((user.credits + initialCredits).toFixed(2));
    this.setUser(user);

    const generatedOrderId = cashfreeOrderId || 'CF_SUB_' + Math.floor(100000 + Math.random() * 900000);

    this.recordTransaction({
      id: 'tx_sub_' + Date.now(),
      userId: user.id,
      amount: initialCredits,
      type: 'subscription',
      description: `Cashfree: Subscribed to ${plan.toUpperCase()} tier`,
      createdAt: new Date().toISOString(),
      status: 'succeeded',
      invoiceId: 'SUB-' + Math.floor(100000 + Math.random() * 900000),
      cashfreeOrderId: generatedOrderId,
      paymentGateway: 'cashfree',
    });

    this.recordCashfreeOrder({
      id: 'ord_sub_' + Date.now(),
      orderId: generatedOrderId,
      userId: user.id,
      userEmail: user.email,
      amountInr: plan === 'basic' ? 199 : plan === 'pro' ? 599 : 1999,
      credits: initialCredits,
      status: 'PAID',
      createdAt: new Date().toISOString(),
    });

    return user;
  },

  // Generations
  getGenerations(): Generation[] {
    if (typeof window === 'undefined') return INITIAL_GENERATIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.GENERATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(INITIAL_GENERATIONS));
      return INITIAL_GENERATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_GENERATIONS;
    }
  },

  saveGeneration(gen: Generation): void {
    const existing = this.getGenerations();
    existing.unshift(gen);
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(existing));
  },

  deleteGeneration(id: string): void {
    const existing = this.getGenerations();
    const filtered = existing.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(filtered));
  },

  flagGeneration(id: string): void {
    const existing = this.getGenerations();
    const updated = existing.map((g) => (g.id === id ? { ...g, flagged: true } : g));
    localStorage.setItem(STORAGE_KEYS.GENERATIONS, JSON.stringify(updated));
  },

  // Transactions
  getTransactions(): CreditTransaction[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      const initialTx: CreditTransaction[] = [
        {
          id: 'tx_welcome',
          userId: 'usr_velvet_admin',
          amount: 10,
          type: 'signup_bonus',
          description: 'Welcome bonus: 10 free credits (Supabase Auth)',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          status: 'succeeded',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTx));
      return initialTx;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  recordTransaction(tx: CreditTransaction): void {
    const list = this.getTransactions();
    list.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
  },

  // Cashfree Orders (Admin)
  getCashfreeOrders(): CashfreeOrderRecord[] {
    if (typeof window === 'undefined') return INITIAL_CASHFREE_ORDERS;
    const raw = localStorage.getItem(STORAGE_KEYS.CASHFREE_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CASHFREE_ORDERS, JSON.stringify(INITIAL_CASHFREE_ORDERS));
      return INITIAL_CASHFREE_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CASHFREE_ORDERS;
    }
  },

  recordCashfreeOrder(order: CashfreeOrderRecord): void {
    const orders = this.getCashfreeOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.CASHFREE_ORDERS, JSON.stringify(orders));
  },

  // API Providers (Admin)
  getApiProviders(): ApiProvider[] {
    if (typeof window === 'undefined') return INITIAL_PROVIDERS;
    const raw = localStorage.getItem(STORAGE_KEYS.API_PROVIDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.API_PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
      return INITIAL_PROVIDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROVIDERS;
    }
  },

  saveApiProvider(provider: ApiProvider): void {
    const providers = this.getApiProviders();
    const idx = providers.findIndex((p) => p.id === provider.id);
    if (idx !== -1) {
      providers[idx] = provider;
    } else {
      providers.unshift(provider);
    }
    localStorage.setItem(STORAGE_KEYS.API_PROVIDERS, JSON.stringify(providers));
  },

  deleteApiProvider(id: string): void {
    const providers = this.getApiProviders().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.API_PROVIDERS, JSON.stringify(providers));
  },

  toggleProviderActive(id: string): void {
    const providers = this.getApiProviders();
    const target = providers.find((p) => p.id === id);
    if (target) {
      target.isActive = !target.isActive;
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.API_PROVIDERS, JSON.stringify(providers));
    }
  },

  // AI Models Management (Admin)
  getAiModels(): AiModelConfig[] {
    if (typeof window === 'undefined') return INITIAL_MODELS;
    const raw = localStorage.getItem(STORAGE_KEYS.MODELS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(INITIAL_MODELS));
      return INITIAL_MODELS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MODELS;
    }
  },

  saveAiModel(model: AiModelConfig): void {
    const models = this.getAiModels();
    const idx = models.findIndex((m) => m.id === model.id);
    if (idx !== -1) {
      models[idx] = model;
    } else {
      models.push(model);
    }
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
  },

  deleteAiModel(id: string): void {
    const models = this.getAiModels().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
  },

  // Site Settings (Admin)
  getSiteSettings(): SiteSettings {
    if (typeof window === 'undefined') return INITIAL_SITE_SETTINGS;
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  },

  saveSiteSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
  },

  // API Keys (User)
  getApiKeys(): ApiKey[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    if (!raw) {
      const defaultKey: ApiKey = {
        id: 'key_1',
        name: 'Default Production Key',
        keyPrefix: 'vlt_live_948f2...',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        lastUsedAt: '2 hours ago',
      };
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify([defaultKey]));
      return [defaultKey];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createApiKey(name: string): ApiKey {
    const keys = this.getApiKeys();
    const newKey: ApiKey = {
      id: 'key_' + Date.now(),
      name,
      keyPrefix: 'vlt_live_' + Math.random().toString(36).substring(2, 7) + '...',
      createdAt: new Date().toISOString(),
    };
    keys.unshift(newKey);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    return newKey;
  },

  deleteApiKey(id: string): void {
    const keys = this.getApiKeys().filter((k) => k.id !== id);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  },

  // Reports
  submitReport(report: ReportItem): void {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const list: ReportItem[] = raw ? JSON.parse(raw) : [];
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(list));
    this.flagGeneration(report.generationId);
  },
};
