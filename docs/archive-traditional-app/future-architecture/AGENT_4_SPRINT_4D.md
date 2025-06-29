# 📋 Agent 4 Sprint 4D: Task Display Components

## Mission
Create task display components (TaskCard, TaskList, ComplexityIndicator) with AI breakdown integration and brain state adaptive behavior.

## Time Estimate
1 hour

## Prerequisites
- Sprint 4C completed (brain state UI components available)
- Agent 3 task store interface understood from handoff documentation
- Agent 3 AI integration patterns reviewed

## Sprint Goal
Complete task display components that integrate with Agent 3's task store, AI breakdown system, and subscription management.

## Core Tasks

### Task 1: Task Complexity Indicator Component
**Create**: `src/components/TaskComplexityIndicator.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface TaskComplexityIndicatorProps {
  complexity: number; // 1-5 scale
  userEnergyLevel?: number; // For showing if task matches energy
  compact?: boolean;
  showLabel?: boolean;
  testID?: string;
}

export const TaskComplexityIndicator: React.FC<TaskComplexityIndicatorProps> = ({
  complexity,
  userEnergyLevel,
  compact = false,
  showLabel = true,
  testID,
}) => {
  const getComplexityLabel = (level: number): string => {
    const labels = ['', 'Micro', 'Simple', 'Medium', 'Complex', 'Major'];
    return labels[level] || 'Unknown';
  };

  const getComplexityColor = (level: number): string => {
    if (level <= 2) return COLORS.SUCCESS;      // Green for easy
    if (level <= 3) return COLORS.INFO;         // Blue for medium
    if (level <= 4) return COLORS.WARNING;      // Orange for complex
    return COLORS.PREMIUM_ACCENT;               // Purple for major
  };

  const getComplexityDescription = (level: number): string => {
    const descriptions = [
      '',
      '1-2 min quick task',
      '5-15 min simple task', 
      '30-60 min focused work',
      '1-3 hours deep work',
      '3+ hours major project'
    ];
    return descriptions[level] || '';
  };

  const isGoodMatch = userEnergyLevel && complexity <= userEnergyLevel;
  const isStretch = userEnergyLevel && complexity > userEnergyLevel;

  const renderDots = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          compact && styles.dotCompact,
          {
            backgroundColor: index < complexity 
              ? getComplexityColor(complexity)
              : COLORS.BORDER,
          }
        ]}
      />
    ));
  };

  const getMatchingIndicator = () => {
    if (!userEnergyLevel) return null;
    
    if (isGoodMatch) {
      return (
        <View style={styles.matchIndicator}>
          <Text style={[styles.matchText, { color: COLORS.SUCCESS }]}>
            ✓ Good match
          </Text>
        </View>
      );
    }
    
    if (isStretch) {
      return (
        <View style={styles.matchIndicator}>
          <Text style={[styles.matchText, { color: COLORS.WARNING }]}>
            ⚡ Stretch goal
          </Text>
        </View>
      );
    }
    
    return null;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer} testID={testID}>
        <View style={styles.dotsContainer}>
          {renderDots()}
        </View>
        {showLabel && (
          <Text style={styles.compactLabel}>
            {getComplexityLabel(complexity)}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.dotsContainer}>
          {renderDots()}
        </View>
        {showLabel && (
          <Text style={[styles.label, { color: getComplexityColor(complexity) }]}>
            {getComplexityLabel(complexity)}
          </Text>
        )}
      </View>
      
      <Text style={styles.description}>
        {getComplexityDescription(complexity)}
      </Text>
      
      {getMatchingIndicator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.SM,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.SM,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 2,
  },
  dotCompact: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
  },
  compactLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  description: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.CAPTION,
  },
  matchIndicator: {
    marginTop: SPACING.XS,
  },
  matchText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
});
```

### Task 2: AI Breakdown Display Component
**Create**: `src/components/AIBreakdownDisplay.tsx`
```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface AIBreakdownDisplayProps {
  breakdown: {
    steps: string[];
    timeEstimate: number;
    adapted: boolean;
  };
  brainState?: {
    energy_level: number;
    focus_level: number;
  };
  expanded?: boolean;
  onToggle?: () => void;
  testID?: string;
}

export const AIBreakdownDisplay: React.FC<AIBreakdownDisplayProps> = ({
  breakdown,
  brainState,
  expanded = false,
  onToggle,
  testID,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  
  const isExpanded = onToggle ? expanded : internalExpanded;
  const handleToggle = onToggle || (() => setInternalExpanded(!internalExpanded));

  const getAdaptationMessage = () => {
    if (!breakdown.adapted || !brainState) return null;
    
    const energyLevel = brainState.energy_level;
    if (energyLevel <= 3) {
      return "✨ Broken down gently for low energy";
    } else if (energyLevel >= 7) {
      return "🚀 Optimized for high energy";
    }
    return "⚖️ Balanced for medium energy";
  };

  const formatTimeEstimate = (minutes: number): string => {
    if (minutes < 60) {
      return `~${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (remainingMins === 0) {
      return `~${hours}h`;
    }
    return `~${hours}h ${remainingMins}m`;
  };

  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={handleToggle}
        accessibilityRole="button"
        accessibilityLabel={`AI breakdown, ${isExpanded ? 'collapse' : 'expand'} to ${isExpanded ? 'hide' : 'show'} details`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>AI Breakdown</Text>
          {breakdown.adapted && (
            <View style={styles.adaptedBadge}>
              <Text style={styles.adaptedText}>Adapted</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={styles.timeEstimate}>
            {formatTimeEstimate(breakdown.timeEstimate)}
          </Text>
          <Text style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {getAdaptationMessage() && (
            <Text style={styles.adaptationMessage}>
              {getAdaptationMessage()}
            </Text>
          )}
          
          <View style={styles.stepsContainer}>
            {breakdown.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SUCCESS + '10', // Very light green background
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.SUCCESS,
  },
  header: {
    padding: SPACING.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  adaptedBadge: {
    backgroundColor: COLORS.INFO,
    paddingHorizontal: SPACING.XS,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: SPACING.SM,
  },
  adaptedText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.SURFACE,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginRight: SPACING.SM,
  },
  expandIcon: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  adaptationMessage: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.INFO,
    fontStyle: 'italic',
    marginBottom: SPACING.SM,
  },
  stepsContainer: {
    gap: SPACING.SM,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
    marginTop: 2, // Align with text baseline
  },
  stepNumberText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.SURFACE,
  },
  stepText: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
});
```

### Task 3: Task Card Component
**Create**: `src/components/TaskCard.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GentleButton } from './GentleButton';
import { TaskComplexityIndicator } from './TaskComplexityIndicator';
import { AIBreakdownDisplay } from './AIBreakdownDisplay';
import { COLORS, TYPOGRAPHY, SPACING, getAdaptiveTheme } from '../constants';

export interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    complexity_level: number;
    estimated_minutes?: number;
    is_completed: boolean;
    ai_breakdown?: {
      steps: string[];
      timeEstimate: number;
      adapted: boolean;
    };
  };
  
  // Actions
  onComplete: () => Promise<void>;
  onRequestBreakdown: () => Promise<void>;
  onEdit?: () => void;
  
  // State
  aiRequestInProgress?: boolean;
  
  // Brain state adaptation
  brainState?: {
    energy_level: number;
    focus_level: number;
    mood_level: number;
  };
  
  // Subscription info
  quotaInfo?: {
    canMakeRequest: boolean;
    remainingRequests: number;
    tier: 'free' | 'premium';
  };
  
  // UI customization
  compact?: boolean;
  
  testID?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onRequestBreakdown,
  onEdit,
  aiRequestInProgress = false,
  brainState,
  quotaInfo,
  compact = false,
  testID,
}) => {
  const theme = brainState 
    ? getAdaptiveTheme(brainState.energy_level, brainState.focus_level)
    : getAdaptiveTheme(5, 5); // Default medium energy

  const getCardStyle = () => {
    const baseStyle = [styles.container];
    
    if (task.is_completed) {
      baseStyle.push(styles.completedCard);
    }
    
    // Adapt spacing based on brain state
    baseStyle.push({
      padding: theme.spacing.horizontal,
      marginBottom: theme.spacing.vertical,
    });
    
    return baseStyle;
  };

  const getBreakdownButtonText = () => {
    if (aiRequestInProgress) return 'Breaking down...';
    if (task.ai_breakdown) return 'View breakdown';
    if (!quotaInfo?.canMakeRequest) {
      return quotaInfo?.tier === 'free' 
        ? `Upgrade for breakdowns (${quotaInfo.remainingRequests} left)`
        : 'Quota reached';
    }
    return 'Break this down';
  };

  const getBreakdownButtonVariant = () => {
    if (task.ai_breakdown) return 'secondary';
    if (!quotaInfo?.canMakeRequest && quotaInfo?.tier === 'free') return 'premium';
    return 'secondary';
  };

  const shouldShowComplexityWarning = () => {
    return brainState && task.complexity_level > brainState.energy_level;
  };

  const getComplexityWarningMessage = () => {
    if (!shouldShowComplexityWarning()) return null;
    
    const energyDiff = task.complexity_level - (brainState?.energy_level || 5);
    if (energyDiff === 1) {
      return "This might be a gentle stretch for your current energy";
    } else if (energyDiff >= 2) {
      return "Consider saving this for when you have more energy";
    }
    return null;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { padding: theme.spacing.horizontal / 2 }]} testID={testID}>
        <View style={styles.compactHeader}>
          <Text style={[styles.compactTitle, { fontSize: theme.typography.fontSize }]} numberOfLines={1}>
            {task.title}
          </Text>
          <TaskComplexityIndicator 
            complexity={task.complexity_level}
            userEnergyLevel={brainState?.energy_level}
            compact
          />
        </View>
        
        <View style={styles.compactActions}>
          <GentleButton
            title="Done"
            onPress={onComplete}
            variant="secondary"
            size="small"
            style={styles.compactButton}
          />
          {!task.ai_breakdown && quotaInfo?.canMakeRequest && (
            <GentleButton
              title="Break down"
              onPress={onRequestBreakdown}
              variant="secondary"
              size="small"
              loading={aiRequestInProgress}
              style={styles.compactButton}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={getCardStyle()} testID={testID}>
      {/* Task Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title, 
            { 
              fontSize: theme.typography.fontSize + 2,
              lineHeight: theme.typography.lineHeight * (theme.typography.fontSize + 2),
            },
            task.is_completed && styles.completedTitle
          ]}>
            {task.title}
          </Text>
          
          {task.description && (
            <Text style={[
              styles.description,
              { fontSize: theme.typography.fontSize - 2 },
              task.is_completed && styles.completedText
            ]}>
              {task.description}
            </Text>
          )}
        </View>
      </View>

      {/* Task Metadata */}
      <View style={[styles.metadata, { marginVertical: theme.spacing.vertical / 2 }]}>
        <TaskComplexityIndicator 
          complexity={task.complexity_level}
          userEnergyLevel={brainState?.energy_level}
          showLabel
        />
        
        {task.estimated_minutes && (
          <Text style={styles.timeEstimate}>
            ~{task.estimated_minutes} min
          </Text>
        )}
      </View>

      {/* Complexity Warning */}
      {getComplexityWarningMessage() && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            💡 {getComplexityWarningMessage()}
          </Text>
        </View>
      )}

      {/* AI Breakdown */}
      {task.ai_breakdown && (
        <View style={[styles.breakdownContainer, { marginVertical: theme.spacing.vertical }]}>
          <AIBreakdownDisplay 
            breakdown={task.ai_breakdown}
            brainState={brainState}
          />
        </View>
      )}

      {/* Action Buttons */}
      {!task.is_completed && (
        <View style={[styles.actions, { marginTop: theme.spacing.vertical }]}>
          <GentleButton
            title="Complete"
            onPress={onComplete}
            variant="primary"
            size="medium"
            accessibilityLabel={`Mark "${task.title}" as completed`}
            style={styles.actionButton}
            adaptation={{
              touchTargetSize: theme.spacing.touchTarget,
              spacing: theme.spacing.horizontal,
            }}
          />
          
          <GentleButton
            title={getBreakdownButtonText()}
            onPress={onRequestBreakdown}
            variant={getBreakdownButtonVariant()}
            size="medium"
            loading={aiRequestInProgress}
            disabled={!quotaInfo?.canMakeRequest && !task.ai_breakdown}
            accessibilityLabel={`Get AI breakdown for "${task.title}"`}
            style={styles.actionButton}
            adaptation={{
              touchTargetSize: theme.spacing.touchTarget,
              spacing: theme.spacing.horizontal,
            }}
          />
        </View>
      )}

      {/* Completed State */}
      {task.is_completed && (
        <View style={styles.completedBanner}>
          <Text style={styles.completedBannerText}>
            ✨ Completed! Well done.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: COLORS.TEXT_PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
    borderColor: COLORS.SUCCESS,
    backgroundColor: COLORS.SUCCESS + '05',
  },
  
  // Compact styles
  compactContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: SPACING.SM,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  compactTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
  compactActions: {
    flexDirection: 'row',
    gap: SPACING.SM,
  },
  compactButton: {
    flex: 1,
  },
  
  // Full card styles
  header: {
    marginBottom: SPACING.SM,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_LARGE,
    marginBottom: SPACING.XS,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
  },
  description: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  completedText: {
    color: COLORS.TEXT_TERTIARY,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeEstimate: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_SECONDARY,
  },
  warningContainer: {
    backgroundColor: COLORS.WARNING + '15',
    borderRadius: 6,
    padding: SPACING.SM,
    marginVertical: SPACING.SM,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.WARNING,
  },
  warningText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  breakdownContainer: {
    // marginVertical applied dynamically
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.MD,
  },
  actionButton: {
    flex: 1,
  },
  completedBanner: {
    backgroundColor: COLORS.SUCCESS + '20',
    borderRadius: 6,
    padding: SPACING.SM,
    marginTop: SPACING.SM,
    alignItems: 'center',
  },
  completedBannerText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.SUCCESS,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
  },
});
```

### Task 4: Empty State Component
**Create**: `src/components/TaskListEmptyState.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GentleButton } from './GentleButton';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface TaskListEmptyStateProps {
  energyLevel?: number;
  hasCompletedTasks?: boolean;
  onAddTask?: () => void;
  onCheckBrainState?: () => void;
  testID?: string;
}

export const TaskListEmptyState: React.FC<TaskListEmptyStateProps> = ({
  energyLevel,
  hasCompletedTasks = false,
  onAddTask,
  onCheckBrainState,
  testID,
}) => {
  const getEmptyStateMessage = () => {
    if (hasCompletedTasks) {
      if (energyLevel && energyLevel <= 3) {
        return {
          emoji: '🌱',
          title: 'Take a rest - you\'ve earned it!',
          message: 'You\'ve completed your tasks for now. Low energy is completely normal.',
        };
      } else {
        return {
          emoji: '✨',
          title: 'All caught up!',
          message: 'You\'ve completed your current tasks. Time to celebrate!',
        };
      }
    }
    
    if (energyLevel && energyLevel <= 3) {
      return {
        emoji: '💚',
        title: 'Gentle start',
        message: 'No tasks showing right now - that\'s perfect for your current energy level.',
      };
    }
    
    return {
      emoji: '🎯',
      title: 'Ready to get started?',
      message: 'Add some tasks or check your brain state to see personalized suggestions.',
    };
  };

  const getSuggestedActions = () => {
    const actions = [];
    
    if (onAddTask) {
      actions.push({
        title: 'Add a task',
        action: onAddTask,
        variant: 'primary' as const,
      });
    }
    
    if (onCheckBrainState && (!energyLevel || energyLevel > 3)) {
      actions.push({
        title: 'Check brain state',
        action: onCheckBrainState,
        variant: 'secondary' as const,
      });
    }
    
    return actions;
  };

  const message = getEmptyStateMessage();
  const actions = getSuggestedActions();

  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.emoji}>{message.emoji}</Text>
      
      <Text style={styles.title}>{message.title}</Text>
      
      <Text style={styles.message}>{message.message}</Text>
      
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <GentleButton
              key={index}
              title={action.title}
              onPress={action.action}
              variant={action.variant}
              size="medium"
              style={styles.actionButton}
            />
          ))}
        </View>
      )}
      
      {energyLevel && energyLevel <= 3 && (
        <Text style={styles.lowEnergyNote}>
          💡 Your task list is adapted for low energy. Higher complexity tasks are hidden.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
    minHeight: 300,
  },
  emoji: {
    fontSize: 64,
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
    marginBottom: SPACING.XL,
    maxWidth: 300,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  actionButton: {
    minWidth: 120,
  },
  lowEnergyNote: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_TERTIARY,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 280,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.CAPTION,
  },
});
```

### Task 5: Update Component Exports
**Update**: `src/components/index.ts`
```typescript
// Previous exports
export { GentleButton } from './GentleButton';
export type { GentleButtonProps } from './GentleButton';

export { BrainStateSlider } from './BrainStateSlider';
export type { BrainStateSliderProps } from './BrainStateSlider';

export { GentleTextInput } from './GentleTextInput';
export type { GentleTextInputProps } from './GentleTextInput';

export { BrainStateCheckinForm } from './BrainStateCheckinForm';
export type { BrainStateCheckinFormProps } from './BrainStateCheckinForm';

export { CheckinSuccessFeedback } from './CheckinSuccessFeedback';
export type { CheckinSuccessFeedbackProps } from './CheckinSuccessFeedback';

export { BrainStateSummary } from './BrainStateSummary';
export type { BrainStateSummaryProps } from './BrainStateSummary';

// New task display exports
export { TaskComplexityIndicator } from './TaskComplexityIndicator';
export type { TaskComplexityIndicatorProps } from './TaskComplexityIndicator';

export { AIBreakdownDisplay } from './AIBreakdownDisplay';
export type { AIBreakdownDisplayProps } from './AIBreakdownDisplay';

export { TaskCard } from './TaskCard';
export type { TaskCardProps } from './TaskCard';

export { TaskListEmptyState } from './TaskListEmptyState';
export type { TaskListEmptyStateProps } from './TaskListEmptyState';

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

### Task 6: Task Display Integration Tests
**Create**: `__tests__/components/taskDisplay.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { 
  TaskCard, 
  TaskComplexityIndicator, 
  AIBreakdownDisplay,
  TaskListEmptyState 
} from '../../src/components';

describe('Task Display Components', () => {
  describe('TaskCard', () => {
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test description',
      complexity_level: 3,
      estimated_minutes: 30,
      is_completed: false,
    };

    const defaultProps = {
      task: mockTask,
      onComplete: jest.fn(),
      onRequestBreakdown: jest.fn(),
    };

    test('should show complexity warning for high complexity tasks', () => {
      const lowEnergyBrainState = {
        energy_level: 2,
        focus_level: 3,
        mood_level: 2,
      };

      const { getByText } = render(
        <TaskCard 
          {...defaultProps}
          brainState={lowEnergyBrainState}
        />
      );

      expect(getByText(/Consider saving this for when you have more energy/)).toBeTruthy();
    });

    test('should adapt button sizing based on brain state', () => {
      const lowEnergyBrainState = {
        energy_level: 2,
        focus_level: 2,
        mood_level: 3,
      };

      const { getByText } = render(
        <TaskCard 
          {...defaultProps}
          brainState={lowEnergyBrainState}
        />
      );

      // Should have larger touch targets for low energy
      const completeButton = getByText('Complete');
      expect(completeButton).toBeTruthy();
    });

    test('should show gentle upgrade prompt when quota exceeded', () => {
      const quotaInfo = {
        canMakeRequest: false,
        remainingRequests: 0,
        tier: 'free' as const,
      };

      const { getByText } = render(
        <TaskCard 
          {...defaultProps}
          quotaInfo={quotaInfo}
        />
      );

      expect(getByText(/Upgrade for breakdowns/)).toBeTruthy();
    });

    test('should show completed state with celebration', () => {
      const completedTask = { ...mockTask, is_completed: true };

      const { getByText } = render(
        <TaskCard 
          {...defaultProps}
          task={completedTask}
        />
      );

      expect(getByText('✨ Completed! Well done.')).toBeTruthy();
    });
  });

  describe('TaskComplexityIndicator', () => {
    test('should show appropriate number of dots', () => {
      const { getByTestId } = render(
        <TaskComplexityIndicator 
          complexity={3}
          testID="complexity-indicator"
        />
      );

      expect(getByTestId('complexity-indicator')).toBeTruthy();
    });

    test('should show good match indicator', () => {
      const { getByText } = render(
        <TaskComplexityIndicator 
          complexity={3}
          userEnergyLevel={5}
        />
      );

      expect(getByText('✓ Good match')).toBeTruthy();
    });

    test('should show stretch goal indicator', () => {
      const { getByText } = render(
        <TaskComplexityIndicator 
          complexity={4}
          userEnergyLevel={3}
        />
      );

      expect(getByText('⚡ Stretch goal')).toBeTruthy();
    });
  });

  describe('AIBreakdownDisplay', () => {
    const mockBreakdown = {
      steps: ['Step 1', 'Step 2', 'Step 3'],
      timeEstimate: 45,
      adapted: true,
    };

    test('should show adaptation message for low energy', () => {
      const lowEnergyBrainState = {
        energy_level: 2,
        focus_level: 3,
      };

      const { getByText } = render(
        <AIBreakdownDisplay 
          breakdown={mockBreakdown}
          brainState={lowEnergyBrainState}
          expanded
        />
      );

      expect(getByText('✨ Broken down gently for low energy')).toBeTruthy();
    });

    test('should format time estimate correctly', () => {
      const { getByText } = render(
        <AIBreakdownDisplay 
          breakdown={mockBreakdown}
          expanded
        />
      );

      expect(getByText('~45 min')).toBeTruthy();
    });

    test('should toggle expanded state', () => {
      const { getByText, queryByText } = render(
        <AIBreakdownDisplay 
          breakdown={mockBreakdown}
        />
      );

      // Initially collapsed
      expect(queryByText('Step 1')).toBeNull();

      // Tap to expand
      fireEvent.press(getByText('AI Breakdown'));
      expect(queryByText('Step 1')).toBeTruthy();
    });
  });

  describe('TaskListEmptyState', () => {
    test('should show low energy message', () => {
      const { getByText } = render(
        <TaskListEmptyState 
          energyLevel={2}
        />
      );

      expect(getByText('Take a rest - you\'ve earned it!')).toBeTruthy();
      expect(getByText('🌱')).toBeTruthy();
    });

    test('should show celebration for completed tasks', () => {
      const { getByText } = render(
        <TaskListEmptyState 
          energyLevel={7}
          hasCompletedTasks
        />
      );

      expect(getByText('All caught up!')).toBeTruthy();
      expect(getByText('✨')).toBeTruthy();
    });

    test('should show adaptation note for low energy', () => {
      const { getByText } = render(
        <TaskListEmptyState 
          energyLevel={2}
        />
      );

      expect(getByText(/Your task list is adapted for low energy/)).toBeTruthy();
    });
  });
});
```

## Success Criteria
- [ ] TaskCard component with brain state adaptation and AI breakdown integration
- [ ] Complexity indicator showing task difficulty and energy matching
- [ ] AI breakdown display with expandable step-by-step instructions
- [ ] Empty state component with energy-appropriate messaging
- [ ] All components integrate with Agent 3's task store and subscription system
- [ ] Gentle upgrade prompts that don't interrupt core functionality

## Testing Commands
```bash
npm run test -- --testPathPattern=taskDisplay
```

## Next Sprint
**4E: Freemium UI Components** - Build subscription status and upgrade prompts.

## Agent Dependencies
- **Needs from Sprint 4C**: Brain state UI patterns and adaptive theming
- **Provides to Agent 3**: Complete task display implementation
- **Replaces**: Agent 3's placeholder components in TaskList screen

## Common Issues
- **Energy matching**: Test that complexity warnings show appropriately
- **AI integration**: Verify breakdown display works with Agent 3's AI service
- **Quota handling**: Ensure gentle upgrade prompts for free tier limits
- **Adaptation**: Check that all components respond to brain state changes

---
**Focus**: Task display components only. Freemium-specific UI comes in 4E.