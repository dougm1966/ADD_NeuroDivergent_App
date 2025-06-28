# 🗺️ Dependencies Map - ADD NeuroDivergent App

## Overview
This document provides a comprehensive mapping of all inter-agent dependencies, data flow, and integration points for the ADD NeuroDivergent App development.

**Key Insight**: All agents flow into Agent 3 as the central integration hub.

---

## Agent Dependency Hierarchy

```
┌─────────────┐    ┌─────────────┐
│   Agent 1   │    │   Agent 2   │
│ Foundation  │    │  Backend    │
│             │    │             │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │                  │
       ▼                  ▼
┌─────────────────────────────────┐    ┌─────────────┐
│          Agent 3                │◄───┤   Agent 4   │
│      Core Features              │    │   UI/UX     │
│   (Integration Hub)             │    │             │
└─────────────────────────────────┘    └─────────────┘
```

**Critical Flow**: Agent 1 + Agent 2 + Agent 4 → Agent 3

---

## Detailed Dependency Analysis

### Agent 1 → Agent 3 Dependencies

#### What Agent 3 Needs from Agent 1
```typescript
// Navigation Types (EXACT INTERFACE REQUIRED)
export type RootStackParamList = {
  BrainStateCheckin: undefined;
  TaskList: { brainStateId?: string };
  Settings: { showUpgrade?: boolean };
  // More screens...
};

// Navigation Hook (MUST BE AVAILABLE)
export const useTypedNavigation = () => useNavigation<NavigationProp<RootStackParamList>>();
```

**Critical Files Agent 3 Imports**:
- `src/types/navigation.ts` - Navigation type definitions
- `src/navigation/types.ts` - Screen parameter interfaces  
- `src/utils/errorHandling.ts` - Error boundary patterns
- `src/constants/app.ts` - Global app constants

**Blocking Dependencies**:
- ❌ **Agent 3 cannot start** until Agent 1 Sprint 1B completes
- ❌ **Navigation integration fails** if types change after Agent 3 integration

#### What Agent 1 Provides
```typescript
// App Structure
src/
├── types/navigation.ts          (Agent 3 MUST import exactly)
├── navigation/AppNavigator.tsx  (Agent 3 screen registration)
├── utils/errorHandling.ts       (Agent 3 error patterns)
└── constants/app.ts             (Agent 3 configuration)
```

---

### Agent 2 → Agent 3 Dependencies

#### What Agent 3 Needs from Agent 2
```typescript
// Service Interfaces (EXACT TYPES REQUIRED)
export interface BrainStateService {
  createBrainState: (state: BrainStateInsert) => Promise<BrainStateResponse>;
  getTodaysState: () => Promise<BrainStateResponse>;
  // Must match exactly what Agent 3 expects
}

export interface TaskService {
  createTask: (task: TaskInsert) => Promise<TaskResponse>;
  getFilteredTasks: (maxComplexity: number) => Promise<TaskResponse>;
  completeTask: (taskId: string) => Promise<TaskResponse>;
  // Must match exactly what Agent 3 store expects
}

export interface SubscriptionService {
  checkQuota: (userId: string) => Promise<boolean>;
  getSubscriptionData: (userId: string) => Promise<SubscriptionData>;
  // Must match exactly for freemium integration
}
```

**Critical Files Agent 3 Imports**:
- `src/services/brainStateService.ts` - Brain state CRUD operations
- `src/services/taskService.ts` - Task management operations
- `src/services/subscriptionService.ts` - Freemium quota checking
- `src/services/openaiService.ts` - AI task breakdown (via Edge Functions)
- `src/types/database.ts` - Database type definitions

**Blocking Dependencies**:
- ❌ **Agent 3 stores fail** if service interfaces don't match exactly
- ❌ **Brain state adaptation breaks** if BrainState type changes
- ❌ **AI features fail** if Edge Functions not deployed
- ❌ **Freemium breaks** if subscription service interface changes

#### What Agent 2 Provides
```typescript
// Service Layer
src/services/
├── brainStateService.ts    (Agent 3 brain state store dependency)
├── taskService.ts          (Agent 3 task store dependency)  
├── subscriptionService.ts  (Agent 3 freemium integration)
├── openaiService.ts        (Agent 3 AI breakdown feature)
└── supabaseClient.ts       (Agent 3 authentication)

// Type Definitions
src/types/
└── database.ts             (Agent 3 MUST use these exact types)

// Infrastructure
supabase/functions/
└── openai-task-breakdown/  (Agent 3 AI features depend on this)
```

---

### Agent 4 → Agent 3 Dependencies

#### What Agent 3 Needs from Agent 4
```typescript
// UI Components (REPLACEMENT INTEGRATION)
export interface ComponentReplacements {
  // Agent 3 placeholder → Agent 4 replacement
  BrainStateCheckinForm: React.FC<BrainStateCheckinProps>;
  TaskCard: React.FC<TaskCardProps>;
  AIQuotaDisplay: React.FC<AIQuotaProps>;
  // Must maintain exact prop interfaces
}

// Adaptation System (CRITICAL INTEGRATION)
export interface AdaptiveTheme {
  spacing: { vertical: number; horizontal: number; touchTarget: number };
  typography: { lineHeight: number; fontSize: number };
  colors: { background: string; text: string; primary: string };
}

export const getAdaptiveTheme: (
  energyLevel: number, 
  focusLevel: number
) => AdaptiveTheme;
```

**Critical Files Agent 3 Imports**:
- `src/components/BrainStateCheckinForm.tsx` - Replaces Agent 3 placeholder
- `src/components/TaskCard.tsx` - Replaces Agent 3 placeholder
- `src/components/AIQuotaDisplay.tsx` - Freemium UI integration
- `src/constants/index.ts` - Design system with `getAdaptiveTheme()`

**Circular Dependency Risk**:
- ⚠️ Agent 3 creates brain state adaptation interfaces
- ⚠️ Agent 4 uses interfaces to create `getAdaptiveTheme()`
- ⚠️ Agent 3 uses `getAdaptiveTheme()` for UI adaptation
- 🔴 **RISK**: Circular dependency could create deadlock

#### What Agent 4 Provides
```typescript
// Component System
src/components/
├── BrainStateCheckinForm.tsx   (Agent 3 screen replacement)
├── TaskCard.tsx                (Agent 3 task display)
├── AIQuotaDisplay.tsx          (Agent 3 freemium UI)
└── index.ts                    (Agent 3 component imports)

// Design System
src/constants/
├── colors.ts                   (Agent 3 theme integration)
├── typography.ts               (Agent 3 adaptive text)
├── spacing.ts                  (Agent 3 adaptive layout)
└── index.ts                    (Agent 3 getAdaptiveTheme import)
```

---

### Agent 3 → Other Agents (Reverse Dependencies)

#### What Agent 3 Provides to Agent 4
```typescript
// Brain State Adaptation Requirements
export interface BrainStateAdaptation {
  uiLevel: 'low' | 'medium' | 'high';
  maxTaskComplexity: number;
  spacing: 'relaxed' | 'normal' | 'compact';
  encouragementTone: 'gentle' | 'standard' | 'energetic';
}

// Store State for Component Integration
export interface BrainStateStoreState {
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  getAdaptedUILevel: () => UIAdaptationLevel;
  getMaxTaskComplexity: () => number;
}
```

#### What Agent 3 Provides to Agent 1
```typescript
// Screen Component Registrations
export const BrainStateCheckinScreen: React.FC<ScreenProps<'BrainStateCheckin'>>;
export const TaskListScreen: React.FC<ScreenProps<'TaskList'>>;
export const SettingsScreen: React.FC<ScreenProps<'Settings'>>;
```

---

## Data Flow Architecture

### Brain State Data Flow
```
User Input → Agent 4 (BrainStateSlider) 
          → Agent 3 (Brain State Store) 
          → Agent 2 (Brain State Service) 
          → Supabase Database
          ↓
Database → Agent 2 (Service Response)
        → Agent 3 (Store Update)
        → Agent 4 (UI Adaptation)
```

### Task Management Data Flow
```
Task Creation → Agent 4 (Form Components)
             → Agent 3 (Task Store)
             → Agent 2 (Task Service)
             → Supabase Database

Task Filtering ← Agent 3 (Brain State Logic)
              ← Agent 2 (Database Query)
              ← Agent 4 (UI Display)
```

### AI Breakdown Data Flow
```
AI Request → Agent 4 (Button Press)
          → Agent 3 (Quota Check via Agent 2)
          → Agent 2 (OpenAI Service)
          → Supabase Edge Function
          → OpenAI API
          ↓
AI Response ← Agent 2 (Service Response)
           ← Agent 3 (Store Update)
           ← Agent 4 (UI Display)
```

---

## Critical Integration Points

### 1. TypeScript Interface Matching
**Risk**: Type mismatches between agents cause compilation failures.

**Required Exact Matches**:
```typescript
// Agent 2 Database Types → Agent 3 Store Types → Agent 4 Component Props
Database['public']['Tables']['brain_states']['Row'] 
  === BrainStateStoreState.currentState type
  === BrainStateCheckinFormProps.initialState type
```

### 2. Brain State Adaptation Chain
**Risk**: Changes to adaptation logic break UI components.

**Required Interface Stability**:
```typescript
// MUST NEVER CHANGE after Agent 4 integration
interface BrainStateAdaptation {
  uiLevel: 'low' | 'medium' | 'high';     // UI complexity level
  spacing: 'relaxed' | 'normal' | 'compact'; // Layout spacing
  // Lock these interfaces early!
}
```

### 3. Service Integration Contracts
**Risk**: Service interface changes break store integration.

**Required Service Stability**:
```typescript
// Agent 2 services MUST maintain these exact signatures
brainStateService.createBrainState(state: BrainStateInsert): Promise<BrainStateResponse>
taskService.getFilteredTasks(maxComplexity: number): Promise<TaskResponse>
subscriptionService.checkQuota(userId: string): Promise<boolean>
```

---

## Dependency Resolution Strategy

### Phase 1: Foundation Dependencies (Week 1)
```
Day 1: Agent 1 Sprint 1A (Project structure)
    ↓ BLOCKS ALL OTHER WORK
Day 2: Agent 1 Sprint 1B (Navigation types) + Agent 2 Sprint 2A-2B (Services)
    ↓ UNBLOCKS Agent 3
Day 3: Agent 2 Sprint 2C-2D (Auth + Brain State Service)
```

### Phase 2: Core Integration (Week 2)
```
Day 1: Agent 3 Sprint 3A (Brain State Store) + Agent 4 Sprint 4A (Design System)
    ↓ CAN RUN IN PARALLEL
Day 2: Agent 3 Sprint 3B (Adaptation Logic) → Agent 4 Sprint 4B (Components)
    ↓ SEQUENTIAL DEPENDENCY
Day 3: Agent 4 Sprint 4C-4D (Complete Components)
```

### Phase 3: Final Integration (Week 3)
```
Day 1: Agent 4 Sprint 4F-4G (Testing + Integration)
Day 2: Agent 3 Component Replacement (Agent 4 → Agent 3)
Day 3: Full Integration Testing
```

---

## Dependency Validation Checklist

### Before Agent 3 Can Start:
- [ ] Agent 1 navigation types available in `src/types/navigation.ts`
- [ ] Agent 2 services deployed and tested
- [ ] Supabase Edge Functions operational
- [ ] Database schema with all tables and RLS policies

### Before Agent 4 Integration:
- [ ] Agent 3 brain state adaptation interfaces locked
- [ ] Agent 3 stores functional and tested
- [ ] Agent 3 placeholder components ready for replacement

### Before Final Integration:
- [ ] All TypeScript interfaces validated
- [ ] Cross-agent integration tests passing
- [ ] Performance benchmarks met
- [ ] Dependency contracts verified

---

## Emergency Dependency Resolution

### If Agent 1 Blocks Development:
- **Solution**: Use minimal navigation setup to unblock Agent 3
- **Risk**: May require rework when full navigation ready

### If Agent 2 Services Fail:
- **Solution**: Create mock services for Agent 3 development
- **Risk**: Integration issues when real services ready

### If Circular Dependencies Cause Issues:
- **Solution**: Break cycle with interface-first development
- **Process**: Define interfaces → Create mocks → Implement separately

---

## Dependency Success Metrics

### Technical Validation:
- ✅ TypeScript compilation with 0 errors across all agents
- ✅ All imports resolve correctly between agents
- ✅ No circular dependency warnings
- ✅ All service integrations tested

### Integration Validation:
- ✅ Agent 3 stores integrate with Agent 2 services
- ✅ Agent 4 components integrate with Agent 3 stores
- ✅ Agent 1 navigation works with Agent 3 screens
- ✅ Data flows correctly through entire system

### Performance Validation:
- ✅ Brain state updates propagate within 100ms
- ✅ UI adaptation completes within 50ms
- ✅ Service calls complete within 2 seconds
- ✅ No memory leaks in agent integrations

---

**Status**: Dependencies Mapped - Ready for Critical Path Analysis
**Last Updated**: 2025-06-28
**Next Action**: Review CRITICAL_PATH.md for implementation sequence