# 🔧 Database Operations & Troubleshooting

## Daily Operations

### Health Monitoring

#### Connection Health Check
```sql
-- Test basic connectivity
SELECT NOW() as server_time, version() as postgres_version;

-- Check if RLS is working
SELECT auth.uid() as current_user_id;

-- Verify table access
SELECT COUNT(*) as total_brain_states FROM brain_states;
SELECT COUNT(*) as total_tasks FROM tasks;
SELECT COUNT(*) as total_subscriptions FROM user_subscriptions;
```

#### Performance Monitoring
```sql
-- Check slow queries (requires pg_stat_statements extension)
SELECT 
  query,
  mean_exec_time,
  calls,
  total_exec_time
FROM pg_stat_statements 
WHERE query LIKE '%brain_states%' OR query LIKE '%tasks%'
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Check index usage
SELECT 
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT 
  relname as table_name,
  pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(relid) DESC;
```

### Backup Procedures

#### Supabase Automatic Backups
- **Free Tier**: 7 days of point-in-time recovery
- **Pro Tier**: 30 days of point-in-time recovery
- **Backups**: Managed automatically by Supabase

#### Manual Backup (Emergency)
```bash
# Export schema only
pg_dump -h your-host -U postgres -s database_name > schema_backup.sql

# Export data only
pg_dump -h your-host -U postgres -a database_name > data_backup.sql

# Full backup
pg_dump -h your-host -U postgres database_name > full_backup.sql
```

#### Backup Verification
```sql
-- Check backup integrity
SELECT 
  table_name,
  row_count
FROM (
  SELECT 'brain_states' as table_name, COUNT(*) as row_count FROM brain_states
  UNION ALL
  SELECT 'tasks', COUNT(*) FROM tasks
  UNION ALL
  SELECT 'user_subscriptions', COUNT(*) FROM user_subscriptions
) backup_stats;
```

## Maintenance Tasks

### Monthly Quota Reset
```sql
-- Reset AI quotas for all users (run monthly)
-- This should be automated via Supabase Edge Function
UPDATE user_subscriptions 
SET 
  ai_requests_used = 0,
  reset_date = reset_date + INTERVAL '1 month',
  updated_at = NOW()
WHERE reset_date < NOW();

-- Verify reset was successful
SELECT 
  tier,
  COUNT(*) as users_reset,
  AVG(ai_requests_used) as avg_usage_after_reset
FROM user_subscriptions 
WHERE reset_date > NOW() - INTERVAL '1 day'
GROUP BY tier;
```

### Data Cleanup
```sql
-- Find old completed tasks (older than 6 months)
SELECT COUNT(*) as old_completed_tasks
FROM tasks 
WHERE is_completed = true 
  AND updated_at < NOW() - INTERVAL '6 months';

-- Optional: Archive old brain states (keep last 90 days)
-- Note: Consider user retention preferences before deleting
SELECT 
  user_id,
  COUNT(*) as old_brain_states
FROM brain_states 
WHERE created_at < NOW() - INTERVAL '90 days'
GROUP BY user_id;
```

### Index Maintenance
```sql
-- Analyze tables for query optimization
ANALYZE brain_states;
ANALYZE tasks;
ANALYZE user_subscriptions;

-- Check for unused indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
  AND idx_scan = 0
ORDER BY relname, indexname;

-- Update table statistics
VACUUM ANALYZE brain_states;
VACUUM ANALYZE tasks;
VACUUM ANALYZE user_subscriptions;
```

## Common Issues & Solutions

### 1. RLS Policy Errors

#### Symptom
```
Error: new row violates row-level security policy
Error: permission denied for table brain_states
```

#### Diagnosis
```sql
-- Check if user is authenticated
SELECT auth.uid();

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('brain_states', 'tasks', 'user_subscriptions');

-- List all policies
SELECT 
  tablename,
  policyname,
  permissive,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('brain_states', 'tasks', 'user_subscriptions');
```

#### Solution
```sql
-- Re-enable RLS if disabled
ALTER TABLE brain_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Recreate missing policies (example for brain_states)
DROP POLICY IF EXISTS "Users can view own brain states" ON brain_states;
CREATE POLICY "Users can view own brain states" ON brain_states
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. Subscription Initialization Issues

#### Symptom
```
Error: User subscription not found
Error: Cannot check quota for user
```

#### Diagnosis
```sql
-- Check if subscription exists for user
SELECT COUNT(*) 
FROM user_subscriptions 
WHERE user_id = 'user-uuid-here';

-- Find users without subscriptions
SELECT u.id as user_id, u.email
FROM auth.users u
LEFT JOIN user_subscriptions s ON u.id = s.user_id
WHERE s.user_id IS NULL;
```

#### Solution
```sql
-- Initialize missing subscription
INSERT INTO user_subscriptions (user_id, tier, ai_requests_used, ai_requests_limit)
VALUES ('user-uuid-here', 'free', 0, 10)
ON CONFLICT (user_id) DO NOTHING;

-- Bulk initialize for multiple users
INSERT INTO user_subscriptions (user_id, tier, ai_requests_used, ai_requests_limit)
SELECT 
  u.id,
  'free',
  0,
  10
FROM auth.users u
LEFT JOIN user_subscriptions s ON u.id = s.user_id
WHERE s.user_id IS NULL;
```

### 3. Performance Issues

#### Symptom
- Slow task list loading
- Brain state queries taking > 500ms
- App timeouts on data operations

#### Diagnosis
```sql
-- Check query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM tasks 
WHERE user_id = 'user-uuid' 
  AND complexity_level <= 3 
  AND is_completed = false
ORDER BY created_at DESC;

-- Check index usage
SELECT 
  relname,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch
FROM pg_stat_user_tables 
WHERE relname IN ('brain_states', 'tasks', 'user_subscriptions');
```

#### Solution
```sql
-- Recreate missing indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_complexity 
ON tasks(user_id, complexity_level, is_completed);

CREATE INDEX IF NOT EXISTS idx_brain_states_user_date 
ON brain_states(user_id, created_at DESC);

-- Update table statistics
VACUUM ANALYZE tasks;
VACUUM ANALYZE brain_states;
```

### 4. AI Quota Issues

#### Symptom
- Users can't access AI features
- Quota not resetting monthly
- Premium users hitting limits

#### Diagnosis
```sql
-- Check quota status for user
SELECT 
  tier,
  ai_requests_used,
  ai_requests_limit,
  reset_date,
  CASE 
    WHEN ai_requests_used >= ai_requests_limit THEN 'OVER_QUOTA'
    WHEN reset_date < NOW() THEN 'NEEDS_RESET'
    ELSE 'OK'
  END as status
FROM user_subscriptions 
WHERE user_id = 'user-uuid';

-- Find users needing quota reset
SELECT COUNT(*) as users_needing_reset
FROM user_subscriptions 
WHERE reset_date < NOW();
```

#### Solution
```sql
-- Manual quota reset for user
UPDATE user_subscriptions 
SET 
  ai_requests_used = 0,
  reset_date = NOW() + INTERVAL '1 month',
  updated_at = NOW()
WHERE user_id = 'user-uuid';

-- Fix premium user limits
UPDATE user_subscriptions 
SET ai_requests_limit = 1000
WHERE tier = 'premium' AND ai_requests_limit < 100;
```

### 5. Data Integrity Issues

#### Symptom
- Missing brain states for today
- Tasks without complexity levels
- Orphaned data

#### Diagnosis
```sql
-- Check for data integrity issues
SELECT 
  'Missing brain states' as issue,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN brain_states bs ON u.id = bs.user_id 
  AND bs.created_at >= CURRENT_DATE
WHERE bs.user_id IS NULL

UNION ALL

SELECT 
  'Tasks without complexity',
  COUNT(*)
FROM tasks 
WHERE complexity_level IS NULL

UNION ALL

SELECT 
  'Orphaned subscriptions',
  COUNT(*)
FROM user_subscriptions s
LEFT JOIN auth.users u ON s.user_id = u.id
WHERE u.id IS NULL;
```

#### Solution
```sql
-- Fix missing complexity levels
UPDATE tasks 
SET complexity_level = 3  -- Default to medium complexity
WHERE complexity_level IS NULL;

-- Remove orphaned subscriptions
DELETE FROM user_subscriptions 
WHERE user_id NOT IN (SELECT id FROM auth.users);
```

## Emergency Procedures

### Database Connection Lost

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify Network**: Test connection from different location
3. **Check Credentials**: Ensure API keys are correct
4. **Fallback**: Enable offline mode in app

### Data Corruption

1. **Stop All Writes**: Disable user access immediately
2. **Assess Damage**: Run integrity checks
3. **Restore from Backup**: Use point-in-time recovery
4. **Verify Restoration**: Test all app functions
5. **Resume Operations**: Enable user access

### Performance Degradation

1. **Identify Bottleneck**: Check slow query logs
2. **Kill Long Queries**: Terminate problematic queries
3. **Scale Resources**: Upgrade Supabase plan if needed
4. **Optimize Queries**: Add missing indexes
5. **Monitor Recovery**: Watch performance metrics

## Monitoring & Alerts

### Key Metrics to Track

- **Query Response Time**: < 500ms average
- **Database Connections**: < 80% of limit
- **Storage Usage**: Monitor growth trends
- **Error Rate**: < 0.1% of queries
- **Backup Status**: Daily verification

### Recommended Alerts

1. **Query Performance**: Alert if average > 1 second
2. **Storage Space**: Alert at 80% capacity
3. **Connection Limit**: Alert at 90% of max connections
4. **RLS Failures**: Alert on policy violations
5. **Backup Failures**: Immediate alert

### Supabase Dashboard Monitoring

- **Database > Reports**: Query performance insights
- **Settings > Billing**: Usage and limits
- **Logs**: Real-time error monitoring
- **API**: Request volume and response times

---

**Comprehensive database operations for reliable production service** 🔧