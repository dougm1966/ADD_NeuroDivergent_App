# 🤖 Agent 2 Sprint 2B: Voice Task Processing

## Mission
Create AI-powered voice task processing system that extracts structured tasks from voice sessions while respecting energy levels and managing AI quotas.

## Sprint Goal
Build a reliable voice-to-task pipeline that processes voice transcripts into actionable tasks with energy-aware complexity.

## Time Estimate
45-60 minutes

## Prerequisites
- Sprint 2A voice data foundation complete
- OpenAI API access configured
- Voice session storage working
- Basic task structure established

## Critical Rules (NEVER VIOLATE)
1. Never exceed user's AI quota
2. Preserve voice context in tasks
3. Honor energy levels from voice
4. Keep all processing shame-free
5. Handle offline gracefully

## Sprint Tasks

### Task 1: Voice Task Extraction Service
```typescript
// src/services/voiceTaskExtraction.ts
import { Configuration, OpenAIApi } from 'openai';
import { supabase } from './supabaseClient';
import { VoiceSession, VoiceTask } from '@voice/types';

export class VoiceTaskExtractor {
  private openai: OpenAIApi;
  private quotaManager: AIQuotaManager;
  
  constructor() {
    this.openai = new OpenAIApi(new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    }));
    this.quotaManager = new AIQuotaManager();
  }
  
  async extractTasksFromVoice(
    session: VoiceSession
  ): Promise<VoiceTask[]> {
    // Check AI quota before processing
    await this.quotaManager.checkQuota(session.user_id);
    
    const prompt = this.buildTaskExtractionPrompt(
      session.transcription,
      session.energy_level
    );
    
    const completion = await this.openai.createCompletion({
      model: "gpt-4",
      prompt,
      max_tokens: 500,
      temperature: 0.7
    });
    
    const tasks = this.parseTasksFromCompletion(
      completion.data.choices[0].text,
      session.energy_level
    );
    
    // Track AI usage
    await this.quotaManager.trackUsage(session.user_id, completion.data.usage);
    
    return tasks;
  }
  
  private buildTaskExtractionPrompt(
    transcription: string,
    energyLevel: number
  ): string {
    return `
      Energy Level: ${energyLevel}/10
      Voice Transcription: "${transcription}"
      
      Extract tasks while considering energy level.
      For low energy (1-3): Break into very small steps
      For medium energy (4-7): Standard task breakdown
      For high energy (8-10): Can handle complexity
      
      Format: JSON array of tasks with:
      - task_text
      - energy_required (1-10)
      - estimated_duration
      - priority (low/medium/high)
    `;
  }
}
```

### Task 2: AI Quota Management
```typescript
// src/services/aiQuotaManager.ts
export class AIQuotaManager {
  async checkQuota(userId: string): Promise<boolean> {
    const { data: quota } = await supabase
      .from('ai_quotas')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (quota.remaining_tokens < 1000) {
      throw new Error('AI quota low - consider upgrading');
    }
    
    return true;
  }
  
  async trackUsage(
    userId: string,
    usage: { prompt_tokens: number; completion_tokens: number }
  ): Promise<void> {
    await supabase.rpc('update_ai_quota', {
      p_user_id: userId,
      p_tokens_used: usage.prompt_tokens + usage.completion_tokens
    });
  }
}
```

### Task 3: Energy-Aware Task Processing
```typescript
// src/services/taskEnergySplitter.ts
export class TaskEnergySplitter {
  splitTasksByEnergy(
    tasks: VoiceTask[],
    userEnergyLevel: number
  ): VoiceTask[] {
    if (userEnergyLevel <= 3) {
      return this.splitIntoMicroTasks(tasks);
    } else if (userEnergyLevel <= 7) {
      return this.splitIntoStandardTasks(tasks);
    } else {
      return this.preserveComplexTasks(tasks);
    }
  }
  
  private splitIntoMicroTasks(tasks: VoiceTask[]): VoiceTask[] {
    // Break tasks into very small, manageable steps
    return tasks.flatMap(task => this.createMicroSteps(task));
  }
  
  // Additional splitting logic...
}
```

### Task 4: Voice Accomplishment Tracking
```typescript
// src/services/accomplishmentTracker.ts
export class VoiceAccomplishmentTracker {
  async trackAccomplishment(
    voiceSession: VoiceSession,
    task: VoiceTask
  ): Promise<void> {
    const { data: accomplishment } = await supabase
      .from('voice_accomplishments')
      .insert({
        voice_session_id: voiceSession.id,
        task_id: task.id,
        energy_level: voiceSession.energy_level,
        accomplishment_text: task.task_text,
        celebration_type: this.getCelebrationType(voiceSession.energy_level)
      })
      .single();
      
    await this.triggerCelebration(accomplishment);
  }
  
  private getCelebrationType(energyLevel: number): string {
    // Adapt celebration to energy level
    if (energyLevel <= 3) return 'gentle';
    if (energyLevel <= 7) return 'standard';
    return 'energetic';
  }
}
```

### Task 5: Voice Processing Queue
```typescript
// src/services/voiceProcessingQueue.ts
export class VoiceProcessingQueue {
  async queueVoiceProcessing(session: VoiceSession): Promise<void> {
    await supabase
      .from('voice_processing_queue')
      .insert({
        voice_session_id: session.id,
        status: 'pending',
        priority: this.calculatePriority(session)
      });
  }
  
  async processQueue(): Promise<void> {
    const { data: queueItems } = await supabase
      .from('voice_processing_queue')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false });
      
    for (const item of queueItems) {
      await this.processVoiceSession(item);
    }
  }
}
```

## Success Criteria
- [ ] Voice task extraction working
- [ ] AI quota management active
- [ ] Energy-aware task splitting functional
- [ ] Accomplishment tracking ready
- [ ] Processing queue operational
- [ ] All operations respect energy levels

## Validation Commands
```bash
# Test task extraction
npm run test:voice-task-extraction

# Verify AI quota management
npm run test:ai-quota

# Test energy-based processing
npm run test:energy-splitting
```

## What Sprint 2C Needs
- Working task extraction
- AI quota system
- Energy-aware processing
- Accomplishment tracking
- Processing queue

## Common Mistakes to Avoid
- Don't exceed AI quotas
- Don't ignore energy levels
- Don't create overwhelming tasks
- Don't lose offline voice data
- Don't skip accomplishment tracking

## Files Created/Modified
- Voice task extraction service
- AI quota manager
- Energy splitter
- Accomplishment tracker
- Processing queue

## Next Sprint Preview
Sprint 2C will add voice analytics and reporting capabilities.

---
**Sprint 2B Focus**: Smart, energy-aware voice task processing.