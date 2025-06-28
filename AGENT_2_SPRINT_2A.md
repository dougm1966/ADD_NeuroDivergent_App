# 🗄️ Agent 2 Sprint 2A: Supabase Foundation

## Mission
Set up Supabase project and establish secure database connection with environment configuration.

## Sprint Goal
Create a working Supabase connection that Agent 3 can build upon for data operations.

## Time Estimate
30-45 minutes

## Prerequisites
- Node.js 18+ installed
- Agent 1's Sprint 1A completed (environment structure ready)
- Supabase account created

## Critical Rules (NEVER VIOLATE)
1. Database: Supabase PostgreSQL ONLY
2. Security: Never commit API keys to git
3. Environment: Use exact variable names specified
4. Connection: Test thoroughly before handoff

## Sprint Tasks

### Task 1: Create Supabase Project
**Manual Steps** (Do these in browser):
1. Go to https://supabase.com
2. Click "New project"
3. Name: "neurodivergent-productivity-app"
4. Choose region closest to your users
5. Generate secure password and save it
6. Wait for project to initialize (2-3 minutes)

### Task 2: Get Supabase Credentials
**In Supabase Dashboard:**
1. Go to Settings → API
2. Copy "URL" (looks like: https://your-project-ref.supabase.co)
3. Copy "anon public" key (long string starting with eyJ...)
4. **Important:** Use the "anon" key, NOT the "service_role" key

### Task 3: Configure Environment Variables
**Update**: `.env` (replace placeholder values)
```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI Configuration (server-side only - no client exposure)
# OPENAI_API_KEY=your-openai-key-here (set in Supabase Edge Function secrets)
```

**Security Note:** These environment variables start with `EXPO_PUBLIC_` because they need to be accessible in the React Native client. The anon key is safe to expose as it's designed for client-side use with Row Level Security.

### Task 4: Create Supabase Client
**Create**: `src/services/supabaseClient.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Note: OpenAI API key is NOT exposed client-side
// OpenAI calls are handled via Supabase Edge Functions for security

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Disable for React Native
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Reasonable rate limit
    },
  },
});

// Export URL for debugging (safe to expose)
export const SUPABASE_URL = supabaseUrl;
```

### Task 5: Create Connection Test Utility
**Create**: `src/services/__tests__/connectionTest.ts`
```typescript
import { supabase } from '../supabaseClient';

export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('_test_table_that_does_not_exist')
      .select('*')
      .limit(1);

    // We expect this to fail with a specific error (table doesn't exist)
    // If it fails with connection error, that's a real problem
    if (error && error.message.includes('does not exist')) {
      console.log('✅ Supabase connection successful');
      return true;
    } else if (error && error.message.includes('network')) {
      console.error('❌ Network connection failed:', error.message);
      return false;
    } else if (error) {
      console.error('❌ Unexpected connection error:', error.message);
      return false;
    }

    // Should not reach here, but if we do, connection works
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
};

export const testEnvironmentVariables = (): boolean => {
  console.log('🔍 Testing environment variables...');
  
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY'
    // Note: OpenAI API key removed - handled server-side via Supabase Edge Functions
  ];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      console.error(`❌ Missing environment variable: ${varName}`);
      return false;
    }
    if (value.includes('your-') || value.includes('placeholder')) {
      console.error(`❌ Environment variable ${varName} still has placeholder value`);
      return false;
    }
  }

  console.log('✅ All environment variables configured');
  return true;
};
```

### Task 6: Create Basic Service Types
**Create**: `src/types/supabase.ts`
```typescript
export interface SupabaseResponse<T> {
  data: T | null;
  error: string | null;
  loading?: boolean;
}

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Basic connection status for debugging
export interface ConnectionStatus {
  connected: boolean;
  url: string;
  timestamp: string;
  error?: string;
}
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 2B
- [ ] Supabase project created and accessible
- [ ] Environment variables set correctly (no placeholders)
- [ ] Supabase client imports without errors
- [ ] Connection test passes
- [ ] No API keys committed to git
- [ ] TypeScript compilation successful

### Validation Commands
```bash
# Test environment variables
node -e "console.log('URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')"
node -e "console.log('Key:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')"

# Test TypeScript compilation
npx tsc --noEmit src/services/supabaseClient.ts
npx tsc --noEmit src/types/supabase.ts

# Test connection (run this in your development environment)
npx tsx src/services/__tests__/connectionTest.ts
```

### Manual Validation Steps
1. **Environment Check:**
   - Verify `.env` file has real values (not placeholders)
   - Confirm `.env` is in `.gitignore`
2. **Supabase Dashboard Check:**
   - Log into Supabase dashboard
   - Verify project exists and is active
   - Check that API keys match your `.env` file
3. **Import Test:**
   - Verify `import { supabase } from './services/supabaseClient'` works in any file

## What Sprint 2B Needs From This Sprint
- Working Supabase connection
- Environment variables properly configured
- Basic service types defined
- Connection testing utilities
- Clean foundation for database schema creation

## Interface Contracts (For Sprint 2B)
```typescript
// Supabase client ready for database operations
export const supabase: SupabaseClient;

// Type definitions for responses
export interface SupabaseResponse<T>;

// Connection testing utilities
export const testSupabaseConnection: () => Promise<boolean>;
```

## Common Mistakes to Avoid
- Don't use the service_role key in client code (security risk)
- Don't commit API keys to git (use .gitignore)
- Don't skip the connection test (prevents silent failures)
- Don't use placeholder values in production

## Troubleshooting

### If Supabase Connection Fails
1. **Check environment variables:**
   ```bash
   echo $EXPO_PUBLIC_SUPABASE_URL
   echo $EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```
2. **Verify URL format:** Should be `https://your-project-ref.supabase.co`
3. **Check anon key:** Should start with `eyJ` (it's a JWT token)
4. **Confirm project status:** In Supabase dashboard, ensure project is active

### If TypeScript Errors Occur
1. **Missing dependencies:** Run `npm install @supabase/supabase-js`
2. **Type errors:** Ensure TypeScript version is 4.5+
3. **Import errors:** Check file paths are correct

### If Environment Variables Don't Load
1. **File location:** Ensure `.env` is in project root
2. **Expo configuration:** Restart Expo dev server after changing `.env`
3. **Variable naming:** Must start with `EXPO_PUBLIC_` for client access

## Files Created This Sprint
- `src/services/supabaseClient.ts`
- `src/services/__tests__/connectionTest.ts`
- `src/types/supabase.ts`
- Updated `.env` with Supabase credentials

## Next Sprint Preview
Sprint 2B will create the complete database schema with all tables, Row Level Security policies, and performance indexes.

---
**Sprint 2A Focus**: Solid Supabase foundation that everything else builds upon.