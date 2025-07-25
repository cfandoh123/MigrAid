# MigrAid

MigrAid is an AI-powered, privacy-first resource navigator designed to help immigrants, refugees, and undocumented individuals access critical legal, healthcare, food, and shelter resources. The app is built with a deep equity focus, prioritizing multilingual support, anonymity, and community-driven reporting.

---

## 🌍 Project Overview

**MigrAid** addresses systemic barriers faced by immigrants, including language gaps, fear of authorities, lack of centralized information, and digital exclusion. The app empowers users to find and report resources safely, with a simple, icon-driven interface and robust privacy features.

---

## ✨ Features

- **Multilingual Onboarding**: Supports English, French, Hausa, and Akan (more languages can be added easily).
- **Anonymous Mode**: Users can browse and report without providing personal information.
- **Resource Navigation**: Find clinics, legal aid, food support, and shelters by category or proximity.
- **ICE Activity Reporting**: Community-sourced, anonymous reporting of ICE activity.
- **Advocate Dashboard**: For community advocates to manage resources and review reports.
- **Voice Interface (Planned)**: Navigation and reporting via voice commands for low-literacy users.
- **Offline Resource Download (Planned)**: Access resources without internet connectivity.
- **End-to-End Encryption (Planned)**: Protect user data and reports.
- **Blockchain Proof-of-Help (Planned)**: Reward system for community contributions (future).

---

## 🏗️ Technical Architecture

- **Frontend**: Android app using Kotlin and Jetpack Compose.
- **Navigation**: Jetpack Navigation Compose.
- **Mock Data**: Resources and ICE reports are currently hardcoded for demo/testing.
- **Localization**: All UI strings are in `strings.xml` with translations for supported languages.
- **Theming**: Material 3, color-blind friendly, accessible fonts.

---

## 🚀 Getting Started

### Prerequisites
- Android Studio (Giraffe or newer recommended)
- JDK 11+
- Android SDK (API 24+)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/cfandoh123/MigrAid.git
   cd MigrAid
   ```
2. **Open in Android Studio**
3. **Build the project:**
   ```bash
   ./gradlew build
   ```
4. **Run on an emulator or device:**
   ```bash
   ./gradlew installDebug
   ```

---

## 📱 Usage

- **Onboarding**: Select your language and choose anonymous mode if desired.
- **Home Screen**: Browse resources by category or see all available resources.
- **Resource Detail**: View details, address, and verification status for each resource.
- **ICE Report**: Submit or view community reports of ICE activity.
- **Advocate Dashboard**: (Stub) For community advocates to manage resources and announcements.

---

## 🧑‍💻 Contributing

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

**Please follow accessibility and privacy best practices!**

---

## 🛠️ Areas for Improvement

- **Backend Integration**: Connect to a real backend (Firebase, MongoDB, or custom API) for live resource and report data.
- **Voice Interface**: Integrate Google Speech-to-Text or OpenAI Whisper for voice navigation and reporting.
- **Offline Support**: Allow users to download and access resources without internet.
- **End-to-End Encryption**: Implement encryption for all user data and reports (e.g., Signal Protocol).
- **Blockchain Rewards**: Add optional blockchain-based proof-of-help and rewards for community contributions.
- **Accessibility**: Expand support for screen readers, font scaling, and color-blind modes.
- **More Languages**: Add additional translations (Spanish, Arabic, Haitian Creole, etc.).
- **Community Verification**: Build a system for community upvotes and advocate verification of resources.
- **Admin/Advocate Tools**: Expand dashboard for NGOs and advocates to manage resources and review reports.
- **Testing**: Add unit and UI tests for all major features.
- **UI Polish**: Refine UI/UX for even greater clarity and ease of use.

---

## 📣 Contact & Community

- **Project Owners**: Calvin Andoh, Kofi Osei, Caleb Kwakye, Ebenezer Tseh
- **Community**: Ghana Boys 


---

**MigrAid: Empowering immigrant communities with privacy, dignity, and access.** 
