# 🤝 Agent 3 Sprint 3H: Agent 4 Handoff

## Mission
Create final interface contracts, component specifications, and handoff documentation for Agent 4 UI implementation.

## Time Estimate
1 hour

## Prerequisites
- All sprints 3A-3G completed
- Stores tested and verified

## Sprint Goal
Complete handoff package with exact component interfaces, usage examples, and integration patterns.

## Core Tasks

### Task 1: Complete Component Interface Specification
**Create**: `src/types/agent4Handoff.ts`
```typescript
import { BrainState, Task, BrainStateAdaptation } from '../store';

// EXACT component interfaces Agent 4 must implement
export interface SliderComponentProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  adaptation: BrainStateAdaptation;
  accessibility: {
    label: string;
    hint: string;
    value: string;
  };
}

export interface ButtonComponentProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'ghost';
  adaptation: BrainStateAdaptation;
  accessibility: {
    label: string;
    hint: string;
    role: 'button';
  };
}

export interface TextInputComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  adaptation: BrainStateAdaptation;
  accessibility: {
    label: string;
    hint: string;
  };
}

export interface TaskCardComponentProps {
  task: Task;
  onComplete: () => Promise<void>;
  onRequestBreakdown: () => Promise<void>;
  onEdit?: () => void;
  adaptation: BrainStateAdaptation;
  aiRequestInProgress: boolean;
  quotaInfo: {
    canMakeRequest: boolean;
    remainingRequests: number;
    tier: 'free' | 'premium';
  };
}
```

### Task 2: Usage Examples for Agent 4
**Create**: `docs/AGENT_4_INTEGRATION.md`
```markdown
# Agent 4 Integration Guide

## Store Integration Pattern

### Required Hook Usage
```typescript
// Brain State Screen Implementation
const BrainStateScreen: React.FC = () => {
  const { 
    currentState,
    loading,
    error,
    recordState,
    getBrainStateAdaptation 
  } = useBrainStateStore();
  
  const adaptation = getBrainStateAdaptation();
  
  // Component implementation...
};

// Task List Screen Implementation
const TaskListScreen: React.FC = () => {
  const {
    getFilteredTasks,
    completeTask,
    requestAIBreakdown,
    aiRequestInProgress
  } = useTaskStore();
  
  const { getBrainStateAdaptation } = useBrainStateStore();
  const adaptation = getBrainStateAdaptation();
  
  // Component implementation...
};
```

### Required Component Implementations

#### Slider Component
```typescript
const BrainStateSlider: React.FC<SliderComponentProps> = ({
  value,
  onValueChange,
  adaptation,
  accessibility
}) => {
  const spacing = getSpacingForAdaptation(adaptation);
  const touchTargetSize = getTouchTargetSize(adaptation);
  
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={1}
      maximumValue={10}
      step={1}
      style={{ height: touchTargetSize, marginVertical: spacing }}
      accessibilityLabel={accessibility.label}
      accessibilityHint={accessibility.hint}
      accessibilityValue={{ text: accessibility.value }}
    />
  );
};
```

#### Adaptive Button Component
```typescript
const AdaptiveButton: React.FC<ButtonComponentProps> = ({
  title,
  onPress,
  loading,
  variant,
  adaptation,
  accessibility
}) => {
  const touchTargetSize = getTouchTargetSize(adaptation);
  const spacing = getSpacingForAdaptation(adaptation);
  
  const buttonStyle = {
    minHeight: touchTargetSize,
    marginVertical: spacing / 2,
    backgroundColor: variant === 'primary' ? COLORS.PRIMARY : COLORS.SECONDARY
  };
  
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={accessibility.label}
      accessibilityHint={accessibility.hint}
    >
      <Text>{loading ? 'Loading...' : title}</Text>
    </TouchableOpacity>
  );
};
```

## Critical Requirements
1. **Adaptation Integration**: Every component MUST use `adaptation` prop
2. **Accessibility**: All components MUST include proper accessibility props
3. **Touch Targets**: MUST respect `getTouchTargetSize(adaptation)`
4. **Spacing**: MUST use `getSpacingForAdaptation(adaptation)`
5. **Error Handling**: MUST use gentle error messages from stores
```

### Task 3: Integration Testing Template
**Create**: `__tests__/integration/agent4Integration.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useBrainStateStore, useTaskStore } from '../../src/store';

// Template for Agent 4 component integration tests
describe('Agent 4 Component Integration', () => {
  test('Slider component should integrate with brain state store', () => {
    // Mock component implementation
    const TestSlider = ({ value, onValueChange, adaptation }) => (
      <Text testID="slider-value">{value}</Text>
    );
    
    const TestScreen = () => {
      const { getBrainStateAdaptation } = useBrainStateStore();
      const adaptation = getBrainStateAdaptation();
      
      return (
        <TestSlider 
          value={5} 
          onValueChange={() => {}}
          adaptation={adaptation}
        />
      );
    };
    
    const { getByTestId } = render(<TestScreen />);
    expect(getByTestId('slider-value')).toBeTruthy();
  });
  
  test('Button component should respect touch target sizes', () => {
    // Test that buttons use proper touch target sizes based on adaptation
    const mockAdaptation = {
      touchTargetSize: 'large',
      spacing: 'relaxed'
    };
    
    // Component should have minHeight of 56px for large touch targets
    // Agent 4 must implement this correctly
  });
  
  test('Task card should handle AI requests with quota info', () => {
    // Test that task cards properly handle AI breakdown requests
    // and display quota information appropriately
  });
});
```

### Task 4: Final Store Export
**Update**: `src/store/index.ts` - Final complete export:
```typescript
// Core stores
export { useBrainStateStore } from './brainStateStore';
export { useTaskStore } from './taskStore';

// Store types
export type { BrainStateStore } from './brainStateStore';
export type { TaskStore } from './taskStore';

// Data types
export type { BrainState } from '../services/brainStateService';
export type { Task } from '../services/taskService';
export type { BrainStateAdaptation } from '../types/adaptation';

// Adaptation utilities - Agent 4 MUST use these
export { 
  getSpacingForAdaptation, 
  getTouchTargetSize, 
  getEncouragementMessage 
} from '../utils/adaptationHelpers';

// AI utilities - Agent 4 MUST use for AI features
export { 
  buildTaskBreakdownPrompt, 
  parseAIBreakdown 
} from '../utils/aiPrompts';

// Quota utilities - Agent 4 MUST use for freemium features
export { 
  getQuotaDisplayData, 
  getGentleQuotaMessage 
} from '../utils/quotaHelpers';

// Component interfaces - Agent 4 MUST implement exactly
export type {
  SliderComponentProps,
  ButtonComponentProps,
  TextInputComponentProps,
  TaskCardComponentProps
} from '../types/agent4Handoff';

// Screen interfaces - Agent 4 MUST use for navigation
export type {
  RootStackParamList,
  ScreenProps,
  BrainStateCheckinComponentProps,
  TaskListComponentProps
} from '../types/screenProps';
```

### Task 5: Handoff Checklist
**Create**: `docs/AGENT_4_HANDOFF_CHECKLIST.md`
```markdown
# Agent 4 Handoff Checklist

## Store Integration ✅
- [x] Brain state store fully implemented and tested
- [x] Task store with brain state filtering working
- [x] AI integration with quota management working
- [x] Offline functionality implemented
- [x] Adaptation system providing UI guidance

## Component Interfaces ✅
- [x] All component prop interfaces defined
- [x] Adaptation integration patterns documented
- [x] Accessibility requirements specified
- [x] Touch target size requirements documented

## Utility Functions ✅
- [x] Spacing calculation utilities provided
- [x] Touch target size utilities provided  
- [x] Encouragement message utilities provided
- [x] AI prompt utilities provided
- [x] Quota display utilities provided

## Screen Structure ✅
- [x] Brain state check-in screen structure created
- [x] Task list screen structure created
- [x] Navigation integration points identified
- [x] Error handling patterns established

## Testing Foundation ✅
- [x] Store tests achieving 80%+ coverage
- [x] Integration tests validating store coordination
- [x] Performance tests verifying requirements
- [x] Component integration test templates provided

## Critical Agent 4 Requirements

### MUST Implement Components:
1. **BrainStateSlider** - With adaptation-based sizing
2. **AdaptiveButton** - With touch target requirements
3. **AdaptiveTextInput** - With accessibility support
4. **TaskCard** - With AI breakdown integration
5. **LoadingSpinner** - With gentle messaging
6. **ErrorMessage** - With gentle, shame-free language

### MUST Use Store Integration:
1. **useBrainStateStore()** - For all brain state operations
2. **useTaskStore()** - For all task operations
3. **getBrainStateAdaptation()** - For ALL UI adaptations
4. **getSpacingForAdaptation()** - For ALL spacing decisions
5. **getTouchTargetSize()** - For ALL touch targets

### MUST Follow Patterns:
1. **Adaptation Props** - Every component gets adaptation prop
2. **Accessibility** - All components have proper a11y
3. **Touch Targets** - Minimum 44px, adaptive based on focus
4. **Gentle Language** - Use provided message utilities
5. **Error Handling** - Never show harsh errors

## Testing Requirements for Agent 4
- [ ] Component adaptation tests
- [ ] Accessibility compliance tests  
- [ ] Touch target size verification tests
- [ ] Store integration tests
- [ ] End-to-end user flow tests

## Performance Requirements for Agent 4
- [ ] Screen render time < 2 seconds
- [ ] Component re-render optimization
- [ ] Smooth scrolling in task lists
- [ ] Responsive touch interactions
- [ ] Efficient re-adaptation when brain state changes
```

## Success Criteria
- [ ] All component interfaces completely defined
- [ ] Usage examples provided for every major component
- [ ] Integration patterns documented with code examples
- [ ] Testing templates provided for Agent 4
- [ ] Performance requirements clearly specified
- [ ] Store exports finalized and documented

## Testing Commands
```bash
npm run test -- --testPathPattern=integration
npm run build # Verify all exports work correctly
```

## Agent 4 Next Steps
1. **Implement Slider Component** - Start with brain state sliders
2. **Implement Button Component** - With adaptation integration
3. **Implement Task Card** - Most complex component
4. **Create Screen Layouts** - Using provided screen structures
5. **Add Navigation Integration** - Connect with Agent 1's navigation
6. **Comprehensive Testing** - Ensure all requirements met

## Agent Dependencies
- **Provides to Agent 4**: Complete store system, component interfaces, adaptation utilities
- **Requires from Agent 4**: UI component implementations that follow exact specifications
- **Integration Point**: Agent 4 components must work seamlessly with Agent 3 stores

---
**Agent 3 Complete**: All core functionality implemented, tested, and ready for UI layer! 🤝