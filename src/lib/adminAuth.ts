// src/lib/adminAuth.ts
// =====================================================================
// FLOWPEOPLE ADMIN AUTHENTICATION CONTROLLER — SUPABASE AUTH & RLS
// =====================================================================
import { supabase } from './supabase';

export interface AdminUser {
  id?: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
  lastLoginAt?: string;
  isLiveDb?: boolean;
}

export interface AuthCheckResult {
  authenticated: boolean;
  user: AdminUser | null;
  error?: string;
}

export const adminAuth = {
  /**
   * Authenticate admin using Supabase Auth and verify role in profiles table
   */
  async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      return { success: false, error: 'Please enter both your email and password.' };
    }

    try {
      // 1. Authenticate via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error || !data.user) {
        return {
          success: false,
          error: error?.message || 'Invalid credentials. Please verify your email and password.',
        };
      }

      // 2. Verify authorized admin role in Supabase public.profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile || profile.is_active === false || !['superadmin', 'admin'].includes(profile.role)) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: You do not have administrator permissions.',
        };
      }

      // 3. Synchronize server session cookie via /api/auth/login
      try {
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.session?.access_token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ email: cleanEmail, password: pass }),
        });
      } catch {}

      const user: AdminUser = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        name: profile.full_name || 'Administrator',
        role: profile.role,
        lastLoginAt: new Date().toISOString(),
        isLiveDb: true,
      };

      return { success: true, user };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Authentication service unreachable. Please try again shortly.',
      };
    }
  },

  /**
   * Verify active session against Supabase Auth & public.profiles
   */
  async checkAuth(): Promise<AuthCheckResult> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session || !session.user) {
        // Fallback check against /api/auth/me
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (res.ok) {
          const apiData = await res.json().catch(() => ({}));
          if (apiData.authenticated && apiData.user) {
            return {
              authenticated: true,
              user: { ...apiData.user, isLiveDb: true },
            };
          }
        }
        return { authenticated: false, user: null };
      }

      // Verify profile role in Supabase
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || profile.is_active === false || !['superadmin', 'admin'].includes(profile.role)) {
        await supabase.auth.signOut();
        return { authenticated: false, user: null };
      }

      const user: AdminUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: profile.full_name || 'Administrator',
        role: profile.role,
        isLiveDb: true,
      };

      return { authenticated: true, user };
    } catch {
      return { authenticated: false, user: null };
    }
  },

  /**
   * Terminate admin session in Supabase Auth and clear session cookies
   */
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch {}
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch {}
  },
};
