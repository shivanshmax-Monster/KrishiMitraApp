import { Alert } from 'react-native';

// Stubbing notifications because expo-notifications SDK 53+ crashes in Expo Go
export async function requestNotificationPermissions() {
  return true;
}

export async function scheduleWeatherAlert(title: string, body: string) {
  Alert.alert(title || "Weather Alert! ⛈️", body);
}

export async function scheduleCropAlert(cropCondition: string) {
  Alert.alert("Crop Scan Complete 🌱", `Your crop scan results are in: ${cropCondition}. Tap to view details.`);
}
