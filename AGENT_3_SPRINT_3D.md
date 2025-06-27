# 🤖 Agent 3 Sprint 3D: AI Integration

## Mission
Add OpenAI service integration to task store with quota management and brain state-aware prompts.

## Time Estimate
1 hour

## Prerequisites
- Sprint 3C completed (task store working)
- Sprint 2D completed (openaiService + subscriptionService available)

## Sprint Goal
Task store can request AI breakdowns while respecting subscription quotas with gentle error handling.

## Core Tasks

### Task 1: Add AI Integration to Task Store
**Update**: `src/store/taskStore.ts` - Add these methods to interface and implementation:
```typescript
// Add to TaskStore interface:
aiRequestInProgress: boolean;
requestAIBreakdown: (taskId: string, userId: string) => Promise<void>;

// Add to initial state:
aiRequestInProgress: false,

// Add to store implementation:
requestAIBreakdown: async (taskId, userId) => {
  set({ aiRequestInProgress: true, error: null });
  
  try {
    // Check quota first
    const quotaResult = await subscriptionService.checkQuota(userId);
    if (!quotaResult.canMakeRequest) {
      let quotaMessage = quotaResult.tier === 'free' 
        ? "You've used all your AI assistance this month. Upgrade for unlimited breakdowns?"
        : "You've reached your monthly limit. Your quota will reset soon!";
      
      set({ error: quotaMessage, aiRequestInProgress: false });
      return;
    }

    const task = get().getTaskById(taskId);
    const brainStateStore = useBrainStateStore.getState();
    const brainState = brainStateStore.currentState;
    
    if (!task || !brainState) {
      set({ 
        error: "Let's try that breakdown again",
        aiRequestInProgress: false 
      });
      return;
    }

    // Request AI breakdown
    const breakdown = await openaiService.breakdownTask(task.title, brainState, userId);
    
    // Update task with breakdown
    await get().updateTask(taskId, { 
      ai_breakdown: breakdown,
      updated_at: new Date().toISOString()
    });
    
    // Increment usage counter
    await subscriptionService.incrementUsage(userId);
    
    set({ aiRequestInProgress: false });
    
  } catch (error) {
    let errorMessage = "Let me try a different approach";
    
    if (error.message === 'quota_exceeded') {
      errorMessage = "You've used all your AI assistance this month. Upgrade for unlimited breakdowns?";
    } else if (error.message === 'network_error') {
      errorMessage = "Let's try connecting again in a moment";
    }
    
    set({ 
      error: errorMessage,
      aiRequestInProgress: false 
    });
  }
}
```

### Task 2: AI Prompt Utilities
**Create**: `src/utils/aiPrompts.ts`
```typescript
import { BrainState } from '../services/brainStateService';

export const buildTaskBreakdownPrompt = (
  taskTitle: string,
  brainState: BrainState
): string => {
  const { energy_level, focus_level, mood_level, notes } = brainState;
  const avgLevel = (energy_level + focus_level) / 2;
  
  let basePrompt = `Break down this task into step-by-step actions: "${taskTitle}"`;
  
  // Adapt prompt based on brain state
  if (avgLevel <= 3) {
    // Low energy - need micro steps
    return `${basePrompt}

The user has low energy today (energy: ${energy_level}/10, focus: ${focus_level}/10). 
Please break this into very small, gentle steps that take 2-5 minutes each.
Use encouraging, non-demanding language.
Include rest breaks between steps.
Make the first step extremely easy to build momentum.
${notes ? `Context: ${notes}` : ''}`;
  }
  
  if (avgLevel >= 7) {
    // High energy - can handle complexity
    return `${basePrompt}

The user has high energy today (energy: ${energy_level}/10, focus: ${focus_level}/10).
Please break this into detailed, actionable steps.
Include time estimates and optional optimization suggestions.
The user can handle complex multi-step processes.
${notes ? `Context: ${notes}` : ''}`;
  }
  
  // Medium energy - balanced approach
  return `${basePrompt}

The user has moderate energy today (energy: ${energy_level}/10, focus: ${focus_level}/10).
Please break this into clear, manageable steps with realistic time estimates.
Keep language encouraging and include optional shortcuts.
${notes ? `Context: ${notes}` : ''}`;
};

export const parseAIBreakdown = (
  aiResponse: any
): { steps: string[]; timeEstimate: number; adapted: boolean } => {
  try {
    const content = aiResponse.choices?.[0]?.message?.content || '';
    
    // Parse steps from AI response
    const steps = content
      .split('\n')
      .filter(line => line.trim().match(/^\d+\.|\-\s/))
      .map(step => step.replace(/^\d+\.\s*|\-\s*/, '').trim())
      .filter(step => step.length > 0);
    
    // Estimate total time (rough calculation)
    const timeEstimate = Math.max(steps.length * 10, 15); // Min 15 minutes
    
    return {
      steps: steps.length > 0 ? steps : ['Complete the task step by step'],
      timeEstimate,
      adapted: true
    };
  } catch (error) {
    // Fallback breakdown
    return {
      steps: ['Complete the task step by step'],
      timeEstimate: 30,
      adapted: false
    };
  }
};
```

### Task 3: Quota Display Utilities
**Create**: `src/utils/quotaHelpers.ts`
```typescript
import { QuotaCheckResult } from '../services/subscriptionService';

export interface QuotaDisplayData {
  usagePercentage: number;
  remainingRequests: number;
  shouldShowUpgrade: boolean;
  upgradeMessage: string;
  resetDate: string;
}

export const getQuotaDisplayData = (quota: QuotaCheckResult): QuotaDisplayData => {
  const usagePercentage = Math.round((quota.requestsUsed / quota.requestsLimit) * 100);
  const remainingRequests = Math.max(0, quota.requestsLimit - quota.requestsUsed);
  
  let shouldShowUpgrade = false;
  let upgradeMessage = '';
  
  if (quota.tier === 'free') {
    if (usagePercentage >= 80) {
      shouldShowUpgrade = true;
      upgradeMessage = remainingRequests === 0 
        ? "You've used all your AI assistance this month. Upgrade for unlimited breakdowns!"
        : `Only ${remainingRequests} AI breakdowns left this month. Upgrade for unlimited!`;
    }
  }
  
  return {
    usagePercentage,
    remainingRequests,
    shouldShowUpgrade,
    upgradeMessage,
    resetDate: quota.resetDate
  };
};

export const getGentleQuotaMessage = (
  remainingRequests: number,
  tier: 'free' | 'premium'
): string => {
  if (tier === 'premium') {
    return "Unlimited AI assistance with your premium subscription!";
  }
  
  if (remainingRequests === 0) {
    return "You've used all your AI assistance this month. Upgrade when you're ready for more support!";
  }
  
  if (remainingRequests <= 2) {
    return `${remainingRequests} AI breakdown${remainingRequests === 1 ? '' : 's'} remaining this month.`;
  }
  
  return `${remainingRequests} AI breakdowns available this month.`;
};
```

### Task 4: Update Store Exports
**Update**: `src/store/index.ts`
```typescript
export { useBrainStateStore } from './brainStateStore';
export { useTaskStore } from './taskStore';
export type { BrainStateStore } from './brainStateStore';
export type { TaskStore } from './taskStore';
export type { BrainState } from '../services/brainStateService';
export type { Task } from '../services/taskService';
export type { BrainStateAdaptation } from '../types/adaptation';

// Adaptation utilities
export { 
  getSpacingForAdaptation, 
  getTouchTargetSize, 
  getEncouragementMessage 
} from '../utils/adaptationHelpers';

// AI utilities
export { buildTaskBreakdownPrompt, parseAIBreakdown } from '../utils/aiPrompts';
export { getQuotaDisplayData, getGentleQuotaMessage } from '../utils/quotaHelpers';
export type { QuotaDisplayData } from '../utils/quotaHelpers';
```

### Task 5: AI Integration Test
**Create**: `__tests__/store/aiIntegration.test.ts`
```typescript
import { useTaskStore } from '../../src/store/taskStore';
import { subscriptionService } from '../../src/services/subscriptionService';
import { openaiService } from '../../src/services/openaiService';

jest.mock('../../src/services/subscriptionService');
jest.mock('../../src/services/openaiService');

const mockSubscriptionService = subscriptionService as jest.Mocked<typeof subscriptionService>;
const mockOpenaiService = openaiService as jest.Mocked<typeof openaiService>;

describe('Task Store - AI Integration', () => {
  test('should check quota before AI request', async () => {
    const store = useTaskStore.getState();
    
    // Mock quota available
    mockSubscriptionService.checkQuota.mockResolvedValue({
      canMakeRequest: true,
      requestsUsed: 5,
      requestsLimit: 10,
      tier: 'free',
      resetDate: '2025-07-25'
    });

    mockOpenaiService.breakdownTask.mockResolvedValue({
      steps: ['Step 1', 'Step 2'],
      timeEstimate: 30,
      adapted: true
    });

    await store.requestAIBreakdown('task-id', 'user-id');

    // Should check quota first
    expect(mockSubscriptionService.checkQuota).toHaveBeenCalledWith('user-id');
    // Should make AI request
    expect(mockOpenaiService.breakdownTask).toHaveBeenCalled();
    // Should increment usage
    expect(mockSubscriptionService.incrementUsage).toHaveBeenCalledWith('user-id');
  });

  test('should handle quota exceeded gracefully', async () => {
    const store = useTaskStore.getState();
    
    // Mock quota exceeded
    mockSubscriptionService.checkQuota.mockResolvedValue({
      canMakeRequest: false,
      requestsUsed: 10,
      requestsLimit: 10,
      tier: 'free',
      resetDate: '2025-07-25'
    });

    await store.requestAIBreakdown('task-id', 'user-id');

    // Should NOT make AI request
    expect(mockOpenaiService.breakdownTask).not.toHaveBeenCalled();
    // Should show gentle upgrade message
    expect(store.error).toContain('upgrade for unlimited');
    expect(store.aiRequestInProgress).toBe(false);
  });
});
```

## Success Criteria
- [ ] Task store integrates with OpenAI service for AI breakdowns
- [ ] Quota checking prevents requests when limit reached
- [ ] AI prompts adapt based on brain state (low/medium/high energy)
- [ ] Gentle error messages for quota exceeded and network errors
- [ ] Usage counter increments after successful AI request
- [ ] Store loading state managed during AI requests

## Testing Commands
```bash
npm run test -- --testPathPattern=aiIntegration
```

## Next Sprint
**3E: Brain State Screen** - Create check-in UI that uses the brain state store.

## Agent Dependencies
- **Needs from Agent 2**: `openaiService`, `subscriptionService` with proper interfaces
- **Needs from Agent 3B**: Brain state adaptation for AI prompt customization
- **Provides to Agent 3E**: Complete task store with AI functionality
- **Provides to Agent 4**: Quota display utilities and AI request management

## Common Issues
- **Service imports**: Ensure AI and subscription services are properly imported
- **Quota timing**: Check quota before making expensive AI requests
- **Error handling**: Distinguish between quota, network, and API errors
- **Brain state access**: Ensure brain state store is accessible

---
**Focus**: AI integration only. Screen implementation comes in 3E.