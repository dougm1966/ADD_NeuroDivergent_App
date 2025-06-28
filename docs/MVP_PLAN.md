# 🎯 Simplified Voice MVP Plan

## Core Value Proposition
Convert voice brain dump → actionable tasks (that's it!)

## Tech Stack (Minimal)
- Expo + React Native (quick setup, cross-platform)
- React Native Voice (voice recording)
- OpenAI API (task extraction)
- Local storage (skip backend for now)

## MVP Components (3 Total)
1. Record Button
   - Single screen, big button
   - Records voice (max 2 minutes)
   - Shows recording status

2. Task Display
   - Shows extracted tasks
   - Simple list view
   - No editing needed for MVP

3. Basic Settings
   - OpenAI API key input
   - That's it

## Development Steps (5 Days)

### Day 1: Project Setup
```bash
# Morning: Setup
npx create-expo-app voice-adhd --template expo-template-blank-typescript
cd voice-adhd
npm install @react-native-voice/voice openai @react-native-async-storage/async-storage

# Afternoon: Basic UI
- Single screen with record button
- Recording status indicator
```

### Day 2: Voice Recording
```typescript
// Core voice recording functionality
- Implement start/stop recording
- Save audio to transcript
- Basic error handling
```

### Day 3: OpenAI Integration
```typescript
// Simple task extraction
- Add API key storage
- Send transcript to OpenAI
- Parse response to tasks
```

### Day 4: Task Display
```typescript
// Minimal task view
- Show extracted tasks
- Basic styling
- Loading states
```

### Day 5: Testing & Fixes
- Test with real users
- Fix critical bugs
- Package for distribution

## MVP Success Criteria
1. Can record voice ✓
2. Can extract tasks ✓
3. Can read tasks ✓

## Explicitly Skipping (For Now)
- User accounts
- Cloud storage
- Energy detection
- Multiple screens
- Settings (except API key)
- Accomplishment tracking
- Celebrations
- Analytics
- Body doubling
- Offline support
- Complex UI
- Backend infrastructure
- Multi-language support

## Testing Plan
1. Record brain dump
2. See extracted tasks
3. That's it!

## Next Steps (Post-MVP)
1. Get real user feedback
2. Identify critical missing features
3. Then plan next iteration

Remember: The goal is WORKING voice-to-task conversion. Everything else is scope creep.