# 🏗️ Agent 1 Sprint 1B: Navigation Framework

## Mission
Implement React Navigation 6.1.17 with working navigation between three placeholder screens.

## Sprint Goal
Build a complete navigation framework that other agents can integrate with, including placeholder screens and deep linking.

## Time Estimate
1-2 hours

## Prerequisites
- Sprint 1A completed successfully
- `npx expo start` works without errors
- TypeScript compilation passes

## Critical Rules (NEVER VIOLATE)
1. Navigation: React Navigation 6.1.17 ONLY
2. Use EXACT navigation patterns shown
3. Export all types for other agents
4. No red colors anywhere

## Sprint Tasks

### Task 1: Install Navigation Dependencies
```bash
# Run these in current directory (we're already in the project root)
npm install @react-navigation/stack@6.3.29
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler
```

### Task 2: Create Placeholder Screens
**Create**: `src/screens/PlaceholderScreen.tsx`
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenProps } from '../types/navigation';

interface PlaceholderScreenProps extends ScreenProps<any> {
  screenName: string;
  subtitle: string;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ 
  navigation, 
  screenName, 
  subtitle 
}) => {
  const navigateToNext = () => {
    if (screenName === 'Brain State Check-in') {
      navigation.navigate('TaskList');
    } else if (screenName === 'Task List') {
      navigation.navigate('Settings');
    } else {
      navigation.navigate('BrainStateCheckin');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screenName}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      <TouchableOpacity style={styles.button} onPress={navigateToNext}>
        <Text style={styles.buttonText}>Go to Next Screen</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>Go Back</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#7FB3D3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    minHeight: 44, // Accessibility minimum
  },
  secondaryButton: {
    backgroundColor: '#E8F4F8',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryText: {
    color: '#7FB3D3',
  },
});
```

### Task 3: Create Individual Screen Components
**Create**: `src/screens/BrainStateCheckinScreen.tsx`
```typescript
import React from 'react';
import { PlaceholderScreen } from './PlaceholderScreen';
import { ScreenProps } from '../types/navigation';

export const BrainStateCheckinScreen: React.FC<ScreenProps<'BrainStateCheckin'>> = (props) => {
  return (
    <PlaceholderScreen
      {...props}
      screenName="Brain State Check-in"
      subtitle="Agent 3 will build the brain state sliders here"
    />
  );
};
```

**Create**: `src/screens/TaskListScreen.tsx`
```typescript
import React from 'react';
import { PlaceholderScreen } from './PlaceholderScreen';
import { ScreenProps } from '../types/navigation';

export const TaskListScreen: React.FC<ScreenProps<'TaskList'>> = (props) => {
  return (
    <PlaceholderScreen
      {...props}
      screenName="Task List"
      subtitle="Agent 3 will build adaptive task management here"
    />
  );
};
```

**Create**: `src/screens/SettingsScreen.tsx`
```typescript
import React from 'react';
import { PlaceholderScreen } from './PlaceholderScreen';
import { ScreenProps } from '../types/navigation';

export const SettingsScreen: React.FC<ScreenProps<'Settings'>> = (props) => {
  return (
    <PlaceholderScreen
      {...props}
      screenName="Settings"
      subtitle="Agent 4 will build freemium settings here"
    />
  );
};
```

### Task 4: Create Navigation Hook
**Create**: `src/navigation/useAppNavigation.ts`
```typescript
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export interface AppNavigationMethods {
  goToBrainStateCheckin: () => void;
  goToTaskList: (params?: RootStackParamList['TaskList']) => void;
  goToSettings: (params?: RootStackParamList['Settings']) => void;
  goBack: () => void;
  getCurrentRoute: () => string | undefined;
}

export const useAppNavigation = (): AppNavigationMethods => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  return {
    goToBrainStateCheckin: () => navigation.navigate('BrainStateCheckin'),
    goToTaskList: (params) => navigation.navigate('TaskList', params),
    goToSettings: (params) => navigation.navigate('Settings', params),
    goBack: () => navigation.goBack(),
    getCurrentRoute: () => navigation.getState()?.routes[navigation.getState()?.index || 0]?.name,
  };
};
```

### Task 5: Create Main Navigator
**Create**: `src/navigation/AppNavigator.tsx`
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { BrainStateCheckinScreen } from '../screens/BrainStateCheckinScreen';
import { TaskListScreen } from '../screens/TaskListScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BrainStateCheckin"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7FB3D3',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="BrainStateCheckin" 
          component={BrainStateCheckinScreen}
          options={{ title: 'How are you feeling?' }}
        />
        <Stack.Screen 
          name="TaskList" 
          component={TaskListScreen}
          options={{ title: 'Your Tasks' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### Task 6: Update App.tsx to Use Navigation
**Update**: `App.tsx`
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
```

### Task 7: Create Screen Index
**Create**: `src/screens/index.ts`
```typescript
export { BrainStateCheckinScreen } from './BrainStateCheckinScreen';
export { TaskListScreen } from './TaskListScreen';
export { SettingsScreen } from './SettingsScreen';
export { PlaceholderScreen } from './PlaceholderScreen';
```

## Success Criteria (Binary Pass/Fail)

### Must Pass Before Sprint 1C
- [ ] `npx expo start` shows navigation working
- [ ] Can navigate between all 3 screens using buttons
- [ ] Back button works on Android/web
- [ ] Header shows correct titles
- [ ] TypeScript compilation passes: `npx tsc --noEmit`
- [ ] All screen components render without errors
- [ ] `useAppNavigation()` hook exports all required methods

### Validation Steps
1. Start app: `npx expo start`
2. Navigate: BrainStateCheckin → TaskList → Settings → Back
3. Test TypeScript: `npx tsc --noEmit`
4. Verify all screens show placeholder content

## What Other Agents Get From This Sprint

### For Agent 3 (Core Features)
- `ScreenProps<'BrainStateCheckin'>` interface for brain state screen
- `ScreenProps<'TaskList'>` interface for task list screen
- `useAppNavigation()` hook for programmatic navigation
- Screen components ready to replace with real functionality

### For Agent 4 (UI/UX)
- Navigation header styling patterns
- Screen component structure to follow
- Accessibility patterns (44px touch targets)
- Color system examples using neurodivergent-friendly colors

## Interface Contracts
Other agents MUST use these exact patterns:

```typescript
// Screen component structure
const YourScreen: React.FC<ScreenProps<'ScreenName'>> = ({ navigation, route }) => {
  const { goToTaskList } = useAppNavigation();
  // Component implementation
};

// Navigation method usage
const { goToBrainStateCheckin, goToTaskList, goToSettings } = useAppNavigation();
```

## Common Mistakes to Avoid
- Don't change the navigation structure
- Don't use different screen component patterns
- Don't modify the `RootStackParamList` interface
- Don't forget to test navigation on both directions

## Troubleshooting

### If Navigation Doesn't Work
1. Check that all screens are properly imported
2. Verify Stack.Screen names match RootStackParamList
3. Ensure react-native-gesture-handler is properly installed

### If TypeScript Errors
1. Check that all screen props extend ScreenProps<T>
2. Verify navigation param types match RootStackParamList
3. Run `npx tsc --noEmit` for detailed error messages

## Files Created This Sprint
- `src/navigation/AppNavigator.tsx`
- `src/navigation/useAppNavigation.ts`
- `src/screens/PlaceholderScreen.tsx`
- `src/screens/BrainStateCheckinScreen.tsx`
- `src/screens/TaskListScreen.tsx`
- `src/screens/SettingsScreen.tsx`
- `src/screens/index.ts`
- Updated `App.tsx`

## Next Sprint Preview
Sprint 1C will add error boundaries, loading states, and testing setup to make the app production-ready.

---
**Sprint 1B Focus**: Working navigation that other agents can build upon.