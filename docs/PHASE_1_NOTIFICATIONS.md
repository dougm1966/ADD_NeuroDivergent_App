# 🔔 **Phase 1 Notification System**

## Overview

Phase 1 requires a foundational notification system that provides essential functionality while being architected to scale into Phase 2's advanced social and gamification features. The system must be neurodivergent-first: gentle, respectful, and brain state adaptive.

## Agent Implementation Ownership

### **Agent 3 (Core Features)**: Notification Logic & Scheduling
- **Responsible for**: Notification scheduling service, brain state adaptation for notifications, notification timing algorithms
- **Does NOT own**: UI components, settings screens, notification display
- **Deliverables**: Notification service classes, scheduling algorithms, brain state integration
- **Integration**: Uses Agent 2's subscription service for quota checks

### **Agent 4 (UI/UX)**: Notification UI Components & User Experience
- **Responsible for**: Notification UI components, permission request flows, notification settings screens, visual preferences
- **Does NOT own**: Scheduling logic, timing algorithms, data storage
- **Deliverables**: Notification permission components, settings screens, gentle messaging patterns
- **Integration**: Uses Agent 3's notification services for functionality

### **Agent 2 (Backend)**: Notification Data & Quota Integration
- **Responsible for**: Database schema for preferences, quota data, push notification tokens
- **Does NOT own**: UI components, scheduling logic, display components
- **Deliverables**: Notification preferences in user_subscriptions table, quota checking APIs
- **Integration**: Provides data services that Agent 3 consumes

### **Agent 1 (Foundation)**: Device Integration & Setup
- **Responsible for**: Expo notification setup, device API integration, notification routing
- **Does NOT own**: Business logic, UI components, data management
- **Deliverables**: Notification configuration, device permission setup, deep linking
- **Integration**: Provides foundation that all other agents build upon

**Cross-Agent Integration**: Agent 3 handles the logic, Agent 4 handles the UX, Agent 2 provides the data foundation.

## Core Phase 1 Notification Types

### 1. Brain State Check-in Reminders
**Purpose**: Encourage daily brain state tracking without pressure or guilt

**Implementation**:
```typescript
interface BrainStateReminderNotification {
  type: 'brain_state_reminder';
  title: string;
  body: string;
  scheduledTime: Date;
  adaptedForBrainState?: BrainState;
  userPreferences: {
    frequency: 'daily' | 'every_few_days' | 'weekly';
    quietHours: { start: string; end: string };
    gentleLanguage: boolean;
  };
}
```

**Adaptive Messaging**:
- **High energy states**: "Ready to check in and plan your productive day?"
- **Medium energy states**: "How are you feeling right now?"
- **Low energy states**: "Gentle check-in when you're ready"
- **No recent check-ins**: "No pressure - check in when it feels right"

### 2. Task Completion Celebrations
**Purpose**: Provide gentle positive reinforcement for completed tasks

**Implementation**:
```typescript
interface TaskCelebrationNotification {
  type: 'task_celebration';
  title: string;
  body: string;
  taskTitle: string;
  complexityLevel: number;
  brainStateAtCompletion: BrainState;
  celebrationIntensity: 'subtle' | 'standard' | 'energetic';
}
```

**Celebration Messages**:
- **Low energy completion**: "You did something today - that's wonderful!"
- **Energy-matched task**: "Perfect choice for your energy level today!"
- **Challenge completion**: "You tackled something complex - well done!"
- **Micro task**: "Every small step counts"

### 3. AI Quota Notifications
**Purpose**: Inform users about AI request usage without creating shame

**Implementation**:
```typescript
interface QuotaNotification {
  type: 'quota_update';
  title: string;
  body: string;
  usageType: 'ai_requests';
  used: number;
  limit: number;
  severity: 'info' | 'warning' | 'limit_reached';
  upgradePrompt?: string;
}
```

**Gentle Quota Messages**:
- **75% usage**: "You've used 7 of your 10 AI breakdowns this month"
- **90% usage**: "2 AI breakdowns remaining this month"
- **100% usage**: "You've used all your AI assistance this month. Upgrade for unlimited breakdowns?"
- **Never shame-based**: No "failed" or "exceeded" language

### 4. System & Sync Notifications
**Purpose**: Keep users informed about app status and data sync

**Implementation**:
```typescript
interface SystemNotification {
  type: 'system_update' | 'sync_status' | 'maintenance';
  title: string;
  body: string;
  priority: 'low' | 'normal' | 'high';
  actionRequired: boolean;
  actionUrl?: string;
}
```

**System Messages**:
- **Sync complete**: "Your progress is safely saved"
- **Offline mode**: "Working offline - will sync when reconnected"
- **Update available**: "New features available when you're ready"
- **Maintenance**: "Brief maintenance tonight - your data is safe"

## Brain State Adaptive System

### Notification Timing Adaptation
```typescript
interface NotificationTiming {
  scheduleBasedOnBrainState(
    notification: BaseNotification,
    recentBrainStates: BrainState[],
    userPattern: UserActivityPattern
  ): ScheduledNotification;
  
  respectQuietHours(
    notification: BaseNotification,
    preferences: NotificationPreferences
  ): boolean;
  
  adaptLanguageForEnergyLevel(
    baseMessage: string,
    currentEnergyLevel: number
  ): string;
}
```

### Timing Rules
- **High energy periods**: More detailed notifications, action buttons
- **Low energy periods**: Minimal, gentle notifications only
- **Hyperfocus detection**: No interruptions during continuous app usage
- **Sleep hours**: Respect user-defined quiet time completely
- **Energy transitions**: Gentle notifications when energy increases

### Language Adaptation
```typescript
const adaptNotificationLanguage = (message: string, energyLevel: number): string => {
  if (energyLevel <= 3) {
    // Gentle, minimal pressure
    return message
      .replace(/Ready to/g, 'When you\'re ready to')
      .replace(/Time to/g, 'If you\'d like to')
      .replace(/!$/g, ''); // Remove exclamation marks
  }
  
  if (energyLevel >= 7) {
    // More energetic, action-oriented
    return message
      .replace(/When you\'re ready/g, 'Ready to')
      .replace(/If you\'d like/g, 'Time to');
  }
  
  return message; // Medium energy - no changes needed
};
```

## Notification Preferences & Controls

### User Preference Interface
```typescript
interface NotificationPreferences {
  brainStateReminders: {
    enabled: boolean;
    frequency: 'daily' | 'every_few_days' | 'weekly' | 'custom';
    customDays?: number; // For custom frequency
    quietHours: {
      enabled: boolean;
      start: string; // "22:00"
      end: string;   // "09:00"
    };
    adaptiveLanguage: boolean; // Adapt based on brain state
    adaptiveTiming: boolean;   // Avoid low energy periods
  };
  
  taskCelebrations: {
    enabled: boolean;
    intensity: 'subtle' | 'standard' | 'energetic' | 'adaptive';
    immediate: boolean;    // Celebrate immediately vs batch
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  
  quotaNotifications: {
    enabled: boolean;
    warningThreshold: number; // Warn at X requests remaining
    upgradePrompts: boolean;  // Show gentle upgrade suggestions
  };
  
  systemNotifications: {
    syncStatus: boolean;
    maintenance: boolean;
    updates: boolean;
    emergency: boolean; // Always enabled for critical issues
  };
}
```

### Gentle Preference Controls
```typescript
// Settings screen components for notification preferences
export const NotificationSettings: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Brain State Reminders</Text>
      <Text style={styles.description}>
        Gentle reminders to check in with yourself (never pushy)
      </Text>
      
      <Toggle
        label="Daily check-in reminders"
        description="Soft prompts when you haven't checked in today"
        value={preferences.brainStateReminders.enabled}
        onChange={updatePreference}
      />
      
      <FrequencySelector
        label="Reminder frequency"
        options={['daily', 'every_few_days', 'weekly']}
        value={preferences.brainStateReminders.frequency}
        onChange={updateFrequency}
      />
      
      <QuietHoursSelector
        label="Quiet hours (no notifications)"
        start={preferences.brainStateReminders.quietHours.start}
        end={preferences.brainStateReminders.quietHours.end}
        onChange={updateQuietHours}
      />
    </ScrollView>
  );
};
```

## Technical Implementation

### Notification Scheduling Service
```typescript
export class NotificationScheduler {
  private expo: typeof Notifications;
  private preferences: NotificationPreferences;
  private brainStateHistory: BrainState[];
  
  constructor() {
    this.expo = Notifications;
    this.setupNotificationCategories();
  }
  
  async scheduleBrainStateReminder(
    userId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    const lastCheckin = await this.getLastBrainStateCheckin(userId);
    const shouldSchedule = this.shouldScheduleReminder(lastCheckin, preferences);
    
    if (!shouldSchedule) return;
    
    const optimalTime = await this.calculateOptimalReminderTime(
      userId,
      preferences
    );
    
    const adaptedMessage = this.adaptMessageForUser(
      'How are you feeling right now?',
      userId
    );
    
    await this.expo.scheduleNotificationAsync({
      content: {
        title: 'Gentle Check-in',
        body: adaptedMessage,
        categoryIdentifier: 'brain_state_reminder',
        sound: preferences.taskCelebrations.soundEnabled ? 'default' : false,
        data: {
          type: 'brain_state_reminder',
          userId,
          scheduledAt: optimalTime.toISOString()
        }
      },
      trigger: {
        date: optimalTime
      }
    });
  }
  
  async celebrateTaskCompletion(
    task: Task,
    brainState: BrainState,
    preferences: NotificationPreferences
  ): Promise<void> {
    if (!preferences.taskCelebrations.enabled) return;
    
    const celebrationMessage = this.generateCelebrationMessage(task, brainState);
    const intensity = this.calculateCelebrationIntensity(
      preferences.taskCelebrations.intensity,
      brainState
    );
    
    await this.expo.scheduleNotificationAsync({
      content: {
        title: celebrationMessage.title,
        body: celebrationMessage.body,
        categoryIdentifier: 'task_celebration',
        sound: intensity !== 'subtle' && preferences.taskCelebrations.soundEnabled,
        data: {
          type: 'task_celebration',
          taskId: task.id,
          intensity,
          celebratedAt: new Date().toISOString()
        }
      },
      trigger: null // Immediate
    });
  }
  
  private generateCelebrationMessage(
    task: Task,
    brainState: BrainState
  ): { title: string; body: string } {
    const energyLevel = brainState.energy_level;
    const isEnergyMatched = task.complexity_level <= energyLevel;
    
    if (energyLevel <= 3) {
      return {
        title: 'Gentle Victory!',
        body: 'You did something today - that\'s wonderful!'
      };
    }
    
    if (isEnergyMatched) {
      return {
        title: 'Perfect Match!',
        body: `Great choice for your energy level today`
      };
    }
    
    if (task.complexity_level >= 4) {
      return {
        title: 'Challenge Completed!',
        body: 'You tackled something complex - well done!'
      };
    }
    
    return {
      title: 'Task Complete!',
      body: 'Every step forward counts'
    };
  }
  
  private async calculateOptimalReminderTime(
    userId: string,
    preferences: NotificationPreferences
  ): Promise<Date> {
    const userPattern = await this.getUserActivityPattern(userId);
    const quietHours = preferences.brainStateReminders.quietHours;
    
    // Find optimal time based on:
    // 1. User's typical high-energy periods
    // 2. Avoiding quiet hours
    // 3. Not during likely hyperfocus times
    // 4. Reasonable spacing from last notification
    
    let optimalHour = userPattern.typicalHighEnergyHour || 10; // Default 10am
    
    // Avoid quiet hours
    if (this.isInQuietHours(optimalHour, quietHours)) {
      optimalHour = this.findNextAvailableHour(optimalHour, quietHours);
    }
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(optimalHour, 0, 0, 0);
    
    return tomorrow;
  }
}
```

### Local Storage & Persistence
```typescript
export class NotificationStorageService {
  async saveNotificationHistory(notification: ProcessedNotification): Promise<void> {
    const history = await AsyncStorage.getItem('notification_history') || '[]';
    const notifications: ProcessedNotification[] = JSON.parse(history);
    
    notifications.push({
      ...notification,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 notifications
    const recent = notifications.slice(-100);
    
    await AsyncStorage.setItem('notification_history', JSON.stringify(recent));
  }
  
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const stored = await AsyncStorage.getItem('notification_preferences');
    return stored ? JSON.parse(stored) : DEFAULT_NOTIFICATION_PREFERENCES;
  }
  
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    const current = await this.getNotificationPreferences();
    const updated = { ...current, ...preferences };
    
    await AsyncStorage.setItem(
      'notification_preferences', 
      JSON.stringify(updated)
    );
  }
}
```

## Integration with Expo Notifications

### Setup & Permissions
```typescript
export class NotificationSetup {
  async initializeNotifications(): Promise<boolean> {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      // Handle gracefully - app works without notifications
      console.log('Notifications not enabled - app still fully functional');
      return false;
    }
    
    // Configure notification categories
    await this.setupNotificationCategories();
    
    // Set up notification handlers
    this.setupNotificationHandlers();
    
    return true;
  }
  
  private async setupNotificationCategories(): Promise<void> {
    await Notifications.setNotificationCategoryAsync('brain_state_reminder', [
      {
        identifier: 'check_in_now',
        buttonTitle: 'Check In',
        options: { opensAppToForeground: true }
      },
      {
        identifier: 'remind_later',
        buttonTitle: 'Later',
        options: { opensAppToForeground: false }
      }
    ]);
    
    await Notifications.setNotificationCategoryAsync('task_celebration', [
      {
        identifier: 'view_tasks',
        buttonTitle: 'View Tasks',
        options: { opensAppToForeground: true }
      }
    ]);
    
    await Notifications.setNotificationCategoryAsync('quota_warning', [
      {
        identifier: 'upgrade_now',
        buttonTitle: 'Upgrade',
        options: { opensAppToForeground: true }
      },
      {
        identifier: 'dismiss',
        buttonTitle: 'Later',
        options: { opensAppToForeground: false }
      }
    ]);
  }
  
  private setupNotificationHandlers(): void {
    // Handle notification received while app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const data = notification.request.content.data;
        
        // For low energy users, minimize disruption
        if (data.type === 'brain_state_reminder') {
          const recentBrainState = await this.getRecentBrainState();
          if (recentBrainState && recentBrainState.energy_level <= 3) {
            return {
              shouldShowAlert: false, // Don't interrupt low energy users
              shouldPlaySound: false,
              shouldSetBadge: true
            };
          }
        }
        
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true
        };
      }
    });
    
    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      this.handleNotificationResponse(response);
    });
  }
  
  private async handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): Promise<void> {
    const { notification, actionIdentifier } = response;
    const data = notification.request.content.data;
    
    switch (actionIdentifier) {
      case 'check_in_now':
        // Navigate to brain state check-in
        NavigationService.navigate('BrainStateCheckin');
        break;
        
      case 'remind_later':
        // Schedule another reminder for later
        await this.scheduleDelayedReminder(data.userId);
        break;
        
      case 'view_tasks':
        // Navigate to task list
        NavigationService.navigate('TaskList');
        break;
        
      case 'upgrade_now':
        // Navigate to upgrade screen
        NavigationService.navigate('Settings', { showUpgrade: true });
        break;
        
      default:
        // Default tap - navigate to appropriate screen
        this.handleDefaultNotificationTap(data);
    }
  }
}
```

## Phase 2 Scalability Preparation

### Extension Points for Phase 2
```typescript
// Phase 1 notification service designed for Phase 2 extension
export abstract class BaseNotificationService {
  // Phase 1 methods (implement now)
  abstract scheduleBrainStateReminder(userId: string): Promise<void>;
  abstract celebrateTaskCompletion(task: Task, brainState: BrainState): Promise<void>;
  abstract notifyQuotaStatus(userId: string, usage: QuotaUsage): Promise<void>;
  
  // Phase 2 extension points (implement later)
  abstract scheduleBodyDoublingInvite?(userId: string, roomId: string): Promise<void>;
  abstract notifyAchievementUnlocked?(userId: string, achievement: Achievement): Promise<void>;
  abstract notifyConnectionRequest?(userId: string, requesterId: string): Promise<void>;
  abstract scheduleAdaptiveNotification?(notification: AdaptiveNotification): Promise<void>;
}
```

### Database Preparation for Phase 2
```typescript
// Phase 1 notification data structure ready for Phase 2 extension
interface NotificationData {
  // Phase 1 fields
  id: string;
  userId: string;
  type: 'brain_state_reminder' | 'task_celebration' | 'quota_update' | 'system_update';
  title: string;
  body: string;
  scheduledFor: Date;
  sentAt?: Date;
  readAt?: Date;
  
  // Phase 2 extension fields (add later)
  // socialData?: SocialNotificationData;
  // achievementData?: AchievementNotificationData;
  // bodyDoublingData?: BodyDoublingNotificationData;
  // adaptationLevel?: 'subtle' | 'standard' | 'energetic';
}
```

## Sprint Implementation Timeline

### **Agent 2 Sprint 2F**: Notification Data Foundation
**Implementation**: Notification preferences in user_subscriptions table
```sql
-- Add notification preferences to user_subscriptions table
ALTER TABLE user_subscriptions ADD COLUMN notification_preferences JSONB DEFAULT '{}';

-- Example notification preferences structure:
-- notification_preferences: {
--   "brain_state_reminders": {"enabled": true, "frequency": "daily"},
--   "task_celebrations": {"enabled": true, "intensity": "standard"},
--   "quota_notifications": {"enabled": true, "warning_threshold": 2},
--   "system_notifications": {"enabled": true}
-- }
```

### **Agent 3 Phase 1**: Notification Logic & Services
**Implementation**: Core notification scheduling and brain state adaptation
- **Week 2**: Notification service classes and scheduling logic
- **Integration Point**: Uses Agent 2's subscription services for quota checks
- **Deliverables**: `NotificationScheduler`, `BrainStateAdaptation`, preference management

### **Agent 4 Sprint 4E**: Notification UI Components  
**Implementation**: Freemium UI components include notification settings
- **Components**: Notification permission requests, settings screens
- **Integration Point**: Uses Agent 3's notification services
- **Deliverables**: Settings components, notification display patterns

### **Cross-Agent Integration**: Week 3
**Complete Integration**: All notification features working together
- Agent 2 provides data foundation
- Agent 3 provides scheduling logic  
- Agent 4 provides user interface
- Full notification system operational

## Success Metrics for Phase 1

### User Engagement Metrics
- **Opt-in Rate**: % of users who enable notifications
- **Response Rate**: % of brain state reminders that result in check-ins
- **Celebration Impact**: User retention after task celebrations
- **Preference Usage**: % of users who customize notification settings

### Neurodivergent-Specific Metrics
- **Pressure Perception**: Survey responses about notification pressure/guilt
- **Timing Satisfaction**: Effectiveness of brain state adaptive timing
- **Language Comfort**: User feedback on notification language
- **Disruption Minimization**: Complaints about unwanted interruptions

### Technical Performance Metrics
- **Delivery Success**: % of scheduled notifications delivered successfully
- **Battery Impact**: Notification system battery usage
- **Storage Efficiency**: Local notification data storage usage
- **Permission Retention**: % of users who keep notifications enabled

---

**Phase 1 notifications: Essential, gentle, and ready to grow into Phase 2's advanced features** 🔔