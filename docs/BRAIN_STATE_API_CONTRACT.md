# 🧠 Brain State API Contract - Agent 3 ↔ Agent 4

## Purpose
Define the exact interface between Agent 3 (brain state logic owner) and Agent 4 (UI component consumer) to prevent ownership conflicts and ensure seamless integration.

## Agent 3 Responsibilities (Data Provider)
- Owns all brain state logic and Zustand store
- Provides read-only access to brain state data
- Manages brain state updates and persistence
- Handles brain state adaptation algorithms

## Agent 4 Responsibilities (Data Consumer)
- Consumes brain state data for adaptive UI
- Does NOT modify brain state directly
- Implements UI components that respond to brain state changes
- Provides UI for brain state input (but delegates storage to Agent 3)

## API Contract

### 1. Brain State Data Interface
```typescript
// Provided by Agent 3 in src/types/brainState.ts
export interface BrainState {
  energy: number;      // 1-10 scale
  focus: number;       // 1-10 scale  
  mood: number;        // 1-10 scale
  timestamp: string;   // ISO string
  userId: string;
}
```

### 2. Brain State Store Hook (Agent 3)
```typescript
// Agent 3 provides this hook in src/store/brainStateStore.ts
export const useBrainState = () => {
  const currentState = useBrainStateStore(state => state.currentBrainState);
  const updateBrainState = useBrainStateStore(state => state.updateBrainState);
  const history = useBrainStateStore(state => state.brainStateHistory);
  
  return {
    // READ-ONLY access for Agent 4
    currentState: currentState as Readonly<BrainState>,
    history: history as ReadonlyArray<BrainState>,
    
    // WRITE access for Agent 3 only
    updateBrainState, // Agent 4 should not call this directly
    
    // HELPER utilities for Agent 4
    getAdaptiveSettings: () => getAdaptiveTheme(currentState.energy, currentState.focus),
    isLowEnergy: () => currentState.energy <= 3,
    isHighFocus: () => currentState.focus >= 7,
  };
};
```

### 3. Adaptive Theme Integration (Agent 4)
```typescript
// Agent 4 uses this pattern in components
import { useBrainState } from '@/store/brainStateStore';
import { getAdaptiveTheme } from '@/constants';

const MyComponent = () => {
  const { currentState, getAdaptiveSettings } = useBrainState();
  const adaptiveTheme = getAdaptiveSettings();
  
  return (
    <View style={{
      padding: adaptiveTheme.spacing.vertical,
      backgroundColor: adaptiveTheme.colors.background
    }}>
      {/* Component content */}
    </View>
  );
};
```

### 4. Brain State Input Components (Agent 4)
```typescript
// Agent 4 creates UI components but delegates to Agent 3 for updates
import { useBrainState } from '@/store/brainStateStore';

const BrainStateSlider = ({ type }: { type: 'energy' | 'focus' | 'mood' }) => {
  const { currentState, updateBrainState } = useBrainState();
  
  const handleChange = (value: number) => {
    // Agent 4 provides UI, Agent 3 handles the logic
    updateBrainState({ [type]: value });
  };
  
  return (
    <Slider 
      value={currentState[type]}
      onValueChange={handleChange}
      // UI styling handled by Agent 4
    />
  );
};
```

### 5. Notification Integration (Agent 3)
```typescript
// Agent 3 owns notification scheduling logic
export const getNotificationTiming = (brainState: BrainState) => {
  if (brainState.energy <= 3) {
    return { delayHours: 2, gentle: true }; // More time for low energy
  }
  if (brainState.energy >= 7) {
    return { delayHours: 0.5, gentle: false }; // Quicker reminders for high energy
  }
  return { delayHours: 1, gentle: true };
};
```

### 6. Boundaries and Restrictions

#### Agent 3 MUST:
- Export brain state interfaces and types
- Provide `useBrainState()` hook with read-only data for Agent 4
- Handle all brain state persistence and updates
- Provide helper functions for adaptive behavior

#### Agent 4 MUST:
- Use only the provided `useBrainState()` hook
- Never directly import or modify brain state store internals
- Never create their own brain state management
- Use `getAdaptiveTheme()` utility for UI adaptation

#### Agent 3 MUST NOT:
- Create UI components for brain state input
- Style or design brain state interfaces
- Handle visual accessibility features

#### Agent 4 MUST NOT:
- Create brain state logic or algorithms
- Persist brain state data
- Modify brain state outside of provided APIs
- Create competing brain state management

## Integration Testing
Both agents must test:
1. Brain state data flows correctly from Agent 3 to Agent 4
2. UI updates when brain state changes
3. Adaptive theme responds to brain state levels
4. No direct dependencies between agent implementations

## File Ownership Summary
- **Agent 3**: `src/store/brainStateStore.ts`, `src/types/brainState.ts`, brain state logic
- **Agent 4**: `src/components/BrainStateSlider.tsx`, `src/screens/BrainStateCheckinScreen.tsx`, UI components
- **Shared**: This API contract ensures clean integration

---
**This contract prevents notification system ownership conflicts by clearly defining the brain state integration boundary.**