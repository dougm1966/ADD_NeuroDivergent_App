# 📋 Agent 3 Sprint 3F: Task List Screen

## Mission
Create adaptive task list screen that filters tasks by brain state and integrates AI breakdown requests.

## Time Estimate
1 hour

## Prerequisites
- Sprint 3C, 3D completed (task store + AI integration)
- Sprint 3E completed (screen patterns established)

## Sprint Goal
Working task list that shows appropriate tasks and handles AI breakdown requests.

## Core Tasks

### Task 1: Task List Screen
**Create**: `src/screens/TaskList.tsx`
```typescript
import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useTaskStore } from '../store/taskStore';
import { useBrainStateStore } from '../store/brainStateStore';
import { getSpacingForAdaptation, getEncouragementMessage } from '../store';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY } from '../constants';

interface TaskListProps {
  navigation: NavigationProp<any>;
}

export const TaskListScreen: React.FC<TaskListProps> = ({ navigation }) => {
  const { 
    tasks,
    loading,
    error,
    loadAdaptiveTasks,
    getFilteredTasks,
    completeTask,
    requestAIBreakdown,
    clearError,
    aiRequestInProgress
  } = useTaskStore();

  const { 
    currentState,
    getBrainStateAdaptation 
  } = useBrainStateStore();

  // Get current adaptation for UI
  const adaptation = getBrainStateAdaptation();
  const spacing = getSpacingForAdaptation(adaptation);
  
  // Get filtered tasks based on brain state
  const filteredTasks = getFilteredTasks();
  
  useEffect(() => {
    loadAdaptiveTasks();
  }, []);

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const getEncouragingMessage = () => {
    if (loading) {
      return "Loading your tasks...";
    }
    
    if (filteredTasks.length === 0) {
      return getEncouragementMessage('task_complete', adaptation);
    }
    
    const energyLevel = currentState?.energy_level || 5;
    if (energyLevel <= 3) {
      return "Let's start with something small and gentle.";
    } else if (energyLevel >= 7) {
      return "You're energized! Ready to tackle your tasks?";
    }
    return "Ready to make some progress on your tasks.";
  };

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId);
  };

  const handleRequestBreakdown = async (taskId: string) => {
    if (!currentState) return;
    
    // Note: userId would come from auth context in real implementation
    await requestAIBreakdown(taskId, 'current-user-id');
  };

  const renderTaskItem = ({ item: task }) => (
    <View style={[styles.taskCard, { marginBottom: spacing }]}>
      <Text style={styles.taskTitle}>{task.title}</Text>
      
      {task.description && (
        <Text style={styles.taskDescription}>{task.description}</Text>
      )}
      
      <View style={styles.taskMeta}>
        <Text style={styles.complexityText}>
          Complexity: {task.complexity_level}/5
        </Text>
        {task.estimated_minutes && (
          <Text style={styles.timeText}>
            ~{task.estimated_minutes} min
          </Text>
        )}
      </View>

      {task.ai_breakdown && (
        <View style={styles.breakdownContainer}>
          <Text style={styles.breakdownTitle}>AI Breakdown:</Text>
          {task.ai_breakdown.steps?.map((step: string, index: number) => (
            <Text key={index} style={styles.breakdownStep}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.actionButtons}>
        {/* Button placeholders for Agent 4 */}
        <View style={styles.buttonPlaceholder}>
          <Text style={styles.placeholderText}>Complete Button</Text>
        </View>
        
        {!task.ai_breakdown && (
          <View style={styles.buttonPlaceholder}>
            <Text style={styles.placeholderText}>
              {aiRequestInProgress ? 'Breaking down...' : 'Break Down'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      padding: spacing,
    },
    encouragement: {
      marginBottom: spacing * 2,
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.encouragement, dynamicStyles.encouragement]}>
        {getEncouragingMessage()}
      </Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id!}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {currentState?.energy_level <= 3 
                  ? "Take a rest - you've earned it! 🌱"
                  : "All caught up! Ready to add new tasks? ✨"
                }
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  encouragement: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: COLORS.WARNING + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
  },
  listContainer: {
    paddingBottom: 16,
  },
  taskCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    padding: 16,
  },
  taskTitle: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  complexityText: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  timeText: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  breakdownContainer: {
    backgroundColor: COLORS.SUCCESS + '10',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  breakdownTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  breakdownStep: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  // Placeholder styles for Agent 4 components
  buttonPlaceholder: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.BACKGROUND,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    fontStyle: 'italic',
  },
});
```

### Task 2: Task Component Interface
**Update**: `src/types/screenProps.ts` - Add task list interfaces:
```typescript
// Add to existing file:

export interface TaskListComponentProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => Promise<void>;
  onRequestBreakdown: (taskId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  adaptation: BrainStateAdaptation;
  aiRequestInProgress: boolean;
}

export interface TaskCardComponentProps {
  task: Task;
  onComplete: () => Promise<void>;
  onRequestBreakdown: () => Promise<void>;
  adaptation: BrainStateAdaptation;
  aiRequestInProgress: boolean;
}
```

### Task 3: Task List Test
**Create**: `__tests__/screens/TaskList.test.tsx`
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { TaskListScreen } from '../../src/screens/TaskList';
import { useTaskStore } from '../../src/store/taskStore';
import { useBrainStateStore } from '../../src/store/brainStateStore';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock stores
jest.mock('../../src/store/taskStore');
jest.mock('../../src/store/brainStateStore');

const mockUseTaskStore = useTaskStore as jest.Mocked<typeof useTaskStore>;
const mockUseBrainStateStore = useBrainStateStore as jest.Mocked<typeof useBrainStateStore>;

describe('Task List Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      loadAdaptiveTasks: jest.fn(),
      getFilteredTasks: jest.fn().mockReturnValue([]),
      completeTask: jest.fn(),
      requestAIBreakdown: jest.fn(),
      clearError: jest.fn(),
      aiRequestInProgress: false
    });

    mockUseBrainStateStore.mockReturnValue({
      currentState: {
        energy_level: 5,
        focus_level: 6,
        mood_level: 7,
        notes: '',
        created_at: new Date().toISOString()
      },
      getBrainStateAdaptation: jest.fn().mockReturnValue({
        uiLevel: 'medium',
        spacing: 'normal',
        touchTargetSize: 'normal',
        encouragementTone: 'standard'
      })
    });
  });

  test('should render task list with empty state', () => {
    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation as any} />
    );

    expect(getByText('Ready to make some progress on your tasks.')).toBeTruthy();
    expect(getByText('All caught up! Ready to add new tasks? ✨')).toBeTruthy();
  });

  test('should show appropriate message for low energy', () => {
    mockUseBrainStateStore.mockReturnValue({
      currentState: {
        energy_level: 2,
        focus_level: 3,
        mood_level: 2,
        notes: '',
        created_at: new Date().toISOString()
      },
      getBrainStateAdaptation: jest.fn().mockReturnValue({
        uiLevel: 'low',
        spacing: 'relaxed',
        touchTargetSize: 'large',
        encouragementTone: 'gentle'
      })
    });

    const { getByText } = render(
      <TaskListScreen navigation={mockNavigation as any} />
    );

    expect(getByText("Let's start with something small and gentle.")).toBeTruthy();
  });
});
```

## Success Criteria
- [ ] Task list shows filtered tasks based on brain state complexity
- [ ] Screen adapts spacing and messaging based on energy level
- [ ] AI breakdown requests integrate with quota management
- [ ] Empty states provide encouraging messages
- [ ] Error handling shows gentle messages
- [ ] Loading states are properly managed

## Testing Commands
```bash
npm run test -- --testPathPattern=TaskList
```

## Next Sprint
**3G: Store Testing** - Comprehensive tests for all store functionality.

## Agent Dependencies
- **Needs from Agent 3D**: AI integration and quota management
- **Provides to Agent 3G**: Complete screen patterns for testing
- **Provides to Agent 4**: Task display interfaces and component requirements

## Common Issues
- **Store integration**: Ensure both brain state and task stores work together
- **Adaptation timing**: Test that UI updates when brain state changes
- **AI integration**: Verify breakdown requests work with quota checks

---
**Focus**: Screen logic only. Agent 4 implements actual task cards and buttons.