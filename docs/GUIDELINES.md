# 📐 **Development Guidelines**

## Design Principles

### 1. Neurodivergent-First Design
- **No Shame**: Zero guilt-inducing elements, no red colors, no streak pressure
- **Adaptive**: UI adapts to current brain state automatically
- **Simple**: Clear hierarchy, minimal decision points, no feature bloat
- **Compassionate**: Language that understands neurodivergent struggles
- **Predictable**: Consistent patterns, no surprising behaviors

### 2. Cognitive Load Reduction
- **One Primary Action**: Per screen/section maximum
- **Progressive Disclosure**: Show only what's needed now
- **Clear Visual Hierarchy**: Important things are obviously important
- **Generous Whitespace**: Reduce visual clutter and overwhelm
- **Consistent Patterns**: Same interactions work the same way everywhere

## Coding Standards

### TypeScript Requirements
```typescript
// Always use strict types
interface BrainState {
  energy: number; // 1-10
  focus: number;  // 1-10
  mood: number;   // 1-10
  notes?: string;
  timestamp: Date;
}

// No 'any' types allowed
// Use proper error types
type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};

// Strict function signatures
const recordBrainState = (state: BrainState): Promise<void> => {
  // Implementation
};
```

### React Native Conventions
```typescript
// Use functional components with hooks
const BrainStateCheckin: React.FC = () => {
  const [energy, setEnergy] = useState<number>(5);
  
  // Custom hooks for reusable logic
  const { currentBrainState } = useBrainState();
  
  return (
    <View style={styles.container}>
      {/* Component JSX */}
    </View>
  );
};

// Native StyleSheet only (no styled-components)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
});
```

### State Management with Zustand
```typescript
// Simple, focused stores
interface BrainStateStore {
  currentState: BrainState | null;
  todaysCheckinComplete: boolean;
  recordState: (state: BrainState) => Promise<void>;
  getTodaysState: () => BrainState | null;
}

// No complex middleware or devtools for MVP
const useBrainStateStore = create<BrainStateStore>((set, get) => ({
  currentState: null,
  todaysCheckinComplete: false,
  recordState: async (state) => {
    // Implementation
  },
  getTodaysState: () => {
    // Implementation
  },
}));
```

## UI/UX Guidelines

### Color System
```typescript
// constants/colors.ts
export const COLORS = {
  // Primary palette (calming, neurodivergent-friendly)
  PRIMARY: '#7FB3D3',      // Soft blue
  SUCCESS: '#96CEB4',      // Gentle green
  WARNING: '#FFD93D',      // Soft yellow (NEVER red)
  
  // Neutrals
  BACKGROUND: '#FAFAFA',   // Soft white
  TEXT_PRIMARY: '#2C3E50', // Dark blue-gray
  TEXT_SECONDARY: '#7F8C8D', // Medium gray
  BORDER: '#E8E8E8',       // Subtle borders
  
  // FORBIDDEN
  // RED: Never use red colors - triggering for neurodivergent users
} as const;
```

### Typography
```typescript
// constants/typography.ts
export const TYPOGRAPHY = {
  SIZES: {
    LARGE: 24,
    MEDIUM: 18,
    BODY: 16,      // Minimum size
    CAPTION: 14,
  },
  WEIGHTS: {
    BOLD: '700' as const,
    SEMIBOLD: '600' as const,
    REGULAR: '400' as const,
  },
  LINE_HEIGHT: 1.5, // Always use 1.5 for readability
} as const;
```

### Spacing System
```typescript
// constants/spacing.ts - 8px base system
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;
```

### Touch Targets
```typescript
// constants/layout.ts
export const LAYOUT = {
  TOUCH_TARGET_MIN: 44,    // Apple HIG minimum
  TOUCH_TARGET_PREFERRED: 48, // Better for accessibility
  TOUCH_SPACING_MIN: 8,    // Minimum between targets
} as const;
```

## Language Guidelines

### Gentle, Shame-Free Language
```typescript
// Good examples
const ENCOURAGING_MESSAGES = {
  TASK_COMPLETED: "You did something today - that's wonderful!",
  LOW_ENERGY_DAY: "Rest days are important too",
  TASK_BREAKDOWN: "Let's break this into smaller steps",
  ERROR_OCCURRED: "Let's try that again in a moment",
  SYNC_WAITING: "Saving your progress...",
};

// Bad examples - NEVER USE
const SHAME_BASED_MESSAGES = {
  TASK_FAILED: "You failed to complete this task",
  STREAK_BROKEN: "You broke your streak!",
  BEHIND_SCHEDULE: "You're behind schedule",
  ERROR_HARSH: "Error! Invalid input!",
  PRESSURE: "You should have done more today",
};
```

### UI Text Patterns
```typescript
// Button text - action-oriented, gentle
const BUTTON_TEXT = {
  PRIMARY: "Let's do this",
  SECONDARY: "Maybe later",
  DESTRUCTIVE: "Remove this", // Never "Delete"
  CONFIRMATION: "Sounds good",
};

// Form labels - supportive, optional
const FORM_LABELS = {
  BRAIN_STATE: "How are you feeling right now?",
  TASK_TITLE: "What would you like to work on?",
  NOTES: "Any notes? (totally optional)",
};
```

## Accessibility Requirements

### Screen Reader Support
```typescript
// Always include accessibility props
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Record your current brain state"
  accessibilityHint="Opens the brain state check-in screen"
>
  <Text>Check In</Text>
</TouchableOpacity>

// Semantic structure
<View accessibilityRole="header">
  <Text style={styles.heading}>Today's Tasks</Text>
</View>
```

### Visual Accessibility
```typescript
// High contrast support
const getContrastColor = (backgroundColor: string): string => {
  // Ensure 4.5:1 contrast ratio minimum
  return contrastRatio > 4.5 ? textColor : alternativeColor;
};

// Respect reduced motion
import { AccessibilityInfo } from 'react-native';

const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
}, []);
```

## Performance Guidelines

### Optimization Requirements
```typescript
// Lazy loading for non-critical components
const TaskBreakdown = lazy(() => import('./TaskBreakdown'));

// Memoization for expensive calculations
const filteredTasks = useMemo(() => {
  return tasks.filter(task => 
    task.complexity <= getCurrentEnergyLevel()
  );
}, [tasks, currentBrainState]);

// Efficient list rendering
<FlatList
  data={tasks}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### Battery Optimization
```typescript
// Minimize background processing
const SYNC_INTERVALS = {
  FOREGROUND: 30000, // 30 seconds when active
  BACKGROUND: 300000, // 5 minutes when backgrounded
};

// Efficient storage queries
const getRecentBrainStates = () => {
  return db.query(
    'SELECT * FROM brain_states WHERE created_at > ? ORDER BY created_at DESC LIMIT 7',
    [sevenDaysAgo]
  );
};
```

## Error Handling

### Gentle Error Patterns
```typescript
// Gentle error handling
const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return "We'll try connecting again in a moment";
    case 'RATE_LIMIT':
      return "Let's take a quick break and try again soon";
    case 'VALIDATION_ERROR':
      return "Let's adjust that just a bit";
    default:
      return "Something unexpected happened, but we're on it";
  }
};

// Never expose technical details to users
const sanitizeErrorMessage = (message: string): string => {
  return message.replace(/error|failed|invalid/gi, 'adjustment needed');
};
```

## Testing Standards

### Unit Test Requirements
```typescript
// Test brain state adaptations
test('should filter tasks based on energy level', () => {
  const lowEnergyState = { energy: 2, focus: 3, mood: 4 };
  const tasks = [
    { complexity: 1, title: 'Check email' },
    { complexity: 4, title: 'Write report' },
  ];
  
  const filtered = filterTasksByBrainState(tasks, lowEnergyState);
  
  expect(filtered).toHaveLength(1);
  expect(filtered[0].title).toBe('Check email');
});
```

### Accessibility Testing
```typescript
// Test screen reader support
test('should have proper accessibility labels', () => {
  const { getByLabelText } = render(<BrainStateCheckin />);
  
  expect(getByLabelText('Energy level slider')).toBeTruthy();
  expect(getByLabelText('Focus level slider')).toBeTruthy();
  expect(getByLabelText('Mood level slider')).toBeTruthy();
});
```

## Deployment Guidelines

### Environment Configuration
```typescript
// config/environment.ts
export const CONFIG = {
  API_URL: __DEV__ 
    ? 'http://localhost:3000' 
    : 'https://api.neuroapp.com',
  OPENAI_RATE_LIMIT: __DEV__ ? 100 : 10, // Per hour
  SYNC_INTERVAL: __DEV__ ? 5000 : 30000,
};
```

### Build Optimization
```bash
# iOS build optimization
npx react-native bundle --platform ios --dev false --minify true

# Android build optimization  
npx react-native bundle --platform android --dev false --minify true

# Asset optimization
npx react-native-asset
```

## Code Review Checklist

### Pre-commit Requirements
- [ ] TypeScript types properly defined (no `any`)
- [ ] Accessibility props included where needed
- [ ] No red colors or shame-based language
- [ ] Touch targets meet 44px minimum
- [ ] Error handling is gentle and helpful
- [ ] Performance impact considered
- [ ] Offline functionality works
- [ ] **Tests written and passing (minimum 80% coverage)**
- [ ] **Integration tests pass for cross-agent dependencies**
- [ ] **Backward compatibility verified**

### Neurodivergent-Specific Checks
- [ ] UI adapts to different brain states
- [ ] Cognitive load is minimized
- [ ] Language is encouraging and supportive
- [ ] Sensory customization options work
- [ ] No overwhelming animations or sounds
- [ ] Clear visual hierarchy maintained

---

## Reference Documentation

### **Forward Compatibility**
- 🔮 [Phase 2 Scalability Reference](reference/PHASE_2_SCALABILITY.md) - Future features that influence current design decisions
- 🔄 [Architecture Evolution Guide](reference/ARCHITECTURE_EVOLUTION.md) - How code patterns evolve for Phase 2

### **Implementation Context**
- 🏗️ [Technical Architecture](ARCHITECTURE.md) - Technical constraints for these guidelines
- 📋 [Features Specification](FEATURES.md) - Features these guidelines apply to
- 🧪 [Testing Strategy](../TESTING.md) - How to test guideline compliance

---

**Guidelines optimized for neurodivergent users and maintainable code** 🧠⚡