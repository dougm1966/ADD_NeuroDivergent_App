# 🔐 Agent 2 Sprint 2C: Authentication Service

## Mission
Implement secure authentication service with user session management and automatic subscription initialization.

## Sprint Goal
Build a complete authentication system that securely manages users and automatically sets up free subscriptions.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 2A completed (Supabase connection working)
- Sprint 2B completed (database schema and RLS policies active)

## Critical Rules (NEVER VIOLATE)
1. Authentication: Supabase Auth ONLY
2. Security: Always validate user sessions
3. Subscription: Initialize on every signup
4. Errors: Use gentle, shame-free messaging
5. Storage: Secure token handling only

## Sprint Tasks

### Task 1: Create Authentication Service
**Create**: `src/services/authService.ts`
```typescript
import { supabase } from './supabaseClient';
import type { Database } from '../types/database';

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  created_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: AuthError | null;
}

export const authService = {
  /**
   * Sign up new user and initialize free subscription
   */
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: this.getGentleAuthError(error.message),
            code: error.message
          }
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: "Let's try creating your account again",
          code: 'unexpected_error'
        }
      };
    }
  },

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: this.getGentleAuthError(error.message),
            code: error.message
          }
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: "Let's try signing you in again",
          code: 'unexpected_error'
        }
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          error: {
            message: "Having trouble signing out, but you're safe to close the app",
            code: error.message
          }
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: "You're safely signed out",
          code: 'unexpected_error'
        }
      };
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        return {
          user: null,
          error: {
            message: "Let's sign you in to continue",
            code: error.message
          }
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email!,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        error: null
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: "Let's sign you in to continue",
          code: 'unexpected_error'
        }
      };
    }
  },

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { user } = await this.getCurrentUser();
    return user !== null;
  },

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        email_confirmed_at: session.user.email_confirmed_at,
        created_at: session.user.created_at
      } : null;

      callback(user);
    });
  },

  /**
   * Convert technical auth errors to gentle user messages
   */
  getGentleAuthError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email or password doesn\'t match our records',
      'Email not confirmed': 'Please check your email and click the confirmation link',
      'User already registered': 'This email is already registered. Try signing in instead?',
      'Password should be at least 6 characters': 'Password needs to be at least 6 characters',
      'Invalid email': 'Please check that email address',
      'Too many requests': 'Let\'s take a quick break and try again in a moment',
      'Network request failed': 'Having trouble connecting. Check your internet and try again',
      'User not found': 'Email or password doesn\'t match our records',
    };

    // Find matching error message
    for (const [key, gentleMessage] of Object.entries(errorMap)) {
      if (errorMessage.includes(key)) {
        return gentleMessage;
      }
    }

    // Default gentle message for unknown errors
    return 'Something unexpected happened. Let\'s try that again';
  }
};
```

### Task 2: Create Basic Subscription Service
**Create**: `src/services/subscriptionService.ts`
```typescript
import { supabase } from './supabaseClient';
import type { Database } from '../types/database';

type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];
type SubscriptionInsert = Database['public']['Tables']['user_subscriptions']['Insert'];

export interface SubscriptionResponse {
  data: UserSubscription | null;
  error: string | null;
}

export const subscriptionService = {
  /**
   * Initialize free subscription for new user
   */
  async initializeSubscription(userId: string): Promise<SubscriptionResponse> {
    try {
      const subscriptionData: SubscriptionInsert = {
        user_id: userId,
        tier: 'free',
        ai_requests_used: 0,
        ai_requests_limit: 10
      };

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) {
        console.error('Subscription initialization failed:', error);
        return {
          data: null,
          error: 'Could not set up your account preferences'
        };
      }

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Unexpected subscription error:', error);
      return {
        data: null,
        error: 'Could not set up your account preferences'
      };
    }
  },

  /**
   * Get user's subscription information
   */
  async getSubscriptionInfo(userId: string): Promise<SubscriptionResponse> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Failed to get subscription:', error);
        return {
          data: null,
          error: 'Could not load your account information'
        };
      }

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Unexpected subscription fetch error:', error);
      return {
        data: null,
        error: 'Could not load your account information'
      };
    }
  },

  /**
   * Check if user has subscription (create if missing)
   */
  async ensureSubscriptionExists(userId: string): Promise<SubscriptionResponse> {
    // First try to get existing subscription
    const existing = await this.getSubscriptionInfo(userId);
    
    if (existing.data) {
      return existing;
    }

    // If no subscription exists, create one
    console.log('No subscription found, initializing for user:', userId);
    return await this.initializeSubscription(userId);
  }
};
```

### Task 3: Create User Session Management
**Create**: `src/services/userSessionService.ts`
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, AuthUser } from './authService';
import { subscriptionService } from './subscriptionService';

interface UserSession {
  user: AuthUser;
  lastActivity: string;
  subscriptionTier: 'free' | 'premium';
}

export const userSessionService = {
  /**
   * Initialize user session with subscription check
   */
  async initializeSession(user: AuthUser): Promise<UserSession | null> {
    try {
      // Ensure user has a subscription
      const { data: subscription } = await subscriptionService.ensureSubscriptionExists(user.id);
      
      const session: UserSession = {
        user,
        lastActivity: new Date().toISOString(),
        subscriptionTier: subscription?.tier || 'free'
      };

      // Store session locally for offline access
      await AsyncStorage.setItem('userSession', JSON.stringify(session));

      return session;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      return null;
    }
  },

  /**
   * Get current session from storage
   */
  async getCurrentSession(): Promise<UserSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  },

  /**
   * Update last activity timestamp
   */
  async updateActivity(): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      if (session) {
        session.lastActivity = new Date().toISOString();
        await AsyncStorage.setItem('userSession', JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to update activity:', error);
    }
  },

  /**
   * Clear session on logout
   */
  async clearSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem('userSession');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },

  /**
   * Check if session is valid (user still authenticated)
   */
  async validateSession(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session) return false;

      // Check with Supabase if user is still authenticated
      const { user } = await authService.getCurrentUser();
      return user !== null && user.id === session.user.id;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  }
};
```

### Task 4: Create Authentication Hook for React Components
**Create**: `src/hooks/useAuth.ts`
```typescript
import { useState, useEffect } from 'react';
import { authService, AuthUser } from '../services/authService';
import { userSessionService } from '../services/userSessionService';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkExistingSession = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        
        if (user && !error) {
          // Initialize session
          await userSessionService.initializeSession(user);
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true
          });
        } else {
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false
          });
        }
      } catch (error) {
        setState({
          user: null,
          loading: false,
          error: 'Could not restore your session',
          isAuthenticated: false
        });
      }
    };

    checkExistingSession();

    // Listen for auth state changes
    const { data: authListener } = authService.onAuthStateChange(async (user) => {
      if (user) {
        await userSessionService.initializeSession(user);
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true
        }));
      } else {
        await userSessionService.clearSession();
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false
        }));
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const { user, error } = await authService.signIn(email, password);

    if (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return false;
    }

    if (user) {
      await userSessionService.initializeSession(user);
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
      return true;
    }

    return false;
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    const { user, error } = await authService.signUp(email, password);

    if (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return false;
    }

    if (user) {
      await userSessionService.initializeSession(user);
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
      return true;
    }

    return false;
  };

  const signOut = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    await authService.signOut();
    await userSessionService.clearSession();

    setState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false
    });
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    clearError
  };
};
```

### Task 5: Create Database Trigger for Subscription Initialization
**Run in Supabase SQL Editor:**
```sql
-- Function to automatically create subscription on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, tier, ai_requests_used, ai_requests_limit)
  VALUES (NEW.id, 'free', 0, 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Task 6: Create Authentication Tests
**Create**: `src/services/__tests__/authService.test.ts`
```typescript
import { authService } from '../authService';
import { subscriptionService } from '../subscriptionService';

// Mock Supabase
jest.mock('../supabaseClient');

describe('Authentication Service', () => {
  test('should handle signup with gentle error messages', async () => {
    const result = await authService.signUp('invalid-email', 'short');
    
    expect(result.user).toBeNull();
    expect(result.error?.message).not.toContain('Invalid');
    expect(result.error?.message).toBeDefined();
  });

  test('should handle signin with gentle error messages', async () => {
    const result = await authService.signIn('wrong@email.com', 'wrongpassword');
    
    expect(result.user).toBeNull();
    expect(result.error?.message).toContain('doesn\'t match');
    expect(result.error?.message).not.toContain('failed');
  });

  test('should validate existing session', async () => {
    const isAuthenticated = await authService.isAuthenticated();
    expect(typeof isAuthenticated).toBe('boolean');
  });

  test('should convert technical errors to gentle messages', () => {
    const gentleMessage = authService.getGentleAuthError('Invalid login credentials');
    expect(gentleMessage).toBe('Email or password doesn\'t match our records');
    expect(gentleMessage).not.toContain('Invalid');
  });
});

describe('Subscription Integration', () => {
  test('should initialize subscription for new user', async () => {
    const mockUserId = 'test-user-id';
    const result = await subscriptionService.initializeSubscription(mockUserId);
    
    expect(result.error).toBeNull();
    expect(result.data?.tier).toBe('free');
    expect(result.data?.ai_requests_limit).toBe(10);
  });

  test('should ensure subscription exists', async () => {
    const mockUserId = 'test-user-id';
    const result = await subscriptionService.ensureSubscriptionExists(mockUserId);
    
    expect(result.data).toBeTruthy();
  });
});
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 2D
- [ ] User can sign up with email/password
- [ ] Free subscription automatically created on signup
- [ ] User can sign in with correct credentials
- [ ] User can sign out successfully
- [ ] Authentication state persists across app restarts
- [ ] Invalid credentials show gentle error messages
- [ ] Session management works offline
- [ ] Auth state changes trigger callbacks
- [ ] Database trigger creates subscriptions automatically

### Validation Commands
```bash
# Test authentication service
npm test src/services/__tests__/authService.test.ts

# Test TypeScript compilation
npx tsc --noEmit src/services/authService.ts
npx tsc --noEmit src/hooks/useAuth.ts

# Test database trigger
# (Manual test in Supabase dashboard)
```

### Manual Testing Steps
1. **Test signup flow:**
   - Sign up with valid email/password
   - Check Supabase dashboard for new user
   - Check user_subscriptions table for new record
2. **Test signin flow:**
   - Sign in with correct credentials
   - Try invalid credentials (should show gentle error)
3. **Test session persistence:**
   - Sign in, close app, reopen (should stay signed in)

## What Sprint 2D Needs From This Sprint
- Working authentication service
- User session management
- Subscription initialization
- Auth hook for React components
- Gentle error handling patterns

## Interface Contracts (For Sprint 2D)
```typescript
// Authentication hook for React components
export const useAuth: () => {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

// Subscription service for data operations
export const subscriptionService: {
  getSubscriptionInfo: (userId: string) => Promise<SubscriptionResponse>;
  ensureSubscriptionExists: (userId: string) => Promise<SubscriptionResponse>;
};
```

## Common Mistakes to Avoid
- Don't skip subscription initialization on signup
- Don't expose sensitive auth tokens in logs
- Don't use technical error messages in UI
- Don't forget to clear sessions on logout
- Don't bypass session validation

## Files Created This Sprint
- `src/services/authService.ts`
- `src/services/subscriptionService.ts`
- `src/services/userSessionService.ts`
- `src/hooks/useAuth.ts`
- `src/services/__tests__/authService.test.ts`
- Database trigger for automatic subscription creation

## Next Sprint Preview
Sprint 2D will create the brain state CRUD service with validation, offline caching, and integration with the authentication system.

---
**Sprint 2C Focus**: Secure user authentication that other features depend upon.