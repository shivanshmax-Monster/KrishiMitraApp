# 🌾 KrishiMitra (Agricultural Assistant)

![App Header](https://via.placeholder.com/1200x400.png?text=KrishiMitra+App+-+Empowering+Farmers)

**KrishiMitra** is a comprehensive, multi-lingual agricultural assistant designed to empower farmers with modern technology, market access, and AI-driven crop diagnostics. Built with React Native and Expo, it features real-time Firebase backend integration.

## 🚀 Quick Links

- [📥 **Download Android APK**](https://github.com/shivanshmax-Monster/KrishiMitraApp/raw/main/KrishiMitraApp.apk) - *Install the app directly on your Android phone!*
- [💻 **View Source Code**](https://github.com/shivanshmax-Monster/KrishiMitraApp) - *Explore the full React Native codebase.*

---

## ✨ Key Features

*   **🌱 AI Crop Health Scanner (Gemini Vision API):** Farmers can snap a photo of a diseased plant leaf, and the AI will instantly diagnose the issue and suggest actionable remedies.
*   **🛒 Farmer-to-Consumer Marketplace:** A C2C marketplace where farmers can list their crops for sale directly to buyers.
*   **🛡️ Dedicated Admin Portal:** Admins can manage users, oversee marketplace listings, and ensure platform safety.
*   **🌍 Multi-lingual Support:** Fully supports English and Hindi translations with an easy in-app toggle, making it accessible to regional farmers.
*   **🌤️ Live Weather Integrations:** Localized weather updates to help farmers plan their agricultural activities.
*   **🔐 Secure Authentication:** Full Firebase Authentication with Role-Based Access Control (Admin vs. Farmer roles).

## 🛠️ Tech Stack

*   **Frontend:** React Native, Expo, Expo Router
*   **Backend & Database:** Firebase Auth, Firestore
*   **AI Integration:** Google Gemini 1.5 Flash Vision API
*   **Internationalization:** `react-i18next`

---

## 📂 Project Structure

```
KrishiMitraApp/
├── app/                  # Main Expo Router screens
│   ├── (auth)/           # Authentication screens (Login, Signup)
│   ├── (tabs)/           # Main navigation tabs (Home, Profile, etc.)
│   ├── services/         # App features (Marketplace, Crop Detection)
│   └── admin.tsx         # Admin dashboard screen
├── src/
│   ├── context/          # React Context providers (AuthContext)
│   ├── firebaseConfig.js # Firebase initialization & config
│   └── i18n.ts           # Translation configuration (English & Hindi)
├── assets/               # Images, fonts, and icons
└── eas.json              # Expo Application Services build configuration
```

---

## ⚙️ Running Locally

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Git](https://git-scm.com/)
- Expo CLI (`npm install -g expo-cli`)

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/shivanshmax-Monster/KrishiMitraApp.git
cd KrishiMitraApp
npm install
```

### 3. Environment Variables
For security reasons, API keys are not included in this repository. You must create a `.env` file in the root of the project to enable the AI features.

Create a file named `.env` and add your Google Gemini API Key:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Application
Start the Expo development server:
```bash
npm run dev
```
You can now open the app on an Android Emulator, iOS Simulator, or a physical device using the **Expo Go** app.

---

## 🏗️ Building for Production (Android APK)

This project uses EAS (Expo Application Services) to generate production builds.
To build a standalone `.apk` for Android:
```bash
npx eas-cli build -p android --profile preview
```

---
*Developed as a Capstone Internship Project for Mobile App Development.*
