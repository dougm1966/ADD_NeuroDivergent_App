# 🔔 Agent 4 Sprint 4C: Voice-Aware Notifications

## Mission
Create a gentle, energy-aware notification system that encourages voice interaction and celebrates accomplishments without overwhelming users.

## Sprint Goal
Build a notification system that supports the voice-first experience while enabling progressive enhancement to full features.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 4B voice components complete
- Voice session tracking working
- Brain state correlation active
- Energy detection functional

## Critical Rules (NEVER VIOLATE)
1. Never send overwhelming notifications
2. Always respect energy levels
3. Keep all messaging shame-free
4. Support offline notification queueing
5. Honor user preferences strictly

## Sprint Tasks

### Task 1: Voice Notification Manager
```typescript
// src/services/voiceNotificationManager.ts
import { NotificationService } from '@services/notifications';
import { VoiceSession, BrainState } from '@types';

export class VoiceNotificationManager {
  private notificationService: NotificationService;
  private energyTracker: EnergyAwareNotifications;
  
  constructor() {
    this.notificationService = new NotificationService();
    this.energyTracker = new EnergyAwareNotifications();
  }
  
  async scheduleVoiceCheckIn(
    lastSession: VoiceSession,
    energyLevel: number
  ): Promise<void> {
    // Only schedule if energy appropriate
    if (!this.energyTracker.canReceiveNotification(energyLevel)) {
      return;
    }
    
    const nextCheckInTime = this.calculateNextCheckIn(
      lastSession,
      energyLevel
    );
    
    await this.notificationService.schedule({
      title: "Gentle Voice Check-in",
      body: this.getEnergyAwareMessage(energyLevel),
      timestamp: nextCheckInTime,
      data: {
        type: 'voice_checkin',
        energyContext: energyLevel
      }
    });
  }
  
  private getEnergyAwareMessage(energy: number): string {
    if (energy <= 3) {
      return "When you're ready, a quick voice note might help";
    } else if (energy <= 7) {
      return "Would you like to share how you're doing?";
    } else {
      return "Great energy! Want to capture some thoughts?";
    }
  }
}
```

### Task 2: Voice Celebration Notifications
```typescript
// src/services/voiceCelebrationService.ts
export class VoiceCelebrationService {
  async celebrateAccomplishment(
    accomplishment: VoiceAccomplishment,
    energyLevel: number
  ): Promise<void> {
    const celebrationType = this.getCelebrationType(energyLevel);
    
    await this.notificationService.send({
      title: this.getCelebrationTitle(celebrationType),
      body: this.formatAccomplishment(accomplishment),
      data: {
        type: 'voice_celebration',
        accomplishmentId: accomplishment.id,
        celebrationType
      },
      android: {
        channelId: 'celebrations',
        importance: this.getImportanceLevel(energyLevel),
        vibrationPattern: this.getGentleVibration(energyLevel)
      },
      ios: {
        sound: this.getCelebrationSound(energyLevel)
      }
    });
  }
  
  private getCelebrationTitle(type: CelebrationType): string {
    const titles = {
      gentle: "Quietly Celebrating",
      standard: "Nice Progress!",
      energetic: "Wonderful Achievement!"
    };
    return titles[type];
  }
}
```

### Task 3: Feature Progression Prompts
```typescript
// src/services/voiceProgressionService.ts
export class VoiceProgressionService {
  async checkForUpgradePrompt(
    voiceHistory: VoiceSession[],
    currentFeatures: UserFeatures
  ): Promise<void> {
    if (await this.isReadyForProgression(voiceHistory)) {
      const nextFeature = this.getNextFeature(currentFeatures);
      
      await this.notificationService.schedule({
        title: "New Feature Available",
        body: this.getProgressionMessage(nextFeature),
        data: {
          type: 'feature_progression',
          feature: nextFeature
        },
        android: {
          channelId: 'features',
          importance: 'low' // Never interrupt
        }
      });
    }
  }
  
  private getProgressionMessage(feature: Feature): string {
    const messages = {
      sliders: "Ready to try another way to track your energy?",
      insights: "Would you like to see patterns in your voice sessions?",
      advanced: "Unlock more ways to understand your energy"
    };
    return messages[feature];
  }
}
```

### Task 4: Pattern Insight Notifications
```typescript
// src/services/voicePatternNotifier.ts
export class VoicePatternNotifier {
  async notifyPatternInsight(
    pattern: VoicePattern,
    energyLevel: number
  ): Promise<void> {
    if (!this.shouldNotifyPattern(pattern, energyLevel)) {
      return; // Save for later when energy is better
    }
    
    await this.notificationService.send({
      title: "Voice Pattern Noticed",
      body: this.formatPatternInsight(pattern),
      data: {
        type: 'voice_pattern',
        patternId: pattern.id
      },
      android: {
        channelId: 'insights',
        importance: 'low',
        styleInformation: {
          picture: this.getPatternVisualization(pattern)
        }
      }
    });
  }
  
  private formatPatternInsight(pattern: VoicePattern): string {
    return this.patternFormatter.toGentleMessage(pattern);
  }
}
```

### Task 5: Notification Preferences
```typescript
// src/components/voice/VoiceNotificationPreferences.tsx
export const VoiceNotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    checkInFrequency: 'daily',
    celebrationStyle: 'gentle',
    progressionPrompts: true,
    patternInsights: true,
    quietHours: {
      start: '22:00',
      end: '08:00'
    }
  });
  
  return (
    <View style={styles.container}>
      <NotificationFrequencyPicker
        value={preferences.checkInFrequency}
        onChange={(freq) => updatePreference('checkInFrequency', freq)}
      />
      <CelebrationStyleSelector
        value={preferences.celebrationStyle}
        onChange={(style) => updatePreference('celebrationStyle', style)}
      />
      <QuietHoursSelector
        start={preferences.quietHours.start}
        end={preferences.quietHours.end}
        onChange={(hours) => updatePreference('quietHours', hours)}
      />
    </View>
  );
};
```

## Success Criteria
- [ ] Voice check-in reminders working
- [ ] Celebrations are gentle and timely
- [ ] Feature prompts are non-intrusive
- [ ] Pattern insights are helpful
- [ ] All notifications respect energy
- [ ] Preferences are honored
- [ ] Offline queueing works

## Validation Commands
```bash
# Test notification scheduling
npm run test:notifications

# Verify energy awareness
npm run test:notification-energy

# Test offline handling
npm run test:offline-notifications
```

## What Other Agents Need
- AGENT_0: Voice session triggers
- AGENT_1: Navigation hooks
- AGENT_2: Data correlation
- AGENT_3: Brain state integration

## Common Mistakes to Avoid
- Don't send too many notifications
- Don't ignore energy levels
- Don't use alarming sounds
- Don't interrupt focus periods
- Don't force progression

## Files Created/Modified
- Notification manager
- Celebration service
- Progression service
- Pattern notifier
- Preference components

## Next Sprint Preview
Future sprints will add more sophisticated pattern recognition and adaptive timing.

---
**Sprint 4C Focus**: Gentle, timely voice-aware notifications.