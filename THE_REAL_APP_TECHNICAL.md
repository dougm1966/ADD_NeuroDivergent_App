# ⚙️ Technical Implementation Roadmap

## Tech Stack Decisions

**Frontend: Expo 53 + React Native + TypeScript**
- Expo for rapid prototyping and easy deployment
- React Native Voice for speech-to-text recording
- TypeScript for type safety and better developer experience
- Native StyleSheet (no external styling libraries for MVP)

**AI Processing: OpenAI API**
- GPT-4 for task extraction and accomplishment celebration
- Custom prompts tuned for neurodivergent needs
- Client-side rate limiting (10 requests/day free tier)

**Backend: Supabase**
- PostgreSQL database with Row Level Security
- Real-time subscriptions for future features
- Built-in authentication (when needed)
- Edge Functions for background processing

## Database Schema

```sql
-- Voice sessions table
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_url TEXT,
  transcript TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  extracted_tasks JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accomplishments table
CREATE TABLE accomplishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES voice_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  was_planned BOOLEAN DEFAULT FALSE,
  celebration_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## MVP Phase 0 Development Plan (2 weeks)

**Week 1: Core Voice + AI**
- Day 1-2: Set up Expo project with TypeScript
- Day 3-4: Implement voice recording with React Native Voice
- Day 5-7: Integrate OpenAI API for task extraction

**Week 2: Report Back + Storage**
- Day 8-9: Build Report Back voice input
- Day 10-11: Implement accomplishment celebration AI
- Day 12-14: Add Supabase storage and basic UI polish

**MVP Components:**
1. **VoiceDumpButton** - Big button, records 30-120 seconds
2. **TaskDisplayScreen** - Shows extracted micro-steps
3. **ReportBackButton** - Green button for accomplishment input
4. **CelebrationDisplay** - Shows AI celebration response
5. **SimpleNavigation** - Switch between brain dump and report back

## AI Integration Details

**Task Extraction Prompt:**
```
You are a supportive AI assistant for neurodivergent users. Extract tasks from this overwhelmed brain dump, considering the detected energy level. Break complex tasks into micro-steps appropriate for their current capacity. Respond with encouraging, shame-free language.

Input: [voice transcript]
Energy: [1-10 detected from tone/content]
Output: JSON with tasks, micro-steps, gentle encouragement
```

**Accomplishment Celebration Prompt:**
```
Celebrate ANY activity this neurodivergent user accomplished, even if it wasn't on their original plan. Add their accomplishments to their list and update remaining tasks without shame or pressure.

Original tasks: [extracted tasks]
What they did: [reported accomplishments]
Output: Celebration message + updated task list
```

## Success Metrics & Validation

**Technical Metrics:**
- Voice recording success rate > 95%
- AI extraction accuracy (subjective user rating 1-10)
- App crash rate < 1%

**User Experience Metrics:**
- "Did the AI understand you?" (1-10 rating)
- "Do you feel less overwhelmed?" (Yes/No)
- "Will you use this again?" (Yes/No)
- Session completion rate (start to finish)

**Development Timeline: 14 days to working prototype**