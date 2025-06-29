# 🗄️ Agent 2: Backend Integration Specialist

## Mission
Set up Supabase backend, database schema, authentication, and freemium subscription management through 6 focused sprints.

## Domain Ownership
- **Primary**: Database, authentication, API services, subscription management
- **Branch**: `agent2/backend`
- **Files You Own**: src/services/, database schema, authentication logic
- **Dependencies**: Needs Agent 1's env setup and app structure

## Critical Rules (NEVER VIOLATE)
1. Database: Supabase PostgreSQL ONLY
2. Authentication: Supabase Auth ONLY
3. Use EXACT schema from ARCHITECTURE.md
4. Implement Row Level Security on ALL tables
5. Freemium: Free users get 10 AI requests/month, Premium gets 100+
6. Sprint Size: Each sprint 250-400 lines maximum (testable, focused)

## 6-Sprint Development Plan

### Sprint 2A: Supabase Foundation (Week 1, Day 1)
**Time**: 30-45 minutes | **Lines**: ~263 | **Focus**: Project setup and connection

**Deliverables**:
- [ ] Supabase project created: "neurodivergent-productivity-app"
- [ ] Environment variables configured (URL, anon key, OpenAI key)
- [ ] Supabase client created with proper auth configuration
- [ ] Connection test utilities working
- [ ] Basic service types defined
- [ ] TypeScript compilation successful

**Key Files**:
- `src/services/supabaseClient.ts`
- `src/services/__tests__/connectionTest.ts`
- `src/types/supabase.ts`
- Updated `.env` with real credentials

**Success Criteria**: Connection test passes, no placeholders in env vars

### Sprint 2B: Database Schema (Week 1, Day 2)
**Time**: 45-60 minutes | **Lines**: ~461 | **Focus**: Complete database foundation

**Deliverables**:
- [ ] All 3 tables created with EXACT field names from ARCHITECTURE.md
- [ ] Brain states table: energy/focus/mood levels (1-10 constraints)
- [ ] Tasks table: complexity levels (1-5 constraints), JSONB ai_breakdown
- [ ] User subscriptions table: freemium tier management
- [ ] RLS enabled on ALL tables
- [ ] All RLS policies implemented (user data isolation)
- [ ] Performance indexes for filtering queries

**Key SQL**:
- UUID extensions enabled
- CHECK constraints for all level validations
- Complete RLS policy set for security
- Optimized indexes for brain state and task filtering

**Success Criteria**: Schema validation tests pass, constraints reject invalid data

### Sprint 2C: Authentication Service (Week 1, Day 3)
**Time**: 45-60 minutes | **Lines**: ~776 | **Focus**: Complete auth with session management

**Deliverables**:
- [ ] Authentication service with gentle error handling
- [ ] User session management with subscription initialization
- [ ] Basic subscription service with auto-initialization
- [ ] React authentication hook for components
- [ ] Database trigger for automatic subscription creation
- [ ] Secure token handling and session persistence

**Key Features**:
- Gentle error messages (no technical jargon)
- Auto-subscription creation on signup
- Session validation and cleanup
- Auth state change listeners

**Success Criteria**: Signup creates user + subscription atomically, auth state persists

### Sprint 2D: Brain State CRUD (Week 1, Day 4)
**Time**: 45-60 minutes | **Lines**: ~796 | **Focus**: Brain state management with offline support

**Deliverables**:
- [ ] Complete brain state CRUD operations
- [ ] 1-10 validation for energy, focus, mood levels
- [ ] Offline caching with AsyncStorage
- [ ] Brain state utilities for adaptive features
- [ ] React hook for brain state management
- [ ] Today's brain state retrieval optimization

**Key Features**:
- Complexity filtering logic based on energy levels
- Encouraging messages based on brain state
- UI complexity recommendations
- Offline fallback functionality

**Success Criteria**: Brain state drives task filtering, offline caching works

### Sprint 2E: Task Management CRUD (Week 1, Day 5)
**Time**: 45-60 minutes | **Lines**: ~643 | **Focus**: Task operations with brain state integration

**Deliverables**:
- [ ] Complete task CRUD operations
- [ ] Task complexity filtering (1-5 levels)
- [ ] Brain state adaptive task retrieval
- [ ] AI breakdown JSONB storage
- [ ] React hook for task management
- [ ] Offline task caching

**Key Features**:
- Tasks filtered by current brain state energy level
- Complexity validation and constraints
- Gentle error handling throughout
- Integration with brain state service

**Success Criteria**: Tasks filter appropriately based on brain state, validation enforced

### Sprint 2F: Freemium & AI Integration (Week 2, Day 1)
**Time**: 60-75 minutes | **Lines**: ~400 | **Focus**: Complete freemium system

**Deliverables**:
- [ ] Enhanced subscription service with quota management
- [ ] OpenAI service with brain state adapted prompts
- [ ] AI request quota enforcement (10 free, 100+ premium)
- [ ] Gentle upgrade prompts (no aggressive upselling)
- [ ] Database functions for atomic quota operations
- [ ] React hooks for freemium and AI features

**Key Features**:
- Strict quota enforcement with graceful messaging
- Brain state adapted AI prompts (low/medium/high energy)
- Offline fallback task breakdowns
- Premium upgrade functionality

**Success Criteria**: Quotas strictly enforced, AI adapts to brain state, gentle upgrade prompts

## Service Architecture Overview

### Core Service Stack
```typescript
// Authentication & Session Management
authService: SignUp/SignIn/SignOut with gentle errors
userSessionService: Session persistence and validation
subscriptionService: Freemium quota management

// Data Services
brainStateService: CRUD + adaptive utilities + caching
taskService: CRUD + complexity filtering + brain state integration
openaiService: AI breakdown with brain state adaptation

// Support Services
connectionTest: Supabase connectivity validation
schemaValidation: Database constraint verification
```

### Interface Contracts (For Agent 3 & 4)

#### Exact Type Definitions
```typescript
// EXACT database interfaces - DO NOT MODIFY
export interface BrainState {
  id?: string;
  user_id?: string;
  energy_level: number; // MUST be 1-10
  focus_level: number; // MUST be 1-10
  mood_level: number; // MUST be 1-10
  notes?: string; // Max 500 characters
  created_at?: string;
}

export interface Task {
  id?: string;
  user_id?: string;
  title: string; // Max 255 characters, required
  description?: string;
  complexity_level: number; // MUST be 1-5
  estimated_minutes?: number;
  is_completed: boolean;
  ai_breakdown?: {
    steps: TaskBreakdownStep[];
    totalTimeEstimate: number;
    brainStateAdapted: boolean;
    encouragementMessage: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface QuotaStatus {
  used: number;
  limit: number;
  tier: 'free' | 'premium';
  canMakeRequest: boolean;
  daysUntilReset: number;
}

// Standardized response format for all services
export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
}
```

#### Service Interfaces for Agent 3
```typescript
// Brain State Service
export interface BrainStateServiceInterface {
  createBrainState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<ServiceResponse<BrainState>>;
  getTodaysBrainState: () => Promise<ServiceResponse<BrainState>>;
  getBrainStateHistory: (limit?: number) => Promise<ServiceResponse<BrainState[]>>;
  getComplexityFilterLevel: (state: BrainState) => number; // For task filtering
  validateBrainState: (state: Partial<BrainState>) => { isValid: boolean; message?: string };
}

// Task Service
export interface TaskServiceInterface {
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<ServiceResponse<Task>>;
  getAdaptiveTasks: (includeCompleted?: boolean) => Promise<ServiceResponse<Task[]>>;
  getFilteredTasks: (maxComplexity: number, includeCompleted?: boolean) => Promise<ServiceResponse<Task[]>>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<ServiceResponse<Task>>;
  completeTask: (taskId: string) => Promise<ServiceResponse<Task>>;
  validateTask: (task: Partial<Task>) => { isValid: boolean; message?: string };
}

// Subscription Service
export interface SubscriptionServiceInterface {
  getQuotaStatus: () => Promise<ServiceResponse<QuotaStatus>>;
  canMakeAIRequest: () => Promise<{ allowed: boolean; message?: string; quotaStatus?: QuotaStatus }>;
  incrementAIUsage: () => Promise<{ error: string | null }>;
  upgradeToPremium: () => Promise<ServiceResponse<UserSubscription>>;
}

// AI Service
export interface AIServiceInterface {
  generateTaskBreakdown: (request: TaskBreakdownRequest) => Promise<ServiceResponse<TaskBreakdown>>;
  generateFallbackBreakdown: (request: TaskBreakdownRequest) => TaskBreakdown;
}
```

#### React Hooks for Agent 4
```typescript
// Authentication Hook
export const useAuth: () => {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

// Brain State Hook
export const useBrainState: () => {
  todaysBrainState: BrainState | null;
  loading: boolean;
  error: string | null;
  createBrainState: (state: Omit<BrainState, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  refreshTodaysBrainState: () => Promise<void>;
};

// Task Management Hook
export const useTasks: () => {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<boolean>;
  completeTask: (taskId: string) => Promise<boolean>;
  refreshTasks: () => Promise<void>;
};

// Freemium Hook
export const useFreemium: () => {
  quotaStatus: QuotaStatus | null;
  loading: boolean;
  error: string | null;
  upgradeToPremium: () => Promise<boolean>;
  checkQuota: () => Promise<void>;
};

// AI Breakdown Hook
export const useAIBreakdown: () => {
  breakdown: TaskBreakdown | null;
  loading: boolean;
  error: string | null;
  quotaUsed: boolean;
  generateBreakdown: (request: TaskBreakdownRequest) => Promise<boolean>;
  generateFallbackBreakdown: (request: TaskBreakdownRequest) => void;
};
```

## Testing Requirements

### Sprint-Specific Tests
Each sprint includes comprehensive test files:

**Sprint 2A**: Connection and environment validation
**Sprint 2B**: Schema constraints and RLS policy verification  
**Sprint 2C**: Authentication flows and subscription initialization
**Sprint 2D**: Brain state CRUD operations and offline caching
**Sprint 2E**: Task management and complexity filtering
**Sprint 2F**: Freemium quota enforcement and AI integration

### Critical Test Scenarios
- **Free user hitting 10 AI request limit**: `canMakeAIRequest()` returns `{ allowed: false }`
- **Premium user unlimited access**: Always returns `{ allowed: true }` for premium tier
- **Monthly quota reset**: `ai_requests_used` resets to 0 when `reset_date < NOW()`
- **RLS policy enforcement**: Users cannot access other users' data
- **Brain state validation**: Energy/focus/mood levels outside 1-10 range rejected
- **Task complexity validation**: Complexity levels outside 1-5 range rejected
- **Offline functionality**: Services gracefully handle network errors
- **Gentle error messaging**: All user-facing errors use encouraging language

### Integration Test Requirements
```bash
# Required test commands before handoff
npm test src/services/__tests__/connectionTest.ts
npm test src/services/__tests__/schemaValidation.ts
npm test src/services/__tests__/authService.test.ts
npm test src/services/__tests__/brainStateService.test.ts
npm test src/services/__tests__/taskService.test.ts
npm test src/services/__tests__/freemiumIntegration.test.ts

# TypeScript compilation verification
npx tsc --noEmit src/services/*.ts
npx tsc --noEmit src/hooks/*.ts
npx tsc --noEmit src/types/*.ts
```

## Phase 2 Migration Readiness

### Migration-Safe Design
All services designed for Phase 2 extension without breaking changes:

**Phase 2.1 - Gamification**: Add achievement tracking columns with DEFAULT values
**Phase 2.2 - Body Doubling**: Add new tables for rooms and sessions
**Phase 2.3 - Advanced Notifications**: Extend notification preferences

### Backward Compatibility Guarantee
- Phase 1 APIs remain unchanged during Phase 2 migration
- All new Phase 2 columns have safe DEFAULT values
- Existing service interfaces stable for Agent 3 integration
- Migration scripts are additive-only (no breaking changes)

## Success Criteria & Handoff

### Must Pass Before Agent 3 Integration
- [ ] All 6 sprints completed successfully
- [ ] 100% test coverage for critical paths
- [ ] Schema constraints enforced (validated with invalid data)
- [ ] RLS policies preventing cross-user access
- [ ] Freemium quotas strictly enforced
- [ ] Brain state drives task complexity filtering
- [ ] Offline functionality works with cached data
- [ ] All services return consistent `ServiceResponse<T>` format
- [ ] Gentle error messages throughout
- [ ] TypeScript compilation clean

### Performance Benchmarks
- Database queries < 500ms average response time
- Brain state check-in < 30 seconds total time
- Task list load < 1 second
- AI breakdown generation < 5 seconds
- App startup with auth check < 2 seconds

### Security Verification
- RLS policies tested with cross-user attempts
- No API keys exposed in client code
- Auth tokens stored securely with AsyncStorage
- Database constraints prevent invalid data
- Gentle error messages don't expose system details

## Common Mistakes to Avoid
- Don't skip RLS policies (major security risk)
- Don't use different field names than ARCHITECTURE.md specifies
- Don't forget subscription initialization on user signup
- Don't make OpenAI calls without quota verification
- Don't expose sensitive API keys in client code
- Don't use technical error messages in user interfaces
- Don't create sprints longer than 400 lines
- Don't skip test files for any sprint

## Files Created by Agent 2

### Sprint 2A Files
- `src/services/supabaseClient.ts`
- `src/services/__tests__/connectionTest.ts`
- `src/types/supabase.ts`

### Sprint 2B Files
- `src/types/database.ts`
- `src/services/__tests__/schemaValidation.ts`
- Complete database schema in Supabase

### Sprint 2C Files
- `src/services/authService.ts`
- `src/services/subscriptionService.ts`
- `src/services/userSessionService.ts`
- `src/hooks/useAuth.ts`
- `src/services/__tests__/authService.test.ts`

### Sprint 2D Files
- `src/services/brainStateService.ts`
- `src/utils/brainStateUtils.ts`
- `src/hooks/useBrainState.ts`
- `src/services/__tests__/brainStateService.test.ts`

### Sprint 2E Files
- `src/services/taskService.ts`
- `src/hooks/useTasks.ts`
- `src/services/__tests__/taskService.test.ts`

### Sprint 2F Files
- `src/services/subscriptionService.ts` (enhanced)
- `src/services/openaiService.ts`
- `src/hooks/useFreemium.ts`
- `src/hooks/useAIBreakdown.ts`
- `src/services/__tests__/freemiumIntegration.test.ts`

---
**Agent 2 Focus**: Secure, scalable backend foundation that enables the neurodivergent-first app experience through proper data management and gentle freemium controls.