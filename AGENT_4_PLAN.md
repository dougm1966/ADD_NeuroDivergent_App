# 🎨 Agent 4: UI/UX Component Builder

## Mission
Create neurodivergent-friendly design system, reusable components, and gentle freemium upgrade experiences through 8 focused sprints.

## Domain Ownership
- **Primary**: Components, design system, accessibility, sensory customization, freemium UI
- **Branch**: `agent4/ui-components`
- **Files You Own**: src/components/, src/constants/, accessibility features
- **Dependencies**: Needs Agent 1's app shell and Agent 3's UI requirements

## Critical Rules (NEVER VIOLATE)
1. Colors: NEVER use red anywhere (triggers neurodivergent users)
2. Language: Always gentle, shame-free, encouraging
3. Accessibility: 44px minimum touch targets, screen reader support
4. Styling: Native StyleSheet ONLY (no styled-components)
5. Freemium: Gentle upgrade prompts, never interrupt core functionality
6. Sprint Size: Each sprint 300-500 lines maximum (focused, testable)

## 8-Sprint Development Plan

### Sprint 4A: Design System Foundation (Week 1, Day 1)
**Time**: 60 minutes | **Lines**: ~404 | **Focus**: Colors, typography, spacing, accessibility constants

**Deliverables**:
- [ ] Complete neurodivergent-friendly color system with red color prevention
- [ ] Adaptive typography system that responds to brain state
- [ ] 8px grid spacing system with touch target standards
- [ ] Accessibility constants with WCAG 2.1 AA compliance
- [ ] Gentle UI message utilities for shame-free interactions
- [ ] `getAdaptiveTheme()` utility for Agent 3 integration

**Key Files**:
- `src/constants/colors.ts` (neurodivergent color palette)
- `src/constants/typography.ts` (adaptive typography)
- `src/constants/spacing.ts` (spacing and layout system)
- `src/constants/accessibility.ts` (WCAG compliance)
- `src/constants/index.ts` (unified design system export)

**Success Criteria**: Design system validates (no red colors), adaptive theme works, Agent 3 can import utilities

### Sprint 4B: Base Interactive Components (Week 1, Day 2)
**Time**: 60 minutes | **Lines**: ~550 | **Focus**: Core interactive components with brain state adaptation

**Deliverables**:
- [ ] GentleButton component with variant system and accessibility
- [ ] BrainStateSlider component with 1-10 scale and visual feedback
- [ ] GentleTextInput component with gentle error handling (no red)
- [ ] Component adaptation system for brain state integration
- [ ] TypeScript interfaces for Agent 3 integration

**Key Files**:
- `src/components/GentleButton.tsx`
- `src/components/BrainStateSlider.tsx`
- `src/components/GentleTextInput.tsx`
- `src/components/index.ts` (component exports)

**Success Criteria**: All components meet 44px touch targets, adapt to brain state, integrate with Agent 3

### Sprint 4C: Brain State Check-in UI (Week 1, Day 3)
**Time**: 60 minutes | **Lines**: ~450 | **Focus**: Complete brain state check-in experience

**Deliverables**:
- [ ] BrainStateCheckinForm component with three sliders (energy, focus, mood)
- [ ] CheckinSuccessFeedback component with personalized encouragement
- [ ] BrainStateSummary component for displaying current state
- [ ] Integration with Agent 3's brain state store
- [ ] Adaptive messaging based on brain state levels

**Key Files**:
- `src/components/BrainStateCheckinForm.tsx`
- `src/components/CheckinSuccessFeedback.tsx`
- `src/components/BrainStateSummary.tsx`

**Success Criteria**: Complete check-in flow, integrates with Agent 3 store, encourages daily use

### Sprint 4D: Task Display Components (Week 1, Day 4)
**Time**: 60 minutes | **Lines**: ~650 | **Focus**: Task management UI with complexity matching

**Deliverables**:
- [ ] TaskCard component with complexity indicators and adaptive display
- [ ] TaskComplexityIndicator component for visual complexity matching
- [ ] AIBreakdownDisplay component for showing OpenAI task breakdown
- [ ] TaskListEmptyState component with encouraging empty states
- [ ] Integration with Agent 3's task store and Agent 2's AI services

**Key Files**:
- `src/components/TaskCard.tsx`
- `src/components/TaskComplexityIndicator.tsx`
- `src/components/AIBreakdownDisplay.tsx`
- `src/components/TaskListEmptyState.tsx`

**Success Criteria**: Tasks display correctly, complexity matching works, AI breakdown integrates

### Sprint 4E: Freemium UI Components (Week 1, Day 5)
**Time**: 60 minutes | **Lines**: ~550 | **Focus**: Gentle freemium experience with subscription UI

**Deliverables**:
- [ ] AIQuotaDisplay component showing usage with gentle language
- [ ] GentleUpgradeModal component for shame-free premium promotion
- [ ] PremiumFeatureIndicator component for feature gating
- [ ] Integration with Agent 2's subscription services
- [ ] Brain state adaptive pricing language

**Key Files**:
- `src/components/AIQuotaDisplay.tsx`
- `src/components/GentleUpgradeModal.tsx`
- `src/components/PremiumFeatureIndicator.tsx`

**Success Criteria**: Freemium UI is gentle, never blocks core features, integrates with Agent 2

### Sprint 4F: Accessibility & Adaptation (Week 2, Day 1)
**Time**: 75 minutes | **Lines**: ~600 | **Focus**: Advanced accessibility and sensory customization

**Deliverables**:
- [ ] Advanced accessibility hook for system state monitoring
- [ ] SensoryCustomizationProvider for user preference management
- [ ] AccessibilitySettingsScreen for comprehensive accessibility controls
- [ ] Testing utilities for automated accessibility validation
- [ ] High contrast and reduced motion support

**Key Files**:
- `src/hooks/useAccessibility.ts`
- `src/providers/SensoryCustomizationProvider.tsx`
- `src/screens/AccessibilitySettingsScreen.tsx`
- `src/utils/accessibilityTestUtils.ts`

**Success Criteria**: WCAG 2.1 AA compliance, sensory customization works, testing utilities function

### Sprint 4G: Component Integration Testing (Week 2, Day 2)
**Time**: 75 minutes | **Lines**: ~800 | **Focus**: Comprehensive testing and performance validation

**Deliverables**:
- [ ] Component integration tests with brain state adaptation
- [ ] User flow testing for complete app scenarios
- [ ] Performance testing for sub-100ms render times
- [ ] Cross-agent integration tests for handoff validation
- [ ] Accessibility compliance automated testing

**Key Files**:
- `__tests__/integration/componentIntegration.test.tsx`
- `__tests__/integration/userFlows.test.tsx`
- `__tests__/integration/performanceIntegration.test.tsx`
- `__tests__/integration/crossAgentIntegration.test.tsx`

**Success Criteria**: 95%+ test coverage, all performance benchmarks met, cross-agent integration verified

### Sprint 4H: Agent Integration Handoff (Week 2, Day 3)
**Time**: 60 minutes | **Lines**: ~500 | **Focus**: Documentation and integration interfaces

**Deliverables**:
- [ ] Complete integration API documentation for other agents
- [ ] Step-by-step migration guide for Agent 3 screen replacement
- [ ] Component documentation generator script
- [ ] Integration verification script for other agents
- [ ] Agent 4 completion summary and handoff documentation

**Key Files**:
- `docs/AGENT_4_INTEGRATION_API.md`
- `docs/AGENT_4_MIGRATION_GUIDE.md`
- `scripts/generateComponentDocs.js`
- `scripts/verifyIntegration.js`
- `docs/AGENT_4_COMPLETION_SUMMARY.md`

**Success Criteria**: Complete documentation, other agents can integrate seamlessly, verification tools work

## Service Architecture Overview

### Core UI Component Stack
```typescript
// Design System Foundation
COLORS: Neurodivergent-friendly palette with red color prevention
TYPOGRAPHY: Adaptive font system that responds to brain state
SPACING: 8px grid system with touch target standards
ACCESSIBILITY: WCAG 2.1 AA compliance built-in

// Interactive Components
GentleButton: Brain state adaptive button with accessibility
BrainStateSlider: 1-10 scale slider with visual feedback
GentleTextInput: Form input with gentle error handling
TaskCard: Task display with complexity matching
AIQuotaDisplay: Freemium usage tracking with gentle language

// Adaptation System
getAdaptiveTheme(): Returns spacing, typography, colors based on brain state
createComponentAdaptation(): Helper for component brain state integration
```

### Interface Contracts (For Other Agents)

#### Exact Component Exports (src/components/index.ts)
```typescript
// Primary component exports for Agent 3 integration
export { GentleButton } from './GentleButton';
export { BrainStateSlider } from './BrainStateSlider';
export { GentleTextInput } from './GentleTextInput';
export { BrainStateCheckinForm } from './BrainStateCheckinForm';
export { TaskCard } from './TaskCard';
export { AIQuotaDisplay } from './AIQuotaDisplay';
export { GentleUpgradeModal } from './GentleUpgradeModal';
export { SensoryCustomizationProvider } from './SensoryCustomizationProvider';

// Type exports for Agent 3 integration
export type { GentleButtonProps, BrainStateSliderProps, TaskCardProps } from './types';
export type { ComponentAdaptation } from './types';

// Helper functions for Agent 3
export { createComponentAdaptation } from './utils';
```

#### Brain State Adaptation Interface (for Agent 3)
```typescript
// Agent 3 provides brain state data to Agent 4 components
export interface BrainState {
  energy_level: number; // 1-10 scale
  focus_level: number;  // 1-10 scale
  mood_level: number;   // 1-10 scale
  notes?: string;
  created_at: string;
}

// Component adaptation system
export interface ComponentAdaptation {
  touchTargetSize: number;  // 44-56px based on focus level
  spacing: number;          // 8-48px based on energy level
  fontSize: number;         // 16-18px based on energy level
  lineHeight: number;       // 1.2-2.0 based on energy level
}

// Adaptive theme generator for Agent 3 integration
export const getAdaptiveTheme = (
  energyLevel: number, 
  focusLevel: number,
  userPreferences?: UserPreferences
): AdaptiveTheme;
```

#### Freemium Integration Interface (for Agent 2)
```typescript
// Agent 2 provides subscription data to Agent 4 freemium UI
export interface SubscriptionData {
  tier: 'free' | 'premium';
  ai_requests_used: number;
  ai_requests_limit: number;
  reset_date: string;
}

// Freemium component integration
export interface FreemiumState {
  canUseAI: boolean;
  remainingRequests: number;
  shouldShowUpgrade: boolean;
  upgradePromptTrigger: 'quota_warning' | 'quota_reached' | 'feature_gate';
}

// Upgrade flow integration
export interface UpgradeHandlers {
  onUpgradePress: () => Promise<boolean>;
  onUpgradeSuccess: () => void;
  onUpgradeCancel: () => void;
}
```

## Design System Principles

### Neurodivergent-First Design Philosophy
- **No Red Colors**: Complete elimination of triggering colors throughout system
- **Gentle Language**: Shame-free messaging in all UI text and error states
- **Brain State Adaptation**: UI automatically adapts spacing, sizing, and complexity
- **Sensory Accommodation**: Customizable for various neurodivergent needs
- **Cognitive Load Reduction**: Simplified interfaces for low energy states

### Accessibility Foundation
- **WCAG 2.1 AA Compliance**: All components meet accessibility standards
- **Touch Target Standards**: 44px minimum, up to 56px for low focus states
- **Screen Reader Support**: Comprehensive accessibility labels and semantic structure
- **High Contrast Support**: Automatic contrast ratio validation and support
- **Reduced Motion**: Respects system accessibility preferences

### Brain State Responsive Design
- **Low Energy (1-3)**: Larger spacing, bigger touch targets, gentle language, simplified UI
- **Medium Energy (4-6)**: Standard sizing and complexity
- **High Energy (7-10)**: Compact layout, efficient interactions, full feature access

## Testing Infrastructure

### Required Test Coverage
Each sprint includes comprehensive testing:
- **Unit Tests**: 95%+ coverage for all components
- **Integration Tests**: Cross-component and cross-agent functionality
- **Accessibility Tests**: Automated WCAG compliance verification
- **Performance Tests**: Sub-100ms render time validation
- **Brain State Tests**: UI adaptation verification

### Test Patterns for Other Agents
```typescript
// Component integration testing
describe('Agent 4 Component Integration', () => {
  test('should adapt to brain state changes from Agent 3', () => {
    // PASS CRITERIA: UI adapts within 100ms of brain state update
  });
  
  test('should integrate with Agent 2 subscription data', () => {
    // PASS CRITERIA: Freemium UI reflects subscription status correctly
  });
  
  test('should work within Agent 1 navigation system', () => {
    // PASS CRITERIA: Components navigate correctly using provided navigation
  });
});
```

## Phase 2 Migration Readiness

### Extension Architecture
Agent 4 is designed for seamless Phase 2 expansion:
- **Gamification UI**: Achievement celebration components ready for implementation
- **Body Doubling Interface**: Video component patterns established
- **Advanced Notifications**: Brain state adaptive notification framework
- **Premium Customization**: Extended sensory customization system ready

### Backward Compatibility Strategy
```typescript
// Phase 1 components remain stable
export const GentleButton: React.FC<GentleButtonProps> = (props) => {
  // Phase 1 implementation (never changes)
};

// Phase 2 extensions are additive
export const AchievementCelebration: React.FC<AchievementProps> = (props) => {
  if (!__PHASE_2_ENABLED__) return null;
  // Phase 2 implementation
};
```
## Handoff Points

### To Agent 1 (Foundation)
**When Ready**: Complete design system and base components ready for app integration
**Provides**: 
- Design system constants (colors, typography, spacing) for consistent theming
- Component folder structure and export patterns
- Error message standards for gentle user experience
- Testing utilities for component validation

### To Agent 2 (Backend)
**When Ready**: Freemium UI components complete, subscription integration ready
**Provides**:
- Freemium UI components for subscription management
- Gentle upgrade flow patterns for premium features
- Subscription status display components
- Brain state adaptive pricing language utilities

**Agent 2 Must Use These Exact Patterns**:
```typescript
// Subscription data integration
const subscriptionData: SubscriptionData = {
  tier: 'free',
  ai_requests_used: 7,
  ai_requests_limit: 10,
  reset_date: '2025-07-25'
};

// Freemium component usage
<AIQuotaDisplay
  used={subscriptionData.ai_requests_used}
  limit={subscriptionData.ai_requests_limit}
  tier={subscriptionData.tier}
  onUpgradePress={() => handleUpgrade()}
/>
```

### To Agent 3 (Core Features)
**When Ready**: All UI components complete, brain state adaptation system functional
**Provides**:
- Complete screen implementations to replace Agent 3's placeholders
- Brain state adaptation system with `getAdaptiveTheme()` utility
- Component interfaces with exact prop specifications
- UI state management patterns for screen components

**Agent 3 Must Use These Exact Integration Patterns**:
```typescript
// Screen replacement pattern
import { BrainStateCheckinForm } from '@agent4/components';
import { useBrainStateStore } from '@agent3/stores';

const BrainStateCheckinScreen = () => {
  const { updateBrainState } = useBrainStateStore();
  
  return (
    <BrainStateCheckinForm
      energy={5}
      focus={5}
      mood={5}
      notes=""
      onEnergyChange={setEnergy}
      onFocusChange={setFocus}
      onMoodChange={setMood}
      onSubmit={handleSubmit}
      loading={false}
      error={null}
    />
  );
};

// Adaptive theme integration
const theme = getAdaptiveTheme(brainState.energy_level, brainState.focus_level);
```

## Success Criteria & Testing

### Must Pass Before Agent Integration
- [ ] All 8 sprints completed successfully (4A through 4H)
- [ ] Design system prevents red color usage throughout
- [ ] All components meet 44px minimum touch target requirements
- [ ] Brain state adaptation system functional and tested
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Freemium UI components integrate with Agent 2's subscription system
- [ ] Complete documentation and migration guides available
- [ ] 95%+ test coverage across all components
- [ ] Sub-100ms render time performance benchmarks met

### Performance Benchmarks
- Component render time: < 100ms for any component
- Brain state adaptation: < 50ms to apply theme changes
- Screen transition: < 300ms between Agent 3 screens
- Memory usage: No memory leaks during navigation
- Bundle size: Minimal impact on overall app size

### Cross-Agent Integration Verification
- Agent 1 can integrate design system constants without conflicts
- Agent 2 can connect subscription data to freemium UI components
- Agent 3 can replace placeholder screens with Agent 4 implementations
- All agents can use error handling and accessibility patterns

## Common Mistakes to Avoid
- Don't use red colors anywhere in the design system
- Don't create harsh or technical error messages
- Don't make touch targets smaller than 44px
- Don't skip accessibility labels on interactive elements
- Don't break brain state adaptation when updating components
- Don't change component interfaces after Agent 3 integration
- Don't skip testing setup (other agents depend on test patterns)

## Files Created by Agent 4

### Sprint 4A Files (Design System)
- `src/constants/colors.ts` (neurodivergent color palette)
- `src/constants/typography.ts` (adaptive typography)
- `src/constants/spacing.ts` (spacing and layout system)
- `src/constants/accessibility.ts` (WCAG compliance)
- `src/constants/index.ts` (unified exports)

### Sprint 4B Files (Base Components)
- `src/components/GentleButton.tsx`
- `src/components/BrainStateSlider.tsx`
- `src/components/GentleTextInput.tsx`
- `src/components/index.ts`

### Sprint 4C Files (Brain State UI)
- `src/components/BrainStateCheckinForm.tsx`
- `src/components/CheckinSuccessFeedback.tsx`
- `src/components/BrainStateSummary.tsx`

### Sprint 4D Files (Task Display)
- `src/components/TaskCard.tsx`
- `src/components/TaskComplexityIndicator.tsx`
- `src/components/AIBreakdownDisplay.tsx`
- `src/components/TaskListEmptyState.tsx`

### Sprint 4E Files (Freemium UI)
- `src/components/AIQuotaDisplay.tsx`
- `src/components/GentleUpgradeModal.tsx`
- `src/components/PremiumFeatureIndicator.tsx`

### Sprint 4F Files (Accessibility)
- `src/hooks/useAccessibility.ts`
- `src/providers/SensoryCustomizationProvider.tsx`
- `src/screens/AccessibilitySettingsScreen.tsx`
- `src/utils/accessibilityTestUtils.ts`

### Sprint 4G Files (Testing)
- `__tests__/integration/componentIntegration.test.tsx`
- `__tests__/integration/userFlows.test.tsx`
- `__tests__/integration/performanceIntegration.test.tsx`
- `__tests__/integration/crossAgentIntegration.test.tsx`

### Sprint 4H Files (Documentation)
- `docs/AGENT_4_INTEGRATION_API.md`
- `docs/AGENT_4_MIGRATION_GUIDE.md`
- `scripts/generateComponentDocs.js`
- `scripts/verifyIntegration.js`
- `docs/AGENT_4_COMPLETION_SUMMARY.md`

---
**Agent 4 Focus**: Neurodivergent-first UI components with comprehensive accessibility, brain state adaptation, and gentle user experience throughout all interactions.