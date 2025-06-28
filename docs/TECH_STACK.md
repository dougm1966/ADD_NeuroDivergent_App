# 🛠️ **Official Technology Stack**

## **CORE TECHNOLOGIES**

### **Frontend Framework**
- **React Native**: 0.79.4
- **Expo SDK**: 53.0.0+
- **TypeScript**: 5.8.3+

### **UI LIBRARY (OFFICIAL STANDARD)**
- **React Native Paper**: 5.14.5+ ⭐ **MANDATORY UI FRAMEWORK**
- **Material Design 3**: Design system foundation
- **Theme System**: Centralized styling with light/dark mode support

### **Navigation**
- **React Navigation**: 6.1.17 (DO NOT CHANGE)
- **Stack Navigator**: Primary navigation pattern
- **Bottom Tabs**: Secondary navigation

### **State Management**
- **Zustand**: 4.5.2 (OFFICIAL STATE LIBRARY)
- **AsyncStorage**: 1.21.0 (Local persistence)
- **NO REDUX**: Explicitly forbidden

### **Backend & Database**
- **Supabase**: Complete backend solution
  - PostgreSQL database with Row Level Security
  - Authentication & user management
  - Real-time subscriptions
  - Auto-generated REST API
  - Edge Functions for serverless compute

### **HTTP & API**
- **Supabase JS Client**: 2.39.3+ (Built-in HTTP client)
- **OpenAI API**: Direct integration for AI task breakdown

---

## **UI COMPONENT STANDARDS**

### **OFFICIAL UI LIBRARY: React Native Paper**

**Why Paper is Our Standard:**
- Material Design 3 compliance
- Built-in accessibility features
- Consistent design language
- Performance optimized for React Native
- Neurodiverse-friendly design principles
- Centralized theming system

### **Required Paper Components**

#### **Layout & Structure**
```typescript
import { 
  Surface,      // Main containers
  Card,         // Content grouping
  Divider,      // Visual separation
  Portal        // Modals and overlays
} from 'react-native-paper';
```

#### **Typography (MANDATORY)**
```typescript
import { Text } from 'react-native-paper';

// ALL text must use Paper Text with semantic variants
<Text variant="displayLarge">Main Headers</Text>
<Text variant="headlineMedium">Section Headers</Text>
<Text variant="titleMedium">Card Titles</Text>
<Text variant="bodyLarge">Body Text</Text>
<Text variant="labelMedium">Form Labels</Text>
```

#### **Input & Controls**
```typescript
import { 
  TextInput,    // All text inputs
  Button,       // All button interactions
  FAB,          // Floating Action Button
  IconButton,   // Icon-only buttons
  Switch,       // Boolean toggles
  Checkbox,     // Multi-select
  RadioButton,  // Single-select
  Slider        // Range inputs (brain state)
} from 'react-native-paper';
```

#### **Navigation Components**
```typescript
import { 
  Appbar,           // Top navigation
  BottomNavigation, // Tab navigation
  Drawer,           // Side navigation
  TabView           // Tabbed content
} from 'react-native-paper';
```

#### **Feedback & Status**
```typescript
import { 
  Snackbar,        // Toast notifications
  Banner,          // Important announcements
  ProgressBar,     // Loading states
  ActivityIndicator, // Indeterminate loading
  Badge,           // Status indicators
  Chip             // Tags and labels
} from 'react-native-paper';
```

---

## **DEVELOPMENT TOOLS**

### **Frontend Development**
- **Expo CLI**: Development server and building
- **Expo Dev Client**: Custom development builds
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

### **Backend Development**
- **Supabase Dashboard**: Database management
- **Supabase CLI**: Local development and migrations
- **PostgreSQL**: Database queries and optimization

### **Deployment & Distribution**
- **EAS (Expo Application Services)**: App building and distribution
- **Supabase**: Auto-deployed backend
- **Environment Configs**: Separate dev/staging/prod environments

---

## **PACKAGE DEPENDENCIES**

### **Core Dependencies (package.json)**
```json
{
  "dependencies": {
    "expo": "~53.0.13",
    "expo-dev-client": "~5.2.2",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.4",
    "react-native-paper": "^5.14.5",
    "react-native-safe-area-context": "5.4.0",
    "@supabase/supabase-js": "^2.39.3",
    "zustand": "^4.5.2",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "typescript": "~5.8.3",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

### **Babel Configuration (Required for Paper)**
```javascript
// babel.config.js
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

---

## **ARCHITECTURE PATTERNS**

### **State Management Pattern**
```typescript
// Using Zustand for global state
import { create } from 'zustand';

interface BrainStateStore {
  energyLevel: number;
  focusLevel: number;
  moodLevel: number;
  updateBrainState: (state: Partial<BrainState>) => void;
}

export const useBrainStateStore = create<BrainStateStore>((set) => ({
  energyLevel: 5,
  focusLevel: 5,
  moodLevel: 5,
  updateBrainState: (newState) => set((state) => ({ ...state, ...newState })),
}));
```

### **Component Structure Pattern**
```typescript
// All components must follow this structure
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface Props {
  title: string;
  onPress: () => void;
}

export const ExampleComponent: React.FC<Props> = ({ title, onPress }) => {
  const theme = useTheme();
  
  return (
    <Surface style={styles.container}>
      <Text variant="titleMedium">{title}</Text>
      <Button mode="contained" onPress={onPress}>
        Action
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

### **API Service Pattern**
```typescript
// Supabase service pattern
import { supabase } from '../lib/supabase';

export class TaskService {
  static async getTasks(userId: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async createTask(task: CreateTaskRequest) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
```

---

## **FORBIDDEN TECHNOLOGIES**

### **❌ DO NOT USE:**

1. **UI Libraries Other Than Paper**
   - NativeBase
   - UI Kitten
   - Tamagui
   - React Native Elements
   - Custom UI component libraries

2. **State Management Alternatives**
   - Redux/Redux Toolkit
   - MobX
   - Context API for global state
   - Recoil

3. **Styling Solutions**
   - styled-components
   - Emotion
   - NativeWind/Tailwind CSS
   - Custom CSS-in-JS libraries

4. **Backend Alternatives**
   - Firebase
   - AWS Amplify
   - Custom Express/Node.js backends
   - Parse

5. **Navigation Alternatives**
   - React Router Native
   - Reach Router
   - Custom navigation solutions

---

## **CONFIGURATION REQUIREMENTS**

### **Required App Configuration**
```typescript
// app.json
{
  "expo": {
    "name": "BrainPal",
    "slug": "brainpal",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "scheme": "brainpal",
    "plugins": [
      ["expo-dev-client"]
    ],
    "extra": {
      "supabaseUrl": process.env.EXPO_PUBLIC_SUPABASE_URL,
      "supabaseAnonKey": process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    }
  }
}
```

### **Required TypeScript Configuration**
```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts"
  ]
}
```

### **Environment Variables**
```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
```

---

## **PERFORMANCE REQUIREMENTS**

### **Bundle Size Targets**
- **iOS**: < 50MB
- **Android**: < 50MB
- **JavaScript Bundle**: < 10MB

### **Runtime Performance**
- **App startup**: < 2 seconds
- **Navigation transitions**: < 300ms
- **API responses**: < 1 second
- **UI responsiveness**: 60 FPS maintained

### **Memory Usage**
- **Peak memory**: < 200MB
- **Idle memory**: < 100MB
- **Memory leaks**: Zero tolerance

---

## **QUALITY STANDARDS**

### **Code Quality**
- **TypeScript**: 100% type coverage
- **ESLint**: Zero warnings allowed
- **Test Coverage**: > 80% for business logic
- **Component Testing**: All Paper components properly tested

### **Accessibility Standards**
- **WCAG 2.1 AA compliance**
- **Screen reader support**
- **Voice control compatibility**
- **High contrast mode support**

### **Security Requirements**
- **No hardcoded secrets**
- **Row Level Security on all database tables**
- **Input validation on all forms**
- **Secure token storage**

---

## **MIGRATION & COMPATIBILITY**

### **Version Compatibility Matrix**
| Component | Minimum Version | Recommended Version | Breaking Changes |
|-----------|----------------|-------------------|------------------|
| React Native | 0.79.0 | 0.79.4+ | None |
| Expo SDK | 53.0.0 | 53.0.13+ | None |
| React Native Paper | 5.14.5 | Latest | Minor theming |
| TypeScript | 5.8.0 | 5.8.3+ | None |
| Supabase JS | 2.39.0 | Latest | None |

### **Upgrade Path**
1. Always update Paper first (UI consistency)
2. Update Expo SDK during maintenance windows
3. Update Supabase client regularly (security)
4. Update TypeScript conservatively (stability)

---

## **DECISION RATIONALE**

### **Why These Specific Technologies?**

**React Native Paper:**
- Material Design 3 ensures modern, accessible UI
- Reduces custom component development time
- Built-in theming system supports neurodiverse needs
- Consistent with Google's accessibility guidelines
- Performance optimized for mobile

**Zustand over Redux:**
- Simpler mental model for team productivity
- Less boilerplate code
- Better TypeScript integration
- Smaller bundle size
- Easier testing

**Supabase over Firebase:**
- PostgreSQL provides better data relationships
- Row Level Security built-in
- Open source (vendor independence)
- Better developer experience
- Real-time capabilities without complexity

**Expo over React Native CLI:**
- Faster development cycles
- Built-in deployment pipeline
- Consistent development environment
- Better debugging tools
- OTA updates capability

---

**This technology stack is optimized for developer productivity, user experience, and maintainability.** 🛠️