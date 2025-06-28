# 🗄️ Agent 2 Sprint 2A: Voice-Enabled Backend Foundation

## Mission
Set up Supabase backend to process and store voice data while integrating with existing brain state and task systems.

## Sprint Goal
Create a voice-aware backend foundation that AGENT_3 can build upon for enhanced data operations.

## Time Estimate
45-60 minutes

## Prerequisites
- Pre-foundation complete
- AGENT_0 voice MVP working
- Voice session data structure established
- Basic Supabase connection active

## Critical Rules (NEVER VIOLATE)
1. Never lose voice session data
2. Maintain voice data privacy
3. Preserve voice-brain-state correlation
4. Use exact RLS policies
5. Handle offline voice data sync

## Sprint Tasks

### Task 1: Voice Data Schema
```sql
-- Voice Sessions Table
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  audio_url TEXT,
  transcription TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  mood_detected TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Voice metadata
  duration_seconds INTEGER,
  word_count INTEGER,
  is_accomplishment BOOLEAN DEFAULT false
);

-- Voice Tasks Table (extracted from voice)
CREATE TABLE voice_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_session_id UUID REFERENCES voice_sessions(id),
  task_text TEXT NOT NULL,
  energy_context INTEGER,
  priority_detected TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Link to main tasks system
  task_id UUID REFERENCES tasks(id)
);

-- Voice Brain States Table
CREATE TABLE voice_brain_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_session_id UUID REFERENCES voice_sessions(id),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  focus_detected TEXT,
  mood_detected TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Link to main brain states
  brain_state_id UUID REFERENCES brain_states(id)
);

-- Voice Accomplishments Table
CREATE TABLE voice_accomplishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_session_id UUID REFERENCES voice_sessions(id),
  accomplishment_text TEXT NOT NULL,
  energy_level INTEGER,
  celebration_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Task 2: Voice Data Service
```typescript
// src/services/voiceDataService.ts
import { supabase } from './supabaseClient';
import { VoiceSession, VoiceTask, VoiceBrainState } from '@voice/types';

export const voiceDataService = {
  // Voice Session Management
  async saveVoiceSession(session: Omit<VoiceSession, 'id'>): Promise<VoiceSession> {
    const { data, error } = await supabase
      .from('voice_sessions')
      .insert(session)
      .single();
      
    if (error) throw new Error('Voice session save failed');
    return data;
  },
  
  // Task Extraction Processing
  async processVoiceTasks(sessionId: string, tasks: Partial<VoiceTask>[]): Promise<VoiceTask[]> {
    const { data, error } = await supabase
      .from('voice_tasks')
      .insert(tasks.map(task => ({
        voice_session_id: sessionId,
        ...task
      })));
      
    if (error) throw new Error('Voice task processing failed');
    return data;
  },
  
  // Brain State Correlation
  async correlateVoiceBrainState(
    sessionId: string, 
    brainState: Partial<VoiceBrainState>
  ): Promise<VoiceBrainState> {
    const { data, error } = await supabase
      .from('voice_brain_states')
      .insert({
        voice_session_id: sessionId,
        ...brainState
      })
      .single();
      
    if (error) throw new Error('Brain state correlation failed');
    return data;
  },
  
  // Accomplishment Tracking
  async recordVoiceAccomplishment(
    sessionId: string,
    accomplishment: { text: string; energyLevel: number }
  ) {
    const { error } = await supabase
      .from('voice_accomplishments')
      .insert({
        voice_session_id: sessionId,
        accomplishment_text: accomplishment.text,
        energy_level: accomplishment.energyLevel
      });
      
    if (error) throw new Error('Accomplishment recording failed');
  }
};
```

### Task 3: Row Level Security
```sql
-- Voice Sessions RLS
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own voice sessions"
  ON voice_sessions
  FOR ALL
  USING (auth.uid() = user_id);

-- Voice Tasks RLS
ALTER TABLE voice_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access tasks from their voice sessions"
  ON voice_tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM voice_sessions
      WHERE voice_sessions.id = voice_tasks.voice_session_id
      AND voice_sessions.user_id = auth.uid()
    )
  );

-- Similar RLS for other voice tables...
```

### Task 4: Voice Analytics Functions
```sql
-- Voice Session Analytics
CREATE OR REPLACE FUNCTION get_voice_session_analytics(
  user_id UUID,
  time_period INTERVAL
)
RETURNS TABLE (
  total_sessions INTEGER,
  avg_energy_level NUMERIC,
  task_completion_rate NUMERIC,
  most_productive_time_of_day TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- Analytics implementation
  SELECT 
    COUNT(*),
    AVG(energy_level)::NUMERIC,
    -- ... other analytics
  FROM voice_sessions
  WHERE 
    voice_sessions.user_id = get_voice_session_analytics.user_id
    AND created_at > NOW() - time_period;
END;
$$;
```

### Task 5: Offline Sync Support
```typescript
// src/services/voiceOfflineSync.ts
export const voiceOfflineSync = {
  async queueVoiceSession(session: VoiceSession): Promise<void> {
    // Queue for sync when online
    await AsyncStorage.setItem(
      `voice_session_queue_${Date.now()}`,
      JSON.stringify(session)
    );
  },
  
  async syncQueuedSessions(): Promise<void> {
    // Sync when back online
    const keys = await AsyncStorage.getAllKeys();
    const sessionKeys = keys.filter(k => k.startsWith('voice_session_queue_'));
    
    for (const key of sessionKeys) {
      const session = JSON.parse(await AsyncStorage.getItem(key));
      await voiceDataService.saveVoiceSession(session);
      await AsyncStorage.removeItem(key);
    }
  }
};
```

## Success Criteria
- [ ] Voice session storage working
- [ ] Task extraction processing functional
- [ ] Brain state correlation active
- [ ] Accomplishment tracking ready
- [ ] RLS policies protecting voice data
- [ ] Offline sync functioning
- [ ] Analytics functions ready

## Validation Commands
```bash
# Test voice data schema
npm run test:voice-schema

# Verify RLS policies
npm run test:voice-security

# Test offline sync
npm run test:voice-offline
```

## What Sprint 2B Needs
- Complete voice data schema
- Voice processing services
- Security policies
- Analytics foundation
- Offline capabilities

## Common Mistakes to Avoid
- Don't lose offline voice data
- Don't skip voice data validation
- Don't break RLS policies
- Don't mix voice/non-voice data
- Don't ignore analytics needs

## Files Created/Modified
- Voice schema migrations
- Voice data services
- RLS policies
- Analytics functions
- Offline sync utilities

## Next Sprint Preview
Sprint 2B will add enhanced voice data processing and task extraction algorithms.

---
**Sprint 2A Focus**: Solid voice data foundation that everything builds upon.