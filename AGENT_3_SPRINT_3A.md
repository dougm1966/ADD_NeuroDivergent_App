# 🧠 Agent 3 Sprint 3A: Brain State Store Core

## Mission
Create basic Zustand brain state store with validation, record/retrieve actions, and offline storage.

## Time Estimate
1 hour

## Prerequisites
- Sprint 2C completed (brainStateService available)
- Agent 1 navigation ready

## Sprint Goal
Working brain state store that saves/loads today's check-in data.

## Core Tasks

### Task 1: Brain State Store Setup
**Create**: `src/store/brainStateStore.ts`
```typescript
import { create } from 'zustand';
import { brainStateService, BrainState, BrainStateResponse } from '../services/brainStateService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BrainStateStore {
  // State
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  recordState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getTodaysState: () => Promise<void>;
  checkTodaysCheckin: () => Promise<boolean>;
  clearError: () => void;
}

const CACHE_KEY = 'todaysBrainState';

export const useBrainStateStore = create<BrainStateStore>((set, get) => ({
  // Initial state
  currentState: null,
  todaysCheckinComplete: false,
  loading: false,
  error: null,

  recordState: async (state) => {
    set({ loading: true, error: null });
    
    try {
      // Validate input locally first
      if (state.energy_level < 1 || state.energy_level > 10) {
        throw new Error('Energy level must be 1-10');
      }
      if (state.focus_level < 1 || state.focus_level > 10) {
        throw new Error('Focus level must be 1-10');
      }
      if (state.mood_level < 1 || state.mood_level > 10) {
        throw new Error('Mood level must be 1-10');
      }

      // Save to Supabase
      const response: BrainStateResponse = await brainStateService.createBrainState(state);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const savedState = response.data!;

      // Save to local storage for offline access
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        ...savedState,
        cached_at: new Date().toISOString()
      }));

      set({ 
        currentState: savedState,
        todaysCheckinComplete: true,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: "Let's try that again in a moment",
        loading: false 
      });
    }
  },

  getTodaysState: async () => {
    set({ loading: true, error: null });
    
    try {
      // Try Supabase first
      const response: BrainStateResponse = await brainStateService.getTodaysState();
      
      if (response.data && !response.error) {
        set({ 
          currentState: response.data,
          todaysCheckinComplete: true,
          loading: false 
        });
        return;
      }

      // Fallback to local storage
      const localState = await AsyncStorage.getItem(CACHE_KEY);
      if (localState) {
        const parsed = JSON.parse(localState);
        const today = new Date().toDateString();
        const stateDate = new Date(parsed.created_at).toDateString();
        
        if (today === stateDate) {
          set({ 
            currentState: parsed,
            todaysCheckinComplete: true,
            loading: false 
          });
          return;
        }
      }

      // No state found
      set({ 
        currentState: null,
        todaysCheckinComplete: false,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: "Let's check your state when we reconnect",
        loading: false 
      });
    }
  },

  checkTodaysCheckin: async () => {
    await get().getTodaysState();
    return get().todaysCheckinComplete;
  },

  clearError: () => set({ error: null })
}));
```

### Task 2: Store Export Setup
**Create**: `src/store/index.ts`
```typescript
export { useBrainStateStore } from './brainStateStore';
export type { BrainStateStore } from './brainStateStore';
export type { BrainState } from '../services/brainStateService';
```

### Task 3: Basic Validation
**Create**: `src/utils/validation.ts`
```typescript
import { BrainState } from '../services/brainStateService';

export const validateBrainStateInput = (
  state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>
): { isValid: boolean; error?: string } => {
  if (!state.energy_level || state.energy_level < 1 || state.energy_level > 10) {
    return { isValid: false, error: 'Energy level must be between 1-10' };
  }
  
  if (!state.focus_level || state.focus_level < 1 || state.focus_level > 10) {
    return { isValid: false, error: 'Focus level must be between 1-10' };
  }
  
  if (!state.mood_level || state.mood_level < 1 || state.mood_level > 10) {
    return { isValid: false, error: 'Mood level must be between 1-10' };
  }
  
  if (state.notes && state.notes.length > 500) {
    return { isValid: false, error: 'Notes must be under 500 characters' };
  }
  
  return { isValid: true };
};
```

## Success Criteria
- [ ] Brain state store created with proper TypeScript types
- [ ] `recordState` saves to Supabase and AsyncStorage
- [ ] `getTodaysState` loads from Supabase with offline fallback
- [ ] Input validation prevents invalid data
- [ ] Gentle error messages throughout
- [ ] Store accessible via `useBrainStateStore()` hook

## Testing Commands
```bash
npm run test -- --testPathPattern=brainStateStore
```

## Next Sprint
**3B: Brain State Adaptation Logic** - Add UI adaptation system based on energy levels.

## Agent Dependencies
- **Needs from Agent 2**: `brainStateService` with proper TypeScript interfaces
- **Provides to Agent 3B**: Working brain state store with data access
- **Provides to Agent 1**: Store hooks for screen integration

## Common Issues
- **Import errors**: Ensure `brainStateService` is exported from Agent 2
- **AsyncStorage permission**: Already handled by Expo
- **Validation failures**: Check Agent 2's service validation matches store validation
- **Network errors**: Store gracefully falls back to cached data

---
**Focus**: Core brain state data flow only. UI adaptation comes in 3B.