# 🗄️ Database Schema Fixes

**Source Authority:** AGENT_2_SPRINT_2B.md  
**Fix Strategy:** One constraint at a time (augmented coding)

---

## Priority 1: brain_states Constraints ⭐ CRITICAL

**Issue:** Core brain state levels can be NULL, unlimited notes

```sql
-- Fix 1: Add NOT NULL constraints to brain state levels
ALTER TABLE brain_states 
ALTER COLUMN energy_level SET NOT NULL,
ALTER COLUMN focus_level SET NOT NULL,
ALTER COLUMN mood_level SET NOT NULL;

-- Fix 2: Add notes length constraint (neurodivergent-friendly limit)
ALTER TABLE brain_states 
ADD CONSTRAINT brain_states_notes_length 
CHECK (LENGTH(notes) <= 500);
```

**Test Commands:**
```sql
-- These should FAIL after applying fixes
INSERT INTO brain_states (user_id, energy_level) VALUES ('test', NULL);
INSERT INTO brain_states (user_id, energy_level, focus_level, mood_level, notes) 
VALUES ('test', 5, 5, 5, REPEAT('x', 501));
```

---

## Priority 2: user_subscriptions Validation ⭐ HIGH

**Issue:** No validation prevents negative request counts

```sql
-- Add validation constraints for AI request tracking
ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_requests_positive 
CHECK (ai_requests_used >= 0);

ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_limit_positive 
CHECK (ai_requests_limit > 0);
```

**Test Commands:**
```sql
-- These should FAIL after applying fixes
UPDATE user_subscriptions SET ai_requests_used = -1 WHERE id = 'test';
UPDATE user_subscriptions SET ai_requests_limit = 0 WHERE id = 'test';
```

---

## Priority 3: tasks Table Constraints ⭐ HIGH

**Issue:** Missing validation allows empty titles, unlimited descriptions, NULL complexity

```sql
-- Fix 1: Title validation (prevent empty titles)
ALTER TABLE tasks 
ADD CONSTRAINT tasks_title_not_empty 
CHECK (LENGTH(TRIM(title)) > 0);

-- Fix 2: Description length limit (prevents overwhelming content)
ALTER TABLE tasks 
ADD CONSTRAINT tasks_description_length 
CHECK (LENGTH(description) <= 1000);

-- Fix 3: Complexity level must not be NULL (required for brain state filtering)
ALTER TABLE tasks 
ALTER COLUMN complexity_level SET NOT NULL;

-- Fix 4: Time validation (1-1440 minutes = max 24 hours)
ALTER TABLE tasks 
ADD CONSTRAINT tasks_time_valid 
CHECK (estimated_minutes > 0 AND estimated_minutes <= 1440);

-- Fix 5: is_completed must not be NULL
ALTER TABLE tasks 
ALTER COLUMN is_completed SET NOT NULL;
```

**Test Commands:**
```sql
-- These should FAIL after applying fixes
INSERT INTO tasks (user_id, title, complexity_level) VALUES ('test', '', 3);
INSERT INTO tasks (user_id, title, complexity_level) VALUES ('test', '   ', 3);
INSERT INTO tasks (user_id, title, description, complexity_level) 
VALUES ('test', 'Test', REPEAT('x', 1001), 3);
INSERT INTO tasks (user_id, title, estimated_minutes, complexity_level) 
VALUES ('test', 'Test', 1500, 3);
```

---

## Priority 4: Performance Indexes 🔧 MEDIUM

**Issue:** Missing specialized indexes for common queries

```sql
-- Index for daily brain state lookups
CREATE INDEX idx_brain_states_today ON brain_states(user_id, (created_at::date)) 
  WHERE created_at >= CURRENT_DATE;

-- Index for active task filtering
CREATE INDEX idx_tasks_user_active ON tasks(user_id, created_at DESC) 
  WHERE is_completed = false;

-- Index for subscription analytics
CREATE INDEX idx_user_subscriptions_tier ON user_subscriptions(tier, ai_requests_used);
```

---

## Rollback Commands

**If constraints cause issues:**

```sql
-- Remove brain_states constraints
ALTER TABLE brain_states 
ALTER COLUMN energy_level DROP NOT NULL,
ALTER COLUMN focus_level DROP NOT NULL,
ALTER COLUMN mood_level DROP NOT NULL;
DROP CONSTRAINT brain_states_notes_length;

-- Remove user_subscriptions constraints
ALTER TABLE user_subscriptions 
DROP CONSTRAINT user_subscriptions_requests_positive,
DROP CONSTRAINT user_subscriptions_limit_positive;

-- Remove tasks constraints
ALTER TABLE tasks 
DROP CONSTRAINT tasks_title_not_empty,
DROP CONSTRAINT tasks_description_length,
ALTER COLUMN complexity_level DROP NOT NULL,
DROP CONSTRAINT tasks_time_valid,
ALTER COLUMN is_completed DROP NOT NULL;

-- Remove indexes
DROP INDEX idx_brain_states_today;
DROP INDEX idx_tasks_user_active;
DROP INDEX idx_user_subscriptions_tier;
```

---

**Start with Priority 1, test thoroughly, then move to Priority 2** ✅