import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Advanced ekranını açıkça Stack'e ekliyoruz */}
      <Stack.Screen 
        name="advanced" 
        options={{ 
          animation: 'fade',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="result" 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
  );
}
