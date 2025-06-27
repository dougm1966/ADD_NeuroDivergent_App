# 🏗️ Agent 1: Foundation Specialist

## Mission
Set up production-ready project infrastructure, navigation framework, and app shell with comprehensive error handling for neurodivergent productivity app.

## Domain Ownership
- **Primary**: Infrastructure, navigation, app configuration, error handling, testing setup
- **Branch**: `agent1/foundation`
- **Files You Own**: App.tsx, navigation/, app.json, package.json, error handling, testing configuration
- **Dependencies**: Must complete before Agents 2, 3 & 4 can integrate

## Critical Rules (NEVER VIOLATE)
1. Tech Stack: Expo React Native + TypeScript + Supabase ONLY
2. Navigation: React Navigation 6.1.17 ONLY
3. Follow COMMANDS.md setup sequence EXACTLY
4. No red colors anywhere (neurodivergent-friendly)
5. 44px minimum touch targets
6. Gentle, shame-free error messaging throughout
7. Production-ready error handling and testing

## 3-Sprint Development Plan

### Sprint 1A: Foundation Setup (Week 1, Day 1)
**Time**: 45-60 minutes | **Lines**: ~201 | **Focus**: Project initialization and structure

**Deliverables**:
- [ ] Working Expo project with TypeScript strict mode
- [ ] Exact dependency versions: Zustand 4.5.2, Supabase 2.39.3, React Navigation 6.1.17
- [ ] Complete folder structure: /src/components, /screens, /store, /services, /types, /utils, /constants, /navigation
- [ ] Environment variables setup (.env with Supabase placeholders)
- [ ] TypeScript configuration optimized for React Native
- [ ] Basic App.tsx with placeholder content

**Key Files**:
- Root App.tsx with initial structure
- Complete src/ folder organization
- .env template with required variables
- tsconfig.json with strict React Native settings

**Success Criteria**: `npx expo start` works, TypeScript compiles clean, folder structure ready

### Sprint 1B: Navigation Framework (Week 1, Day 2)
**Time**: 60-75 minutes | **Lines**: ~354 | **Focus**: Complete navigation system

**Deliverables**:
- [ ] Complete React Navigation 6.1.17 implementation
- [ ] Three working placeholder screens (BrainStateCheckin, TaskList, Settings)
- [ ] AppNavigator with stack navigation and TypeScript types
- [ ] useAppNavigation hook with typed methods for other agents
- [ ] Full navigation between screens with parameters
- [ ] Navigation persistence and deep linking configuration
- [ ] Interface contracts for cross-agent integration

**Key Features**:
- `RootStackParamList` with exact parameter definitions
- `ScreenProps<T>` generic for all screen components
- Production-ready navigation patterns
- Deep linking ready for Phase 2 features

**Success Criteria**: Navigation works between all screens, TypeScript types exported, other agents can integrate

### Sprint 1C: App Shell & Error Handling (Week 1, Day 3)
**Time**: 75-90 minutes | **Lines**: ~538 | **Focus**: Production-ready error handling and testing

**Deliverables**:
- [ ] ErrorBoundary component with neurodivergent-friendly messaging
- [ ] LoadingScreen component for app initialization
- [ ] useAppState hook for sophisticated app startup handling
- [ ] Complete testing infrastructure (Jest, React Native Testing Library)
- [ ] Production-ready App.tsx with comprehensive error handling
- [ ] Test files for all critical components and navigation
- [ ] Gentle error recovery patterns throughout

**Key Features**:
- Shame-free error messages ("Let's try that again" vs "Error occurred")
- Graceful offline handling
- App state management for initialization
- Comprehensive test coverage for foundation
- Production deployment readiness

**Success Criteria**: App handles errors gracefully, tests pass, ready for other agents' integration

## Service Architecture Overview

### Core Infrastructure Stack
```typescript
// Navigation & Error Handling
AppNavigator: Complete navigation with TypeScript types
useAppNavigation: Typed navigation methods for other agents
ErrorBoundary: Gentle, neurodivergent-friendly error handling
useAppState: App initialization and state management

// Testing Infrastructure
Jest + React Native Testing Library configuration
Test patterns for navigation, error handling, app boot
Foundation test coverage for cross-agent integration

// Project Structure
Complete folder organization ready for all agents
TypeScript configuration optimized for team development
Environment variable structure for backend integration
```

### Interface Contracts (For Other Agents)

#### Exact Navigation Types (src/types/navigation.ts)
```typescript
import { NavigationProp, RouteProp } from '@react-navigation/native';

// EXACT navigation parameter definitions for all agents
export type RootStackParamList = {
  // Phase 1 screens (implemented by Agent 3)
  BrainStateCheckin: undefined;
  TaskList: { 
    brainStateId?: string;
    showCompleted?: boolean;
  };
  Settings: {
    showUpgrade?: boolean;
    section?: 'notifications' | 'accessibility' | 'subscription';
  };
  
  // Phase 2 preparation (types ready for future implementation)
  Achievements?: { achievementId?: string; category?: 'brain_scientist' | 'task_master' };
  BodyDoubling?: { roomId?: string; mode?: 'join' | 'create' | 'schedule' };
  Notifications?: { notificationId?: string; markAsRead?: boolean };
  UserConnections?: { connectionId?: string; action?: 'accept' | 'decline' };
  CustomizationUnlock?: { customizationId: string; preview?: boolean };
};

// Screen component props for Agent 3
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// Navigation hook return type for Agent 3 & 4
export interface AppNavigationMethods {
  // Phase 1 navigation (ready now)
  goToBrainStateCheckin: () => void;
  goToTaskList: (params?: RootStackParamList['TaskList']) => void;
  goToSettings: (params?: RootStackParamList['Settings']) => void;
  goBack: () => void;
  getCurrentRoute: () => string | undefined;
  
  // Phase 2 navigation (type-safe stubs)
  goToAchievements?: (params?: RootStackParamList['Achievements']) => void;
  goToBodyDoubling?: (params?: RootStackParamList['BodyDoubling']) => void;
  goToNotifications?: (params?: RootStackParamList['Notifications']) => void;
  goToUserConnections?: (params?: RootStackParamList['UserConnections']) => void;
  goToCustomizationUnlock?: (params: RootStackParamList['CustomizationUnlock']) => void;
}
```

#### Error Handling Patterns (src/components/ErrorBoundary.tsx)
```typescript
// Gentle error handling for neurodivergent users
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

// Error message patterns other agents must use
export const GENTLE_ERROR_MESSAGES = {
  NETWORK_ERROR: "Let's try connecting again in a moment",
  VALIDATION_ERROR: "Let's adjust that just a bit",
  PERMISSION_ERROR: "We need permission to help you with that",
  GENERIC_ERROR: "Something unexpected happened, but we're on it",
  OFFLINE_ERROR: "We'll sync up when you're back online",
} as const;

// Error boundary interface for other agents
export interface ErrorRecoveryMethods {
  retryLastAction: () => void;
  goToSafeScreen: () => void;
  clearErrorState: () => void;
  reportError: (error: Error, context: string) => void;
}
```

#### App State Management (src/hooks/useAppState.ts)
```typescript
// App initialization state for other agents
export interface AppState {
  isLoading: boolean;
  isReady: boolean;
  hasError: boolean;
  errorMessage: string | null;
  initializationStep: 'starting' | 'loading_fonts' | 'checking_auth' | 'ready' | 'error';
}

// App state methods for other agents
export interface AppStateMethods {
  setLoadingState: (step: AppState['initializationStep']) => void;
  setError: (error: string) => void;
  clearError: () => void;
  markReady: () => void;
  retry: () => void;
}
```

#### Project Structure for Other Agents
```typescript
// Folder structure ready for all agents
src/
├── components/           // Agent 4 owns this folder
│   ├── index.ts         // Export pattern for components
│   └── types.ts         // Component type definitions
├── screens/             // Agent 3 owns this folder
│   ├── index.ts         // Screen exports
│   └── types.ts         // Screen-specific types
├── store/               // Agent 3 owns this folder (Zustand stores)
├── services/            // Agent 2 owns this folder (Supabase services)
├── types/               // Shared types across all agents
│   ├── navigation.ts    // Navigation types (Agent 1)
│   ├── database.ts      // Database types (Agent 2)
│   └── index.ts         // Common type exports
├── utils/               // Shared utilities across agents
├── constants/           // App constants (shared)
│   ├── colors.ts        // Color system (Agent 4)
│   ├── typography.ts    // Typography system (Agent 4)
│   ├── spacing.ts       // Spacing system (Agent 4)
│   └── config.ts        // App configuration (Agent 1)
└── navigation/          // Agent 1 owns this folder
    ├── AppNavigator.tsx
    ├── useAppNavigation.ts
    └── linking.ts
```

## Testing Infrastructure

### Comprehensive Testing Setup
Each sprint includes production-ready testing:

**Sprint 1A**: Basic Jest configuration and environment testing
**Sprint 1B**: Navigation testing patterns and type verification
**Sprint 1C**: Error boundary testing, app state testing, integration tests

### Required Test Patterns for Other Agents
```typescript
// App boot testing (Sprint 1C)
describe('App Boot Test', () => {
  test('should render without crashing', () => {
    // PASS CRITERIA: No exceptions thrown during render
  });
  test('should load in under 2 seconds', async () => {
    // PASS CRITERIA: App initialization completes within 2000ms
  });
});

// Navigation testing pattern for Agent 3
describe('Navigation Integration', () => {
  test('should navigate to all Phase 1 screens', () => {
    // PASS CRITERIA: BrainStateCheckin, TaskList, Settings accessible
  });
  test('should handle deep links correctly', () => {
    // PASS CRITERIA: neuroapp://tasks opens TaskList screen
  });
  test('should maintain navigation state on app restart', () => {
    // PASS CRITERIA: Navigation persistence works correctly
  });
});

// Error handling testing pattern for all agents
describe('Error Boundary Integration', () => {
  test('should display gentle error messages', () => {
    // PASS CRITERIA: No harsh technical language in user-facing errors
  });
  test('should provide error recovery options', () => {
    // PASS CRITERIA: Users can retry or navigate to safe screen
  });
});
```

### Test Requirements Before Handoff
```bash
# Foundation validation (all must pass)
npm test src/__tests__/App.test.tsx
npm test src/__tests__/navigation/AppNavigator.test.tsx  
npm test src/__tests__/components/ErrorBoundary.test.tsx
npm test src/__tests__/hooks/useAppState.test.tsx

# TypeScript compilation verification
npx tsc --noEmit
npm run type-check

# Integration testing for cross-agent compatibility
npm test src/__tests__/integration/agent-handoff.test.tsx
```

## Phase 2 Migration Readiness

### Migration-Safe Navigation Design
All navigation prepared for Phase 2 expansion without breaking changes:

**Phase 2.1 - Gamification**: Achievements and customization navigation ready
**Phase 2.2 - Body Doubling**: Room and session navigation types prepared
**Phase 2.3 - Advanced Notifications**: Notification navigation with deep linking

### Backward Compatibility Strategy
```typescript
// Phase 1 navigation methods (STABLE - never change)
export const useAppNavigation = (): AppNavigationMethods => {
  return {
    // Phase 1 core navigation (implemented now)
    goToBrainStateCheckin: () => navigation.navigate('BrainStateCheckin'),
    goToTaskList: (params) => navigation.navigate('TaskList', params),
    goToSettings: (params) => navigation.navigate('Settings', params),
    goBack: () => navigation.goBack(),
    getCurrentRoute: () => navigation.getCurrentRoute()?.name,
    
    // Phase 2 navigation stubs (type-safe, implement later)
    goToAchievements: (params) => {
      if (__DEV__) console.log('Phase 2 feature - Achievements navigation');
      // Implementation will be added in Phase 2 without breaking changes
    },
    goToBodyDoubling: (params) => {
      if (__DEV__) console.log('Phase 2 feature - Body doubling navigation');
    },
    // ... other Phase 2 methods
  };
};
```

### Deep Linking for Phase 2
```typescript
// Complete deep linking configuration ready for Phase 2 activation
export const linkingConfig = {
  prefixes: ['neuroapp://'],
  config: {
    screens: {
      // Phase 1 deep links (active now)
      BrainStateCheckin: 'checkin',
      TaskList: 'tasks',
      Settings: 'settings/:section?',
      
      // Phase 2 deep links (types ready, will activate in Phase 2)
      Achievements: 'achievements/:achievementId?/:category?',
      BodyDoubling: 'body-doubling/:roomId?/:mode?',
      Notifications: 'notifications/:notificationId?',
      UserConnections: 'connections/:connectionId?/:action?',
      CustomizationUnlock: 'unlock/:customizationId/:preview?',
    },
  },
};
```

## Production Readiness Features

### Error Handling for Neurodivergent Users
- **Gentle Error Messages**: No technical jargon, shame-free language
- **Error Recovery**: Always provide path forward, never dead ends
- **Offline Handling**: Graceful degradation with encouraging messaging
- **Loading States**: Clear feedback without overwhelming progress indicators

### Performance Optimization
- **App Startup**: < 2 seconds from launch to ready
- **Navigation**: Smooth transitions, no janky animations
- **Memory Management**: Proper cleanup of navigation state
- **TypeScript**: Optimized compilation for development speed

### Accessibility Foundation
- **Screen Reader**: Proper accessibility labels throughout
- **Touch Targets**: 44px minimum (neurodivergent-friendly)
- **Visual Hierarchy**: Clear navigation patterns
- **Error Communication**: Screen reader compatible error messages

## Handoff Points

### To Agent 2 (Backend)
**When Ready**: Foundation complete, navigation working, error handling tested
**Provides**: 
- Environment variables structure for Supabase integration
- TypeScript configuration for service development
- Error handling patterns for gentle API error display
- App shell ready for authentication integration

### To Agent 3 (Core Features)
**When Ready**: Navigation types stable, error boundaries active
**Provides**:
- `RootStackParamList` with exact parameter definitions for all screens
- `ScreenProps<T>` generic for type-safe screen components
- `useAppNavigation()` hook with navigation methods
- Error handling patterns for brain state and task management
- App state management for initialization coordination

**Agent 3 Must Use These Exact Interfaces**:
```typescript
// Screen component implementation pattern
interface BrainStateCheckinProps extends ScreenProps<'BrainStateCheckin'> {}
interface TaskListProps extends ScreenProps<'TaskList'> {}
interface SettingsProps extends ScreenProps<'Settings'> {}

// Navigation usage in screen components
const { goToTaskList, goToSettings } = useAppNavigation();
goToTaskList({ brainStateId: 'current', showCompleted: false });
```

### To Agent 4 (UI/UX)
**When Ready**: Component structure ready, error patterns established
**Provides**:
- `/src/constants/` folder structure for design system
- Component export pattern: `/src/components/index.ts`
- Error message standards for consistent UX
- Navigation-aware component props pattern
- Accessibility requirements and testing patterns

**Agent 4 Must Follow These Exact Patterns**:
```typescript
// Component export structure (src/components/index.ts)
export { GentleButton } from './GentleButton';
export { BrainStateSlider } from './BrainStateSlider';
export { TaskCard } from './TaskCard';
export type { GentleButtonProps, BrainStateSliderProps, TaskCardProps } from './types';

// Navigation-aware component props
interface BaseComponentProps {
  navigation?: AppNavigationMethods;
  testID?: string; // Required for testing
  errorBoundary?: ErrorRecoveryMethods;
}
```

## Success Criteria & Testing

### Must Pass Before Other Agents Can Start
- [ ] All 3 sprints completed successfully
- [ ] `npx expo start` works without errors on iOS and Android
- [ ] Navigation between all screens functional and tested
- [ ] TypeScript builds successfully with strict mode
- [ ] Error boundaries handle crashes gracefully with gentle messages
- [ ] Testing infrastructure ready for other agents
- [ ] App initialization handles edge cases (offline, slow network)
- [ ] Phase 2 navigation types ready but not breaking current functionality

### Performance Benchmarks
- App startup to ready state: < 2 seconds
- Navigation between screens: < 300ms transitions
- Error recovery to working state: < 1 second
- TypeScript compilation: < 30 seconds for clean build

### Cross-Agent Integration Verification
- Agent 2 can integrate Supabase services without navigation changes
- Agent 3 can implement screens using provided navigation types
- Agent 4 can create components using established patterns
- All agents can use error handling and testing infrastructure

## Common Mistakes to Avoid
- Don't install Redux (use Zustand per project requirements)
- Don't use styled-components (use StyleSheet per project constraints)
- Don't change the folder structure once established
- Don't skip error boundary implementation (critical for neurodivergent UX)
- Don't use technical error messages in user-facing components
- Don't change navigation types after handoff (breaks other agents)
- Don't skip testing setup (other agents depend on test patterns)

## Files Created by Agent 1

### Sprint 1A Files
- `App.tsx` (initial structure)
- `src/` folder structure (complete organization)
- `.env` template with Supabase placeholders
- `tsconfig.json` optimized for React Native
- `package.json` with exact dependency versions

### Sprint 1B Files
- `src/navigation/AppNavigator.tsx`
- `src/navigation/useAppNavigation.ts`
- `src/navigation/linking.ts`
- `src/types/navigation.ts`
- `src/screens/` placeholder components
- Interface contracts for other agents

### Sprint 1C Files
- `src/components/ErrorBoundary.tsx`
- `src/components/LoadingScreen.tsx`
- `src/hooks/useAppState.ts`
- `App.tsx` (production-ready with error handling)
- Complete testing infrastructure and configuration
- Test files for all critical components

---
**Agent 1 Focus**: Production-ready foundation with comprehensive error handling, testing, and cross-agent integration contracts. Build the infrastructure that enables other agents to develop safely and efficiently.