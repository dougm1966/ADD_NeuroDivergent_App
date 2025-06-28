# 🔮 **Phase 2 Scalability Reference**

> **⚠️ REFERENCE ONLY**: This document guides Phase 1 agent architectural decisions to ensure forward compatibility. Phase 2 implementation will happen after Phase 1 MVP completion.

## Purpose for Current Agents

### **Agent 2 (Backend)**: Design Extensible Foundation
- Database schema must support Phase 2 table extensions without breaking changes
- API services must accommodate new endpoints and functionality
- Authentication system must scale to social features

### **Agent 3 (Core Features)**: Build Scalable Architecture  
- Zustand stores must support Phase 2 state additions
- Brain state system must be extensible for advanced adaptations
- Hook patterns must accommodate new feature integrations

### **Agent 4 (UI/UX)**: Create Future-Ready Paper Components
- React Native Paper design system must support Phase 2 UI elements (achievements, social features)
- Paper component library must be extensible for gamification and customization
- Paper's built-in accessibility patterns must scale to advanced features

---

## Phase 2 Features Overview

Phase 2 builds upon the solid foundation of Phase 1's brain state system and adaptive task management by adding gamification, body doubling, and advanced social features. All Phase 2 features maintain the neurodivergent-first principles of being shame-free, adaptive, and optional.

## Core Phase 2 Features

### 1. 🎯 **Gamification System**

#### Brain State Achievement System
**Purpose**: Reward self-awareness and consistency, not performance or "good" brain states

**Implementation**:
- **"Brain Scientist" Badges**: Earned for total check-ins (not streaks)
  - Bronze: 10 check-ins
  - Silver: 50 check-ins  
  - Gold: 100 check-ins
  - Platinum: 365 check-ins
- **"Self-Awareness" Points**: Bonus points for adding context notes
- **"Pattern Explorer" Achievement**: For experiencing full range of energy levels (1-10)
- **Visual Progress**: Gentle progress indicators, never countdown timers

**Neurodivergent Benefits**:
- Celebrates awareness regardless of brain state levels
- No streaks to break or maintain
- Validates the effort of self-monitoring
- Encourages long-term pattern recognition

**Database Extensions**:
```sql
-- Add to user_subscriptions table
ALTER TABLE user_subscriptions ADD COLUMN achievements JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN achievement_points INTEGER DEFAULT 0;

-- Achievement tracking
achievements: {
  "brain_scientist": {"level": "bronze", "earned_date": "2025-06-25"},
  "self_awareness": {"points": 15, "notes_added": 8},
  "pattern_explorer": {"ranges_experienced": [1,2,3,4,5,6,7,8,9,10]}
}
```

#### Task Complexity Mastery
**Purpose**: Celebrate ALL productivity, especially validating low-energy accomplishments

**Implementation**:
- **Complexity-Specific Achievements**:
  - "Gentle Achiever" - Complete 10 Level 1 tasks
  - "Balanced Doer" - Complete 10 Level 3 tasks
  - "Challenge Champion" - Complete 5 Level 5 tasks
- **Energy-Matched Victories**: Special recognition for appropriate task selection
  - "Perfect Match" - Complete Level 2 task on Level 2 energy
  - "Gentle Victory" - Complete any task on Level 1-2 energy
  - "Peak Performance" - Complete Level 4+ task on Level 8+ energy

**Neurodivergent Benefits**:
- Validates micro-task completion on hard days
- Recognizes appropriate task selection (executive function success)
- No hierarchy of "better" achievements
- Celebrates working with brain patterns, not against them

#### Customization Unlocks
**Purpose**: Reward engagement with features that actually enhance user experience

**Implementation**:
- **Unlock Progression**:
  - Week 1: Basic theme variations
  - Month 1: Font options (including OpenDyslexic)
  - Month 3: Advanced sensory customizations
  - Month 6: Custom celebration animations
- **Body Doubling Rewards**: Enhanced customizations earned through body doubling participation
- **Brain State Rewards**: Special themes unlocked through consistent check-ins

**Neurodivergent Benefits**:
- Rewards improve actual app experience
- Sensory customizations enhance accessibility
- Optional progression that doesn't gate core functionality

### 2. 👥 **Body Doubling Platform**

#### Three-Tier Access System

##### Tier 1: Drop-In Rooms
**Concept**: "Coffee shop" style co-working spaces with no commitment

**Implementation**:
- **Room Types**:
  - "Low Energy Focus Room" - Gentle, minimal stimulation
  - "Medium Energy Work Room" - Balanced co-working space
  - "High Energy Power Hour" - Active, dynamic sessions
  - "Creative Flow Room" - For creative and artistic tasks
  - "Admin Tasks Room" - For routine/organizational work
- **Features**:
  - Live room occupancy (1-6 people per room)
  - Join/leave anytime without disruption
  - Optional ambient sounds (rain, cafe, white noise)
  - Silent by default (no pressure to interact)

##### Tier 2: Matched Sessions
**Concept**: "Study buddy" pairing based on preferences and brain state

**Implementation**:
- **Matching Criteria**:
  - Brain state preference (same energy vs. complementary energy)
  - Session duration preference (25min, 50min, 90min)
  - Task type similarity (creative, admin, complex, simple)
  - Time zone compatibility
- **Matching Process**:
  - "Looking for a partner" notification
  - Algorithm suggests 2-3 potential matches
  - Both users confirm before session starts
  - Anonymous until both agree to connect

##### Tier 3: Scheduled Sessions
**Concept**: "Coffee date" style planned sessions with regular partners

**Implementation**:
- **Scheduling Features**:
  - Recurring sessions (daily, weekly, custom)
  - Brain state predictions for optimal scheduling
  - Gentle reminders without pressure
  - Easy rescheduling for brain state changes
- **Connection System**:
  - Upgrade from anonymous to connected users
  - First name visibility for regular partners
  - Mutual connection requests required

#### User Progression & Relationships

##### Anonymous Phase (Default)
- All users start anonymous
- Random avatars or initials only
- No personal information shared
- Focus purely on co-working

##### Familiar Phase (Organic Development)
- See same anonymous users multiple times
- Option to "recognize" frequent body doubling partners
- No obligation to connect

##### Connected Phase (Mutual Opt-In)
- Send/receive connection requests
- See first names of connected users
- Access to scheduled sessions together
- Gentle notifications about partner availability

#### Technical Architecture

##### Video Infrastructure
- **Primary Integration**: Agora.io or Daily.co APIs
- **Fallback Options**: WebRTC with TURN/STUN servers
- **Cost Management**: 
  - Free tier: 3 body doubling sessions per month
  - Premium tier: Unlimited sessions
- **Quality Controls**:
  - Automatic quality adjustment based on connection
  - Audio-only fallback for poor connections
  - Screen sharing optional (premium feature)

##### Room Management
```sql
-- Body doubling rooms and sessions
CREATE TABLE body_doubling_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type VARCHAR(50) NOT NULL, -- 'low_energy', 'high_energy', etc.
  current_occupancy INTEGER DEFAULT 0,
  max_occupancy INTEGER DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE body_doubling_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES body_doubling_rooms(id),
  user_id UUID REFERENCES auth.users(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  brain_state_at_start JSONB,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5)
);

CREATE TABLE user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_1_id UUID REFERENCES auth.users(id),
  user_2_id UUID REFERENCES auth.users(id),
  connection_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'blocked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_1_id, user_2_id)
);
```

### 3. 🔔 **Advanced Notification System**

#### Brain State Adaptive Notifications
**Purpose**: Provide helpful reminders that respect current cognitive capacity

**Implementation**:
- **Timing Adaptation**:
  - High energy: More frequent, detailed notifications
  - Medium energy: Standard notification patterns
  - Low energy: Minimal, gentle notifications only
- **Language Adaptation**:
  - High energy: "Ready to check in and plan your productive day?"
  - Medium energy: "How are you feeling right now?"
  - Low energy: "Gentle check-in when you're ready"
- **Frequency Controls**:
  - User-defined quiet hours
  - Hyperfocus detection (no interruptions during task streaks)
  - Customizable reminder spacing (daily, every few days, weekly)

#### Social Notification System
**Purpose**: Enable body doubling coordination without social pressure

**Implementation**:
- **Anonymous Notifications**:
  - "3 people looking for body doubling partners right now"
  - "High Energy Power Hour starting in 10 minutes"
  - "Low Energy Focus Room has 2 people"
- **Connected User Notifications**:
  - "Sarah is starting a focus session" (from connections only)
  - "Your scheduled session with Alex begins in 15 minutes"
  - "Jamie completed a body doubling session and earned a new theme!"
- **Achievement Notifications**:
  - "You earned the Brain Scientist Bronze badge!"
  - "New customization unlocked: Calming Blue theme"
  - "Gentle Victory achieved for today's micro-task completion"

#### Notification Preferences & Controls

##### Granular Control System
```typescript
interface NotificationPreferences {
  brain_state_reminders: {
    enabled: boolean;
    frequency: 'daily' | 'every_few_days' | 'weekly';
    quiet_hours: { start: string; end: string };
    adaptive_language: boolean;
  };
  body_doubling: {
    room_availability: boolean;
    partner_invites: boolean;
    session_reminders: boolean;
    connected_user_activity: boolean;
  };
  achievements: {
    immediate_celebration: boolean;
    weekly_summary: boolean;
    unlock_notifications: boolean;
  };
  system: {
    app_updates: boolean;
    maintenance_notices: boolean;
    quota_warnings: boolean;
  };
}
```

##### Smart Notification Timing
- **Hyperfocus Detection**: No notifications during continuous app usage
- **Sleep Respect**: No notifications during user-defined sleep hours
- **Energy-Based Scheduling**: Important notifications during high-energy periods
- **Gentle Escalation**: Reminders get softer, not more aggressive, over time

## Freemium Model Integration

### Free Tier Phase 2 Features
- **Gamification**: Basic achievements (Brain Scientist, Task Complexity)
- **Body Doubling**: 3 sessions per month in drop-in rooms
- **Notifications**: All basic notification types
- **Customizations**: Basic theme unlocks

### Premium Tier Phase 2 Features
- **Gamification**: Advanced achievements, custom celebrations, premium themes
- **Body Doubling**: Unlimited sessions, scheduled sessions, screen sharing
- **Notifications**: Advanced social features, connected user notifications
- **Customizations**: All sensory options, custom themes, advanced accessibility features

### Gentle Upgrade Integration
- **Body Doubling Limits**: "You've used your 3 sessions this month. Upgrade for unlimited body doubling?"
- **Advanced Features**: "Connect with regular body doubling partners with Premium"
- **Customization Gates**: "Unlock premium themes and accessibility options"
- **Never Block Core Features**: All Phase 1 functionality remains available

## Technical Integration with Phase 1

### Database Extensions
Phase 2 extends existing Phase 1 schema without breaking changes:

```sql
-- Extend user_subscriptions for gamification
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS customizations_unlocked JSONB DEFAULT '{}';
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS body_doubling_sessions_used INTEGER DEFAULT 0;

-- Extend brain_states for achievement tracking
ALTER TABLE brain_states ADD COLUMN IF NOT EXISTS achievement_earned TEXT;

-- Extend tasks for completion celebrations
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS celebration_type TEXT;
```

### API Architecture Preparation
Phase 1 API design accommodates Phase 2 features:

- **Notification endpoints**: `/api/notifications/preferences`, `/api/notifications/send`
- **Achievement endpoints**: `/api/achievements/check`, `/api/achievements/unlock`
- **Body doubling endpoints**: `/api/body-doubling/rooms`, `/api/body-doubling/sessions`
- **Real-time subscriptions**: WebSocket connections for live body doubling

### UI/UX Framework Extensions
Phase 1 React Native Paper design system supports Phase 2 overlays:

- **Achievement celebrations**: Gentle animations using Paper's animation system and theme.colors.primary
- **Notification components**: Paper Snackbar and Banner components with adaptive styling
- **Body doubling UI**: Paper Surface and Card components for video interface with built-in accessibility
- **Customization options**: Paper theme system extensible for Phase 2 unlock themes

## Development Roadmap

### Phase 2.1 - Gamification Foundation (Month 3-4)
- Brain State Achievement System
- Task Complexity Mastery
- Basic customization unlocks
- Achievement notification system

### Phase 2.2 - Body Doubling MVP (Month 5-6)
- Drop-in room infrastructure
- Agora.io/Daily.co integration
- Anonymous body doubling sessions
- Room-based notification system

### Phase 2.3 - Social Features (Month 7-8)
- User connection system
- Scheduled body doubling sessions
- Advanced social notifications
- Connected user features

### Phase 2.4 - Advanced Customization (Month 9-10)
- Premium theme system
- Advanced accessibility options
- Custom celebration animations
- Full freemium feature differentiation

## Success Metrics

### Engagement Metrics
- **Achievement Engagement**: % of users earning first achievement within 7 days
- **Body Doubling Adoption**: % of premium users trying body doubling within 30 days
- **Session Completion**: Average body doubling session completion rate
- **Return Rate**: % of users returning for second body doubling session

### Retention Metrics
- **Feature Retention**: % of users still using gamification after 30 days
- **Social Retention**: % of users making connections through body doubling
- **Premium Conversion**: % of free users upgrading for unlimited body doubling
- **Satisfaction**: User ratings for body doubling session quality

### Neurodivergent-Specific Metrics
- **Shame Reduction**: Survey responses about pressure/guilt from features
- **Energy Adaptation**: Success rate of brain state-appropriate feature usage
- **Accessibility Impact**: Usage of unlocked sensory customizations
- **Community Building**: Quality of connections formed through body doubling

---

**Phase 2: Building community and engagement while maintaining neurodivergent-first principles** 🚀