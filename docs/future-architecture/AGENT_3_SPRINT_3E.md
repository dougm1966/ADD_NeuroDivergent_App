# 📱 Agent 3 Sprint 3E: Brain State Screen

## Mission
Create brain state check-in screen using store and adaptation system.

## Time Estimate
1 hour

## Prerequisites
- Sprint 3A, 3B completed (brain state store + adaptation)
- Agent 1 navigation ready

## Sprint Goal
Working check-in screen that adapts UI based on previous brain state.

## Core Tasks

### Task 1: Brain State Check-in Screen
**Create**: `src/screens/BrainStateCheckin.tsx`
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useBrainStateStore } from '../store/brainStateStore';
import { getSpacingForAdaptation, getTouchTargetSize, getEncouragementMessage } from '../store';
import { NavigationProp } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY } from '../constants';

interface BrainStateCheckinProps {
  navigation: NavigationProp<any>;
}

export const BrainStateCheckinScreen: React.FC<BrainStateCheckinProps> = ({ navigation }) => {
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');

  const { 
    currentState,
    loading,
    error,
    recordState,
    clearError,
    getBrainStateAdaptation
  } = useBrainStateStore();

  // Get current adaptation for UI
  const adaptation = getBrainStateAdaptation();
  const spacing = getSpacingForAdaptation(adaptation);
  const touchTargetSize = getTouchTargetSize(adaptation);
  const encouragementMessage = getEncouragementMessage('check_in', adaptation);

  useEffect(() => {
    // Pre-populate with current values if available
    if (currentState) {
      setEnergy(currentState.energy_level);
      setFocus(currentState.focus_level);
      setMood(currentState.mood_level);
      setNotes(currentState.notes || '');
    }
  }, [currentState]);

  useEffect(() => {
    if (error) {
      // Auto-clear error after 5 seconds
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async () => {
    await recordState({
      energy_level: energy,
      focus_level: focus,
      mood_level: mood,
      notes: notes.trim() || undefined
    });

    // Navigate to task list if successful
    if (!error) {
      navigation.navigate('TaskList');
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      padding: spacing,
    },
    sliderSection: {
      marginBottom: spacing,
      minHeight: touchTargetSize,
    },
    submitButton: {
      minHeight: touchTargetSize,
      marginTop: spacing * 2,
    }
  });

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      <Text style={styles.title}>{encouragementMessage}</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={[styles.sliderSection, dynamicStyles.sliderSection]}>
        <Text style={styles.label}>Energy Level: {energy}/10</Text>
        {/* Slider implementation will be provided by Agent 4 */}
        <View style={styles.sliderPlaceholder}>
          <Text style={styles.placeholderText}>Slider Component (Agent 4)</Text>
        </View>
      </View>

      <View style={[styles.sliderSection, dynamicStyles.sliderSection]}>
        <Text style={styles.label}>Focus Level: {focus}/10</Text>
        <View style={styles.sliderPlaceholder}>
          <Text style={styles.placeholderText}>Slider Component (Agent 4)</Text>
        </View>
      </View>

      <View style={[styles.sliderSection, dynamicStyles.sliderSection]}>
        <Text style={styles.label}>Mood Level: {mood}/10</Text>
        <View style={styles.sliderPlaceholder}>
          <Text style={styles.placeholderText}>Slider Component (Agent 4)</Text>
        </View>
      </View>

      <View style={[styles.sliderSection, dynamicStyles.sliderSection]}>
        <Text style={styles.label}>Notes (optional)</Text>
        {/* TextInput implementation will be provided by Agent 4 */}
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>TextInput Component (Agent 4)</Text>
        </View>
      </View>

      <View style={dynamicStyles.submitButton}>
        {/* Button implementation will be provided by Agent 4 */}
        <View style={[styles.buttonPlaceholder, { minHeight: touchTargetSize }]}>
          <Text style={styles.placeholderText}>
            {loading ? 'Saving...' : "Let's do this"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 32,
  },
  sliderSection: {
    // Dynamic spacing applied via dynamicStyles
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: COLORS.WARNING + '20', // 20% opacity
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    textAlign: 'center',
  },
  // Placeholder styles for Agent 4 components
  sliderPlaceholder: {
    height: 40,
    backgroundColor: COLORS.BORDER,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputPlaceholder: {
    height: 80,
    backgroundColor: COLORS.BORDER,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPlaceholder: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontStyle: 'italic',
  },
});
```

### Task 2: Screen Component Interface
**Create**: `src/types/screenProps.ts`
```typescript
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BrainState, Task } from '../store';
import { BrainStateAdaptation } from '../types/adaptation';

export type RootStackParamList = {
  BrainStateCheckin: { 
    edit?: boolean;
    initialValues?: Partial<BrainState>;
  };
  TaskList: { 
    filterComplexity?: number;
    showCompleted?: boolean;
  };
  Settings: { 
    showUpgrade?: boolean;
    section?: 'notifications' | 'accessibility' | 'subscription';
  };
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// Component props for Agent 4
export interface BrainStateCheckinComponentProps {
  energy: number;
  focus: number;
  mood: number;
  notes: string;
  onEnergyChange: (value: number) => void;
  onFocusChange: (value: number) => void;
  onMoodChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  adaptation: BrainStateAdaptation;
}
```

### Task 3: Basic Screen Test
**Create**: `__tests__/screens/BrainStateCheckin.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BrainStateCheckinScreen } from '../../src/screens/BrainStateCheckin';
import { useBrainStateStore } from '../../src/store/brainStateStore';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock store
jest.mock('../../src/store/brainStateStore');
const mockUseBrainStateStore = useBrainStateStore as jest.Mocked<typeof useBrainStateStore>;

describe('Brain State Check-in Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBrainStateStore.mockReturnValue({
      currentState: null,
      loading: false,
      error: null,
      recordState: jest.fn(),
      clearError: jest.fn(),
      getBrainStateAdaptation: jest.fn().mockReturnValue({
        uiLevel: 'medium',
        spacing: 'normal',
        touchTargetSize: 'normal',
        encouragementTone: 'standard'
      })
    });
  });

  test('should render check-in screen with placeholders', () => {
    const { getByText } = render(
      <BrainStateCheckinScreen navigation={mockNavigation as any} />
    );

    expect(getByText('Ready to check in with yourself?')).toBeTruthy();
    expect(getByText('Energy Level: 5/10')).toBeTruthy();
    expect(getByText('Focus Level: 5/10')).toBeTruthy();
    expect(getByText('Mood Level: 5/10')).toBeTruthy();
    expect(getByText('Notes (optional)')).toBeTruthy();
  });

  test('should adapt UI for low energy state', () => {
    mockUseBrainStateStore.mockReturnValue({
      currentState: {
        energy_level: 2,
        focus_level: 2,
        mood_level: 3,
        notes: '',
        created_at: new Date().toISOString()
      },
      loading: false,
      error: null,
      recordState: jest.fn(),
      clearError: jest.fn(),
      getBrainStateAdaptation: jest.fn().mockReturnValue({
        uiLevel: 'low',
        spacing: 'relaxed',
        touchTargetSize: 'large',
        encouragementTone: 'gentle'
      })
    });

    const { getByText } = render(
      <BrainStateCheckinScreen navigation={mockNavigation as any} />
    );

    expect(getByText('How are you feeling right now?')).toBeTruthy();
  });
});
```

## Success Criteria
- [ ] Brain state check-in screen renders with adaptive spacing
- [ ] Screen uses brain state store for data management
- [ ] UI adapts based on current brain state (spacing, touch targets)
- [ ] Encouragement messages change based on adaptation level
- [ ] Error handling displays gentle messages
- [ ] Navigation to task list after successful check-in

## Testing Commands
```bash
npm run test -- --testPathPattern=BrainStateCheckin
```

## Next Sprint
**3F: Task List Screen** - Create adaptive task display screen.

## Agent Dependencies
- **Needs from Agent 1**: Navigation setup and route definitions
- **Provides to Agent 3F**: Screen patterns and adaptation usage
- **Provides to Agent 4**: Component prop interfaces and placeholder requirements

## Common Issues
- **Navigation typing**: Ensure navigation prop types match Agent 1's setup
- **Store integration**: Test that store hooks work correctly
- **Adaptation timing**: Ensure adaptation calculations happen at right time

---
**Focus**: Screen structure only. Agent 4 implements actual UI components.