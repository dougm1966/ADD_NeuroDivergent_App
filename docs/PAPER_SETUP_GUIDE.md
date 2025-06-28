# 📋 **React Native Paper Setup Guide**

## **OFFICIAL INSTALLATION & CONFIGURATION**

This guide ensures React Native Paper is properly configured as our official UI library standard.

---

## **1. INSTALLATION**

### **Step 1: Install React Native Paper**
```bash
npm install react-native-paper@^5.14.5
```

### **Step 2: Install Required Dependencies**
```bash
npm install react-native-safe-area-context react-native-vector-icons
```

### **Step 3: Configure Vector Icons (iOS)**
```bash
cd ios && pod install
```

### **Step 4: Verify Installation**
```bash
npm list react-native-paper
# Should show: react-native-paper@5.14.5 or higher
```

---

## **2. BABEL CONFIGURATION**

### **Update babel.config.js**
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
```

**Why This Matters:**
- Enables tree-shaking for smaller bundle size
- Optimizes Paper component imports
- Required for production builds

---

## **3. THEME CONFIGURATION**

### **Create Theme File: `src/constants/theme.ts`**
```typescript
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// OFFICIAL APP THEME - APPROVED COLOR PALETTE
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Neurodiverse-friendly colors (calming and accessible)
    primary: '#4CAF50',        // Calming green
    secondary: '#2196F3',      // Trustworthy blue
    tertiary: '#81C784',       // Soft accent green
    surface: '#F8F9FA',        // Gentle background
    surfaceVariant: '#E8F5E8', // Subtle green tint
    outline: '#C8E6C9',        // Soft green borders
    error: '#E57373',          // Gentle error red (not harsh)
    onSurface: '#1B1B1B',      // Dark text for readability
    onPrimary: '#FFFFFF',      // White text on primary
    onSecondary: '#FFFFFF',    // White text on secondary
    background: '#FFFFFF',     // Pure white background
  },
  fonts: configureFonts({
    config: {
      fontFamily: 'System', // Use system font for accessibility
    }
  }),
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',        // Lighter green for dark mode
    secondary: '#64B5F6',      // Lighter blue for dark mode
    tertiary: '#A5D6A7',       // Lighter accent
    surface: '#1E1E1E',        // Dark background
    surfaceVariant: '#2E2E2E', // Slightly lighter dark
    outline: '#4E4E4E',        // Dark borders
    error: '#EF9A9A',          // Softer error in dark mode
  },
};

// Export current theme hook
export const useAppTheme = () => {
  // This will be connected to theme state management later
  return lightTheme;
};
```

---

## **4. APP PROVIDER SETUP**

### **Update App.tsx**
```typescript
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from './src/constants/theme';

// Your main app content component
function AppContent() {
  // Your app screens and navigation go here
  return (
    // Your app content
  );
}

export default function App() {
  // Theme state (you can add dark mode toggle later)
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
```

**Required Providers:**
- `SafeAreaProvider`: Handles device safe areas
- `PaperProvider`: Provides theme context to all Paper components

---

## **5. COMPONENT USAGE STANDARDS**

### **Typography Component**
```typescript
import React from 'react';
import { Text } from 'react-native-paper';

// ✅ CORRECT - Using Paper Text with variants
export const ExampleText = () => (
  <>
    <Text variant="displayLarge">Main App Title</Text>
    <Text variant="headlineMedium">Section Header</Text>
    <Text variant="titleMedium">Card Title</Text>
    <Text variant="bodyLarge">Body content text</Text>
    <Text variant="labelMedium">Form labels</Text>
  </>
);

// ❌ WRONG - Using React Native Text
import { Text } from 'react-native'; // DON'T DO THIS
```

### **Button Components**
```typescript
import React from 'react';
import { Button, FAB, IconButton } from 'react-native-paper';

export const ExampleButtons = () => (
  <>
    {/* Primary action */}
    <Button mode="contained" onPress={() => {}}>
      Primary Action
    </Button>
    
    {/* Secondary action */}
    <Button mode="outlined" onPress={() => {}}>
      Secondary Action
    </Button>
    
    {/* Text button */}
    <Button mode="text" onPress={() => {}}>
      Text Action
    </Button>
    
    {/* Floating Action Button */}
    <FAB
      icon="plus"
      onPress={() => {}}
      style={{ position: 'absolute', bottom: 16, right: 16 }}
    />
    
    {/* Icon button */}
    <IconButton icon="menu" onPress={() => {}} />
  </>
);
```

### **Input Components**
```typescript
import React, { useState } from 'react';
import { TextInput, Switch, Checkbox } from 'react-native-paper';

export const ExampleInputs = () => {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {/* Text input */}
      <TextInput
        label="Task Title"
        value={text}
        onChangeText={setText}
        mode="outlined"
      />
      
      {/* Switch */}
      <Switch 
        value={isEnabled} 
        onValueChange={setIsEnabled}
      />
      
      {/* Checkbox */}
      <Checkbox
        status={isChecked ? 'checked' : 'unchecked'}
        onPress={() => setIsChecked(!isChecked)}
      />
    </>
  );
};
```

### **Layout Components**
```typescript
import React from 'react';
import { Surface, Card, Divider } from 'react-native-paper';

export const ExampleLayout = () => (
  <Surface style={{ flex: 1, padding: 16 }}>
    <Card mode="outlined">
      <Card.Content>
        <Text variant="titleMedium">Card Title</Text>
        <Text variant="bodyMedium">Card content goes here</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="text">Cancel</Button>
        <Button mode="contained">Save</Button>
      </Card.Actions>
    </Card>
    
    <Divider style={{ marginVertical: 16 }} />
    
    {/* More content */}
  </Surface>
);
```

---

## **6. THEME USAGE PATTERNS**

### **Accessing Theme in Components**
```typescript
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export const ThemedComponent = () => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: theme.roundness,
    },
    text: {
      color: theme.colors.onSurface,
    },
  });

  return (
    <Surface style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </Surface>
  );
};
```

### **Using Theme Colors**
```typescript
// ✅ CORRECT - Using theme colors
const styles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.onSurface,
  },
});

// ❌ WRONG - Hardcoded colors
const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#4CAF50', // Don't hardcode
    color: '#FFFFFF',           // Don't hardcode
  },
});
```

---

## **7. ACCESSIBILITY CONFIGURATION**

### **Required Accessibility Props**
```typescript
import React from 'react';
import { Button, TextInput } from 'react-native-paper';

export const AccessibleComponents = () => (
  <>
    {/* Button with accessibility */}
    <Button
      mode="contained"
      onPress={() => {}}
      accessibilityLabel="Start brain dump recording"
      accessibilityHint="Opens voice recording interface"
      accessibilityRole="button"
    >
      Start Recording
    </Button>
    
    {/* Input with accessibility */}
    <TextInput
      label="Task Title"
      value=""
      onChangeText={() => {}}
      accessibilityLabel="Enter task title"
      accessibilityHint="Type a brief description of your task"
    />
  </>
);
```

---

## **8. TESTING SETUP**

### **Test Configuration for Paper Components**
```typescript
// __tests__/setup.js
import 'react-native-paper/lib/typescript/core/Provider';

// Mock Paper Provider for tests
jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual('react-native-paper');
  return {
    ...RealModule,
    Provider: ({ children }) => children,
  };
});
```

### **Component Testing Example**
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { lightTheme } from '../src/constants/theme';

const TestWrapper = ({ children }) => (
  <PaperProvider theme={lightTheme}>
    {children}
  </PaperProvider>
);

test('Button renders correctly', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <TestWrapper>
      <Button mode="contained" onPress={onPress}>
        Test Button
      </Button>
    </TestWrapper>
  );
  
  const button = getByText('Test Button');
  fireEvent.press(button);
  expect(onPress).toHaveBeenCalled();
});
```

---

## **9. PERFORMANCE OPTIMIZATION**

### **Bundle Size Optimization**
```javascript
// babel.config.js - Enables tree shaking
module.exports = {
  presets: ['babel-preset-expo'],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
```

### **Import Optimization**
```typescript
// ✅ CORRECT - Import what you need
import { Button, Text, Surface } from 'react-native-paper';

// ❌ WRONG - Don't import everything
import * as Paper from 'react-native-paper';
```

---

## **10. TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Icons Not Showing**
```bash
# iOS
cd ios && pod install

# Android - Add to android/app/build.gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### **Theme Not Applied**
```typescript
// Make sure PaperProvider wraps your entire app
export default function App() {
  return (
    <PaperProvider theme={lightTheme}>
      {/* All your app content */}
    </PaperProvider>
  );
}
```

#### **TypeScript Errors**
```typescript
// Add types to tsconfig.json
{
  "compilerOptions": {
    "types": ["react-native-paper"]
  }
}
```

#### **Build Errors**
```bash
# Clear cache and reinstall
npm start -- --clear-cache
rm -rf node_modules && npm install
```

---

## **11. VALIDATION CHECKLIST**

### **✅ Setup Complete When:**
- [ ] Paper installed with correct version (5.14.5+)
- [ ] Babel plugin configured for production
- [ ] Theme file created with approved colors
- [ ] PaperProvider wraps entire app
- [ ] SafeAreaProvider included
- [ ] All components use Paper instead of React Native core
- [ ] Theme colors used instead of hardcoded colors
- [ ] Accessibility props added to interactive components
- [ ] Tests configured for Paper components
- [ ] Icons displaying correctly on both platforms

### **⚠️ Common Mistakes to Avoid:**
- [ ] Using React Native core components (Text, Button, etc.)
- [ ] Hardcoding colors instead of using theme
- [ ] Missing PaperProvider wrapper
- [ ] Forgetting babel plugin for production
- [ ] Not including accessibility props
- [ ] Mixing UI libraries

---

## **12. NEXT STEPS**

After completing this setup:

1. **Read UI/UX Guidelines**: [UI_UX_GUIDELINES.md](./UI_UX_GUIDELINES.md)
2. **Review Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Check Tech Stack**: [TECH_STACK.md](./TECH_STACK.md)
4. **Start Building**: Use Paper components for all UI elements

---

## **SUPPORT & RESOURCES**

### **Official Documentation**
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)
- [Material Design 3](https://m3.material.io/)
- [Accessibility Guidelines](https://reactnative.dev/docs/accessibility)

### **Internal Resources**
- [Component Examples](../src/components/)
- [Theme Configuration](../src/constants/theme.ts)
- [Project README](../README.md)

---

**React Native Paper is now your official UI foundation. Build consistently, build accessibly.** 📋