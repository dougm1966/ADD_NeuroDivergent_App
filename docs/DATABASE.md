# 🗄️ **Database Documentation**

## Overview

The Neurodivergent Productivity App uses **Supabase PostgreSQL** as its primary database with Row Level Security (RLS) for multi-tenant data isolation. The database is designed to support the core brain state system, adaptive task management, and freemium subscription model.

## Architecture Principles

### 1. Security First
- **Row Level Security (RLS)** enabled on all user data tables
- User data completely isolated using `auth.uid()` policies
- No cross-user data access possible
- Secure authentication through Supabase Auth

### 2. Neurodivergent-Optimized Schema
- Brain state drives all app behavior (energy, focus, mood levels 1-10)
- Task complexity levels (1-5) map to user energy states
- Gentle data constraints (no harsh validation errors)
- Timestamps for pattern analysis and insights

### 3. Freemium Model Integration
- Built-in subscription tier management (free/premium)
- AI request quota tracking and enforcement
- Monthly usage reset automation
- Graceful degradation for quota limits

## Complete Database Schema

### Core Tables

#### 1. Brain States Table
Stores daily brain state check-ins that drive app adaptation.

```sql
CREATE TABLE brain_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  energy_level INTEGER NOT NULL CHECK (energy_level BETWEEN 1 AND 10),
  focus_level INTEGER NOT NULL CHECK (focus_level BETWEEN 1 AND 10),
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT brain_states_notes_length CHECK (LENGTH(notes) <= 500)
);
```

**Design Decisions:**
- `energy_level` drives task complexity filtering
- `focus_level` affects UI complexity and density
- `mood_level` influences encouragement messaging
- `notes` are optional for additional context
- One check-in per day pattern (enforced at app level)

#### 2. User Subscriptions Table (Freemium Model)
Manages subscription tiers and AI request quotas.

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  ai_requests_used INTEGER DEFAULT 0,
  ai_requests_limit INTEGER DEFAULT 10,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_subscriptions_requests_positive CHECK (ai_requests_used >= 0),
  CONSTRAINT user_subscriptions_limit_positive CHECK (ai_requests_limit > 0)
);
```

**Design Decisions:**
- `tier` enforces only 'free' or 'premium' values
- `ai_requests_limit` is 10 for free users, 100+ for premium
- `reset_date` enables monthly quota resets
- Automatic initialization on user signup
- UNIQUE constraint prevents duplicate subscriptions

#### 3. Tasks Table
Stores user tasks with complexity levels and AI breakdowns.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  complexity_level INTEGER NOT NULL CHECK (complexity_level BETWEEN 1 AND 5),
  estimated_minutes INTEGER,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ai_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT tasks_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
  CONSTRAINT tasks_description_length CHECK (LENGTH(description) <= 1000),
  CONSTRAINT tasks_time_valid CHECK (estimated_minutes > 0 AND estimated_minutes <= 1440)
);
```

**Design Decisions:**
- `complexity_level` maps to brain state energy levels
- `ai_breakdown` stores OpenAI response as flexible JSONB
- `is_completed` enables progress tracking without shame
- Soft delete pattern (mark completed, don't delete)

## Row Level Security (RLS) Policies

### Brain States Policies
```sql
-- Enable RLS
ALTER TABLE brain_states ENABLE ROW LEVEL SECURITY;

-- View own brain states
CREATE POLICY "Users can view own brain states" ON brain_states
  FOR SELECT USING (auth.uid() = user_id);

-- Insert own brain states
CREATE POLICY "Users can insert own brain states" ON brain_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### User Subscriptions Policies
```sql
-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- View own subscription
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Update own subscription (for usage tracking)
CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
```

### Tasks Policies
```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Full CRUD access to own tasks
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

## Performance Indexes

### Core Performance Indexes
```sql
-- Brain states: User + date lookups
CREATE INDEX idx_brain_states_user_date ON brain_states(user_id, created_at DESC);

-- Brain states: Daily lookups optimization
CREATE INDEX idx_brain_states_today ON brain_states(user_id, (created_at::date)) 
  WHERE created_at >= CURRENT_DATE;

-- Tasks: User + completion status + date
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed, created_at DESC);

-- Tasks: Active task filtering optimization
CREATE INDEX idx_tasks_user_active ON tasks(user_id, created_at DESC) 
  WHERE is_completed = false;

-- Tasks: Complexity filtering for brain state adaptation
CREATE INDEX idx_tasks_complexity ON tasks(user_id, complexity_level, is_completed);

-- Subscriptions: User lookup
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);

-- Subscriptions: Reset date for monthly cleanup
CREATE INDEX idx_user_subscriptions_reset_date ON user_subscriptions(reset_date);

-- Subscriptions: Tier-based analytics optimization
CREATE INDEX idx_user_subscriptions_tier ON user_subscriptions(tier, ai_requests_used);
```

**Performance Rationale:**
- Brain states accessed by date for "today's check-in" queries
- Tasks filtered by complexity based on current brain state
- Subscription quota checks on every AI request
- Composite indexes reduce query planning overhead

## Data Relationships

### Entity Relationship Overview
```
auth.users (Supabase)
    ├── brain_states (1:many)
    ├── tasks (1:many) 
    └── user_subscriptions (1:1)

brain_states.energy_level → filters tasks.complexity_level
user_subscriptions.ai_requests_used → gates AI features
```

### Key Relationships
1. **User → Brain States**: One user, many daily check-ins
2. **User → Tasks**: One user, unlimited tasks
3. **User → Subscription**: One user, one subscription record
4. **Brain State → Task Filtering**: Energy level determines visible tasks
5. **Subscription → AI Access**: Usage quota gates AI breakdown requests

## Data Types and Constraints

### Neurodivergent-Friendly Constraints
- **Brain State Levels**: 1-10 scale (gentle, familiar range)
- **Task Complexity**: 1-5 scale (simple categorization)
- **Subscription Tiers**: Only 'free'/'premium' (no complex tiers)
- **Text Fields**: No harsh character limits (accommodates varying needs)

### Technical Constraints
- **UUIDs**: Primary keys for security and distributed systems
- **Timestamps**: All times in UTC with timezone support
- **JSONB**: Flexible AI breakdown storage
- **Referential Integrity**: Cascade deletes maintain data consistency

## Freemium Model Implementation

### Quota Management Flow
1. User signs up → Free subscription initialized (10 AI requests/month)
2. AI request → Check `ai_requests_used < ai_requests_limit`
3. Request approved → Increment `ai_requests_used`
4. Monthly reset → `ai_requests_used = 0`, update `reset_date`

### Premium Upgrade Flow
1. User upgrades → `tier = 'premium'`, `ai_requests_limit = 100`
2. Premium users → Unlimited AI requests (or high limit)
3. Downgrade handling → Graceful reduction to free limits

## Data Privacy & Compliance

### GDPR Compliance
- **Right to Access**: Users can export all their data via API
- **Right to Delete**: CASCADE DELETE removes all user data
- **Data Minimization**: Only collect necessary brain state data
- **Purpose Limitation**: Brain states used only for app adaptation

### Data Retention
- **Brain States**: Retained indefinitely for pattern analysis (user controls deletion)
- **Tasks**: Retained until user deletes (soft delete recommended)
- **Subscriptions**: Retained for billing/audit (anonymized after deletion)

### Security Measures
- **RLS Enforcement**: Impossible to access other users' data
- **Encrypted at Rest**: Supabase handles database encryption
- **Audit Logging**: Supabase provides access logs
- **No PII in Client**: Sensitive data stays server-side

## Common Queries

### Daily Brain State Check
```sql
-- Get today's brain state for user
SELECT * FROM brain_states 
WHERE user_id = auth.uid() 
  AND created_at >= CURRENT_DATE 
  AND created_at < CURRENT_DATE + INTERVAL '1 day'
ORDER BY created_at DESC 
LIMIT 1;
```

### Adaptive Task Filtering
```sql
-- Get tasks appropriate for current energy level
SELECT * FROM tasks 
WHERE user_id = auth.uid() 
  AND complexity_level <= $1  -- User's energy level
  AND is_completed = false
ORDER BY created_at DESC;
```

### Quota Check
```sql
-- Check if user can make AI request
SELECT ai_requests_used < ai_requests_limit as can_request
FROM user_subscriptions 
WHERE user_id = auth.uid();
```

### Monthly Usage Reset
```sql
-- Reset monthly quotas (run as scheduled function)
UPDATE user_subscriptions 
SET ai_requests_used = 0,
    reset_date = reset_date + INTERVAL '1 month'
WHERE reset_date < NOW();
```

## Development Setup

### Local Database Setup
1. Create Supabase project at https://supabase.com
2. Run schema creation in SQL Editor
3. Enable RLS and create policies
4. Create performance indexes
5. Test with sample data

### Environment Configuration
```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Monitoring & Maintenance

### Key Metrics to Monitor
- **Query Performance**: Brain state and task queries < 100ms
- **Storage Growth**: Monitor brain_states table size over time
- **AI Usage**: Track subscription quota utilization
- **RLS Enforcement**: Ensure no cross-user data access

### Maintenance Tasks
- **Monthly Quota Reset**: Automated via Supabase Edge Functions
- **Performance Analysis**: Review slow query logs monthly
- **Index Maintenance**: Monitor index usage and effectiveness
- **Backup Verification**: Test restore procedures quarterly

## Troubleshooting

### Common Issues

#### 1. RLS Policy Errors
```
Error: new row violates row-level security policy
```
**Solution**: Ensure user is authenticated and `auth.uid()` returns correct user ID.

#### 2. Quota Check Failures
```
Error: User subscription not found
```
**Solution**: Verify subscription was initialized on user signup.

#### 3. Performance Issues
```
Slow queries on tasks table
```
**Solution**: Verify indexes exist and query uses indexed columns.

### Debug Queries
```sql
-- Check if user has subscription
SELECT COUNT(*) FROM user_subscriptions WHERE user_id = auth.uid();

-- Verify RLS is working
SELECT auth.uid(), user_id FROM brain_states LIMIT 1;

-- Check index usage
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM tasks WHERE user_id = auth.uid() AND complexity_level <= 3;
```

## Phase 2 Schema Extensions

Phase 2 features (gamification, body doubling, advanced notifications) extend the existing schema without breaking changes. All extensions are designed to be backward compatible with Phase 1.

### Phase 2 Table Extensions

#### Extended User Subscriptions Table
Add Phase 2 tracking to existing `user_subscriptions` table:

```sql
-- Add Phase 2 columns to existing table
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS achievement_points INTEGER DEFAULT 0;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS customizations_unlocked JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS body_doubling_sessions_used INTEGER DEFAULT 0;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{}';

-- Example data structures:
-- achievements: {"brain_scientist": {"level": "bronze", "earned_date": "2025-06-25"}}
-- customizations_unlocked: {"themes": ["calming_blue", "forest_green"], "fonts": ["opendyslexic"]}
-- notification_preferences: {"brain_state_reminders": true, "body_doubling": false}
```

#### Extended Brain States Table
Add achievement tracking to existing `brain_states` table:

```sql
-- Add achievement tracking
ALTER TABLE brain_states ADD COLUMN IF NOT EXISTS achievement_earned TEXT;
ALTER TABLE brain_states ADD COLUMN IF NOT EXISTS gamification_points INTEGER DEFAULT 0;

-- Track which check-ins earned achievements
-- achievement_earned: "brain_scientist_bronze" or NULL
-- gamification_points: Points earned for this specific check-in
```

#### Extended Tasks Table
Add celebration and gamification tracking:

```sql
-- Add gamification features to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS celebration_type TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS achievement_earned TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS complexity_match_score INTEGER;

-- Track task completion achievements
-- celebration_type: "micro_master", "perfect_match", "gentle_victory"
-- achievement_earned: Specific achievement unlocked by this task
-- complexity_match_score: How well task complexity matched brain state
```

### New Phase 2 Tables

#### Body Doubling Rooms
```sql
CREATE TABLE body_doubling_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type VARCHAR(50) NOT NULL, -- 'low_energy', 'medium_energy', 'high_energy', 'creative', 'admin'
  room_name VARCHAR(100) NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  max_occupancy INTEGER DEFAULT 6,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE body_doubling_rooms ENABLE ROW LEVEL SECURITY;

-- Public read access (users can see available rooms)
CREATE POLICY "Anyone can view active rooms" ON body_doubling_rooms
  FOR SELECT USING (is_active = true);
```

#### Body Doubling Sessions
```sql
CREATE TABLE body_doubling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES body_doubling_rooms(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  brain_state_at_start JSONB,
  brain_state_at_end JSONB,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  session_type VARCHAR(20) DEFAULT 'drop_in', -- 'drop_in', 'matched', 'scheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE body_doubling_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view own sessions" ON body_doubling_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON body_doubling_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON body_doubling_sessions
  FOR UPDATE USING (auth.uid() = user_id);
```

#### User Connections (for body doubling relationships)
```sql
CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  connection_type VARCHAR(20) DEFAULT 'body_doubling', -- 'body_doubling', 'study_partner'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id),
  CHECK (requester_id != recipient_id)
);

-- Enable RLS
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

-- Users can see connections they're involved in
CREATE POLICY "Users can view own connections" ON user_connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connection requests" ON user_connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're involved in" ON user_connections
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
```

#### Notification Queue (for advanced notifications)
```sql
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'brain_state_reminder', 'body_doubling_invite', 'achievement'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional notification data
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notification_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notification_queue
  FOR UPDATE USING (auth.uid() = user_id);
```

### Phase 2 Performance Indexes

```sql
-- Body doubling session lookups
CREATE INDEX idx_body_doubling_sessions_user_date ON body_doubling_sessions(user_id, session_start DESC);
CREATE INDEX idx_body_doubling_sessions_room_active ON body_doubling_sessions(room_id, session_end);

-- User connections lookups
CREATE INDEX idx_user_connections_requester ON user_connections(requester_id, connection_status);
CREATE INDEX idx_user_connections_recipient ON user_connections(recipient_id, connection_status);

-- Notification queue processing
CREATE INDEX idx_notification_queue_user_unread ON notification_queue(user_id, read_at, scheduled_for);
CREATE INDEX idx_notification_queue_pending ON notification_queue(scheduled_for, sent_at) WHERE sent_at IS NULL;

-- Achievement tracking
CREATE INDEX idx_user_subscriptions_achievements ON user_subscriptions USING GIN(achievements);
CREATE INDEX idx_brain_states_achievements ON brain_states(user_id, achievement_earned) WHERE achievement_earned IS NOT NULL;
```

### Phase 2 Migration Strategy

#### Migration 002: Gamification Extensions
```sql
-- Add gamification columns to existing tables
ALTER TABLE user_subscriptions ADD COLUMN achievements JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN achievement_points INTEGER DEFAULT 0;
ALTER TABLE user_subscriptions ADD COLUMN customizations_unlocked JSONB DEFAULT '{}';

ALTER TABLE brain_states ADD COLUMN achievement_earned TEXT;
ALTER TABLE tasks ADD COLUMN celebration_type TEXT;

-- Create achievement tracking indexes
CREATE INDEX idx_user_subscriptions_achievements ON user_subscriptions USING GIN(achievements);
```

#### Migration 003: Body Doubling Platform
```sql
-- Create body doubling tables
-- (Full table creation from above)

-- Create body doubling indexes
-- (Index creation from above)
```

#### Migration 004: Advanced Notifications
```sql
-- Add notification preferences
ALTER TABLE user_subscriptions ADD COLUMN notification_preferences JSONB DEFAULT '{}';

-- Create notification queue table
-- (Table creation from above)
```

### Backward Compatibility Guarantees

#### Phase 1 Compatibility
- All Phase 1 queries continue to work unchanged
- New columns use `ADD COLUMN IF NOT EXISTS` for safety
- Default values ensure existing data remains valid
- No changes to existing RLS policies

#### Data Migration
- Existing users automatically get default Phase 2 values
- No data loss during Phase 2 rollout
- Gradual feature enablement without breaking changes
- Rollback capability for each migration

#### API Compatibility
- Phase 1 API endpoints remain unchanged
- New Phase 2 endpoints are additive only
- Optional Phase 2 fields in existing responses
- Version-compatible client handling

---

**Database optimized for neurodivergent users with security and scalability** 🗄️