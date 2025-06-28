# 🎨 **UI/UX Guidelines - React Native Paper Standard**

## **OFFICIAL UI LIBRARY: React Native Paper**

React Native Paper is the **OFFICIAL** and **ONLY** approved UI component library for this project. All developers MUST use Paper components exclusively.

### **Why React Native Paper?**

**Rationale for Official Adoption:**
- **Material Design 3 Compliance**: Follows Google's latest Material Design standards
- **Accessibility Built-in**: All components have accessibility features by default
- **Consistent Design Language**: Ensures uniform look and feel across the entire app
- **Theme System**: Centralized styling and dark mode support
- **Performance Optimized**: Components are optimized for React Native
- **Neurodiverse-Friendly**: Gentle animations, clear visual hierarchy, reduced cognitive load

---

## **MANDATORY COMPONENT USAGE**

### **Core Components (REQUIRED)**

#### **Layout Components**
```typescript
import { Surface, Card, Divider } from 'react-native-paper';

// Use Surface for main containers
<Surface style={styles.container}>
  {/* content */}
</Surface>

// Use Card for content grouping
<Card mode="outlined">
  <Card.Content>
    {/* content */}
  </Card.Content>
</Card>
```

#### **Typography (REQUIRED)**
```typescript
import { Text } from 'react-native-paper';

// NEVER use React Native Text directly
<Text variant="displayLarge">Main Headers</Text>
<Text variant="headlineMedium">Section Headers</Text>
<Text variant="titleMedium">Card Titles</Text>
<Text variant="bodyLarge">Body Text</Text>
<Text variant="labelMedium">Labels</Text>
```

#### **Buttons (REQUIRED)**
```typescript
import { Button, FAB, IconButton } from 'react-native-paper';

// Primary actions
<Button mode="contained" onPress={handlePress}>
  Primary Action
</Button>

// Secondary actions
<Button mode="outlined" onPress={handlePress}>
  Secondary Action
</Button>

// Floating Action Button for main actions
<FAB 
  icon="plus"
  onPress={handleAdd}
  style={styles.fab}
/>
```

#### **Input Components (REQUIRED)**
```typescript
import { TextInput, Switch, Checkbox, RadioButton } from 'react-native-paper';

// All text inputs must use Paper TextInput
<TextInput
  label="Task Title"
  value={value}
  onChangeText={setValue}
  mode="outlined"
/>

// Switches for toggles
<Switch 
  value={isEnabled} 
  onValueChange={setIsEnabled}
/>
```

---

## **THEME CONFIGURATION**

### **Official Theme Structure**
```typescript
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// OFFICIAL APP THEME - DO NOT MODIFY WITHOUT APPROVAL
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Neurodiverse-friendly colors
    primary: '#4CAF50',        // Calming green
    secondary: '#2196F3',      // Trustworthy blue
    tertiary: '#81C784',       // Soft accent
    surface: '#F8F9FA',        // Gentle background
    surfaceVariant: '#E8F5E8', // Subtle variation
    outline: '#C8E6C9',        // Soft borders
    error: '#E57373',          // Gentle error red
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
    primary: '#81C784',
    secondary: '#64B5F6',
    tertiary: '#A5D6A7',
    surface: '#1E1E1E',
    surfaceVariant: '#2E2E2E',
    outline: '#4E4E4E',
  },
};
```

### **Theme Provider Setup (REQUIRED)**
```typescript
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './src/constants/theme';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  
  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      {/* Your app content */}
    </PaperProvider>
  );
}
```

---

## **COMPONENT STANDARDS**

### **1. Brain State Check-in Components**

```typescript
// CORRECT - Using Paper components
import { Surface, Text, Slider } from 'react-native-paper';

const BrainStateSlider = ({ label, value, onValueChange }) => (
  <Surface style={styles.sliderContainer}>
    <Text variant="titleMedium">{label}</Text>
    <Slider
      style={styles.slider}
      minimumValue={1}
      maximumValue={10}
      value={value}
      onValueChange={onValueChange}
      step={1}
    />
    <Text variant="bodyMedium">{value}/10</Text>
  </Surface>
);
```

### **2. Task Card Components**

```typescript
// CORRECT - Using Paper Card system
import { Card, Text, Button, Chip } from 'react-native-paper';

const TaskCard = ({ task, onPress }) => (
  <Card mode="outlined" style={styles.taskCard}>
    <Card.Content>
      <Text variant="titleMedium">{task.title}</Text>
      <Text variant="bodyMedium" numberOfLines={2}>
        {task.description}
      </Text>
      <Chip 
        mode="outlined" 
        style={styles.complexityChip}
      >
        Complexity: {task.complexity_level}/5
      </Chip>
    </Card.Content>
    <Card.Actions>
      <Button mode="outlined" onPress={onPress}>
        Start Task
      </Button>
    </Card.Actions>
  </Card>
);
```

### **3. Navigation Components**

```typescript
// CORRECT - Using Paper with React Navigation
import { Appbar, BottomNavigation } from 'react-native-paper';

const CustomAppBar = ({ title, back }) => (
  <Appbar.Header>
    {back && <Appbar.BackAction onPress={back} />}
    <Appbar.Content title={title} />
  </Appbar.Header>
);
```

---

## **NEURODIVERSE-FRIENDLY DESIGN PRINCIPLES**

### **1. Gentle Visual Design**
- **Soft Colors**: Use muted, calming colors from the official theme
- **Rounded Corners**: All components should have gentle, rounded edges
- **Ample Spacing**: Minimum 16dp between interactive elements
- **Clear Hierarchy**: Obvious visual hierarchy using Paper's typography variants

### **2. Reduced Cognitive Load**
- **Minimal UI**: Show only essential information at each step
- **Progressive Disclosure**: Reveal complexity gradually
- **Consistent Patterns**: Use the same Paper components in the same way throughout

### **3. Accessibility Standards**
```typescript
// REQUIRED accessibility props for all custom components
<Button
  mode="contained"
  onPress={handlePress}
  accessibilityLabel="Start brain dump recording"
  accessibilityHint="Opens voice recording interface"
  accessibilityRole="button"
>
  Start Recording
</Button>
```

### **4. Animation Guidelines**
```typescript
// Use Paper's built-in animations - DO NOT create custom animations
import { AnimatedFAB } from 'react-native-paper';

// Paper components have gentle, accessibility-friendly animations built-in
<AnimatedFAB
  icon="microphone"
  label="Start Recording"
  onPress={handleRecord}
  visible={isVisible}
  animateFrom="right"
/>
```

---

## **FORBIDDEN PRACTICES**

### **❌ NEVER DO THESE:**

1. **Never use React Native core UI components directly**
   ```typescript
   // ❌ WRONG
   import { Text, Button, TextInput } from 'react-native';
   
   // ✅ CORRECT
   import { Text, Button, TextInput } from 'react-native-paper';
   ```

2. **Never create custom UI components when Paper equivalents exist**
   ```typescript
   // ❌ WRONG - Creating custom button
   const CustomButton = ({ title, onPress }) => (
     <TouchableOpacity style={customStyles.button} onPress={onPress}>
       <Text style={customStyles.buttonText}>{title}</Text>
     </TouchableOpacity>
   );
   
   // ✅ CORRECT - Using Paper Button
   <Button mode="contained" onPress={onPress}>
     {title}
   </Button>
   ```

3. **Never override Paper component styles aggressively**
   ```typescript
   // ❌ WRONG - Fighting against Paper's design
   <Button 
     mode="contained"
     style={{ backgroundColor: 'red', borderRadius: 0 }}
   >
     Bad Button
   </Button>
   
   // ✅ CORRECT - Working with Paper's theming
   <Button 
     mode="contained"
     buttonColor={theme.colors.primary}
   >
     Good Button
   </Button>
   ```

4. **Never bypass the theme system**
   ```typescript
   // ❌ WRONG - Hardcoded colors
   style={{ backgroundColor: '#4CAF50' }}
   
   // ✅ CORRECT - Using theme colors
   style={{ backgroundColor: theme.colors.primary }}
   ```

---

## **MANDATORY COMPONENTS LIST**

### **Must Use These Paper Components:**

#### **Layout & Structure**
- `Surface` - For main containers and backgrounds
- `Card` - For content grouping
- `Divider` - For visual separation
- `Portal` - For modals and overlays

#### **Typography**
- `Text` - ALL text must use Paper Text with variants
- `Headline`, `Title`, `Label` - Semantic text components

#### **Navigation**
- `Appbar` - For top navigation
- `BottomNavigation` - For tab navigation
- `Drawer` - For side navigation
- `TabView` - For tabbed content

#### **Input & Controls**
- `TextInput` - All text inputs
- `Button` - All button interactions
- `FAB` (Floating Action Button) - Primary actions
- `IconButton` - Icon-only buttons
- `Switch` - Boolean toggles
- `Checkbox` - Multi-select options
- `RadioButton` - Single-select options
- `Slider` - Range inputs (for brain state)

#### **Feedback & Status**
- `Snackbar` - Toast notifications
- `Banner` - Important announcements
- `ProgressBar` - Loading states
- `ActivityIndicator` - Indeterminate loading
- `Badge` - Status indicators
- `Chip` - Tags and labels

#### **Data Display**
- `List` - For structured lists
- `DataTable` - For tabular data
- `Avatar` - User representations
- `Tooltip` - Additional information

#### **Overlays**
- `Modal` - Full-screen overlays
- `Dialog` - Confirmation dialogs
- `Menu` - Context menus
- `BottomSheet` - Slide-up panels

---

## **COMPONENT IMPLEMENTATION STANDARDS**

### **1. Always Import from Paper**
```typescript
// ✅ CORRECT - Single import from Paper
import { 
  Surface, 
  Text, 
  Button, 
  TextInput, 
  Card 
} from 'react-native-paper';

// ❌ WRONG - Mixed imports
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
```

### **2. Use Proper Variants**
```typescript
// ✅ CORRECT - Using semantic variants
<Text variant="displayLarge">App Title</Text>
<Text variant="headlineMedium">Section Header</Text>
<Text variant="titleMedium">Card Title</Text>
<Text variant="bodyLarge">Main content</Text>
<Text variant="labelMedium">Form labels</Text>

// ❌ WRONG - Custom font sizes
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Title</Text>
```

### **3. Leverage Theme System**
```typescript
// ✅ CORRECT - Using theme colors
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
  },
});

// ❌ WRONG - Hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
});
```

---

## **QUALITY CHECKLIST**

Before submitting any component, verify:

### **✅ Required Checks:**
- [ ] All UI elements use React Native Paper components
- [ ] No direct React Native core components (Text, Button, etc.)
- [ ] Uses theme colors instead of hardcoded colors
- [ ] Uses proper typography variants
- [ ] Includes accessibility props
- [ ] Follows neurodiverse-friendly design principles
- [ ] Uses Paper's built-in animations
- [ ] Consistent with existing app patterns
- [ ] Tested in both light and dark themes
- [ ] No style overrides that fight Paper's design

### **⚠️ Review Required If:**
- Custom styling beyond theme customization
- New component not covered in this guide
- Accessibility concerns for neurodiverse users
- Performance implications of component choices

---

## **RESOURCES & REFERENCES**

### **Official Documentation**
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)

### **Internal Resources**
- [Theme Configuration](../src/constants/theme.ts)
- [Component Examples](../src/components/)
- [Architecture Guidelines](./ARCHITECTURE.md)

---

**React Native Paper is our design system foundation. Embrace it, don't fight it.** 🎨