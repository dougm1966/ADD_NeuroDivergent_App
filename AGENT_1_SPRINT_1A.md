# 🏗️ Agent 1 Sprint 1A: Foundation Setup

## Mission
Set up basic Expo React Native project with TypeScript and create the core folder structure.

## Sprint Goal
Get a working Expo project running with TypeScript, proper folder structure, and environment variables configured.

**CRITICAL**: Work in the CURRENT project folder. Do NOT create new app folders!

## Time Estimate
1-2 hours

## Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally
- Follow COMMANDS.md exactly for versions

## Critical Rules (NEVER VIOLATE)
1. Tech Stack: Expo React Native + TypeScript + Supabase ONLY
2. Use EXACT versions from COMMANDS.md
3. No red colors anywhere (neurodivergent-friendly)
4. Follow exact folder structure

## Sprint Tasks

### Task 1: Initialize Expo Project
**IMPORTANT**: We work in the CURRENT project folder - do NOT create new folders!

```bash
# Initialize Expo in current directory (we're already in the right place)
npx create-expo-app@latest . --template blank-typescript

# Install dependencies in current directory
npm install zustand@4.5.2
npm install @supabase/supabase-js@2.39.3
npm install @react-navigation/native@6.1.17
npm install @react-navigation/stack@6.3.29
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage@1.21.0
```

### Task 2: Create Folder Structure
```bash
# Create src folder structure in current directory
mkdir -p src/components src/screens src/store src/services src/types src/utils src/constants src/navigation
```

### Task 3: Environment Variables Setup
**Create**: `.env`
```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
# Note: OpenAI API key is handled server-side via Supabase Edge Functions for security
```

### Task 4: TypeScript Configuration
**Update**: `tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Task 5: Basic App Configuration
**Create**: `src/constants/config.ts`
```typescript
export const APP_CONFIG = {
  APP_NAME: 'NeuroProductivity',
  VERSION: '1.0.0',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
} as const;
```

### Task 6: Basic Type Definitions
**Create**: `src/types/navigation.ts`
```typescript
import { NavigationProp, RouteProp } from '@react-navigation/native';

// Basic navigation types for Sprint 1A
export type RootStackParamList = {
  BrainStateCheckin: undefined;
  TaskList: undefined;
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
```

### Task 7: Root App Component
**Create**: `App.tsx` (replace existing)
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { APP_CONFIG } from './src/constants/config';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {APP_CONFIG.APP_NAME} - Foundation Ready
      </Text>
      <Text style={styles.subtitle}>
        Sprint 1A Complete - Navigation Coming Next
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 1B
- [ ] `npx expo start` runs without errors
- [ ] App displays "Foundation Ready" message
- [ ] TypeScript compilation works: `npx tsc --noEmit`
- [ ] All folders exist: `src/components`, `src/screens`, `src/store`, `src/services`, `src/types`, `src/utils`, `src/constants`, `src/navigation`
- [ ] Environment variables file created (even with placeholders)
- [ ] `APP_CONFIG` imports successfully

### Validation Commands
```bash
# Test app boot
npx expo start --clear

# Test TypeScript
npx tsc --noEmit

# Test folder structure
ls -la src/
```

## What Sprint 1B Needs From This Sprint
- Working Expo project that boots without errors
- `/src/types/navigation.ts` with `RootStackParamList` and `ScreenProps<T>`
- Folder structure ready for navigation components
- TypeScript configuration working

## Common Mistakes to Avoid
- Don't install Redux (use Zustand only)
- Don't skip TypeScript strict mode
- Don't use different versions than specified
- Don't modify the folder structure

## Troubleshooting

### If Expo Won't Start
1. Clear cache: `npx expo start --clear`
2. Delete node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 18+)

### If TypeScript Errors
1. Check tsconfig.json matches exactly
2. Verify all imports use proper paths
3. Run `npx tsc --noEmit` to see specific errors

## Files Created This Sprint
- `App.tsx` (updated)
- `src/constants/config.ts`
- `src/types/navigation.ts`
- `.env` (template)
- Folder structure

## Next Sprint Preview
Sprint 1B will add React Navigation 6.1.17 with three placeholder screens and working navigation between them.

---
**Sprint 1A Focus**: Get the foundation rock-solid before building anything else.