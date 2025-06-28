# 🛠️ Pre-Foundation Setup: Minimal Voice Foundation

## Mission
Create the absolute minimal technical foundation required for voice MVP, excluding all sophisticated features and infrastructure that can wait for AGENT_1.

## Strict Scope Limitations
✅ ONLY Include:
- Basic Expo project setup
- Minimal TypeScript configuration
- Voice recording dependencies
- Simple Supabase voice data table
- Basic environment variables

❌ DO NOT Include:
- Navigation framework (AGENT_1)
- Error handling system (AGENT_1)
- Testing setup (AGENT_1)
- State management (AGENT_1)
- Complex folder structure (AGENT_1)
- UI components (AGENT_1)

## Morning Tasks (3 hours)

### 1. Minimal Expo Setup
```bash
# Create bare minimum Expo project
npx create-expo-app@latest . --template blank-typescript

# Install only essential dependencies
npm install @react-native-voice/voice@3.2.4
npm install @supabase/supabase-js@2.39.3
npm install @react-native-async-storage/async-storage@1.21.0
```

### 2. Basic TypeScript Setup
```json
// tsconfig.json - MINIMAL CONFIG
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "*": ["*"]
    }
  }
}
```

### 3. Minimal Project Structure
```
/
├── App.tsx           # Minimal app shell
├── src/
│   ├── voice/       # Voice recording only
│   └── types/       # Basic type definitions
└── .env             # Supabase credentials only
```

## Afternoon Tasks (3 hours)

### 4. Supabase Voice Table
```sql
-- ONLY the essential voice table
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  audio_url TEXT,
  transcript TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Minimal RLS policy
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own voice sessions"
  ON voice_sessions
  FOR ALL
  USING (auth.uid() = user_id);
```

### 5. Voice Recording Setup
```typescript
// src/voice/types.ts
export interface VoiceRecording {
  audioUrl: string;
  transcript: string | null;
}

// src/voice/VoiceRecorder.ts
import Voice from '@react-native-voice/voice';
// Minimal recording implementation
```

### 6. Environment Setup
```bash
# .env - MINIMAL ENV VARS
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Success Criteria (ALL Required)
1. `npx expo start` runs successfully
2. Voice recording works on device
3. Supabase connection successful
4. Can save voice session to database
5. TypeScript compiles without errors

## What NOT to Include (Wait for AGENT_1)
1. ❌ No navigation setup
2. ❌ No error boundaries
3. ❌ No testing configuration
4. ❌ No state management
5. ❌ No UI components
6. ❌ No complex folder structure
7. ❌ No documentation setup
8. ❌ No deployment configuration

## Validation Commands
```bash
# ONLY these checks
npx expo start --clear
npx tsc --noEmit
```

## Handoff Requirements for AGENT_0

### What AGENT_0 Gets
- Working Expo project
- Voice recording capability
- Basic Supabase connection
- Simple voice_sessions table

### What AGENT_0 Must Handle
- Voice UI implementation
- Task extraction logic
- Energy/emotion detection
- Accomplishment tracking

## Common Mistakes to Avoid
1. Don't add ANY features that can wait for AGENT_1
2. Don't create complex folder structures
3. Don't install unnecessary dependencies
4. Don't implement navigation or routing
5. Don't set up testing or error handling

## Emergency Contacts
- Technical Lead: [Contact]
- Supabase Support: [Contact]
- Expo Support: [Contact]

---
Remember: This is ONLY the minimal foundation needed for voice MVP. Everything else comes later with AGENT_1.