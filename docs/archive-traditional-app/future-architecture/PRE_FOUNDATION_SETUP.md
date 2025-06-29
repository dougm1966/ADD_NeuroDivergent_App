# 🚀 Pre-Foundation Setup Guide (1-Day Implementation)

## Overview
Minimal setup for voice MVP without full infrastructure dependencies.

## Prerequisites
- Node.js 18+
- Git
- Android Studio or Xcode
- Supabase account

## Step 1: Project Initialization (15 minutes)

```bash
# Initialize new Expo project with TypeScript template
npx create-expo-app@latest ADD_NeuroDivergent_App -t expo-template-blank-typescript

# Navigate to project
cd ADD_NeuroDivergent_App

# Install minimal required dependencies
npm install @react-native-voice/voice @supabase/supabase-js react-native-url-polyfill
```

## Step 2: TypeScript Configuration (10 minutes)

Create minimal `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@types": ["./src/types"],
      "@services": ["./src/services"],
      "@components": ["./src/components"]
    }
  }
}
```

Create basic type definitions (`src/types/index.ts`):
```typescript
export interface VoiceSession {
  id: string;
  audioUrl: string | null;
  transcript: string;
  timestamp: Date;
  energyLevel: number;
}

export interface VoiceError {
  code: string;
  message: string;
}
```

## Step 3: Supabase Setup (15 minutes)

### 3.1 Create `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3.2 Create Supabase client (`src/services/supabase.ts`):
```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3.3 Create voice sessions table in Supabase:
```sql
-- Run in Supabase SQL editor
create table if not exists voice_sessions (
  id uuid primary key default uuid_generate_v4(),
  audio_url text,
  transcript text,
  energy_level integer check (energy_level between 1 and 10),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Minimal indexes for basic queries
  constraint energy_level_range check (energy_level >= 1 and energy_level <= 10)
);

-- Basic RLS policies
alter table voice_sessions enable row level security;

create policy "Public voice sessions are viewable by everyone"
  on voice_sessions for select
  using ( true );

create policy "Users can insert their own voice sessions"
  on voice_sessions for insert
  with check ( true );
```

## Step 4: Voice Recording Setup (30 minutes)

### 4.1 Create voice service (`src/services/voice.ts`):
```typescript
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent
} from '@react-native-voice/voice';
import { VoiceSession, VoiceError } from '@types';
import { supabase } from './supabase';

export class VoiceService {
  private isRecording = false;

  constructor() {
    Voice.onSpeechResults = this.handleSpeechResults;
    Voice.onSpeechError = this.handleSpeechError;
  }

  async startRecording(): Promise<void> {
    try {
      this.isRecording = true;
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting recording:', error);
      this.isRecording = false;
      throw error;
    }
  }

  async stopRecording(): Promise<void> {
    try {
      await Voice.stop();
      this.isRecording = false;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  private handleSpeechResults = async (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      const session: VoiceSession = {
        id: crypto.randomUUID(),
        audioUrl: null, // Basic MVP doesn't store audio
        transcript: e.value[0],
        timestamp: new Date(),
        energyLevel: 5 // Default energy level for MVP
      };

      await this.saveSession(session);
    }
  };

  private handleSpeechError = (e: SpeechErrorEvent) => {
    console.error('Speech recognition error:', e);
  };

  private async saveSession(session: VoiceSession): Promise<void> {
    const { error } = await supabase
      .from('voice_sessions')
      .insert([session]);

    if (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }
}
```

### 4.2 Create basic voice component (`src/components/VoiceRecorder.tsx`):
```typescript
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { VoiceService } from '@services/voice';

export const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const voiceService = new VoiceService();

  const handlePress = async () => {
    try {
      if (isRecording) {
        await voiceService.stopRecording();
      } else {
        await voiceService.startRecording();
      }
      setIsRecording(!isRecording);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={handlePress}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#666', // Gentle error color
    marginTop: 10,
  },
});
```

### 4.3 Update App.tsx:
```typescript
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { VoiceRecorder } from '@components/VoiceRecorder';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <VoiceRecorder />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

## Step 5: Permission Setup (15 minutes)

### 5.1 Update app.json:
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-voice/voice",
        {
          "microphonePermission": "Allow Voice MVP to access the microphone",
          "speechRecognitionPermission": "Allow Voice MVP to access speech recognition"
        }
      ]
    ]
  }
}
```

## Step 6: Validation (15 minutes)

### 6.1 Test voice recording:
```bash
# Start Expo development server
npx expo start

# In another terminal, run Android
npx expo run:android

# Or for iOS
npx expo run:ios
```

### 6.2 Validation Checklist:
- [ ] App builds successfully
- [ ] Voice recording starts/stops
- [ ] Transcription appears
- [ ] Sessions save to Supabase
- [ ] Basic error messages show

## Common Issues & Solutions

### Voice Recognition Not Working
1. Check microphone permissions
2. Verify internet connection
3. Confirm language settings

### Supabase Connection Issues
1. Verify environment variables
2. Check RLS policies
3. Confirm table structure

## Next Steps for AGENT_0
- Voice MVP implementation
- Task extraction
- Energy detection
- Handoff preparation

## Files Created
```
ADD_NeuroDivergent_App/
├── src/
│   ├── components/
│   │   └── VoiceRecorder.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   └── voice.ts
│   └── types/
│       └── index.ts
├── .env
├── app.json
├── App.tsx
└── tsconfig.json
```

## Time Allocation
- Project Setup: 15 minutes
- TypeScript Config: 10 minutes
- Supabase Setup: 15 minutes
- Voice Setup: 30 minutes
- Permissions: 15 minutes
- Validation: 15 minutes
- Buffer: 20 minutes
Total: 2 hours (with buffer for issues)

---
**Note**: This setup provides only the minimal foundation needed for AGENT_0's voice MVP. All sophisticated features (navigation, error handling, testing) are intentionally omitted for AGENT_1's enhancement phase.