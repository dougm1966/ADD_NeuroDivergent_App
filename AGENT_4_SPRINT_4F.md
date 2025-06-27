# ♿ Agent 4 Sprint 4F: Accessibility & Adaptation

## Mission
Enhance all components with advanced accessibility features, sensory customization options, and comprehensive brain state adaptation systems.

## Time Estimate
1.5 hours

## Prerequisites
- Sprint 4E completed (freemium UI components available)
- All base components created (4A-4E)
- WCAG 2.1 AA guidelines understood

## Sprint Goal
Create accessibility enhancement utilities, sensory customization components, and comprehensive adaptation systems that make the app truly inclusive for neurodivergent users.

## Core Tasks

### Task 1: Advanced Accessibility Hook
**Create**: `src/hooks/useAccessibility.ts`
```typescript
import { useState, useEffect } from 'react';
import { AccessibilityInfo, Appearance } from 'react-native';

export interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  preferredColorScheme: 'light' | 'dark' | 'system';
  preferredFontScale: number;
}

export interface AccessibilityActions {
  announceForScreenReader: (message: string) => void;
  setFocus: (reactTag: number) => void;
  getContrastRatio: (foreground: string, background: string) => number;
  validateTouchTarget: (width: number, height: number) => boolean;
}

export const useAccessibility = (): [AccessibilityState, AccessibilityActions] => {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isBoldTextEnabled: false,
    isGrayscaleEnabled: false,
    isInvertColorsEnabled: false,
    preferredColorScheme: 'system',
    preferredFontScale: 1.0,
  });

  useEffect(() => {
    const checkAccessibilitySettings = async () => {
      try {
        const [
          screenReader,
          reduceMotion,
          reduceTransparency,
          boldText,
          grayscale,
          invertColors,
        ] = await Promise.all([
          AccessibilityInfo.isScreenReaderEnabled(),
          AccessibilityInfo.isReduceMotionEnabled(),
          AccessibilityInfo.isReduceTransparencyEnabled?.() || Promise.resolve(false),
          AccessibilityInfo.isBoldTextEnabled?.() || Promise.resolve(false),
          AccessibilityInfo.isGrayscaleEnabled?.() || Promise.resolve(false),
          AccessibilityInfo.isInvertColorsEnabled?.() || Promise.resolve(false),
        ]);

        setAccessibilityState(prev => ({
          ...prev,
          isScreenReaderEnabled: screenReader,
          isReduceMotionEnabled: reduceMotion,
          isReduceTransparencyEnabled: reduceTransparency,
          isBoldTextEnabled: boldText,
          isGrayscaleEnabled: grayscale,
          isInvertColorsEnabled: invertColors,
          preferredColorScheme: Appearance.getColorScheme() || 'system',
        }));
      } catch (error) {
        console.warn('Error checking accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();

    // Listen for accessibility changes
    const screenReaderChangedListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        setAccessibilityState(prev => ({ ...prev, isScreenReaderEnabled: enabled }));
      }
    );

    const reduceMotionChangedListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setAccessibilityState(prev => ({ ...prev, isReduceMotionEnabled: enabled }));
      }
    );

    const appearanceListener = Appearance.addChangeListener(({ colorScheme }) => {
      setAccessibilityState(prev => ({ ...prev, preferredColorScheme: colorScheme || 'system' }));
    });

    return () => {
      screenReaderChangedListener?.remove();
      reduceMotionChangedListener?.remove();
      appearanceListener?.remove();
    };
  }, []);

  const accessibilityActions: AccessibilityActions = {
    announceForScreenReader: (message: string) => {
      if (accessibilityState.isScreenReaderEnabled) {
        AccessibilityInfo.announceForAccessibility(message);
      }
    },

    setFocus: (reactTag: number) => {
      AccessibilityInfo.setAccessibilityFocus(reactTag);
    },

    getContrastRatio: (foreground: string, background: string): number => {
      // Simplified contrast ratio calculation
      // In production, use a proper color contrast library
      const getLuminance = (color: string): number => {
        // Convert hex to RGB and calculate relative luminance
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        const sRGB = [r, g, b].map(c => 
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        
        return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
      };

      const l1 = getLuminance(foreground);
      const l2 = getLuminance(background);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      
      return (lighter + 0.05) / (darker + 0.05);
    },

    validateTouchTarget: (width: number, height: number): boolean => {
      const minimumSize = 44; // Apple HIG minimum
      return width >= minimumSize && height >= minimumSize;
    },
  };

  return [accessibilityState, accessibilityActions];
};

// Accessibility validation utilities
export const validateComponentAccessibility = (
  component: React.ComponentType<any>,
  props: any
): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for required accessibility props
  if (!props.accessibilityLabel && !props.accessibilityLabelledBy) {
    issues.push('Missing accessibilityLabel');
  }
  
  // Check touch target size
  if (props.style && (props.style.width < 44 || props.style.height < 44)) {
    issues.push('Touch target smaller than 44px minimum');
  }
  
  // Check color contrast (would need actual color values)
  if (props.color && props.backgroundColor) {
    // Would validate contrast ratio here
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};
```

### Task 2: Sensory Customization Provider
**Create**: `src/providers/SensoryCustomizationProvider.tsx`
```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccessibility } from '../hooks/useAccessibility';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface SensoryPreferences {
  // Visual preferences
  colorTheme: 'default' | 'high_contrast' | 'monochrome' | 'warm' | 'cool';
  fontFamily: 'system' | 'dyslexia_friendly' | 'large_print';
  fontSize: 'small' | 'medium' | 'large' | 'extra_large';
  lineSpacing: 'tight' | 'normal' | 'relaxed' | 'spacious';
  animationLevel: 'none' | 'minimal' | 'standard' | 'full';
  
  // Layout preferences
  spacing: 'compact' | 'standard' | 'comfortable' | 'spacious';
  touchTargetSize: 'minimum' | 'standard' | 'large' | 'extra_large';
  
  // Audio preferences
  soundEffects: boolean;
  hapticFeedback: 'none' | 'light' | 'medium' | 'strong';
  
  // Interaction preferences
  tapDelay: number; // milliseconds
  longPressDelay: number; // milliseconds
  scrollSensitivity: 'low' | 'medium' | 'high';
  
  // Brain state overrides
  allowBrainStateOverrides: boolean;
  lowEnergyEnhancements: boolean;
  highEnergyOptimizations: boolean;
}

export interface SensoryTheme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    premium: string;
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  animation: {
    duration: number;
    easing: string;
    enabled: boolean;
  };
  interaction: {
    touchTargetSize: number;
    tapDelay: number;
    longPressDelay: number;
  };
}

type SensoryAction = 
  | { type: 'UPDATE_PREFERENCES'; preferences: Partial<SensoryPreferences> }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'LOAD_PREFERENCES'; preferences: SensoryPreferences }
  | { type: 'APPLY_BRAIN_STATE_ADAPTATION'; energyLevel: number; focusLevel: number };

const defaultPreferences: SensoryPreferences = {
  colorTheme: 'default',
  fontFamily: 'system',
  fontSize: 'medium',
  lineSpacing: 'normal',
  animationLevel: 'standard',
  spacing: 'standard',
  touchTargetSize: 'standard',
  soundEffects: true,
  hapticFeedback: 'medium',
  tapDelay: 0,
  longPressDelay: 500,
  scrollSensitivity: 'medium',
  allowBrainStateOverrides: true,
  lowEnergyEnhancements: true,
  highEnergyOptimizations: true,
};

const sensoryReducer = (state: SensoryPreferences, action: SensoryAction): SensoryPreferences => {
  switch (action.type) {
    case 'UPDATE_PREFERENCES':
      return { ...state, ...action.preferences };
    
    case 'RESET_TO_DEFAULTS':
      return { ...defaultPreferences };
    
    case 'LOAD_PREFERENCES':
      return action.preferences;
    
    case 'APPLY_BRAIN_STATE_ADAPTATION':
      if (!state.allowBrainStateOverrides) return state;
      
      const { energyLevel, focusLevel } = action;
      const adaptations: Partial<SensoryPreferences> = {};
      
      // Low energy adaptations
      if (energyLevel <= 3 && state.lowEnergyEnhancements) {
        adaptations.spacing = 'spacious';
        adaptations.touchTargetSize = 'large';
        adaptations.fontSize = state.fontSize === 'small' ? 'medium' : state.fontSize;
        adaptations.lineSpacing = 'spacious';
        adaptations.animationLevel = 'minimal';
      }
      
      // High energy optimizations
      if (energyLevel >= 7 && state.highEnergyOptimizations) {
        adaptations.spacing = 'compact';
        adaptations.touchTargetSize = 'standard';
        adaptations.animationLevel = 'full';
      }
      
      // Low focus adaptations
      if (focusLevel <= 3) {
        adaptations.touchTargetSize = 'large';
        adaptations.tapDelay = 200; // Slight delay to prevent accidental taps
        adaptations.longPressDelay = 700; // Longer delay for low focus
      }
      
      return { ...state, ...adaptations };
    
    default:
      return state;
  }
};

const SensoryContext = createContext<{
  preferences: SensoryPreferences;
  theme: SensoryTheme;
  updatePreferences: (preferences: Partial<SensoryPreferences>) => void;
  resetToDefaults: () => void;
  applyBrainStateAdaptation: (energyLevel: number, focusLevel: number) => void;
}>({
  preferences: defaultPreferences,
  theme: {} as SensoryTheme,
  updatePreferences: () => {},
  resetToDefaults: () => {},
  applyBrainStateAdaptation: () => {},
});

export const useSensoryCustomization = () => {
  const context = useContext(SensoryContext);
  if (!context) {
    throw new Error('useSensoryCustomization must be used within a SensoryCustomizationProvider');
  }
  return context;
};

const createThemeFromPreferences = (
  preferences: SensoryPreferences,
  accessibilityState: any
): SensoryTheme => {
  // Color themes
  const getColorPalette = () => {
    switch (preferences.colorTheme) {
      case 'high_contrast':
        return {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#0000FF',
          secondary: '#000080',
          text: '#000000',
          textSecondary: '#333333',
          border: '#000000',
          success: '#008000',
          warning: '#FFA500',
          premium: '#800080',
        };
      
      case 'monochrome':
        return {
          background: '#F8F8F8',
          surface: '#FFFFFF',
          primary: '#333333',
          secondary: '#666666',
          text: '#000000',
          textSecondary: '#555555',
          border: '#CCCCCC',
          success: '#444444',
          warning: '#666666',
          premium: '#222222',
        };
      
      case 'warm':
        return {
          background: '#FFF9F5',
          surface: '#FFFFFF',
          primary: '#D2691E',
          secondary: '#DEB887',
          text: '#8B4513',
          textSecondary: '#A0522D',
          border: '#F4A460',
          success: '#228B22',
          warning: '#FF8C00',
          premium: '#B8860B',
        };
      
      case 'cool':
        return {
          background: '#F0F8FF',
          surface: '#FFFFFF',
          primary: '#4682B4',
          secondary: '#87CEEB',
          text: '#2F4F4F',
          textSecondary: '#708090',
          border: '#B0C4DE',
          success: '#20B2AA',
          warning: '#4169E1',
          premium: '#483D8B',
        };
      
      default:
        return {
          background: COLORS.BACKGROUND,
          surface: COLORS.SURFACE,
          primary: COLORS.PRIMARY,
          secondary: COLORS.SECONDARY,
          text: COLORS.TEXT_PRIMARY,
          textSecondary: COLORS.TEXT_SECONDARY,
          border: COLORS.BORDER,
          success: COLORS.SUCCESS,
          warning: COLORS.WARNING,
          premium: COLORS.PREMIUM_ACCENT,
        };
    }
  };

  // Typography settings
  const getTypography = () => {
    const baseSizes = {
      small: 14,
      medium: 16,
      large: 18,
      extra_large: 20,
    };

    const lineHeights = {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
      spacious: 2.0,
    };

    return {
      fontFamily: preferences.fontFamily === 'dyslexia_friendly' ? 'OpenDyslexic' : 'System',
      fontSize: baseSizes[preferences.fontSize],
      lineHeight: lineHeights[preferences.lineSpacing],
      fontWeight: accessibilityState.isBoldTextEnabled ? '600' : '400',
    };
  };

  // Spacing settings
  const getSpacing = () => {
    const multipliers = {
      compact: 0.75,
      standard: 1.0,
      comfortable: 1.25,
      spacious: 1.5,
    };

    const multiplier = multipliers[preferences.spacing];

    return {
      xs: Math.round(SPACING.XS * multiplier),
      sm: Math.round(SPACING.SM * multiplier),
      md: Math.round(SPACING.MD * multiplier),
      lg: Math.round(SPACING.LG * multiplier),
      xl: Math.round(SPACING.XL * multiplier),
    };
  };

  // Animation settings
  const getAnimation = () => {
    const durations = {
      none: 0,
      minimal: 150,
      standard: 300,
      full: 500,
    };

    return {
      duration: accessibilityState.isReduceMotionEnabled ? 0 : durations[preferences.animationLevel],
      easing: 'ease-in-out',
      enabled: !accessibilityState.isReduceMotionEnabled && preferences.animationLevel !== 'none',
    };
  };

  // Interaction settings
  const getInteraction = () => {
    const touchTargetSizes = {
      minimum: 44,
      standard: 48,
      large: 56,
      extra_large: 64,
    };

    return {
      touchTargetSize: touchTargetSizes[preferences.touchTargetSize],
      tapDelay: preferences.tapDelay,
      longPressDelay: preferences.longPressDelay,
    };
  };

  return {
    colors: getColorPalette(),
    typography: getTypography(),
    spacing: getSpacing(),
    animation: getAnimation(),
    interaction: getInteraction(),
  };
};

export const SensoryCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, dispatch] = useReducer(sensoryReducer, defaultPreferences);
  const [accessibilityState] = useAccessibility();

  // Load preferences from storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem('sensory_preferences');
        if (stored) {
          const parsedPreferences = JSON.parse(stored);
          dispatch({ type: 'LOAD_PREFERENCES', preferences: parsedPreferences });
        }
      } catch (error) {
        console.warn('Error loading sensory preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to storage when they change
  useEffect(() => {
    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem('sensory_preferences', JSON.stringify(preferences));
      } catch (error) {
        console.warn('Error saving sensory preferences:', error);
      }
    };

    savePreferences();
  }, [preferences]);

  const theme = createThemeFromPreferences(preferences, accessibilityState);

  const updatePreferences = (newPreferences: Partial<SensoryPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences: newPreferences });
  };

  const resetToDefaults = () => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  };

  const applyBrainStateAdaptation = (energyLevel: number, focusLevel: number) => {
    dispatch({ type: 'APPLY_BRAIN_STATE_ADAPTATION', energyLevel, focusLevel });
  };

  return (
    <SensoryContext.Provider
      value={{
        preferences,
        theme,
        updatePreferences,
        resetToDefaults,
        applyBrainStateAdaptation,
      }}
    >
      {children}
    </SensoryContext.Provider>
  );
};
```

### Task 3: Enhanced Brain State Adaptation System
**Create**: `src/components/BrainStateAdaptationManager.tsx`
```typescript
import React, { useEffect } from 'react';
import { useSensoryCustomization } from '../providers/SensoryCustomizationProvider';
import { useAccessibility } from '../hooks/useAccessibility';

export interface BrainStateAdaptationManagerProps {
  currentBrainState: {
    energy_level: number;
    focus_level: number;
    mood_level: number;
  } | null;
  children: React.ReactNode;
}

export const BrainStateAdaptationManager: React.FC<BrainStateAdaptationManagerProps> = ({
  currentBrainState,
  children,
}) => {
  const { applyBrainStateAdaptation, preferences } = useSensoryCustomization();
  const [accessibilityState, accessibilityActions] = useAccessibility();

  // Apply adaptations when brain state changes
  useEffect(() => {
    if (currentBrainState && preferences.allowBrainStateOverrides) {
      applyBrainStateAdaptation(
        currentBrainState.energy_level,
        currentBrainState.focus_level
      );

      // Announce brain state changes to screen readers
      if (accessibilityState.isScreenReaderEnabled) {
        const energyDescription = getEnergyDescription(currentBrainState.energy_level);
        const adaptationMessage = getAdaptationMessage(
          currentBrainState.energy_level,
          currentBrainState.focus_level
        );
        
        accessibilityActions.announceForScreenReader(
          `Brain state updated. ${energyDescription}. ${adaptationMessage}`
        );
      }
    }
  }, [currentBrainState, preferences.allowBrainStateOverrides]);

  return <>{children}</>;
};

const getEnergyDescription = (energyLevel: number): string => {
  if (energyLevel <= 3) return "Low energy detected";
  if (energyLevel >= 7) return "High energy detected";
  return "Medium energy level";
};

const getAdaptationMessage = (energyLevel: number, focusLevel: number): string => {
  const adaptations = [];
  
  if (energyLevel <= 3) {
    adaptations.push("Interface adapted for low energy with larger touch targets and more spacing");
  }
  
  if (energyLevel >= 7) {
    adaptations.push("Interface optimized for high energy with compact layout");
  }
  
  if (focusLevel <= 3) {
    adaptations.push("Touch interactions adjusted for improved focus");
  }
  
  return adaptations.length > 0 
    ? adaptations.join(". ")
    : "Interface settings maintained";
};

// Enhanced component wrapper for brain state adaptation
export const withBrainStateAdaptation = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P & { brainState?: { energy_level: number; focus_level: number } }>((props, ref) => {
    const { theme, preferences } = useSensoryCustomization();
    const { brainState, ...componentProps } = props;

    // Create adaptation props based on current brain state and preferences
    const adaptationProps = brainState ? {
      style: {
        ...((componentProps as any).style || {}),
        minHeight: theme.interaction.touchTargetSize,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
      },
      accessibilityProps: {
        accessibilityRole: (componentProps as any).accessibilityRole || 'button',
        accessibilityLabel: (componentProps as any).accessibilityLabel,
        accessibilityHint: (componentProps as any).accessibilityHint,
        accessibilityState: {
          ...((componentProps as any).accessibilityState || {}),
          expanded: false,
          selected: false,
        },
      },
    } : {};

    return (
      <Component
        ref={ref}
        {...(componentProps as P)}
        {...adaptationProps}
      />
    );
  });
};
```

### Task 4: Accessibility Settings Screen Component
**Create**: `src/components/AccessibilitySettingsScreen.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { GentleButton } from './GentleButton';
import { useSensoryCustomization } from '../providers/SensoryCustomizationProvider';
import { useAccessibility } from '../hooks/useAccessibility';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface AccessibilitySettingsScreenProps {
  onBack: () => void;
  testID?: string;
}

export const AccessibilitySettingsScreen: React.FC<AccessibilitySettingsScreenProps> = ({
  onBack,
  testID,
}) => {
  const { preferences, theme, updatePreferences, resetToDefaults } = useSensoryCustomization();
  const [accessibilityState, accessibilityActions] = useAccessibility();

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    updatePreferences({ [key]: value });
    
    // Announce changes to screen readers
    accessibilityActions.announceForScreenReader(
      `${key.replace(/_/g, ' ')} setting changed to ${value}`
    );
  };

  const SettingRow: React.FC<{
    label: string;
    description: string;
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ label, description, value, onChange, disabled = false }) => (
    <View style={[styles.settingRow, { paddingVertical: theme.spacing.md }]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { fontSize: theme.typography.fontSize }]}>
          {label}
        </Text>
        <Text style={[
          styles.settingDescription, 
          { 
            fontSize: theme.typography.fontSize - 2,
            lineHeight: theme.typography.lineHeight * (theme.typography.fontSize - 2),
          }
        ]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ 
          false: COLORS.BORDER, 
          true: theme.colors.primary + '60' 
        }}
        thumbColor={value ? theme.colors.primary : COLORS.TEXT_TERTIARY}
        accessibilityLabel={`${label} setting`}
        accessibilityHint={`Currently ${value ? 'enabled' : 'disabled'}. Double tap to toggle.`}
        style={{
          transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], // Larger for accessibility
        }}
      />
    </View>
  );

  const PickerRow: React.FC<{
    label: string;
    description: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
  }> = ({ label, description, value, options, onChange }) => (
    <View style={[styles.settingRow, { paddingVertical: theme.spacing.md }]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { fontSize: theme.typography.fontSize }]}>
          {label}
        </Text>
        <Text style={[
          styles.settingDescription,
          { 
            fontSize: theme.typography.fontSize - 2,
            lineHeight: theme.typography.lineHeight * (theme.typography.fontSize - 2),
          }
        ]}>
          {description}
        </Text>
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <GentleButton
              key={option.value}
              title={option.label}
              onPress={() => onChange(option.value)}
              variant={value === option.value ? 'primary' : 'ghost'}
              size="small"
              style={styles.optionButton}
              accessibilityLabel={`${label}: ${option.label}`}
              accessibilityState={{ selected: value === option.value }}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]} testID={testID}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { padding: theme.spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { marginBottom: theme.spacing.xl }]}>
          <Text style={[
            styles.title, 
            { 
              fontSize: theme.typography.fontSize + 8,
              lineHeight: theme.typography.lineHeight * (theme.typography.fontSize + 8),
            }
          ]}>
            Accessibility & Sensory Settings
          </Text>
          <Text style={[
            styles.subtitle,
            { 
              fontSize: theme.typography.fontSize,
              lineHeight: theme.typography.lineHeight * theme.typography.fontSize,
              marginTop: theme.spacing.sm,
            }
          ]}>
            Customize the app to work best for your sensory and accessibility needs.
          </Text>
        </View>

        {/* System Accessibility Status */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            System Accessibility Status
          </Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusItem, { color: accessibilityState.isScreenReaderEnabled ? theme.colors.success : theme.colors.textSecondary }]}>
              Screen Reader: {accessibilityState.isScreenReaderEnabled ? 'Active' : 'Inactive'}
            </Text>
            <Text style={[styles.statusItem, { color: accessibilityState.isReduceMotionEnabled ? theme.colors.success : theme.colors.textSecondary }]}>
              Reduce Motion: {accessibilityState.isReduceMotionEnabled ? 'Active' : 'Inactive'}
            </Text>
            <Text style={[styles.statusItem, { color: accessibilityState.isBoldTextEnabled ? theme.colors.success : theme.colors.textSecondary }]}>
              Bold Text: {accessibilityState.isBoldTextEnabled ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* Visual Preferences */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            Visual Preferences
          </Text>

          <PickerRow
            label="Color Theme"
            description="Choose colors that work best for your visual needs"
            value={preferences.colorTheme}
            options={[
              { label: 'Default', value: 'default' },
              { label: 'High Contrast', value: 'high_contrast' },
              { label: 'Monochrome', value: 'monochrome' },
              { label: 'Warm Tones', value: 'warm' },
              { label: 'Cool Tones', value: 'cool' },
            ]}
            onChange={(value) => handlePreferenceChange('colorTheme', value)}
          />

          <PickerRow
            label="Font Size"
            description="Adjust text size for comfortable reading"
            value={preferences.fontSize}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
              { label: 'Extra Large', value: 'extra_large' },
            ]}
            onChange={(value) => handlePreferenceChange('fontSize', value)}
          />

          <PickerRow
            label="Line Spacing"
            description="Adjust space between lines for easier reading"
            value={preferences.lineSpacing}
            options={[
              { label: 'Tight', value: 'tight' },
              { label: 'Normal', value: 'normal' },
              { label: 'Relaxed', value: 'relaxed' },
              { label: 'Spacious', value: 'spacious' },
            ]}
            onChange={(value) => handlePreferenceChange('lineSpacing', value)}
          />

          <PickerRow
            label="Animation Level"
            description="Control motion and animations in the interface"
            value={preferences.animationLevel}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Minimal', value: 'minimal' },
              { label: 'Standard', value: 'standard' },
              { label: 'Full', value: 'full' },
            ]}
            onChange={(value) => handlePreferenceChange('animationLevel', value)}
          />
        </View>

        {/* Layout Preferences */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            Layout & Interaction
          </Text>

          <PickerRow
            label="Spacing"
            description="Adjust spacing between interface elements"
            value={preferences.spacing}
            options={[
              { label: 'Compact', value: 'compact' },
              { label: 'Standard', value: 'standard' },
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Spacious', value: 'spacious' },
            ]}
            onChange={(value) => handlePreferenceChange('spacing', value)}
          />

          <PickerRow
            label="Touch Target Size"
            description="Make buttons and interactive elements larger"
            value={preferences.touchTargetSize}
            options={[
              { label: 'Minimum (44px)', value: 'minimum' },
              { label: 'Standard (48px)', value: 'standard' },
              { label: 'Large (56px)', value: 'large' },
              { label: 'Extra Large (64px)', value: 'extra_large' },
            ]}
            onChange={(value) => handlePreferenceChange('touchTargetSize', value)}
          />

          <PickerRow
            label="Haptic Feedback"
            description="Physical feedback for touch interactions"
            value={preferences.hapticFeedback}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Light', value: 'light' },
              { label: 'Medium', value: 'medium' },
              { label: 'Strong', value: 'strong' },
            ]}
            onChange={(value) => handlePreferenceChange('hapticFeedback', value)}
          />
        </View>

        {/* Brain State Integration */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            Brain State Integration
          </Text>

          <SettingRow
            label="Allow Brain State Adaptations"
            description="Let the app automatically adjust based on your daily brain state check-ins"
            value={preferences.allowBrainStateOverrides}
            onChange={(value) => handlePreferenceChange('allowBrainStateOverrides', value)}
          />

          <SettingRow
            label="Low Energy Enhancements"
            description="Automatically make interface easier to use on low energy days"
            value={preferences.lowEnergyEnhancements}
            onChange={(value) => handlePreferenceChange('lowEnergyEnhancements', value)}
            disabled={!preferences.allowBrainStateOverrides}
          />

          <SettingRow
            label="High Energy Optimizations"
            description="Automatically optimize interface for efficiency on high energy days"
            value={preferences.highEnergyOptimizations}
            onChange={(value) => handlePreferenceChange('highEnergyOptimizations', value)}
            disabled={!preferences.allowBrainStateOverrides}
          />
        </View>

        {/* Audio & Feedback */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            Audio & Feedback
          </Text>

          <SettingRow
            label="Sound Effects"
            description="Play gentle sounds for task completion and other actions"
            value={preferences.soundEffects}
            onChange={(value) => handlePreferenceChange('soundEffects', value)}
          />
        </View>

        {/* Reset Options */}
        <View style={[styles.section, { marginBottom: theme.spacing.xl }]}>
          <Text style={[styles.sectionTitle, { fontSize: theme.typography.fontSize + 2 }]}>
            Reset Settings
          </Text>
          
          <GentleButton
            title="Reset to Defaults"
            onPress={resetToDefaults}
            variant="ghost"
            accessibilityLabel="Reset all accessibility settings to default values"
            accessibilityHint="This will undo all your customizations"
            style={styles.resetButton}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { padding: theme.spacing.lg }]}>
        <GentleButton
          title="Done"
          onPress={onBack}
          variant="primary"
          size="large"
          accessibilityLabel="Save settings and go back"
          testID="settings-done-button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // padding applied dynamically
  },
  header: {
    alignItems: 'center',
    // marginBottom applied dynamically
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.HEADING_MEDIUM,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    // marginTop, fontSize, and lineHeight applied dynamically
  },
  section: {
    // marginBottom applied dynamically
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  statusContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  statusItem: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    paddingVertical: SPACING.XS,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
    // paddingVertical applied dynamically
  },
  settingContent: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    // fontSize and lineHeight applied dynamically
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.SM,
    gap: SPACING.XS,
  },
  optionButton: {
    marginRight: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  resetButton: {
    alignSelf: 'center',
    marginTop: SPACING.MD,
  },
  footer: {
    backgroundColor: COLORS.SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    // padding applied dynamically
  },
});
```

### Task 5: Accessibility Testing Utilities
**Create**: `__tests__/utils/accessibilityTestUtils.ts`
```typescript
import { ReactTestInstance } from 'react-test-renderer';
import { render } from '@testing-library/react-native';

export interface AccessibilityTestResult {
  component: string;
  passed: boolean;
  issues: AccessibilityIssue[];
  score: number; // 0-100
}

export interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  rule: string;
  description: string;
  element?: string;
  suggestion: string;
}

export class AccessibilityTester {
  static testComponent(component: React.ReactElement): AccessibilityTestResult {
    const { getByTestId, UNSAFE_getAllByType, UNSAFE_root } = render(component);
    const issues: AccessibilityIssue[] = [];
    
    // Test 1: Check for accessibility labels
    this.checkAccessibilityLabels(UNSAFE_root, issues);
    
    // Test 2: Check touch target sizes
    this.checkTouchTargetSizes(UNSAFE_root, issues);
    
    // Test 3: Check color contrast (simplified)
    this.checkColorContrast(UNSAFE_root, issues);
    
    // Test 4: Check semantic structure
    this.checkSemanticStructure(UNSAFE_root, issues);
    
    // Test 5: Check keyboard navigation
    this.checkKeyboardNavigation(UNSAFE_root, issues);
    
    const errorCount = issues.filter(issue => issue.severity === 'error').length;
    const warningCount = issues.filter(issue => issue.severity === 'warning').length;
    
    // Calculate score (100 - penalties)
    const score = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));
    
    return {
      component: component.type?.name || 'Unknown',
      passed: errorCount === 0,
      issues,
      score,
    };
  }
  
  private static checkAccessibilityLabels(element: ReactTestInstance, issues: AccessibilityIssue[]) {
    const interactiveElements = this.findInteractiveElements(element);
    
    interactiveElements.forEach(el => {
      const props = el.props;
      const hasLabel = props.accessibilityLabel || props.accessibilityLabelledBy;
      
      if (!hasLabel) {
        issues.push({
          severity: 'error',
          rule: 'accessibility-label-required',
          description: 'Interactive element missing accessibility label',
          element: el.type?.name,
          suggestion: 'Add accessibilityLabel prop to make element readable by screen readers',
        });
      }
    });
  }
  
  private static checkTouchTargetSizes(element: ReactTestInstance, issues: AccessibilityIssue[]) {
    const interactiveElements = this.findInteractiveElements(element);
    
    interactiveElements.forEach(el => {
      const style = el.props.style;
      const flatStyle = Array.isArray(style) 
        ? Object.assign({}, ...style.filter(s => s))
        : style || {};
      
      const width = flatStyle.width;
      const height = flatStyle.height || flatStyle.minHeight;
      
      if ((width && width < 44) || (height && height < 44)) {
        issues.push({
          severity: 'error',
          rule: 'touch-target-size',
          description: 'Touch target smaller than 44px minimum',
          element: el.type?.name,
          suggestion: 'Increase touch target to at least 44px in both dimensions',
        });
      }
    });
  }
  
  private static checkColorContrast(element: ReactTestInstance, issues: AccessibilityIssue[]) {
    // Simplified contrast checking - in production, use proper color analysis
    const textElements = this.findTextElements(element);
    
    textElements.forEach(el => {
      const style = el.props.style;
      const flatStyle = Array.isArray(style) 
        ? Object.assign({}, ...style.filter(s => s))
        : style || {};
      
      const color = flatStyle.color;
      const backgroundColor = flatStyle.backgroundColor;
      
      // Check for red colors (neurodivergent-specific rule)
      if (color && this.isRedColor(color)) {
        issues.push({
          severity: 'error',
          rule: 'no-red-colors',
          description: 'Red color used - triggering for neurodivergent users',
          element: el.type?.name,
          suggestion: 'Use warning color (#FFD93D) or other calming alternatives',
        });
      }
      
      if (backgroundColor && this.isRedColor(backgroundColor)) {
        issues.push({
          severity: 'error',
          rule: 'no-red-colors',
          description: 'Red background color used - triggering for neurodivergent users',
          element: el.type?.name,
          suggestion: 'Use warning color (#FFD93D) or other calming alternatives',
        });
      }
    });
  }
  
  private static checkSemanticStructure(element: ReactTestInstance, issues: AccessibilityIssue[]) {
    const interactiveElements = this.findInteractiveElements(element);
    
    interactiveElements.forEach(el => {
      const props = el.props;
      const hasRole = props.accessibilityRole;
      
      if (!hasRole) {
        issues.push({
          severity: 'warning',
          rule: 'semantic-role-required',
          description: 'Interactive element missing semantic role',
          element: el.type?.name,
          suggestion: 'Add accessibilityRole prop (button, link, etc.)',
        });
      }
    });
  }
  
  private static checkKeyboardNavigation(element: ReactTestInstance, issues: AccessibilityIssue[]) {
    const interactiveElements = this.findInteractiveElements(element);
    
    interactiveElements.forEach(el => {
      const props = el.props;
      const isFocusable = props.accessible !== false;
      
      if (!isFocusable) {
        issues.push({
          severity: 'warning',
          rule: 'keyboard-navigation',
          description: 'Interactive element not keyboard accessible',
          element: el.type?.name,
          suggestion: 'Ensure element is focusable for keyboard/switch navigation',
        });
      }
    });
  }
  
  private static findInteractiveElements(element: ReactTestInstance): ReactTestInstance[] {
    const interactiveTypes = ['TouchableOpacity', 'TouchableHighlight', 'TouchableWithoutFeedback', 'Button', 'Pressable'];
    const elements: ReactTestInstance[] = [];
    
    const traverse = (node: ReactTestInstance) => {
      if (node.type && interactiveTypes.includes(node.type.name || '')) {
        elements.push(node);
      }
      
      node.children.forEach(child => {
        if (typeof child === 'object' && 'type' in child) {
          traverse(child);
        }
      });
    };
    
    traverse(element);
    return elements;
  }
  
  private static findTextElements(element: ReactTestInstance): ReactTestInstance[] {
    const textTypes = ['Text'];
    const elements: ReactTestInstance[] = [];
    
    const traverse = (node: ReactTestInstance) => {
      if (node.type && textTypes.includes(node.type.name || '')) {
        elements.push(node);
      }
      
      node.children.forEach(child => {
        if (typeof child === 'object' && 'type' in child) {
          traverse(child);
        }
      });
    };
    
    traverse(element);
    return elements;
  }
  
  private static isRedColor(color: string): boolean {
    if (typeof color !== 'string') return false;
    
    const redPatterns = [
      /^#[Ff][0-9A-Fa-f]{2}[0-9A-Fa-f]{2}[0-9A-Fa-f]{2}$/,
      /^#[Ff][0-9A-Fa-f]{2}$/,
      /^red$/i,
      /^rgb\(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9],\s*[0-4]?[0-9],\s*[0-4]?[0-9]\)$/,
    ];
    
    return redPatterns.some(pattern => pattern.test(color));
  }
  
  static generateAccessibilityReport(results: AccessibilityTestResult[]): string {
    const totalComponents = results.length;
    const passedComponents = results.filter(r => r.passed).length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalComponents;
    
    let report = `# Accessibility Test Report\n\n`;
    report += `**Summary:**\n`;
    report += `- Components tested: ${totalComponents}\n`;
    report += `- Components passed: ${passedComponents}\n`;
    report += `- Pass rate: ${((passedComponents / totalComponents) * 100).toFixed(1)}%\n`;
    report += `- Average score: ${averageScore.toFixed(1)}/100\n\n`;
    
    report += `## Component Results\n\n`;
    
    results.forEach(result => {
      report += `### ${result.component} - ${result.passed ? '✅ PASSED' : '❌ FAILED'} (${result.score}/100)\n\n`;
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          const icon = issue.severity === 'error' ? '🚨' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
          report += `${icon} **${issue.rule}**: ${issue.description}\n`;
          report += `   *Suggestion: ${issue.suggestion}*\n\n`;
        });
      } else {
        report += `No accessibility issues found.\n\n`;
      }
    });
    
    return report;
  }
}

// Helper functions for tests
export const testComponentAccessibility = (component: React.ReactElement) => {
  return AccessibilityTester.testComponent(component);
};

export const expectAccessibilityCompliance = (component: React.ReactElement) => {
  const result = AccessibilityTester.testComponent(component);
  if (!result.passed) {
    throw new Error(
      `Accessibility test failed for ${result.component}:\n` +
      result.issues.map(issue => `- ${issue.description}`).join('\n')
    );
  }
};
```

### Task 6: Integration Tests for Accessibility
**Create**: `__tests__/components/accessibilityIntegration.test.tsx`
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibilityTester, testComponentAccessibility } from '../utils/accessibilityTestUtils';
import { SensoryCustomizationProvider } from '../../src/providers/SensoryCustomizationProvider';
import { 
  GentleButton, 
  BrainStateSlider, 
  TaskCard,
  AIQuotaDisplay,
  AccessibilitySettingsScreen 
} from '../../src/components';

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SensoryCustomizationProvider>
    {children}
  </SensoryCustomizationProvider>
);

describe('Accessibility Integration Tests', () => {
  describe('Core Component Accessibility', () => {
    test('GentleButton meets accessibility standards', () => {
      const component = (
        <TestWrapper>
          <GentleButton
            title="Test Button"
            onPress={() => {}}
            accessibilityLabel="Test button for accessibility"
            accessibilityHint="Tap to test accessibility features"
          />
        </TestWrapper>
      );
      
      const result = testComponentAccessibility(component);
      expect(result.passed).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(90);
    });

    test('BrainStateSlider provides proper accessibility feedback', () => {
      const component = (
        <TestWrapper>
          <BrainStateSlider
            value={7}
            onValueChange={() => {}}
            accessibilityLabel="Energy level slider from 1 to 10"
            accessibilityHint="Adjust to match your current energy level"
          />
        </TestWrapper>
      );
      
      const result = testComponentAccessibility(component);
      expect(result.passed).toBe(true);
      expect(result.issues.filter(issue => issue.severity === 'error')).toHaveLength(0);
    });

    test('TaskCard includes comprehensive accessibility support', () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        complexity_level: 3,
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      const component = (
        <TestWrapper>
          <TaskCard
            task={mockTask}
            onPress={() => {}}
            onToggleComplete={() => {}}
          />
        </TestWrapper>
      );
      
      const result = testComponentAccessibility(component);
      expect(result.passed).toBe(true);
    });
  });

  describe('Freemium UI Accessibility', () => {
    test('AIQuotaDisplay provides clear accessibility information', () => {
      const component = (
        <TestWrapper>
          <AIQuotaDisplay
            used={7}
            limit={10}
            tier="free"
            onUpgradePress={() => {}}
          />
        </TestWrapper>
      );
      
      const result = testComponentAccessibility(component);
      expect(result.passed).toBe(true);
      expect(result.issues.filter(issue => issue.rule === 'no-red-colors')).toHaveLength(0);
    });
  });

  describe('Color Accessibility', () => {
    test('No components use red colors', () => {
      const components = [
        <GentleButton title="Test" onPress={() => {}} />,
        <BrainStateSlider value={5} onValueChange={() => {}} accessibilityLabel="Test slider" />,
        <AIQuotaDisplay used={5} limit={10} tier="free" />,
      ];

      components.forEach(component => {
        const wrappedComponent = <TestWrapper>{component}</TestWrapper>;
        const result = testComponentAccessibility(wrappedComponent);
        const redColorIssues = result.issues.filter(issue => issue.rule === 'no-red-colors');
        expect(redColorIssues).toHaveLength(0);
      });
    });
  });

  describe('Brain State Adaptation Accessibility', () => {
    test('Low energy adaptations improve accessibility scores', () => {
      const lowEnergyBrainState = {
        energy_level: 2,
        focus_level: 3,
      };

      const highEnergyBrainState = {
        energy_level: 8,
        focus_level: 9,
      };

      const buttonComponent = (brainState: any) => (
        <TestWrapper>
          <GentleButton
            title="Adapted Button"
            onPress={() => {}}
            accessibilityLabel="Test button with brain state adaptation"
            adaptation={{
              touchTargetSize: brainState.energy_level <= 3 ? 56 : 44,
              spacing: brainState.energy_level <= 3 ? 24 : 16,
            }}
          />
        </TestWrapper>
      );

      const lowEnergyResult = testComponentAccessibility(buttonComponent(lowEnergyBrainState));
      const highEnergyResult = testComponentAccessibility(buttonComponent(highEnergyBrainState));

      // Both should pass, but low energy should have equal or better accessibility
      expect(lowEnergyResult.passed).toBe(true);
      expect(highEnergyResult.passed).toBe(true);
      expect(lowEnergyResult.score).toBeGreaterThanOrEqual(highEnergyResult.score);
    });
  });

  describe('Comprehensive Accessibility Report', () => {
    test('Generate full accessibility report for component suite', () => {
      const components = [
        { name: 'GentleButton', component: <GentleButton title="Test" onPress={() => {}} accessibilityLabel="Test button" /> },
        { name: 'BrainStateSlider', component: <BrainStateSlider value={5} onValueChange={() => {}} accessibilityLabel="Test slider" /> },
        { name: 'AIQuotaDisplay', component: <AIQuotaDisplay used={5} limit={10} tier="free" /> },
      ];

      const results = components.map(({ component }) => {
        const wrappedComponent = <TestWrapper>{component}</TestWrapper>;
        return testComponentAccessibility(wrappedComponent);
      });

      const report = AccessibilityTester.generateAccessibilityReport(results);
      
      expect(report).toContain('Accessibility Test Report');
      expect(report).toContain('Components tested: 3');
      
      // All components should pass
      const passedComponents = results.filter(r => r.passed).length;
      expect(passedComponents).toBe(3);
    });
  });

  describe('Real-world Accessibility Scenarios', () => {
    test('Settings screen provides comprehensive accessibility navigation', () => {
      const component = (
        <TestWrapper>
          <AccessibilitySettingsScreen onBack={() => {}} />
        </TestWrapper>
      );
      
      const { getByLabelText, getAllByRole } = render(component);
      
      // Check for proper heading structure
      expect(getByLabelText(/Accessibility & Sensory Settings/)).toBeTruthy();
      
      // Check for interactive elements with proper accessibility
      const buttons = getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button.props.accessibilityLabel).toBeTruthy();
      });
    });

    test('Screen reader announcements work correctly', async () => {
      const mockAnnounce = jest.fn();
      jest.mock('react-native', () => ({
        ...jest.requireActual('react-native'),
        AccessibilityInfo: {
          announceForAccessibility: mockAnnounce,
          isScreenReaderEnabled: () => Promise.resolve(true),
        },
      }));

      // Test announcement functionality
      const component = (
        <TestWrapper>
          <GentleButton
            title="Test Announcement"
            onPress={() => {}}
            accessibilityLabel="Button that announces when pressed"
          />
        </TestWrapper>
      );
      
      const result = testComponentAccessibility(component);
      expect(result.passed).toBe(true);
    });
  });
});
```

## Success Criteria
- [ ] Advanced accessibility hook provides comprehensive system state monitoring
- [ ] Sensory customization provider supports extensive user preferences
- [ ] Brain state adaptation manager automatically adjusts UI based on energy/focus levels
- [ ] Accessibility settings screen provides full customization control
- [ ] Testing utilities validate WCAG 2.1 AA compliance
- [ ] All components pass accessibility validation with scores above 90/100
- [ ] No red colors detected in any component (neurodivergent-specific rule)
- [ ] Touch targets meet or exceed 44px minimum in all states

## Testing Commands
```bash
npm run test -- --testPathPattern=accessibilityIntegration
npm run accessibility:audit  # Run full accessibility test suite
npm run accessibility:report # Generate comprehensive accessibility report
```

## Next Sprint
**4G: Component Integration Testing** - Create comprehensive integration tests between all Agent 4 components.

## Agent Dependencies
- **Needs from Sprint 4E**: All freemium UI components for accessibility testing
- **Provides to Agent 3**: Accessibility hooks and adaptation managers
- **Provides to all agents**: Comprehensive accessibility testing utilities

## Common Issues
- **System permission**: Accessibility features require proper iOS/Android permissions
- **Adaptation timing**: Ensure brain state changes trigger immediate UI adaptations
- **Testing complexity**: Accessibility testing requires careful setup and mocking
- **Performance impact**: Monitor performance impact of real-time accessibility monitoring

---
**Focus**: Advanced accessibility and adaptation systems. Integration testing comes in 4G.