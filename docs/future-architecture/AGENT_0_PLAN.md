# 🎤 Agent 0: Voice Entry Specialist

## Mission
Create the voice-first entry point for the ADHD productivity app using minimal foundation, providing a gentle onboarding experience that will later be enhanced by AGENT_1's sophisticated features.

## Dependencies
- **Required**: Pre-foundation setup ONLY
- **Provides**: Voice data and user progression metrics TO AGENT_1
- **Branch**: `agent0/voice-mvp`
- **Files**: `/src/voice/*` (minimal structure)

## Critical Rules (NEVER VIOLATE)
1. Use ONLY pre-foundation infrastructure
2. NO dependencies on AGENT_1 features
3. Voice-only UI (no sophisticated components)
4. Shame-free voice interactions
5. Energy-aware task extraction
6. Clear data structure for AGENT_1 enhancement

## Technical Foundation (From Pre-Foundation ONLY)
- Expo with TypeScript
- Basic Supabase connection
- Voice recording capabilities
- Simple voice_sessions table
- Minimal environment setup

## 2-Week Development Plan

### Sprint 0A: Voice Recording MVP (Week 1)
**Time**: 45-60 minutes | **Lines**: ~200
- Voice recording using @react-native-voice/voice
- Basic transcription storage
- Simple energy/emotion detection
- Minimal UI for voice interaction

**Technical Scope**:
```typescript
interface VoiceSession {
  id: string;
  audioUrl: string;
  transcript: string;
  timestamp: Date;
  energyIndicators: {
    level: number;
    confidence: number;
  };
}
```

### Sprint 0B: Task Processing (Week 2)
**Time**: 60-75 minutes | **Lines**: ~250
- Task extraction from transcripts
- Basic accomplishment tracking
- Simple celebration messages
- Preparation for AGENT_1 handoff

**Data Structure for AGENT_1**:
```typescript
interface VoiceHandoffPackage {
  sessionData: VoiceSession[];
  extractedTasks: {
    description: string;
    energyLevel: number;
    status: 'pending' | 'completed';
  }[];
  userMetrics: {
    averageEnergy: number;
    completionRate: number;
    preferredTimes: string[];
  };
}
```

## Handoff TO AGENT_1

### Data Preparation
1. Clean voice session data
2. Structure extracted tasks
3. Compile user metrics
4. Document voice patterns

### Integration Points
```typescript
// Ready for AGENT_1 enhancement
interface VoiceToAgent1 {
  voiceSessions: VoiceSession[];
  taskExtraction: TaskExtraction;
  energyPatterns: EnergyMetrics;
  userProgression: ProgressionStage;
}
```

## Success Criteria
- Working voice recording/transcription
- Basic task extraction
- Simple energy detection
- Accomplishment tracking
- Clean data structure for AGENT_1

## Performance Requirements
- Voice recording latency: < 100ms
- Transcription processing: < 2 seconds
- Task extraction: < 1 second
- Database writes: < 500ms
- Zero dependency on AGENT_1 features

## Common Mistakes to Avoid
- Don't add navigation (AGENT_1's job)
- Don't implement error handling (AGENT_1's job)
- Don't create sophisticated UI (AGENT_1's job)
- Don't add testing infrastructure (AGENT_1's job)
- Don't implement state management (AGENT_1's job)

## Data Flow
```
Voice Recording → Transcription → Task Extraction → Basic Storage
     ↓
[AGENT_1 Enhancement Later]
     ↓
[Sophisticated Features]
```

## Files Created by AGENT_0
- `/src/voice/VoiceRecorder.ts`
- `/src/voice/Transcription.ts`
- `/src/voice/TaskExtractor.ts`
- `/src/voice/EnergyDetector.ts`
- `/src/voice/types.ts`

## Integration Timeline
1. Complete voice MVP (2 weeks)
2. Handoff to AGENT_1 for enhancement
3. Support AGENT_1's sophisticated feature integration

---
**AGENT_0 Focus**: Create working voice MVP using minimal foundation, preparing for AGENT_1's enhancements.