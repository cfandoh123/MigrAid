# MigrAid

MigrAid is an AI-powered, privacy-first resource navigator designed to help immigrants, refugees, and undocumented individuals access critical legal, healthcare, food, and shelter resources. The app is built with a deep equity focus, prioritizing multilingual support, anonymity, and community-driven reporting.

---

## Project Overview

**MigrAid** addresses systemic barriers faced by immigrants, including language gaps, fear of authorities, lack of centralized information, and digital exclusion. The app empowers users to find and report resources safely, with a simple, icon-driven interface and robust privacy features.

---

## Features

- **Multilingual Onboarding**: Supports English, French, Hausa, and Akan (more languages can be added easily).
- **Anonymous Mode**: Users can browse and report without providing personal information.
- **Resource Navigation**: Find clinics, legal aid, food support, and shelters by category or proximity.
- **Interactive Map**: Location-based resource discovery with React Native Maps.
- **ICE Activity Reporting**: Community-sourced, anonymous reporting of ICE activity.
- **Advocate Dashboard**: For community advocates to manage resources and review reports.
- **Cross-Platform**: Runs on both iOS and Android devices.
- **Modern UI**: Clean, accessible interface with gradient backgrounds and intuitive navigation.

### Planned Features

- **Voice Interface**: Navigation and reporting via voice commands for low-literacy users.
- **Offline Resource Download**: Access resources without internet connectivity.
- **End-to-End Encryption**: Protect user data and reports.
- **Blockchain Proof-of-Help**: Reward system for community contributions.

---

## Technical Architecture

- **Frontend**: React Native with Expo SDK 53
- **Navigation**: React Navigation v7 with Stack and Bottom Tab navigators
- **UI Components**: Custom components with Expo Linear Gradient for modern styling
- **Maps**: React Native Maps for location-based features
- **Location Services**: Expo Location for geolocation functionality
- **State Management**: React Hooks and AsyncStorage for local data persistence
- **Development**: Expo CLI for development and build tooling
- **Mock Data**: Resources and ICE reports are currently hardcoded for demo/testing
- **Form Handling**: React Hook Form for efficient form management

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (buttons, inputs, etc.)
│   ├── forms/          # Form-specific components
│   └── icons/          # Custom icon components
├── screens/            # Screen components organized by feature
│   ├── home/          # Home and main screens
│   ├── onboarding/    # Onboarding flow screens
│   ├── resources/     # Resource browsing and details
│   ├── ice-reports/   # ICE reporting functionality
│   ├── advocate/      # Advocate dashboard
│   └── profile/       # User profile management
├── navigation/         # Navigation configuration
├── services/          # External services (location, storage)
├── data/              # Mock data and static content
└── constants/         # App constants (strings, theme)
```

---

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- For physical device testing: Expo Go app from App Store/Google Play

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/MigrAid.git
   cd MigrAid
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npx expo start
   ```

4. **Run on device/simulator:**
   - **Physical Device**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal or click "Open iOS Simulator" in Expo Dev Tools
   - **Android Emulator**: Press `a` in terminal or click "Open Android" in Expo Dev Tools
   - **Web**: Press `w` in terminal for web development

### Development Modes

- **Expo Go**: For testing with the Expo Go app (simpler setup)
- **Development Build**: For testing native features (requires EAS Build)

---

## Usage

- **Language Selection**: Choose your preferred language on first launch
- **Onboarding**: Learn about the app's features and choose anonymous mode if desired
- **Home Screen**: Browse resources by category or access different app sections
- **Resource Discovery**: View resources on a map or in list format
- **Resource Details**: Get detailed information, contact details, and directions
- **ICE Reporting**: Submit or view community reports of ICE activity
- **Advocate Dashboard**: (For verified advocates) Manage resources and view reports

---

## Contributing

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Make your changes and test thoroughly
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Development Guidelines

- Follow React Native best practices
- Maintain accessibility standards
- Test on both iOS and Android
- Update documentation for new features
- Respect privacy and security requirements

---

## Areas for Improvement

### Backend & Data

- **Backend Integration**: Connect to a real backend (Firebase, Supabase, or custom API) for live resource and report data
- **Database**: Implement proper data persistence and synchronization
- **API Design**: Create RESTful API for resource management and reporting

### Features

- **Voice Interface**: Integrate speech-to-text for voice navigation and reporting
- **Offline Support**: Allow users to download and access resources without internet
- **Push Notifications**: Alert users about nearby resources or important updates
- **Community Verification**: Build a system for community upvotes and resource verification

### Security & Privacy

- **End-to-End Encryption**: Implement encryption for all user data and reports
- **Authentication**: Optional secure user accounts with privacy controls
- **Data Anonymization**: Advanced privacy features for sensitive data

### Accessibility & Localization

- **Screen Reader Support**: Enhanced accessibility for visually impaired users
- **More Languages**: Add Spanish, Arabic, Haitian Creole, and other needed languages
- **Cultural Adaptation**: Localize content and UI for different cultural contexts

### Technical Improvements

- **Testing**: Add comprehensive unit, integration, and E2E tests
- **Performance**: Optimize app performance and bundle size
- **Code Quality**: Add TypeScript, ESLint, and Prettier configuration
- **CI/CD**: Set up automated testing and deployment pipelines

### Advanced Features

- **Blockchain Rewards**: Optional blockchain-based proof-of-help system
- **AI Integration**: Smart resource recommendations and automated translations
- **Advanced Analytics**: Privacy-preserving usage analytics for improvement

---

## Build & Deployment

### Development Build

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas login
eas build:configure

# Build for development
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Production Build

```bash
# Build for app stores
eas build --platform ios --profile production
eas build --platform android --profile production

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

---

## App Store Information

- **Bundle ID (iOS)**: com.anonymous.MigrAid
- **Package Name (Android)**: com.anonymous.MigrAid
- **Target SDK**: iOS 13+, Android API 24+

---

## Contact

- **Project Owners**: Caleb Kwakye, Calvin Andoh, Kofi Osei, Ebenezer Tseh
- **Repository**: https://github.com/your-username/MigrAid
- **Issues**: Report bugs and request features via GitHub Issues

---

## 📄 License

This project is licensed under the 0BSD License - see the [LICENSE](LICENSE) file for details.

---

**MigrAid: Empowering immigrant communities with privacy, dignity, and access.**
