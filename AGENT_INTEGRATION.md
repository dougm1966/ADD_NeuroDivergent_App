# 🤝 AGENT INTEGRATION & HANDOFF PROTOCOLS

**Purpose**: Clear protocols for seamless agent transitions and integration testing  
**Status**: Ready for implementation  
**Critical**: Follow these protocols to prevent integration failures  

---

## 🎯 Integration Overview

### **Agent Dependency Chain**
```
Agent 1 (Foundation) → Agent 3 (Core Features)
Agent 2 (Backend) → Agent 3 (Core Features) 
Agent 2 (Backend) → Agent 4 (UI Components)
Agent 4 (UI Components) → Agent 3 (Core Features)
```

### **Parallel Development Windows**
- **Week 1**: Agent 1 & Agent 2 work simultaneously
- **Week 2**: Agent 3 & Agent 4 work simultaneously  
- **Week 3**: Final integration and testing

---

## 🔄 Handoff Protocol 1: Agent 1 → Agent 3

### **What Agent 1 Delivers**
**Deadline**: End of Week 1 (After Sprint 1C completion)

#### **Navigation Framework**
```typescript
// File: src/navigation/types.ts
export type RootStackParamList = {
  BrainStateCheckin: undefined;
  TaskList: { brainState?: BrainState };
  TaskDetail: { taskId: string };
  Settings: { showUpgrade?: boolean };
  Profile: undefined;
};

// File: src/navigation/hooks.ts
export const useAppNavigation = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return navigation;
};

// File: src/types/navigation.ts
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, T>;
};
```

#### **Error Handling Patterns**
```typescript
// File: src/utils/errorBoundary.ts
export class AppErrorBoundary extends React.Component {
  // Error boundary implementation
}

// File: src/utils/errorHandling.ts
export const handleError = (error: Error, context: string) => {
  // Gentle error handling for neurodivergent users
};
```

### **Agent 1 Handoff Checklist**
- [ ] All navigation types exported from `src/navigation/types.ts`
- [ ] `useAppNavigation()` hook tested and functional
- [ ] Error boundaries handle crashes gracefully  
- [ ] TypeScript builds without errors in strict mode
- [ ] App starts successfully on iOS and Android
- [ ] Navigation between all screens functional
- [ ] Testing infrastructure ready for Agent 3

### **Agent 3 Integration Requirements**
```typescript
// Agent 3 must be able to import and use:
import { RootStackParamList, ScreenProps } from '@/navigation/types';
import { useAppNavigation } from '@/navigation/hooks';

// Example screen implementation:
const BrainStateCheckinScreen: React.FC<ScreenProps<'BrainStateCheckin'>> = ({
  navigation,
  route
}) => {
  const nav = useAppNavigation();
  // Screen implementation
};
```

### **Verification Commands**
```bash
# Agent 1 runs before handoff:
npm run verify:agent1-handoff

# Agent 3 runs after receiving handoff:
npm run test:navigation
npm run type-check
```

---

## 🗄️ Handoff Protocol 2: Agent 2 → Agent 3

### **What Agent 2 Delivers**
**Deadline**: Mid Week 2 (After Sprint 2F completion)

#### **Service Interfaces**
```typescript
// File: src/services/types.ts
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface BrainStateServiceInterface {
  createBrainState(state: BrainStateInput): Promise<ServiceResponse<BrainState>>;
  getTodaysBrainState(userId: string): Promise<ServiceResponse<BrainState>>;
  getBrainStateHistory(userId: string, days: number): Promise<ServiceResponse<BrainState[]>>;
}

export interface TaskServiceInterface {
  createTask(task: TaskInput): Promise<ServiceResponse<Task>>;
  getTasksByComplexity(userId: string, maxComplexity: number): Promise<ServiceResponse<Task[]>>;
  updateTask(taskId: string, updates: Partial<Task>): Promise<ServiceResponse<Task>>;
  deleteTask(taskId: string): Promise<ServiceResponse<void>>;
}

export interface SubscriptionServiceInterface {
  getUserSubscription(userId: string): Promise<ServiceResponse<UserSubscription>>;
  checkAIQuota(userId: string): Promise<ServiceResponse<{ canUse: boolean; remaining: number }>>;
  incrementAIUsage(userId: string): Promise<ServiceResponse<void>>;
}
```

#### **Authentication System**
```typescript
// File: src/services/auth.ts
export interface AuthServiceInterface {
  signUp(email: string, password: string): Promise<ServiceResponse<User>>;
  signIn(email: string, password: string): Promise<ServiceResponse<User>>;
  signOut(): Promise<ServiceResponse<void>>;
  getCurrentUser(): Promise<ServiceResponse<User | null>>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
```

#### **Freemium Integration**
```typescript
// File: src/services/freemium.ts
export interface FreemiumServiceInterface {
  getSubscriptionStatus(userId: string): Promise<ServiceResponse<SubscriptionData>>;
  canUseAIFeature(userId: string): Promise<ServiceResponse<boolean>>;
  trackAIUsage(userId: string): Promise<ServiceResponse<void>>;
  getUpgradeOptions(): Promise<ServiceResponse<UpgradeOption[]>>;
}
```

### **Agent 2 Handoff Checklist**
- [ ] All service interfaces implemented and tested
- [ ] Supabase connection established and stable
- [ ] Database schema deployed with RLS policies
- [ ] Authentication flow works (signup/signin/signout)
- [ ] CRUD operations tested with unit tests (minimum 80% coverage)
- [ ] Freemium quota system enforced and tested
- [ ] Offline sync patterns documented
- [ ] Error handling uses gentle, shame-free language
- [ ] All services return standardized `ServiceResponse<T>` format

### **Agent 3 Integration Requirements**
```typescript
// Agent 3 must be able to import and use:
import { 
  BrainStateServiceInterface,
  TaskServiceInterface,
  SubscriptionServiceInterface,
  AuthServiceInterface
} from '@/services/types';

import { brainStateService } from '@/services/brainState';
import { taskService } from '@/services/task';
import { authService } from '@/services/auth';

// Example store integration:
const useBrainStateStore = create<BrainStateStore>((set, get) => ({
  async recordBrainState(state: BrainStateInput) {
    const response = await brainStateService.createBrainState(state);
    if (response.success && response.data) {
      set({ currentState: response.data });
    }
    return response;
  }
}));
```

### **Verification Commands**
```bash
# Agent 2 runs before handoff:
npm run verify:agent2-handoff

# Agent 3 runs after receiving handoff:
npm run test:backend
npm run test:auth
npm run test:freemium
```

---

## 🎨 Handoff Protocol 3: Agent 4 → Agent 3

### **What Agent 4 Delivers**
**Deadline**: Week 2-3 (After Sprint 4H completion)

#### **Component Library**
```typescript
// File: src/components/index.ts
export interface BrainStateAdaptation {
  energyLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  adaptUI: boolean;
}

export interface BrainStateSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  adaptation: BrainStateAdaptation;
  disabled?: boolean;
}

export interface TaskCardProps {
  task: Task;
  adaptation: BrainStateAdaptation;
  onPress: () => void;
  onComplete: () => void;
  onBreakdown?: () => void;
}

export interface TaskListProps {
  tasks: Task[];
  adaptation: BrainStateAdaptation;
  callbacks: TaskListCallbacks;
}

export interface TaskListCallbacks {
  onTaskPress: (task: Task) => void;
  onTaskComplete: (taskId: string) => void;
  onTaskBreakdown: (taskId: string) => void;
  onCreateTask: () => void;
}
```

#### **Design System**
```typescript
// File: src/constants/designSystem.ts
export const COLORS = {
  PRIMARY: '#7FB3D3',
  SUCCESS: '#96CEB4', 
  WARNING: '#FFD93D',
  // NO RED COLORS (neurodivergent-friendly)
  BACKGROUND: '#FAFAFA',
  TEXT_PRIMARY: '#2C3E50',
  TEXT_SECONDARY: '#7F8C8D',
} as const;

export const SPACING = {
  XS: 4, SM: 8, MD: 16, LG: 24, XL: 32, XXL: 48
} as const;

export const TYPOGRAPHY = {
  SIZES: { LARGE: 24, MEDIUM: 18, BODY: 16, CAPTION: 14 },
  WEIGHTS: { BOLD: '700', SEMIBOLD: '600', REGULAR: '400' },
} as const;
```

#### **Freemium UI Components**
```typescript
// File: src/components/freemium/index.ts
export interface FreemiumGateProps {
  isEnabled: boolean;
  usageCount: number;
  usageLimit: number;
  onUpgrade: () => void;
  children: React.ReactNode;
}

export interface UpgradePromptProps {
  visible: boolean;
  feature: string;
  onUpgrade: () => void;
  onDismiss: () => void;
  gentle?: boolean; // Always use gentle language
}
```

### **Agent 4 Handoff Checklist**
- [ ] All components exported with proper TypeScript interfaces
- [ ] Design system prevents red color usage throughout
- [ ] All components meet 44px minimum touch target requirements
- [ ] Brain state adaptation system functional and tested
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Freemium UI components integrate with subscription system
- [ ] Component documentation and usage examples complete
- [ ] 95%+ test coverage across all components
- [ ] Sub-100ms render time performance benchmarks met
- [ ] All components use gentle, shame-free language

### **Agent 3 Integration Requirements**
```typescript
// Agent 3 must be able to import and use:
import {
  BrainStateSlider,
  TaskCard,
  TaskList,
  FreemiumGate,
  UpgradePrompt
} from '@/components';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/designSystem';

// Example screen replacement:
const BrainStateCheckinScreen: React.FC<ScreenProps<'BrainStateCheckin'>> = () => {
  const { currentState, recordBrainState } = useBrainStateStore();
  
  return (
    <BrainStateSlider
      value={currentState?.energy_level || 5}
      onValueChange={(value) => {
        recordBrainState({ energy_level: value, focus_level: 5, mood_level: 5 });
      }}
      adaptation={{ energyLevel: currentState?.energy_level || 5, adaptUI: true }}
    />
  );
};
```

### **Verification Commands**
```bash
# Agent 4 runs before handoff:
npm run verify:agent4-handoff

# Agent 3 runs after receiving handoff:
npm run test:components
npm run test:accessibility
npm run test:design-system
```

---

## 🔄 Handoff Protocol 4: Agent 2 → Agent 4

### **What Agent 2 Provides to Agent 4**
**Timing**: Week 2 (Parallel with Agent 4 development)

#### **Subscription Data Interface**
```typescript
// File: src/services/subscription.ts
export interface SubscriptionData {
  tier: 'free' | 'premium';
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  resetDate: Date;
  isOverQuota: boolean;
}

export interface FreemiumState {
  subscription: SubscriptionData;
  canUseAI: boolean;
  upgradeOptions: UpgradeOption[];
}
```

#### **Gentle Error Patterns**
```typescript
// File: src/utils/gentleErrors.ts
export const createGentleErrorMessage = (error: string): string => {
  return error
    .replace(/error|failed|invalid/gi, 'adjustment needed')
    .replace(/you must|you should/gi, 'when you\'re ready to')
    .replace(/!/g, ''); // Remove harsh punctuation
};
```

### **Agent 2→4 Handoff Checklist**
- [ ] `SubscriptionData` interface implemented and tested
- [ ] `FreemiumState` management functional
- [ ] Gentle error messaging patterns documented
- [ ] Quota checking APIs ready for UI integration
- [ ] Upgrade flow backend ready for UI implementation

---

## 🧪 Integration Testing Procedures

### **Cross-Agent Integration Tests**

#### **Test 1: Navigation + Store Integration**
```typescript
// File: src/__tests__/integration/navigation-store.test.ts
describe('Navigation + Store Integration', () => {
  test('Brain state check-in navigates and updates store', async () => {
    // Test Agent 1 navigation + Agent 3 store integration
  });
  
  test('Task list filtering works with brain state', async () => {
    // Test Agent 3 store + filtering logic
  });
});
```

#### **Test 2: Backend + UI Integration**
```typescript
// File: src/__tests__/integration/backend-ui.test.ts
describe('Backend + UI Integration', () => {
  test('Freemium gate displays correct quota status', async () => {
    // Test Agent 2 subscription service + Agent 4 UI components
  });
  
  test('Task creation flows from UI to database', async () => {
    // Test Agent 4 forms + Agent 2 CRUD services
  });
});
```

#### **Test 3: Complete User Flows**
```typescript
// File: src/__tests__/integration/user-flows.test.ts
describe('Complete User Flows', () => {
  test('New user signup to first brain state check-in', async () => {
    // Test all agents working together
  });
  
  test('AI task breakdown with quota enforcement', async () => {
    // Test freemium system end-to-end
  });
});
```

### **Integration Testing Commands**
```bash
# Run all integration tests
npm run test:cross-agent

# Test specific handoff points
npm run test:handoff:agent1-agent3
npm run test:handoff:agent2-agent3
npm run test:handoff:agent4-agent3
npm run test:handoff:agent2-agent4

# Test backward compatibility
npm run test:compatibility
```

---

## 🚨 Common Integration Issues & Solutions

### **Issue 1: Type Mismatches**
**Symptom**: TypeScript errors during agent integration
**Solution**: 
1. Verify all interfaces match exactly
2. Run `npm run type-check` after each handoff
3. Update shared type definitions immediately

### **Issue 2: Import Path Failures**
**Symptom**: Module not found errors
**Solution**:
1. Check `tsconfig.json` path aliases are correct
2. Verify all exports are properly declared
3. Use absolute imports with `@/` prefix

### **Issue 3: State Management Conflicts**
**Symptom**: Store not updating or conflicting states
**Solution**:
1. Verify store interfaces match service interfaces
2. Check async operations are properly handled
3. Test store integration with each service

### **Issue 4: Component Integration Failures**
**Symptom**: UI components not displaying correctly
**Solution**:
1. Verify component props match store data structure
2. Check brain state adaptation logic
3. Test component callbacks with actual store methods

---

## 📋 Integration Milestone Checklist

### **Week 1 Milestone: Foundation Ready**
- [ ] Agent 1 navigation framework complete and tested
- [ ] Agent 2 backend services functional and tested
- [ ] Both agents can work independently
- [ ] Integration interfaces defined and documented

### **Week 2 Milestone: Core Features + UI Development**
- [ ] Agent 3 store integration with Agent 1 & 2 working
- [ ] Agent 4 component development using Agent 2 data
- [ ] Cross-agent communication protocols working
- [ ] Basic user flows testable end-to-end

### **Week 3 Milestone: Complete Integration**
- [ ] All agents integrated and working together
- [ ] Complete user flows functional
- [ ] Integration tests passing
- [ ] Performance requirements met
- [ ] Ready for MVP deployment

---

## 🎯 Success Criteria

### **Technical Success**
- [ ] All handoff verification commands pass
- [ ] Integration tests achieve 90%+ pass rate
- [ ] TypeScript builds without errors across all agents
- [ ] Performance benchmarks met (30-second brain state check-in)
- [ ] No breaking changes between agent implementations

### **User Experience Success**
- [ ] Smooth user flows from onboarding to productivity
- [ ] Brain state adaptation works seamlessly
- [ ] Freemium features integrate without interruption
- [ ] Gentle, shame-free language maintained throughout
- [ ] Accessibility standards met across all components

---

**Follow these protocols religiously to ensure smooth agent coordination and prevent integration failures that could delay MVP delivery.**