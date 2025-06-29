# 🧪 Testing Strategy & Documentation

## Testing Philosophy
Every feature must be testable and backward compatible to ensure neurodivergent users never lose functionality they depend on.

## Testing Framework Setup

### Required Dependencies
```bash
# Unit & Integration Testing
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Mocking & Utilities  
npm install --save-dev jest-expo @react-native-async-storage/async-storage

# E2E Testing (Future)
npm install --save-dev detox
```

### Test Scripts (package.json)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "type-check": "npx tsc --noEmit",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "test:all": "npm run type-check && npm run lint && npm run test",
    
    "test:foundation": "jest __tests__/foundation --passWithNoTests",
    "test:backend": "jest __tests__/services --passWithNoTests",
    "test:brain-state": "jest __tests__/store --passWithNoTests",
    "test:components": "jest __tests__/components --passWithNoTests",
    "test:accessibility": "jest __tests__/accessibility --passWithNoTests",
    "test:integration": "jest __tests__/integration --passWithNoTests",
    "test:performance": "jest __tests__/performance --passWithNoTests",
    "test:compatibility": "jest __tests__/migration --passWithNoTests",
    
    "test:agent1": "npm run test:foundation && npm run test:integration:agent1",
    "test:agent2": "npm run test:backend && npm run test:integration:agent2",
    "test:agent3": "npm run test:brain-state && npm run test:integration:agent3",
    "test:agent4": "npm run test:components && npm run test:integration:agent4",
    
    "test:integration:agent1": "jest __tests__/integration/agent1 --passWithNoTests",
    "test:integration:agent2": "jest __tests__/integration/agent2 --passWithNoTests",
    "test:integration:agent3": "jest __tests__/integration/agent3 --passWithNoTests",
    "test:integration:agent4": "jest __tests__/integration/agent4 --passWithNoTests",
    
    "test:cross-agent": "jest __tests__/integration/cross-agent-compatibility.test.ts",
    "test:phase2-migration": "jest __tests__/migration --passWithNoTests"
  }
}
```

## Sprint-Based Testing Strategy

### Sprint Completion Testing Requirements
**Critical Requirement**: Each sprint must pass specific tests before considered complete, and agents must test integration points before handoff.

### Agent 1: Foundation Specialist Sprint Tests

#### Sprint 1A: Foundation Setup Tests
```bash
# Must pass before Sprint 1B begins
npm run test:expo-setup              # Expo project initializes correctly
npm run verify:folder-structure      # src/ folders created properly  
npm run test:typescript-config       # TypeScript compilation works
npm run verify:dependencies          # All exact versions installed
```

**Pass Criteria**:
- [ ] `npx expo start` works without errors
- [ ] TypeScript compiles with strict mode
- [ ] All required folders exist with proper structure
- [ ] Exact dependency versions verified (Zustand 4.5.2, Supabase 2.39.3, Navigation 6.1.17)

#### Sprint 1B: Navigation Framework Tests
```bash
# Must pass before Sprint 1C begins
npm run test:navigation-setup        # React Navigation 6.1.17 configured
npm run test:screen-routing          # All placeholder screens accessible
npm run verify:navigation-types      # TypeScript navigation types compile
npm run test:deep-linking            # Deep linking configuration ready
```

**Pass Criteria**:
- [ ] Navigation between all screens functional
- [ ] `RootStackParamList` with exact parameter definitions complete
- [ ] `ScreenProps<T>` generic ready for Agent 3
- [ ] `useAppNavigation()` hook provides typed methods

#### Sprint 1C: App Shell & Error Handling Tests
```bash
# Must pass before Agent 1 → Agent 3 handoff
npm run test:error-boundary          # Gentle error handling works
npm run test:app-state-management    # App initialization reliable
npm run test:testing-infrastructure  # Complete testing setup ready
npm run verify:production-readiness  # App ready for production deployment
```

**Pass Criteria**:
- [ ] Error boundaries handle crashes gracefully with neurodivergent-friendly messages
- [ ] App initialization < 2 seconds
- [ ] Testing infrastructure ready for other agents
- [ ] Production-ready error recovery patterns

### Agent 2: Backend Integration Specialist Sprint Tests

#### Sprint 2A: Supabase Foundation Tests  
```bash
# Must pass before Sprint 2B begins
npm run test:supabase-connection     # Connection to Supabase working
npm run verify:environment-vars     # All required env vars configured  
npm run test:client-initialization  # Supabase client setup correct
```

**Pass Criteria**:
- [ ] Supabase project created and accessible
- [ ] Environment variables structure ready for other agents
- [ ] Connection test passes consistently

#### Sprint 2B: Database Schema Tests
```bash
# Must pass before Sprint 2C begins
npm run test:schema-deployment       # All 3 tables created correctly
npm run verify:rls-policies          # Row Level Security enforced
npm run test:data-constraints        # All 1-10 and 1-5 validations work
npm run verify:performance-indexes   # Optimized indexes created
```

**Pass Criteria**:
- [ ] Brain states table with energy/focus/mood constraints (1-10)
- [ ] Tasks table with complexity constraints (1-5) 
- [ ] User subscriptions table with freemium tier management
- [ ] RLS policies prevent cross-user data access
- [ ] Performance indexes for brain state and task filtering

#### Sprint 2C: Authentication Service Tests
```bash
# Must pass before Sprint 2D begins
npm run test:user-signup             # Complete signup flow with subscription
npm run test:authentication-flow    # Sign in/out with gentle errors
npm run verify:session-management   # Token handling and persistence
npm run test:subscription-init      # Auto-subscription creation
```

**Pass Criteria**:
- [ ] User signup creates user + subscription atomically
- [ ] Authentication state persists correctly
- [ ] Gentle error messages (no technical jargon)
- [ ] Session validation and cleanup working

#### Sprint 2D-2E: CRUD Services Tests
```bash
# Must pass before Sprint 2F begins
npm run test:brain-state-crud        # Complete brain state operations
npm run test:task-crud               # Task management with complexity filtering
npm run verify:offline-caching      # AsyncStorage fallback working
npm run test:brain-state-adaptation # Complexity filtering logic
```

**Pass Criteria**:
- [ ] Brain state CRUD with 1-10 validation
- [ ] Task filtering based on brain state energy levels
- [ ] Offline caching with AsyncStorage works
- [ ] Brain state drives task complexity filtering

#### Sprint 2F: Freemium & AI Integration Tests
```bash
# Must pass before Agent 2 → Agent 3 handoff
npm run test:quota-enforcement       # 10 free/100+ premium strictly enforced
npm run test:openai-integration      # AI service with brain state adaptation
npm run verify:upgrade-flow          # Gentle premium upgrade functionality
npm run test:monthly-reset           # Quota reset automation
```

**Pass Criteria**:
- [ ] Free users limited to 10 AI requests/month
- [ ] Premium users get 100+ requests
- [ ] AI prompts adapt to brain state (low/medium/high energy)
- [ ] Gentle upgrade prompts (no aggressive upselling)

### Agent 3: Core Feature Developer Tests

#### Brain State System Tests
```bash
# Must pass for Agent 3 Phase 1 completion
npm run test:brain-state-store       # Zustand store with offline sync
npm run test:30-second-checkin       # Performance requirement met
npm run verify:ui-adaptation         # low/medium/high energy adaptation
npm run test:task-complexity-filter  # Energy level drives task filtering
```

**Pass Criteria**:
- [ ] Brain state check-in completes in under 30 seconds
- [ ] UI adapts to brain state (low/medium/high energy levels)
- [ ] Task filtering works: energy 1-3 shows complexity 1-2, energy 7-10 shows all
- [ ] Offline storage with AsyncStorage functional

#### Task Management System Tests
```bash
# Must pass for Agent 3 Phase 2 completion  
npm run test:task-store              # Zustand task store with adaptive filtering
npm run test:ai-quota-integration    # AI requests respect subscription limits
npm run verify:gentle-errors         # All error messages shame-free
npm run test:offline-sync            # Task data syncs when online
```

**Pass Criteria**:
- [ ] Tasks filter appropriately based on brain state
- [ ] AI breakdown respects subscription quotas
- [ ] Gentle error handling throughout ("Let's try that again")
- [ ] Store integration with backend services complete

### Agent 4: UI/UX Component Builder Sprint Tests

#### Sprint 4A: Design System Foundation Tests
```bash
# Must pass before Sprint 4B begins
npm run test:no-red-colors           # Automated red color detection
npm run verify:neurodivergent-palette # Color system validation
npm run test:adaptive-typography     # Typography responds to brain state
npm run verify:accessibility-constants # WCAG 2.1 AA compliance built-in
```

**Pass Criteria**:
- [ ] Design system prevents red color usage throughout
- [ ] Neurodivergent-friendly color palette complete
- [ ] Adaptive typography system functional
- [ ] 8px grid spacing system with touch target standards

#### Sprint 4B: Base Interactive Components Tests
```bash
# Must pass before Sprint 4C begins
npm run test:gentle-button           # Brain state adaptation + 44px targets
npm run test:brain-state-slider     # 1-10 scale with visual feedback
npm run test:gentle-text-input      # Form input with gentle error handling
npm run verify:component-adaptation # Brain state integration working
```

**Pass Criteria**:
- [ ] All components meet 44px minimum touch targets
- [ ] Components adapt to brain state automatically
- [ ] Accessibility labels and screen reader support
- [ ] Integration interfaces ready for Agent 3

#### Sprint 4C-4E: Complete UI Component Tests
```bash
# Must pass before Sprint 4F begins
npm run test:brain-state-checkin-ui # Complete check-in experience
npm run test:task-display-components # Task cards with complexity matching
npm run test:freemium-ui             # Gentle upgrade prompts
npm run verify:agent2-integration   # Subscription system integration
```

**Pass Criteria**:
- [ ] Brain state check-in UI encourages daily use
- [ ] Task complexity indicators work with Agent 3 filtering
- [ ] AI breakdown display integrates with Agent 2 services
- [ ] Freemium UI is gentle, never blocks core features

#### Sprint 4F: Accessibility & Adaptation Tests
```bash
# Must pass before Sprint 4G begins
npm run test:wcag-compliance         # WCAG 2.1 AA automated verification
npm run test:screen-reader           # Screen reader compatibility
npm run test:reduced-motion          # Respects system accessibility preferences
npm run verify:sensory-customization # Comprehensive accessibility controls
```

**Pass Criteria**:
- [ ] WCAG 2.1 AA compliance verified
- [ ] Screen reader support comprehensive
- [ ] High contrast and reduced motion support
- [ ] Sensory customization provider functional

#### Sprint 4G: Component Integration Tests
```bash
# Must pass before Sprint 4H begins
npm run test:component-integration   # All components work together
npm run test:performance-benchmarks  # Sub-100ms render times
npm run verify:cross-agent-integration # Agent handoff validation
npm run test:95-percent-coverage     # Test coverage requirement met
```

**Pass Criteria**:
- [ ] 95%+ test coverage across all components
- [ ] Sub-100ms render time performance benchmarks met
- [ ] Cross-agent integration points verified
- [ ] User flow testing for complete app scenarios

#### Sprint 4H: Agent Integration Handoff Tests
```bash
# Must pass for Agent 4 completion
npm run verify:integration-api       # Documentation complete and accurate
npm run test:migration-compatibility # Seamless integration verified
npm run verify:component-export      # All export interfaces working
npm run test:handoff-verification    # Integration verification scripts pass
```

**Pass Criteria**:
- [ ] Complete integration API documentation
- [ ] Other agents can integrate seamlessly
- [ ] Component documentation generator working
- [ ] Verification tools validate integration

## Multi-Agent Testing Strategy

### Integration Testing Requirements
**Critical Requirement**: Each agent must test integration points with other agents before handoff.

#### Cross-Agent Test Matrix
```typescript
// __tests__/integration/cross-agent-compatibility.test.ts
describe('Cross-Agent Integration Testing', () => {
  describe('Agent 1 → Agent 2 Integration', () => {
    test('Environment variables structure matches backend requirements', () => {
      // PASS CRITERIA: Supabase URL and keys load correctly
      // PASS CRITERIA: Backend services can initialize
    });
  });
  
  describe('Agent 1 → Agent 3 Integration', () => {
    test('Navigation types match screen component requirements', () => {
      // PASS CRITERIA: All ScreenProps<T> interfaces compile
      // PASS CRITERIA: Navigation hooks provide expected methods
    });
  });
  
  describe('Agent 2 → Agent 3 Integration', () => {
    test('Service interfaces match store requirements', () => {
      // PASS CRITERIA: All ServiceResponse<T> types match
      // PASS CRITERIA: Quota checking returns QuotaCheckResult format
    });
  });
  
  describe('Agent 3 → Agent 4 Integration', () => {
    test('Store state provides required component props', () => {
      // PASS CRITERIA: BrainStateAdaptation interface complete
      // PASS CRITERIA: All callback signatures match
    });
  });
  
  describe('Agent 4 → Agent 3 Integration', () => {
    test('Components accept exact prop interfaces', () => {
      // PASS CRITERIA: All component props compile without errors
      // PASS CRITERIA: Event handlers have correct signatures
    });
  });
});
```

### Phase 1: Foundation Testing (Agent 1)
**Critical Tests Required:**
- [ ] App boots without errors
- [ ] Navigation between all screens works
- [ ] TypeScript compilation passes
- [ ] Environment variables load correctly

**Test Command:**
```bash
npm run test:all && npx expo start --non-interactive & sleep 10 && curl -f http://localhost:8081/status && kill %1
```

### Phase 2: Backend Testing (Agent 2)
**Critical Tests Required:**
- [ ] Supabase connection established
- [ ] Authentication flow (signup/signin/signout)
- [ ] Database CRUD operations for all tables
- [ ] Row Level Security policies enforced
- [ ] Subscription quota checking works
- [ ] AI request limiting functions correctly

**Test Files:**
```typescript
// __tests__/services/authService.test.ts
describe('Authentication Service', () => {
  test('should create user subscription on signup', async () => {
    // Test user creation + automatic subscription init
  });
});

// __tests__/services/subscriptionService.test.ts
describe('Subscription Service', () => {
  test('should enforce quota limits correctly', async () => {
    // Test free user hitting 10 request limit
  });
  
  test('should reset quota monthly', async () => {
    // Test monthly reset functionality
  });
});
```

### Phase 3: Core Features Testing (Agent 3)
**Critical Tests Required:**
- [ ] Brain state store updates UI correctly
- [ ] Task filtering adapts to energy levels
- [ ] Offline storage works (AsyncStorage)
- [ ] AI breakdown respects quotas
- [ ] Brain state check-in completes under 30 seconds

**Test Files:**
```typescript
// __tests__/store/brainStateStore.test.ts
describe('Brain State Store', () => {
  test('should filter tasks based on energy level', () => {
    const lowEnergyState = { energy_level: 2, focus_level: 3, mood_level: 4 };
    const result = getMaxTaskComplexity(lowEnergyState);
    expect(result).toBe(2); // Only micro and simple tasks
  });
  
  test('should save to AsyncStorage for offline access', async () => {
    // Test offline persistence
  });
});
```

### Phase 4: UI/UX Testing (Agent 4)
**Critical Tests Required:**
- [ ] All components follow design system
- [ ] No red colors anywhere (automated check)
- [ ] 44px minimum touch targets
- [ ] Accessibility labels present
- [ ] Upgrade prompts are gentle, not interrupting

**Test Files:**
```typescript
// __tests__/components/GentleButton.test.tsx
describe('GentleButton', () => {
  test('should meet minimum touch target size', () => {
    const { getByRole } = render(<GentleButton title="Test" onPress={() => {}} />);
    const button = getByRole('button');
    expect(button.props.style.minHeight).toBeGreaterThanOrEqual(44);
  });
  
  test('should never use red colors', () => {
    // Automated color checking
  });
});
```

## Backward Compatibility Testing

### Version Compatibility Matrix
```bash
# Test against locked dependency versions
npm test -- --testNamePattern="compatibility"

# Test data migration (when schema changes)
npm run test:migration

# Test offline/online state transitions  
npm run test:offline-sync
```

### Breaking Change Prevention
```typescript
// __tests__/compatibility/brainStateCompatibility.test.ts
describe('Brain State Backward Compatibility', () => {
  test('should handle legacy brain state data format', () => {
    const legacyData = { energy: 5, focus: 3, mood: 7 }; // Old format
    const result = migrateBrainStateData(legacyData);
    expect(result.energy_level).toBe(5); // New format
  });
});
```

## Integration Testing Protocol

### Agent Integration Tests
```bash
# Test agent handoffs work correctly
npm run test:integration:agent1-to-agent3  # Navigation → Features
npm run test:integration:agent2-to-agent3  # Backend → Features  
npm run test:integration:agent4-to-agent3  # Components → Features
```

### End-to-End User Flows
```typescript
// e2e/criticalUserFlows.test.ts
describe('Critical User Flows', () => {
  test('Complete brain state check-in under 30 seconds', async () => {
    // Full user flow from app start to task list
  });
  
  test('Free user hits AI quota gracefully', async () => {
    // Test gentle quota limit handling
  });
  
  test('Offline brain state saves and syncs', async () => {
    // Test offline-first functionality
  });
});
```

## Definition of Done (Testing Requirements)

### Before Any Agent Merge:
- [ ] All new code has unit tests (80%+ coverage)
- [ ] Integration tests pass for handoff points
- [ ] TypeScript compilation succeeds
- [ ] No accessibility regressions
- [ ] Backward compatibility verified

### Before Production Release:
- [ ] All critical user flows tested end-to-end
- [ ] Performance testing (app start < 2s, check-in < 30s)
- [ ] Accessibility testing with screen readers
- [ ] Freemium flow testing (quota limits, upgrades)
- [ ] Offline/online sync testing

## Testing Commands Reference

```bash
# Quick Development Testing
npm run test:watch                    # Watch mode during development
npm run type-check                   # TypeScript validation
npx tsc --noEmit                     # Direct TypeScript check

# Pre-commit Testing  
npm run test:all                     # Full test suite
npm run test:coverage               # Coverage report
npm run lint                        # Code style validation

# Integration Testing
npm run test:integration            # Cross-agent testing
npm run test:compatibility          # Backward compatibility
npm run test:e2e                    # End-to-end flows (future)

# Performance Testing
npm run test:performance            # Speed benchmarks
npm run test:accessibility          # A11y validation
```

## Continuous Integration Requirements

### GitHub Actions Workflow (Recommended)
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run type-check
      - run: npm run lint
```

## Emergency Testing Procedures

### If Tests Fail:
1. **Never merge failing tests** to main branch
2. **Isolate the failure** to specific agent domain
3. **Roll back** to last known good state
4. **Fix forward** with additional tests
5. **Document** the failure cause and prevention

### If Backward Compatibility Breaks:
1. **Immediate rollback** to previous version
2. **Data migration script** if schema changed
3. **Communication** to users about temporary disruption
4. **Post-mortem** analysis and prevention measures

---

**Testing is non-negotiable for neurodivergent users who depend on consistent, reliable functionality.**