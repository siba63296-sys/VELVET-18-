import { createClient } from '@supabase/supabase-js';
import { User, Generation, CreditTransaction, UserRole } from '../types';

// Read from env with fallback
const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  import.meta.env.VITE_SUPABASE_URL ||
  'https://demo-velvet-project.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_velvet_ai_18_plus';

export const isSupabaseConfigured =
  Boolean(supabaseUrl && !supabaseUrl.includes('demo-velvet-project') && supabaseAnonKey && !supabaseAnonKey.includes('dummy_anon_key'));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SupabaseService = {
  // Sign up with Email + Password + Age Confirmation
  async signUp(email: string, password: string, name: string, isAgeVerified: boolean) {
    if (!isSupabaseConfigured) {
      return {
        user: {
          id: 'usr_mock_' + Math.random().toString(36).substring(2, 9),
          email,
          name,
          avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
          credits: 10.0,
          plan: 'free' as const,
          role: 'user' as UserRole,
          isBanned: false,
          isAgeVerified,
          ageVerifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            is_age_verified: isAgeVerified,
            age_verified_at: isAgeVerified ? new Date().toISOString() : null,
          },
        },
      });

      if (error) return { user: null, error: error.message };

      return {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email || email,
              name,
              avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
              credits: 10.0,
              plan: 'free' as const,
              isAgeVerified,
              ageVerifiedAt: new Date().toISOString(),
              createdAt: data.user.created_at,
            }
          : null,
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Signup failed' };
    }
  },

  // Sign in with Email
  async signIn(email: string, password: string) {
    // Special designated Admin Credentials check
    const cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail === 'rajsiba2005@gmail.com') {
      if (password === 'Siba2005@') {
        return {
          user: {
            id: 'usr_rajsiba_admin',
            email: 'rajsiba2005@gmail.com',
            name: 'Raj Siba (Super Admin)',
            avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
            credits: 9999.0,
            plan: 'unlimited' as const,
            role: 'admin' as UserRole,
            isBanned: false,
            isAgeVerified: true,
            ageVerifiedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          error: null,
        };
      } else {
        return {
          user: null,
          error: 'Incorrect administrator password for rajsiba2005@gmail.com',
        };
      }
    }

    if (!isSupabaseConfigured) {
      return {
        user: {
          id: 'usr_mock_' + Math.random().toString(36).substring(2, 9),
          email,
          name: email.split('@')[0],
          avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
          credits: 10.0,
          plan: 'free' as const,
          role: 'user' as UserRole,
          isBanned: false,
          isAgeVerified: true,
          ageVerifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { user: null, error: error.message };

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: profile?.display_name || data.user.user_metadata?.display_name || email.split('@')[0],
          avatar: profile?.avatar_url || '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
          credits: profile?.credits !== undefined ? Number(profile.credits) : 10.0,
          plan: profile?.plan || 'free',
          role: (profile?.role as UserRole) || 'user',
          isBanned: profile?.is_banned ?? false,
          isAgeVerified: profile?.is_age_verified ?? true,
          ageVerifiedAt: profile?.age_verified_at,
          createdAt: data.user.created_at,
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Sign in failed' };
    }
  },

  // Google OAuth Login
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      // Mock Google Login in demo environment
      return {
        user: {
          id: 'usr_google_' + Math.random().toString(36).substring(2, 9),
          email: 'google.creator@velvet-ai.studio',
          name: 'Google Creator',
          avatar: '/src/assets/images/avatar_studio_artist_1791715791972.jpg',
          credits: 10.0,
          plan: 'free' as const,
          role: 'user' as UserRole,
          isBanned: false,
          isAgeVerified: true,
          ageVerifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        error: null,
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) return { user: null, error: error.message };
    return { data, error: null };
  },

  // Sync generation to Supabase
  async recordGeneration(gen: Generation, userId: string) {
    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('generations').insert({
        id: gen.id,
        user_id: userId,
        type: gen.type,
        prompt: gen.prompt,
        negative_prompt: gen.negativePrompt,
        model: gen.model,
        aspect_ratio: gen.aspectRatio,
        duration: gen.duration,
        motion_intensity: gen.motionIntensity,
        seed: gen.seed,
        result_url: gen.resultUrl,
        media_type: gen.mediaType,
        credits_used: gen.creditsUsed,
        status: gen.status,
        metadata: gen.metadata,
      });
    } catch (e) {
      console.warn('Supabase generation sync notice:', e);
    }
  },

  // Sync credit transaction to Supabase
  async recordCreditTransaction(tx: CreditTransaction, userId: string) {
    if (!isSupabaseConfigured) return;

    try {
      await supabase.from('credit_transactions').insert({
        id: tx.id,
        user_id: userId,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        status: tx.status,
        cashfree_order_id: tx.cashfreeOrderId,
        cashfree_payment_id: tx.cashfreePaymentId,
      });

      // Update user credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (profile) {
        const newCredits = Math.max(0, Number(profile.credits) + tx.amount);
        await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', userId);
      }
    } catch (e) {
      console.warn('Supabase credit transaction sync notice:', e);
    }
  },

  // Upload reference image to Supabase Storage bucket 'user-uploads'
  async uploadReferenceImage(file: File, userId?: string): Promise<{ url: string | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      // Return a base64 / object URL in local demo mode
      return { url: URL.createObjectURL(file), error: null };
    }

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${userId || 'guest'}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error, falling back to local preview:', uploadError.message);
        return { url: URL.createObjectURL(file), error: null };
      }

      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(fileName);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      console.warn('Upload error:', err);
      return { url: URL.createObjectURL(file), error: err.message };
    }
  },
};
