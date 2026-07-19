import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to KrishiMitra",
      "weather": "Weather Updates",
      "marketplace": "Marketplace",
      "crop_detection": "Crop Detection with its Health",
      "home": "Home",
      "profile": "Profile",
      "login": "Sign In",
      "signup": "Create Account",
      "email": "Email",
      "password": "Password",
      "name": "Full Name",
      "admin_panel": "Admin Panel",
      "cd_subtitle": "Upload a photo of your plant leaf to detect diseases or nutrient deficiencies instantly.",
      "cd_no_image": "No image selected",
      "cd_take_photo": "Take Photo",
      "cd_gallery": "Gallery",
      "cd_analyze": "Analyze Crop",
      "cd_analyzing": "AI is analyzing your crop...",
      "cd_detected": "Detected Crop:",
      "cd_confidence": "Confidence Score:",
      "cd_action": "Recommended Action:",
      "cd_scan_another": "Scan Another Plant"
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
      "cd_subtitle": "बीमारियों या पोषक तत्वों की कमी का तुरंत पता लगाने के लिए अपने पौधे की पत्ती की एक तस्वीर अपलोड करें।",
      "cd_no_image": "कोई छवि चयनित नहीं",
      "cd_take_photo": "फोटो लें",
      "cd_gallery": "गैलरी",
      "cd_analyze": "फसल का विश्लेषण करें",
      "cd_analyzing": "एआई आपकी फसल का विश्लेषण कर रहा है...",
      "cd_detected": "पहचानी गई फसल:",
      "cd_confidence": "विश्वास स्कोर:",
      "cd_action": "अनुशंसित कार्रवाई:",
      "cd_scan_another": "दूसरे पौधे को स्कैन करें"
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
