# Gift Tracker

A mobile-first React Native application for organizing gift ideas, tracking purchases, and managing gift-giving for friends and family across various occasions.

## Features

### Core Features
- **People Management** - Create and manage profiles for gift recipients with photos, sizes, preferences, and notes
- **Gift Ideas Tracking** - Add gift ideas with URLs, prices, photos, voice notes, and priority levels
- **Gift Status Workflow** - Track gifts through Idea → Purchased → Wrapped → Hidden → Given stages
- **Budget Tracking** - Set and monitor budgets per person with visual progress indicators
- **Occasion Management** - Track birthdays, holidays, and custom occasions with countdowns

### Coming Soon
- **Reminders & Notifications** - Get reminded before occasions
- **Quick Capture** - Share sheet integration and camera quick-capture
- **Cloud Sync** - Firebase integration for multi-device sync
- **Ad Monetization** - Google AdMob integration
- **Gift History** - Track past gifts with reaction ratings

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Zustand with AsyncStorage persistence
- **Navigation:** React Navigation v7
- **Testing:** Jest, React Testing Library, Detox (E2E)
- **Styling:** Custom theme system with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/jamesdgaines/gift-tracker.git
cd gift-tracker

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run on web
npm run web
```

## Development

### Project Structure

```
/src
  /components
    /common          # Reusable UI components (Button, Input, Card, etc.)
    /forms           # Form components
    /cards           # Card components (PersonCard, GiftCard)
    /modals          # Modal components
    /ads             # Ad components (Banner, Interstitial, Rewarded)
  /screens           # Main app screens
  /navigation        # React Navigation configuration
  /store             # Zustand stores (people, gifts, occasions, settings)
  /services          # API and data services
  /hooks             # Custom React hooks
  /utils             # Utility functions
  /constants         # Constants (testIDs, categories, occasions, adConfig)
  /types             # TypeScript type definitions
  /theme             # Styling constants and theme
/__tests__
  /unit              # Unit tests
  /integration       # Integration tests
  /e2e               # End-to-end tests
```

### Available Scripts

```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run typecheck
```

### Testing

The project uses a comprehensive testing approach:

1. **Unit Tests** - Testing utility functions and store logic
2. **Component Tests** - Testing UI components with React Testing Library
3. **Integration Tests** - Testing data flow and store interactions
4. **E2E Tests** - Full user flow testing with Detox

All interactive elements include `testID` attributes for reliable test automation.

```bash
# Run all tests
npm test

# Run with coverage (80% minimum required)
npm run test:coverage
```

### Code Quality

- **ESLint** - Code linting with TypeScript rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** (recommended) - Git hooks for pre-commit checks

## TestIDs Convention

All testIDs follow the pattern: `{screen}-{component}-{identifier}`

Examples:
- `home-button-addPerson`
- `personDetail-card-gift-123`
- `giftForm-input-name`

TestIDs are centralized in `/src/constants/testIDs.ts`.

## Theming

The app supports light and dark modes with a comprehensive design system:

- **Colors** - Semantic color palette with status colors
- **Typography** - Consistent text styles
- **Spacing** - 4px-based spacing scale
- **Shadows** - Platform-specific elevation

```typescript
import { useTheme } from '@/theme';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[theme.typography.h1, { color: theme.colors.text }]}>
        Hello
      </Text>
    </View>
  );
};
```

## State Management

Using Zustand for lightweight, type-safe state management:

- `usePeopleStore` - CRUD operations for people
- `useGiftsStore` - Gift management with status workflow
- `useOccasionsStore` - Occasion tracking with countdown logic
- `useSettingsStore` - App preferences and ad consent

All stores persist to AsyncStorage automatically.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Add `testID` to all interactive elements
- Write tests for new features (aim for 80%+ coverage)
- Follow the existing code style
- Update documentation as needed

## License

This project is private and proprietary.

## Ad Integration (For Production)

Before releasing to app stores:

1. Create AdMob account and app
2. Replace test ad unit IDs in `/src/constants/adConfig.ts`
3. Configure GDPR consent flow
4. Test on real devices
5. Submit for AdMob review

See `/src/constants/adConfig.ts` for ad placement configuration.
