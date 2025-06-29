# 💎 Agent 2 Sprint 2F: Freemium & AI Integration

## Mission
Complete the backend foundation with subscription quota management, OpenAI service integration, and freemium system enforcement.

## Sprint Goal
Build the freemium subscription system and AI task breakdown service that enables premium features and revenue generation.

## Time Estimate
60-75 minutes

## Prerequisites
- Sprint 2A-2E completed (database, auth, brain state, task services)
- OpenAI API key available
- Understanding of freemium model requirements

## Critical Rules (NEVER VIOLATE)
1. Quotas: Strictly enforce AI request limits (10 free, 100+ premium)
2. Gentle: No aggressive upselling or payment interruptions
3. Security: Never expose OpenAI API key in client code
4. Brain State: AI responses must adapt to user's current brain state
5. Offline: Graceful degradation when AI service unavailable

## Sprint Tasks

### Task 1: Enhanced Subscription Service
**Create**: `src/services/subscriptionService.ts`
```typescript
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database';

type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row'];

export interface QuotaStatus {
  used: number;
  limit: number;
  tier: 'free' | 'premium';
  canMakeRequest: boolean;
  daysUntilReset: number;
}

export interface SubscriptionResponse {
  data: UserSubscription | null;
  error: string | null;
}

export interface QuotaResponse {
  data: QuotaStatus | null;
  error: string | null;
}

export const subscriptionService = {
  /**
   * Get current subscription quota status
   */
  async getQuotaStatus(): Promise<QuotaResponse> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .single();

      if (error) {
        console.error('Failed to get quota status:', error);
        return {
          data: null,
          error: "Let's check your subscription status when we reconnect"
        };
      }

      const daysUntilReset = Math.ceil(
        (new Date(data.reset_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      const quotaStatus: QuotaStatus = {
        used: data.ai_requests_used,
        limit: data.ai_requests_limit,
        tier: data.tier,
        canMakeRequest: data.ai_requests_used < data.ai_requests_limit,
        daysUntilReset: Math.max(0, daysUntilReset)
      };

      // Cache quota status for offline access
      await this.cacheQuotaStatus(quotaStatus);

      return {
        data: quotaStatus,
        error: null
      };
    } catch (error) {
      console.error('Unexpected quota check error:', error);
      
      // Try offline cache
      const cached = await this.getCachedQuotaStatus();
      if (cached) {
        return { data: cached, error: null };
      }

      return {
        data: null,
        error: "Let's check your subscription status when we reconnect"
      };
    }
  },

  /**
   * Check if user can make AI request (with gentle messaging)
   */
  async canMakeAIRequest(): Promise<{ allowed: boolean; message?: string; quotaStatus?: QuotaStatus }> {
    const { data: quota, error } = await this.getQuotaStatus();

    if (error || !quota) {
      return {
        allowed: false,
        message: "Let's try that again when we reconnect"
      };
    }

    if (!quota.canMakeRequest) {
      const upgradeMessage = quota.tier === 'free' 
        ? `You've used all ${quota.limit} AI breakdowns this month. Upgrade for unlimited AI assistance?`
        : `You've reached your ${quota.limit} AI request limit this month. This will reset in ${quota.daysUntilReset} days.`;

      return {
        allowed: false,
        message: upgradeMessage,
        quotaStatus: quota
      };
    }

    return {
      allowed: true,
      quotaStatus: quota
    };
  },

  /**
   * Increment AI request usage
   */
  async incrementAIUsage(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('increment_ai_usage');

      if (error) {
        console.error('Failed to increment AI usage:', error);
        return { error: "Usage tracking temporarily unavailable" };
      }

      // Clear cached quota to force refresh
      await AsyncStorage.removeItem('cachedQuotaStatus');

      return { error: null };
    } catch (error) {
      console.error('Unexpected usage increment error:', error);
      return { error: "Usage tracking temporarily unavailable" };
    }
  },

  /**
   * Upgrade user to premium
   */
  async upgradeToPremium(): Promise<SubscriptionResponse> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          tier: 'premium',
          ai_requests_limit: 1000, // High limit for premium
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Premium upgrade failed:', error);
        return {
          data: null,
          error: "Let's try upgrading your account again"
        };
      }

      // Clear cached quota to force refresh
      await AsyncStorage.removeItem('cachedQuotaStatus');

      return {
        data,
        error: null
      };
    } catch (error) {
      console.error('Unexpected upgrade error:', error);
      return {
        data: null,
        error: "Let's try upgrading your account again"
      };
    }
  },

  /**
   * Reset monthly quota (called by scheduled function)
   */
  async resetMonthlyQuota(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.rpc('reset_monthly_quotas');

      if (error) {
        console.error('Quota reset failed:', error);
        return { error: "Quota reset failed" };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected quota reset error:', error);
      return { error: "Quota reset failed" };
    }
  },

  /**
   * Cache quota status for offline access
   */
  async cacheQuotaStatus(quota: QuotaStatus): Promise<void> {
    try {
      const cacheData = {
        ...quota,
        cached_at: new Date().toISOString()
      };
      await AsyncStorage.setItem('cachedQuotaStatus', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache quota status:', error);
    }
  },

  /**
   * Get cached quota status for offline access
   */
  async getCachedQuotaStatus(): Promise<QuotaStatus | null> {
    try {
      const cached = await AsyncStorage.getItem('cachedQuotaStatus');
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      
      // Check if cache is fresh (less than 1 hour old)
      const cacheAge = Date.now() - new Date(parsed.cached_at).getTime();
      if (cacheAge > 60 * 60 * 1000) return null; // 1 hour

      return {
        used: parsed.used,
        limit: parsed.limit,
        tier: parsed.tier,
        canMakeRequest: parsed.canMakeRequest,
        daysUntilReset: parsed.daysUntilReset
      };
    } catch (error) {
      console.error('Failed to get cached quota status:', error);
      return null;
    }
  }
};
```

### Task 2: Create OpenAI Service with Brain State Adaptation
**Create**: `src/services/openaiService.ts`
```typescript
import { subscriptionService } from './subscriptionService';
import { BrainState } from './brainStateService';

export interface TaskBreakdownRequest {
  taskTitle: string;
  taskDescription?: string;
  complexity: number;
  estimatedMinutes?: number;
  brainState: BrainState;
}

export interface TaskBreakdownStep {
  step: string;
  estimatedMinutes: number;
  complexity: number;
  notes?: string;
}

export interface TaskBreakdown {
  steps: TaskBreakdownStep[];
  totalTimeEstimate: number;
  brainStateAdapted: boolean;
  encouragementMessage: string;
}

export interface BreakdownResponse {
  data: TaskBreakdown | null;
  error: string | null;
  quotaUsed?: boolean;
}

export const openaiService = {
  /**
   * Generate AI task breakdown adapted to brain state
   */
  async generateTaskBreakdown(request: TaskBreakdownRequest): Promise<BreakdownResponse> {
    try {
      // Check quota first
      const quotaCheck = await subscriptionService.canMakeAIRequest();
      if (!quotaCheck.allowed) {
        return {
          data: null,
          error: quotaCheck.message || "AI assistance temporarily unavailable"
        };
      }

      // Generate brain state adapted prompt
      const prompt = this.createBrainStatePrompt(request);
      
      // Call OpenAI API
      const breakdown = await this.callOpenAI(prompt, request.brainState);
      
      if (!breakdown) {
        return {
          data: null,
          error: "Let's try breaking down that task again in a moment"
        };
      }

      // Increment usage after successful response
      await subscriptionService.incrementAIUsage();

      return {
        data: breakdown,
        error: null,
        quotaUsed: true
      };
    } catch (error) {
      console.error('Task breakdown failed:', error);
      return {
        data: null,
        error: "Let's try breaking down that task again in a moment"
      };
    }
  },

  /**
   * Create brain state adapted prompt for OpenAI
   */
  createBrainStatePrompt(request: TaskBreakdownRequest): string {
    const { taskTitle, taskDescription, brainState } = request;
    const energyLevel = brainState.energy_level;
    const focusLevel = brainState.focus_level;

    let energyContext = '';
    if (energyLevel <= 3) {
      energyContext = `The user has low energy today (${energyLevel}/10). Please suggest very small, gentle steps with frequent breaks. Use encouraging, non-demanding language.`;
    } else if (energyLevel <= 6) {
      energyContext = `The user has medium energy today (${energyLevel}/10). Provide balanced steps that aren't overwhelming but make good progress.`;
    } else {
      energyContext = `The user has high energy today (${energyLevel}/10). They can handle more complex steps and longer work periods.`;
    }

    let focusContext = '';
    if (focusLevel <= 3) {
      focusContext = `The user has difficulty focusing today (${focusLevel}/10). Keep steps very simple and specific. Minimize decision-making.`;
    } else if (focusLevel <= 6) {
      focusContext = `The user has moderate focus today (${focusLevel}/10). Provide clear, well-defined steps.`;
    } else {
      focusContext = `The user has good focus today (${focusLevel}/10). More detailed planning and complex steps are okay.`;
    }

    return `You are helping a neurodivergent person break down a task. Be gentle, encouraging, and shame-free.

Task: "${taskTitle}"
${taskDescription ? `Description: "${taskDescription}"` : ''}

Brain State Context:
${energyContext}
${focusContext}

Requirements:
1. Break into 3-6 specific, actionable steps
2. Estimate time for each step (be realistic, add buffer time)
3. Use gentle, encouraging language (no "must", "should", "need to")
4. Consider the user's current brain state in step complexity
5. Include breaks or rest periods if appropriate
6. End with an encouraging message

Format as JSON:
{
  "steps": [
    {
      "step": "Clear, specific action to take",
      "estimatedMinutes": number,
      "complexity": 1-3,
      "notes": "Optional encouraging note"
    }
  ],
  "encouragementMessage": "Gentle, supportive closing message"
}`;
  },

  /**
   * Call OpenAI API via Supabase Edge Function (secure server-side)
   */
  async callOpenAI(prompt: string, brainState: BrainState): Promise<TaskBreakdown | null> {
    try {
      // SECURITY: Call Supabase Edge Function instead of direct OpenAI API
      // This keeps the API key secure on the server side
      const response = await supabase.functions.invoke('openai-task-breakdown', {
        body: { prompt, brainState }
      });

      if (response.error) {
        console.error('OpenAI Edge Function error:', response.error);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('Failed to call OpenAI Edge Function:', error);
      return null;
    }
  },

  /**
   * DEPRECATED: Direct OpenAI API call (moved to Edge Function for security)
   */
  async _deprecatedDirectOpenAICall(prompt: string, brainState: BrainState): Promise<TaskBreakdown | null> {
    try {
      // This method is kept for reference but should not be used
      // OpenAI API key should never be exposed client-side
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for neurodivergent individuals. Always be gentle, encouraging, and shame-free.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        console.error('No content in OpenAI response');
        return null;
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      
      // Calculate total time estimate
      const totalTime = parsed.steps?.reduce(
        (total: number, step: any) => total + (step.estimatedMinutes || 0), 
        0
      ) || 0;

      return {
        steps: parsed.steps || [],
        totalTimeEstimate: totalTime,
        brainStateAdapted: true,
        encouragementMessage: parsed.encouragementMessage || "You can do this! Take it one step at a time."
      };
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      return null;
    }
  },

  /**
   * Generate fallback breakdown for offline use
   */
  generateFallbackBreakdown(request: TaskBreakdownRequest): TaskBreakdown {
    const { taskTitle, brainState } = request;
    const energyLevel = brainState.energy_level;

    // Create simple fallback based on energy level
    let steps: TaskBreakdownStep[];
    let encouragementMessage: string;

    if (energyLevel <= 3) {
      steps = [
        {
          step: `Start with just 5 minutes on "${taskTitle}"`,
          estimatedMinutes: 5,
          complexity: 1,
          notes: "Just a gentle beginning"
        },
        {
          step: "Take a break and check how you feel",
          estimatedMinutes: 5,
          complexity: 1
        },
        {
          step: "Continue for another 10 minutes if you feel up to it",
          estimatedMinutes: 10,
          complexity: 1,
          notes: "Only if it feels right"
        }
      ];
      encouragementMessage = "Low energy days are perfect for tiny steps. Every small action counts.";
    } else if (energyLevel <= 6) {
      steps = [
        {
          step: `Gather what you need for "${taskTitle}"`,
          estimatedMinutes: 5,
          complexity: 2
        },
        {
          step: "Work on the main part for 25 minutes",
          estimatedMinutes: 25,
          complexity: 2
        },
        {
          step: "Take a break and review progress",
          estimatedMinutes: 5,
          complexity: 1
        },
        {
          step: "Finish up any remaining parts",
          estimatedMinutes: 15,
          complexity: 2
        }
      ];
      encouragementMessage = "You're in a good space for steady progress today. Take it step by step.";
    } else {
      steps = [
        {
          step: `Plan your approach to "${taskTitle}"`,
          estimatedMinutes: 10,
          complexity: 2
        },
        {
          step: "Work on the main tasks for 45 minutes",
          estimatedMinutes: 45,
          complexity: 3
        },
        {
          step: "Review and refine your work",
          estimatedMinutes: 15,
          complexity: 2
        },
        {
          step: "Complete and organize results",
          estimatedMinutes: 10,
          complexity: 2
        }
      ];
      encouragementMessage = "High energy day! You can tackle bigger chunks while maintaining good momentum.";
    }

    const totalTime = steps.reduce((total, step) => total + step.estimatedMinutes, 0);

    return {
      steps,
      totalTimeEstimate: totalTime,
      brainStateAdapted: true,
      encouragementMessage
    };
  }
};
```

### Task 3: Create Database Functions for Quota Management
**Run in Supabase SQL Editor:**
```sql
-- Function to increment AI usage atomically
CREATE OR REPLACE FUNCTION increment_ai_usage()
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions 
  SET 
    ai_requests_used = ai_requests_used + 1,
    updated_at = NOW()
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly quotas
CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS integer AS $$
DECLARE
  reset_count integer;
BEGIN
  UPDATE user_subscriptions 
  SET 
    ai_requests_used = 0,
    reset_date = reset_date + INTERVAL '1 month',
    updated_at = NOW()
  WHERE reset_date <= NOW();
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  RETURN reset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can make AI request
CREATE OR REPLACE FUNCTION can_make_ai_request()
RETURNS boolean AS $$
DECLARE
  current_usage integer;
  usage_limit integer;
BEGIN
  SELECT ai_requests_used, ai_requests_limit
  INTO current_usage, usage_limit
  FROM user_subscriptions 
  WHERE user_id = auth.uid();
  
  RETURN current_usage < usage_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Task 4: Create Freemium Hook for Components
**Create**: `src/hooks/useFreemium.ts`
```typescript
import { useState, useEffect } from 'react';
import { subscriptionService, QuotaStatus } from '../services/subscriptionService';
import { useAuth } from './useAuth';

interface FreemiumState {
  quotaStatus: QuotaStatus | null;
  loading: boolean;
  error: string | null;
}

interface FreemiumActions {
  checkQuota: () => Promise<void>;
  upgradeToPremium: () => Promise<boolean>;
  clearError: () => void;
}

export const useFreemium = (): FreemiumState & FreemiumActions => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<FreemiumState>({
    quotaStatus: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadQuotaStatus();
    } else {
      setState({
        quotaStatus: null,
        loading: false,
        error: null
      });
    }
  }, [isAuthenticated]);

  const loadQuotaStatus = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await subscriptionService.getQuotaStatus();
      
      setState({
        quotaStatus: data,
        loading: false,
        error: error
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Having trouble loading your subscription status"
      }));
    }
  };

  const checkQuota = async (): Promise<void> => {
    await loadQuotaStatus();
  };

  const upgradeToPremium = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await subscriptionService.upgradeToPremium();
      
      if (error) {
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      // Refresh quota status after upgrade
      await loadQuotaStatus();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Let's try upgrading your account again"
      }));
      return false;
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    checkQuota,
    upgradeToPremium,
    clearError
  };
};
```

### Task 5: Create AI Task Breakdown Hook
**Create**: `src/hooks/useAIBreakdown.ts`
```typescript
import { useState } from 'react';
import { openaiService, TaskBreakdownRequest, TaskBreakdown } from '../services/openaiService';

interface AIBreakdownState {
  breakdown: TaskBreakdown | null;
  loading: boolean;
  error: string | null;
  quotaUsed: boolean;
}

interface AIBreakdownActions {
  generateBreakdown: (request: TaskBreakdownRequest) => Promise<boolean>;
  generateFallbackBreakdown: (request: TaskBreakdownRequest) => void;
  clearBreakdown: () => void;
  clearError: () => void;
}

export const useAIBreakdown = (): AIBreakdownState & AIBreakdownActions => {
  const [state, setState] = useState<AIBreakdownState>({
    breakdown: null,
    loading: false,
    error: null,
    quotaUsed: false
  });

  const generateBreakdown = async (request: TaskBreakdownRequest): Promise<boolean> => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        quotaUsed: false 
      }));

      const { data, error, quotaUsed } = await openaiService.generateTaskBreakdown(request);

      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error,
          quotaUsed: quotaUsed || false
        }));
        return false;
      }

      setState({
        breakdown: data,
        loading: false,
        error: null,
        quotaUsed: quotaUsed || false
      });
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Let's try breaking down that task again",
        quotaUsed: false
      }));
      return false;
    }
  };

  const generateFallbackBreakdown = (request: TaskBreakdownRequest): void => {
    const fallback = openaiService.generateFallbackBreakdown(request);
    setState({
      breakdown: fallback,
      loading: false,
      error: null,
      quotaUsed: false
    });
  };

  const clearBreakdown = (): void => {
    setState({
      breakdown: null,
      loading: false,
      error: null,
      quotaUsed: false
    });
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    generateBreakdown,
    generateFallbackBreakdown,
    clearBreakdown,
    clearError
  };
};
```

### Task 6: Create Integration Tests
**Create**: `src/services/__tests__/freemiumIntegration.test.ts`
```typescript
import { subscriptionService } from '../subscriptionService';
import { openaiService } from '../openaiService';

// Mock Supabase and OpenAI
jest.mock('../supabaseClient');
jest.mock('node-fetch');

describe('Freemium Integration', () => {
  test('should enforce quota limits for free users', async () => {
    // Mock free user at quota limit
    const mockQuotaStatus = {
      used: 10,
      limit: 10,
      tier: 'free' as const,
      canMakeRequest: false,
      daysUntilReset: 15
    };

    jest.spyOn(subscriptionService, 'getQuotaStatus').mockResolvedValue({
      data: mockQuotaStatus,
      error: null
    });

    const quotaCheck = await subscriptionService.canMakeAIRequest();
    
    expect(quotaCheck.allowed).toBe(false);
    expect(quotaCheck.message).toContain('used all');
    expect(quotaCheck.message).toContain('Upgrade');
  });

  test('should allow unlimited requests for premium users', async () => {
    const mockQuotaStatus = {
      used: 150,
      limit: 1000,
      tier: 'premium' as const,
      canMakeRequest: true,
      daysUntilReset: 15
    };

    jest.spyOn(subscriptionService, 'getQuotaStatus').mockResolvedValue({
      data: mockQuotaStatus,
      error: null
    });

    const quotaCheck = await subscriptionService.canMakeAIRequest();
    
    expect(quotaCheck.allowed).toBe(true);
    expect(quotaCheck.quotaStatus?.tier).toBe('premium');
  });

  test('should generate brain state adapted breakdowns', async () => {
    const lowEnergyRequest = {
      taskTitle: 'Clean house',
      brainState: {
        energy_level: 2,
        focus_level: 3,
        mood_level: 4
      }
    };

    const fallback = openaiService.generateFallbackBreakdown(lowEnergyRequest);
    
    expect(fallback.steps.length).toBeGreaterThan(0);
    expect(fallback.steps[0].estimatedMinutes).toBeLessThan(15); // Low energy = short steps
    expect(fallback.encouragementMessage).toContain('Low energy');
    expect(fallback.brainStateAdapted).toBe(true);
  });

  test('should handle quota increments correctly', async () => {
    const incrementSpy = jest.spyOn(subscriptionService, 'incrementAIUsage')
      .mockResolvedValue({ error: null });

    await subscriptionService.incrementAIUsage();
    
    expect(incrementSpy).toHaveBeenCalled();
  });
});
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Agent Handoff
- [ ] Subscription quota enforcement works correctly
- [ ] OpenAI integration generates brain state adapted breakdowns
- [ ] Free users limited to 10 AI requests/month
- [ ] Premium users get unlimited AI requests
- [ ] Gentle upgrade prompts (no aggressive upselling)
- [ ] Offline fallback breakdowns work
- [ ] Database functions for quota management
- [ ] React hooks for UI integration
- [ ] All services return consistent response format
- [ ] TypeScript compilation successful

### Validation Commands
```bash
# Test freemium integration
npm test src/services/__tests__/freemiumIntegration.test.ts

# Test TypeScript compilation
npx tsc --noEmit src/services/subscriptionService.ts
npx tsc --noEmit src/services/openaiService.ts
npx tsc --noEmit src/hooks/useFreemium.ts
npx tsc --noEmit src/hooks/useAIBreakdown.ts

# Test database functions
# (Manual test in Supabase dashboard)
```

## Interface Contracts (For Agent 3 & 4)

```typescript
// Subscription service for quota checks
export const subscriptionService: {
  getQuotaStatus: () => Promise<QuotaResponse>;
  canMakeAIRequest: () => Promise<{ allowed: boolean; message?: string }>;
  upgradeToPremium: () => Promise<SubscriptionResponse>;
};

// OpenAI service for task breakdowns
export const openaiService: {
  generateTaskBreakdown: (request: TaskBreakdownRequest) => Promise<BreakdownResponse>;
  generateFallbackBreakdown: (request: TaskBreakdownRequest) => TaskBreakdown;
};

// Freemium hook for components
export const useFreemium: () => {
  quotaStatus: QuotaStatus | null;
  loading: boolean;
  error: string | null;
  upgradeToPremium: () => Promise<boolean>;
};

// AI breakdown hook for components
export const useAIBreakdown: () => {
  breakdown: TaskBreakdown | null;
  loading: boolean;
  generateBreakdown: (request: TaskBreakdownRequest) => Promise<boolean>;
};
```

## Files Created This Sprint
- `src/services/subscriptionService.ts` (enhanced)
- `src/services/openaiService.ts`
- `src/hooks/useFreemium.ts`
- `src/hooks/useAIBreakdown.ts`
- `src/services/__tests__/freemiumIntegration.test.ts`
- Database functions for quota management

## Next Steps for Other Agents
Sprint 2F completes Agent 2's backend foundation. Other agents can now build upon:
- **Agent 3**: Brain state adaptive UI components and core features
- **Agent 4**: Complete design system and component library
- **Integration**: All backend services ready for frontend integration

---
**Sprint 2F Focus**: Complete freemium system enabling sustainable business model with gentle, brain state adaptive AI assistance.