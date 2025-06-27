# 📋 **Feature Specifications**

## Core Features

### 1. Daily Brain State Check-in
**Purpose**: Adapt entire app experience based on current cognitive state

**User Story**: "As a neurodivergent user, I want to quickly indicate my current brain state so the app can adapt to help me be productive without overwhelming me."

**Implementation**:
- Simple 1-10 scale sliders for Energy, Focus, and Mood
- Visual slider components with haptic feedback
- Optional notes field for context ("slept badly", "medication change", etc.)
- Takes 30 seconds or less to complete
- Stores data for trend analysis and insights

**Brain State Adaptations**:
- **Low Energy (1-3)**: Simplified UI, larger touch targets, reduced animations, only show easy tasks
- **Medium Energy (4-6)**: Standard UI with optional complexity, balanced task suggestions
- **High Energy (7-10)**: Full feature access, complex task breakdowns available, power user tools

**Acceptance Criteria**:
- [ ] User can complete check-in in under 30 seconds
- [ ] UI immediately adapts based on selected brain state
- [ ] Data persists offline and syncs when online
- [ ] Gentle reminder to check-in (never pushy or guilt-inducing)

### 2. Adaptive Task Management
**Purpose**: Present tasks appropriate to current brain state and reduce overwhelm

**User Story**: "As someone with ADHD, I want my task list to show only what I can handle right now, so I don't feel overwhelmed by everything I need to do."

**Task Complexity Levels**:
1. **Micro** (1-2 min): Check email, drink water, stretch
2. **Simple** (5-15 min): Reply to message, organize desk, quick call
3. **Medium** (30-60 min): Write report, grocery shopping, important email
4. **Complex** (1-3 hours): Project planning, deep work session, difficult conversation
5. **Major** (3+ hours): Big presentations, life decisions, major cleaning

**Implementation**:
- Tasks auto-tagged with complexity levels based on keywords and user input
- Smart filtering based on current brain state
- Visual indicators for task difficulty (color coding, icons)
- "Maybe later" option instead of harsh deletion
- Gentle transitions between complexity levels
- Time estimates for each task

**Brain State Filtering**:
- **Low Energy**: Show only Micro and Simple tasks
- **Medium Energy**: Show Micro, Simple, and Medium tasks
- **High Energy**: Show all task levels

**Acceptance Criteria**:
- [ ] Tasks are automatically categorized by complexity
- [ ] Task list filters based on current brain state
- [ ] User can manually adjust task complexity
- [ ] "Maybe later" moves tasks without guilt
- [ ] Visual complexity indicators are clear and calming

### 3. AI Task Breakdown
**Purpose**: Reduce overwhelm by breaking complex tasks into manageable micro-steps

**User Story**: "As someone who gets paralyzed by big tasks, I want the app to break them down into tiny steps so I know exactly what to do next."

**Implementation**:
- Integration with OpenAI API for intelligent task breakdown
- Context-aware prompts based on current brain state
- Gentle, encouraging language in all AI responses
- Option to further break down sub-tasks
- Save and reuse common breakdowns
- Offline fallback with pre-generated common breakdowns

**Example Breakdown**:
**Input**: "Clean the house" (Low Energy State)
**AI Output**:
1. Put on comfortable clothes (2 min)
2. Choose just one room to focus on (1 min)
3. Set a gentle 15-minute timer (1 min)
4. Pick up 5 things in that room (10 min)
5. Take a break and celebrate what you did! (5 min)

**Brain State Adaptations**:
- **Low Energy**: Micro-steps with frequent breaks, very encouraging language
- **Medium Energy**: Balanced steps with time estimates
- **High Energy**: More complex breakdowns, optional deep-work sessions

**Acceptance Criteria**:
- [ ] AI breaks tasks into brain-state appropriate steps
- [ ] Language is always gentle and encouraging
- [ ] Users can request further breakdown of sub-tasks
- [ ] Common breakdowns are saved for reuse
- [ ] Works offline with cached responses

### 4. Gentle Encouragement System
**Purpose**: Provide motivation without shame, pressure, or triggering RSD (Rejection Sensitive Dysphoria)

**User Story**: "As someone with RSD, I want encouragement that builds me up instead of making me feel guilty about what I haven't done."

**Language Principles**:
- **Positive reinforcement only** - celebrate what WAS done
- **No streak counters** - removes pressure and guilt
- **No shame language** - avoid words like "failed", "missed", "behind"
- **Compassionate understanding** - acknowledges hard days are normal
- **Progress over perfection** - small wins matter

**Encouragement Examples**:
✅ **Use**: "You did something today - that's wonderful!"
❌ **Avoid**: "You missed your streak!"

✅ **Use**: "Ready to try again when you are"
❌ **Avoid**: "You're behind schedule"

✅ **Use**: "Every small step counts"
❌ **Avoid**: "You only completed 2 out of 10 tasks"

**Implementation**:
- Celebration animations for completed tasks (gentle, not overwhelming)
- Encouraging messages based on brain state and energy level
- Weekly reflection prompts (optional, never mandatory)
- "Rest day" option that doesn't break any progress tracking

**Acceptance Criteria**:
- [ ] No red colors or harsh language anywhere in app
- [ ] Celebrations are gentle and optional
- [ ] Users can mark "rest days" without penalty
- [ ] Encouragement adapts to brain state and user preferences

### 5. Sensory Customization
**Purpose**: Accommodate sensory sensitivities and create a personally comfortable experience

**User Story**: "As someone with sensory sensitivities, I want to customize the app's look, feel, and sounds so it doesn't overwhelm my senses."

**Visual Customizations**:
- **Color themes**: Calm pastels, high contrast, dark mode, monochrome
- **Animation levels**: None, minimal, standard, full
- **Font options**: Standard, large text, dyslexia-friendly (OpenDyslexic)
- **Visual density**: Spacious, standard, compact

**Audio Customizations**:
- **Sound preferences**: Off, subtle, standard
- **Notification sounds**: Gentle chimes, nature sounds, or silent
- **Haptic feedback**: Off, light, standard, strong

**Interaction Customizations**:
- **Touch sensitivity**: Light, standard, firm
- **Gesture preferences**: Simple taps only, or full gesture support
- **Timeout settings**: Extended time for interactions

**Implementation**:
- Settings easily accessible from main screen
- Changes apply immediately (no restart required)
- Preferences sync across devices
- Smart defaults based on common neurodivergent preferences

**Acceptance Criteria**:
- [ ] All customizations apply immediately
- [ ] Settings persist across app restarts
- [ ] Reduced motion respects system preferences
- [ ] High contrast mode meets accessibility standards

### 6. Offline Functionality
**Purpose**: Ensure productivity isn't dependent on internet connection

**User Story**: "As someone who travels or has unreliable internet, I want the core app features to work offline so I can stay productive anywhere."

**Offline Features**:
- Brain state check-ins save locally
- Task creation and editing works offline
- Basic task breakdowns from cached AI responses
- All sensory customizations work offline
- Data syncs automatically when connection returns

**Implementation**:
- SQLite local database for core data
- AsyncStorage for user preferences
- Smart sync conflict resolution
- Clear indicators when offline vs online
- Graceful degradation of AI features

**Acceptance Criteria**:
- [ ] Core features work without internet
- [ ] Data syncs seamlessly when online
- [ ] User knows when they're offline
- [ ] No data loss during offline usage

## Freemium Model Features

### Free Tier
**Target**: Accessible core productivity for everyone

**Included Features**:
- **🧠 Brain State Check-ins**: Unlimited daily check-ins
- **📋 Basic Task Management**: Create, edit, complete tasks (unlimited)
- **🎨 Basic Sensory Customization**: Essential accessibility options
- **📱 Offline Functionality**: Full offline support
- **🤖 AI Task Breakdown**: 10 AI requests per month
- **🎯 Basic Gamification**: Brain State Achievement System and Task Complexity Mastery
- **👥 Limited Body Doubling**: 3 sessions per month in drop-in rooms
- **💾 Data Storage**: 6 months of brain state history

**Limitations**:
- AI breakdown limit: 10 requests/month
- Body doubling limit: 3 sessions/month
- Basic customization options only
- Brain state history: 6 months
- No advanced analytics or social features
- Community support only

### Premium Tier ($4.99/month)
**Target**: Power users who want unlimited AI assistance, social features, and advanced customization

**Everything in Free Tier Plus**:
- **🤖 Unlimited AI Breakdown**: 100+ requests per month
- **👥 Unlimited Body Doubling**: Unlimited co-working sessions with drop-in rooms, matched sessions, and scheduled sessions
- **🎯 Advanced Gamification**: Premium achievements, custom celebrations, and exclusive theme unlocks
- **🎨 Enhanced Customization**: All sensory options, premium themes, custom fonts, and accessibility features
- **📊 Advanced Insights**: Brain state pattern analysis and long-term productivity trends
- **🔔 Social Notifications**: Connect with regular body doubling partners and receive partner activity updates
- **💾 Unlimited History**: All-time brain state and task data
- **📧 Priority Support**: Email support within 24 hours
- **🔄 Advanced Sync**: Real-time sync across unlimited devices

**Value Proposition**:
- "Unlock your brain's full potential with unlimited AI assistance"
- "Perfect for neurodivergent professionals and students"
- "Less than the cost of one coffee per month"

### Feature Gating Strategy

**Gentle Upgrade Prompts**:
- When AI limit reached: "You've used all your AI assistance this month. Upgrade for unlimited breakdowns?"
- When body doubling limit reached: "You've used your 3 body doubling sessions this month. Upgrade for unlimited co-working?"
- On analytics screens: "See your productivity patterns with Premium insights"
- On advanced customization: "Unlock premium themes and sensory options with Premium"
- On social features: "Connect with regular body doubling partners with Premium"
- Never interrupt core functionality or create shame

**Free User Experience**:
- Core app fully functional without upgrades
- No aggressive popups or interruptions
- Value-focused upgrade suggestions
- Trial offers for premium features

**Acceptance Criteria**:
- [ ] Free users can be fully productive within limits
- [ ] Upgrade prompts are gentle and shame-free
- [ ] Premium features add genuine value
- [ ] No core functionality locked behind paywall

## Phase 2 Features (Months 3-10)
See [PHASE_2_FEATURES.md](PHASE_2_FEATURES.md) for complete specifications:
- **🎯 Advanced Gamification**: Brain state achievements, task complexity mastery, customization unlocks
- **👥 Full Body Doubling Platform**: Drop-in rooms, matched sessions, scheduled sessions with video
- **🔔 Advanced Notification System**: Brain state adaptive notifications, social features, user connections
- **🎨 Premium Customization System**: Advanced themes, sensory options, accessibility features

## Future Features (Phase 3+)
- **📅 Calendar Integration**: Smart scheduling based on brain state patterns
- **🗣️ Voice Task Entry**: Hands-free task creation
- **💊 Medication Reminders**: Gentle, customizable reminders
- **😴 Sleep & Energy Correlation**: Insights into patterns
- **🏃‍♀️ Habit Tracking**: Gentle, non-streak-based habit building
- **👨‍⚕️ Therapist/Coach Integration**: Share progress with care team
- **🌍 Community Features**: Optional peer support and tips

## Success Metrics
- **User Engagement**: Daily brain state check-ins completed
- **Task Completion**: Tasks marked done (regardless of quantity)
- **User Satisfaction**: App Store ratings and qualitative feedback
- **Retention**: Users still active after 30, 60, 90 days
- **Wellbeing Impact**: Self-reported stress and productivity improvements

---

## Reference Documentation

### **Future Planning & Scalability**
- 🔮 [Phase 2 Scalability Reference](reference/PHASE_2_SCALABILITY.md) - Future features that inform current architecture
- 🔄 [Architecture Evolution Guide](reference/ARCHITECTURE_EVOLUTION.md) - How features evolve from Phase 1 to Phase 2

### **Implementation Guides**
- 🏗️ [Technical Architecture](ARCHITECTURE.md) - Implementation specifications for these features
- 🔔 [Phase 1 Notifications](PHASE_1_NOTIFICATIONS.md) - Detailed notification system specification
- 📐 [Development Guidelines](GUIDELINES.md) - Standards for implementing these features

---

**Every feature designed with neurodivergent brains in mind** 🧠💙