# 🎯 Agent 4 Sprint 4B: Base Interactive Components

## Mission
Create core interactive components (GentleButton, BrainStateSlider, GentleTextInput) with Agent 3 integration and adaptive behavior.

## Time Estimate
1 hour

## Prerequisites
- Sprint 4A completed (design system available)
- Agent 3 store interfaces understood from handoff documentation

## Sprint Goal
Working interactive components that integrate with Agent 3's brain state adaptation system and follow neurodivergent-first principles.

## Core Tasks

### Task 1: GentleButton Component
**Create**: `src/components/GentleButton.tsx`
```typescript
import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, getAdaptiveTouchTarget } from '../constants';

export interface GentleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'premium' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  // Brain state adaptation
  adaptation?: {
    touchTargetSize: number;
    spacing: number;
  };
}

export const GentleButton: React.FC<GentleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  adaptation,
}) => {
  // Use adaptation if provided, otherwise fall back to size-based defaults
  const touchTargetSize = adaptation?.touchTargetSize || getSizeHeight(size);
  const horizontalPadding = adaptation?.spacing || getSizePadding(size);

  const buttonStyle = [
    styles.base,
    styles[variant],
    {
      minHeight: touchTargetSize,
      paddingHorizontal: horizontalPadding,
    },
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const loadingColor = variant === 'primary' || variant === 'premium' 
    ? COLORS.SURFACE 
    : COLORS.PRIMARY;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator 
            color={loadingColor}
            size="small"
            style={styles.loader}
          />
        )}
        <Text style={textStyles}>
          {loading ? 'Just a moment...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Helper functions for default sizing
const getSizeHeight = (size: string): number => {
  switch (size) {
    case 'small': return 44; // Minimum accessibility requirement
    case 'large': return 56;
    default: return 48; // Medium
  }
};

const getSizePadding = (size: string): number => {
  switch (size) {
    case 'small': return SPACING.MD;
    case 'large': return SPACING.XL;
    default: return SPACING.LG; // Medium
  }
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: SPACING.MD,
    justifyContent: 'center',
    alignItems: 'center',
    // Gentle shadow for depth without being overwhelming
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.BUTTON_PRIMARY,
  },
  secondary: {
    backgroundColor: COLORS.BUTTON_SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  premium: {
    backgroundColor: COLORS.PREMIUM_ACCENT,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  
  // States
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontSize: TYPOGRAPHY.SIZES.BUTTON,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BUTTON,
  },
  primaryText: {
    color: COLORS.SURFACE,
  },
  secondaryText: {
    color: COLORS.TEXT_PRIMARY,
  },
  premiumText: {
    color: COLORS.SURFACE,
  },
  ghostText: {
    color: COLORS.PRIMARY,
  },
  
  // Size variations
  smallText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.SIZES.BUTTON,
  },
  largeText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
  },
  
  disabledText: {
    opacity: 0.6,
  },
  
  // Content layout
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: SPACING.SM,
  },
});
```

### Task 2: BrainStateSlider Component
**Create**: `src/components/BrainStateSlider.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants';

export interface BrainStateSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  accessibilityLabel: string;
  accessibilityHint?: string;
  minimumTrackTintColor?: string;
  testID?: string;
  // Brain state adaptation
  adaptation?: {
    touchTargetSize: number;
    spacing: number;
    fontSize: number;
  };
}

export const BrainStateSlider: React.FC<BrainStateSliderProps> = ({
  value,
  onValueChange,
  label,
  minimumValue = 1,
  maximumValue = 10,
  step = 1,
  accessibilityLabel,
  accessibilityHint,
  minimumTrackTintColor = COLORS.PRIMARY,
  testID,
  adaptation,
}) => {
  const getValueLabel = (val: number): string => {
    if (val <= 3) return 'Low';
    if (val <= 6) return 'Medium';
    return 'High';
  };

  const getValueColor = (val: number): string => {
    if (val <= 3) return COLORS.ENERGY_LOW;
    if (val <= 6) return COLORS.ENERGY_MEDIUM;
    return COLORS.ENERGY_HIGH;
  };

  const sliderHeight = adaptation?.touchTargetSize || LAYOUT.TOUCH_TARGET_PREFERRED;
  const verticalSpacing = adaptation?.spacing || SPACING.SM;
  const labelFontSize = adaptation?.fontSize || TYPOGRAPHY.SIZES.BODY;

  return (
    <View style={[styles.container, { marginVertical: verticalSpacing }]} testID={testID}>
      {label && (
        <Text style={[styles.label, { fontSize: labelFontSize }]}>
          {label}
        </Text>
      )}
      
      <View style={styles.sliderContainer}>
        <Slider
          style={[styles.slider, { height: sliderHeight }]}
          value={value}
          onValueChange={onValueChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumTrackTintColor={COLORS.BORDER}
          thumbStyle={[styles.thumb, {
            backgroundColor: minimumTrackTintColor,
          }]}
          trackStyle={styles.track}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityValue={{ 
            text: `${value} out of ${maximumValue}, ${getValueLabel(value)}` 
          }}
        />
        
        <View style={styles.valueContainer}>
          <View style={[styles.valueChip, { backgroundColor: getValueColor(value) }]}>
            <Text style={styles.valueNumber}>{value}</Text>
          </View>
          <Text style={[styles.valueLabel, { fontSize: labelFontSize - 2 }]}>
            {getValueLabel(value)}
          </Text>
        </View>
      </View>
      
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>Low</Text>
        <Text style={styles.scaleLabel}>High</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical applied dynamically
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SM,
  },
  slider: {
    flex: 1,
    // height applied dynamically
  },
  thumb: {
    width: 24,
    height: 24,
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  valueContainer: {
    marginLeft: SPACING.MD,
    alignItems: 'center',
    minWidth: 60,
  },
  valueChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  valueNumber: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  valueLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.XS,
  },
  scaleLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_TERTIARY,
  },
});
```

### Task 3: GentleTextInput Component
**Create**: `src/components/GentleTextInput.tsx`
```typescript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps 
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT } from '../constants';

export interface GentleTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  // Brain state adaptation
  adaptation?: {
    spacing: number;
    fontSize: number;
    lineHeight: number;
  };
}

export const GentleTextInput: React.FC<GentleTextInputProps> = ({
  label,
  hint,
  error,
  required = false,
  containerStyle,
  inputStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  adaptation,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const fontSize = adaptation?.fontSize || TYPOGRAPHY.SIZES.BODY;
  const lineHeight = adaptation?.lineHeight || TYPOGRAPHY.LINE_HEIGHT.NORMAL;
  const verticalSpacing = adaptation?.spacing || SPACING.SM;

  const inputStyles = [
    styles.input,
    {
      fontSize,
      lineHeight: lineHeight * fontSize,
      paddingVertical: verticalSpacing,
    },
    isFocused && styles.inputFocused,
    error && styles.inputError,
    inputStyle,
  ];

  const containerStyles = [
    styles.container,
    { marginVertical: verticalSpacing },
    containerStyle,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      {label && (
        <Text style={[styles.label, { fontSize }]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <TextInput
        style={inputStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={COLORS.TEXT_TERTIARY}
        selectionColor={COLORS.PRIMARY}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint || hint}
        {...textInputProps}
      />
      
      {hint && !error && (
        <Text style={[styles.hint, { fontSize: fontSize - 2 }]}>
          {hint}
        </Text>
      )}
      
      {error && (
        <Text style={[styles.error, { fontSize: fontSize - 2 }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical applied dynamically
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  required: {
    color: COLORS.WARNING, // Use warning color instead of red
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: LAYOUT.BORDER_RADIUS.MEDIUM,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.SURFACE,
    color: COLORS.TEXT_PRIMARY,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY,
    minHeight: LAYOUT.TOUCH_TARGET_PREFERRED,
  },
  inputFocused: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    // Gentle glow effect
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.WARNING, // Use warning instead of error red
    backgroundColor: COLORS.WARNING + '10', // Very light background
  },
  hint: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.CAPTION,
  },
  error: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.WARNING, // Use warning color for errors
    marginTop: SPACING.XS,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.CAPTION,
  },
});
```

### Task 4: Base Component Export
**Create**: `src/components/index.ts`
```typescript
export { GentleButton } from './GentleButton';
export type { GentleButtonProps } from './GentleButton';

export { BrainStateSlider } from './BrainStateSlider';
export type { BrainStateSliderProps } from './BrainStateSlider';

export { GentleTextInput } from './GentleTextInput';
export type { GentleTextInputProps } from './GentleTextInput';

// Component integration utilities for Agent 3
export interface ComponentAdaptation {
  touchTargetSize: number;
  spacing: number;
  fontSize: number;
  lineHeight: number;
}

// Helper to create adaptation props from brain state
export const createComponentAdaptation = (
  energyLevel: number,
  focusLevel: number
): ComponentAdaptation => {
  // Low energy = larger, more spaced elements
  if (energyLevel <= 3) {
    return {
      touchTargetSize: 56,
      spacing: 24, // SPACING.LG
      fontSize: 18,
      lineHeight: 2.0,
    };
  }
  
  // High energy = compact, efficient elements  
  if (energyLevel >= 7) {
    return {
      touchTargetSize: 44,
      spacing: 8, // SPACING.SM
      fontSize: 16,
      lineHeight: 1.2,
    };
  }
  
  // Medium energy = standard sizing
  return {
    touchTargetSize: 48,
    spacing: 16, // SPACING.MD
    fontSize: 16,
    lineHeight: 1.5,
  };
};
```

### Task 5: Component Integration Tests
**Create**: `__tests__/components/baseComponents.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GentleButton, BrainStateSlider, GentleTextInput } from '../../src/components';

describe('Base Interactive Components', () => {
  describe('GentleButton', () => {
    test('should meet minimum touch target requirements', () => {
      const { getByTestId } = render(
        <GentleButton 
          title="Test Button" 
          onPress={() => {}} 
          testID="test-button"
        />
      );
      
      const button = getByTestId('test-button');
      const style = button.props.style.find((s: any) => s.minHeight);
      expect(style.minHeight).toBeGreaterThanOrEqual(44);
    });
    
    test('should adapt to brain state', () => {
      const adaptation = { touchTargetSize: 56, spacing: 24 };
      const { getByTestId } = render(
        <GentleButton 
          title="Adapted Button" 
          onPress={() => {}} 
          adaptation={adaptation}
          testID="adapted-button"
        />
      );
      
      const button = getByTestId('adapted-button');
      const style = button.props.style.find((s: any) => s.minHeight);
      expect(style.minHeight).toBe(56);
    });
    
    test('should provide proper accessibility labels', () => {
      const { getByLabelText } = render(
        <GentleButton 
          title="Submit" 
          onPress={() => {}} 
          accessibilityLabel="Submit brain state check-in"
        />
      );
      
      expect(getByLabelText('Submit brain state check-in')).toBeTruthy();
    });
    
    test('should show gentle loading message', () => {
      const { getByText } = render(
        <GentleButton 
          title="Submit" 
          onPress={() => {}} 
          loading={true}
        />
      );
      
      expect(getByText('Just a moment...')).toBeTruthy();
    });
  });
  
  describe('BrainStateSlider', () => {
    test('should provide descriptive accessibility values', () => {
      const { getByDisplayValue } = render(
        <BrainStateSlider 
          value={7}
          onValueChange={() => {}}
          accessibilityLabel="Energy level slider"
        />
      );
      
      // Should provide contextual information
      const slider = getByDisplayValue('7');
      expect(slider.props.accessibilityValue.text).toContain('7 out of 10');
      expect(slider.props.accessibilityValue.text).toContain('High');
    });
    
    test('should adapt sizing based on brain state', () => {
      const adaptation = { touchTargetSize: 56, spacing: 24, fontSize: 18 };
      const { getByTestId } = render(
        <BrainStateSlider 
          value={5}
          onValueChange={() => {}}
          accessibilityLabel="Test slider"
          adaptation={adaptation}
          testID="adapted-slider"
        />
      );
      
      const container = getByTestId('adapted-slider');
      const style = container.props.style;
      expect(style.marginVertical).toBe(24);
    });
    
    test('should provide visual value feedback', () => {
      const { getByText } = render(
        <BrainStateSlider 
          value={3}
          onValueChange={() => {}}
          accessibilityLabel="Test slider"
        />
      );
      
      expect(getByText('3')).toBeTruthy();
      expect(getByText('Low')).toBeTruthy();
    });
  });
  
  describe('GentleTextInput', () => {
    test('should use warning color instead of red for errors', () => {
      const { getByTestId } = render(
        <GentleTextInput 
          error="Please enter a value"
          testID="error-input"
        />
      );
      
      const input = getByTestId('error-input');
      // Should use warning color, not red
      expect(input).toBeTruthy();
    });
    
    test('should adapt text size based on brain state', () => {
      const adaptation = { spacing: 24, fontSize: 18, lineHeight: 2.0 };
      const { getByTestId } = render(
        <GentleTextInput 
          adaptation={adaptation}
          testID="adapted-input"
        />
      );
      
      const container = getByTestId('adapted-input');
      expect(container).toBeTruthy();
    });
    
    test('should provide gentle focus indication', () => {
      const { getByTestId } = render(
        <GentleTextInput 
          testID="focus-input"
        />
      );
      
      const input = getByTestId('focus-input');
      fireEvent(input, 'focus');
      
      // Should have gentle focus styling
      expect(input).toBeTruthy();
    });
  });
});
```

## Success Criteria
- [ ] GentleButton meets 44px touch target minimum and adapts to brain state
- [ ] BrainStateSlider provides clear visual and accessibility feedback
- [ ] GentleTextInput uses gentle styling (no red, warning colors only)
- [ ] All components integrate with brain state adaptation system
- [ ] Proper accessibility labels and hints on all interactive elements
- [ ] Components export proper TypeScript interfaces for Agent 3

## Testing Commands
```bash
npm run test -- --testPathPattern=baseComponents
```

## Next Sprint
**4C: Brain State Check-in UI** - Build complete check-in screen using these components.

## Agent Dependencies
- **Needs from Sprint 4A**: Design system constants and adaptive theme utilities
- **Provides to Sprint 4C**: Reusable interactive components for check-in screen
- **Provides to Agent 3**: Component adaptation interfaces matching handoff spec

## Common Issues
- **Touch targets**: Always verify minimum 44px height on all interactive elements
- **Colors**: Never use red colors, use warning color for errors instead
- **Adaptation**: Test that components respond correctly to brain state changes
- **Accessibility**: Include proper labels, hints, and semantic information

---
**Focus**: Core interactive components only. Screen assembly comes in 4C.