import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is running in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
}

export async function scheduleWeatherAlert(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "Weather Alert! ⛈️",
      body: body,
      data: { data: 'goes here' },
    },
    trigger: null, // null means trigger immediately
  });
}

export async function scheduleCropAlert(cropCondition: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Crop Scan Complete 🌱",
      body: `Your crop scan results are in: ${cropCondition}. Tap to view details.`,
    },
    trigger: null, // trigger immediately
  });
}
