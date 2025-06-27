# 🧪 Agent 3 Sprint 3G: Store Testing

## Mission
Create comprehensive tests for brain state and task stores to ensure 80%+ coverage and reliable functionality.

## Time Estimate
1 hour

## Prerequisites
- All previous sprints 3A-3F completed
- Stores and screens implemented

## Sprint Goal
Complete test suite validating store behavior, adaptation logic, and integration points.

## Core Tasks

### Task 1: Enhanced Brain State Store Tests
**Update**: `__tests__/store/brainStateStore.test.ts`
```typescript
import { useBrainStateStore } from '../../src/store/brainStateStore';
import { brainStateService } from '../../src/services/brainStateService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../src/services/brainStateService');
jest.mock('@react-native-async-storage/async-storage');

const mockBrainStateService = brainStateService as jest.Mocked<typeof brainStateService>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Brain State Store - Complete Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to initial state
    useBrainStateStore.setState({
      currentState: null,
      todaysCheckinComplete: false,
      loading: false,
      error: null
    });
  });

  describe('Core CRUD Operations', () => {
    test('should record brain state successfully', async () => {
      mockBrainStateService.createBrainState.mockResolvedValue({
        data: {
          id: 'test-id',
          energy_level: 7,
          focus_level: 8,
          mood_level: 6,
          notes: 'Feeling good',
          created_at: new Date().toISOString()
        },
        error: null
      });

      const store = useBrainStateStore.getState();
      await store.recordState({
        energy_level: 7,
        focus_level: 8,
        mood_level: 6,
        notes: 'Feeling good'
      });

      expect(store.currentState?.energy_level).toBe(7);
      expect(store.todaysCheckinComplete).toBe(true);
      expect(store.loading).toBe(false);
      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
    });

    test('should handle validation errors gracefully', async () => {
      const store = useBrainStateStore.getState();
      
      await store.recordState({
        energy_level: 11, // Invalid value
        focus_level: 5,
        mood_level: 5
      });

      expect(store.error).toContain('try again');
      expect(store.currentState).toBeNull();
    });
  });

  describe('Adaptation Logic', () => {
    test('should calculate UI adaptation for all energy levels', () => {
      const store = useBrainStateStore.getState();
      
      // Test boundary conditions
      const testCases = [
        { energy: 1, focus: 1, expected: 'low', complexity: 1 },
        { energy: 3, focus: 3, expected: 'low', complexity: 1 },
        { energy: 4, focus: 4, expected: 'medium', complexity: 2 },
        { energy: 6, focus: 6, expected: 'medium', complexity: 3 },
        { energy: 7, focus: 7, expected: 'high', complexity: 4 },
        { energy: 10, focus: 10, expected: 'high', complexity: 5 },
      ];

      testCases.forEach(({ energy, focus, expected, complexity }) => {
        store.currentState = {
          energy_level: energy,
          focus_level: focus,
          mood_level: 5,
          notes: '',
          created_at: new Date().toISOString()
        };

        const adaptation = store.getBrainStateAdaptation();
        expect(adaptation.uiLevel).toBe(expected);
        expect(store.getMaxTaskComplexity()).toBe(complexity);
      });
    });

    test('should provide safe defaults for null state', () => {
      const store = useBrainStateStore.getState();
      store.currentState = null;

      const adaptation = store.getBrainStateAdaptation();
      expect(adaptation.uiLevel).toBe('medium');
      expect(adaptation.spacing).toBe('normal');
      expect(store.getMaxTaskComplexity()).toBe(3);
    });
  });

  describe('Offline Functionality', () => {
    test('should load from cache when online fails', async () => {
      mockBrainStateService.getTodaysState.mockRejectedValue(new Error('Network error'));
      
      const cachedState = {
        energy_level: 6,
        focus_level: 7,
        mood_level: 5,
        notes: 'Cached state',
        created_at: new Date().toISOString()
      };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(cachedState));

      const store = useBrainStateStore.getState();
      await store.getTodaysState();

      expect(store.currentState?.energy_level).toBe(6);
      expect(store.todaysCheckinComplete).toBe(true);
    });
  });
});
```

### Task 2: Enhanced Task Store Tests
**Update**: `__tests__/store/taskStore.test.ts`
```typescript
import { useTaskStore } from '../../src/store/taskStore';
import { useBrainStateStore } from '../../src/store/brainStateStore';
import { taskService } from '../../src/services/taskService';
import { subscriptionService } from '../../src/services/subscriptionService';

jest.mock('../../src/services/taskService');
jest.mock('../../src/services/subscriptionService');
jest.mock('../../src/store/brainStateStore');

describe('Task Store - Complete Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock brain state store
    (useBrainStateStore as any).getState.mockReturnValue({
      getMaxTaskComplexity: jest.fn().mockReturnValue(3),
      currentState: {
        energy_level: 5,
        focus_level: 6,
        mood_level: 7
      }
    });
    
    // Reset task store
    useTaskStore.setState({
      tasks: [],
      loading: false,
      error: null,
      lastSyncTime: null,
      aiRequestInProgress: false
    });
  });

  describe('Task Management', () => {
    test('should create tasks with optimistic updates', async () => {
      const mockTask = {
        id: 'new-task',
        title: 'New Task',
        complexity_level: 2,
        is_completed: false
      };

      (taskService.createTask as jest.Mock).mockResolvedValue({
        data: mockTask,
        error: null
      });

      const store = useTaskStore.getState();
      await store.createTask({
        title: 'New Task',
        complexity_level: 2,
        is_completed: false
      });

      expect(store.tasks).toHaveLength(1);
      expect(store.tasks[0].title).toBe('New Task');
    });

    test('should handle offline task creation', async () => {
      (taskService.createTask as jest.Mock).mockRejectedValue(new Error('Network error'));

      const store = useTaskStore.getState();
      await store.createTask({
        title: 'Offline Task',
        complexity_level: 2,
        is_completed: false
      });

      expect(store.tasks.some(t => t.title === 'Offline Task')).toBe(true);
      expect(store.error).toContain('saved offline');
    });
  });

  describe('Brain State Integration', () => {
    test('should filter tasks based on brain state', () => {
      const store = useTaskStore.getState();
      store.tasks = [
        { id: '1', complexity_level: 1, is_completed: false },
        { id: '2', complexity_level: 3, is_completed: false },
        { id: '3', complexity_level: 5, is_completed: false }, // Should be filtered
        { id: '4', complexity_level: 2, is_completed: true }  // Completed, filtered
      ];

      const filtered = store.getFilteredTasks();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(t => t.complexity_level <= 3 && !t.is_completed)).toBe(true);
    });
  });

  describe('AI Integration', () => {
    test('should handle quota exceeded gracefully', async () => {
      (subscriptionService.checkQuota as jest.Mock).mockResolvedValue({
        canMakeRequest: false,
        tier: 'free'
      });

      const store = useTaskStore.getState();
      await store.requestAIBreakdown('task-id', 'user-id');

      expect(store.error).toContain('upgrade for unlimited');
      expect(store.aiRequestInProgress).toBe(false);
    });
  });
});
```

### Task 3: Integration Tests
**Create**: `__tests__/integration/storeIntegration.test.ts`
```typescript
import { useBrainStateStore } from '../../src/store/brainStateStore';
import { useTaskStore } from '../../src/store/taskStore';

describe('Store Integration', () => {
  test('should coordinate brain state changes with task filtering', async () => {
    // Set up initial brain state
    const brainStateStore = useBrainStateStore.getState();
    brainStateStore.currentState = {
      energy_level: 8,
      focus_level: 9,
      mood_level: 7,
      notes: '',
      created_at: new Date().toISOString()
    };

    // Set up tasks
    const taskStore = useTaskStore.getState();
    taskStore.tasks = [
      { id: '1', complexity_level: 1, is_completed: false },
      { id: '2', complexity_level: 3, is_completed: false },
      { id: '3', complexity_level: 5, is_completed: false }
    ];

    // High energy should show all tasks
    expect(brainStateStore.getMaxTaskComplexity()).toBe(5);
    expect(taskStore.getFilteredTasks()).toHaveLength(3);

    // Change to low energy
    brainStateStore.currentState = {
      ...brainStateStore.currentState,
      energy_level: 2,
      focus_level: 2
    };

    // Low energy should filter to only easy tasks
    expect(brainStateStore.getMaxTaskComplexity()).toBe(1);
    expect(taskStore.getFilteredTasks()).toHaveLength(1);
    expect(taskStore.getFilteredTasks()[0].complexity_level).toBe(1);
  });
});
```

### Task 4: Performance Tests
**Create**: `__tests__/performance/storePerformance.test.ts`
```typescript
describe('Store Performance', () => {
  test('should calculate adaptations under 50ms', () => {
    const brainStateStore = useBrainStateStore.getState();
    brainStateStore.currentState = {
      energy_level: 6,
      focus_level: 7,
      mood_level: 5,
      notes: '',
      created_at: new Date().toISOString()
    };

    const start = performance.now();
    
    // Perform 100 adaptation calculations
    for (let i = 0; i < 100; i++) {
      brainStateStore.getBrainStateAdaptation();
    }
    
    const end = performance.now();
    const averageTime = (end - start) / 100;

    expect(averageTime).toBeLessThan(0.5); // < 0.5ms per calculation
  });

  test('should filter 1000 tasks under 100ms', () => {
    const taskStore = useTaskStore.getState();
    
    // Generate 1000 tasks
    taskStore.tasks = Array.from({ length: 1000 }, (_, i) => ({
      id: `task-${i}`,
      complexity_level: (i % 5) + 1,
      is_completed: i % 3 === 0
    }));

    const start = performance.now();
    const filtered = taskStore.getFilteredTasks();
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
    expect(filtered.length).toBeGreaterThan(0);
  });
});
```

### Task 5: Test Script Setup
**Create**: `scripts/test-stores.sh`
```bash
#!/bin/bash

echo "Running comprehensive store tests..."

# Core store tests
npm run test -- --testPathPattern=store --coverage --verbose

# Integration tests  
npm run test -- --testPathPattern=integration --verbose

# Performance tests
npm run test -- --testPathPattern=performance --verbose

echo "Store test suite complete!"
```

## Success Criteria
- [ ] Brain state store has 80%+ test coverage
- [ ] Task store has 80%+ test coverage  
- [ ] Adaptation logic tested for all boundary conditions
- [ ] Offline functionality tested and verified
- [ ] AI integration tested with quota scenarios
- [ ] Performance requirements verified (adaptation < 50ms, filtering < 100ms)
- [ ] Integration between stores tested and working

## Testing Commands
```bash
npm run test -- --testPathPattern=store --coverage
npm run test -- --testPathPattern=integration
npm run test -- --testPathPattern=performance
```

## Next Sprint
**3H: Agent 4 Handoff** - Final interface contracts and component specifications.

## Agent Dependencies
- **Validates**: All previous sprint implementations
- **Provides to Agent 3H**: Tested and verified store behavior
- **Provides to Agent 4**: Confidence in store reliability and performance

## Common Issues
- **Mock setup**: Ensure mocks match actual service interfaces
- **State isolation**: Reset store state between tests
- **Async handling**: Properly await async store operations
- **Performance measurement**: Use consistent timing methods

---
**Focus**: Comprehensive testing only. Final handoff preparation comes in 3H.