# 🧠 BrainPal - Neurodivergent Productivity App

A neurodivergent-first productivity app built with Expo React Native, focusing on ADHD/ADD brain states and adaptive task management.

## 🛠️ **Official Technology Stack**

### **Core Technologies**
- **Expo SDK**: 53.0.0+
- **React Native**: 0.79.4
- **TypeScript**: 5.8.3+
- **Supabase**: Complete backend solution

### **UI Library (OFFICIAL STANDARD)**
- **React Native Paper**: 5.14.5+ ⭐ **MANDATORY UI FRAMEWORK**
- **Material Design 3**: Design system foundation
- **Theme System**: Centralized styling with light/dark mode

### **State & Navigation**
- **Zustand**: 4.5.2 (State Management)
- **React Navigation**: 6.1.17 (Navigation)
- **AsyncStorage**: 1.21.0 (Local Storage)

### **Backend & Services**
- **Supabase**: PostgreSQL, Auth, Real-time, API
- **OpenAI API**: AI task breakdown
- **Row Level Security**: Built-in data protection

---

## 🎨 **UI Component Standards**

### **React Native Paper - Official UI Library**

**ALL UI components MUST use React Native Paper. Core React Native components are forbidden.**

```typescript
// ✅ CORRECT - Using Paper components
import { Surface, Text, Button, Card } from 'react-native-paper';

<Surface style={styles.container}>
  <Text variant="headlineMedium">Welcome to BrainPal</Text>
  <Card mode="outlined">
    <Card.Content>
      <Button mode="contained" onPress={handlePress}>
        Start Brain Dump
      </Button>
    </Card.Content>
  </Card>
</Surface>

// ❌ WRONG - Using React Native core components
import { View, Text, TouchableOpacity } from 'react-native';
```

### **Required Paper Components**
- **Layout**: `Surface`, `Card`, `Divider`
- **Typography**: `Text` with semantic variants
- **Buttons**: `Button`, `FAB`, `IconButton`
- **Inputs**: `TextInput`, `Switch`, `Checkbox`, `Slider`
- **Navigation**: `Appbar`, `BottomNavigation`
- **Feedback**: `Snackbar`, `ProgressBar`, `ActivityIndicator`

---

## 📋 **Quick Start**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Install React Native Paper (Required)**
```bash
npm install react-native-paper@^5.14.5
npm install react-native-safe-area-context react-native-vector-icons
```

### **3. Configure Environment**
```bash
cp .env.example .env
# Add your Supabase and OpenAI API keys
```

### **4. Start Development Server**
```bash
npm start
```

### **5. Run on Device/Simulator**
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

---

## 📚 **Documentation**

### **Architecture & Standards**
- [🏗️ Technical Architecture](docs/ARCHITECTURE.md) - System overview and database schema
- [🎨 UI/UX Guidelines](docs/UI_UX_GUIDELINES.md) - React Native Paper standards and design principles
- [🛠️ Technology Stack](docs/TECH_STACK.md) - Complete tech stack documentation
- [📋 Paper Setup Guide](docs/PAPER_SETUP_GUIDE.md) - Installation and configuration guide

### **Development Guidelines**
- [🧪 Testing Strategy](docs/TESTING.md) - Testing approach and requirements
- [🚀 Deployment Guide](docs/DEPLOYMENT.md) - Build and release process
- [📋 Features Specification](docs/FEATURES.md) - Complete feature requirements

### **Project Planning**
- [📋 Project Context](PROJECT_CONTEXT.md) - Overview and goals
- [✅ TODO List](TODO.md) - Current development tasks
- [📁 Future Architecture](docs/future-architecture/) - Phase 2+ planning

---

## 🎯 **Core Features**

### **Phase 1 (Current)**
- **Brain State Check-in**: Daily energy/focus/mood tracking
- **Adaptive Task Management**: Task filtering based on brain state
- **AI Task Breakdown**: OpenAI-powered task simplification
- **Gentle UI/UX**: Neurodiverse-friendly interface design
- **Offline-First**: Local storage with Supabase sync

### **Phase 2 (Planned)**
- **Body Doubling**: Video-based co-working sessions
- **Social Features**: Connection with other users
- **Advanced Notifications**: Brain state-adaptive alerts
- **Gamification**: Achievement system and customization

---

## 🎨 **Design Principles**

### **Neurodiverse-Friendly Features**
- **Calming Color Palette**: Soft greens and blues
- **Reduced Cognitive Load**: Minimal, progressive UI
- **Gentle Animations**: Subtle, non-distracting transitions
- **Clear Visual Hierarchy**: Consistent typography and spacing
- **Accessibility First**: Screen reader and voice control support

### **Material Design 3 Compliance**
- **Official Theme System**: Centralized color and typography
- **Consistent Components**: React Native Paper standards
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Dark Mode Support**: Automatic theme switching

---

## 🏗️ **Architecture Overview**

### **Frontend Structure**
```
app/
├── App.tsx                 # Main app with PaperProvider
├── src/
│   ├── components/         # Paper-based UI components
│   ├── screens/           # Main app screens
│   ├── store/             # Zustand state management
│   ├── services/          # Supabase and API services
│   ├── constants/         # Theme and configuration
│   └── types/             # TypeScript definitions
```

### **Backend (Supabase)**
- **PostgreSQL**: Brain states, tasks, user data
- **Row Level Security**: User data protection
- **Real-time**: Live task updates
- **Authentication**: Email/password auth
- **Edge Functions**: Serverless compute

### **State Management**
- **Zustand**: Global state (brain states, tasks)
- **AsyncStorage**: Offline persistence
- **Supabase Client**: Real-time data sync

---

## 🧪 **Development Standards**

### **Code Quality Requirements**
- **TypeScript**: 100% type coverage
- **ESLint**: Zero warnings allowed
- **React Native Paper**: All UI components must use Paper
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: >80% coverage for business logic

### **Forbidden Practices**
- ❌ Using React Native core UI components
- ❌ Hardcoding colors (use theme system)
- ❌ Custom UI libraries other than Paper
- ❌ Redux or Context API for global state
- ❌ Styled-components or CSS-in-JS

### **Required Practices**
- ✅ React Native Paper for ALL UI components
- ✅ Theme colors instead of hardcoded values
- ✅ Semantic typography variants
- ✅ Accessibility props on interactive elements
- ✅ Zustand for state management

---

## 🚀 **Deployment**

### **Environment Configuration**
```bash
# Required environment variables
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
```

### **Build & Release**
```bash
# Development build
npm run build:dev

# Production build
eas build --platform all

# Submit to stores
eas submit --platform all
```

---

## 🤝 **Contributing**

### **Before Contributing**
1. Read [UI/UX Guidelines](docs/UI_UX_GUIDELINES.md) for Paper standards
2. Review [Architecture Documentation](docs/ARCHITECTURE.md)
3. Check [Technology Stack](docs/TECH_STACK.md) requirements
4. Follow [Paper Setup Guide](docs/PAPER_SETUP_GUIDE.md)

### **Development Workflow**
1. Use React Native Paper for ALL UI components
2. Follow Material Design 3 principles
3. Test on both iOS and Android
4. Ensure accessibility compliance
5. Maintain 100% TypeScript coverage

### **Pull Request Requirements**
- [ ] All UI uses React Native Paper components
- [ ] No hardcoded colors (theme system only)
- [ ] Accessibility props included
- [ ] TypeScript errors resolved
- [ ] Tests pass with >80% coverage

---

## 📞 **Support & Resources**

### **Official Documentation**
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Material Design 3](https://m3.material.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)

### **Project Resources**
- [Component Examples](app/src/components/)
- [Theme Configuration](app/src/constants/theme.ts)
- [API Services](app/src/services/)

---

## 📄 **License**

This project is proprietary software. All rights reserved.

---

**Built with React Native Paper for consistent, accessible, neurodiverse-friendly design.** 🧠✨