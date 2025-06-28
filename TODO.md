# 📋 TODO - For Next AI Session

**Last Updated:** 2025-06-28  
**Status:** Ready for database fixes  
**Working Directory:** `~/projects/ADD_NeuroDivergent_App` (WSL Native)

## ✅ COMPLETED THIS SESSION
- Expo 51→53 upgrade complete
- Navigation, API security, notification fixes complete
- Database schema analysis complete (4 conflicts identified)
- AGENT_2_SPRINT_2B.md determined as authoritative schema source

## 🎯 IMMEDIATE NEXT TASKS (START HERE)

### **Database Schema Fixes** (Critical - blocks all other work)

#### **Priority 1: brain_states Table Constraints** ⭐ CRITICAL
- [x] Read `DATABASE_FIXES.md` for exact SQL commands
- [x] Apply NOT NULL constraints to energy_level, focus_level, mood_level (documented in docs/DATABASE.md)
- [x] Add notes length constraint (500 chars max) (documented in docs/DATABASE.md)
- [ ] Test constraints by inserting invalid data (should fail):
  ```sql
  INSERT INTO brain_states (user_id, energy_level) VALUES ('test', NULL);
  INSERT INTO brain_states (user_id, energy_level, focus_level, mood_level, notes) 
  VALUES ('test', 5, 5, 5, REPEAT('x', 501));
  ```
- [ ] Verify RLS policies still work after constraint changes
- [ ] Document any data migration needed for existing NULL values

#### **Priority 2: user_subscriptions Validation** ⭐ HIGH
- [x] Add constraint: ai_requests_used >= 0 (documented in docs/DATABASE.md)
- [x] Add constraint: ai_requests_limit > 0 (documented in docs/DATABASE.md)
- [ ] Test constraints by updating with invalid data (should fail):
  ```sql
  UPDATE user_subscriptions SET ai_requests_used = -1 WHERE id = 'test';
  UPDATE user_subscriptions SET ai_requests_limit = 0 WHERE id = 'test';
  ```
- [ ] Verify quota checking logic still works
- [ ] Test monthly reset functionality

#### **Priority 3: tasks Table Constraints** ⭐ HIGH
- [x] Add title validation: LENGTH(TRIM(title)) > 0 (documented in docs/DATABASE.md)
- [x] Add description length limit: <= 1000 chars (documented in docs/DATABASE.md)
- [x] Set complexity_level to NOT NULL (documented in docs/DATABASE.md)
- [x] Add time validation: 1-1440 minutes (documented in docs/DATABASE.md)
- [x] Set is_completed to NOT NULL (documented in docs/DATABASE.md)
- [ ] Test all constraints with invalid data (should fail):
  ```sql
  INSERT INTO tasks (user_id, title, complexity_level) VALUES ('test', '', 3);
  INSERT INTO tasks (user_id, title, complexity_level) VALUES ('test', '   ', 3);
  INSERT INTO tasks (user_id, title, description, complexity_level) 
  VALUES ('test', 'Test', REPEAT('x', 1001), 3);
  INSERT INTO tasks (user_id, title, estimated_minutes, complexity_level) 
  VALUES ('test', 'Test', 1500, 3);
  ```
- [ ] Verify task filtering by complexity still works
- [ ] Test task creation and update workflows

#### **Priority 4: Performance Indexes** 🔧 MEDIUM
- [x] Create idx_brain_states_today index (documented in docs/DATABASE.md)
- [x] Create idx_tasks_user_active index (documented in docs/DATABASE.md)
- [x] Create idx_user_subscriptions_tier index (documented in docs/DATABASE.md)
- [ ] Verify indexes are being used with EXPLAIN queries
- [ ] Monitor query performance improvements

### **Testing Dependencies Fix** (Critical Issue #5 - must be fixed for Expo 53)
- [ ] Analyze current package.json for testing dependencies
- [ ] Check Jest version compatibility with Expo 53
- [ ] Check @testing-library/react-native version compatibility  
- [ ] Check @testing-library/jest-native version compatibility
- [ ] Check Detox version if used for E2E testing
- [ ] Update all testing dependencies to Expo 53 compatible versions
- [ ] Fix any breaking changes from dependency updates
- [ ] Run full test suite: `npm test` or `yarn test`
- [ ] Fix any failing tests due to Expo 51→53 changes
- [ ] Update CI/CD pipeline if needed for new versions
- [ ] Document testing setup for future developers

### **Schema Documentation Consolidation** 
- [x] Update docs/DATABASE.md with AGENT_2_SPRINT_2B.md constraints
- [x] Remove conflicting schema definitions
- [x] Create single source of truth for database schema
- [ ] Update TypeScript types in src/types/database.ts to match new constraints
- [ ] Update any API documentation that references schema
- [ ] Test TypeScript compilation after type updates

## 🔄 AGENT SPRINT CONTINUATION (After database fixes complete)

### **Agent 2 Remaining Sprints** (Service Layer Implementation)
- [ ] **Sprint 2C**: Authentication service with user session management
  - [ ] Supabase Auth integration
  - [ ] Automatic subscription initialization on signup
  - [ ] Session persistence and refresh
  - [ ] Protected route handling
  
- [ ] **Sprint 2D**: Brain state service implementation
  - [ ] Daily check-in functionality
  - [ ] Brain state history queries
  - [ ] Energy level filtering for tasks
  - [ ] Data validation using new constraints
  
- [ ] **Sprint 2E**: Task management service implementation  
  - [ ] CRUD operations for tasks
  - [ ] Complexity-based filtering
  - [ ] Task completion tracking
  - [ ] Integration with brain state system
  
- [ ] **Sprint 2F**: AI integration service implementation
  - [ ] Edge Function integration for OpenAI
  - [ ] Task breakdown requests
  - [ ] Quota management and enforcement
  - [ ] Error handling for AI failures

### **Agent 3 Sprints** (UI Development - Depends on Agent 2 completion)
- [ ] **Sprint 3A**: Core navigation setup with Expo Router
- [ ] **Sprint 3B**: Brain state check-in screens
- [ ] **Sprint 3C**: Task list and creation screens
- [ ] **Sprint 3D**: AI task breakdown integration UI
- [ ] **Sprint 3E**: Settings and subscription management screens
- [ ] **Sprint 3F**: Notification setup and preferences
- [ ] **Sprint 3G**: Onboarding flow for new users
- [ ] **Sprint 3H**: Polish, accessibility, and user testing

### **Agent 4 Sprints** (Integration, Testing, and Deployment)
- [ ] **Sprint 4A**: End-to-end testing setup with Detox
- [ ] **Sprint 4B**: Performance testing and optimization
- [ ] **Sprint 4C**: Security testing and penetration testing
- [ ] **Sprint 4D**: Accessibility testing and WCAG compliance
- [ ] **Sprint 4E**: Cross-platform testing (iOS/Android)
- [ ] **Sprint 4F**: Edge case handling and error recovery
- [ ] **Sprint 4G**: Production deployment and monitoring setup
- [ ] **Sprint 4H**: Documentation, handover, and maintenance guide

## 🔧 TECHNICAL DEBT AND MAINTENANCE

### **Code Quality Improvements**
- [ ] Run ESLint across entire codebase and fix violations
- [ ] Enable TypeScript strict mode and fix violations
- [ ] Update all deprecated Expo 51 patterns to Expo 53 equivalents
- [ ] Remove dead code from navigation dependency fixes
- [ ] Implement consistent error handling patterns
- [ ] Add proper TypeScript interfaces for all data structures

### **Performance Optimization**  
- [ ] Audit bundle size after Expo 53 upgrade
- [ ] Optimize images and static assets
- [ ] Review and optimize all database queries
- [ ] Implement proper React error boundaries
- [ ] Add performance monitoring and analytics
- [ ] Optimize app startup time

### **Security Hardening**
- [ ] Audit all environment variables for security
- [ ] Review all RLS policies for completeness and correctness
- [ ] Test Edge Function security and API exposure
- [ ] Implement proper logging (no sensitive data exposure)
- [ ] Add rate limiting for API endpoints
- [ ] Implement proper input sanitization

### **Documentation Updates**
- [ ] Update ARCHITECTURE.md with all Expo 53 changes
- [ ] Document notification system conflict resolution
- [ ] Update security documentation with Edge Function approach
- [ ] Document new testing strategy and setup
- [ ] Create developer onboarding guide
- [ ] Update deployment and maintenance procedures

## 🚀 DEPLOYMENT PREPARATION

### **Infrastructure Setup**
- [ ] Set up staging environment matching production
- [ ] Configure production Supabase project with proper security
- [ ] Set up monitoring, alerting, and logging systems
- [ ] Plan and test database migration strategy
- [ ] Configure backup and disaster recovery procedures
- [ ] Set up CDN for static assets

### **App Store Preparation**
- [ ] Create app store screenshots and promotional materials
- [ ] Write compelling app store descriptions and metadata
- [ ] Plan beta testing strategy with TestFlight/Play Console
- [ ] Prepare privacy policy and terms of service
- [ ] Set up analytics and crash reporting
- [ ] Plan marketing and launch strategy

## 📚 ESSENTIAL CONTEXT FILES FOR AI

### **Schema and Database**
- `DATABASE_FIXES.md` - Complete SQL commands with test cases and rollback procedures
- `AGENT_2_SPRINT_2B.md` - AUTHORITATIVE schema source (use this, not DATABASE.md)
- `docs/DATABASE.md` - Comprehensive docs (needs updating with AGENT_2_SPRINT_2B.md)
- `docs/DATABASE_OPERATIONS.md` - Operational procedures and troubleshooting

### **Project Context and Architecture**
- `PROJECT_CONTEXT.md` - Environment, design principles, security context
- `docs/ARCHITECTURE.md` - Overall system architecture
- `docs/FEATURES.md` - Feature specifications and requirements
- `INFRASTRUCTURE_SETUP.md` - Development environment setup

### **Sprint Planning and Implementation**
- `AGENT_2_PLAN.md` - Overall Agent 2 strategy
- `AGENT_2_SPRINT_2C.md` - Authentication service implementation
- `AGENT_2_SPRINT_2D.md` - Brain state service implementation  
- `AGENT_2_SPRINT_2E.md` - Task management service implementation
- `AGENT_2_SPRINT_2F.md` - AI integration service implementation

## ⚠️ CRITICAL REMINDERS FOR AI ASSISTANT

### **Environment and Paths**
- **Working Directory**: `~/projects/ADD_NeuroDivergent_App` (WSL Native)
- **NEVER use**: `/mnt/c/...` paths (Windows mount - 10-20x slower and outdated)
- **Always verify**: Run `pwd` to confirm working in WSL native directory
- **File operations**: Use WSL paths for all read/write operations

### **Development Methodology** 
- **Follow augmented coding**: analyze → fix one thing → test → verify → repeat
- **One constraint at a time**: Don't apply multiple database constraints simultaneously
- **Test everything**: Every constraint must be tested with invalid data
- **Verify integration**: Ensure RLS policies and app functionality work after changes
- **Document changes**: Update relevant documentation after each fix

### **Schema Authority and Conflicts**
- **AUTHORITATIVE SOURCE**: `AGENT_2_SPRINT_2B.md` (superior validation)
- **DO NOT USE**: `docs/DATABASE.md` as reference (has conflicts)
- **UPDATE NEEDED**: docs/DATABASE.md must be updated with AGENT_2_SPRINT_2B.md constraints
- **CONFLICTS RESOLVED**: 4 major schema conflicts identified and solutions provided

### **Project Status and Dependencies**
- **Expo Version**: 53 (React Native 0.79, TypeScript 5.8) - UPGRADE COMPLETE
- **Database**: Supabase PostgreSQL with Row Level Security enabled
- **Security**: OpenAI API moved to Edge Functions (server-side only)
- **Notifications**: Dual system conflicts resolved (basic + AI-adapted coexist)
- **Testing**: Dependencies need updating for Expo 53 compatibility

### **Neurodivergent-First Design Principles**
- **Gentle validation**: Prevent bad data without harsh error messages
- **Reasonable limits**: 500 chars for notes, 1000 for descriptions, 1-1440 minutes for tasks
- **Required fields**: Brain state levels must exist for core app functionality
- **Accessibility**: All UI must support assistive technologies
- **Cognitive load**: Keep interfaces simple and predictable

### **Error Handling and Rollback**
- **Rollback ready**: All constraint changes can be individually reversed
- **Backup first**: Consider backing up data before major schema changes
- **Test failures**: If constraints cause app breakage, rollback immediately
- **RLS verification**: Always verify Row Level Security works after schema changes
- **Performance monitoring**: Check query performance after adding constraints/indexes

## 🎯 SUCCESS CRITERIA FOR NEXT SESSION

### **Database Fixes Complete**
- [ ] All 4 priority database constraints applied successfully
- [ ] All constraints tested and verified working
- [ ] RLS policies functioning correctly
- [ ] App functionality verified end-to-end
- [ ] Performance indexes created and utilized

### **Testing Dependencies Fixed**
- [ ] All testing dependencies updated for Expo 53
- [ ] Full test suite running without errors
- [ ] CI/CD pipeline compatible with new versions
- [ ] Testing documentation updated

### **Ready for Agent 2C**
- [ ] Database schema stable and validated
- [ ] Authentication service implementation can begin
- [ ] No blocking issues remaining from schema conflicts

**Next AI Session Goal: Complete all database fixes and begin Agent 2 Sprint 2C** 🚀