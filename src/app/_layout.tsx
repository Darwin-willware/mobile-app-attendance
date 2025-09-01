import { Toasts } from '@backpackapp-io/react-native-toast';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from '../context/userContext';
import { isUserLoggedIn } from '../services/authService';

export default function RootLayout() {
  const [isAuthChecked, setAuthChecked] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const guard = async () => {
      const loggedIn = await isUserLoggedIn();
      setAuthChecked(true);

      const currentSegment = segments[0]?.toString();
      const isPublicRoute = !currentSegment || currentSegment === 'index';

      if (!loggedIn && !isPublicRoute) {
        router.replace('/');
      } else if (loggedIn && isPublicRoute) {
        router.replace('/main');
      }
    };

    guard();
  }, [segments]);

  if (!isAuthChecked) return null;

  return (
    <UserProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="main" />
          </Stack>
          <Toasts />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});