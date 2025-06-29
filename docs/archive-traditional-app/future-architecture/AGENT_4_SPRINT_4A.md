# 🎨 Agent 4 Sprint 4A: Design System Foundation

## Mission
Create a neurodivergent-friendly design system with voice-first patterns, ensuring gentle, accessible UI throughout the app.

## Time Estimate
1 hour

## Prerequisites
- Pre-foundation voice MVP working
- AGENT_0 voice patterns established
- Neurodivergent principles understood

## Sprint Goal
Complete design system foundation that supports voice-first interaction while enabling sophisticated UI patterns.

## Core Tasks

### Task 1: Voice-Aware Color System
```typescript
// src/constants/colors.ts
export const COLORS = {
  // Primary palette (calming, neurodivergent-friendly)
  PRIMARY: '#7FB3D3',      // Soft blue - main brand color
  SECONDARY: '#B8E6B8',    // Gentle mint - secondary actions
  SUCCESS: '#96CEB4',      // Gentle green - positive feedback
  WARNING: '#FFD93D',      // Soft yellow - warnings (NEVER red)
  INFO: '#A8D8EA',         // Light blue - informational
  
  // Voice-specific colors
  VOICE_ACTIVE: '#9FD4FF',    // Pulsing blue - recording active
  VOICE_PROCESSING: '#E6F3FF', // Soft blue - processing state
  VOICE_SUCCESS: '#D4F2EA',   // Gentle mint - voice recognized
  VOICE_ATTENTION: '#FFE4B5',  // Soft peach - needs attention
  VOICE_CELEBRATION: '#E8F8F5',// Light mint - celebration state
  
  // Neutrals (unchanged)
  BACKGROUND: '#FAFAFA',   
  SURFACE: '#FFFFFF',      
  TEXT_PRIMARY: '#2C3E50', 
  TEXT_SECONDARY: '#7F8C8D',
  TEXT_TERTIARY: '#BDC3C7',
  BORDER: '#E8E8E8',       
  DIVIDER: '#F1F2F6',      
  
  // Voice button states
  VOICE_BUTTON_IDLE: '#7FB3D3',
  VOICE_BUTTON_RECORDING: '#9FD4FF',
  VOICE_BUTTON_PROCESSING: '#E6F3FF',
  VOICE_BUTTON_DISABLED: '#F7F9FC',
  
  // Brain state specific (enhanced)
  ENERGY_LOW: '#FFE4B5',      // Soft peach - gentle voice UI
  ENERGY_MEDIUM: '#E6F3FF',   // Light blue - standard voice UI
  ENERGY_HIGH: '#E8F8F5',     // Light mint - dynamic voice UI
};
```

### Task 2: Voice Animation Patterns
```typescript
// src/constants/animations.ts
export const ANIMATIONS = {
  // Voice-specific animations
  VOICE_RECORDING: {
    duration: 1500,
    easing: 'easeInOut',
    scale: [1, 1.1],
    opacity: [1, 0.8],
    repeat: Infinity,
  },
  
  VOICE_PROCESSING: {
    duration: 1000,
    easing: 'linear',
    rotate: ['0deg', '360deg'],
    repeat: Infinity,
  },
  
  VOICE_CELEBRATION: {
    duration: 2000,
    easing: 'spring',
    scale: [0.8, 1.2, 1],
    opacity: [0, 1],
  },
  
  // Energy-based variations
  LOW_ENERGY_VOICE: {
    duration: 2000, // Slower, gentler
    easing: 'easeInOut',
  },
  
  HIGH_ENERGY_VOICE: {
    duration: 1000, // More dynamic
    easing: 'spring',
  },
};
```

### Task 3: Voice Component Sizing
```typescript
// src/constants/spacing.ts
export const SPACING = {
  // Base spacing (unchanged)
  BASE: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  
  // Voice-specific spacing
  VOICE_BUTTON: {
    SIZE: 72,        // Large, easy to tap
    PADDING: 24,     // Comfortable spacing
    MARGIN: 16,      // Clear separation
  },
  
  VOICE_INDICATOR: {
    SIZE: 48,        // Visible but not dominant
    PULSE_RANGE: 8,  // Animation range
  },
  
  VOICE_FEEDBACK: {
    PADDING: 20,     // Generous padding
    MARGIN: 16,      // Clear spacing
  },
};
```

### Task 4: Voice Typography System
```typescript
// src/constants/typography.ts
export const TYPOGRAPHY = {
  // Base styles (unchanged)
  HEADER: {
    fontSize: 24,
    fontWeight: '600',
  },
  BODY: {
    fontSize: 16,
    fontWeight: '400',
  },
  
  // Voice-specific styles
  VOICE_PROMPT: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  
  VOICE_FEEDBACK: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  
  VOICE_CELEBRATION: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 30,
    letterSpacing: 0.2,
  },
};
```

### Task 5: Voice UI Patterns
```typescript
// src/constants/patterns.ts
export const UI_PATTERNS = {
  // Voice interaction patterns
  VOICE_BUTTON: {
    shape: 'circle',
    elevation: 2,
    pressAnimation: 'gentle',
    feedbackDuration: 150,
  },
  
  VOICE_INDICATOR: {
    pulsePattern: 'breathe',
    transitionDuration: 300,
    opacity: {
      active: 1,
      inactive: 0.8,
    },
  },
  
  VOICE_FEEDBACK: {
    entryAnimation: 'fadeIn',
    exitAnimation: 'fadeOut',
    duration: 400,
  },
  
  // Energy-based adaptations
  ENERGY_ADAPTATIONS: {
    low: {
      animations: 'minimal',
      transitions: 'gentle',
      feedback: 'subtle',
    },
    medium: {
      animations: 'standard',
      transitions: 'smooth',
      feedback: 'clear',
    },
    high: {
      animations: 'dynamic',
      transitions: 'energetic',
      feedback: 'celebratory',
    },
  },
};
```

## Success Criteria
- [ ] Voice recording UI patterns defined
- [ ] Voice feedback color scheme complete
- [ ] Voice celebration animations created
- [ ] Energy-based adaptations specified
- [ ] All patterns are neurodivergent-friendly
- [ ] Voice components properly sized
- [ ] Animation patterns defined
- [ ] Typography system supports voice UI

## Testing Commands
```bash
# Test voice color contrast
npm run test:voice-contrast

# Validate animation patterns
npm run test:voice-animations

# Check accessibility
npm run test:voice-a11y
```

## What Other Agents Need
- **AGENT_0**: Complete voice UI patterns
- **AGENT_1**: Voice navigation styles
- **AGENT_2**: Voice data visualization
- **AGENT_3**: Voice celebration themes

## Common Mistakes to Avoid
- Don't use jarring animations
- Don't make voice button too small
- Don't use overwhelming colors
- Don't ignore energy states
- Don't create complex patterns

## Files Created/Modified
- `src/constants/colors.ts` (enhanced)
- `src/constants/animations.ts` (new)
- `src/constants/spacing.ts` (enhanced)
- `src/constants/typography.ts` (enhanced)
- `src/constants/patterns.ts` (new)

## Next Sprint Preview
Sprint 4B will create voice-aware interactive components using this design system.

---
**Sprint 4A Focus**: Voice-first design patterns that adapt to user energy.