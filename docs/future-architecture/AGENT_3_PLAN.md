# 🧠 Agent 3: Core Feature Developer

## Mission
Build brain state system, adaptive task management, and core business logic with freemium integration.

## Domain Ownership
- **Primary**: Zustand stores, brain state logic, task management, adaptation algorithms, notification scheduling logic
- **Branch**: `agent3/brain-state`
- **Files You Own**: src/store/, src/screens/, src/services/notificationService.ts, core feature logic
- **Dependencies**: Needs Agent 1's navigation and Agent 2's services

## Critical Rules (NEVER VIOLATE)
1. State Management: Zustand 4.5.2 ONLY (never Redux)
2. Colors: NEVER use red anywhere (triggers neurodivergent users)
3. Language: Always gentle, shame-free, encouraging
4. Brain state drives ALL UI adaptations
5. Freemium: Respect subscription limits gracefully

## Phase 1: Brain State System (Week 1-2)

### Brain State Store with Zustand
**Create**: `src/store/brainStateStore.ts`
```typescript
import { create } from 'zustand';
import { brainStateService, BrainState } from '../services/brainStateService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BrainStateStore {
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  recordState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getTodaysState: () => Promise<void>;
  checkTodaysCheckin: () => Promise<boolean>;
  getAdaptedUILevel: () => 'low' | 'medium' | 'high';
  getMaxTaskComplexity: () => number;
}

export const useBrainStateStore = create<BrainStateStore>((set, get) => ({
  currentState: null,
  todaysCheckinComplete: false,
  loading: false,
  error: null,

  recordState: async (state) => {
    set({ loading: true, error: null });
    
    try {
      // Save to Supabase
      const { error } = await brainStateService.createBrainState(state);
      if (error) throw error;

      // Save to local storage for offline access
      await AsyncStorage.setItem('todaysBrainState', JSON.stringify({
        ...state,
        timestamp: new Date().toISOString()
      }));

      set({ 
        currentState: state,
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
    set({ loading: true });
    
    try {
      // Try Supabase first
      const { data, error } = await brainStateService.getTodaysBrainState();
      
      if (data && !error) {
        set({ 
          currentState: data,
          todaysCheckinComplete: true,
          loading: false 
        });
        return;
      }

      // Fallback to local storage
      const localState = await AsyncStorage.getItem('todaysBrainState');
      if (localState) {
        const parsed = JSON.parse(localState);
        const today = new Date().toDateString();
        const stateDate = new Date(parsed.timestamp).toDateString();
        
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

  getAdaptedUILevel: () => {
    const state = get().currentState;
    if (!state) return 'medium';
    
    const avgEnergy = (state.energy_level + state.focus_level) / 2;
    if (avgEnergy <= 3) return 'low';
    if (avgEnergy <= 6) return 'medium';
    return 'high';
  },

  getMaxTaskComplexity: () => {
    const state = get().currentState;
    if (!state) return 3;
    
    const energyLevel = state.energy_level;
    if (energyLevel <= 3) return 2; // Only micro and simple tasks
    if (energyLevel <= 6) return 4; // Up to complex tasks
    return 5; // All tasks available
  }
}));
```

### Brain State Check-in Screen
**Create**: `src/screens/BrainStateCheckin.tsx`
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBrainStateStore } from '../store/brainStateStore';
import { BrainStateSlider } from '../components/BrainStateSlider';
import { GentleButton } from '../components/GentleButton';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';

export const BrainStateCheckin: React.FC = () => {
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');

  const { recordState, loading } = useBrainStateStore();

  const handleSubmit = async () => {
    await recordState({
      energy_level: energy,
      focus_level: focus,
      mood_level: mood,
      notes: notes.trim() || undefined
    });
    
    // Navigate to TaskList (Agent 1 provides navigation)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling right now?</Text>
      
      <View style={styles.sliderSection}>
        <Text style={styles.label}>Energy Level</Text>
        <BrainStateSlider
          value={energy}
          onValueChange={setEnergy}
          minimumTrackTintColor={COLORS.PRIMARY}
          accessibilityLabel="Energy level slider"
        />
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.label}>Focus Level</Text>
        <BrainStateSlider
          value={focus}
          onValueChange={setFocus}
          minimumTrackTintColor={COLORS.PRIMARY}
          accessibilityLabel="Focus level slider"
        />
      </View>

      <View style={styles.sliderSection}>
        <Text style={styles.label}>Mood Level</Text>
        <BrainStateSlider
          value={mood}
          onValueChange={setMood}
          minimumTrackTintColor={COLORS.PRIMARY}
          accessibilityLabel="Mood level slider"
        />
      </View>

      <GentleButton
        title="Let's do this"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.XL,
  },
  sliderSection: {
    marginBottom: SPACING.LG,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  submitButton: {
    marginTop: SPACING.XL,
  },
});
```

## Phase 2: Task Management System (Week 2-3)

### Task Store with Adaptive Filtering
**Create**: `src/store/taskStore.ts`
```typescript
import { create } from 'zustand';
import { taskService, Task } from '../services/taskService';
import { useBrainStateStore } from './brainStateStore';
import { subscriptionService } from '../services/subscriptionService';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAdaptiveTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  requestAIBreakdown: (taskId: string, userId: string) => Promise<void>;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  loadAdaptiveTasks: async () => {
    set({ loading: true, error: null });
    
    try {
      const maxComplexity = useBrainStateStore.getState().getMaxTaskComplexity();
      const { data, error } = await taskService.getFilteredTasks(maxComplexity);
      
      if (error) throw error;
      
      set({ tasks: data || [], loading: false });
    } catch (error) {
      set({ 
        error: "Let's try loading your tasks again",
        loading: false 
      });
    }
  },

  createTask: async (taskData) => {
    set({ loading: true, error: null });
    
    try {
      const { error } = await taskService.createTask(taskData);
      if (error) throw error;
      
      // Reload tasks to include the new one
      await get().loadAdaptiveTasks();
    } catch (error) {
      set({ 
        error: "Let's try adding that task again",
        loading: false 
      });
    }
  },

  completeTask: async (taskId) => {
    try {
      const { error } = await taskService.completeTask(taskId);
      if (error) throw error;
      
      // Update local state optimistically
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: true }
            : task
        )
      }));
    } catch (error) {
      set({ error: "Let's try completing that again" });
    }
  },

  requestAIBreakdown: async (taskId, userId) => {
    try {
      // Check subscription quota first
      const canMakeRequest = await subscriptionService.checkQuota(userId);
      if (!canMakeRequest) {
        set({ error: "You've reached your monthly AI assistance limit. Upgrade to premium for unlimited breakdowns?" });
        return;
      }

      const task = get().tasks.find(t => t.id === taskId);
      const brainState = useBrainStateStore.getState().currentState;
      
      if (!task || !brainState) return;

      // Request AI breakdown from Agent 2's service
      const breakdown = await openaiService.breakdownTask(task.title, brainState, userId);
      
      // Update task with breakdown
      await taskService.updateTask(taskId, { ai_breakdown: breakdown });
      
      // Update local state
      set(state => ({
        tasks: state.tasks.map(t => 
          t.id === taskId 
            ? { ...t, ai_breakdown: breakdown }
            : t
        )
      }));
    } catch (error) {
      if (error.message === 'quota_exceeded') {
        set({ error: "You've used all your AI assistance this month. Upgrade for unlimited breakdowns?" });
      } else {
        set({ error: "Let me try a different approach" });
      }
    }
  },

  getFilteredTasks: () => {
    const maxComplexity = useBrainStateStore.getState().getMaxTaskComplexity();
    return get().tasks.filter(task => 
      task.complexity_level <= maxComplexity && !task.is_completed
    );
  }
}));
```

### Task List Screen
**Create**: `src/screens/TaskList.tsx`
```typescript
import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { useBrainStateStore } from '../store/brainStateStore';
import { TaskCard } from '../components/TaskCard';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';

export const TaskList: React.FC = () => {
  const { tasks, loading, loadAdaptiveTasks } = useTaskStore();
  const { getAdaptedUILevel } = useBrainStateStore();
  
  const uiLevel = getAdaptedUILevel();
  const filteredTasks = tasks.filter(task => !task.is_completed);

  useEffect(() => {
    loadAdaptiveTasks();
  }, []);

  const getEncouragingMessage = () => {
    if (filteredTasks.length === 0) {
      return "You're all caught up! Take a moment to celebrate. ✨";
    }
    
    switch (uiLevel) {
      case 'low':
        return "Let's start with something small and gentle.";
      case 'medium':
        return "Ready to tackle some tasks at your own pace.";
      case 'high':
        return "You're energized! Let's make some progress.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.encouragement}>
        {getEncouragingMessage()}
      </Text>
      
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => (
          <TaskCard 
            task={item} 
            uiLevel={uiLevel}
            onComplete={() => useTaskStore.getState().completeTask(item.id!)}
            onRequestBreakdown={() => useTaskStore.getState().requestAIBreakdown(item.id!, 'user-id')}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
  },
  encouragement: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  listContainer: {
    paddingBottom: SPACING.LG,
  },
});
```

## Interface Contracts (For Other Agents)

### Exact Store Hooks Export (src/store/index.ts)
```typescript
export { useBrainStateStore } from './brainStateStore';
export { useTaskStore } from './taskStore';
export type { BrainState, Task, UserSubscription } from '../types';

// UI Adaptation Levels for Agent 4
export type UIAdaptationLevel = 'low' | 'medium' | 'high';

// Exact brain state adaptation interface for Agent 4
export interface BrainStateAdaptation {
  uiLevel: UIAdaptationLevel;
  maxTaskComplexity: number;
  spacing: 'relaxed' | 'normal' | 'compact';
  animationLevel: 'minimal' | 'standard' | 'full';
  encouragementTone: 'gentle' | 'standard' | 'energetic';
}

// Store state interfaces for Agent 4 components
export interface BrainStateStoreState {
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  loading: boolean;
  error: string | null;
  getAdaptedUILevel: () => UIAdaptationLevel;
  getMaxTaskComplexity: () => number;
  getBrainStateAdaptation: () => BrainStateAdaptation;
}

export interface TaskStoreState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getFilteredTasks: () => Task[];
  filteredTaskCount: number;
}

// Freemium Integration for Agent 4
export interface SubscriptionAwareFeature {
  checkQuota: (userId: string) => Promise<boolean>;
  showUpgradePrompt: (feature: string, message: string) => void;
  getSubscriptionDisplayData: () => SubscriptionDisplayData;
}
```

### Exact Screen Component Interfaces (src/types/screens.ts)
```typescript
import { ScreenProps } from './navigation';
import { BrainStateAdaptation, TaskStoreState, BrainStateStoreState } from '../store';

// Exact props for Agent 4 screen components
export interface BrainStateCheckinProps extends ScreenProps<'BrainStateCheckin'> {
  // Required component props
  initialValues?: {
    energy: number;
    focus: number;
    mood: number;
  };
  onComplete?: (brainState: BrainState) => void;
  // Store data available to component
  storeState: BrainStateStoreState;
}

export interface TaskListProps extends ScreenProps<'TaskList'> {
  // Required component props
  showCompleted?: boolean;
  brainStateId?: string;
  // Store data available to component
  storeState: TaskStoreState;
  adaptationLevel: BrainStateAdaptation;
  subscriptionData: SubscriptionDisplayData;
}

export interface SettingsProps extends ScreenProps<'Settings'> {
  // Required component props
  showUpgrade?: boolean;
  section?: 'notifications' | 'accessibility' | 'subscription';
  // Store data available to component
  subscriptionData: SubscriptionDisplayData;
}

// Component callback interfaces for Agent 4
export interface TaskListCallbacks {
  onTaskComplete: (taskId: string) => Promise<void>;
  onRequestAIBreakdown: (taskId: string) => Promise<void>;
  onCreateTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  onTaskEdit: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

export interface BrainStateCallbacks {
  onBrainStateRecord: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  onNavigateToTasks: () => void;
}
```

## Handoff Points

### To Agent 1 (Foundation)
**When Ready**: Screens and navigation integration
**Provides**:
- Screen components with exact `ScreenProps<T>` interfaces
- Navigation integration requirements
- Deep linking parameter handling

**Agent 1 Must Implement These Exact Screen Registrations**:
```typescript
// Navigation screen registration
const Stack = createStackNavigator<RootStackParamList>();

<Stack.Screen 
  name="BrainStateCheckin" 
  component={BrainStateCheckinScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="TaskList" 
  component={TaskListScreen}
  options={{ title: 'Your Tasks' }}
/>
<Stack.Screen 
  name="Settings" 
  component={SettingsScreen}
  options={{ title: 'Settings' }}
/>
```

### To Agent 2 (Backend)  
**When Ready**: Service integration and data flow
**Needs**: All API services and subscription management

### To Agent 4 (UI/UX)
**When Ready**: Component interfaces and UI requirements
**Provides**: 
- `BrainStateAdaptation` interface with exact UI adaptation rules
- Screen component props with exact callback signatures
- Task filtering data and subscription status
- Exact error handling patterns

**Agent 4 Must Use These Exact Component Patterns**:
```typescript
// Screen component structure
const TaskListScreen: React.FC<TaskListProps> = ({ 
  navigation, route, storeState, adaptationLevel, subscriptionData 
}) => {
  const { tasks, loading, error } = storeState;
  const { onTaskComplete, onRequestAIBreakdown } = useTaskListCallbacks();
  
  // Component implementation using exact props
};

// Store integration pattern
const useTaskListCallbacks = (): TaskListCallbacks => {
  const { completeTask, requestAIBreakdown } = useTaskStore();
  
  return {
    onTaskComplete: async (taskId: string) => await completeTask(taskId),
    onRequestAIBreakdown: async (taskId: string) => await requestAIBreakdown(taskId, 'user-id'),
    // ... other callbacks
  };
};
```

## Success Criteria & Testing
- [ ] Brain state check-in completes in under 30 seconds
- [ ] UI adapts based on brain state (low/medium/high energy)
- [ ] Task filtering works based on energy levels
- [ ] AI breakdown respects subscription quotas
- [ ] Offline functionality for core features
- [ ] Gentle error messages throughout
- [ ] Store integration with screens works
- [ ] **Brain state adaptation logic tested with unit tests**
- [ ] **Zustand stores tested with mock data**
- [ ] **Performance requirement verified (30-second check-in)**
- [ ] **Offline storage tested with AsyncStorage**

### Required Tests Before Handoff
```bash
# Core features validation
npm run test:brain-state
npm run test:stores
npm run test:performance
npm run test:adaptation
npm run test:integration:agent3
```

**Test Files to Create:**
```typescript
// __tests__/store/brainStateStore.test.ts
describe('Brain State Store Logic', () => {
  test('should filter tasks based on energy level', () => {
    const lowEnergyState = { energy_level: 2, focus_level: 3, mood_level: 4 };
    const result = getMaxTaskComplexity(lowEnergyState);
    expect(result).toBe(2); // PASS CRITERIA: Only micro and simple tasks
  });
  
  test('should adapt UI level correctly', () => {
    const state = { energy_level: 8, focus_level: 7, mood_level: 9 };
    const adaptation = getBrainStateAdaptation(state);
    expect(adaptation.uiLevel).toBe('high'); // PASS CRITERIA: High energy = high UI level
    expect(adaptation.spacing).toBe('compact'); // PASS CRITERIA: High energy = compact spacing
  });
  
  test('should save to AsyncStorage for offline access', async () => {
    // PASS CRITERIA: Brain state persists in AsyncStorage
    // FAIL CRITERIA: Network error prevents local save
  });
});

// __tests__/store/taskStore.test.ts
describe('Task Store - Adaptive Filtering', () => {
  test('should respect subscription quotas for AI requests', async () => {
    // PASS CRITERIA: Quota check called before AI request
    // FAIL CRITERIA: AI request made without quota check
  });
  
  test('should show gentle error on quota exceeded', async () => {
    // PASS CRITERIA: Error message contains "upgrade for unlimited"
    // FAIL CRITERIA: Harsh error message shown
  });
});

// __tests__/screens/BrainStateCheckin.test.tsx
describe('Brain State Check-in Performance', () => {
  test('should complete check-in under 30 seconds', async () => {
    const startTime = Date.now();
    // Simulate user interaction
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(30000); // PASS CRITERIA: < 30 seconds
  });
});

// __tests__/integration/agent4-compatibility.test.ts
describe('Agent 4 Component Integration', () => {
  test('should provide exact BrainStateAdaptation interface', () => {
    const adaptation = getBrainStateAdaptation(mockBrainState);
    expect(adaptation).toHaveProperty('uiLevel');
    expect(adaptation).toHaveProperty('spacing');
    expect(adaptation).toHaveProperty('encouragementTone');
    // PASS CRITERIA: All required properties present
  });
  
  test('should provide exact callback signatures for components', () => {
    const callbacks = useTaskListCallbacks();
    expect(typeof callbacks.onTaskComplete).toBe('function');
    expect(typeof callbacks.onRequestAIBreakdown).toBe('function');
    // PASS CRITERIA: Callbacks match TaskListCallbacks interface
  });
});
```

### Critical Test Cases with Exact Pass/Fail Criteria
- **Energy level 2 shows only complexity 1-2 tasks**: `getMaxTaskComplexity({ energy_level: 2 })` returns `2`
- **Energy level 7 shows all complexity 1-5 tasks**: `getMaxTaskComplexity({ energy_level: 7 })` returns `5`
- **Offline brain state saves to AsyncStorage**: AsyncStorage contains today's brain state after save
- **AI quota check prevents requests when limit reached**: `requestAIBreakdown()` calls `checkQuota()` before OpenAI API
- **Brain state check-in completes under 30 seconds**: End-to-end check-in flow < 30000ms
- **UI adaptation works correctly**: `getBrainStateAdaptation()` returns correct `uiLevel`, `spacing`, `encouragementTone`
- **Component callbacks have exact signatures**: All callbacks match interface definitions exactly

## Common Mistakes to Avoid
- Don't use Redux (stick to Zustand)
- Don't use harsh language anywhere
- Don't bypass subscription quota checks
- Don't make UI overwhelming for low energy states
- Don't forget offline storage with AsyncStorage
- Don't use red colors anywhere

## Phase 2 Migration Path

### Exact Store Extension Strategy
**Migration Approach**: Extend existing stores without breaking Phase 1 interfaces

#### Step 1: Brain State Store Extensions (Phase 2.1)
```typescript
// EXACT extensions to BrainStateStore interface
interface BrainStateStore {
  // Phase 1 properties (UNCHANGED)
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  loading: boolean;
  error: string | null;
  
  // Phase 1 methods (UNCHANGED)
  recordState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getTodaysState: () => Promise<void>;
  getAdaptedUILevel: () => 'low' | 'medium' | 'high';
  getMaxTaskComplexity: () => number;
  
  // Phase 2 extensions (NEW - additive only)
  achievements?: Achievement[];
  celebrationQueue?: Celebration[];
  customizations?: UserCustomizations;
  
  // Phase 2 methods (NEW - additive only)
  checkForAchievements?: () => Promise<Achievement[]>;
  triggerCelebration?: (achievement: Achievement) => void;
  getAvailableCustomizations?: () => UserCustomizations;
  getCelebrationIntensity?: () => 'subtle' | 'standard' | 'energetic';
}

// Phase 2 achievement checking (migration-safe)
const checkBrainStateAchievements = async (state: BrainState): Promise<Achievement[]> => {
  // Migration-safe implementation
  if (!__PHASE_2_ENABLED__) {
    return []; // Phase 1: No achievements
  }
  
  // Phase 2: Full achievement checking
  const achievements: Achievement[] = [];
  
  // Check "Brain Scientist" progression
  const totalCheckins = await getTotalBrainStateCount();
  if (totalCheckins === 10) achievements.push({ type: 'brain_scientist', level: 'bronze' });
  
  // Check "Self-Awareness" points
  if (state.notes && state.notes.length > 10) {
    achievements.push({ type: 'self_awareness', points: 5 });
  }
  
  return achievements;
};
```

#### Step 2: Task Store Extensions (Phase 2.2)
```typescript
// EXACT extensions to TaskStore interface
interface TaskStore {
  // Phase 1 properties (UNCHANGED)
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Phase 1 methods (UNCHANGED)
  loadAdaptiveTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  requestAIBreakdown: (taskId: string, userId: string) => Promise<void>;
  
  // Phase 2 extensions (NEW - additive only)
  celebrationHistory?: TaskCelebration[];
  complexityStats?: ComplexityStats;
  
  // Phase 2 methods (NEW - additive only)
  checkTaskCompletionAchievements?: (taskId: string) => Promise<Achievement[]>;
  calculateComplexityMatch?: (taskId: string, brainState: BrainState) => number;
  triggerTaskCelebration?: (task: Task, brainState: BrainState) => void;
}
```

#### Step 3: Backward Compatibility Testing
```typescript
// __tests__/migration/store-compatibility.test.ts
describe('Phase 2 Store Migration Compatibility', () => {
  test('Phase 1 store methods work unchanged after Phase 2 extension', async () => {
    // PASS CRITERIA: All Phase 1 store methods still work
    // PASS CRITERIA: No breaking changes to existing interfaces
  });
  
  test('Phase 2 features are optional and disabled by default', () => {
    // PASS CRITERIA: checkForAchievements returns empty array if Phase 2 disabled
  });
  
  test('Store state shape remains compatible', () => {
    // PASS CRITERIA: Phase 1 components can still access all required state
  });
});
```
```

#### Migration-Safe Task Completion Implementation
```typescript
// Phase 1 task completion with Phase 2 extension points
export const useTaskStore = create<TaskStore>((set, get) => ({
  completeTask: async (taskId) => {
    try {
      const { error } = await taskService.completeTask(taskId);
      if (error) throw error;
      
      // Phase 1: Update local state (STABLE)
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: true }
            : task
        )
      }));

      // Phase 2: Extension point (MIGRATION-SAFE)
      if (get().checkTaskCompletionAchievements) {
        await get().checkTaskCompletionAchievements!(taskId);
      }
      
    } catch (error) {
      set({ error: getGentleErrorMessage(error.message) });
    }
  }
}));

// Migration-safe task achievement checking
const checkTaskCompletionAchievements = async (taskId: string): Promise<Achievement[]> => {
  if (!__PHASE_2_ENABLED__) {
    return []; // Phase 1: No achievements
  }
  
  // Phase 2: Full achievement checking
  const task = get().tasks.find(t => t.id === taskId);
  const brainState = useBrainStateStore.getState().currentState;
  
  if (!task || !brainState) return [];
  
  const achievements: Achievement[] = [];
  
  // Check for "Perfect Match" achievement
  if (task.complexity_level <= brainState.energy_level) {
    achievements.push({ type: 'perfect_match', task: task.title });
  }
  
  // Check for complexity-based achievements
  if (task.complexity_level === 5 && brainState.energy_level >= 8) {
    achievements.push({ type: 'challenge_champion' });
  }
  
  return achievements;
};
```
```

### Brain State Adaptive Logic Extensions
Prepare brain state logic for Phase 2 features:

#### Gamification Adaptation
```typescript
// Extend brain state store for Phase 2 gamification
interface BrainStateStore {
  // Phase 1 properties
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  loading: boolean;
  error: string | null;
  
  // Phase 2 properties (add later)
  // achievements?: Achievement[];
  // celebrationMode?: 'subtle' | 'standard' | 'energetic';
  // customizations?: UserCustomizations;
  
  // Phase 1 methods
  recordState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  getTodaysState: () => Promise<void>;
  getAdaptedUILevel: () => 'low' | 'medium' | 'high';
  getMaxTaskComplexity: () => number;
  
  // Phase 2 methods (add later)
  // getCelebrationIntensity: () => 'subtle' | 'standard' | 'energetic';
  // getAvailableCustomizations: () => UserCustomizations;
  // checkForNewAchievements: () => Promise<Achievement[]>;
}
```

#### Notification Adaptation
```typescript
// Prepare notification timing adaptation
export const getNotificationTiming = (brainState: BrainState) => {
  const energyLevel = brainState.energy_level;
  
  // Phase 1: Basic timing
  if (energyLevel <= 3) {
    return { frequency: 'low', urgency: 'gentle' };
  }
  
  // Phase 2: Advanced adaptive timing (implement later)
  // TODO: Add body doubling session timing
  // TODO: Add achievement unlock timing
  // TODO: Add social notification timing
  
  return { frequency: 'normal', urgency: 'standard' };
};
```

### Phase 2 Store Extensions
Plan store structure for Phase 2 features:

#### Future Store Additions
```typescript
// These stores will be added in Phase 2

// Achievement Store (Phase 2)
interface AchievementStore {
  achievements: Achievement[];
  unlockedCustomizations: Customization[];
  celebrationQueue: Celebration[];
  
  checkForAchievements: () => Promise<void>;
  unlockCustomization: (customizationId: string) => Promise<void>;
  triggerCelebration: (celebration: Celebration) => void;
}

// Body Doubling Store (Phase 2)  
interface BodyDoublingStore {
  availableRooms: Room[];
  currentSession: Session | null;
  connectedUsers: ConnectedUser[];
  
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  sendConnectionRequest: (userId: string) => Promise<void>;
}

// Notification Store (Phase 2)
interface NotificationStore {
  notifications: Notification[];
  preferences: NotificationPreferences;
  
  scheduleNotification: (notification: Notification) => Promise<void>;
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}
```

---
**Agent 3 Focus**: Brain-first logic that adapts everything else. You're the heart of the neurodivergent experience.