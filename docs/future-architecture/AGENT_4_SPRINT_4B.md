# 🎨 Agent 4 Sprint 4B: Voice Interaction Components

## Mission
Create a suite of neurodivergent-friendly voice interaction components that provide gentle, responsive feedback and celebration.

## Sprint Goal
Build core voice UI components that make voice interaction intuitive, encouraging, and energy-aware.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 4A design system complete
- Voice recording functionality working
- Animation patterns established
- Energy-based adaptations ready

## Critical Rules (NEVER VIOLATE)
1. All components must be shame-free
2. Honor energy-based adaptations
3. Use gentle animations only
4. Maintain consistent feedback
5. Support offline gracefully

## Sprint Tasks

### Task 1: Voice Recording Button
```typescript
// src/components/voice/VoiceRecordingButton.tsx
import React from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { COLORS, ANIMATIONS, SPACING } from '@constants';
import { useVoiceState } from '@hooks';

interface Props {
  onStartRecording: () => void;
  onStopRecording: () => void;
  energyLevel?: number;
}

export const VoiceRecordingButton: React.FC<Props> = ({
  onStartRecording,
  onStopRecording,
  energyLevel = 5
}) => {
  const { isRecording, isProcessing } = useVoiceState();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: ANIMATIONS.VOICE_RECORDING.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: ANIMATIONS.VOICE_RECORDING.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [isRecording]);

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: pulseAnim }] }
    ]}>
      <Pressable
        onPress={() => isRecording ? onStopRecording() : onStartRecording()}
        style={[
          styles.button,
          isRecording && styles.recording,
          isProcessing && styles.processing
        ]}
        accessibilityLabel={isRecording ? "Stop recording" : "Start recording"}
        accessibilityHint="Double tap to toggle voice recording"
      >
        <VoiceButtonContent
          isRecording={isRecording}
          isProcessing={isProcessing}
          energyLevel={energyLevel}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: SPACING.VOICE_BUTTON.SIZE,
    height: SPACING.VOICE_BUTTON.SIZE,
    borderRadius: SPACING.VOICE_BUTTON.SIZE / 2,
    backgroundColor: COLORS.VOICE_BUTTON_IDLE,
    ...UI_PATTERNS.VOICE_BUTTON
  },
  recording: {
    backgroundColor: COLORS.VOICE_BUTTON_RECORDING,
  },
  processing: {
    backgroundColor: COLORS.VOICE_BUTTON_PROCESSING,
  }
});
```

### Task 2: Voice Activity Indicator
```typescript
// src/components/voice/VoiceActivityIndicator.tsx
export const VoiceActivityIndicator: React.FC<{
  isActive: boolean;
  energy: number;
}> = ({ isActive, energy }) => {
  const waveAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: getAnimationDuration(energy),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: getAnimationDuration(energy),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ).start();
    }
  }, [isActive, energy]);

  return (
    <View style={styles.container}>
      <WaveVisualizer
        animation={waveAnim}
        energy={energy}
        style={styles.waves}
      />
      <EnergyIndicator level={energy} />
    </View>
  );
};
```

### Task 3: Voice Transcript Display
```typescript
// src/components/voice/VoiceTranscriptDisplay.tsx
export const VoiceTranscriptDisplay: React.FC<{
  transcript: string;
  isProcessing: boolean;
}> = ({ transcript, isProcessing }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (transcript) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [transcript]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.transcript}>
        {transcript || "Listening..."}
      </Text>
      {isProcessing && (
        <ProcessingIndicator style={styles.processing} />
      )}
    </Animated.View>
  );
};
```

### Task 4: Voice Celebration Card
```typescript
// src/components/voice/VoiceCelebrationCard.tsx
export const VoiceCelebrationCard: React.FC<{
  accomplishment: string;
  energy: number;
}> = ({ accomplishment, energy }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        damping: 15,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 12,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <GentleCelebrationIcon energy={energy} />
      <Text style={styles.accomplishment}>
        {getGentlePraise(accomplishment)}
      </Text>
    </Animated.View>
  );
};
```

### Task 5: Voice Energy Indicator
```typescript
// src/components/voice/VoiceEnergyIndicator.tsx
export const VoiceEnergyIndicator: React.FC<{
  level: number;
  showLabel?: boolean;
}> = ({ level, showLabel = true }) => {
  const energyAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(energyAnim, {
      toValue: level / 10,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false
    }).start();
  }, [level]);

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          {getEnergyLabel(level)}
        </Text>
      )}
      <Animated.View style={[
        styles.fill,
        {
          width: energyAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
          }),
          backgroundColor: getEnergyColor(level)
        }
      ]} />
    </View>
  );
};
```

## Success Criteria
- [ ] Voice button works in all states
- [ ] Activity indicator responds to voice
- [ ] Transcript updates in real-time
- [ ] Celebrations are gentle and encouraging
- [ ] Energy indicators are clear
- [ ] All animations are smooth
- [ ] Components adapt to energy levels

## Validation Commands
```bash
# Test voice components
npm run test:voice-components

# Verify animations
npm run test:voice-animations

# Test accessibility
npm run test:voice-a11y
```

## What Sprint 4C Needs
- Working voice components
- Animation patterns
- Energy adaptations
- Accessibility support
- Component documentation

## Common Mistakes to Avoid
- Don't use jarring animations
- Don't ignore energy states
- Don't make text too small
- Don't use complex gestures
- Don't skip accessibility

## Files Created/Modified
- Voice recording button
- Activity indicator
- Transcript display
- Celebration card
- Energy indicator

## Next Sprint Preview
Sprint 4C will add voice-aware notifications and feedback systems.

---
**Sprint 4B Focus**: Gentle, responsive voice interaction components.