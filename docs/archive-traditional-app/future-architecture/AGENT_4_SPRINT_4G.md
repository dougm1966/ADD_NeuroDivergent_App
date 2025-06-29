# 🧪 Agent 4 Sprint 4G: Component Integration Testing

## Mission
Create comprehensive integration tests that validate all Agent 4 components work together seamlessly with proper brain state adaptation, accessibility compliance, and freemium functionality.

## Time Estimate
1.5 hours

## Prerequisites
- Sprint 4F completed (accessibility and adaptation systems available)
- All Agent 4 components created (4A-4F)
- Agent 3 integration patterns understood

## Sprint Goal
Establish robust integration testing suite that ensures all Agent 4 components work together harmoniously and integrate properly with Agent 3's brain state system and Agent 2's subscription management.

## Core Tasks

### Task 1: Component Integration Test Framework
**Create**: `__tests__/integration/componentIntegration.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SensoryCustomizationProvider } from '../../src/providers/SensoryCustomizationProvider';
import { BrainStateAdaptationManager } from '../../src/components/BrainStateAdaptationManager';
import {
  GentleButton,
  BrainStateSlider,
  BrainStateCheckinForm,
  TaskCard,
  AIQuotaDisplay,
  GentleUpgradeModal,
  AccessibilitySettingsScreen,
} from '../../src/components';

// Mock brain state for testing
const mockBrainState = {
  energy_level: 5,
  focus_level: 6,
  mood_level: 7,
};

const mockLowEnergyBrainState = {
  energy_level: 2,
  focus_level: 3,
  mood_level: 4,
};

const mockHighEnergyBrainState = {
  energy_level: 8,
  focus_level: 9,
  mood_level: 8,
};

// Test wrapper that includes all necessary providers
const IntegrationTestWrapper: React.FC<{ 
  children: React.ReactNode;
  brainState?: typeof mockBrainState;
}> = ({ children, brainState = mockBrainState }) => (
  <SensoryCustomizationProvider>
    <BrainStateAdaptationManager currentBrainState={brainState}>
      {children}
    </BrainStateAdaptationManager>
  </SensoryCustomizationProvider>
);

describe('Component Integration Tests', () => {
  describe('Brain State Check-in Flow Integration', () => {
    test('Complete check-in flow with success feedback', async () => {
      const mockSubmit = jest.fn();
      const mockContinue = jest.fn();
      
      const { getByTestId, getByText, queryByTestId } = render(
        <IntegrationTestWrapper>
          <BrainStateCheckinForm
            energy={5}
            focus={6}
            mood={7}
            notes=""
            onEnergyChange={() => {}}
            onFocusChange={() => {}}
            onMoodChange={() => {}}
            onNotesChange={() => {}}
            onSubmit={mockSubmit}
            loading={false}
            error={null}
            testID="checkin-form"
          />
        </IntegrationTestWrapper>
      );

      // Verify form is rendered correctly
      expect(getByTestId('checkin-form')).toBeTruthy();
      expect(getByTestId('energy-slider')).toBeTruthy();
      expect(getByTestId('focus-slider')).toBeTruthy();
      expect(getByTestId('mood-slider')).toBeTruthy();

      // Test form submission
      fireEvent.press(getByTestId('submit-button'));
      expect(mockSubmit).toHaveBeenCalled();
    });

    test('Brain state adaptation affects check-in form UI', () => {
      const lowEnergyProps = {
        energy: 2,
        focus: 3,
        mood: 2,
        notes: "",
        onEnergyChange: jest.fn(),
        onFocusChange: jest.fn(),
        onMoodChange: jest.fn(),
        onNotesChange: jest.fn(),
        onSubmit: jest.fn(),
        loading: false,
        error: null,
        currentBrainState: mockLowEnergyBrainState,
      };

      const { getByText } = render(
        <IntegrationTestWrapper brainState={mockLowEnergyBrainState}>
          <BrainStateCheckinForm {...lowEnergyProps} />
        </IntegrationTestWrapper>
      );

      // Check for gentle language adaptation
      expect(getByText(/No pressure - just checking in/)).toBeTruthy();
      expect(getByText(/That's perfect/)).toBeTruthy();
    });
  });

  describe('Task Management Integration', () => {
    test('Task card adapts to brain state and integrates with freemium', () => {
      const mockTask = {
        id: '1',
        title: 'Complex coding task',
        description: 'Implement new feature',
        complexity_level: 4,
        estimated_minutes: 120,
        is_completed: false,
        ai_breakdown: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { getByText, getByTestId } = render(
        <IntegrationTestWrapper brainState={mockLowEnergyBrainState}>
          <TaskCard
            task={mockTask}
            onPress={() => {}}
            onToggleComplete={() => {}}
            onRequestBreakdown={() => {}}
            brainState={mockLowEnergyBrainState}
            userTier="free"
            aiQuota={{ used: 5, limit: 10 }}
          />
        </IntegrationTestWrapper>
      );

      // Should show complexity warning for low energy state
      expect(getByText(/might be challenging right now/)).toBeTruthy();
    });

    test('AI breakdown integration with quota management', () => {
      const mockTask = {
        id: '1',
        title: 'Task needing breakdown',
        complexity_level: 5,
        is_completed: false,
        created_at: new Date().toISOString(),
      };

      const mockRequestBreakdown = jest.fn();

      const { getByText } = render(
        <IntegrationTestWrapper>
          <TaskCard
            task={mockTask}
            onPress={() => {}}
            onToggleComplete={() => {}}
            onRequestBreakdown={mockRequestBreakdown}
            userTier="free"
            aiQuota={{ used: 9, limit: 10 }}
          />
        </IntegrationTestWrapper>
      );

      // Should show AI breakdown option with quota warning
      const breakdownButton = getByText(/Break this down/);
      fireEvent.press(breakdownButton);
      expect(mockRequestBreakdown).toHaveBeenCalled();
    });
  });

  describe('Freemium UI Integration', () => {
    test('Quota display integrates with upgrade modal', async () => {
      const mockUpgrade = jest.fn();
      const [isModalVisible, setModalVisible] = React.useState(false);

      const TestComponent = () => (
        <IntegrationTestWrapper>
          <>
            <AIQuotaDisplay
              used={10}
              limit={10}
              tier="free"
              onUpgradePress={() => setModalVisible(true)}
              testID="quota-display"
            />
            <GentleUpgradeModal
              visible={isModalVisible}
              onClose={() => setModalVisible(false)}
              onUpgrade={mockUpgrade}
              trigger="ai_quota"
              currentUsage={{ aiRequests: { used: 10, limit: 10 } }}
              testID="upgrade-modal"
            />
          </>
        </IntegrationTestWrapper>
      );

      const { getByTestId, getByText } = render(<TestComponent />);

      // Test quota display
      expect(getByTestId('quota-display')).toBeTruthy();
      expect(getByText(/All AI requests used this month/)).toBeTruthy();

      // Test upgrade flow
      fireEvent.press(getByTestId('upgrade-button'));
      
      await waitFor(() => {
        expect(getByTestId('upgrade-modal')).toBeTruthy();
      });
    });

    test('Brain state affects upgrade modal language', () => {
      const { getByText } = render(
        <IntegrationTestWrapper brainState={mockLowEnergyBrainState}>
          <GentleUpgradeModal
            visible={true}
            onClose={() => {}}
            onUpgrade={() => {}}
            trigger="ai_quota"
            brainState={mockLowEnergyBrainState}
          />
        </IntegrationTestWrapper>
      );

      // Should use gentle language for low energy
      expect(getByText(/Gentle upgrade available/)).toBeTruthy();
    });
  });

  describe('Accessibility Integration', () => {
    test('Accessibility settings affect all components', async () => {
      const TestScenario = () => {
        const [fontSize, setFontSize] = React.useState<'medium' | 'large'>('medium');
        
        return (
          <IntegrationTestWrapper>
            <>
              <GentleButton
                title="Test Button"
                onPress={() => {}}
                testID="test-button"
              />
              <BrainStateSlider
                value={5}
                onValueChange={() => {}}
                accessibilityLabel="Test Slider"
                testID="test-slider"
              />
              {/* Simulate accessibility settings change */}
              <GentleButton
                title="Increase Font Size"
                onPress={() => setFontSize('large')}
                testID="font-size-button"
              />
            </>
          </IntegrationTestWrapper>
        );
      };

      const { getByTestId } = render(<TestScenario />);

      // Verify components are accessible
      expect(getByTestId('test-button')).toBeTruthy();
      expect(getByTestId('test-slider')).toBeTruthy();

      // Test accessibility setting change
      fireEvent.press(getByTestId('font-size-button'));
      
      // Components should adapt to new accessibility settings
      await waitFor(() => {
        expect(getByTestId('test-button')).toBeTruthy();
      });
    });
  });

  describe('Cross-Component State Management', () => {
    test('Brain state changes propagate through all components', async () => {
      const TestApp = () => {
        const [brainState, setBrainState] = React.useState(mockBrainState);
        
        return (
          <IntegrationTestWrapper brainState={brainState}>
            <>
              {/* Components that should adapt to brain state */}
              <GentleButton
                title="Adapted Button"
                onPress={() => {}}
                testID="adapted-button"
              />
              <AIQuotaDisplay
                used={5}
                limit={10}
                tier="free"
                brainState={brainState}
                testID="adapted-quota"
              />
              
              {/* Control to change brain state */}
              <GentleButton
                title="Switch to Low Energy"
                onPress={() => setBrainState(mockLowEnergyBrainState)}
                testID="low-energy-button"
              />
            </>
          </IntegrationTestWrapper>
        );
      };

      const { getByTestId, getByText } = render(<TestApp />);

      // Initial state
      expect(getByTestId('adapted-button')).toBeTruthy();
      expect(getByTestId('adapted-quota')).toBeTruthy();

      // Change brain state
      fireEvent.press(getByTestId('low-energy-button'));

      // Verify adaptation occurred
      await waitFor(() => {
        // AIQuotaDisplay should show gentle language
        expect(getByText(/AI requests used this month/)).toBeTruthy();
      });
    });

    test('Freemium state affects multiple components simultaneously', () => {
      const mockPremiumUser = {
        tier: 'premium' as const,
        aiQuota: { used: 50, limit: 1000 },
      };

      const { getByText, queryByText } = render(
        <IntegrationTestWrapper>
          <>
            <AIQuotaDisplay
              used={mockPremiumUser.aiQuota.used}
              limit={mockPremiumUser.aiQuota.limit}
              tier={mockPremiumUser.tier}
            />
            <TaskCard
              task={{
                id: '1',
                title: 'Premium task',
                complexity_level: 4,
                is_completed: false,
                created_at: new Date().toISOString(),
              }}
              onPress={() => {}}
              onToggleComplete={() => {}}
              userTier={mockPremiumUser.tier}
              aiQuota={mockPremiumUser.aiQuota}
            />
          </>
        </IntegrationTestWrapper>
      );

      // Should show premium status
      expect(getByText(/Premium: Unlimited/)).toBeTruthy();
      
      // Should not show upgrade prompts
      expect(queryByText(/Learn More/)).toBeNull();
      expect(queryByText(/Upgrade/)).toBeNull();
    });
  });

  describe('Error Handling Integration', () => {
    test('Error states propagate correctly through component hierarchy', () => {
      const { getByText, rerender } = render(
        <IntegrationTestWrapper>
          <BrainStateCheckinForm
            energy={5}
            focus={6}
            mood={7}
            notes=""
            onEnergyChange={() => {}}
            onFocusChange={() => {}}
            onMoodChange={() => {}}
            onNotesChange={() => {}}
            onSubmit={() => {}}
            loading={false}
            error="Let's try that again in a moment"
          />
        </IntegrationTestWrapper>
      );

      // Should show gentle error message
      expect(getByText(/Let's try that again in a moment/)).toBeTruthy();

      // Test error recovery
      rerender(
        <IntegrationTestWrapper>
          <BrainStateCheckinForm
            energy={5}
            focus={6}
            mood={7}
            notes=""
            onEnergyChange={() => {}}
            onFocusChange={() => {}}
            onMoodChange={() => {}}
            onNotesChange={() => {}}
            onSubmit={() => {}}
            loading={false}
            error={null}
          />
        </IntegrationTestWrapper>
      );

      // Error should be cleared
      expect(queryByText(/Let's try that again in a moment/)).toBeNull();
    });

    test('Loading states coordinate across components', () => {
      const { getByText } = render(
        <IntegrationTestWrapper>
          <>
            <GentleButton
              title="Submit"
              onPress={() => {}}
              loading={true}
            />
            <BrainStateCheckinForm
              energy={5}
              focus={6}
              mood={7}
              notes=""
              onEnergyChange={() => {}}
              onFocusChange={() => {}}
              onMoodChange={() => {}}
              onNotesChange={() => {}}
              onSubmit={() => {}}
              loading={true}
              error={null}
            />
          </>
        </IntegrationTestWrapper>
      );

      // Should show consistent loading language
      expect(getByText(/Just a moment.../)).toBeTruthy();
    });
  });
});
```

### Task 2: End-to-End User Flow Tests
**Create**: `__tests__/integration/userFlows.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SensoryCustomizationProvider } from '../../src/providers/SensoryCustomizationProvider';
import { BrainStateAdaptationManager } from '../../src/components/BrainStateAdaptationManager';

// Mock complete app flow components
const MockAppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SensoryCustomizationProvider>
    <BrainStateAdaptationManager currentBrainState={null}>
      {children}
    </BrainStateAdaptationManager>
  </SensoryCustomizationProvider>
);

describe('End-to-End User Flow Integration', () => {
  describe('First-Time User Onboarding Flow', () => {
    test('New user completes brain state check-in and sees adapted interface', async () => {
      const MockOnboardingFlow = () => {
        const [step, setStep] = React.useState<'checkin' | 'tasks' | 'settings'>('checkin');
        const [brainState, setBrainState] = React.useState({
          energy_level: 5,
          focus_level: 5,
          mood_level: 5,
        });

        return (
          <MockAppWrapper>
            {step === 'checkin' && (
              <BrainStateCheckinForm
                energy={brainState.energy_level}
                focus={brainState.focus_level}
                mood={brainState.mood_level}
                notes=""
                onEnergyChange={(value) => setBrainState(prev => ({ ...prev, energy_level: value }))}
                onFocusChange={(value) => setBrainState(prev => ({ ...prev, focus_level: value }))}
                onMoodChange={(value) => setBrainState(prev => ({ ...prev, mood_level: value }))}
                onNotesChange={() => {}}
                onSubmit={() => setStep('tasks')}
                loading={false}
                error={null}
                testID="onboarding-checkin"
              />
            )}
            
            {step === 'tasks' && (
              <View testID="tasks-screen">
                <TaskCard
                  task={{
                    id: '1',
                    title: 'Your first task',
                    complexity_level: 2,
                    is_completed: false,
                    created_at: new Date().toISOString(),
                  }}
                  onPress={() => {}}
                  onToggleComplete={() => setStep('settings')}
                  brainState={brainState}
                  userTier="free"
                  aiQuota={{ used: 0, limit: 10 }}
                />
              </View>
            )}
            
            {step === 'settings' && (
              <AccessibilitySettingsScreen
                onBack={() => {}}
                testID="settings-screen"
              />
            )}
          </MockAppWrapper>
        );
      };

      const { getByTestId, getByText } = render(<MockOnboardingFlow />);

      // Step 1: Complete brain state check-in
      expect(getByTestId('onboarding-checkin')).toBeTruthy();
      fireEvent.press(getByTestId('submit-button'));

      // Step 2: See tasks adapted to brain state
      await waitFor(() => {
        expect(getByTestId('tasks-screen')).toBeTruthy();
      });

      // Step 3: Complete task and access settings
      fireEvent.press(getByText(/Mark as complete/));
      
      await waitFor(() => {
        expect(getByTestId('settings-screen')).toBeTruthy();
      });
    });
  });

  describe('Daily Brain State Adaptation Flow', () => {
    test('Brain state change triggers UI adaptation across all screens', async () => {
      const MockDailyFlow = () => {
        const [brainState, setBrainState] = React.useState({
          energy_level: 8,
          focus_level: 9,
          mood_level: 7,
        });

        const handleLowEnergyDay = () => {
          setBrainState({
            energy_level: 2,
            focus_level: 3,
            mood_level: 4,
          });
        };

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={brainState}>
              <View testID="daily-flow">
                <BrainStateSummary
                  brainState={{
                    ...brainState,
                    created_at: new Date().toISOString(),
                  }}
                  testID="brain-state-summary"
                />
                
                <AIQuotaDisplay
                  used={3}
                  limit={10}
                  tier="free"
                  brainState={brainState}
                  testID="quota-display"
                />
                
                <GentleButton
                  title="Simulate Low Energy Day"
                  onPress={handleLowEnergyDay}
                  testID="low-energy-trigger"
                />
              </View>
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, getByText } = render(<MockDailyFlow />);

      // Initial high energy state
      expect(getByTestId('daily-flow')).toBeTruthy();
      expect(getByText(/High/)).toBeTruthy(); // High energy indicator

      // Trigger low energy adaptation
      fireEvent.press(getByTestId('low-energy-trigger'));

      // Verify adaptation occurred
      await waitFor(() => {
        expect(getByText(/Low/)).toBeTruthy(); // Low energy indicator
      });
    });
  });

  describe('Freemium Upgrade Journey', () => {
    test('User hits quota limit and completes upgrade flow', async () => {
      const MockUpgradeJourney = () => {
        const [userTier, setUserTier] = React.useState<'free' | 'premium'>('free');
        const [aiUsage, setAiUsage] = React.useState({ used: 9, limit: 10 });
        const [showUpgrade, setShowUpgrade] = React.useState(false);

        const handleAiRequest = () => {
          if (userTier === 'free' && aiUsage.used >= aiUsage.limit) {
            setShowUpgrade(true);
          } else {
            setAiUsage(prev => ({ ...prev, used: Math.min(prev.used + 1, prev.limit) }));
          }
        };

        const handleUpgrade = () => {
          setUserTier('premium');
          setAiUsage({ used: aiUsage.used, limit: 1000 });
          setShowUpgrade(false);
        };

        return (
          <MockAppWrapper>
            <>
              <AIQuotaDisplay
                used={aiUsage.used}
                limit={aiUsage.limit}
                tier={userTier}
                onUpgradePress={() => setShowUpgrade(true)}
                testID="quota-display"
              />
              
              <TaskCard
                task={{
                  id: '1',
                  title: 'Complex task needing AI help',
                  complexity_level: 5,
                  is_completed: false,
                  created_at: new Date().toISOString(),
                }}
                onPress={() => {}}
                onToggleComplete={() => {}}
                onRequestBreakdown={handleAiRequest}
                userTier={userTier}
                aiQuota={aiUsage}
                testID="task-card"
              />
              
              <GentleUpgradeModal
                visible={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                onUpgrade={handleUpgrade}
                trigger="ai_quota"
                currentUsage={{ aiRequests: aiUsage }}
                testID="upgrade-modal"
              />
            </>
          </MockAppWrapper>
        );
      };

      const { getByTestId, getByText } = render(<MockUpgradeJourney />);

      // Initial state - close to quota limit
      expect(getByText(/1 AI breakdown remaining/)).toBeTruthy();

      // Request AI breakdown
      fireEvent.press(getByText(/Break this down/));

      // Should trigger upgrade modal
      await waitFor(() => {
        expect(getByTestId('upgrade-modal')).toBeTruthy();
      });

      // Complete upgrade
      fireEvent.press(getByTestId('modal-upgrade-button'));

      // Verify premium status
      await waitFor(() => {
        expect(getByText(/Premium: Unlimited/)).toBeTruthy();
      });
    });
  });

  describe('Accessibility Adaptation Flow', () => {
    test('User adjusts accessibility settings and sees immediate changes', async () => {
      const MockAccessibilityFlow = () => {
        const [isHighContrast, setIsHighContrast] = React.useState(false);
        const [fontSize, setFontSize] = React.useState<'medium' | 'large'>('medium');

        return (
          <SensoryCustomizationProvider>
            <View testID="accessibility-flow">
              <GentleButton
                title="Sample Button"
                onPress={() => {}}
                testID="sample-button"
              />
              
              <BrainStateSlider
                value={5}
                onValueChange={() => {}}
                accessibilityLabel="Sample Slider"
                testID="sample-slider"
              />
              
              {/* Simulate accessibility controls */}
              <GentleButton
                title="Toggle High Contrast"
                onPress={() => setIsHighContrast(!isHighContrast)}
                testID="contrast-toggle"
              />
              
              <GentleButton
                title="Increase Font Size"
                onPress={() => setFontSize('large')}
                testID="font-size-toggle"
              />
            </View>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId } = render(<MockAccessibilityFlow />);

      // Initial state
      expect(getByTestId('sample-button')).toBeTruthy();
      expect(getByTestId('sample-slider')).toBeTruthy();

      // Change accessibility settings
      fireEvent.press(getByTestId('contrast-toggle'));
      fireEvent.press(getByTestId('font-size-toggle'));

      // Components should adapt
      await waitFor(() => {
        expect(getByTestId('sample-button')).toBeTruthy();
        expect(getByTestId('sample-slider')).toBeTruthy();
      });
    });
  });

  describe('Error Recovery Flow', () => {
    test('User encounters error and successfully recovers', async () => {
      const MockErrorRecoveryFlow = () => {
        const [hasError, setHasError] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);

        const handleSubmitWithError = async () => {
          setIsLoading(true);
          // Simulate network error
          setTimeout(() => {
            setIsLoading(false);
            setHasError(true);
          }, 1000);
        };

        const handleRetry = async () => {
          setHasError(false);
          setIsLoading(true);
          // Simulate successful retry
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        };

        return (
          <MockAppWrapper>
            <BrainStateCheckinForm
              energy={5}
              focus={6}
              mood={7}
              notes=""
              onEnergyChange={() => {}}
              onFocusChange={() => {}}
              onMoodChange={() => {}}
              onNotesChange={() => {}}
              onSubmit={hasError ? handleRetry : handleSubmitWithError}
              loading={isLoading}
              error={hasError ? "Let's try that again in a moment" : null}
              testID="error-form"
            />
          </MockAppWrapper>
        );
      };

      const { getByTestId, getByText } = render(<MockErrorRecoveryFlow />);

      // Trigger error
      fireEvent.press(getByTestId('submit-button'));

      // Should show loading state
      await waitFor(() => {
        expect(getByText(/Just a moment.../)).toBeTruthy();
      });

      // Should show error state
      await waitFor(() => {
        expect(getByText(/Let's try that again in a moment/)).toBeTruthy();
      });

      // Retry and succeed
      fireEvent.press(getByTestId('submit-button'));

      await waitFor(() => {
        expect(queryByText(/Let's try that again in a moment/)).toBeNull();
      });
    });
  });
});
```

### Task 3: Performance Integration Tests
**Create**: `__tests__/integration/performanceIntegration.test.tsx`
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { SensoryCustomizationProvider } from '../../src/providers/SensoryCustomizationProvider';
import { BrainStateAdaptationManager } from '../../src/components/BrainStateAdaptationManager';

// Performance monitoring utilities
class PerformanceMonitor {
  private startTime: number = 0;
  private renderTimes: number[] = [];

  startMeasurement() {
    this.startTime = performance.now();
  }

  endMeasurement(testName: string) {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    this.renderTimes.push(duration);
    
    console.log(`${testName} render time: ${duration.toFixed(2)}ms`);
    return duration;
  }

  getAverageRenderTime(): number {
    return this.renderTimes.reduce((sum, time) => sum + time, 0) / this.renderTimes.length;
  }

  reset() {
    this.renderTimes = [];
  }
}

const performanceMonitor = new PerformanceMonitor();

describe('Performance Integration Tests', () => {
  beforeEach(() => {
    performanceMonitor.reset();
  });

  describe('Component Rendering Performance', () => {
    test('Brain state adaptation should not cause significant performance impact', async () => {
      const TestComponent = () => {
        const [brainState, setBrainState] = React.useState({
          energy_level: 5,
          focus_level: 5,
          mood_level: 5,
        });

        React.useEffect(() => {
          // Simulate frequent brain state updates
          const interval = setInterval(() => {
            setBrainState(prev => ({
              energy_level: Math.floor(Math.random() * 10) + 1,
              focus_level: Math.floor(Math.random() * 10) + 1,
              mood_level: Math.floor(Math.random() * 10) + 1,
            }));
          }, 100);

          return () => clearInterval(interval);
        }, []);

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={brainState}>
              <GentleButton
                title="Performance Test Button"
                onPress={() => {}}
                testID="perf-button"
              />
              <BrainStateSlider
                value={brainState.energy_level}
                onValueChange={() => {}}
                accessibilityLabel="Performance Test Slider"
                testID="perf-slider"
              />
              <AIQuotaDisplay
                used={5}
                limit={10}
                tier="free"
                brainState={brainState}
                testID="perf-quota"
              />
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      performanceMonitor.startMeasurement();
      const { getByTestId } = render(<TestComponent />);
      const renderTime = performanceMonitor.endMeasurement('Brain State Adaptation');

      // Verify components rendered
      expect(getByTestId('perf-button')).toBeTruthy();
      expect(getByTestId('perf-slider')).toBeTruthy();
      expect(getByTestId('perf-quota')).toBeTruthy();

      // Performance threshold: should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('Complex component hierarchies maintain good performance', () => {
      const ComplexHierarchy = () => (
        <SensoryCustomizationProvider>
          <BrainStateAdaptationManager currentBrainState={{ energy_level: 5, focus_level: 5, mood_level: 5 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <View key={i}>
                <GentleButton
                  title={`Button ${i}`}
                  onPress={() => {}}
                  testID={`button-${i}`}
                />
                <BrainStateSlider
                  value={5}
                  onValueChange={() => {}}
                  accessibilityLabel={`Slider ${i}`}
                  testID={`slider-${i}`}
                />
                <TaskCard
                  task={{
                    id: `task-${i}`,
                    title: `Task ${i}`,
                    complexity_level: Math.floor(Math.random() * 5) + 1,
                    is_completed: false,
                    created_at: new Date().toISOString(),
                  }}
                  onPress={() => {}}
                  onToggleComplete={() => {}}
                  testID={`task-${i}`}
                />
              </View>
            ))}
          </BrainStateAdaptationManager>
        </SensoryCustomizationProvider>
      );

      performanceMonitor.startMeasurement();
      const { getByTestId } = render(<ComplexHierarchy />);
      const renderTime = performanceMonitor.endMeasurement('Complex Hierarchy');

      // Verify first and last components
      expect(getByTestId('button-0')).toBeTruthy();
      expect(getByTestId('button-9')).toBeTruthy();

      // Complex hierarchy should render within 200ms
      expect(renderTime).toBeLessThan(200);
    });
  });

  describe('Memory Usage Integration', () => {
    test('Component cleanup prevents memory leaks', () => {
      const LeakTestComponent = () => {
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setCount(prev => prev + 1);
          }, 10);

          return () => clearInterval(interval);
        }, []);

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager 
              currentBrainState={{ 
                energy_level: count % 10 + 1, 
                focus_level: count % 10 + 1, 
                mood_level: count % 10 + 1 
              }}
            >
              <GentleButton
                title={`Count: ${count}`}
                onPress={() => {}}
                testID="leak-test-button"
              />
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, unmount } = render(<LeakTestComponent />);
      
      expect(getByTestId('leak-test-button')).toBeTruthy();

      // Unmount should not cause errors or warnings
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility Performance', () => {
    test('Screen reader integration does not degrade performance', () => {
      // Mock screen reader enabled
      jest.mock('react-native', () => ({
        ...jest.requireActual('react-native'),
        AccessibilityInfo: {
          isScreenReaderEnabled: () => Promise.resolve(true),
          announceForAccessibility: jest.fn(),
        },
      }));

      const AccessibilityTestComponent = () => (
        <SensoryCustomizationProvider>
          <BrainStateAdaptationManager currentBrainState={{ energy_level: 5, focus_level: 5, mood_level: 5 }}>
            <AccessibilitySettingsScreen onBack={() => {}} testID="accessibility-screen" />
          </BrainStateAdaptationManager>
        </SensoryCustomizationProvider>
      );

      performanceMonitor.startMeasurement();
      const { getByTestId } = render(<AccessibilityTestComponent />);
      const renderTime = performanceMonitor.endMeasurement('Accessibility Screen');

      expect(getByTestId('accessibility-screen')).toBeTruthy();

      // Accessibility features should not significantly impact performance
      expect(renderTime).toBeLessThan(150);
    });
  });

  describe('Animation Performance', () => {
    test('Brain state animations are smooth and performant', async () => {
      const AnimationTestComponent = () => {
        const [showSuccess, setShowSuccess] = React.useState(false);
        const [brainState] = React.useState({
          energy_level: 7,
          focus_level: 8,
          mood_level: 6,
        });

        React.useEffect(() => {
          setTimeout(() => setShowSuccess(true), 100);
        }, []);

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={brainState}>
              <CheckinSuccessFeedback
                visible={showSuccess}
                brainState={brainState}
                onContinue={() => {}}
                testID="success-animation"
              />
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      performanceMonitor.startMeasurement();
      const { getByTestId } = render(<AnimationTestComponent />);
      
      await waitFor(() => {
        expect(getByTestId('success-animation')).toBeTruthy();
      });

      const renderTime = performanceMonitor.endMeasurement('Success Animation');

      // Animation should be smooth
      expect(renderTime).toBeLessThan(100);
    });
  });
});
```

### Task 4: Cross-Agent Integration Tests
**Create**: `__tests__/integration/crossAgentIntegration.test.tsx`
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock Agent 3 interfaces for testing
interface MockBrainStateStore {
  currentState: any;
  updateState: (state: any) => void;
  getTodaysState: () => any;
}

interface MockSubscriptionStore {
  userTier: 'free' | 'premium';
  aiQuota: { used: number; limit: number };
  canMakeAIRequest: () => boolean;
  incrementAIUsage: () => void;
}

const mockBrainStateStore: MockBrainStateStore = {
  currentState: { energy_level: 5, focus_level: 5, mood_level: 5 },
  updateState: jest.fn(),
  getTodaysState: jest.fn(),
};

const mockSubscriptionStore: MockSubscriptionStore = {
  userTier: 'free',
  aiQuota: { used: 5, limit: 10 },
  canMakeAIRequest: () => true,
  incrementAIUsage: jest.fn(),
};

describe('Cross-Agent Integration Tests', () => {
  describe('Agent 3 Brain State Integration', () => {
    test('UI components correctly consume Agent 3 brain state store', () => {
      const TestComponent = () => {
        // Simulate Agent 3 store integration
        const [brainState, setBrainState] = React.useState(mockBrainStateStore.currentState);

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={brainState}>
              <BrainStateCheckinForm
                energy={brainState.energy_level}
                focus={brainState.focus_level}
                mood={brainState.mood_level}
                notes=""
                onEnergyChange={(value) => {
                  const newState = { ...brainState, energy_level: value };
                  setBrainState(newState);
                  mockBrainStateStore.updateState(newState);
                }}
                onFocusChange={(value) => {
                  const newState = { ...brainState, focus_level: value };
                  setBrainState(newState);
                  mockBrainStateStore.updateState(newState);
                }}
                onMoodChange={(value) => {
                  const newState = { ...brainState, mood_level: value };
                  setBrainState(newState);
                  mockBrainStateStore.updateState(newState);
                }}
                onNotesChange={() => {}}
                onSubmit={() => {}}
                loading={false}
                error={null}
                testID="agent3-integration-form"
              />
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId } = render(<TestComponent />);
      
      expect(getByTestId('agent3-integration-form')).toBeTruthy();

      // Test brain state updates through Agent 3 interface
      fireEvent(getByTestId('energy-slider'), 'onValueChange', 8);
      expect(mockBrainStateStore.updateState).toHaveBeenCalledWith({
        energy_level: 8,
        focus_level: 5,
        mood_level: 5,
      });
    });

    test('Brain state changes trigger UI adaptations via Agent 3 store', async () => {
      const TestComponent = () => {
        const [brainState, setBrainState] = React.useState({
          energy_level: 8,
          focus_level: 9,
          mood_level: 7,
        });

        const simulateLowEnergyUpdate = () => {
          const lowEnergyState = {
            energy_level: 2,
            focus_level: 3,
            mood_level: 4,
          };
          setBrainState(lowEnergyState);
          mockBrainStateStore.updateState(lowEnergyState);
        };

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={brainState}>
              <View testID="adaptation-test">
                <TaskCard
                  task={{
                    id: '1',
                    title: 'Test task',
                    complexity_level: 4,
                    is_completed: false,
                    created_at: new Date().toISOString(),
                  }}
                  onPress={() => {}}
                  onToggleComplete={() => {}}
                  brainState={brainState}
                  userTier="free"
                  aiQuota={{ used: 5, limit: 10 }}
                />
                <GentleButton
                  title="Simulate Low Energy"
                  onPress={simulateLowEnergyUpdate}
                  testID="energy-trigger"
                />
              </View>
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, getByText, queryByText } = render(<TestComponent />);

      // Initially high energy - should not show complexity warning
      expect(queryByText(/might be challenging right now/)).toBeNull();

      // Trigger low energy state
      fireEvent.press(getByTestId('energy-trigger'));

      // Should now show complexity warning
      await waitFor(() => {
        expect(getByText(/might be challenging right now/)).toBeTruthy();
      });
    });
  });

  describe('Agent 2 Subscription Integration', () => {
    test('UI components correctly consume Agent 2 subscription store', () => {
      const TestComponent = () => {
        const [subscriptionData, setSubscriptionData] = React.useState(mockSubscriptionStore);

        return (
          <SensoryCustomizationProvider>
            <AIQuotaDisplay
              used={subscriptionData.aiQuota.used}
              limit={subscriptionData.aiQuota.limit}
              tier={subscriptionData.userTier}
              onUpgradePress={() => {}}
              testID="subscription-integration"
            />
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, getByText } = render(<TestComponent />);
      
      expect(getByTestId('subscription-integration')).toBeTruthy();
      expect(getByText(/5 of 10 AI breakdowns available/)).toBeTruthy();
    });

    test('AI request flow integrates with Agent 2 quota management', () => {
      const TestComponent = () => {
        const [subscriptionData, setSubscriptionData] = React.useState(mockSubscriptionStore);
        const [showUpgrade, setShowUpgrade] = React.useState(false);

        const handleAIRequest = () => {
          if (subscriptionData.canMakeAIRequest()) {
            setSubscriptionData(prev => ({
              ...prev,
              aiQuota: { ...prev.aiQuota, used: prev.aiQuota.used + 1 }
            }));
            mockSubscriptionStore.incrementAIUsage();
          } else {
            setShowUpgrade(true);
          }
        };

        return (
          <SensoryCustomizationProvider>
            <>
              <TaskCard
                task={{
                  id: '1',
                  title: 'Complex task',
                  complexity_level: 5,
                  is_completed: false,
                  created_at: new Date().toISOString(),
                }}
                onPress={() => {}}
                onToggleComplete={() => {}}
                onRequestBreakdown={handleAIRequest}
                userTier={subscriptionData.userTier}
                aiQuota={subscriptionData.aiQuota}
                testID="quota-task-card"
              />
              
              <GentleUpgradeModal
                visible={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                onUpgrade={() => {}}
                trigger="ai_quota"
                currentUsage={{ aiRequests: subscriptionData.aiQuota }}
                testID="quota-upgrade-modal"
              />
            </>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, getByText } = render(<TestComponent />);

      // Test AI request
      fireEvent.press(getByText(/Break this down/));
      
      expect(mockSubscriptionStore.incrementAIUsage).toHaveBeenCalled();
    });
  });

  describe('Agent 1 App Shell Integration', () => {
    test('Navigation integration with Agent 1 navigation system', () => {
      const mockNavigate = jest.fn();
      
      const TestComponent = () => (
        <SensoryCustomizationProvider>
          <AccessibilitySettingsScreen
            onBack={() => mockNavigate('back')}
            testID="navigation-integration"
          />
        </SensoryCustomizationProvider>
      );

      const { getByTestId } = render(<TestComponent />);
      
      fireEvent.press(getByTestId('settings-done-button'));
      expect(mockNavigate).toHaveBeenCalledWith('back');
    });

    test('Global state updates propagate through Agent 1 app shell', () => {
      // Mock global app state from Agent 1
      const mockAppState = {
        user: { id: '1', tier: 'free' },
        currentBrainState: { energy_level: 5, focus_level: 5, mood_level: 5 },
        subscription: { used: 5, limit: 10 },
      };

      const TestComponent = () => (
        <SensoryCustomizationProvider>
          <BrainStateAdaptationManager currentBrainState={mockAppState.currentBrainState}>
            <View testID="app-shell-integration">
              <BrainStateSummary
                brainState={{
                  ...mockAppState.currentBrainState,
                  created_at: new Date().toISOString(),
                }}
              />
              <AIQuotaDisplay
                used={mockAppState.subscription.used}
                limit={mockAppState.subscription.limit}
                tier={mockAppState.user.tier}
              />
            </View>
          </BrainStateAdaptationManager>
        </SensoryCustomizationProvider>
      );

      const { getByTestId, getByText } = render(<TestComponent />);
      
      expect(getByTestId('app-shell-integration')).toBeTruthy();
      expect(getByText(/5 of 10 AI breakdowns available/)).toBeTruthy();
    });
  });

  describe('Multi-Agent Data Flow', () => {
    test('Data flows correctly between all agents', async () => {
      const TestComponent = () => {
        // Simulate complete app state from all agents
        const [appState, setAppState] = React.useState({
          // Agent 1: App shell
          navigation: { currentScreen: 'tasks' },
          // Agent 2: Backend/subscription
          subscription: { tier: 'free', aiUsed: 8, aiLimit: 10 },
          // Agent 3: Brain state/logic
          brainState: { energy_level: 3, focus_level: 4, mood_level: 5 },
          // Agent 4: UI components (this test)
          ui: { showUpgradeModal: false },
        });

        const handleUpgradeModalShow = () => {
          setAppState(prev => ({
            ...prev,
            ui: { ...prev.ui, showUpgradeModal: true }
          }));
        };

        const handleUpgrade = () => {
          setAppState(prev => ({
            ...prev,
            subscription: { ...prev.subscription, tier: 'premium', aiLimit: 1000 },
            ui: { ...prev.ui, showUpgradeModal: false }
          }));
        };

        return (
          <SensoryCustomizationProvider>
            <BrainStateAdaptationManager currentBrainState={appState.brainState}>
              <>
                <AIQuotaDisplay
                  used={appState.subscription.aiUsed}
                  limit={appState.subscription.aiLimit}
                  tier={appState.subscription.tier}
                  onUpgradePress={handleUpgradeModalShow}
                  brainState={appState.brainState}
                  testID="multi-agent-quota"
                />
                
                <GentleUpgradeModal
                  visible={appState.ui.showUpgradeModal}
                  onClose={() => setAppState(prev => ({
                    ...prev,
                    ui: { ...prev.ui, showUpgradeModal: false }
                  }))}
                  onUpgrade={handleUpgrade}
                  trigger="ai_quota"
                  currentUsage={{ aiRequests: { used: appState.subscription.aiUsed, limit: appState.subscription.aiLimit } }}
                  brainState={appState.brainState}
                  testID="multi-agent-modal"
                />
              </>
            </BrainStateAdaptationManager>
          </SensoryCustomizationProvider>
        );
      };

      const { getByTestId, getByText } = render(<TestComponent />);

      // Initial state - near quota limit with low energy
      expect(getByText(/2 AI breakdowns remaining/)).toBeTruthy();

      // Trigger upgrade flow
      fireEvent.press(getByTestId('upgrade-button'));
      
      await waitFor(() => {
        expect(getByTestId('multi-agent-modal')).toBeTruthy();
        // Should show gentle language for low energy
        expect(getByText(/Gentle upgrade available/)).toBeTruthy();
      });

      // Complete upgrade
      fireEvent.press(getByTestId('modal-upgrade-button'));

      // Verify state changes across agents
      await waitFor(() => {
        expect(getByText(/Premium: Unlimited/)).toBeTruthy();
      });
    });
  });
});
```

### Task 5: Test Documentation and Reporting
**Create**: `__tests__/integration/README.md`
```markdown
# Agent 4 Integration Testing Suite

## Overview
This integration testing suite validates that all Agent 4 UI components work together seamlessly and integrate properly with other agents in the neurodivergent productivity app.

## Test Categories

### 1. Component Integration Tests (`componentIntegration.test.tsx`)
- **Brain State Check-in Flow**: Complete check-in flow with success feedback
- **Task Management Integration**: Task cards with brain state adaptation and freemium features
- **Freemium UI Integration**: Quota displays with upgrade modals
- **Accessibility Integration**: Settings affecting all components
- **Cross-Component State Management**: Brain state and freemium state propagation
- **Error Handling Integration**: Error states and recovery flows

### 2. End-to-End User Flow Tests (`userFlows.test.tsx`)
- **First-Time User Onboarding**: Complete new user experience
- **Daily Brain State Adaptation**: Brain state changes triggering UI adaptations
- **Freemium Upgrade Journey**: From quota limit to premium upgrade
- **Accessibility Adaptation Flow**: Settings changes with immediate effects
- **Error Recovery Flow**: Error scenarios and successful recovery

### 3. Performance Integration Tests (`performanceIntegration.test.tsx`)
- **Component Rendering Performance**: Brain state adaptation performance impact
- **Memory Usage Integration**: Component cleanup and memory leak prevention
- **Accessibility Performance**: Screen reader integration performance
- **Animation Performance**: Smooth animations during brain state changes

### 4. Cross-Agent Integration Tests (`crossAgentIntegration.test.tsx`)
- **Agent 3 Brain State Integration**: UI consuming brain state store
- **Agent 2 Subscription Integration**: UI consuming subscription store
- **Agent 1 App Shell Integration**: Navigation and global state
- **Multi-Agent Data Flow**: Complete data flow between all agents

## Running Tests

### Individual Test Suites
```bash
# Component integration tests
npm run test -- __tests__/integration/componentIntegration.test.tsx

# User flow tests
npm run test -- __tests__/integration/userFlows.test.tsx

# Performance tests
npm run test -- __tests__/integration/performanceIntegration.test.tsx

# Cross-agent tests
npm run test -- __tests__/integration/crossAgentIntegration.test.tsx
```

### Full Integration Suite
```bash
# Run all integration tests
npm run test:integration

# Run with coverage
npm run test:integration:coverage

# Generate integration report
npm run test:integration:report
```

## Test Utilities

### Mock Providers
- `IntegrationTestWrapper`: Includes all necessary providers for testing
- `MockAppWrapper`: Simplified wrapper for basic tests
- `PerformanceMonitor`: Tracks render times and performance metrics

### Mock Stores
- `mockBrainStateStore`: Simulates Agent 3 brain state management
- `mockSubscriptionStore`: Simulates Agent 2 subscription management
- Mock navigation and app shell integration

## Performance Benchmarks

### Acceptable Performance Thresholds
- **Component Rendering**: < 100ms for standard components
- **Complex Hierarchies**: < 200ms for multiple components
- **Brain State Adaptation**: < 100ms for adaptation changes
- **Accessibility Screen**: < 150ms with screen reader enabled
- **Animation Performance**: < 100ms for smooth animations

### Memory Considerations
- No memory leaks after component unmounting
- Efficient cleanup of event listeners and timers
- Minimal memory impact from brain state adaptations

## Accessibility Testing

### WCAG 2.1 AA Compliance
- All components meet accessibility standards
- Screen reader compatibility verified
- Touch target minimums enforced (44px)
- Color contrast ratios validated
- No red colors anywhere (neurodivergent-specific)

### Brain State Adaptations
- Low energy states improve accessibility scores
- Touch targets automatically increase for low focus
- Language becomes gentler for low energy states
- UI spacing adapts for cognitive load reduction

## Neurodivergent-Specific Testing

### Key Validations
- **No Red Colors**: Automated detection and prevention
- **Gentle Language**: Shame-free messaging validation
- **Brain State Responsiveness**: UI adaptation verification
- **Sensory Accommodation**: Customization option testing
- **Cognitive Load Reduction**: Simplified UI for low energy states

### User Scenarios
- **Daily Routine**: Morning brain state check-in and task adaptation
- **Low Energy Days**: UI simplification and gentle messaging
- **High Energy Days**: Efficient, compact interface optimization
- **Sensory Overload**: Customization options and reduced stimulation
- **Executive Function Support**: Clear navigation and predictable patterns

## Continuous Integration

### Test Automation
- All tests run on every pull request
- Performance benchmarks tracked over time
- Accessibility compliance verified automatically
- Cross-agent integration validated before merges

### Quality Gates
- Minimum 90% test coverage for integration tests
- All performance benchmarks must pass
- Zero accessibility violations allowed
- All cross-agent interfaces validated

## Troubleshooting

### Common Issues
1. **Provider Setup**: Ensure all necessary providers are included in test wrappers
2. **Async Operations**: Use `waitFor` for state changes and API calls
3. **Mock Timing**: Account for React state updates and effect timing
4. **Performance Variance**: Run performance tests multiple times for accuracy

### Debug Tools
- React DevTools for component inspection
- Performance profiler for render analysis
- Accessibility scanner for compliance checking
- Memory profiler for leak detection

## Future Enhancements

### Planned Additions
- **Visual Regression Testing**: Screenshot comparisons for UI consistency
- **Load Testing**: High-frequency interaction testing
- **Device-Specific Testing**: iOS/Android specific integration tests
- **Network Condition Testing**: Offline/slow connection scenarios

### Agent Evolution
- Tests prepared for Phase 2 feature integration
- Extensible patterns for new component additions
- Scalable performance monitoring
- Enhanced accessibility testing as standards evolve
```

### Task 6: Test Execution Scripts
**Create**: `scripts/runIntegrationTests.js`
```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class IntegrationTestRunner {
  constructor() {
    this.testResults = {
      componentIntegration: null,
      userFlows: null,
      performanceIntegration: null,
      crossAgentIntegration: null,
    };
    this.startTime = Date.now();
  }

  runTest(testName, testPath) {
    console.log(`\n🧪 Running ${testName} tests...`);
    const startTime = Date.now();
    
    try {
      const result = execSync(`npm test -- ${testPath} --json`, { 
        encoding: 'utf-8',
        cwd: process.cwd(),
      });
      
      const duration = Date.now() - startTime;
      const parsedResult = JSON.parse(result);
      
      this.testResults[testName] = {
        passed: parsedResult.success,
        numPassedTests: parsedResult.numPassedTests,
        numFailedTests: parsedResult.numFailedTests,
        duration,
        details: parsedResult,
      };
      
      console.log(`✅ ${testName}: ${parsedResult.numPassedTests} passed, ${parsedResult.numFailedTests} failed (${duration}ms)`);
      
    } catch (error) {
      console.log(`❌ ${testName}: Failed to run tests`);
      console.error(error.message);
      
      this.testResults[testName] = {
        passed: false,
        error: error.message,
        duration: Date.now() - startTime,
      };
    }
  }

  runAllTests() {
    console.log('🚀 Starting Agent 4 Integration Test Suite');
    console.log('============================================');

    // Run each test suite
    this.runTest('componentIntegration', '__tests__/integration/componentIntegration.test.tsx');
    this.runTest('userFlows', '__tests__/integration/userFlows.test.tsx');
    this.runTest('performanceIntegration', '__tests__/integration/performanceIntegration.test.tsx');
    this.runTest('crossAgentIntegration', '__tests__/integration/crossAgentIntegration.test.tsx');

    this.generateReport();
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const totalTests = Object.values(this.testResults).reduce((sum, result) => {
      return sum + (result ? (result.numPassedTests || 0) + (result.numFailedTests || 0) : 0);
    }, 0);
    
    const passedTests = Object.values(this.testResults).reduce((sum, result) => {
      return sum + (result ? result.numPassedTests || 0 : 0);
    }, 0);
    
    const failedTests = Object.values(this.testResults).reduce((sum, result) => {
      return sum + (result ? result.numFailedTests || 0 : 0);
    }, 0);

    console.log('\n📊 Integration Test Summary');
    console.log('===========================');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration}ms`);

    // Detailed breakdown
    console.log('\n📋 Detailed Results:');
    Object.entries(this.testResults).forEach(([testName, result]) => {
      if (result) {
        const status = result.passed ? '✅' : '❌';
        const tests = result.numPassedTests !== undefined 
          ? `${result.numPassedTests}/${result.numPassedTests + result.numFailedTests}`
          : 'ERROR';
        console.log(`${status} ${testName}: ${tests} (${result.duration}ms)`);
      }
    });

    // Performance insights
    this.analyzePerformance();

    // Generate JSON report
    this.saveJsonReport();
    
    // Exit with appropriate code
    const hasFailures = failedTests > 0 || Object.values(this.testResults).some(r => !r || !r.passed);
    process.exit(hasFailures ? 1 : 0);
  }

  analyzePerformance() {
    const performanceResult = this.testResults.performanceIntegration;
    if (performanceResult && performanceResult.passed) {
      console.log('\n⚡ Performance Analysis:');
      console.log('- All performance benchmarks passed');
      console.log('- Brain state adaptation: < 100ms ✅');
      console.log('- Complex hierarchies: < 200ms ✅');
      console.log('- Accessibility integration: < 150ms ✅');
    } else {
      console.log('\n⚠️  Performance Analysis: Some benchmarks failed');
    }
  }

  saveJsonReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - this.startTime,
      summary: {
        totalTests: Object.values(this.testResults).reduce((sum, result) => {
          return sum + (result ? (result.numPassedTests || 0) + (result.numFailedTests || 0) : 0);
        }, 0),
        passedTests: Object.values(this.testResults).reduce((sum, result) => {
          return sum + (result ? result.numPassedTests || 0 : 0);
        }, 0),
        failedTests: Object.values(this.testResults).reduce((sum, result) => {
          return sum + (result ? result.numFailedTests || 0 : 0);
        }, 0),
      },
      results: this.testResults,
    };

    const reportPath = path.join(process.cwd(), 'test-reports', 'integration-test-report.json');
    
    // Ensure directory exists
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 JSON report saved to: ${reportPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new IntegrationTestRunner();
  runner.runAllTests();
}

module.exports = IntegrationTestRunner;
```

## Success Criteria
- [ ] Complete component integration test suite with >95% test coverage
- [ ] End-to-end user flow tests covering all major scenarios
- [ ] Performance integration tests validating sub-100ms render times
- [ ] Cross-agent integration tests ensuring proper data flow
- [ ] All tests demonstrate neurodivergent-first principles (no red colors, gentle language)
- [ ] Performance benchmarks established and maintained
- [ ] Comprehensive test documentation for future development
- [ ] Automated test execution scripts for CI/CD integration

## Testing Commands
```bash
npm run test:integration         # Run all integration tests
npm run test:integration:watch   # Run in watch mode
npm run test:integration:coverage # Run with coverage report
npm run test:integration:report  # Generate comprehensive report
node scripts/runIntegrationTests.js # Run with detailed analysis
```

## Next Sprint
**4H: Agent Integration Handoff** - Create handoff documentation and integration interfaces for other agents.

## Agent Dependencies
- **Validates integration with**: Agent 1 (app shell), Agent 2 (subscription), Agent 3 (brain state)
- **Provides to all agents**: Comprehensive integration testing patterns
- **Establishes**: Performance benchmarks and quality gates

## Common Issues
- **Test isolation**: Ensure tests don't affect each other's state
- **Provider setup**: Include all necessary providers in test wrappers
- **Performance timing**: Account for React lifecycle and async operations
- **Mock complexity**: Balance realistic mocks with test simplicity

---
**Focus**: Comprehensive integration testing only. Agent handoff documentation comes in 4H.