# 🏗️ AGENT_1 Foundation Enhancement Guide

## Overview
Enhance the working voice MVP with production-ready infrastructure while preserving voice functionality.

## Prerequisites
- Working AGENT_0 voice MVP
- Voice recording functional
- Basic Supabase integration
- Voice session storage working

## Step 1: Navigation Enhancement (45 minutes)

### 1.1 Install Navigation Dependencies
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

### 1.2 Create Navigation Structure (`src/navigation/index.tsx`):
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Existing voice screen
import { VoiceRecorder } from '@components/VoiceRecorder';
// New screens
import { VoiceHistory } from '@screens/VoiceHistory';
import { VoiceSettings } from '@screens/VoiceSettings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function VoiceTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60 }, // Neurodivergent-friendly sizing
        tabBarActiveTintColor: '#4A90E2', // Gentle blue
        tabBarInactiveTintColor: '#999'
      }}
    >
      <Tab.Screen 
        name="Record" 
        component={VoiceRecorder}
        options={{
          tabBarIcon: ({ color }) => <VoiceIcon color={color} />,
          tabBarLabel: 'Voice Note'
        }}
      />
      <Tab.Screen 
        name="History" 
        component={VoiceHistory}
        options={{
          tabBarIcon: ({ color }) => <HistoryIcon color={color} />,
          tabBarLabel: 'Past Notes'
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={VoiceSettings}
        options={{
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarLabel: 'Preferences'
        }}
      />
    </Tab.Navigator>
  );
}

export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="VoiceHome"
          component={VoiceTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 1.3 Create Screen Components

VoiceHistory (`src/screens/VoiceHistory.tsx`):
```typescript
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { VoiceSessionCard } from '@components/VoiceSessionCard';
import { useVoiceSessions } from '@hooks/useVoiceSessions';

export function VoiceHistory() {
  const { sessions, loading, error } = useVoiceSessions();
  
  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={({ item }) => <VoiceSessionCard session={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
```

VoiceSettings (`src/screens/VoiceSettings.tsx`):
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoicePreferences } from '@components/VoicePreferences';

export function VoiceSettings() {
  return (
    <View style={styles.container}>
      <VoicePreferences />
    </View>
  );
}
```

## Step 2: Error Handling (30 minutes)

### 2.1 Create Error Boundary (`src/components/ErrorBoundary.tsx`):
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service
    console.error('Voice error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>
            Something went wrong with the voice feature.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### 2.2 Create Voice Error Handler (`src/services/voiceErrorHandler.ts`):
```typescript
import { VoiceError } from '@types';

export class VoiceErrorHandler {
  static handle(error: VoiceError): string {
    switch (error.code) {
      case 'VOICE_NOT_AVAILABLE':
        return 'Voice recording is not available right now. Please try again later.';
      case 'VOICE_PERMISSION_DENIED':
        return 'Please enable microphone access to use voice features.';
      case 'NETWORK_ERROR':
        return 'Unable to process voice right now. Your note has been saved offline.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }

  static isRecoverable(error: VoiceError): boolean {
    return !['VOICE_NOT_AVAILABLE', 'VOICE_PERMISSION_DENIED'].includes(error.code);
  }
}
```

## Step 3: Testing Infrastructure (45 minutes)

### 3.1 Install Testing Dependencies
```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### 3.2 Configure Jest (`jest.config.js`):
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
};
```

### 3.3 Create Voice Component Tests (`src/components/__tests__/VoiceRecorder.test.tsx`):
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VoiceRecorder } from '../VoiceRecorder';

describe('VoiceRecorder', () => {
  it('starts recording when button is pressed', () => {
    const { getByText } = render(<VoiceRecorder />);
    const button = getByText('Start Recording');
    
    fireEvent.press(button);
    
    expect(getByText('Stop Recording')).toBeTruthy();
  });

  it('handles errors gracefully', () => {
    // Add error handling test
  });
});
```

## Step 4: State Management (30 minutes)

### 4.1 Install Zustand
```bash
npm install zustand
```

### 4.2 Create Voice Store (`src/stores/voiceStore.ts`):
```typescript
import create from 'zustand';
import { VoiceSession } from '@types';

interface VoiceState {
  isRecording: boolean;
  currentSession: VoiceSession | null;
  sessions: VoiceSession[];
  setRecording: (recording: boolean) => void;
  addSession: (session: VoiceSession) => void;
  clearCurrentSession: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isRecording: false,
  currentSession: null,
  sessions: [],
  setRecording: (recording) => set({ isRecording: recording }),
  addSession: (session) => set((state) => ({
    sessions: [...state.sessions, session]
  })),
  clearCurrentSession: () => set({ currentSession: null })
}));
```

## Step 5: Integration Points (30 minutes)

### 5.1 Create Integration Layer (`src/integration/voiceIntegration.ts`):
```typescript
import { VoiceSession, VoiceData } from '@types';

export class VoiceIntegration {
  // For AGENT_2 (Backend)
  static prepareForProcessing(session: VoiceSession): VoiceData {
    return {
      audioData: session.audioUrl,
      transcript: session.transcript,
      metadata: {
        timestamp: session.timestamp,
        energyLevel: session.energyLevel
      }
    };
  }

  // For AGENT_3 (Brain State)
  static extractBrainState(session: VoiceSession) {
    return {
      energy: session.energyLevel,
      timestamp: session.timestamp,
      emotionalMarkers: extractEmotionalMarkers(session.transcript)
    };
  }

  // For AGENT_4 (UI/UX)
  static prepareForDisplay(session: VoiceSession) {
    return {
      displayText: formatTranscript(session.transcript),
      energyIndicator: getEnergyIndicator(session.energyLevel),
      timestamp: formatTimestamp(session.timestamp)
    };
  }
}
```

## Validation Procedures

### 1. Navigation Testing
```bash
# Test navigation flows
npm run test:navigation

# Verify deep linking
npm run test:deep-linking
```

### 2. Error Handling Validation
```bash
# Test error boundaries
npm run test:errors

# Verify error recovery
npm run test:recovery
```

### 3. Integration Testing
```bash
# Test AGENT_2 integration
npm run test:backend-integration

# Test AGENT_3 integration
npm run test:brain-state-integration

# Test AGENT_4 integration
npm run test:ui-integration
```

## Files Created/Modified
```
src/
├── navigation/
│   └── index.tsx
├── screens/
│   ├── VoiceHistory.tsx
│   └── VoiceSettings.tsx
├── components/
│   ├── ErrorBoundary.tsx
│   └── VoiceSessionCard.tsx
├── services/
│   └── voiceErrorHandler.ts
├── stores/
│   └── voiceStore.ts
├── integration/
│   └── voiceIntegration.ts
└── __tests__/
    └── VoiceRecorder.test.tsx
```

## Success Criteria
- [ ] Navigation framework working
- [ ] Error handling catching issues
- [ ] Tests passing
- [ ] State management functional
- [ ] Integration points ready

## Next Steps
1. AGENT_2 backend integration
2. AGENT_3 brain state correlation
3. AGENT_4 UI/UX enhancement

---
**Note**: This enhancement preserves all existing voice functionality while adding production-ready infrastructure.