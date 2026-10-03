import { supabase, isSupabaseConfigured } from './supabase';
import { RoleType } from '@/components/ui/SegmentedRoleControl';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  phone?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

class AuthService {
  /**
   * Sign In with Email & Password using Supabase Auth
   */
  async signIn(email: string, password: string, selectedRole: RoleType): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Demo / Mock fallback when Supabase keys are not yet entered
      return {
        user: {
          id: 'demo_user_01',
          name: selectedRole === 'TEACHER' ? 'Sarah Jenkins' : 'Kishore Mohan',
          email,
          role: selectedRole,
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'No user data returned from Supabase.' };
      }

      const role = (data.user.user_metadata?.role as RoleType) || selectedRole;
      const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';

      return {
        user: {
          id: data.user.id,
          name,
          email: data.user.email || email,
          role,
          phone: data.user.user_metadata?.phone,
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'An unexpected authentication error occurred.' };
    }
  }

  /**
   * Register a new user in Supabase Auth with custom role & profile metadata
   */
  async signUp(
    name: string,
    email: string,
    password: string,
    role: RoleType,
    phone?: string
  ): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      // Demo registration
      return {
        user: {
          id: `demo_${Date.now()}`,
          name,
          email,
          role,
          phone,
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name,
            role,
            phone,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return {
        user: {
          id: data.user?.id || `user_${Date.now()}`,
          name,
          email,
          role,
          phone,
        },
        error: null,
      };
    } catch (err: any) {
      return { user: null, error: err.message || 'Failed to create user account.' };
    }
  }

  /**
   * Request password reset email via Supabase
   */
  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured()) {
      return { success: true, error: null };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset email.' };
    }
  }

  /**
   * Sign Out current user
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  }

  /**
   * Get current authenticated session
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) return null;

    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    return {
      id: data.user.id,
      name: data.user.user_metadata?.name || 'User',
      email: data.user.email || '',
      role: (data.user.user_metadata?.role as RoleType) || 'PARENT',
      phone: data.user.user_metadata?.phone,
    };
  }
}

export const authService = new AuthService();
