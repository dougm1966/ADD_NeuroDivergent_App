# 🎯 Agent 3 Sprint 3B: Brain State Adaptation Logic

## Mission
Add UI adaptation system to brain state store that transforms energy/focus/mood levels into UI behavior changes.

## Time Estimate
1 hour

## Prerequisites
- Sprint 3A completed (brain state store working)
- Constants defined in Agent 1

## Sprint Goal
Brain state store provides adaptation data that drives UI complexity, spacing, and messaging.

## Core Tasks

### Task 1: Adaptation Interface
**Create**: `src/types/adaptation.ts`
```typescript
export interface BrainStateAdaptation {
  uiLevel: 'low' | 'medium' | 'high';
  maxTaskComplexity: number;
  spacing: 'relaxed' | 'normal' | 'compact';
  animationLevel: 'minimal' | 'standard' | 'full';
  encouragementTone: 'gentle' | 'standard' | 'energetic';
  touchTargetSize: 'large' | 'normal' | 'compact';
}
```

### Task 2: Adaptation Logic
**Update**: `src/store/brainStateStore.ts` - Add these methods:
```typescript
// Add to BrainStateStore interface:
getAdaptedUILevel: () => 'low' | 'medium' | 'high';
getMaxTaskComplexity: () => number;
getBrainStateAdaptation: () => BrainStateAdaptation;
getEncouragementTone: () => 'gentle' | 'standard' | 'energetic';

// Add to store implementation:
getAdaptedUILevel: () => {
  const state = get().currentState;
  if (!state) return 'medium';
  
  const avgLevel = (state.energy_level + state.focus_level) / 2;
  if (avgLevel <= 3) return 'low';
  if (avgLevel <= 6) return 'medium';
  return 'high';
},

getMaxTaskComplexity: () => {
  const state = get().currentState;
  if (!state) return 3;
  
  const energyLevel = state.energy_level;
  if (energyLevel <= 2) return 1; // Only micro tasks
  if (energyLevel <= 4) return 2; // Simple tasks
  if (energyLevel <= 6) return 3; // Medium tasks
  if (energyLevel <= 8) return 4; // Complex tasks
  return 5; // All tasks available
},

getBrainStateAdaptation: (): BrainStateAdaptation => {
  const state = get().currentState;
  const uiLevel = get().getAdaptedUILevel();
  
  if (!state) {
    return {
      uiLevel: 'medium',
      maxTaskComplexity: 3,
      spacing: 'normal',
      animationLevel: 'standard',
      encouragementTone: 'standard',
      touchTargetSize: 'normal'
    };
  }

  const { energy_level, focus_level, mood_level } = state;
  const avgLevel = (energy_level + focus_level) / 2;

  return {
    uiLevel,
    maxTaskComplexity: get().getMaxTaskComplexity(),
    spacing: avgLevel <= 3 ? 'relaxed' : avgLevel >= 7 ? 'compact' : 'normal',
    animationLevel: avgLevel <= 3 ? 'minimal' : avgLevel >= 7 ? 'full' : 'standard',
    encouragementTone: avgLevel <= 3 ? 'gentle' : avgLevel >= 7 ? 'energetic' : 'standard',
    touchTargetSize: focus_level <= 3 ? 'large' : focus_level >= 7 ? 'compact' : 'normal'
  };
},

getEncouragementTone: () => {
  const adaptation = get().getBrainStateAdaptation();
  return adaptation.encouragementTone;
}
```

### Task 3: Adaptation Utilities
**Create**: `src/utils/adaptationHelpers.ts`
```typescript
import { BrainStateAdaptation } from '../types/adaptation';
import { SPACING, LAYOUT } from '../constants';

export const getSpacingForAdaptation = (adaptation: BrainStateAdaptation): number => {
  switch (adaptation.spacing) {
    case 'relaxed': return SPACING.XL; // 32px
    case 'compact': return SPACING.SM; // 8px
    default: return SPACING.LG; // 24px
  }
};

export const getTouchTargetSize = (adaptation: BrainStateAdaptation): number => {
  switch (adaptation.touchTargetSize) {
    case 'large': return 56;
    case 'compact': return LAYOUT.TOUCH_TARGET_MIN; // 44px
    default: return LAYOUT.TOUCH_TARGET_PREFERRED; // 48px
  }
};

export const getEncouragementMessage = (
  context: 'task_complete' | 'check_in' | 'error',
  adaptation: BrainStateAdaptation
): string => {
  const { encouragementTone } = adaptation;
  
  const messages = {
    task_complete: {
      gentle: "You did something today - that's wonderful! 🌱",
      standard: "Task completed! Nice work. ✨",
      energetic: "Great job! You're making progress! 🚀"
    },
    check_in: {
      gentle: "How are you feeling right now?",
      standard: "Ready to check in with yourself?",
      energetic: "Let's see how you're doing today!"
    },
    error: {
      gentle: "Let's try that again when you're ready",
      standard: "Let's try that again in a moment",
      energetic: "Quick retry - you've got this!"
    }
  };
  
  return messages[context][encouragementTone];
};
```

### Task 4: Update Store Exports
**Update**: `src/store/index.ts`
```typescript
export { useBrainStateStore } from './brainStateStore';
export type { BrainStateStore } from './brainStateStore';
export type { BrainState } from '../services/brainStateService';
export type { BrainStateAdaptation } from '../types/adaptation';

// Adaptation utilities
export { 
  getSpacingForAdaptation, 
  getTouchTargetSize, 
  getEncouragementMessage 
} from '../utils/adaptationHelpers';
```

### Task 5: Basic Adaptation Test
**Create**: `__tests__/store/brainStateAdaptation.test.ts`
```typescript
import { useBrainStateStore } from '../../src/store/brainStateStore';

describe('Brain State Adaptation Logic', () => {
  test('should return low UI level for low energy', () => {
    const store = useBrainStateStore.getState();
    
    // Mock low energy state
    store.currentState = {
      energy_level: 2,
      focus_level: 3,
      mood_level: 2,
      notes: '',
      created_at: new Date().toISOString()
    };

    const uiLevel = store.getAdaptedUILevel();
    const adaptation = store.getBrainStateAdaptation();

    expect(uiLevel).toBe('low');
    expect(adaptation.spacing).toBe('relaxed');
    expect(adaptation.touchTargetSize).toBe('large');
    expect(adaptation.encouragementTone).toBe('gentle');
  });

  test('should return high UI level for high energy', () => {
    const store = useBrainStateStore.getState();
    
    // Mock high energy state
    store.currentState = {
      energy_level: 8,
      focus_level: 9,
      mood_level: 7,
      notes: '',
      created_at: new Date().toISOString()
    };

    const uiLevel = store.getAdaptedUILevel();
    const adaptation = store.getBrainStateAdaptation();

    expect(uiLevel).toBe('high');
    expect(adaptation.spacing).toBe('compact');
    expect(adaptation.animationLevel).toBe('full');
    expect(adaptation.encouragementTone).toBe('energetic');
  });

  test('should filter task complexity by energy level', () => {
    const store = useBrainStateStore.getState();
    
    // Test low energy (should only show complexity 1)
    store.currentState = { energy_level: 2, focus_level: 3, mood_level: 2 };
    expect(store.getMaxTaskComplexity()).toBe(1);
    
    // Test medium energy (should show complexity 1-3)
    store.currentState = { energy_level: 5, focus_level: 6, mood_level: 5 };
    expect(store.getMaxTaskComplexity()).toBe(3);
    
    // Test high energy (should show all complexity 1-5)
    store.currentState = { energy_level: 9, focus_level: 8, mood_level: 9 };
    expect(store.getMaxTaskComplexity()).toBe(5);
  });
});
```

## Success Criteria
- [ ] Brain state store provides `getBrainStateAdaptation()` method
- [ ] Adaptation changes based on energy/focus/mood levels
- [ ] Low energy = relaxed spacing, large targets, gentle tone
- [ ] High energy = compact spacing, full animations, energetic tone
- [ ] Task complexity filtering works (1-5 levels based on energy)
- [ ] Adaptation utilities provide consistent spacing/messaging

## Testing Commands
```bash
npm run test -- --testPathPattern=brainStateAdaptation
```

## Next Sprint
**3C: Task Store Core** - Basic task CRUD operations with brain state filtering.

## Agent Dependencies
- **Needs from Agent 1**: `SPACING`, `LAYOUT` constants defined
- **Provides to Agent 3C**: Adaptation logic for task filtering
- **Provides to Agent 4**: Complete adaptation interface for UI components

## Common Issues
- **Null state handling**: Adaptation methods provide safe defaults
- **Type imports**: Ensure `BrainStateAdaptation` type is properly exported
- **Calculation errors**: Test edge cases (energy level 1, 10, etc.)

---
**Focus**: Pure adaptation logic only. Task integration comes in 3C.