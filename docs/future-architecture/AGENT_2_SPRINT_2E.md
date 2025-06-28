# 📋 Agent 2 Sprint 2E: Task Management CRUD

## Mission
Implement task management service with complexity filtering, offline caching, and brain state integration.

## Sprint Goal
Build robust task operations that filter appropriately based on user brain state and work offline.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 2A-2D completed (database, auth, brain state service)
- Brain state service providing complexity filtering

## Critical Rules (NEVER VIOLATE)
1. Filtering: Tasks filtered by brain state energy level
2. Validation: Enforce 1-5 complexity constraints
3. Offline: Support AsyncStorage for task operations
4. Gentle: Use shame-free error messages
5. Integration: Connect with brain state service

## Sprint Tasks

### Task 1: Create Task Service
**Create**: `src/services/taskService.ts`
```typescript
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from '../types/database';
import { brainStateService } from './brainStateService';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

export interface Task {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  complexity_level: number; // 1-5
  estimated_minutes?: number;
  is_completed: boolean;
  ai_breakdown?: {
    steps: string[];
    timeEstimate: number;
    brainStateAdapted: boolean;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaskResponse {
  data: Task | null;
  error: string | null;
}

export interface TaskListResponse {
  data: Task[] | null;
  error: string | null;
}

export const taskService = {
  /**
   * Create new task
   */
  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<TaskResponse> {
    try {
      const validation = this.validateTask(task);
      if (!validation.isValid) {
        return {
          data: null,
          error: validation.message || 'Please check your task details'
        };
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title.trim(),
          description: task.description?.trim() || null,
          complexity_level: task.complexity_level,
          estimated_minutes: task.estimated_minutes || null,
          is_completed: false,
          ai_breakdown: task.ai_breakdown || null
        })
        .select()
        .single();

      if (error) {
        console.error('Task creation failed:', error);
        return {
          data: null,
          error: "Let's try adding that task again"
        };
      }

      await this.cacheTask(data);
      return {
        data: this.formatTask(data),
        error: null
      };
    } catch (error) {
      console.error('Unexpected task creation error:', error);
      return {
        data: null,
        error: "Let's try adding that task again"
      };
    }
  },

  /**
   * Get tasks filtered by current brain state
   */
  async getAdaptiveTasks(includeCompleted = false): Promise<TaskListResponse> {
    try {
      // Get current brain state for filtering
      const { data: brainState } = await brainStateService.getTodaysBrainState();
      const maxComplexity = brainState 
        ? brainStateService.getComplexityFilterLevel(brainState)
        : 5; // Show all if no brain state

      return this.getFilteredTasks(maxComplexity, includeCompleted);
    } catch (error) {
      console.error('Adaptive task fetch failed:', error);
      return this.getAllTasks(); // Fallback to all tasks
    }
  },

  /**
   * Get tasks filtered by complexity level
   */
  async getFilteredTasks(maxComplexity: number, includeCompleted = false): Promise<TaskListResponse> {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .lte('complexity_level', maxComplexity)
        .order('created_at', { ascending: false });

      if (!includeCompleted) {
        query = query.eq('is_completed', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to get filtered tasks:', error);
        const cached = await this.getCachedTasks();
        if (cached) {
          const filtered = cached.filter(task => 
            task.complexity_level <= maxComplexity &&
            (includeCompleted || !task.is_completed)
          );
          return { data: filtered, error: null };
        }
        return {
          data: null,
          error: "Let's try loading your tasks again"
        };
      }

      const tasks = data?.map(item => this.formatTask(item)) || [];
      await this.cacheTasks(tasks);
      return { data: tasks, error: null };
    } catch (error) {
      console.error('Unexpected task fetch error:', error);
      const cached = await this.getCachedTasks();
      if (cached) {
        const filtered = cached.filter(task => 
          task.complexity_level <= maxComplexity &&
          (includeCompleted || !task.is_completed)
        );
        return { data: filtered, error: null };
      }
      return {
        data: null,
        error: "Let's try loading your tasks again"
      };
    }
  },

  /**
   * Get all user tasks
   */
  async getAllTasks(): Promise<TaskListResponse> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to get all tasks:', error);
        return {
          data: null,
          error: "Having trouble loading your tasks right now"
        };
      }

      const tasks = data?.map(item => this.formatTask(item)) || [];
      await this.cacheTasks(tasks);
      return { data: tasks, error: null };
    } catch (error) {
      console.error('Unexpected task fetch error:', error);
      return {
        data: null,
        error: "Having trouble loading your tasks right now"
      };
    }
  },

  /**
   * Update existing task
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<TaskResponse> {
    try {
      if (updates.title || updates.complexity_level !== undefined) {
        const validation = this.validateTask(updates as Task);
        if (!validation.isValid) {
          return {
            data: null,
            error: validation.message || 'Please check your task details'
          };
        }
      }

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title.trim();
      if (updates.description !== undefined) updateData.description = updates.description?.trim() || null;
      if (updates.complexity_level !== undefined) updateData.complexity_level = updates.complexity_level;
      if (updates.estimated_minutes !== undefined) updateData.estimated_minutes = updates.estimated_minutes;
      if (updates.is_completed !== undefined) updateData.is_completed = updates.is_completed;
      if (updates.ai_breakdown !== undefined) updateData.ai_breakdown = updates.ai_breakdown;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Task update failed:', error);
        return {
          data: null,
          error: "Let's try updating that task again"
        };
      }

      return { data: this.formatTask(data), error: null };
    } catch (error) {
      console.error('Unexpected task update error:', error);
      return {
        data: null,
        error: "Let's try updating that task again"
      };
    }
  },

  /**
   * Mark task as completed
   */
  async completeTask(taskId: string): Promise<TaskResponse> {
    return this.updateTask(taskId, { is_completed: true });
  },

  /**
   * Delete task
   */
  async deleteTask(taskId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Task deletion failed:', error);
        return { error: "Let's try removing that task again" };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected task deletion error:', error);
      return { error: "Let's try removing that task again" };
    }
  },

  /**
   * Validate task input
   */
  validateTask(task: Partial<Task>): { isValid: boolean; message?: string } {
    if (task.title !== undefined) {
      if (!task.title.trim()) {
        return { isValid: false, message: 'Task title is required' };
      }
      if (task.title.length > 255) {
        return { isValid: false, message: 'Task title should be under 255 characters' };
      }
    }

    if (task.complexity_level !== undefined) {
      if (!Number.isInteger(task.complexity_level) || task.complexity_level < 1 || task.complexity_level > 5) {
        return { isValid: false, message: 'Complexity level should be between 1 and 5' };
      }
    }

    if (task.estimated_minutes !== undefined && task.estimated_minutes !== null) {
      if (!Number.isInteger(task.estimated_minutes) || task.estimated_minutes < 1) {
        return { isValid: false, message: 'Estimated time should be a positive number' };
      }
    }

    if (task.description && task.description.length > 1000) {
      return { isValid: false, message: 'Description should be under 1000 characters' };
    }

    return { isValid: true };
  },

  /**
   * Format task for consistent output
   */
  formatTask(raw: TaskRow): Task {
    return {
      id: raw.id,
      user_id: raw.user_id,
      title: raw.title,
      description: raw.description || undefined,
      complexity_level: raw.complexity_level,
      estimated_minutes: raw.estimated_minutes || undefined,
      is_completed: raw.is_completed,
      ai_breakdown: raw.ai_breakdown || undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at
    };
  },

  /**
   * Cache tasks locally for offline access
   */
  async cacheTasks(tasks: Task[]): Promise<void> {
    try {
      const cacheData = { tasks, cached_at: new Date().toISOString() };
      await AsyncStorage.setItem('cachedTasks', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache tasks:', error);
    }
  },

  /**
   * Cache single task
   */
  async cacheTask(task: TaskRow): Promise<void> {
    try {
      const cached = await this.getCachedTasks();
      const formatted = this.formatTask(task);
      const updated = cached ? [...cached, formatted] : [formatted];
      await this.cacheTasks(updated);
    } catch (error) {
      console.error('Failed to cache task:', error);
    }
  },

  /**
   * Get cached tasks for offline access
   */
  async getCachedTasks(): Promise<Task[] | null> {
    try {
      const cached = await AsyncStorage.getItem('cachedTasks');
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed.tasks || null;
    } catch (error) {
      console.error('Failed to get cached tasks:', error);
      return null;
    }
  }
};
```

### Task 2: Create Task Management Hook
**Create**: `src/hooks/useTasks.ts`
```typescript
import { useState, useEffect } from 'react';
import { taskService, Task, TaskResponse } from '../services/taskService';
import { useAuth } from './useAuth';
import { useBrainState } from './useBrainState';

interface TasksHookState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

interface TasksHookActions {
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<boolean>;
  completeTask: (taskId: string) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

export const useTasks = (): TasksHookState & TasksHookActions => {
  const { isAuthenticated } = useAuth();
  const { todaysBrainState } = useBrainState();
  const [state, setState] = useState<TasksHookState>({
    tasks: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    } else {
      setState({ tasks: [], loading: false, error: null });
    }
  }, [isAuthenticated, todaysBrainState]);

  const loadTasks = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await taskService.getAdaptiveTasks();
      
      setState({
        tasks: data || [],
        loading: false,
        error: error
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Having trouble loading your tasks"
      }));
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await taskService.createTask(task);

      if (error) {
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      setState(prev => ({
        tasks: data ? [data, ...prev.tasks] : prev.tasks,
        loading: false,
        error: null
      }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: "Let's try adding that task again" }));
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { data, error } = await taskService.updateTask(taskId, updates);

      if (error) {
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      setState(prev => ({
        tasks: prev.tasks.map(task => task.id === taskId ? (data || task) : task),
        loading: false,
        error: null
      }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: "Let's try updating that again" }));
      return false;
    }
  };

  const completeTask = async (taskId: string): Promise<boolean> => {
    return updateTask(taskId, { is_completed: true });
  };

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await taskService.deleteTask(taskId);

      if (error) {
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      setState(prev => ({
        tasks: prev.tasks.filter(task => task.id !== taskId),
        loading: false,
        error: null
      }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: "Let's try removing that again" }));
      return false;
    }
  };

  const refreshTasks = async (): Promise<void> => {
    await loadTasks();
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    refreshTasks,
    clearError
  };
};
```

### Task 3: Create Task Tests
**Create**: `src/services/__tests__/taskService.test.ts`
```typescript
import { taskService } from '../taskService';

// Mock dependencies
jest.mock('../supabaseClient');
jest.mock('../brainStateService');

describe('Task Service', () => {
  test('should validate task complexity correctly', () => {
    const validTask = {
      title: 'Test task',
      complexity_level: 3,
      is_completed: false
    };

    const validation = taskService.validateTask(validTask);
    expect(validation.isValid).toBe(true);
  });

  test('should reject invalid complexity levels', () => {
    const invalidTask = {
      title: 'Test task',
      complexity_level: 6, // Invalid: > 5
      is_completed: false
    };

    const validation = taskService.validateTask(invalidTask);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toContain('Complexity level should be between 1 and 5');
  });

  test('should reject empty task titles', () => {
    const invalidTask = {
      title: '', // Invalid: empty
      complexity_level: 3,
      is_completed: false
    };

    const validation = taskService.validateTask(invalidTask);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toContain('Task title is required');
  });

  test('should handle task caching', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', complexity_level: 2, is_completed: false },
      { id: '2', title: 'Task 2', complexity_level: 4, is_completed: true }
    ];

    await taskService.cacheTasks(mockTasks);
    const cached = await taskService.getCachedTasks();
    
    expect(cached).toHaveLength(2);
    expect(cached?.[0].title).toBe('Task 1');
  });
});
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 2F
- [ ] Task CRUD operations work correctly
- [ ] Task complexity validation enforces 1-5 constraints
- [ ] Adaptive task filtering based on brain state
- [ ] Offline caching works for tasks
- [ ] React hook integrates with auth and brain state
- [ ] All services return consistent response format
- [ ] Gentle error messages for all failure cases
- [ ] TypeScript compilation successful

### Validation Commands
```bash
# Test task service
npm test src/services/__tests__/taskService.test.ts

# Test TypeScript compilation
npx tsc --noEmit src/services/taskService.ts
npx tsc --noEmit src/hooks/useTasks.ts
```

## Interface Contracts (For Sprint 2F & Agent 3)
```typescript
// Task service for Agent 3 integration
export const taskService: {
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<TaskResponse>;
  getAdaptiveTasks: (includeCompleted?: boolean) => Promise<TaskListResponse>;
  completeTask: (taskId: string) => Promise<TaskResponse>;
  validateTask: (task: Partial<Task>) => { isValid: boolean; message?: string };
};

// Task hook for components
export const useTasks: () => {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  completeTask: (taskId: string) => Promise<boolean>;
};
```

## Files Created This Sprint
- `src/services/taskService.ts`
- `src/hooks/useTasks.ts`
- `src/services/__tests__/taskService.test.ts`

## Next Sprint Preview
Sprint 2F will complete the backend with subscription quota management, OpenAI integration, and freemium system.

---
**Sprint 2E Focus**: Adaptive task management driven by brain state data.