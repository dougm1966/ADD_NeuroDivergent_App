# 🧠 Agent 4 Sprint 4C: Brain State Check-in UI

## Mission
Build complete brain state check-in screen components that integrate with Agent 3's brain state store and provide adaptive UI experience.

## Time Estimate
1 hour

## Prerequisites
- Sprint 4B completed (base components available)
- Agent 3 brain state store interface understood
- Agent 3 screen structure from AGENT_3_SPRINT_3E reviewed

## Sprint Goal
Complete check-in screen implementation that replaces Agent 3's component placeholders with fully functional UI components.

## Core Tasks

### Task 1: Brain State Check-in Form Component
**Create**: `src/components/BrainStateCheckinForm.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BrainStateSlider, GentleButton, GentleTextInput } from './';
import { COLORS, TYPOGRAPHY, SPACING, getAdaptiveTheme } from '../constants';
import { createComponentAdaptation } from './';

export interface BrainStateCheckinFormProps {
  // Current values
  energy: number;
  focus: number;
  mood: number;
  notes: string;
  
  // Change handlers
  onEnergyChange: (value: number) => void;
  onFocusChange: (value: number) => void;
  onMoodChange: (value: number) => void;
  onNotesChange: (value: string) => void;
  onSubmit: () => void;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Brain state adaptation (from current state for UI adaptation)
  currentBrainState?: {
    energy_level: number;
    focus_level: number;
    mood_level: number;
  };
  
  // Accessibility
  testID?: string;
}

export const BrainStateCheckinForm: React.FC<BrainStateCheckinFormProps> = ({
  energy,
  focus,
  mood,
  notes,
  onEnergyChange,
  onFocusChange,
  onMoodChange,
  onNotesChange,
  onSubmit,
  loading,
  error,
  currentBrainState,
  testID,
}) => {
  // Adapt UI based on current brain state (if available) or use medium energy defaults
  const adaptationEnergy = currentBrainState?.energy_level || 5;
  const adaptationFocus = currentBrainState?.focus_level || 5;
  
  const adaptation = createComponentAdaptation(adaptationEnergy, adaptationFocus);
  const theme = getAdaptiveTheme(adaptationEnergy, adaptationFocus);
  
  const getEncouragementMessage = () => {
    if (adaptationEnergy <= 3) {
      return "How are you feeling right now? No pressure - just checking in.";
    } else if (adaptationEnergy >= 7) {
      return "Ready to check in and plan your productive day?";
    }
    return "How are you feeling right now?";
  };

  const getSubmitButtonText = () => {
    if (loading) return "Just a moment...";
    if (adaptationEnergy <= 3) return "That's perfect";
    if (adaptationEnergy >= 7) return "Let's do this!";
    return "All set";
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[
        styles.content, 
        { paddingHorizontal: theme.spacing.horizontal }
      ]}
      testID={testID}
      showsVerticalScrollIndicator={false}
    >
      {/* Encouraging Title */}
      <Text style={[
        styles.title, 
        { 
          fontSize: theme.typography.fontSize + 8,
          lineHeight: theme.typography.lineHeight * (theme.typography.fontSize + 8),
          marginBottom: theme.spacing.section,
          color: theme.colors.text,
        }
      ]}>
        {getEncouragementMessage()}
      </Text>
      
      {/* Error Display */}
      {error && (
        <View style={[styles.errorContainer, { marginBottom: theme.spacing.vertical }]}>
          <Text style={[styles.errorText, { color: COLORS.WARNING }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Energy Level Slider */}
      <View style={[styles.sliderSection, { marginBottom: theme.spacing.vertical }]}>
        <BrainStateSlider
          value={energy}
          onValueChange={onEnergyChange}
          label="Energy Level"
          accessibilityLabel="Energy level from 1 to 10"
          accessibilityHint="Adjust to match your current energy level"
          minimumTrackTintColor={COLORS.ENERGY_HIGH}
          adaptation={adaptation}
          testID="energy-slider"
        />
      </View>

      {/* Focus Level Slider */}
      <View style={[styles.sliderSection, { marginBottom: theme.spacing.vertical }]}>
        <BrainStateSlider
          value={focus}
          onValueChange={onFocusChange}
          label="Focus Level"
          accessibilityLabel="Focus level from 1 to 10"
          accessibilityHint="Adjust to match your current ability to concentrate"
          minimumTrackTintColor={COLORS.INFO}
          adaptation={adaptation}
          testID="focus-slider"
        />
      </View>

      {/* Mood Level Slider */}
      <View style={[styles.sliderSection, { marginBottom: theme.spacing.vertical }]}>
        <BrainStateSlider
          value={mood}
          onValueChange={onMoodChange}
          label="Mood Level"
          accessibilityLabel="Mood level from 1 to 10"
          accessibilityHint="Adjust to match how you're feeling emotionally"
          minimumTrackTintColor={COLORS.SUCCESS}
          adaptation={adaptation}
          testID="mood-slider"
        />
      </View>

      {/* Optional Notes */}
      <View style={[styles.notesSection, { marginBottom: theme.spacing.section }]}>
        <GentleTextInput
          value={notes}
          onChangeText={onNotesChange}
          label="Notes (totally optional)"
          placeholder="Anything you'd like to remember? (slept badly, medication change, etc.)"
          multiline
          numberOfLines={3}
          maxLength={500}
          accessibilityLabel="Optional notes about your current state"
          accessibilityHint="Add any context that might be helpful to remember"
          adaptation={adaptation}
          testID="notes-input"
        />
      </View>

      {/* Submit Button */}
      <GentleButton
        title={getSubmitButtonText()}
        onPress={onSubmit}
        loading={loading}
        variant="primary"
        size="large"
        accessibilityLabel="Submit brain state check-in"
        accessibilityHint="Save your current brain state and continue to your tasks"
        adaptation={adaptation}
        style={[styles.submitButton, { marginTop: theme.spacing.section }]}
        testID="submit-button"
      />
      
      {/* Helper Text */}
      <Text style={[
        styles.helperText, 
        { 
          fontSize: theme.typography.fontSize - 2,
          color: theme.colors.text,
          opacity: 0.7,
          marginTop: theme.spacing.vertical,
        }
      ]}>
        This helps the app adapt to support you better.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: SPACING.LG,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.HEADING_MEDIUM,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.HEADING_MEDIUM,
  },
  errorContainer: {
    backgroundColor: COLORS.WARNING + '20', // 20% opacity
    borderRadius: 8,
    padding: SPACING.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.WARNING,
  },
  errorText: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY,
  },
  sliderSection: {
    // marginBottom applied dynamically
  },
  notesSection: {
    // marginBottom applied dynamically
  },
  submitButton: {
    // marginTop applied dynamically
  },
  helperText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.CAPTION,
    fontStyle: 'italic',
  },
});
```

### Task 2: Check-in Success Feedback Component
**Create**: `src/components/CheckinSuccessFeedback.tsx`
```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GentleButton } from './GentleButton';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface CheckinSuccessFeedbackProps {
  visible: boolean;
  brainState: {
    energy_level: number;
    focus_level: number;
    mood_level: number;
  };
  onContinue: () => void;
  testID?: string;
}

export const CheckinSuccessFeedback: React.FC<CheckinSuccessFeedbackProps> = ({
  visible,
  brainState,
  onContinue,
  testID,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  const getPersonalizedMessage = () => {
    const avgLevel = (brainState.energy_level + brainState.focus_level + brainState.mood_level) / 3;
    
    if (avgLevel <= 3) {
      return {
        title: "Thank you for checking in",
        message: "Your app is now adapted for a gentle, low-pressure experience.",
        emoji: "🌱",
      };
    } else if (avgLevel >= 7) {
      return {
        title: "Ready to take on the day!",
        message: "Your app is optimized for focused, productive work.",
        emoji: "🚀",
      };
    }
    
    return {
      title: "Perfect! You're all set",
      message: "Your app is adjusted to match your current energy.",
      emoji: "✨",
    };
  };

  const message = getPersonalizedMessage();
  
  const getBrainStateDescription = () => {
    const descriptions = [];
    
    if (brainState.energy_level <= 3) descriptions.push("Low energy");
    else if (brainState.energy_level >= 7) descriptions.push("High energy");
    else descriptions.push("Moderate energy");
    
    if (brainState.focus_level <= 3) descriptions.push("gentle focus");
    else if (brainState.focus_level >= 7) descriptions.push("sharp focus");
    else descriptions.push("balanced focus");
    
    return descriptions.join(", ");
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{message.emoji}</Text>
        
        <Text style={styles.title}>{message.title}</Text>
        
        <Text style={styles.message}>{message.message}</Text>
        
        <View style={styles.stateDisplay}>
          <Text style={styles.stateLabel}>Current state:</Text>
          <Text style={styles.stateDescription}>
            {getBrainStateDescription()}
          </Text>
        </View>
        
        <GentleButton
          title="Continue to Tasks"
          onPress={onContinue}
          variant="primary"
          size="large"
          accessibilityLabel="Continue to your task list"
          accessibilityHint="Go to your personalized task list"
          style={styles.continueButton}
          testID="continue-button"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.LG,
  },
  content: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 16,
    padding: SPACING.XL,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.LG,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.HEADING_MEDIUM,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.HEADING_MEDIUM,
  },
  message: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY,
    marginBottom: SPACING.LG,
  },
  stateDisplay: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: SPACING.MD,
    marginBottom: SPACING.LG,
    width: '100%',
  },
  stateLabel: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  stateDescription: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    color: COLORS.PRIMARY,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  continueButton: {
    width: '100%',
  },
});
```

### Task 3: Brain State Summary Component
**Create**: `src/components/BrainStateSummary.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface BrainStateSummaryProps {
  brainState: {
    energy_level: number;
    focus_level: number;
    mood_level: number;
    notes?: string;
    created_at: string;
  };
  compact?: boolean;
  testID?: string;
}

export const BrainStateSummary: React.FC<BrainStateSummaryProps> = ({
  brainState,
  compact = false,
  testID,
}) => {
  const getLevelColor = (level: number): string => {
    if (level <= 3) return COLORS.ENERGY_LOW;
    if (level <= 6) return COLORS.ENERGY_MEDIUM;
    return COLORS.ENERGY_HIGH;
  };

  const getLevelText = (level: number): string => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Medium';
    return 'High';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (compact) {
    return (
      <View style={styles.compactContainer} testID={testID}>
        <View style={styles.compactLevels}>
          <View style={styles.compactLevel}>
            <Text style={styles.compactValue}>{brainState.energy_level}</Text>
            <Text style={styles.compactLabel}>Energy</Text>
          </View>
          <View style={styles.compactLevel}>
            <Text style={styles.compactValue}>{brainState.focus_level}</Text>
            <Text style={styles.compactLabel}>Focus</Text>
          </View>
          <View style={styles.compactLevel}>
            <Text style={styles.compactValue}>{brainState.mood_level}</Text>
            <Text style={styles.compactLabel}>Mood</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>
          Checked in at {formatDate(brainState.created_at)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>Today's Brain State</Text>
      
      <View style={styles.levelsContainer}>
        {/* Energy Level */}
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>Energy</Text>
          <View style={[
            styles.levelChip, 
            { backgroundColor: getLevelColor(brainState.energy_level) }
          ]}>
            <Text style={styles.levelValue}>{brainState.energy_level}</Text>
          </View>
          <Text style={styles.levelText}>
            {getLevelText(brainState.energy_level)}
          </Text>
        </View>

        {/* Focus Level */}
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>Focus</Text>
          <View style={[
            styles.levelChip, 
            { backgroundColor: getLevelColor(brainState.focus_level) }
          ]}>
            <Text style={styles.levelValue}>{brainState.focus_level}</Text>
          </View>
          <Text style={styles.levelText}>
            {getLevelText(brainState.focus_level)}
          </Text>
        </View>

        {/* Mood Level */}
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>Mood</Text>
          <View style={[
            styles.levelChip, 
            { backgroundColor: getLevelColor(brainState.mood_level) }
          ]}>
            <Text style={styles.levelValue}>{brainState.mood_level}</Text>
          </View>
          <Text style={styles.levelText}>
            {getLevelText(brainState.mood_level)}
          </Text>
        </View>
      </View>

      {brainState.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{brainState.notes}</Text>
        </View>
      )}

      <Text style={styles.timestamp}>
        Checked in at {formatDate(brainState.created_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.MD,
  },
  levelItem: {
    alignItems: 'center',
    flex: 1,
  },
  levelLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  levelChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  levelValue: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  levelText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  notesContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  notesLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  notesText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Compact styles
  compactContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  compactLevels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.XS,
  },
  compactLevel: {
    alignItems: 'center',
    flex: 1,
  },
  compactValue: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.PRIMARY,
  },
  compactLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
});
```

### Task 4: Update Component Exports
**Update**: `src/components/index.ts`
```typescript
// Existing exports
export { GentleButton } from './GentleButton';
export type { GentleButtonProps } from './GentleButton';

export { BrainStateSlider } from './BrainStateSlider';
export type { BrainStateSliderProps } from './BrainStateSlider';

export { GentleTextInput } from './GentleTextInput';
export type { GentleTextInputProps } from './GentleTextInput';

// New brain state UI exports
export { BrainStateCheckinForm } from './BrainStateCheckinForm';
export type { BrainStateCheckinFormProps } from './BrainStateCheckinForm';

export { CheckinSuccessFeedback } from './CheckinSuccessFeedback';
export type { CheckinSuccessFeedbackProps } from './CheckinSuccessFeedback';

export { BrainStateSummary } from './BrainStateSummary';
export type { BrainStateSummaryProps } from './BrainStateSummary';

// Component integration utilities for Agent 3
export interface ComponentAdaptation {
  touchTargetSize: number;
  spacing: number;
  fontSize: number;
  lineHeight: number;
}

export const createComponentAdaptation = (
  energyLevel: number,
  focusLevel: number
): ComponentAdaptation => {
  if (energyLevel <= 3) {
    return {
      touchTargetSize: 56,
      spacing: 24,
      fontSize: 18,
      lineHeight: 2.0,
    };
  }
  
  if (energyLevel >= 7) {
    return {
      touchTargetSize: 44,
      spacing: 8,
      fontSize: 16,
      lineHeight: 1.2,
    };
  }
  
  return {
    touchTargetSize: 48,
    spacing: 16,
    fontSize: 16,
    lineHeight: 1.5,
  };
};
```

### Task 5: Brain State Screen Integration Tests
**Create**: `__tests__/components/brainStateUI.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { 
  BrainStateCheckinForm, 
  CheckinSuccessFeedback, 
  BrainStateSummary 
} from '../../src/components';

describe('Brain State Check-in UI Components', () => {
  describe('BrainStateCheckinForm', () => {
    const defaultProps = {
      energy: 5,
      focus: 5,
      mood: 5,
      notes: '',
      onEnergyChange: jest.fn(),
      onFocusChange: jest.fn(),
      onMoodChange: jest.fn(),
      onNotesChange: jest.fn(),
      onSubmit: jest.fn(),
      loading: false,
      error: null,
    };

    test('should adapt encouragement message to energy level', () => {
      const lowEnergyState = {
        energy_level: 2,
        focus_level: 3,
        mood_level: 2,
      };

      const { getByText } = render(
        <BrainStateCheckinForm 
          {...defaultProps}
          currentBrainState={lowEnergyState}
        />
      );

      expect(getByText(/No pressure - just checking in/)).toBeTruthy();
    });

    test('should include all required sliders', () => {
      const { getByTestId } = render(
        <BrainStateCheckinForm {...defaultProps} />
      );

      expect(getByTestId('energy-slider')).toBeTruthy();
      expect(getByTestId('focus-slider')).toBeTruthy();
      expect(getByTestId('mood-slider')).toBeTruthy();
    });

    test('should handle error display gently', () => {
      const { getByText } = render(
        <BrainStateCheckinForm 
          {...defaultProps}
          error="Let's try that again in a moment"
        />
      );

      expect(getByText("Let's try that again in a moment")).toBeTruthy();
    });

    test('should adapt submit button text to energy level', () => {
      const lowEnergyState = {
        energy_level: 2,
        focus_level: 3,
        mood_level: 2,
      };

      const { getByText } = render(
        <BrainStateCheckinForm 
          {...defaultProps}
          currentBrainState={lowEnergyState}
        />
      );

      expect(getByText("That's perfect")).toBeTruthy();
    });
  });

  describe('CheckinSuccessFeedback', () => {
    const defaultProps = {
      visible: true,
      brainState: {
        energy_level: 7,
        focus_level: 8,
        mood_level: 6,
      },
      onContinue: jest.fn(),
    };

    test('should show personalized message for high energy', () => {
      const { getByText } = render(
        <CheckinSuccessFeedback {...defaultProps} />
      );

      expect(getByText('Ready to take on the day!')).toBeTruthy();
      expect(getByText('🚀')).toBeTruthy();
    });

    test('should show gentle message for low energy', () => {
      const lowEnergyState = {
        energy_level: 2,
        focus_level: 3,
        mood_level: 2,
      };

      const { getByText } = render(
        <CheckinSuccessFeedback 
          {...defaultProps}
          brainState={lowEnergyState}
        />
      );

      expect(getByText('Thank you for checking in')).toBeTruthy();
      expect(getByText('🌱')).toBeTruthy();
    });

    test('should not render when not visible', () => {
      const { queryByTestId } = render(
        <CheckinSuccessFeedback 
          {...defaultProps}
          visible={false}
          testID="success-feedback"
        />
      );

      expect(queryByTestId('success-feedback')).toBeNull();
    });
  });

  describe('BrainStateSummary', () => {
    const mockBrainState = {
      energy_level: 6,
      focus_level: 7,
      mood_level: 5,
      notes: 'Feeling good today',
      created_at: '2025-06-25T10:30:00Z',
    };

    test('should display all brain state levels', () => {
      const { getByText } = render(
        <BrainStateSummary brainState={mockBrainState} />
      );

      expect(getByText('6')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
    });

    test('should show notes when provided', () => {
      const { getByText } = render(
        <BrainStateSummary brainState={mockBrainState} />
      );

      expect(getByText('Feeling good today')).toBeTruthy();
    });

    test('should render compact version correctly', () => {
      const { getByText } = render(
        <BrainStateSummary brainState={mockBrainState} compact />
      );

      expect(getByText('Energy')).toBeTruthy();
      expect(getByText('Focus')).toBeTruthy();
      expect(getByText('Mood')).toBeTruthy();
    });

    test('should format timestamp correctly', () => {
      const { getByText } = render(
        <BrainStateSummary brainState={mockBrainState} />
      );

      expect(getByText(/Checked in at/)).toBeTruthy();
    });
  });
});
```

## Success Criteria
- [ ] Complete brain state check-in form with adaptive UI
- [ ] Success feedback with personalized encouragement messages
- [ ] Brain state summary component for displaying current state
- [ ] All components adapt spacing and sizing based on brain state
- [ ] Gentle error handling with no red colors or harsh language
- [ ] Proper accessibility labels and screen reader support

## Testing Commands
```bash
npm run test -- --testPathPattern=brainStateUI
```

## Next Sprint
**4D: Task Display Components** - Build task cards and task list components.

## Agent Dependencies
- **Needs from Sprint 4B**: Base interactive components
- **Provides to Agent 3**: Complete brain state UI implementation
- **Replaces**: Agent 3's placeholder components in BrainStateCheckin screen

## Common Issues
- **Adaptation timing**: Ensure UI adapts correctly when brain state changes
- **Message personalization**: Test that encouragement messages match energy levels
- **Touch targets**: Verify all interactive elements meet accessibility requirements
- **Error display**: Use warning colors instead of red for error states

---
**Focus**: Brain state check-in UI only. Task display components come in 4D.