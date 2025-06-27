# 📋 Agent 3 Sprint 3C: Task Store Core

## Mission
Create basic task management Zustand store with CRUD operations and brain state filtering.

## Time Estimate
1 hour

## Prerequisites
- Sprint 3A, 3B completed (brain state store with adaptation)
- Sprint 2C completed (taskService available)

## Sprint Goal
Working task store that filters tasks by user's current energy level.

## Core Tasks

### Task 1: Task Store Interface
**Create**: `src/store/taskStore.ts`
```typescript
import { create } from 'zustand';
import { taskService, Task, TaskResponse, TaskListResponse } from '../services/taskService';
import { useBrainStateStore } from './brainStateStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TaskStore {
  // State
  tasks: Task[];
  loading: boolean;
  error: string | null;
  lastSyncTime: string | null;
  
  // Actions
  loadAdaptiveTasks: () => Promise<void>;
  loadAllTasks: () => Promise<void>;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  clearError: () => void;
  syncOfflineTasks: () => Promise<void>;
  
  // Getters
  getFilteredTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getTaskById: (taskId: string) => Task | undefined;
  getTasksForComplexity: (complexity: number) => Task[];
}

const CACHE_KEY = 'cachedTasks';
const OFFLINE_TASKS_KEY = 'offlineTasks';

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  loading: false,
  error: null,
  lastSyncTime: null,

  loadAdaptiveTasks: async () => {
    set({ loading: true, error: null });
    
    try {
      const brainStateStore = useBrainStateStore.getState();
      const maxComplexity = brainStateStore.getMaxTaskComplexity();
      
      const response: TaskListResponse = await taskService.getFilteredTasks(maxComplexity, false);
      
      if (response.error) {
        throw new Error(response.error);
      }

      const tasks = response.data || [];
      
      // Cache tasks for offline access
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
        tasks,
        maxComplexity,
        cached_at: new Date().toISOString()
      }));

      set({ 
        tasks, 
        loading: false,
        lastSyncTime: new Date().toISOString()
      });
    } catch (error) {
      // Try loading from cache
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const { tasks } = JSON.parse(cached);
          set({ tasks, loading: false });
          return;
        }
      } catch (cacheError) {
        // Ignore cache errors
      }
      
      set({ 
        error: "Let's try loading your tasks again",
        loading: false 
      });
    }
  },

  loadAllTasks: async () => {
    set({ loading: true, error: null });
    
    try {
      const response: TaskListResponse = await taskService.getAllTasks();
      
      if (response.error) {
        throw new Error(response.error);
      }

      set({ 
        tasks: response.data || [], 
        loading: false,
        lastSyncTime: new Date().toISOString()
      });
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
      const response: TaskResponse = await taskService.createTask(taskData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Add to local state immediately
      if (response.data) {
        set(state => ({
          tasks: [response.data!, ...state.tasks],
          loading: false
        }));
      }
    } catch (error) {
      // Save to offline queue
      try {
        const offline = await AsyncStorage.getItem(OFFLINE_TASKS_KEY) || '[]';
        const offlineTasks = JSON.parse(offline);
        offlineTasks.push({ ...taskData, id: `offline_${Date.now()}` });
        await AsyncStorage.setItem(OFFLINE_TASKS_KEY, JSON.stringify(offlineTasks));
        
        // Add to local state with offline ID
        set(state => ({
          tasks: [{ ...taskData, id: `offline_${Date.now()}` }, ...state.tasks],
          loading: false,
          error: "Task saved offline - will sync when connected"
        }));
      } catch (offlineError) {
        set({ 
          error: "Let's try adding that task again",
          loading: false 
        });
      }
    }
  },

  updateTask: async (taskId, updates) => {
    try {
      const response: TaskResponse = await taskService.updateTask(taskId, updates);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Update local state
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updates, updated_at: new Date().toISOString() }
            : task
        )
      }));
    } catch (error) {
      set({ error: "Let's try updating that again" });
    }
  },

  completeTask: async (taskId) => {
    try {
      const response: TaskResponse = await taskService.completeTask(taskId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Update local state optimistically
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: true, updated_at: new Date().toISOString() }
            : task
        )
      }));
    } catch (error) {
      set({ error: "Let's try completing that again" });
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await taskService.deleteTask(taskId);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Remove from local state
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));
    } catch (error) {
      set({ error: "Let's try removing that again" });
    }
  },

  syncOfflineTasks: async () => {
    try {
      const offline = await AsyncStorage.getItem(OFFLINE_TASKS_KEY);
      if (!offline) return;
      
      const offlineTasks = JSON.parse(offline);
      for (const task of offlineTasks) {
        await taskService.createTask(task);
      }
      
      // Clear offline queue
      await AsyncStorage.removeItem(OFFLINE_TASKS_KEY);
      
      // Reload tasks
      await get().loadAdaptiveTasks();
    } catch (error) {
      // Sync will retry next time
    }
  },

  clearError: () => set({ error: null }),

  // Getters
  getFilteredTasks: () => {
    const brainStateStore = useBrainStateStore.getState();
    const maxComplexity = brainStateStore.getMaxTaskComplexity();
    return get().tasks.filter(task => 
      task.complexity_level <= maxComplexity && !task.is_completed
    );
  },

  getCompletedTasks: () => {
    return get().tasks.filter(task => task.is_completed);
  },

  getTaskById: (taskId) => {
    return get().tasks.find(task => task.id === taskId);
  },

  getTasksForComplexity: (complexity) => {
    return get().tasks.filter(task => 
      task.complexity_level === complexity && !task.is_completed
    );
  }
}));
```

### Task 2: Update Store Exports
**Update**: `src/store/index.ts`
```typescript
export { useBrainStateStore } from './brainStateStore';
export { useTaskStore } from './taskStore';
export type { BrainStateStore } from './brainStateStore';
export type { TaskStore } from './taskStore';
export type { BrainState } from '../services/brainStateService';
export type { Task } from '../services/taskService';
export type { BrainStateAdaptation } from '../types/adaptation';

// Adaptation utilities
export { 
  getSpacingForAdaptation, 
  getTouchTargetSize, 
  getEncouragementMessage 
} from '../utils/adaptationHelpers';
```

### Task 3: Basic Task Test
**Create**: `__tests__/store/taskStore.test.ts`
```typescript
import { useTaskStore } from '../../src/store/taskStore';
import { useBrainStateStore } from '../../src/store/brainStateStore';
import { taskService } from '../../src/services/taskService';

jest.mock('../../src/services/taskService');
jest.mock('../../src/store/brainStateStore');

const mockTaskService = taskService as jest.Mocked<typeof taskService>;
const mockUseBrainStateStore = useBrainStateStore as jest.Mocked<typeof useBrainStateStore>;

describe('Task Store - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock brain state store
    mockUseBrainStateStore.getState.mockReturnValue({
      getMaxTaskComplexity: jest.fn().mockReturnValue(3),
      currentState: {
        energy_level: 5,
        focus_level: 6,
        mood_level: 7
      }
    });
  });

  test('should filter tasks by brain state complexity', () => {
    const store = useTaskStore.getState();
    
    // Set up mock tasks
    store.tasks = [
      { id: '1', title: 'Easy Task', complexity_level: 1, is_completed: false },
      { id: '2', title: 'Medium Task', complexity_level: 3, is_completed: false },
      { id: '3', title: 'Hard Task', complexity_level: 5, is_completed: false },
      { id: '4', title: 'Completed Task', complexity_level: 2, is_completed: true }
    ];

    const filteredTasks = store.getFilteredTasks();

    // Should only show tasks <= maxComplexity (3) and not completed
    expect(filteredTasks).toHaveLength(2);
    expect(filteredTasks.map(t => t.complexity_level)).toEqual([1, 3]);
    expect(filteredTasks.every(t => !t.is_completed)).toBe(true);
  });

  test('should handle offline task creation', async () => {
    const store = useTaskStore.getState();
    
    // Mock network failure
    mockTaskService.createTask.mockRejectedValue(new Error('Network error'));

    const newTask = {
      title: 'Offline Task',
      complexity_level: 2,
      is_completed: false
    };

    await store.createTask(newTask);

    // Should add task to local state with offline ID
    expect(store.tasks.some(t => t.title === 'Offline Task')).toBe(true);
    expect(store.error).toContain('saved offline');
  });
});
```

## Success Criteria
- [ ] Task store provides CRUD operations for tasks
- [ ] `getFilteredTasks()` respects brain state complexity limits
- [ ] Offline task creation queues tasks for later sync
- [ ] Task completion updates local state optimistically
- [ ] Store integrates with brain state adaptation system
- [ ] Gentle error messages throughout

## Testing Commands
```bash
npm run test -- --testPathPattern=taskStore
```

## Next Sprint
**3D: AI Integration** - Add OpenAI service integration with quota management.

## Agent Dependencies
- **Needs from Agent 2**: `taskService` with proper CRUD operations
- **Needs from Agent 3B**: Brain state adaptation for task filtering
- **Provides to Agent 3D**: Working task store for AI integration
- **Provides to Agent 4**: Task data and filtering logic

## Common Issues
- **Brain state integration**: Ensure `useBrainStateStore` is properly imported
- **Offline sync**: Test offline queue functionality
- **Task filtering**: Verify complexity levels match brain state energy
- **Optimistic updates**: Handle network errors gracefully

---
**Focus**: Core task CRUD only. AI integration comes in 3D.