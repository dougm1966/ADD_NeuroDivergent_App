# 🧠 Agent 2 Sprint 2D: Brain State CRUD

## Mission
Implement brain state management service with validation, offline caching, and gentle error handling.

## Sprint Goal
Build robust brain state operations that Agent 3 can use for adaptive app behavior and task filtering.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 2A completed (Supabase connection working)
- Sprint 2B completed (database schema with brain_states table)
- Sprint 2C completed (authentication and session management)

## Critical Rules (NEVER VIOLATE)
1. Validation: Enforce 1-10 constraints for all brain state levels
2. Offline: Support AsyncStorage fallbacks for core functionality
3. Errors: Use gentle, shame-free error messages
4. Caching: Cache today's brain state for quick access
5. Types: Use exact TypeScript interfaces from database schema

## Sprint Tasks

### Task 1: Create Brain State Service
**Create**: `src/services/brainStateService.ts`
```typescript
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database';

type BrainStateRow = Database['public']['Tables']['brain_states']['Row'];
type BrainStateInsert = Database['public']['Tables']['brain_states']['Insert'];

export interface BrainState {
  id?: string;
  user_id?: string;
  energy_level: number; // 1-10
  focus_level: number; // 1-10
  mood_level: number; // 1-10
  notes?: string;
  created_at?: string;
}

export interface BrainStateResponse {
  data: BrainState | null;
  error: string | null;
}

export interface BrainStateListResponse {
  data: BrainState[] | null;
  error: string | null;
}

export const brainStateService = {
  /**
   * Create new brain state entry
   */
  async createBrainState(state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>): Promise<BrainStateResponse> {
    try {
      // Validate input
      const validation = this.validateBrainState(state);
      if (!validation.isValid) {
        return {
          data: null,
          error: validation.message || 'Please check your input'
        };
      }

      const { data, error } = await supabase
        .from('brain_states')
        .insert({
          energy_level: state.energy_level,
          focus_level: state.focus_level,
          mood_level: state.mood_level,
          notes: state.notes?.trim() || null
        })
        .select()
        .single();

      if (error) {
        console.error('Brain state creation failed:', error);
        return {
          data: null,
          error: "Let's try recording your brain state again"
        };
      }

      // Cache locally for offline access
      await this.cacheTodaysBrainState(data);

      return {
        data: this.formatBrainState(data),
        error: null
      };
    } catch (error) {
      console.error('Unexpected brain state error:', error);
      return {
        data: null,
        error: "Let's try that again in a moment"
      };
    }
  },

  /**
   * Get today's brain state
   */
  async getTodaysBrainState(): Promise<BrainStateResponse> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('brain_states')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Failed to get today\'s brain state:', error);
        
        // Try offline cache
        const cached = await this.getCachedTodaysBrainState();
        if (cached) {
          return { data: cached, error: null };
        }

        return {
          data: null,
          error: "Let's check your brain state when we reconnect"
        };
      }

      const brainState = data ? this.formatBrainState(data) : null;
      
      // Update cache if we got data
      if (brainState) {
        await this.cacheTodaysBrainState(brainState);
      }

      return {
        data: brainState,
        error: null
      };
    } catch (error) {
      console.error('Unexpected brain state fetch error:', error);
      
      // Try offline cache
      const cached = await this.getCachedTodaysBrainState();
      if (cached) {
        return { data: cached, error: null };
      }

      return {
        data: null,
        error: "Let's check your brain state when we reconnect"
      };
    }
  },

  /**
   * Get brain state history
   */
  async getBrainStateHistory(limit = 30): Promise<BrainStateListResponse> {
    try {
      const { data, error } = await supabase
        .from('brain_states')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to get brain state history:', error);
        return {
          data: null,
          error: "Having trouble loading your history right now"
        };
      }

      return {
        data: data?.map(item => this.formatBrainState(item)) || [],
        error: null
      };
    } catch (error) {
      console.error('Unexpected history fetch error:', error);
      return {
        data: null,
        error: "Having trouble loading your history right now"
      };
    }
  },

  /**
   * Update existing brain state
   */
  async updateBrainState(id: string, updates: Partial<BrainState>): Promise<BrainStateResponse> {
    try {
      // Validate updates
      if (updates.energy_level || updates.focus_level || updates.mood_level) {
        const validation = this.validateBrainState(updates as BrainState);
        if (!validation.isValid) {
          return {
            data: null,
            error: validation.message || 'Please check your input'
          };
        }
      }

      const updateData: any = {};
      if (updates.energy_level !== undefined) updateData.energy_level = updates.energy_level;
      if (updates.focus_level !== undefined) updateData.focus_level = updates.focus_level;
      if (updates.mood_level !== undefined) updateData.mood_level = updates.mood_level;
      if (updates.notes !== undefined) updateData.notes = updates.notes?.trim() || null;

      const { data, error } = await supabase
        .from('brain_states')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Brain state update failed:', error);
        return {
          data: null,
          error: "Let's try updating that again"
        };
      }

      // Update cache if this is today's brain state
      const today = new Date().toDateString();
      const updatedDate = new Date(data.created_at).toDateString();
      if (today === updatedDate) {
        await this.cacheTodaysBrainState(data);
      }

      return {
        data: this.formatBrainState(data),
        error: null
      };
    } catch (error) {
      console.error('Unexpected update error:', error);
      return {
        data: null,
        error: "Let's try updating that again"
      };
    }
  },

  /**
   * Validate brain state input
   */
  validateBrainState(state: Partial<BrainState>): { isValid: boolean; message?: string } {
    if (state.energy_level !== undefined) {
      if (!Number.isInteger(state.energy_level) || state.energy_level < 1 || state.energy_level > 10) {
        return { isValid: false, message: 'Energy level should be between 1 and 10' };
      }
    }

    if (state.focus_level !== undefined) {
      if (!Number.isInteger(state.focus_level) || state.focus_level < 1 || state.focus_level > 10) {
        return { isValid: false, message: 'Focus level should be between 1 and 10' };
      }
    }

    if (state.mood_level !== undefined) {
      if (!Number.isInteger(state.mood_level) || state.mood_level < 1 || state.mood_level > 10) {
        return { isValid: false, message: 'Mood level should be between 1 and 10' };
      }
    }

    if (state.notes && state.notes.length > 500) {
      return { isValid: false, message: 'Notes should be under 500 characters' };
    }

    return { isValid: true };
  },

  /**
   * Format brain state for consistent output
   */
  formatBrainState(raw: BrainStateRow): BrainState {
    return {
      id: raw.id,
      user_id: raw.user_id,
      energy_level: raw.energy_level,
      focus_level: raw.focus_level,
      mood_level: raw.mood_level,
      notes: raw.notes || undefined,
      created_at: raw.created_at
    };
  },

  /**
   * Cache today's brain state locally
   */
  async cacheTodaysBrainState(state: BrainState | BrainStateRow): Promise<void> {
    try {
      const cacheData = {
        ...state,
        cached_at: new Date().toISOString()
      };
      await AsyncStorage.setItem('todaysBrainState', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache brain state:', error);
    }
  },

  /**
   * Get cached brain state for offline access
   */
  async getCachedTodaysBrainState(): Promise<BrainState | null> {
    try {
      const cached = await AsyncStorage.getItem('todaysBrainState');
      if (!cached) return null;

      const parsed = JSON.parse(cached);
      const today = new Date().toDateString();
      const cachedDate = new Date(parsed.created_at).toDateString();

      // Only return if it's from today
      if (today === cachedDate) {
        return {
          id: parsed.id,
          user_id: parsed.user_id,
          energy_level: parsed.energy_level,
          focus_level: parsed.focus_level,
          mood_level: parsed.mood_level,
          notes: parsed.notes,
          created_at: parsed.created_at
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached brain state:', error);
      return null;
    }
  },

  /**
   * Get average brain state for adaptive features
   */
  getAverageBrainState(state: BrainState): number {
    return Math.round((state.energy_level + state.focus_level + state.mood_level) / 3);
  },

  /**
   * Get energy-based complexity filter level
   */
  getComplexityFilterLevel(state: BrainState): number {
    // Energy level drives task complexity filtering
    // Low energy (1-3) → Show only level 1-2 tasks
    // Medium energy (4-6) → Show level 1-3 tasks  
    // High energy (7-10) → Show level 1-5 tasks
    
    if (state.energy_level <= 3) return 2;
    if (state.energy_level <= 6) return 3;
    return 5;
  }
};
```

### Task 2: Create Brain State Utilities
**Create**: `src/utils/brainStateUtils.ts`
```typescript
import { BrainState } from '../services/brainStateService';

export const brainStateUtils = {
  /**
   * Get brain state category for UI adaptation
   */
  getBrainStateCategory(state: BrainState): 'low' | 'medium' | 'high' {
    const average = (state.energy_level + state.focus_level) / 2;
    
    if (average <= 3) return 'low';
    if (average <= 6) return 'medium';
    return 'high';
  },

  /**
   * Get encouraging message based on brain state
   */
  getEncouragingMessage(state: BrainState): string {
    const category = this.getBrainStateCategory(state);
    const energy = state.energy_level;
    const mood = state.mood_level;

    if (category === 'low') {
      if (mood <= 4) {
        return "Today feels tough, and that's completely okay. You're doing the best you can.";
      }
      return "Low energy days are perfect for gentle, small wins. Every tiny step counts.";
    }

    if (category === 'medium') {
      if (energy >= mood + 2) {
        return "You've got some good energy today! Let's channel it into something meaningful.";
      }
      return "You're in a great balanced space today. What feels right to work on?";
    }

    // High category
    if (energy >= 8 && mood >= 7) {
      return "You're feeling energetic and positive today! Great time for bigger challenges.";
    }
    return "High energy day! You can tackle some more complex tasks if you feel like it.";
  },

  /**
   * Get UI density recommendation
   */
  getUIComplexity(state: BrainState): 'minimal' | 'standard' | 'detailed' {
    const focusLevel = state.focus_level;
    
    if (focusLevel <= 3) return 'minimal';
    if (focusLevel <= 6) return 'standard';
    return 'detailed';
  },

  /**
   * Check if user should be shown encouragement
   */
  shouldShowEncouragement(state: BrainState): boolean {
    // Show encouragement for low mood or if it's a good day
    return state.mood_level <= 4 || state.mood_level >= 8;
  },

  /**
   * Get time estimation factor for tasks
   */
  getTimeEstimationFactor(state: BrainState): number {
    // Lower energy = tasks take longer
    // Factor ranges from 1.5 (low energy) to 0.8 (high energy)
    const energyFactor = state.energy_level / 10;
    return Math.max(0.8, Math.min(1.5, 2 - energyFactor));
  }
};
```

### Task 3: Create Brain State Hook for React Components
**Create**: `src/hooks/useBrainState.ts`
```typescript
import { useState, useEffect } from 'react';
import { brainStateService, BrainState, BrainStateResponse } from '../services/brainStateService';
import { useAuth } from './useAuth';

interface BrainStateHookState {
  todaysBrainState: BrainState | null;
  history: BrainState[];
  loading: boolean;
  error: string | null;
}

interface BrainStateHookActions {
  createBrainState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  updateBrainState: (id: string, updates: Partial<BrainState>) => Promise<boolean>;
  refreshTodaysBrainState: () => Promise<void>;
  clearError: () => void;
}

export const useBrainState = (): BrainStateHookState & BrainStateHookActions => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<BrainStateHookState>({
    todaysBrainState: null,
    history: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadTodaysBrainState();
    } else {
      setState({
        todaysBrainState: null,
        history: [],
        loading: false,
        error: null
      });
    }
  }, [isAuthenticated]);

  const loadTodaysBrainState = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await brainStateService.getTodaysBrainState();

      setState(prev => ({
        ...prev,
        todaysBrainState: data,
        loading: false,
        error: error
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Having trouble loading your brain state"
      }));
    }
  };

  const createBrainState = async (
    brainState: Omit<BrainState, 'id' | 'user_id' | 'created_at'>
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await brainStateService.createBrainState(brainState);

      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error
        }));
        return false;
      }

      setState(prev => ({
        ...prev,
        todaysBrainState: data,
        loading: false,
        error: null
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Let's try recording your brain state again"
      }));
      return false;
    }
  };

  const updateBrainState = async (
    id: string, 
    updates: Partial<BrainState>
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await brainStateService.updateBrainState(id, updates);

      if (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error
        }));
        return false;
      }

      setState(prev => ({
        ...prev,
        todaysBrainState: data,
        loading: false,
        error: null
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Let's try updating that again"
      }));
      return false;
    }
  };

  const refreshTodaysBrainState = async (): Promise<void> => {
    await loadTodaysBrainState();
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    createBrainState,
    updateBrainState,
    refreshTodaysBrainState,
    clearError
  };
};
```

### Task 4: Create Brain State Tests
**Create**: `src/services/__tests__/brainStateService.test.ts`
```typescript
import { brainStateService } from '../brainStateService';
import { brainStateUtils } from '../../utils/brainStateUtils';

// Mock Supabase
jest.mock('../supabaseClient');

describe('Brain State Service', () => {
  test('should validate brain state levels correctly', () => {
    const validState = {
      energy_level: 5,
      focus_level: 7,
      mood_level: 3
    };

    const validation = brainStateService.validateBrainState(validState);
    expect(validation.isValid).toBe(true);
  });

  test('should reject invalid energy levels', () => {
    const invalidState = {
      energy_level: 11, // Invalid: > 10
      focus_level: 5,
      mood_level: 5
    };

    const validation = brainStateService.validateBrainState(invalidState);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toContain('Energy level should be between 1 and 10');
  });

  test('should reject notes that are too long', () => {
    const longNotes = 'x'.repeat(501); // 501 characters
    const invalidState = {
      energy_level: 5,
      focus_level: 5,
      mood_level: 5,
      notes: longNotes
    };

    const validation = brainStateService.validateBrainState(invalidState);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toContain('Notes should be under 500 characters');
  });

  test('should handle offline caching', async () => {
    const mockState = {
      id: 'test-id',
      energy_level: 5,
      focus_level: 7,
      mood_level: 3,
      created_at: new Date().toISOString()
    };

    await brainStateService.cacheTodaysBrainState(mockState);
    const cached = await brainStateService.getCachedTodaysBrainState();
    
    expect(cached).toBeTruthy();
    expect(cached?.energy_level).toBe(5);
  });

  test('should calculate complexity filter level correctly', () => {
    const lowEnergyState = { energy_level: 2, focus_level: 3, mood_level: 4 };
    const mediumEnergyState = { energy_level: 5, focus_level: 6, mood_level: 7 };
    const highEnergyState = { energy_level: 9, focus_level: 8, mood_level: 8 };

    expect(brainStateService.getComplexityFilterLevel(lowEnergyState)).toBe(2);
    expect(brainStateService.getComplexityFilterLevel(mediumEnergyState)).toBe(3);
    expect(brainStateService.getComplexityFilterLevel(highEnergyState)).toBe(5);
  });
});

describe('Brain State Utils', () => {
  test('should categorize brain states correctly', () => {
    const lowState = { energy_level: 2, focus_level: 3, mood_level: 4 };
    const mediumState = { energy_level: 5, focus_level: 6, mood_level: 7 };
    const highState = { energy_level: 9, focus_level: 8, mood_level: 8 };

    expect(brainStateUtils.getBrainStateCategory(lowState)).toBe('low');
    expect(brainStateUtils.getBrainStateCategory(mediumState)).toBe('medium');
    expect(brainStateUtils.getBrainStateCategory(highState)).toBe('high');
  });

  test('should provide encouraging messages', () => {
    const lowMoodState = { energy_level: 2, focus_level: 3, mood_level: 2 };
    const highEnergyState = { energy_level: 9, focus_level: 8, mood_level: 8 };

    const lowMessage = brainStateUtils.getEncouragingMessage(lowMoodState);
    const highMessage = brainStateUtils.getEncouragingMessage(highEnergyState);

    expect(lowMessage).toContain('tough');
    expect(lowMessage).toContain('okay');
    expect(highMessage).toContain('energetic');
    expect(highMessage).toContain('positive');
  });

  test('should recommend UI complexity appropriately', () => {
    const lowFocusState = { energy_level: 5, focus_level: 2, mood_level: 5 };
    const mediumFocusState = { energy_level: 5, focus_level: 5, mood_level: 5 };
    const highFocusState = { energy_level: 5, focus_level: 9, mood_level: 5 };

    expect(brainStateUtils.getUIComplexity(lowFocusState)).toBe('minimal');
    expect(brainStateUtils.getUIComplexity(mediumFocusState)).toBe('standard');
    expect(brainStateUtils.getUIComplexity(highFocusState)).toBe('detailed');
  });
});
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 2E
- [ ] Brain state CRUD operations work correctly
- [ ] Brain state validation enforces 1-10 constraints
- [ ] Offline caching works for today's brain state
- [ ] All services return consistent response format
- [ ] Gentle error messages for all failure cases
- [ ] Brain state utilities provide correct adaptive recommendations
- [ ] React hook integrates properly with authentication
- [ ] TypeScript compilation successful
- [ ] Tests pass with good coverage

### Validation Commands
```bash
# Test brain state service
npm test src/services/__tests__/brainStateService.test.ts

# Test TypeScript compilation
npx tsc --noEmit src/services/brainStateService.ts
npx tsc --noEmit src/utils/brainStateUtils.ts
npx tsc --noEmit src/hooks/useBrainState.ts

# Test validation constraints
# (Manual test by trying to create brain state with energy_level = 11)
```

### Manual Testing Steps
1. **Test brain state validation:**
   - Try creating brain state with energy_level = 11 (should fail)
   - Try creating brain state with energy_level = 5 (should succeed)
2. **Test offline functionality:**
   - Create brain state while online
   - Disconnect internet, try to fetch (should return cached data)
3. **Test brain state utilities:**
   - Verify complexity filter levels for different energy levels
   - Check encouraging messages are appropriate and gentle

## What Sprint 2E Needs From This Sprint
- Complete brain state CRUD service
- Brain state validation utilities
- Offline caching functionality
- Adaptive utility functions for task filtering
- React hook for UI integration

## Interface Contracts (For Sprint 2E & Agent 3)
```typescript
// Brain state service for task filtering
export const brainStateService: {
  createBrainState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<BrainStateResponse>;
  getTodaysBrainState: () => Promise<BrainStateResponse>;
  getComplexityFilterLevel: (state: BrainState) => number;
  validateBrainState: (state: Partial<BrainState>) => { isValid: boolean; message?: string };
};

// Brain state utilities for UI adaptation
export const brainStateUtils: {
  getBrainStateCategory: (state: BrainState) => 'low' | 'medium' | 'high';
  getEncouragingMessage: (state: BrainState) => string;
  getUIComplexity: (state: BrainState) => 'minimal' | 'standard' | 'detailed';
};

// React hook for components
export const useBrainState: () => {
  todaysBrainState: BrainState | null;
  loading: boolean;
  error: string | null;
  createBrainState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
};
```

## Common Mistakes to Avoid
- Don't skip input validation (prevents bad data)
- Don't forget offline caching (users work offline)
- Don't use technical error messages in responses
- Don't bypass brain state constraints (1-10 validation)
- Don't forget to cache today's brain state for quick access

## Files Created This Sprint
- `src/services/brainStateService.ts`
- `src/utils/brainStateUtils.ts`
- `src/hooks/useBrainState.ts`
- `src/services/__tests__/brainStateService.test.ts`

## Next Sprint Preview
Sprint 2E will create the task management service with complexity filtering, AI breakdown support, and integration with brain state data.

---
**Sprint 2D Focus**: Reliable brain state management that drives app adaptation.