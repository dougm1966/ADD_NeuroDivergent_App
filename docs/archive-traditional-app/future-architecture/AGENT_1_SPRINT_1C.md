# 🏗️ Agent 1 Sprint 1C: App Shell & Error Handling

## Mission
Add error boundaries, loading states, and testing setup to create a production-ready app shell.

## Sprint Goal
Complete the foundation layer with proper error handling, testing infrastructure, and app initialization patterns.

## Time Estimate
1-2 hours

## Prerequisites
- Sprint 1A & 1B completed successfully
- Navigation working between all 3 screens
- TypeScript compilation passes

## Critical Rules (NEVER VIOLATE)
1. Error handling must be gentle and neurodivergent-friendly
2. No harsh error messages or red colors
3. Testing setup must work for other agents
4. Loading states must be accessible

## Sprint Tasks

### Task 1: Install Testing Dependencies
```bash
# Testing and error handling dependencies
npm install --save-dev jest @types/jest
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev react-test-renderer
npm install react-native-error-boundary
```

### Task 2: Create Error Boundary Component
**Create**: `src/components/ErrorBoundary.tsx`
```typescript
import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something unexpected happened</Text>
          <Text style={styles.subtitle}>
            Don't worry - this isn't your fault. Let's try again.
          </Text>
          
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          
          {__DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>
                {this.state.error.message}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#7FB3D3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontFamily: 'monospace',
  },
});
```

### Task 3: Create Loading Component
**Create**: `src/components/LoadingScreen.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Getting things ready..." 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7FB3D3" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 16,
  },
});
```

### Task 4: Create App State Hook
**Create**: `src/hooks/useAppState.ts`
```typescript
import { useState, useEffect } from 'react';

export interface AppState {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export const useAppState = () => {
  const [state, setState] = useState<AppState>({
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate app initialization (other agents will add real logic here)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState({
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        setState({
          isLoading: false,
          isInitialized: false,
          error: error instanceof Error ? error.message : 'Failed to initialize app',
        });
      }
    };

    initializeApp();
  }, []);

  const retryInitialization = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    // Re-run initialization
    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setState({
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (error) {
        setState({
          isLoading: false,
          isInitialized: false,
          error: error instanceof Error ? error.message : 'Failed to initialize app',
        });
      }
    };
    initializeApp();
  };

  return { ...state, retryInitialization };
};
```

### Task 5: Create Component Index
**Create**: `src/components/index.ts`
```typescript
export { ErrorBoundary } from './ErrorBoundary';
export { LoadingScreen } from './LoadingScreen';
```

**Create**: `src/hooks/index.ts`
```typescript
export { useAppState } from './useAppState';
export type { AppState } from './useAppState';
```

### Task 6: Update Main App with Error Handling
**Update**: `App.tsx`
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary, LoadingScreen } from './src/components';
import { useAppState } from './src/hooks';

const AppContent: React.FC = () => {
  const { isLoading, isInitialized, error, retryInitialization } = useAppState();

  if (isLoading) {
    return <LoadingScreen message="Setting up your neurodivergent productivity app..." />;
  }

  if (error || !isInitialized) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Let's try that again</Text>
        <Text style={styles.errorMessage}>
          We had trouble getting started, but that's okay.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryInitialization}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#7FB3D3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
```

### Task 7: Create Basic Test Setup
**Create**: `jest.config.js`
```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-screens|@react-navigation)/)'
  ],
};
```

**Create**: `__tests__/App.test.tsx`
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  test('renders without crashing', () => {
    const { getByText } = render(<App />);
    // Should show loading initially
    expect(getByText(/Setting up your neurodivergent productivity app/)).toBeTruthy();
  });
});
```

**Create**: `__tests__/components/ErrorBoundary.test.tsx`
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  test('catches errors and shows gentle message', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(getByText('Something unexpected happened')).toBeTruthy();
    expect(getByText(/Don't worry - this isn't your fault/)).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  test('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>App is working</Text>
      </ErrorBoundary>
    );
    
    expect(getByText('App is working')).toBeTruthy();
  });
});
```

### Task 8: Update package.json Scripts
**Update**: `package.json` (add test scripts)
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "test:watch": "jest --watch",
    "type-check": "tsc --noEmit"
  }
}
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Agent Handoff
- [ ] `npx expo start` shows loading screen then navigation
- [ ] Error boundary catches errors and shows gentle message
- [ ] All tests pass: `npm test`
- [ ] TypeScript compilation passes: `npm run type-check`
- [ ] App initialization works (1 second loading)
- [ ] Retry functionality works on error screens
- [ ] No red colors anywhere in error states

### Validation Commands
```bash
# Test the complete app
npx expo start

# Run tests
npm test

# Check TypeScript
npm run type-check

# Test loading states (app should show loading for 1 second)
# Test error boundary (should work if you manually throw errors)
```

## What Other Agents Get From This Sprint

### For Agent 2 (Backend)
- `useAppState()` hook ready for Supabase initialization
- Error handling patterns to follow
- Loading state management structure
- Test patterns for service testing

### For Agent 3 (Core Features)
- Error boundary wrapping for brain state errors
- Loading states for task operations
- Gentle error messaging patterns
- Hook patterns for state management

### For Agent 4 (UI/UX)
- Component structure examples
- Accessibility patterns (44px touch targets)
- Neurodivergent-friendly error messaging
- Loading and error state design patterns

## Interface Contracts
Other agents MUST follow these patterns:

```typescript
// Error handling
const [error, setError] = useState<string | null>(null);
if (error) {
  return <ErrorScreen message={getGentleErrorMessage(error)} />;
}

// Loading states
const [loading, setLoading] = useState(false);
if (loading) {
  return <LoadingScreen message="Saving your progress..." />;
}

// Hook patterns
export const useYourFeature = () => {
  const [state, setState] = useState(initialState);
  // Return { ...state, actions }
};
```

## Production Readiness Checklist
- [ ] Error boundaries prevent app crashes
- [ ] Loading states provide user feedback
- [ ] Error messages are gentle and helpful
- [ ] Retry mechanisms work correctly
- [ ] Tests verify core functionality
- [ ] TypeScript catches type errors
- [ ] Accessibility standards met (44px touch targets)

## Common Mistakes to Avoid
- Don't use harsh error language
- Don't skip error boundaries
- Don't forget loading states
- Don't use red colors in error states
- Don't skip testing setup

## Files Created This Sprint
- `src/components/ErrorBoundary.tsx`
- `src/components/LoadingScreen.tsx`
- `src/components/index.ts`
- `src/hooks/useAppState.ts`
- `src/hooks/index.ts`
- `jest.config.js`
- `__tests__/App.test.tsx`
- `__tests__/components/ErrorBoundary.test.tsx`
- Updated `App.tsx`
- Updated `package.json`

## Agent 1 Complete!
After Sprint 1C, the foundation is complete and ready for other agents:
- **Agent 2** can add Supabase services to the app initialization
- **Agent 3** can replace placeholder screens with real functionality
- **Agent 4** can build upon the component and design patterns

---
**Sprint 1C Focus**: Production-ready foundation with gentle error handling.