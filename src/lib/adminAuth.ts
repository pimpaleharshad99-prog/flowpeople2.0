// =====================================================================
// FLOWPEOPLE ADMIN AUTHENTICATION CONTROLLER — MONGODB ATLAS
// =====================================================================

const ADMIN_STORAGE_KEY = 'flowpeople_admin_session';
const ADMIN_TOKEN_KEY = 'flowpeople_admin_token';

export interface AdminUser {
  id?: string;
  email: string;
  name: string;
  role: 'superadmin';
  loginTime: string;
  isLiveDb?: boolean;
}

export const adminAuth = {
  /**
   * Verify credentials against MongoDB Atlas backend authentication route
   */
  async login(email: string, pass: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Authenticate against MongoDB Atlas via API gateway
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const user: AdminUser = {
            ...data.user,
            isLiveDb: true,
          };
          if (data.token) {
            localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
            sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
          }
          sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
          return { success: true, user };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || 'Invalid admin credentials. Please check your email and password.',
        };
      }
    } catch (e: any) {
      console.warn('Backend authentication API unreachable:', e.message);
      return {
        success: false,
        error: 'Authentication service currently unreachable. Please try again shortly.',
      };
    }

    return { success: false, error: 'Invalid admin credentials. Please check your email or password.' };
  },

  /**
   * Check if the current browser session is authenticated as admin
   */
  isAuthenticated(): boolean {
    try {
      const session = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!session || !token) return false;
      const user = JSON.parse(session);
      return Boolean(user && user.role === 'superadmin');
    } catch {
      return false;
    }
  },

  /**
   * Verify session token against MongoDB Atlas
   */
  async verifyLiveSession(): Promise<boolean> {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return this.isAuthenticated();

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        return Boolean(data.authenticated);
      }
      return this.isAuthenticated();
    } catch {
      return this.isAuthenticated();
    }
  },

  /**
   * Get currently logged-in admin user
   */
  getCurrentUser(): AdminUser | null {
    try {
      const session = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  /**
   * Terminate admin session in MongoDB Atlas and browser storage
   */
  async logout(): Promise<void> {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } catch (e) {
        // Ignore network errors on logout
      }
    }
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
};
