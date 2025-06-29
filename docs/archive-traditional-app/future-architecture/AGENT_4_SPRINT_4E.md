# 💎 Agent 4 Sprint 4E: Freemium UI Components

## Mission
Create gentle freemium UI components (quota displays, upgrade prompts, premium indicators) that never interrupt core functionality and maintain shame-free language.

## Time Estimate
1 hour

## Prerequisites
- Sprint 4D completed (task display components available)
- Agent 3 subscription store interface understood
- Agent 2 freemium API patterns reviewed

## Sprint Goal
Complete freemium UI components that integrate with Agent 3's subscription management and provide gentle upgrade experiences without compromising the neurodivergent-first principles.

## Core Tasks

### Task 1: AI Quota Display Component
**Create**: `src/components/AIQuotaDisplay.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GentleButton } from './GentleButton';
import { COLORS, TYPOGRAPHY, SPACING, getAdaptiveTheme } from '../constants';

export interface AIQuotaDisplayProps {
  used: number;
  limit: number;
  tier: 'free' | 'premium';
  onUpgradePress?: () => void;
  compact?: boolean;
  testID?: string;
  // Brain state adaptation
  brainState?: {
    energy_level: number;
    focus_level: number;
  };
}

export const AIQuotaDisplay: React.FC<AIQuotaDisplayProps> = ({
  used,
  limit,
  tier,
  onUpgradePress,
  compact = false,
  testID,
  brainState,
}) => {
  const adaptationEnergy = brainState?.energy_level || 5;
  const adaptationFocus = brainState?.focus_level || 5;
  const theme = getAdaptiveTheme(adaptationEnergy, adaptationFocus);

  const percentage = (used / limit) * 100;
  const remaining = Math.max(0, limit - used);
  
  const getStatusColor = (): string => {
    if (tier === 'premium') return COLORS.PREMIUM_ACCENT;
    if (percentage >= 90) return COLORS.WARNING;
    if (percentage >= 75) return COLORS.QUOTA_LOW;
    return COLORS.QUOTA_GOOD;
  };

  const getStatusMessage = (): string => {
    if (tier === 'premium') {
      return adaptationEnergy <= 3 
        ? "Premium: Unlimited AI assistance" 
        : "Premium: Unlimited AI breakdown requests";
    }
    
    if (used >= limit) {
      return adaptationEnergy <= 3
        ? "All AI requests used this month"
        : "You've used all 10 AI breakdown requests this month";
    }
    
    if (remaining === 1) {
      return "1 AI breakdown remaining this month";
    }
    
    if (remaining <= 3) {
      return `${remaining} AI breakdowns remaining this month`;
    }
    
    return `${remaining} of ${limit} AI breakdowns available`;
  };

  const getUpgradeMessage = (): string => {
    if (adaptationEnergy <= 3) {
      return "Gentle upgrade available";
    } else if (adaptationEnergy >= 7) {
      return "Upgrade for unlimited AI assistance";
    }
    return "Upgrade for unlimited breakdowns";
  };

  const shouldShowUpgradePrompt = (): boolean => {
    return tier === 'free' && percentage >= 75 && onUpgradePress;
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { borderColor: getStatusColor() }]} testID={testID}>
        <View style={styles.compactHeader}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.compactText, { fontSize: theme.typography.fontSize - 2 }]}>
            {tier === 'premium' ? 'Premium' : `${remaining}/${limit} AI`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { padding: theme.spacing.horizontal }]} testID={testID}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontSize: theme.typography.fontSize + 2 }]}>
          AI Task Breakdown
        </Text>
        {tier === 'premium' && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
      </View>

      <Text style={[
        styles.statusMessage, 
        { 
          fontSize: theme.typography.fontSize,
          marginBottom: theme.spacing.vertical,
          color: getStatusColor(),
        }
      ]}>
        {getStatusMessage()}
      </Text>

      {tier === 'free' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getStatusColor(),
                }
              ]} 
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>0</Text>
            <Text style={styles.progressLabel}>{limit}</Text>
          </View>
        </View>
      )}

      {shouldShowUpgradePrompt() && (
        <View style={[styles.upgradePrompt, { marginTop: theme.spacing.vertical }]}>
          <Text style={[styles.upgradeText, { fontSize: theme.typography.fontSize - 1 }]}>
            {getUpgradeMessage()}
          </Text>
          <GentleButton
            title="Learn More"
            onPress={onUpgradePress!}
            variant="ghost"
            size="small"
            accessibilityLabel="Learn about premium upgrade"
            accessibilityHint="View premium features and pricing"
            style={styles.upgradeButton}
            testID="upgrade-button"
          />
        </View>
      )}

      {used >= limit && tier === 'free' && (
        <View style={[styles.limitReachedContainer, { marginTop: theme.spacing.vertical }]}>
          <Text style={[styles.limitReachedText, { fontSize: theme.typography.fontSize - 1 }]}>
            Your AI assistance will reset next month, or upgrade anytime for unlimited access.
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
    // padding applied dynamically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  title: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  premiumBadge: {
    backgroundColor: COLORS.PREMIUM_ACCENT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.SURFACE,
  },
  statusMessage: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY,
    // color and marginBottom applied dynamically
  },
  progressContainer: {
    marginVertical: SPACING.SM,
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    // width and backgroundColor applied dynamically
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.XS,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    color: COLORS.TEXT_TERTIARY,
  },
  upgradePrompt: {
    backgroundColor: COLORS.UPGRADE_HIGHLIGHT,
    borderRadius: 8,
    padding: SPACING.MD,
    alignItems: 'center',
    // marginTop applied dynamically
  },
  upgradeText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  upgradeButton: {
    minWidth: 120,
  },
  limitReachedContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 8,
    padding: SPACING.MD,
    // marginTop applied dynamically
  },
  limitReachedText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  
  // Compact styles
  compactContainer: {
    borderRadius: 6,
    borderWidth: 2,
    padding: SPACING.XS,
    alignSelf: 'flex-start',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.XS,
  },
  compactText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
  },
});
```

### Task 2: Gentle Upgrade Modal Component
**Create**: `src/components/GentleUpgradeModal.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { GentleButton } from './GentleButton';
import { COLORS, TYPOGRAPHY, SPACING, getAdaptiveTheme } from '../constants';

export interface UpgradeFeature {
  icon: string;
  title: string;
  description: string;
  available: 'free' | 'premium';
}

export interface GentleUpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  trigger: 'ai_quota' | 'body_doubling' | 'advanced_features';
  currentUsage?: {
    aiRequests: { used: number; limit: number };
    bodyDoublingSessions?: { used: number; limit: number };
  };
  brainState?: {
    energy_level: number;
    focus_level: number;
  };
  testID?: string;
}

export const GentleUpgradeModal: React.FC<GentleUpgradeModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  trigger,
  currentUsage,
  brainState,
  testID,
}) => {
  const adaptationEnergy = brainState?.energy_level || 5;
  const adaptationFocus = brainState?.focus_level || 5;
  const theme = getAdaptiveTheme(adaptationEnergy, adaptationFocus);

  const getTitleMessage = (): string => {
    if (adaptationEnergy <= 3) {
      return "Gentle upgrade available";
    } else if (adaptationEnergy >= 7) {
      return "Unlock your full potential";
    }
    return "Upgrade to Premium";
  };

  const getContextMessage = (): string => {
    switch (trigger) {
      case 'ai_quota':
        if (adaptationEnergy <= 3) {
          return "You've used your AI assistance for this month. Premium gives you unlimited breakdowns to support you whenever you need it.";
        }
        return "You've used all 10 AI breakdown requests this month. Premium provides unlimited AI assistance for complex task planning.";
      
      case 'body_doubling':
        return "You've used your 3 body doubling sessions this month. Premium provides unlimited co-working sessions and scheduled partnerships.";
      
      case 'advanced_features':
        return "Premium unlocks advanced customization, insights, and social features designed specifically for neurodivergent productivity.";
      
      default:
        return "Premium enhances your neurodivergent productivity experience.";
    }
  };

  const getFeatures = (): UpgradeFeature[] => {
    return [
      {
        icon: '🤖',
        title: 'Unlimited AI Breakdown',
        description: 'Break down any task, anytime',
        available: 'premium'
      },
      {
        icon: '👥',
        title: 'Unlimited Body Doubling',
        description: 'Co-work sessions whenever you need focus',
        available: 'premium'
      },
      {
        icon: '📊',
        title: 'Advanced Insights',
        description: 'Brain state patterns and productivity trends',
        available: 'premium'
      },
      {
        icon: '🎨',
        title: 'Premium Customization',
        description: 'Advanced themes and accessibility options',
        available: 'premium'
      },
      {
        icon: '🧠',
        title: 'Brain State Check-ins',
        description: 'Daily adaptation system',
        available: 'free'
      },
      {
        icon: '📋',
        title: 'Core Task Management',
        description: 'Unlimited tasks and basic features',
        available: 'free'
      },
    ];
  };

  const getPriceMessage = (): string => {
    if (adaptationEnergy <= 3) {
      return "Just $4.99/month - less than a coffee";
    }
    return "$4.99/month - unlock unlimited potential";
  };

  const getUpgradeButtonText = (): string => {
    if (adaptationEnergy <= 3) {
      return "Try Premium";
    } else if (adaptationEnergy >= 7) {
      return "Upgrade Now";
    }
    return "Start Premium";
  };

  const features = getFeatures();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      testID={testID}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView 
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingHorizontal: theme.spacing.horizontal }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { marginBottom: theme.spacing.section }]}>
            <Text style={[
              styles.title, 
              { 
                fontSize: theme.typography.fontSize + 8,
                lineHeight: theme.typography.lineHeight * (theme.typography.fontSize + 8),
              }
            ]}>
              {getTitleMessage()}
            </Text>
            
            <Text style={[
              styles.contextMessage, 
              { 
                fontSize: theme.typography.fontSize,
                lineHeight: theme.typography.lineHeight * theme.typography.fontSize,
                marginTop: theme.spacing.vertical,
              }
            ]}>
              {getContextMessage()}
            </Text>
          </View>

          {/* Current Usage Summary */}
          {currentUsage && (
            <View style={[styles.usageContainer, { marginBottom: theme.spacing.section }]}>
              <Text style={styles.usageTitle}>This Month</Text>
              <View style={styles.usageRow}>
                <Text style={styles.usageLabel}>AI Breakdowns:</Text>
                <Text style={styles.usageValue}>
                  {currentUsage.aiRequests.used}/{currentUsage.aiRequests.limit}
                </Text>
              </View>
              {currentUsage.bodyDoublingSessions && (
                <View style={styles.usageRow}>
                  <Text style={styles.usageLabel}>Body Doubling:</Text>
                  <Text style={styles.usageValue}>
                    {currentUsage.bodyDoublingSessions.used}/{currentUsage.bodyDoublingSessions.limit}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Features Comparison */}
          <View style={[styles.featuresContainer, { marginBottom: theme.spacing.section }]}>
            <Text style={[styles.sectionTitle, { marginBottom: theme.spacing.vertical }]}>
              What's Included
            </Text>
            
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                <View style={[
                  styles.featureBadge,
                  { backgroundColor: feature.available === 'premium' ? COLORS.PREMIUM_ACCENT : COLORS.SUCCESS }
                ]}>
                  <Text style={styles.featureBadgeText}>
                    {feature.available === 'premium' ? 'Premium' : 'Free'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Pricing */}
          <View style={[styles.pricingContainer, { marginBottom: theme.spacing.section }]}>
            <Text style={[styles.priceMessage, { fontSize: theme.typography.fontSize }]}>
              {getPriceMessage()}
            </Text>
            <Text style={styles.pricingNote}>
              Cancel anytime. No pressure, no guilt.
            </Text>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { padding: theme.spacing.horizontal }]}>
          <GentleButton
            title={getUpgradeButtonText()}
            onPress={onUpgrade}
            variant="premium"
            size="large"
            accessibilityLabel="Upgrade to premium subscription"
            accessibilityHint="Start premium subscription for unlimited features"
            style={[styles.upgradeButton, { marginBottom: theme.spacing.vertical }]}
            testID="modal-upgrade-button"
          />
          
          <GentleButton
            title="Maybe Later"
            onPress={onClose}
            variant="ghost"
            size="medium"
            accessibilityLabel="Close upgrade modal"
            accessibilityHint="Continue with free version"
            testID="modal-close-button"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor applied dynamically
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.XL,
    // paddingHorizontal applied dynamically
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
  contextMessage: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    // marginTop, fontSize, and lineHeight applied dynamically
  },
  usageContainer: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    // marginBottom applied dynamically
  },
  usageTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.XS,
  },
  usageLabel: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  usageValue: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.PRIMARY,
  },
  featuresContainer: {
    // marginBottom applied dynamically
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.DIVIDER,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: SPACING.MD,
    width: 32,
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  featureDescription: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  featureBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12,
    marginLeft: SPACING.SM,
  },
  featureBadgeText: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.SURFACE,
  },
  pricingContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.UPGRADE_HIGHLIGHT,
    borderRadius: 12,
    padding: SPACING.LG,
    // marginBottom applied dynamically
  },
  priceMessage: {
    fontSize: TYPOGRAPHY.SIZES.BODY_LARGE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  pricingNote: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: COLORS.SURFACE,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    // padding applied dynamically
  },
  upgradeButton: {
    // marginBottom applied dynamically
  },
});
```

### Task 3: Premium Feature Indicator Component
**Create**: `src/components/PremiumFeatureIndicator.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';

export interface PremiumFeatureIndicatorProps {
  userTier: 'free' | 'premium';
  feature: 'ai_breakdown' | 'body_doubling' | 'advanced_insights' | 'customization';
  onLearnMore?: () => void;
  compact?: boolean;
  testID?: string;
}

export const PremiumFeatureIndicator: React.FC<PremiumFeatureIndicatorProps> = ({
  userTier,
  feature,
  onLearnMore,
  compact = false,
  testID,
}) => {
  const getFeatureInfo = () => {
    const features = {
      ai_breakdown: {
        name: 'AI Task Breakdown',
        description: 'Smart task breakdown assistance',
        icon: '🤖',
      },
      body_doubling: {
        name: 'Body Doubling',
        description: 'Co-working sessions for focus',
        icon: '👥',
      },
      advanced_insights: {
        name: 'Advanced Insights',
        description: 'Brain state pattern analysis',
        icon: '📊',
      },
      customization: {
        name: 'Premium Customization',
        description: 'Advanced themes and accessibility',
        icon: '🎨',
      },
    };
    
    return features[feature];
  };

  const info = getFeatureInfo();

  if (userTier === 'premium') {
    return (
      <View style={[styles.premiumBadge, compact && styles.premiumBadgeCompact]} testID={testID}>
        {!compact && <Text style={styles.premiumIcon}>{info.icon}</Text>}
        <Text style={[styles.premiumText, compact && styles.premiumTextCompact]}>
          {compact ? 'Premium' : `Premium: ${info.name}`}
        </Text>
      </View>
    );
  }

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.upgradeHintCompact} 
        onPress={onLearnMore}
        accessibilityRole="button"
        accessibilityLabel="Learn about premium features"
        testID={testID}
      >
        <Text style={styles.upgradeHintIcon}>✨</Text>
        <Text style={styles.upgradeHintTextCompact}>Premium</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.upgradeHint} 
      onPress={onLearnMore}
      accessibilityRole="button"
      accessibilityLabel={`Learn about premium feature: ${info.name}`}
      accessibilityHint="Tap to see premium upgrade options"
      testID={testID}
    >
      <View style={styles.upgradeHintContent}>
        <Text style={styles.upgradeHintIcon}>{info.icon}</Text>
        <View style={styles.upgradeHintText}>
          <Text style={styles.upgradeHintTitle}>
            {info.name} <Text style={styles.upgradeHintBadge}>Premium</Text>
          </Text>
          <Text style={styles.upgradeHintDescription}>{info.description}</Text>
        </View>
      </View>
      <Text style={styles.upgradeHintArrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Premium user indicators
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PREMIUM_ACCENT,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  premiumBadgeCompact: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12,
  },
  premiumIcon: {
    fontSize: 16,
    marginRight: SPACING.XS,
  },
  premiumText: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.SURFACE,
  },
  premiumTextCompact: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
  },
  
  // Free user upgrade hints
  upgradeHint: {
    backgroundColor: COLORS.UPGRADE_HIGHLIGHT,
    borderRadius: 12,
    padding: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.PREMIUM_ACCENT + '30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeHintCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.UPGRADE_HIGHLIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.PREMIUM_ACCENT + '30',
  },
  upgradeHintContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upgradeHintIcon: {
    fontSize: 20,
    marginRight: SPACING.SM,
  },
  upgradeHintText: {
    flex: 1,
  },
  upgradeHintTitle: {
    fontSize: TYPOGRAPHY.SIZES.BODY,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  upgradeHintBadge: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.BOLD,
    color: COLORS.PREMIUM_ACCENT,
    textTransform: 'uppercase',
  },
  upgradeHintDescription: {
    fontSize: TYPOGRAPHY.SIZES.BODY_SMALL,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: TYPOGRAPHY.LINE_HEIGHT.NORMAL * TYPOGRAPHY.SIZES.BODY_SMALL,
  },
  upgradeHintTextCompact: {
    fontSize: TYPOGRAPHY.SIZES.CAPTION,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: COLORS.PREMIUM_ACCENT,
    marginLeft: SPACING.XS,
  },
  upgradeHintArrow: {
    fontSize: 18,
    color: COLORS.PREMIUM_ACCENT,
    marginLeft: SPACING.SM,
  },
});
```

### Task 4: Freemium Component Exports
**Update**: `src/components/index.ts`
```typescript
// Existing exports
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

export { TaskCard } from './TaskCard';
export type { TaskCardProps } from './TaskCard';

export { TaskComplexityIndicator } from './TaskComplexityIndicator';
export type { TaskComplexityIndicatorProps } from './TaskComplexityIndicator';

export { AIBreakdownDisplay } from './AIBreakdownDisplay';
export type { AIBreakdownDisplayProps } from './AIBreakdownDisplay';

export { TaskListEmptyState } from './TaskListEmptyState';
export type { TaskListEmptyStateProps } from './TaskListEmptyState';

// New freemium exports
export { AIQuotaDisplay } from './AIQuotaDisplay';
export type { AIQuotaDisplayProps } from './AIQuotaDisplay';

export { GentleUpgradeModal } from './GentleUpgradeModal';
export type { GentleUpgradeModalProps, UpgradeFeature } from './GentleUpgradeModal';

export { PremiumFeatureIndicator } from './PremiumFeatureIndicator';
export type { PremiumFeatureIndicatorProps } from './PremiumFeatureIndicator';

// Component adaptation utilities
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

// Freemium integration utilities for Agent 3
export interface FreemiumState {
  userTier: 'free' | 'premium';
  quotas: {
    aiRequests: { used: number; limit: number };
    bodyDoublingSessions?: { used: number; limit: number };
  };
  canAccessFeature: (feature: string) => boolean;
  shouldShowUpgradePrompt: (context: string) => boolean;
}

export const createFreemiumHelpers = (subscriptionData: any): FreemiumState => {
  return {
    userTier: subscriptionData.tier,
    quotas: {
      aiRequests: {
        used: subscriptionData.ai_requests_used,
        limit: subscriptionData.ai_requests_limit,
      },
      bodyDoublingSessions: subscriptionData.body_doubling_sessions_used ? {
        used: subscriptionData.body_doubling_sessions_used,
        limit: 3, // Free tier limit
      } : undefined,
    },
    canAccessFeature: (feature: string) => {
      if (subscriptionData.tier === 'premium') return true;
      
      const freeFeatures = ['brain_state', 'basic_tasks', 'limited_ai', 'limited_body_doubling'];
      return freeFeatures.includes(feature);
    },
    shouldShowUpgradePrompt: (context: string) => {
      if (subscriptionData.tier === 'premium') return false;
      
      const aiUsagePercentage = (subscriptionData.ai_requests_used / subscriptionData.ai_requests_limit) * 100;
      
      if (context === 'ai_quota' && aiUsagePercentage >= 75) return true;
      if (context === 'features' && aiUsagePercentage >= 50) return true;
      
      return false;
    },
  };
};
```

### Task 5: Freemium UI Integration Tests
**Create**: `__tests__/components/freemiumUI.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { 
  AIQuotaDisplay, 
  GentleUpgradeModal, 
  PremiumFeatureIndicator 
} from '../../src/components';

describe('Freemium UI Components', () => {
  describe('AIQuotaDisplay', () => {
    test('should show gentle message when quota reached', () => {
      const { getByText } = render(
        <AIQuotaDisplay 
          used={10} 
          limit={10} 
          tier="free" 
        />
      );

      expect(getByText(/All AI requests used this month/)).toBeTruthy();
    });

    test('should adapt language for low energy states', () => {
      const lowEnergyState = {
        energy_level: 2,
        focus_level: 3,
      };

      const { getByText } = render(
        <AIQuotaDisplay 
          used={10} 
          limit={10} 
          tier="free"
          brainState={lowEnergyState}
        />
      );

      expect(getByText(/All AI requests used this month/)).toBeTruthy();
    });

    test('should show premium status correctly', () => {
      const { getByText } = render(
        <AIQuotaDisplay 
          used={50} 
          limit={1000} 
          tier="premium" 
        />
      );

      expect(getByText(/Premium: Unlimited/)).toBeTruthy();
    });

    test('should provide gentle upgrade prompts', () => {
      const mockUpgrade = jest.fn();
      const { getByText } = render(
        <AIQuotaDisplay 
          used={8} 
          limit={10} 
          tier="free"
          onUpgradePress={mockUpgrade}
        />
      );

      expect(getByText(/Learn More/)).toBeTruthy();
    });
  });

  describe('GentleUpgradeModal', () => {
    const defaultProps = {
      visible: true,
      onClose: jest.fn(),
      onUpgrade: jest.fn(),
      trigger: 'ai_quota' as const,
      currentUsage: {
        aiRequests: { used: 10, limit: 10 }
      }
    };

    test('should show contextual message based on trigger', () => {
      const { getByText } = render(
        <GentleUpgradeModal {...defaultProps} />
      );

      expect(getByText(/used all 10 AI breakdown requests/)).toBeTruthy();
    });

    test('should adapt tone for low energy users', () => {
      const lowEnergyState = {
        energy_level: 2,
        focus_level: 3,
      };

      const { getByText } = render(
        <GentleUpgradeModal 
          {...defaultProps} 
          brainState={lowEnergyState}
        />
      );

      expect(getByText(/Gentle upgrade available/)).toBeTruthy();
    });

    test('should show shame-free messaging', () => {
      const { getByText } = render(
        <GentleUpgradeModal {...defaultProps} />
      );

      expect(getByText(/Maybe Later/)).toBeTruthy();
      expect(getByText(/Cancel anytime. No pressure, no guilt./)).toBeTruthy();
    });

    test('should include feature comparison', () => {
      const { getByText } = render(
        <GentleUpgradeModal {...defaultProps} />
      );

      expect(getByText(/Unlimited AI Breakdown/)).toBeTruthy();
      expect(getByText(/Core Task Management/)).toBeTruthy();
    });
  });

  describe('PremiumFeatureIndicator', () => {
    test('should show premium badge for premium users', () => {
      const { getByText } = render(
        <PremiumFeatureIndicator 
          userTier="premium" 
          feature="ai_breakdown"
        />
      );

      expect(getByText(/Premium: AI Task Breakdown/)).toBeTruthy();
    });

    test('should show gentle upgrade hint for free users', () => {
      const mockLearnMore = jest.fn();
      const { getByText } = render(
        <PremiumFeatureIndicator 
          userTier="free" 
          feature="ai_breakdown"
          onLearnMore={mockLearnMore}
        />
      );

      expect(getByText(/AI Task Breakdown/)).toBeTruthy();
      expect(getByText(/Premium/)).toBeTruthy();
    });

    test('should be interactive for free users', () => {
      const mockLearnMore = jest.fn();
      const { getByRole } = render(
        <PremiumFeatureIndicator 
          userTier="free" 
          feature="ai_breakdown"
          onLearnMore={mockLearnMore}
        />
      );

      fireEvent.press(getByRole('button'));
      expect(mockLearnMore).toHaveBeenCalled();
    });

    test('should render compact version correctly', () => {
      const { getByText } = render(
        <PremiumFeatureIndicator 
          userTier="premium" 
          feature="ai_breakdown"
          compact
        />
      );

      expect(getByText('Premium')).toBeTruthy();
    });
  });
});
```

## Success Criteria
- [ ] AI quota display with gentle language and brain state adaptation
- [ ] Upgrade modal that never pressures or interrupts core functionality  
- [ ] Premium feature indicators that are informative, not aggressive
- [ ] All freemium UI maintains shame-free, encouraging language
- [ ] Components integrate seamlessly with Agent 3's subscription management
- [ ] Proper accessibility support for all interactive upgrade elements

## Testing Commands
```bash
npm run test -- --testPathPattern=freemiumUI
```

## Next Sprint
**4F: Accessibility & Adaptation** - Enhance all components with advanced accessibility features.

## Agent Dependencies
- **Needs from Sprint 4D**: Task display components for integration examples
- **Provides to Agent 3**: Freemium UI components and integration helpers
- **Provides to Agent 2**: UI patterns for subscription upgrade flows

## Common Issues
- **Language tone**: Always gentle, never pressure-based upgrade messaging
- **Core functionality**: Never block or interrupt basic app features for upgrades
- **Brain state adaptation**: Ensure upgrade prompts adapt to user's current energy level
- **Accessibility**: Include proper labels for all upgrade-related interactions

---
**Focus**: Gentle freemium UI only. Advanced accessibility features come in 4F.