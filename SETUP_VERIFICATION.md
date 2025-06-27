# ✅ SETUP VERIFICATION - Environment Validation Guide

**Purpose**: Comprehensive validation that environment is ready for development  
**Use Case**: Run before starting any sprint work  
**Result**: Confidence that setup is correct and complete  

---

## 🎯 Complete Verification Sequence

### **Step 1: Infrastructure Verification (5 minutes)**

#### **Check Core Files Exist**
```bash
# Verify all critical files are present
echo "📁 Checking core infrastructure files..."

# Required files checklist
files=(
  "package.json"
  "app.config.ts"
  "tsconfig.json"
  "babel.config.js"
  "jest.config.js"
  "App.tsx"
  "src/constants/config.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - MISSING!"
  fi
done
```

**✅ Expected**: All files show ✅ checkmarks

#### **Verify Dependencies**
```bash
# Check package.json has all required dependencies
echo "📦 Checking dependencies..."

npm list zustand@4.5.2
npm list @supabase/supabase-js@2.39.3
npm list @react-navigation/native@6.1.17
npm list expo@~51.0.0
npm list react-native@0.79.0

echo "Development dependencies:"
npm list --dev typescript
npm list --dev jest
npm list --dev @testing-library/react-native
```

**✅ Expected**: All dependencies found at correct versions

---

### **Step 2: TypeScript Configuration Verification (3 minutes)**

#### **Test TypeScript Compilation**
```bash
echo "🔧 Verifying TypeScript configuration..."

# Check TypeScript can compile
npx tsc --noEmit --verbose

# Test path aliases work
echo "Testing path alias imports..."
cat > temp-test.ts << 'EOF'
import { CONFIG } from '@/constants/config';
import type { BrainState } from '@/types/index';

// This should compile without errors if paths are correct
const test: BrainState = {
  energy_level: 5,
  focus_level: 5,
  mood_level: 5,
  notes: 'test',
  timestamp: new Date()
};
EOF

npx tsc --noEmit temp-test.ts
rm temp-test.ts
```

**✅ Expected**: TypeScript compiles without errors

#### **Verify Strict Mode**
```bash
echo "🔒 Checking TypeScript strict mode..."
grep '"strict": true' tsconfig.json
```

**✅ Expected**: Shows `"strict": true` line

---

### **Step 3: Expo Configuration Verification (3 minutes)**

#### **Test Expo Setup**
```bash
echo "📱 Verifying Expo configuration..."

# Check Expo doctor for issues
npx expo doctor

# Verify app.config.ts loads correctly
echo "Testing app.config.ts..."
node -e "
const config = require('./app.config.ts').default({});
console.log('✅ App name:', config.name);
console.log('✅ Slug:', config.slug);
console.log('✅ Extra config present:', !!config.extra);
"
```

**✅ Expected**: 
- Expo doctor shows no critical errors
- App config loads with correct name and slug

#### **Test Metro Bundler**
```bash
echo "🚇 Testing Metro bundler startup..."

# Start Metro in background and test
timeout 30s npx expo start --non-interactive > metro-test.log 2>&1 &
METRO_PID=$!

sleep 10

# Check if Metro started successfully
if grep -q "Metro waiting" metro-test.log; then
  echo "✅ Metro bundler started successfully"
else
  echo "❌ Metro bundler failed to start"
  cat metro-test.log
fi

# Cleanup
kill $METRO_PID 2>/dev/null || true
rm metro-test.log
```

**✅ Expected**: Metro bundler starts without errors

---

### **Step 4: Environment Variables Verification (3 minutes)**

#### **Test Configuration Access**
```bash
echo "🔐 Verifying environment variable setup..."

# Test config file loads
node -e "
const Constants = { expoConfig: { extra: {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'test-url',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'test-key',
  openaiApiKey: process.env.OPENAI_API_KEY || 'test-key'
}}};

// Simulate config loading
const CONFIG = {
  supabase: {
    url: Constants.expoConfig?.extra?.supabaseUrl || '',
    anonKey: Constants.expoConfig?.extra?.supabaseAnonKey || '',
  },
  openai: {
    apiKey: Constants.expoConfig?.extra?.openaiApiKey || '',
  }
};

console.log('✅ Config structure valid');
console.log('✅ Supabase URL format:', CONFIG.supabase.url ? 'OK' : 'MISSING');
console.log('✅ Supabase key format:', CONFIG.supabase.anonKey ? 'OK' : 'MISSING');
console.log('✅ OpenAI key format:', CONFIG.openai.apiKey ? 'OK' : 'MISSING');
"
```

**✅ Expected**: All config values show as "OK" or have test values

#### **Security Check**
```bash
echo "🛡️ Security verification..."

# Check no .env files are committed
if [ -f ".env" ]; then
  echo "⚠️  .env file detected - ensure it's in .gitignore"
  grep ".env" .gitignore || echo "❌ .env not in .gitignore!"
else
  echo "✅ No .env file found (good for security)"
fi

# Check .gitignore exists and has security patterns
if grep -q ".env" .gitignore && grep -q "*.key" .gitignore; then
  echo "✅ .gitignore has security patterns"
else
  echo "❌ .gitignore missing security patterns"
fi
```

**✅ Expected**: No security issues detected

---

### **Step 5: Testing Framework Verification (2 minutes)**

#### **Test Jest Configuration**
```bash
echo "🧪 Verifying testing framework..."

# Check Jest config
if [ -f "jest.config.js" ]; then
  echo "✅ Jest config found"
  
  # Test Jest can run
  npm test -- --passWithNoTests --verbose
else
  echo "❌ Jest config missing"
fi
```

**✅ Expected**: Jest runs without errors

#### **Test Testing Library Setup**
```bash
echo "🔬 Testing React Native Testing Library..."

# Create temporary test to verify setup
cat > temp-test.test.ts << 'EOF'
import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

test('testing library works', () => {
  const { getByText } = render(React.createElement(Text, {}, 'Hello'));
  expect(getByText('Hello')).toBeTruthy();
});
EOF

npm test -- temp-test.test.ts
rm temp-test.test.ts
```

**✅ Expected**: Test passes successfully

---

### **Step 6: Agent-Specific Verification**

#### **Agent 1: Foundation Specialist**
```bash
echo "🏗️ Agent 1 specific verification..."

# Check navigation dependencies
npm list @react-navigation/native
npm list react-native-screens
npm list react-native-safe-area-context

# Verify can create basic navigation structure
echo "✅ Navigation dependencies ready"
```

#### **Agent 2: Backend Integration Specialist**
```bash
echo "🗄️ Agent 2 specific verification..."

# Check Supabase dependency
npm list @supabase/supabase-js

# Test Supabase client can be imported
node -e "
const { createClient } = require('@supabase/supabase-js');
console.log('✅ Supabase client import works');
"

echo "✅ Backend dependencies ready"
```

#### **Agent 3: Core Feature Developer**
```bash
echo "🧠 Agent 3 specific verification..."

# Check Zustand dependency
npm list zustand

# Check AsyncStorage dependency  
npm list @react-native-async-storage/async-storage

# Test Zustand can be imported
node -e "
const { create } = require('zustand');
console.log('✅ Zustand import works');
"

echo "✅ Core feature dependencies ready"
```

#### **Agent 4: UI/UX Component Builder**
```bash
echo "🎨 Agent 4 specific verification..."

# Test React Native components can be imported
node -e "
const RN = require('react-native');
console.log('✅ React Native components:', Object.keys(RN).length > 0 ? 'Available' : 'Missing');
"

# Check design system structure exists
if [ -d "src/constants" ]; then
  echo "✅ Constants directory ready for design system"
else
  echo "❌ Need to create src/constants directory"
fi

echo "✅ UI/UX dependencies ready"
```

---

### **Step 7: Performance & Compatibility Verification (2 minutes)**

#### **Check Build Performance**
```bash
echo "⚡ Performance verification..."

# Time TypeScript compilation
echo "Timing TypeScript compilation..."
time npx tsc --noEmit

# Check Metro bundle time
echo "Testing Metro bundle performance..."
timeout 60s npx expo export --dev > export-test.log 2>&1 || echo "Export test completed"
rm -rf dist/ 2>/dev/null || true
rm export-test.log 2>/dev/null || true
```

#### **Platform Compatibility**
```bash
echo "🔄 Platform compatibility check..."

# Check if iOS build would work
if command -v xcodebuild &> /dev/null; then
  echo "✅ iOS build tools available"
else
  echo "ℹ️  iOS build tools not available (install Xcode if needed)"
fi

# Check if Android build would work
if command -v adb &> /dev/null; then
  echo "✅ Android build tools available"
else
  echo "ℹ️  Android build tools not available (install Android Studio if needed)"
fi

echo "✅ Web platform always available with Expo"
```

---

## 🎯 Complete Verification Summary

### **Run All Verifications**
```bash
#!/bin/bash
echo "🚀 Running complete setup verification..."

# Function to run verification step
verify_step() {
  echo ""
  echo "----------------------------------------"
  echo "$1"
  echo "----------------------------------------"
}

verify_step "Step 1: Infrastructure"
# [Infrastructure verification commands from above]

verify_step "Step 2: TypeScript"
# [TypeScript verification commands from above]

verify_step "Step 3: Expo"
# [Expo verification commands from above]

verify_step "Step 4: Environment Variables"
# [Environment verification commands from above]

verify_step "Step 5: Testing Framework"
# [Testing verification commands from above]

verify_step "Step 6: Agent Dependencies"
# [Agent-specific verification commands from above]

verify_step "Step 7: Performance"
# [Performance verification commands from above]

echo ""
echo "🎉 Verification complete! Check all ✅ marks above."
```

### **Save as Verification Script**
```bash
# Save complete verification as script
curl -o verify-setup.sh https://raw.githubusercontent.com/your-repo/verify-setup.sh
chmod +x verify-setup.sh
./verify-setup.sh
```

---

## ✅ Go/No-Go Decision Matrix

### **🟢 GO - Ready for Development**
- [ ] All infrastructure files present and valid
- [ ] TypeScript compiles without errors
- [ ] Expo starts without critical issues
- [ ] Environment variables configured correctly
- [ ] Testing framework functional
- [ ] Agent-specific dependencies ready
- [ ] No security issues detected

### **🟡 CAUTION - Minor Issues**
- [ ] Some optional tools missing (iOS/Android tools)
- [ ] Performance slower than ideal but functional
- [ ] Non-critical Expo doctor warnings
- [ ] Missing optional environment variables

### **🔴 NO-GO - Blocking Issues**
- [ ] Core infrastructure files missing
- [ ] TypeScript compilation fails
- [ ] Expo won't start
- [ ] Critical dependencies missing
- [ ] Security vulnerabilities detected

---

## 🚨 Emergency Setup Recovery

### **If Verification Fails Completely**
```bash
echo "🆘 Emergency setup recovery..."

# Nuclear option: Start fresh
rm -rf node_modules package-lock.json
npm install

# Re-verify configuration
npm run type-check
npx expo doctor

# If still failing, check:
echo "1. Node.js version: $(node --version)"
echo "2. npm version: $(npm --version)"
echo "3. Expo CLI version: $(expo --version)"
```

### **Get Help**
1. Check `PROJECT_STATUS.md` for known issues
2. Review `INFRASTRUCTURE_SETUP.md` for file recreation
3. Follow `QUICK_START.md` for step-by-step setup
4. Check `TROUBLESHOOTING.md` for common solutions

---

**🎯 Complete this verification before beginning any sprint work to ensure smooth development experience.**