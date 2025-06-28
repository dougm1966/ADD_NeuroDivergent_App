Here's the corrected ARCHITECTURE.md file:

# 🏗️ **Technical Architecture**

## System Architecture Overview

### Frontend (Expo React Native)
- **Framework**: Expo SDK 53.0.0 with React Native 0.79.0 and TypeScript 5.8.3
- **UI Library**: React Native Paper 5.14.5+ (OFFICIAL UI STANDARD - ALL components must use Paper)
- **Navigation**: React Navigation 6.1.17 (DO NOT CHANGE)
- **State Management**: Zustand 4.5.2 (DO NOT USE REDUX)
- **Local Storage**: AsyncStorage 1.21.0 (offline-first)
- **HTTP Client**: Supabase JS Client 2.39.3 (built-in)
- **Styling**: React Native Paper theming system + Material Design 3

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (email/password)
- **Real-time**: Supabase real-time subscriptions
- **API**: Auto-generated REST API from Supabase
- **Storage**: Supabase Storage (if needed later)

### AI Integration
- **OpenAI API**: Direct API calls for task breakdown
- **Rate Limiting**: Client-side rate limiting

## Database Schema (Supabase PostgreSQL)

```sql
-- Users table (handled automatically by Supabase Auth)
-- auth.users table exists by default

-- Brain states table
CREATE TABLE brain_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table (Freemium Model)
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  ai_requests_used INTEGER DEFAULT 0,
  ai_requests_limit INTEGER DEFAULT 10,
  reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  complexity_level INTEGER CHECK (complexity_level BETWEEN 1 AND 5),
  estimated_minutes INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  ai_breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE brain_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own brain states" ON brain_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brain states" ON brain_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_brain_states_user_date ON brain_states(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, is_completed, created_at DESC);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_reset_date ON user_subscriptions(reset_date);
```

## API Interactions (Supabase Client)

### Authentication
```javascript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### Brain States
```javascript
// Create brain state
const { data, error } = await supabase
  .from('brain_states')
  .insert({
    energy_level: 7,
    focus_level: 5,
    mood_level: 8,
    notes: 'Feeling good today'
  });

// Get brain state history
const { data, error } = await supabase
  .from('brain_states')
  .select('*')
  .order('created_at', { ascending: false });
```

### Tasks
```javascript
// Get filtered tasks based on brain state
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .lte('complexity_level', userEnergyLevel)
  .order('created_at', { ascending: false });

// Create task
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'Complete project',
    complexity_level: 3,
    estimated_minutes: 60
  });

// Update task
const { data, error } = await supabase
  .from('tasks')
  .update({ is_completed: true })
  .eq('id', taskId);
```

### User Subscriptions (Freemium Model)
```javascript
// Get user subscription info
const { data, error } = await supabase
  .from('user_subscriptions')
  .select('*')
  .single();

// Check AI request quota
const { data: subscription } = await supabase
  .from('user_subscriptions')
  .select('ai_requests_used, ai_requests_limit, tier')
  .single();

const canMakeRequest = subscription.ai_requests_used < subscription.ai_requests_limit;

// Increment AI request usage
const { data, error } = await supabase
  .from('user_subscriptions')
  .update({ 
    ai_requests_used: subscription.ai_requests_used + 1 
  })
  .eq('user_id', userId);

// Reset monthly quota (run via scheduled function)
const { data, error } = await supabase
  .from('user_subscriptions')
  .update({ 
    ai_requests_used: 0,
    reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })
  .lt('reset_date', new Date());
```

### Real-time Subscriptions
```javascript
// Listen to task changes
const subscription = supabase
  .channel('tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe();
```

## File Structure

```
NeuroProductivityApp/
├── App.tsx                  # Main app component
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BrainStateSlider.tsx
│   │   ├── TaskCard.tsx
│   │   └── GentleButton.tsx
│   ├── screens/             # Main app screens
│   │   ├── BrainStateCheckin.tsx
│   │   ├── TaskList.tsx
│   │   └── Settings.tsx
│   ├── store/               # Zustand stores
│   │   ├── brainStateStore.ts
│   │   └── taskStore.ts
│   ├── services/            # API services
│   │   ├── supabaseClient.ts
│   │   └── openaiService.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── utils/               # Helper functions
│   │   └── helpers.ts
│   └── constants/           # App constants
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── package.json
└── app.json
```

## Data Flow

### Brain State Check-in Flow
1. User opens app → Check AsyncStorage for today's brain state
2. If none exists → Show check-in screen
3. User completes sliders → Save to Supabase + local AsyncStorage
4. App UI adapts based on brain state levels
5. Task list filters automatically

### Task Management Flow
1. Get current brain state from AsyncStorage
2. Query Supabase for tasks with complexity filtering
3. Display appropriate tasks with gentle UI
4. Save changes to Supabase with real-time updates
5. Fallback to local storage if offline

### AI Breakdown Flow
1. User taps "Break this down" on complex task
2. Check client-side rate limits
3. Send task + brain state context to OpenAI
4. Parse response into step-by-step format
5. Save breakdown to Supabase and local storage

## Performance Requirements

### Response Times
- **App startup**: < 2 seconds
- **Brain state check-in**: < 500ms
- **Task list load**: < 1 second
- **AI breakdown**: < 5 seconds

### Offline Capability
- Core features work with AsyncStorage
- Auto-sync when connection returns
- Conflict resolution with Supabase real-time
- Visual indicators for sync status

### Battery Optimization
- Minimal background processing
- Efficient AsyncStorage queries
- Real-time subscriptions only when needed
- Respect system power-saving modes

## Security Requirements

### Data Protection
- Row Level Security on all tables
- Supabase Auth handles JWT tokens
- HTTPS only (handled by Supabase)
- Client-side input validation

### Privacy
- Minimal data collection (only what's needed)
- User controls all their data
- No third-party tracking
- Data deletion through Supabase policies

## Scalability Considerations

### Database (Supabase)
- Automatic connection pooling
- Built-in read replicas
- Auto-scaling based on usage
- Built-in monitoring and analytics

### Mobile App
- Lazy loading for non-critical components
- Efficient state management with Zustand
- Image optimization with Expo
- Memory leak prevention

## Third-Party Services

### Required
- **Supabase**: Database, Auth, Real-time, API
- **OpenAI API**: Task breakdown generation
- **Expo**: Development and deployment platform

### Phase 1 Optional
- Expo Push Notifications (for basic notifications)
- Sentry for error tracking
- Analytics (privacy-focused only)

### Phase 2 Required
- **Video Infrastructure**: Agora.io or Daily.co for body doubling
- **WebSocket Connections**: Real-time notifications and room updates
- **Push Notification Service**: Advanced notification scheduling
- **Background Tasks**: Supabase Edge Functions for quota resets

## Development Tools

### Frontend
- Expo CLI
- TypeScript
- ESLint + Prettier
- Expo Dev Tools

### Backend
- Supabase Dashboard
- Supabase CLI
- PostgreSQL (via Supabase)

### Deployment
- EAS (Expo Application Services)
- Supabase (auto-deployed)
- Environment-based configs

## Phase 2 Architecture Extensions

### API Architecture for Phase 2

#### Gamification API Endpoints
```typescript
// Achievement System
GET    /api/achievements/user                    // Get user achievements
POST   /api/achievements/check                   // Check for new achievements
PUT    /api/achievements/unlock/:achievementId   // Unlock specific achievement

// Customization System
GET    /api/customizations/available             // Get available customizations
GET    /api/customizations/unlocked              // Get user's unlocked items
POST   /api/customizations/unlock                // Unlock new customization
PUT    /api/customizations/apply                 // Apply customization setting
```

#### Body Doubling API Endpoints
```typescript
// Room Management
GET    /api/body-doubling/rooms                  // Get available rooms
GET    /api/body-doubling/rooms/:id              // Get specific room details
POST   /api/body-doubling/rooms/:id/join         // Join a room
POST   /api/body-doubling/rooms/:id/leave        // Leave a room

// Session Management
GET    /api/body-doubling/sessions               // Get user's sessions
POST   /api/body-doubling/sessions               // Create new session
PUT    /api/body-doubling/sessions/:id           // Update session (rating, etc.)
DELETE /api/body-doubling/sessions/:id           // End session

// User Connections
GET    /api/connections                          // Get user's connections
POST   /api/connections/request                  // Send connection request
PUT    /api/connections/:id/respond              // Accept/decline request
DELETE /api/connections/:id                      // Remove connection
```

#### Advanced Notification API Endpoints
```typescript
// Notification Management
GET    /api/notifications                        // Get user notifications
POST   /api/notifications/schedule               // Schedule notification
PUT    /api/notifications/:id/read               // Mark as read
DELETE /api/notifications/:id                    // Delete notification

// Notification Preferences
GET    /api/notifications/preferences            // Get user preferences
PUT    /api/notifications/preferences            // Update preferences
POST   /api/notifications/test                   // Send test notification
```

### Real-Time Architecture

#### WebSocket Connections for Phase 2
```typescript
// Body Doubling Real-time Events
interface BodyDoublingEvents {
  'room:joined': { roomId: string; userId: string; userCount: number };
  'room:left': { roomId: string; userId: string; userCount: number };
  'session:started': { sessionId: string; participants: string[] };
  'session:ended': { sessionId: string; duration: number };
  'partner:online': { partnerId: string; roomId?: string };
  'partner:offline': { partnerId: string };
}

// Notification Real-time Events
interface NotificationEvents {
  'notification:new': { notification: Notification };
  'achievement:unlocked': { achievement: Achievement };
  'connection:request': { requester: User };
  'connection:accepted': { partner: User };
}
```

#### Supabase Real-time Subscriptions
```typescript
// Room occupancy updates
const roomSubscription = supabase
  .channel('body-doubling-rooms')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'body_doubling_rooms' },
    (payload) => handleRoomUpdate(payload)
  )
  .subscribe();

// Achievement notifications
const achievementSubscription = supabase
  .channel('user-achievements')
  .on('postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'user_subscriptions',
      filter: `user_id=eq.${userId}` },
    (payload) => handleAchievementUpdate(payload)
  )
  .subscribe();
```

### Video Infrastructure Architecture

#### Agora.io Integration Pattern
```typescript
interface VideoSessionConfig {
  sessionId: string;
  roomType: 'drop_in' | 'matched' | 'scheduled';
  maxParticipants: number;
  brainStateRequirement?: 'low' | 'medium' | 'high';
  features: {
    video: boolean;
    audio: boolean;
    screenShare: boolean;
    recording: boolean;
  };
}

class VideoSessionManager {
  async createSession(config: VideoSessionConfig): Promise<SessionToken>;
  async joinSession(sessionId: string, userId: string): Promise<void>;
  async leaveSession(sessionId: string, userId: string): Promise<void>;
  async updateSessionSettings(sessionId: string, settings: Partial<VideoSessionConfig>): Promise<void>;
}
```

#### Video Cost Management
```typescript
// Free tier limitations
const FREE_TIER_LIMITS = {
  sessionsPerMonth: 3,
  maxSessionDuration: 90, // minutes
  features: ['video', 'audio'], // no screen sharing
};

// Premium tier benefits
const PREMIUM_TIER_BENEFITS = {
  sessionsPerMonth: Infinity,
  maxSessionDuration: Infinity,
  features: ['video', 'audio', 'screenShare', 'recording'],
};
```

### Notification System Architecture

#### Brain State Adaptive Notifications
```typescript
interface NotificationAdapter {
  adaptForBrainState(
    notification: BaseNotification,
    brainState: BrainState
  ): AdaptedNotification;
  
  scheduleOptimalTiming(
    notification: BaseNotification,
    userPattern: UserActivityPattern
  ): ScheduledNotification;
  
  respectQuietHours(
    notification: BaseNotification,
    preferences: NotificationPreferences
  ): boolean;
}

class BrainStateNotificationAdapter implements NotificationAdapter {
  adaptForBrainState(notification: BaseNotification, brainState: BrainState) {
    const energyLevel = brainState.energy_level;
    
    if (energyLevel <= 3) {
      return {
        ...notification,
        title: this.gentleLanguage(notification.title),
        priority: 'low',
        soundEnabled: false,
        vibrationPattern: 'gentle'
      };
    }
    
    if (energyLevel >= 7) {
      return {
        ...notification,
        title: this.energeticLanguage(notification.title),
        priority: 'normal',
        soundEnabled: true,
        actionButtons: ['View', 'Later']
      };
    }
    
    return notification; // Medium energy - standard notification
  }
}
```

### Performance Architecture for Phase 2

#### Caching Strategy
```typescript
// Redis caching for frequently accessed data
interface CacheStrategy {
  achievements: '1 hour';           // Achievement state changes infrequently
  roomOccupancy: '30 seconds';     // Room data needs to be current
  userConnections: '10 minutes';   // Connection status relatively stable
  notifications: '5 minutes';      // Recent notifications cache
}

// Local storage strategy
interface LocalCacheStrategy {
  achievements: 'persist';         // Achievements don't change often
  customizations: 'persist';       // User preferences should persist
  roomHistory: '24 hours';         // Recent rooms for quick access
  partnerStatus: '1 hour';         // Partner online/offline status
}
```

#### Background Processing
```typescript
// Supabase Edge Functions for automated tasks
export const monthlyQuotaReset = async () => {
  // Reset AI quotas monthly
  // Reset body doubling session counts
  // Send usage summary notifications
};

export const achievementChecker = async () => {
  // Check for newly earned achievements
  // Send achievement unlock notifications
  // Update customization availability
};

export const notificationScheduler = async () => {
  // Process scheduled notifications
  // Respect user quiet hours
  // Adapt for current brain state
};
```

### Scalability Architecture for Phase 2

#### Video Session Scaling
- **Geographic Distribution**: Agora.io handles global distribution
- **Concurrent Sessions**: Plan for 100+ simultaneous body doubling sessions
- **Bandwidth Management**: Adaptive quality based on connection
- **Cost Optimization**: Session recording only for premium users

#### Real-time Scaling
- **WebSocket Management**: Supabase handles connection scaling
- **Event Broadcasting**: Efficient room-based event distribution
- **Presence Tracking**: Lightweight online/offline status
- **Message Queuing**: Notification delivery guarantees

#### Database Scaling for Phase 2
- **Read Replicas**: Separate read/write for body doubling sessions
- **Partitioning**: Time-based partitioning for session history
- **Indexing Strategy**: Optimized for real-time queries
- **Archive Strategy**: Automated cleanup of old session data

### Security Architecture for Phase 2

#### Video Session Security
- **Token-based Access**: Temporary session tokens
- **Room Access Control**: Brain state and connection-based permissions
- **Recording Consent**: Explicit consent for any recording
- **Data Encryption**: End-to-end encryption for video streams

#### Social Feature Security
- **Connection Verification**: Two-way connection approval
- **Privacy Controls**: Granular visibility settings
- **Abuse Prevention**: Reporting and blocking mechanisms
- **Data Minimization**: Only store necessary social data

---

## Reference Documentation

### **Forward Compatibility & Scalability**
- 📋 [Phase 2 Scalability Reference](reference/PHASE_2_SCALABILITY.md) - Ensure current architecture supports future features
- 🔄 [Architecture Evolution Guide](reference/ARCHITECTURE_EVOLUTION.md) - How Phase 1 evolves to Phase 2 without breaking changes

### **Related Documentation**
- 🧪 [Testing Strategy](../TESTING.md) - Sprint-specific testing requirements
- 🚀 [Deployment Guide](../DEPLOYMENT.md) - Agent-specific deployment workflows
- 📋 [Features Specification](../FEATURES.md) - Complete feature requirements

---

**Architecture optimized for simplicity with Supabase** ⚡