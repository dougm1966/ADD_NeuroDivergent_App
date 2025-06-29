# 🧠 Agent 3 Sprint 3A: Voice-Enhanced Brain State Store

## Mission
Create a brain state tracking system that seamlessly integrates voice data while enabling progressive enhancement to full slider-based tracking.

## Sprint Goal
Build a voice-aware brain state store that correlates voice energy levels with brain states and enables gradual progression to sophisticated tracking.

## Time Estimate
45-60 minutes

## Prerequisites
- AGENT_0 voice MVP working
- Voice session data available
- Basic brain state structure defined
- Zustand store foundation ready

## Critical Rules (NEVER VIOLATE)
1. Voice MUST inform brain state
2. Progressive enhancement only
3. Never lose voice context
4. Keep all UI shame-free
5. Honor energy levels

## Sprint Tasks

### Task 1: Voice-Enhanced Brain State Store
```typescript
// src/store/voiceBrainStateStore.ts
import { create } from 'zustand';
import { VoiceSession } from '@voice/types';

interface VoiceBrainState {
  // Core state
  currentState: BrainState;
  voiceSession: VoiceSession | null;
  isVoiceMode: boolean;
  
  // Voice correlation
  voiceEnergyLevel: number | null;
  voiceMoodDetected: string | null;
  voicePatternInsights: string[];
  
  // Actions
  correlateVoiceSession: (session: VoiceSession) => Promise<void>;
  progressToSliders: () => void;
  updateFromVoice: (energy: number, mood: string) => void;
  getSuggestedState: () => Partial<BrainState>;
}

export const useVoiceBrainStore = create<VoiceBrainState>((set, get) => ({
  // Initial state
  currentState: null,
  voiceSession: null,
  isVoiceMode: true, // Start with voice
  voiceEnergyLevel: null,
  voiceMoodDetected: null,
  voicePatternInsights: [],
  
  // Voice correlation
  correlateVoiceSession: async (session: VoiceSession) => {
    const brainState = await voiceBrainCorrelator.correlate(session);
    set({
      voiceSession: session,
      voiceEnergyLevel: session.energy_level,
      voiceMoodDetected: session.mood_detected,
      currentState: {
        ...get().currentState,
        ...brainState
      }
    });
  },
  
  // Progressive enhancement
  progressToSliders: () => {
    if (!get().currentState) return;
    
    set({
      isVoiceMode: false,
      // Preserve voice context in slider mode
      currentState: {
        ...get().currentState,
        hasVoiceContext: true
      }
    });
  },
  
  // Voice updates
  updateFromVoice: (energy: number, mood: string) => {
    set({
      voiceEnergyLevel: energy,
      voiceMoodDetected: mood,
      currentState: {
        ...get().currentState,
        energy_level: energy,
        mood: mood
      }
    });
  },
  
  // Brain state suggestions
  getSuggestedState: () => {
    const { voicePatternInsights, voiceEnergyLevel } = get();
    return voiceBrainCorrelator.suggestState(
      voicePatternInsights,
      voiceEnergyLevel
    );
  }
}));
```

### Task 2: Voice-Brain Correlation Service
```typescript
// src/services/voiceBrainCorrelator.ts
export class VoiceBrainCorrelator {
  async correlate(session: VoiceSession): Promise<Partial<BrainState>> {
    const energyLevel = this.correlateEnergy(session);
    const mood = this.correlateMood(session);
    const focus = this.correlateFocus(session);
    
    return {
      energy_level: energyLevel,
      mood,
      focus_level: focus,
      voice_context: {
        session_id: session.id,
        pattern_insights: await this.analyzePatterns(session)
      }
    };
  }
  
  private correlateEnergy(session: VoiceSession): number {
    // Map voice energy to brain state energy
    return this.normalizeEnergyLevel(
      session.energy_level,
      session.word_count,
      session.duration_seconds
    );
  }
  
  private correlateMood(session: VoiceSession): string {
    // Extract mood from voice analysis
    return session.mood_detected || 'neutral';
  }
  
  async analyzePatterns(session: VoiceSession): Promise<string[]> {
    // Analyze voice patterns for insights
    return this.patternAnalyzer.analyze(session);
  }
}
```

### Task 3: Progressive Enhancement Manager
```typescript
// src/services/progressiveEnhancement.ts
export class BrainStateEnhancer {
  async checkReadyForSliders(userId: string): Promise<boolean> {
    const voiceHistory = await this.getVoiceHistory(userId);
    return this.evaluateProgression(voiceHistory);
  }
  
  private evaluateProgression(history: VoiceSession[]): boolean {
    // Check if user is ready for slider enhancement
    const hasConsistentVoiceUse = history.length >= 5;
    const hasStablePatterns = this.analyzePatternStability(history);
    const hasGoodEnergyTracking = this.checkEnergyTracking(history);
    
    return hasConsistentVoiceUse && 
           hasStablePatterns && 
           hasGoodEnergyTracking;
  }
  
  async enhanceToBrainState(
    voiceHistory: VoiceSession[]
  ): Promise<BrainState> {
    // Convert voice history to initial brain state
    return this.voiceBrainCorrelator.synthesizeBrainState(voiceHistory);
  }
}
```

### Task 4: Brain State Pattern Analysis
```typescript
// src/services/brainStatePatterns.ts
export class BrainStatePatternAnalyzer {
  async analyzeVoicePatterns(
    sessions: VoiceSession[]
  ): Promise<BrainStatePattern[]> {
    const patterns = [];
    
    // Analyze energy patterns
    patterns.push(
      await this.analyzeEnergyTrends(sessions)
    );
    
    // Analyze mood patterns
    patterns.push(
      await this.analyzeMoodPatterns(sessions)
    );
    
    // Analyze time-of-day patterns
    patterns.push(
      await this.analyzeTimePatterns(sessions)
    );
    
    return patterns;
  }
  
  private async analyzeEnergyTrends(
    sessions: VoiceSession[]
  ): Promise<EnergyPattern> {
    // Extract energy trends from voice sessions
    return this.energyAnalyzer.analyzeTrends(sessions);
  }
}
```

### Task 5: Voice-Informed Suggestions
```typescript
// src/services/brainStateSuggestions.ts
export class BrainStateSuggester {
  async suggestFromVoice(
    session: VoiceSession
  ): Promise<Partial<BrainState>> {
    const patterns = await this.patternAnalyzer.analyzeVoicePatterns([session]);
    const timeContext = this.getTimeContext();
    
    return {
      suggested_energy: this.suggestEnergyLevel(patterns, timeContext),
      suggested_focus: this.suggestFocusLevel(patterns, timeContext),
      suggested_mood: session.mood_detected,
      confidence_level: this.calculateConfidence(patterns)
    };
  }
  
  private suggestEnergyLevel(
    patterns: BrainStatePattern[],
    timeContext: TimeContext
  ): number {
    // Use voice patterns to suggest energy level
    return this.energyPredictor.predict(patterns, timeContext);
  }
}
```

## Success Criteria
- [ ] Voice energy correlates to brain state
- [ ] Voice sessions inform brain patterns
- [ ] Progressive enhancement working
- [ ] Pattern analysis providing insights
- [ ] Suggestions based on voice data
- [ ] All correlations are accurate

## Validation Commands
```bash
# Test voice correlation
npm run test:voice-correlation

# Verify progressive enhancement
npm run test:enhancement-flow

# Test pattern analysis
npm run test:voice-patterns
```

## What Sprint 3B Needs
- Working voice correlation
- Brain state patterns
- Enhancement system
- Voice-based suggestions
- Pattern analysis

## Common Mistakes to Avoid
- Don't lose voice context
- Don't force slider progression
- Don't ignore voice patterns
- Don't make inaccurate correlations
- Don't break voice-first experience

## Files Created/Modified
- Voice brain state store
- Correlation service
- Enhancement manager
- Pattern analyzer
- Suggestion system

## Next Sprint Preview
Sprint 3B will add advanced brain state adaptation based on voice patterns.

---
**Sprint 3A Focus**: Voice-brain state correlation and progressive enhancement.