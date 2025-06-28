# 🎤 Agent 0 Sprint 0A: Voice Foundation

## Sprint Goal
Implement core voice recording, transcription, and basic task extraction functionality.

## Time Estimate
45-60 minutes

## Prerequisites
- Expo React Native project (from AGENT_1)
- TypeScript configuration
- Supabase voice_sessions table created

## Critical Rules (NEVER VIOLATE)
1. Voice-only UI (no complex elements)
2. Shame-free messaging throughout
3. Immediate feedback on voice input
4. Error handling must be gentle
5. No technical jargon in user messages

## Sprint Tasks

### Task 1: Voice Recording Setup
```typescript
// Core voice recording functionality
interface VoiceRecorder {
  startRecording(): Promise<void>;
  stopRecording(): Promise<AudioBlob>;
  isRecording: boolean;
}
```

### Task 2: Transcription Service
```typescript
interface TranscriptionService {
  transcribe(audio: AudioBlob): Promise<string>;
  getStatus(): TranscriptionStatus;
}
```

### Task 3: Energy Detection
```typescript
interface EnergyDetector {
  analyzeEnergy(transcript: string): Promise<EnergyLevel>;
  detectEmotions(transcript: string): Promise<EmotionalState>;
}
```

### Task 4: Basic Task Extraction
```typescript
interface TaskExtractor {
  extractTasks(transcript: string): Promise<Task[]>;
  prioritize(tasks: Task[], energy: EnergyLevel): Task[];
}
```

## Success Criteria
- [ ] Voice recording works reliably
- [ ] Transcription is accurate
- [ ] Basic energy detection functions
- [ ] Simple tasks can be extracted
- [ ] All error messages are shame-free

## Validation Commands
```bash
# Test voice recording
npm run test:voice-recording

# Verify transcription
npm run test:transcription

# Test energy detection
npm run test:energy-detection
```

## What Sprint 0B Needs
- Working voice recording
- Reliable transcription
- Basic energy detection
- Simple task extraction

## Common Mistakes to Avoid
- Don't add visual complexity
- Don't skip error handling
- Don't use technical terms
- Don't rush user feedback

## Files Created This Sprint
- `/src/voice/VoiceRecorder.ts`
- `/src/voice/TranscriptionService.ts`
- `/src/voice/EnergyDetector.ts`
- `/src/voice/TaskExtractor.ts`
- `/src/voice/types.ts`

## Next Sprint Preview
Sprint 0B will enhance task processing and implement the celebration system.