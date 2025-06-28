# 🚀 **Deployment Guide**

## Agent-Based Deployment Strategy

This deployment guide aligns with our 4-agent development structure, providing specific deployment validation for each agent's sprint deliverables.

## Environment Setup

### Development Environment
```bash
# Prerequisites
node -v  # 18+
npm -v   # 9+

# Clone and setup
git clone [repo-url]
cd NeuroProductivityApp
npm install

# Start development
npx expo start
```

### Environment Variables
```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# OpenAI API key is handled server-side via Supabase Edge Functions (not exposed client-side)
EXPO_PUBLIC_OPENAI_RATE_LIMIT=10
```

## Supabase Setup

### Create Supabase Project
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get URL and anon key from Settings > API
# 4. Add to .env file
```

### Database Schema
```sql
-- Run in Supabase SQL Editor
-- Complete schema with freemium model support

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User subscriptions table (Freemium Model)
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  ai_requests_used INTEGER DEFAULT 0,
  ai_requests_limit INTEGER DEFAULT 10,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brain states table
CREATE TABLE brain_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 5),
  estimated_minutes INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  ai_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE brain_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Brain States Policies
CREATE POLICY "Users can view own brain states" ON brain_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain states" ON brain_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks Policies
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- User Subscriptions Policies
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX idx_brain_states_user_date ON brain_states(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed, created_at DESC);
CREATE INDEX idx_tasks_complexity ON tasks(user_id, complexity_level, is_completed);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_reset_date ON user_subscriptions(reset_date);
```

## Agent-Specific Deployment Workflows

### Agent 1: Foundation Deployment Validation

#### Sprint 1A: Foundation Setup Verification
```bash
# Verify basic setup before Agent 1 → Agent 3 handoff
npm run verify:foundation-setup     # Basic expo project working
npx expo start --non-interactive & sleep 10 && curl -f http://localhost:8081/status && kill %1
npm run type-check                  # TypeScript compilation
npm test src/__tests__/foundation   # Foundation tests pass
```

#### Sprint 1B: Navigation Framework Verification  
```bash
# Verify navigation before Agent 3 screen development
npm run verify:navigation-setup     # Navigation structure complete
npm test src/__tests__/navigation   # Navigation tests pass
npx tsc --noEmit                    # Navigation types compile correctly
```

#### Sprint 1C: App Shell & Error Handling Verification
```bash
# Complete Agent 1 deployment readiness
npm run verify:error-boundaries     # Error handling working
npm run verify:testing-setup        # Testing infrastructure ready
npm run test:all                    # All Agent 1 tests pass
```

**Agent 1 Deployment Complete When**: Navigation framework ready, error handling functional, testing infrastructure operational

### Agent 2: Backend Deployment Validation

#### Sprint 2A: Supabase Foundation Verification
```bash
# Verify backend connection before service development
npm run verify:supabase-connection  # Connection test passes
npm run verify:environment-vars     # All env vars configured correctly
npm test src/services/__tests__/connectionTest.ts
```

#### Sprint 2B: Database Schema Deployment
```bash
# Deploy and verify database schema
npm run deploy:schema               # Run schema deployment
npm run verify:schema-constraints   # All constraints working
npm run verify:rls-policies         # Row Level Security enforced
npm test src/services/__tests__/schemaValidation.ts
```

#### Sprint 2C-2F: Complete Backend Service Verification
```bash
# Verify all backend services before Agent 3 integration
npm run verify:auth-flow             # Authentication working
npm run verify:crud-operations       # All CRUD services functional
npm run verify:freemium-system       # Quota enforcement working
npm test src/services/__tests__/     # All backend tests pass
```

**Agent 2 Deployment Complete When**: Database schema deployed, all services tested, freemium system operational

### Agent 3: Core Features Deployment Validation

#### Brain State System Verification
```bash
# Verify brain state system integration
npm run verify:brain-state-stores    # Zustand stores working
npm run verify:ui-adaptation         # Brain state drives UI adaptation
npm run verify:offline-storage       # AsyncStorage functional
npm test src/store/__tests__/        # Store tests pass
```

#### Task Management System Verification
```bash
# Verify task management integration
npm run verify:task-filtering        # Complexity filtering working
npm run verify:ai-integration        # AI breakdown with quota checks
npm run verify:service-integration   # Store ↔ Service integration
npm test src/hooks/__tests__/        # Hook tests pass
```

**Agent 3 Deployment Complete When**: Brain state adaptation working, task filtering functional, store-service integration complete

### Agent 4: UI Component Deployment Validation

#### Design System Verification
```bash
# Verify design system foundation
npm run verify:no-red-colors         # Automated red color detection
npm run verify:neurodivergent-palette # Color system validation
npm run verify:accessibility-constants # WCAG 2.1 AA compliance
npm test src/components/__tests__/design-system/
```

#### Component Integration Verification
```bash
# Verify component library integration
npm run verify:brain-state-adaptation # Components adapt to brain state
npm run verify:touch-targets         # 44px minimum verification
npm run verify:component-integration # Cross-component functionality
npm test src/components/__tests__/   # All component tests pass
```

**Agent 4 Deployment Complete When**: Design system functional, all components tested, brain state adaptation working

### Cross-Agent Integration Deployment

#### Complete Integration Verification
```bash
# Verify all agents work together
npm run verify:cross-agent-integration # All integration points working
npm run verify:end-to-end-flows        # Complete user flows functional
npm run verify:performance-benchmarks  # Performance requirements met
npm test __tests__/integration/         # Integration tests pass
```

## Build Process

### iOS Build
```bash
# Development build
npx expo run:ios

# Production build
eas build --platform ios --profile production

# App Store submission
eas submit --platform ios
```

### Android Build
```bash
# Development build
npx expo run:android

# Production build
eas build --platform android --profile production

# Play Store submission
eas submit --platform android
```

## EAS Configuration

### Install EAS CLI
```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

### EAS Build Configuration (eas.json)
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "your-production-supabase-url",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-production-supabase-key"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Production Configuration

### Environment Variables (Production)
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
# OpenAI API key is configured in Supabase Edge Function secrets (not exposed client-side)
EXPO_PUBLIC_OPENAI_RATE_LIMIT=10
EXPO_PUBLIC_ENVIRONMENT=production
```

## App Store Deployment

### iOS App Store
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Monitor submission status
eas build:list
```

### Google Play Store
```bash
# Build for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android

# Monitor submission status
eas build:list
```

## Monitoring & Maintenance

### Health Checks
```javascript
// Check Supabase connection
const checkSupabaseHealth = async () => {
  try {
    const { data, error } = await supabase
      .from('brain_states')
      .select('count')
      .limit(1);
    return !error;
  } catch (error) {
    return false;
  }
};
```

### Error Tracking
```bash
# Install Sentry (optional)
npx expo install @sentry/react-native

# Basic logging
console.log('[INFO]', message);
console.error('[ERROR]', error);
```

### Supabase Monitoring
- Monitor database usage in Supabase Dashboard
- Check API usage and limits
- Monitor authentication metrics
- Review database performance insights

## Security Checklist

### Pre-deployment Security
- [ ] Supabase Row Level Security enabled
- [ ] API keys are environment variables only
- [ ] HTTPS enforced (handled by Supabase)
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] No hardcoded secrets in client code

### App Store Security
- [ ] Code obfuscation enabled in production builds
- [ ] Proper secure storage usage (Expo SecureStore)
- [ ] Certificate pinning for API calls

## Rollback Procedure

### Mobile App Rollback
```bash
# Prepare rollback version
git checkout [previous-stable-tag]
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit previous version
eas submit --platform ios
eas submit --platform android
```

### Database Rollback
```sql
-- Supabase doesn't support automatic rollbacks
-- Maintain manual backup procedures
-- Use database migrations with down scripts
```

## Performance Monitoring

### Key Metrics
- App startup time < 2 seconds
- Memory usage < 100MB
- Battery drain minimal
- Crash rate < 0.1%
- Supabase API response times < 500ms

### Monitoring Commands
```bash
# Check build status
eas build:list

# Monitor app performance
npx expo start --tunnel
```

## Troubleshooting

### Common Issues
```bash
# Build failures
rm -rf node_modules && npm install
npx expo install --fix

# Supabase connection issues
# Check URL and keys in Supabase Dashboard
# Verify RLS policies are correct

# EAS build issues
eas build:list
eas build:view [build-id]
```

### Emergency Contacts
- Supabase Support: support@supabase.com
- Expo Support: support@expo.dev
- OpenAI Support: help@openai.com

---

**Deployment optimized for Expo + Supabase simplicity** 🚀