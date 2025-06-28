# 🎯 Project Context

**Project:** ADD_NeuroDivergent_App  
**Working Directory:** `~/projects/ADD_NeuroDivergent_App` (WSL Native)

---

## 🔧 Environment

- **Expo Version:** 53 (React Native 0.79, TypeScript 5.8)
- **Database:** Supabase PostgreSQL with Row Level Security
- **Speed:** WSL native = 10-20x faster than `/mnt/c/...` paths
- **Never Use:** Windows mount paths (slow & outdated)

---

## 🧠 Neurodivergent-First Design

### Brain State System
- **Energy Level (1-10):** Drives task complexity filtering
- **Focus Level (1-10):** Affects UI complexity and density  
- **Mood Level (1-10):** Influences encouragement messaging
- **Notes:** Optional context (max 500 chars)

### Data Philosophy
- **Gentle Validation:** Prevent bad data without harsh errors
- **Reasonable Limits:** 500 chars for notes, 1000 for descriptions
- **Required Fields:** Core brain state levels must exist for app to function
- **Time Boundaries:** 1-1440 minutes (realistic task duration)

---

## 🔐 Security

### AI API
- **OpenAI API:** Moved to Supabase Edge Functions (server-side only)
- **Security:** API keys no longer exposed in client code
- **Edge Function:** `supabase/functions/openai-task-breakdown/index.ts`

### Notifications
- **Two Systems:** Basic notifications + AI-adapted notifications
- **Status:** Ownership conflicts resolved ✅
- **Implementation:** Both systems can coexist safely

---

## 📊 Schema Authority

- **Authoritative Source:** `AGENT_2_SPRINT_2B.md`
- **Rationale:** Superior data validation, prevents invalid states
- **Action Needed:** Update docs/DATABASE.md with AGENT_2_SPRINT_2B.md constraints

---

## 🧪 Testing Strategy

### Constraint Testing
- Test constraints by inserting invalid data (should fail)
- Verify energy_level = 11 fails (brain_states)
- Verify ai_requests_used = -1 fails (user_subscriptions)
- Verify empty title fails (tasks)
- Verify 1500 minute estimate fails (tasks)

### Rollback Plan
- Each constraint can be dropped individually if issues arise
- Database migrations should be reversible
- Keep backups before applying changes

---

## 🚀 Implementation Approach

### Augmented Coding
1. **Analyze First:** Completed ✅
2. **Fix One Issue at a Time:** Start with Priority 1
3. **Test Each Change:** Verify constraints work with invalid data
4. **Verify Integration:** Ensure RLS policies still function
5. **Document Changes:** Update schema documentation

---

**Next: Apply brain_states constraints from DATABASE_FIXES.md** 🎯