import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to KrishiMitra",
      "weather": "Weather Updates",
      "marketplace": "Marketplace",
      "crop_detection": "Crop Health Detection",
      "home": "Home",
      "profile": "Profile",
      "login": "Sign In",
      "signup": "Create Account",
      "email": "Email",
      "password": "Password",
      "name": "Full Name",
      "admin_panel": "Admin Panel",
    }
  },
  hi: {
    translation: {
      "welcome": "कृषिमित्र में आपका स्वागत है",
      "weather": "मौसम अपडेट",
      "marketplace": "बाज़ार (Marketplace)",
      "crop_detection": "फसल स्वास्थ्य पहचान",
      "home": "होम",
      "profile": "प्रोफ़ाइल",
      "login": "साइन इन करें",
      "signup": "खाता बनाएं",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "name": "पूरा नाम",
      "admin_panel": "एडमिन पैनल",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
