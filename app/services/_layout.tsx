import { Stack } from 'expo-router';

export default function ServicesLayout() {
  return (
    <Stack>
      <Stack.Screen name="weather" options={{ title: 'Weather Updates', headerBackTitle: 'Home' }} />
      <Stack.Screen name="marketplace/index" options={{ title: 'Marketplace', headerBackTitle: 'Home' }} />
      <Stack.Screen name="marketplace/add" options={{ title: 'Add Item', presentation: 'modal' }} />
      <Stack.Screen name="crop-detection" options={{ title: 'Crop Health', headerBackTitle: 'Home' }} />
    </Stack>
  );
}
