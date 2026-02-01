// tests/[testId]/index.jsx
import { Stack } from 'expo-router';

export default function TestIdLayout() {
  return (
    <Stack>
      <Stack.Screen name="testpaper" options={{ title: 'Test Paper' }} />
    </Stack>
  );
}
